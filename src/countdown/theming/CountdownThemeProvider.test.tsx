import { act, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CountdownDataProvider } from '../data/CountdownDataContext'

import { CountdownThemeProvider } from './CountdownThemeProvider'
import type { CountdownTheme } from './types'

const minimalTheme = (
  overrides: Partial<CountdownTheme> = {},
): CountdownTheme => ({
  id: 'test',
  name: 'Test',
  tokens: { base: {} },
  layout: {
    id: 'root',
    type: 'group',
    children: [
      {
        id: 'title',
        type: 'event-title',
        props: { source: 'title' },
      },
    ],
  },
  ...overrides,
})

const findRoot = () =>
  document.body.querySelector<HTMLDivElement>('[data-ct-theme="test"]')

describe('CountdownThemeProvider — data-state', () => {
  it('stamps "counting" by default', () => {
    const target = new Date(Date.now() + 10 * 60 * 1000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider theme={minimalTheme()} />
      </CountdownDataProvider>,
    )
    expect(findRoot()!.getAttribute('data-state')).toBe('counting')
  })

  it('stamps "final-minute" inside the last 60s', () => {
    const target = new Date(Date.now() + 30_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider theme={minimalTheme()} />
      </CountdownDataProvider>,
    )
    expect(findRoot()!.getAttribute('data-state')).toBe('final-minute')
  })

  it('stamps "done" once the target has passed', () => {
    const target = new Date(Date.now() - 1000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider theme={minimalTheme()} />
      </CountdownDataProvider>,
    )
    expect(findRoot()!.getAttribute('data-state')).toBe('done')
  })

  it('switches to "idle" after idleAfterMs of inactivity and back on activity', () => {
    vi.useFakeTimers()
    try {
      const target = new Date(Date.now() + 10 * 60 * 1000)
      render(
        <CountdownDataProvider targetDate={target} title="T">
          <CountdownThemeProvider theme={minimalTheme({ idleAfterMs: 500 })} />
        </CountdownDataProvider>,
      )
      expect(findRoot()!.getAttribute('data-state')).toBe('counting')

      act(() => {
        vi.advanceTimersByTime(600)
      })
      expect(findRoot()!.getAttribute('data-state')).toBe('idle')

      act(() => {
        window.dispatchEvent(new Event('pointermove'))
      })
      expect(findRoot()!.getAttribute('data-state')).toBe('counting')
    } finally {
      vi.useRealTimers()
    }
  })

  it('does not enter idle when state is "done"', () => {
    vi.useFakeTimers()
    try {
      const target = new Date(Date.now() - 5_000)
      render(
        <CountdownDataProvider targetDate={target} title="T">
          <CountdownThemeProvider theme={minimalTheme({ idleAfterMs: 100 })} />
        </CountdownDataProvider>,
      )
      act(() => {
        vi.advanceTimersByTime(500)
      })
      expect(findRoot()!.getAttribute('data-state')).toBe('done')
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('CountdownThemeProvider — alternate layouts', () => {
  it('renders doneLayout when state is "done"', () => {
    const target = new Date(Date.now() - 5_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider
          theme={minimalTheme({
            doneLayout: {
              id: 'done-root',
              type: 'group',
              children: [
                {
                  id: 'done-marker',
                  type: 'event-title',
                  props: { source: 'title' },
                  classes: { className: { base: 'done-marker' } },
                },
              ],
            },
          })}
        />
      </CountdownDataProvider>,
    )
    expect(findRoot()!.querySelector('.done-marker')).not.toBeNull()
  })
})

describe('CountdownThemeProvider — defs injection', () => {
  it('does not inject a defs <svg> when theme.defs is absent', () => {
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider theme={minimalTheme()} />
      </CountdownDataProvider>,
    )
    expect(findRoot()!.querySelector('svg[data-ct-defs]')).toBeNull()
  })

  it('injects built-in filter ids when requested', () => {
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider
          theme={minimalTheme({
            defs: { filters: ['ink-bleed', 'crt-warp'] },
          })}
        />
      </CountdownDataProvider>,
    )
    const svg = findRoot()!.querySelector('svg[data-ct-defs]')!
    expect(svg).not.toBeNull()
    expect(svg.getAttribute('aria-hidden')).toBe('true')
    expect(svg.querySelector('#ct-ink-bleed')).not.toBeNull()
    expect(svg.querySelector('#ct-crt-warp')).not.toBeNull()
  })

  it('appends raw markup alongside built-ins', () => {
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider
          theme={minimalTheme({
            defs: {
              filters: ['ink-bleed'],
              raw: '<mask id="ct-test-mask"><rect width="100" height="100" fill="white" /></mask>',
            },
          })}
        />
      </CountdownDataProvider>,
    )
    const svg = findRoot()!.querySelector('svg[data-ct-defs]')!
    expect(svg.querySelector('#ct-ink-bleed')).not.toBeNull()
    expect(svg.querySelector('#ct-test-mask')).not.toBeNull()
  })
})

describe('CountdownThemeProvider — fonts and assets', () => {
  it('stamps data-fonts-ready="true" immediately when no fonts declared', () => {
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider theme={minimalTheme()} />
      </CountdownDataProvider>,
    )
    expect(findRoot()!.getAttribute('data-fonts-ready')).toBe('true')
  })

  it('injects google font <link> tags into <head>', () => {
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider
          theme={minimalTheme({
            fonts: [{ family: 'Inter', source: 'google', weights: [400] }],
          })}
        />
      </CountdownDataProvider>,
    )
    const sheets = document.head.querySelectorAll(
      'link[rel="stylesheet"][href*="fonts.googleapis.com"][href*="Inter"]',
    )
    expect(sheets.length).toBeGreaterThan(0)
    const preconnect = document.head.querySelector(
      'link[rel="preconnect"][href="https://fonts.googleapis.com"]',
    )
    expect(preconnect).not.toBeNull()
  })

  it('emits preload hints only for assets with preload: true', () => {
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider
          theme={minimalTheme({
            assets: {
              hero: { url: '/hero.png', as: 'image', preload: true },
              lazy: '/lazy.png',
            },
          })}
        />
      </CountdownDataProvider>,
    )
    expect(
      document.head.querySelector('link[rel="preload"][href="/hero.png"]'),
    ).not.toBeNull()
    expect(
      document.head.querySelector('link[rel="preload"][href="/lazy.png"]'),
    ).toBeNull()
  })
})
