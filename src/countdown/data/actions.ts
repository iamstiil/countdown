/**
 * Action bus — free-form string-keyed pub/sub used for theme-defined
 * actions (gestures, custom UI affordances). Separate from the strict
 * CountdownEventName-keyed lifecycle bus so theme authors can invent
 * action names without widening the lifecycle event union.
 */

export type ActionListener = () => void

export interface ActionBus {
  subscribe: (name: string, listener: ActionListener) => () => void
  emit: (name: string) => void
}

export function createActionBus(): ActionBus {
  const listeners = new Map<string, Set<ActionListener>>()

  return {
    subscribe(name, listener) {
      let set = listeners.get(name)
      if (!set) {
        set = new Set()
        listeners.set(name, set)
      }
      set.add(listener)
      return () => {
        set!.delete(listener)
        if (set!.size === 0) listeners.delete(name)
      }
    },
    emit(name) {
      const set = listeners.get(name)
      if (!set) return
      for (const listener of set) {
        try {
          listener()
        } catch (e) {
          console.error(`[action-bus] listener for "${name}" threw:`, e)
        }
      }
    },
  }
}
