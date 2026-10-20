import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'
import { saveMediaFile, createMediaDirectly } from '@/lib/media-storage'
import fs from 'fs'
import path from 'path'

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

    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^.]+$/, '.webp')}`

    // 1. Save directly to Neon Postgres media_storage table
    await saveMediaFile(safeFilename, outputMime, optimizedBuffer)

    // 2. Also write to temporary disk if available
    try {
      const tmpDir = path.resolve('/tmp/media')
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true })
      }
      fs.writeFileSync(path.join(tmpDir, safeFilename), optimizedBuffer)
    } catch {
      // Ignore filesystem errors in serverless
    }

    let mediaId: number | null = null
    let mediaUrl: string = `/api/media/file/${encodeURIComponent(safeFilename)}`

    // 3. Register media in Payload CMS
    try {
      const payload = await getPayloadClient()
      const mediaDoc = await payload.create({
        collection: 'media',
        locale: 'uz',
        data: {
          alt: altText,
          altText: altText,
          credit: admin.displayName || 'Admin',
          license: 'own',
        },
        file: {
          data: optimizedBuffer,
          mimetype: outputMime,
          name: safeFilename,
          size: optimizedBuffer.length,
        },
        overrideAccess: true,
      })

      if (mediaDoc?.id) {
        mediaId = mediaDoc.id
        mediaUrl = mediaDoc.url || `/api/media/file/${encodeURIComponent(mediaDoc.filename || safeFilename)}`
      }
    } catch (createErr) {
      console.warn('Payload media create fallback to direct DB insert:', createErr)
      // Direct DB insert fallback to guarantee media ID
      const direct = await createMediaDirectly({
        filename: safeFilename,
        mimeType: outputMime,
        filesize: optimizedBuffer.length,
        altText,
        credit: admin.displayName || 'Admin',
        uploadedById: admin.id || null,
      })
      if (direct) {
        mediaId = direct.id
        mediaUrl = direct.url
      }
    }

    return NextResponse.json({
      success: true,
      id: mediaId,
      url: mediaUrl,
      filename: file.name,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Fayl yuklashda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
