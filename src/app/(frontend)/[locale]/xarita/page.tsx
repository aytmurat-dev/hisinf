import React from 'react'
import { setRequestLocale } from 'next-intl/server'
import { HistoricalMap } from '@/components/map/HistoricalMap'
import { Compass, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export const revalidate = 3600

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const isKaa = locale === 'kaa'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header Info */}
      <div className="border-b border-[var(--border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>
              {isKaa
                ? '1924-jılǵı Milliy-aymaqlıq shegaralanıw'
                : '1924-yilgi Milliy-hududiy chegaralanish'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[var(--foreground)]">
            {isKaa ? 'Interaktiv Tariyxıy Karta' : 'Interaktiv Tarixiy Xarita'}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)] max-w-2xl leading-relaxed">
            {isKaa
              ? 'Túrkstan, Buxara hám Xorezm respublikalarınan jańa Ózbekstan SSR hám Qaraqalpaqstan Avtonomiyalı Wálayatınıń dúziliwi, birinshi paytaxtlar Samarqand hám Tórtkúl qalaları kartada.'
              : 'Turkiston, Buxoro va Xorazm respublikalaridan yangi Oʻzbekiston SSR va Qoraqalpogʻiston Muxtor Viloyatining tashkil topishi, dastlabki poytaxtlar Samarqand va Toʻrtkoʻl shaharlari xaritada.'}
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-3">
          <Link
            href="/xronologiya"
            className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-amber-400 text-xs font-semibold text-[var(--foreground)] transition-all flex items-center gap-1.5"
          >
            <span>{isKaa ? '1924 Xronologiyası' : '1924 Xronologiyasi'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/shaxslar"
            className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-amber-400 text-xs font-semibold text-[var(--foreground)] transition-all flex items-center gap-1.5"
          >
            <span>{isKaa ? 'Tariyxıy Tulǵalar' : 'Tarixiy Shaxslar'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Interactive Map Component */}
      <HistoricalMap locale={locale} />
    </div>
  )
}
