import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { verifySessionToken } from '@/lib/session'

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
    const id = verifySessionToken(cookieStore.get('hisinf_reader_session')?.value)
    if (!id) return null

    const payload = await getPayload({ config })
    const reader = await payload.findByID({
      collection: 'readers',
      id,
      overrideAccess: true, // sessiya imzosi yuqorida tekshirildi; o'quvchi o'z yozuvini o'qiydi
    })

    if (!reader) return null

    const role = reader.role ?? 'reader'

    return {
      id: reader.id,
      firstName: reader.firstName || '',
      lastName: reader.lastName || '',
      username: reader.username,
      phone: reader.phone || '',
      role,
      isSuperAdmin: role === 'superadmin',
    }
  } catch (_e) {
    return null
  }
}

export async function isCurrentReaderAdmin(): Promise<boolean> {
  const reader = await getCurrentReader()
  return reader?.role === 'admin' || reader?.role === 'superadmin'
}

export async function isCurrentReaderSuperAdmin(): Promise<boolean> {
  const reader = await getCurrentReader()
  return reader?.role === 'superadmin'
}
