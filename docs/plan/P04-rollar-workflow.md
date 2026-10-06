# P4 — Rollar, ruxsatlar va tahririy ish jarayoni

**Maqsad:** muallif (ko'ngilli o'quvchi) faqat qoralama yozib, tekshiruvga yubora olsin. Muharrir tekshiradi, izoh bilan qaytaradi yoki chop etadi. Admin hamma narsani boshqaradi.
**Asosiy tamoyil:** ruxsatlar **serverda** (access + hook) majburlanadi. Admin UI'dagi tugmalarni yashirish faqat qulaylik uchun, xavfsizlik uning ustiga qurilmaydi.

---

## P4.S1 — Ruxsat yordamchilari

- [ ] **P4.S1.1** `src/access/index.ts` ni to'liq yozing:
  ```ts
  import type { Access, FieldAccess, PayloadRequest } from 'payload'
  import type { User } from '@/payload-types'

  export type Role = User['role']
  type StaffUser = User & { collection: 'users' }

  export function isStaffUser(user: PayloadRequest['user']): user is StaffUser {
    return Boolean(user && user.collection === 'users' && (user as StaffUser).isActive !== false)
  }
  export function hasRole(user: PayloadRequest['user'], ...roles: Role[]): boolean {
    return isStaffUser(user) && roles.includes(user.role)
  }

  export const anyone: Access = () => true
  export const isStaff: Access = ({ req }) => isStaffUser(req.user)
  export const isAdmin: Access = ({ req }) => hasRole(req.user, 'admin')
  export const isEditorOrAdmin: Access = ({ req }) => hasRole(req.user, 'admin', 'editor')

  /** Ommaga: faqat chop etilgan. Xodimlarga: hammasi (muallif cheklovi alohida). */
  export const publishedOrStaff: Access = ({ req }) =>
    isStaffUser(req.user) ? true : { _status: { equals: 'published' } }

  // Maydon darajasida
  export const fieldIsAdmin: FieldAccess = ({ req }) => hasRole(req.user, 'admin')
  export const fieldIsEditorOrAdmin: FieldAccess = ({ req }) => hasRole(req.user, 'admin', 'editor')
  ```
  `(user as StaffUser)` qisqartirishi turlar mos kelmasa kerak bo'ladi. Iloji bo'lsa, `payload-types` dagi union turidan foydalanib, qisqartirishsiz yozing.
- [ ] **P4.S1.2** `tests/unit/access.test.ts` — `hasRole` va `isStaffUser` uchun testlar: reader foydalanuvchisi (`collection: 'readers'`) **hech qachon** xodim deb topilmasin.

✅ **Qabul mezonlari:** testlar o'tadi.

---

## P4.S2 — Ruxsatlar matritsasi

Quyidagi jadvalni **aynan** amalga oshiring. "Own" — `author` maydoni joriy foydalanuvchi bo'lgan hujjat.

