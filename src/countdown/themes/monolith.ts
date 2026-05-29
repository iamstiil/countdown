import type { CountdownTheme } from '../theming/types'

/**
 * Monolith — a single, massive countdown block. No labels, no progress bar,
 * just the digits themselves rendered as architecture. Title and subtitle
 * remain available as quiet typographic chrome.
 */
export const monolithTheme: CountdownTheme = {
  id: 'monolith',
  name: 'Monolith',
  tokens: {
    base: {
      color: {
        bg: '#0a0a0a',
        fg: '#f5f5f4', // stone-100
        accent: '#f5f5f4',
        muted: '#525252', // neutral-600
        title: '#a3a3a3', // neutral-400
      },
      font: {
        display:
          '"Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif',
        label: '"Inter", system-ui, sans-serif',
      },
      size: {
        timer: 'clamp(4rem, 22vw, 16rem)',
        title: 'clamp(0.7rem, 1.4vw, 0.85rem)',
      },
      motion: { fast: '200ms', slow: '900ms' },
    },
    md: {
      size: { timer: 'clamp(7rem, 20vw, 22rem)' },
    },
  },
  layout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        base: 'relative min-h-screen w-full flex flex-col items-center justify-center gap-8 px-4 py-12 overflow-hidden bg-[color:var(--ct-color-bg)] text-[color:var(--ct-color-fg)]',
        md: 'md:gap-12 md:py-16',
      },
    },
    children: [
      // Subtle floor gradient for depth — keeps the bg from feeling flat.
      {
        id: 'bg-floor',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,color-mix(in_oklab,var(--ct-color-fg),transparent_92%),transparent_70%)]',
          },
        },
      },
      // Eyebrow title
      {
        id: 'title',
        type: 'event-title',
        props: { source: 'title' },
        classes: {
          className: { base: 'text-center' },
        },
      },
      // The monolith: a single huge digit block, no labels, tight tracking.
      {
        id: 'timer',
        type: 'timer',
        props: { format: 'dhms', padZeros: true },
        vars: {
          base: {
            'ct-label-display': 'none',
            'ct-timer-gap': '0.4em',
            'ct-unit-gap': '0',
            'ct-unit-min-width': '2ch',
            'ct-weight-timer': '700',
            'ct-tracking-timer': '-0.06em',
            'ct-color-value': 'var(--ct-color-fg)',
          },
          md: {
            'ct-timer-gap': '0.45em',
          },
        },
        classes: {
          className: {
            base: 'leading-none [&_[data-value]]:drop-shadow-[0_0_60px_color-mix(in_oklab,var(--ct-color-fg),transparent_80%)]',
          },
        },
      },
      // Subtitle as quiet footer chrome
      {
        id: 'subtitle',
        type: 'event-title',
        props: { source: 'subtitle' },
        classes: {
          className: { base: 'text-center' },
        },
        vars: {
          base: {
            'ct-color-subtitle': 'var(--ct-color-muted)',
            'ct-size-subtitle': 'clamp(0.85rem, 1.4vw, 1rem)',
          },
        },
      },
    ],
  },
}
