import type { Media } from '@/payload-types'

export const DEFAULT_COVER = '/placeholder.jpg'

export type MediaLike =
  | Media
  | { id?: number | null; url?: string | null }
  | number
  | null
  | undefined

function sanitizeUrl(rawUrl?: string | null): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null
  const trimmed = rawUrl.trim()
  if (!trimmed) return null

  if (trimmed.startsWith('data:image/')) {
    return trimmed
  }
  // Raw base64 check
  if (/^[A-Za-z0-9+/=]{60,}$/.test(trimmed.slice(0, 100))) {
    return `data:image/jpeg;base64,${trimmed}`
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (trimmed.includes('localhost:3000')) {
      return trimmed.replace(/^https?:\/\/localhost:3000/, '')
    }
    return trimmed
  }
  if (trimmed.startsWith('/')) {
    return trimmed
  }
  return null
}

/**
 * Resolves the cover image URL for a post.
 *
 * Rules:
 * 1. Uploaded `coverImage` (Payload Media relationship) ALWAYS takes priority over external `coverImageUrl`.
 * 2. If `coverImage` is absent or has no valid URL, fallback to `coverImageUrl`.
 * 3. If neither is valid, fallback to `DEFAULT_COVER` (`/placeholder.jpg`).
 *
 * Can be called flexibly as:
 * - resolveCoverUrl(coverImage, coverImageUrl)
 * - resolveCoverUrl(coverImageUrl, coverImage)
 * - resolveCoverUrl({ coverImage, coverImageUrl })
 */
export function resolveCoverUrl(
  arg1?: MediaLike | string | { coverImage?: MediaLike | string; coverImageUrl?: string | null },
  arg2?: MediaLike | string,
): string {
  let mediaObj: { url?: string | null } | null = null
  let textUrl: string | null = null

  // Support single object parameter: { coverImage, coverImageUrl }
  if (
    arg1 &&
    typeof arg1 === 'object' &&
    ('coverImage' in arg1 || 'coverImageUrl' in arg1)
  ) {
    const postObj = arg1 as { coverImage?: MediaLike | string; coverImageUrl?: string | null }
    return resolveCoverUrl(postObj.coverImage, postObj.coverImageUrl)
  }

  // Inspect arg1
  if (arg1 && typeof arg1 === 'object' && 'url' in arg1 && typeof arg1.url === 'string') {
    mediaObj = arg1 as { url?: string | null }
  } else if (typeof arg1 === 'string' && arg1.trim().length > 0) {
    textUrl = arg1.trim()
  }

  // Inspect arg2
  if (arg2 && typeof arg2 === 'object' && 'url' in arg2 && typeof arg2.url === 'string') {
    mediaObj = arg2 as { url?: string | null }
  } else if (typeof arg2 === 'string' && arg2.trim().length > 0) {
    if (!textUrl) {
      textUrl = arg2.trim()
    }
  }

  // 1. Primary: Uploaded Media object URL always takes precedence
  if (mediaObj && mediaObj.url) {
    const sanitizedMedia = sanitizeUrl(mediaObj.url)
    if (sanitizedMedia) {
      return sanitizedMedia
    }
  }

  // 2. Secondary: external URL string
  if (textUrl) {
    const sanitizedText = sanitizeUrl(textUrl)
    if (sanitizedText) {
      return sanitizedText
    }
  }

  return DEFAULT_COVER
}
