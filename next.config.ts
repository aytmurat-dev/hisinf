import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const r2PublicURL = process.env.R2_PUBLIC_URL

const remotePatterns: Array<{ hostname: string; protocol: 'http' | 'https' }> = []

for (const urlStr of [serverURL, r2PublicURL].filter(Boolean) as string[]) {
  try {
    const url = new URL(urlStr)
    remotePatterns.push({
      hostname: url.hostname,
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
    })
  } catch {
    // ignore invalid URLs in local development
  }
}

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    remotePatterns,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
