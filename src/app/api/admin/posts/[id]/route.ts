import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'
import { textToLexical } from '@/lib/text-to-lexical'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin(req)
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
      draft: true,
      overrideAccess: true,
    })
    return NextResponse.json(post, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    })
  } catch {
    return NextResponse.json({ error: 'Post topilmadi' }, { status: 404 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin(req)
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
        typeof coverImageUrl === 'string' && coverImageUrl.trim().length > 0
          ? coverImageUrl.trim()
          : null
      updateData.coverImageUrl = safeUrl
    }
    if (language) {
      updateData.language = language
    }

    const isPublished = status !== 'draft'
    updateData.workflowStatus = isPublished ? 'published' : 'draft'
    updateData._status = isPublished ? 'published' : 'draft'
    if (isPublished) {
      updateData.publishedAt = new Date().toISOString()
    }

    // 1. Update uz locale (main doc) with proper draft flag
    const updated = await payload.update({
      collection: 'posts',
      id: postId,
      locale: 'uz',
      data: updateData,
      draft: !isPublished,
      overrideAccess: true,
      context: {
        skipSyncLocales: true,
      },
    })

    // 2. Fast SQL sync for kaa locale if post is 'both' or 'kaa'
    const postLang =
      language ||
      (updated && typeof updated === 'object' && 'language' in updated
        ? (updated as { language?: string }).language
        : 'both')

    if (postLang !== 'uz' && process.env.DATABASE_URI) {
      try {
        const { Pool } = await import('pg')
        const pool = new Pool({
          connectionString: process.env.DATABASE_URI,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 4000,
        })
        const safeBody = updateData.body ? JSON.stringify(updateData.body) : null
        await pool.query(
          `INSERT INTO posts_locales (_parent_id, _locale, title, excerpt, content, body)
           VALUES ($1, 'kaa', $2, $3, $4, $5)
           ON CONFLICT (_locale, _parent_id)
           DO UPDATE SET
             title = COALESCE(EXCLUDED.title, posts_locales.title),
             excerpt = COALESCE(EXCLUDED.excerpt, posts_locales.excerpt),
             content = COALESCE(EXCLUDED.content, posts_locales.content),
             body = COALESCE(EXCLUDED.body, posts_locales.body)`,
          [postId, updateData.title || null, updateData.excerpt || null, updateData.content || null, safeBody],
        )
      } catch (kaaErr) {
        console.warn('Fast kaa sync warning:', kaaErr)
      }
    }

    try {
      const { revalidatePath, revalidateTag } = await import('next/cache')
      revalidatePath('/[locale]', 'page')
      revalidatePath('/[locale]/maqolalar', 'page')
      revalidateTag('posts')
      const docSlug = (updated as { slug?: string })?.slug
      if (docSlug) {
        revalidatePath(`/[locale]/maqolalar/${docSlug}`, 'page')
        revalidateTag(`post-${docSlug}`)
      }
    } catch {
      // non-blocking
    }

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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const { id } = await params
  const postId = parseInt(id, 10)
  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Notoʻgʻri ID' }, { status: 400 })
  }

  try {
    // 1. Direct cascade delete in Neon Postgres ensures references in home_page, comments, daily_stats, readers_rels, etc. are cleanly removed
    if (process.env.DATABASE_URI) {
      const { Pool } = await import('pg')
      const pool = new Pool({
        connectionString: process.env.DATABASE_URI,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
      })
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        // Clean foreign key relations pointing to posts(id)
        await client.query('UPDATE home_page SET featured_post_id = NULL WHERE featured_post_id = $1', [postId])
        await client.query('DELETE FROM home_page_rels WHERE posts_id = $1', [postId])
        await client.query('DELETE FROM header_rels WHERE posts_id = $1', [postId])
        await client.query('DELETE FROM footer_rels WHERE posts_id = $1', [postId])
        await client.query('DELETE FROM comments WHERE post_id = $1', [postId])
        await client.query('DELETE FROM daily_stats WHERE post_id = $1', [postId])
        await client.query('DELETE FROM readers_rels WHERE posts_id = $1', [postId])
        await client.query('DELETE FROM payload_locked_documents_rels WHERE posts_id = $1', [postId])
        await client.query('DELETE FROM posts_rels WHERE parent_id = $1', [postId])
        await client.query('DELETE FROM _posts_v_locales WHERE _parent_id IN (SELECT id FROM _posts_v WHERE parent_id = $1)', [postId])
        await client.query('DELETE FROM _posts_v WHERE parent_id = $1', [postId])
        await client.query('DELETE FROM posts_locales WHERE _parent_id = $1', [postId])
        await client.query('DELETE FROM posts WHERE id = $1', [postId])
        await client.query('COMMIT')
      } catch (dbErr) {
        await client.query('ROLLBACK')
        throw dbErr
      } finally {
        client.release()
        await pool.end()
      }
    } else {
      const payload = await getPayloadClient()
      await payload.delete({
        collection: 'posts',
        id: postId,
        overrideAccess: true,
      })
    }

    try {
      const { revalidatePath } = await import('next/cache')
      revalidatePath('/[locale]', 'page')
      revalidatePath('/[locale]/maqolalar', 'page')
    } catch {
      // non-blocking
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('*** POST DELETE ERROR ***', err)
    const message = err instanceof Error ? err.message : 'Oʻchirishda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
