import { useEffect, useRef } from 'react'

import type { SlotComponentProps } from '../theming/types'
import { useSlotTrigger } from '../theming/useSlotTrigger'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  life: number
  born: number
  color: string
  size: number
}

interface KindDefaults {
  count: number
  lifetimeMs: number
  gravity: number
  emit: (
    canvas: HTMLCanvasElement,
    palette: string[],
    now: number,
    wind: number,
    gravity: number,
    lifetimeMs: number,
  ) => Particle
}

const KIND_DEFAULTS: Record<
  'confetti' | 'sand' | 'bubbles' | 'sparks',
  KindDefaults
> = {
  confetti: {
    count: 80,
    lifetimeMs: 2400,
    gravity: 700,
    emit(canvas, palette, now, wind, gravity, lifetimeMs) {
      const w = canvas.width
      return {
        x: Math.random() * w,
        y: -8,
        vx: (Math.random() - 0.5) * 160 + wind,
        vy: Math.random() * 60,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 8,
        life: lifetimeMs,
        born: now,
        color: palette[Math.floor(Math.random() * palette.length)]!,
        size: 4 + Math.random() * 5,
      }
    },
  },
  sand: {
    count: 120,
    lifetimeMs: 3200,
    gravity: 60,
    emit(canvas, palette, now, wind, gravity, lifetimeMs) {
      const w = canvas.width
      const h = canvas.height
      return {
        x: Math.random() * w,
        y: h - 4,
        vx: wind + (Math.random() - 0.5) * 20,
        vy: -10 - Math.random() * 12,
        rot: 0,
        vr: 0,
        life: lifetimeMs,
        born: now,
        color: palette[Math.floor(Math.random() * palette.length)]!,
        size: 1 + Math.random() * 1.5,
      }
    },
  },
  bubbles: {
    count: 40,
    lifetimeMs: 4500,
    gravity: -90,
    emit(canvas, palette, now, wind, gravity, lifetimeMs) {
      const w = canvas.width
      const h = canvas.height
      return {
        x: Math.random() * w,
        y: h + 8,
        vx: wind + (Math.random() - 0.5) * 25,
        vy: -30 - Math.random() * 40,
        rot: 0,
        vr: 0,
        life: lifetimeMs,
        born: now,
        color: palette[Math.floor(Math.random() * palette.length)]!,
        size: 3 + Math.random() * 8,
      }
    },
  },
  sparks: {
    count: 60,
    lifetimeMs: 900,
    gravity: 380,
    emit(canvas, palette, now, wind, gravity, lifetimeMs) {
      const w = canvas.width
      const h = canvas.height
      const angle = Math.random() * Math.PI * 2
      const speed = 180 + Math.random() * 220
      return {
        x: w / 2,
        y: h / 2,
        vx: Math.cos(angle) * speed + wind,
        vy: Math.sin(angle) * speed,
        rot: 0,
        vr: 0,
        life: lifetimeMs,
        born: now,
        color: palette[Math.floor(Math.random() * palette.length)]!,
        size: 2 + Math.random() * 2,
      }
    },
  },
}

const DEFAULT_PALETTES: Record<string, string[]> = {
  confetti: ['#ff5d8f', '#ffd166', '#06d6a0', '#118ab2', '#ef476f'],
  sand: ['#e6c98a', '#d6b06c', '#c39658', '#f0d9a0'],
  bubbles: ['rgba(255,255,255,0.6)', 'rgba(180,220,255,0.5)'],
  sparks: ['#ffd166', '#ffffff', '#ff8c42'],
}

/**
 * `particles` slot — canvas-backed declarative particle layer.
 *
 * Honors `prefers-reduced-motion`: when reduced motion is on, the canvas
 * stays mounted (so layout doesn't shift) but no particles are spawned.
 */
export function Particles({
  id,
  className,
  style,
  props,
}: SlotComponentProps<'particles'>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const burstRef = useRef(0)

  const trigger = props?.trigger ?? 'loop'

  useSlotTrigger(trigger, () => {
    // Each trigger bumps the burst counter. The rAF loop reads this and
    // emits a fresh batch of particles when it changes.
    burstRef.current += 1
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const canvas = canvasRef.current
    if (!canvas) return

    const cfg = props
    if (!cfg) return

    const defaults = KIND_DEFAULTS[cfg.kind]
    const count = cfg.count ?? defaults.count
    const lifetimeMs = cfg.lifetimeMs ?? defaults.lifetimeMs
    const gravity = cfg.gravity ?? defaults.gravity
    const wind = cfg.wind ?? 0
    const palette = cfg.palette ?? DEFAULT_PALETTES[cfg.kind] ?? ['#ffffff']

    const reduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let lastBurst = burstRef.current
    let lastSpawn = performance.now()
    let rafId = 0
    let stopped = false

    const emitBurst = (now: number) => {
      if (reduced) return
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(
          defaults.emit(canvas, palette, now, wind, gravity, lifetimeMs),
        )
      }
    }

    const tick = (now: number) => {
      if (stopped) return
      const dt = Math.min(0.05, (now - lastSpawn) / 1000)
      lastSpawn = now

      // Trigger-driven bursts.
      if (burstRef.current !== lastBurst) {
        lastBurst = burstRef.current
        emitBurst(now)
      }
      // Loop mode emits continuously to maintain `count` live particles.
      if (trigger === 'loop' && !reduced) {
        const target = count
        while (particlesRef.current.length < target) {
          particlesRef.current.push(
            defaults.emit(canvas, palette, now, wind, gravity, lifetimeMs),
          )
        }
      }

      // Update + draw.
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)
      const next: Particle[] = []
      for (const p of particlesRef.current) {
        const age = now - p.born
        if (age >= p.life) continue
        p.vy += gravity * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.vr * dt
        const alpha = 1 - age / p.life
        ctx.globalAlpha = Math.max(0, alpha)
        ctx.fillStyle = p.color
        if (cfg.kind === 'bubbles') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (cfg.kind === 'confetti') {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
          ctx.restore()
        } else {
          ctx.fillRect(p.x, p.y, p.size, p.size)
        }
        next.push(p)
      }
      ctx.globalAlpha = 1
      particlesRef.current = next

      rafId = window.requestAnimationFrame(tick)
    }

    // Initial burst for non-loop triggers fires from useSlotTrigger on mount.
    rafId = window.requestAnimationFrame(tick)

    const handleVisibility = () => {
      if (document.hidden) {
        if (rafId !== 0) {
          window.cancelAnimationFrame(rafId)
          rafId = 0
        }
      } else if (rafId === 0) {
        lastSpawn = performance.now()
        rafId = window.requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stopped = true
      if (rafId !== 0) window.cancelAnimationFrame(rafId)
      ro.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      particlesRef.current = []
    }
  }, [props, trigger])

  return (
    <canvas
      ref={canvasRef}
      data-slot="particles"
      data-particles-id={id}
      data-kind={props?.kind}
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
