import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { slugify } from '@/lib/slugify'
import { normalizeSearch } from '@/lib/normalize-search'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const title = formData.get('title') as string || ''
    const content = formData.get('content') as string || ''
    const excerpt = formData.get('excerpt') as string || ''
    const coverImageUrl = formData.get('coverImageUrl') as string || ''
    const locale = (formData.get('locale') as string) || 'uz'
    const imageFile = formData.get('imageFile') as File | null

    if (!content.trim()) {
      return NextResponse.json(
        { error: 'Post haqida (matn) maydoni toʻldirilishi majburiy!' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    let mediaId: number | undefined = undefined

    // Agar qurilmadan rasm yuklangan bo'lsa
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const uploadedMedia = await payload.create({
        collection: 'media',
        data: {
          alt: title || 'Post muqova rasmi',
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

    const slug = slugify(title) || `post-${Date.now()}`
    const searchText = normalizeSearch(`${title} ${excerpt} ${content}`)

    const post = await payload.create({
      collection: 'posts',
      locale: locale as 'uz' | 'kaa',
      data: {
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt.trim(),
        coverImage: mediaId,
        coverImageUrl: coverImageUrl.trim() || undefined,
        publishedAt: new Date().toISOString(),
        commentsEnabled: true,
        searchText,
      },
      overrideAccess: true,
    })

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
