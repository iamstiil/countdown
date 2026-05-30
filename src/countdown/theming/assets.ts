import type { AssetDecl } from './types'

/**
 * Normalize an `AssetDecl` (which may be a bare string shorthand) into
 * a full record. Returns `null` for `undefined` so callers can pass
 * through optional lookups.
 */
export function normalizeAsset(decl: AssetDecl | undefined): {
  url: string
  as?: 'image' | 'audio' | 'fetch'
  preload: boolean
  crossOrigin?: 'anonymous' | 'use-credentials'
} | null {
  if (!decl) return null
  if (typeof decl === 'string') return { url: decl, preload: false }
  return {
    url: decl.url,
    as: decl.as,
    preload: decl.preload === true,
    crossOrigin: decl.crossOrigin,
  }
}

/**
 * Resolve a theme-author-facing URL. The `asset:KEY` URI scheme is
 * looked up in the theme's `assets` manifest; everything else passes
 * through unchanged. Unknown keys log a one-time warning and return
 * the original string so the browser surfaces a 404 (rather than
 * silently rendering nothing).
 */
export function resolveAssetUrl(
  src: string | undefined,
  assets: Record<string, AssetDecl> | undefined,
): string | undefined {
  if (!src) return src
  if (!src.startsWith('asset:')) return src
  const key = src.slice('asset:'.length)
  const decl = assets?.[key]
  const normalized = normalizeAsset(decl)
  if (!normalized) {
    warnMissingAsset(key)
    return src
  }
  return normalized.url
}

const warnedKeys = new Set<string>()
function warnMissingAsset(key: string) {
  if (warnedKeys.has(key)) return
  warnedKeys.add(key)
  console.warn(
    `[countdown] asset key "${key}" not found in theme.assets manifest`,
  )
}
