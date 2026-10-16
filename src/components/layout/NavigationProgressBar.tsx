'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname } from 'next/navigation'

function ProgressBarInner() {
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)

  // Reset navigation indicator on route change
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  // Global click interceptor for internal links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      // Don't trigger for external links, anchors, or new tab clicks
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        target.target === '_blank' ||
        e.ctrlKey ||
        e.metaKey
      ) {
        return
      }

      // Check if href is different from current URL
      const currentUrl = window.location.pathname + window.location.search
      if (href !== currentUrl) {
        setIsNavigating(true)
      }
    }

    document.addEventListener('click', handleClick, { capture: true })
    return () => document.removeEventListener('click', handleClick, { capture: true })
  }, [])

  if (!isNavigating) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent overflow-hidden pointer-events-none">
      <div className="h-full bg-[var(--primary)] animate-hf-progress" />
    </div>
  )
}

export function NavigationProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  )
}

