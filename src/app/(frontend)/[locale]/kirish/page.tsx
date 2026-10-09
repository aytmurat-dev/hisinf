'use client'

import React, { useState, Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { Shield, KeyRound, User, ArrowRight } from 'lucide-react'

function LoginForm() {
  const t = useTranslations('auth')
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/readers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Kirishda xatolik yuz berdi')
        return
      }

      if ((data.reader?.role === 'admin' || data.reader?.role === 'superadmin') && redirect === '/') {
        window.location.href = '/admin'
      } else {
        window.location.href = redirect
      }
    } catch (_err) {
      setError('Server bilan bogʻlanishda xatolik')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/15 border border-[var(--gold)] mx-auto flex items-center justify-center text-[var(--gold)]">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-black text-[var(--foreground)]">
            {t('loginTitle')}
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            {t('loginSubtitle')}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 text-xs text-[var(--destructive)] text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{t('username')}</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masalan: ali_tarix"
              required
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{t('password')}</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--gold)] text-black font-semibold text-sm rounded-xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>{loading ? 'Tekshirilmoqda...' : t('submitLogin')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[var(--border)]">
          <Link
            href="/royxatdan-otish"
            className="text-xs text-[var(--gold)] hover:underline font-medium"
          >
            {t('noAccount')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-16 text-center text-xs text-[var(--muted-foreground)]">
          Yuklanmoqda...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
