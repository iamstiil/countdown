import { describe, expect, it } from 'vitest'

import { buildDefsMarkup, builtInFilters } from './filterLibrary'

describe('filterLibrary', () => {
  it('exposes all advertised built-in filters', () => {
    expect(Object.keys(builtInFilters).sort()).toEqual([
      'chromatic-aberration',
      'crt-warp',
      'ink-bleed',
      'paper-grain',
      'watercolor',
    ])
  })

  it('each built-in declares a ct-prefixed id', () => {
    for (const [id, markup] of Object.entries(builtInFilters)) {
      expect(markup).toContain(`id="ct-${id}"`)
    }
  })

  it('buildDefsMarkup concatenates selected filters with raw markup', () => {
    const out = buildDefsMarkup(['ink-bleed'], '<mask id="custom"></mask>')
    expect(out).toContain('id="ct-ink-bleed"')
    expect(out).toContain('id="custom"')
  })

  it('dedupes repeated filter ids preserving first-seen order', () => {
    const out = buildDefsMarkup(['ink-bleed', 'crt-warp', 'ink-bleed'], '')
    const firstInk = out.indexOf('id="ct-ink-bleed"')
    const lastInk = out.lastIndexOf('id="ct-ink-bleed"')
    expect(firstInk).toBe(lastInk)
    expect(firstInk).toBeLessThan(out.indexOf('id="ct-crt-warp"'))
  })

  it('returns empty string when nothing requested', () => {
    expect(buildDefsMarkup()).toBe('')
    expect(buildDefsMarkup([], '')).toBe('')
  })
})