| Kolleksiya | read | create | update | delete |
|---|---|---|---|---|
| `users` | admin: hammasi; boshqa xodim: faqat o'zi | admin | admin; xodim faqat o'zini (role/isActive'siz) | admin |
| `media` | hamma | xodim | admin/editor; author: faqat o'zi yuklagan | admin/editor |
| `posts` | ommaga: published; editor/admin: hammasi; author: published + own | xodim | admin/editor: hammasi; author: own **va** `workflowStatus ∈ {draft, changes_requested}` | admin |
| `persons`, `events`, `places`, `archive-items` | ommaga: published; xodim: hammasi | xodim | admin/editor: hammasi; author: own qoralama | admin/editor |
| `periods`, `regions`, `categories`, `tags` | hamma | admin/editor | admin/editor | admin |
| `pages` | ommaga: published; xodim | admin/editor | admin/editor | admin |
| globals | hamma | — | admin/editor | — |

- [ ] **P4.S2.1** `users`:
  - `read`: `({ req }) => hasRole(req.user,'admin') ? true : isStaffUser(req.user) ? { id: { equals: req.user.id } } : false`.
  - **Muhim:** ommaga `read: false`. Sayt muallif ma'lumotini Local API orqali **faqat xavfsiz maydonlar** bilan oladi (P7.S1.4).
  - `role` va `isActive` maydonlari: `access: { update: fieldIsAdmin, create: fieldIsAdmin }`.
  - `classInfo`: `access: { read: fieldIsEditorOrAdmin }`.
  - Faol bo'lmagan foydalanuvchi login qila olmasin: `hooks.beforeLogin: [({ user }) => { if (user.isActive === false) throw new APIError('Akkaunt faol emas', 403) }]`.
- [ ] **P4.S2.2** `media`: `uploadedBy` maydonini qo'shing (relationship users, readOnly, `beforeChange` da `create` bo'lsa `req.user.id`). Update/delete ruxsatlarini jadval bo'yicha yozing.
- [ ] **P4.S2.3** `posts`:
  ```ts
  access: {
    read: ({ req }) => {
      if (hasRole(req.user, 'admin', 'editor')) return true
      if (isStaffUser(req.user)) {
        return { or: [{ _status: { equals: 'published' } }, { author: { equals: req.user.id } }] }
      }
      return { _status: { equals: 'published' } }
    },
    create: isStaff,
    update: ({ req }) => {
      if (hasRole(req.user, 'admin', 'editor')) return true
      if (hasRole(req.user, 'author')) {
        return {
          and: [
            { author: { equals: req.user!.id } },
            { workflowStatus: { in: ['draft', 'changes_requested'] } },
          ],
        }
      }
      return false
    },
    delete: isAdmin,
    readVersions: isStaff,
  },
  ```
  Maydon ruxsatlari: `author`, `reviewedBy`, `featured`, `telegram`, `reviewNotes` → `update: fieldIsEditorOrAdmin`. `slug` → `update`: editor/admin har doim, author faqat chop etilmagan bo'lsa.
- [ ] **P4.S2.4** `persons/events/places/archive-items` — ularga ham `author` maydoni qo'shiladi (relationship users, `defaultValue` joriy foydalanuvchi, sidebar). Ruxsatlar jadval bo'yicha yoziladi. Muallif chop eta olmasligi uchun `beforeChange` hook `preventAuthorPublish` qo'shiladi:
  ```ts
  export const preventAuthorPublish: CollectionBeforeChangeHook = ({ data, req }) => {
    if (hasRole(req.user, 'author') && data._status === 'published') {
      throw new APIError('Faqat muharrir chop eta oladi. Qoralamani saqlang.', 403)
    }
    return data
  }
  ```
