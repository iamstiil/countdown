import type { CountdownTheme } from '../theming/types'

/**
 * Neon Grid — a cyberpunk transmission terminal.
 *
 * Concept: the viewer is standing on an infinite chrome plain that recedes
 * to a glowing cyan/magenta horizon. The timer hangs in mid-air above the
 * horizon line as the focal point — cyan neon digits with a magenta
 * chromatic halo. Above the horizon a deep cool void, faint scanlines, and
 * an atmospheric bloom. Below it a perspective grid floor that scrolls
 * slowly toward the viewer.
 *
 * All visual choices are driven by `--ct-*` tokens consumed by the base
 * stylesheet. Layering uses the `--ct-z-*` z-order tokens defined in
 * `countdown.css` so background slots stack predictably below content.
 *
 * Accessibility:
 *  - Foreground (`fg`) sits at WCAG AAA against `bg`.
 *  - Cyan accent and magenta secondary are used for *glow* and structural
 *    hints, never as the only carrier of meaning.
 *  - Title is rendered at the brighter cyan-300 token (`--ct-color-title`)
 *    so the eyebrow stays legible against the void.
 *  - A `reducedMotion` variant freezes the floor scroll and horizon pulse.
 */
export const neonGridTheme: CountdownTheme = {
  id: 'neon-grid',
  name: 'Neon Grid',
  fonts: [
    { family: 'Orbitron', weights: [500, 700], source: 'google' },
    { family: 'JetBrains Mono', weights: [400, 500], source: 'google' },
  ],
  tokens: {
    base: {
      color: {
        // Near-black with a cool cyan tint — deep enough to make neon pop
        // without crushing detail in dark UI.
        bg: '#03050f',
        // Cool off-white. AAA against bg; used for digit fill and subtitle.
        fg: '#e6f6ff',
        // Primary neon: cyan-400. Carries digit fill + grid lines + bar fill.
        accent: '#22d3ee',
        // Secondary neon: fuchsia-300. Used only for chromatic glow halos
        // and the second horizon bloom — never as the sole legibility color.
        secondary: '#f0abfc',
        // Muted slate for structural lines and progress track.
        muted: '#475569',
        // Eyebrow title uses the brighter cyan-300 for hierarchy + life.
        title: '#67e8f9',
      },
      font: {
        // Display: techy geometric for the hero digits + eyebrow.
        display:
          '"Orbitron", "Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif',
        // Label / subtitle: monospace gives the "terminal transmission" feel.
        label:
          '"JetBrains Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
      },
      size: {
        // Timer scales with viewport width so all four unit blocks stay on a
        // single horizontal "transmission line" from ~360px phones up to
        // ultrawide displays. The lower bound keeps narrow viewports legible;
        // the upper bound keeps the hero from dominating ultrawide layouts.
        timer: 'clamp(2.25rem, 11vw, 7.5rem)',
        title: 'clamp(0.72rem, 1.8vw, 0.88rem)',
        subtitle: 'clamp(0.85rem, 1.6vw, 1rem)',
        label: '0.7rem',
      },
      space: { '1': '0.25rem', '4': '1rem', '8': '2rem' },
      motion: { fast: '180ms', slow: '900ms' },
      effect: {
        // Digit halo: tight cyan core + wide magenta bleed = chromatic
        // neon. Both layers ride color-mix so they re-tint if a downstream
        // user swaps the accent tokens.
        glow: '0 0 18px color-mix(in oklab, var(--ct-color-accent), transparent 35%), 0 0 48px color-mix(in oklab, var(--ct-color-accent), transparent 65%), 0 0 96px color-mix(in oklab, var(--ct-color-secondary), transparent 75%)',
        // Progress bar gets its own thinner glow.
        'progress-glow':
          '0 0 12px color-mix(in oklab, var(--ct-color-accent), transparent 40%), 0 0 28px color-mix(in oklab, var(--ct-color-accent), transparent 70%)',
        // Horizon beam used by `bg-horizon`.
        'horizon-beam':
          'radial-gradient(ellipse 80% 18% at 50% 58%, color-mix(in oklab, var(--ct-color-accent), transparent 55%) 0%, color-mix(in oklab, var(--ct-color-accent), transparent 80%) 25%, transparent 60%), radial-gradient(ellipse 55% 12% at 50% 58%, color-mix(in oklab, var(--ct-color-secondary), transparent 65%) 0%, transparent 65%)',
      },
    },
    md: {
      // Larger breakpoint: bigger hero, bigger eyebrow.
      size: {
        timer: 'clamp(3.5rem, 9vw, 8.5rem)',
        title: '0.95rem',
        subtitle: 'clamp(0.95rem, 1.4vw, 1.1rem)',
      },
    },
    lg: {
      size: {
        timer: 'clamp(4.5rem, 8.5vw, 10rem)',
      },
    },
  },
  animations: {
    // Floor lines scrolling toward the viewer. 32px = one grid cell, so
    // each iteration lands the pattern back on the same phase.
    'grid-floor':
      '@keyframes ct-grid-floor{from{background-position:0 0,0 0}to{background-position:0 32px,0 0}}',
    // Subtle horizon breath — width and brightness modulation.
    'horizon-pulse':
      '@keyframes ct-horizon-pulse{0%,100%{opacity:.85;filter:blur(0)}50%{opacity:1;filter:blur(.5px)}}',
    // Scanlines drift very slowly for atmosphere; not a tick indicator.
    'scanline-drift':
      '@keyframes ct-scanline-drift{from{background-position:0 0}to{background-position:0 6px}}',

    // ─── Done scene ──────────────────────────────────────────────────
    // T-zero choreography:
    //  1. A one-shot "horizon burst" overlay expands across the upper
    //     half (600ms), then settles into a steady-state thicker beam.
    //  2. Scanlines briefly intensify (200ms) for a CRT "kick".
    //  3. The kept timer fades to ~25% as a ghost-tombstone of the
    //     elapsed countdown — preserves orientation for users who
    //     tabbed away during the final seconds.
    //  4. Three boot-log lines type themselves in (mono, accent cyan,
    //     final line fuchsia) using a width + steps() typewriter so no
    //     JS is needed. Each line is `aria-hidden` decorative chrome;
    //     the live region carries the real announcement.
    //  5. A `[ ENTER ↵ ]` CTA fades in last and receives focus.
    //
    // All animations run once via `forwards`. Reduced-motion drops the
    // burst/typewriter and just stamps the final state.
    done: `
      /* (1) Horizon burst overlay — sits at -z-24 (above void, below
         grid). A bright cyan→fuchsia ellipse that expands then settles. */
      [data-ct-theme="neon-grid"][data-state="done"] .ng-burst {
        position: absolute; inset: 0;
        pointer-events: none;
        z-index: -24;
        background:
          radial-gradient(ellipse 120% 28% at 50% 58%,
            color-mix(in oklab, var(--ct-color-accent), transparent 25%) 0%,
            color-mix(in oklab, var(--ct-color-accent), transparent 60%) 35%,
            transparent 70%),
          radial-gradient(ellipse 90% 20% at 50% 58%,
            color-mix(in oklab, var(--ct-color-secondary), transparent 40%) 0%,
            transparent 65%);
        opacity: 0;
        transform: scaleX(0.4);
        transform-origin: 50% 58%;
        animation: ng-horizon-burst 1400ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      }
      @keyframes ng-horizon-burst {
        0%   { opacity: 0;    transform: scaleX(0.4) scaleY(0.6); filter: blur(0); }
        25%  { opacity: 0.95; transform: scaleX(1.05) scaleY(1.15); filter: blur(2px); }
        60%  { opacity: 0.7;  transform: scaleX(1.0)  scaleY(1);    filter: blur(0.5px); }
        100% { opacity: 0.55; transform: scaleX(1.0)  scaleY(1);    filter: blur(0); }
      }

      /* (2) Scanline kick — one-shot intensify, returns to the existing
         ambient scanline opacity (.07). */
      [data-ct-theme="neon-grid"][data-state="done"] #bg-scanlines {
        animation: ng-scan-kick 320ms ease-out 60ms;
      }
      @keyframes ng-scan-kick {
        0%   { opacity: 0.07; }
        40%  { opacity: 0.22; }
        100% { opacity: 0.07; }
      }

      /* (3) Ghost timer — desaturated tombstone of 00:00:00:00. The
         labels stay legible (muted cyan) so the structure reads as
         "what just elapsed", not "broken loading state". The four unit
         blocks must stay on a single transmission line at every
         breakpoint, so we both clamp the digit size down to a ghost
         scale and forbid wrapping outright. */
      [data-ct-theme="neon-grid"][data-state="done"] [data-slot="timer"] {
        opacity: 0.28;
        filter: grayscale(40%);
        flex-wrap: nowrap;
        max-width: 100%;
        transition: opacity 600ms ease, filter 600ms ease;
      }
      [data-ct-theme="neon-grid"][data-state="done"] [data-slot="timer"] [data-value] {
        font-size: var(--ct-size-timer);
        text-shadow: none;
      }

      /* Hero word — replaces the timer as the focal point. Massive
         Orbitron, cyan core with fuchsia halo, fades in after the burst.
         Text is supplied via ::before so the background slot div stays
         empty (no extra slot type needed). */
      [data-ct-theme="neon-grid"] .ng-hero {
        font-family: var(--ct-font-display);
        font-weight: 700;
        letter-spacing: 0.06em;
        font-size: clamp(2.4rem, 9vw, 6rem);
        line-height: 1;
        color: var(--ct-color-fg);
        text-shadow: var(--ct-effect-glow);
        opacity: 0;
        transform: translateY(8px);
        animation: ng-hero-in 520ms cubic-bezier(0.2, 0.8, 0.2, 1) 320ms both;
        text-align: center;
      }
      [data-ct-theme="neon-grid"] .ng-hero::before {
        content: "SYS://LIVE";
      }
      @keyframes ng-hero-in {
        0%   { opacity: 0; transform: translateY(8px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      /* (4) Boot log — three stacked mono lines, typed in via width +
         steps(). Each line is decorative chrome (aria-hidden); the
         live region carries the real announcement. */
      [data-ct-theme="neon-grid"] .ng-boot {
        font-family: var(--ct-font-label);
        font-size: clamp(0.7rem, 1.4vw, 0.85rem);
        letter-spacing: 0.08em;
        color: var(--ct-color-accent);
        white-space: nowrap;
        overflow: hidden;
        width: 0;
        text-align: left;
        opacity: 0.9;
      }
      [data-ct-theme="neon-grid"] .ng-boot-1::before { content: "> closing transmission\\2026"; }
      [data-ct-theme="neon-grid"] .ng-boot-2::before { content: "> handshake ok"; }
      [data-ct-theme="neon-grid"] .ng-boot-3::before { content: "> SYS://LIVE"; }
      [data-ct-theme="neon-grid"][data-state="done"] .ng-boot-1 {
        animation: ng-type 520ms steps(28, end) 900ms both;
      }
      [data-ct-theme="neon-grid"][data-state="done"] .ng-boot-2 {
        animation: ng-type 420ms steps(20, end) 1500ms both;
      }
      [data-ct-theme="neon-grid"][data-state="done"] .ng-boot-3 {
        animation: ng-type 380ms steps(16, end) 2000ms both;
        color: var(--ct-color-secondary);
        text-shadow: 0 0 12px color-mix(in oklab, var(--ct-color-secondary), transparent 60%);
      }
      @keyframes ng-type {
        from { width: 0; }
        to   { width: 100%; }
      }

      /* (5) CTA pill — bracketed mono affordance, fades in last. Text
         lives in ::before so the empty background slot div carries it. */
      [data-ct-theme="neon-grid"] .ng-cta::before {
        content: "[ ENTER \\21B5 ]";
      }
      [data-ct-theme="neon-grid"] .ng-cta {
        font-family: var(--ct-font-label);
        font-size: clamp(0.78rem, 1.5vw, 0.95rem);
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: var(--ct-color-fg);
        padding: 0.7rem 1.4rem;
        border: 1px solid color-mix(in oklab, var(--ct-color-accent), transparent 50%);
        background: color-mix(in oklab, var(--ct-color-accent), transparent 92%);
        text-shadow: 0 0 14px color-mix(in oklab, var(--ct-color-accent), transparent 55%);
        box-shadow:
          0 0 0 1px color-mix(in oklab, var(--ct-color-accent), transparent 75%) inset,
          0 0 22px color-mix(in oklab, var(--ct-color-accent), transparent 70%);
        opacity: 0;
        animation: ng-hero-in 380ms ease-out 2400ms both;
        cursor: pointer;
        transition: background 160ms ease, box-shadow 160ms ease;
      }
      [data-ct-theme="neon-grid"] .ng-cta:hover,
      [data-ct-theme="neon-grid"] .ng-cta:focus-visible {
        background: color-mix(in oklab, var(--ct-color-accent), transparent 80%);
        box-shadow:
          0 0 0 1px var(--ct-color-accent) inset,
          0 0 32px color-mix(in oklab, var(--ct-color-accent), transparent 50%);
        outline: none;
      }

      /* Reduced motion: drop the burst, typewriter, hero slide-in, and
         scanline kick. Show the final composed frame immediately. */
      @media (prefers-reduced-motion: reduce) {
        [data-ct-theme="neon-grid"][data-state="done"] .ng-burst,
        [data-ct-theme="neon-grid"][data-state="done"] #bg-scanlines,
        [data-ct-theme="neon-grid"] .ng-hero,
        [data-ct-theme="neon-grid"] .ng-cta,
        [data-ct-theme="neon-grid"][data-state="done"] .ng-boot-1,
        [data-ct-theme="neon-grid"][data-state="done"] .ng-boot-2,
        [data-ct-theme="neon-grid"][data-state="done"] .ng-boot-3 {
          animation: none;
        }
        [data-ct-theme="neon-grid"] .ng-hero,
        [data-ct-theme="neon-grid"] .ng-cta { opacity: 1; transform: none; }
        [data-ct-theme="neon-grid"][data-state="done"] .ng-boot { width: 100%; }
        [data-ct-theme="neon-grid"][data-state="done"] .ng-burst {
          opacity: 0.55; transform: none;
        }
      }
    `,
  },
  layout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        // `isolate` creates a fresh stacking context so the `-z-*` layers
        // never escape into the chrome / page layers above.
        base: 'relative min-h-screen w-full grid place-items-center overflow-hidden isolate bg-[color:var(--ct-color-bg)]',
      },
    },
    children: [
      // -------- Background stack (back → front) --------------------------
      // 1. Deep void with a centered cyan-tinted radial fall-off.
      {
        id: 'bg-void',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-30 [background:radial-gradient(ellipse_70%_55%_at_50%_45%,color-mix(in_oklab,var(--ct-color-accent),transparent_85%)_0%,transparent_60%),var(--ct-color-bg)]',
          },
        },
      },
      // 2. Horizon beam — the focal "vanishing point" the floor recedes
      //    toward. Cyan core + magenta secondary bloom for chromatic depth.
      {
        id: 'bg-horizon',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-25 [background:var(--ct-effect-horizon-beam)] motion-safe:[animation:ct-horizon-pulse_7s_ease-in-out_infinite]',
          },
        },
      },
      // 3. Perspective grid FLOOR — bottom half of the viewport, rotated
      //    into the ground plane. Two crossing linear-gradients form the
      //    grid; mask-image fades it toward the horizon. Scrolls toward
      //    the camera via the `ct-grid-floor` keyframes.
      {
        id: 'bg-grid-floor',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-x-[-25%] bottom-[-10%] top-[55%] -z-20 [transform-origin:center_top] [transform:perspective(700px)_rotateX(62deg)] [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--ct-color-accent),transparent_55%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--ct-color-accent),transparent_55%)_1px,transparent_1px)] [background-size:32px_32px,32px_32px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_85%,transparent_100%)] opacity-[0.55] motion-safe:[animation:ct-grid-floor_3s_linear_infinite]',
            md: 'md:[transform:perspective(900px)_rotateX(64deg)] md:opacity-[0.6]',
          },
        },
      },
      // 4. Perspective grid CEILING — mirrored faintly above the horizon
      //    for symmetry and a sense of being inside a corridor.
      {
        id: 'bg-grid-ceiling',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-x-[-25%] top-[-10%] bottom-[55%] -z-20 [transform-origin:center_bottom] [transform:perspective(700px)_rotateX(-62deg)] [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--ct-color-accent),transparent_75%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--ct-color-accent),transparent_75%)_1px,transparent_1px)] [background-size:32px_32px,32px_32px] [mask-image:linear-gradient(to_top,transparent_0%,black_25%,black_80%,transparent_100%)] opacity-[0.22]',
            md: 'md:[transform:perspective(900px)_rotateX(-64deg)] md:opacity-[0.28]',
          },
        },
      },
      // 5. CRT scanlines — extremely subtle horizontal banding for the
      //    "transmission" texture. Drift is glacial; respects reduced motion.
      {
        id: 'bg-scanlines',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-15 opacity-[0.07] mix-blend-screen [background-image:repeating-linear-gradient(to_bottom,color-mix(in_oklab,var(--ct-color-accent),transparent_40%)_0_1px,transparent_1px_3px)] motion-safe:[animation:ct-scanline-drift_4s_linear_infinite]',
          },
        },
      },
      // 6. Edge vignette — deepens the corners so the horizon stays the
      //    eye's anchor and the timer hangs in clean negative space.
      {
        id: 'bg-vignette',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)]',
          },
        },
      },

      // -------- Foreground content stack --------------------------------
      {
        id: 'stack',
        type: 'group',
        classes: {
          className: {
            base: 'relative flex flex-col items-center gap-8 px-4 py-12 text-center w-full max-w-[min(96vw,72rem)]',
            md: 'md:gap-12 md:px-6 md:py-16',
          },
        },
        children: [
          // Eyebrow title — small, mono-tracked, brackets framed.
          {
            id: 'title',
            type: 'event-title',
            props: { source: 'title' },
            vars: {
              base: {
                'ct-tracking-title': '0.32em',
                'ct-weight-title': '600',
                'ct-font-display':
                  '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
              },
            },
            classes: {
              className: {
                base: "relative before:content-['//'] before:mr-2 before:text-[color:var(--ct-color-accent)] before:opacity-70 after:content-['_↯'] after:ml-2 after:text-[color:var(--ct-color-secondary)] after:opacity-60 [text-shadow:0_0_18px_color-mix(in_oklab,var(--ct-color-title),transparent_60%)]",
              },
            },
          },
          // Subtitle — monospace body, slightly dimmed so the timer stays
          // dominant in the visual hierarchy.
          {
            id: 'subtitle',
            type: 'event-title',
            props: { source: 'subtitle' },
            vars: {
              base: {
                'ct-color-subtitle':
                  'color-mix(in oklab, var(--ct-color-fg), transparent 35%)',
                'ct-font-subtitle':
                  '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
                'ct-tracking-subtitle': '0.04em',
              },
            },
            classes: {
              className: { base: '-mt-2' },
            },
          },
          // FOCAL POINT — massive cyan digits with chromatic neon halo.
          // Labels sit below in muted mono. Drop-shadow uses the shared
          // `--ct-effect-glow` token so adjusting the halo is one-liner.
          {
            id: 'timer',
            type: 'timer',
            props: { format: 'dhms', padZeros: true },
            vars: {
              base: {
                // Gaps and min-widths are tuned so 4 unit blocks fit on a
                // single horizontal row at common mobile widths (~360-500px)
                // without forcing wrap. Digits — not the min-width floor —
                // drive each unit's actual width.
                'ct-timer-gap': '0.6rem',
                'ct-unit-gap': '0.6rem',
                'ct-unit-min-width': '2ch',
                'ct-weight-timer': '700',
                'ct-tracking-timer': '-0.03em',
                'ct-color-value': 'var(--ct-color-fg)',
                'ct-color-label':
                  'color-mix(in oklab, var(--ct-color-accent), transparent 35%)',
                // Bright cyan key + magenta secondary bleed = neon halo.
                'ct-text-shadow': 'var(--ct-effect-glow)',
              },
              md: {
                'ct-timer-gap': '1.5rem',
                'ct-unit-gap': '0.9rem',
                'ct-unit-min-width': '2.4ch',
              },
              lg: {
                'ct-timer-gap': '2.25rem',
                'ct-unit-min-width': '2.6ch',
              },
            },
            classes: {
              className: {
                // Labels get the terminal mono + tracking treatment.
                base: '[&_[data-label]]:font-[var(--ct-font-label)] [&_[data-label]]:tracking-[0.4em] [&_[data-label]]:uppercase [&_[data-label]]:text-[length:var(--ct-size-label)]',
              },
            },
          },
          // Progress as a segmented power-meter — supports the futuristic
          // motif without competing with the timer for attention.
          {
            id: 'progress',
            type: 'progress',
            props: { kind: 'segments', direction: 'elapsed' },
            classes: {
              className: {
                base: 'w-full max-w-xs mt-3',
                md: 'md:max-w-md md:mt-5',
              },
            },
            vars: {
              base: {
                'ct-segment-height': '4px',
                'ct-segment-gap': '6px',
                'ct-color-progress-track':
                  'color-mix(in oklab, var(--ct-color-accent), transparent 88%)',
                'ct-color-progress-fill':
                  'linear-gradient(90deg, var(--ct-color-accent), var(--ct-color-secondary))',
              },
            },
          },
        ],
      },
    ],
  },
  /**
   * Done scene — `SYS://LIVE` boot sequence with horizon burst opening.
   *
   * Diegetic: the world (horizon, grid, scanlines) breaks rather than a
   * modal popping. Reuses every background slot from the main layout so
   * the transition reads as the same place at a different moment.
   *
   * Choreography (see the `done` block in `animations` for timings):
   *   0ms     burst overlay expands across upper half (one-shot)
   *   60ms    scanlines kick (intensify → settle)
   *   320ms   hero word `SYS://LIVE` fades in
   *   900ms   boot line 1 types in
   *   1500ms  boot line 2
   *   2000ms  boot line 3 (fuchsia — the "verb")
   *   2400ms  primary CTA fades in (receives focus)
   */
  doneLayout: {
    id: 'done-root',
    type: 'group',
    classes: {
      className: {
        base: 'relative min-h-screen w-full grid place-items-center overflow-hidden isolate bg-[color:var(--ct-color-bg)]',
      },
    },
    children: [
      // Reuse every ambient background layer so the world persists.
      {
        id: 'bg-void',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-30 [background:radial-gradient(ellipse_70%_55%_at_50%_45%,color-mix(in_oklab,var(--ct-color-accent),transparent_85%)_0%,transparent_60%),var(--ct-color-bg)]',
          },
        },
      },
      {
        id: 'bg-horizon',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'absolute inset-0 -z-25 [background:var(--ct-effect-horizon-beam)]',
          },
        },
      },
      // The one-shot burst — sits between horizon and grid floor.
      {
        id: 'burst',
        type: 'background',
        props: { kind: 'gradient' },
        classes: { className: { base: 'ng-burst' } },
      },
      {
        id: 'bg-grid-floor',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-x-[-25%] bottom-[-10%] top-[55%] -z-20 [transform-origin:center_top] [transform:perspective(700px)_rotateX(62deg)] [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--ct-color-accent),transparent_55%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--ct-color-accent),transparent_55%)_1px,transparent_1px)] [background-size:32px_32px,32px_32px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_85%,transparent_100%)] opacity-[0.55]',
            md: 'md:[transform:perspective(900px)_rotateX(64deg)] md:opacity-[0.6]',
          },
        },
      },
      {
        id: 'bg-grid-ceiling',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-x-[-25%] top-[-10%] bottom-[55%] -z-20 [transform-origin:center_bottom] [transform:perspective(700px)_rotateX(-62deg)] [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--ct-color-accent),transparent_75%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--ct-color-accent),transparent_75%)_1px,transparent_1px)] [background-size:32px_32px,32px_32px] [mask-image:linear-gradient(to_top,transparent_0%,black_25%,black_80%,transparent_100%)] opacity-[0.22]',
            md: 'md:[transform:perspective(900px)_rotateX(-64deg)] md:opacity-[0.28]',
          },
        },
      },
      {
        id: 'bg-scanlines',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-15 opacity-[0.07] mix-blend-screen [background-image:repeating-linear-gradient(to_bottom,color-mix(in_oklab,var(--ct-color-accent),transparent_40%)_0_1px,transparent_1px_3px)]',
          },
        },
      },
      {
        id: 'bg-vignette',
        type: 'background',
        props: { kind: 'gradient' },
        classes: {
          className: {
            base: 'pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)]',
          },
        },
      },

      // Foreground content stack.
      {
        id: 'done-stack',
        type: 'group',
        classes: {
          className: {
            base: 'relative flex flex-col items-center gap-6 px-4 py-12 text-center w-full max-w-[min(96vw,52rem)]',
            md: 'md:gap-8 md:px-6 md:py-16',
          },
        },
        children: [
          // Eyebrow re-uses event-title `title` source with the existing
          // chrome treatment (`//` + `↯`) for visual continuity.
          {
            id: 'eyebrow',
            type: 'event-title',
            props: { source: 'title' },
            vars: {
              base: {
                'ct-tracking-title': '0.32em',
                'ct-weight-title': '600',
                'ct-font-display':
                  '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
              },
            },
            classes: {
              className: {
                base: "relative before:content-['//'] before:mr-2 before:text-[color:var(--ct-color-accent)] before:opacity-70 after:content-['_↯'] after:ml-2 after:text-[color:var(--ct-color-secondary)] after:opacity-60 [text-shadow:0_0_18px_color-mix(in_oklab,var(--ct-color-title),transparent_60%)]",
              },
            },
          },

          // HERO — replaces the timer as focal point. Plain div via the
          // background slot; the visual is pure CSS in the `done` block.
          // Two stacked spans give the `SYS://` prefix a dimmer treatment
          // than the `LIVE` payload without needing a new slot type.
          {
            id: 'hero',
            type: 'background',
            props: { kind: 'gradient' },
            classes: {
              className: {
                base: 'ng-hero relative',
              },
            },
          },

          // Boot log — three decorative typed lines. Text content is
          // carried in the `data-line` attribute (read by `::before
          // content: attr()`); not present in vars/props so we pass it
          // via the className-driven content + a wrapper that supplies
          // the attribute. Since SlotNode has no `attrs` field, we use
          // per-line CSS classes (.ng-boot-N) and put the text in CSS.
          {
            id: 'boot-log',
            type: 'group',
            classes: {
              className: {
                base: 'flex flex-col items-center gap-1 mt-2 font-mono w-full max-w-[28rem]',
              },
            },
            children: [
              {
                id: 'boot-1',
                type: 'background',
                props: { kind: 'gradient' },
                classes: { className: { base: 'ng-boot ng-boot-1' } },
              },
              {
                id: 'boot-2',
                type: 'background',
                props: { kind: 'gradient' },
                classes: { className: { base: 'ng-boot ng-boot-2' } },
              },
              {
                id: 'boot-3',
                type: 'background',
                props: { kind: 'gradient' },
                classes: { className: { base: 'ng-boot ng-boot-3' } },
              },
            ],
          },

          // Subtitle = the event's own name, dimmed mono.
          {
            id: 'subtitle',
            type: 'event-title',
            props: { source: 'subtitle' },
            vars: {
              base: {
                'ct-color-subtitle':
                  'color-mix(in oklab, var(--ct-color-fg), transparent 35%)',
                'ct-font-subtitle':
                  '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
                'ct-tracking-subtitle': '0.04em',
              },
            },
            classes: { className: { base: 'mt-2 opacity-90' } },
          },

          // Ghost timer — kept as orientation cue, desaturated by the
          // `done` rules. Same props as the live timer so unit labels
          // and structure persist; only opacity/filter change. Sizes are
          // explicitly overridden here (rather than inheriting the live
          // hero timer scale) so the four unit blocks always fit on a
          // single row beneath the SYS://LIVE hero — even on ultrawide
          // viewports where the live `--ct-size-timer` caps at 10rem.
          {
            id: 'timer',
            type: 'timer',
            props: { format: 'dhms', padZeros: true },
            vars: {
              base: {
                'ct-size-timer': 'clamp(1.2rem, 4vw, 2rem)',
                'ct-timer-gap': '0.6rem',
                'ct-unit-gap': '0.35rem',
                'ct-unit-min-width': '2ch',
                'ct-weight-timer': '700',
                'ct-tracking-timer': '-0.03em',
                'ct-color-value': 'var(--ct-color-fg)',
                'ct-color-label':
                  'color-mix(in oklab, var(--ct-color-accent), transparent 35%)',
              },
              md: {
                'ct-size-timer': 'clamp(1.5rem, 3vw, 2.25rem)',
                'ct-timer-gap': '1.2rem',
                'ct-unit-min-width': '2.4ch',
              },
              lg: {
                'ct-size-timer': 'clamp(1.75rem, 2.4vw, 2.5rem)',
              },
            },
            classes: {
              className: {
                base: '[&_[data-label]]:font-[var(--ct-font-label)] [&_[data-label]]:tracking-[0.4em] [&_[data-label]]:uppercase [&_[data-label]]:text-[length:var(--ct-size-label)]',
              },
            },
          },

          // CTA — bracketed mono pill. Text supplied by `.ng-cta::before`
          // so the empty `background` slot div just carries styling.
          {
            id: 'cta',
            type: 'background',
            props: { kind: 'gradient' },
            classes: {
              className: {
                base: 'ng-cta mt-4 select-none inline-block',
              },
            },
          },
        ],
      },
    ],
  },
  // Reduced-motion variant: freeze the floor scroll, horizon pulse, and
  // scanline drift, but keep the visual identity intact. `motion-safe:`
  // utilities already gate animation properties; we additionally clear
  // the keyframe declarations so nothing else in the cascade reintroduces
  // motion.
  reducedMotion: {
    animations: {},
  },
}
