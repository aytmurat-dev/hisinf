'use client'

import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const t = useTranslations('theme')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className="grid size-10 place-items-center rounded-full border border-border bg-transparent opacity-40"
        aria-hidden="true"
      />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={t('toggle')}
      title={t('toggle')}
      className="grid size-10 place-items-center rounded-full border border-border bg-transparent cursor-pointer transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:rotate-180 hover:border-line"
    >
      <span className="size-4 rounded-full border-[1.5px] border-fg [background:linear-gradient(90deg,var(--fg)_50%,transparent_50%)]" />
    </button>
  )
}
