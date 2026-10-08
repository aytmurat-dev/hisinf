'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { HeaderSearch } from './HeaderSearch'
import { Menu, X, Shield, LogOut } from 'lucide-react'

export function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ firstName: string; username: string } | null>(null)

  useEffect(() => {
    fetch('/api/readers/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user)
        } else {
          setCurrentUser(null)
        }
      })
      .catch(() => setCurrentUser(null))
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/readers/logout', { method: 'POST' })
    setCurrentUser(null)
    router.refresh()
  }

  const isAdmin = currentUser?.username === 'admin'

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Name */}
          <div className="flex items-center gap-3">
            <Link href="/" prefetch={true} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-[var(--gold)]/15 border border-[var(--gold)] flex items-center justify-center text-[var(--gold)] group-hover:scale-105 transition-transform shadow-xs">
                <span className="font-serif font-black text-lg tracking-wider text-[var(--gold)]">H</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg tracking-wide text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                  HISINF
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[var(--gold)] font-medium -mt-1">
                  1924 Tarix Portali
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              prefetch={true}
              className={`text-xs uppercase tracking-wider font-medium transition-colors ${
                pathname === '/' ? 'text-[var(--gold)] font-semibold' : 'text-[var(--foreground)] hover:text-[var(--gold)]'
              }`}
            >
              {t('home')}
            </Link>
            <Link
              href="/maqolalar"
              prefetch={true}
              className={`text-xs uppercase tracking-wider font-medium transition-colors ${
                pathname.startsWith('/maqolalar') ? 'text-[var(--gold)] font-semibold' : 'text-[var(--foreground)] hover:text-[var(--gold)]'
              }`}
            >
              {t('posts')}
            </Link>

            {/* Admin bo'lsa, ichki admin panel tugmasi */}
            {isAdmin && (
              <Link
                href="/admin"
                prefetch={true}
                className="flex items-center gap-1.5 text-xs text-[var(--gold)] hover:text-[var(--gold-light)] font-medium transition-colors border border-[var(--gold)]/50 hover:border-[var(--gold)] px-3 py-1 rounded-full bg-[var(--gold)]/10 shadow-xs"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* Right Toolbar: Search, Lang & Theme yonma-yon, User Auth */}
          <div className="flex items-center gap-2.5">
            {/* Live Search Icon */}
            <HeaderSearch />

            {/* Language & Theme side-by-side */}
            <div className="flex items-center gap-1.5">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            {/* User Account / Login */}
            <div className="hidden sm:flex items-center">
              {currentUser ? (
                <div className="flex items-center gap-2 pl-2 border-l border-[var(--border)]">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-xs font-medium">
                    <span className="text-[var(--gold)]">●</span>
                    <span className="max-w-[100px] truncate">{currentUser.firstName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    title={t('logout')}
                    className="p-1.5 rounded-full hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/kirish"
                  prefetch={true}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--gold)] text-black rounded-lg text-xs font-semibold hover:brightness-110 transition-all shadow-xs cursor-pointer ml-1"
                >
                  <span>{t('login')}</span>
                </Link>
              )}
            </div>

            {/* Mobile burger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--card)] px-4 py-4 space-y-3 animate-fade-in">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--secondary)]"
            >
              {t('home')}
            </Link>
            <Link
              href="/maqolalar"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--secondary)]"
            >
              {t('posts')}
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-[var(--gold)] flex items-center gap-2 hover:bg-[var(--secondary)]"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {currentUser.firstName} (@{currentUser.username})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="text-xs text-[var(--destructive)] font-medium"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Link
                  href="/kirish"
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-semibold bg-[var(--gold)] text-black rounded-lg"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/royxatdan-otish"
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-semibold border border-[var(--border)] rounded-lg"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
