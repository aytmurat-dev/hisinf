import React from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Calendar, ArrowRight, BookOpen, Star, Sparkles, Eye } from 'lucide-react'
import { SmartImage } from '@/components/SmartImage'
import { StarRating } from '@/components/StarRating'
import { getSafePosts } from '@/lib/safe-data'

export const revalidate = 3600

export default async function ArticlesListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ saralash?: string; q?: string }>
}) {
  const { locale } = await params
  const sParams = (await searchParams) || {}
  const activeSort = sParams.saralash || 'stars'

  setRequestLocale(locale)
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tPost = await getTranslations({ locale, namespace: 'post' })

  const isKaa = locale === 'kaa'

  // Determine sort order
  let sortField: string = '-stars'
  if (activeSort === 'new') {
    sortField = '-publishedAt'
  } else if (activeSort === 'pop') {
    sortField = '-views'
  } else if (activeSort === 'old') {
    sortField = 'publishedAt'
  }

  // Retrieve posts safely
  const allPosts = await getSafePosts(locale, sortField)

  // Filter and sort
  const posts =
    activeSort === 'stars'
      ? [...allPosts].sort((a, b) => {
          const starsA = a.stars || 0
          const starsB = b.stars || 0
          if (starsB !== starsA) return starsB - starsA
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
          return dateB - dateA
        })
      : allPosts

  const subtitleText =
    isKaa
      ? '1924-jılǵı Milliy-aymaqlıq shegaralanıw hám tariyx boyınsha eń kóp juldızlı maqalalar'
      : '1924-yilgi Milliy-hududiy chegaralanish va tarix boʻyicha eng koʻp yulduzli maqolalar'

  const noPostsText =
    isKaa ? 'Házirshe maqalalar joq' : 'Hozircha maqolalar mavjud emas'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="border-b border-[var(--border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isKaa
                ? 'Reyting hám maqalalar'
                : 'Reyting va maqolalar'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[var(--foreground)]">
            {tNav('posts')}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)] max-w-2xl">
            {subtitleText}
          </p>
        </div>

        {/* Sort Filter Tabs */}
        <div className="flex items-center gap-1 bg-[var(--card)] p-1 rounded-xl border border-[var(--border)]">
          <Link
            href="/maqolalar?saralash=stars"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSort === 'stars'
                ? 'bg-amber-500 text-black shadow-xs'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>
              {isKaa ? 'Eń kóp juldızlı' : 'Eng koʻp yulduzli'}
            </span>
          </Link>
          <Link
            href="/maqolalar?saralash=new"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSort === 'new'
                ? 'bg-[var(--foreground)] text-[var(--background)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            {isKaa ? 'Eń jańa' : 'Eng yangi'}
          </Link>
          <Link
            href="/maqolalar?saralash=pop"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSort === 'pop'
                ? 'bg-[var(--foreground)] text-[var(--background)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            {isKaa ? 'Eń kóp oqılǵan' : 'Eng koʻp oʻqilgan'}
          </Link>
        </div>
      </div>

      {/* Articles Grid */}
      {posts.length === 0 ? (
        <div className="py-16 text-center text-sm text-[var(--muted-foreground)] bg-[var(--card)] rounded-xl border border-[var(--border)]">
          <BookOpen className="w-8 h-8 text-[var(--muted-foreground)] mx-auto mb-2 opacity-50" />
          <p>{noPostsText}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => {
            const coverUrl = post.coverImageUrl || '/placeholder.jpg'
            const postStars = (post.stars as number) || 0
            const isTopRanked = activeSort === 'stars' && index === 0 && postStars > 0

            return (
              <article
                key={post.id}
                className={`flex flex-col bg-[var(--card)] rounded-xl border transition-all hover:shadow-xl overflow-hidden group relative ${
                  isTopRanked
                    ? 'border-amber-500 shadow-md ring-1 ring-amber-500/20'
                    : 'border-[var(--border)] hover:border-amber-400'
                }`}
              >
                {/* Ranking Badge if star sorted */}
                {activeSort === 'stars' && postStars > 0 && (
                  <div className="absolute top-3 right-3 z-10">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 shadow-md ${
                        index === 0
                          ? 'bg-amber-500 text-black border border-amber-300'
                          : index === 1
                          ? 'bg-slate-300 text-slate-900 border border-slate-200'
                          : index === 2
                          ? 'bg-amber-700 text-amber-100 border border-amber-600'
                          : 'bg-black/75 text-amber-300 backdrop-blur-xs border border-white/20'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      #{index + 1}
                    </span>
                  </div>
                )}

                <Link
                  href={`/maqolalar/${post.slug}`}
                  prefetch={true}
                  className="relative h-48 w-full overflow-hidden bg-[var(--secondary)] block cursor-pointer"
                >
                  <SmartImage
                    src={coverUrl}
                    alt={post.title || 'HISINF'}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </Link>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)] mb-2">
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
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <Eye className="w-3 h-3 text-amber-500" />
                        <span>{post.views || 0}</span>
                      </div>
                    </div>

                    <Link
                      href={`/maqolalar/${post.slug}`}
                      prefetch={true}
                      className="block cursor-pointer"
                    >
                      <h3 className="font-serif font-bold text-lg text-[var(--foreground)] group-hover:text-amber-500 transition-colors line-clamp-2">
                        {post.title ||
                          (locale === 'kaa' ? 'Atamasız maqala' : 'Nomsiz maqola')}
                      </h3>
                    </Link>

                    <p className="mt-2 text-xs text-[var(--muted-foreground)] line-clamp-3 leading-relaxed">
                      {post.excerpt || post.content?.slice(0, 160) || ''}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                    {/* Star Rating Widget on Card */}
                    <StarRating
                      postId={post.id}
                      initialStars={post.stars as number}
                      initialCount={post.ratingsCount as number}
                      initialAverage={post.ratingAverage as number}
                      size="sm"
                      locale={locale}
                    />

                    <Link
                      href={`/maqolalar/${post.slug}`}
                      prefetch={true}
                      className="text-xs font-semibold text-amber-500 flex items-center gap-1 group-hover:translate-x-0.5 active:scale-95 transition-all inline-flex py-1 px-1 rounded hover:underline"
                    >
                      <span>{tPost('readMore')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
