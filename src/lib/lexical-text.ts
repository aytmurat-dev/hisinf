export function extractPlainText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''

  const obj = node as Record<string, unknown>

  if (typeof obj.text === 'string') {
    return obj.text
  }

  // If node has root property: { root: { children: [...] } }
  if (obj.root && typeof obj.root === 'object') {
    return extractPlainText(obj.root)
  }

  if (Array.isArray(obj.children)) {
    const parts = obj.children
      .map((child) => extractPlainText(child).trim())
      .filter(Boolean)

    if (obj.type === 'root') {
      return parts.join('\n\n')
    }
    return parts.join(' ')
  }

  return ''
}

export function countWords(text: string): number {
  if (!text) return 0
  const words = text.trim().split(/\s+/).filter(Boolean)
  return words.length
}
