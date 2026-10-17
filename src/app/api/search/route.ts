import { NextRequest, NextResponse } from 'next/server'
import { normalizeSearch } from '@/lib/normalize-search'
import { getSafePosts, type FallbackPost } from '@/lib/safe-data'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim() || ''
    const locale = (searchParams.get('locale') || 'uz') as 'uz' | 'kaa'

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const normalizedQuery = normalizeSearch(q)

    // Retrieve posts safely (DB + in-memory 1924 fallback)
    const allPosts = await getSafePosts(locale, '-stars')

    const results = []

    for (const post of allPosts) {
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
    return NextResponse.json({ results: [], query: '' })
  }
}
