import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'
import { slugify } from '@/lib/slugify'
import { textToLexical } from '@/lib/text-to-lexical'
import type { Where } from 'payload'

import { SAFE_POSTS_UZ, type FallbackPost } from '@/lib/safe-data'

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)

  try {
    const payload = await getPayloadClient()
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

    if (result && result.docs && result.docs.length > 0) {
      return NextResponse.json(result)
    }
  } catch (_err) {
    // Database offline fallback
  }

  const filtered = q
    ? SAFE_POSTS_UZ.filter((p: FallbackPost) => p.title.toLowerCase().includes(q.toLowerCase()))
    : SAFE_POSTS_UZ

  return NextResponse.json({
    docs: filtered.map((p: FallbackPost) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      coverImageUrl: p.coverImageUrl,
      workflowStatus: 'published',
      _status: 'published',
      publishedAt: p.publishedAt,
      createdAt: p.publishedAt || '2024-10-27T00:00:00.000Z',
    })),
    totalDocs: filtered.length,
    limit,
    page,
    totalPages: Math.ceil(filtered.length / limit) || 1,
  })
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

    // Check if slug exists (both published and drafts)
    try {
      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: uniqueSlug } },
        limit: 1,
        draft: true,
        overrideAccess: true,
      })
      if (existing.docs.length > 0) {
        uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`
      }
    } catch {
      uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`
    }

    // Verify author exists in DB to prevent foreign key violation
    let authorId: number | null = null
    try {
      if (admin?.id) {
        const u = await payload.findByID({ collection: 'users', id: admin.id, overrideAccess: true })
        if (u) authorId = admin.id
      }
    } catch {
      try {
        const anyUser = await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
        if (anyUser.docs[0]) authorId = anyUser.docs[0].id
      } catch {
        authorId = null
      }
    }

    // Verify coverImage exists in DB to prevent foreign key violation
    let validCoverImageId: number | null = null
    if (coverImageId && typeof coverImageId === 'number') {
      try {
        const m = await payload.findByID({ collection: 'media', id: coverImageId, overrideAccess: true })
        if (m) validCoverImageId = coverImageId
      } catch {
        validCoverImageId = null
      }
    }

    const lexicalBody = textToLexical(content)
    const isPublished = status === 'published'

    const safeCoverImageUrl =
      typeof coverImageUrl === 'string' && coverImageUrl.trim().length > 0
        ? coverImageUrl.trim()
        : null

    const postData = {
      title: trimmedTitle,
      slug: uniqueSlug,
      content,
      body: lexicalBody,
      excerpt: excerpt.trim() || trimmedTitle.slice(0, 160),
      language: (language || 'both') as 'both' | 'uz' | 'kaa',
      author: authorId,
      workflowStatus: isPublished ? ('published' as const) : ('draft' as const),
      _status: isPublished ? ('published' as const) : ('draft' as const),
      publishedAt: isPublished ? new Date().toISOString() : null,
      coverImage: validCoverImageId,
      coverImageUrl: safeCoverImageUrl,
    }

    const created = isPublished
      ? await payload.create({
          collection: 'posts',
          locale: 'uz',
          data: postData,
          overrideAccess: true,
          draft: false,
        })
      : await payload.create({
          collection: 'posts',
          locale: 'uz',
          data: postData,
          overrideAccess: true,
          draft: true,
        })

    // Also populate kaa locale if post is both or kaa
    if (language !== 'uz' && created?.id) {
      try {
        await payload.update({
          collection: 'posts',
          id: created.id,
          locale: 'kaa',
          data: {
            title: trimmedTitle,
            content,
            body: lexicalBody,
            excerpt: excerpt.trim() || trimmedTitle.slice(0, 160),
          },
          overrideAccess: true,
        })
      } catch (kaaErr) {
        console.warn('Sync kaa locale on create warning:', kaaErr)
      }
    }

    return NextResponse.json({ success: true, doc: created })
  } catch (err: unknown) {
    console.error('*** POST CREATE ERROR DETAILED ***', err)
    let friendlyMessage = 'Post yaratishda xatolik yuz berdi. Iltimos, qaytadan urinib koʻring.'
    if (err instanceof Error) {
      if (err.message.includes('unique constraint') || err.message.includes('slug')) {
        friendlyMessage = 'Bunday sarlavhali post allaqachon mavjud. Sarlavhani biroz oʻzgartiring.'
      } else if (err.message.includes('foreign key') || err.message.includes('_fk')) {
        friendlyMessage = 'Rasm yoki muallif maʼlumotini tekshirib qayta urinib koʻring.'
      } else if (!err.message.includes('Failed query') && !err.message.includes('insert into')) {
        friendlyMessage = err.message
      }
    }
    return NextResponse.json({ error: friendlyMessage }, { status: 500 })
  }
}
