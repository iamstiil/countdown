import type { CountdownTheme } from '../theming/types'

/**
 * Monolith — a single carved slab of time.
 *
 * Concept: the viewer is standing at the foot of a massive block of
 * polished basalt. Late, raking sunlight from camera-right catches the
 * leading edge of the stone with a thin amber rim; everything else is
 * graphite, shadow, and quiet engineering. The digits are not
 * "displayed" — they are *cut* into the slab. Tight tracking, very
 * heavy weight, dual-edge text shadow (highlight up, shadow down) so
 * each character reads as a raised face on the stone. Slim vertical
 * seams between the day / hour / minute / second courses imply that
 * the slab is assembled from precision-fitted blocks.
 *
 * Layering strategy — all token-driven so a single accent swap
 * re-warms (or re-cools) the raking light:
 *
 *   ┌─ vignette        ─z-10  corner falloff, holds focus on the slab
 *   │  grain           ─z-14  fine carved-stone noise
 *   │  plinth          ─z-16  darker base where the monolith "sits"
 *   │  amber rim       ─z-18  raking light caught on the right edge
 *   │  cool wash       ─z-22  cool fill light from camera-left
 *   └─ slab            ─z-30  graphite gradient, the stone itself
 *
 * Hierarchy:
 *   - **Title** is a small engraved eyebrow above the slab — heavily
 *     tracked uppercase, recessed (light from below, shadow above) so
 *     it reads as chiselled-in rather than printed-on.
 *   - **Subtitle** is a single quiet line beneath, muted basalt grey.
 *   - **Timer** is the monolith itself: black-weight digits, tight
 *     negative tracking, embossed text-shadow, divided into courses
 *     by thin amber-tinted seams. Unit labels are kept (tiny, engraved)
 *     so the architecture reads as measured, not abstract.
 *   - **Progress** renders as "courses of stone" — segmented notches
 *     that fill with the warm rim hue as time elapses, like sun moving
 *     across the face of the block.
 *
 * Restraint is the brief: no chrome, no bloom, no neon. The only
 * colour in the composition is the single amber raking-light token,
 * and even that is held back by `color-mix` to ~20% saturation against
 * the graphite ground.
 */
