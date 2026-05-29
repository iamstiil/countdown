import { memo } from 'react'

import { CountdownDataProvider } from './data/CountdownDataContext'
import { DEFAULT_THEME_ID, themeRegistry } from './themes'
import type { ThemeId } from './themes'
import { CountdownThemeProvider } from './theming/CountdownThemeProvider'

import './countdown.css'

export interface CountdownPageProps {
  targetDate: Date
  title?: string
  subtitle?: string
  /** Theme id (typically sourced from URL search params). */
  initialThemeId?: ThemeId
}

/**
 * Top-level countdown page: owns time data and renders the chosen theme.
 * Theme is selected at countdown-creation time and read from search params —
 * there is no in-page theme picker.
 */
const CountdownPage = memo(function CountdownPage({
  targetDate,
  title = 'Countdown',
  subtitle,
  initialThemeId,
}: CountdownPageProps) {
  const theme = themeRegistry[initialThemeId ?? DEFAULT_THEME_ID]

  return (
    <CountdownDataProvider
      targetDate={targetDate}
      title={title}
      subtitle={subtitle}
    >
      <CountdownThemeProvider theme={theme} />
    </CountdownDataProvider>
  )
})

export default CountdownPage
