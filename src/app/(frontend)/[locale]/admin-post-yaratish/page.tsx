'use client'

import React, { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import {
  Upload,
  Link as LinkIcon,
  FileText,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from 'lucide-react'

export default function AdminCreatePostPage() {
  const t = useTranslations('createPost')
  const locale = useLocale()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')

  // Rasm turi: 'file' (qurilmadan) yoki 'url' (internetdan)
  const [imageMode, setImageMode] = useState<'file' | 'url'>('url')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Word / PDF yuklash
  const [parsingDoc, setParsingDoc] = useState(false)
  const [docParsedMsg, setDocParsedMsg] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Rasm fayli tanlanganda
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // URL o'zgarganda
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setCoverImageUrl(url)
    setImagePreview(url || null)
  }

  // Word (.docx) yoki PDF faylni tahlil qilish
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setParsingDoc(true)
    setDocParsedMsg('')
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Hujjatni oʻqishda xatolik yuz berdi')
        return
      }

      if (data.text) {
        setContent(data.text)
        setDocParsedMsg(`"${file.name}" faylidan ${data.charCount} ta belgi muvaffaqiyatli ajratib olindi!`)
        if (!title && file.name) {
          setTitle(file.name.replace(/\.[^/.]+$/, ''))
        }
      }
    } catch (_err) {
      setError('Faylni yuklashda xatolik yuz berdi')
    } finally {
      setParsingDoc(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      setError('Post haqida (matn) maydoni toʻldirilishi majburiy!')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('excerpt', excerpt)
      formData.append('locale', locale)

      if (imageMode === 'url' && coverImageUrl) {
        formData.append('coverImageUrl', coverImageUrl)
      } else if (imageMode === 'file' && coverImageFile) {
        formData.append('imageFile', coverImageFile)
      }

      const res = await fetch('/api/posts/create', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Post yaratishda xatolik yuz berdi')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/maqolalar/${data.post.slug}`)
        router.refresh()
      }, 1200)
    } catch (_err) {
      setError('Server bilan bogʻlanishda xatolik')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-fade-in">
      <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-xs font-serif font-medium mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin Post Muharriri</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[var(--foreground)]">
            {t('pageTitle')}
          </h1>
        </div>

        <a
          href="/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--gold)] hover:underline flex items-center gap-1 font-semibold"
        >
          <span>Payload Admin paneliga oʻtish →</span>
        </a>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{t('success')} Saytga yoʻnaltirilmoqda...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 text-[var(--destructive)] text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-[var(--card)] p-6 sm:p-8 rounded-2xl border border-[var(--border)] shadow-xl">
        {/* 1. Muqova rasmi (Qurilmadan yoki Internetdan) */}
        <div className="space-y-3">
          <label className="text-sm font-serif font-bold text-[var(--foreground)] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[var(--gold)]" />
            <span>1. Muqova rasmi (Telefon/Laptopdan yoki Internet orqali)</span>
          </label>

          <div className="flex items-center gap-2 bg-[var(--secondary)]/60 p-1 rounded-lg w-fit text-xs font-medium">
            <button
              type="button"
              onClick={() => setImageMode('file')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                imageMode === 'file' ? 'bg-[var(--gold)] text-black font-semibold' : 'text-[var(--foreground)]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Qurilmadan yuklash</span>
            </button>
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                imageMode === 'url' ? 'bg-[var(--gold)] text-black font-semibold' : 'text-[var(--foreground)]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Internet URL havolasi</span>
            </button>
          </div>

          {imageMode === 'file' ? (
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="block w-full text-xs text-[var(--muted-foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[var(--gold)] file:text-black hover:file:brightness-110 cursor-pointer"
              />
              <p className="text-[11px] text-[var(--muted-foreground)]">
                {t('coverFromDevice')}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <input
                type="url"
                value={coverImageUrl}
                onChange={handleImageUrlChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
              />
              <p className="text-[11px] text-[var(--muted-foreground)]">
                {t('coverFromUrl')}
              </p>
            </div>
          )}

          {/* Rasm preview */}
          {imagePreview && (
            <div className="mt-3 relative h-48 w-full sm:w-80 rounded-xl overflow-hidden border border-[var(--gold)] bg-[var(--secondary)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* 2. Mavzu (Majburiy emas / Ixtiyoriy) */}
        <div className="space-y-1.5">
          <label className="text-sm font-serif font-bold text-[var(--foreground)]">
            2. {t('titleOptional')}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masalan: Amir Temurning davlat boshqaruvi islohotlari"
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
          />
        </div>

        {/* 3. Word (.docx) yoki PDF fayldan matn ajratib olish (Foydalanuvchi talabi) */}
        <div className="p-4 sm:p-5 rounded-xl bg-[var(--secondary)]/40 border border-[var(--border)] space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--gold)]" />
            <h3 className="text-sm font-serif font-bold text-[var(--foreground)]">
              {t('uploadDoc')}
            </h3>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            {t('docUploadDesc')}
          </p>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--card)] border border-[var(--gold)] text-xs font-semibold rounded-lg hover:bg-[var(--gold)] hover:text-black transition-all cursor-pointer shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Faylni tanlash (.docx / .pdf)</span>
              <input
                type="file"
                accept=".docx,.doc,.pdf,.txt"
                onChange={handleDocUpload}
                className="hidden"
                disabled={parsingDoc}
              />
            </label>

            {parsingDoc && (
              <span className="text-xs text-[var(--gold)] flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t('parsingDoc')}</span>
              </span>
            )}
          </div>

          {docParsedMsg && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ {docParsedMsg}
            </p>
          )}
        </div>

        {/* 4. Post haqida (Majburiy) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-serif font-bold text-[var(--foreground)]">
              4. {t('contentRequired')} <span className="text-[var(--destructive)]">*</span>
            </label>
            <span className="text-xs text-[var(--muted-foreground)]">
              {content.length} ta belgi
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tarixiy post matnini shu yerga yozing yoki yuqoridagi tugma orqali Word/PDF yuklang..."
            rows={10}
            required
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors font-sans leading-relaxed"
          />
        </div>

        {/* 5. Qisqa tavsif */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--muted-foreground)]">
            Qisqa tavsif (Anons - kartochka uchun, ixtiyoriy)
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Maqola haqida 1-2 jumlalik qisqacha xulosa..."
            rows={2}
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
          />
        </div>

        {/* Chop etish tugmasi */}
        <div className="pt-4 border-t border-[var(--border)] flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--gold)] text-black font-bold text-sm rounded-xl hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Chop etilmoqda...</span>
              </>
            ) : (
              <>
                <span>{t('submitPost')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
