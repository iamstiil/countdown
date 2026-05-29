import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CountdownDataProvider } from '../data/CountdownDataContext'

import { Timer } from './Timer'

const future = () => new Date(Date.now() + 60 * 60 * 1000)

function renderTimer(props: Parameters<typeof Timer>[0]['props']) {
  return render(
    <CountdownDataProvider targetDate={future()} title="Test">
      <Timer id="t" props={props} />
    </CountdownDataProvider>,
  )
}

describe('Timer — splitDigits', () => {
  it('renders a single text node when splitDigits is false', () => {
    const { container } = renderTimer({ format: 'hms', padZeros: true })
    const minutesValue = container.querySelector(
      '[data-unit-block="minutes"] [data-value]',
    )
    expect(minutesValue).not.toBeNull()
    // No per-digit spans when not enabled.
    expect(container.querySelectorAll('[data-digit]').length).toBe(0)
  })

  it('renders each character as a [data-digit] when splitDigits is true', () => {
    const { container } = renderTimer({
      format: 'hms',
      padZeros: true,
      splitDigits: true,
    })
    const minutesValue = container.querySelector(
      '[data-unit-block="minutes"] [data-value]',
    )
    expect(minutesValue).not.toBeNull()
    const digits = minutesValue!.querySelectorAll('[data-digit]')
    // padded "00".."59" → always 2 chars for non-days.
    expect(digits.length).toBe(2)
    // Rightmost digit is index 0 / place "ones".
    expect(digits[1]!.getAttribute('data-index')).toBe('0')
    expect(digits[1]!.getAttribute('data-place')).toBe('ones')
    expect(digits[0]!.getAttribute('data-index')).toBe('1')
    expect(digits[0]!.getAttribute('data-place')).toBe('tens')
    // data-char mirrors the rendered character.
    expect(digits[0]!.getAttribute('data-char')).toMatch(/^\d$/)
  })

  it('propagates the chosen transition to [data-value]', () => {
    const { container } = renderTimer({
      format: 'hms',
      padZeros: true,
      splitDigits: true,
      transition: 'split-flap',
    })
    const values = container.querySelectorAll('[data-value]')
    expect(values.length).toBeGreaterThan(0)
    values.forEach((v) => {
      expect(v.getAttribute('data-transition')).toBe('split-flap')
    })
  })
})
