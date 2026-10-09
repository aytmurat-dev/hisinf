import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { isStaffUser } from '@/access'

export async function GET(req: Request) {
  try {
    const payload = await getPayloadClient()
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user || !isStaffUser(user)) {
      return Response.json({ error: 'Ruxsat yoʻq' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const conversationId = Number(searchParams.get('conversationId'))
    if (!conversationId) {
      return Response.json({ error: 'conversationId kiritilmadi' }, { status: 400 })
    }

    // Suhbatdagi xabarlar
    const messages = await payload.find({
      collection: 'admin-messages',
      where: {
        conversation: { equals: conversationId },
      },
      sort: 'createdAt',
      depth: 1,
      limit: 150,
      overrideAccess: true,
    })

    return Response.json({ messages: messages.docs })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server xatosi'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user || !isStaffUser(user)) {
      return Response.json({ error: 'Ruxsat yoʻq' }, { status: 403 })
    }

    const body = (await req.json()) as {
      conversationId: number
      text: string
    }

    const conversationId = Number(body.conversationId)
    const text = String(body.text || '').trim()

    if (!conversationId || !text) {
      return Response.json({ error: 'Xabar matni boʻsh' }, { status: 400 })
    }

    const newMessage = await payload.create({
      collection: 'admin-messages',
      data: {
        conversation: conversationId,
        sender: user.id,
        text,
      },
      overrideAccess: true,
    })

    // Suhbatning oxirgi xabarini yangilaymiz
    await payload.update({
      collection: 'admin-conversations',
      id: conversationId,
      data: {
        lastMessage: text.slice(0, 100),
        lastMessageAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    // To'liq populated qilib qaytaramiz
    const populated = await payload.findByID({
      collection: 'admin-messages',
      id: newMessage.id,
      depth: 1,
      overrideAccess: true,
    })

    return Response.json({ message: populated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server xatosi'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const payload = await getPayloadClient()
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user || !isStaffUser(user)) {
      return Response.json({ error: 'Ruxsat yoʻq' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const messageId = Number(searchParams.get('messageId'))

    if (!messageId) {
      return Response.json({ error: 'messageId kiritilmadi' }, { status: 400 })
    }

    // Xabarni topamiz
    const msg = await payload.findByID({
      collection: 'admin-messages',
      id: messageId,
      depth: 0,
      overrideAccess: true,
    })

    if (!msg) {
      return Response.json({ error: 'Xabar topilmadi' }, { status: 404 })
    }

    const senderId =
      typeof msg.sender === 'object' && msg.sender !== null
        ? (msg.sender as { id: number }).id
        : Number(msg.sender)

    // Faqat xabarni yozgan admin yoki bosh admin o'chira oladi
    if (senderId !== user.id && user.role !== 'admin') {
      return Response.json(
        { error: 'Ushbu xabarni faqat muallifi yoki bosh admin oʻchira oladi' },
        { status: 403 },
      )
    }

    await payload.delete({
      collection: 'admin-messages',
      id: messageId,
      overrideAccess: true,
    })

    return Response.json({ success: true, deletedId: messageId })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server xatosi'
    return Response.json({ error: message }, { status: 500 })
  }
}

