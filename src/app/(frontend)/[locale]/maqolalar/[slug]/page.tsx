import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Calendar, ArrowLeft, Compass } from 'lucide-react'
import { PostComments } from '@/components/PostComments'

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const payload = await getPayload({ config })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    locale: locale as 'uz' | 'kaa',
    where: { slug: { equals: slug } },
    overrideAccess: true,
  })

  if (posts.length === 0) {
    notFound()
  }

  const post = posts[0]

  // Fetch comments for this post
  const { docs: comments } = await payload.find({
    collection: 'comments',
    where: { post: { equals: post.id } },
    sort: '-createdAt',
    overrideAccess: true,
  })

  const formattedComments = comments.map((c) => ({
    id: c.id,
    authorName: c.authorName,
    body: c.body,
    createdAt: c.createdAt || new Date().toISOString(),
  }))

  const coverUrl =
    post.coverImageUrl ||
    (typeof post.coverImage === 'object' && post.coverImage?.url ? post.coverImage.url : null) ||
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop'

  const periodTitle =
    typeof post.period === 'object' && post.period && 'title' in post.period
      ? (post.period.title as string)
      : null

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Back button */}
      <div>
        <Link
          href="/maqolalar"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Barcha maqolalar</span>
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

        <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)] pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Yangi'}
            </span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {coverUrl && (
        <div className="relative h-64 sm:h-96 md:h-[460px] w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-md bg-[var(--secondary)]">
          <Image
            src={coverUrl}
            alt={post.title || 'HISINF'}
            fill
            priority
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

      {/* Comments Section */}
      <PostComments postId={post.id} initialComments={formattedComments} />
    </article>
  )
}
