import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/admin-auth'
import mammoth from 'mammoth'

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Fayl tanlanmadi' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const name = file.name.toLowerCase()

    let extractedText = ''

    if (name.endsWith('.docx') || name.endsWith('.dotx')) {
      const result = await mammoth.extractRawText({ buffer })
      extractedText = result.value
    } else if (name.endsWith('.txt')) {
      extractedText = buffer.toString('utf-8')
    } else if (name.endsWith('.pdf')) {
      const { PDFParse } = await import('pdf-parse')
      const parser = new PDFParse({ data: new Uint8Array(buffer) })
      try {
        const res = await parser.getText()
        extractedText = res.text
      } finally {
        await parser.destroy().catch(() => {})
      }
    } else if (name.endsWith('.doc')) {
      // Eski .doc fayllar uchun matn qismlarini tozalab olish
      extractedText = buffer
        .toString('utf-8')
        .replace(/[^\x20-\x7E\u0400-\u04FF\u0100-\u024F\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
    } else {
      return NextResponse.json(
        { error: 'Faqat .docx (Word), .pdf yoki .txt fayllar qabul qilinadi' },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      text: extractedText.trim(),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Faylni oʻqishda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
