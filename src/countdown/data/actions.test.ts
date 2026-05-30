import { describe, expect, it, vi } from 'vitest'

import { createActionBus } from './actions'

describe('createActionBus', () => {
  it('dispatches to all subscribers of a name', () => {
    const bus = createActionBus()
    const a = vi.fn()
    const b = vi.fn()
    bus.subscribe('smear', a)
    bus.subscribe('smear', b)
    bus.emit('smear')
    expect(a).toHaveBeenCalledTimes(1)
    expect(b).toHaveBeenCalledTimes(1)
  })

  it('does not dispatch to subscribers of other names', () => {
    const bus = createActionBus()
    const a = vi.fn()
    bus.subscribe('smear', a)
    bus.emit('refresh')
    expect(a).not.toHaveBeenCalled()
  })

  it('unsubscribes via the returned disposer', () => {
    const bus = createActionBus()
    const a = vi.fn()
    const off = bus.subscribe('x', a)
    bus.emit('x')
    off()
    bus.emit('x')
    expect(a).toHaveBeenCalledTimes(1)
  })

  it('isolates errors thrown by one listener from the others', () => {
    const bus = createActionBus()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const boom = vi.fn(() => {
      throw new Error('boom')
    })
    const ok = vi.fn()
    bus.subscribe('x', boom)
    bus.subscribe('x', ok)
    bus.emit('x')
    expect(boom).toHaveBeenCalled()
    expect(ok).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('emitting an unknown name is a no-op', () => {
    const bus = createActionBus()
    expect(() => bus.emit('nope')).not.toThrow()
  })
})
