import type { ComponentType, CSSProperties, ReactNode } from 'react'

import type { CountdownEventName } from '../data/events'

import type { BuiltInFilterId } from './filterLibrary'

export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl'

export type SlotType =
  | 'timer'
  | 'timer-separator'
  | 'timer-label'
  | 'event-title'
  | 'progress'
  | 'background'
  | 'group'
  | 'sprite'
  | 'particles'
  | 'effect-layer'

/**
 * When a slot reacts to bus events, themes pass either the literal
 * `'mount'` (fire once when mounted) or `'loop'` (repeat continuously)
 * or any `CountdownEventName`.
 */
export type SlotTrigger = 'mount' | 'loop' | CountdownEventName

export interface SlotBehaviorMap {
  timer: {
    format?: 'dhms' | 'hms' | 'ms'
    padZeros?: boolean
    /** Which unit to render. If omitted, renders the full grid. */
    unit?: 'days' | 'hours' | 'minutes' | 'seconds'
    /**
     * When true, render each character of the value as its own
     * `<span data-slot="digit" data-digit data-index data-place>` so themes
     * can address individual digits (transitions, gestures, coloring).
     * The accessible label remains on the unit's [data-value] wrapper.
     */
    splitDigits?: boolean
    /**
     * Built-in change transition applied to each digit when its character
     * changes. Requires `splitDigits: true`. Themes can also key purely off
     * `[data-digit][data-changing="true"]` for custom animation.
     */
    transition?: 'none' | 'flip' | 'split-flap' | 'odometer' | 'fade'
  }
  'timer-separator': { char?: string }
  'timer-label': {
    unit: 'days' | 'hours' | 'minutes' | 'seconds'
    text?: string
  }
  'event-title': { source?: 'title' | 'subtitle' }
  progress: {
    kind?: 'bar' | 'ring' | 'segments'
    direction?: 'elapsed' | 'remaining'
    /**
     * How the rendered value moves over time. `linear` (default) is the
     * monotonic elapsed fraction sampled every second. `breathe` overlays a
     * slow sine modulation on top of monotonic progress — useful for things
     * like a tide that swells and recedes while net-rising. `pulse` adds a
     * short pip on each `secondTick`.
     */
    motion?: 'linear' | 'breathe' | 'pulse'
    /** Amplitude of the breathe modulation (0..1 of total span). Default 0.015. */
    breatheAmplitude?: number
    /** Period of the breathe modulation in milliseconds. Default 9000. */
    breathePeriodMs?: number
  }
  background: {
    kind?: 'image' | 'video' | 'gradient' | 'canvas'
    src?: string
    loop?: boolean
    /**
     * Optional SVG mask reference applied as `mask-image` (and
     * `-webkit-mask-image`). Pair with a `<mask id="…">` declared via
     * `theme.defs.raw` to clip non-rectangular reveals (e.g. a curved
     * CRT glass shape). Accepts any `mask-image` value, but the typical
     * form is `url(#id)`.
     */
    mask?: string
  }
  group: Record<string, never>
  sprite: {
    /** URL or data URI of the sprite sheet image. */
    src: string
    /** Single-frame width in CSS pixels (sheet is a horizontal strip). */
    frameWidth: number
    /** Single-frame height in CSS pixels. */
    frameHeight: number
    /** Total frame count in the strip. */
    frames: number
    /** Playback speed in frames per second. Default 8. */
    fps?: number
    /** When playback should (re)start. Default `'mount'`. */
    playOn?: SlotTrigger
    /** Loop the animation indefinitely. Default false. */
    loop?: boolean
    /** Render with `image-rendering: pixelated` for pixel art. */
    pixelated?: boolean
    /** Optional accessible label; sprite gets `role="img"` when set. */
    label?: string
  }
  particles: {
    /** Built-in particle kind. */
    kind: 'confetti' | 'sand' | 'bubbles' | 'sparks'
    /** Number of particles in the system at peak. Default kind-specific. */
    count?: number
    /** Per-particle lifetime in ms. Default kind-specific. */
    lifetimeMs?: number
    /** Color palette (CSS colors) picked from at random. */
    palette?: string[]
    /** When new bursts should emit. `'loop'` = continuous spawn. */
    trigger?: SlotTrigger
    /** Gravity in px/sec². Positive = down. Default kind-specific. */
    gravity?: number
    /** Horizontal drift in px/sec. Default 0. */
    wind?: number
  }
  'effect-layer': {
    /**
     * Named effect implementation. Effects live in a small registry
     * (`effectRegistry`) so theme authors compose by name rather than
     * shipping their own canvas code.
     */
    effect: string
    /** Free-form options forwarded to the effect implementation. */
    options?: Record<string, unknown>
    /** When the effect should (re)trigger. Default `'mount'`. */
    trigger?: SlotTrigger
  }
}

