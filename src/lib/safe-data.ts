import { getPayload } from 'payload'
import config from '@/payload.config'
import { resolveCoverUrl } from '@/lib/resolve-cover-image'
import { extractPlainText } from '@/lib/lexical-text'

export interface FallbackPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string
  stars: number
  ratingsCount: number
  ratingAverage: number
  views: number
  coverImageUrl: string
  language: 'uz' | 'kaa'
  period?: {
    id: number
    title: string
  }
}

export interface FallbackPeriod {
  id: number
  title: string
  slug: string
  yearsLabel: string
  startYear?: number
  endYear?: number
  description?: string
  language: 'uz' | 'kaa'
}

// In-memory store for ratings during dev when Postgres is offline
const inMemoryRatings: Record<number, { stars: number; ratingsCount: number; ratingAverage: number }> = {}
const inMemoryViews: Record<number, number> = {}

export function recordFallbackRating(postId: number, rating: number) {
  const current = inMemoryRatings[postId] || { stars: 0, ratingsCount: 0, ratingAverage: 0 }
  const nextCount = current.ratingsCount + 1
  const nextStars = current.stars + rating
  const nextAvg = Math.round((nextStars / nextCount) * 10) / 10
  inMemoryRatings[postId] = {
    stars: nextStars,
    ratingsCount: nextCount,
    ratingAverage: nextAvg,
  }
  return inMemoryRatings[postId]
}

export function recordFallbackView(postId: number): number {
  inMemoryViews[postId] = (inMemoryViews[postId] || 0) + 1
  return inMemoryViews[postId]
}

import {
  INTERACTIVE_CHAPTERS_UZ,
  INTERACTIVE_CHAPTERS_KAA,
  type InteractiveChapter,
} from '@/data/interactive-history-data'

export function getInteractiveChapters(locale: string = 'uz'): InteractiveChapter[] {
  return locale === 'kaa' ? INTERACTIVE_CHAPTERS_KAA : INTERACTIVE_CHAPTERS_UZ
}

export function getInteractiveChapterBySlug(slug: string, locale: string = 'uz'): InteractiveChapter | undefined {
  const list = getInteractiveChapters(locale)
  return list.find((ch) => ch.slug === slug)
}

function chapterToFallbackPost(ch: InteractiveChapter, locale: 'uz' | 'kaa'): FallbackPost {
  const fullContent = [
    ch.summary,
    ...ch.sections.map((s) => `### ${s.title}\n\n${s.content}${s.keyNote ? `\n\n> **Eslatma:** ${s.keyNote}` : ''}`),
    '### Tarixiy Hujjatlar va Iqtiboslar',
    ...ch.quotes.map((q) => `> "${q.text}"\n> — **${q.author}** (${q.role}), *${q.source}*`),
  ].join('\n\n')

  return {
    id: ch.number,
    title: ch.title,
    slug: ch.slug,
    excerpt: ch.excerpt,
    content: fullContent,
    publishedAt: new Date(1920 + ch.number * 4, 0, 1).toISOString(),
    stars: 5,
    ratingsCount: 1,
    ratingAverage: 5,
    views: 120 * ch.number,
    coverImageUrl: ch.coverImage,
    language: locale,
    period: {
      id: ch.number,
      title: ch.period,
    },
  }
}

const FALLBACK_POSTS_UZ: FallbackPost[] = INTERACTIVE_CHAPTERS_UZ.map((ch) =>
  chapterToFallbackPost(ch, 'uz'),
)

const FALLBACK_POSTS_KAA: FallbackPost[] = INTERACTIVE_CHAPTERS_KAA.map((ch) =>
  chapterToFallbackPost(ch, 'kaa'),
)


const FALLBACK_PERIODS_UZ: FallbackPeriod[] = [
  {
    id: 1,
    title: '1924-yilgi chegaralanish davri',
    slug: '1924-chegaralanish',
    yearsLabel: '1924 — 1925-yillar',
    startYear: 1924,
    endYear: 1925,
    description: 'Oʻzbekiston SSR va Qoraqalpogʻiston Muxtor Viloyatining tashkil topishi va davlatchilik poydevori.',
    language: 'uz',
  },
  {
    id: 2,
    title: 'Chegaralanishgacha boʻlgan zamin davri',
    slug: 'chegaralanishgacha-zamin',
    yearsLabel: '1917 — 1924-yillar',
    startYear: 1917,
    endYear: 1924,
    description: 'Turkiston ASSR, Buxoro XSR va Xorazm XSR davridagi maʼmuriy holat.',
    language: 'uz',
  },
  {
    id: 3,
    title: 'Samarqand va Toʻrtkoʻl poytaxtlik davri',
    slug: 'samarqand-tortkol-davri',
    yearsLabel: '1925 — 1930-yillar',
    startYear: 1925,
    endYear: 1930,
    description: 'Dastlabki poytaxtlar faoliyati, madaniy va maʼrifiy yuksalish bosqichi.',
    language: 'uz',
  },
  {
    id: 4,
    title: 'Yaxlitlik va mustahkamlanish davri',
    slug: 'mustahkamlanish-davri',
    yearsLabel: '1930 — 1936-yillar',
    startYear: 1930,
    endYear: 1936,
    description: 'Poytaxtning Toshkentga koʻchishi va Qoraqalpogʻistonning Oʻzbekiston tarkibiga kirishi.',
    language: 'uz',
  },
]

