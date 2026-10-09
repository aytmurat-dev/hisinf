'use client'

import { useEffect } from 'react'

export function InkCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!canHover) return

    document.documentElement.classList.add('fx-cursor')

    const handleMouseDown = (e: MouseEvent) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const target = e.target as HTMLElement | null
      if (target?.closest('input, textarea, [contenteditable="true"]')) return

      const span = document.createElement('span')
      span.style.position = 'fixed'
      span.style.left = `${e.clientX}px`
      span.style.top = `${e.clientY}px`
      span.style.width = '10px'
      span.style.height = '10px'
      span.style.margin = '-5px 0 0 -5px'
      span.style.borderRadius = '50%'
      span.style.border = '1.5px solid var(--primary)'
      span.style.pointerEvents = 'none'
      span.style.zIndex = '9999'

      document.body.appendChild(span)

      const anim = span.animate(
        [
          { transform: 'scale(0.4)', opacity: 0.9 },
          { transform: 'scale(3.2)', opacity: 0 },
        ],
        {
          duration: 520,
          easing: 'cubic-bezier(.2,.7,.2,1)',
        },
      )

      anim.onfinish = () => {
        span.remove()
      }
    }

    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.documentElement.classList.remove('fx-cursor')
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return null
}
