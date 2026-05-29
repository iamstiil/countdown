import { useEffect } from 'react'

import { useCountdownEvents } from '../data/CountdownDataContext'
import type { CountdownEventName } from '../data/events'

import type { SlotTrigger } from './types'

const NAMED_EVENTS = new Set<CountdownEventName>([
  'secondTick',
  'minuteBoundary',
  'hourBoundary',
  'dayBoundary',
  'finalMinute',
  'zero',
])

function isEventName(t: SlotTrigger): t is CountdownEventName {
  return NAMED_EVENTS.has(t as CountdownEventName)
}

/**
 * Subscribes `handler` to a slot's declarative trigger.
 *
 * - `'mount'` — runs `handler` once on mount (and again when `deps` change).
 * - `'loop'` — runs `handler` once on mount; the slot is expected to
 *   self-repeat (e.g. via CSS `animation-iteration-count: infinite` or its
 *   own rAF loop). We deliberately do not poll on a fixed interval.
 * - any named bus event — runs `handler` on every emission.
 *
 * `handler` is intentionally not in the dependency list; callers should
 * ensure stability (e.g. via `useCallback`) or accept that the latest
 * closure value is captured on each re-subscribe via `deps`.
 */
export function useSlotTrigger(
  trigger: SlotTrigger | undefined,
  handler: () => void,
  deps: ReadonlyArray<unknown> = [],
): void {
  const { subscribe } = useCountdownEvents()
  const effective: SlotTrigger = trigger ?? 'mount'
  useEffect(() => {
    if (effective === 'mount' || effective === 'loop') {
      handler()
      return
    }
    if (isEventName(effective)) {
      return subscribe(effective, () => handler())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effective, subscribe, ...deps])
}
