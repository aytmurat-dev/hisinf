import type { CollectionConfig } from 'payload'
import { isStaff, isEditorOrAdmin, isStaffUser } from '../access'
import { revalidateSite } from '../hooks/revalidateSite'

export const Comments: CollectionConfig = {
  slug: 'comments',
  labels: {
    singular: 'Izoh',
    plural: 'Izohlar',
  },
  admin: {
    useAsTitle: 'body',
    group: 'Muloqot',
    defaultColumns: ['body', 'authorName', 'context', 'post', 'status', 'flagged', 'createdAt'],
    components: {
      beforeListTable: ['/components/admin/CommentsListHeader#CommentsListHeader'],
    },
  },
  defaultSort: '-createdAt',
  access: {
    read: ({ req }) => {
      if (isStaffUser(req.user)) return true
      return { status: { equals: 'approved' } }
    },
    create: isStaff,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation: _operation }) => {
        if (!data) return data
        if (data.context === 'post' && !data.post) {
          throw new Error('Maqola izohi uchun maqola tanlanishi shart')
        }
        if (data.parent) {
          const parentId = typeof data.parent === 'object' && data.parent !== null
            ? (data.parent as { id: string | number }).id
            : data.parent
          const parentDoc = await req.payload.findByID({
            collection: 'comments',
            id: parentId,
            depth: 0,
          })
          if (parentDoc?.parent) {
            throw new Error('Faqat bir darajali javob qaytarish mumkin (javobga javob yozib boʻlmaydi)')
          }
        }
        return data
      },
    ],
    beforeChange: [
      ({ data, originalDoc, req, operation }) => {
        if (!data) return data
        if (operation === 'create' && isStaffUser(req.user)) {
          data.staffAuthor = req.user.id
          data.authorName = req.user.displayName || req.user.email
          data.status = 'approved'
        }
        if (originalDoc && data.status !== originalDoc.status && isStaffUser(req.user)) {
          data.moderatedBy = req.user.id
          data.moderatedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      (args) => {
        if (args.doc.status === 'approved' || args.previousDoc?.status === 'approved') {
          return revalidateSite(args)
        }
        return args.doc
      },
    ],
  },
  fields: [
    {
      name: 'context',
      type: 'select',
      required: true,
      defaultValue: 'post',
      index: true,
      options: [
        { label: 'Maqola izohi', value: 'post' },
        { label: 'Bosh sahifa fikri', value: 'home' },
      ],
      label: 'Kontekst',
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: false,
      label: 'Bogʻliq maqola',
      admin: {
        condition: (_, siblingData) => siblingData?.context === 'post',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'comments',
      label: 'Javob berilgan izoh (Ota izoh)',
    },
    {
      name: 'reader',
      type: 'relationship',
      relationTo: 'readers',
      label: 'Oʻquvchi',
    },
    {
      name: 'staffAuthor',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
      label: 'Xodim muallif',
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
      label: 'Muallif ismi',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      minLength: 3,
      maxLength: 1000,
      label: 'Izoh matni',
    },
    {
      name: 'staffReplyUI',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/StaffReplyField#StaffReplyField',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      admin: {
        components: {
          Cell: '/components/admin/CommentStatusCell#CommentStatusCell',
        },
      },
      options: [
        { label: 'Moderatsiyada (Kutilmoqda)', value: 'pending' },
        { label: 'Tasdiqlangan (Koʻrinadi)', value: 'approved' },
        { label: 'Rad etilgan', value: 'rejected' },
        { label: 'Spam', value: 'spam' },
      ],
      label: 'Holati',
    },
    {
      name: 'flagged',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
      },
      label: 'Shikoyat qilingan',
    },
    {
      name: 'flagReason',
      type: 'text',
      admin: {
        readOnly: true,
      },
      label: 'Shikoyat sababi',
    },
    {
      name: 'likesCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
      label: 'Yoqtirishlar (Like) soni',
    },
    {
      name: 'moderatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
      label: 'Moderatsiya qilgan xodim',
    },
    {
      name: 'moderatedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      label: 'Moderatsiya vaqti',
    },
    {
      name: 'createdAt',
      type: 'date',
      label: 'Yozilgan vaqti (Eski maydon)',
      admin: {
        hidden: true,
      },
    },
  ],
}
