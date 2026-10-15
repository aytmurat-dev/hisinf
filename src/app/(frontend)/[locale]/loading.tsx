import React from 'react'

export default function GlobalLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-44 sm:h-64 w-full rounded-2xl bg-[var(--border)] opacity-40" />

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] p-4 space-y-4 bg-[var(--card)]">
            <div className="h-44 w-full rounded-lg bg-[var(--border)] opacity-50" />
            <div className="space-y-2">
              <div className="w-1/3 h-3 rounded bg-[var(--border)] opacity-60" />
              <div className="w-4/5 h-5 rounded bg-[var(--border)] opacity-70" />
              <div className="w-full h-3 rounded bg-[var(--border)] opacity-50" />
              <div className="w-2/3 h-3 rounded bg-[var(--border)] opacity-50" />
            </div>
            <div className="pt-2 border-t border-[var(--border)] flex justify-between">
              <div className="w-20 h-4 rounded bg-[var(--border)] opacity-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
