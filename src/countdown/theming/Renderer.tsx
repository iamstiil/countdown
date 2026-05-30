import { useMemo } from 'react'
import type { CSSProperties } from 'react'

import { GestureWrapper } from '../components/GestureWrapper'

import { slotRegistry } from './registry'
import { resolveResponsive } from './resolveResponsive'
import type { SlotNode } from './types'
import { useBreakpoint } from './useBreakpoint'

export interface SlotRendererProps {
  node: SlotNode
}

export function SlotRenderer({ node }: SlotRendererProps) {
  const bp = useBreakpoint()
  const visible = resolveResponsive(node.visible, bp, true)
  const className =
    resolveResponsive(node.classes?.className, bp, '') || undefined
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
