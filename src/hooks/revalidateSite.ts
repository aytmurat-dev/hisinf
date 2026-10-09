import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidateSite: CollectionAfterChangeHook = ({ req, doc }) => {
  if (req.context?.disableRevalidate) return doc
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Next.js context might not be available during CLI/scripts
  }
  return doc
}

export const revalidateSiteGlobal: GlobalAfterChangeHook = ({ req, doc }) => {
  if (req.context?.disableRevalidate) return doc
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Next.js context might not be available during CLI/scripts
  }
  return doc
}
