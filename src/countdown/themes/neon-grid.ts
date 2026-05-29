import type { CountdownTheme } from '../theming/types'

/**
 * Neon Grid — futuristic, hero-centered. Layered radial glow + faint grid
 * pattern, cyan accent, progress ring at md+. All visual choices flow from
 * tokens consumed by the base stylesheet.
 */
export const neonGridTheme: CountdownTheme = {
  id: 'neon-grid',
  name: 'Neon Grid',
  tokens: {
    base: {
      color: {
        bg: '#070912',
        fg: '#e9eefc',
        accent: '#7dd3fc', // sky-300
        muted: '#64748b', // slate-500
      },
      font: {
        display: '"Space Grotesk", "Inter", system-ui, sans-serif',
        label: '"Inter", system-ui, sans-serif',
      },
      size: {
        timer: 'clamp(3rem, 13vw, 7.5rem)',
        title: 'clamp(0.75rem, 2.4vw, 0.95rem)',
        label: '0.7rem',
      },
      space: { '1': '0.25rem', '4': '1rem', '8': '2rem' },
      motion: { fast: '200ms', slow: '900ms' },
      effect: {
        glow: '0 0 28px color-mix(in oklab, var(--ct-color-accent), transparent 55%), 0 0 80px color-mix(in oklab, var(--ct-color-accent), transparent 75%)',
        'progress-glow':
          '0 0 12px color-mix(in oklab, var(--ct-color-accent), transparent 50%)',
      },
    },
    md: {
      size: { timer: 'clamp(4.5rem, 10vw, 10rem)' },
    },
  },
  layout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        base: 'relative min-h-screen w-full grid place-items-center overflow-hidden isolate bg-[color:var(--ct-color-bg)]',
      },
    },
    children: [
      // Layered ambient background: radial accent halo
      {
        id: 'bg-glow',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,color-mix(in_oklab,var(--ct-color-accent),transparent_75%),transparent_70%)]',
          },
        },
      },
      // Faint grid pattern overlay
      {
        id: 'bg-grid',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--ct-color-accent),transparent_70%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--ct-color-accent),transparent_70%)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_center,black_30%,transparent_75%)]',
          },
        },
      },
      // Centered stack
      {
        id: 'stack',
        type: 'group',
        classes: {
          className: {
            base: 'relative flex flex-col items-center gap-6 px-6 text-center',
            md: 'md:gap-10',
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
                'ct-timer-gap': '1.25rem',
                'ct-unit-min-width': '3.5ch',
              },
              md: {
                'ct-timer-gap': '2.5rem',
                'ct-unit-min-width': '4ch',
              },
            },
            classes: {
              className: {
                base: '[&_[data-value]]:drop-shadow-[0_0_24px_color-mix(in_oklab,var(--ct-color-accent),transparent_50%)]',
              },
            },
          },
          {
            id: 'ring',
            type: 'progress',
            props: { kind: 'ring', direction: 'remaining' },
            visible: { base: false, md: true },
            classes: {
              className: {
                base: '',
                md: 'md:w-32 md:h-32 md:opacity-90',
              },
            },
          },
        ],
      },
    ],
  },
}
