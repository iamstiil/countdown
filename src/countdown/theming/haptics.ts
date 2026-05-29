import type { HapticPattern } from './types'

/**
 * Triggers a vibration pattern via `navigator.vibrate`. Silently no-ops
 * when the API is unavailable (desktop, iOS Safari, or browsers that
 * removed the API). Honors `prefers-reduced-motion` unless the caller
 * explicitly opts out.
 */
export interface HapticOptions {
  enabled: () => boolean
  reducedMotion: () => boolean
  ignoreReducedMotion?: boolean
}

export function vibrate(pattern: HapticPattern, opts: HapticOptions): boolean {
  if (!opts.enabled()) return false
  if (opts.reducedMotion() && !opts.ignoreReducedMotion) return false
  if (typeof navigator === 'undefined') return false
  const vib = (
    navigator as unknown as {
      vibrate?: (p: number | number[]) => boolean
    }
  ).vibrate
  if (typeof vib !== 'function') return false
  try {
    return vib.call(navigator, pattern as number | number[])
  } catch {
    return false
  }
}
