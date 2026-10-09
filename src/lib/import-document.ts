import type { Payload } from 'payload'
import mammoth from 'mammoth'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import { postEditor } from '@/editor/config'
import { textToLexical } from './text-to-lexical'

export async function processDocumentImport(
  payload: Payload,
  file: File,
): Promise<{ lexical: unknown; paragraphCount: number }> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const name = file.name.toLowerCase()

  if (name.endsWith('.docx')) {
    const result = await mammoth.convertToHtml({ buffer })
    const html = result.value
    const editorConfig = await editorConfigFactory.fromEditor({
      config: payload.config,
      editor: postEditor,
    })
    const lexical = convertHTMLToLexical({ editorConfig, html, JSDOM })
    const paragraphCount = Array.isArray((lexical as { root?: { children?: unknown[] } })?.root?.children)
      ? (lexical as { root: { children: unknown[] } }).root.children.length
      : 0
    return { lexical, paragraphCount }
  }

  if (name.endsWith('.pdf')) {
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: new Uint8Array(buffer) })
    let extractedText = ''
    try {
      const res = await parser.getText()
      extractedText = res.text
    } finally {
      await parser.destroy().catch(() => {})
    }
    const lexical = textToLexical(extractedText)
    return { lexical, paragraphCount: lexical.root.children.length }
  }

  if (name.endsWith('.txt')) {
    const text = buffer.toString('utf-8')
    const lexical = textToLexical(text)
    return { lexical, paragraphCount: lexical.root.children.length }
  }

  throw new Error('Faqat .docx, .pdf yoki .txt fayllar qoʻllab-quvvatlanadi')
}