/** Mobile-first responsive value: `base` required, overrides optional. */
export type Responsive<T> = { base: T } & Partial<
  Record<Exclude<Breakpoint, 'base'>, T>
>

export interface SlotClasses {
  className?: Responsive<string>
}

/**
 * Declarative gesture bindings on a slot. Values are free-form action
 * names dispatched to the action bus (see `useGestureAction`) when the
 * gesture fires; the gesture wrapper also stamps `data-gesture="<name>"`
 * on its DOM root for one frame so themes can react in pure CSS.
 */
export interface SlotInteractions {
  /** Single pointer tap (no significant movement, under 250ms). */
  tap?: string
  /** Two taps within ~280ms on the same element. */
  doubleTap?: string
  /** Pointer held for ~500ms without moving past the slop threshold. */
  longPress?: string
  /**
   * Horizontal/vertical swipe past a distance threshold. When fired, the
   * wrapper also stamps `data-swipe-dir` ('up' | 'down' | 'left' | 'right').
   */
  swipe?: string
  /**
   * Pull-to-refresh on a downward drag from the top edge. While the user
   * drags the wrapper writes `--ct-pull` (0..1) so themes can style the
   * curl entirely in CSS. The action fires once when the user releases
   * past `--ct-pull-threshold` (default 0.6).
   */
  pull?: string
}

export interface SlotNode<K extends SlotType = SlotType> {
  id: string
  type: K
  visible?: Responsive<boolean>
  /** Per-slot CSS variable overrides applied as inline style on the slot root. */
  vars?: Responsive<Record<string, string>>
  classes?: SlotClasses
  children?: SlotNode[]
  props?: SlotBehaviorMap[K]
  /** Optional gesture bindings (Phase 6). */
  interactions?: SlotInteractions
}

export interface TokenSet {
  color: Record<string, string>
  space: Record<string, string>
  font: Record<string, string>
  size: Record<string, string>
  motion: Record<string, string>
  effect: Record<string, string>
}

export type PartialTokens = Partial<{
  [K in keyof TokenSet]: Partial<TokenSet[K]>
}>

/**
 * Lifecycle state the countdown can be in. Stamped onto the theme root as
 * `data-state="<state>"` by `CountdownThemeProvider` so themes can react in
 * CSS. Themes may also supply alternate layouts (see `CountdownTheme`).
 *
 * - `counting` — the default steady-state count.
 * - `final-minute` — remaining time has crossed below one minute. Themes
 *   typically dial up intensity here.
 * - `done` — remaining time has reached zero. Themes may show a "done"
 *   reveal (bloom, win screen, etc.).
 * - `idle` — user has been inactive for at least `idleAfterMs`. Idle
 *   preempts `counting` and `final-minute` but never `done`.
 */
export type CountdownState = 'counting' | 'final-minute' | 'done' | 'idle'

/**
 * Declaration of a single audio sample. Buffer is preloaded by the audio
 * engine once the user has interacted (browsers gate AudioContext on a
 * user gesture).
 */
export interface SoundDecl {
  /** URL of a short audio file (mp3/ogg/wav). Kept short — these are SFX. */
  src: string
  /** 0..1 linear gain. Default 1. */
  volume?: number
  /**
   * Max simultaneous voices for the sound. Default 4. Additional plays
   * within the polyphony window are dropped.
   */
  polyphony?: number
}

/**
 * Binding from a bus event to a declared sound. Optional `throttleMs`
 * suppresses repeated plays within the window (e.g. avoid machine-gunning
 * a coin clack during a fast tick burst).
 */
export interface AudioBinding {
  sound: string
  throttleMs?: number
}

/**
 * Vibration pattern, passed straight to `navigator.vibrate`. A single
 * number is a one-shot ms duration; an array alternates vibrate/pause.
 */
export type HapticPattern = number | number[]

