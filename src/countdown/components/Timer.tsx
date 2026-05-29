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
      {units.map((unit) => {
        const raw = remaining[unit]
        const display = padZeros && unit !== 'days' ? pad(raw) : String(raw)
        return (
          <div key={unit} data-unit-block={unit}>
            <span data-value aria-label={`${raw} ${DEFAULT_LABELS[unit]}`}>
              {display}
            </span>
            <span data-label aria-hidden="true">
              {DEFAULT_LABELS[unit]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
