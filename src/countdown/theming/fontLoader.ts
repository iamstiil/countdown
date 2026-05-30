import type { FontDecl } from './types'

/**
 * Build a Google Fonts CSS2 URL for a single family. We use one URL per
 * family rather than batching so that a typo or 404 in one family does
 * not invalidate the whole sheet.
 *
 *     https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap
 */
export function buildGoogleFontHref(decl: FontDecl): string {
  const family = decl.family.replace(/\s+/g, '+')
  const weights =
    decl.weights && decl.weights.length > 0
      ? `:wght@${[...decl.weights].sort((a, b) => a - b).join(';')}`
      : ''
  return `https://fonts.googleapis.com/css2?family=${family}${weights}&display=swap`
}

interface InjectedTag {
  el: HTMLElement
  refs: number
}

const injected = new Map<string, InjectedTag>()

/**
 * Idempotently inject a `<link>` into `<head>`. Multiple themes can
 * declare the same Google family without duplicating the stylesheet.
 * Returns a disposer that decrements the refcount and removes the tag
 * when the last consumer disposes.
 */
function injectLink(key: string, attrs: Record<string, string>): () => void {
  const existing = injected.get(key)
  if (existing) {
    existing.refs += 1
    return () => releaseLink(key)
  }
  const el = document.createElement('link')
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  document.head.appendChild(el)
  injected.set(key, { el, refs: 1 })
  return () => releaseLink(key)
}

function releaseLink(key: string) {
  const entry = injected.get(key)
  if (!entry) return
  entry.refs -= 1
  if (entry.refs <= 0) {
    entry.el.remove()
    injected.delete(key)
  }
}

/**
 * Inject `<link>` tags for the declared fonts. Returns a disposer that
 * removes (refcount-aware) every tag the call inserted.
 */
export function loadFonts(fonts: ReadonlyArray<FontDecl>): () => void {
  if (typeof document === 'undefined' || fonts.length === 0) {
    return () => {}
  }

  const disposers: Array<() => void> = []
  const googleFamilies = fonts.filter((f) => f.source === 'google')

  if (googleFamilies.length > 0) {
    disposers.push(
      injectLink('ct-font-preconnect-1', {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      }),
      injectLink('ct-font-preconnect-2', {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: '',
      }),
    )
  }

  for (const font of fonts) {
    if (font.source === 'google') {
      const href = buildGoogleFontHref(font)
      disposers.push(injectLink(href, { rel: 'stylesheet', href }))
    } else if (font.source === 'self' && font.href) {
      disposers.push(
        injectLink(font.href, { rel: 'stylesheet', href: font.href }),
      )
    }
  }

  return () => {
    for (const d of disposers) d()
  }
}

/**
 * Resolve once all declared families are loaded. Falls back to a single
 * `document.fonts.ready` await when `Promise.all` on individual `load()`
 * calls is unavailable (older jsdom).
 */
export async function waitForFonts(
  fonts: ReadonlyArray<FontDecl>,
): Promise<void> {
  if (typeof document === 'undefined') return
  const f = (document as Document & { fonts?: FontFaceSet }).fonts
  if (!f) return
  try {
    if (fonts.length === 0) {
      await f.ready
      return
    }
    await Promise.all(
      fonts.map(async (decl) => {
        try {
          // Default to 1em sample so the check works even if the family
          // hasn't been requested by any rendered element yet.
          await f.load(`1em "${decl.family}"`)
        } catch {
          /* family failed to load — fall through to f.ready */
        }
      }),
    )
    await f.ready
  } catch {
    /* fonts API is best-effort */
  }
}
