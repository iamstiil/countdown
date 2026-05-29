import { useEffect, useRef } from 'react'

import {
  useContinuousProgress,
  useCountdownData,
  useCountdownEvents,
} from '../data/CountdownDataContext'
import type { SlotComponentProps } from '../theming/types'

/**
 * Hook: drive the visual value of a progress slot at rAF rate, applying an
 * optional motion modulation. Writes to refs/DOM imperatively so we don't
 * re-render per frame.
 */
function useProgressMotion({
  direction,
  motion,
  breatheAmplitude,
  breathePeriodMs,
  onValue,
}: {
  direction: 'elapsed' | 'remaining'
  motion: 'linear' | 'breathe' | 'pulse'
  breatheAmplitude: number
  breathePeriodMs: number
  onValue: (value: number) => void
}) {
  const { subscribe } = useContinuousProgress()
  const onValueRef = useRef(onValue)
  onValueRef.current = onValue

  useEffect(() => {
    return subscribe((raw) => {
      const base = direction === 'elapsed' ? raw : 1 - raw
      let value = base
      if (motion === 'breathe') {
        const t = performance.now()
        const sine = Math.sin((t / breathePeriodMs) * Math.PI * 2)
        // Modulate up/down without ever overshooting [0,1].
        const headroom = Math.min(base, 1 - base, breatheAmplitude)
        value = base + sine * headroom
      }
      onValueRef.current(Math.min(1, Math.max(0, value)))
    })
  }, [subscribe, direction, motion, breatheAmplitude, breathePeriodMs])
}

/** Adds a one-frame `data-just-changed` pulse on second-tick events. */
function usePulseAttr(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const { subscribe } = useCountdownEvents()
  useEffect(() => {
    if (!enabled) return
    return subscribe('secondTick', () => {
      const el = ref.current
      if (!el) return
      el.setAttribute('data-just-changed', 'tick')
      const r1 = requestAnimationFrame(() => {
        requestAnimationFrame(() => el.removeAttribute('data-just-changed'))
      })
      return () => cancelAnimationFrame(r1)
    })
  }, [ref, enabled, subscribe])
}

export function Progress({
  id,
  className,
  style,
  props,
}: SlotComponentProps<'progress'>) {
  const { elapsedFraction } = useCountdownData()
  const kind = props?.kind ?? 'bar'
  const direction = props?.direction ?? 'elapsed'
  const motion = props?.motion ?? 'linear'
  const breatheAmplitude = props?.breatheAmplitude ?? 0.015
  const breathePeriodMs = props?.breathePeriodMs ?? 9000

  // Initial / SSR-friendly second-granular value for aria + first paint.
  const value = direction === 'elapsed' ? elapsedFraction : 1 - elapsedFraction
  const pct = Math.round(value * 100)

  const rootRef = useRef<HTMLElement | null>(null)
  const fillRef = useRef<HTMLElement | null>(null)
  const circleRef = useRef<SVGCircleElement | null>(null)

  useProgressMotion({
    direction,
    motion,
    breatheAmplitude,
    breathePeriodMs,
    onValue: (v) => {
      if (rootRef.current) {
        rootRef.current.style.setProperty('--ct-progress-value', v.toFixed(4))
      }
      if (fillRef.current) {
        fillRef.current.style.width = `${(v * 100).toFixed(3)}%`
      }
      if (circleRef.current) {
        const radius = 45
        const circumference = 2 * Math.PI * radius
        circleRef.current.style.strokeDashoffset = String(
          circumference * (1 - v),
        )
      }
      if (rootRef.current) {
        rootRef.current.setAttribute(
          'aria-valuenow',
          String(Math.round(v * 100)),
        )
      }
    },
  })

  usePulseAttr(rootRef, motion === 'pulse')

  if (kind === 'ring') {
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const offset = circumference * (1 - value)
    return (
      <svg
        ref={(el) => {
          rootRef.current = el as unknown as HTMLElement
        }}
        data-slot="progress"
        data-slot-id={id}
        data-kind="ring"
        data-motion={motion}
        viewBox="0 0 100 100"
        className={className}
        style={style}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--ct-color-muted, currentColor)"
          strokeOpacity="0.2"
          strokeWidth="6"
        />
        <circle
          ref={circleRef}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--ct-color-accent, currentColor)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
      </svg>
    )
  }

  if (kind === 'segments') {
    const segments = 12
    const lit = Math.round(value * segments)
    return (
      <div
        ref={(el) => {
          rootRef.current = el
        }}
        data-slot="progress"
        data-slot-id={id}
        data-kind="segments"
        data-motion={motion}
        className={className}
        style={style}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: segments }, (_, i) => (
          <span key={i} data-on={i < lit ? 'true' : 'false'} />
        ))}
      </div>
    )
  }

  return (
    <div
      ref={(el) => {
        rootRef.current = el
      }}
      data-slot="progress"
      data-slot-id={id}
      data-kind="bar"
      data-motion={motion}
      className={className}
      style={style}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span
        ref={(el) => {
          fillRef.current = el
        }}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
