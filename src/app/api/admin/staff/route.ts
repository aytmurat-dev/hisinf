import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'

export async function GET() {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'users',
    sort: '-createdAt',
    limit: 100,
    overrideAccess: true,
    select: {
      displayName: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  })

  return NextResponse.json(result.docs)
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  if (admin.role !== 'admin') {
    return NextResponse.json({ error: 'Faqat asosiy admin yangi admin qoʻsha oladi' }, { status: 403 })
  }

  try {
    const payload = await getPayloadClient()
    const body = await req.json()
    const { displayName, username, email, password, role = 'admin' } = body

    if (!displayName?.trim() || !username?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Ism, login va parol toʻldirilishi shart' },
        { status: 400 },
      )
    }

    const created = await payload.create({
      collection: 'users',
      data: {
        displayName: displayName.trim(),
        username: username.trim().toLowerCase(),
        email: email?.trim() || `${username.trim().toLowerCase()}@hisinf.uz`,
        password: password.trim(),
        role: role || 'admin',
        isActive: true,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, doc: created })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Admin yaratishda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
