'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { Search, X, ArrowRight, BookOpen } from 'lucide-react'

interface SearchResult {
  id: number
  title: string
  slug: string
  snippet: string
  coverImageUrl: string | null
}

export function HeaderSearch() {
  const t = useTranslations('search')
  const locale = useLocale()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPost, setSelectedPost] = useState<SearchResult | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSelectedPost(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Live search debounced
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch (err) {
        console.error('Search fetch error:', err)
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query, locale])

  const highlightMatch = (text: string, term: string) => {
    if (!term || !text) return text
    const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="bg-[var(--gold)]/30 text-[var(--foreground)] font-semibold rounded-xs px-0.5">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const handleOpenPost = (slug: string) => {
    router.push(`/maqolalar/${slug}`)
    setIsOpen(false)
    setQuery('')
    setSelectedPost(null)
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Search Input Bar */}
      <div
        className={`flex items-center transition-all duration-300 overflow-hidden ${
          isOpen
            ? 'w-48 sm:w-64 md:w-80 bg-[var(--card)] border border-[var(--gold)] shadow-md rounded-full px-3 py-1.5'
            : 'w-8 h-8 rounded-full border border-transparent'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-[var(--foreground)] hover:text-[var(--gold)] transition-colors p-1 cursor-pointer shrink-0"
          title={t('title')}
          aria-label="Qidiruv"
        >
          <Search className="w-4 h-4 text-[var(--gold)]" />
        </button>

        {isOpen && (
          <>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedPost(null)
              }}
              placeholder={t('placeholder')}
              className="w-full bg-transparent border-none outline-none text-xs px-2 text-[var(--foreground)] placeholder-[var(--muted-foreground)]"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setResults([])
                  setSelectedPost(null)
                }}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-0.5 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Dropdown Results Box */}
      {isOpen && (query.length >= 2 || selectedPost) && (
        <div className="absolute right-0 top-11 w-80 sm:w-96 md:w-[420px] bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl p-3 z-50 animate-fade-in max-h-[480px] overflow-y-auto">
          {loading && (
            <div className="py-6 text-center text-xs text-[var(--muted-foreground)]">
              {t('searching')}
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="py-6 text-center text-xs text-[var(--muted-foreground)]">
              {t('noResults')}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-medium text-[var(--muted-foreground)] px-2 pb-1 border-b border-[var(--border)]">
                {results.length} {t('resultsFound')}
              </div>

              {results.map((post) => {
                const isSelected = selectedPost?.id === post.id

                return (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[var(--gold)] bg-[var(--gold)]/10 shadow-xs'
                        : 'border-transparent hover:border-[var(--border)] hover:bg-[var(--secondary)]/40'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[var(--foreground)] font-serif line-clamp-1">
                          {post.title}
                        </h4>

                        {/* Topilgan qator/matn */}
                        <div className="mt-1 text-xs text-[var(--muted-foreground)] line-clamp-2 bg-[var(--secondary)]/40 p-1.5 rounded-md border border-[var(--border)]/50">
                          <span className="font-medium text-[var(--gold)] block text-[10px] mb-0.5">
                            {t('matchingContext')}
                          </span>
                          <span>{highlightMatch(post.snippet, query)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tanlanganda postni to'liq ochish tugmasi chiqadi */}
                    {isSelected && (
                      <div className="mt-3 pt-2 border-t border-[var(--border)] flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenPost(post.slug)
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[var(--gold)] text-black font-semibold text-xs rounded-lg hover:brightness-110 transition-all shadow-sm cursor-pointer"
                        >
                          <span>{t('openFullPost')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
