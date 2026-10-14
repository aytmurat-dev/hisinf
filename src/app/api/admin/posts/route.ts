import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'
import { slugify } from '@/lib/slugify'
import { textToLexical } from '@/lib/text-to-lexical'
import type { Where } from 'payload'

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const payload = await getPayloadClient()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)

  const where: Where = {}
  if (q) {
    where.or = [
      { title: { like: q } },
      { slug: { like: q } },
    ]
  }

  const result = await payload.find({
    collection: 'posts',
    where,
    page,
    limit,
    sort: '-createdAt',
    depth: 1,
    overrideAccess: true,
  })

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    const body = await req.json()
    const {
      title,
      content = '',
      excerpt = '',
      coverImageUrl,
      coverImageId,
      language = 'both',
      status = 'published',
    } = body

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Post mavzusi (sarlavhasi) kiritilishi shart' },
        { status: 400 },
      )
    }

    const trimmedTitle = title.trim()
    const baseSlug = slugify(trimmedTitle) || `post-${Date.now()}`
    let uniqueSlug = baseSlug

    // Check if slug exists
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: uniqueSlug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`
    }

    const lexicalBody = textToLexical(content)
    const isPublished = status === 'published'

    const postData = {
      title: trimmedTitle,
      slug: uniqueSlug,
      content,
      body: lexicalBody,
      excerpt: excerpt.trim() || trimmedTitle.slice(0, 160),
      language: (language || 'both') as 'both' | 'uz' | 'kaa',
      author: admin.id,
      workflowStatus: isPublished ? ('published' as const) : ('draft' as const),
      _status: isPublished ? ('published' as const) : ('draft' as const),
      publishedAt: isPublished ? new Date().toISOString() : null,
      ...(coverImageId ? { coverImage: coverImageId } : {}),
      ...(coverImageUrl ? { coverImageUrl } : {}),
    }

    const created = isPublished
      ? await payload.create({
          collection: 'posts',
          data: postData,
          overrideAccess: true,
          draft: false,
        })
      : await payload.create({
          collection: 'posts',
          data: postData,
          overrideAccess: true,
          draft: true,
        })

    return NextResponse.json({ success: true, doc: created })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Post yaratishda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
