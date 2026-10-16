import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentAdmin } from '@/lib/admin-auth'
import { slugify } from '@/lib/slugify'

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    const { docs: periods } = await payload.find({
      collection: 'periods',
      limit: 100,
      sort: 'order',
      overrideAccess: true,
    })

    return NextResponse.json({ docs: periods })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Davrlarni olishda xatolik'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    const body = await req.json()
    const {
      title,
      shortTitle = '',
      yearsLabel = '',
      startYear,
      endYear,
      description = '',
      language = 'both',
      color = 'ochre',
      order = 1,
    } = body

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Davr nomi kiritilishi shart' }, { status: 400 })
    }

    const trimmedTitle = title.trim()
    const baseSlug = slugify(trimmedTitle) || `period-${Date.now()}`
    let uniqueSlug = baseSlug

    const existing = await payload.find({
      collection: 'periods',
      where: { slug: { equals: uniqueSlug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`
    }

    const created = await payload.create({
      collection: 'periods',
      data: {
        title: trimmedTitle,
        shortTitle: shortTitle.trim() || trimmedTitle,
        slug: uniqueSlug,
        yearsLabel: yearsLabel.trim() || undefined,
        startYear: startYear !== undefined && startYear !== null && startYear !== '' ? Number(startYear) : undefined,
        endYear: endYear !== undefined && endYear !== null && endYear !== '' ? Number(endYear) : undefined,
        description: description.trim() || undefined,
        language: (language || 'both') as 'both' | 'uz' | 'kaa',
        color: color || 'ochre',
        order: Number(order) || 1,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, doc: created })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Davr yaratishda xatolik yuz berdi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
