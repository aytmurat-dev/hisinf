import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'

export async function GET() {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const payload = await getPayloadClient()

  const [readersRes, postsRes, adminsRes, periodsRes, inquiriesRes] = await Promise.all([
    payload.count({ collection: 'readers', overrideAccess: true }),
    payload.count({ collection: 'posts', overrideAccess: true }),
    payload.count({ collection: 'users', overrideAccess: true }),
    payload.count({ collection: 'periods', overrideAccess: true }),
    payload.count({ collection: 'inquiries', where: { status: { equals: 'new' } }, overrideAccess: true }),
  ])

  return NextResponse.json({
    readersCount: readersRes.totalDocs,
    postsCount: postsRes.totalDocs,
    adminsCount: adminsRes.totalDocs,
    periodsCount: periodsRes.totalDocs,
    inquiriesCount: inquiriesRes.totalDocs,
  })
}
