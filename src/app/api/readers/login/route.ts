import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

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
    const trimmedInput = username.trim()

    // 1. Try logging in as Staff user first if username is 'admin' or matches a staff user
    const userCandidates = await payload.find({
      collection: 'users',
      where: trimmedInput.includes('@')
        ? { email: { equals: trimmedInput.toLowerCase() } }
        : { username: { equals: trimmedInput.toLowerCase() } },
      limit: 1,
      overrideAccess: true,
    })

    const staffCandidate = userCandidates.docs[0]
    if (staffCandidate && typeof staffCandidate.email === 'string') {
      const staffEmail = staffCandidate.email
      try {
        const staffLogin = await payload.login({
          collection: 'users',
          data: {
            email: staffEmail,
            password,
          },
        })

        if (staffLogin?.user) {
          const response = NextResponse.json({
            success: true,
            token: staffLogin.token,
            isStaff: true,
            reader: {
              id: staffLogin.user.id,
              username: staffLogin.user.username,
              role: staffLogin.user.role,
              firstName: staffLogin.user.displayName || staffLogin.user.username,
            },
          })

          if (staffLogin.token) {
            response.cookies.set({
              name: 'payload-token',
              value: staffLogin.token,
              httpOnly: true,
              path: '/',
              maxAge: 60 * 60 * 24 * 30,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          }

          return response
        }
      } catch (_staffAuthErr) {
        if (staffCandidate.username === 'admin') {
          return NextResponse.json(
            { error: 'Username yoki parol notoʻgʻri' },
            { status: 401 },
          )
        }
      }
    }

    // 2. Try logging in as Reader
    try {
      const readerLogin = await payload.login({
        collection: 'readers',
        data: trimmedInput.includes('@')
          ? { email: trimmedInput.toLowerCase(), password }
          : { username: trimmedInput.toLowerCase(), password },
      })

      if (readerLogin?.user) {
        const reader = readerLogin.user
        const response = NextResponse.json({
          success: true,
          token: readerLogin.token,
          reader: {
            id: reader.id,
            username: reader.username,
            firstName: reader.displayName || reader.firstName || reader.username,
            role: reader.role ?? 'reader',
          },
        })

        if (readerLogin.token) {
          response.cookies.set({
            name: 'payload-token',
            value: readerLogin.token,
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
        }

        return response
      }
    } catch (_readerAuthErr) {
      // Login failed
    }

    return NextResponse.json(
      { error: 'Username yoki parol notoʻgʻri' },
      { status: 401 },
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Tizimga kirishda xatolik yuz berdi' },
      { status: 500 },
    )
  }
}
