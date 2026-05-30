import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CountdownDataProvider } from '../data/CountdownDataContext'

import { CountdownThemeProvider } from './CountdownThemeProvider'
import type { CountdownTheme } from './types'

const baseTheme = (
  overrides: Partial<CountdownTheme> = {},
): CountdownTheme => ({
  id: 'chrome-test',
  name: 'Chrome Test',
  tokens: { base: {} },
  layout: {
    id: 'root',
    type: 'group',
    children: [{ id: 't', type: 'event-title', props: { source: 'title' } }],
  },
  ...overrides,
})

const findRoot = () =>
  document.body.querySelector<HTMLDivElement>('[data-ct-theme="chrome-test"]')

describe('CountdownThemeProvider — chrome layer', () => {
  it('renders a .ct-safe wrapper around the main layout', () => {
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider theme={baseTheme()} />
      </CountdownDataProvider>,
    )
    const safe = findRoot()!.querySelector('.ct-safe')
    expect(safe).not.toBeNull()
    expect(safe!.querySelector('.ct-layer')).not.toBeNull()
  })

  it('omits the chrome layer when theme.chrome is not declared', () => {
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider theme={baseTheme()} />
      </CountdownDataProvider>,
    )
    expect(findRoot()!.querySelector('.ct-chrome')).toBeNull()
  })

  it('renders chrome as a sibling of .ct-safe when declared', () => {
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider
          theme={baseTheme({
            chrome: {
              id: 'chrome-root',
              type: 'chrome',
              children: [
                {
                  id: 'bolt',
                  type: 'group',
                  classes: { className: { base: 'bezel-bolt' } },
                },
              ],
            },
          })}
        />
      </CountdownDataProvider>,
    )
    const root = findRoot()!
    const safe = root.querySelector('.ct-safe')
    const chrome = root.querySelector('.ct-chrome')
    expect(safe).not.toBeNull()
    expect(chrome).not.toBeNull()
    // Chrome must be a direct sibling of .ct-safe, not nested inside it.
    expect(safe!.contains(chrome)).toBe(false)
    expect(chrome!.parentElement).toBe(safe!.parentElement)
    // Chrome content reachable inside the chrome layer.
    expect(chrome!.querySelector('.bezel-bolt')).not.toBeNull()
    // Chrome container slot stamped.
    expect(chrome!.querySelector('[data-slot="chrome"]')).not.toBeNull()
  })
})
