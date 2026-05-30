import { useRef, useState } from 'react'

import { resolveAssetUrl } from '../theming/assets'
import { useThemeAssets } from '../theming/ThemeAssetsContext'
import type { SlotComponentProps } from '../theming/types'
import { useSlotTrigger } from '../theming/useSlotTrigger'

/**
 * `sprite` slot — renders a frame from a horizontal sprite-sheet strip and
 * animates `background-position-x` in `steps(frames)` so the apparent motion
 * is exactly `frames / fps` per loop iteration.
 *
 * Playback is gated by `playOn`: `'mount'` plays once on mount; `'loop'`
 * lets CSS loop forever; a named bus event restarts the animation by
 * bumping a generation key (re-mounts the inner div so the CSS animation
 * restarts cleanly).
 */
export function Sprite({
  id,
  className,
  style,
  props,
}: SlotComponentProps<'sprite'>) {
  const [gen, setGen] = useState(0)
  const mountedRef = useRef(false)
  const playOn = props?.playOn ?? 'mount'
  const assets = useThemeAssets()

  useSlotTrigger(playOn, () => {
    // Skip the implicit first-mount fire — initial render already shows gen=0.
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    setGen((g) => g + 1)
  }, [])

  if (!props) return null
  const {
    src,
    frameWidth,
    frameHeight,
    frames,
    fps = 8,
    loop = false,
    pixelated = false,
    label,
  } = props
  const resolvedSrc = resolveAssetUrl(src, assets ?? undefined)

  const durationMs = (frames / Math.max(1, fps)) * 1000
  const stripWidth = frameWidth * frames

  return (
    <div
      data-slot="sprite"
      data-sprite-id={id}
      role={label ? 'img' : undefined}
      aria-label={label}
      className={className}
      style={{
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        ...style,
      }}
    >
      <div
        key={gen}
        data-sprite-frame
        style={
          {
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            backgroundImage: `url(${resolvedSrc})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${stripWidth}px ${frameHeight}px`,
            imageRendering: pixelated ? 'pixelated' : undefined,
            animationName: 'ct-sprite-strip',
            animationDuration: `${durationMs}ms`,
            animationTimingFunction: `steps(${frames}, end)`,
            animationIterationCount: loop || playOn === 'loop' ? 'infinite' : 1,
            animationFillMode: 'forwards',
            // Shared @keyframes in countdown.css uses this var as the end translation.
            '--ct-sprite-strip-end': `${-stripWidth}px`,
          } as React.CSSProperties
        }
      />
    </div>
  )
}