- [ ] **P4.S2.5** Taksonomiya, `pages` va globallar ruxsatlarini jadval bo'yicha yangilang.
- [ ] **P4.S2.6** Admin'da muallifga keraksiz bo'limlarni yashiring: `users` (o'zining profili qoladi), globallar va taksonomiya — `admin.hidden: ({ user }) => user?.role === 'author'`. (Bu faqat UI, ruxsat baribir serverda.)

✅ **Qabul mezonlari:** P4.S6 dagi integratsion testlar o'tadi.

---

## P4.S3 — Workflow (holatlar mashinasi)

Holatlar va o'tishlar:

```
            (muallif) yuborish                (muharrir) chop etish
  draft ────────────────────▶ in_review ─────────────────────────▶ published
    ▲                            │
    │                            │ (muharrir) tuzatishga qaytarish
    │                            ▼
    └──── (muallif tahrirlaydi) changes_requested ──(muallif) qayta yuborish──▶ in_review
```

- [ ] **P4.S3.1** `src/lib/workflow.ts` — **sof funksiya** (test qilish oson bo'lishi uchun):
  ```ts
  export type WorkflowStatus = 'draft' | 'in_review' | 'changes_requested' | 'published'
  export type StaffRole = 'admin' | 'editor' | 'author'

  const AUTHOR_TRANSITIONS: Record<WorkflowStatus, WorkflowStatus[]> = {
    draft: ['draft', 'in_review'],
    changes_requested: ['changes_requested', 'in_review'],
    in_review: [],   // muallif tekshiruvdagi postni o'zgartira olmaydi (update access ham bermaydi)
    published: [],
  }

  export function canTransition(role: StaffRole, from: WorkflowStatus, to: WorkflowStatus): boolean {
    if (role === 'admin' || role === 'editor') return true
    return AUTHOR_TRANSITIONS[from].includes(to)
  }
  ```
- [ ] **P4.S3.2** `src/lib/workflow.ts` ga `getReviewProblems(doc): string[]` ham yozing. Tekshiruvga yuborishdan oldingi talablar (o'zbekcha xato matnlari):
  - `title` bo'sh emas.
  - `excerpt` kamida 50 belgi.
  - `content` dagi matn kamida 150 so'z (`extractPlainText` dan foydalaning).
  - `coverImage` tanlangan.
  - `period` tanlangan.
  - `categories` kamida 1 ta.
  - `sources` kamida 1 ta.
- [ ] **P4.S3.3** `src/hooks/enforcePostWorkflow.ts` (`beforeChange`, Posts):
  ```ts
  export const enforcePostWorkflow: CollectionBeforeChangeHook<Post> = ({ data, originalDoc, req, operation }) => {
    const user = req.user
    // Server kodi (seed, cron) Local API'ni user'siz chaqiradi — bu ishonchli kod.
    // REST orqali anonim so'rovlarni access funksiyalari allaqachon bloklaydi.
    if (!user) return data
    if (!isStaffUser(user)) throw new APIError('Ruxsat yoʻq', 403)

    const merged = { ...originalDoc, ...data }
    const from = (originalDoc?.workflowStatus ?? 'draft') as WorkflowStatus
    let to = (data.workflowStatus ?? from) as WorkflowStatus

    // 1) Muallif chop eta olmaydi
    if (user.role === 'author' && data._status === 'published') {
      throw new APIError('Faqat muharrir chop eta oladi. "Tekshiruvga yuborish" tugmasini bosing.', 403)
    }
    // 2) Ruxsat etilgan o'tish
    if (!canTransition(user.role, from, to)) {
      throw new APIError(`Holatni "${from}" dan "${to}" ga oʻzgartirib boʻlmaydi`, 403)
    }
    // 3) Muallif yaratganda author = o'zi
    if (operation === 'create' && user.role === 'author') data.author = user.id

    // 4) Tekshiruvga yuborish: faqat uz tilida va talablar bajarilgan bo'lsa
    if (to === 'in_review' && from !== 'in_review') {
      if (req.locale !== 'uz') throw new APIError('Tekshiruvga yuborishni Oʻzbekcha versiyada bajaring', 400)
      const problems = getReviewProblems(merged)
      if (problems.length) throw new APIError(`Yuborishdan oldin tuzating: ${problems.join('; ')}`, 400)
    }
    // 5) Chop etish: holatlarni sinxronlash
    if (data._status === 'published') {
      to = 'published'
      data.reviewedBy = user.id
      data.publishedAt = merged.publishedAt ?? new Date().toISOString()
    }
    data.workflowStatus = to
    return data
  }
  ```
  `Post` turi `@/payload-types` dan olinadi. `APIError` importi `payload` dan.
- [ ] **P4.S3.4** `reviewNotes` uchun `beforeChange`: yangi qo'shilgan qatorlarga `by = req.user.id` va `at = now` avtomatik qo'yilsin (ID yo'q yoki `by` bo'sh qatorlar yangi hisoblanadi).
- [ ] **P4.S3.5** Muharrir "Tuzatish kerak" deb qaytarganda `reviewNotes` ga kamida bitta yangi izoh bo'lishi shart. `from === 'in_review' && to === 'changes_requested'` holatida tekshiring.
- [ ] **P4.S3.6** `tests/unit/workflow.test.ts`: `canTransition` ning barcha muhim holatlari (author: draft→in_review ✅, draft→published ❌, in_review→draft ❌; editor: hammasi ✅) va `getReviewProblems` (bo'sh hujjat → 7 ta muammo).

✅ **Qabul mezonlari:** unit testlar o'tadi. Admin'da muallif sifatida "Publish" bosilganda o'zbekcha xato chiqadi.

---

## P4.S4 — Bildirishnomalar (email)

- [ ] **P4.S4.1** `src/emails/layout.ts` — `emailLayout({ title, bodyHtml, locale })`: inline style'li oddiy HTML (logo matni, sarlavha, matn, footer).
- [ ] **P4.S4.2** `src/hooks/notifyWorkflow.ts` (`afterChange`, Posts). `previousDoc.workflowStatus !== doc.workflowStatus` bo'lganda:
  - `→ in_review`: barcha faol `editor` va `admin` larga email: "Yangi maqola tekshiruvda: {title}" + admin havolasi `${SERVER_URL}/admin/collections/posts/${id}`.
  - `→ changes_requested`: muallifga: "Maqolangizga tuzatish kerak" + oxirgi `reviewNotes` izohi + havola.
  - `→ published`: muallifga: "Tabriklaymiz! Maqolangiz chop etildi" + sayt havolasi.
- [ ] **P4.S4.3** Email yuborish `try/catch` ichida bo'ladi. Xato bo'lsa `req.payload.logger.error(...)` ga yoziladi, saqlash **to'xtamaydi**.
- [ ] **P4.S4.4** `req.context.disableNotifications === true` bo'lsa (seed), yuborilmaydi.

✅ **Qabul mezonlari:** test akkauntlar bilan to'liq sikl bajarilganda 3 ta email keladi.

---

## P4.S5 — Admin panel qulayliklari

- [ ] **P4.S5.1** **"Tekshiruvga yuborish" tugmasi.** `src/components/admin/SubmitForReviewButton.tsx` (`'use client'`):
  - `useAuth()` (`@payloadcms/ui`) dan foydalanuvchini oladi.
  - Rol `author` bo'lsa, Payload'ning standart `PublishButton` o'rniga **"Tekshiruvga yuborish"** tugmasini ko'rsatadi. U `workflowStatus` ni `in_review` ga o'zgartiradi (`useField({ path: 'workflowStatus' }).setValue('in_review')`) va qoralamani saqlaydi (`useForm().submit()` yoki `SaveDraftButton` mantig'i). Aniq API'ni `@payloadcms/ui` hujjati va manba kodidan tekshiring.
  - Hujjat `in_review` holatida bo'lsa, faqat "Tekshiruvda…" yozuvi ko'rinadi.
  - `editor`/`admin` uchun standart `PublishButton` qaytariladi.
  - Ulash: `admin: { components: { edit: { PublishButton: '/components/admin/SubmitForReviewButton#SubmitForReviewButton' } } }`. So'ng `pnpm generate:importmap`.
  - **Agar bu API bilan muammo chiqsa:** tugmani tashlab, `workflowStatus` select'ini sidebar'da qoldiring (server hook baribir himoya qiladi) va `docs/BLOCKERS.md` ga yozing.
- [ ] **P4.S5.2** **Holat belgisi.** `workflowStatus` uchun list view'da rangli badge: `admin.components.Cell` bilan oddiy komponent (Qoralama — kulrang, Tekshiruvda — sariq, Tuzatish — qizil, Chop etilgan — yashil).
- [ ] **P4.S5.3** **Dashboard vidjeti.** `src/components/admin/WorkflowDashboard.tsx` (server komponent) → `admin.components.beforeDashboard`:
  - Muallif uchun: "Mening maqolalarim" — holatlar bo'yicha soni + "Tuzatish kerak" ro'yxati (havolalar bilan).
  - Muharrir/admin uchun: "Tekshiruv navbati" — `in_review` maqolalar (eng eskisi birinchi) + P10 dan keyin "Moderatsiya kutayotgan izohlar" soni.
- [ ] **P4.S5.4** **Ro'yxat filtrlari.** Muallif `posts` ro'yxatini ochganda faqat o'z postlari ko'rinadi (bu read access orqali allaqachon cheklangan, chop etilganlar ham ko'rinadi — buni normal deb qabul qiling).
- [ ] **P4.S5.5** `docs/EDITOR_GUIDE.md` — muharrir uchun 1 sahifalik qo'llanma: tekshiruv navbati, izoh yozish, qaytarish, chop etish, chop etilganni tahrirlash.

✅ **Qabul mezonlari:** muallif admin'da "Publish" o'rniga "Tekshiruvga yuborish" ni ko'radi; muharrir dashboard'da navbatni ko'radi.

---

## P4.S6 — Draft preview va Live preview

- [ ] **P4.S6.1** `src/app/(frontend)/next/preview/route.ts` — ma'lumotnoma loyihadagi `next/preview` dan moslab oling:
  - Query: `path`, `previewSecret`. `previewSecret !== process.env.PREVIEW_SECRET` bo'lsa 403.
  - `payload.auth({ headers })` bilan foydalanuvchini tekshiring: **faqat xodim** bo'lsa `(await draftMode()).enable()` va `redirect(path)`.
- [ ] **P4.S6.2** `src/app/(frontend)/next/exit-preview/route.ts` — `draftMode().disable()` va bosh sahifaga redirect.
- [ ] **P4.S6.3** Posts va Pages konfiguratsiyasiga:
  ```ts
  admin: {
    livePreview: {
      url: ({ data, locale }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL}/next/preview?path=${encodeURIComponent(`/${locale?.code ?? 'uz'}/maqolalar/${data?.slug}`)}&previewSecret=${process.env.PREVIEW_SECRET}`,
    },
    preview: (data, { locale }) => /* xuddi shu URL */,
  }
  ```
  (Pages uchun yo'l: `/sahifa/${slug}`.) `livePreview.breakpoints`: Mobil 390×844, Planshet 768×1024, Desktop 1440×900.
- [ ] **P4.S6.4** Sayt sahifalarida (P7) `draftMode().isEnabled` bo'lsa: `draft: true`, `overrideAccess: true` bilan olinadi va `<RefreshRouteOnSave />` (ma'lumotnoma loyihadan, `@payloadcms/live-preview-react`) render qilinadi. Sahifa tepasida "Qoralama ko'rinishi — chiqish" paneli chiqadi.

✅ **Qabul mezonlari:** muallif o'z qoralamasini Live Preview'da ko'radi. Tizimga kirmagan foydalanuvchi `/next/preview` ga kirsa, 403 oladi.

---

## P4.S7 — Integratsion testlar

- [ ] **P4.S7.1** `tests/int/` — Vitest + Payload Local API, Neon `test` branch (`.env.test` dagi `DATABASE_URI`). Har test faylidan oldin kerakli foydalanuvchilar yaratiladi, keyin tozalanadi.
- [ ] **P4.S7.2** Test holatlari (Local API'da `overrideAccess: false, user` bilan):
  1. Mehmon (user yo'q) `posts` dan faqat `published` larni oladi.
  2. Muallif A muallif B ning qoralamasini o'qiy olmaydi.
  3. Muallif `_status: 'published'` bilan saqlay olmaydi (403).
  4. Muallif to'liq bo'lmagan postni `in_review` ga yubora olmaydi (400, xato matnida "manba" bor).
  5. Muallif to'liq postni `in_review` ga yuboradi → keyin uni tahrirlay olmaydi.
  6. Muharrir `changes_requested` ga qaytaradi (izoh bilan) → muallif yana tahrirlay oladi.
  7. Muharrir chop etadi → `workflowStatus === 'published'`, `reviewedBy` = muharrir, `publishedAt` to'ldirilgan.
  8. Mehmon `users` ni o'qiy olmaydi. Muallif boshqa foydalanuvchining email'ini o'qiy olmaydi.
  9. Muallif o'z `role` ini `admin` ga o'zgartira olmaydi.

✅ **Qabul mezonlari:** 9 ta test o'tadi.

---

## P4 yakuniy tekshiruv
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` o'tadi.
- [ ] Qo'lda sinov: 3 ta test akkaunt bilan to'liq sikl (yozish → yuborish → qaytarish → tuzatish → chop etish).
- [ ] Migratsiya yaratilgan, deploy muvaffaqiyatli, progress yangilangan.
