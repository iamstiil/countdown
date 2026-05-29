import { useCountdownData } from '../data/CountdownDataContext'
import type { SlotComponentProps } from '../theming/types'

export function Progress({
  id,
  className,
  style,
  props,
}: SlotComponentProps<'progress'>) {
  const { elapsedFraction } = useCountdownData()
  const kind = props?.kind ?? 'bar'
  const direction = props?.direction ?? 'elapsed'
  const value = direction === 'elapsed' ? elapsedFraction : 1 - elapsedFraction
  const pct = Math.round(value * 100)

  if (kind === 'ring') {
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const offset = circumference * (1 - value)
    return (
      <svg
        data-slot="progress"
        data-slot-id={id}
        data-kind="ring"
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
        data-slot="progress"
        data-slot-id={id}
        data-kind="segments"
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
      data-slot="progress"
      data-slot-id={id}
      data-kind="bar"
      className={className}
      style={style}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${pct}%` }} />
    </div>
  )
}
