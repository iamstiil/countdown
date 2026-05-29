import { useEffect, useRef } from 'react'

import { getEffect } from '../theming/effects'
import type { SlotComponentProps } from '../theming/types'
import { useSlotTrigger } from '../theming/useSlotTrigger'

/**
 * `effect-layer` slot — full-bleed canvas hosting a named effect from the
 * effect registry. The slot owns canvas sizing/DPR and exposes a tiny
 * trigger API so the effect can react to bus events without subscribing
 * to React context directly.
 *
 * `aria-hidden` because effects are decorative; never put information here
 * that isn't also available textually.
 */
export function EffectLayer({
  id,
  className,
  style,
  props,
}: SlotComponentProps<'effect-layer'>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const triggerHandlersRef = useRef<Set<() => void>>(new Set())

  const trigger = props?.trigger ?? 'mount'

  useSlotTrigger(trigger, () => {
    for (const h of triggerHandlersRef.current) {
      try {
        h()
      } catch (e) {
        console.error('[effect-layer] trigger handler threw:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const canvas = canvasRef.current
    if (!canvas || !props) return
    const impl = getEffect(props.effect)
    if (!impl) {
      console.warn(`[effect-layer] no effect registered for "${props.effect}"`)
      return
    }
    const ctx2d = canvas.getContext('2d')
    if (!ctx2d) return

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const handlers = triggerHandlersRef.current
    const teardown = impl({
      canvas,
      ctx: ctx2d,
      dpr,
      options: props.options ?? {},
      onTrigger: (h) => {
        handlers.add(h)
        return () => handlers.delete(h)
      },
    })

    return () => {
      teardown()
      ro.disconnect()
    }
  }, [props])

  return (
    <canvas
      ref={canvasRef}
      data-slot="effect-layer"
      data-effect-id={id}
      data-effect={props?.effect}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}
