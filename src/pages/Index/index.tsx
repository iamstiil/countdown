import React, { memo, useMemo } from 'react'

import { CountdownPage } from '../../countdown'
import { indexRoute } from '../../router'

import LandingPage from './LandingPage'

const Index: React.FC = memo(() => {
  const { date, title, theme } = indexRoute.useSearch()

  const targetDate = useMemo(() => {
    if (!date) return null
    const parsed = new Date(date)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }, [date])

  if (!targetDate) {
    return <LandingPage />
  }

  return (
    <CountdownPage
      targetDate={targetDate}
      title={title}
      initialThemeId={theme}
    />
  )
})
Index.displayName = 'Index'

export default Index
