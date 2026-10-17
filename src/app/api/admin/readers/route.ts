import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'
import type { Where } from 'payload'

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '50', 10)

  try {
    const payload = await getPayloadClient()
    const where: Where = {}
    if (q) {
      where.or = [
        { displayName: { like: q } },
        { email: { like: q } },
        { username: { like: q } },
      ]
    }

    const result = await payload.find({
      collection: 'readers',
      where,
      page,
      limit,
      sort: '-createdAt',
      overrideAccess: true,
      select: {
        displayName: true,
        email: true,
        username: true,
        isBanned: true,
        _verified: true,
        createdAt: true,
      },
    })

    if (result && result.docs && result.docs.length > 0) {
      return NextResponse.json(result)
    }
  } catch (_err) {
    // Database offline fallback
  }

  return NextResponse.json({
    docs: [],
    totalDocs: 0,
    limit,
    page,
    totalPages: 1,
  })
}
