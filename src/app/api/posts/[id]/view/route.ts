import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { recordFallbackView } from '@/lib/safe-data'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const postId = parseInt(id, 10)

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Notoʻgʻri post ID' }, { status: 400 })
    }

    let newViews = 1

    try {
      const payload = await getPayloadClient()
      const post = await payload.findByID({
        collection: 'posts',
        id: postId,
        overrideAccess: true,
      })

      if (post) {
        const currentViews = typeof post.views === 'number' ? post.views : 0
        newViews = currentViews + 1
        await payload.update({
          collection: 'posts',
          id: postId,
          data: {
            views: newViews,
          },
          overrideAccess: true,
        })
      } else {
        newViews = recordFallbackView(postId)
      }
    } catch {
      newViews = recordFallbackView(postId)
    }

    return NextResponse.json({ success: true, views: newViews })
  } catch (error) {
    console.error('View tracking error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
