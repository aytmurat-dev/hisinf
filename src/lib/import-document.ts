import type { Payload } from 'payload'
import mammoth from 'mammoth'
import { textToLexical } from './text-to-lexical'

export async function processDocumentImport(
  _payload: Payload,
  file: File,
): Promise<{ lexical: unknown; text: string; paragraphCount: number }> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const name = file.name.toLowerCase()

  if (name.endsWith('.docx')) {
    const result = await mammoth.extractRawText({ buffer })
    const text = (result.value || '').trim()
    if (!text) {
      throw new Error('Word (.docx) faylidan matn topilmadi')
    }
    const lexical = textToLexical(text)
    return {
      lexical,
      text,
      paragraphCount: lexical.root.children.length,
    }
  }

  if (name.endsWith('.pdf')) {
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: new Uint8Array(buffer) })
    let extractedText = ''
    try {
      const res = await parser.getText()
      extractedText = (res.text || '').trim()
    } finally {
      await parser.destroy().catch(() => {})
    }
    if (!extractedText) {
      throw new Error('PDF faylidan matn topilmadi')
    }
    const lexical = textToLexical(extractedText)
    return {
      lexical,
      text: extractedText,
      paragraphCount: lexical.root.children.length,
    }
  }

  if (name.endsWith('.txt')) {
    const text = buffer.toString('utf-8').trim()
    if (!text) {
      throw new Error('Matn (.txt) fayli boʻsh')
    }
    const lexical = textToLexical(text)
    return {
      lexical,
      text,
      paragraphCount: lexical.root.children.length,
    }
  }

  throw new Error('Faqat .docx, .pdf yoki .txt fayllar qoʻllab-quvvatlanadi')
}
