import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { isCurrentReaderAdmin } from '@/lib/current-reader'

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await isCurrentReaderAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'Rasm fayli tanlanmadi' },
        { status: 400 },
      )
    }

    // Tekshirish: faqat rasm fayllari
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Faqat rasm formatidagi fayllar qabul qilinadi (JPG, PNG, WEBP va h.k.)' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })
    const buffer = Buffer.from(await file.arrayBuffer())

    const uploaded = await payload.create({
      collection: 'media',
      data: {
        alt: file.name.replace(/\.[^/.]+$/, '') || 'Post muqova rasmi',
      },
      file: {
        data: buffer,
        name: file.name,
        mimetype: file.type,
        size: file.size,
      },
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      mediaId: uploaded.id,
      url: uploaded.url,
      filename: uploaded.filename,
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Rasmni yuklashda xatolik yuz berdi' },
      { status: 500 },
    )
  }
}
