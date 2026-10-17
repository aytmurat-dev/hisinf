import React from 'react'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  BookOpen,
  Calendar,
  ArrowRight,
  Compass,
  Sparkles,
  MessageSquare,
  Clock,
  User,
  Star,
  Award,
  Eye,
  FolderArchive,
} from 'lucide-react'
import { PostComments } from '@/components/PostComments'
import { SmartImage } from '@/components/SmartImage'
import { StarRating } from '@/components/StarRating'
import { getSafePosts, getSafePeriods, getSafePayload } from '@/lib/safe-data'

export const revalidate = 3600

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'home' })
  const tPost = await getTranslations({ locale, namespace: 'post' })

  const isKaa = locale === 'kaa'

  // Safely retrieve posts and periods
  const [allPosts, periods] = await Promise.all([
    getSafePosts(locale, '-stars'),
    getSafePeriods(locale),
  ])

  // Filter and sort by stars (highest stars first)
  const posts = [...allPosts]
    .sort((a, b) => {
      const starsA = a.stars || 0
      const starsB = b.stars || 0
      if (starsB !== starsA) return starsB - starsA
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 6)

  let homePostId: number | null = null
  let homeComments: Array<{
    id: number
    authorName: string
    body: string
    createdAt: string
  }> = []

  try {
    const payload = await getSafePayload()
    if (payload) {
      const { docs: homePosts } = await payload.find({
        collection: 'posts',
        where: { slug: { equals: 'bosh-sahifa-izohlari' } },
        overrideAccess: true,
      })
      const homePost = homePosts[0] || null
      if (homePost) {
        homePostId = homePost.id
        const { docs: commentDocs } = await payload.find({
          collection: 'comments',
          where: { post: { equals: homePost.id } },
          sort: '-createdAt',
          overrideAccess: true,
        })
        homeComments = commentDocs.map((c) => ({
          id: c.id,
          authorName: c.authorName,
          body: c.body,
          createdAt: c.createdAt || new Date().toISOString(),
        }))
      }
    }
  } catch {
    // Graceful fallback for comments when Postgres is offline
  }

  return (
    <div className="space-y-16 pb-16">
      {/* 1924 Milliy-hududiy chegaralanish Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-[var(--border)] bg-gradient-to-b from-[var(--secondary)]/40 via-amber-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-serif font-bold mb-6 animate-fade-in shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isKaa
                ? '1924-jılǵı Milliy-aymaqlıq shegaralanıw prezentaciyası'
                : '1924-yilgi Milliy-hududiy chegaralanish taqdimoti'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[var(--foreground)] max-w-4xl mx-auto leading-tight sm:leading-tight">
            {isKaa
              ? 'Milliy-aymaqlıq shegaralanıw (1924-jıl)'
              : 'Milliy-hududiy chegaralanish (1924-yil)'}
          </h1>

          <p className="mt-6 text-sm sm:text-base text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            {isKaa
              ? 'Ózbekstan hám Qaraqalpaqstan milliy mámleketshiligi negizleri, tariyxıy sabaqlar, paytaxtlar Samarqand hám Tórtkúl qalaları, tariyxıy shaxslar hám interaktiv karta.'
              : 'Oʻzbekiston va Qoraqalpogʻiston milliy davlatchiligi poydevori, tarixiy saboqlar, poytaxtlar Samarqand va Toʻrtkoʻl shaharlari, tarixiy shaxslar va interaktiv xarita.'}
          </p>

          {/* Quick Action Presentation Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/xarita"
              prefetch={true}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-md group cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>{isKaa ? 'Interaktiv Karta' : 'Interaktiv Xarita'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/xronologiya"
              prefetch={true}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--card)] border border-amber-500/40 text-[var(--foreground)] hover:border-amber-400 active:scale-95 font-semibold text-sm transition-all shadow-xs cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{isKaa ? '1924 Xronologiyası' : '1924 Xronologiyasi'}</span>
            </Link>

            <Link
              href="/shaxslar"
              prefetch={true}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:border-amber-400 active:scale-95 font-medium text-sm transition-all shadow-xs cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-500" />
              <span>{isKaa ? 'Tariyxıy Tulǵalar' : 'Tarixiy Shaxslar'}</span>
            </Link>

            <Link
              href="/arxiv"
              prefetch={true}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:border-amber-400 active:scale-95 font-medium text-sm transition-all shadow-xs cursor-pointer"
            >
              <FolderArchive className="w-4 h-4 text-amber-500" />
              <span>{isKaa ? 'Media Arxiv' : 'Media Arxiv'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Interactive Pillars Showcase Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/xarita"
            className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-amber-400 hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                {isKaa ? 'Tariyxıy Karta' : 'Tarixiy Xarita'}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
                {isKaa
                  ? 'Samarqand, Tórtkúl hám 1924-jılǵı shegaralardı interaktiv kóriw'
                  : 'Samarqand, Toʻrtkoʻl va 1924-yilgi chegaralarni interaktiv koʻrish'}
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-500 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{isKaa ? 'Kartanı ashıw' : 'Xaritani ochish'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/xronologiya"
            className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-amber-400 hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                {isKaa ? '1924 Xronologiyası' : '1924 Xronologiyasi'}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
                {isKaa
                  ? 'Aylarma-ay bolıp ótken tariyxıy shegaralanıw basqıshları'
                  : 'Oylarma-oy boʻlib oʻtgan tarixiy chegaralanish bosqichlari'}
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-500 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{isKaa ? 'Waqıyalar dizbegi' : 'Voqealar ketma-ketligi'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/shaxslar"
            className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-amber-400 hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                {isKaa ? 'Tariyxıy Tulǵalar' : 'Tarixiy Shaxslar'}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
                {isKaa
                  ? 'Fayzulla Xojayev, Allayar Dosnazarov, Ábiw Qudabaev hám basqalar'
                  : 'Fayzulla Xoʻjayev, Allayar Doʻstnazarov, Abu Qudabayev va boshqalar'}
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-500 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{isKaa ? 'Tulǵalardı kóriw' : 'Shaxslarni koʻrish'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Eng ko'p yulduzli maqolalar (Star-sorted Top Articles) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[var(--border)] gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              <Award className="w-4 h-4" />
              <span>
                {isKaa ? 'Juldızlar boyınsha reyting' : 'Yulduzlar boʻyicha reyting'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--foreground)]">
              {isKaa
                ? 'Eń kóp juldızlı maqalalar'
                : 'Eng koʻp yulduzli maqolalar'}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              {isKaa
                ? 'Eń kóp dawıs hám juldız alǵan maqalalar birinshi orında turadı'
                : 'Eng koʻp ovoz va yulduz toʻplagan maqolalar eng birinchi oʻrinda turadi'}
            </p>
          </div>
          <Link
            href="/maqolalar?saralash=stars"
            prefetch={true}
            className="text-xs font-semibold text-amber-500 hover:underline active:scale-95 flex items-center gap-1 transition-transform"
          >
            <span>{isKaa ? 'Barlıq maqalalar' : 'Barcha maqolalar'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="py-12 text-center text-sm text-[var(--muted-foreground)] bg-[var(--card)] rounded-2xl border border-[var(--border)]">
            <BookOpen className="w-8 h-8 text-[var(--muted-foreground)] mx-auto mb-2 opacity-60" />
            <p>{t('noPosts')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => {
              const coverUrl = post.coverImageUrl || '/placeholder.jpg'
              const postStars = (post.stars as number) || 0

              return (
                <article
                  key={post.id}
                  className={`flex flex-col bg-[var(--card)] rounded-2xl border transition-all hover:shadow-xl overflow-hidden group relative ${
                    index === 0 && postStars > 0
                      ? 'border-amber-500 shadow-md ring-1 ring-amber-500/20'
                      : 'border-[var(--border)] hover:border-amber-400'
                  }`}
                >
                  {/* Top Rank Badge */}
                  {postStars > 0 && (
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

                  {/* Muqova rasmi */}
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

                  {/* Kontent */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)] mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-amber-500" />
                          <span>
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString()
                              : isKaa
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
                          {post.title || (isKaa ? 'Atamasız maqala' : 'Nomsiz maqola')}
                        </h3>
                      </Link>

                      <p className="mt-2 text-xs text-[var(--muted-foreground)] line-clamp-3 leading-relaxed">
                        {post.excerpt || post.content?.slice(0, 160) || ''}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
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
      </section>

      {/* Tarixiy davrlar bo'yicha navigatsiya */}
      {periods.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--foreground)]">
                {t('periodsTitle')}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {periods.map((period) => (
              <div
                key={period.id}
                className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-amber-400 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-500 font-mono">
                    {period.yearsLabel ||
                      (period.startYear
                        ? period.startYear === period.endYear
                          ? `${period.startYear}${isKaa ? '-jıl' : '-yil'}`
                          : `${period.startYear} — ${
                              period.endYear || (isKaa ? 'házir' : 'hozir')
                            }`
                        : isKaa
                        ? '1924-jıl'
                        : '1924-yil')}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                  {period.title}
                </h3>
                {period.description && (
                  <p className="mt-2 text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                    {period.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Comments Section on Home */}
      {homePostId && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-serif font-medium">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t('homeCommentsTitle')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--foreground)]">
              {t('homeCommentsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-xl mx-auto">
              {t('homeCommentsSubtitle')}
            </p>
          </div>

          <PostComments postId={homePostId} initialComments={homeComments} />
        </section>
      )}
    </div>
  )
}
