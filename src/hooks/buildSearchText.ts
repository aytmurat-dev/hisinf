import type { CollectionBeforeChangeHook } from 'payload'
import { normalizeSearch } from '../lib/normalize-search'
import { extractPlainText } from '../lib/lexical-text'

export const buildSearchText: CollectionBeforeChangeHook = ({ data }) => {
  if (!data) return data
  const parts: string[] = []
  if (data.title) parts.push(String(data.title))
  if (data.name) parts.push(String(data.name))
  if (data.excerpt) parts.push(String(data.excerpt))
  if (data.summary) parts.push(String(data.summary))
  if (data.shortBio) parts.push(String(data.shortBio))
  if (data.description) {
    parts.push(typeof data.description === 'string' ? data.description : extractPlainText(data.description))
  }
  if (data.body) parts.push(extractPlainText(data.body))
  if (data.biography) parts.push(extractPlainText(data.biography))

  const raw = parts.join(' ')
  const normalized = normalizeSearch(raw)
  data.searchText = normalized.slice(0, 30000)
  return data
}
