import type { CountdownTheme } from '../theming/types'

/**
 * Aurora — soft pastel gradient mesh, frosted glass card, segmented
 * progress indicator. Modern SaaS / event-page feel.
 */
export const auroraTheme: CountdownTheme = {
  id: 'aurora',
  name: 'Aurora',
  tokens: {
    base: {
      color: {
        bg: '#0b0c20',
        fg: '#f5f3ff',
        accent: '#c4b5fd', // violet-300 — slightly brighter for digit punch
        muted: '#c7d2fe', // indigo-200
        title: '#c4b5fd',
      },
      font: {
        display: '"Inter", system-ui, sans-serif',
        label: '"Inter", system-ui, sans-serif',
      },
      size: {
        timer: 'clamp(2.5rem, 10vw, 6.5rem)',
        title: '0.78rem',
        label: '0.68rem',
      },
      motion: { fast: '200ms', slow: '900ms' },
      effect: {
        card: '0 1px 0 0 color-mix(in oklab, white, transparent 82%) inset, 0 40px 80px -24px rgba(0,0,0,0.55), 0 0 0 1px color-mix(in oklab, white, transparent 88%)',
      },
    },
    md: {
      size: { timer: 'clamp(3.5rem, 8vw, 8rem)' },
    },
  },
  layout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        base: 'relative min-h-screen w-full grid place-items-center overflow-hidden isolate bg-[color:var(--ct-color-bg)] p-4 md:p-8',
      },
    },
    children: [
      // Aurora mesh background — richer multi-stop radial blobs
      {
        id: 'bg-mesh',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-10 [background-image:radial-gradient(at_18%_18%,#a78bfa66_0,transparent_55%),radial-gradient(at_82%_28%,#22d3ee55_0,transparent_55%),radial-gradient(at_50%_92%,#f472b655_0,transparent_55%)]',
          },
        },
      },
      // Subtle grain to fight gradient banding
      {
        id: 'bg-grain',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-10 opacity-[0.05] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:3px_3px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]',
          },
        },
      },
      // Glass card
      {
        id: 'card',
        type: 'group',
        classes: {
          className: {
            base: 'relative flex flex-col items-center gap-8 px-7 py-12 rounded-3xl backdrop-blur-2xl bg-white/[0.05] shadow-[var(--ct-effect-card)] w-full max-w-[min(92vw,44rem)]',
            md: 'md:gap-10 md:px-14 md:py-16',
          },
        },
        children: [
          {
            id: 'title',
            type: 'event-title',
            props: { source: 'title' },
          },
          {
            id: 'subtitle',
            type: 'event-title',
            props: { source: 'subtitle' },
            vars: {
              base: {
                'ct-color-subtitle':
                  'color-mix(in oklab, var(--ct-color-fg), transparent 35%)',
                'ct-size-subtitle': 'clamp(0.95rem, 1.8vw, 1.15rem)',
              },
            },
            classes: {
              className: { base: 'text-center -mt-4 md:-mt-6' },
            },
          },
          {
            id: 'timer',
            type: 'timer',
            props: { format: 'dhms', padZeros: true },
            vars: {
              base: {
                'ct-timer-gap': '1rem',
                'ct-unit-min-width': '3.5ch',
                'ct-weight-timer': '500',
                'ct-tracking-timer': '-0.02em',
                'ct-color-value': '#ffffff',
                'ct-color-label':
                  'color-mix(in oklab, var(--ct-color-fg), transparent 50%)',
              },
              md: {
                'ct-timer-gap': '2rem',
              },
            },
          },
          {
            id: 'segments',
            type: 'progress',
            props: { kind: 'segments', direction: 'elapsed' },
            classes: {
              className: { base: 'w-full max-w-sm' },
            },
            vars: {
              base: {
                'ct-segment-height': '5px',
                'ct-segment-gap': '7px',
                'ct-color-progress-track':
                  'color-mix(in oklab, white, transparent 88%)',
                'ct-color-progress-fill':
                  'linear-gradient(90deg, #a78bfa, #22d3ee)',
              },
            },
          },
        ],
      },
    ],
  },
}
