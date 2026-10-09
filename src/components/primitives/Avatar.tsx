import React from 'react'
import { initials } from '@/lib/initials'
import { avatarColor } from '@/lib/avatar-color'
import { cn } from '@/lib/cn'

export function Avatar({
  name,
  id,
  size = 36,
  className,
}: {
  name?: string | null
  id?: number | string | null
  size?: 26 | 34 | 36 | 44 | number
  className?: string
}) {
  const letters = initials(name)
  const bg = avatarColor(id ?? name)
  const fontSize = Math.max(10, Math.round(size * 0.38))

  return (
    <span
      className={cn(
        'inline-grid place-items-center rounded-full text-bg font-serif font-semibold shrink-0 select-none overflow-hidden leading-none',
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        fontSize: `${fontSize}px`,
      }}
      title={name ?? undefined}
      aria-label={name ?? undefined}
    >
      {letters}
    </span>
  )
}
