'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Phone, Send, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export default function AdminChatPage() {
  const t = useTranslations('contact')

  const tNav = useTranslations('nav')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [inquiries, setInquiries] = useState<Array<{
    id: number
    name: string
    phone: string
    message: string
    reply?: string
    repliedAt?: string
    status: string
    createdAt: string
  }>>([])

  useEffect(() => {
    fetch('/api/readers/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setName(`${data.user.firstName} ${data.user.lastName}`)
          setPhone(data.user.phone || '')
          setIsLoggedIn(true)
          loadUserInquiries()
        }
      })
      .catch(() => {})
  }, [])

  // Server faqat kirgan o'quvchining o'z murojaatlarini qaytaradi
  const loadUserInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries')
      if (res.ok) {
        const d = await res.json()
        setInquiries(d.inquiries || [])
      }
    } catch (_e) {
      // ignore
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Xabar yuborishda xatolik')
        return
      }

      setSuccess(true)
      setMessage('')
      if (isLoggedIn) loadUserInquiries()
    } catch (_err) {
      setError('Serverga ulanishda xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{tNav('back')}</span>
        </Link>
      </div>

      <div className="bg-[var(--card)] p-6 sm:p-8 rounded-2xl border border-[var(--border)] shadow-xl space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-xs font-serif font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('directContact')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[var(--foreground)]">
            {t('chatTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            {t('chatSubtitle')}
          </p>
        </div>

        {/* Tezkor telefon murojaati */}
        <div className="p-4 rounded-xl bg-[var(--secondary)]/50 border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--gold)]/20 flex items-center justify-center text-[var(--gold)]">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)]">{t('quickCall')}</p>
              <p className="text-xs text-[var(--muted-foreground)] font-mono">+998 (90) 123-45-67</p>
            </div>
          </div>
          <a
            href="tel:+998901234567"
            className="px-4 py-2 bg-[var(--gold)] text-black rounded-lg text-xs font-semibold hover:brightness-110 transition-all text-center"
          >
            {t('callNow')}
          </a>
        </div>

        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{t('successMsg')}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 text-xs text-[var(--destructive)] text-center">
            {error}
          </div>
        )}

        {/* Chat / Murojaat formasi */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">{t('name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('name')}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">{t('phone')}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 ..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)]">{t('message')}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('message')}
              rows={4}
              required
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--gold)] text-black font-semibold text-sm rounded-xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? t('sending') : t('send')}</span>
          </button>
        </form>

        {!isLoggedIn && (
          <p className="pt-6 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
            {t('loginToSeeReplies')}
          </p>
        )}

        {/* Oldingi murojaatlar va Admin javoblari */}
        {inquiries.length > 0 && (
          <div className="pt-6 border-t border-[var(--border)] space-y-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {t('previousInquiries')}
            </h3>
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
                    <span>{new Date(inq.createdAt).toLocaleString()}</span>
                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                      inq.status === 'replied' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                    }`}>
                      {inq.status === 'replied' ? t('statusReplied') : t('statusWaiting')}
                    </span>
                  </div>
                  <p className="text-[var(--foreground)] whitespace-pre-wrap">{inq.message}</p>

                  {inq.reply && (
                    <div className="mt-2 p-3 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/30 space-y-1">
                      <div className="text-[11px] font-bold text-[var(--gold)] flex items-center justify-between">
                        <span>{t('adminReplyTitle')}</span>
                        {inq.repliedAt && (
                          <span className="font-normal text-[10px] text-[var(--muted-foreground)]">
                            {new Date(inq.repliedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--foreground)] whitespace-pre-wrap leading-relaxed">{inq.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
