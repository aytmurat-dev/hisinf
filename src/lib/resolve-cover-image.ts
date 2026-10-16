export const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop'

export function resolveCoverUrl(
  coverImageUrl?: string | null,
  coverImage?: { url?: string | null } | number | null,
): string {
  if (coverImageUrl && typeof coverImageUrl === 'string') {
    const trimmed = coverImageUrl.trim()
    if (trimmed.startsWith('data:image/')) {
      return trimmed
    }
    // Agar raw base64 bo'lsa (data: prefiksi qolib ketgan bo'lsa)
    if (/^[A-Za-z0-9+/=]{60,}$/.test(trimmed.slice(0, 100))) {
      return `data:image/jpeg;base64,${trimmed}`
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      // Agar localhost bo'lsa
      if (trimmed.includes('localhost:3000')) {
        return trimmed.replace(/^https?:\/\/localhost:3000/, '')
      }
      return trimmed
    }
    if (trimmed.startsWith('/')) {
      return trimmed
    }
  }

  if (typeof coverImage === 'object' && coverImage && coverImage.url) {
    const imgUrl = coverImage.url.trim()
    if (imgUrl.includes('localhost:3000')) {
      return imgUrl.replace(/^https?:\/\/localhost:3000/, '')
    }
    return imgUrl
  }

  return DEFAULT_COVER
}
