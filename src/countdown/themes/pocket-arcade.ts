import type { CountdownTheme } from '../theming/types'

/**
 * Pocket Arcade — a coin-op cabinet in your pocket.
 *
 * Curved CRT panel with scanlines and screen glare, candy-machine primaries,
 * arcade button row driven by the progress segments. Loud, kinetic, joyful.
 */
export const pocketArcadeTheme: CountdownTheme = {
  id: 'pocket-arcade',
  name: 'Pocket Arcade',
  tokens: {
    base: {
      color: {
        // Matte charcoal cabinet body.
        bg: '#171419',
        // CRT foreground — slightly green-warm phosphor white.
        fg: '#fdf6e3',
        // Bubblegum magenta as the hero accent.
        accent: '#ff3ea5',
        // Brushed-chrome trim.
        muted: '#8a8794',
        title: '#ffe066', // lemonade yellow marquee
      },
      font: {
        display:
          '"Press Start 2P", "VT323", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        label:
          '"Press Start 2P", "VT323", ui-monospace, SFMono-Regular, Menlo, monospace',
      },
      size: {
        // Pixel fonts read large at small sizes — keep them in check.
        timer: 'clamp(2rem, 11vw, 5.5rem)',
        title: 'clamp(0.55rem, 1.5vw, 0.7rem)',
        label: '0.5rem',
      },
      motion: { fast: '120ms', slow: '500ms' },
    },
    md: {
      size: { timer: 'clamp(3rem, 9vw, 7rem)' },
    },
  },
  animations: {
    fonts: `
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
    `,
    cabinet: `
      [data-ct-theme="pocket-arcade"] {
        background:
          radial-gradient(ellipse 90% 60% at 50% 110%, rgba(255, 62, 165, 0.18), transparent 60%),
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(64, 224, 255, 0.10), transparent 60%),
          var(--ct-color-bg);
      }
      /* Subtle bolts/rivets in the corners — pure CSS decoration. */
      [data-ct-theme="pocket-arcade"]::before,
      [data-ct-theme="pocket-arcade"]::after {
        content: "";
        position: fixed;
        width: 10px; height: 10px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 30%, #d9d4dc, #4a4651 70%, #1b181d);
        box-shadow: 0 1px 2px rgba(0,0,0,0.5);
        pointer-events: none;
        z-index: 1;
      }
      [data-ct-theme="pocket-arcade"]::before { top: 18px; left: 18px; }
      [data-ct-theme="pocket-arcade"]::after  { top: 18px; right: 18px; }
    `,
    screen: `
      /* The CRT screen panel. */
      [data-ct-theme="pocket-arcade"] .pa-screen {
        position: relative;
        background:
          radial-gradient(ellipse 120% 90% at 50% 50%, #0a1d18 0%, #050c0a 70%, #02060a 100%);
        border-radius: 32px / 26px;
        padding: 2rem 1.25rem;
        box-shadow:
          inset 0 0 0 2px #2a262f,
          inset 0 0 0 8px #1a181d,
          inset 0 0 0 10px #3a363f,
          inset 0 0 60px rgba(0,0,0,0.75),
          0 24px 60px -16px rgba(0,0,0,0.7),
          0 0 0 1px #0a080c;
        overflow: hidden;
        isolation: isolate;
      }
      /* Scanlines. */
      [data-ct-theme="pocket-arcade"] .pa-screen::before {
        content: "";
        position: absolute; inset: 0;
        background: repeating-linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0) 0 2px,
          rgba(0, 0, 0, 0.28) 2px 3px
        );
        pointer-events: none;
        mix-blend-mode: multiply;
        animation: pa-scan 6s linear infinite;
        z-index: 2;
      }
      /* Convex glare. */
      [data-ct-theme="pocket-arcade"] .pa-screen::after {
        content: "";
        position: absolute; inset: 0;
        background:
          radial-gradient(ellipse 90% 40% at 30% 8%, rgba(255, 255, 255, 0.10), transparent 60%),
          radial-gradient(ellipse 60% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%);
        pointer-events: none;
        z-index: 3;
      }
      @keyframes pa-scan {
        0%   { background-position: 0 0; }
        100% { background-position: 0 6px; }
      }
    `,
    digits: `
      /* Per-unit candy colors on the digits. */
      [data-ct-theme="pocket-arcade"] [data-slot="timer"] {
        position: relative;
        z-index: 4;
      }
      [data-ct-theme="pocket-arcade"] [data-slot="timer"] [data-value] {
        font-family: var(--ct-font-display);
        line-height: 1;
        letter-spacing: 0.04em;
      }
      [data-ct-theme="pocket-arcade"] [data-unit-block="days"]    [data-value] { color: #ff3ea5; text-shadow: 0 0 6px rgba(255, 62, 165, 0.85), 0 0 18px rgba(255, 62, 165, 0.45); }
      [data-ct-theme="pocket-arcade"] [data-unit-block="hours"]   [data-value] { color: #40e0ff; text-shadow: 0 0 6px rgba(64, 224, 255, 0.85), 0 0 18px rgba(64, 224, 255, 0.45); }
      [data-ct-theme="pocket-arcade"] [data-unit-block="minutes"] [data-value] { color: #ffe066; text-shadow: 0 0 6px rgba(255, 224, 102, 0.85), 0 0 18px rgba(255, 224, 102, 0.45); }
      [data-ct-theme="pocket-arcade"] [data-unit-block="seconds"] [data-value] {
        color: #5dffb0;
        text-shadow: 0 0 6px rgba(93, 255, 176, 0.9), 0 0 18px rgba(93, 255, 176, 0.5);
        animation: pa-pulse 1s steps(2, end) infinite;
      }
      @keyframes pa-pulse {
        0%, 100% { opacity: 1; }
        50%      { opacity: 0.78; }
      }
      [data-ct-theme="pocket-arcade"] [data-slot="timer"] [data-label] {
        font-family: var(--ct-font-label);
        letter-spacing: 0.18em;
        color: #b8b3c2;
        opacity: 0.9;
        font-size: 0.5rem;
      }
    `,
    marquee: `
      /* Top marquee — yellow PRESS-START strip with a bulb glow. */
      [data-ct-theme="pocket-arcade"] [data-slot="event-title"][data-source="title"] {
        font-family: var(--ct-font-display);
        color: #1b181d;
        background:
          radial-gradient(ellipse 100% 200% at 50% 130%, rgba(255, 224, 102, 0.55), transparent 60%),
          linear-gradient(180deg, #ffe066 0%, #ffb84d 100%);
        padding: 0.6rem 1rem;
        border-radius: 6px;
        box-shadow:
          inset 0 0 0 2px #b8862a,
          inset 0 0 0 4px #ffeb99,
          0 0 24px rgba(255, 184, 77, 0.45),
          0 6px 18px rgba(0,0,0,0.4);
        letter-spacing: 0.18em;
        text-transform: uppercase;
        line-height: 1.1;
        animation: pa-flicker 8s infinite;
      }
      [data-ct-theme="pocket-arcade"] [data-slot="event-title"][data-source="subtitle"] {
        font-family: var(--ct-font-label);
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: #b8b3c2;
        font-size: 0.6rem;
      }
      [data-ct-theme="pocket-arcade"] [data-slot="event-title"][data-source="subtitle"]::before {
        content: "1UP · ";
        color: #ff3ea5;
      }
      @keyframes pa-flicker {
        0%, 96%, 100% { filter: brightness(1); }
        97%           { filter: brightness(1.25); }
        98%           { filter: brightness(0.85); }
        99%           { filter: brightness(1.15); }
      }
    `,
    buttons: `
      /* Arcade-button row — drives off the progress 'segments'. */
      [data-ct-theme="pocket-arcade"] [data-slot="progress"][data-kind="segments"] {
        gap: 14px;
        padding: 14px 18px;
        background:
          linear-gradient(180deg, #2a262f 0%, #1a181d 100%);
        border-radius: 18px;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.06),
          inset 0 0 0 1px #0a080c,
          0 8px 18px -8px rgba(0,0,0,0.6);
      }
      [data-ct-theme="pocket-arcade"] [data-slot="progress"][data-kind="segments"] > span {
        height: 18px;
        flex: 1;
        border-radius: 999px;
        background:
          radial-gradient(circle at 30% 30%, #4a4651 0%, #1a181d 70%);
        box-shadow:
          inset 0 -2px 0 rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.08);
        transition: background 200ms ease, box-shadow 200ms ease, transform 120ms ease;
      }
      /* Lit buttons cycle through the candy palette. */
      [data-ct-theme="pocket-arcade"] [data-slot="progress"][data-kind="segments"] > span[data-on="true"]:nth-child(4n+1) { background: radial-gradient(circle at 30% 30%, #ff8ec8, #ff3ea5 70%); box-shadow: inset 0 -2px 0 rgba(0,0,0,0.4), 0 0 14px rgba(255, 62, 165, 0.7); }
      [data-ct-theme="pocket-arcade"] [data-slot="progress"][data-kind="segments"] > span[data-on="true"]:nth-child(4n+2) { background: radial-gradient(circle at 30% 30%, #8ef0ff, #40e0ff 70%); box-shadow: inset 0 -2px 0 rgba(0,0,0,0.4), 0 0 14px rgba(64, 224, 255, 0.7); }
      [data-ct-theme="pocket-arcade"] [data-slot="progress"][data-kind="segments"] > span[data-on="true"]:nth-child(4n+3) { background: radial-gradient(circle at 30% 30%, #fff0a8, #ffe066 70%); box-shadow: inset 0 -2px 0 rgba(0,0,0,0.4), 0 0 14px rgba(255, 224, 102, 0.7); }
      [data-ct-theme="pocket-arcade"] [data-slot="progress"][data-kind="segments"] > span[data-on="true"]:nth-child(4n)   { background: radial-gradient(circle at 30% 30%, #a8ffd2, #5dffb0 70%); box-shadow: inset 0 -2px 0 rgba(0,0,0,0.4), 0 0 14px rgba(93, 255, 176, 0.7); }
    `,
  },
  layout: {
    id: 'root',
    type: 'group',
    classes: {
      className: {
        base: 'relative min-h-screen w-full flex flex-col items-center justify-center gap-6 px-4 py-10 overflow-hidden',
        md: 'md:gap-10 md:px-10 md:py-16',
      },
    },
    children: [
      // Marquee
      {
        id: 'title',
        type: 'event-title',
        props: { source: 'title' },
      },
      // The CRT cabinet
      {
        id: 'cabinet',
        type: 'group',
        classes: {
          className: {
            base: 'pa-screen relative w-full max-w-[min(94vw,40rem)] flex flex-col items-center gap-4',
            md: 'md:gap-6 md:p-10',
          },
        },
        children: [
          {
            id: 'timer',
            type: 'timer',
            props: { format: 'dhms', padZeros: true },
            vars: {
              base: {
                'ct-timer-gap': '0.9rem',
                'ct-unit-gap': '0.4rem',
                'ct-unit-min-width': '2.4ch',
                'ct-timer-justify': 'center',
              },
              md: {
                'ct-timer-gap': '1.4rem',
                'ct-unit-min-width': '2.6ch',
              },
            },
            classes: { className: { base: 'justify-center' } },
          },
          {
            id: 'subtitle',
            type: 'event-title',
            props: { source: 'subtitle' },
            classes: {
              className: { base: 'relative z-[4] text-center mt-1' },
            },
          },
        ],
      },
      // Arcade button row (driven by progress)
      {
        id: 'buttons',
        type: 'progress',
        props: { kind: 'segments', direction: 'elapsed' },
        classes: {
          className: {
            base: 'w-full max-w-[min(94vw,40rem)]',
          },
        },
      },
    ],
  },
}
