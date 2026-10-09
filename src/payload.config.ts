import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig, type Plugin } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Readers } from './collections/Readers'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Periods } from './collections/Periods'
import { Persons } from './collections/Persons'
import { Events } from './collections/Events'
import { Places } from './collections/Places'
import { ArchiveItems } from './collections/ArchiveItems'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Regions } from './collections/Regions'
import { Media } from './collections/Media'
import { Comments } from './collections/Comments'
import { CommentLikes } from './collections/CommentLikes'
import { Inquiries } from './collections/Inquiries'
import { Subscribers } from './collections/Subscribers'
import { DailyStats } from './collections/DailyStats'
import { AdminConversations } from './collections/AdminConversations'
import { AdminMessages } from './collections/AdminMessages'

import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'

import { hasRole, isStaffUser } from './access'
import { getAdminStats } from './lib/admin-stats'
import { processDocumentImport } from './lib/import-document'
import { postEditor } from './editor/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  'http://localhost:3000'

const secret = process.env.PAYLOAD_SECRET
if (!secret) throw new Error('PAYLOAD_SECRET env oʻzgaruvchisi majburiy')

const plugins: Plugin[] = []

if (
  process.env.R2_BUCKET &&
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY
) {
  plugins.push(
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            process.env.R2_PUBLIC_URL
              ? `${process.env.R2_PUBLIC_URL}/${prefix}/${filename}`
              : `/${prefix}/${filename}`,
        },
      },
      bucket: process.env.R2_BUCKET,
      config: {
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: 'auto',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
      },
      clientUploads: true,
    }),
  )
}

plugins.push(
  nestedDocsPlugin({
    collections: ['categories'],
    generateLabel: (_, doc) => String((doc as { title?: string }).title ?? ''),
    generateURL: (docs) => docs.reduce((u, doc) => `${u}/${(doc as { slug?: string }).slug ?? ''}`, ''),
  }),
  seoPlugin({
    collections: ['posts', 'pages', 'persons', 'events', 'places', 'archive-items'],
    uploadsCollection: 'media',
    tabbedUI: true,
    generateTitle: ({ doc }) => {
      const typed = doc as { title?: string; name?: string }
      return `${typed.title ?? typed.name ?? ''} — hisinf.uz`
    },
    generateDescription: ({ doc }) => {
      const typed = doc as { excerpt?: string; summary?: string; shortBio?: string }
      return typed.excerpt ?? typed.summary ?? typed.shortBio ?? ''
    },
  }),
)

export default buildConfig({
  serverURL,
  cors: [serverURL],
  csrf: [serverURL],
  localization: {
    locales: [
      { code: 'uz', label: 'Oʻzbekcha' },
      { code: 'kaa', label: 'Qaraqalpaqsha' },
    ],
    defaultLocale: 'uz',
    fallback: true,
  },
  graphQL: {
    disable: true,
  },
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — hisinf.uz Tahririyat',
      icons: [{ url: '/favicon.svg' }],
    },
    components: {
      graphics: {
        Logo: '/components/admin/AdminLogo#AdminLogo',
        Icon: '/components/admin/AdminIcon#AdminIcon',
      },
      beforeNavLinks: [
        '/components/admin/NavWorkdesk#NavWorkdesk',
        '/components/admin/NavThemeToggle#NavThemeToggle',
      ],
      afterNavLinks: ['/components/admin/NavUserCard#NavUserCard'],
      beforeDashboard: ['/components/admin/Dashboard#Dashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  endpoints: [
    {
      path: '/admin-stats',
      method: 'get',
      handler: async (req) => {
        if (!hasRole(req.user, 'admin', 'editor')) {
          return Response.json({ error: 'forbidden' }, { status: 403 })
        }
        const range = Number(new URL(req.url!).searchParams.get('range') ?? 30)
        return Response.json(await getAdminStats(req.payload, range))
      },
    },
    {
      path: '/import-document',
      method: 'post',
      handler: async (req) => {
        if (!isStaffUser(req.user)) {
          return Response.json({ error: 'forbidden' }, { status: 403 })
        }
        try {
          const formData = await req.formData?.()
          const file = formData?.get('file') as File | null
          if (!file) {
            return Response.json({ error: 'Fayl tanlanmadi' }, { status: 400 })
          }
          const result = await processDocumentImport(req.payload, file)
          return Response.json({ success: true, ...result })
        } catch (err: unknown) {
          return Response.json(
            { error: err instanceof Error ? err.message : 'Import xatosi' },
            { status: 400 },
          )
        }
      },
    },
  ],
  i18n: {
    supportedLanguages: { en, ru },
  },
  collections: [
    Users,
    Readers,
    Posts,
    Pages,
    Periods,
    Persons,
    Events,
    Places,
    ArchiveItems,
    Categories,
    Tags,
    Regions,
    Media,
    Comments,
    CommentLikes,
    Inquiries,
    Subscribers,
    DailyStats,
    AdminConversations,
    AdminMessages,
  ],
  globals: [Header, Footer, SiteSettings, HomePage],
  editor: postEditor,
  secret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // dev muhitda yangi v2 kolleksiyalari jadvallari avtomatik moslashadi
    push: process.env.NODE_ENV === 'development',
  }),
  sharp,
  plugins,
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: process.env.EMAIL_FROM || 'noreply@hisinf.uz',
        defaultFromName: 'HISINF',
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
})
