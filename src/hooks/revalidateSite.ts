import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateSite: CollectionAfterChangeHook = ({ req, doc }) => {
  if (req.context?.disableRevalidate || process.env.NODE_ENV === 'development') return doc
  try {
    revalidatePath('/[locale]', 'page')
    revalidatePath('/[locale]/maqolalar', 'page')
    revalidateTag('posts')
    const docSlug = (doc as { slug?: string })?.slug
    if (docSlug) {
      revalidatePath(`/[locale]/maqolalar/${docSlug}`, 'page')
      revalidateTag(`post-${docSlug}`)
    }
  } catch {
    // Next.js context might not be available during CLI/scripts
  }
  return doc
}

export const revalidateSiteDelete: CollectionAfterDeleteHook = ({ req, doc }) => {
  if (req.context?.disableRevalidate || process.env.NODE_ENV === 'development') return doc
  try {
    revalidatePath('/[locale]', 'page')
    revalidatePath('/[locale]/maqolalar', 'page')
    revalidateTag('posts')
    const docSlug = (doc as { slug?: string })?.slug
    if (docSlug) {
      revalidatePath(`/[locale]/maqolalar/${docSlug}`, 'page')
      revalidateTag(`post-${docSlug}`)
    }
  } catch {
    // Next.js context might not be available during CLI/scripts
  }
  return doc
}

export const revalidateSiteGlobal: GlobalAfterChangeHook = ({ req, doc }) => {
  if (req.context?.disableRevalidate || process.env.NODE_ENV === 'development') return doc
  try {
    revalidatePath('/[locale]', 'page')
    revalidateTag('posts')
  } catch {
    // Next.js context might not be available during CLI/scripts
  }
  return doc
}
