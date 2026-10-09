import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { normalizeSearch } from '@/lib/normalize-search'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim() || ''
    const locale = (searchParams.get('locale') || 'uz') as 'uz' | 'kaa'

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const payload = await getPayload({ config })
    const normalizedQuery = normalizeSearch(q)

    const targetLanguage = locale === 'kaa' ? 'kaa' : 'uz'

    // Fetch published posts
    const { docs: posts } = await payload.find({
      collection: 'posts',
      locale,
      limit: 30,
      where: {
        and: [
          { slug: { not_equals: 'bosh-sahifa-izohlari' } },
          {
            or: [
              { language: { equals: targetLanguage } },
              { language: { equals: 'both' } },
              { language: { exists: false } },
            ],
          },
        ],
      },
      overrideAccess: true,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        coverImageUrl: true,
        coverImage: true,
        publishedAt: true,
      },
    })

    const results = []

    for (const post of posts) {
      const title = (post.title || '').trim()
      const content = (post.content || '').trim()
      const excerpt = (post.excerpt || '').trim()

      const fullText = `${title}\n${excerpt}\n${content}`
      const normalizedFullText = normalizeSearch(fullText)

      if (!normalizedFullText.includes(normalizedQuery)) {
        continue
      }

      // Find the best matching line / sentence
      const lines = fullText.split(/[\n.!?]+/).map((l) => l.trim()).filter(Boolean)
      let bestSnippet = ''

      for (const line of lines) {
        if (normalizeSearch(line).includes(normalizedQuery)) {
          bestSnippet = line
          break
        }
      }

      if (!bestSnippet) {
        bestSnippet = excerpt || content.slice(0, 160)
      }

      // Truncate if too long
      if (bestSnippet.length > 180) {
        const queryIndex = normalizeSearch(bestSnippet).indexOf(normalizedQuery)
        const start = Math.max(0, queryIndex - 40)
        bestSnippet = (start > 0 ? '... ' : '') + bestSnippet.slice(start, start + 160) + ' ...'
      }

      results.push({
        id: post.id,
        title: title || (locale === 'kaa' ? 'Atamasız jazba' : 'Nomsiz maqola'),
        slug: post.slug,
        snippet: bestSnippet,
        coverImageUrl: post.coverImageUrl || null,
        publishedAt: post.publishedAt,
      })
    }

    return NextResponse.json({ results, query: q })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Qidiruvda xatolik yuz berdi' }, { status: 500 })
  }
}
