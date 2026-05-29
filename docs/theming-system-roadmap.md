# Theming System Roadmap

A multi-phase plan to evolve the declarative theming system far enough that
the [Tide Letters](./theme-concepts.md#theme-1--tide-letters) and
[Pocket Arcade](./theme-concepts.md#theme-2--pocket-arcade) themes can be
implemented at 100% fidelity to their design intent.

Each phase is independently shippable and ordered so that earlier phases
unlock or de-risk later ones. Within a phase, items are listed in suggested
implementation order.

---

## Current state (baseline)

- Themes are pure data: `tokens` (responsive `--ct-*` CSS variables) + a
  `layout` slot tree + an optional `animations` blob of raw CSS.
- Slot types: `timer`, `timer-separator`, `timer-label`, `event-title`,
  `progress`, `background`, `group`.
- Data context exposes `remaining`, `elapsedFraction`, `isDone`; updates on a
  1-second interval.
- Theme is rendered into a `document.body` portal under
  `[data-ct-theme="<id>"]` for style isolation.

What today's system can express: static layout, palette, typography, slow CSS
transitions on token changes, and decorative CSS-only animation loops.

What it cannot express: reactions to ticks/boundaries, T-zero scenes, audio,
haptics, sensors, gestures, idle modes, sprites/particles, sub-second
progress motion, real SVG filters, per-digit DOM, or theme-owned state.

---

## Phase 1 — Reactive timing primitives

Goal: themes can react to _time_, not just display it.

1. **Continuous progress signal.** Update an `--ct-progress` CSS variable on
   the theme root via `requestAnimationFrame` (rate-limited; pauses when tab
   hidden). Expose `useContinuousProgress()` for JS consumers.
2. **Tick attributes.** On every change, set
   `data-just-changed="seconds|minutes|hours|days"` on the affected
   `[data-value]` element for one frame, then remove. Drives pure-CSS
   per-tick animations.
3. **Boundary event bus.** `useCountdownEvents()` returning observables for
   `secondTick`, `minuteBoundary`, `hourBoundary`, `dayBoundary`,
   `finalMinute`, `zero`. Backed by a single shared interval.
4. **Progress motion modifier.** New `motion?: 'linear' | 'breathe' | 'pulse'`
   on `SlotBehaviorMap['progress']`. `breathe` overlays a sine modulation on
   top of monotonic progress (the rising tide).

Unlocks: Tide Letters' per-second ink bleed and breathing tide. Pocket
Arcade's per-minute display flash and seconds pulse driven by real ticks.

---

## Phase 2 — Per-digit DOM and split-flap

Goal: address individual characters, not just unit blocks.

1. **`splitDigits: true`** on `SlotBehaviorMap['timer']`. Renders each digit
   as `<span data-digit data-index="0">…</span>` while keeping
   accessible labels intact.
2. **`transition`** on the timer slot:
   `'none' | 'flip' | 'split-flap' | 'odometer' | 'fade'`. Built-in
   implementations live in `Timer.tsx`; themes opt in declaratively.
3. **Per-digit data attributes.** Expose `data-place="tens|ones"`,
   `data-changing="true"` during the flip transition window. Themes style
   the flip via CSS (3D transforms, pixelated stepped easing).
4. **Stable digit slot for interactions.** Per-digit elements receive their
   own `data-slot="digit"` so future gestures (Phase 6) can target them.

Unlocks: Pocket Arcade's pixelated split-flap. Sets up Tide Letters'
long-press-to-smear (Phase 6).

---

## Phase 3 — State machine: counting / final / done / idle

Goal: themes can express scenes beyond the steady-state count.

1. **Root state attribute.**
   `data-state="counting|final-minute|done|idle"` on the theme root,
   computed by the provider.
2. **Optional alternate layouts** on `CountdownTheme`:
   `finalLayout?`, `doneLayout?`, `idleLayout?` — full slot trees rendered
   in place of `layout` when the corresponding state is active. Crossfade
   handled by the provider with theme-controlled duration tokens.
3. **`idleAfterMs`** field on `CountdownTheme`. Provider tracks
   pointer/keyboard/touch activity and toggles the `idle` state.
4. **One-shot effect scheduling.** A `useThemeEffect(event, fn)` hook for
   running imperative effects (e.g. fireworks emit) on bus events, with
   automatic cleanup on theme unmount.

Unlocks: Tide Letters' T-zero underwater bloom + floating title. Pocket
Arcade's ATTRACT MODE and win-screen reveal.

---

## Phase 4 — Sprite, particle, and effect-layer primitives

Goal: foreground raster art and particle moments.

1. **`sprite` slot.** Props:
   `{ src, frameWidth, frameHeight, frames, fps, playOn: 'mount'|'loop'|EventName, loop }`.
   CSS sprite-sheet animation via `steps()`, with `image-rendering: pixelated`
   when the sprite declares it.
2. **`particles` slot.** Declarative config:
   `{ kind: 'confetti'|'sand'|'bubbles'|'sparks', count, lifetimeMs, palette, trigger: 'loop'|EventName, gravity, wind }`.
   Implemented as a canvas-backed effect layer; respects reduced motion.
3. **`effect-layer` slot.** Generic full-bleed canvas slot with a named
   effect (`'watercolor-bloom' | 'crt-fireworks' | …`) registered in a small
   effects registry. Themes pick effects by name; implementations are
   shared utilities.
4. **Trigger wiring.** All three slot types accept event names from the bus
   in Phase 1; theme authors compose without writing JS.

Unlocks: Tide Letters' sand grains in the margins and underwater bloom at
T-zero. Pocket Arcade's mascots, coin sprite drop, day-rollover confetti,
and pixel-fireworks burst.

---

## Phase 5 — Audio and haptics

Goal: multi-sensory feedback, gated on user gesture and preference.

1. **Audio manifest** on `CountdownTheme`:
   `sounds?: Record<string, { src, volume?, polyphony? }>`.
2. **Sound bindings**:
   `audio?: Partial<Record<EventName, { sound: string, throttleMs? }>>`.
   Provider sets up a single `AudioContext` on first user gesture, preloads
   declared sounds, and plays them on bus events.
3. **Haptics bindings**:
   `haptics?: Partial<Record<EventName, number | number[]>>`. Calls
   `navigator.vibrate` where supported; no-ops otherwise.
4. **User preference + mute UI.** Persisted `audio: on|off` and respects
   `prefers-reduced-motion` as a hint (themes can opt out of muting).

Unlocks: Pocket Arcade's coin clack, hour thunk, day triple-thunk, and win
jingle.

---

## Phase 6 — Gestures and device sensors

Goal: themes are interactive surfaces, not just renderings.

1. **Gesture handler slot wrapper.** Slot nodes accept
   `interactions?: { tap?, longPress?, doubleTap?, pull?, swipe? }` whose
   values are named effects (registered alongside the effects registry in
   Phase 4) or event names dispatched onto the bus.
2. **Pull-to-refresh primitive.** Built-in `pull` interaction on the root
   slot with progress reported as `--ct-pull` (0..1) so themes style the
   curl/snap entirely in CSS.
3. **Tilt context.** Opt-in via `tilt: true` on the theme. Provider handles
   the iOS permission flow, then writes `--ct-tilt-x` and `--ct-tilt-y`
   (normalized −1..1) on the root at rAF rate.
4. **Long-press on digits.** Combined with Phase 2 per-digit DOM, enables
   `interactions: { longPress: 'smear' }` on individual digit slots.

Unlocks: Tide Letters' pull-to-refresh page curl and long-press-to-smear.
Pocket Arcade's CRT glare parallax.

---

## Phase 7 — SVG defs, filters, and masks

Goal: real watercolor and CRT optics, not CSS approximations.

1. **`defs` slot.** Children are rendered once into a shared inert
   `<svg width="0" height="0">` injected by the provider. Holds `<filter>`,
   `<mask>`, `<linearGradient>`, `<symbol>`.
2. **Filter tokens.** Themes can reference filters via
   `--ct-filter-ink: url(#ink-bleed)` and apply them through existing CSS
   variables on slots.
3. **Reusable filter library.** Ship a small set of vetted SVG filters
   (`ink-bleed`, `watercolor`, `crt-warp`, `chromatic-aberration`,
   `paper-grain`) themes can `<use>` by id, plus a documented schema for
   authoring custom ones.
4. **`mask` slot variant** on backgrounds for non-rectangular reveals (the
   curved CRT glass shape).

Unlocks: Tide Letters' real `feTurbulence + feDisplacementMap` ink halos.
Pocket Arcade's curved CRT glass mask and barrel-distortion warp.

---

## Phase 8 — Assets, fonts, and theme packaging

Goal: themes become well-defined bundles, not ad-hoc data files.

1. **Structured `fonts` field.**
   `fonts?: Array<{ family, weights, source: 'google'|'self', href? }>`.
   Provider injects `<link rel="preconnect">` + `<link rel="stylesheet">`
   in `<head>`, sets `font-display: swap`, and waits on `document.fonts.ready`
   for the declared families before exposing `data-fonts-ready="true"` on
   the root. Replaces today's `@import` in injected `<style>`.
2. **Assets manifest.**
   `assets?: Record<string, string>` — sprites, sounds, lottie/json. Bundler
   resolves to hashed URLs; sprites and audio primitives consume by key, not
   by raw URL.
3. **Per-theme asset folders.** Convention:
   `src/countdown/themes/<id>/{theme.ts, sprites/, audio/, defs.svg}`.
   Documented in the theme-authoring guide.
4. **Preload hints.** Provider emits `<link rel="preload">` for declared
   sprites/audio when the theme mounts (above the fold only).

Unlocks: FOUT-free typography across both themes; first-class delivery of
Pocket Arcade's mascot and audio assets and Tide Letters' paper textures.

---

## Phase 9 — Chrome layer and layout escapes

Goal: decorations that intentionally sit outside the safe-area inset.

1. **Chrome slot type.** A `chrome` slot rendered as a sibling of the main
   layout, positioned absolutely against the unpadded viewport. Used for
   bezel bolts, cabinet edges, page-edge tide marks.
2. **`--ct-chrome-*` positioning tokens** exposing the safe-area inset
   values so chrome decorations can reference them when they _do_ want to
   respect notches.
3. **Z-layer tokens** (`--ct-z-bg`, `--ct-z-content`, `--ct-z-chrome`,
   `--ct-z-effect`, `--ct-z-overlay`) so slot ordering is intentional
   across themes.

Unlocks: Pocket Arcade's bolts/bumpers landing on the cabinet corners
rather than in the safe-area padding. Tide Letters' edge-of-page wet
darkening.

---

## Phase 10 — Reduced motion, accessibility, and quality

Goal: every effect added above degrades gracefully and remains accessible.

1. **`reducedMotion` overrides** on `CountdownTheme`:
   `reducedMotion?: { animations?, layout?, audio?, haptics? }`. Provider
   merges these when `prefers-reduced-motion: reduce` is matched, instead
   of the current blanket "animations off".
2. **Accessible alternatives** built into primitives:
   - Sprite/particle slots accept `aria-label` and respect
     `prefers-reduced-motion` by switching to a static representative frame.
   - Audio/haptics respect a `audio`/`vibrate` user toggle and the OS
     reduced-motion hint.
3. **Focus order in themed scenes.** State machine (Phase 3) preserves
   logical focus when swapping layouts; provider runs a focus-trap audit
   in development.
4. **Theme test harness.** Storybook-style entries per theme that drive the
   countdown clock deterministically (mocked `Date.now`) and snapshot:
   the steady state, final-minute, done, and idle. Plus a Vitest helper
   to assert events fire on boundaries.
5. **Performance budgets.** Lighthouse + a small custom probe checking
   sprite/particle FPS on a mid-tier device profile; fail CI when a theme
   regresses below the budget.

Unlocks: both themes shipping with first-class reduced-motion variants,
muteable audio, and confidence that future themes won't silently regress.

---

## Mapping: described moments → required phase(s)

| Moment                                                 | Phases  |
| ------------------------------------------------------ | ------- |
| Tide Letters — per-second ink bleed pulse              | 1       |
| Tide Letters — breathing tide line                     | 1       |
| Tide Letters — real ink-bleed halos around digits      | 7       |
| Tide Letters — sand grains drifting in margins         | 4       |
| Tide Letters — pull-to-refresh page curl               | 6       |
| Tide Letters — long-press digit smear                  | 2, 6    |
| Tide Letters — T-zero underwater bloom + floating word | 3, 4    |
| Tide Letters — accurate parchment + grain typography   | 8       |
| Pocket Arcade — pixelated split-flap digits            | 2       |
| Pocket Arcade — per-minute display flash + coin drop   | 1, 4, 5 |
| Pocket Arcade — hour/day haptics                       | 5       |
| Pocket Arcade — CRT glare parallax on tilt             | 6       |
| Pocket Arcade — curved CRT glass mask + warp           | 7       |
| Pocket Arcade — cabinet bolts/bumpers                  | 9       |
| Pocket Arcade — pixel-art mascots                      | 4, 8    |
| Pocket Arcade — ATTRACT MODE on 30s idle               | 3       |
| Pocket Arcade — T-zero win jingle + fireworks          | 3, 4, 5 |
| Both — graceful reduced-motion variants                | 10      |
