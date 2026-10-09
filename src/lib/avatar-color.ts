const AVATAR_COLORS = [
  'var(--teal)',
  'var(--p-ochre)',
  'var(--p-indigo)',
  'var(--primary)',
  'var(--p-olive)',
]

export function avatarColor(id: number | string | undefined | null): string {
  if (id === undefined || id === null) return AVATAR_COLORS[0]
  if (typeof id === 'number') {
    return AVATAR_COLORS[Math.abs(Math.floor(id)) % AVATAR_COLORS.length]
  }
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
