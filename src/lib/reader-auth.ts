import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

export interface ReaderUser {
  id: number
  firstName: string
  lastName: string
  username: string
  phone: string
  role?: string
  isSuperAdmin?: boolean
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

    const readerData = reader as unknown as { role?: string }
    const rawRole = readerData.role || (reader.username === 'admin' ? 'superadmin' : 'reader')
    const isSuperAdmin = rawRole === 'superadmin' || reader.username === 'admin'
    const finalRole = isSuperAdmin ? 'superadmin' : rawRole

    return {
      id: reader.id,
      firstName: reader.firstName || '',
      lastName: reader.lastName || '',
      username: reader.username,
      phone: reader.phone || '',
      role: finalRole,
      isSuperAdmin,
    }
  } catch (_e) {
    return null
  }
}

export async function isCurrentReaderAdmin(): Promise<boolean> {
  const reader = await getCurrentReader()
  return Boolean(
    reader &&
      (reader.role === 'admin' ||
        reader.role === 'superadmin' ||
        reader.username === 'admin' ||
        reader.isSuperAdmin),
  )
}

export async function isCurrentReaderSuperAdmin(): Promise<boolean> {
  const reader = await getCurrentReader()
  return Boolean(
    reader &&
      (reader.isSuperAdmin ||
        reader.username === 'admin' ||
        reader.role === 'superadmin'),
  )
}

