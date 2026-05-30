import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { useThemeActions } from '../data/CountdownDataContext'
import type { SlotInteractions } from '../theming/types'

const LONG_PRESS_MS = 500
const TAP_MAX_MS = 250
const DOUBLE_TAP_WINDOW_MS = 280
const MOVE_SLOP_PX = 8
const SWIPE_THRESHOLD_PX = 60
const PULL_DISTANCE_PX = 110
const DEFAULT_PULL_RELEASE_THRESHOLD = 0.6

interface PointerState {
  id: number
  startX: number
  startY: number
  startTime: number
  longPressTimer: number | null
  moved: boolean
  pulling: boolean
}

/**
 * Wraps a slot with declarative gesture handlers. Dispatches action names
 * to the action bus (via `useThemeActions`) and stamps `data-gesture` on
 * the wrapper for one frame so themes can react in CSS.
 *
 * Gesture detection is intentionally simple (no rubber-banding, no
 * inertia). Themes that need fancier touch behavior can still subscribe
 * to bus events directly and roll their own.
 */
export function GestureWrapper({
  interactions,
  children,
  className,
}: {
  interactions: SlotInteractions
  children: ReactNode
  className?: string
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const { emit } = useThemeActions()

  // Refs hold mutable handler-state so re-renders don't reset gesture progress.
  const interactionsRef = useRef(interactions)
  interactionsRef.current = interactions
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el || typeof window === 'undefined') return

    let active: PointerState | null = null

    const stampGesture = (name: string, extra?: Record<string, string>) => {
      el.setAttribute('data-gesture', name)
      if (extra) {
        for (const [k, v] of Object.entries(extra)) {
          el.setAttribute(k, v)
        }
      }
      // Double-rAF clear so a CSS animation keyed on this attribute can
      // restart cleanly on back-to-back gestures.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.removeAttribute('data-gesture')
          if (extra) {
            for (const k of Object.keys(extra)) el.removeAttribute(k)
          }
        })
      })
    }

    const fire = (name: string | undefined, extra?: Record<string, string>) => {
      if (!name) return
      stampGesture(name, extra)
      emit(name)
    }

    const clearPull = () => {
      el.style.removeProperty('--ct-pull')
    }

    const onPointerDown = (e: PointerEvent) => {
      if (active) return
      const cfg = interactionsRef.current
      active = {
        id: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startTime: performance.now(),
        longPressTimer: null,
        moved: false,
        pulling: false,
      }
      el.setPointerCapture?.(e.pointerId)
      if (cfg.longPress) {
        active.longPressTimer = window.setTimeout(() => {
          if (active && !active.moved) {
            fire(cfg.longPress)
            active.longPressTimer = null
          }
        }, LONG_PRESS_MS)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!active || e.pointerId !== active.id) return
      const dx = e.clientX - active.startX
      const dy = e.clientY - active.startY
      const dist = Math.hypot(dx, dy)
      const cfg = interactionsRef.current

      if (dist > MOVE_SLOP_PX) {
        active.moved = true
        if (active.longPressTimer !== null) {
          window.clearTimeout(active.longPressTimer)
          active.longPressTimer = null
        }
      }

      // Pull-to-refresh: only on downward drag starting near the top of the
      // wrapper. Writing --ct-pull continuously lets themes style the curl.
      if (
        cfg.pull &&
        dy > 0 &&
        active.startY - el.getBoundingClientRect().top < 80
      ) {
        active.pulling = true
        const t = Math.min(1, dy / PULL_DISTANCE_PX)
        el.style.setProperty('--ct-pull', t.toFixed(3))
      }
    }

    const onPointerEnd = (e: PointerEvent, cancelled: boolean) => {
      if (!active || e.pointerId !== active.id) return
      const cfg = interactionsRef.current
      const dt = performance.now() - active.startTime
      const dx = e.clientX - active.startX
      const dy = e.clientY - active.startY
      const dist = Math.hypot(dx, dy)

      if (active.longPressTimer !== null) {
        window.clearTimeout(active.longPressTimer)
        active.longPressTimer = null
      }

      // Pull release.
      if (active.pulling && cfg.pull) {
        const t = Math.min(1, dy / PULL_DISTANCE_PX)
        const thresholdRaw = getComputedStyle(el)
          .getPropertyValue('--ct-pull-threshold')
          .trim()
        const threshold = thresholdRaw
          ? Number.parseFloat(thresholdRaw) || DEFAULT_PULL_RELEASE_THRESHOLD
          : DEFAULT_PULL_RELEASE_THRESHOLD
        if (!cancelled && t >= threshold) fire(cfg.pull)
        clearPull()
        active = null
        return
      }

      // Swipe.
      if (!cancelled && cfg.swipe && dist >= SWIPE_THRESHOLD_PX && dt < 600) {
        const dir =
          Math.abs(dx) > Math.abs(dy)
            ? dx > 0
              ? 'right'
              : 'left'
            : dy > 0
              ? 'down'
              : 'up'
        fire(cfg.swipe, { 'data-swipe-dir': dir })
        active = null
        return
      }

      // Tap / double-tap (only when not moved beyond slop and short).
      if (!cancelled && !active.moved && dt < TAP_MAX_MS) {
        const now = performance.now()
        const last = lastTapRef.current
        if (
          cfg.doubleTap &&
          last &&
          now - last.time < DOUBLE_TAP_WINDOW_MS &&
          Math.hypot(e.clientX - last.x, e.clientY - last.y) < MOVE_SLOP_PX * 2
        ) {
          fire(cfg.doubleTap)
          lastTapRef.current = null
        } else {
          lastTapRef.current = { time: now, x: e.clientX, y: e.clientY }
          if (cfg.tap) fire(cfg.tap)
        }
      }

      active = null
    }

    const onUp = (e: PointerEvent) => onPointerEnd(e, false)
    const onCancel = (e: PointerEvent) => onPointerEnd(e, true)

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onCancel)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onCancel)
      if (
        active?.longPressTimer !== null &&
        active?.longPressTimer !== undefined
      )
        window.clearTimeout(active.longPressTimer)
      clearPull()
    }
  }, [emit])

  return (
    <div
      ref={wrapperRef}
      data-ct-gestures
      className={className}
      style={{ touchAction: interactions.pull ? 'pan-x' : undefined }}
    >
      {children}
    </div>
  )
}
