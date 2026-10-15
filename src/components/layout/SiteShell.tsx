'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NavigationProgressBar } from './NavigationProgressBar'

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.includes('/admin')

  if (isAdmin) {
    return (
      <>
        <NavigationProgressBar />
        <main className="flex-1 min-h-screen">{children}</main>
      </>
    )
  }

  return (
    <>
      <NavigationProgressBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
