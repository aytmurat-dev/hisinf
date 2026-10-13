import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const { id } = await params
  const targetId = parseInt(id, 10)
  if (isNaN(targetId)) {
    return NextResponse.json({ error: 'Notoʻgʻri ID' }, { status: 400 })
  }

  try {
    const payload = await getPayloadClient()
    const body = await req.json()
    const { displayName, email, role, password, isActive } = body

    const updateData: Record<string, unknown> = {}
    if (displayName) updateData.displayName = displayName.trim()
    if (email) updateData.email = email.trim()
    if (role) updateData.role = role
    if (password && password.trim()) updateData.password = password.trim()
    if (typeof isActive === 'boolean') updateData.isActive = isActive

    const updated = await payload.update({
      collection: 'users',
      id: targetId,
      data: updateData,
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, doc: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Tahrirlashda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const { id } = await params
  const targetId = parseInt(id, 10)
  if (isNaN(targetId)) {
    return NextResponse.json({ error: 'Notoʻgʻri ID' }, { status: 400 })
  }

  if (admin.id === targetId) {
    return NextResponse.json(
      { error: 'Oʻzingizning akkauntingizni oʻchira olmaysiz' },
      { status: 400 },
    )
  }

  try {
    const payload = await getPayloadClient()
    await payload.delete({
      collection: 'users',
      id: targetId,
      overrideAccess: true,
    })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Oʻchirishda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
