import { Link } from '@tanstack/react-router'
import React, { memo, useMemo, useState } from 'react'

import { DEFAULT_THEME_ID, themeList } from '../../countdown'
import type { ThemeId } from '../../countdown'

import styles from './LandingPage.module.css'

// Returns a value suitable for <input type="datetime-local"> representing
// the user's local time (rounded to the next hour by default).
const defaultLocalDateTime = (): string => {
  const d = new Date()
  d.setHours(d.getHours() + 1, 0, 0, 0)
  const tz = d.getTimezoneOffset()
  const local = new Date(d.getTime() - tz * 60_000)
  return local.toISOString().slice(0, 16)
}

const LandingPage: React.FC = memo(() => {
  const [localDate, setLocalDate] = useState<string>(defaultLocalDateTime)
  const [title, setTitle] = useState<string>('')
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME_ID)

  const target = useMemo(() => {
    if (!localDate) return null
    const parsed = new Date(localDate)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }, [localDate])

  const isValid = target !== null && target.getTime() > Date.now()

  const search = useMemo(() => {
    if (!target) return undefined
    return {
      date: target.toISOString(),
      ...(title.trim() ? { title: title.trim() } : {}),
      theme,
    }
  }, [target, title, theme])

  const shareUrl = useMemo(() => {
    if (!isValid || !search) return ''
    const params = new URLSearchParams()
    params.set('date', search.date)
    if (search.title) params.set('title', search.title)
    if (search.theme) params.set('theme', search.theme)
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  }, [isValid, search])

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>New countdown</span>
          <h1 className={styles.title}>Create a countdown</h1>
          <p className={styles.lead}>
            Set a date, pick a theme, and share the link with anyone.
          </p>
        </header>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <label className={styles.field}>
            <span className={styles.label}>Title (optional)</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Product launch"
              className={styles.input}
              maxLength={120}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Target date &amp; time</span>
            <input
              type="datetime-local"
              value={localDate}
              onChange={(e) => setLocalDate(e.target.value)}
              className={styles.input}
              required
            />
          </label>

          <div className={styles.field}>
            <span className={styles.label}>Theme</span>
            <div
              className={styles.themeGrid}
              role="radiogroup"
              aria-label="Countdown theme"
            >
              {themeList.map((t) => {
                const selected = t.id === theme
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-pressed={selected}
                    onClick={() => setTheme(t.id)}
                    className={styles.themeOption}
                  >
                    <span
                      className={styles.themeSwatch}
                      style={
                        {
                          '--swatch': t.swatch,
                        } as React.CSSProperties
                      }
                      aria-hidden="true"
                    />
                    <span className={styles.themeName}>{t.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {target && !isValid && (
            <p className={styles.error}>Please pick a date in the future.</p>
          )}
        </form>

        {isValid && search && (
          <div className={styles.actions}>
            <Link to="/" search={search} className={styles.primary}>
              Start countdown
            </Link>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => {
                if (shareUrl) void navigator.clipboard?.writeText(shareUrl)
              }}
            >
              Copy share link
            </button>
          </div>
        )}

        {isValid && shareUrl && <code className={styles.url}>{shareUrl}</code>}
      </div>
    </div>
  )
})
LandingPage.displayName = 'LandingPage'

export default LandingPage
