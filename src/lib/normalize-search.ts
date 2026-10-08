const APOS = /['`´‘’ʻʼʹ]/g

export function normalizeSearch(input: string): string {
  if (!input) return ''
  return input
    .toLowerCase()
    .replace(APOS, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
