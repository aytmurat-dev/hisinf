import { NextRequest, NextResponse } from 'next/server'
import mammoth from 'mammoth'
import { isCurrentReaderAdmin } from '@/lib/current-reader'

const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(req: NextRequest) {
  if (!(await isCurrentReaderAdmin())) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Fayl tanlanmadi' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Fayl 10 MB dan katta' }, { status: 413 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileName = file.name.toLowerCase()

    let extractedText = ''

    if (fileName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer })
      extractedText = result.value
    } else if (fileName.endsWith('.pdf')) {
      const { PDFParse } = await import('pdf-parse')
      const parser = new PDFParse({ data: new Uint8Array(buffer) })
      try {
        const result = await parser.getText()
        extractedText = result.text
      } finally {
        await parser.destroy().catch(() => {})
      }
    } else if (fileName.endsWith('.txt')) {
      extractedText = buffer.toString('utf-8')
    } else {
      return NextResponse.json(
        { error: 'Faqat PDF, Word (.docx) yoki matnli (.txt) fayllar qoʻllab-quvvatlanadi' },
        { status: 400 },
      )
    }

    // Clean up excessive whitespace
    const cleanText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    return NextResponse.json({
      success: true,
      filename: file.name,
      text: cleanText,
      charCount: cleanText.length,
    })
  } catch (error) {
    console.error('Error parsing document:', error)
    return NextResponse.json(
      { error: 'Faylni oʻqishda xatolik yuz berdi' },
      { status: 500 },
    )
  }
}
