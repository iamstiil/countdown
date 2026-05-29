import type { CountdownTheme } from '../theming/types'

/**
 * Tide Letters — time as handwritten ink dissolving into seawater.
 *
 * Warm parchment page, calligraphic ink digits with a wet-bleed halo,
 * a slow breathing tide line at the foot of the page. Wistful and intimate.
 */
export const tideLettersTheme: CountdownTheme = {
  id: 'tide-letters',
  name: 'Tide Letters',
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
        // Calligraphic display; Inter as the quiet label voice.
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
    },
    md: {
      size: { timer: 'clamp(5rem, 13vw, 13rem)' },
    },
  },
  animations: {
    fonts: `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Caveat:wght@500;700&family=Inter:wght@400;500&display=swap');
    `,
    paper: `
      [data-ct-theme="tide-letters"] {
        background-color: var(--ct-color-bg);
        background-image:
          radial-gradient(ellipse 80% 60% at 20% 12%, rgba(255, 240, 210, 0.55), transparent 60%),
          radial-gradient(ellipse 70% 55% at 82% 88%, rgba(214, 188, 150, 0.45), transparent 65%),
          radial-gradient(circle at 50% 50%, transparent 55%, rgba(91, 74, 49, 0.18) 100%);
      }
    `,
    grain: `
      [data-ct-theme="tide-letters"] .tl-grain {
        background-image:
          radial-gradient(rgba(60, 40, 20, 0.18) 1px, transparent 1.2px),
          radial-gradient(rgba(60, 40, 20, 0.10) 1px, transparent 1.2px);
        background-size: 3px 3px, 7px 7px;
        background-position: 0 0, 1px 2px;
        mix-blend-mode: multiply;
        opacity: 0.55;
      }
    `,
    inkBleed: `
      [data-ct-theme="tide-letters"] [data-slot="timer"] [data-value] {
        color: var(--ct-color-fg);
        font-style: italic;
        text-shadow:
          0 0 1.2px rgba(29, 27, 58, 0.55),
          0 0.6px 0.4px rgba(29, 27, 58, 0.35),
          0 0 12px rgba(29, 27, 58, 0.18),
          0 0 26px rgba(44, 106, 106, 0.10);
        transition: text-shadow 1200ms ease-out;
      }
      /* Tick-driven bleed pulse: Phase 1 'data-just-changed' attribute. */
      [data-ct-theme="tide-letters"] [data-slot="timer"] [data-value][data-just-changed] {
        animation: tl-bleed-pulse 1100ms ease-out;
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
      /* The tideline: a horizontal bar with a watercolor wash above it. */
      [data-ct-theme="tide-letters"] [data-slot="progress"][data-kind="bar"] {
        height: 2px;
        background: transparent;
        border-radius: 0;
        overflow: visible;
        position: relative;
      }
      [data-ct-theme="tide-letters"] [data-slot="progress"][data-kind="bar"]::before {
        content: "";
        position: absolute;
        left: 0; right: 0; top: -1px;
        height: 1px;
        background: repeating-linear-gradient(
          to right,
          rgba(29, 27, 58, 0.35) 0 8px,
          transparent 8px 14px
        );
        opacity: 0.55;
      }
      [data-ct-theme="tide-letters"] [data-slot="progress"][data-kind="bar"] > span {
        height: 2px;
        background: linear-gradient(90deg, #2c6a6a 0%, #4f8f86 60%, #1d1b3a 100%);
        box-shadow:
          0 0 12px rgba(44, 106, 106, 0.45),
          0 6px 24px rgba(44, 106, 106, 0.18);
      }
      /* The watercolor pool that grows beneath the tideline.
         Height tracks continuous progress (--ct-progress, Phase 1) so the
         pool genuinely rises as the countdown elapses, while a slow CSS
         breath sits on top for ambient motion. */
      [data-ct-theme="tide-letters"] .tl-pool {
        position: absolute;
        left: 0; right: 0; bottom: 0;
        height: calc(8vh + (var(--ct-progress, 0) * 60vh));
        pointer-events: none;
        background:
          radial-gradient(ellipse 60% 70% at 30% 20%, rgba(44, 106, 106, 0.28), transparent 70%),
          radial-gradient(ellipse 50% 60% at 75% 30%, rgba(29, 27, 58, 0.22), transparent 70%),
          linear-gradient(to top, rgba(44, 106, 106, 0.22), transparent);
        filter: blur(8px);
        transition: height 1200ms cubic-bezier(0.22, 1, 0.36, 1);
        animation: tl-breathe 9s ease-in-out infinite;
      }
      @keyframes tl-breathe {
        0%, 100% { transform: translateY(8px); opacity: 0.85; }
        50%      { transform: translateY(0);   opacity: 1; }
      }
    `,
  },
  layout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        base: 'relative min-h-screen w-full flex flex-col items-center justify-between px-6 pt-12 pb-10 overflow-hidden',
        md: 'md:px-16 md:pt-20 md:pb-16',
      },
    },
    children: [
      // Paper fiber grain — sits above the base paper gradient.
      {
        id: 'grain',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: { base: 'absolute inset-0 -z-10 tl-grain' },
        },
      },
      // Top: eyebrow title (e.g. "— A LETTER FOR YOU —")
      {
        id: 'title',
        type: 'event-title',
        props: { source: 'title' },
        classes: { className: { base: 'text-center' } },
      },
      // Middle: the handwritten body — subtitle as the salutation,
      // then the ink digits as the body of the letter.
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
            base: 'relative w-full flex flex-col items-stretch gap-3',
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
              // Phase 1: real breath modulation, not a decorative loop.
              motion: 'breathe',
              breatheAmplitude: 0.012,
              breathePeriodMs: 9000,
            },
            classes: {
              className: { base: 'relative w-full' },
            },
          },
        ],
      },
    ],
  },
}