export const monolithTheme: CountdownTheme = {
  id: 'monolith',
  name: 'Monolith',
  fonts: [
    { family: 'Archivo', weights: [500, 700, 900], source: 'google' },
    { family: 'Inter', weights: [400, 500, 600], source: 'google' },
  ],
  tokens: {
    base: {
      color: {
        // Deep cool charcoal — the unlit face of the stone.
        bg: '#0b0d10',
        // Slightly lighter graphite used inside the slab gradient.
        panel: '#15181d',
        // Bone-white digit face. Cool enough to read against the warm rim.
        fg: '#ece8de',
        // The one warm note in the composition: low-angle sunlight on
        // the leading edge of the stone. Used sparingly — rim light,
        // progress fill, and the seam tint.
        accent: '#d99b58',
        // Cool fill light from the shaded side. Used for the title
        // glow and the cool wash background layer.
        secondary: '#6f7c8c',
        // Basalt grey — structural lines, separators, label text.
        muted: '#4a5057',
        // Engraved eyebrow colour — a bone tint dialled back so the
        // title sits below the digits in hierarchy.
        title: '#8a8f96',
      },
      font: {
        // Archivo Black-weight gives the heavy, condensed-feeling slab
        // glyphs that read as cut stone. Inter is the structural label
        // typeface — quiet and engineered.
        display: '"Archivo", "Inter", ui-sans-serif, system-ui, sans-serif',
        label: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
        subtitle: '"Inter", ui-sans-serif, system-ui, sans-serif',
      },
      size: {
        // Sized so all four DD HH MM SS courses fit on a single line
        // down to ~360px wide without wrapping. The slab still dominates
        // the viewport — the weight (900) and tight tracking do the
        // visual heavy lifting, not the raw point size.
        timer: 'clamp(2.4rem, 13vw, 4.5rem)',
        title: 'clamp(0.7rem, 1.4vw, 0.82rem)',
        subtitle: 'clamp(0.85rem, 1.3vw, 0.98rem)',
        label: 'clamp(0.55rem, 0.9vw, 0.66rem)',
      },
      motion: { fast: '200ms', slow: '1100ms' },
      effect: {
        // Carved-stone slab gradient: cool charcoal at the top falling
        // into a marginally lighter graphite mid-band, then back to
        // deep shadow at the floor. Sells the volume of the block.
        slab: 'linear-gradient(180deg, var(--ct-color-bg) 0%, color-mix(in oklab, var(--ct-color-bg), var(--ct-color-panel) 70%) 38%, color-mix(in oklab, var(--ct-color-bg), var(--ct-color-panel) 55%) 62%, #06080a 100%)',
        // Warm raking light on the right edge — a soft amber wash with
        // a tight inner rim. Held to ~22% opacity via color-mix so it
        // reads as light, not paint.
        'rim-light':
          'radial-gradient(ellipse 55% 90% at 100% 50%, color-mix(in oklab, var(--ct-color-accent), transparent 78%) 0%, color-mix(in oklab, var(--ct-color-accent), transparent 92%) 35%, transparent 70%)',
        // Cool fill light from the left — barely there, just enough to
        // round the form so the stone doesn't go flat on the shaded side.
        'cool-wash':
          'radial-gradient(ellipse 70% 80% at -10% 30%, color-mix(in oklab, var(--ct-color-secondary), transparent 84%) 0%, transparent 60%)',
        // Plinth: darker pool at the foot of the monolith so the block
        // visually "sits" rather than floats.
        plinth:
          'radial-gradient(ellipse 90% 45% at 50% 100%, #000 0%, color-mix(in oklab, #000, transparent 55%) 30%, transparent 70%)',
        // Repeating fine noise — sells "carved stone" texture without
        // a raster asset. Two layered conic gradients at different
        // scales give an irregular grain that beats a single dot
        // pattern. Held very faint via mix-blend / opacity downstream.
        grain:
          'repeating-conic-gradient(from 0deg at 50% 50%, color-mix(in oklab, var(--ct-color-fg), transparent 92%) 0deg 0.6deg, transparent 0.6deg 1.4deg), repeating-conic-gradient(from 13deg at 50% 50%, color-mix(in oklab, #000, transparent 80%) 0deg 0.4deg, transparent 0.4deg 1.1deg)',
        // Embossed digit shadow: a single-pixel bone highlight on top,
        // a one-pixel hard black shadow on the bottom, then a soft
        // amber bloom in the rim direction. Reads as a raised letter
        // on stone catching directional light.
        'engraved-digit':
          '0 1px 0 color-mix(in oklab, var(--ct-color-fg), transparent 55%), 0 -1px 0 #000, 0 2px 0 #05070a, 8px 0 36px color-mix(in oklab, var(--ct-color-accent), transparent 86%)',
        // Recessed (chiselled-in) title shadow — light from BELOW,
        // shadow ABOVE. The inversion is what reads as "cut into".
        'engraved-title':
          '0 -1px 0 #000, 0 1px 0 color-mix(in oklab, var(--ct-color-fg), transparent 78%)',
        // Seam between digit courses: a one-pixel vertical line with a
        // faint amber bloom, as if a hairline of light is escaping
        // between two precision-fitted stones.
        seam: 'linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--ct-color-accent), transparent 70%) 15%, color-mix(in oklab, var(--ct-color-fg), transparent 65%) 50%, color-mix(in oklab, var(--ct-color-accent), transparent 70%) 85%, transparent 100%)',
        // Restrained glow under the progress notches.
        'progress-glow':
          '0 0 8px color-mix(in oklab, var(--ct-color-accent), transparent 70%)',
      },
    },
    // md and up: the slab grows, the engraved label gets a touch more
    // room, and the rim light takes a slightly tighter blur.
    md: {
      size: {
        timer: 'clamp(4rem, 11vw, 8.5rem)',
        title: '0.88rem',
        subtitle: '1.05rem',
        label: '0.72rem',
      },
    },
    lg: {
      size: {
        timer: 'clamp(5.5rem, 10vw, 10rem)',
      },
    },
  },
  animations: {
    // Very slow seam shimmer — the line of light caught between two
    // stones drifts up and down at architectural speed. Period is
    // intentionally long so it reads as ambient, not animated.
    'monolith-seam':
      '@keyframes ct-monolith-seam{0%,100%{opacity:.55}50%{opacity:.95}}',
    // Rim light breathes by ~10% so the raking sun feels alive
    // without becoming a heartbeat. 18s period.
    'monolith-rim':
      '@keyframes ct-monolith-rim{0%,100%{opacity:.85;transform:translateX(0)}50%{opacity:1;transform:translateX(-0.6%)}}',
    // ─── Done scene — "Engraved Inscription" ─────────────────────────
    //
    // The digits resolve into the event title, cut into the stone with
    // the same engraved-digit shadow. No scenery shift, no new
    // metaphor — the monolith was always going to bear this
    // inscription; the countdown was the wait for it to be revealed.
    //
    //   t=0     existing rim breathing/seam shimmer hold
    //   t=200   hero event title cuts in (engraved shadow, 900-weight)
    //   t=700   inscription kicker fades up ("ARRIVED · MMXXVI")
    //   t=1100  seams brighten one cycle, rim catches the new lettering
    //   t=1500  CTA pill rises and receives focus
    //
    // Reduced motion stamps the final frame.
    done: `
      /* (1) Hero event title — cut into the stone. Same embossed
         shadow vocabulary as the digits, same weight/tracking. */
      [data-ct-theme="monolith"] .mo-win-hero {
        font-family: var(--ct-font-display);
        font-weight: 900;
        font-size: clamp(2.4rem, 11vw, 7rem);
        line-height: 0.92;
        letter-spacing: -0.05em;
        text-align: center;
        color: var(--ct-color-fg);
        text-shadow: var(--ct-effect-engraved-digit);
        opacity: 0;
        transform: translateY(6px);
        animation: mo-cut-in 620ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both;
      }
      @keyframes mo-cut-in {
        0%   { opacity: 0; transform: translateY(6px); filter: blur(2px); }
        60%  { opacity: 1; transform: translateY(0);   filter: blur(0); }
        100% { opacity: 1; transform: translateY(0);   filter: blur(0); }
      }

      /* (2) Inscription kicker — small tracked engraved line beneath
         the hero. Recessed shadow (light below, shadow above) to read
         as chiselled-in. Text provided via ::before. */
      [data-ct-theme="monolith"] .mo-win-inscription {
        font-family: var(--ct-font-label);
        font-weight: 500;
        font-size: clamp(0.62rem, 1vw, 0.74rem);
        letter-spacing: 0.46em;
        text-transform: uppercase;
        text-align: center;
        color: color-mix(in oklab, var(--ct-color-title), transparent 25%);
        text-shadow: var(--ct-effect-engraved-title);
        padding-left: 0.46em;
        opacity: 0;
        animation: mo-fade-up 520ms ease-out 700ms both;
      }
      [data-ct-theme="monolith"] .mo-win-inscription::before {
        content: "ARRIVED · MMXXVI";
      }

      @keyframes mo-fade-up {
        0%   { opacity: 0; transform: translateY(4px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      /* (3) Seam + rim one-shot brightening: the inscription is being
         lit by the raking sun catching the new lettering. */
      [data-ct-theme="monolith"][data-state="done"] [data-slot="background"]#bg-rim-light {
        animation: mo-rim-flare 1.6s ease-out 1100ms both,
                   ct-monolith-rim 18s ease-in-out 2700ms infinite;
      }
      @keyframes mo-rim-flare {
        0%   { opacity: 0.85; filter: blur(24px) brightness(1); }
        40%  { opacity: 1;    filter: blur(18px) brightness(1.4); }
        100% { opacity: 0.9;  filter: blur(24px) brightness(1.05); }
      }

      /* (4) CTA pill — bone-on-graphite with a thin amber rim. Quiet,
         engineered, matches the monolith's restraint. */
      [data-ct-theme="monolith"] .mo-win-cta {
        font-family: var(--ct-font-display);
        font-weight: 600;
        font-size: clamp(0.78rem, 1.4vw, 0.92rem);
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: var(--ct-color-fg);
        padding: 0.95rem 1.9rem;
        border: 1px solid color-mix(in oklab, var(--ct-color-accent), transparent 55%);
        border-radius: 2px;
        background:
          linear-gradient(180deg,
            color-mix(in oklab, var(--ct-color-panel), transparent 20%) 0%,
            color-mix(in oklab, var(--ct-color-bg),    transparent 10%) 100%);
        box-shadow:
          inset 0 1px 0 color-mix(in oklab, var(--ct-color-fg), transparent 80%),
          0 0 0 0 color-mix(in oklab, var(--ct-color-accent), transparent 60%),
          0 6px 16px rgba(0, 0, 0, 0.55);
        cursor: pointer;
        opacity: 0;
        transform: translateY(10px);
        animation: mo-cta-rise 520ms cubic-bezier(0.22, 1, 0.36, 1) 1500ms both;
        transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease;
      }
      [data-ct-theme="monolith"] .mo-win-cta::before { content: "Enter the gate ▸"; }
      [data-ct-theme="monolith"] .mo-win-cta:hover,
      [data-ct-theme="monolith"] .mo-win-cta:focus-visible {
        transform: translateY(-1px);
        outline: none;
        border-color: color-mix(in oklab, var(--ct-color-accent), transparent 25%);
        background:
          linear-gradient(180deg,
            color-mix(in oklab, var(--ct-color-panel), var(--ct-color-accent) 6%) 0%,
            color-mix(in oklab, var(--ct-color-bg),    transparent 10%) 100%);
        box-shadow:
          inset 0 1px 0 color-mix(in oklab, var(--ct-color-fg), transparent 75%),
          0 0 24px color-mix(in oklab, var(--ct-color-accent), transparent 70%),
          0 10px 22px rgba(0, 0, 0, 0.6);
      }
      [data-ct-theme="monolith"] .mo-win-cta:active {
        transform: translateY(0);
        box-shadow:
          inset 0 1px 0 color-mix(in oklab, var(--ct-color-fg), transparent 80%),
          0 0 10px color-mix(in oklab, var(--ct-color-accent), transparent 80%),
          0 3px 8px rgba(0, 0, 0, 0.55);
      }

      @keyframes mo-cta-rise {
        0%   { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      /* Reduced motion: stamp the final frame, no choreography. */
      @media (prefers-reduced-motion: reduce) {
        [data-ct-theme="monolith"] .mo-win-hero,
        [data-ct-theme="monolith"] .mo-win-inscription,
        [data-ct-theme="monolith"] .mo-win-cta,
        [data-ct-theme="monolith"][data-state="done"] [data-slot="background"]#bg-rim-light {
          animation: none;
        }
        [data-ct-theme="monolith"] .mo-win-hero,
        [data-ct-theme="monolith"] .mo-win-inscription,
        [data-ct-theme="monolith"] .mo-win-cta {
          opacity: 1;
          transform: none;
        }
      }
    `,
  },
  layout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        // `isolate` traps the -z layers; the page never sees the slab
        // bleed out. Generous vertical padding so the monolith has
        // breathing room above and below.
        base: 'relative min-h-screen w-full grid place-items-center overflow-hidden isolate bg-[color:var(--ct-color-bg)] px-4 py-10',
        md: 'md:px-8 md:py-16',
      },
    },
    children: [
      // ─── 1. Slab — the stone itself. A vertical gradient that
      //      establishes the block's volume before any light touches it.
      {
        id: 'bg-slab',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-30 [background:var(--ct-effect-slab)]',
          },
        },
      },

      // ─── 2. Cool wash — the shaded side fill light. Just enough
      //      lift on the left flank to round the form.
      {
        id: 'bg-cool-wash',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-22 [background:var(--ct-effect-cool-wash)] [filter:blur(40px)]',
          },
        },
      },

      // ─── 3. Rim light — warm amber raking from camera-right. The
      //      single chromatic accent in the composition. Will-change
      //      keeps the breathe animation off the main thread.
      {
        id: 'bg-rim-light',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-18 [background:var(--ct-effect-rim-light)] [filter:blur(24px)] [will-change:transform,opacity] motion-safe:[animation:ct-monolith-rim_18s_ease-in-out_infinite]',
            md: 'md:[filter:blur(36px)]',
          },
        },
      },

      // ─── 4. Plinth — the dark pool at the floor where the monolith
      //      grounds. Without this the block reads as floating.
      {
        id: 'bg-plinth',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-x-0 bottom-0 h-[60%] -z-16 [background:var(--ct-effect-plinth)]',
          },
        },
      },

      // ─── 5. Grain — fine carved-stone texture. Held very faint with
      //      mix-blend-overlay and low opacity. Masked so the grain
      //      fades into the corners (avoids the obvious "tile" look).
      {
        id: 'bg-grain',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-14 opacity-[0.18] mix-blend-overlay [background:var(--ct-effect-grain)] [background-size:6px_6px,11px_11px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]',
          },
        },
      },

      // ─── 6. Vignette — corner falloff anchors the eye to the slab face.
      {
        id: 'bg-vignette',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]',
          },
        },
      },

      // ─── Foreground stack — title above, monolith centre, subtitle
      //      and progress notches below. Centred, fixed max-width so
      //      the block never sprawls on ultrawide displays.
      {
        id: 'stack',
        type: 'group',
        classes: {
          className: {
            base: 'relative flex flex-col items-center gap-6 text-center w-full max-w-[min(98vw,80rem)]',
            md: 'md:gap-10',
          },
        },
        children: [
          // ─── Engraved title — chiselled-in eyebrow. Inverted shadow
          //     (light below, shadow above) reads as recessed.
          {
            id: 'title',
            type: 'event-title',
            props: { source: 'title' },
            vars: {
              base: {
                'ct-tracking-title': '0.48em',
                'ct-weight-title': '600',
                'ct-color-title': 'var(--ct-color-title)',
                'ct-text-shadow': 'var(--ct-effect-engraved-title)',
              },
              md: {
                'ct-tracking-title': '0.62em',
                'ct-weight-title': '600',
                'ct-color-title': 'var(--ct-color-title)',
                'ct-text-shadow': 'var(--ct-effect-engraved-title)',
              },
            },
            classes: {
              className: {
                base: 'uppercase pl-[0.48em] [text-shadow:var(--ct-effect-engraved-title)]',
              },
            },
          },

          // ─── The monolith. Massive, tight, embossed, divided into
          //     courses by thin amber-tinted seams between unit blocks.
          //     Labels are kept (tiny, engraved) so the architecture
          //     reads as measured stone, not abstract typography.
          {
            id: 'timer',
            type: 'timer',
            props: { format: 'dhms', padZeros: true },
            vars: {
              base: {
                // Tight gap between courses; the seam pseudo-element
                // sits inside that gap.
                'ct-timer-gap': '0.28em',
                'ct-unit-gap': '0.35em',
                'ct-unit-align': 'center',
                'ct-unit-min-width': '1.9ch',
                'ct-timer-justify': 'center',
                'ct-weight-timer': '900',
                'ct-tracking-timer': '-0.07em',
                'ct-color-value': 'var(--ct-color-fg)',
                'ct-color-label':
                  'color-mix(in oklab, var(--ct-color-muted), transparent 10%)',
                'ct-tracking-label': '0.34em',
                'ct-weight-label': '500',
                'ct-opacity-label': '0.7',
                'ct-text-shadow': 'var(--ct-effect-engraved-digit)',
              },
              md: {
                'ct-timer-gap': '0.95em',
                'ct-unit-gap': '0.5em',
                'ct-unit-align': 'center',
                'ct-unit-min-width': '2.4ch',
                'ct-timer-justify': 'center',
                'ct-weight-timer': '900',
                'ct-tracking-timer': '-0.06em',
                'ct-color-value': 'var(--ct-color-fg)',
                'ct-color-label':
                  'color-mix(in oklab, var(--ct-color-muted), transparent 10%)',
                'ct-tracking-label': '0.48em',
                'ct-weight-label': '500',
                'ct-opacity-label': '0.7',
                'ct-text-shadow': 'var(--ct-effect-engraved-digit)',
              },
            },
            classes: {
              className: {
                // The seam: render a 1px vertical "light leak" between
                // each unit block via a left border on every block
                // except the first. The pseudo-element approach lives
                // in Tailwind arbitrary selectors so no extra slot DOM
                // is required.
                // `flex-nowrap` on the timer flexbox prevents the four
                // courses from breaking onto a second row at narrow
                // widths; the responsive font sizing already keeps the
                // total width under the viewport. The seam pseudo-
                // element renders a 1px vertical "light leak" between
                // each unit block via a left offset on every block
                // except the first — no extra slot DOM required.
                base: "leading-[0.85] [&]:flex-nowrap [&_[data-unit-block]]:relative [&_[data-unit-block]]:px-[0.14em] [&_[data-unit-block]:not(:first-child)]:before:content-[''] [&_[data-unit-block]:not(:first-child)]:before:absolute [&_[data-unit-block]:not(:first-child)]:before:top-[8%] [&_[data-unit-block]:not(:first-child)]:before:bottom-[34%] [&_[data-unit-block]:not(:first-child)]:before:-left-[0.02em] [&_[data-unit-block]:not(:first-child)]:before:w-px [&_[data-unit-block]:not(:first-child)]:before:[background:var(--ct-effect-seam)] motion-safe:[&_[data-unit-block]:not(:first-child)]:before:[animation:ct-monolith-seam_9s_ease-in-out_infinite] [&_[data-label]]:mt-[0.55em] [&_[data-label]]:font-[var(--ct-font-label)]",
                md: 'md:[&_[data-unit-block]]:px-[0.42em] md:[&_[data-unit-block]:not(:first-child)]:before:-left-[0.1em]',
              },
            },
          },

          // ─── Quiet subtitle beneath the slab — basalt grey, single
          //     thin line, no decoration. Provides the human note
          //     beneath the architecture.
          {
            id: 'subtitle',
            type: 'event-title',
            props: { source: 'subtitle' },
            vars: {
              base: {
                'ct-color-subtitle':
                  'color-mix(in oklab, var(--ct-color-fg), transparent 55%)',
                'ct-weight-subtitle': '400',
                'ct-tracking-subtitle': '0.04em',
                'ct-opacity-subtitle': '0.92',
              },
            },
            classes: {
              className: { base: 'mt-1 md:mt-2' },
            },
          },

          // ─── Progress as "courses of stone". Segments — four notches
          //     that fill with the warm rim hue as time elapses, like
          //     sunlight slowly crossing the face of the block.
          {
            id: 'progress',
            type: 'progress',
            props: { kind: 'segments', direction: 'elapsed' },
            vars: {
              base: {
                'ct-segment-height': '4px',
                'ct-segment-gap': '8px',
                'ct-color-progress-track':
                  'color-mix(in oklab, var(--ct-color-fg), transparent 88%)',
                'ct-color-progress-fill':
                  'color-mix(in oklab, var(--ct-color-accent), var(--ct-color-fg) 18%)',
                'ct-effect-progress-glow': 'var(--ct-effect-progress-glow)',
              },
              md: {
                'ct-segment-height': '5px',
                'ct-segment-gap': '10px',
                'ct-color-progress-track':
                  'color-mix(in oklab, var(--ct-color-fg), transparent 88%)',
                'ct-color-progress-fill':
                  'color-mix(in oklab, var(--ct-color-accent), var(--ct-color-fg) 18%)',
                'ct-effect-progress-glow': 'var(--ct-effect-progress-glow)',
              },
            },
            classes: {
              className: {
                base: 'w-full max-w-[min(86vw,28rem)] mt-2',
                md: 'md:max-w-md md:mt-4',
              },
            },
          },
        ],
      },
    ],
  },
  // Reduced motion: the rim breathe and seam shimmer are decorative.
  // Everything in the composition is static-friendly — keep the
  // identity (slab, rim, plinth, grain, embossing all hold up at
  // 0fps), and just empty the keyframes registry so nothing revives.
  reducedMotion: {
    animations: {},
  },
  // ─── Done scene — "Engraved Inscription" ───────────────────────────
  // The slab is preserved. Title eyebrow holds. The timer is replaced
  // by the event title cut into the stone with the same engraved-digit
  // shadow. A small tracked inscription kicker sits beneath, then the
  // CTA pill. The whole ambient stack (slab/cool/rim/plinth/grain/
  // vignette) is reused verbatim with the same ids so the rim flare
  // selector keyed on #bg-rim-light continues to address the right
  // node at done.
  doneLayout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        base: 'relative min-h-screen w-full grid place-items-center overflow-hidden isolate bg-[color:var(--ct-color-bg)] px-4 py-10',
        md: 'md:px-8 md:py-16',
      },
    },
    children: [
      {
        id: 'bg-slab',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-30 [background:var(--ct-effect-slab)]',
          },
        },
      },
      {
        id: 'bg-cool-wash',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-22 [background:var(--ct-effect-cool-wash)] [filter:blur(40px)]',
          },
        },
      },
      {
        id: 'bg-rim-light',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-18 [background:var(--ct-effect-rim-light)] [filter:blur(24px)] [will-change:transform,opacity,filter]',
            md: 'md:[filter:blur(36px)]',
          },
        },
      },
      {
        id: 'bg-plinth',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-x-0 bottom-0 h-[60%] -z-16 [background:var(--ct-effect-plinth)]',
          },
        },
      },
      {
        id: 'bg-grain',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-14 opacity-[0.18] mix-blend-overlay [background:var(--ct-effect-grain)] [background-size:6px_6px,11px_11px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]',
          },
        },
      },
      {
        id: 'bg-vignette',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]',
          },
        },
      },

      // ─── Foreground — engraved eyebrow, hero inscription, kicker, CTA.
      {
        id: 'win-stack',
        type: 'group',
        classes: {
          className: {
            base: 'relative flex flex-col items-center gap-5 text-center w-full max-w-[min(98vw,80rem)]',
            md: 'md:gap-7',
          },
        },
        children: [
          // Engraved eyebrow — same recipe as live (recessed shadow).
          {
            id: 'title',
            type: 'event-title',
            props: { source: 'title' },
            vars: {
              base: {
                'ct-tracking-title': '0.48em',
                'ct-weight-title': '600',
                'ct-color-title': 'var(--ct-color-title)',
                'ct-text-shadow': 'var(--ct-effect-engraved-title)',
              },
              md: {
                'ct-tracking-title': '0.62em',
                'ct-weight-title': '600',
                'ct-color-title': 'var(--ct-color-title)',
                'ct-text-shadow': 'var(--ct-effect-engraved-title)',
              },
            },
            classes: {
              className: {
                base: 'uppercase pl-[0.48em] [text-shadow:var(--ct-effect-engraved-title)]',
              },
            },
          },
          // Hero — event title cut into the stone at digit weight/scale.
          // Sourced from subtitle so the eyebrow above (title) and the
          // hero below (subtitle) carry the two pieces of event copy.
          // If the schema later exposes a primary slot we can swap.
          {
            id: 'win-hero',
            type: 'event-title',
            props: { source: 'subtitle' },
            classes: { className: { base: 'mo-win-hero' } },
          },
          // Inscription kicker — small tracked engraved line. Text
          // supplied by .mo-win-inscription::before; empty background
          // div carries it.
          {
            id: 'win-inscription',
            type: 'background',
            props: { kind: 'gradient' },
            classes: { className: { base: 'mo-win-inscription' } },
          },
          // CTA pill — bone-on-graphite, hairline amber border.
          {
            id: 'win-cta',
            type: 'background',
            props: { kind: 'gradient' },
            classes: {
              className: { base: 'mo-win-cta select-none inline-block mt-2' },
            },
          },
        ],
      },
    ],
  },
}
