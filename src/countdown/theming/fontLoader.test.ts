import { describe, expect, it } from 'vitest'

import { buildGoogleFontHref } from './fontLoader'

describe('buildGoogleFontHref', () => {
  it('builds a CSS2 URL with display=swap', () => {
    expect(buildGoogleFontHref({ family: 'Inter', source: 'google' })).toBe(
      'https://fonts.googleapis.com/css2?family=Inter&display=swap',
    )
  })

  it('encodes multi-word family names with +', () => {
    expect(
      buildGoogleFontHref({ family: 'Playfair Display', source: 'google' }),
    ).toBe(
      'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap',
    )
  })

  it('sorts and appends weights via :wght@', () => {
    expect(
      buildGoogleFontHref({
        family: 'Inter',
        weights: [700, 400, 500],
        source: 'google',
      }),
    ).toBe(
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
    )
  })
})
