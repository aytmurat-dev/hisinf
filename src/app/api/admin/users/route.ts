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

    const users = readers.map((r) => ({
      id: r.id,
      firstName: r.firstName,
      lastName: r.lastName,
      username: r.username,
      phone: r.phone,
      displayPassword: r.displayPassword || '******',
      createdAt: r.createdAt,
    }))

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
    const { action, id, firstName, lastName, username, phone, password } = body

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

    if (action === 'update') {
      if (!id) {
        return NextResponse.json({ error: 'ID talab qilinadi' }, { status: 400 })
      }

      const updateData: Record<string, unknown> = {}
      if (firstName) updateData.firstName = String(firstName).trim()
      if (lastName) updateData.lastName = String(lastName).trim()
      if (username) updateData.username = String(username).trim().toLowerCase()
      if (phone) updateData.phone = String(phone).trim()
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

      return NextResponse.json({
        success: true,
        user: {
          id: updated.id,
          firstName: updated.firstName,
          lastName: updated.lastName,
          username: updated.username,
          phone: updated.phone,
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
