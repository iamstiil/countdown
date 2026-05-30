import type { CountdownTheme } from '../theming/types'

/**
 * Aurora — an arctic nighttime sky.
 *
 * Concept: the viewer is standing on a quiet polar plain looking up at
 * the night sky. Deep indigo void at the zenith, a faint starfield, and
 * two flowing aurora ribbons (emerald-teal primary, violet-magenta
 * secondary) drifting at different speeds and angles. A soft atmospheric
 * bloom hugs the horizon where the ribbons "ground out" into the ice,
 * and a subtle corner vignette holds the eye toward the timer.
 *
 * Layering strategy — all built from token-driven `color-mix()` blends
 * so a single accent swap re-tints the entire sky:
 *
 *   ┌─ vignette        ─z-10  corner falloff, holds focus on timer
 *   │  horizon mist    ─z-12  low haze, mixes ribbons into the ground
 *   │  bloom           ─z-14  soft atmospheric glow under the ribbons
 *   │  ribbon B        ─z-16  violet-magenta, slow opposite drift
 *   │  ribbon A        ─z-18  emerald-teal, primary flowing band
 *   │  starfield       ─z-22  fine specular grain
 *   └─ sky             ─z-30  midnight indigo radial gradient
 *
 * Hierarchy:
 *   - **Title** is the luminous "eyebrow" — uppercase, tracked, with a
 *     teal-violet glow that echoes the sky.
 *   - **Subtitle** is intentionally subdued (45% fg) so it never competes.
 *   - **Timer digits** sit at pure foreground white with a tight halo —
 *     legibility-first; the glow is decorative, not load-bearing.
 *   - **Progress** is a slim flowing-gradient bar that mirrors the
 *     ribbons above, completing the loop between focal point and sky.
 *
 * Reduced-motion variant keeps every layer but freezes the drift.
 */
