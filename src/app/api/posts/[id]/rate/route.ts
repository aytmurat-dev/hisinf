import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const postId = parseInt(id, 10)

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Notoʻgʻri post ID' }, { status: 400 })
    }

    const body = await request.json().catch(() => ({}))
    const rating = Math.min(5, Math.max(1, parseInt(body.rating, 10) || 5))

    // Check rated posts cookie to prevent spam
    const ratedPostsCookie = request.cookies.get('hisinf_rated_posts')?.value || ''
    const ratedIds = ratedPostsCookie.split(',').filter(Boolean)

    if (ratedIds.includes(String(postId))) {
      return NextResponse.json(
        { error: 'Siz allaqachon bu maqolaga baho bergansiz', alreadyRated: true },
        { status: 409 },
      )
    }

    let newStars = 5
    let newCount = 1
    let newAverage = 5.0

    try {
      const payload = await getPayloadClient()
      const post = await payload.findByID({
        collection: 'posts',
        id: postId,
        overrideAccess: true,
      })

      if (post) {
        const currentStars = typeof post.stars === 'number' ? post.stars : 0
        const currentCount = typeof post.ratingsCount === 'number' ? post.ratingsCount : 0
        newCount = currentCount + 1
        newStars = currentStars + rating
        newAverage = Math.round((newStars / newCount) * 10) / 10

        await payload.update({
          collection: 'posts',
          id: postId,
          data: {
            stars: newStars,
            ratingsCount: newCount,
            ratingAverage: newAverage,
          },
          overrideAccess: true,
        })
      } else {
        const { recordFallbackRating } = await import('@/lib/safe-data')
        const fallbackRes = recordFallbackRating(postId, rating)
        newStars = fallbackRes.stars
        newCount = fallbackRes.ratingsCount
        newAverage = fallbackRes.ratingAverage
      }
    } catch {
      // In-memory fallback if Postgres is down
      const { recordFallbackRating } = await import('@/lib/safe-data')
      const fallbackRes = recordFallbackRating(postId, rating)
      newStars = fallbackRes.stars
      newCount = fallbackRes.ratingsCount
      newAverage = fallbackRes.ratingAverage
    }

    ratedIds.push(String(postId))

    const response = NextResponse.json({
      success: true,
      stars: newStars,
      ratingsCount: newCount,
      ratingAverage: newAverage,
      userRating: rating,
    })

    response.cookies.set('hisinf_rated_posts', ratedIds.join(','), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Rating error:', error)
    return NextResponse.json({ error: 'Serverda xatolik yuz berdi' }, { status: 500 })
  }
}

