'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { UserPlus, User, KeyRound, Phone, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const t = useTranslations('auth')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/readers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Roʻyxatdan oʻtishda xatolik yuz berdi')
        return
      }

      window.location.href = '/'
    } catch (_err) {
      setError('Server bilan aloqa uzildi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/15 border border-[var(--gold)] mx-auto flex items-center justify-center text-[var(--gold)]">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-black text-[var(--foreground)]">
            {t('registerTitle')}
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            {t('registerSubtitle')}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 text-xs text-[var(--destructive)] text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">
                {t('firstName')}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ali"
                required
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">
                {t('lastName')}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Valiyev"
                required
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{t('username')}</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="alivali2026"
              required
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{t('phone')}</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+998 90 123 45 67"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Kamida 6 belgi"
              required
              minLength={6}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--gold)] text-black font-semibold text-sm rounded-xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>{loading ? 'Yaratilmoqda...' : t('submitRegister')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[var(--border)]">
          <Link
            href="/kirish"
            className="text-xs text-[var(--gold)] hover:underline font-medium"
          >
            {t('haveAccount')}
          </Link>
        </div>
      </div>
    </div>
  )
}
