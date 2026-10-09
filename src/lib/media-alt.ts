export function getAlt(media: unknown, locale = 'uz'): string {
  if (!media || typeof media !== 'object') return ''

  const m = media as {
    altText?: string | Record<string, string> | null
    alt?: string | null
  }

  if (m.altText) {
    if (typeof m.altText === 'string') return m.altText
    if (typeof m.altText === 'object') {
      return m.altText[locale] || m.altText.uz || Object.values(m.altText)[0] || ''
    }
  }

  if (m.alt && typeof m.alt === 'string') {
    return m.alt
  }

  return ''
}
