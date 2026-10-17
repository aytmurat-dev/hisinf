import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'
import { textToLexical } from '@/lib/text-to-lexical'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const { id } = await params
  const postId = parseInt(id, 10)
  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Notoʻgʻri ID' }, { status: 400 })
  }

  const payload = await getPayloadClient()
  try {
    const post = await payload.findByID({
      collection: 'posts',
      id: postId,
      depth: 1,
      overrideAccess: true,
    })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Post topilmadi' }, { status: 404 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const { id } = await params
  const postId = parseInt(id, 10)
  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Notoʻgʻri ID' }, { status: 400 })
  }

  try {
    const payload = await getPayloadClient()
    const body = await req.json()
    const {
      title,
      content,
      excerpt,
      coverImageUrl,
      coverImageId,
      language,
      status,
    } = body

    const updateData: Record<string, unknown> = {}

    if (typeof title === 'string' && title.trim()) {
      updateData.title = title.trim()
    }
    if (typeof content === 'string') {
      updateData.content = content
      updateData.body = textToLexical(content)
    }
    if (typeof excerpt === 'string') {
      updateData.excerpt = excerpt.trim()
    }
    if (coverImageId !== undefined) {
      if (coverImageId && typeof coverImageId === 'number') {
        try {
          const m = await payload.findByID({ collection: 'media', id: coverImageId, overrideAccess: true })
          updateData.coverImage = m ? coverImageId : null
        } catch {
          updateData.coverImage = null
        }
      } else {
        updateData.coverImage = null
      }
    }
    if (coverImageUrl !== undefined) {
      const safeUrl =
        typeof coverImageUrl === 'string' &&
        !coverImageUrl.startsWith('data:') &&
        coverImageUrl.length < 500 &&
        coverImageUrl.trim().length > 0
          ? coverImageUrl.trim()
          : null
      updateData.coverImageUrl = safeUrl
    }
    if (language) {
      updateData.language = language
    }
    if (status) {
      const isPublished = status === 'published'
      updateData.workflowStatus = isPublished ? 'published' : 'draft'
      updateData._status = isPublished ? 'published' : 'draft'
      if (isPublished) {
        updateData.publishedAt = new Date().toISOString()
      }
    }

    const updated = await payload.update({
      collection: 'posts',
      id: postId,
      data: updateData,
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, doc: updated })
  } catch (err: unknown) {
    console.error('*** POST UPDATE ERROR DETAILED ***', err)
    let friendlyMessage = 'Tahrirlashda xatolik yuz berdi'
    if (err instanceof Error && !err.message.includes('Failed query') && !err.message.includes('update "posts"')) {
      friendlyMessage = err.message
    }
    return NextResponse.json({ error: friendlyMessage }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const { id } = await params
  const postId = parseInt(id, 10)
  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Notoʻgʻri ID' }, { status: 400 })
  }

  try {
    const payload = await getPayloadClient()
    await payload.delete({
      collection: 'posts',
      id: postId,
      overrideAccess: true,
    })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Oʻchirishda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
