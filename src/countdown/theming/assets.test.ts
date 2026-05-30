import { afterEach, describe, expect, it, vi } from 'vitest'

import { normalizeAsset, resolveAssetUrl } from './assets'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('normalizeAsset', () => {
  it('returns null for undefined', () => {
    expect(normalizeAsset(undefined)).toBeNull()
  })

  it('expands a bare string to { url, preload: false }', () => {
    expect(normalizeAsset('/sprite.png')).toEqual({
      url: '/sprite.png',
      preload: false,
    })
  })

  it('passes through full object form', () => {
    expect(
      normalizeAsset({ url: '/x.mp3', as: 'audio', preload: true }),
    ).toEqual({ url: '/x.mp3', as: 'audio', preload: true })
  })
})

describe('resolveAssetUrl', () => {
  it('passes through plain URLs', () => {
    expect(resolveAssetUrl('/foo.png', {})).toBe('/foo.png')
  })

  it('returns undefined for undefined input', () => {
    expect(resolveAssetUrl(undefined, {})).toBeUndefined()
  })

  it('resolves asset:KEY against the manifest', () => {
    expect(resolveAssetUrl('asset:sprite', { sprite: '/x.png' })).toBe('/x.png')
  })

  it('resolves through the full object form', () => {
    expect(
      resolveAssetUrl('asset:boop', {
        boop: { url: '/boop.mp3', as: 'audio' },
      }),
    ).toBe('/boop.mp3')
  })

  it('warns once and returns the original URI on missing key', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(resolveAssetUrl('asset:missing-1', {})).toBe('asset:missing-1')
    expect(resolveAssetUrl('asset:missing-1', {})).toBe('asset:missing-1')
    expect(warn).toHaveBeenCalledTimes(1)
  })
})
