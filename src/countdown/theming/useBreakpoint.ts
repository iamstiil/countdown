import { useEffect, useState } from 'react'

import type { Breakpoint } from './types'

const BP_PX: Record<Exclude<Breakpoint, 'base'>, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}

const compute = (width: number): Breakpoint => {
  if (width >= BP_PX.xl) return 'xl'
  if (width >= BP_PX.lg) return 'lg'
  if (width >= BP_PX.md) return 'md'
  if (width >= BP_PX.sm) return 'sm'
  return 'base'
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    typeof window === 'undefined' ? 'base' : compute(window.innerWidth),
  )

  useEffect(() => {
    const onResize = () => setBp(compute(window.innerWidth))
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return bp
}
