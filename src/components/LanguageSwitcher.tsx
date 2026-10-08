'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: 'uz' | 'kaa') => {
    if (newLocale === locale) return
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-1 bg-[var(--secondary)]/60 border border-[var(--border)] rounded-full p-0.5 text-xs">
      <div className="pl-1.5 text-[var(--muted-foreground)]">
        <Globe className="w-3.5 h-3.5 text-[var(--gold)]" />
      </div>
      <button
        type="button"
        onClick={() => switchLocale('uz')}
        className={`px-2 py-1 rounded-full font-medium transition-all cursor-pointer ${
          locale === 'uz'
            ? 'bg-[var(--gold)] text-black font-semibold shadow-xs'
            : 'text-[var(--foreground)] hover:text-[var(--gold)]'
        }`}
      >
        OʻZ
      </button>
      <button
        type="button"
        onClick={() => switchLocale('kaa')}
        className={`px-2 py-1 rounded-full font-medium transition-all cursor-pointer ${
          locale === 'kaa'
            ? 'bg-[var(--gold)] text-black font-semibold shadow-xs'
            : 'text-[var(--foreground)] hover:text-[var(--gold)]'
        }`}
      >
        QQ
      </button>
    </div>
  )
}
