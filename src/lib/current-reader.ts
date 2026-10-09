import { headers } from 'next/headers'
import { getPayloadClient } from './payload'
import { isReaderUser, isStaffUser, hasRole } from '../access'
import type { Reader } from '@/payload-types'

/** FAQAT dinamik joylarda (server action, route handler, kabinet) chaqiring — sahifani dinamik qiladi */
export async function getCurrentReader(): Promise<Reader | null> {
  try {
    const payload = await getPayloadClient()
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })
    return isReaderUser(user) ? (user as unknown as Reader) : null
  } catch {
    return null
  }
}

/** Legacy admin route checks until P5 removes them */
export async function isCurrentReaderAdmin(): Promise<boolean> {
  try {
    const payload = await getPayloadClient()
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })
    return isStaffUser(user) && hasRole(user, 'admin')
  } catch {
    return false
  }
}

export async function isCurrentReaderSuperAdmin(): Promise<boolean> {
  return isCurrentReaderAdmin()
}
