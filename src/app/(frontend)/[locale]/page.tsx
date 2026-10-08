import React from 'react'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { BookOpen, Calendar, ArrowRight, Compass, Sparkles, MessageSquare } from 'lucide-react'
import { PostComments } from '@/components/PostComments'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'home' })
  const tPost = await getTranslations({ locale, namespace: 'post' })
  const tContact = await getTranslations({ locale, namespace: 'contact' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const payload = await getPayload({ config })

  // Fetch posts for current locale (excluding internal discussion post)
  const { docs: posts } = await payload.find({
    collection: 'posts',
    locale: locale as 'uz' | 'kaa',
    where: {
      slug: { not_equals: 'bosh-sahifa-izohlari' },
    },
    limit: 6,
    sort: '-publishedAt',
    overrideAccess: true,
  })

  // Fetch periods
  const { docs: periods } = await payload.find({
    collection: 'periods',
    locale: locale as 'uz' | 'kaa',
    sort: 'startYear',
    overrideAccess: true,
  })

  // Fetch home discussion post and comments
  const { docs: homePosts } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: 'bosh-sahifa-izohlari' } },
    overrideAccess: true,
  })

  const homePost = homePosts[0] || null

  let homeComments: Array<{
    id: number
    authorName: string
    body: string
    createdAt: string
  }> = []

  if (homePost) {
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

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-[var(--border)] bg-gradient-to-b from-[var(--secondary)]/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Historical Ornament Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-xs font-serif font-medium mb-6 animate-fade-in shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{tNav('portalTagline')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[var(--foreground)] max-w-4xl mx-auto leading-tight sm:leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="mt-6 text-sm sm:text-base text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/maqolalar"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--gold)] text-black font-semibold text-sm hover:brightness-110 transition-all shadow-md group cursor-pointer"
            >
              <span>{t('explore')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/chat"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--card)] border border-[var(--gold)]/40 text-[var(--foreground)] hover:border-[var(--gold)] font-medium text-sm transition-all shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-[var(--gold)]" />
              <span>{tContact('adminContact')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tarixiy davrlar bo'yicha navigatsiya */}
      {periods.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[var(--gold)]" />
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--foreground)]">
                {t('periodsTitle')}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {periods.map((period) => (
              <div
                key={period.id}
                className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--gold)] hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[var(--gold)] font-mono">
                    {period.startYear ? `${period.startYear} — ${period.endYear || (locale === 'kaa' ? 'házir' : 'hozir')}` : '1924'}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
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

      {/* So'nggi tarixiy maqolalar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--foreground)]">
              {t('recentPosts')}
            </h2>
          </div>
          <Link
            href="/maqolalar"
            className="text-xs font-semibold text-[var(--gold)] hover:underline flex items-center gap-1"
          >
            <span>{t('viewAll')}</span>
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
            {posts.map((post) => {
              const coverUrl =
                post.coverImageUrl ||
                (typeof post.coverImage === 'object' && post.coverImage?.url ? post.coverImage.url : null) ||
                'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop'

              return (
                <article
                  key={post.id}
                  className="flex flex-col bg-[var(--card)] rounded-xl border border-[var(--border)] hover:border-[var(--gold)] transition-all hover:shadow-lg overflow-hidden group"
                >
                  {/* Muqova rasmi */}
                  <div className="relative h-48 w-full overflow-hidden bg-[var(--secondary)]">
                    <Image
                      src={coverUrl}
                      alt={post.title || 'HISINF'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Kontent */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-[var(--muted-foreground)] mb-2">
                        <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
                        <span>
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString()
                            : locale === 'kaa'
                              ? 'Jańa'
                              : 'Yangi'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors line-clamp-2">
                        {post.title || (locale === 'kaa' ? 'Atamasız maqala' : 'Nomsiz maqola')}
                      </h3>

                      <p className="mt-2 text-xs text-[var(--muted-foreground)] line-clamp-3 leading-relaxed">
                        {post.excerpt || post.content?.slice(0, 160) || ''}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                      <Link
                        href={`/maqolalar/${post.slug}`}
                        className="text-xs font-semibold text-[var(--gold)] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
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

      {/* Asosiy sahifa fikr-mulohazalar (Comments) bo'limi - Faqat ro'yxatdan o'tganlar yoza oladi */}
      {homePost && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-xs font-serif font-medium">
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

          <PostComments postId={homePost.id} initialComments={homeComments} />
        </section>
      )}
    </div>
  )
}
