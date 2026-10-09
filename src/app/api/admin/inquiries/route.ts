import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { isCurrentReaderAdmin } from '@/lib/current-reader'

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

    const body = await req.json()
    const { action = 'delete', id, replyText } = body

    if (!id) {
      return NextResponse.json({ error: 'ID talab qilinadi' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    if (action === 'reply') {
      if (!replyText || !replyText.trim()) {
        return NextResponse.json({ error: 'Javob matnini kiriting' }, { status: 400 })
      }

      const updated = await payload.update({
        collection: 'inquiries',
        id: Number(id),
        data: {
          reply: replyText.trim(),
          repliedAt: new Date().toISOString(),
          status: 'replied',
          repliedBy: 'Bosh Administrator',
        },
        overrideAccess: true,
      })

      return NextResponse.json({
        success: true,
        message: 'Javob muvaffaqiyatli yuborildi',
        inquiry: updated,
      })
    }

    if (action === 'delete') {
      await payload.delete({
        collection: 'inquiries',
        id: Number(id),
        overrideAccess: true,
      })

      return NextResponse.json({ success: true, message: 'Xabar oʻchirildi' })
    }

    return NextResponse.json({ error: 'Nomaʼlum amal' }, { status: 400 })
  } catch (error) {
    console.error('Admin inquiry action error:', error)
    return NextResponse.json({ error: 'Amalni bajarishda xatolik yuz berdi' }, { status: 500 })
  }
}
