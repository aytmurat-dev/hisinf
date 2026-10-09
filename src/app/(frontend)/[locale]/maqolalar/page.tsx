import React from 'react'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Calendar, ArrowRight, BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ArticlesListPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tPost = await getTranslations({ locale, namespace: 'post' })

  const payload = await getPayload({ config })

  const targetLanguage = locale === 'kaa' ? 'kaa' : 'uz'

  const { docs: allPosts } = await payload.find({
    collection: 'posts',
    locale: locale as 'uz' | 'kaa',
    where: {
      slug: { not_equals: 'bosh-sahifa-izohlari' },
    },
    sort: '-publishedAt',
    limit: 100,
    overrideAccess: true,
  })

  const posts = allPosts.filter((post) => {
    const postLang = (post as unknown as { language?: string | null }).language
    if (!postLang || postLang === 'both') return true
    return postLang === targetLanguage
  })

  const subtitleText =
    locale === 'kaa'
      ? 'Ózbekstan hám Qaraqalpaqstan tariyxı boyınsha barlıq maqalalar toplamı'
      : 'Oʻzbekiston va Qoraqalpogʻiston tarixi boʻyicha barcha maqolalar toʻplami'

  const noPostsText =
    locale === 'kaa'
      ? 'Házirshe maqalalar joq'
      : 'Hozircha maqolalar mavjud emas'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div className="border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[var(--foreground)]">
          {tNav('posts')}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          {subtitleText}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-16 text-center text-sm text-[var(--muted-foreground)] bg-[var(--card)] rounded-xl border border-[var(--border)]">
          <BookOpen className="w-8 h-8 text-[var(--muted-foreground)] mx-auto mb-2 opacity-50" />
          <p>{noPostsText}</p>
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
                <div className="relative h-48 w-full overflow-hidden bg-[var(--secondary)]">
                  <Image
                    src={coverUrl}
                    alt={post.title || 'HISINF'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

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
    </div>
  )
}
