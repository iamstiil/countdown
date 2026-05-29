import type { SlotComponentProps } from '../theming/types'

export function TimerSeparator({
  id,
  className,
  style,
  props,
}: SlotComponentProps<'timer-separator'>) {
  return (
    <span
      data-slot="timer-separator"
      data-slot-id={id}
      className={className}
      style={style}
      aria-hidden="true"
    >
      {props?.char ?? ':'}
    </span>
  )
}
