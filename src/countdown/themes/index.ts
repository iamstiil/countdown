import type { CountdownTheme } from '../theming/types'

import { auroraTheme } from './aurora'
import { minimalStackTheme } from './minimal-stack'
import { monolithTheme } from './monolith'
import { neonGridTheme } from './neon-grid'

export const themeRegistry = {
  'neon-grid': neonGridTheme,
  'minimal-stack': minimalStackTheme,
  aurora: auroraTheme,
  monolith: monolithTheme,
} as const satisfies Record<string, CountdownTheme>

export type ThemeId = keyof typeof themeRegistry

/** Visual preview swatch used by the landing page picker. */
export const themeSwatch: Record<ThemeId, string> = {
  'neon-grid':
    'radial-gradient(ellipse at 50% 45%, #67e8f955 0%, transparent 60%), #050813',
  'minimal-stack': 'linear-gradient(180deg, #faf8f4 0%, #ede7dd 100%)',
  aurora:
    'radial-gradient(at 18% 18%, #a78bfa88 0, transparent 55%), radial-gradient(at 82% 28%, #22d3ee66 0, transparent 55%), radial-gradient(at 50% 92%, #f472b666 0, transparent 55%), #0b0c20',
  monolith:
    'radial-gradient(ellipse 80% 50% at 50% 100%, #f5f5f414 0%, transparent 70%), #0a0a0a',
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
