import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

export interface ReaderUser {
  id: number
  firstName: string
  lastName: string
  username: string
  phone: string
}

export async function getCurrentReader(): Promise<ReaderUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('hisinf_reader_session')?.value
    if (!token) return null

    const payload = await getPayload({ config })
    const parts = Buffer.from(token, 'base64').toString('utf-8').split(':')
    if (parts.length < 2) return null
    const id = Number(parts[0])
    if (!id) return null

    const reader = await payload.findByID({
      collection: 'readers',
      id,
      overrideAccess: true,
    })

    if (!reader) return null

    return {
      id: reader.id,
      firstName: reader.firstName,
      lastName: reader.lastName,
      username: reader.username,
      phone: reader.phone,
    }
  } catch (_e) {
    return null
  }
}

export async function isCurrentReaderAdmin(): Promise<boolean> {
  const reader = await getCurrentReader()
  return Boolean(reader && reader.username === 'admin')
}

