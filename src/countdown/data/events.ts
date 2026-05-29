/**
 * Tiny synchronous typed pub/sub used for countdown lifecycle events.
 *
 * - Listeners are invoked in subscription order.
 * - Listener errors are caught and logged so one bad listener cannot break
 *   the rest of the chain.
 * - `subscribe` returns an unsubscribe function (idempotent).
 */
export type CountdownEventName =
  | 'secondTick'
  | 'minuteBoundary'
  | 'hourBoundary'
  | 'dayBoundary'
  | 'finalMinute'
  | 'zero'

export interface CountdownEventPayload {
  /** Milliseconds remaining at the moment the event fired. */
  remainingMs: number
  /** High-resolution timestamp (performance.now()) for the firing tick. */
  at: number
}

export type CountdownEventListener = (payload: CountdownEventPayload) => void

export interface CountdownEventBus {
  subscribe: (
    event: CountdownEventName,
    listener: CountdownEventListener,
  ) => () => void
  emit: (event: CountdownEventName, payload: CountdownEventPayload) => void
}

export function createCountdownEventBus(): CountdownEventBus {
  const listeners = new Map<CountdownEventName, Set<CountdownEventListener>>()

  const subscribe: CountdownEventBus['subscribe'] = (event, listener) => {
    let set = listeners.get(event)
    if (!set) {
      set = new Set()
      listeners.set(event, set)
    }
    set.add(listener)
    return () => {
      set?.delete(listener)
    }
  }

  const emit: CountdownEventBus['emit'] = (event, payload) => {
    const set = listeners.get(event)
    if (!set || set.size === 0) return
    for (const listener of set) {
      try {
        listener(payload)
      } catch (err) {
        // Don't let one bad subscriber break the rest.

        console.error(`[countdown] listener for "${event}" threw`, err)
      }
    }
  }

  return { subscribe, emit }
}
