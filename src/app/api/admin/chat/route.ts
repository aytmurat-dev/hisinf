import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { isStaffUser } from '@/access'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user || !isStaffUser(user)) {
      return Response.json({ error: 'Ruxsat yoʻq' }, { status: 403 })
    }

    // 1. Faol xodimlar (adminlar, muharrirlar, mualliflar)
    const usersResult = await payload.find({
      collection: 'users',
      where: {
        isActive: { equals: true },
      },
      depth: 0,
      limit: 100,
      overrideAccess: true,
    })

    const admins = usersResult.docs.map((u) => ({
      id: u.id,
      name: u.displayName || u.username || u.email,
      username: u.username,
      role: u.role,
      avatar: u.avatar,
    }))

    // 2. Foydalanuvchi qatnashayotgan suhbatlar
    const conversationsResult = await payload.find({
      collection: 'admin-conversations',
      where: {
        participants: { contains: user.id },
      },
      sort: '-lastMessageAt',
      depth: 1,
      limit: 50,
      overrideAccess: true,
    })

    return Response.json({
      currentUser: {
        id: user.id,
        name: user.displayName || user.username || user.email,
        username: user.username,
        role: user.role,
      },
      admins,
      conversations: conversationsResult.docs,
    })
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
      isGroup?: boolean
      name?: string
      participantIds: number[]
    }

    const { isGroup, name, participantIds } = body

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return Response.json({ error: 'Ishtirokchilar tanlanmagan' }, { status: 400 })
    }

    const allParticipants = Array.from(new Set([user.id, ...participantIds.map(Number)]))

    // 1-on-1 chat boʻlsa va allaqachon mavjud boʻlsa, oʻshani qaytarish
    if (!isGroup && allParticipants.length === 2) {
      const otherUserId = allParticipants.find((id) => id !== user.id)
      const existing = await payload.find({
        collection: 'admin-conversations',
        where: {
          and: [
            { isGroup: { equals: false } },
            { participants: { contains: user.id } },
            { participants: { contains: otherUserId } },
          ],
        },
        depth: 1,
        limit: 1,
        overrideAccess: true,
      })

      if (existing.docs.length > 0) {
        return Response.json({ conversation: existing.docs[0] })
      }
    }

    const newDoc = await payload.create({
      collection: 'admin-conversations',
      data: {
        isGroup: Boolean(isGroup),
        name: isGroup ? (name?.trim() || 'Guruh suhbati') : undefined,
        participants: allParticipants,
        createdBy: user.id,
        lastMessage: 'Suhbat boshlandi',
        lastMessageAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    // To'liq populated qilib qaytaramiz
    const populated = await payload.findByID({
      collection: 'admin-conversations',
      id: newDoc.id,
      depth: 1,
      overrideAccess: true,
    })

    return Response.json({ conversation: populated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server xatosi'
    return Response.json({ error: message }, { status: 500 })
  }
}
