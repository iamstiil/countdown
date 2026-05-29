import type { CountdownTheme } from '../theming/types'

/**
 * Minimal Stack — bottom-left aligned, type-only, no separators/labels.
 * Demonstrates a completely different layout via schema, not CSS toggles.
 */
export const minimalStackTheme: CountdownTheme = {
  id: 'minimal-stack',
  name: 'Minimal Stack',
  tokens: {
    base: {
      color: {
        bg: '#ffffff',
        fg: '#0a0a0a',
        accent: '#0a0a0a',
        muted: '#737373',
      },
      font: { display: 'Inter, system-ui, sans-serif' },
      size: {
        timer: 'clamp(4rem, 18vw, 12rem)',
        title: '0.875rem',
      },
      space: { '4': '1rem', '8': '2rem' },
    },
    md: {
      size: { timer: 'clamp(6rem, 14vw, 14rem)' },
    },
  },
  layout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        base: 'min-h-screen w-full flex flex-col items-start justify-end p-8 gap-2 bg-[color:var(--ct-color-bg)] text-[color:var(--ct-color-fg)]',
        md: 'md:p-16 md:gap-4',
      },
    },
    children: [
      {
        id: 'title',
        type: 'event-title',
        props: { source: 'title' },
        classes: {
          className: {
            base: 'm-0 text-[length:var(--ct-size-title)] tracking-[0.3em] uppercase text-[color:var(--ct-color-muted)]',
          },
        },
      },
      {
        id: 'timer',
        type: 'timer',
        props: { format: 'dhms', padZeros: true },
        classes: {
          className: {
            base: 'flex gap-3 font-[family-name:var(--ct-font-display)] text-[length:var(--ct-size-timer)] leading-none tabular-nums',
          },
        },
      },
      {
        id: 'bar',
        type: 'progress',
        props: { kind: 'bar', direction: 'elapsed' },
        classes: {
          className: {
            base: 'w-full h-[2px] bg-[color:var(--ct-color-muted)]/20 [&>span]:block [&>span]:h-full [&>span]:bg-[color:var(--ct-color-accent)]',
          },
        },
      },
    ],
  },
}
