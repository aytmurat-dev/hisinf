'use client'

import React from 'react'
import Link from 'next/link'
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

export function PreviewBanner(): React.JSX.Element {
  const router = useRouter()

  return (
    <>
      <RefreshRouteOnSave
        refresh={() => router.refresh()}
        serverURL={process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}
      />
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-stone-900 text-stone-100 text-xs py-1.5 px-4 flex items-center justify-between border-b border-stone-800 shadow-md">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-medium">Qoralama koʻrinishi (Draft Preview)</span>
        </div>
        <Link
          href="/next/exit-preview"
          prefetch={false}
          className="text-stone-300 hover:text-white underline underline-offset-2 transition-colors font-mono"
        >
          Chiqish &rarr;
        </Link>
      </div>
    </>
  )
}
