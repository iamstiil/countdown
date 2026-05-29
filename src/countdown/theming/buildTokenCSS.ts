import type { Breakpoint, CountdownTheme, PartialTokens } from './types'

const BP_REM: Record<Exclude<Breakpoint, 'base'>, string> = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
}

const flatten = (tokens: PartialTokens | undefined): string => {
  if (!tokens) return ''
  const decls: string[] = []
  for (const [group, entries] of Object.entries(tokens)) {
    if (!entries) continue
    for (const [key, value] of Object.entries(entries)) {
      decls.push(`--ct-${group}-${key}:${value};`)
    }
  }
  return decls.join('')
}

/**
 * Emits all theme tokens as scoped CSS variables under [data-ct-theme="id"].
 * Mobile-first: base declared at the root, breakpoint layers wrap @media.
 */
export function buildTokenCSS(theme: CountdownTheme): string {
  const selector = `[data-ct-theme="${theme.id}"]`
  let css = `${selector}{${flatten(theme.tokens.base)}}`
  ;(['sm', 'md', 'lg', 'xl'] as const).forEach((bp) => {
    const layer = theme.tokens[bp]
    const body = flatten(layer)
    if (!body) return
    css += `@media (min-width:${BP_REM[bp]}){${selector}{${body}}}`
  })
  return css
}
