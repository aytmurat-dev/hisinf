import { NextResponse } from 'next/server'
import { getCurrentReader } from '@/lib/reader-auth'

export async function GET() {
  const reader = await getCurrentReader()
  if (!reader) {
    return NextResponse.json({ user: null })
  }
  return NextResponse.json({ user: reader })
}