const FALLBACK_PERIODS_KAA: FallbackPeriod[] = [
  {
    id: 1,
    title: '1924-jılǵı shegaralanıw dáwiri',
    slug: '1924-chegaralanish',
    yearsLabel: '1924 — 1925-jıllar',
    startYear: 1924,
    endYear: 1925,
    description: 'Ózbekstan SSR hám Qaraqalpaqstan Avtonomiyalı Wálayatınıń dúziliwi hám mámleketshilik tiykarı.',
    language: 'kaa',
  },
  {
    id: 2,
    title: 'Shegaralanıwǵa shekemgi negiz dáwiri',
    slug: 'chegaralanishgacha-zamin',
    yearsLabel: '1917 — 1924-jıllar',
    startYear: 1917,
    endYear: 1924,
    description: 'Túrkstan ASSR, Buxara XSR hám Xorezm XSR dáwirindegi basqarıw jaǵdayı.',
    language: 'kaa',
  },
  {
    id: 3,
    title: 'Samarqand hám Tórtkúl paytaxtlıq dáwiri',
    slug: 'samarqand-tortkol-davri',
    yearsLabel: '1925 — 1930-jıllar',
    startYear: 1925,
    endYear: 1930,
    description: 'Dáslepki paytaxtlar iskerligi, mádeniyat hám bilimlendiriw basqıshı.',
    language: 'kaa',
  },
  {
    id: 4,
    title: 'Birlik hám bekkemlew dáwiri',
    slug: 'mustahkamlanish-davri',
    yearsLabel: '1930 — 1936-jıllar',
    startYear: 1930,
    endYear: 1936,
    description: 'Paytaxttıń Tashkentke kóshiwi hám Qaraqalpaqstannıń Ózbekstan quramına kiriwi.',
    language: 'kaa',
  },
]

// Safe Payload accessor
export async function getSafePayload() {
  try {
    return await getPayload({ config })
  } catch (_err) {
    // Expected when Postgres is not running locally
    return null
  }
}

// Get posts safely (merging DB posts if available, fallback otherwise)
export async function getSafePosts(locale: string = 'uz', sortField: string = '-stars'): Promise<FallbackPost[]> {
  const isKaa = locale === 'kaa'
  const targetLang = isKaa ? 'kaa' : 'uz'
  const fallbackList = isKaa ? FALLBACK_POSTS_KAA : FALLBACK_POSTS_UZ

  try {
    const payload = await getSafePayload()
    if (payload) {
      const { docs } = await payload.find({
        collection: 'posts',
        locale: locale as 'uz' | 'kaa',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { slug: { not_equals: 'bosh-sahifa-izohlari' } },
            {
              or: [
                { language: { equals: targetLang } },
                { language: { equals: 'both' } },
                { language: { exists: false } },
              ],
            },
          ],
        },
        limit: 100,
        sort: sortField,
        depth: 1,
        overrideAccess: true,
      })

      if (docs && docs.length > 0) {
        // Double-check strict language match in memory:
        // 'both' appears in both, 'uz' only in 'uz', 'kaa' only in 'kaa'
        const filteredDocs = docs.filter((doc) => {
          const l = (doc as { language?: string }).language
          return !l || l === 'both' || l === targetLang
        })

        if (filteredDocs.length > 0) {
          return filteredDocs.map((doc) => {
            const starsVal = (doc.stars as number) || 0
            const countVal = (doc.ratingsCount as number) || 0
            const avgVal = (doc.ratingAverage as number) || 0
            const coverImg = resolveCoverUrl(doc.coverImage, doc.coverImageUrl)

            return {
              id: doc.id,
              title: doc.title ?? '',
              slug: doc.slug ?? '',
              excerpt: doc.excerpt || '',
              content: doc.content || extractPlainText(doc.body) || '',
              publishedAt: doc.publishedAt || new Date().toISOString(),
              stars: starsVal,
              ratingsCount: countVal,
              ratingAverage: avgVal,
              views: (doc.views as number) || 0,
              coverImageUrl: coverImg,
              language: (doc.language as 'uz' | 'kaa') || (isKaa ? 'kaa' : 'uz'),
              period:
                typeof doc.period === 'object' && doc.period && 'title' in doc.period
                  ? { id: (doc.period as { id: number }).id, title: String(doc.period.title) }
                  : undefined,
            }
          })
        }
      }
    }
  } catch {
    // Postgres unreachable, use fallbacks
  }

  // Merge in-memory updated ratings & views if any
  const merged = fallbackList.map((post) => {
    const mem = inMemoryRatings[post.id]
    const currentViews = inMemoryViews[post.id] ?? post.views ?? 0
    if (mem) {
      return {
        ...post,
        stars: mem.stars,
        ratingsCount: mem.ratingsCount,
        ratingAverage: mem.ratingAverage,
        views: currentViews,
      }
    }
    return {
      ...post,
      views: currentViews,
    }
  })

  if (sortField === '-stars') {
    return [...merged].sort((a, b) => (b.stars || 0) - (a.stars || 0))
  }
  return merged
}

