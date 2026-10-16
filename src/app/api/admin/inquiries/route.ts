import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    const { docs: inquiries, totalDocs } = await payload.find({
      collection: 'inquiries',
      sort: '-createdAt',
      limit: 100,
      overrideAccess: true,
    })

    const unreadCount = inquiries.filter((inq) => inq.status === 'new').length

    return NextResponse.json({
      docs: inquiries,
      total: totalDocs,
      unreadCount,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Murojaatlarni olishda xatolik'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
