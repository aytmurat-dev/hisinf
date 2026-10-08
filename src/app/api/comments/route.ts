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

    if (!postId || !body || !body.trim()) {
      return NextResponse.json(
        { error: 'Izoh matni boʻsh boʻlmasligi kerak' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    const comment = await payload.create({
      collection: 'comments',
      data: {
        post: Number(postId),
        reader: reader.id,
        authorName: `${reader.firstName} ${reader.lastName}`,
        body: body.trim(),
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
