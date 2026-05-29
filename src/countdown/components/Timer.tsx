import { useCountdownData } from '../data/CountdownDataContext'
import type { SlotComponentProps } from '../theming/types'

const pad = (n: number) => n.toString().padStart(2, '0')

type Unit = 'days' | 'hours' | 'minutes' | 'seconds'

const FORMAT_UNITS: Record<
  NonNullable<Required<{ format: 'dhms' | 'hms' | 'ms' }>['format']>,
  Unit[]
> = {
  dhms: ['days', 'hours', 'minutes', 'seconds'],
  hms: ['hours', 'minutes', 'seconds'],
  ms: ['minutes', 'seconds'],
}

export function Timer({
  id,
  className,
  style,
  props,
}: SlotComponentProps<'timer'>) {
  const { remaining } = useCountdownData()
  const padZeros = props?.padZeros ?? true

  // Single-unit mode: render just the numeric value (theme can place units
  // freely around the layout tree).
  if (props?.unit) {
    const raw = remaining[props.unit]
    return (
      <span
        data-slot="timer"
        data-slot-id={id}
        data-unit={props.unit}
        className={className}
        style={style}
      >
        {padZeros && props.unit !== 'days' ? pad(raw) : raw}
      </span>
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
      {units.map((unit) => (
        <span key={unit} data-unit={unit}>
          {padZeros && unit !== 'days' ? pad(remaining[unit]) : remaining[unit]}
        </span>
      ))}
    </div>
  )
}
