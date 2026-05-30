import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { CountdownDataProvider } from '../data/CountdownDataContext'

import { CountdownThemeProvider } from './CountdownThemeProvider'
import type { CountdownTheme } from './types'

const minimalTheme = (
  overrides: Partial<CountdownTheme> = {},
): CountdownTheme => ({
  id: 'rm-test',
  name: 'RM Test',
  tokens: { base: {} },
  layout: {
    id: 'root',
    type: 'group',
    children: [
      {
        id: 'title',
        type: 'event-title',
        props: { source: 'title' },
        classes: { className: { base: 'default-layout' } },
      },
    ],
  },
  ...overrides,
})

const findRoot = () =>
  document.body.querySelector<HTMLDivElement>('[data-ct-theme="rm-test"]')

let mediaMatches = false

beforeEach(() => {
  mediaMatches = false
  // jsdom doesn't ship matchMedia; assign a fresh stub each test.
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) =>
      ({
        matches: query.includes('reduce') ? mediaMatches : false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  })
})

afterEach(() => {
  // Remove the stub so other suites observe matchMedia's natural absence.
  Reflect.deleteProperty(
    window as unknown as Record<string, unknown>,
    'matchMedia',
  )
})

describe('CountdownThemeProvider — reducedMotion overrides', () => {
  it('stamps data-reduced-motion="false" by default', () => {
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider theme={minimalTheme()} />
      </CountdownDataProvider>,
    )
    expect(findRoot()!.getAttribute('data-reduced-motion')).toBe('false')
  })

  it('stamps data-reduced-motion="true" when the media query matches', () => {
    mediaMatches = true
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider theme={minimalTheme()} />
      </CountdownDataProvider>,
    )
    expect(findRoot()!.getAttribute('data-reduced-motion')).toBe('true')
  })

  it('renders reducedMotion.layout when reduced motion is on', () => {
    mediaMatches = true
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider
          theme={minimalTheme({
            reducedMotion: {
              layout: {
                id: 'rm-root',
                type: 'group',
                children: [
                  {
                    id: 'rm-title',
                    type: 'event-title',
                    props: { source: 'title' },
                    classes: { className: { base: 'rm-layout' } },
                  },
                ],
              },
            },
          })}
        />
      </CountdownDataProvider>,
    )
    expect(findRoot()!.querySelector('.rm-layout')).not.toBeNull()
    expect(findRoot()!.querySelector('.default-layout')).toBeNull()
  })

  it('falls back to base layout when reduced motion is off', () => {
    mediaMatches = false
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider
          theme={minimalTheme({
            reducedMotion: {
              layout: {
                id: 'rm-root',
                type: 'group',
                children: [
                  {
                    id: 'rm-title',
                    type: 'event-title',
                    props: { source: 'title' },
                    classes: { className: { base: 'rm-layout' } },
                  },
                ],
              },
            },
          })}
        />
      </CountdownDataProvider>,
    )
    expect(findRoot()!.querySelector('.rm-layout')).toBeNull()
    expect(findRoot()!.querySelector('.default-layout')).not.toBeNull()
  })

  it('replaces theme.animations wholesale when override is set', () => {
    mediaMatches = true
    const target = new Date(Date.now() + 60_000)
    render(
      <CountdownDataProvider targetDate={target} title="T">
        <CountdownThemeProvider
          theme={minimalTheme({
            animations: {
              big: '@keyframes ct-default-anim { from { opacity: 0 } to { opacity: 1 } }',
            },
            reducedMotion: {
              animations: {
                small:
                  '@keyframes ct-rm-anim { from { opacity: 0.5 } to { opacity: 1 } }',
              },
            },
          })}
        />
      </CountdownDataProvider>,
    )
    const root = findRoot()!
    const styles = Array.from(root.querySelectorAll('style')).map(
      (s) => s.textContent ?? '',
    )
    expect(styles.some((s) => s.includes('ct-rm-anim'))).toBe(true)
    expect(styles.some((s) => s.includes('ct-default-anim'))).toBe(false)
  })
})
