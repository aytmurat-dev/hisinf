import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params
    if (!segments || segments.length === 0) {
      return new NextResponse('Bad request', { status: 400 })
    }

    const decodedName = segments.map((s) => decodeURIComponent(s)).join('/')

    // Prevent directory traversal
    const safeName = path.normalize(decodedName).replace(/^(\.\.[\/\\])+/, '')

    const publicPath = path.resolve(process.cwd(), 'public/media', safeName)
    const mediaPath = path.resolve(process.cwd(), 'media', safeName)

    let targetPath: string | null = null
    if (fs.existsSync(publicPath)) {
      targetPath = publicPath
    } else if (fs.existsSync(mediaPath)) {
      targetPath = mediaPath
    }

    if (!targetPath) {
      return new NextResponse('File not found', { status: 404 })
    }

    const ext = path.extname(targetPath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    const fileBuffer = await fs.promises.readFile(targetPath)

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving media file:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
