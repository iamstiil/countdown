import { describe, expect, it, vi } from 'vitest'

import { vibrate } from './haptics'

describe('vibrate', () => {
  it('returns false when navigator.vibrate is missing', () => {
    const original = (navigator as { vibrate?: unknown }).vibrate
    delete (navigator as { vibrate?: unknown }).vibrate
    try {
      const ok = vibrate(100, {
        enabled: () => true,
        reducedMotion: () => false,
      })
      expect(ok).toBe(false)
    } finally {
      if (original !== undefined) {
        ;(navigator as { vibrate?: unknown }).vibrate = original
      }
    }
  })

  it('calls navigator.vibrate with the pattern when enabled', () => {
    const spy = vi.fn(() => true)
    ;(navigator as { vibrate?: unknown }).vibrate = spy
    try {
      const ok = vibrate([20, 40, 20], {
        enabled: () => true,
        reducedMotion: () => false,
      })
      expect(ok).toBe(true)
      expect(spy).toHaveBeenCalledWith([20, 40, 20])
    } finally {
      delete (navigator as { vibrate?: unknown }).vibrate
    }
  })

  it('no-ops when disabled', () => {
    const spy = vi.fn(() => true)
    ;(navigator as { vibrate?: unknown }).vibrate = spy
    try {
      const ok = vibrate(50, {
        enabled: () => false,
        reducedMotion: () => false,
      })
      expect(ok).toBe(false)
      expect(spy).not.toHaveBeenCalled()
    } finally {
      delete (navigator as { vibrate?: unknown }).vibrate
    }
  })

  it('respects prefers-reduced-motion by default', () => {
    const spy = vi.fn(() => true)
    ;(navigator as { vibrate?: unknown }).vibrate = spy
    try {
      const ok = vibrate(50, {
        enabled: () => true,
        reducedMotion: () => true,
      })
      expect(ok).toBe(false)
      expect(spy).not.toHaveBeenCalled()
    } finally {
      delete (navigator as { vibrate?: unknown }).vibrate
    }
  })

  it('can opt out of reduced-motion gating', () => {
    const spy = vi.fn(() => true)
    ;(navigator as { vibrate?: unknown }).vibrate = spy
    try {
      const ok = vibrate(50, {
        enabled: () => true,
        reducedMotion: () => true,
        ignoreReducedMotion: true,
      })
      expect(ok).toBe(true)
      expect(spy).toHaveBeenCalledWith(50)
    } finally {
      delete (navigator as { vibrate?: unknown }).vibrate
    }
  })
})
