import { useCountdownData } from '../data/CountdownDataContext'
import type { SlotComponentProps } from '../theming/types'

export function EventTitle({
  id,
  className,
  style,
  props,
}: SlotComponentProps<'event-title'>) {
  const data = useCountdownData()
  const source = props?.source ?? 'title'
  const text = source === 'subtitle' ? data.subtitle : data.title
  if (!text) return null
  return (
    <h1
      data-slot="event-title"
      data-slot-id={id}
      className={className}
      style={style}
    >
      {text}
    </h1>
  )
}
