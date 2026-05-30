import { createContext, useContext } from 'react'

import type { AssetDecl } from './types'

/**
 * Theme-scoped asset manifest exposed to slot components so they can
 * resolve `asset:KEY` URIs (see `resolveAssetUrl`). Provided by
 * `CountdownThemeProvider`. Null when no theme provider is mounted.
 */
export const ThemeAssetsContext = createContext<Record<
  string,
  AssetDecl
> | null>(null)

export function useThemeAssets(): Record<string, AssetDecl> | null {
  return useContext(ThemeAssetsContext)
}
