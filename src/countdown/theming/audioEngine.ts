import type { CountdownEventName } from '../data/events'

import type { AudioBinding, SoundDecl } from './types'

/**
 * Browser-safe audio engine for the theming system.
 *
 * Design notes:
 * - Browsers require a user gesture before `AudioContext` can produce
 *   sound. We lazy-create the context on the first user gesture (any of
 *   pointerdown/keydown/touchstart) and unlock it via `resume()`. Until
 *   then `play()` is a silent no-op.
 * - Samples are fetched and decoded once per `(theme, name)` pair and
 *   stored as `AudioBuffer`s. A small in-flight map dedupes concurrent
 *   preload requests for the same URL.
 * - Polyphony is enforced by counting active sources per sound; over-cap
 *   triggers drop the play silently rather than queueing.
 * - Throttling is per-binding (event → sound), not per sound, so two
 *   different bindings to the same sample don't share a throttle window.
 */

export interface AudioEngineOptions {
  enabled: () => boolean
  reducedMotion: () => boolean
  audioIgnoresReducedMotion?: boolean
}

export interface AudioEngine {
  /** Preload all declared sounds; safe to call multiple times. */
  preload: (sounds: Record<string, SoundDecl>) => Promise<void>
  /** Play a named sound. No-op if disabled, locked, or sound missing. */
  play: (name: string) => void
  /**
   * Play through an event binding (respects per-binding throttle).
   * Returns true if the play was actually dispatched.
   */
  playBinding: (event: CountdownEventName, binding: AudioBinding) => boolean
  /** Release buffers and the underlying AudioContext. */
  dispose: () => void
}

type Ctor = typeof AudioContext

function getAudioContextCtor(): Ctor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    AudioContext?: Ctor
    webkitAudioContext?: Ctor
  }
  return w.AudioContext ?? w.webkitAudioContext ?? null
}

export function createAudioEngine(opts: AudioEngineOptions): AudioEngine {
  const Ctor = getAudioContextCtor()
  let ctx: AudioContext | null = null
  const buffers = new Map<string, AudioBuffer>()
  const inFlight = new Map<string, Promise<AudioBuffer | null>>()
  const decls = new Map<string, SoundDecl>()
  const active = new Map<string, number>()
  const lastFire = new Map<string, number>()
  let disposed = false

  const ensureContext = (): AudioContext | null => {
    if (disposed) return null
    if (ctx) return ctx
    if (!Ctor) return null
    try {
      ctx = new Ctor()
    } catch {
      ctx = null
    }
    return ctx
  }

  const unlockOnGesture = () => {
    if (typeof window === 'undefined') return () => {}
    const fire = () => {
      const c = ensureContext()
      if (c && c.state === 'suspended') {
        c.resume().catch(() => {})
      }
    }
    const opts = { passive: true, once: true } as AddEventListenerOptions
    window.addEventListener('pointerdown', fire, opts)
    window.addEventListener('keydown', fire, opts)
    window.addEventListener('touchstart', fire, opts)
    return () => {
      window.removeEventListener('pointerdown', fire)
      window.removeEventListener('keydown', fire)
      window.removeEventListener('touchstart', fire)
    }
  }

  const detach = unlockOnGesture()

  const loadOne = async (name: string, decl: SoundDecl): Promise<void> => {
    const c = ensureContext()
    if (!c) return
    if (buffers.has(name)) return
    const existing = inFlight.get(name)
    if (existing) {
      await existing
      return
    }
    const p = (async () => {
      try {
        const res = await fetch(decl.src)
        if (!res.ok) return null
        const ab = await res.arrayBuffer()
        return await c.decodeAudioData(ab)
      } catch {
        return null
      }
    })()
    inFlight.set(name, p)
    const buf = await p
    inFlight.delete(name)
    if (buf) buffers.set(name, buf)
  }

  const preload = async (sounds: Record<string, SoundDecl>): Promise<void> => {
    for (const [name, decl] of Object.entries(sounds)) {
      decls.set(name, decl)
    }
    await Promise.all(
      Object.entries(sounds).map(async ([name, decl]) => loadOne(name, decl)),
    )
  }

  const canPlay = (): boolean => {
    if (disposed) return false
    if (!opts.enabled()) return false
    if (opts.reducedMotion() && !opts.audioIgnoresReducedMotion) return false
    return true
  }

  const play = (name: string): void => {
    if (!canPlay()) return
    const c = ensureContext()
    if (!c || c.state !== 'running') return
    const buf = buffers.get(name)
    const decl = decls.get(name)
    if (!buf || !decl) return
    const poly = decl.polyphony ?? 4
    const current = active.get(name) ?? 0
    if (current >= poly) return

    const src = c.createBufferSource()
    src.buffer = buf
    const gain = c.createGain()
    gain.gain.value = decl.volume ?? 1
    src.connect(gain).connect(c.destination)
    active.set(name, current + 1)
    src.addEventListener('ended', () => {
      const n = (active.get(name) ?? 1) - 1
      if (n <= 0) active.delete(name)
      else active.set(name, n)
    })
    try {
      src.start(0)
    } catch {
      // Edge case: src already started (shouldn't happen with fresh node).
    }
  }

  const playBinding = (
    event: CountdownEventName,
    binding: AudioBinding,
  ): boolean => {
    const key = `${event}:${binding.sound}`
    const now =
      typeof performance !== 'undefined' ? performance.now() : Date.now()
    const last = lastFire.get(key) ?? -Infinity
    if (binding.throttleMs && now - last < binding.throttleMs) return false
    lastFire.set(key, now)
    play(binding.sound)
    return true
  }

  const dispose = (): void => {
    disposed = true
    detach()
    if (ctx) {
      ctx.close().catch(() => {})
      ctx = null
    }
    buffers.clear()
    inFlight.clear()
    decls.clear()
    active.clear()
    lastFire.clear()
  }

  return { preload, play, playBinding, dispose }
}
