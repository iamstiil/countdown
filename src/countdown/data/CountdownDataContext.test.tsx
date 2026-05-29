import { act, render, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import {
  CountdownDataProvider,
  useCountdownData,
  useThemeEffect,
} from './CountdownDataContext'

const wrapAt = (msUntilTarget: number) => {
  const target = new Date(Date.now() + msUntilTarget)
  return ({ children }: { children: ReactNode }) => (
    <CountdownDataProvider targetDate={target} title="T">
      {children}
    </CountdownDataProvider>
  )
}

describe('CountdownDataProvider — lifecycleState', () => {
  it('is "counting" while remaining > 60s', () => {
    const { result } = renderHook(() => useCountdownData(), {
      wrapper: wrapAt(5 * 60 * 1000),
    })
    expect(result.current.lifecycleState).toBe('counting')
    expect(result.current.isDone).toBe(false)
  })

  it('is "final-minute" when remaining is within the last 60s', () => {
    const { result } = renderHook(() => useCountdownData(), {
      wrapper: wrapAt(30_000),
    })
    expect(result.current.lifecycleState).toBe('final-minute')
  })

  it('is "done" when the target has already passed', () => {
    const { result } = renderHook(() => useCountdownData(), {
      wrapper: wrapAt(-5_000),
    })
    expect(result.current.lifecycleState).toBe('done')
    expect(result.current.isDone).toBe(true)
  })
})

describe('useThemeEffect', () => {
  it('subscribes to the named event and cleans up on unmount', () => {
    vi.useFakeTimers()
    try {
      const handler = vi.fn()
      const target = new Date(Date.now() + 60 * 60 * 1000)
      const { unmount } = render(
        <CountdownDataProvider targetDate={target} title="T">
          <Probe event="secondTick" handler={handler} />
        </CountdownDataProvider>,
      )

      // No tick yet → not called.
      expect(handler).not.toHaveBeenCalled()

      // Advance one second to trigger the provider's interval.
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(handler).toHaveBeenCalledTimes(1)

      // Unmount → no more invocations.
      unmount()
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      expect(handler).toHaveBeenCalledTimes(1)
    } finally {
      vi.useRealTimers()
    }
  })
})

function Probe({
  event,
  handler,
}: {
  event: Parameters<typeof useThemeEffect>[0]
  handler: Parameters<typeof useThemeEffect>[1]
}) {
  useThemeEffect(event, handler)
  return null
}
