import type { CountdownTheme } from '../theming/types'

/**
 * Neon Grid — hero-centered, glowing accent, progress ring (md+).
 * Demonstrates: background slot, vars overrides, breakpoint-only progress,
 * keyframe animation.
 */
export const neonGridTheme: CountdownTheme = {
  id: 'neon-grid',
  name: 'Neon Grid',
  tokens: {
    base: {
      color: {
        bg: '#05070d',
        fg: '#e8f0ff',
        accent: '#22d3ee',
        muted: '#475569',
      },
      space: { '1': '0.25rem', '4': '1rem', '8': '2rem' },
      font: { display: '"Space Grotesk", system-ui, sans-serif' },
      size: {
        timer: 'clamp(3.5rem, 14vw, 9rem)',
        title: 'clamp(0.875rem, 3vw, 1.25rem)',
      },
      motion: { fast: '180ms', slow: '900ms' },
      effect: {
        glow: '0 0 28px color-mix(in oklab, var(--ct-color-accent), transparent 55%)',
      },
    },
    md: {
      size: { timer: 'clamp(5rem, 10vw, 11rem)' },
      space: { '8': '3rem' },
    },
  },
  animations: {
    pulse: '@keyframes ct-pulse{0%,100%{opacity:.85}50%{opacity:1}}',
  },
  layout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        base: 'relative min-h-screen w-full grid place-items-center overflow-hidden',
      },
    },
    vars: {
      base: {
        'ct-bg-image':
          'radial-gradient(ellipse at center, color-mix(in oklab, var(--ct-color-accent), transparent 80%), transparent 60%)',
      },
    },
    children: [
      {
        id: 'bg',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: { base: 'absolute inset-0 opacity-70' },
        },
      },
      {
        id: 'stack',
        type: 'group',
        classes: {
          className: {
            base: 'relative flex flex-col items-center gap-4 px-4',
            md: 'md:gap-8',
          },
        },
        children: [
          {
            id: 'title',
            type: 'event-title',
            props: { source: 'title' },
            classes: {
              className: {
                base: 'm-0 font-[family-name:var(--ct-font-display)] text-[length:var(--ct-size-title)] tracking-[0.3em] uppercase text-[color:var(--ct-color-muted)]',
              },
            },
          },
          {
            id: 'timer',
            type: 'timer',
            props: { format: 'dhms', padZeros: true },
            classes: {
              className: {
                base: 'flex gap-4 font-[family-name:var(--ct-font-display)] text-[length:var(--ct-size-timer)] leading-none tabular-nums text-[color:var(--ct-color-accent)]',
              },
            },
            vars: {
              base: { 'ct-text-shadow': 'var(--ct-effect-glow)' },
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
                md: 'md:w-40 md:h-40 md:[color:var(--ct-color-accent)]',
              },
            },
          },
        ],
      },
    ],
  },
}
