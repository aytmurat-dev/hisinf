import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    const body = await req.json()
    const { type, id, newPassword } = body

    if (!type || !id || !newPassword || !newPassword.trim()) {
      return NextResponse.json(
        { error: 'Foydalanuvchi va yangi parol kiritilishi shart' },
        { status: 400 },
      )
    }

    const collection = type === 'staff' ? 'users' : 'readers'
    const targetId = parseInt(id, 10)

    await payload.update({
      collection,
      id: targetId,
      data: {
        password: newPassword.trim(),
      },
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      message: 'Parol muvaffaqiyatli yangilandi',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Parolni yangilashda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
