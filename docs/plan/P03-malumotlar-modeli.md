# P3 — Ma'lumotlar modeli

**Maqsad:** barcha kolleksiya va globallarni yaratish. Ruxsatlar (access) bu phase'da **vaqtincha soddalashtirilgan** bo'ladi (`read: () => true`, qolganlari `isStaff`). To'liq ruxsatlar P4 da yoziladi.
**Muhim:** har kolleksiya alohida faylda (`src/collections/<Nom>.ts`) bo'ladi va `payload.config.ts` ga qo'shiladi. Har stage oxirida `pnpm generate:types` ishga tushiriladi.

**Admin'dagi nomlar** (`labels`, maydon `label`) o'zbekcha yoziladi. Admin'da guruhlar (`admin.group`): `Kontent`, `Tarix`, `Taksonomiya`, `Media`, `Sayt sozlamalari`, `Foydalanuvchilar`, `O'quvchilar`.

---

## P3.S1 — Yordamchi funksiyalar va umumiy maydonlar

- [ ] **P3.S1.1** `src/lib/slugify.ts`:
  ```ts
  const APOS = /['`´‘’ʻʼʹ]/g

  export function slugify(input: string, maxLength = 80): string {
    return input
      .toLowerCase()
      .replace(APOS, '')                                   // oʻ → o, gʻ → g
      .normalize('NFD').replace(/[̀-ͯ]/g, '')    // á → a, ǵ → g, ń → n
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, maxLength)
      .replace(/-+$/g, '')
  }
  ```
  Unit test: `slugify("Oʻzbekiston tarixi")` → `"ozbekiston-tarixi"`, `slugify("Qaraqalpaqstan ǵárezsizligi")` → `"qaraqalpaqstan-garezsizligi"`, `slugify("Amir Temur (1336–1405)")` → `"amir-temur-1336-1405"`.
- [ ] **P3.S1.2** `src/fields/slug.ts` — `slugField(sourceField = 'title')` funksiyasi `Field` qaytaradi:
  - `name: 'slug'`, `type: 'text'`, `unique: true`, `index: true`, `admin.position: 'sidebar'`, `localized` YO'Q.
  - `hooks.beforeValidate`: qiymat bo'sh bo'lsa, `data[sourceField]` dan `slugify` qiladi. Agar `req.locale !== 'uz'` bo'lsa va slug bo'sh bo'lsa, `originalDoc.slug` saqlanadi. Natija bo'sh bo'lsa: `item-${Date.now()}`.
  - `admin.description`: "Avtomatik yaratiladi. Chop etilgandan keyin o'zgartirmang — havolalar buziladi."
- [ ] **P3.S1.3** `src/fields/sources.ts` — `sourcesField(): Field` (manbalar):
  ```ts
  {
    name: 'sources', type: 'array', label: 'Manbalar',
    labels: { singular: 'Manba', plural: 'Manbalar' },
    admin: { initCollapsed: true },
    fields: [
      { name: 'type', type: 'select', required: true, defaultValue: 'book', options: [
        { label: 'Kitob', value: 'book' }, { label: 'Maqola', value: 'article' },
        { label: 'Arxiv hujjati', value: 'archive' }, { label: 'Veb-sayt', value: 'website' },
        { label: 'Intervyu / og\'zaki', value: 'interview' }, { label: 'Boshqa', value: 'other' } ] },
      { name: 'title', type: 'text', required: true, label: 'Nomi' },
      { name: 'author', type: 'text', label: 'Muallif(lar)' },
      { name: 'year', type: 'text', label: 'Yili' },
      { name: 'publisher', type: 'text', label: 'Nashriyot / jurnal' },
      { name: 'pages', type: 'text', label: 'Sahifalar' },
      { name: 'url', type: 'text', label: 'Havola', validate: (v) => !v || /^https?:\/\//.test(String(v)) || 'http(s):// bilan boshlansin' },
      { name: 'accessedAt', type: 'date', label: 'Murojaat sanasi', admin: { condition: (_, s) => s?.type === 'website' } },
    ],
  }
  ```
- [ ] **P3.S1.4** `src/fields/years.ts` — `yearField(name, label, required?)`: `type: 'number'`, `validate`: butun son, `!== 0`, `-5000..2100` oralig'ida. `admin.description`: "Miloddan avvalgi yillar minus bilan: -329".
- [ ] **P3.S1.5** `src/fields/link.ts` — `linkField()`: `group`, ichida:
  - `type` select: `internal` (ichki hujjat), `route` (tayyor bo'lim), `custom` (tashqi URL).
  - `reference`: relationship `['pages', 'categories', 'periods', 'posts']`, `condition: type === 'internal'`.
  - `route`: select `home | posts | periods | timeline | persons | archive | map | search`, `condition: type === 'route'`.
  - `url`: text, `condition: type === 'custom'`.
  - `newTab`: checkbox.
- [ ] **P3.S1.6** `src/lib/resolve-link.ts` — `resolveLink(link, locale): { href: string; external: boolean }`. Route → yo'l jadvali: `home:'/'`, `posts:'/maqolalar'`, `periods:'/davrlar'`, `timeline:'/xronologiya'`, `persons:'/shaxslar'`, `archive:'/arxiv'`, `map:'/xarita'`, `search:'/qidiruv'`. Internal → kolleksiyaga qarab: `pages:/sahifa/{slug}`, `categories:/kategoriya/{breadcrumb yo'li}`, `periods:/davrlar/{slug}`, `posts:/maqolalar/{slug}`. Unit test yozing.
- [ ] **P3.S1.7** `src/access/index.ts` — **vaqtinchalik** yordamchilar (P4 da kengaytiriladi):
  ```ts
  import type { Access } from 'payload'
  export const anyone: Access = () => true
  export const isStaff: Access = ({ req }) => req.user?.collection === 'users'
  ```

✅ **Qabul mezonlari:** unit testlar (slugify, resolveLink) o'tadi.

---

## P3.S2 — Foydalanuvchilar (xodimlar) va Media

- [ ] **P3.S2.1** `src/collections/Users.ts` (shablondagi fayl kengaytiriladi):
  - `slug: 'users'`, `auth: { maxLoginAttempts: 5, lockTime: 10 * 60 * 1000, tokenExpiration: 60 * 60 * 8 }`
  - `admin: { useAsTitle: 'displayName', group: 'Foydalanuvchilar', defaultColumns: ['displayName', 'email', 'role', 'isActive'] }`
  - Maydonlar:
    - `displayName` — text, required. Saytda ko'rinadigan ism (masalan "Aziza R.").
    - `slug` — `slugField('displayName')`.
    - `role` — select, required, `defaultValue: 'author'`, `saveToJWT: true`, options: `admin` (Administrator), `editor` (Muharrir), `author` (Muallif).
    - `isActive` — checkbox, default `true` (faol bo'lmasa login qila olmaydi — P4 da).
    - `avatar` — upload → `media`.
    - `bio` — textarea, `localized: true`, `maxLength: 500`.
    - `classInfo` — text ("9-B sinf, 12-maktab"). **Saytda ko'rsatilmaydi**, faqat admin uchun.
- [ ] **P3.S2.2** `src/collections/Media.ts`:
  - `upload`:
    ```ts
    upload: {
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'],
      focalPoint: true,
      imageSizes: [
        { name: 'thumb', width: 400, formatOptions: { format: 'webp', options: { quality: 80 } } },
        { name: 'card', width: 800, formatOptions: { format: 'webp', options: { quality: 80 } } },
        { name: 'hero', width: 1600, formatOptions: { format: 'webp', options: { quality: 82 } } },
      ],
      adminThumbnail: 'thumb',
    },
    ```
  - Maydonlar:
    - `alt` — text, `localized`, **required**: "Rasmda nima tasvirlangan (ko'zi ojiz o'quvchilar uchun)".
    - `caption` — text, `localized`.
    - `credit` — text: "Manba / muallif (masalan: O'zR MDA, 1910)".
    - `license` — select, required, default `unknown`: `public-domain` (Jamoat mulki), `cc-by` (CC BY), `cc-by-sa` (CC BY-SA), `permission` (Ruxsat olingan), `own` (O'zimizniki), `unknown` (Noma'lum — tekshirish kerak).
    - `year` — `yearField('year', 'Yili')`, ixtiyoriy.
  - `admin.group: 'Media'`.
- [ ] **P3.S2.3** `payload.config.ts` → `sharp` ulangan bo'lsin (shablonda bor).

✅ **Qabul mezonlari:** admin'da foydalanuvchiga rol berish va rasm yuklash ishlaydi; rasm uchun `thumb/card/hero` o'lchamlari yaratiladi.

---

## P3.S3 — Taksonomiya

- [ ] **P3.S3.1** `Periods` (`slug: 'periods'`) — Tarixiy davrlar:
  - `title` (text, localized, required), `slug` (slugField), `startYear` (yearField, required), `endYear` (yearField), `description` (textarea, localized), `cover` (upload media), `color` (select: `ochre | teal | brick | olive | indigo | sand` — timeline'dagi rang belgisi, P6 tokenlariga bog'lanadi).
  - `admin: { useAsTitle: 'title', defaultColumns: ['title', 'startYear', 'endYear'], group: 'Taksonomiya' }`, `defaultSort: 'startYear'`.
- [ ] **P3.S3.2** `Regions` (`slug: 'regions'`) — Hududlar: `title` (localized, required), `slug`, `description` (textarea, localized).
- [ ] **P3.S3.3** `Categories` (`slug: 'categories'`): `title` (localized, required), `slug`, `description` (textarea, localized). `parent` va `breadcrumbs` maydonlari nested-docs plaginidan keladi:
  ```ts
  // payload.config.ts → plugins
  nestedDocsPlugin({
    collections: ['categories'],
    generateLabel: (_, doc) => String(doc.title ?? ''),
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  ```
  `pnpm add @payloadcms/plugin-nested-docs@<versiya>`.
- [ ] **P3.S3.4** `Tags` (`slug: 'tags'`): `title` (localized, required), `slug`.

✅ **Qabul mezonlari:** admin'da davr, hudud, kategoriya (ota-kategoriya bilan) va teg yaratish mumkin.

---

## P3.S4 — Posts (maqolalar)

`src/collections/Posts.ts`. Bu loyihaning eng muhim kolleksiyasi.

- [ ] **P3.S4.1** Asosiy sozlamalar:
  ```ts
  slug: 'posts',
  labels: { singular: 'Maqola', plural: 'Maqolalar' },
  admin: {
    useAsTitle: 'title',
    group: 'Kontent',
    defaultColumns: ['title', 'workflowStatus', 'author', 'period', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 30,
  },
  defaultSort: '-publishedAt',
  ```
- [ ] **P3.S4.2** Maydonlar (`tabs` bilan guruhlanadi):
  - **Tab "Kontent":**
    - `title` — text, localized, required, `maxLength: 140`.
    - `excerpt` — textarea, localized, `maxLength: 300`, label "Qisqa tavsif (kartochka va SEO uchun)".
    - `coverImage` — upload → media, label "Muqova rasmi".
    - `content` — richText, localized. Editor konfiguratsiyasi P5 da beriladi, hozircha standart `lexicalEditor()`.
  - **Tab "Tarixiy ma'lumot":**
    - `period` — relationship → periods (bitta).
    - `regions` — relationship → regions, `hasMany`.
    - `categories` — relationship → categories, `hasMany`.
    - `tags` — relationship → tags, `hasMany`.
    - `persons` — relationship → persons, `hasMany`.
    - `events` — relationship → events, `hasMany`.
    - `places` — relationship → places, `hasMany`.
  - **Tab "Manbalar":** `sourcesField()`.
  - **Tab "Tekshiruv":** (P4 da to'ldiriladi) `reviewNotes` — array: `note` (textarea, required), `by` (relationship users, readOnly), `at` (date, readOnly).
  - **Sidebar** (`admin.position: 'sidebar'`):
    - `slug` — slugField('title').
    - `workflowStatus` — select, required, default `draft`, `index: true`: `draft` (Qoralama), `in_review` (Tekshiruvda), `changes_requested` (Tuzatish kerak), `published` (Chop etilgan).
    - `author` — relationship → users, required, `defaultValue: ({ user }) => user?.id`.
    - `coAuthors` — relationship → users, `hasMany`.
    - `reviewedBy` — relationship → users, `admin.readOnly: true`.
    - `publishedAt` — date, `index: true`.
    - `featured` — checkbox, label "Bosh sahifada ajratib ko'rsatish".
    - `readingTime` — number, localized, `admin.readOnly: true` (daqiqa).
    - `commentsEnabled` — checkbox, default `true`.
    - `telegram` — group: `disabled` (checkbox, "Telegramga yuborilmasin"). Yuborilganlik haqidagi ma'lumot postning o'zida emas, P11 dagi `telegram-log` kolleksiyasida saqlanadi (post versiyalariga tegmaslik uchun).
  - **Yashirin:** `searchText` — text, localized, `index: true`, `admin.hidden: true` (P9 da to'ldiriladi).
- [ ] **P3.S4.3** Hook `src/hooks/computeReadingTime.ts` (`beforeChange`): `data.content` (joriy til) ichidagi barcha `text` tugunlaridagi so'zlarni sanaydi va `Math.max(1, Math.round(words / 180))` qiladi. 180 so'z/daqiqa — o'quvchilar uchun. Lexical JSON'ni rekursiv aylanib chiqadigan sof funksiyani `src/lib/lexical-text.ts` da yozing: `extractPlainText(root): string`. U P9 da ham ishlatiladi. Unit test yozing.

✅ **Qabul mezonlari:** admin'da maqola yaratiladi, qoralama sifatida saqlanadi (autosave), uz va kaa versiyalari alohida to'ldiriladi.

---

## P3.S5 — Tarixiy kolleksiyalar

Har biri: `versions: { drafts: true, maxPerDoc: 20 }`, `admin.group: 'Tarix'`, `sourcesField()` mavjud.

- [ ] **P3.S5.1** `Persons` (`slug: 'persons'`) — Tarixiy shaxslar:
  - `name` (text, localized, required), `slug` (slugField('name')).
  - `birthYear`, `deathYear` (yearField), `yearsApproximate` (checkbox).
  - `lifespanNote` (text, localized) — "aniq sanasi noma'lum" kabi izoh.
  - `roles` (text, localized) — "Shoir, davlat arbobi".
  - `portrait` (upload media).
  - `shortBio` (textarea, localized, `maxLength: 300`).
  - `biography` (richText, localized).
  - `period` (rel periods), `regions` (rel regions, hasMany).
  - `posts` — **join**: `{ name: 'posts', type: 'join', collection: 'posts', on: 'persons' }` (teskari bog'lanish, bazada saqlanmaydi).
  - `sources`.
  - `admin.useAsTitle: 'name'`, `defaultSort: 'name'`.
- [ ] **P3.S5.2** `Events` (`slug: 'events'`) — Voqealar (xronologiya uchun):
  - `title` (localized, required), `slug`.
  - `year` (yearField, **required**), `endYear` (yearField), `month` (number 1–12), `day` (number 1–31), `approximate` (checkbox).
  - Validatsiya: `day` bo'lsa `month` ham bo'lishi shart; `endYear >= year`.
  - `importance` — select, required, default `2`: `1` (Juda muhim), `2` (Muhim), `3` (Qo'shimcha).
  - `summary` (textarea, localized, required, `maxLength: 500`).
  - `description` (richText, localized) — ixtiyoriy batafsil matn.
  - `image` (upload media).
  - `period` (rel periods, required), `place` (rel places), `persons` (rel persons, hasMany).
  - `posts` — join (`on: 'events'`).
  - `sources`.
  - `defaultSort: 'year'`. `admin.defaultColumns: ['title', 'year', 'period', 'importance']`.
- [ ] **P3.S5.3** `Places` (`slug: 'places'`) — Tarixiy joylar:
  - `name` (localized, required), `slug` (slugField('name')).
  - `lat` (number, required, `min: -90, max: 90`), `lng` (number, required, `min: -180, max: 180`). Admin'da xaritadan tanlash komponenti P8 da qo'shiladi.
  - `placeType` — select, required: `city` (Shahar), `fortress` (Qal'a), `mausoleum` (Maqbara), `mosque` (Masjid/madrasa), `archaeological` (Arxeologik yodgorlik), `battle` (Jang joyi), `natural` (Tabiiy ob'ekt), `other` (Boshqa).
  - `summary` (textarea, localized), `image` (upload), `region` (rel regions), `periods` (rel periods, hasMany).
  - `posts` — join (`on: 'places'`), `events` — join (`collection: 'events', on: 'place'`).
  - `sources`.
- [ ] **P3.S5.4** `ArchiveItems` (`slug: 'archive-items'`) — Media arxiv birliklari:
  - `title` (localized, required), `slug`.
  - `kind` — select, required: `photo` (Fotosurat), `document` (Hujjat), `manuscript` (Qo'lyozma), `map` (Xarita), `newspaper` (Gazeta/jurnal), `other` (Boshqa).
  - `files` — upload → media, `hasMany: true`, `minRows: 1` (bir nechta sahifa yoki rasm).
  - `year` (yearField), `yearText` (text, localized — "XIX asr oxiri").
  - `description` (textarea, localized).
  - `provenance` (text, required) — "Qayerdan olingan: muzey, oilaviy arxiv ...".
  - `license` — Media'dagi bilan bir xil select, required.
  - `period`, `region`, `persons` (hasMany), `places` (hasMany).

✅ **Qabul mezonlari:** har kolleksiyada hujjat yaratish mumkin. `Persons` sahifasida "Posts" join ro'yxati ko'rinadi (bog'langan maqolalar paydo bo'lganda).

---

## P3.S6 — Statik sahifalar va Globallar

- [ ] **P3.S6.1** `Pages` (`slug: 'pages'`): `title` (localized, required), `slug`, `content` (richText, localized), `showInFooter` (checkbox). `versions.drafts: true`, `admin.group: 'Kontent'`.
- [ ] **P3.S6.2** `src/globals/Header.ts` (`slug: 'header'`):
  ```ts
  fields: [{
    name: 'navItems', type: 'array', maxRows: 8, label: 'Menyu',
    fields: [
      { name: 'label', type: 'text', localized: true, required: true },
      linkField(),          // agar submenu bo'lsa, bo'sh qoldirish mumkin
      { name: 'children', type: 'array', maxRows: 12, label: 'Submenu',
        fields: [
          { name: 'label', type: 'text', localized: true, required: true },
          { name: 'description', type: 'text', localized: true },
          linkField(),
        ] },
    ],
  }]
  ```
- [ ] **P3.S6.3** `src/globals/Footer.ts` (`slug: 'footer'`): `columns` (array, maxRows 4: `title` localized, `links` array: `label` localized + linkField), `copyright` (text, localized), `socialLinks` (array: `platform` select `telegram|instagram|youtube|facebook`, `url`).
- [ ] **P3.S6.4** `src/globals/SiteSettings.ts` (`slug: 'site-settings'`): `siteName` (localized), `tagline` (localized), `logoLight`, `logoDark` (upload), `defaultOgImage` (upload), `telegramChannelUrl`, `contactEmail`, `digestEnabled` (checkbox), `digestWeekday` (select 1–7, default 5 = juma).
- [ ] **P3.S6.5** `src/globals/HomePage.ts` (`slug: 'home-page'`): `hero` (group: `title` localized, `subtitle` localized, `image` upload, `ctaLabel` localized, `ctaLink` linkField), `featuredPosts` (rel posts, hasMany, maxRows 4), `featuredPeriods` (rel periods, hasMany), `featuredPersons` (rel persons, hasMany, maxRows 8), `showOnThisDay` (checkbox, default true).
- [ ] **P3.S6.6** Barcha globallarda `access.read: anyone`, `access.update`: hozircha `isStaff` (P4 da `isEditorOrAdmin`). `admin.group: 'Sayt sozlamalari'`.

✅ **Qabul mezonlari:** admin'da 4 ta global tahrirlanadi. Header'ga 2 darajali menyu kiritiladi.

---

## P3.S7 — SEO plagini

- [ ] **P3.S7.1** `pnpm add @payloadcms/plugin-seo@<versiya>`.
- [ ] **P3.S7.2** Konfiguratsiya:
  ```ts
  seoPlugin({
    collections: ['posts', 'pages', 'persons', 'events', 'places', 'archive-items'],
    uploadsCollection: 'media',
    tabbedUI: true,
    generateTitle: ({ doc }) => `${doc?.title ?? doc?.name ?? ''} — HISINF`,
    generateDescription: ({ doc }) => doc?.excerpt ?? doc?.summary ?? doc?.shortBio ?? '',
  }),
  ```
  `meta.title` va `meta.description` lokalizatsiya qilinganini tekshiring. Bo'lmasa, plagin opsiyalari orqali `localized: true` qiling.

✅ **Qabul mezonlari:** maqola tahririda "SEO" tab paydo bo'ladi.

---

## P3.S8 — Migratsiya va seed

- [ ] **P3.S8.1** `pnpm generate:types` → `src/payload-types.ts` yangilanadi. `pnpm typecheck` o'tadi.
- [ ] **P3.S8.2** `pnpm migrate:create data-model` → migratsiya fayli commit qilinadi.
- [ ] **P3.S8.3** `src/seed/index.ts` — `payload run` orqali ishlaydigan skript:
  - **Faqat** `process.env.ALLOW_SEED === 'true'` bo'lsa ishlaydi, aks holda chiqib ketadi (prod'ni tasodifan buzmaslik uchun).
  - Barcha `create/update` chaqiruvlarida `context: { disableRevalidate: true }` beriladi.
  - Ketma-ketlik: users (admin/editor/author test akkauntlari, parol `.env` dagi `SEED_PASSWORD` dan) → periods → regions → categories → tags → places → persons → events → posts (3 ta, uz+kaa) → pages (Biz haqimizda, Maxfiylik siyosati) → globals (header menyu P0.S4.3 bo'yicha, footer, site-settings, home-page).
  - Lokalizatsiya: avval `locale: 'uz'` bilan `create`, keyin shu ID ga `locale: 'kaa'` bilan `update`.
  - Lexical kontent uchun `src/seed/lexical.ts` da yordamchi: `paragraph(text)`, `heading(tag, text)`, `root(...children)` — eng sodda Lexical JSON qaytaradi. Tuzilmani ma'lumotnoma loyihaning seed fayllaridan oling.
  - Takroriy ishga tushirishda xato bermasin: slug bo'yicha `find`, bor bo'lsa `update`, yo'q bo'lsa `create`.
  - Rasmlar: `src/seed/images/` dagi 3–5 ta jamoat mulki rasmi `payload.create({ collection: 'media', filePath })` bilan yuklanadi.
- [ ] **P3.S8.4** `pnpm seed` (dev DB'da) → admin'da hamma ma'lumot ko'rinadi.

✅ **Qabul mezonlari:** toza `dev` branch'da `pnpm seed` xatosiz ishlaydi va ikkinchi marta ishga tushirilganda dublikat yaratmaydi.

---

## P3 yakuniy tekshiruv
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` o'tadi.
- [ ] Migratsiya fayllari commit qilingan, Vercel deploy muvaffaqiyatli.
- [ ] Progress jadvali yangilangan.
