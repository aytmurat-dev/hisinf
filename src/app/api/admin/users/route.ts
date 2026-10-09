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
    const { docs: readers } = await payload.find({
      collection: 'readers',
      sort: '-createdAt',
      limit: 100,
      overrideAccess: true,
    })

    const users = readers.map((r) => {
      const readerData = r as unknown as { role?: string }
      return {
        id: r.id,
        firstName: r.firstName,
        lastName: r.lastName,
        username: r.username,
        phone: r.phone,
        role: readerData.role || (r.username === 'admin' ? 'admin' : 'reader'),
        displayPassword: r.displayPassword || '******',
        createdAt: r.createdAt,
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Admin users fetch error:', error)
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await isCurrentReaderAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const body = await req.json()
    const { action, id, firstName, lastName, username, phone, password, role } = body

    const payload = await getPayload({ config })

    if (action === 'delete') {
      if (!id) {
        return NextResponse.json({ error: 'ID talab qilinadi' }, { status: 400 })
      }
      await payload.delete({
        collection: 'readers',
        id: Number(id),
        overrideAccess: true,
      })
      return NextResponse.json({ success: true, message: 'Foydalanuvchi oʻchirildi' })
    }

    if (action === 'create') {
      if (!firstName || !lastName || !username || !password || !phone) {
        return NextResponse.json(
          { error: 'Barcha maydonlarni toʻldirish majburiy!' },
          { status: 400 },
        )
      }

      const cleanUsername = String(username).trim().toLowerCase()

      const existingReaders = await payload.find({
        collection: 'readers',
        where: { username: { equals: cleanUsername } },
        overrideAccess: true,
      })

      if (existingReaders.docs.length > 0) {
        return NextResponse.json(
          { error: 'Ushbu foydalanuvchi nomi (username) allaqachon band!' },
          { status: 400 },
        )
      }

      const selectedRole = role === 'admin' ? 'admin' : 'reader'

      const created = await payload.create({
        collection: 'readers',
        data: {
          firstName: String(firstName).trim(),
          lastName: String(lastName).trim(),
          username: cleanUsername,
          phone: String(phone).trim(),
          password: String(password),
          displayPassword: String(password),
          role: selectedRole,
        },
        overrideAccess: true,
      })

      // Agar rol admin bo'lsa, Payload CMS Users kolleksiyasiga ham qo'shib qo'yamiz
      if (selectedRole === 'admin') {
        try {
          const existingStaff = await payload.find({
            collection: 'users',
            where: { username: { equals: cleanUsername } },
            overrideAccess: true,
          })
          if (existingStaff.docs.length === 0) {
            await payload.create({
              collection: 'users',
              data: {
                username: cleanUsername,
                email: `${cleanUsername}@hisinf.uz`,
                password: String(password),
                displayName: `${String(firstName).trim()} ${String(lastName).trim()}`,
                role: 'admin',
              },
              overrideAccess: true,
            })
          }
        } catch (_staffErr) {
          console.error('Payload users sync error:', _staffErr)
        }
      }

      return NextResponse.json({
        success: true,
        user: {
          id: created.id,
          firstName: created.firstName,
          lastName: created.lastName,
          username: created.username,
          phone: created.phone,
          role: selectedRole,
          displayPassword: created.displayPassword || password,
          createdAt: created.createdAt,
        },
      })
    }

    if (action === 'update') {
      if (!id) {
        return NextResponse.json({ error: 'ID talab qilinadi' }, { status: 400 })
      }

      const updateData: Record<string, unknown> = {}
      if (firstName) updateData.firstName = String(firstName).trim()
      if (lastName) updateData.lastName = String(lastName).trim()
      if (username) updateData.username = String(username).trim().toLowerCase()
      if (phone) updateData.phone = String(phone).trim()
      if (role) updateData.role = role === 'admin' ? 'admin' : 'reader'
      if (password) {
        updateData.password = String(password)
        updateData.displayPassword = String(password)
      }

      const updated = await payload.update({
        collection: 'readers',
        id: Number(id),
        data: updateData,
        overrideAccess: true,
      })

      const updatedData = updated as unknown as { role?: string }

      // Agar adminga o'zgartirilgan bo'lsa va users da bo'lmasa, uni yaratish
      if (updateData.role === 'admin' && updated.username) {
        try {
          const existingStaff = await payload.find({
            collection: 'users',
            where: { username: { equals: updated.username } },
            overrideAccess: true,
          })
          if (existingStaff.docs.length === 0) {
            await payload.create({
              collection: 'users',
              data: {
                username: updated.username,
                email: `${updated.username}@hisinf.uz`,
                password: String(password || 'admin123'),
                displayName: `${updated.firstName} ${updated.lastName}`.trim(),
                role: 'admin',
              },
              overrideAccess: true,
            })
          }
        } catch (_staffErr) {
          // ignore
        }
      }

      return NextResponse.json({
        success: true,
        user: {
          id: updated.id,
          firstName: updated.firstName,
          lastName: updated.lastName,
          username: updated.username,
          phone: updated.phone,
          role: updatedData.role || (updated.username === 'admin' ? 'admin' : 'reader'),
          displayPassword: updated.displayPassword || password,
          createdAt: updated.createdAt,
        },
      })
    }

    return NextResponse.json({ error: 'Nomaʼlum amal' }, { status: 400 })
  } catch (error) {
    console.error('Admin users action error:', error)
    return NextResponse.json({ error: 'Amalni bajarishda xatolik yuz berdi' }, { status: 500 })
  }
}
