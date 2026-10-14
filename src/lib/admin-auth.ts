import 'server-only'
import { getPayloadClient } from '@/lib/payload'
import { headers, cookies } from 'next/headers'
import { isStaffUser } from '@/access'
import type { User } from '@/payload-types'
import type { NextRequest } from 'next/server'

export async function getCurrentAdmin(req?: NextRequest): Promise<User | null> {
  try {
    const payload = await getPayloadClient()
    const reqHeaders = req ? req.headers : await headers()
    
    // 1. Standart payload.auth tekshiruvi
    const { user } = await payload.auth({ headers: reqHeaders })
    if (user && isStaffUser(user)) {
      return user
    }

    // 2. Cookie yoki Authorization token orqali to'g'ridan-to'g'ri tekshirish
    let token = req?.cookies.get('payload-token')?.value
    if (!token) {
      try {
        const cookieStore = await cookies()
        token = cookieStore.get('payload-token')?.value
      } catch {
        // cookies() mavjud bo'lmasa e'tiborsiz qoldirish
      }
    }
    if (!token) {
      const authHeader = reqHeaders.get('authorization')
      if (authHeader) {
        token = authHeader.replace(/^(Bearer|JWT)\s+/i, '')
      }
    }

    if (token) {
      const authHeaders = new Headers(reqHeaders)
      authHeaders.set('authorization', `JWT ${token}`)
      const res = await payload.auth({ headers: authHeaders })
      if (res.user && isStaffUser(res.user)) {
        return res.user
      }
    }

    return null
  } catch {
    return null
  }
}
