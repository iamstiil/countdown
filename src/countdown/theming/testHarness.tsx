import type { ReactElement } from 'react'

import { CountdownDataProvider } from '../data/CountdownDataContext'

import { CountdownThemeProvider } from './CountdownThemeProvider'
import type { CountdownState, CountdownTheme } from './types'

/**
 * Build a target `Date` such that the countdown is currently in the
 * requested lifecycle state. Use with vitest's `vi.useFakeTimers`
 * + `vi.setSystemTime` for deterministic snapshots.
 *
 *     vi.useFakeTimers()
 *     vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
 *     const target = targetForState('final-minute')
 */
export function targetForState(state: CountdownState): Date {
  const now = Date.now()
  switch (state) {
    case 'done':
      return new Date(now - 1000)
    case 'final-minute':
      return new Date(now + 30_000)
    case 'idle':
    case 'counting':
    default:
      return new Date(now + 60 * 60_000)
  }
}

/**
 * Minimal harness for rendering a theme in tests. Returns a React tree
 * wired with the smallest viable `CountdownDataProvider` so consumers
 * can pass it straight to `render(...)` from `@testing-library/react`.
 *
 * For per-state snapshots, drive the lifecycle by combining
 * `targetForState` with `vi.setSystemTime`:
 *
 *     vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
 *     render(renderTheme(myTheme, { state: 'done' }))
 */
export function renderTheme(
  theme: CountdownTheme,
  options: {
    state?: CountdownState
    title?: string
    subtitle?: string
  } = {},
): ReactElement {
  const { state = 'counting', title = 'Test Event', subtitle } = options
  return (
    <CountdownDataProvider
      targetDate={targetForState(state)}
      title={title}
      subtitle={subtitle}
    >
      <CountdownThemeProvider theme={theme} />
    </CountdownDataProvider>
  )
}

/**
 * Lookup helper for tests: returns the portaled theme root for the
 * given theme id (themes mount into `document.body` via portal).
 */
export function findThemeRoot(themeId: string): HTMLElement | null {
  if (typeof document === 'undefined') return null
  return document.body.querySelector<HTMLElement>(
    `[data-ct-theme="${themeId}"]`,
  )
}
