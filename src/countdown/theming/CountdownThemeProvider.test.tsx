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
