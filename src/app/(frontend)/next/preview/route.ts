import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { isStaffUser } from '@/access'

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  const previewSecret = searchParams.get('previewSecret')

  const expectedSecret = process.env.PREVIEW_SECRET
  if (!expectedSecret || previewSecret !== expectedSecret) {
    return new Response('Ruxsat berilmagan (previewSecret notoʻgʻri)', { status: 403 })
  }

  if (!path) {
    return new Response('Yoʻl (path) koʻrsatilmagan', { status: 400 })
  }

  const payload = await getPayloadClient()
  const reqHeaders = await headers()
  const { user } = await payload.auth({ headers: reqHeaders })

  if (!isStaffUser(user)) {
    return new Response('Faqat tahririyat xodimlari qoralamani koʻra oladi', { status: 403 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(path)
}
