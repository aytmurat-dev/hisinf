import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { isCurrentReaderAdmin } from '@/lib/current-reader'

export async function GET() {
  try {
    const isAdmin = await isCurrentReaderAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const payload = await getPayload({ config })
    const { docs: comments } = await payload.find({
      collection: 'comments',
      sort: '-createdAt',
      limit: 100,
      overrideAccess: true,
    })

    const formattedComments = comments.map((c) => ({
      id: c.id,
      authorName: c.authorName,
      body: c.body,
      createdAt: c.createdAt,
      postId: typeof c.post === 'object' && c.post ? c.post.id : c.post,
      postTitle: typeof c.post === 'object' && c.post ? (c.post.title || 'Mavzusiz post') : 'Post',
    }))

    return NextResponse.json({ comments: formattedComments })
  } catch (error) {
    console.error('Admin comments fetch error:', error)
    return NextResponse.json({ error: 'Izohlarni olishda xatolik' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await isCurrentReaderAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'ID talab qilinadi' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    await payload.delete({
      collection: 'comments',
      id: Number(id),
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, message: 'Izoh oʻchirildi' })
  } catch (error) {
    console.error('Admin comment delete error:', error)
    return NextResponse.json({ error: 'Izohni oʻchirishda xatolik' }, { status: 500 })
  }
}
