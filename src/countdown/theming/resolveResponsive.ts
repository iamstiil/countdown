import type { Breakpoint, Responsive } from './types'

const ORDER: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl']

/**
 * Pick the value for the closest defined breakpoint <= current.
 * Mobile-first cascade: base -> sm -> md -> lg -> xl.
 */
export function resolveResponsive<T>(
  value: Responsive<T> | undefined,
  current: Breakpoint,
  fallback: T,
): T {
  if (!value) return fallback
  const currentIdx = ORDER.indexOf(current)
  for (let i = currentIdx; i >= 0; i -= 1) {
    const bp = ORDER[i]
    const v = (value as Partial<Record<Breakpoint, T>>)[bp]
    if (v !== undefined) return v
  }
  return fallback
}
