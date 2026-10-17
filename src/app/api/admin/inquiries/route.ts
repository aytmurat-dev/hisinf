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

    if (inquiries && inquiries.length > 0) {
      return NextResponse.json({
        docs: inquiries,
        total: totalDocs,
        unreadCount,
      })
    }
  } catch (_err) {
    // Database offline fallback
  }

  return NextResponse.json({
    docs: [],
    total: 0,
    unreadCount: 0,
  })
}
