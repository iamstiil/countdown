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
        bg: '#0f1023',
        fg: '#f5f3ff',
        accent: '#a78bfa', // violet-400
        muted: '#9ca3af', // gray-400
      },
      font: {
        display: '"Inter", system-ui, sans-serif',
        label: '"Inter", system-ui, sans-serif',
      },
      size: {
        timer: 'clamp(2.5rem, 10vw, 6.5rem)',
        title: '0.8rem',
        label: '0.7rem',
      },
      motion: { fast: '200ms', slow: '900ms' },
      effect: {
        card: '0 1px 0 0 color-mix(in oklab, white, transparent 88%) inset, 0 30px 60px -20px rgba(0,0,0,0.5), 0 0 0 1px color-mix(in oklab, white, transparent 88%)',
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
        base: 'relative min-h-screen w-full grid place-items-center overflow-hidden isolate bg-[color:var(--ct-color-bg)] p-4',
      },
    },
    children: [
      // Aurora mesh background — three soft radial gradients
      {
        id: 'bg-mesh',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-10 [background-image:radial-gradient(at_20%_20%,#a78bfa55_0,transparent_50%),radial-gradient(at_80%_30%,#22d3ee44_0,transparent_50%),radial-gradient(at_50%_90%,#f472b644_0,transparent_50%)]',
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
            base: 'absolute inset-0 -z-10 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:3px_3px]',
          },
        },
      },
      // Glass card
      {
        id: 'card',
        type: 'group',
        classes: {
          className: {
            base: 'relative flex flex-col items-center gap-6 px-6 py-10 rounded-3xl backdrop-blur-2xl bg-white/[0.04] shadow-[var(--ct-effect-card)] w-full max-w-[min(90vw,46rem)]',
            md: 'md:gap-8 md:px-12 md:py-14',
          },
        },
        children: [
          {
            id: 'title',
            type: 'event-title',
            props: { source: 'title' },
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
                'ct-color-accent': '#f5f3ff',
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
              base: { 'ct-segment-height': '4px', 'ct-segment-gap': '6px' },
            },
          },
        ],
      },
    ],
  },
}
