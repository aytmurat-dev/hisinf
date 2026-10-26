import React from 'react'
import { setRequestLocale } from 'next-intl/server'
import { getInteractiveChapters } from '@/lib/safe-data'
import { InteractiveHistoryExplorer } from '@/components/interactive/InteractiveHistoryExplorer'

export const dynamic = 'force-dynamic'

export default async function ArticlesListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ chapter?: string; saralash?: string; q?: string }>
}) {
  const { locale } = await params
  const sParams = (await searchParams) || {}
  setRequestLocale(locale)

  const chapters = getInteractiveChapters(locale)

  let initialChapterIndex = 0
  if (sParams.chapter) {
    const foundIndex = chapters.findIndex((c) => c.slug === sParams.chapter)
    if (foundIndex >= 0) initialChapterIndex = foundIndex
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <InteractiveHistoryExplorer
        chapters={chapters}
        locale={locale}
        initialChapterIndex={initialChapterIndex}
      />
    </div>
  )
}
