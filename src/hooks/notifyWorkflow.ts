import type { CollectionAfterChangeHook } from 'payload'

export const notifyWorkflow: CollectionAfterChangeHook = ({ req, doc }) => {
  if (req.context?.disableNotifications) return doc
  // Notification dispatch will be expanded in P4.S4
  return doc
}
