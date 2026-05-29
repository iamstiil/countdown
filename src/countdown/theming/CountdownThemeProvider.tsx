import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

import { useContinuousProgress } from '../data/CountdownDataContext'

import { buildTokenCSS } from './buildTokenCSS'
import { SlotRenderer } from './Renderer'
import type { CountdownTheme } from './types'

export interface CountdownThemeProviderProps {
  theme: CountdownTheme
}

/**
 * Roots a single countdown theme. Tokens are scoped to [data-ct-theme="id"]
 * so they cannot leak into the surrounding (landing page) design system.
 *
 * Rendered into document.body via portal so no ancestor layout/transform
 * can constrain its full-viewport coverage.
 */
export function CountdownThemeProvider({ theme }: CountdownThemeProviderProps) {
  const tokenCSS = useMemo(() => buildTokenCSS(theme), [theme])
  const animationCSS = useMemo(
    () => (theme.animations ? Object.values(theme.animations).join('\n') : ''),
    [theme],
  )

  const rootRef = useRef<HTMLDivElement | null>(null)
  const { subscribe } = useContinuousProgress()

  // Drive the continuous --ct-progress CSS variable on the theme root.
  // Themes can read it via `var(--ct-progress)` for smooth motion that
  // doesn't depend on React's 1Hz tick.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    return subscribe((value) => {
      el.style.setProperty('--ct-progress', value.toFixed(4))
    })
  }, [subscribe])

  const tree = (
    <div ref={rootRef} data-ct-theme={theme.id} className="ct-root">
      <style>{tokenCSS}</style>
      {animationCSS && <style>{animationCSS}</style>}
      <SlotRenderer node={theme.layout} />
    </div>
  )

  if (typeof document === 'undefined') return tree
  return createPortal(tree, document.body)
}
