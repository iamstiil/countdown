import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'

import { createActionBus, type ActionBus, type ActionListener } from './actions'
import {
  createCountdownEventBus,
  type CountdownEventBus,
  type CountdownEventListener,
  type CountdownEventName,
} from './events'

export interface Remaining {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export interface CountdownData {
  /** Original target. */
  targetDate: Date
  /** Optional reference start used by progress indicators. */
  startDate: Date
  title: string
  subtitle?: string
  remaining: Remaining
  /** 0..1 elapsed fraction (clamped, second-granular). */
  elapsedFraction: number
  isDone: boolean
  /**
   * Lifecycle phase derived purely from `remaining`. Provider does NOT
   * compute the orthogonal `idle` state — that is the theme provider's
   * responsibility since it depends on per-theme `idleAfterMs`.
   */
  lifecycleState: 'counting' | 'final-minute' | 'done'
}

const computeRemaining = (target: Date): Remaining => {
  const total = Math.max(0, target.getTime() - Date.now())
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / 1000 / 60 / 60) % 24)
  const days = Math.floor(total / 1000 / 60 / 60 / 24)
  return { total, days, hours, minutes, seconds }
}

const CountdownDataContext = createContext<CountdownData | null>(null)
const CountdownEventsContext = createContext<CountdownEventBus | null>(null)
const CountdownActionsContext = createContext<ActionBus | null>(null)

/**
 * Continuous (sub-second) elapsed-fraction signal. Lives outside of React
 * state so subscribers (e.g. a rAF-driven "breathe" tide) can pull on every
 * frame without forcing a re-render.
 */
export interface ContinuousProgress {
  /** Current 0..1 elapsed fraction at high resolution. */
  get: () => number
  /**
   * Subscribe to per-frame updates while the document is visible. The
   * listener receives the current value immediately on subscribe.
   * Returns an unsubscribe function.
   */
  subscribe: (listener: (value: number) => void) => () => void
}
const ContinuousProgressContext = createContext<ContinuousProgress | null>(null)

export interface CountdownDataProviderProps {
  targetDate: Date
  startDate?: Date
  title: string
  subtitle?: string
  children: ReactNode
}

