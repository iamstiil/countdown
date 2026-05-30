import type { CountdownTheme } from '../theming/types'

/**
 * Tide Letters — time as handwritten ink dissolving into seawater.
 *
 * A tall, portrait-oriented "page" of warm, fibrous paper. The countdown
 * digits are wet calligraphic ink with bleed halos (real SVG `ink-bleed`
 * filter). A soft tideline of water sits at the foot of the page and
 * creeps upward as the event approaches, breathing on a slow sine.
 * Grains of sand and bits of seafoam settle in the margins.
 *
 * Reactive moments:
 *  - Per-second ink bleed pulse on the active digit (`data-just-changed`).
 *  - Tide breathes (`progress motion: breathe`) while net-rising on
 *    `--ct-progress`.
 *  - Pull-to-refresh curls the page; release snaps flat.
 *  - Long-press on the timer smears the ink briefly.
 *  - At T-zero: a watercolor bloom disperses the ink and the event title
 *    floats up from beneath the surface.
 */
export const tideLettersTheme: CountdownTheme = {
  id: 'tide-letters',
  name: 'Tide Letters',
  // Phase 8 — structured font manifest (replaces ad-hoc @import).
  fonts: [
    {
      family: 'Cormorant Garamond',
      weights: [400, 600],
      source: 'google',
    },
    { family: 'Caveat', weights: [500, 700], source: 'google' },
    { family: 'Inter', weights: [400, 500], source: 'google' },
  ],
  // Phase 7 — real SVG filters.
  defs: {
    filters: ['ink-bleed', 'watercolor', 'paper-grain'],
  },
  // Phase 3 — idle is not part of Tide Letters' described behavior; leave
  // unset so the page sits still when the user does.
  tokens: {
    base: {
      color: {
        // Sun-bleached parchment, never pure white.
        bg: '#f3ead7',
        // Deep squid-ink indigo for lettering.
        fg: '#1d1b3a',
        // Brine teal — the rising tide.
        accent: '#2c6a6a',
        // Walnut margin notes.
        muted: '#7a6646',
        title: '#5b4a31',
      },
      font: {
        display:
          '"Cormorant Garamond", "EB Garamond", "Times New Roman", Georgia, serif',
        label: '"Inter", system-ui, sans-serif',
        subtitle: '"Caveat", "Cormorant Garamond", "Times New Roman", serif',
      },
      size: {
        timer: 'clamp(3.5rem, 18vw, 9rem)',
        title: 'clamp(0.65rem, 1.5vw, 0.78rem)',
        label: '0.62rem',
        subtitle: 'clamp(1.25rem, 3vw, 2rem)',
      },
      motion: { fast: '260ms', slow: '1400ms' },
      effect: {
        // Phase 7 — filter tokens. Themes opt slots in via CSS variables.
        'filter-ink': 'url(#ct-ink-bleed)',
        'filter-watercolor': 'url(#ct-watercolor)',
      },
    },
    md: {
      // Sized to fit 8 split digits + gaps inside the 34rem portrait card.
      size: { timer: 'clamp(2.2rem, 5.5vw, 4rem)' },
    },
  },
  // Haptics: a single soft pulse at each minute boundary (a heartbeat for
  // the rising tide). No coin-clack universe — Tide Letters is hushed.
  haptics: {
    minuteBoundary: 8,
    finalMinute: [20, 60, 20],
    zero: [40, 80, 40, 80, 120],
  },
  animations: {
    paper: `
      /* On wide viewports the parchment is a tall, centered "page" so
         the layout reads as a love letter rather than a full-bleed wash.
         On mobile it fills the screen as described. The outer body keeps
         a hushed gradient so the page sits against ambient air. */
      [data-ct-theme="tide-letters"] {
        background:
          radial-gradient(ellipse 80% 60% at 50% 30%, rgba(243, 234, 215, 0.65), transparent 70%),
          linear-gradient(180deg, #2a2a3a 0%, #1a1a26 100%);
      }
      [data-ct-theme="tide-letters"] .tl-page {
        position: relative;
        background-color: var(--ct-color-bg);
        background-image:
          /* Warm, fibrous paper — oat + apricot bleed so the page reads
             parchment even when the tide layers stack above. */
          radial-gradient(ellipse 90% 70% at 18% 10%, rgba(255, 234, 196, 0.85), transparent 60%),
          radial-gradient(ellipse 75% 60% at 85% 88%, rgba(228, 196, 152, 0.75), transparent 65%),
          radial-gradient(ellipse 60% 70% at 50% 50%, rgba(243, 220, 174, 0.45), transparent 70%),
          radial-gradient(circle at 50% 50%, transparent 55%, rgba(91, 74, 49, 0.18) 100%);
        overflow: hidden;
        transform-origin: top center;
        transform-style: preserve-3d;
        perspective: 1400px;
        transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      [data-ct-theme="tide-letters"] [data-gesture="page-curl"] .tl-page,
      [data-ct-theme="tide-letters"] .tl-page {
        --tl-pull: var(--ct-pull, 0);
        transform:
          perspective(1400px)
          rotateX(calc(var(--tl-pull) * 18deg))
          translateY(calc(var(--tl-pull) * 24px));
      }
      /* Snap-flat on release: data-gesture stamped for one frame. */
      [data-ct-theme="tide-letters"][data-gesture="page-curl"] .tl-page {
        animation: tl-snap 520ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      @keyframes tl-snap {
        0%   { transform: perspective(1400px) rotateX(14deg) translateY(20px); }
        60%  { transform: perspective(1400px) rotateX(-3deg) translateY(-4px); }
        100% { transform: perspective(1400px) rotateX(0) translateY(0); }
      }
    `,
    grain: `
      /* Paper fiber grain — a layered radial pattern softened with the
         built-in paper-grain SVG filter. */
      [data-ct-theme="tide-letters"] .tl-grain {
        background-image:
          radial-gradient(rgba(60, 40, 20, 0.18) 1px, transparent 1.2px),
          radial-gradient(rgba(60, 40, 20, 0.10) 1px, transparent 1.2px);
        background-size: 3px 3px, 7px 7px;
        background-position: 0 0, 1px 2px;
        mix-blend-mode: multiply;
        opacity: 0.55;
        filter: var(--ct-effect-filter-watercolor, none);
      }
      /* Wet edges — page darkens at the bottom margin as the tide line
         rises. Driven by --ct-progress (Phase 1). Kept narrow so the
         warm paper dominates above the waterline. */
      [data-ct-theme="tide-letters"] .tl-edge {
        position: absolute;
        left: 0; right: 0; bottom: 0;
        height: calc(12vh + var(--ct-progress, 0) * 22vh);
        pointer-events: none;
        background: linear-gradient(
          to top,
          rgba(29, 27, 58, calc(0.16 + var(--ct-progress, 0) * 0.12)),
          transparent
        );
        mix-blend-mode: multiply;
        transition: height 1400ms cubic-bezier(0.22, 1, 0.36, 1);
      }
    `,
    inkBleed: `
      [data-ct-theme="tide-letters"] [data-slot="timer"] [data-value] {
        color: var(--ct-color-fg);
        font-style: italic;
        /* Uneven stroke weight — calligraphic wet-pen feel. */
        font-weight: 600;
        letter-spacing: -0.01em;
        /* Real ink halo via SVG turbulence + displacement (Phase 7). */
        filter: var(--ct-effect-filter-ink, none);
        text-shadow:
          0 0 1.6px rgba(29, 27, 58, 0.75),
          0 0.6px 0.4px rgba(29, 27, 58, 0.55),
          0 0 14px rgba(29, 27, 58, 0.28),
          0 0 30px rgba(44, 106, 106, 0.18);
        transition: text-shadow 1200ms ease-out;
        will-change: filter, text-shadow;
      }
      /* Tick-driven bleed pulse (Phase 1 'data-just-changed'). */
      [data-ct-theme="tide-letters"] [data-slot="timer"] [data-value][data-just-changed] {
        animation: tl-bleed-pulse 1100ms ease-out;
      }
      /* Occasional ink pooling at stroke ends — a small subpixel jitter on
         the digits that the displacement filter renders as a pool. */
      [data-ct-theme="tide-letters"] [data-slot="timer"] [data-value][data-just-changed]::before {
        content: "";
      }
      @keyframes tl-bleed-pulse {
        0% {
          text-shadow:
            0 0 1.2px rgba(29, 27, 58, 0.55),
            0 0.6px 0.4px rgba(29, 27, 58, 0.35),
            0 0 12px rgba(29, 27, 58, 0.18),
            0 0 26px rgba(44, 106, 106, 0.10);
        }
        20% {
          text-shadow:
            0 0 2.2px rgba(29, 27, 58, 0.85),
            0 0.6px 0.4px rgba(29, 27, 58, 0.55),
            0 0 24px rgba(29, 27, 58, 0.35),
            0 0 48px rgba(44, 106, 106, 0.25);
        }
        100% {
          text-shadow:
            0 0 1.2px rgba(29, 27, 58, 0.55),
            0 0.6px 0.4px rgba(29, 27, 58, 0.35),
            0 0 12px rgba(29, 27, 58, 0.18),
            0 0 26px rgba(44, 106, 106, 0.10);
        }
      }
      /* Long-press smear — a single droplet drags the digits briefly.
         Gesture wrapper stamps data-gesture="smear" for one frame on
         long-press; the keyframe runs once and reforms the ink. */
      [data-ct-theme="tide-letters"] [data-gesture="smear"] [data-slot="timer"] [data-value] {
        animation: tl-smear 700ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      @keyframes tl-smear {
        0%   { transform: translateY(0)    skewX(0);   opacity: 1; }
        35%  { transform: translateY(10px) skewX(-4deg); opacity: 0.6; filter: blur(1.6px) var(--ct-effect-filter-ink, none); }
        70%  { transform: translateY(4px)  skewX(2deg);  opacity: 0.85; filter: blur(0.6px) var(--ct-effect-filter-ink, none); }
        100% { transform: translateY(0)    skewX(0);   opacity: 1; }
      }
    `,
    labels: `
      [data-ct-theme="tide-letters"] [data-slot="timer"] [data-label] {
        font-family: var(--ct-font-label);
        letter-spacing: 0.32em;
        opacity: 0.65;
        font-variant: small-caps;
      }
    `,
    title: `
      [data-ct-theme="tide-letters"] [data-slot="event-title"][data-source="title"] {
        font-family: var(--ct-font-label);
        letter-spacing: 0.42em;
        font-weight: 500;
      }
      [data-ct-theme="tide-letters"] [data-slot="event-title"][data-source="title"]::before {
        content: "— ";
        opacity: 0.55;
      }
      [data-ct-theme="tide-letters"] [data-slot="event-title"][data-source="title"]::after {
        content: " —";
        opacity: 0.55;
      }
      [data-ct-theme="tide-letters"] [data-slot="event-title"][data-source="subtitle"] {
        font-family: var(--ct-font-subtitle);
        font-style: italic;
        line-height: 1.25;
        color: var(--ct-color-fg);
        opacity: 0.85;
      }
    `,
    tide: `
      /* The tideline — a soft watercolor bar that sits where the progress
         fill lives. Its color shifts with --ct-progress: brine green
         (early) → foggy teal (mid) → cold moonstone blue (near zero). */
      [data-ct-theme="tide-letters"] [data-slot="progress"][data-kind="bar"] {
        height: 4px;
        background: transparent;
        border-radius: 0;
        overflow: visible;
        position: relative;
      }
      [data-ct-theme="tide-letters"] [data-slot="progress"][data-kind="bar"]::before {
        content: "";
        position: absolute;
        left: 0; right: 0; top: -2px;
        height: 1px;
        background: repeating-linear-gradient(
          to right,
          rgba(29, 27, 58, 0.4) 0 10px,
          transparent 10px 16px
        );
        opacity: 0.65;
      }
      [data-ct-theme="tide-letters"] [data-slot="progress"][data-kind="bar"] > span {
        height: 4px;
        /* Single hue gradient; the pool below carries the progress-driven
           color shift (brine green → foggy teal → moonstone blue). The
           ends fade so the bar dissolves into the pool rather than
           reading as a hard horizontal seam. */
        background: linear-gradient(
          90deg,
          rgba(74, 138, 110, 0) 0%,
          #4a8a6e 12%,
          #2c6a6a 55%,
          #5678a8 88%,
          rgba(86, 120, 168, 0) 100%
        );
        box-shadow:
          0 0 14px rgba(44, 106, 106, 0.5),
          0 6px 24px rgba(44, 106, 106, 0.22);
      }
      /* The watercolor pool. Three stacked layers (brine, teal, moonstone)
         cross-fade via opacity driven by --ct-progress, so the tide hue
         shifts from brine green → foggy teal → cold moonstone blue right
         before zero. Height also rises with progress. A slow breath sits
         on top for ambient motion that doesn't tick. */
      [data-ct-theme="tide-letters"] .tl-pool {
        position: absolute;
        left: 0; right: 0; bottom: 0;
        height: calc(6vh + (var(--ct-progress, 0) * 44vh));
        pointer-events: none;
        transition: height 1200ms cubic-bezier(0.22, 1, 0.36, 1);
        animation: tl-breathe 9s ease-in-out infinite;
      }
      [data-ct-theme="tide-letters"] .tl-pool::before,
      [data-ct-theme="tide-letters"] .tl-pool::after {
        content: "";
        position: absolute;
        inset: 0;
        filter: blur(6px);
        transition: opacity 1400ms ease-out;
      }
      /* Brine green base layer — fades out as the event approaches. */
      [data-ct-theme="tide-letters"] .tl-pool::before {
        background:
          radial-gradient(ellipse 60% 70% at 30% 20%, rgba(74, 138, 110, 0.34), transparent 70%),
          radial-gradient(ellipse 50% 60% at 75% 30%, rgba(60, 110, 92, 0.22), transparent 70%),
          linear-gradient(to top, rgba(74, 138, 110, 0.26), transparent);
        opacity: calc(1 - var(--ct-progress, 0) * 0.85);
      }
      /* Foggy teal + cold moonstone blue top layer — fades in. */
      [data-ct-theme="tide-letters"] .tl-pool::after {
        background:
          radial-gradient(ellipse 60% 70% at 30% 20%, rgba(86, 120, 168, 0.32), transparent 70%),
          radial-gradient(ellipse 50% 60% at 75% 30%, rgba(44, 106, 106, 0.24), transparent 70%),
          linear-gradient(to top, rgba(86, 120, 168, 0.28), rgba(44, 106, 106, 0.10) 60%, transparent);
        opacity: var(--ct-progress, 0);
      }
      @keyframes tl-breathe {
        0%, 100% { transform: translateY(6px); opacity: 0.85; }
        50%      { transform: translateY(0);   opacity: 1; }
      }
    `,
    done: `
      /* T-zero scene: the tide overtakes the page. The doneLayout
         repositions the event title as the floating word and lets the
         watercolor-bloom effect-layer disperse the ink underneath. */
      [data-ct-theme="tide-letters"][data-state="done"] .tl-pool {
        height: 100vh;
        animation-play-state: paused;
        opacity: 0.95;
      }
      [data-ct-theme="tide-letters"][data-state="done"] .tl-grain {
        opacity: 0.25;
      }
      [data-ct-theme="tide-letters"] .tl-float-word {
        font-family: var(--ct-font-subtitle, var(--ct-font-display));
        font-style: italic;
        font-size: clamp(2rem, 6vw, 3.5rem);
        color: var(--ct-color-fg);
        letter-spacing: 0;
        text-transform: none;
        text-align: center;
        opacity: 0;
        filter: var(--ct-effect-filter-watercolor, none);
        animation: tl-float-up 4200ms cubic-bezier(0.22, 1, 0.36, 1) 600ms forwards;
        max-width: 32ch;
      }
      @keyframes tl-float-up {
        0%   { opacity: 0; transform: translateY(48px) scale(0.96); filter: blur(8px); }
        60%  { opacity: 0.95; transform: translateY(-6px) scale(1.02); filter: blur(1px); }
        100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
      }
    `,
    fontsReady: `
      /* Phase 8 — FOUT-free reveal once declared fonts have loaded. */
      [data-ct-theme="tide-letters"][data-fonts-ready="false"] [data-slot="timer"],
      [data-ct-theme="tide-letters"][data-fonts-ready="false"] [data-slot="event-title"] {
        opacity: 0;
      }
      [data-ct-theme="tide-letters"][data-fonts-ready="true"] [data-slot="timer"],
      [data-ct-theme="tide-letters"][data-fonts-ready="true"] [data-slot="event-title"] {
        opacity: 1;
        transition: opacity 360ms ease;
      }
    `,
  },
  layout: {
    id: 'root',
    type: 'group',
    // Phase 6 — pull-to-refresh stays on root so the gesture wrapper
    // covers the full viewport (otherwise it would collapse to its
    // page-card width and only fire when dragging on the parchment).
    interactions: { pull: 'page-curl' },
    classes: {
      className: {
        base: 'relative min-h-screen w-full flex items-stretch justify-center overflow-hidden',
      },
    },
    children: [
      // The "page" wrapper — the tall portrait parchment that everything
      // lives inside. On desktop it's a centered card; on mobile it
      // fills the screen. All paper, grain, particles, ink, and tide
      // layers are children so they're clipped to the page edge.
      {
        id: 'page',
        type: 'group',
        classes: {
          className: {
            base: 'tl-page min-h-screen w-full flex flex-col items-center justify-between px-6 pt-12 pb-10',
            md: 'md:min-h-[calc(100vh-4rem)] md:max-w-[34rem] md:my-8 md:rounded-sm md:shadow-[0_30px_80px_-20px_rgba(20,18,40,0.55),0_0_0_1px_rgba(91,74,49,0.18)]',
          },
        },
        children: [
          // Paper fiber grain.
          {
            id: 'grain',
            type: 'background',
            props: { kind: 'gradient' },
            classes: { className: { base: 'absolute inset-0 -z-10 tl-grain' } },
          },
          // Wet darkening at the bottom margin as the tide creeps up.
          {
            id: 'edge',
            type: 'background',
            props: { kind: 'gradient' },
            classes: { className: { base: 'tl-edge' } },
          },
          // Phase 4 — sand grains in the margins. Particles layer is
          // pointer-transparent and clipped to the page.
          {
            id: 'sand',
            type: 'particles',
            props: {
              kind: 'sand',
              count: 90,
              lifetimeMs: 5200,
              trigger: 'loop',
              gravity: 30,
              wind: -6,
              /* Warmer, darker grains so they read against the parchment. */
              palette: ['#b89460', '#a07c44', '#8a6738', '#c4a26c', '#7a5a2e'],
            },
            classes: {
              className: {
                base: 'absolute inset-0 pointer-events-none opacity-90',
              },
            },
          },
          // Bits of seafoam — light bubble flecks drifting up from the tide.
          {
            id: 'foam',
            type: 'particles',
            props: {
              kind: 'bubbles',
              count: 18,
              lifetimeMs: 6000,
              trigger: 'loop',
              palette: [
                'rgba(255,255,255,0.55)',
                'rgba(220,235,228,0.45)',
                'rgba(200,222,218,0.4)',
              ],
            },
            classes: {
              className: {
                base: 'absolute inset-x-0 bottom-0 h-[50vh] pointer-events-none',
              },
            },
          },
          // Top: eyebrow title (e.g. "— A LETTER FOR YOU —")
          {
            id: 'title',
            type: 'event-title',
            props: { source: 'title' },
            classes: { className: { base: 'text-center relative z-10' } },
          },
          // Middle: the handwritten body — subtitle as the salutation,
          // then the ink digits as the body of the letter.
          {
            id: 'body',
            type: 'group',
            // Long-press on the timer smears the ink briefly.
            interactions: { longPress: 'smear' },
            classes: {
              className: {
                base: 'flex flex-col items-center gap-6 text-center max-w-[44rem] relative z-10',
                md: 'md:gap-10',
              },
            },
            children: [
              {
                id: 'subtitle',
                type: 'event-title',
                props: { source: 'subtitle' },
              },
              {
                id: 'timer',
                type: 'timer',
                props: {
                  format: 'dhms',
                  padZeros: true,
                  // Phase 2 — per-digit DOM so future per-character
                  // gestures and the smear keyframe target individual
                  // `data-digit`s.
                  splitDigits: true,
                },
                vars: {
                  base: {
                    'ct-timer-gap': '1.1rem',
                    'ct-unit-gap': '0.5rem',
                    'ct-unit-min-width': '2.2ch',
                    'ct-weight-timer': '600',
                    'ct-tracking-timer': '-0.01em',
                    'ct-timer-justify': 'center',
                  },
                  md: {
                    'ct-timer-gap': '2.2rem',
                    'ct-unit-min-width': '2.4ch',
                  },
                },
              },
            ],
          },
          // Bottom: tideline + the rising watercolor pool.
          {
            id: 'foot',
            type: 'group',
            classes: {
              className: {
                base: 'relative w-full flex flex-col items-stretch gap-3 z-10',
              },
            },
            children: [
              {
                id: 'pool',
                type: 'background',
                props: { kind: 'gradient' },
                classes: { className: { base: 'tl-pool' } },
              },
              {
                id: 'tide',
                type: 'progress',
                props: {
                  kind: 'bar',
                  direction: 'elapsed',
                  // Phase 1 — real breath modulation, not a decorative loop.
                  motion: 'breathe',
                  breatheAmplitude: 0.012,
                  breathePeriodMs: 9000,
                },
                classes: { className: { base: 'relative w-full' } },
              },
            ],
          },
        ],
      },
    ],
  },
  // Phase 3 — T-zero scene. The tide swallows the page (handled by the
  // .tl-pool CSS keyed off data-state="done"); a watercolor-bloom canvas
  // disperses the ink; the event title floats up to the surface.
  doneLayout: {
    id: 'done-root',
    type: 'group',
    classes: {
      className: {
        base: 'relative min-h-screen w-full flex items-center justify-center px-6 overflow-hidden',
      },
    },
    children: [
      // Tide fills the page.
      {
        id: 'done-pool',
        type: 'background',
        props: { kind: 'gradient' },
        classes: { className: { base: 'tl-pool' } },
      },
      // Watercolor bloom canvas — fires bursts continuously after the
      // done state mounts, simulating ink dispersing underwater.
      {
        id: 'bloom',
        type: 'effect-layer',
        props: {
          effect: 'watercolor-bloom',
          // Phase 4 — bus-event trigger. Refire on every secondTick post-
          // zero so the bloom keeps unfolding rather than freezing.
          trigger: 'secondTick',
        },
        classes: { className: { base: 'absolute inset-0' } },
      },
      // The floating word: the event title rises through the bloom.
      {
        id: 'float',
        type: 'event-title',
        props: { source: 'title' },
        classes: {
          className: { base: 'relative z-10 tl-float-word' },
        },
      },
    ],
  },
  // Phase 10 — reduced-motion variant: no particles, no bloom canvas, no
  // page-curl interaction. The tide still rises (informational), but
  // breathing/smear/sand/foam are all off.
  reducedMotion: {
    layout: {
      id: 'root-rm',
      type: 'group',
      classes: {
        className: {
          base: 'relative min-h-screen w-full flex flex-col items-center justify-between px-6 pt-12 pb-10 overflow-hidden',
          md: 'md:px-16 md:pt-20 md:pb-16',
        },
      },
      children: [
        {
          id: 'grain',
          type: 'background',
          props: { kind: 'gradient' },
          classes: {
            className: { base: 'absolute inset-0 -z-10 tl-grain' },
          },
        },
        {
          id: 'title',
          type: 'event-title',
          props: { source: 'title' },
          classes: { className: { base: 'text-center' } },
        },
        {
          id: 'body',
          type: 'group',
          classes: {
            className: {
              base: 'flex flex-col items-center gap-6 text-center max-w-[44rem]',
              md: 'md:gap-10',
            },
          },
          children: [
            {
              id: 'subtitle',
              type: 'event-title',
              props: { source: 'subtitle' },
            },
            {
              id: 'timer',
              type: 'timer',
              props: { format: 'dhms', padZeros: true },
              vars: {
                base: {
                  'ct-timer-gap': '1.1rem',
                  'ct-unit-min-width': '2.2ch',
                  'ct-weight-timer': '600',
                  'ct-timer-justify': 'center',
                },
              },
            },
          ],
        },
        {
          id: 'foot',
          type: 'group',
          classes: {
            className: { base: 'relative w-full flex flex-col gap-3' },
          },
          children: [
            {
              id: 'tide',
              type: 'progress',
              props: { kind: 'bar', direction: 'elapsed', motion: 'linear' },
              classes: { className: { base: 'relative w-full' } },
            },
          ],
        },
      ],
    },
    // No haptics in reduced-motion (vibrate is itself a motion signal).
    haptics: {},
  },
}
