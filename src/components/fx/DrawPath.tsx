'use client'

import React, { useEffect, useRef } from 'react'

export interface DrawPathProps extends React.SVGProps<SVGPathElement> {
  d: string
}

export function DrawPath({ d, className, style, ...props }: DrawPathProps) {
  const ref = useRef<SVGPathElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return

    const length = el.getTotalLength ? el.getTotalLength() : 1000
    el.style.strokeDasharray = `${length}`
    el.style.strokeDashoffset = `${length}`

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          el.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1)'
          el.style.strokeDashoffset = '0'
          io.unobserve(el)
        }
      },
      { threshold: 0.2 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return <path ref={ref} d={d} className={className} style={style} {...props} />
}
