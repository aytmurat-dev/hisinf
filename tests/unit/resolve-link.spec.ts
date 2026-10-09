import { describe, it, expect } from 'vitest'
import { resolveLink } from '@/lib/resolve-link'

describe('resolveLink', () => {
  it('resolves routes correctly', () => {
    expect(resolveLink({ type: 'route', route: 'home' })).toEqual({ href: '/', external: false })
    expect(resolveLink({ type: 'route', route: 'posts' })).toEqual({ href: '/maqolalar', external: false })
    expect(resolveLink({ type: 'route', route: 'timeline' })).toEqual({ href: '/xronologiya', external: false })
    expect(resolveLink({ type: 'route', route: 'persons' })).toEqual({ href: '/shaxslar', external: false })
    expect(resolveLink({ type: 'route', route: 'archive' })).toEqual({ href: '/arxiv', external: false })
    expect(resolveLink({ type: 'route', route: 'map' })).toEqual({ href: '/xarita', external: false })
    expect(resolveLink({ type: 'route', route: 'search' })).toEqual({ href: '/qidiruv', external: false })
    expect(resolveLink({ type: 'route', route: 'contact' })).toEqual({ href: '/aloqa', external: false })
    expect(resolveLink({ type: 'route', route: 'become-author' })).toEqual({ href: '/muallif-bolish', external: false })
  })

  it('resolves custom URLs with external flag', () => {
    expect(resolveLink({ type: 'custom', url: 'https://example.com' })).toEqual({
      href: 'https://example.com',
      external: true,
    })
    expect(resolveLink({ type: 'custom', url: '/ichki-sahifa', newTab: true })).toEqual({
      href: '/ichki-sahifa',
      external: true,
    })
    expect(resolveLink({ type: 'custom', url: '/ichki-sahifa', newTab: false })).toEqual({
      href: '/ichki-sahifa',
      external: false,
    })
  })

  it('resolves internal references', () => {
    expect(
      resolveLink({
        type: 'internal',
        reference: { relationTo: 'posts', value: { slug: 'test-post' } },
      }),
    ).toEqual({ href: '/maqolalar/test-post', external: false })

    expect(
      resolveLink({
        type: 'internal',
        reference: { relationTo: 'pages', value: { slug: 'biz-haqimizda' } },
      }),
    ).toEqual({ href: '/sahifa/biz-haqimizda', external: false })
  })

  it('handles empty links', () => {
    expect(resolveLink(null)).toEqual({ href: '#', external: false })
    expect(resolveLink(undefined)).toEqual({ href: '#', external: false })
  })
})
