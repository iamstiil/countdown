import type { CSSProperties } from 'react'

import { themeRegistry, themeSwatch } from '../themes'
import type { ThemeId } from '../themes'

import styles from './ThemePreview.module.css'

export type PreviewVariant = 'centered' | 'bottom-left' | 'card'

const PREVIEW_VARIANT: Record<ThemeId, PreviewVariant> = {
  'neon-grid': 'centered',
  'minimal-stack': 'bottom-left',
  aurora: 'card',
}

export interface ThemePreviewProps {
  themeId: ThemeId
  className?: string
  ariaLabel?: string
}

/**
 * Miniaturised skeleton preview of a countdown theme. Uses the theme's
 * palette tokens + background swatch so visual differences read at a glance
 * without mounting the full theme renderer.
 */
export function ThemePreview({
  themeId,
  className,
  ariaLabel,
}: ThemePreviewProps) {
  const theme = themeRegistry[themeId]
  const colors = theme.tokens.base.color ?? {}
  const variant = PREVIEW_VARIANT[themeId]

  const style = {
    '--preview-bg': themeSwatch[themeId],
    '--preview-fg': colors.fg ?? '#ffffff',
    '--preview-accent': colors.accent ?? '#ffffff',
    '--preview-muted': colors.muted ?? '#999999',
  } as CSSProperties

  return (
    <div
      className={[styles.preview, className].filter(Boolean).join(' ')}
      data-variant={variant}
      style={style}
      role="img"
      aria-label={ariaLabel ?? `${theme.name} preview`}
    >
      <div className={styles.stage}>
        {variant === 'card' && <div className={styles.card} />}
        <div className={styles.title} />
        <div className={styles.timer}>
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className={styles.progress} />
      </div>
    </div>
  )
}
