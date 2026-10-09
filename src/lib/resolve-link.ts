export interface LinkData {
  type?: 'route' | 'internal' | 'custom' | null
  route?: string | null
  reference?: {
    relationTo: 'pages' | 'posts' | 'categories' | string
    value: { slug?: string } | number | string
  } | null
  url?: string | null
  newTab?: boolean | null
}

export const ROUTE_MAP: Record<string, string> = {
  home: '/',
  posts: '/maqolalar',
  timeline: '/xronologiya',
  persons: '/shaxslar',
  archive: '/arxiv',
  map: '/xarita',
  search: '/qidiruv',
  authors: '/mualliflar',
  contact: '/aloqa',
  'become-author': '/muallif-bolish',
}

export function resolveLink(link?: LinkData | null): { href: string; external: boolean } {
  if (!link) return { href: '#', external: false }

  const { type = 'route', route, reference, url, newTab } = link

  if (type === 'route') {
    const path = (route && ROUTE_MAP[route]) || '/'
    return { href: path, external: false }
  }

  if (type === 'custom') {
    const rawUrl = url || '#'
    const isHttp = /^https?:\/\//i.test(rawUrl)
    return { href: rawUrl, external: Boolean(newTab || isHttp) }
  }

  if (type === 'internal' && reference && typeof reference === 'object') {
    const rel = reference.relationTo
    const slug =
      typeof reference.value === 'object' && reference.value !== null
        ? reference.value.slug
        : undefined

    if (slug) {
      if (rel === 'posts') return { href: `/maqolalar/${slug}`, external: false }
      if (rel === 'pages') return { href: `/sahifa/${slug}`, external: false }
      if (rel === 'categories') return { href: `/maqolalar?kategoriya=${slug}`, external: false }
    }
  }

  return { href: '#', external: false }
}
