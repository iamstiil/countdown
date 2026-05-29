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
        bg: '#050813',
        fg: '#eef2ff',
        accent: '#67e8f9', // cyan-300, richer than sky-300
        muted: '#475569', // slate-600
        title: '#a5b4fc', // indigo-300 — gives the eyebrow life
      },
      font: {
        display: '"Space Grotesk", "Inter", system-ui, sans-serif',
        label: '"Inter", system-ui, sans-serif',
      },
      size: {
        timer: 'clamp(3rem, 13vw, 7.5rem)',
        title: 'clamp(0.75rem, 2vw, 0.9rem)',
        label: '0.68rem',
      },
      space: { '1': '0.25rem', '4': '1rem', '8': '2rem' },
      motion: { fast: '200ms', slow: '900ms' },
      effect: {
        glow: '0 0 28px color-mix(in oklab, var(--ct-color-accent), transparent 55%), 0 0 80px color-mix(in oklab, var(--ct-color-accent), transparent 75%)',
        'progress-glow':
          '0 0 16px color-mix(in oklab, var(--ct-color-accent), transparent 40%), 0 0 32px color-mix(in oklab, var(--ct-color-accent), transparent 70%)',
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
      // Vignette to deepen edges
      {
        id: 'bg-vignette',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]',
          },
        },
      },
      // Layered ambient background: radial accent halo
      {
        id: 'bg-glow',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-20 bg-[radial-gradient(ellipse_55%_45%_at_50%_45%,color-mix(in_oklab,var(--ct-color-accent),transparent_72%),transparent_70%)]',
          },
        },
      },
      // Fine grid pattern overlay (32px, masked, low opacity)
      {
        id: 'bg-grid',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-20 opacity-[0.10] [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--ct-color-accent),transparent_60%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--ct-color-accent),transparent_60%)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_center,black_30%,transparent_75%)]',
          },
        },
      },
      // Centered stack
      {
        id: 'stack',
        type: 'group',
        classes: {
          className: {
            base: 'relative flex flex-col items-center gap-10 px-6 py-12 text-center w-full max-w-3xl',
            md: 'md:gap-16 md:py-16',
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
                'ct-timer-gap': '1.75rem',
                'ct-unit-gap': '0.75rem',
                'ct-unit-min-width': '3.5ch',
                'ct-color-label':
                  'color-mix(in oklab, var(--ct-color-fg), transparent 55%)',
              },
              md: {
                'ct-timer-gap': '3.5rem',
                'ct-unit-gap': '1rem',
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
            id: 'bar',
            type: 'progress',
            props: { kind: 'bar', direction: 'elapsed' },
            classes: {
              className: {
                base: 'w-full max-w-sm mt-2',
                md: 'md:max-w-md md:mt-4',
              },
            },
            vars: {
              base: {
                'ct-progress-height': '3px',
                'ct-color-progress-track':
                  'color-mix(in oklab, var(--ct-color-accent), transparent 88%)',
              },
            },
          },
        ],
      },
    ],
  },
}
