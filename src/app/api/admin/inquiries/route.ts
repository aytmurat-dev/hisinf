import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { isCurrentReaderAdmin } from '@/lib/reader-auth'

export async function GET() {
  try {
    const isAdmin = await isCurrentReaderAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const payload = await getPayload({ config })
    const { docs: inquiries } = await payload.find({
      collection: 'inquiries',
      sort: '-createdAt',
      limit: 100,
      overrideAccess: true,
    })

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error('Admin inquiries fetch error:', error)
    return NextResponse.json({ error: 'Xabarlarni olishda xatolik' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await isCurrentReaderAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'ID talab qilinadi' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    await payload.delete({
      collection: 'inquiries',
      id: Number(id),
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, message: 'Xabar oʻchirildi' })
  } catch (error) {
    console.error('Admin inquiry delete error:', error)
    return NextResponse.json({ error: 'Xabarni oʻchirishda xatolik' }, { status: 500 })
  }
}
