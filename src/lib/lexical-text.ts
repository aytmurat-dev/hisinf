export function extractPlainText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: unknown; children?: unknown[]; root?: unknown }
  
  if (n.root) {
    return extractPlainText(n.root)
  }

  let result = ''
  if (typeof n.text === 'string') {
    result += n.text + ' '
  }
  if (Array.isArray(n.children)) {
    for (const child of n.children) {
      result += extractPlainText(child) + ' '
    }
  }
  return result.replace(/\s+/g, ' ').trim()
}

export function countWords(text: string): number {
  const clean = text.trim()
  if (!clean) return 0
  return clean.split(/\s+/).filter(Boolean).length
}

export function calculateWordCountAndMinutes(text: string): { words: number; minutes: number } {
  const clean = text.trim()
  if (!clean) return { words: 0, minutes: 0 }
  const words = clean.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 180))
  return { words, minutes }
}
