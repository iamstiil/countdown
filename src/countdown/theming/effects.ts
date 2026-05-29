/**
 * Effect registry — named full-bleed canvas effects that themes can compose
 * via `<effect-layer effect="name" options={...} />`.
 *
 * Each effect is a setup function: given a canvas and options, return a
 * teardown function. The host slot handles DPR, sizing, and visibility.
 *
 * Two effects ship by default:
 * - `watercolor-bloom` — slow radial color wash that pulses on each call.
 * - `crt-fireworks` — pixelated radial spark bursts.
 *
 * Themes can register additional effects at module load time via
 * `registerEffect(name, impl)`.
 */

export interface EffectContext {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  dpr: number
  options: Record<string, unknown>
  /** Call to request a one-shot trigger (e.g. from a bus event). */
  onTrigger: (handler: () => void) => () => void
}

export type EffectImpl = (ctx: EffectContext) => () => void

const registry = new Map<string, EffectImpl>()

export function registerEffect(name: string, impl: EffectImpl): void {
  registry.set(name, impl)
}

export function getEffect(name: string): EffectImpl | undefined {
  return registry.get(name)
}

// --- Built-in: watercolor-bloom -------------------------------------------

const watercolorBloom: EffectImpl = ({ canvas, ctx, onTrigger }) => {
  let rafId = 0
  let stopped = false
  let blooms: Array<{
    x: number
    y: number
    r: number
    born: number
    hue: number
  }> = []

  const spawn = () => {
    const rect = canvas.getBoundingClientRect()
    blooms.push({
      x: Math.random() * rect.width,
      y: rect.height * 0.55 + Math.random() * rect.height * 0.4,
      r: 40 + Math.random() * 90,
      born: performance.now(),
      hue: 190 + Math.random() * 40,
    })
  }

  const off = onTrigger(spawn)

  const draw = () => {
    if (stopped) return
    const rect = canvas.getBoundingClientRect()
    ctx.clearRect(0, 0, rect.width, rect.height)
    const now = performance.now()
    const next: typeof blooms = []
    for (const b of blooms) {
      const age = now - b.born
      const life = 2600
      if (age >= life) continue
      const t = age / life
      const r = b.r * (1 + t * 2.4)
      const alpha = (1 - t) * 0.35
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r)
      grad.addColorStop(0, `hsla(${b.hue}, 80%, 70%, ${alpha})`)
      grad.addColorStop(0.6, `hsla(${b.hue}, 80%, 60%, ${alpha * 0.5})`)
      grad.addColorStop(1, `hsla(${b.hue}, 80%, 50%, 0)`)
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2)
      ctx.fill()
      next.push(b)
    }
    blooms = next
    rafId = window.requestAnimationFrame(draw)
  }
  rafId = window.requestAnimationFrame(draw)

  return () => {
    stopped = true
    off()
    if (rafId !== 0) window.cancelAnimationFrame(rafId)
    blooms = []
  }
}

// --- Built-in: crt-fireworks ----------------------------------------------

interface FireworkSpark {
  x: number
  y: number
  vx: number
  vy: number
  born: number
  life: number
  color: string
}

const crtFireworks: EffectImpl = ({ canvas, ctx, onTrigger, options }) => {
  let sparks: FireworkSpark[] = []
  let rafId = 0
  let stopped = false
  const palette = (options.palette as string[] | undefined) ?? [
    '#ff5d8f',
    '#ffd166',
    '#06d6a0',
    '#118ab2',
  ]

  const burst = () => {
    const rect = canvas.getBoundingClientRect()
    const cx = rect.width * (0.2 + Math.random() * 0.6)
    const cy = rect.height * (0.25 + Math.random() * 0.4)
    const count = 36
    const color = palette[Math.floor(Math.random() * palette.length)]!
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.2
      const s = 90 + Math.random() * 110
      sparks.push({
        x: cx,
        y: cy,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        born: performance.now(),
        life: 700 + Math.random() * 350,
        color,
      })
    }
  }

  const off = onTrigger(burst)

  const draw = (now: number) => {
    if (stopped) return
    const rect = canvas.getBoundingClientRect()
    ctx.clearRect(0, 0, rect.width, rect.height)
    const next: FireworkSpark[] = []
    for (const s of sparks) {
      const age = now - s.born
      if (age >= s.life) continue
      const t = age / s.life
      const dt = age / 1000
      const x = s.x + s.vx * dt
      const y = s.y + s.vy * dt + 0.5 * 180 * dt * dt
      ctx.globalAlpha = 1 - t
      ctx.fillStyle = s.color
      ctx.fillRect(Math.round(x), Math.round(y), 3, 3)
      next.push(s)
    }
    ctx.globalAlpha = 1
    sparks = next
    rafId = window.requestAnimationFrame(draw)
  }
  rafId = window.requestAnimationFrame(draw)

  return () => {
    stopped = true
    off()
    if (rafId !== 0) window.cancelAnimationFrame(rafId)
    sparks = []
  }
}

registerEffect('watercolor-bloom', watercolorBloom)
registerEffect('crt-fireworks', crtFireworks)
