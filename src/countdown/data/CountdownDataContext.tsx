import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export interface Remaining {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export interface CountdownData {
  /** Original target. */
  targetDate: Date
  /** Optional reference start used by progress indicators. */
  startDate: Date
  title: string
  subtitle?: string
  remaining: Remaining
  /** 0..1 elapsed fraction (clamped). */
  elapsedFraction: number
  isDone: boolean
}

const computeRemaining = (target: Date): Remaining => {
  const total = Math.max(0, target.getTime() - Date.now())
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / 1000 / 60 / 60) % 24)
  const days = Math.floor(total / 1000 / 60 / 60 / 24)
  return { total, days, hours, minutes, seconds }
}

const CountdownDataContext = createContext<CountdownData | null>(null)

export interface CountdownDataProviderProps {
  targetDate: Date
  startDate?: Date
  title: string
  subtitle?: string
  children: ReactNode
}

export function CountdownDataProvider({
  targetDate,
  startDate,
  title,
  subtitle,
  children,
}: CountdownDataProviderProps) {
  const [remaining, setRemaining] = useState<Remaining>(() =>
    computeRemaining(targetDate),
  )

  useEffect(() => {
    setRemaining(computeRemaining(targetDate))
    const id = window.setInterval(() => {
      setRemaining(computeRemaining(targetDate))
    }, 1000)
    return () => window.clearInterval(id)
  }, [targetDate])

  const value = useMemo<CountdownData>(() => {
    const effectiveStart =
      startDate ?? new Date(targetDate.getTime() - 24 * 60 * 60 * 1000)
    const span = Math.max(1, targetDate.getTime() - effectiveStart.getTime())
    const elapsed =
      targetDate.getTime() - effectiveStart.getTime() - remaining.total
    const elapsedFraction = Math.min(1, Math.max(0, elapsed / span))
    return {
      targetDate,
      startDate: effectiveStart,
      title,
      subtitle,
      remaining,
      elapsedFraction,
      isDone: remaining.total === 0,
    }
  }, [targetDate, startDate, title, subtitle, remaining])

  return (
    <CountdownDataContext.Provider value={value}>
      {children}
    </CountdownDataContext.Provider>
  )
}

export function useCountdownData(): CountdownData {
  const ctx = useContext(CountdownDataContext)
  if (!ctx) {
    throw new Error(
      'useCountdownData must be used inside <CountdownDataProvider>',
    )
  }
  return ctx
}
