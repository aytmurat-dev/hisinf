'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { MessageSquare, Send, LogIn, UserCheck } from 'lucide-react'

interface CommentItem {
  id: number
  authorName: string
  body: string
  createdAt: string
}

export function PostComments({
  postId,
  initialComments,
}: {
  postId: number
  initialComments: CommentItem[]
}) {
  const t = useTranslations('post')
  const tNav = useTranslations('nav')
  const pathname = usePathname()

  const [comments, setComments] = useState<CommentItem[]>(initialComments)
  const [currentUser, setCurrentUser] = useState<{ firstName: string; username: string } | null>(null)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

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
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          body: commentText.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Izoh qoldirishda xatolik yuz berdi')
        return
      }

      if (data.comment) {
        setComments((prev) => [data.comment, ...prev])
        setCommentText('')
      }
    } catch (_err) {
      setError('Server bilan aloqa uzildi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-12 pt-8 border-t border-[var(--border)] space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-[var(--gold)]" />
        <h3 className="text-xl font-serif font-bold text-[var(--foreground)]">
          {t('comments')} ({comments.length})
        </h3>
      </div>

      {/* Izoh qoldirish formasi yoki Ro'yxatdan o'tish talabi */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="bg-[var(--card)] p-5 rounded-xl border border-[var(--border)] space-y-3">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <UserCheck className="w-4 h-4 text-[var(--gold)]" />
            <span>
              {t('youAs')} <strong className="text-[var(--foreground)]">{currentUser.firstName}</strong> {t('postingAs')}
            </span>
          </div>

          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t('commentPlaceholder')}
            rows={3}
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none focus:border-[var(--gold)] transition-colors"
            required
          />

          {error && <p className="text-xs text-[var(--destructive)]">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--gold)] text-black font-semibold text-xs rounded-lg hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t('submitComment')}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 rounded-xl bg-[var(--secondary)]/50 border border-[var(--border)] text-center space-y-3">
          <p className="text-sm font-medium text-[var(--foreground)]">
            {t('loginRequiredToComment')}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href={`/kirish?redirect=${encodeURIComponent(pathname)}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--gold)] text-black font-semibold text-xs rounded-lg hover:brightness-110 transition-all shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('loginToCommentBtn')}</span>
            </Link>
            <Link
              href="/royxatdan-otish"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] hover:border-[var(--gold)] text-xs font-semibold rounded-lg transition-all"
            >
              <span>{tNav('register')}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Izohlar ro'yxati */}
      <div className="space-y-3 pt-2">
        {comments.length === 0 ? (
          <p className="text-xs text-[var(--muted-foreground)] italic">{t('noComments')}</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--foreground)]">{comment.authorName}</span>
                <span className="text-[11px] text-[var(--muted-foreground)]">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
                {comment.body}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
