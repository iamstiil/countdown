import { describe, expect, it } from 'vitest'

import { getEffect, registerEffect, type EffectImpl } from './effects'

describe('effects registry', () => {
  it('ships watercolor-bloom and crt-fireworks by default', () => {
    expect(getEffect('watercolor-bloom')).toBeTypeOf('function')
    expect(getEffect('crt-fireworks')).toBeTypeOf('function')
  })

  it('returns undefined for unknown effects', () => {
    expect(getEffect('definitely-not-real')).toBeUndefined()
  })

  it('allows registering and resolving custom effects', () => {
    const impl: EffectImpl = () => () => {}
    registerEffect('custom-test', impl)
    expect(getEffect('custom-test')).toBe(impl)
  })
})
