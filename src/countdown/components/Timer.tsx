import { useEffect, useRef } from 'react'

import { useCountdownData } from '../data/CountdownDataContext'
import type { SlotBehaviorMap, SlotComponentProps } from '../theming/types'

const pad = (n: number) => n.toString().padStart(2, '0')

type Unit = 'days' | 'hours' | 'minutes' | 'seconds'

const FORMAT_UNITS: Record<
  NonNullable<NonNullable<SlotBehaviorMap['timer']>['format']>,
  Unit[]
> = {
  dhms: ['days', 'hours', 'minutes', 'seconds'],
  hms: ['hours', 'minutes', 'seconds'],
  ms: ['minutes', 'seconds'],
}

const DEFAULT_LABELS: Record<Unit, string> = {
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
}

const PLACE_NAMES = ['ones', 'tens', 'hundreds', 'thousands'] as const

/**
 * Stamps `data-just-changed="<unit>"` on a [data-value] element for a single
 * animation frame whenever its rendered value changes. Themes use this as a
 * CSS hook for per-tick reactions (e.g. ink-bleed pulse on the seconds digit).
 */
function useJustChangedAttr(
  ref: React.RefObject<HTMLElement | null>,
  unit: Unit,
  value: number,
) {
  const prevRef = useRef<number>(value)
  useEffect(() => {
    if (prevRef.current === value) return
    prevRef.current = value
    const el = ref.current
    if (!el) return
    el.setAttribute('data-just-changed', unit)
    // Two rAFs: set, then clear on the next frame so a CSS animation keyed
    // on the attribute can re-trigger reliably even for back-to-back ticks.
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        el.removeAttribute('data-just-changed')
      })
      ;(el as unknown as { __raf?: number }).__raf = raf2
    })
    return () => {
      cancelAnimationFrame(raf1)
      const raf2 = (el as unknown as { __raf?: number }).__raf
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [ref, unit, value])
}

/**
 * Stamps `data-changing="true"` on each child `[data-digit]` whose character
 * differs from the previous render, for one animation frame. Themes use this
 * as the CSS trigger for split-flap / odometer / flip / fade transitions.
 */
function useChangingDigitsAttr(
  containerRef: React.RefObject<HTMLElement | null>,
  display: string,
  enabled: boolean,
) {
  const prevRef = useRef<string>(display)
  useEffect(() => {
    if (!enabled) return
    const prev = prevRef.current
    prevRef.current = display
    if (prev === display) return
    const container = containerRef.current
    if (!container) return

    const digits = container.querySelectorAll<HTMLElement>('[data-digit]')
    const changed: HTMLElement[] = []
    digits.forEach((el) => {
      const idx = Number(el.dataset.index ?? '-1')
      // index is from the right; align previous string the same way.
      const prevChar = prev[prev.length - 1 - idx]
      const nextChar = display[display.length - 1 - idx]
      if (prevChar !== nextChar) {
        el.setAttribute('data-changing', 'true')
        // Expose the outgoing character so themes can render split-flap or
        // odometer transitions purely in CSS via attr().
        if (prevChar !== undefined) {
          el.setAttribute('data-prev', prevChar)
        }
        changed.push(el)
      }
    })
    if (changed.length === 0) return

    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        for (const el of changed) {
          el.removeAttribute('data-changing')
          el.removeAttribute('data-prev')
        }
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [containerRef, display, enabled])
}

interface DigitsProps {
  display: string
}

/**
 * Renders each character of `display` as its own `[data-digit]` span, with
 * positional data attributes so themes can target individual digits.
 *
 * `data-index` is counted from the right (0 = ones) so per-place styling
 * stays stable as the value's character width grows (e.g. days going from
 * 1 to 2 to 3 digits long).
 */
function Digits({ display }: DigitsProps) {
  const chars = Array.from(display)
  const total = chars.length
  return (
    <>
      {chars.map((char, i) => {
        const index = total - 1 - i
        const place = PLACE_NAMES[index] ?? `p${index}`
        return (
          <span
            key={index}
            data-slot="digit"
            data-digit
            data-index={index}
            data-place={place}
            data-char={char}
          >
            {char}
          </span>
        )
      })}
    </>
  )
}

interface UnitBlockProps {
  unit: Unit
  value: number
  display: string
  splitDigits: boolean
  transition: NonNullable<SlotBehaviorMap['timer']>['transition']
}

function UnitBlock({
  unit,
  value,
  display,
  splitDigits,
  transition,
}: UnitBlockProps) {
  const valueRef = useRef<HTMLSpanElement>(null)
  useJustChangedAttr(valueRef, unit, value)
  useChangingDigitsAttr(valueRef, display, splitDigits)
  return (
    <div data-unit-block={unit}>
      <span
        ref={valueRef}
        data-value
        data-unit={unit}
        data-transition={transition}
        aria-label={`${value} ${DEFAULT_LABELS[unit]}`}
      >
        {splitDigits ? <Digits display={display} /> : display}
      </span>
      <span data-label aria-hidden="true">
        {DEFAULT_LABELS[unit]}
      </span>
    </div>
  )
}

export function Timer({
  id,
  className,
  style,
  props,
}: SlotComponentProps<'timer'>) {
  const { remaining } = useCountdownData()
  const padZeros = props?.padZeros ?? true
  const splitDigits = props?.splitDigits ?? false
  const transition = props?.transition ?? 'none'

  // Single-unit mode: render just the numeric value — for themes that need to
  // place each unit independently in the layout tree.
  if (props?.unit) {
    const raw = remaining[props.unit]
    return (
      <SingleUnit
        id={id}
        className={className}
        style={style}
        unit={props.unit}
        value={raw}
        padZeros={padZeros}
        splitDigits={splitDigits}
        transition={transition}
      />
    )
  }

  const format = props?.format ?? 'dhms'
  const units = FORMAT_UNITS[format]

  return (
    <div
      data-slot="timer"
      data-slot-id={id}
      data-split-digits={splitDigits ? 'true' : undefined}
      data-transition={transition}
      className={className}
      style={style}
    >
      {units.map((unit) => {
        const raw = remaining[unit]
        const display = padZeros && unit !== 'days' ? pad(raw) : String(raw)
        return (
          <UnitBlock
            key={unit}
            unit={unit}
            value={raw}
            display={display}
            splitDigits={splitDigits}
            transition={transition}
          />
        )
      })}
    </div>
  )
}

interface SingleUnitProps {
  id: string
  className?: string
  style?: React.CSSProperties
  unit: Unit
  value: number
  padZeros: boolean
  splitDigits: boolean
  transition: NonNullable<SlotBehaviorMap['timer']>['transition']
}

function SingleUnit({
  id,
  className,
  style,
  unit,
  value,
  padZeros,
  splitDigits,
  transition,
}: SingleUnitProps) {
  const ref = useRef<HTMLSpanElement>(null)
  useJustChangedAttr(ref, unit, value)
  const display = padZeros && unit !== 'days' ? pad(value) : String(value)
  useChangingDigitsAttr(ref, display, splitDigits)
  return (
    <span
      ref={ref}
      data-slot="timer"
      data-slot-id={id}
      data-unit={unit}
      data-value
      data-transition={transition}
      className={className}
      style={style}
      aria-label={`${value} ${DEFAULT_LABELS[unit]}`}
    >
      {splitDigits ? <Digits display={display} /> : display}
    </span>
  )
}
