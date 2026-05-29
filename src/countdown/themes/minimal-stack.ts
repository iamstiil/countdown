import type { CountdownTheme } from '../theming/types'

/**
 * Minimal Stack — editorial layout. Title pinned top-left, oversized
 * lightweight serif timer bottom-left, refined progress bar above it.
 * Demonstrates a completely different layout via schema, not CSS toggles.
 */
export const minimalStackTheme: CountdownTheme = {
  id: 'minimal-stack',
  name: 'Minimal Stack',
  tokens: {
    base: {
      color: {
        bg: '#faf8f4', // warmer off-white
        fg: '#1c1917', // stone-900
        accent: '#c2410c', // orange-700 — gives the progress life
        muted: '#78716c', // stone-500
        title: '#44403c', // stone-700
      },
      font: {
        display: '"Fraunces", "Times New Roman", Georgia, serif',
        label: '"Inter", system-ui, sans-serif',
      },
      size: {
        timer: 'clamp(3.5rem, 16vw, 10rem)',
        title: 'clamp(0.7rem, 1.4vw, 0.8rem)',
        label: '0.62rem',
      },
      space: { '4': '1rem', '8': '2rem' },
      motion: { fast: '200ms', slow: '900ms' },
    },
    md: {
      size: { timer: 'clamp(5rem, 13vw, 13rem)' },
    },
  },
  layout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        base: 'min-h-screen w-full flex flex-col items-stretch justify-between p-8 pt-10 pb-12 bg-[color:var(--ct-color-bg)] text-[color:var(--ct-color-fg)]',
        md: 'md:p-16 md:pt-20 md:pb-20',
      },
    },
    children: [
      // Top: eyebrow title + subtitle
      {
        id: 'top',
        type: 'group',
        classes: {
          className: {
            base: 'flex flex-col items-start gap-3 md:gap-4',
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
                'ct-font-subtitle':
                  '"Fraunces", "Times New Roman", Georgia, serif',
                'ct-size-subtitle': 'clamp(1.05rem, 2vw, 1.35rem)',
                'ct-weight-subtitle': '300',
                'ct-tracking-subtitle': '-0.01em',
                'ct-color-subtitle': 'var(--ct-color-muted)',
              },
            },
          },
        ],
      },
      // Bottom: progress + timer
      {
        id: 'bottom',
        type: 'group',
        classes: {
          className: {
            base: 'flex flex-col items-stretch gap-6',
            md: 'md:gap-8',
          },
        },
        children: [
          {
            id: 'bar',
            type: 'progress',
            props: { kind: 'bar', direction: 'elapsed' },
            classes: {
              className: {
                base: 'w-full max-w-xs',
                md: 'md:max-w-sm',
              },
            },
            vars: {
              base: { 'ct-progress-height': '2px' },
            },
          },
          {
            id: 'timer',
            type: 'timer',
            props: { format: 'dhms', padZeros: true },
            vars: {
              base: {
                'ct-timer-gap': '1.5rem',
                'ct-unit-align': 'flex-start',
                'ct-unit-gap': '0.6rem',
                'ct-weight-timer': '300',
                'ct-tracking-timer': '-0.05em',
                'ct-color-value': 'var(--ct-color-fg)',
                'ct-color-label': 'var(--ct-color-muted)',
              },
              md: {
                'ct-timer-gap': '3rem',
                'ct-unit-gap': '0.9rem',
              },
            },
          },
        ],
      },
    ],
  },
}
