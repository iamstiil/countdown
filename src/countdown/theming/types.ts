import type { ComponentType, CSSProperties, ReactNode } from 'react'

export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl'

export type SlotType =
  | 'timer'
  | 'timer-separator'
  | 'timer-label'
  | 'event-title'
  | 'progress'
  | 'background'
  | 'group'

export interface SlotBehaviorMap {
  timer: {
    format?: 'dhms' | 'hms' | 'ms'
    padZeros?: boolean
    /** Which unit to render. If omitted, renders the full grid. */
    unit?: 'days' | 'hours' | 'minutes' | 'seconds'
  }
  'timer-separator': { char?: string }
  'timer-label': {
    unit: 'days' | 'hours' | 'minutes' | 'seconds'
    text?: string
  }
  'event-title': { source?: 'title' | 'subtitle' }
  progress: {
    kind?: 'bar' | 'ring' | 'segments'
    direction?: 'elapsed' | 'remaining'
  }
  background: {
    kind?: 'image' | 'video' | 'gradient' | 'canvas'
    src?: string
    loop?: boolean
  }
  group: Record<string, never>
}

/** Mobile-first responsive value: `base` required, overrides optional. */
export type Responsive<T> = { base: T } & Partial<
  Record<Exclude<Breakpoint, 'base'>, T>
>

export interface SlotClasses {
  className?: Responsive<string>
}

export interface SlotNode<K extends SlotType = SlotType> {
  id: string
  type: K
  visible?: Responsive<boolean>
  /** Per-slot CSS variable overrides applied as inline style on the slot root. */
  vars?: Responsive<Record<string, string>>
  classes?: SlotClasses
  children?: SlotNode[]
  props?: SlotBehaviorMap[K]
}

export interface TokenSet {
  color: Record<string, string>
  space: Record<string, string>
  font: Record<string, string>
  size: Record<string, string>
  motion: Record<string, string>
  effect: Record<string, string>
}

export type PartialTokens = Partial<{
  [K in keyof TokenSet]: Partial<TokenSet[K]>
}>

export interface CountdownTheme {
  id: string
  name: string
  tokens: Responsive<PartialTokens>
  layout: SlotNode<'group'>
  /** Optional keyframes/animation rules injected as a <style> block. */
  animations?: Record<string, string>
}

export interface SlotComponentProps<K extends SlotType = SlotType> {
  id: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
  props?: SlotBehaviorMap[K]
}

export type SlotComponent<K extends SlotType = SlotType> = ComponentType<
  SlotComponentProps<K>
>
