/**
 * Built-in SVG filter / mask defs. Themes opt in via
 * `theme.defs.filters = ['ink-bleed', 'crt-warp']` and apply by
 * referencing the id as a CSS variable, e.g.
 *
 *     vars: { '--ct-filter-ink': 'url(#ct-ink-bleed)' }
 *
 * All ids are prefixed with `ct-` to avoid colliding with theme- or
 * app-level SVG defs that may share the page.
 *
 * Filter authors: keep these intentionally small. Heavy filters
 * (`feTurbulence`/`feDisplacementMap` chains) are CPU-bound on every
 * repaint of the filtered region — themes that opt in should also set
 * `will-change` and confine the filtered surface.
 */

export type BuiltInFilterId =
  | 'ink-bleed'
  | 'watercolor'
  | 'crt-warp'
  | 'chromatic-aberration'
  | 'paper-grain'

/**
 * Map of built-in filter id -> raw SVG markup for the `<filter>` (or
 * other defs node). Each string is concatenated into the shared
 * `<svg><defs>...</defs></svg>` injected by `CountdownThemeProvider`.
 */
export const builtInFilters: Record<BuiltInFilterId, string> = {
  // Soft ink halo: turbulence-perturbed displacement, blurred edges.
  // Useful for handwritten/inked typography and watercolor edges.
  'ink-bleed': `
    <filter id="ct-ink-bleed" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="disp" />
      <feGaussianBlur in="disp" stdDeviation="0.35" />
    </filter>`,

  // Watercolor wash: low-frequency turbulence + larger displacement +
  // soft alpha bleed. Heavier than ink-bleed; reserve for static text.
  watercolor: `
    <filter id="ct-watercolor" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" result="disp" />
      <feGaussianBlur in="disp" stdDeviation="0.6" result="soft" />
      <feComposite in="soft" in2="SourceAlpha" operator="in" />
    </filter>`,

  // CRT barrel warp: small radial displacement to fake curved glass.
  // Pair with a vignette mask for full Pocket-Arcade vibe.
  'crt-warp': `
    <filter id="ct-crt-warp" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.002 0.002" numOctaves="1" seed="1" result="warp" />
      <feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" />
    </filter>`,

  // Chromatic aberration: split RGB channels by ~1px and recombine.
  // Cheap, looks great over text.
  // Region is generous (x=-25% y=-100% w=150% h=300%) so that text-shadow
  // halos drawn on the source — common on glow/neon styling — survive the
  // SVG filter pipeline. SVG filters clip output to the filter region;
  // the default 10% margin (or this filter's older 2%) was cropping the
  // bloom flat at the top of glyphs.
  'chromatic-aberration': `
    <filter id="ct-chromatic-aberration" x="-25%" y="-100%" width="150%" height="300%" color-interpolation-filters="sRGB">
      <feOffset in="SourceGraphic" dx="-0.6" dy="0" result="r" />
      <feOffset in="SourceGraphic" dx="0.6" dy="0" result="b" />
      <feColorMatrix in="r" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rOnly" />
      <feColorMatrix in="b" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bOnly" />
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gOnly" />
      <feBlend in="rOnly" in2="gOnly" mode="screen" result="rg" />
      <feBlend in="rg" in2="bOnly" mode="screen" />
    </filter>`,

  // Paper grain overlay: fractal noise composited as a subtle texture.
  // Apply to backgrounds, not to small text.
  'paper-grain': `
    <filter id="ct-paper-grain" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" result="grain" />
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0.18 0" result="tint" />
      <feComposite in="tint" in2="SourceGraphic" operator="over" />
    </filter>`,
}

/**
 * Render-ready SVG markup for the provider's hidden defs container.
 * Concatenates requested built-ins with any raw markup the theme
 * provided. Stable id prefix `ct-` keeps these out of the way of app-
 * or theme-level SVG defs that may coexist on the page.
 */
export function buildDefsMarkup(
  filters: ReadonlyArray<BuiltInFilterId> = [],
  raw = '',
): string {
  // Dedupe (a theme might list the same filter twice across responsive
  // layers without realizing) and preserve first-seen order.
  const seen = new Set<BuiltInFilterId>()
  const ordered = filters.filter((id) => {
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
  return ordered.map((id) => builtInFilters[id]).join('') + raw
}
