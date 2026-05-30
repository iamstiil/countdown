import type { CSSProperties } from 'react'

import { resolveAssetUrl } from '../theming/assets'
import { useThemeAssets } from '../theming/ThemeAssetsContext'
import type { SlotComponentProps } from '../theming/types'

export function Background({
  id,
  className,
  style,
  props,
}: SlotComponentProps<'background'>) {
  const kind = props?.kind ?? 'gradient'
  const assets = useThemeAssets()
  const resolvedSrc = resolveAssetUrl(props?.src, assets ?? undefined)
  // CSS doesn't yet auto-prefix mask in every engine we care about, so we
  // set both `mask` and `WebkitMask` when the theme opts in.
  const maskStyle: CSSProperties | undefined = props?.mask
    ? { maskImage: props.mask, WebkitMaskImage: props.mask }
    : undefined

  if (kind === 'image' && resolvedSrc) {
    return (
      <div
        data-slot="background"
        data-slot-id={id}
        data-kind="image"
        className={className}
        style={{
          backgroundImage: `url(${resolvedSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...maskStyle,
          ...style,
        }}
        aria-hidden="true"
      />
    )
  }

  if (kind === 'video' && resolvedSrc) {
    return (
      <video
        data-slot="background"
        data-slot-id={id}
        data-kind="video"
        className={className}
        style={{ ...maskStyle, ...style }}
        src={resolvedSrc}
        autoPlay
        muted
        playsInline
        loop={props?.loop ?? true}
        aria-hidden="true"
      />
    )
  }

  // gradient & canvas (canvas left as a hook for future named effects)
  return (
    <div
      data-slot="background"
      data-slot-id={id}
      data-kind={kind}
      className={className}
      style={{ ...maskStyle, ...style }}
      aria-hidden="true"
    />
  )
}
