import type { ReactNode } from 'react'

import type { SlotComponentProps } from '../theming/types'

interface ChromeExtra {
  children?: ReactNode
}

/**
 * Container slot for the chrome layer. Visually identical to `group` but
 * stamped with `data-slot="chrome"` so themes and CSS can tell it apart
 * from in-flow content. Positioning against the unpadded viewport is
 * handled by the `.ct-chrome` wrapper in `countdown.css`.
 */
export function Chrome({
  id,
  className,
  style,
  children,
}: SlotComponentProps<'chrome'> & ChromeExtra) {
  return (
    <div
      data-slot="chrome"
      data-slot-id={id}
      className={className}
      style={style}
    >
      {children}
    </div>
  )
}
