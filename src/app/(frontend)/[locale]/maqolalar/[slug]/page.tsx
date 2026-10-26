import React from 'react'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Calendar, ArrowLeft, Compass, Eye, Sparkles, Quote, ArrowRight, BarChart3 } from 'lucide-react'
import { PostComments } from '@/components/PostComments'
import { SmartImage } from '@/components/SmartImage'
import { StarRating } from '@/components/StarRating'
import { ViewTracker } from '@/components/ViewTracker'
import { getSafePostBySlug, getSafePayload, getInteractiveChapterBySlug, getInteractiveChapters } from '@/lib/safe-data'

export const dynamic = 'force-dynamic'

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const isKaa = locale === 'kaa'
  const post = await getSafePostBySlug(slug, locale)

  if (!post) {
    notFound()
  }

  const chapter = getInteractiveChapterBySlug(slug, locale)
  const allChapters = getInteractiveChapters(locale)
  const currentChapterIdx = allChapters.findIndex((c) => c.slug === slug)
  const nextChapter = currentChapterIdx >= 0 && currentChapterIdx < allChapters.length - 1 ? allChapters[currentChapterIdx + 1] : null
  const prevChapter = currentChapterIdx > 0 ? allChapters[currentChapterIdx - 1] : null

  let formattedComments: Array<{
    id: number
    authorName: string
    body: string
    createdAt: string
  }> = []

  try {
    const payload = await getSafePayload()
    if (payload) {
      const { docs: comments } = await payload.find({
        collection: 'comments',
        where: { post: { equals: post.id } },
        sort: '-createdAt',
        depth: 0,
        overrideAccess: true,
      })
      formattedComments = comments.map((c) => ({
        id: c.id,
        authorName: c.authorName,
        body: c.body,
        createdAt: c.createdAt || new Date().toISOString(),
      }))
    }
  } catch {
    // Graceful fallback for comments
  }

  const coverUrl = post.coverImageUrl || '/placeholder.jpg'
  const periodTitle = post.period?.title || null

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Back button & Interactive Hub link */}
      <div className="flex items-center justify-between">
        <Link
          href="/maqolalar"
          prefetch={true}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-amber-500 active:scale-95 transition-all font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{tNav('posts')}</span>
        </Link>

        {chapter && (
          <Link
            href={`/maqolalar?chapter=${chapter.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isKaa ? 'Interaktiv rejimde ashıw' : 'Interaktiv rejimda ochish'}</span>
          </Link>
        )}
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {chapter && (
            <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-mono font-bold">
              {isKaa ? `${chapter.number}-Bólim` : `${chapter.number}-Mavzu`}
            </span>
          )}
          {periodTitle && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-xs font-mono font-medium text-[var(--foreground)]">
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>{periodTitle}</span>
            </div>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-[var(--foreground)] leading-tight">
          {post.title || (isKaa ? 'Atamasız jazba' : 'Nomsiz maqola')}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted-foreground)] pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : isKaa
                  ? 'Jańa'
                  : 'Yangi'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {post.views || 0} {isKaa ? 'kóriw' : 'koʻrish'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-amber-500 font-bold">★ {post.stars || 0}</span>
            <span>
              ({post.ratingsCount || 0} {isKaa ? 'dawıs' : 'baho'})
            </span>
          </div>
        </div>
      </div>

      {/* Real view counting trigger */}
      <ViewTracker postId={post.id} />

      {/* Cover Image */}
      {coverUrl && (
        <div className="relative h-64 sm:h-96 md:h-[460px] w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-md bg-[var(--secondary)]">
          <SmartImage
            src={coverUrl}
            alt={post.title || 'HISINF'}
            fill
            priority
            unoptimized
            className="object-cover"
          />
        </div>
      )}

      {/* Excerpt if present */}
      {post.excerpt && (
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-[var(--card)] to-transparent border-l-4 border-amber-500 text-sm sm:text-base text-[var(--foreground)] font-serif leading-relaxed italic">
          {post.excerpt}
        </div>
      )}

      {/* Chapter Stats Grid if present */}
      {chapter && chapter.stats.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
              {isKaa ? 'Arxiv sanları hám faktler' : 'Arxiv raqamlari va dalillar'}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {chapter.stats.map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-1">
                <span className="font-mono font-black text-xl text-amber-600 dark:text-amber-400 block">
                  {s.number}
                </span>
                <span className="text-[11px] font-serif font-bold text-[var(--foreground)] block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Historical Content */}
      <div className="prose prose-stone dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-[var(--foreground)] space-y-4 whitespace-pre-line font-sans pt-2">
        {post.content}
      </div>

      {/* Archival Quotes Highlight if present */}
      {chapter && chapter.quotes.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-[var(--border)]">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <Quote className="w-4 h-4" />
            <span>{isKaa ? 'Tariyxıy derekler' : 'Tarixiy manbalar'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {chapter.quotes.map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-2">
                <p className="text-xs sm:text-sm font-serif italic text-[var(--foreground)] leading-relaxed">
                  “{q.text}”
                </p>
                <div className="text-[11px] text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]/60 flex items-center justify-between">
                  <span className="font-bold text-[var(--foreground)]">{q.author}</span>
                  <span>{q.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Star Rating Section */}
      <div className="my-8 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif font-bold text-base text-[var(--foreground)] flex items-center gap-2">
            <span>⭐</span>
            <span>
              {isKaa
                ? 'Bul bólimge baha beriń (Juldızsha qoyıw)'
                : 'Ushbu boʻlimga baho bering (Yulduzcha qoʻyish)'}
            </span>
          </h4>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            {isKaa
              ? 'Eń kóp juldız alǵan bólimler birinshi orınǵa shıǵadı'
              : 'Eng koʻp yulduz olgan mavzular birinchi oʻringa koʻtariladi'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StarRating
            postId={post.id}
            initialStars={post.stars as number}
            initialCount={post.ratingsCount as number}
            initialAverage={post.ratingAverage as number}
            size="md"
            locale={locale}
          />
        </div>
      </div>

      {/* Previous / Next Chapter Navigator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
        {prevChapter ? (
          <Link
            href={`/maqolalar/${prevChapter.slug}`}
            className="p-4 rounded-xl border border-[var(--border)] hover:border-amber-400 bg-[var(--card)] transition-all flex flex-col justify-between space-y-1 group"
          >
            <span className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              <span>{isKaa ? 'Aldıńǵı bólim' : 'Oldingi mavzu'}</span>
            </span>
            <span className="font-serif font-bold text-sm text-[var(--foreground)] group-hover:text-amber-500 line-clamp-1">
              {prevChapter.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextChapter ? (
          <Link
            href={`/maqolalar/${nextChapter.slug}`}
            className="p-4 rounded-xl border border-[var(--border)] hover:border-amber-400 bg-[var(--card)] transition-all flex flex-col justify-between space-y-1 text-right group"
          >
            <span className="text-[11px] text-[var(--muted-foreground)] flex items-center justify-end gap-1">
              <span>{isKaa ? 'Keyingi bólim' : 'Keyingi mavzu'}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="font-serif font-bold text-sm text-[var(--foreground)] group-hover:text-amber-500 line-clamp-1">
              {nextChapter.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Comments Section */}
      <PostComments postId={post.id} initialComments={formattedComments} />
    </article>
  )
}