export interface CountdownTheme {
  id: string
  name: string
  tokens: Responsive<PartialTokens>
  layout: SlotNode<'group'>
  /**
   * Optional alternate layout rendered when the countdown enters the
   * final minute. Falls back to `layout` when absent.
   */
  finalLayout?: SlotNode<'group'>
  /**
   * Optional alternate layout rendered when the countdown reaches zero.
   * Falls back to `layout` when absent.
   */
  doneLayout?: SlotNode<'group'>
  /**
   * Optional alternate layout rendered after the user has been inactive
   * for `idleAfterMs`. Falls back to `layout` when absent.
   */
  idleLayout?: SlotNode<'group'>
  /**
   * Milliseconds of pointer/key/touch inactivity before the theme switches
   * to the `idle` state. Omit to disable idle entirely.
   */
  idleAfterMs?: number
  /**
   * Named SFX bank. Preloaded by the audio engine on first user gesture.
   * Keys are free-form theme-local identifiers referenced by `audio`.
   */
  sounds?: Record<string, SoundDecl>
  /**
   * Bus-event-to-sound bindings. The audio engine plays each binding's
   * sample on emission (respecting throttling, mute, and reduced-motion).
   */
  audio?: Partial<Record<CountdownEventName, AudioBinding>>
  /**
   * Bus-event-to-vibration bindings. No-op on devices/browsers without
   * `navigator.vibrate`.
   */
  haptics?: Partial<Record<CountdownEventName, HapticPattern>>
  /**
   * When true (default false), the theme opts OUT of the reduced-motion
   * audio suppression — useful for themes where audio is informational
   * (e.g. final-minute warning) rather than decorative.
   */
  audioIgnoresReducedMotion?: boolean
  /**
   * Targeted overrides applied when the user has
   * `prefers-reduced-motion: reduce` active. Each field replaces the
   * corresponding top-level field; omit a field to inherit. Unlike the
   * blunt "kill all animations" approach, this lets themes ship a
   * deliberate reduced-motion variant (e.g. a quieter layout, a small
   * subset of audio cues, no haptics).
   *
   * When `reducedMotion.layout` is provided it overrides the default
   * `layout` (and is itself overridable by per-state `finalLayout` /
   * `doneLayout` / `idleLayout`).
   */
  reducedMotion?: {
    /** Replaces `theme.animations` wholesale when set. */
    animations?: Record<string, string>
    /** Replaces `theme.layout` wholesale when set. */
    layout?: SlotNode<'group'>
    /** Replaces `theme.audio` wholesale when set (use `{}` to silence). */
    audio?: Partial<Record<CountdownEventName, AudioBinding>>
    /** Replaces `theme.haptics` wholesale when set (use `{}` to silence). */
    haptics?: Partial<Record<CountdownEventName, HapticPattern>>
  }
  /**
   * Opt into device-orientation parallax. When true, the provider
   * requests permission on iOS (gesture-gated) and writes
   * `--ct-tilt-x` and `--ct-tilt-y` (normalized −1..1) on the theme
   * root at rAF rate. No-ops on devices without DeviceOrientation.
   */
  tilt?: boolean
  /**
   * Declared web fonts. The provider injects `<link>` tags into
   * `<head>` (with `font-display: swap` semantics via Google's
   * `&display=swap` query), then waits on `document.fonts.ready` and
   * stamps `data-fonts-ready="true"` on the theme root once every
   * declared family has loaded. Themes that key text styling on
   * `[data-fonts-ready="true"]` get a one-shot FOUT-free reveal.
   */
  fonts?: ReadonlyArray<FontDecl>
  /**
   * Named asset URLs. Themes reference assets by key from sprite/audio
   * slots using the `asset:<key>` URI scheme, decoupling the theme
   * declaration from the eventual hashed bundle URL. The provider also
   * emits `<link rel="preload">` hints for asset URLs likely to be used
   * above the fold.
   */
  assets?: Record<string, AssetDecl>
  /**
   * SVG defs (filters, masks, gradients, symbols) injected once into a
   * hidden inert `<svg>` rooted in the theme container. Themes apply
   * them via CSS variables, e.g.
   *
   *     vars: { '--ct-filter-ink': 'url(#ct-ink-bleed)' }
   *
   * `filters` lists built-in filter ids from `filterLibrary`; `raw`
   * concatenates arbitrary SVG markup for custom defs. Both are
   * optional and either may be used alone.
   */
  defs?: {
    filters?: ReadonlyArray<BuiltInFilterId>
    raw?: string
  }
  /** Optional keyframes/animation rules injected as a <style> block. */
  animations?: Record<string, string>
}

/**
 * A declared web font. `source: 'google'` builds a Google Fonts CSS2
 * URL with `&display=swap`; `source: 'self'` injects a stylesheet
 * `href` you ship yourself (you're responsible for the `@font-face`
 * rules inside it).
 */
export interface FontDecl {
  family: string
  weights?: ReadonlyArray<number>
  source: 'google' | 'self'
  /** Required when `source === 'self'`. Ignored for `'google'`. */
  href?: string
}

/**
 * A named asset. A bare `string` is shorthand for `{ url, preload: false }`.
 * Setting `preload: true` makes the provider emit a `<link rel="preload">`
 * hint when the theme mounts.
 */
export type AssetDecl =
  | string
  | {
      url: string
      /** `image` and `audio` cover the only kinds we currently consume. */
      as?: 'image' | 'audio' | 'fetch'
      preload?: boolean
      /** Required for `as: 'fetch'` cross-origin preloads. */
      crossOrigin?: 'anonymous' | 'use-credentials'
    }

export interface SlotComponentProps<K extends SlotType = SlotType> {
  id: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
  props?: SlotBehaviorMap[K]
}

export type SlotComponent<K extends SlotType = SlotType> = ComponentType<
  SlotComponentProps<K>
>
