import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin, DEFAULT_ADMIN_USER } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ user: null })
  }
  return NextResponse.json({
    user: {
      id: admin.id,
      displayName: admin.displayName,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, email, password } = body

    const loginId = (username || email || '').trim().toLowerCase()
    if (!loginId || !password) {
      return NextResponse.json(
        { error: 'Login va parol kiritilishi shart' },
        { status: 400 },
      )
    }

    // 1. Direct admin access with login: admin, password: admin123
    if ((loginId === 'admin' || loginId === 'admin@hisinf.uz') && password === 'admin123') {
      const response = NextResponse.json({
        success: true,
        user: {
          id: DEFAULT_ADMIN_USER.id,
          displayName: DEFAULT_ADMIN_USER.displayName,
          username: DEFAULT_ADMIN_USER.username,
          email: DEFAULT_ADMIN_USER.email,
          role: DEFAULT_ADMIN_USER.role,
        },
      })

      response.cookies.set('hisinf_admin_auth', 'admin', {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
      })

      response.cookies.set('payload-token', 'dev-admin-token-2026', {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
      })

      return response
    }

    // 2. Fallback to Payload DB auth
    try {
      const payload = await getPayloadClient()
      const result = await payload.login({
        collection: 'users',
        data: {
          username: loginId,
          password,
        },
      })

      if (result && result.user) {
        const response = NextResponse.json({
          success: true,
          user: {
            id: result.user.id,
            displayName: result.user.displayName,
            username: result.user.username,
            email: result.user.email,
            role: result.user.role,
          },
        })

        if (result.token) {
          response.cookies.set('payload-token', result.token, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
          })
        }

        return response
      }
    } catch (_dbErr) {
      // If DB failed, but credentials were admin/admin123, already handled above
    }

    return NextResponse.json(
      { error: 'Login yoki parol notoʻgʻri' },
      { status: 401 },
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Kirishda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('payload-token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })
  response.cookies.set('hisinf_admin_auth', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })
  return response
}
