import React from 'react'

export default function ArticleLoading() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Back button skeleton */}
      <div className="w-28 h-4 rounded-md bg-[var(--border)] opacity-60" />

      {/* Header Info */}
      <div className="space-y-4">
        {/* Period badge skeleton */}
        <div className="w-36 h-6 rounded-full bg-[var(--border)] opacity-50" />

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="w-4/5 h-9 rounded-lg bg-[var(--border)] opacity-70" />
          <div className="w-2/3 h-9 rounded-lg bg-[var(--border)] opacity-70" />
        </div>

        {/* Date / meta skeleton */}
        <div className="flex items-center gap-4 pt-1">
          <div className="w-24 h-4 rounded-md bg-[var(--border)] opacity-50" />
          <div className="w-20 h-4 rounded-md bg-[var(--border)] opacity-50" />
        </div>
      </div>

      {/* Cover image skeleton */}
      <div className="relative h-64 sm:h-96 w-full rounded-2xl bg-[var(--border)] opacity-40" />

      {/* Article content skeleton */}
      <div className="space-y-4 pt-4">
        <div className="w-full h-4 rounded-md bg-[var(--border)] opacity-60" />
        <div className="w-full h-4 rounded-md bg-[var(--border)] opacity-60" />
        <div className="w-5/6 h-4 rounded-md bg-[var(--border)] opacity-60" />
        <div className="w-4/5 h-4 rounded-md bg-[var(--border)] opacity-60" />
        <div className="w-full h-4 rounded-md bg-[var(--border)] opacity-60 pt-4" />
        <div className="w-full h-4 rounded-md bg-[var(--border)] opacity-60" />
        <div className="w-3/4 h-4 rounded-md bg-[var(--border)] opacity-60" />
      </div>
    </article>
  )
}
