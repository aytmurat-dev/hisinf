import { describe, it, expect } from 'vitest'
import { resolveCoverUrl, DEFAULT_COVER } from '@/lib/resolve-cover-image'

describe('resolveCoverUrl', () => {
  it('returns DEFAULT_COVER when inputs are null or undefined', () => {
    expect(resolveCoverUrl(null, null)).toBe(DEFAULT_COVER)
    expect(resolveCoverUrl(undefined, undefined)).toBe(DEFAULT_COVER)
    expect(resolveCoverUrl('', null)).toBe(DEFAULT_COVER)
    expect(resolveCoverUrl()).toBe(DEFAULT_COVER)
  })

  it('prioritizes uploaded coverImage over coverImageUrl regardless of argument order', () => {
    const uploadedMedia = { id: 10, url: '/api/media/file/cheetah.webp' }
    const externalUrl = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'

    // Order 1: (coverImage, coverImageUrl)
    expect(resolveCoverUrl(uploadedMedia, externalUrl)).toBe('/api/media/file/cheetah.webp')

    // Order 2: (coverImageUrl, coverImage)
    expect(resolveCoverUrl(externalUrl, uploadedMedia)).toBe('/api/media/file/cheetah.webp')

    // Order 3: single object { coverImage, coverImageUrl }
    expect(resolveCoverUrl({ coverImage: uploadedMedia, coverImageUrl: externalUrl })).toBe(
      '/api/media/file/cheetah.webp',
    )
  })

  it('falls back to coverImageUrl when coverImage is not set or has no url', () => {
    const externalUrl = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'

    expect(resolveCoverUrl(null, externalUrl)).toBe(externalUrl)
    expect(resolveCoverUrl(undefined, externalUrl)).toBe(externalUrl)
    expect(resolveCoverUrl({ id: 5 }, externalUrl)).toBe(externalUrl)
    expect(resolveCoverUrl({ id: 5, url: '' }, externalUrl)).toBe(externalUrl)
    expect(resolveCoverUrl(externalUrl)).toBe(externalUrl)
  })

  it('cleans up localhost:3000 from URLs', () => {
    const localMedia = { id: 1, url: 'http://localhost:3000/api/media/file/sample.jpg' }
    expect(resolveCoverUrl(localMedia)).toBe('/api/media/file/sample.jpg')

    const localText = 'http://localhost:3000/placeholder.jpg'
    expect(resolveCoverUrl(null, localText)).toBe('/placeholder.jpg')
  })

  it('preserves data URLs and relative paths', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ'
    expect(resolveCoverUrl(null, dataUrl)).toBe(dataUrl)

    const relativePath = '/images/history.jpg'
    expect(resolveCoverUrl(null, relativePath)).toBe(relativePath)
  })
})
