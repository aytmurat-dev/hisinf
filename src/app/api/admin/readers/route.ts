import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'
import type { Where } from 'payload'

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const payload = await getPayloadClient()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '50', 10)

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

  return NextResponse.json(result)
}
