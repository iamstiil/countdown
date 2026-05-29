/**
 * Audio preference store. Persists a single boolean ("audio on/off") in
 * localStorage and notifies subscribers on change. Lives outside React so
 * any non-UI code (e.g. the audio engine) can read/subscribe.
 *
 * Default state: ON. Themes that want a different default should call
 * `setAudioEnabled(false)` from their setup.
 */

const STORAGE_KEY = 'countdown:audio-enabled'

const subscribers = new Set<(enabled: boolean) => void>()

function readStored(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return true
    return raw === '1'
  } catch {
    return true
  }
}

let cached: boolean | null = null

export function isAudioEnabled(): boolean {
  if (cached === null) cached = readStored()
  return cached
}

export function setAudioEnabled(enabled: boolean): void {
  cached = enabled
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0')
    } catch {
      /* storage may be disabled (private mode, quota) — fine, in-memory only */
    }
  }
  for (const fn of subscribers) {
    try {
      fn(enabled)
    } catch (e) {
      console.error('[audio-preference] subscriber threw:', e)
    }
  }
}

export function subscribeAudioEnabled(
  listener: (enabled: boolean) => void,
): () => void {
  subscribers.add(listener)
  return () => {
    subscribers.delete(listener)
  }
}
