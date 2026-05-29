import { useMemo } from 'react'

import { buildTokenCSS } from './buildTokenCSS'
import { SlotRenderer } from './Renderer'
import type { CountdownTheme } from './types'

export interface CountdownThemeProviderProps {
  theme: CountdownTheme
}

/**
 * Roots a single countdown theme. Tokens are scoped to [data-ct-theme="id"]
 * so they cannot leak into the surrounding (landing page) design system.
 */
export function CountdownThemeProvider({ theme }: CountdownThemeProviderProps) {
  const tokenCSS = useMemo(() => buildTokenCSS(theme), [theme])
  const animationCSS = useMemo(
    () => (theme.animations ? Object.values(theme.animations).join('\n') : ''),
    [theme],
  )

  return (
    <div data-ct-theme={theme.id} className="ct-root">
      <style>{tokenCSS}</style>
      {animationCSS && <style>{animationCSS}</style>}
      <SlotRenderer node={theme.layout} />
    </div>
  )
}
