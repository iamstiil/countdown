import { describe, expect, it } from 'vitest'

import { createAudioEngine } from './audioEngine'

describe('createAudioEngine — environment guards', () => {
  it('play() is a silent no-op until preload completes (no buffer loaded)', () => {
    // In JSDOM there's no real AudioContext.decodeAudioData; preload will
    // fail silently. We just want to confirm play() doesn't throw.
    const engine = createAudioEngine({
      enabled: () => true,
      reducedMotion: () => false,
    })
    expect(() => engine.play('nonexistent')).not.toThrow()
    engine.dispose()
  })

  it('playBinding() respects throttleMs (returns false within window)', () => {
    const engine = createAudioEngine({
      enabled: () => true,
      reducedMotion: () => false,
    })
    // The first call passes the throttle gate even though play() itself
    // silently fails (no buffer loaded). The second within window is
    // dropped before reaching play().
    const first = engine.playBinding('secondTick', {
      sound: 'click',
      throttleMs: 1000,
    })
    const second = engine.playBinding('secondTick', {
      sound: 'click',
      throttleMs: 1000,
    })
    expect(first).toBe(true)
    expect(second).toBe(false)
    engine.dispose()
  })

  it('dispose() makes subsequent play() calls no-ops', () => {
    const engine = createAudioEngine({
      enabled: () => true,
      reducedMotion: () => false,
    })
    engine.dispose()
    expect(() => engine.play('whatever')).not.toThrow()
  })
})