// Get single post safely
export async function getSafePostBySlug(slug: string, locale: string = 'uz'): Promise<FallbackPost | null> {
  const isKaa = locale === 'kaa'
  const targetLang = isKaa ? 'kaa' : 'uz'

  try {
    const payload = await getSafePayload()
    if (payload) {
      const { docs } = await payload.find({
        collection: 'posts',
        locale: locale as 'uz' | 'kaa',
        where: {
          and: [
            { slug: { equals: slug } },
            { _status: { equals: 'published' } },
            {
              or: [
                { language: { equals: targetLang } },
                { language: { equals: 'both' } },
                { language: { exists: false } },
              ],
            },
          ],
        },
        limit: 1,
        depth: 1,
        overrideAccess: true,
      })

      if (docs && docs[0]) {
        const doc = docs[0]
        const coverImg = resolveCoverUrl(doc.coverImage, doc.coverImageUrl)
        return {
          id: doc.id,
          title: doc.title ?? '',
          slug: doc.slug ?? '',
          excerpt: doc.excerpt || '',
          content: doc.content || extractPlainText(doc.body) || '',
          publishedAt: doc.publishedAt || new Date().toISOString(),
          stars: (doc.stars as number) || 0,
          ratingsCount: (doc.ratingsCount as number) || 0,
          ratingAverage: (doc.ratingAverage as number) || 0,
          views: (doc.views as number) || 0,
          coverImageUrl: coverImg,
          language: (doc.language as 'uz' | 'kaa') || (isKaa ? 'kaa' : 'uz'),
          period:
            typeof doc.period === 'object' && doc.period && 'title' in doc.period
              ? { id: (doc.period as { id: number }).id, title: String(doc.period.title) }
              : undefined,
        }
      }
    }
  } catch {
    // DB unreachable, check fallback
  }

  // Fallback to in-memory list
  const fallbackList = isKaa ? FALLBACK_POSTS_KAA : FALLBACK_POSTS_UZ
  const found = fallbackList.find((p) => p.slug === slug)
  if (!found) return null

  const mem = inMemoryRatings[found.id]
  const currentViews = inMemoryViews[found.id] ?? found.views ?? 0
  if (mem) {
    return {
      ...found,
      stars: mem.stars,
      ratingsCount: mem.ratingsCount,
      ratingAverage: mem.ratingAverage,
      views: currentViews,
    }
  }
  return {
    ...found,
    views: currentViews,
  }
}

// Get periods safely
export async function getSafePeriods(locale: string = 'uz'): Promise<FallbackPeriod[]> {
  const isKaa = locale === 'kaa'
  const fallbackList = isKaa ? FALLBACK_PERIODS_KAA : FALLBACK_PERIODS_UZ

  try {
    const payload = await getSafePayload()
    if (payload) {
      const { docs } = await payload.find({
        collection: 'periods',
        locale: locale as 'uz' | 'kaa',
        sort: 'order',
        overrideAccess: true,
      })
      if (docs && docs.length > 0) {
        return docs.map((d) => ({
          id: d.id,
          title: d.title,
          slug: d.slug ?? '',
          yearsLabel: d.yearsLabel || '',
          startYear: d.startYear as number,
          endYear: d.endYear as number,
          description: d.description || '',
          language: (d.language as 'uz' | 'kaa') || (isKaa ? 'kaa' : 'uz'),
        }))
      }
    }
  } catch {
    // Fallback
  }

  return fallbackList
}

export { FALLBACK_POSTS_UZ as SAFE_POSTS_UZ, FALLBACK_PERIODS_UZ as SAFE_PERIODS_UZ }
