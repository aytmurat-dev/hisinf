import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { slugify } from '@/lib/slugify'
import { normalizeSearch } from '@/lib/normalize-search'
import { isCurrentReaderAdmin } from '@/lib/current-reader'

export async function POST(req: NextRequest) {
  if (!(await isCurrentReaderAdmin())) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const title = (formData.get('title') as string) || ''
    const content = (formData.get('content') as string) || ''
    const excerpt = (formData.get('excerpt') as string) || ''
    const titleKaa = (formData.get('titleKaa') as string) || ''
    const contentKaa = (formData.get('contentKaa') as string) || ''
    const excerptKaa = (formData.get('excerptKaa') as string) || ''
    const coverImageUrl = (formData.get('coverImageUrl') as string) || ''
    const rawMediaId = formData.get('mediaId') as string | null
    const language = ((formData.get('language') as string) || 'both') as 'both' | 'uz' | 'kaa'
    const imageFile = formData.get('imageFile') as File | null

    const primaryContent = language === 'kaa' && contentKaa ? contentKaa : content
    const primaryTitle = language === 'kaa' && titleKaa ? titleKaa : title

    if (!primaryContent.trim()) {
      return NextResponse.json(
        { error: 'Post haqida (matn) maydoni toʻldirilishi majburiy!' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    let mediaId: number | undefined = rawMediaId ? Number(rawMediaId) : undefined

    // Agar qurilmadan rasm yuklangan bo'lsa
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const uploadedMedia = await payload.create({
        collection: 'media',
        data: {
          alt: primaryTitle || 'Post muqova rasmi',
        },
        file: {
          data: buffer,
          name: imageFile.name,
          mimetype: imageFile.type,
          size: imageFile.size,
        },
        overrideAccess: true,
      })
      mediaId = uploadedMedia.id
    }

    const baseTitle = primaryTitle || title || titleKaa || 'Yangi post'
    const slug = slugify(baseTitle) || `post-${Date.now()}`
    const searchText = normalizeSearch(`${primaryTitle} ${excerpt} ${primaryContent}`)

    const adminUsers = await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
    const authorId = adminUsers.docs[0]?.id || 1

    // 1. Asosiy postni yaratamiz (baza uchun locale: 'uz')
    const post = await payload.create({
      collection: 'posts',
      locale: 'uz',
      data: {
        title: (language === 'kaa' && !title ? titleKaa : title).trim(),
        slug,
        author: authorId,
        workflowStatus: 'published',
        content: (language === 'kaa' && !content ? contentKaa : content).trim(),
        excerpt: (language === 'kaa' && !excerpt ? excerptKaa : excerpt).trim(),
        language,
        coverImage: mediaId,
        coverImageUrl: coverImageUrl.trim() || undefined,
        publishedAt: new Date().toISOString(),
        commentsEnabled: true,
        searchText,
      },
      overrideAccess: true,
    })

    // 2. Agar post 'kaa' yoki 'both' bo'lsa, qoraqalpoqcha lokalini ham yangilaymiz
    if (language === 'both' || language === 'kaa') {
      const kaaTitle = (titleKaa || title).trim()
      const kaaContent = (contentKaa || content).trim()
      const kaaExcerpt = (excerptKaa || excerpt).trim()
      const kaaSearchText = normalizeSearch(`${kaaTitle} ${kaaExcerpt} ${kaaContent}`)

      await payload.update({
        collection: 'posts',
        id: post.id,
        locale: 'kaa',
        data: {
          title: kaaTitle,
          content: kaaContent,
          excerpt: kaaExcerpt,
          searchText: kaaSearchText,
        },
        overrideAccess: true,
      })
    }

    try {
      revalidatePath('/', 'layout')
    } catch (_revalidateErr) {
      // ignore
    }

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        slug: post.slug,
      },
    })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json(
      { error: 'Post yaratishda xatolik yuz berdi' },
      { status: 500 },
    )
  }
}
