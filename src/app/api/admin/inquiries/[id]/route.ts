import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const { id } = await params
  try {
    const payload = await getPayloadClient()
    const { reply } = await req.json()

    if (!reply || !reply.trim()) {
      return NextResponse.json({ error: 'Javob matni boʻsh boʻlishi mumkin emas' }, { status: 400 })
    }

    const updated = await payload.update({
      collection: 'inquiries',
      id: Number(id),
      data: {
        reply: reply.trim(),
        status: 'replied',
        repliedAt: new Date().toISOString(),
        repliedByUser: admin.id,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, doc: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Javob yuborishda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const { id } = await params
  try {
    const payload = await getPayloadClient()
    await payload.delete({
      collection: 'inquiries',
      id: Number(id),
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, message: 'Murojaat muvaffaqiyatli oʻchirildi' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Murojaatni oʻchirishda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
