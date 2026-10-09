import 'server-only'
import { getPayloadClient } from '@/lib/payload'
import type { Footer, Header, HomePage, SiteSetting } from '@/payload-types'

export async function getHeader(locale: 'uz' | 'kaa'): Promise<Header> {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'header',
    locale,
    fallbackLocale: 'uz',
    depth: 2,
    overrideAccess: false,
  })
}

export async function getFooter(locale: 'uz' | 'kaa'): Promise<Footer> {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'footer',
    locale,
    fallbackLocale: 'uz',
    depth: 2,
    overrideAccess: false,
  })
}

export async function getSiteSettings(locale: 'uz' | 'kaa'): Promise<SiteSetting> {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'site-settings',
    locale,
    fallbackLocale: 'uz',
    depth: 1,
    overrideAccess: false,
  })
}

export async function getHomePage(locale: 'uz' | 'kaa'): Promise<HomePage> {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'home-page',
    locale,
    fallbackLocale: 'uz',
    depth: 2,
    overrideAccess: false,
  })
}
