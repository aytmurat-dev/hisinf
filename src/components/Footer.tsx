'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { MessageSquare, Phone, ShieldCheck, Heart } from 'lucide-react'

export function Footer() {
  const t = useTranslations('contact')
  const tNav = useTranslations('nav')

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
              Oʻzbekiston va Qoraqalpogʻistonning koʻp asrlik tarixi, madaniyati, nodir meʼmoriy yodgorliklari va buyuk allomalari haqida ishonchli maʼlumotlar portali.
            </p>
          </div>

          {/* Col 2: Sahifalar */}
          <div className="space-y-3">
            <h3 className="font-serif font-semibold text-sm text-[var(--gold)] uppercase tracking-wider">
              {tNav('posts')}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href="/maqolalar" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {tNav('posts')}
                </Link>
              </li>
              <li>
                <a
                  href="/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Admin panel (admin / admin123)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Adminga murojaat (Foydalanuvchi talabi) */}
          <div className="space-y-3">
            <h3 className="font-serif font-semibold text-sm text-[var(--gold)] uppercase tracking-wider">
              {t('adminContact')}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Taklif, mulohaza yoki savollaringiz boʻlsa, bizga toʻgʻridan-toʻgʻri murojaat qilishingiz mumkin:
            </p>

            <div className="flex flex-col gap-2.5 pt-1">
              {/* Veb-sayt o'zidan (Chat sahifasi) */}
              <Link
                href="/chat"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--gold)]/50 hover:border-[var(--gold)] text-xs font-medium text-[var(--foreground)] hover:text-[var(--gold)] transition-all shadow-xs group"
              >
                <MessageSquare className="w-4 h-4 text-[var(--gold)] group-hover:scale-110 transition-transform" />
                <span>{t('fromWebsite')}</span>
              </Link>

              {/* Telefon orqali murojaat */}
              <a
                href="tel:+998901234567"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:border-[var(--gold)] text-xs font-medium text-[var(--foreground)] hover:text-[var(--gold)] transition-all shadow-xs group"
              >
                <Phone className="w-4 h-4 text-[var(--gold)] group-hover:scale-110 transition-transform" />
                <span>{t('callAdmin')}: +998 (90) 123-45-67</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted-foreground)]">
          <p>© {new Date().getFullYear()} HISINF — Tarixiy maʼlumotlar portali.</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Oʻzbekiston va Qoraqalpogʻiston tarixi uchun</span>
            <Heart className="w-3 h-3 text-[var(--gold)] inline fill-[var(--gold)]" />
          </p>
        </div>
      </div>
    </footer>
  )
}
