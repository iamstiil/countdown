# Theme Concepts

Two flagship countdown themes used to drive the theming-system roadmap. Both
are designed to feel meaningfully different in tempo, material, and emotion.

---

## Theme 1 — Tide Letters

**Central concept:** Time as handwritten ink dissolving into seawater. The
countdown is a love letter the ocean is slowly washing away — every second
erases a little more of what was written.

### Visual style

A tall, portrait-oriented "page" of warm, fibrous paper fills the screen. The
countdown digits are rendered as wet calligraphic ink — uneven stroke weights,
slight bleed halos, occasional ink pooling at stroke ends. A soft tideline of
water sits at the bottom of the page and creeps upward as the event
approaches, leaving the paper darker and translucent where it has touched.
Tiny grains of sand and bits of seafoam settle in the margins.

### Color palette direction

Sun-bleached parchment (warm bone, oat, pale apricot) for the page; deep
squid-ink indigo and walnut brown for the lettering; the rising tide shifts
through brine green, foggy teal, and a final cold moonstone blue right before
zero. No pure black, no pure white — everything sits slightly off-axis, like a
sun-faded photograph.

### UI behavior / animations

- Each ticking second causes a small ink bleed pulse around the active digit,
  as if freshly written.
- The tide line doesn't tick — it breathes, swelling and receding with a slow
  sine wave while net-rising over the full duration.
- Pull-to-refresh: the page curls like wet paper and snaps flat.
- Long-press a digit: a droplet falls and smears that digit briefly before it
  reforms.
- At T-zero: the tide overtakes the last digit, the ink disperses into a
  quiet underwater bloom, and a single legible word from the event title
  floats to the surface.

### Emotional experience

Wistful, intimate, slow-burning. It reframes anticipation as something tender
and finite — the user feels they are _witnessing_ time rather than racing it.
Best for weddings, anniversaries, sabbaticals, due dates.

---

## Theme 2 — Pocket Arcade

**Central concept:** The countdown as a coin-op cabinet you carry in your
pocket. Time is the high score being chased — loud, tactile, and a little
ridiculous.

### Visual style

A chunky, isometric "cabinet" sits in the middle of the screen with the
countdown rendered on a curved CRT-style display, complete with subtle
scanlines, screen burn-in, and a faint convex glare. Around the display are
physical-feeling chrome bezels, rubber bumpers, a slot for a coin, and a row
of colored arcade buttons that double as the app's nav. Pixel-art mascots (a
sleepy octopus, a grumpy toaster — rotating set) peek from the cabinet
corners and react to user interaction.

### Color palette direction

Saturated candy-machine primaries — bubblegum magenta, electric cyan,
lemonade yellow — set against a matte charcoal cabinet body with brushed
chrome trim. CRT glow leaks a soft halation of warm pink and cool teal onto
the surrounding bezel. Deliberately _not_ synthwave: no purple-to-pink
gradients, no neon grids, no '80s sun.

### UI behavior / animations

- Every passing minute drops a chunky pixel "coin" into the slot with a
  clack; the display flashes once.
- The digits flip with a mechanical split-flap motion, but pixelated.
- Haptic "thunk" on every hour boundary; a triple-thunk and confetti of pixel
  sprites at every day boundary.
- Tilting the phone makes the CRT glare slide realistically across the curved
  glass.
- Idle for 30s: an "ATTRACT MODE" demo loop plays — the mascots juggle the
  digits, then the real countdown snaps back when you tap.
- At T-zero: the cabinet plays a short win jingle, the screen fills with a
  pixel-art fireworks burst, and the score board reveals the event title in
  marquee letters.

### Emotional experience

Joyful, kinetic, mischievous. Anticipation becomes a game you're winning by
waiting. Best for birthdays, trip launches, game/movie releases, kids'
countdowns.

---

## Theme 3 — Neon Grid

**Central concept:** The countdown as an incoming transmission from a
chrome horizon. The viewer is standing on an infinite grid plain that
recedes to a vanishing point; the timer hangs in mid-air above it as a
hovering neon readout. Time arriving from the future, not slipping into
the past.

### Visual style

A near-black cool void fills the screen. The bottom half of the viewport
is a cyan perspective grid floor, tilted into the ground plane and
scrolling slowly toward the camera; the top half mirrors a much fainter
ceiling grid so the viewer reads the scene as a corridor rather than a
single rotated plane. Where the two planes meet, a horizontal **horizon
beam** glows — a tight cyan core wrapped in a wider magenta secondary
bloom that breathes in and out. The timer floats just above the horizon
in heavy geometric digits (Orbitron, weight 700) rendered in cool
off-white with a chromatic neon halo: a tight cyan core glow plus a wider
magenta bleed. Faint CRT scanlines drift across the whole field at
glacial speed; a vignette deepens the corners so nothing competes with
the horizon for attention.

