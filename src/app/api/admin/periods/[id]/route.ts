import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const { id } = await params
  try {
    const payload = await getPayloadClient()
    const doc = await payload.findByID({
      collection: 'periods',
      id: Number(id),
      overrideAccess: true,
    })
    return NextResponse.json(doc)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Davr topilmadi'
    return NextResponse.json({ error: message }, { status: 404 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const { id } = await params
  try {
    const payload = await getPayloadClient()
    const body = await req.json()
    const {
      title,
      shortTitle,
      yearsLabel,
      startYear,
      endYear,
      description,
      language,
      color,
      order,
    } = body

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = String(title).trim()
    if (shortTitle !== undefined) updateData.shortTitle = String(shortTitle).trim()
    if (yearsLabel !== undefined) updateData.yearsLabel = String(yearsLabel).trim()
    if (startYear !== undefined) {
      updateData.startYear = startYear !== null && startYear !== '' ? Number(startYear) : null
    }
    if (endYear !== undefined) {
      updateData.endYear = endYear !== null && endYear !== '' ? Number(endYear) : null
    }
    if (description !== undefined) updateData.description = String(description).trim()
    if (language !== undefined) updateData.language = language
    if (color !== undefined) updateData.color = color
    if (order !== undefined) updateData.order = Number(order)

    const updated = await payload.update({
      collection: 'periods',
      id: Number(id),
      data: updateData,
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, doc: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Davrni yangilashda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  const { id } = await params
  try {
    const payload = await getPayloadClient()
    await payload.delete({
      collection: 'periods',
      id: Number(id),
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, message: 'Davr muvaffaqiyatli oʻchirildi' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Davrni oʻchirishda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
