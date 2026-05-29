import type { SlotComponentProps } from '../theming/types'

export function TimerLabel({
  id,
  className,
  style,
  props,
}: SlotComponentProps<'timer-label'>) {
  if (!props) return null
  return (
    <span
      data-slot="timer-label"
      data-slot-id={id}
      data-unit={props.unit}
      className={className}
      style={style}
    >
      {props.text ?? props.unit}
    </span>
  )
}
