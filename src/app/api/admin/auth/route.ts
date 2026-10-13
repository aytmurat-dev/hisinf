import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'

export async function GET() {
  const admin = await getCurrentAdmin()
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
    const payload = await getPayloadClient()
    const body = await req.json()
    const { username, email, password } = body

    const loginId = (username || email || '').trim()
    if (!loginId || !password) {
      return NextResponse.json(
        { error: 'Login va parol kiritilishi shart' },
        { status: 400 },
      )
    }

    const result = await payload.login({
      collection: 'users',
      data: {
        username: loginId,
        password,
      },
    })

    if (!result || !result.user) {
      return NextResponse.json(
        { error: 'Login yoki parol notoʻgʻri' },
        { status: 401 },
      )
    }

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
        maxAge: 60 * 60 * 24 * 7, // 7 kun
      })
    }

    return response
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
  return response
}
