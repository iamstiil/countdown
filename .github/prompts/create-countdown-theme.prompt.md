---
mode: agent
description: Create a new countdown theme for this workspace, wired into the registry.
---

# Create a new countdown theme

Your task is to add a new theme to the countdown app. Ask the user for any of these inputs that are missing, then implement:

- **Theme id** (kebab-case, unique — used as filename and `data-ct-theme` selector)
- **Display name** (human-readable)
- **Mood / concept** (e.g. "brutalist editorial", "retro arcade", "calm spa")
- Optional: palette hints, typography hints, layout hints (centered hero / split / corners / single monolith / card / etc.), which slots to include (title, subtitle, timer, progress kind, backgrounds)

If the user gives only a concept, infer reasonable choices and proceed.

## Where things live (read before implementing)

- Theme files: [src/countdown/themes/](../../src/countdown/themes/) — one `.ts` per theme
- Registry to update: [src/countdown/themes/index.ts](../../src/countdown/themes/index.ts)
- Theme type: [src/countdown/theming/types.ts](../../src/countdown/theming/types.ts)
- Base stylesheet defining the token contract: [src/countdown/countdown.css](../../src/countdown/countdown.css)
- Slot components: [src/countdown/components/](../../src/countdown/components/)
- Token CSS emitter: [src/countdown/theming/buildTokenCSS.ts](../../src/countdown/theming/buildTokenCSS.ts)

Skim at least one existing theme for current conventions — recommended: [src/countdown/themes/neon-grid.ts](../../src/countdown/themes/neon-grid.ts) and [src/countdown/themes/monolith.ts](../../src/countdown/themes/monolith.ts).

## Theme shape (`CountdownTheme`)

```ts
{ id, name, tokens: Responsive<PartialTokens>, layout: SlotNode<'group'>, animations? }
```

- `tokens`: mobile-first `{ base, sm?, md?, lg?, xl? }`. Each layer can set `color`, `space`, `font`, `size`, `motion`, `effect`. Emitted as CSS vars `--ct-<group>-<key>` scoped to `[data-ct-theme="<id>"]`.
- `layout`: tree of `SlotNode`s rooted at a `group`. Each node has `id`, `type`, optional `visible`, `vars` (per-slot CSS vars, written as `ct-...` or `--ct-...`), `classes.className` (responsive Tailwind strings: `{ base, sm?, md?, lg?, xl? }`), `props`, and `children` (groups only).

## Available slot types

- `group` — layout container, can have `children`
- `background` — `kind: image | video | gradient | canvas`
- `event-title` — `source: title | subtitle`
- `timer` — `format: dhms | hms | ms`, `padZeros`, `unit?`
- `timer-separator` — `char?`
- `timer-label` — `unit`, `text?`
- `progress` — `kind: bar | ring | segments`, `direction: elapsed | remaining`

## Token CSS variables the base stylesheet consumes

Set via `tokens` (global) or `vars` (per-slot). Names below are the CSS var names; in `tokens` you write them as `{ color: { bg: '#...' } }` → `--ct-color-bg`.

- **Colors:** `--ct-color-bg`, `--ct-color-fg`, `--ct-color-accent`, `--ct-color-muted`, `--ct-color-title`, `--ct-color-subtitle`, `--ct-color-value`, `--ct-color-label`, `--ct-color-progress-track`, `--ct-color-progress-fill`
- **Typography:** `--ct-font-display`, `--ct-font-label`, `--ct-font-subtitle`, `--ct-size-timer`, `--ct-size-title`, `--ct-size-subtitle`, `--ct-size-label`, `--ct-weight-{timer|title|subtitle|label}`, `--ct-tracking-{timer|title|subtitle|label}`, `--ct-case-{title|subtitle|label}`
- **Timer layout:** `--ct-timer-gap`, `--ct-timer-justify`, `--ct-unit-gap`, `--ct-unit-align`, `--ct-unit-min-width`, `--ct-label-display` (set `none` to hide labels)
- **Progress:** `--ct-progress-height`, `--ct-segment-height`, `--ct-segment-gap`, `--ct-effect-progress-glow`
- **Motion:** `--ct-motion-fast`, `--ct-motion-slow`
- **Effects:** any `--ct-effect-*` referenced from class strings (e.g. `shadow-[var(--ct-effect-card)]`)

## DOM hooks usable in `[&_…]` Tailwind selectors

`[data-slot='timer'|'timer-separator'|'event-title'|'progress'|...]`, `[data-source='title'|'subtitle']`, `[data-kind='bar'|'ring'|'segments']`, `[data-unit-block]`, `[data-value]`, `[data-label]`.

## Conventions to follow

- Drive every color / size / weight from a token; use Tailwind utilities only for structure, positioning, and decorative layers.
- Tie the root background to the palette via `bg-[color:var(--ct-color-bg)]`.
- Background layers are `type: 'background'`, `props.kind: 'gradient'`, positioned `absolute inset-0 -z-10` (or `-z-20` for stacked layers), with arbitrary-value Tailwind `[background-image:...]` for mesh/grid/grain.
- Prefer `color-mix(in oklab, var(--ct-color-accent), transparent N%)` over hard-coded tints.
- Mobile-first: put defaults in `base`, larger-screen overrides in `md` / `lg` keys on the same `Responsive` object (both for `tokens` and `classes.className`).
- Timer scaling lives in `tokens.size.timer` with an `md` override — not in className.
- `vars` on a slot is the right place for per-slot fine-tuning (gaps, weights, label color); global palette/sizes belong in `tokens`.
- Respect the visible safe-area and reduced-motion behavior already provided by `countdown.css` — do not override `position`, `inset`, or animation durations globally.

## Implementation checklist

1. Create `src/countdown/themes/<id>.ts` exporting a `CountdownTheme` named `<id>Theme` (camelCase).
2. Provide `base` tokens for at minimum: `color` (bg, fg, accent, muted, title), `font` (display, label), `size` (timer, title, label), `motion` (fast, slow). Add any `effect`s you reference from class strings.
3. Provide an `md` token override for the timer size (and anything else that should scale up).
4. Build the `layout` tree: root `group` → background layer(s) → content stack(s) with title, subtitle, timer, and (optionally) progress.
5. Register the theme in [src/countdown/themes/index.ts](../../src/countdown/themes/index.ts):
   - Import it and add to `themeRegistry`
   - Add a matching `themeSwatch` entry (a CSS gradient string that previews the vibe on the landing page)
6. Verify there are no TypeScript errors in the new file and in `index.ts`.

## Output

- The new theme file
- The updated `themes/index.ts`
- A one-paragraph summary of the design choices (palette, type, layout) so the user can iterate
