import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, username, password, phone } = await req.json()

    if (!firstName || !lastName || !username || !password || !phone) {
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

    // Check if username already exists
    const existing = await payload.find({
      collection: 'readers',
      where: { username: { equals: username.trim().toLowerCase() } },
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
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().toLowerCase(),
        password,
        displayPassword: password,
        phone: phone.trim(),
      },
      overrideAccess: true,
    })

    // Create session token
    const sessionToken = Buffer.from(`${reader.id}:${Date.now()}`).toString('base64')

    const response = NextResponse.json({
      success: true,
      reader: {
        id: reader.id,
        firstName: reader.firstName,
        lastName: reader.lastName,
        username: reader.username,
        phone: reader.phone,
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
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Roʻyxatdan oʻtishda xatolik yuz berdi' },
      { status: 500 },
    )
  }
}
