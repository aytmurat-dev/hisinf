'use client'

import { useEffect } from 'react'

export function ViewTracker({ postId }: { postId: number }) {
  useEffect(() => {
    try {
      const key = `hisinf_viewed_${postId}`
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')

      fetch(`/api/posts/${postId}/view`, { method: 'POST' }).catch(() => {})
    } catch {
      // Ignore if sessionStorage is restricted
    }
  }, [postId])

  return null
}
