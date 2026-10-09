import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { createSessionToken } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username va parolni kiriting' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    try {
      const loginResult = await payload.login({
        collection: 'readers',
        data: {
          username: username.trim().toLowerCase(),
          password,
        },
      })

      if (!loginResult || !loginResult.user) {
        return NextResponse.json(
          { error: 'Username yoki parol notoʻgʻri' },
          { status: 401 },
        )
      }

      const reader = loginResult.user
      const sessionToken = createSessionToken(reader.id)

      const role = reader.role ?? 'reader'
      const isSuperAdmin = role === 'superadmin'

      const response = NextResponse.json({
        success: true,
        reader: {
          id: reader.id,
          firstName: reader.firstName,
          lastName: reader.lastName,
          username: reader.username,
          phone: reader.phone,
          role,
          isSuperAdmin,
        },
      })

      response.cookies.set({
        name: 'hisinf_reader_session',
        value: sessionToken,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })

      return response
    } catch (_authError) {
      return NextResponse.json(
        { error: 'Username yoki parol notoʻgʻri' },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Tizimga kirishda xatolik yuz berdi' },
      { status: 500 },
    )
  }
}
