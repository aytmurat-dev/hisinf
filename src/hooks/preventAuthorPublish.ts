import type { CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'
import { hasRole } from '../access'

export const preventAuthorPublish: CollectionBeforeChangeHook = ({ data, req }) => {
  if (req.context?.skipWorkflow) return data
  if (req.user && hasRole(req.user, 'author') && data?._status === 'published') {
    throw new APIError('Muallif toʻgʻridan-toʻgʻri chop eta olmaydi', 403)
  }
  return data
}
