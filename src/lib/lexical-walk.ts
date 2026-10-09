import { extractPlainText } from './lexical-text'
import { slugify } from './slugify'

export interface LexicalNode {
  type?: string
  format?: number | string
  tag?: string
  fields?: Record<string, unknown>
  children?: LexicalNode[]
  [key: string]: unknown
}

export function walk(
  node: unknown,
  visit: (node: LexicalNode) => void | boolean,
): void {
  if (!node || typeof node !== 'object') return

  const obj = node as LexicalNode
  const stop = visit(obj) === false
  if (stop) return

  if (Array.isArray(obj.children)) {
    for (const child of obj.children) {
      walk(child, visit)
    }
  }

  if (obj.root && typeof obj.root === 'object') {
    walk(obj.root, visit)
  }
}

export interface HeadingItem {
  id: string
  text: string
  tag: 'h2' | 'h3'
}

export function collectHeadings(data: unknown): HeadingItem[] {
  const headings: HeadingItem[] = []
  walk(data, (node) => {
    if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
      const text = extractPlainText(node).trim()
      if (text) {
        const id = slugify(text)
        headings.push({ id, text, tag: node.tag as 'h2' | 'h3' })
      }
    }
  })
  return headings
}

export interface FootnoteItem {
  id: string
  number: number
  text: string
}

export function collectFootnotes(data: unknown): FootnoteItem[] {
  const footnotes: FootnoteItem[] = []
  let n = 1
  walk(data, (node) => {
    if (node.type === 'block' && node.fields?.blockType === 'footnote') {
      const text = String(node.fields?.text || '')
      footnotes.push({ id: `fn-${n}`, number: n, text })
      n++
    }
  })
  return footnotes
}

export interface SourceItem {
  title: string
  url?: string
  author?: string
  year?: string | number
}

export function collectSources(data: unknown): SourceItem[] {
  const sources: SourceItem[] = []
  walk(data, (node) => {
    if (node.type === 'block' && node.fields?.blockType === 'source') {
      const f = node.fields
      if (f?.title) {
        sources.push({
          title: String(f.title),
          url: f.url ? String(f.url) : undefined,
          author: f.author ? String(f.author) : undefined,
          year: f.year ? (f.year as string | number) : undefined,
        })
      }
    }
  })
  return sources
}
