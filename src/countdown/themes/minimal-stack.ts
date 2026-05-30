import type { CountdownTheme } from '../theming/types'

/**
 * Minimal Stack — an editorial, paper-like countdown built on a single
 * left-aligned vertical stack. Discipline over decoration:
 *
 *  - Warm off-white "paper" surface (never pure white) with charcoal ink
 *    for type; one terracotta accent reserved for the seconds digits and
 *    the progress hairline. Everything else is muted grayscale.
 *  - Two-family pairing: Inter Tight for chrome and numerals (calm,
 *    tabular, ultra-light at large sizes), Fraunces italic 300 used once
 *    for the subtitle as a deliberate editorial flourish.
 *  - Strong hierarchy via three weight tiers (eyebrow 500 / timer 200 /
 *    label 500) and three size tiers (label / subtitle / timer).
 *  - Spacious vertical rhythm. The layout is a column with `justify-between`
 *    so the eyebrow stack pins to the top and the timer stack pins to the
 *    bottom; gaps scale up at the `md` breakpoint to reward larger viewports
 *    with more silence.
 *  - Hairline 1px progress bar — a typographic rule, not a UI control.
 *
 * NOTE: All slot `vars` live under `base` because `resolveResponsive` picks
 * a single breakpoint's value rather than merging. Breakpoint-specific
 * tweaks (gap, timer size) are handled in scoped CSS via `animations` so
 * the same overrides cascade together at each viewport.
 */
