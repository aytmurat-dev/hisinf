'use client'

import React, { useEffect, useRef } from 'react'

export function Reveal({
  delay = 0,
  as: Tag = 'div',
  className,
  children,
}: {
  delay?: number
  as?: React.ElementType
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          el.animate(
            [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }],
            { duration: 700, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' },
          )
          io.unobserve(el)
        }
      },
      { threshold: 0.12 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
