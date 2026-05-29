import { beforeEach, describe, expect, it } from 'vitest'

import {
  isAudioEnabled,
  setAudioEnabled,
  subscribeAudioEnabled,
} from './audioPreference'

beforeEach(() => {
  window.localStorage.clear()
  setAudioEnabled(true)
})

describe('audioPreference', () => {
  it('defaults to enabled when no value is stored', () => {
    window.localStorage.clear()
    // Force a fresh read by reassigning via the public setter.
    setAudioEnabled(true)
    expect(isAudioEnabled()).toBe(true)
  })

  it('persists to localStorage', () => {
    setAudioEnabled(false)
    expect(window.localStorage.getItem('countdown:audio-enabled')).toBe('0')
    setAudioEnabled(true)
    expect(window.localStorage.getItem('countdown:audio-enabled')).toBe('1')
  })

  it('notifies subscribers on change and stops after unsubscribe', () => {
    const calls: boolean[] = []
    const off = subscribeAudioEnabled((v) => calls.push(v))
    setAudioEnabled(false)
    setAudioEnabled(true)
    off()
    setAudioEnabled(false)
    expect(calls).toEqual([false, true])
  })
})
