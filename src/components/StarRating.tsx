'use client'

import React, { useState, useEffect } from 'react'

interface StarRatingProps {
  postId: number
  initialStars?: number | null
  initialCount?: number | null
  initialAverage?: number | null
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
  showCount?: boolean
  locale?: string
}

export function StarRating({
  postId,
  initialStars = 0,
  initialCount = 0,
  initialAverage = 0,
  size = 'md',
  readOnly = false,
  showCount = true,
  locale = 'uz',
}: StarRatingProps) {
  const [stars, setStars] = useState(initialStars || 0)
  const [count, setCount] = useState(initialCount || 0)
  const [average, setAverage] = useState(initialAverage || 0)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [hasRated, setHasRated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    // Check if already rated via cookie/storage
    const checkRated = () => {
      const match = document.cookie.match(new RegExp('(^| )hisinf_rated_posts=([^;]+)'))
      if (match) {
        const ratedIds = match[2].split(',')
        if (ratedIds.includes(String(postId))) {
          setHasRated(true)
        }
      }
    }
    checkRated()
  }, [postId])

  const handleRate = async (rating: number) => {
    if (readOnly || hasRated || loading) return

    setLoading(true)
    setMessage(null)

    // Optimistic update
    const nextCount = count + 1
    const nextStars = stars + rating
    const nextAvg = Math.round((nextStars / nextCount) * 10) / 10

    setStars(nextStars)
    setCount(nextCount)
    setAverage(nextAvg)
    setHasRated(true)

    try {
      const res = await fetch(`/api/posts/${postId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStars(data.stars)
        setCount(data.ratingsCount)
        setAverage(data.ratingAverage)
        setMessage(locale === 'kaa' ? 'Bahańız qabıllandı!' : 'Bahoyingiz qabul qilindi!')
      } else if (data.alreadyRated) {
        setHasRated(true)
        setMessage(locale === 'kaa' ? 'Aldın baha bergen siz' : 'Avval baho bergansiz')
      }
    } catch (err) {
      console.error('Rate failed', err)
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3500)
    }
  }

  const starSizes = {
    sm: 'w-3.5 h-3.5 text-xs',
    md: 'w-5 h-5 text-sm',
    lg: 'w-7 h-7 text-lg',
  }

  const displayRating = hoverRating ?? (average > 0 ? average : Math.min(5, stars > 0 ? 5 : 0))

  return (
    <div className="inline-flex items-center gap-2 flex-wrap">
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => !readOnly && setHoverRating(null)}
      >
        {[1, 2, 3, 4, 5].map((index) => {
          const isFilled = displayRating >= index || (hoverRating !== null && hoverRating >= index)
          const isPartiallyFilled = !isFilled && displayRating > index - 1 && displayRating < index

          return (
            <button
              key={index}
              type="button"
              disabled={readOnly || hasRated || loading}
              onClick={() => handleRate(index)}
              onMouseEnter={() => !readOnly && !hasRated && setHoverRating(index)}
              title={
                hasRated
                  ? locale === 'kaa'
                    ? 'Baha berilgen'
                    : 'Baho berilgan'
                  : `${index} ${locale === 'kaa' ? 'juldızsha beriw' : 'yulduz berish'}`
              }
              className={`transition-all duration-150 transform ${
                readOnly || hasRated
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-125 active:scale-95'
              }`}
            >
              <svg
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_1px_4px_rgba(251,191,36,0.5)]'
                    : isPartiallyFilled
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-[var(--border)] fill-transparent hover:text-amber-300'
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          )
        })}
      </div>

      {showCount && (
        <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--muted-foreground)]">
          <span className="font-semibold text-amber-500 flex items-center gap-0.5">
            ★ {stars}
          </span>
          {count > 0 ? (
            <span className="text-[11px] opacity-75">
              ({count} {locale === 'kaa' ? 'dawıs' : 'baho'})
            </span>
          ) : (
            <span className="text-[11px] opacity-60">
              ({locale === 'kaa' ? 'bahalanbaǵan' : 'baholanmagan'})
            </span>
          )}
        </div>
      )}

      {message && (
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-fade-in">
          ✓ {message}
        </span>
      )}
    </div>
  )
}
