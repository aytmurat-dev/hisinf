import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { isCurrentReaderAdmin } from '@/lib/reader-auth'

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await isCurrentReaderAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const locale = (searchParams.get('locale') || 'uz') as 'uz' | 'kaa'

    const payload = await getPayload({ config })
    const { docs: posts } = await payload.find({
      collection: 'posts',
      locale,
      sort: '-createdAt',
      limit: 100,
      overrideAccess: true,
    })

    const formattedPosts = posts.map((p) => {
      let coverImage = p.coverImageUrl || ''
      if (!coverImage && p.coverImage && typeof p.coverImage === 'object' && 'url' in p.coverImage) {
        coverImage = p.coverImage.url || ''
      }
      return {
        id: p.id,
        title: p.title || 'Mavzusiz post',
        slug: p.slug,
        excerpt: p.excerpt || '',
        content: p.content,
        coverImageUrl: coverImage,
        createdAt: p.createdAt,
      }
    })

    return NextResponse.json({ posts: formattedPosts })
  } catch (error) {
    console.error('Admin posts fetch error:', error)
    return NextResponse.json({ error: 'Postlarni olishda xatolik' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await isCurrentReaderAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const body = await req.json()
    const { action, id, title, content, excerpt, coverImageUrl, locale = 'uz' } = body

    const payload = await getPayload({ config })

    if (action === 'delete') {
      if (!id) {
        return NextResponse.json({ error: 'ID kiritilmadi' }, { status: 400 })
      }
      // Delete associated comments first to respect foreign key constraint
      await payload.delete({
        collection: 'comments',
        where: { post: { equals: Number(id) } },
        overrideAccess: true,
      })
      await payload.delete({
        collection: 'posts',
        id: Number(id),
        overrideAccess: true,
      })
      return NextResponse.json({ success: true, message: 'Post muvaffaqiyatli oʻchirildi' })
    }

    if (action === 'update') {
      if (!id) {
        return NextResponse.json({ error: 'ID kiritilmadi' }, { status: 400 })
      }
      if (!content || !content.trim()) {
        return NextResponse.json({ error: 'Post matni boʻsh boʻlmasligi kerak' }, { status: 400 })
      }

      const updateData: Record<string, unknown> = {
        content: content.trim(),
        title: title ? title.trim() : '',
        excerpt: excerpt ? excerpt.trim() : '',
        coverImageUrl: coverImageUrl ? coverImageUrl.trim() : '',
      }

      const updated = await payload.update({
        collection: 'posts',
        id: Number(id),
        locale: locale as 'uz' | 'kaa',
        data: updateData,
        overrideAccess: true,
      })

      return NextResponse.json({
        success: true,
        post: {
          id: updated.id,
          title: updated.title,
          slug: updated.slug,
          excerpt: updated.excerpt,
          content: updated.content,
          coverImageUrl: updated.coverImageUrl,
        },
      })
    }

    return NextResponse.json({ error: 'Nomaʼlum amal' }, { status: 400 })
  } catch (error) {
    console.error('Admin posts action error:', error)
    return NextResponse.json({ error: 'Amal bajarishda xatolik' }, { status: 500 })
  }
}
