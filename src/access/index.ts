import type { Access, FieldAccess, PayloadRequest } from 'payload'
import type { User, Reader } from '@/payload-types'

export type StaffRole = User['role']
type ReqUser = PayloadRequest['user'] | undefined

export function isStaffUser(u: ReqUser): u is User & { collection: 'users' } {
  return Boolean(
    u && u.collection === 'users' && (u as User & { isActive?: boolean }).isActive !== false,
  )
}

export function isReaderUser(u: ReqUser): u is Reader & { collection: 'readers' } {
  return Boolean(
    u && u.collection === 'readers' && (u as Reader & { isBanned?: boolean }).isBanned !== true,
  )
}

export function hasRole(u: ReqUser, ...roles: StaffRole[]): boolean {
  return isStaffUser(u) && roles.includes(u.role)
}

export const anyone: Access = () => true
export const nobody: Access = () => false
export const isStaff: Access = ({ req }) => isStaffUser(req.user)
export const isAdmin: Access = ({ req }) => hasRole(req.user, 'admin')
export const isEditorOrAdmin: Access = ({ req }) => hasRole(req.user, 'admin', 'editor')

/** Ommaga faqat chop etilgan; xodimga hammasi */
export const publishedOrStaff: Access = ({ req }) =>
  isStaffUser(req.user) ? true : { _status: { equals: 'published' } }

export const fieldStaffOnly: FieldAccess = ({ req }) => isStaffUser(req.user)
export const fieldAdminOnly: FieldAccess = ({ req }) => hasRole(req.user, 'admin')
export const fieldEditorOrAdmin: FieldAccess = ({ req }) => hasRole(req.user, 'admin', 'editor')
