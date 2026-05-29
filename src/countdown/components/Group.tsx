import type { ReactNode } from 'react'

import type { SlotComponentProps } from '../theming/types'

interface GroupExtra {
  children?: ReactNode
}

export function Group({
  id,
  className,
  style,
  children,
}: SlotComponentProps<'group'> & GroupExtra) {
  return (
    <div
      data-slot="group"
      data-slot-id={id}
      className={className}
      style={style}
    >
      {children}
    </div>
  )
}