export const minimalStackTheme: CountdownTheme = {
  id: 'minimal-stack',
  name: 'Minimal Stack',
  fonts: [
    { family: 'Inter Tight', weights: [200, 400, 500], source: 'google' },
    { family: 'Fraunces', weights: [300], source: 'google' },
  ],
  tokens: {
    base: {
      color: {
        // Warm paper, never #fff — keeps the surface honest at any brightness.
        bg: '#f6f3ec',
        // Ink. Dark charcoal rather than pure black to sit calmly on paper.
        fg: '#1a1a1a',
        // The single accent: a quiet terracotta ink. Used only on the
        // seconds digits and the progress fill so it always means "now".
        accent: '#b4452b',
        // Margin-note gray.
        muted: '#6b6b6b',
        // Eyebrow title — one notch darker than muted for hierarchy.
        title: '#3d3d3d',
        // Progress track: a 6% wash of the ink color.
        'progress-track':
          'color-mix(in oklab, var(--ct-color-fg) 6%, transparent)',
        'progress-fill': 'var(--ct-color-accent)',
      },
      font: {
        display: '"Inter Tight", "Inter", ui-sans-serif, system-ui, sans-serif',
        label: '"Inter Tight", "Inter", system-ui, sans-serif',
        subtitle: '"Fraunces", "Times New Roman", Georgia, serif',
      },
      size: {
        // Mobile holds four units in a single row at narrow widths.
        timer: 'clamp(2.25rem, 11vw, 7rem)',
        title: 'clamp(0.68rem, 1.3vw, 0.78rem)',
        subtitle: 'clamp(1.15rem, 2.2vw, 1.5rem)',
        label: '0.62rem',
      },
      motion: { fast: '220ms', slow: '1100ms' },
    },
  },
  layout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        // Single left-aligned column. `justify-between` does the heavy
        // lifting: the eyebrow stack rests at the top, the timer stack
        // at the bottom, with all whitespace in between earning its keep.
        base: 'min-h-screen w-full flex flex-col items-stretch justify-between px-6 pt-10 pb-12 bg-[color:var(--ct-color-bg)] text-[color:var(--ct-color-fg)]',
        md: 'md:px-16 md:pt-20 md:pb-20',
      },
    },
    children: [
      // Top stack — eyebrow caps title + italic serif subtitle.
      {
        id: 'top',
        type: 'group',
        classes: {
          className: {
            base: 'flex flex-col items-start gap-4',
            md: 'md:gap-6',
          },
        },
        children: [
          {
            id: 'title',
            type: 'event-title',
            props: { source: 'title' },
            vars: {
              base: {
                'ct-weight-title': '500',
                'ct-tracking-title': '0.24em',
                'ct-color-title': 'var(--ct-color-title)',
              },
            },
          },
          {
            id: 'subtitle',
            type: 'event-title',
            props: { source: 'subtitle' },
            vars: {
              base: {
                'ct-font-subtitle': 'var(--ct-font-subtitle)',
                'ct-size-subtitle': 'var(--ct-size-subtitle)',
                'ct-weight-subtitle': '300',
                'ct-case-subtitle': 'none',
                'ct-tracking-subtitle': '-0.005em',
                'ct-color-subtitle': 'var(--ct-color-muted)',
              },
            },
            classes: {
              className: { base: 'italic' },
            },
          },
        ],
      },
      // Bottom stack — caption + ultra-light timer + hairline progress.
      {
        id: 'bottom',
        type: 'group',
        classes: {
          className: {
            base: 'flex flex-col items-stretch gap-6',
            md: 'md:gap-10',
          },
        },
        children: [
          // Tiny caption above the timer; a second eyebrow tying timer to
          // title typographically and reinforcing reading order.
          {
            id: 'caption',
            type: 'event-title',
            props: { source: 'title' },
            visible: { base: false, md: true },
            vars: {
              base: {
                'ct-size-title': '0.62rem',
                'ct-tracking-title': '0.32em',
                'ct-weight-title': '500',
                'ct-color-title': 'var(--ct-color-muted)',
              },
            },
          },
          {
            id: 'timer',
            type: 'timer',
            props: { format: 'dhms', padZeros: true, transition: 'fade' },
            vars: {
              base: {
                // Tight, mobile-first defaults. Bumped per-breakpoint in
                // the scoped CSS below.
                'ct-timer-gap': '1rem',
                'ct-unit-align': 'flex-start',
                'ct-unit-gap': '0.55rem',
                'ct-weight-timer': '200',
                'ct-tracking-timer': '-0.03em',
                'ct-color-value': 'var(--ct-color-fg)',
                'ct-color-label': 'var(--ct-color-muted)',
                'ct-weight-label': '500',
                'ct-tracking-label': '0.22em',
                'ct-opacity-label': '1',
              },
            },
          },
          // Hairline progress + a single-word caption. Reads as a
          // typographic rule, not a UI widget.
          {
            id: 'rule',
            type: 'group',
            classes: {
              className: {
                base: 'flex flex-col items-stretch gap-2',
              },
            },
            children: [
              {
                id: 'bar',
                type: 'progress',
                props: { kind: 'bar', direction: 'elapsed' },
                vars: {
                  base: { 'ct-progress-height': '1px' },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // Scoped CSS that needs media queries or selectors Tailwind can't
  // reliably express. `animations` is injected as a `<style>` block.
  animations: {
    // Single-accent rule: only the seconds value carries color. Every
    // other digit, label, and rule sits in the muted ink palette so the
    // terracotta on seconds always means "now".
    secondsAccent: `
      [data-ct-theme='minimal-stack'] [data-slot='timer'] [data-unit='seconds'][data-value] {
        color: var(--ct-color-accent);
      }
    `,
    // Generous breakpoint scaling. Kept here so the cascade isn't
    // wiped out by the way per-slot vars resolve per-breakpoint.
    rhythm: `
      @media (min-width: 48rem) {
        [data-ct-theme='minimal-stack'] [data-slot='timer'] {
          --ct-timer-gap: 2.5rem;
          --ct-unit-gap: 0.85rem;
        }
      }
      @media (min-width: 64rem) {
        [data-ct-theme='minimal-stack'] [data-slot='timer'] {
          --ct-timer-gap: 3.5rem;
        }
      }
    `,
  },
}
