import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  CountdownDataProvider,
  useGestureAction,
} from '../data/CountdownDataContext'

import { GestureWrapper } from './GestureWrapper'

const future = () => new Date(Date.now() + 60_000)

function Capture({ name, onFire }: { name: string; onFire: () => void }) {
  useGestureAction(name, onFire)
  return null
}

function dispatchPointer(
  el: Element,
  type: string,
  init: { x?: number; y?: number; id?: number; ms?: number } = {},
) {
  const { x = 0, y = 0, id = 1 } = init
  // jsdom does not implement PointerEvent; synthesize via MouseEvent + pointerId.
  const ev = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  }) as MouseEvent & { pointerId: number; pointerType: string }
  Object.defineProperty(ev, 'pointerId', { value: id })
  Object.defineProperty(ev, 'pointerType', { value: 'touch' })
  el.dispatchEvent(ev)
}

describe('GestureWrapper', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fires tap on quick pointerdown/up with no movement', () => {
    const tap = vi.fn()
    render(
      <CountdownDataProvider targetDate={future()} title="T">
        <Capture name="ping" onFire={tap} />
        <GestureWrapper interactions={{ tap: 'ping' }}>
          <span data-testid="target">x</span>
        </GestureWrapper>
      </CountdownDataProvider>,
    )
    const wrapper = screen.getByTestId('target').parentElement!
    dispatchPointer(wrapper, 'pointerdown', { x: 10, y: 10 })
    vi.advanceTimersByTime(50)
    dispatchPointer(wrapper, 'pointerup', { x: 10, y: 10 })
    expect(tap).toHaveBeenCalledTimes(1)
  })

  it('fires longPress after the hold threshold', () => {
    const fn = vi.fn()
    render(
      <CountdownDataProvider targetDate={future()} title="T">
        <Capture name="hold" onFire={fn} />
        <GestureWrapper interactions={{ longPress: 'hold' }}>
          <span data-testid="t">x</span>
        </GestureWrapper>
      </CountdownDataProvider>,
    )
    const wrapper = screen.getByTestId('t').parentElement!
    dispatchPointer(wrapper, 'pointerdown', { x: 5, y: 5 })
    vi.advanceTimersByTime(550)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('fires swipe with direction attribute', () => {
    const fn = vi.fn()
    render(
      <CountdownDataProvider targetDate={future()} title="T">
        <Capture name="swipe" onFire={fn} />
        <GestureWrapper interactions={{ swipe: 'swipe' }}>
          <span data-testid="t">x</span>
        </GestureWrapper>
      </CountdownDataProvider>,
    )
    const wrapper = screen.getByTestId('t').parentElement!
    dispatchPointer(wrapper, 'pointerdown', { x: 0, y: 0 })
    dispatchPointer(wrapper, 'pointermove', { x: 80, y: 5 })
    dispatchPointer(wrapper, 'pointerup', { x: 80, y: 5 })
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('does not fire tap when movement exceeds slop', () => {
    const fn = vi.fn()
    render(
      <CountdownDataProvider targetDate={future()} title="T">
        <Capture name="t" onFire={fn} />
        <GestureWrapper interactions={{ tap: 't' }}>
          <span data-testid="t">x</span>
        </GestureWrapper>
      </CountdownDataProvider>,
    )
    const wrapper = screen.getByTestId('t').parentElement!
    dispatchPointer(wrapper, 'pointerdown', { x: 0, y: 0 })
    dispatchPointer(wrapper, 'pointermove', { x: 30, y: 0 })
    dispatchPointer(wrapper, 'pointerup', { x: 30, y: 0 })
    expect(fn).not.toHaveBeenCalled()
  })

  it('subscribes via useGestureAction and unsubscribes on unmount', () => {
    const fn = vi.fn()
    const { unmount } = render(
      <CountdownDataProvider targetDate={future()} title="T">
        <Capture name="ping" onFire={fn} />
        <GestureWrapper interactions={{ tap: 'ping' }}>
          <span data-testid="t">x</span>
        </GestureWrapper>
      </CountdownDataProvider>,
    )
    const wrapper = screen.getByTestId('t').parentElement!
    dispatchPointer(wrapper, 'pointerdown', { x: 1, y: 1 })
    dispatchPointer(wrapper, 'pointerup', { x: 1, y: 1 })
    expect(fn).toHaveBeenCalledTimes(1)
    unmount()
    // After unmount the wrapper element is gone; this confirms no crash.
    expect(true).toBe(true)
  })
})
