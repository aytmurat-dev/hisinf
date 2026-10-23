'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { MessageSquare, Phone, Heart } from 'lucide-react'

export function Footer() {
  const t = useTranslations('contact')
  const tNav = useTranslations('nav')
  const tFooter = useTranslations('footer')

  return (
    <footer className="bg-[var(--secondary)]/70 border-t border-[var(--border)] pt-12 pb-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-[var(--border)]">
          {/* Col 1: About Portal */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[var(--gold)]/15 border border-[var(--gold)] flex items-center justify-center text-[var(--gold)]">
                <span className="font-serif font-black text-sm">H</span>
              </div>
              <span className="font-serif font-bold text-lg text-[var(--foreground)]">HISINF</span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed max-w-sm">
              {tFooter('about')}
            </p>
          </div>

          {/* Col 2: Bo'limlar */}
          <div className="space-y-3">
            <h3 className="font-serif font-semibold text-sm text-[var(--gold)] uppercase tracking-wider">
              {tFooter('sections')}
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <li>
                <Link href="/" prefetch={true} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href="/maqolalar" prefetch={true} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {tNav('posts')}
                </Link>
              </li>
              <li>
                <Link href="/xronologiya" prefetch={true} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {tNav('timeline')}
                </Link>
              </li>
              <li>
                <Link href="/shaxslar" prefetch={true} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {tNav('persons')}
                </Link>
              </li>
              <li>
                <Link href="/xarita" prefetch={true} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {tNav('map')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Adminga murojaat */}
          <div className="space-y-3">
            <h3 className="font-serif font-semibold text-sm text-[var(--gold)] uppercase tracking-wider">
              {t('adminContact')}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              {tFooter('callDesc')}
            </p>

            <div className="flex flex-col gap-2.5 pt-1">
              {/* Telegram orqali adminga murojaat */}
              <a
                href="https://t.me/sifaddinov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--card)] border border-[#24A1DE]/40 hover:border-[#24A1DE] text-xs font-medium text-[var(--foreground)] hover:text-[#24A1DE] active:scale-95 transition-all shadow-xs group"
              >
                <svg className="w-4 h-4 text-[#24A1DE] group-hover:scale-110 transition-transform fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                <span>Telegram: @sifaddinov</span>
              </a>

              {/* Telefon orqali murojaat */}
              <a
                href="tel:+998881725455"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:border-[var(--gold)] text-xs font-medium text-[var(--foreground)] hover:text-[var(--gold)] active:scale-95 transition-all shadow-xs group"
              >
                <Phone className="w-4 h-4 text-[var(--gold)] group-hover:scale-110 transition-transform shrink-0" />
                <span>{t('callAdmin')}: +998 88 172 54 55</span>
              </a>

              {/* Veb-sayt o'zidan (Chat sahifasi) */}
              <Link
                href="/chat"
                prefetch={true}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:border-[var(--gold)] text-xs font-medium text-[var(--foreground)] hover:text-[var(--gold)] active:scale-95 transition-all shadow-xs group"
              >
                <MessageSquare className="w-4 h-4 text-[var(--gold)] group-hover:scale-110 transition-transform shrink-0" />
                <span>{t('fromWebsite')}</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted-foreground)]">
          <p>© {new Date().getFullYear()} {tFooter('copyright')}</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>{tFooter('dedication')}</span>
            <Heart className="w-3 h-3 text-[var(--gold)] inline fill-[var(--gold)]" />
          </p>
        </div>
      </div>
    </footer>
  )
}
