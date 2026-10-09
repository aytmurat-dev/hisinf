import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { randomBytes } from 'crypto'
import config from '@/payload.config'
import { isCurrentReaderAdmin, isCurrentReaderSuperAdmin } from '@/lib/current-reader'

export async function GET() {
  try {
    const isAdmin = await isCurrentReaderAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const isSuperAdmin = await isCurrentReaderSuperAdmin()

    const payload = await getPayload({ config })
    const { docs: readers } = await payload.find({
      collection: 'readers',
      sort: '-createdAt',
      limit: 100,
      overrideAccess: true,
    })

    const users = readers.map((r) => {
      const finalRole = r.role ?? 'reader'

      return {
        id: r.id,
        firstName: r.firstName,
        lastName: r.lastName,
        username: r.username,
        phone: r.phone,
        role: finalRole,
        isSuperAdmin: finalRole === 'superadmin',
        createdAt: r.createdAt,
      }
    })

    return NextResponse.json({ users, isSuperAdmin })
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

    const isSuperAdmin = await isCurrentReaderSuperAdmin()

    const body = await req.json()
    const { action, id, firstName, lastName, username, phone, password, role } = body

    const payload = await getPayload({ config })

    if (action === 'delete') {
      if (!id) {
        return NextResponse.json({ error: 'ID talab qilinadi' }, { status: 400 })
      }

      // Foydalanuvchini tekshiramiz
      const targetUser = await payload.findByID({
        collection: 'readers',
        id: Number(id),
        overrideAccess: true,
      })

      if (!targetUser) {
        return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
      }

      const targetRole = targetUser.role ?? 'reader'
      const targetIsSuper = targetRole === 'superadmin'

      if (targetIsSuper) {
        return NextResponse.json({ error: 'Asosiy adminni oʻchirib boʻlmaydi!' }, { status: 400 })
      }

      // Agar o'chirilayotgan user admin bo'lsa, faqat asosiy admin o'chira oladi
      if (targetRole === 'admin') {
        if (!isSuperAdmin) {
          return NextResponse.json({ error: 'Adminni oʻchirish faqat asosiy admin huquqiga kiradi!' }, { status: 403 })
        }
      }

      await payload.delete({
        collection: 'readers',
        id: Number(id),
        overrideAccess: true,
      })
      return NextResponse.json({ success: true, message: 'Foydalanuvchi oʻchirildi' })
    }

    if (action === 'create') {
      const cleanUsername = String(username || '').trim().toLowerCase()
      const cleanPassword = String(password || '').trim()

      if (!cleanUsername || !cleanPassword) {
        return NextResponse.json(
          { error: 'Foydalanuvchi nomi (username) va parol kiritilishi shart!' },
          { status: 400 },
        )
      }

      const selectedRole = role === 'admin' ? 'admin' : 'reader'

      // Admin qo'shish faqat asosiy admin huquqida
      if (selectedRole === 'admin' && !isSuperAdmin) {
        return NextResponse.json(
          { error: 'Yangi admin qoʻshish faqat asosiy admin huquqiga kiradi!' },
          { status: 403 },
        )
      }

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

      const cleanFirstName = String(firstName || cleanUsername).trim()
      const cleanLastName = String(lastName || '').trim()
      const cleanPhone = String(phone || '').trim()

      const created = await payload.create({
        collection: 'readers',
        data: {
          firstName: cleanFirstName,
          lastName: cleanLastName,
          username: cleanUsername,
          phone: cleanPhone,
          password: cleanPassword,
          role: selectedRole,
        },
        overrideAccess: true,
      })

      // Agar rol admin bo'lsa, Payload CMS Users kolleksiyasiga ham sinxronizatsiya qilamiz
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
                password: cleanPassword,
                displayName: `${cleanFirstName} ${cleanLastName}`.trim(),
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
          createdAt: created.createdAt,
        },
      })
    }

    if (action === 'update') {
      if (!id) {
        return NextResponse.json({ error: 'ID talab qilinadi' }, { status: 400 })
      }

      const targetUser = await payload.findByID({
        collection: 'readers',
        id: Number(id),
        overrideAccess: true,
      })

      if (!targetUser) {
        return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
      }

      const targetRole = targetUser.role ?? 'reader'
      const targetIsSuper = targetRole === 'superadmin'

      if (targetIsSuper && role && role !== 'superadmin') {
        return NextResponse.json({ error: 'Asosiy admin rolini oʻzgartirib boʻlmaydi!' }, { status: 400 })
      }

      // Agar rolni adminga/adminlikdan o'zgartirmoqchi bo'lsa, faqat asosiy admin qila oladi
      if ((targetRole === 'admin' || role === 'admin') && !isSuperAdmin) {
        return NextResponse.json(
          { error: 'Admin rolini boshqarish faqat asosiy admin huquqiga kiradi!' },
          { status: 403 },
        )
      }

      const updateData: Record<string, unknown> = {}
      if (firstName !== undefined) updateData.firstName = String(firstName).trim()
      if (lastName !== undefined) updateData.lastName = String(lastName).trim()
      if (username) updateData.username = String(username).trim().toLowerCase()
      if (phone !== undefined) updateData.phone = String(phone).trim()
      // Asosiy admin rolini bu yerdan o'zgartirib bo'lmaydi
      if (role && !targetIsSuper) updateData.role = role === 'admin' ? 'admin' : 'reader'
      if (password) {
        updateData.password = String(password)
      }

      const updated = await payload.update({
        collection: 'readers',
        id: Number(id),
        data: updateData,
        overrideAccess: true,
      })

      // Agar adminga o'zgartirilgan bo'lsa va users da bo'lmasa, uni yaratish
      let staffPasswordNotice: string | undefined
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
                // Parol berilmasa tasodifiy parol; xodim uni "Parolni tiklash" orqali o'rnatadi
                password: password ? String(password) : randomBytes(18).toString('base64url'),
                displayName: `${updated.firstName} ${updated.lastName}`.trim(),
                role: 'admin',
              },
              overrideAccess: true,
            })
            if (!password) {
              staffPasswordNotice = 'Payload admin paroli Parolni tiklash orqali oʻrnatiladi'
            }
          }
        } catch (_staffErr) {
          // ignore
        }
      }

      const finalRole = updated.role ?? 'reader'

      return NextResponse.json({
        success: true,
        user: {
          id: updated.id,
          firstName: updated.firstName,
          lastName: updated.lastName,
          username: updated.username,
          phone: updated.phone,
          role: finalRole,
          createdAt: updated.createdAt,
        },
        notice: staffPasswordNotice,
      })
    }

    return NextResponse.json({ error: 'Nomaʼlum amal' }, { status: 400 })
  } catch (error) {
    console.error('Admin users action error:', error)
    return NextResponse.json({ error: 'Amalni bajarishda xatolik yuz berdi' }, { status: 500 })
  }
}
