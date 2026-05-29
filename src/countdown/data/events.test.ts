import { describe, expect, it, vi } from 'vitest'

import { createCountdownEventBus } from './events'

describe('createCountdownEventBus', () => {
  it('invokes subscribers in subscription order with the payload', () => {
    const bus = createCountdownEventBus()
    const calls: string[] = []
    bus.subscribe('secondTick', (p) => calls.push(`a:${p.remainingMs}`))
    bus.subscribe('secondTick', (p) => calls.push(`b:${p.remainingMs}`))

    bus.emit('secondTick', { remainingMs: 1234, at: 0 })

    expect(calls).toEqual(['a:1234', 'b:1234'])
  })

  it('does not deliver to unsubscribed listeners', () => {
    const bus = createCountdownEventBus()
    const seen: number[] = []
    const off = bus.subscribe('zero', (p) => seen.push(p.remainingMs))
    bus.emit('zero', { remainingMs: 0, at: 0 })
    off()
    bus.emit('zero', { remainingMs: 0, at: 0 })

    expect(seen).toEqual([0])
  })

  it('isolates listener errors from siblings', () => {
    const bus = createCountdownEventBus()
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const seen: string[] = []
    bus.subscribe('minuteBoundary', () => {
      throw new Error('boom')
    })
    bus.subscribe('minuteBoundary', () => {
      seen.push('ok')
    })

    bus.emit('minuteBoundary', { remainingMs: 60_000, at: 0 })

    expect(seen).toEqual(['ok'])
    expect(errSpy).toHaveBeenCalled()
    errSpy.mockRestore()
  })

  it('is a no-op when there are no listeners for an event', () => {
    const bus = createCountdownEventBus()
    expect(() =>
      bus.emit('dayBoundary', { remainingMs: 0, at: 0 }),
    ).not.toThrow()
  })
})
