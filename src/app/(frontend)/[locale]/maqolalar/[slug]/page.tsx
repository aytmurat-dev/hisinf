import React from 'react'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Calendar, ArrowLeft, Compass, Eye } from 'lucide-react'
import { PostComments } from '@/components/PostComments'
import { SmartImage } from '@/components/SmartImage'
import { StarRating } from '@/components/StarRating'
import { ViewTracker } from '@/components/ViewTracker'
import { getSafePostBySlug, getSafePayload } from '@/lib/safe-data'

export const dynamic = 'force-dynamic'

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const post = await getSafePostBySlug(slug, locale)

  if (!post) {
    notFound()
  }

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
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Back button */}
      <div>
        <Link
          href="/maqolalar"
          prefetch={true}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--gold)] active:scale-95 transition-all font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{tNav('allPosts')}</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        {periodTitle && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full gold-badge text-xs font-serif font-medium">
            <Compass className="w-3.5 h-3.5" />
            <span>{periodTitle}</span>
          </div>
        )}

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-[var(--foreground)] leading-tight">
          {post.title || (locale === 'kaa' ? 'Atamasız jazba' : 'Nomsiz maqola')}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted-foreground)] pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : locale === 'kaa'
                  ? 'Jańa'
                  : 'Yangi'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {post.views || 0} {locale === 'kaa' ? 'kóriw' : 'koʻrish'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-amber-500 font-bold">★ {post.stars || 0}</span>
            <span>
              ({post.ratingsCount || 0}{' '}
              {locale === 'kaa' ? 'dawıs' : 'baho'})
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
        <div className="p-4 sm:p-5 rounded-xl bg-[var(--secondary)]/40 border-l-4 border-[var(--gold)] italic text-sm text-[var(--foreground)] leading-relaxed">
          {post.excerpt}
        </div>
      )}

      {/* Main Historical Content */}
      <div className="prose prose-stone dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-[var(--foreground)] space-y-4 whitespace-pre-line font-sans pt-2">
        {post.content}
      </div>

      {/* Star Rating Section */}
      <div className="my-8 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif font-bold text-base text-[var(--foreground)] flex items-center gap-2">
            <span>⭐</span>
            <span>
              {locale === 'kaa'
                ? 'Bul maqalaǵa baha beriń (Juldızsha qoyıw)'
                : 'Ushbu maqolaga baho bering (Yulduzcha qoʻyish)'}
            </span>
          </h4>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            {locale === 'kaa'
              ? 'Eń kóp juldız alǵan maqalalar dizimde birinshi orınǵa shıǵadı'
              : 'Eng koʻp yulduz olgan maqolalar saytda birinchi oʻringa koʻtariladi'}
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

      {/* Comments Section */}
      <PostComments postId={post.id} initialComments={formattedComments} />
    </article>
  )
}