export const auroraTheme: CountdownTheme = {
  id: 'aurora',
  name: 'Aurora',
  fonts: [
    { family: 'Outfit', weights: [300, 500, 700], source: 'google' },
    { family: 'Inter', weights: [400, 500], source: 'google' },
  ],
  tokens: {
    base: {
      color: {
        // Deep indigo midnight — cool enough to read as "polar night"
        // without crushing the ribbon hues sitting on top.
        bg: '#070a1a',
        // Cool off-white for digits and primary text. AAA against bg.
        fg: '#f4f7ff',
        // Primary aurora hue: emerald-teal (the classic green ribbon).
        accent: '#5eead4',
        // Secondary aurora hue: violet-magenta (the rarer high-altitude band).
        secondary: '#c4a8ff',
        // Tertiary ribbon hue: icy cyan rim used for the brightest edges.
        rim: '#7dd3fc',
        // Muted slate for progress track and structural lines.
        muted: '#475569',
        // Title color: brighter teal-cyan mix gives the eyebrow a glow
        // without copying the timer's pure white.
        title: '#a5f3fc',
      },
      font: {
        display: '"Outfit", "Inter", ui-sans-serif, system-ui, sans-serif',
        label: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
      },
      size: {
        timer: 'clamp(3rem, 13vw, 7rem)',
        title: 'clamp(0.72rem, 1.7vw, 0.85rem)',
        subtitle: 'clamp(0.9rem, 1.7vw, 1.05rem)',
        label: '0.68rem',
      },
      space: { '1': '0.25rem', '4': '1rem', '8': '2rem' },
      motion: { fast: '220ms', slow: '1200ms' },
      effect: {
        // The primary aurora ribbon: a wide diagonal band built from
        // conic+linear gradients masked into a flowing arc. Pure tokens
        // — swap `--ct-color-accent` and the ribbon re-tints.
        'aurora-a':
          'radial-gradient(ellipse 90% 55% at 30% 38%, color-mix(in oklab, var(--ct-color-accent), transparent 55%) 0%, color-mix(in oklab, var(--ct-color-accent), transparent 78%) 30%, transparent 65%), radial-gradient(ellipse 70% 40% at 65% 52%, color-mix(in oklab, var(--ct-color-rim), transparent 65%) 0%, transparent 60%)',
        // The secondary ribbon — narrower, higher, violet leaning.
        'aurora-b':
          'radial-gradient(ellipse 75% 35% at 70% 28%, color-mix(in oklab, var(--ct-color-secondary), transparent 60%) 0%, color-mix(in oklab, var(--ct-color-secondary), transparent 82%) 35%, transparent 65%), radial-gradient(ellipse 60% 28% at 28% 22%, color-mix(in oklab, var(--ct-color-secondary), transparent 72%) 0%, transparent 60%)',
        // Soft horizon bloom — sits behind both ribbons.
        bloom:
          'radial-gradient(ellipse 110% 30% at 50% 88%, color-mix(in oklab, var(--ct-color-accent), transparent 70%) 0%, color-mix(in oklab, var(--ct-color-secondary), transparent 82%) 40%, transparent 75%)',
        // Tight halo around the timer digits — teal core, violet bleed.
        glow: '0 0 12px color-mix(in oklab, var(--ct-color-accent), transparent 55%), 0 0 36px color-mix(in oklab, var(--ct-color-accent), transparent 72%), 0 0 80px color-mix(in oklab, var(--ct-color-secondary), transparent 80%)',
        // Title halo — softer, more lateral spread.
        'title-glow':
          '0 0 14px color-mix(in oklab, var(--ct-color-title), transparent 60%), 0 0 32px color-mix(in oklab, var(--ct-color-secondary), transparent 78%)',
        // Progress bar glow.
        'progress-glow':
          '0 0 10px color-mix(in oklab, var(--ct-color-accent), transparent 55%), 0 0 22px color-mix(in oklab, var(--ct-color-secondary), transparent 72%)',
      },
    },
    md: {
      size: {
        timer: 'clamp(4.5rem, 10vw, 9.5rem)',
        title: '0.92rem',
        subtitle: 'clamp(1rem, 1.4vw, 1.2rem)',
        label: '0.78rem',
      },
    },
    lg: {
      size: {
        timer: 'clamp(5.5rem, 9vw, 11rem)',
      },
    },
  },
  animations: {
    // Primary ribbon: slow horizontal drift + gentle vertical sway via a
    // composed transform. 24s feels "atmospheric" — slower than the eye
    // tracks consciously, so the ribbon reads as alive but unhurried.
    'aurora-drift-a':
      '@keyframes ct-aurora-drift-a{0%{transform:translate3d(-4%,0,0) skewY(-2deg);opacity:.85}50%{transform:translate3d(4%,-1.5%,0) skewY(1deg);opacity:1}100%{transform:translate3d(-4%,0,0) skewY(-2deg);opacity:.85}}',
    // Secondary ribbon: drifts the *opposite* direction at a different
    // period so the two never lock into a repeating pattern.
    'aurora-drift-b':
      '@keyframes ct-aurora-drift-b{0%{transform:translate3d(5%,1%,0) skewY(2deg);opacity:.7}50%{transform:translate3d(-5%,-1%,0) skewY(-1deg);opacity:.95}100%{transform:translate3d(5%,1%,0) skewY(2deg);opacity:.7}}',
    // Bloom breathes very slowly to suggest atmospheric pressure changes.
    'aurora-bloom':
      '@keyframes ct-aurora-bloom{0%,100%{opacity:.75;filter:blur(0)}50%{opacity:1;filter:blur(2px)}}',
    // Starfield twinkle — opacity only, no transform = cheap.
    'aurora-twinkle':
      '@keyframes ct-aurora-twinkle{0%,100%{opacity:.55}50%{opacity:.85}}',
    // Progress fill shimmer — slow background-position slide so the
    // gradient flows along the bar like the ribbons above.
    'aurora-flow':
      '@keyframes ct-aurora-flow{from{background-position:0% 50%}to{background-position:200% 50%}}',
  },
  layout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        // `isolate` keeps every `-z-*` layer trapped inside this stacking
        // context so the sky never bleeds into page chrome above.
        base: 'relative min-h-screen w-full grid place-items-center overflow-hidden isolate bg-[color:var(--ct-color-bg)] p-4 md:p-8',
      },
    },
    children: [
      // ─── 1. Sky — deep indigo midnight base with a soft zenith fall-off.
      {
        id: 'bg-sky',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-30 [background:radial-gradient(ellipse_80%_60%_at_50%_15%,color-mix(in_oklab,var(--ct-color-secondary),var(--ct-color-bg)_82%)_0%,var(--ct-color-bg)_60%),linear-gradient(180deg,var(--ct-color-bg)_0%,#02030c_100%)]',
          },
        },
      },

      // ─── 2. Starfield — fine specular grain. Two layered dot patterns at
      //      different scales sell parallax depth without WebGL.
      {
        id: 'bg-stars',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-22 opacity-[0.55] [background-image:radial-gradient(circle_at_1px_1px,color-mix(in_oklab,white,transparent_15%)_0.6px,transparent_1.2px),radial-gradient(circle_at_1px_1px,color-mix(in_oklab,white,transparent_55%)_0.4px,transparent_1px)] [background-size:120px_120px,60px_60px] [background-position:0_0,30px_45px] [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_85%)] motion-safe:[animation:ct-aurora-twinkle_6s_ease-in-out_infinite]',
          },
        },
      },

      // ─── 3. Aurora ribbon A — primary emerald-teal band. Composed in a
      //      transform-friendly wrapper so the drift animation never causes
      //      layout (only compositor work).
      {
        id: 'bg-aurora-a',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-x-[-15%] top-[10%] bottom-[20%] -z-18 mix-blend-screen [background:var(--ct-effect-aurora-a)] [filter:blur(28px)_saturate(125%)] [will-change:transform,opacity] motion-safe:[animation:ct-aurora-drift-a_24s_ease-in-out_infinite]',
            md: 'md:[filter:blur(40px)_saturate(130%)]',
          },
        },
      },

      // ─── 4. Aurora ribbon B — secondary violet-magenta band. Drifts in
      //      opposition; different period prevents visible loop sync.
      {
        id: 'bg-aurora-b',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-x-[-15%] top-[0%] bottom-[35%] -z-16 mix-blend-screen [background:var(--ct-effect-aurora-b)] [filter:blur(34px)_saturate(120%)] [will-change:transform,opacity] motion-safe:[animation:ct-aurora-drift-b_31s_ease-in-out_infinite]',
            md: 'md:[filter:blur(48px)_saturate(125%)]',
          },
        },
      },

      // ─── 5. Atmospheric bloom — soft horizon glow under both ribbons.
      {
        id: 'bg-bloom',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-14 mix-blend-screen [background:var(--ct-effect-bloom)] [filter:blur(20px)] motion-safe:[animation:ct-aurora-bloom_11s_ease-in-out_infinite]',
          },
        },
      },

      // ─── 6. Horizon mist — low haze. Mixes the ribbon hues into the
      //      "ground" so the band doesn't end abruptly mid-screen.
      {
        id: 'bg-mist',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-x-0 bottom-0 h-[42%] -z-12 [background:linear-gradient(to_top,color-mix(in_oklab,var(--ct-color-accent),var(--ct-color-bg)_82%)_0%,transparent_100%)] opacity-[0.55]',
          },
        },
      },

      // ─── 7. Vignette — corner falloff to anchor the eye on the timer.
      {
        id: 'bg-vignette',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]',
          },
        },
      },

      // ─── Foreground stack — centered group, generous gaps, no card.
      //     The sky *is* the chrome; a card would compete with the ribbons.
      {
        id: 'stack',
        type: 'group',
        classes: {
          className: {
            base: 'relative flex flex-col items-center gap-7 text-center w-full max-w-[min(94vw,46rem)]',
            md: 'md:gap-10',
          },
        },
        children: [
          // Luminous event title — uppercase eyebrow, tracked, halo'd.
          {
            id: 'title',
            type: 'event-title',
            props: { source: 'title' },
            vars: {
              base: {
                'ct-tracking-title': '0.42em',
                'ct-weight-title': '500',
                'ct-text-shadow': 'var(--ct-effect-title-glow)',
              },
              md: {
                'ct-tracking-title': '0.5em',
              },
            },
            classes: {
              className: {
                base: 'uppercase [text-shadow:var(--ct-effect-title-glow)]',
              },
            },
          },

          // Subdued subtitle — sits 45% fg so it whispers under the title.
          {
            id: 'subtitle',
            type: 'event-title',
            props: { source: 'subtitle' },
            vars: {
              base: {
                'ct-color-subtitle':
                  'color-mix(in oklab, var(--ct-color-fg), transparent 50%)',
                'ct-weight-subtitle': '300',
                'ct-tracking-subtitle': '0.02em',
              },
            },
            classes: {
              className: { base: '-mt-2 md:-mt-3 italic' },
            },
          },

          // Focal point — highly legible timer. Pure white fill + a tight
          // teal/violet halo that picks up the ribbon palette but never
          // blurs the digit silhouette. The styling vars (color, weight,
          // shadow) are repeated at every breakpoint because the project's
          // `resolveResponsive` picks the closest matching layer and
          // *replaces* the var map rather than merging it. Only sizing
          // vars (gap, min-width) actually change per breakpoint.
          {
            id: 'timer',
            type: 'timer',
            props: { format: 'dhms', padZeros: true },
            vars: {
              base: {
                'ct-timer-gap': '1.1rem',
                'ct-unit-gap': '0.45rem',
                'ct-unit-min-width': '3ch',
                'ct-weight-timer': '500',
                'ct-tracking-timer': '-0.025em',
                'ct-color-value': 'var(--ct-color-fg)',
                'ct-color-label':
                  'color-mix(in oklab, var(--ct-color-title), transparent 30%)',
                'ct-text-shadow': 'var(--ct-effect-glow)',
              },
              md: {
                'ct-timer-gap': '2.25rem',
                'ct-unit-gap': '0.75rem',
                'ct-unit-min-width': '3.5ch',
                'ct-weight-timer': '500',
                'ct-tracking-timer': '-0.025em',
                'ct-color-value': 'var(--ct-color-fg)',
                'ct-color-label':
                  'color-mix(in oklab, var(--ct-color-title), transparent 30%)',
                'ct-text-shadow': 'var(--ct-effect-glow)',
              },
              lg: {
                'ct-timer-gap': '3rem',
                'ct-unit-gap': '0.9rem',
                'ct-unit-min-width': '4ch',
                'ct-weight-timer': '500',
                'ct-tracking-timer': '-0.025em',
                'ct-color-value': 'var(--ct-color-fg)',
                'ct-color-label':
                  'color-mix(in oklab, var(--ct-color-title), transparent 30%)',
                'ct-text-shadow': 'var(--ct-effect-glow)',
              },
            },
            classes: {
              className: {
                base: 'mt-2 md:mt-4 [&_[data-label]]:font-[var(--ct-font-label)] [&_[data-label]]:tracking-[0.32em] [&_[data-label]]:uppercase [&_[data-label]]:text-[length:var(--ct-size-label)] [&_[data-label]]:mt-1 md:[&_[data-label]]:mt-2',
              },
            },
          },

          // Elegant progress — a slim flowing-gradient bar mirroring the
          // ribbon palette overhead. The effect-glow token feeds the
          // CSS-side `box-shadow` automatically, so no custom shadow var
          // is needed here.
          {
            id: 'progress',
            type: 'progress',
            props: { kind: 'bar', direction: 'elapsed' },
            classes: {
              className: {
                base: 'w-full max-w-xs mt-3',
                md: 'md:max-w-md md:mt-6',
              },
            },
            vars: {
              base: {
                'ct-progress-height': '3px',
                'ct-color-progress-track':
                  'color-mix(in oklab, var(--ct-color-fg), transparent 88%)',
                'ct-color-progress-fill':
                  'linear-gradient(90deg, var(--ct-color-accent) 0%, var(--ct-color-rim) 50%, var(--ct-color-secondary) 100%)',
              },
              md: {
                'ct-progress-height': '4px',
                'ct-color-progress-track':
                  'color-mix(in oklab, var(--ct-color-fg), transparent 88%)',
                'ct-color-progress-fill':
                  'linear-gradient(90deg, var(--ct-color-accent) 0%, var(--ct-color-rim) 50%, var(--ct-color-secondary) 100%)',
              },
            },
          },
        ],
      },
    ],
  },
  // Reduced-motion variant: keep the full visual identity (ribbons,
  // bloom, twinkle, flow are all decorative), but kill the keyframes.
  // The `motion-safe:` utilities already gate the animation properties;
  // emptying the keyframes here ensures nothing in the cascade revives
  // them.
  reducedMotion: {
    animations: {},
  },
}
