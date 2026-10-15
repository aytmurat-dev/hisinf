import React from 'react'

export default function MaqolalarLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Title skeleton */}
      <div className="border-b border-[var(--border)] pb-6 space-y-3">
        <div className="w-48 h-8 rounded-lg bg-[var(--border)] opacity-70" />
        <div className="w-96 max-w-full h-4 rounded-md bg-[var(--border)] opacity-50" />
      </div>

      {/* Grid skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden"
          >
            {/* Cover image skeleton */}
            <div className="h-48 w-full bg-[var(--border)] opacity-40" />

            {/* Content skeleton */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-24 h-3.5 rounded bg-[var(--border)] opacity-50" />
                <div className="w-4/5 h-5 rounded bg-[var(--border)] opacity-70" />
                <div className="space-y-1.5 pt-1">
                  <div className="w-full h-3 rounded bg-[var(--border)] opacity-40" />
                  <div className="w-5/6 h-3 rounded bg-[var(--border)] opacity-40" />
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <div className="w-28 h-4 rounded bg-[var(--border)] opacity-60" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
