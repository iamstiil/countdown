import type { CountdownTheme } from '../theming/types'

/**
 * Minimal Stack — editorial, bottom-aligned, off-white background, refined
 * typography. Demonstrates a completely different layout via schema, not
 * CSS toggles.
 */
export const minimalStackTheme: CountdownTheme = {
  id: 'minimal-stack',
  name: 'Minimal Stack',
  tokens: {
    base: {
      color: {
        bg: '#fafaf7', // warm off-white
        fg: '#0c0a09', // stone-950
        accent: '#0c0a09',
        muted: '#78716c', // stone-500
      },
      font: {
        display: '"Fraunces", "Times New Roman", Georgia, serif',
        label: '"Inter", system-ui, sans-serif',
      },
      size: {
        timer: 'clamp(3.5rem, 16vw, 10rem)',
        title: '0.8rem',
        label: '0.65rem',
      },
      space: { '4': '1rem', '8': '2rem' },
      motion: { fast: '200ms', slow: '900ms' },
    },
    md: {
      size: { timer: 'clamp(5rem, 13vw, 12rem)' },
    },
  },
  layout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        base: 'min-h-screen w-full flex flex-col items-start justify-end gap-6 p-8 pb-12 bg-[color:var(--ct-color-bg)] text-[color:var(--ct-color-fg)]',
        md: 'md:p-16 md:pb-20 md:gap-8',
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
            'ct-timer-gap': '1.5rem',
            'ct-unit-align': 'flex-start',
            'ct-weight-timer': '300',
            'ct-tracking-timer': '-0.05em',
          },
          md: {
            'ct-timer-gap': '3rem',
          },
        },
      },
      {
        id: 'bar',
        type: 'progress',
        props: { kind: 'bar', direction: 'elapsed' },
        classes: {
          className: { base: 'max-w-md' },
        },
        vars: {
          base: { 'ct-progress-height': '2px' },
        },
      },
    ],
  },
}
