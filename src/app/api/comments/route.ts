import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCurrentReader } from '@/lib/reader-auth'

export async function POST(req: NextRequest) {
  try {
    const reader = await getCurrentReader()

    // Foydalanuvchi talabi: izoh yozish uchun tizimga kirish MAJBURIY!
    if (!reader) {
      return NextResponse.json(
        { error: 'Izoh qoldirish uchun tizimga kirish majburiy!' },
        { status: 401 },
      )
    }

    const { postId, body } = await req.json()

    const text = typeof body === 'string' ? body.trim() : ''
    if (!postId || !text) {
      return NextResponse.json(
        { error: 'Izoh matni boʻsh boʻlmasligi kerak' },
        { status: 400 },
      )
    }
    if (text.length < 3 || text.length > 1000) {
      return NextResponse.json(
        { error: 'Izoh 3 dan 1000 belgigacha boʻlishi kerak' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    const comment = await payload.create({
      collection: 'comments',
      data: {
        context: 'post',
        status: 'pending',
        post: Number(postId),
        reader: reader.id,
        authorName: `${reader.firstName} ${reader.lastName}`.trim() || reader.username,
        body: text,
        createdAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        authorName: comment.authorName,
        body: comment.body,
        createdAt: comment.createdAt,
      },
    })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json(
      { error: 'Izoh qoldirishda xatolik yuz berdi' },
      { status: 500 },
    )
  }
}
