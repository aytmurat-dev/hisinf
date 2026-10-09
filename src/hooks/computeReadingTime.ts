import type { CollectionBeforeChangeHook } from 'payload'
import { extractPlainText, countWords } from '../lib/lexical-text'

export const computeReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  if (data?.body) {
    const text = extractPlainText(data.body)
    const words = countWords(text)
    data.readingTime = words > 0 ? Math.max(1, Math.ceil(words / 180)) : 0
  }
  return data
}
