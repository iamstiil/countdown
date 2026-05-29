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

interface UnitBlockProps {
  unit: Unit
  value: number
  display: string
}

function UnitBlock({ unit, value, display }: UnitBlockProps) {
  const valueRef = useRef<HTMLSpanElement>(null)
  useJustChangedAttr(valueRef, unit, value)
  return (
    <div data-unit-block={unit}>
      <span
        ref={valueRef}
        data-value
        data-unit={unit}
        aria-label={`${value} ${DEFAULT_LABELS[unit]}`}
      >
        {display}
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
      />
    )
  }

  const format = props?.format ?? 'dhms'
  const units = FORMAT_UNITS[format]

  return (
    <div
      data-slot="timer"
      data-slot-id={id}
      className={className}
      style={style}
    >
      {units.map((unit) => {
        const raw = remaining[unit]
        const display = padZeros && unit !== 'days' ? pad(raw) : String(raw)
        return (
          <UnitBlock key={unit} unit={unit} value={raw} display={display} />
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
}

function SingleUnit({
  id,
  className,
  style,
  unit,
  value,
  padZeros,
}: SingleUnitProps) {
  const ref = useRef<HTMLSpanElement>(null)
  useJustChangedAttr(ref, unit, value)
  const display = padZeros && unit !== 'days' ? pad(value) : String(value)
  return (
    <span
      ref={ref}
      data-slot="timer"
      data-slot-id={id}
      data-unit={unit}
      data-value
      className={className}
      style={style}
    >
      {display}
    </span>
  )
}
