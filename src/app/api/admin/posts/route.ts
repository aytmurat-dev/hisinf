import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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

    const formattedPosts = await Promise.all(
      posts.map(async (p) => {
        let coverImage = p.coverImageUrl || ''
        if (!coverImage && p.coverImage && typeof p.coverImage === 'object' && 'url' in p.coverImage) {
          coverImage = p.coverImage.url || ''
        }

        const postData = p as unknown as { language?: 'both' | 'uz' | 'kaa' }
        const language = postData.language || 'both'

        let titleKaa = ''
        let contentKaa = ''
        let excerptKaa = ''

        // Agar har ikkala til bo'lsa, kaa versiyasini ham olamiz
        if (language === 'both' || language === 'kaa') {
          try {
            const kaaDoc = await payload.findByID({
              collection: 'posts',
              id: p.id,
              locale: 'kaa',
              overrideAccess: true,
            })
            if (kaaDoc) {
              titleKaa = kaaDoc.title || ''
              contentKaa = kaaDoc.content || ''
              excerptKaa = kaaDoc.excerpt || ''
            }
          } catch (_e) {
            // ignore
          }
        }

        return {
          id: p.id,
          title: p.title || 'Mavzusiz post',
          slug: p.slug,
          excerpt: p.excerpt || '',
          content: p.content,
          language,
          titleKaa,
          contentKaa,
          excerptKaa,
          coverImageUrl: coverImage,
          createdAt: p.createdAt,
        }
      }),
    )

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

    const contentType = req.headers.get('content-type') || ''
    let action = ''
    let id: number | null = null
    let title = ''
    let content = ''
    let excerpt = ''
    let titleKaa = ''
    let contentKaa = ''
    let excerptKaa = ''
    let coverImageUrl = ''
    let language: 'both' | 'uz' | 'kaa' = 'both'
    let imageFile: File | null = null
    let rawMediaId: string | null = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      action = (formData.get('action') as string) || ''
      id = formData.get('id') ? Number(formData.get('id')) : null
      title = (formData.get('title') as string) || ''
      content = (formData.get('content') as string) || ''
      excerpt = (formData.get('excerpt') as string) || ''
      titleKaa = (formData.get('titleKaa') as string) || ''
      contentKaa = (formData.get('contentKaa') as string) || ''
      excerptKaa = (formData.get('excerptKaa') as string) || ''
      coverImageUrl = (formData.get('coverImageUrl') as string) || ''
      language = ((formData.get('language') as string) || 'both') as 'both' | 'uz' | 'kaa'
      imageFile = formData.get('imageFile') as File | null
      rawMediaId = formData.get('mediaId') as string | null
    } else {
      const body = await req.json()
      action = body.action || ''
      id = body.id ? Number(body.id) : null
      title = body.title || ''
      content = body.content || ''
      excerpt = body.excerpt || ''
      titleKaa = body.titleKaa || ''
      contentKaa = body.contentKaa || ''
      excerptKaa = body.excerptKaa || ''
      coverImageUrl = body.coverImageUrl || ''
      language = (body.language || 'both') as 'both' | 'uz' | 'kaa'
      rawMediaId = body.mediaId ? String(body.mediaId) : null
    }

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
      try {
        revalidatePath('/', 'layout')
      } catch (_e) {}
      return NextResponse.json({ success: true, message: 'Post muvaffaqiyatli oʻchirildi' })
    }

    if (action === 'update') {
      if (!id) {
        return NextResponse.json({ error: 'ID kiritilmadi' }, { status: 400 })
      }

      const primaryContent = language === 'kaa' && contentKaa ? contentKaa : content
      if (!primaryContent || !primaryContent.trim()) {
        return NextResponse.json({ error: 'Post matni boʻsh boʻlmasligi kerak' }, { status: 400 })
      }

      let mediaId: number | undefined = rawMediaId ? Number(rawMediaId) : undefined

      // Agar kompyuterdan yangi rasm fayli yuklangan bo'lsa
      if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        const uploadedMedia = await payload.create({
          collection: 'media',
          data: {
            alt: title || titleKaa || 'Post muqova rasmi',
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

      const updateData: Record<string, unknown> = {
        content: (language === 'kaa' && !content ? contentKaa : content).trim(),
        title: (language === 'kaa' && !title ? titleKaa : title).trim(),
        excerpt: (language === 'kaa' && !excerpt ? excerptKaa : excerpt).trim(),
        language,
      }

      if (mediaId !== undefined) {
        updateData.coverImage = mediaId
        updateData.coverImageUrl = undefined
      } else if (coverImageUrl) {
        updateData.coverImageUrl = coverImageUrl.trim()
      }

      // Update in uz locale (primary)
      const updated = await payload.update({
        collection: 'posts',
        id: Number(id),
        locale: 'uz',
        data: updateData,
        overrideAccess: true,
      })

      // Update in kaa locale if applicable
      if (language === 'both' || language === 'kaa') {
        await payload.update({
          collection: 'posts',
          id: Number(id),
          locale: 'kaa',
          data: {
            title: (titleKaa || title).trim(),
            content: (contentKaa || content).trim(),
            excerpt: (excerptKaa || excerpt).trim(),
          },
          overrideAccess: true,
        })
      }

      try {
        revalidatePath('/', 'layout')
      } catch (_e) {}

      return NextResponse.json({
        success: true,
        post: {
          id: updated.id,
          title: updated.title,
          slug: updated.slug,
          excerpt: updated.excerpt,
          content: updated.content,
          language,
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
