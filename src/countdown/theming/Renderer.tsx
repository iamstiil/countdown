import { useMemo } from 'react'
import type { CSSProperties } from 'react'

import { GestureWrapper } from '../components/GestureWrapper'

import { slotRegistry } from './registry'
import { resolveResponsive } from './resolveResponsive'
import type { Breakpoint, SlotNode } from './types'
import { useBreakpoint } from './useBreakpoint'

const BP_ORDER: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl']

/**
 * className is additive across breakpoints — every defined breakpoint up to
 * (and including) the current one is concatenated. This lets themes declare
 * shared base classes once and only add breakpoint-specific modifiers at
 * higher tiers, without losing the base classes (which would happen with
 * full replacement semantics).
 */
function resolveClassName(
  value: Partial<Record<Breakpoint, string>> | undefined,
  current: Breakpoint,
): string | undefined {
  if (!value) return undefined
  const currentIdx = BP_ORDER.indexOf(current)
  const parts: string[] = []
  for (let i = 0; i <= currentIdx; i += 1) {
    const v = value[BP_ORDER[i]]
    if (v) parts.push(v)
  }
  const merged = parts.join(' ').trim()
  return merged.length > 0 ? merged : undefined
}

export interface SlotRendererProps {
  node: SlotNode
}

export function SlotRenderer({ node }: SlotRendererProps) {
  const bp = useBreakpoint()
  const visible = resolveResponsive(node.visible, bp, true)
  const className = resolveClassName(node.classes?.className, bp)
  const vars = resolveResponsive(node.vars, bp, {} as Record<string, string>)

  const style = useMemo<CSSProperties | undefined>(() => {
    const entries = Object.entries(vars)
    if (entries.length === 0) return undefined
    return Object.fromEntries(
      entries.map(([k, v]) => [k.startsWith('--') ? k : `--${k}`, v]),
    ) as CSSProperties
  }, [vars])

  if (!visible) return null

  const Component = slotRegistry[node.type]

  const children =
    (node.type === 'group' || node.type === 'chrome') && node.children
      ? node.children.map((child) => (
          <SlotRenderer key={child.id} node={child} />
        ))
      : undefined

  const rendered = (
    <Component
      id={node.id}
      className={className}
      style={style}
      props={node.props as any}
    >
      {children}
    </Component>
  )

  if (node.interactions) {
    return (
      <GestureWrapper interactions={node.interactions}>
        {rendered}
      </GestureWrapper>
    )
  }

  return rendered
}
