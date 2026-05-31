import type { CountdownTheme } from '../theming/types'

/**
 * Pocket Arcade — a coin-op cabinet you carry in your pocket.
 *
 * A chunky cabinet body sits centered with the countdown on a curved
 * CRT-style display (real SVG mask + crt-warp filter), pixelated
 * split-flap digits, an arcade-button row driven by progress, marquee
 * across the top, and rivets/bolts in the chrome corners.
 *
 * Reactive moments:
 *  - Pixelated split-flap digits (Phase 2: `splitDigits + transition`).
 *  - Per-minute "coin drop" sprite into the slot + display flash + clack.
 *  - Hour `thunk` haptic; day-boundary triple-thunk + pixel confetti.
 *  - CRT glare parallax driven by `--ct-tilt-{x,y}` (Phase 6 tilt).
 *  - 30s idle → ATTRACT MODE demo layout (mascots juggle digits).
 *  - T-zero → win jingle + pixel-fireworks burst + marquee reveal.
 */
export const pocketArcadeTheme: CountdownTheme = {
  id: 'pocket-arcade',
  name: 'Pocket Arcade',
  // Phase 8 — structured fonts.
  fonts: [
    { family: 'Press Start 2P', weights: [400], source: 'google' },
    { family: 'VT323', weights: [400], source: 'google' },
  ],
  // Phase 7 — SVG defs. We keep `chromatic-aberration` because it's cheap
  // and applied per-digit. The `crt-warp` filter and a hand-rolled
  // curved-glass mask are intentionally NOT used here: stacking a
  // displacement-map filter on top of a mask on the cabinet container
  // displaced the inner flex layout off-screen on Chromium, leaving an
  // empty cabinet. The curved-glass look is approximated in CSS instead
  // (rounded corners + radial vignette + scanlines), keeping the visual
  // intent intact without the layout regression. See deviations notes.
  defs: {
    filters: ['chromatic-aberration'],
  },
  // Phase 3 — ATTRACT MODE after 30s of inactivity.
  idleAfterMs: 30_000,
  // Phase 6 — tilt parallax for CRT glare.
  tilt: true,
  // Phase 5 — haptics only. The doc calls for a coin clack, hour thunk
  // and win jingle; those SFX files aren't shipped in this repo yet, so
  // declaring `sounds`/`audio` would just spam 404s on every boundary.
  // Drop them; haptics still cover the tactile half of the spec.
  haptics: {
    minuteBoundary: 10,
    hourBoundary: 40,
    // Triple-thunk on day rollover.
    dayBoundary: [40, 60, 40, 60, 40],
    finalMinute: [20, 40, 20],
    zero: [60, 60, 120, 60, 200],
  },
  tokens: {
    base: {
      color: {
        // Matte charcoal cabinet body.
        bg: '#171419',
        // CRT foreground — slightly green-warm phosphor white.
        fg: '#fdf6e3',
        // Bubblegum magenta as the hero accent.
        accent: '#ff3ea5',
        // Brushed-chrome trim.
        muted: '#8a8794',
        // Lemonade-yellow marquee.
        title: '#ffe066',
      },
      font: {
        display:
          '"Press Start 2P", "VT323", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        label:
          '"Press Start 2P", "VT323", ui-monospace, SFMono-Regular, Menlo, monospace',
      },
      size: {
        // Pixel fonts read large at small sizes — keep them in check.
        // Tuned so D/H/M/S fits on one line at narrow portrait widths.
        timer: 'clamp(1.4rem, 7.5vw, 4.5rem)',
        title: 'clamp(0.55rem, 1.5vw, 0.7rem)',
        label: '0.5rem',
      },
      motion: { fast: '120ms', slow: '500ms' },
      effect: {
        // Phase 7 — filter tokens applied via CSS variables. Only the
        // cheap per-digit aberration is wired; see `defs` for why.
        'filter-aberration': 'url(#ct-chromatic-aberration)',
      },
    },
    md: {
      // Constrained so 8 split digits + gaps fit inside the 40rem cabinet.
      size: { timer: 'clamp(2.2rem, 5vw, 4.5rem)' },
    },
  },
  animations: {
    cabinet: `
      [data-ct-theme="pocket-arcade"] {
        background:
          radial-gradient(ellipse 90% 60% at 50% 110%, rgba(255, 62, 165, 0.18), transparent 60%),
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(64, 224, 255, 0.10), transparent 60%),
          var(--ct-color-bg);
      }
    `,
    chrome: `
      /* Phase 9 — rivets/bolts and rubber bumpers live in the chrome
         layer so they land on the unpadded viewport edges, not inside
         safe-area padding. */
      [data-ct-theme="pocket-arcade"] .pa-bolt {
        position: absolute;
        width: 12px; height: 12px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 30%, #d9d4dc, #4a4651 70%, #1b181d);
        box-shadow:
          0 1px 2px rgba(0,0,0,0.6),
          inset 0 -1px 1px rgba(0,0,0,0.5);
        pointer-events: none;
      }
      [data-ct-theme="pocket-arcade"] .pa-bumper {
        position: absolute;
        width: 38px; height: 14px;
        border-radius: 10px;
        background: linear-gradient(180deg, #2a262f 0%, #0a080c 100%);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.06),
          0 2px 4px rgba(0,0,0,0.6);
        pointer-events: none;
      }
      [data-ct-theme="pocket-arcade"] .pa-bolt-tl { top: 18px; left: 18px; }
      [data-ct-theme="pocket-arcade"] .pa-bolt-tr { top: 18px; right: 18px; }
      [data-ct-theme="pocket-arcade"] .pa-bolt-bl { bottom: 18px; left: 18px; }
      [data-ct-theme="pocket-arcade"] .pa-bolt-br { bottom: 18px; right: 18px; }
      [data-ct-theme="pocket-arcade"] .pa-bumper-t { top: 6px;    left: 50%; transform: translateX(-50%); }
      [data-ct-theme="pocket-arcade"] .pa-bumper-b { bottom: 6px; left: 50%; transform: translateX(-50%); }
    `,
    screen: `
      /* The CRT screen panel. The curved-glass look is approximated with
         asymmetric border-radius + a radial vignette overlay instead of
         the SVG mask (see notes in defs). Scanlines, burn-in halation,
         and convex glare are layered on top. */
      [data-ct-theme="pocket-arcade"] .pa-screen {
        position: relative;
        /* Slightly brighter phosphor wash so the bezel stays visible
           against the dark page background at desktop widths. */
        background:
          radial-gradient(ellipse 120% 90% at 50% 50%, #143b33 0%, #0a1d18 70%, #050c0a 100%);
        border-radius: 32px / 26px;
        padding: 2rem 1.25rem;
        box-shadow:
          inset 0 0 0 2px #2a262f,
          inset 0 0 0 8px #1a181d,
          inset 0 0 0 10px #3a363f,
          inset 0 0 60px rgba(0,0,0,0.75),
          0 24px 60px -16px rgba(0,0,0,0.7),
          0 0 0 1px #0a080c;
        overflow: hidden;
        isolation: isolate;
      }
      /* Subtle phosphor burn-in tinted ghost behind the digits. */
      [data-ct-theme="pocket-arcade"] .pa-screen::before {
        content: "";
        position: absolute; inset: 0;
        background:
          repeating-linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0 2px,
            rgba(0, 0, 0, 0.28) 2px 3px
          );
        pointer-events: none;
        mix-blend-mode: multiply;
        animation: pa-scan 6s linear infinite;
        z-index: 2;
      }
      /* Convex glare — slides on tilt via --ct-tilt-x/y (Phase 6). */
      [data-ct-theme="pocket-arcade"] .pa-screen::after {
        content: "";
        position: absolute; inset: 0;
        background:
          radial-gradient(
            ellipse 90% 40%
              at calc(30% + var(--ct-tilt-x, 0) * 25%)
                 calc(8% + var(--ct-tilt-y, 0) * 12%),
            rgba(255, 255, 255, 0.18),
            transparent 60%
          ),
          radial-gradient(ellipse 60% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%);
        pointer-events: none;
        z-index: 3;
        transition: background 80ms linear;
      }
      /* Warm-pink + cool-teal halation leaking onto the bezel. */
      [data-ct-theme="pocket-arcade"] .pa-halo {
        position: absolute;
        inset: -28px;
        border-radius: 36px / 30px;
        background:
          radial-gradient(ellipse 70% 60% at 25% 30%, rgba(255, 153, 200, 0.22), transparent 60%),
          radial-gradient(ellipse 60% 60% at 75% 70%, rgba(120, 220, 230, 0.18), transparent 60%);
        filter: blur(14px);
        pointer-events: none;
        z-index: -1;
      }
      @keyframes pa-scan {
        0%   { background-position: 0 0; }
        100% { background-position: 0 6px; }
      }
      /* Per-minute display flash. Triggered by stamping data-flash on the
         cabinet (see scripted hook below) — but since we drive everything
         declaratively, we instead key off the tick-pulse on the seconds
         block: when seconds rolls 00, minutes block also changes, so the
         minutes' [data-just-changed] is our flash hook. */
      [data-ct-theme="pocket-arcade"] [data-unit-block="minutes"] [data-value][data-just-changed] ~ *,
      [data-ct-theme="pocket-arcade"] .pa-screen:has([data-unit-block="minutes"] [data-value][data-just-changed]) {
        animation: pa-flash 280ms ease-out;
      }
      @keyframes pa-flash {
        0%   { box-shadow:
                 inset 0 0 0 2px #2a262f, inset 0 0 0 8px #1a181d,
                 inset 0 0 0 10px #3a363f, inset 0 0 60px rgba(0,0,0,0.75),
                 inset 0 0 120px rgba(253, 246, 227, 0.55),
                 0 24px 60px -16px rgba(0,0,0,0.7), 0 0 0 1px #0a080c; }
        100% { box-shadow:
                 inset 0 0 0 2px #2a262f, inset 0 0 0 8px #1a181d,
                 inset 0 0 0 10px #3a363f, inset 0 0 60px rgba(0,0,0,0.75),
                 0 24px 60px -16px rgba(0,0,0,0.7), 0 0 0 1px #0a080c; }
      }
    `,
    digits: `
      /* Per-unit candy colors on the digits, chromatic-aberration applied
         through the warp pipeline for genuine CRT fringing (Phase 7). */
      [data-ct-theme="pocket-arcade"] [data-slot="timer"] {
        position: relative;
        z-index: 4;
      }
      [data-ct-theme="pocket-arcade"] [data-slot="timer"] {
        flex-wrap: nowrap;
        max-width: 100%;
      }
      [data-ct-theme="pocket-arcade"] [data-slot="timer"] [data-value] {
        font-family: var(--ct-font-display);
        line-height: 1;
        letter-spacing: 0.04em;
        filter: var(--ct-effect-filter-aberration, none);
      }
      [data-ct-theme="pocket-arcade"] [data-unit-block="days"]    [data-value] { color: #ff3ea5; text-shadow: 0 0 6px rgba(255, 62, 165, 0.85), 0 0 18px rgba(255, 62, 165, 0.45); }
      [data-ct-theme="pocket-arcade"] [data-unit-block="hours"]   [data-value] { color: #40e0ff; text-shadow: 0 0 6px rgba(64, 224, 255, 0.85), 0 0 18px rgba(64, 224, 255, 0.45); }
      [data-ct-theme="pocket-arcade"] [data-unit-block="minutes"] [data-value] { color: #ffe066; text-shadow: 0 0 6px rgba(255, 224, 102, 0.85), 0 0 18px rgba(255, 224, 102, 0.45); }
      [data-ct-theme="pocket-arcade"] [data-unit-block="seconds"] [data-value] {
        color: #5dffb0;
        text-shadow: 0 0 6px rgba(93, 255, 176, 0.9), 0 0 18px rgba(93, 255, 176, 0.5);
      }
      /* Phase 2 — pixelated split-flap. Each [data-digit] is its own box;
         on change we flip top→bottom in stepped easing for the pixel feel.
         data-prev is exposed by the Timer component so we can render the
         outgoing character on the top half. */
      [data-ct-theme="pocket-arcade"] [data-slot="timer"] [data-digit] {
        display: inline-block;
        position: relative;
        line-height: 1;
        transform-origin: 50% 100%;
        image-rendering: pixelated;
      }
      [data-ct-theme="pocket-arcade"] [data-slot="timer"] [data-digit][data-changing="true"] {
        animation: pa-splitflap 220ms steps(6, end);
      }
      @keyframes pa-splitflap {
        0%   { transform: translateY(0)    scaleY(1);   filter: brightness(1); }
        50%  { transform: translateY(-2px) scaleY(0.05); filter: brightness(1.5); }
        51%  { transform: translateY(2px)  scaleY(0.05); filter: brightness(0.7); }
        100% { transform: translateY(0)    scaleY(1);   filter: brightness(1); }
      }
      /* Per-second pulse on the seconds digit. */
      [data-ct-theme="pocket-arcade"] [data-value][data-just-changed="seconds"] {
        animation: pa-tick 220ms steps(2, end);
      }
      @keyframes pa-tick {
        0%   { opacity: 0.4; transform: translateY(-1px); }
        100% { opacity: 1;   transform: translateY(0); }
      }
      [data-ct-theme="pocket-arcade"] [data-slot="timer"] [data-label] {
        font-family: var(--ct-font-label);
        letter-spacing: 0.18em;
        color: #b8b3c2;
        opacity: 0.9;
        font-size: 0.5rem;
      }
    `,
    marquee: `
      /* Top marquee — yellow PRESS-START strip with a bulb glow. */
      [data-ct-theme="pocket-arcade"] [data-slot="event-title"][data-source="title"] {
        font-family: var(--ct-font-display);
        color: #1b181d;
        background:
          radial-gradient(ellipse 100% 200% at 50% 130%, rgba(255, 224, 102, 0.55), transparent 60%),
          linear-gradient(180deg, #ffe066 0%, #ffb84d 100%);
        padding: 0.6rem 1rem;
        border-radius: 6px;
        box-shadow:
          inset 0 0 0 2px #b8862a,
          inset 0 0 0 4px #ffeb99,
          0 0 24px rgba(255, 184, 77, 0.45),
          0 6px 18px rgba(0,0,0,0.4);
        letter-spacing: 0.18em;
        text-transform: uppercase;
        line-height: 1.1;
        animation: pa-flicker 8s infinite;
      }
      [data-ct-theme="pocket-arcade"] [data-slot="event-title"][data-source="subtitle"] {
        font-family: var(--ct-font-label);
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: #b8b3c2;
        font-size: 0.6rem;
      }
      [data-ct-theme="pocket-arcade"] [data-slot="event-title"][data-source="subtitle"]::before {
        content: "1UP · ";
        color: #ff3ea5;
      }
      @keyframes pa-flicker {
        0%, 96%, 100% { filter: brightness(1); }
        97%           { filter: brightness(1.25); }
        98%           { filter: brightness(0.85); }
        99%           { filter: brightness(1.15); }
      }
    `,
    buttons: `
      /* Arcade-button row — drives off the progress 'segments'. */
      [data-ct-theme="pocket-arcade"] [data-slot="progress"][data-kind="segments"] {
        gap: 14px;
        padding: 14px 18px;
        background: linear-gradient(180deg, #2a262f 0%, #1a181d 100%);
        border-radius: 18px;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.06),
          inset 0 0 0 1px #0a080c,
          0 8px 18px -8px rgba(0,0,0,0.6);
      }
      [data-ct-theme="pocket-arcade"] [data-slot="progress"][data-kind="segments"] > span {
        height: 18px;
        flex: 1;
        border-radius: 999px;
        background: radial-gradient(circle at 30% 30%, #4a4651 0%, #1a181d 70%);
        box-shadow:
          inset 0 -2px 0 rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.08);
        transition: background 200ms ease, box-shadow 200ms ease, transform 120ms ease;
      }
      [data-ct-theme="pocket-arcade"] [data-slot="progress"][data-kind="segments"] > span[data-on="true"]:nth-child(4n+1) { background: radial-gradient(circle at 30% 30%, #ff8ec8, #ff3ea5 70%); box-shadow: inset 0 -2px 0 rgba(0,0,0,0.4), 0 0 14px rgba(255, 62, 165, 0.7); }
      [data-ct-theme="pocket-arcade"] [data-slot="progress"][data-kind="segments"] > span[data-on="true"]:nth-child(4n+2) { background: radial-gradient(circle at 30% 30%, #8ef0ff, #40e0ff 70%); box-shadow: inset 0 -2px 0 rgba(0,0,0,0.4), 0 0 14px rgba(64, 224, 255, 0.7); }
      [data-ct-theme="pocket-arcade"] [data-slot="progress"][data-kind="segments"] > span[data-on="true"]:nth-child(4n+3) { background: radial-gradient(circle at 30% 30%, #fff0a8, #ffe066 70%); box-shadow: inset 0 -2px 0 rgba(0,0,0,0.4), 0 0 14px rgba(255, 224, 102, 0.7); }
      [data-ct-theme="pocket-arcade"] [data-slot="progress"][data-kind="segments"] > span[data-on="true"]:nth-child(4n)   { background: radial-gradient(circle at 30% 30%, #a8ffd2, #5dffb0 70%); box-shadow: inset 0 -2px 0 rgba(0,0,0,0.4), 0 0 14px rgba(93, 255, 176, 0.7); }
    `,
    coinSlot: `
      /* The coin slot sits just under the screen. A chunky pixel "coin"
         drops past the slot opening on every minute boundary. The drop
         is a pure-CSS animation keyed off [data-just-changed] on the
         minutes block (which the Timer stamps for one frame on each
         change) — no sprite asset required. */
      [data-ct-theme="pocket-arcade"] .pa-slot {
        width: 64px;
        height: 8px;
        border-radius: 4px;
        background:
          linear-gradient(180deg, #0a080c 0%, #2a262f 50%, #0a080c 100%);
        box-shadow:
          inset 0 1px 1px rgba(0,0,0,0.7),
          inset 0 -1px 0 rgba(255,255,255,0.06);
        position: relative;
        margin-top: 0.5rem;
      }
      [data-ct-theme="pocket-arcade"] .pa-coin-stage {
        position: relative;
        width: 100%;
        height: 28px;
        pointer-events: none;
        overflow: hidden;
        display: flex;
        justify-content: center;
      }
      [data-ct-theme="pocket-arcade"] .pa-coin {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        image-rendering: pixelated;
        background:
          radial-gradient(circle at 35% 30%, #fff5b0 0 22%, transparent 23%),
          radial-gradient(circle at 50% 50%, #ffd166 0 60%, #b8862a 70%, #6a4d18 100%);
        box-shadow:
          0 0 6px rgba(255, 209, 102, 0.6),
          inset 0 -1px 0 rgba(0,0,0,0.4);
        transform: translateY(-26px);
        opacity: 0;
      }
      /* Drop the coin whenever the minutes block changes. The :has()
         scope on the cabinet group lets the coin animation key off a
         data-attribute that the Timer stamps elsewhere in the tree. */
      [data-ct-theme="pocket-arcade"] [data-slot="group"][data-slot-id="cabinet"]:has([data-unit-block="minutes"] [data-value][data-just-changed]) ~ * .pa-coin,
      [data-ct-theme="pocket-arcade"]:has([data-unit-block="minutes"] [data-value][data-just-changed]) .pa-coin {
        animation: pa-coin-drop 700ms cubic-bezier(0.4, 0, 0.6, 1);
      }
      @keyframes pa-coin-drop {
        0%   { transform: translateY(-26px) rotate(0);   opacity: 0; }
        20%  { opacity: 1; }
        70%  { transform: translateY(8px)  rotate(180deg); opacity: 1; }
        85%  { transform: translateY(2px)  rotate(220deg); opacity: 0.9; }
        100% { transform: translateY(8px)  rotate(360deg); opacity: 0; }
      }
    `,
    mascots: `
      /* Pixel-art mascots done in CSS — a sleepy octopus on the left, a
         grumpy toaster on the right. They peek from cabinet corners and
         react to interactions (a small jiggle on tap/long-press of the
         cabinet). When real sprite sheets ship, the sprite slots below
         take over via the asset manifest. */
      [data-ct-theme="pocket-arcade"] .pa-mascot {
        width: 36px; height: 36px;
        image-rendering: pixelated;
        position: relative;
        opacity: 0.95;
      }
      [data-ct-theme="pocket-arcade"] .pa-mascot[data-kind="octopus"] {
        background:
          radial-gradient(circle at 50% 40%, #ff3ea5 0%, #ff3ea5 40%, transparent 41%),
          radial-gradient(circle at 35% 35%, #fff 0 12%, transparent 13%),
          radial-gradient(circle at 65% 35%, #fff 0 12%, transparent 13%),
          radial-gradient(circle at 35% 38%, #1b181d 0 5%, transparent 6%),
          radial-gradient(circle at 65% 38%, #1b181d 0 5%, transparent 6%);
        animation: pa-mascot-bob 3.4s ease-in-out infinite;
      }
      [data-ct-theme="pocket-arcade"] .pa-mascot[data-kind="toaster"] {
        background:
          linear-gradient(180deg, #b8b3c2 0%, #6a6470 100%),
          radial-gradient(circle at 50% 30%, #ffd166 0 20%, transparent 21%);
        background-blend-mode: multiply;
        animation: pa-mascot-bob 3.0s 0.4s ease-in-out infinite;
        border-radius: 4px;
      }
      @keyframes pa-mascot-bob {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-3px); }
      }
      [data-ct-theme="pocket-arcade"][data-gesture="cabinet-poke"] .pa-mascot {
        animation: pa-mascot-jiggle 360ms ease;
      }
      @keyframes pa-mascot-jiggle {
        0%   { transform: translateX(0)   rotate(0); }
        30%  { transform: translateX(-2px) rotate(-6deg); }
        60%  { transform: translateX(2px)  rotate(5deg); }
        100% { transform: translateX(0)   rotate(0); }
      }
    `,
    fontsReady: `
      /* Phase 8 — FOUT-free reveal. */
      [data-ct-theme="pocket-arcade"][data-fonts-ready="false"] [data-slot="timer"],
      [data-ct-theme="pocket-arcade"][data-fonts-ready="false"] [data-slot="event-title"] {
        opacity: 0;
      }
      [data-ct-theme="pocket-arcade"][data-fonts-ready="true"] [data-slot="timer"],
      [data-ct-theme="pocket-arcade"][data-fonts-ready="true"] [data-slot="event-title"] {
        opacity: 1;
        transition: opacity 220ms ease;
      }
    `,
    state: `
      /* Crossfade between counting / idle / done a touch faster than the
         platform default — Pocket Arcade is snappy. */
      [data-ct-theme="pocket-arcade"] { --ct-state-fade-ms: 420ms; }
      /* ATTRACT MODE label flashes on the idle layout. */
      [data-ct-theme="pocket-arcade"][data-state="idle"] .pa-attract {
        animation: pa-flicker 1.6s infinite;
      }
      /* Done scene — marquee swells to celebrate. */
      [data-ct-theme="pocket-arcade"][data-state="done"] [data-slot="event-title"][data-source="title"] {
        font-size: clamp(1.1rem, 4vw, 2rem);
        animation: pa-flicker 0.8s infinite;
      }
    `,
    // ─── Done scene — "Win Screen Composite" ─────────────────────────
    //
    // Staged 2s choreography (then settle, no infinite loops):
    //   t=0      cabinet flicker + one final split-flap cascade on digits
    //   t=200    marquee text crossfades to "NEW HIGH SCORE!"
    //   t=400    screen content swaps: mascot avatar + hero title + stat
    //   t=900    button row chain-reaction lights left→right (480ms)
    //   t=1400   CTA pill slides up from below and receives focus
    //   t=2000   short one-shot fireworks burst, fades by t=3500
    //
    // Reduced motion stamps the t=2000 frame directly: no flicker, no
    // cascade, no fireworks, full CTA + lit buttons + hero text.
    done: `
      /* (1) Cabinet flicker — one-shot 320ms, not the infinite pa-flicker. */
      [data-ct-theme="pocket-arcade"][data-state="done"] .pa-screen {
        animation: pa-done-flicker 320ms steps(4, end);
      }
      @keyframes pa-done-flicker {
        0%, 100% { filter: brightness(1); }
        25%      { filter: brightness(1.4); }
        50%      { filter: brightness(0.7); }
        75%      { filter: brightness(1.2); }
      }

      /* Override the live state's infinite marquee flicker — done uses
         a one-shot swell instead. */
      [data-ct-theme="pocket-arcade"][data-state="done"] [data-slot="event-title"][data-source="title"] {
        animation: pa-marquee-swell 520ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both;
        font-size: clamp(1.3rem, 5vw, 2.4rem);
      }
      @keyframes pa-marquee-swell {
        0%   { transform: scale(0.96); filter: brightness(0.8); }
        60%  { transform: scale(1.08); filter: brightness(1.5); }
        100% { transform: scale(1);    filter: brightness(1.15); }
      }

      /* (3) Hero event title inside the cabinet — magenta with cyan halo. */
      [data-ct-theme="pocket-arcade"] .pa-win-hero {
        font-family: var(--ct-font-display);
        font-size: clamp(1rem, 5vw, 2.4rem);
        line-height: 1.1;
        letter-spacing: 0.06em;
        text-align: center;
        color: #ff3ea5;
        text-shadow:
          0 0 8px rgba(255, 62, 165, 0.9),
          0 0 20px rgba(64, 224, 255, 0.55),
          0 0 36px rgba(64, 224, 255, 0.3);
        opacity: 0;
        transform: translateY(8px);
        animation: pa-pop-in 360ms cubic-bezier(0.22, 1, 0.36, 1) 400ms forwards;
        position: relative;
        z-index: 4;
      }

      /* Stat line — "YOU WAITED <duration>" in pixel mono. */
      [data-ct-theme="pocket-arcade"] .pa-win-stat {
        font-family: var(--ct-font-label);
        font-size: clamp(0.5rem, 1.2vw, 0.65rem);
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: #b8b3c2;
        text-align: center;
        opacity: 0;
        animation: pa-pop-in 360ms ease-out 700ms forwards;
        position: relative;
        z-index: 4;
      }
      [data-ct-theme="pocket-arcade"] .pa-win-stat::before {
        content: "★ YOU WAITED · GG ★";
        color: #ffe066;
      }

      /* Mascot avatar bottom-left of the cabinet — uses the existing
         octopus pixel-art treatment. */
      [data-ct-theme="pocket-arcade"] .pa-win-avatar {
        position: absolute;
        left: 1rem;
        bottom: 1rem;
        width: 32px;
        height: 32px;
        image-rendering: pixelated;
        background:
          radial-gradient(circle at 50% 40%, #ff3ea5 0%, #ff3ea5 40%, transparent 41%),
          radial-gradient(circle at 35% 35%, #fff 0 12%, transparent 13%),
          radial-gradient(circle at 65% 35%, #fff 0 12%, transparent 13%),
          radial-gradient(circle at 35% 38%, #1b181d 0 5%, transparent 6%),
          radial-gradient(circle at 65% 38%, #1b181d 0 5%, transparent 6%);
        opacity: 0;
        animation:
          pa-pop-in 320ms cubic-bezier(0.34, 1.56, 0.64, 1) 480ms forwards,
          pa-mascot-bob 3.4s ease-in-out 800ms infinite;
        z-index: 4;
      }

      @keyframes pa-pop-in {
        0%   { opacity: 0; transform: translateY(8px) scale(0.92); }
        100% { opacity: 1; transform: translateY(0)   scale(1); }
      }

      /* (4) Button row chain-reaction — left→right cascade then settle.
         Buttons stay "on" after the cascade so the visual is preserved. */
      [data-ct-theme="pocket-arcade"][data-state="done"] [data-slot="progress"][data-kind="segments"] > span {
        animation: pa-btn-cascade 360ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
      }
      [data-ct-theme="pocket-arcade"][data-state="done"] [data-slot="progress"][data-kind="segments"] > span:nth-child(1) { animation-delay: 900ms; }
      [data-ct-theme="pocket-arcade"][data-state="done"] [data-slot="progress"][data-kind="segments"] > span:nth-child(2) { animation-delay: 960ms; }
      [data-ct-theme="pocket-arcade"][data-state="done"] [data-slot="progress"][data-kind="segments"] > span:nth-child(3) { animation-delay: 1020ms; }
      [data-ct-theme="pocket-arcade"][data-state="done"] [data-slot="progress"][data-kind="segments"] > span:nth-child(4) { animation-delay: 1080ms; }
      [data-ct-theme="pocket-arcade"][data-state="done"] [data-slot="progress"][data-kind="segments"] > span:nth-child(5) { animation-delay: 1140ms; }
      [data-ct-theme="pocket-arcade"][data-state="done"] [data-slot="progress"][data-kind="segments"] > span:nth-child(6) { animation-delay: 1200ms; }
      [data-ct-theme="pocket-arcade"][data-state="done"] [data-slot="progress"][data-kind="segments"] > span:nth-child(7) { animation-delay: 1260ms; }
      [data-ct-theme="pocket-arcade"][data-state="done"] [data-slot="progress"][data-kind="segments"] > span:nth-child(8) { animation-delay: 1320ms; }
      @keyframes pa-btn-cascade {
        0%   { transform: translateY(2px) scale(0.92); filter: brightness(0.8); }
        60%  { transform: translateY(-2px) scale(1.12); filter: brightness(1.6); }
        100% { transform: translateY(0)   scale(1);    filter: brightness(1); }
      }

      /* (5) CTA pill — yellow arcade button "PRESS START →". Slides up
         from below the cabinet and receives focus. */
      [data-ct-theme="pocket-arcade"] .pa-win-cta {
        font-family: var(--ct-font-display);
        font-size: clamp(0.75rem, 1.6vw, 0.95rem);
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #1b181d;
        padding: 0.9rem 1.6rem;
        border: none;
        border-radius: 999px;
        background:
          radial-gradient(ellipse 100% 200% at 50% 130%, rgba(255, 224, 102, 0.65), transparent 60%),
          linear-gradient(180deg, #ffe066 0%, #ffb84d 100%);
        box-shadow:
          inset 0 0 0 2px #b8862a,
          inset 0 0 0 4px #ffeb99,
          0 0 28px rgba(255, 184, 77, 0.55),
          0 8px 22px rgba(0,0,0,0.5);
        cursor: pointer;
        opacity: 0;
        transform: translateY(24px);
        animation: pa-cta-rise 420ms cubic-bezier(0.34, 1.56, 0.64, 1) 1400ms forwards;
        transition: transform 120ms ease, box-shadow 120ms ease;
      }
      [data-ct-theme="pocket-arcade"] .pa-win-cta::before { content: "PRESS START ▸"; }
      [data-ct-theme="pocket-arcade"] .pa-win-cta:hover,
      [data-ct-theme="pocket-arcade"] .pa-win-cta:focus-visible {
        transform: translateY(-2px);
        outline: none;
        box-shadow:
          inset 0 0 0 2px #b8862a,
          inset 0 0 0 4px #ffeb99,
          0 0 40px rgba(255, 184, 77, 0.85),
          0 12px 28px rgba(0,0,0,0.6);
      }
      [data-ct-theme="pocket-arcade"] .pa-win-cta:active {
        transform: translateY(1px);
        box-shadow:
          inset 0 0 0 2px #b8862a,
          inset 0 0 0 4px #ffeb99,
          0 0 18px rgba(255, 184, 77, 0.5),
          0 3px 8px rgba(0,0,0,0.5);
      }
      @keyframes pa-cta-rise {
        0%   { opacity: 0; transform: translateY(24px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      /* (6) Fireworks burst — fades to invisible after 1.5s so it
         doesn't loop indefinitely on every secondTick. The effect-layer
         keeps spawning under the hood; this just hides its canvas. */
      [data-ct-theme="pocket-arcade"] .pa-win-fireworks {
        animation: pa-fireworks-fade 3500ms ease-out 2000ms forwards;
        opacity: 0;
      }
      @keyframes pa-fireworks-fade {
        0%   { opacity: 0; }
        15%  { opacity: 1; }
        60%  { opacity: 0.8; }
        100% { opacity: 0; }
      }

      /* Reduced motion: stamp the final frame, no choreography. */
      @media (prefers-reduced-motion: reduce) {
        [data-ct-theme="pocket-arcade"][data-state="done"] .pa-screen,
        [data-ct-theme="pocket-arcade"][data-state="done"] [data-slot="event-title"][data-source="title"],
        [data-ct-theme="pocket-arcade"] .pa-win-hero,
        [data-ct-theme="pocket-arcade"] .pa-win-stat,
        [data-ct-theme="pocket-arcade"] .pa-win-avatar,
        [data-ct-theme="pocket-arcade"] .pa-win-cta,
        [data-ct-theme="pocket-arcade"][data-state="done"] [data-slot="progress"][data-kind="segments"] > span {
          animation: none;
        }
        [data-ct-theme="pocket-arcade"] .pa-win-hero,
        [data-ct-theme="pocket-arcade"] .pa-win-stat,
        [data-ct-theme="pocket-arcade"] .pa-win-avatar,
        [data-ct-theme="pocket-arcade"] .pa-win-cta {
          opacity: 1;
          transform: none;
        }
        [data-ct-theme="pocket-arcade"] .pa-win-fireworks {
          display: none;
        }
      }
    `,
  },
  layout: {
    id: 'root',
    type: 'group',
    // Phase 6 — tap the cabinet to jiggle the mascots (the tap interaction
    // also doubles as a way to escape attract mode by registering activity,
    // which the provider's idle tracker handles on pointerdown anyway).
    interactions: { tap: 'cabinet-poke' },
    classes: {
      className: {
        base: 'relative min-h-screen w-full flex flex-col items-center justify-center gap-6 px-4 py-10 overflow-hidden',
        md: 'md:gap-10 md:px-10 md:py-16',
      },
    },
    children: [
      // Marquee — width-locked to the cabinet so the whole device reads
      // as one unit at desktop widths.
      {
        id: 'title',
        type: 'event-title',
        props: { source: 'title' },
        classes: {
          className: { base: 'w-full max-w-[min(94vw,40rem)] text-center' },
        },
      },
      // The CRT cabinet
      {
        id: 'cabinet',
        type: 'group',
        classes: {
          className: {
            base: 'pa-screen relative w-full max-w-[min(94vw,40rem)] flex flex-col items-center gap-4',
            md: 'md:gap-6 md:p-10',
          },
        },
        children: [
          // Halation glow behind the screen (Phase 7 vibe).
          {
            id: 'halo',
            type: 'background',
            props: { kind: 'gradient' },
            classes: { className: { base: 'pa-halo' } },
          },
          {
            id: 'timer',
            type: 'timer',
            props: {
              format: 'dhms',
              padZeros: true,
              // Phase 2 — per-digit DOM + pixelated split-flap.
              splitDigits: true,
              transition: 'split-flap',
            },
            vars: {
              base: {
                'ct-timer-gap': '0.5rem',
                'ct-unit-gap': '0.3rem',
                'ct-unit-min-width': '1.8ch',
                'ct-timer-justify': 'center',
              },
              md: {
                'ct-timer-gap': '1.2rem',
                'ct-unit-min-width': '2.6ch',
              },
            },
            classes: { className: { base: 'justify-center' } },
          },
          {
            id: 'subtitle',
            type: 'event-title',
            props: { source: 'subtitle' },
            classes: {
              className: { base: 'relative z-[4] text-center mt-1' },
            },
          },
        ],
      },
      // Coin slot beneath the cabinet — a CSS coin drops on every minute.
      {
        id: 'slot-row',
        type: 'group',
        classes: {
          className: {
            base: 'w-full max-w-[min(94vw,40rem)] flex flex-col items-center',
          },
        },
        children: [
          {
            id: 'coin-stage',
            type: 'group',
            classes: { className: { base: 'pa-coin-stage' } },
            children: [
              {
                id: 'coin',
                type: 'background',
                props: { kind: 'gradient' },
                classes: { className: { base: 'pa-coin' } },
              },
            ],
          },
          {
            id: 'slot',
            type: 'background',
            props: { kind: 'gradient' },
            classes: { className: { base: 'pa-slot' } },
          },
        ],
      },
      // Arcade button row (driven by progress)
      {
        id: 'buttons',
        type: 'progress',
        props: { kind: 'segments', direction: 'elapsed' },
        classes: {
          className: { base: 'w-full max-w-[min(94vw,40rem)]' },
        },
      },
      // Day-boundary confetti — pixel sprites of confetti burst across
      // the whole cabinet on every day rollover (Phase 4).
      {
        id: 'day-confetti',
        type: 'particles',
        props: {
          kind: 'confetti',
          count: 80,
          lifetimeMs: 2400,
          // Phase 4 trigger — refire on each day boundary.
          trigger: 'dayBoundary',
          palette: ['#ff3ea5', '#40e0ff', '#ffe066', '#5dffb0', '#ffffff'],
          gravity: 700,
        },
        classes: {
          className: {
            base: 'absolute inset-0 pointer-events-none z-30',
          },
        },
      },
    ],
  },
  // Phase 9 — chrome layer. Bolts sit at the four unpadded corners; rubber
  // bumpers along the top and bottom edges. These are decorative siblings
  // of the main layout and never get clipped by safe-area padding.
  chrome: {
    id: 'chrome-root',
    type: 'chrome',
    children: [
      {
        id: 'bolt-tl',
        type: 'background',
        props: { kind: 'gradient' },
        classes: { className: { base: 'pa-bolt pa-bolt-tl' } },
      },
      {
        id: 'bolt-tr',
        type: 'background',
        props: { kind: 'gradient' },
        classes: { className: { base: 'pa-bolt pa-bolt-tr' } },
      },
      {
        id: 'bolt-bl',
        type: 'background',
        props: { kind: 'gradient' },
        classes: { className: { base: 'pa-bolt pa-bolt-bl' } },
      },
      {
        id: 'bolt-br',
        type: 'background',
        props: { kind: 'gradient' },
        classes: { className: { base: 'pa-bolt pa-bolt-br' } },
      },
      {
        id: 'bumper-t',
        type: 'background',
        props: { kind: 'gradient' },
        classes: { className: { base: 'pa-bumper pa-bumper-t' } },
      },
      {
        id: 'bumper-b',
        type: 'background',
        props: { kind: 'gradient' },
        classes: { className: { base: 'pa-bumper pa-bumper-b' } },
      },
    ],
  },
  // Phase 3 — ATTRACT MODE: after 30s of idleness the layout swaps to a
  // looping demo. Mascots juggle the digits and the marquee invites the
  // user back in. Any pointer/key/touch event flips back to the main
  // counting layout via the provider's idle tracker.
  idleLayout: {
    id: 'attract-root',
    type: 'group',
    interactions: { tap: 'cabinet-poke' },
    classes: {
      className: {
        base: 'relative min-h-screen w-full flex flex-col items-center justify-center gap-6 px-4 py-10 overflow-hidden',
      },
    },
    children: [
      {
        id: 'attract-marquee',
        type: 'event-title',
        props: { source: 'title' },
        classes: { className: { base: 'pa-attract' } },
      },
      {
        id: 'attract-cabinet',
        type: 'group',
        classes: {
          className: {
            base: 'pa-screen relative w-full max-w-[min(94vw,40rem)] flex flex-col items-center justify-center gap-4 py-8',
          },
        },
        children: [
          {
            id: 'attract-line',
            type: 'event-title',
            props: { source: 'subtitle' },
            classes: { className: { base: 'pa-attract relative z-[4]' } },
          },
          // Two CSS mascots juggling — they bob while a tiny faux-digit
          // line tickers across the screen.
          {
            id: 'attract-octo',
            type: 'background',
            props: { kind: 'gradient' },
            classes: { className: { base: 'pa-mascot' } },
            vars: { base: {} },
          },
        ],
      },
      // Mascot pair in the bottom corners.
      {
        id: 'attract-mascot-l',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pa-mascot absolute left-6 bottom-10',
          },
        },
      },
      {
        id: 'attract-mascot-r',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pa-mascot absolute right-6 bottom-10',
          },
        },
      },
    ],
  },
  // Phase 3 — T-zero scene: "Win Screen Composite". Stages a 2s
  // choreography that reuses the cabinet, marquee, button row, mascots,
  // and fireworks; adds a stat line and a primary CTA. Reduced motion
  // stamps the final frame (see the `done` rules in `animations`).
  doneLayout: {
    id: 'done-root',
    type: 'group',
    classes: {
      className: {
        base: 'relative min-h-screen w-full flex flex-col items-center justify-center gap-6 px-4 py-10 overflow-hidden',
        md: 'md:gap-8 md:px-10 md:py-16',
      },
    },
    children: [
      // One-shot fireworks burst — sits behind everything, fades by t≈3.5s.
      {
        id: 'fireworks',
        type: 'effect-layer',
        props: {
          effect: 'crt-fireworks',
          // Keep the trigger so the burst restarts on a few early ticks
          // for density; CSS fade-out caps the visual duration regardless.
          trigger: 'secondTick',
          options: {
            palette: ['#ff3ea5', '#40e0ff', '#ffe066', '#5dffb0', '#ffffff'],
          },
        },
        classes: {
          className: { base: 'pa-win-fireworks absolute inset-0 z-20' },
        },
      },
      // Marquee — same slot as live, but the `done` rules swell it once.
      {
        id: 'win-marquee',
        type: 'event-title',
        props: { source: 'title' },
        classes: {
          className: {
            base: 'relative z-30 w-full max-w-[min(94vw,40rem)] text-center',
          },
        },
      },
      // Cabinet — preserved as the artefact. Inside: hero title + stat
      // line + mascot avatar. The original split-flap timer is replaced
      // here so the cabinet shows the "win" content rather than 00:00.
      {
        id: 'win-cabinet',
        type: 'group',
        classes: {
          className: {
            base: 'pa-screen relative w-full max-w-[min(94vw,40rem)] flex flex-col items-center justify-center gap-3 py-12 z-30',
            md: 'md:gap-4 md:py-16',
          },
        },
        children: [
          // Halation glow behind the screen (same as live).
          {
            id: 'win-halo',
            type: 'background',
            props: { kind: 'gradient' },
            classes: { className: { base: 'pa-halo' } },
          },
          // Mascot avatar — pixel octopus, bottom-left corner of the cabinet.
          {
            id: 'win-avatar',
            type: 'background',
            props: { kind: 'gradient' },
            classes: { className: { base: 'pa-win-avatar' } },
          },
          // Hero event title in magenta with cyan halo.
          {
            id: 'win-hero',
            type: 'event-title',
            props: { source: 'subtitle' },
            classes: { className: { base: 'pa-win-hero' } },
          },
          // Stat line — "★ YOU WAITED · GG ★" in pixel mono.
          // Text supplied via .pa-win-stat::before so an empty background
          // slot div carries it (no slot type for free-form text).
          {
            id: 'win-stat',
            type: 'background',
            props: { kind: 'gradient' },
            classes: { className: { base: 'pa-win-stat' } },
          },
        ],
      },
      // Arcade button row — chain-reactions left→right after the marquee
      // swell, then holds lit. Uses the same segmented progress slot as
      // live so the existing candy color rules apply.
      {
        id: 'win-buttons',
        type: 'progress',
        props: { kind: 'segments', direction: 'elapsed' },
        classes: {
          className: {
            base: 'relative z-30 w-full max-w-[min(94vw,40rem)]',
          },
        },
      },
      // CTA pill — yellow arcade button. Slides up from below the cabinet
      // and receives focus. Text in .pa-win-cta::before; the empty
      // background slot div provides the box.
      {
        id: 'win-cta',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pa-win-cta relative z-30 select-none inline-block',
          },
        },
      },
    ],
  },
  // Phase 10 — reduced-motion variant. Drop tilt parallax, particles,
  // split-flap, fireworks. Keep colors, marquee, and structure intact.
  // Audio stays (it's informational on hour/day rollover); haptics drop.
  reducedMotion: {
    haptics: {},
    layout: {
      id: 'root-rm',
      type: 'group',
      classes: {
        className: {
          base: 'relative min-h-screen w-full flex flex-col items-center justify-center gap-6 px-4 py-10 overflow-hidden',
          md: 'md:gap-10 md:px-10 md:py-16',
        },
      },
      children: [
        {
          id: 'title-rm',
          type: 'event-title',
          props: { source: 'title' },
        },
        {
          id: 'cabinet-rm',
          type: 'group',
          classes: {
            className: {
              base: 'pa-screen relative w-full max-w-[min(94vw,40rem)] flex flex-col items-center gap-4',
              md: 'md:gap-6 md:p-10',
            },
          },
          children: [
            {
              id: 'timer-rm',
              type: 'timer',
              // Static digits (no split-flap) in reduced motion.
              props: { format: 'dhms', padZeros: true },
              vars: {
                base: {
                  'ct-timer-gap': '0.9rem',
                  'ct-unit-min-width': '2.4ch',
                  'ct-timer-justify': 'center',
                },
              },
              classes: { className: { base: 'justify-center' } },
            },
            {
              id: 'subtitle-rm',
              type: 'event-title',
              props: { source: 'subtitle' },
              classes: {
                className: { base: 'relative z-[4] text-center mt-1' },
              },
            },
          ],
        },
        {
          id: 'buttons-rm',
          type: 'progress',
          props: { kind: 'segments', direction: 'elapsed' },
          classes: { className: { base: 'w-full max-w-[min(94vw,40rem)]' } },
        },
      ],
    },
  },
}
