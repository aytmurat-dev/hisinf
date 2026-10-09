import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const reqHeaders = await headers()
    
    // First try via payload.auth
    let { user } = await payload.auth({ headers: reqHeaders })

    // Fallback: check payload-token cookie directly or Authorization header
    if (!user) {
      const token = req.cookies.get('payload-token')?.value ||
        req.headers.get('authorization')?.replace(/^(Bearer|JWT)\s+/i, '')
      if (token) {
        // Create headers with Authorization header
        const authHeaders = new Headers(reqHeaders)
        authHeaders.set('authorization', `JWT ${token}`)
        const authRes = await payload.auth({ headers: authHeaders })
        user = authRes.user
      }
    }

    if (!user) {
      return NextResponse.json({ user: null })
    }

    const isStaff = user.collection === 'users'
    const displayName =
      (user as unknown as { displayName?: string }).displayName ||
      (user as unknown as { name?: string }).name ||
      (user as unknown as { firstName?: string }).firstName ||
      user.username ||
      user.email

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: displayName,
        displayName,
        role: (user as unknown as { role?: string }).role || (isStaff ? 'admin' : 'reader'),
        collection: user.collection,
      },
    })
  } catch {
    return NextResponse.json({ user: null })
  }
}
