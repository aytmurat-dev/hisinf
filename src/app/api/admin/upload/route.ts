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

    const payload = await getPayloadClient()

    try {
      const mediaDoc = await payload.create({
        collection: 'media',
        data: {
          altText,
          credit: admin.displayName || 'Admin',
          license: 'own',
        },
        file: {
          data: buffer,
          mimetype: mime,
          name: file.name,
          size: file.size,
        },
        overrideAccess: true,
      })

      return NextResponse.json({
        success: true,
        id: mediaDoc.id,
        url: mediaDoc.url || `/api/media/file/${mediaDoc.filename}`,
        filename: mediaDoc.filename,
      })
    } catch {
      // Vercel read-only filesystem yoki R2 yo'q bo'lsa, data URL sifatida qaytarish
      const base64Data = buffer.toString('base64')
      const dataUrl = `data:${mime};base64,${base64Data}`
      return NextResponse.json({
        success: true,
        id: null,
        url: dataUrl,
        filename: file.name,
      })
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Fayl yuklashda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
