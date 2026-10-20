import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidateSite: CollectionAfterChangeHook = ({ req, doc }) => {
  if (req.context?.disableRevalidate || process.env.NODE_ENV === 'development') return doc
  try {
    revalidatePath('/[locale]', 'page')
    revalidatePath('/[locale]/maqolalar', 'page')
    const docSlug = (doc as { slug?: string })?.slug
    if (docSlug) {
      revalidatePath(`/[locale]/maqolalar/${docSlug}`, 'page')
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
    const docSlug = (doc as { slug?: string })?.slug
    if (docSlug) {
      revalidatePath(`/[locale]/maqolalar/${docSlug}`, 'page')
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
  } catch {
    // Next.js context might not be available during CLI/scripts
  }
  return doc
}

