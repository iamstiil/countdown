import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import { CountdownDataProvider } from '../data/CountdownDataContext'

import { Sprite } from './Sprite'

const wrap = (children: ReactNode) => {
  const target = new Date(Date.now() + 60 * 60 * 1000)
  return (
    <CountdownDataProvider targetDate={target} title="T">
      {children}
    </CountdownDataProvider>
  )
}

describe('Sprite', () => {
  it('renders with the correct dimensions and sprite-id', () => {
    const { container } = render(
      wrap(
        <Sprite
          id="hero"
          props={{
            src: '/x.png',
            frameWidth: 32,
            frameHeight: 32,
            frames: 8,
          }}
        />,
      ),
    )
    const root = container.querySelector('[data-slot="sprite"]')
    expect(root).not.toBeNull()
    expect(root!.getAttribute('data-sprite-id')).toBe('hero')
    const style = (root as HTMLElement).style
    expect(style.width).toBe('32px')
    expect(style.height).toBe('32px')
  })

  it('applies image-rendering: pixelated when requested', () => {
    const { container } = render(
      wrap(
        <Sprite
          id="px"
          props={{
            src: '/x.png',
            frameWidth: 16,
            frameHeight: 16,
            frames: 4,
            pixelated: true,
          }}
        />,
      ),
    )
    const frame = container.querySelector(
      '[data-sprite-frame]',
    ) as HTMLElement | null
    expect(frame).not.toBeNull()
    expect(frame!.style.imageRendering).toBe('pixelated')
  })

  it('exposes role=img + aria-label when label is provided', () => {
    const { container } = render(
      wrap(
        <Sprite
          id="mascot"
          props={{
            src: '/x.png',
            frameWidth: 16,
            frameHeight: 16,
            frames: 4,
            label: 'Mascot',
          }}
        />,
      ),
    )
    const root = container.querySelector(
      '[data-slot="sprite"]',
    ) as HTMLElement | null
    expect(root!.getAttribute('role')).toBe('img')
    expect(root!.getAttribute('aria-label')).toBe('Mascot')
  })
})
