import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { isAudioEnabled, subscribeAudioEnabled } from '../data/audioPreference'
import {
  useContinuousProgress,
  useCountdownData,
  useCountdownEvents,
} from '../data/CountdownDataContext'
import type { CountdownEventName } from '../data/events'

import { createAudioEngine } from './audioEngine'
import { buildTokenCSS } from './buildTokenCSS'
import { vibrate } from './haptics'
import { SlotRenderer } from './Renderer'
import type { CountdownState, CountdownTheme, SlotNode } from './types'

export interface CountdownThemeProviderProps {
  theme: CountdownTheme
}

/** Activity events that reset the idle timer. */
const ACTIVITY_EVENTS = [
  'pointermove',
  'pointerdown',
  'keydown',
  'touchstart',
  'wheel',
] as const

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n))

/**
 * Roots a single countdown theme. Tokens are scoped to [data-ct-theme="id"]
 * so they cannot leak into the surrounding (landing page) design system.
 *
 * Rendered into document.body via portal so no ancestor layout/transform
 * can constrain its full-viewport coverage.
 */
export function CountdownThemeProvider({ theme }: CountdownThemeProviderProps) {
  const tokenCSS = useMemo(() => buildTokenCSS(theme), [theme])
  const animationCSS = useMemo(
    () => (theme.animations ? Object.values(theme.animations).join('\n') : ''),
    [theme],
  )

  const rootRef = useRef<HTMLDivElement | null>(null)
  const { subscribe } = useContinuousProgress()
  const { lifecycleState } = useCountdownData()

  // Drive the continuous --ct-progress CSS variable on the theme root.
  // Themes can read it via `var(--ct-progress)` for smooth motion that
  // doesn't depend on React's 1Hz tick.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    return subscribe((value) => {
      el.style.setProperty('--ct-progress', value.toFixed(4))
    })
  }, [subscribe])

  // --- Idle tracking ---------------------------------------------------
  // Idle is orthogonal to the lifecycle state but preempts it (except
  // `done`, which always wins so the "reveal" never disappears).
  const [isIdle, setIsIdle] = useState(false)
  const idleAfterMs = theme.idleAfterMs

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!idleAfterMs || idleAfterMs <= 0) {
      setIsIdle(false)
      return
    }

    let timeoutId: number | null = null
    const arm = () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => setIsIdle(true), idleAfterMs)
    }
    const onActivity = () => {
      setIsIdle(false)
      arm()
    }

    arm()
    for (const evt of ACTIVITY_EVENTS) {
      window.addEventListener(evt, onActivity, { passive: true })
    }
    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId)
      for (const evt of ACTIVITY_EVENTS) {
        window.removeEventListener(evt, onActivity)
      }
    }
  }, [idleAfterMs])

  // --- Tilt parallax ---------------------------------------------------
  // Writes --ct-tilt-x and --ct-tilt-y (normalized -1..1) on the theme
  // root at rAF rate. On iOS the DeviceOrientationEvent API is gated
  // behind a permission prompt that must be triggered from a user
  // gesture; we attach a one-shot gesture listener for that.
  useEffect(() => {
    if (!theme.tilt) return
    if (typeof window === 'undefined') return
    if (typeof DeviceOrientationEvent === 'undefined') return

    const rootRefForCleanup = rootRef.current
    let stopped = false
    let rafId = 0
    let latestX = 0
    let latestY = 0
    let detachPermission = () => {}

    const onOrientation = (e: DeviceOrientationEvent) => {
      // beta: front-to-back tilt (-180..180), gamma: left-to-right (-90..90).
      // Normalize a comfortable phone-tilt range (~30°) to -1..1.
      const gy = e.beta ?? 0
      const gx = e.gamma ?? 0
      latestX = clamp(gx / 30, -1, 1)
      latestY = clamp(gy / 30, -1, 1)
    }

    const loop = () => {
      if (stopped) return
      const el = rootRef.current
      if (el) {
        el.style.setProperty('--ct-tilt-x', latestX.toFixed(3))
        el.style.setProperty('--ct-tilt-y', latestY.toFixed(3))
      }
      rafId = window.requestAnimationFrame(loop)
    }

    const attach = () => {
      window.addEventListener('deviceorientation', onOrientation, {
        passive: true,
      })
      rafId = window.requestAnimationFrame(loop)
    }

    const maybeRequestPermission = (
      Ctor: typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<'granted' | 'denied'>
      },
    ) => {
      if (typeof Ctor.requestPermission !== 'function') {
        attach()
        return
      }
      // iOS-style: must be triggered from a user gesture.
      const onGesture = () => {
        Ctor.requestPermission!()
          .then((result) => {
            if (result === 'granted') attach()
          })
          .catch(() => {
            /* user denied or browser refused */
          })
      }
      const opts = { once: true, passive: true } as AddEventListenerOptions
      window.addEventListener('pointerdown', onGesture, opts)
      window.addEventListener('keydown', onGesture, opts)
      window.addEventListener('touchstart', onGesture, opts)
      detachPermission = () => {
        window.removeEventListener('pointerdown', onGesture)
        window.removeEventListener('keydown', onGesture)
        window.removeEventListener('touchstart', onGesture)
      }
    }

    maybeRequestPermission(
      DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<'granted' | 'denied'>
      },
    )

    return () => {
      stopped = true
      detachPermission()
      window.removeEventListener('deviceorientation', onOrientation)
      if (rafId !== 0) window.cancelAnimationFrame(rafId)
      const el = rootRefForCleanup
      if (el) {
        el.style.removeProperty('--ct-tilt-x')
        el.style.removeProperty('--ct-tilt-y')
      }
    }
  }, [theme.tilt])

  // --- Audio + haptics -------------------------------------------------
  // We track audio-enabled in a ref so the engine's closure sees the
  // current value without recreating the engine on every toggle.
  const { subscribe: subscribeBus } = useCountdownEvents()
  const audioEnabledRef = useRef<boolean>(true)

  useEffect(() => {
    audioEnabledRef.current = isAudioEnabled()
    return subscribeAudioEnabled((on) => {
      audioEnabledRef.current = on
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!theme.audio && !theme.sounds && !theme.haptics) return

    const reducedMotion = () =>
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const ignore = theme.audioIgnoresReducedMotion ?? false

    const engine = createAudioEngine({
      enabled: () => audioEnabledRef.current,
      reducedMotion,
      audioIgnoresReducedMotion: ignore,
    })

    if (theme.sounds) {
      void engine.preload(theme.sounds)
    }

    const unsubs: Array<() => void> = []
    const audioMap = theme.audio
    if (audioMap) {
      for (const [event, binding] of Object.entries(audioMap) as Array<
        [CountdownEventName, NonNullable<typeof audioMap>[CountdownEventName]]
      >) {
        if (!binding) continue
        unsubs.push(
          subscribeBus(event, () => {
            engine.playBinding(event, binding)
          }),
        )
      }
    }

    const hapticsMap = theme.haptics
    if (hapticsMap) {
      for (const [event, pattern] of Object.entries(hapticsMap) as Array<
        [CountdownEventName, NonNullable<typeof hapticsMap>[CountdownEventName]]
      >) {
        if (pattern === undefined) continue
        unsubs.push(
          subscribeBus(event, () => {
            vibrate(pattern, {
              enabled: () => audioEnabledRef.current,
              reducedMotion,
              ignoreReducedMotion: ignore,
            })
          }),
        )
      }
    }

    return () => {
      for (const off of unsubs) off()
      engine.dispose()
    }
  }, [
    theme.audio,
    theme.haptics,
    theme.sounds,
    theme.audioIgnoresReducedMotion,
    subscribeBus,
  ])

  // --- Resolve effective state and layout ------------------------------
  const state: CountdownState =
    lifecycleState === 'done' ? 'done' : isIdle ? 'idle' : lifecycleState // 'counting' | 'final-minute'

  const activeLayout = pickLayout(theme, state)

  // --- Crossfade between layouts ---------------------------------------
  // When the layout reference changes we render the outgoing tree alongside
  // the incoming one for `--ct-state-fade-ms` so themes can fade between
  // scenes purely in CSS. Themes can override the duration via the
  // --ct-state-fade-ms token.
  const [layers, setLayers] = useState<
    Array<{ key: number; node: SlotNode<'group'> }>
  >(() => [{ key: 0, node: activeLayout }])
  const layerKeyRef = useRef(0)
  const lastLayoutRef = useRef(activeLayout)

  useEffect(() => {
    if (activeLayout === lastLayoutRef.current) return
    lastLayoutRef.current = activeLayout
    layerKeyRef.current += 1
    const newKey = layerKeyRef.current
    setLayers((prev) => [...prev, { key: newKey, node: activeLayout }])

    // Read the fade-ms token from the live theme root. Falls back to 320ms
    // if not set or unparseable.
    const fadeMs = readFadeMs(rootRef.current) ?? 320
    const t = window.setTimeout(() => {
      setLayers((prev) => prev.filter((l) => l.key === newKey))
    }, fadeMs)
    return () => window.clearTimeout(t)
  }, [activeLayout])

  const tree = (
    <div
      ref={rootRef}
      data-ct-theme={theme.id}
      data-state={state}
      className="ct-root"
    >
      <style>{tokenCSS}</style>
      {animationCSS && <style>{animationCSS}</style>}
      {layers.map((layer, idx) => (
        <div
          key={layer.key}
          className="ct-layer"
          data-layer-phase={idx === layers.length - 1 ? 'enter' : 'exit'}
        >
          <SlotRenderer node={layer.node} />
        </div>
      ))}
    </div>
  )

  if (typeof document === 'undefined') return tree
  return createPortal(tree, document.body)
}

function pickLayout(
  theme: CountdownTheme,
  state: CountdownState,
): SlotNode<'group'> {
  switch (state) {
    case 'done':
      return theme.doneLayout ?? theme.layout
    case 'final-minute':
      return theme.finalLayout ?? theme.layout
    case 'idle':
      return theme.idleLayout ?? theme.layout
    case 'counting':
    default:
      return theme.layout
  }
}

function readFadeMs(el: HTMLElement | null): number | null {
  if (!el || typeof window === 'undefined') return null
  const raw = getComputedStyle(el).getPropertyValue('--ct-state-fade-ms').trim()
  if (!raw) return null
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) && n >= 0 ? n : null
}
