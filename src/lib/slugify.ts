const APOS = /['`´‘’ʻʼʹ]/g

export function slugify(input: string, maxLength = 80): string {
  if (!input) return ''
  return input
    .toLowerCase()
    .replace(APOS, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '')
}