The eyebrow title is monospace, wide-tracked, and bracketed by `//` and a
trailing arrow glyph so it reads like a routing prefix. The subtitle
drops into the same mono family at body size. Progress is a segmented
power-meter bar with a cyan-to-magenta fill — it reinforces the motif
without ever pulling focus from the digits.

### Color palette direction

Deep cool void (`#03050f`) as the base. Cyan-400 (`#22d3ee`) is the
primary neon, carrying digit halos, grid lines, and bar fill. Fuchsia-300
(`#f0abfc`) is the secondary neon, used only for glow and the horizon's
outer bloom — never as the sole carrier of meaning. Foreground text is a
cool off-white (`#e6f6ff`) that clears WCAG AAA against the background;
the eyebrow title sits at the brighter cyan-300 (`#67e8f9`) so it stays
legible. No purple-to-pink synthwave gradient, no sun, no chrome
sunset — the palette is corridor and signal, not sunset and beach.

### UI behavior / animations

- The grid floor scrolls one cell-distance toward the camera every 3
  seconds, giving a constant gentle "we are arriving" motion.
- The horizon beam breathes on a 7-second sine — opacity 0.85 ↔ 1.0 with
  a half-pixel blur swing — so the focal point is alive even when no
  digit has ticked.
- Scanlines drift downward over 4 seconds in `screen` blend mode;
  intentionally below the threshold of conscious perception, atmosphere
  only.
- All three loops are gated by Tailwind `motion-safe:`. The theme also
  ships a `reducedMotion.animations = {}` override so the keyframe
  declarations themselves are dropped for users who have
  `prefers-reduced-motion: reduce` set.

### Emotional experience

Cool, anticipatory, slightly mechanical. The viewer feels they are
_receiving_ the countdown rather than racing it down — a signal closing
the distance. Best for product launches, game/movie release dates,
hackathon timers, conference keynotes.

---

---

## Theme 4 — Aurora

**Central concept:** The countdown as a quiet arctic night. The viewer is
standing on a polar plain looking up at a deep indigo sky, where two
flowing aurora ribbons drift slowly across the zenith. Time isn't
hurrying anywhere — it's _witnessed_, the way you'd witness a long
exposure of the northern lights. Anticipation as stillness, not motion.

### Visual style

A deep indigo void fills the screen, with a faint warmer aurora-tint
fall-off at the top of the sky. A two-layer starfield (120px and 60px
dot patterns) sits behind everything and twinkles on a slow opacity
sine. In front of the stars, two diffuse ribbons drift at different
speeds, opposite directions, and slightly different vertical bands so
they never lock into a repeating pattern:

- **Ribbon A** is the primary emerald-teal band — wide, low-anchored,
  drifting on a 24-second loop with a gentle skew sway.
- **Ribbon B** is the secondary violet-magenta band — narrower, higher
  in the sky, drifting opposite-direction on a 31-second loop.

Both ribbons are blurred 28–48px and composited with `mix-blend-screen`
so they read as atmospheric light, not opaque shapes. Behind them, a
soft horizon **bloom** breathes on an 11-second sine to suggest
atmospheric pressure shifts. A thin **horizon mist** layer at the bottom
of the viewport blends the ribbon hues into the "ground" so the bands
don't end abruptly mid-screen. A corner **vignette** holds the eye on
the timer.

There is intentionally **no card**, no frame, no glass surface. The sky
_is_ the chrome — a card would compete with the ribbons for the eye and
flatten the depth. The timer hangs in open negative space.

The eyebrow title is uppercase, heavily tracked (0.42em base, 0.5em at
`md`), and carries a soft teal-cyan halo that echoes the sky overhead.
The subtitle is italic, 300-weight, 50% foreground transparency — quiet
enough to never compete with the title. The timer digits are pure
foreground white with a tight teal-core / violet-bleed glow:
legibility-first, the glow is decorative not load-bearing. Progress is
a slim 3–4px gradient bar (emerald-teal → icy cyan → violet-magenta)
that mirrors the ribbon palette overhead, closing the loop between
focal point and sky.

### Color palette direction

Deep indigo midnight (`#070a1a`) as the base, fading to near-black
(`#02030c`) at the very bottom. Three aurora hues, never used as the
sole carrier of meaning:

- **Emerald-teal** (`#5eead4`) — the classic green aurora ribbon, the
  primary accent.
- **Violet-magenta** (`#c4a8ff`) — the rarer high-altitude band, the
  secondary accent.
- **Icy cyan** (`#7dd3fc`) — a "rim" hue used for the brightest ribbon
  edges and the midpoint of the progress gradient.

Foreground text is a cool off-white (`#f4f7ff`) at WCAG AAA against the
background. The eyebrow title sits at a brighter teal-cyan
(`#a5f3fc`) so it has a distinct voice from the pure-white timer.
Deliberately _not_ a synthwave palette: no purple-to-pink sunset, no
chrome, no neon grid. The palette is **atmosphere and light**, not
signal and metal.

