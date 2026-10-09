import { describe, it, expect } from 'vitest'
import { extractPlainText, countWords } from '@/lib/lexical-text'
import {
  collectHeadings,
  collectFootnotes,
  collectSources,
} from '@/lib/lexical-walk'

describe('lexical-text', () => {
  it('extracts plain text from sample Lexical tree', () => {
    const data = {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Birinchi paragraf.' }],
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'Ikkinchi' },
              { type: 'text', text: 'paragraf matni.' },
            ],
          },
        ],
      },
    }

    const text = extractPlainText(data)
    expect(text).toContain('Birinchi paragraf.')
    expect(text).toContain('Ikkinchi paragraf matni.')
    expect(countWords(text)).toBe(5)
  })

  it('handles null and empty data', () => {
    expect(extractPlainText(null)).toBe('')
    expect(countWords('')).toBe(0)
  })
})

describe('lexical-walk', () => {
  const sampleDoc = {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          tag: 'h2',
          children: [{ type: 'text', text: 'Tarixiy davr' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Bu yerda matn bor.' }],
        },
        {
          type: 'block',
          fields: {
            blockType: 'footnote',
            text: '1924-yilgi arxiv hujjati.',
          },
        },
        {
          type: 'heading',
          tag: 'h3',
          children: [{ type: 'text', text: 'Chegaralanish jarayoni' }],
        },
        {
          type: 'block',
          fields: {
            blockType: 'source',
            title: 'Oʻzbekiston tarixi',
            author: 'A. Ziyo',
            year: 2019,
          },
        },
      ],
    },
  }

  it('collects headings with generated slugs', () => {
    const headings = collectHeadings(sampleDoc)
    expect(headings).toHaveLength(2)
    expect(headings[0]).toEqual({
      id: 'tarixiy-davr',
      text: 'Tarixiy davr',
      tag: 'h2',
    })
    expect(headings[1]).toEqual({
      id: 'chegaralanish-jarayoni',
      text: 'Chegaralanish jarayoni',
      tag: 'h3',
    })
  })

  it('collects footnotes in order', () => {
    const footnotes = collectFootnotes(sampleDoc)
    expect(footnotes).toHaveLength(1)
    expect(footnotes[0]).toEqual({
      id: 'fn-1',
      number: 1,
      text: '1924-yilgi arxiv hujjati.',
    })
  })

  it('collects sources with metadata', () => {
    const sources = collectSources(sampleDoc)
    expect(sources).toHaveLength(1)
    expect(sources[0]).toEqual({
      title: 'Oʻzbekiston tarixi',
      author: 'A. Ziyo',
      year: 2019,
      url: undefined,
    })
  })
})
