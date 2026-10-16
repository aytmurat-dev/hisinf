import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCurrentReader } from '@/lib/current-reader'

// Faqat kirgan o'quvchi o'z murojaatlarini ko'radi (P3 da `reader` bog'lanishiga o'tkaziladi)
export async function GET() {
  try {
    const reader = await getCurrentReader()
    if (!reader) {
      return NextResponse.json({ inquiries: [] })
    }

    const payload = await getPayload({ config })

    const { docs: inquiries } = await payload.find({
      collection: 'inquiries',
      where: reader.phone
        ? {
            or: [
              { reader: { equals: reader.id } },
              { phone: { equals: reader.phone } },
            ],
          }
        : { reader: { equals: reader.id } },
      sort: '-createdAt',
      limit: 20,
      overrideAccess: true,
    })

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error('Fetch user inquiries error:', error)
    return NextResponse.json({ inquiries: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const reader = await getCurrentReader()
    const { name, phone, message } = await req.json()

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Xabar matnini kiriting' },
        { status: 400 },
      )
    }

    const senderName = name?.trim() || (reader ? `${reader.firstName} ${reader.lastName}` : 'Mehmon')
    const senderPhone = phone?.trim() || (reader ? reader.phone : '')

    const payload = await getPayload({ config })

    const inquiry = await payload.create({
      collection: 'inquiries',
      data: {
        type: 'contact',
        ...(reader ? { reader: reader.id } : {}),
        name: senderName,
        phone: senderPhone,
        message: message.trim(),
        status: 'new',
        createdAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      id: inquiry.id,
      message: 'Xabaringiz adminga muvaffaqiyatli yuborildi!',
    })
  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json(
      { error: 'Xabarni yuborishda xatolik yuz berdi' },
      { status: 500 },
    )
  }
}
