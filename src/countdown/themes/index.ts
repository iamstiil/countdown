import type { CountdownTheme } from '../theming/types'

import { auroraTheme } from './aurora'
import { minimalStackTheme } from './minimal-stack'
import { neonGridTheme } from './neon-grid'

export const themeRegistry = {
  'neon-grid': neonGridTheme,
  'minimal-stack': minimalStackTheme,
  aurora: auroraTheme,
} as const satisfies Record<string, CountdownTheme>

export type ThemeId = keyof typeof themeRegistry

/** Visual preview swatch used by the landing page picker. */
export const themeSwatch: Record<ThemeId, string> = {
  'neon-grid':
    'radial-gradient(ellipse at 50% 50%, #7dd3fc55 0%, transparent 60%), #070912',
  'minimal-stack': 'linear-gradient(180deg, #fafaf7 0%, #efeae3 100%)',
  aurora:
    'radial-gradient(at 20% 20%, #a78bfa88 0, transparent 50%), radial-gradient(at 80% 30%, #22d3ee66 0, transparent 50%), radial-gradient(at 50% 90%, #f472b666 0, transparent 50%), #0f1023',
}

export const themeList: ReadonlyArray<{
  id: ThemeId
  name: string
  swatch: string
}> = Object.entries(themeRegistry).map(([id, t]) => ({
  id: id as ThemeId,
  name: t.name,
  swatch: themeSwatch[id as ThemeId],
}))

export const DEFAULT_THEME_ID: ThemeId = 'neon-grid'
