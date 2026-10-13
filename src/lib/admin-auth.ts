import 'server-only'
import { getPayloadClient } from '@/lib/payload'
import { headers } from 'next/headers'
import { isStaffUser } from '@/access'
import type { User } from '@/payload-types'

export async function getCurrentAdmin(): Promise<User | null> {
  try {
    const payload = await getPayloadClient()
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })
    if (user && isStaffUser(user)) {
      return user
    }
    return null
  } catch {
    return null
  }
}