export function CountdownDataProvider({
  targetDate,
  startDate,
  title,
  subtitle,
  children,
}: CountdownDataProviderProps) {
  const [remaining, setRemaining] = useState<Remaining>(() =>
    computeRemaining(targetDate),
  )

  // Boundary detection needs the previous tick snapshot.
  const prevRemainingRef = useRef<Remaining>(remaining)
  const finalMinuteFiredRef = useRef(false)
  const zeroFiredRef = useRef(false)

  // One bus per provider instance.
  const bus = useMemo(() => createCountdownEventBus(), [])
  const actionBus = useMemo(() => createActionBus(), [])

  useEffect(() => {
    const initial = computeRemaining(targetDate)
    setRemaining(initial)
    prevRemainingRef.current = initial
    finalMinuteFiredRef.current = initial.total <= 60_000
    zeroFiredRef.current = initial.total === 0

    const tick = () => {
      const next = computeRemaining(targetDate)
      const prev = prevRemainingRef.current
      const payload = { remainingMs: next.total, at: performance.now() }

      bus.emit('secondTick', payload)
      if (next.minutes !== prev.minutes || next.hours !== prev.hours) {
        bus.emit('minuteBoundary', payload)
      }
      if (next.hours !== prev.hours || next.days !== prev.days) {
        bus.emit('hourBoundary', payload)
      }
      if (next.days !== prev.days) {
        bus.emit('dayBoundary', payload)
      }
      if (!finalMinuteFiredRef.current && next.total <= 60_000) {
        finalMinuteFiredRef.current = true
        bus.emit('finalMinute', payload)
      }
      if (!zeroFiredRef.current && next.total === 0) {
        zeroFiredRef.current = true
        bus.emit('zero', payload)
      }

      prevRemainingRef.current = next
      setRemaining(next)
    }

    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [targetDate, bus])

  // --- Continuous progress (rAF) ---------------------------------------
  const effectiveStart = useMemo(
    () => startDate ?? new Date(targetDate.getTime() - 24 * 60 * 60 * 1000),
    [startDate, targetDate],
  )

  const progressListenersRef = useRef<Set<(value: number) => void>>(new Set())

  const continuousProgress = useMemo<ContinuousProgress>(() => {
    const get = () => {
      const span = Math.max(1, targetDate.getTime() - effectiveStart.getTime())
      const elapsed = Date.now() - effectiveStart.getTime()
      return Math.min(1, Math.max(0, elapsed / span))
    }
    const subscribe = (listener: (value: number) => void) => {
      progressListenersRef.current.add(listener)
      try {
        listener(get())
      } catch {
        /* user code */
      }
      return () => {
        progressListenersRef.current.delete(listener)
      }
    }
    return { get, subscribe }
  }, [targetDate, effectiveStart])

  useEffect(() => {
    if (typeof window === 'undefined') return
    let rafId = 0
    let stopped = false

    const loop = () => {
      if (stopped) return
      const value = continuousProgress.get()
      for (const listener of progressListenersRef.current) {
        try {
          listener(value)
        } catch {
          /* user code */
        }
      }
      rafId = window.requestAnimationFrame(loop)
    }

    const start = () => {
      if (rafId !== 0) return
      rafId = window.requestAnimationFrame(loop)
    }
    const stop = () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    const handleVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    document.addEventListener('visibilitychange', handleVisibility)
    if (!document.hidden) start()

    return () => {
      stopped = true
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [continuousProgress])

  const value = useMemo<CountdownData>(() => {
    const span = Math.max(1, targetDate.getTime() - effectiveStart.getTime())
    const elapsed =
      targetDate.getTime() - effectiveStart.getTime() - remaining.total
    const elapsedFraction = Math.min(1, Math.max(0, elapsed / span))
    const lifecycleState: CountdownData['lifecycleState'] =
      remaining.total === 0
        ? 'done'
        : remaining.total <= 60_000
          ? 'final-minute'
          : 'counting'
    return {
      targetDate,
      startDate: effectiveStart,
      title,
      subtitle,
      remaining,
      elapsedFraction,
      isDone: remaining.total === 0,
      lifecycleState,
    }
  }, [targetDate, effectiveStart, title, subtitle, remaining])

  return (
    <CountdownDataContext.Provider value={value}>
      <CountdownEventsContext.Provider value={bus}>
        <CountdownActionsContext.Provider value={actionBus}>
          <ContinuousProgressContext.Provider value={continuousProgress}>
            {children}
          </ContinuousProgressContext.Provider>
        </CountdownActionsContext.Provider>
      </CountdownEventsContext.Provider>
    </CountdownDataContext.Provider>
  )
}

export function useCountdownData(): CountdownData {
  const ctx = useContext(CountdownDataContext)
  if (!ctx) {
    throw new Error(
      'useCountdownData must be used inside <CountdownDataProvider>',
    )
  }
  return ctx
}

/**
 * Subscribe to countdown lifecycle events (`secondTick`, `minuteBoundary`,
 * `hourBoundary`, `dayBoundary`, `finalMinute`, `zero`). Returns a stable
 * `subscribe` function — safe to call from effects without re-triggering.
 */
export function useCountdownEvents(): {
  subscribe: (
    event: CountdownEventName,
    listener: CountdownEventListener,
  ) => () => void
} {
  const bus = useContext(CountdownEventsContext)
  if (!bus) {
    throw new Error(
      'useCountdownEvents must be used inside <CountdownDataProvider>',
    )
  }
  return { subscribe: bus.subscribe }
}

/**
 * Continuous (sub-second) elapsed-fraction signal updated on rAF. Use for
 * visual motion that needs to be smoother than the 1Hz React tick.
 */
export function useContinuousProgress(): ContinuousProgress {
  const ref = useContext(ContinuousProgressContext)
  if (!ref) {
    throw new Error(
      'useContinuousProgress must be used inside <CountdownDataProvider>',
    )
  }
  return ref
}

/**
 * Run an imperative effect on a countdown lifecycle event. The handler is
 * (re)subscribed whenever any value in `deps` changes; it is automatically
 * unsubscribed on unmount or before re-subscription.
 *
 * Use when a theme needs a one-shot side effect (fireworks emit, audio
 * cue, sprite spawn) that should fire on a bus event rather than on every
 * render.
 */
export function useThemeEffect(
  event: CountdownEventName,
  handler: CountdownEventListener,
  deps: ReadonlyArray<unknown> = [],
): void {
  const { subscribe } = useCountdownEvents()
  useEffect(() => {
    return subscribe(event, handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, subscribe, ...deps])
}

/**
 * Access the gesture/action bus. Themes emit free-form action names
 * (e.g. `'smear'`, `'refresh'`) via gestures or custom UI; consumers
 * subscribe with `useGestureAction`.
 */
export function useThemeActions(): {
  subscribe: (name: string, listener: ActionListener) => () => void
  emit: (name: string) => void
} {
  const bus = useContext(CountdownActionsContext)
  if (!bus) {
    throw new Error(
      'useThemeActions must be used inside <CountdownDataProvider>',
    )
  }
  return { subscribe: bus.subscribe, emit: bus.emit }
}

/**
 * Subscribe to a named theme action (typically dispatched by the gesture
 * wrapper). Handler is automatically unsubscribed on unmount or when
 * `deps` change.
 */
export function useGestureAction(
  name: string,
  handler: ActionListener,
  deps: ReadonlyArray<unknown> = [],
): void {
  const { subscribe } = useThemeActions()
  useEffect(() => {
    return subscribe(name, handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, subscribe, ...deps])
}
