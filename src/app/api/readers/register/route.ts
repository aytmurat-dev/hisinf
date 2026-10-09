import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, username, password, phone } = await req.json()

    if (!firstName || !lastName || !username || !password) {
      return NextResponse.json(
        { error: 'Barcha maydonlarni toʻldirish shart' },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Parol kamida 6 belgidan iborat boʻlishi kerak' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })
    const trimmedUsername = username.trim().toLowerCase()

    // Check if username already exists in readers
    const existing = await payload.find({
      collection: 'readers',
      where: { username: { equals: trimmedUsername } },
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: 'Ushbu username band, boshqa nom tanlang' },
        { status: 400 },
      )
    }

    // Create reader
    const reader = await payload.create({
      collection: 'readers',
      data: {
        displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: trimmedUsername,
        phone: phone ? phone.trim() : null,
        password,
        _verified: true,
        acceptedTermsAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    // Log the user in to get token & set cookies
    const loginResult = await payload.login({
      collection: 'readers',
      data: {
        username: trimmedUsername,
        password,
      },
    })

    const response = NextResponse.json({
      success: true,
      token: loginResult?.token,
      reader: {
        id: reader.id,
        firstName: reader.firstName,
        lastName: reader.lastName,
        displayName: reader.displayName,
        username: reader.username,
        phone: reader.phone,
        role: 'reader',
      },
    })

    if (loginResult?.token) {
      response.cookies.set({
        name: 'payload-token',
        value: loginResult.token,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    }

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Roʻyxatdan oʻtishda xatolik yuz berdi' },
      { status: 500 },
    )
  }
}
