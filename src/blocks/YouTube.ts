import type { Block } from 'payload'

export const YouTubeBlock: Block = {
  slug: 'youtube',
  interfaceName: 'YouTubeBlock',
  labels: {
    singular: 'YouTube video',
    plural: 'YouTube videolar',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'YouTube havolasi',
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string') return 'Havola kiritilishi shart'
        const ytRegex = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/
        if (!ytRegex.test(value)) {
          return 'Notoʻgʻri YouTube havolasi (masalan: https://www.youtube.com/watch?v=... yoki https://youtu.be/...)'
        }
        return true
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Video tavsifi',
    },
  ],
}