### UI behavior / animations

- Both ribbons drift on slow loops (24s and 31s) — co-prime-ish timings
  so the eye never spots the cycle.
- All drift is `transform` + `opacity` only (with `will-change`), so
  the loop is GPU-composited and never triggers layout or paint.
- Bloom breathes on an 11-second period — yet a third tempo, again to
  avoid visible sync with the ribbons.
- Starfield twinkles on a 6-second opacity sine (no transform = cheap).
- All four loops are gated by Tailwind `motion-safe:`. The theme also
  ships a `reducedMotion.animations = {}` override so the keyframe
  declarations themselves are dropped for users who have
  `prefers-reduced-motion: reduce` set — the static sky still reads
  unmistakably as Aurora.

### Emotional experience

Calm, contemplative, slightly transcendent. The viewer feels they are
_standing under_ the countdown rather than counting it down — anticipation
as a quiet, vast thing. Best for new-year moments, sabbatical returns,
long trips home, milestone birthdays, anything where the right tone is
_reverent_ rather than urgent.

---

## Theme 5 — Minimal Stack

**Central concept:** The countdown as an editorial page. A single sheet
of warm paper, type set with discipline, one ink for everything that
matters and one accent reserved for the only thing that is changing
right now. No surface effects, no decoration — the layout _is_ the
design.

### Visual style

A single left-aligned vertical column fills the viewport. The eyebrow
title and an italic serif subtitle rest at the top; the timer sits at
the bottom anchored to the baseline of the page; a hairline progress
rule tucks underneath. `justify-between` is the entire composition —
the whitespace between top and bottom stacks is _the_ design move, and
it earns its keep by being protected against decoration.

Two type families, used once each. Inter Tight (an industrial, tabular
sans) carries every functional surface: the wide-tracked uppercase
eyebrows, the labels, and the ultra-light 200-weight numerals. Fraunces
appears exactly once, italic at weight 300, on the subtitle — a
deliberate editorial moment that signals tone without competing.

Three weight tiers (eyebrow 500 / timer 200 / label 500) and three
size tiers (label / subtitle / timer) do all of the hierarchy work.
Tracking does the rest: caps are tracked open at `0.24em`, numerals
are tracked tight at `-0.03em`. The eye scans the page without ever
reading a sentence.

### Color palette direction

A muted four-color system that refuses to perform.

- **Paper** (`#f6f3ec`) — warm off-white. Never `#fff`; pure white
  reads as web chrome, not as a surface.
- **Ink** (`#1a1a1a`) — dark charcoal. Never `#000`; pure black is a
  drop-shadow color, not a typesetting color.
- **Margin gray** (`#6b6b6b`) and **eyebrow gray** (`#3d3d3d`) —
  two muted neutrals that build hierarchy without ever asking for
  attention.
- **Terracotta** (`#b4452b`) — the single accent. Appears in only two
  places: the seconds digits and the 1px progress rule. Because the
  rest of the palette is silent, the accent is allowed to _mean_ "now".

No gradients on content, no shadows, no glow, no overlays. The page is
a sheet of paper.

### UI behavior / animations

- Per-digit `fade` transition (220ms). No flip, no flap, no odometer —
  digits crossfade with a small Y nudge. The whole point of the theme
  is that motion never editorializes the count.
- Seconds always read in terracotta; days, hours, and minutes always
  read in ink. The accent moves _with_ the second hand, never with
  hover, never with selection, never with state.
- Progress is a 1px hairline rule that fills with the same terracotta
  over `--ct-motion-slow` (1100ms) — a typographic rule, not a UI
  widget.
- Breakpoint-scaled vertical rhythm: gaps and timer ceiling increase
  at `md` (48rem) and `lg` (64rem). Larger viewports buy more silence
  rather than larger type.
- No idle layer, no final-minute layer, no done layer. The discipline
  of the steady-state composition is the experience.

### Emotional experience

Quiet, considered, premium. The viewer feels they are reading the
countdown rather than watching it — the way one reads a colophon or a
masthead. Best for product launches, embargo lifts, board memos,
appointment cards, anything where the right tone is _composed_
rather than emotional.

---

## How they diverge

Tide Letters is hushed, organic, and analog-emotional (paper + water + ink,
vertical, slow). Pocket Arcade is loud, mechanical, and play-emotional
(plastic + glass + pixels, centered object, snappy). Neon Grid is cool,
spatial, and signal-emotional (void + light + grid, horizon-anchored,
glacial). Aurora is calm, atmospheric, and reverent-emotional (sky +
ribbon + bloom, zenith-anchored, drifting). Minimal Stack is composed,
typographic, and editorial-emotional (paper + ink + rule, top-and-bottom
anchored, still). Five different materials, five different tempos, five
different feelings — no shared tropes.
