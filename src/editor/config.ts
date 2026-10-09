import {
  lexicalEditor,
  FixedToolbarFeature,
  HeadingFeature,
  BlocksFeature,
  UploadFeature,
  EXPERIMENTAL_TableFeature,
  LinkFeature,
  HorizontalRuleFeature,
} from '@payloadcms/richtext-lexical'
import { postBlocks, inlineBlocks } from '@/blocks'

export const postEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter(
      (f) => !['heading', 'upload', 'link', 'horizontalRule'].includes(f.key),
    ),
    FixedToolbarFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
    LinkFeature({
      enabledCollections: ['posts', 'persons', 'events', 'places', 'pages', 'archive-items'],
    }),
    UploadFeature({
      collections: {
        media: {
          fields: [
            { name: 'caption', type: 'text', label: 'Rasm izohi va manbasi' },
            {
              name: 'size',
              type: 'select',
              defaultValue: 'wide',
              options: [
                { label: 'Matn kengligida', value: 'normal' },
                { label: 'Keng', value: 'wide' },
                { label: 'Toʻliq', value: 'full' },
              ],
            },
          ],
        },
      },
    }),
    HorizontalRuleFeature(),
    EXPERIMENTAL_TableFeature(),
    BlocksFeature({ blocks: postBlocks, inlineBlocks }),
  ],
})

export const simpleEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((f) => f.key !== 'heading'),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
    BlocksFeature({ inlineBlocks }),
  ],
})
