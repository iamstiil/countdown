import type { CountdownTheme } from '../theming/types'

import { minimalStackTheme } from './minimal-stack'
import { neonGridTheme } from './neon-grid'

export const themeRegistry = {
  'neon-grid': neonGridTheme,
  'minimal-stack': minimalStackTheme,
} as const satisfies Record<string, CountdownTheme>

export type ThemeId = keyof typeof themeRegistry

export const themeList: ReadonlyArray<{ id: ThemeId; name: string }> =
  Object.entries(themeRegistry).map(([id, t]) => ({
    id: id as ThemeId,
    name: t.name,
  }))

export const DEFAULT_THEME_ID: ThemeId = 'neon-grid'
