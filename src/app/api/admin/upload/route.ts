import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const altText = (formData.get('altText') as string) || file?.name || 'Rasm'

    if (!file) {
      return NextResponse.json({ error: 'Fayl tanlanmadi' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const mime = file.type || 'image/jpeg'

    let optimizedBuffer = buffer
    let outputMime = mime

    try {
      const sharp = (await import('sharp')).default
      const compressed = await sharp(buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer()
      optimizedBuffer = Buffer.from(compressed)
      outputMime = 'image/webp'
    } catch (sharpErr) {
      console.warn('Sharp optimization fallback:', sharpErr)
    }

    const base64Data = optimizedBuffer.toString('base64')
    const dataUrl = `data:${outputMime};base64,${base64Data}`

    let mediaId: number | null = null
    try {
      const payload = await getPayloadClient()
      const mediaDoc = await payload.create({
        collection: 'media',
        data: {
          altText,
          credit: admin.displayName || 'Admin',
          license: 'own',
        },
        file: {
          data: optimizedBuffer,
          mimetype: outputMime,
          name: file.name.replace(/\.[^.]+$/, '.webp'),
          size: optimizedBuffer.length,
        },
        overrideAccess: true,
      })
      mediaId = mediaDoc.id
    } catch {
      // Vercel serverless read-only muhitda media creation xatolik bersa ham, dataUrl saqlanadi
    }

    return NextResponse.json({
      success: true,
      id: mediaId,
      url: dataUrl,
      filename: file.name,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Fayl yuklashda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
