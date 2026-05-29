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

## How they diverge

Tide Letters is hushed, organic, and analog-emotional (paper + water + ink,
vertical, slow). Pocket Arcade is loud, mechanical, and play-emotional
(plastic + glass + pixels, centered object, snappy). Different materials,
different tempos, different feelings — no shared tropes.
