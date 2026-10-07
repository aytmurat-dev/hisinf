# P1 — Loyiha poydevori

**Maqsad:** Next.js + Payload loyihasi lokal va Vercel'da ishlasin. Neon (DB) va R2 (media) ulangan, email yuboriladi, CI ishlaydi.
**Natija:** `https://<loyiha>.vercel.app/admin` ochiladi, admin yaratiladi va rasm yuklanadi (rasm R2'da saqlanadi).

---

## P1.S1 — Payload loyihasini yaratish

- [x] **P1.S1.1** Repo papkasi bo'sh emas (`docs/` bor). Shuning uchun loyiha **vaqtinchalik papkada** yaratiladi:
  ```bash
  cd D:/Projects
  pnpm dlx create-payload-app@latest hisinf-tmp
  ```
  Savollarga javoblar: template = **blank**, database = **PostgreSQL**, connection string so'ralsa hozircha `postgres://localhost:5432/tmp` (keyin almashtiriladi), package manager = **pnpm**.
- [x] **P1.S1.2** `hisinf-tmp` ichidagi **hamma narsani** (`.git` va `node_modules` dan tashqari) `hisinf` ga ko'chiring. `README.md` to'qnashsa, Payload'nikini `docs/payload-template-readme.md` deb saqlang. Keyin `hisinf-tmp` ni o'chiring.
- [x] **P1.S1.3** `cd D:/Projects/hisinf && pnpm install`.
- [x] **P1.S1.4** **Ma'lumotnoma loyiha** (faqat o'qish uchun, repo'ga kirmaydi):
  ```bash
  cd D:/Projects
  pnpm dlx create-payload-app@latest payload-website-reference -t website
  ```
  O'rnatish xato bersa, uni GitHub'dan klonlang: `https://github.com/payloadcms/payload/tree/main/templates/website`. Bu papkadan live preview, `next/preview` route, `RefreshRouteOnSave`, revalidate hook'lar va Lexical renderer namunalari olinadi.
- [x] **P1.S1.5** `package.json` dagi `next`, `payload` va `@payloadcms/*` versiyalarini yozib oling. Bundan keyin **hamma `@payloadcms/*` paketlar bir xil versiyada bo'lishi shart.** Yangi `@payloadcms/*` paket qo'shilganda shu versiya ko'rsatiladi: `pnpm add @payloadcms/storage-s3@<versiya>`.
- [x] **P1.S1.6** Next.js versiyasini aniqlang. 16+ bo'lsa, middleware fayli `src/proxy.ts` deb nomlanadi, aks holda `src/middleware.ts`. Reja davomida bu fayl "middleware" deb ataladi.

✅ **Qabul mezonlari:** `pnpm dev` ishga tushadi (DB hali ulanmagani uchun xato chiqishi normal). `../payload-website-reference` papkasi mavjud.

---

## P1.S2 — Sozlamalar, skriptlar, kod sifati

- [x] **P1.S2.1** `tsconfig.json` da `"strict": true` ekanini tekshiring. `paths` ichida `"@/*": ["./src/*"]` va `"@payload-config": ["./src/payload.config.ts"]` bor bo'lsin.
- [x] **P1.S2.2** `package.json` `scripts` (mavjudlari saqlanadi, yetishmaganlari qo'shiladi):
  ```json
  {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "generate:types": "payload generate:types",
    "generate:importmap": "payload generate:importmap",
    "migrate:create": "payload migrate:create",
    "migrate": "payload migrate",
    "seed": "payload run src/seed/index.ts",
    "ci": "payload migrate && pnpm build"
  }
  ```
  `next lint` o'rnatilgan Next versiyasida olib tashlangan bo'lsa, `"lint": "eslint ."` qiling.
- [x] **P1.S2.3** Prettier: `.prettierrc` → `{ "semi": false, "singleQuote": true, "printWidth": 100, "trailingComma": "all" }`. Payload shablonida boshqacha sozlama bo'lsa, shablonnikini saqlang.
- [x] **P1.S2.4** `.gitignore` da `.env`, `.env.local`, `node_modules`, `.next`, `/media`, `test-results`, `playwright-report` bor bo'lsin.
- [x] **P1.S2.5** `.env.example` ni README 6-bo'limidagi ro'yxat bilan yarating. `.env` ni undan nusxa qilib to'ldiring.
- [x] **P1.S2.6** `AGENTS.md` mavjudligini tekshiring. README dagi 4-bo'lim bilan mos bo'lsin.

✅ **Qabul mezonlari:** `pnpm lint` va `pnpm typecheck` xatosiz o'tadi.

---

## P1.S3 — Ma'lumotlar bazasi (Neon)

- [ ] **P1.S3.1** Vercel'da loyiha hali yo'q bo'lsa, Neon'ni to'g'ridan-to'g'ri https://neon.tech da yarating. Region: **Frankfurt (eu-central-1)** — O'zbekistonga eng yaqini. Loyiha nomi `hisinf`.
- [ ] **P1.S3.2** Neon'da branch'lar: `main` (production), `dev` (lokal ishlab chiqish), `test` (integratsion testlar). Har biri uchun **pooled** va **unpooled (direct)** connection string'larni oling.
- [ ] **P1.S3.3** Lokal `.env`: `DATABASE_URI` = `dev` branch pooled URL, `DATABASE_URI_UNPOOLED` = `dev` branch direct URL.
- [ ] **P1.S3.4** `src/payload.config.ts` da adapter:
  ```ts
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
    // dev'da sxema avtomatik "push" qilinadi; prod'da faqat migratsiyalar
  }),
  ```
- [ ] **P1.S3.5** **Qoida:** lokal `pnpm dev` hech qachon `main` (prod) branch'ga ulanmaydi. Dev'da Payload sxemani avtomatik `push` qiladi, prod esa faqat migratsiyalar bilan yangilanadi.
- [ ] **P1.S3.6** **Migratsiya ish jarayoni** (har safar kolleksiya o'zgarganda, prod'ga chiqishdan oldin):
  1. Lokal: `pnpm migrate:create <qisqa-nom>` → `src/migrations/` da fayl paydo bo'ladi.
  2. Fayl commit qilinadi.
  3. Vercel build buyrug'i `pnpm ci` bo'lgani uchun `payload migrate` avtomatik ishlaydi.
  4. Pooled ulanishda migratsiya xato bersa, Vercel'da build uchun `DATABASE_URI` ni unpooled URL'ga almashtiring.
- [ ] **P1.S3.7** `pnpm dev` → http://localhost:3000/admin → birinchi admin foydalanuvchini yarating.

✅ **Qabul mezonlari:** Admin panelga kirish mumkin. Neon konsolida `users` jadvali paydo bo'lgan.

---

## P1.S4 — Media saqlash (Cloudflare R2)

- [ ] **P1.S4.1** Cloudflare → R2 → **Create bucket**: `hisinf-media`. Location: Automatic yoki EEUR.
- [ ] **P1.S4.2** Ommaviy kirishni yoqing: bucket → Settings → **Public access**. Domen bo'lsa custom domain `media.<domen>` ulang, bo'lmasa `r2.dev` subdomenini yoqing. Manzilni `R2_PUBLIC_URL` ga yozing (oxirida `/` bo'lmasin).
- [ ] **P1.S4.3** R2 → **Manage API tokens** → token yarating: permission = **Object Read & Write**, faqat `hisinf-media` bucket. `Access Key ID`, `Secret Access Key` va `Account ID` ni `.env` ga yozing.
- [ ] **P1.S4.4** Bucket → Settings → **CORS policy** (brauzerdan to'g'ridan-to'g'ri yuklash uchun shart):
  ```json
  [
    {
      "AllowedOrigins": ["http://localhost:3000", "https://<loyiha>.vercel.app", "https://<domen>"],
      "AllowedMethods": ["GET", "PUT", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3600
    }
  ]
  ```
  Domen yoki Vercel manzili o'zgarsa, bu ro'yxat yangilanadi.
- [ ] **P1.S4.5** Paketni o'rnating: `pnpm add @payloadcms/storage-s3@<payload-versiya>`.
- [ ] **P1.S4.6** `payload.config.ts` → `plugins`:
  ```ts
  s3Storage({
    collections: {
      media: {
        prefix: 'media',
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename, prefix }) =>
          `${process.env.R2_PUBLIC_URL}/${prefix}/${filename}`,
      },
    },
    bucket: process.env.R2_BUCKET!,
    config: {
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    },
    clientUploads: true, // Vercel'ning 4.5 MB cheklovini chetlab o'tish uchun SHART
  }),
  ```
  Opsiya nomlari o'rnatilgan versiyada farq qilsa, `@payloadcms/storage-s3` hujjatiga moslang.
- [ ] **P1.S4.7** `next.config` → `images.remotePatterns` ga `R2_PUBLIC_URL` hostini qo'shing.
- [ ] **P1.S4.8** Tekshirish: admin → Media → 6 MB'dan katta rasm yuklang. Fayl R2 bucket'da `media/` ichida paydo bo'lishi va admin'da ko'rinishi kerak.

✅ **Qabul mezonlari:** Katta rasm muvaffaqiyatli yuklanadi va `R2_PUBLIC_URL/media/<fayl>` brauzerda ochiladi.

---

## P1.S5 — Email (Resend)

- [ ] **P1.S5.1** `pnpm add @payloadcms/email-resend@<payload-versiya>`.
- [ ] **P1.S5.2** `payload.config.ts`:
  ```ts
  email: resendAdapter({
    defaultFromAddress: process.env.EMAIL_FROM!,
    defaultFromName: 'HISINF',
    apiKey: process.env.RESEND_API_KEY!,
  }),
  ```
- [ ] **P1.S5.3** Domen bo'lganda: Resend → Domains → domenni qo'shing va DNS yozuvlarini (SPF, DKIM) kiriting. Shundan keyingina `EMAIL_FROM=noreply@<domen>` ishlaydi.
- [ ] **P1.S5.4** Tekshirish: admin login sahifasi → "Forgot password" → email kelishi kerak.

✅ **Qabul mezonlari:** Parolni tiklash emaili keladi.

---

## P1.S6 — Asosiy konfiguratsiya va papka tuzilmasi

- [x] **P1.S6.1** README 5.1 dagi papkalarni yarating (bo'sh papkalarga `.gitkeep` qo'ying).
- [x] **P1.S6.2** Payload shablonidagi `src/collections/Users.ts` va `src/collections/Media.ts` saqlanadi. Ular P3 da kengaytiriladi.
- [x] **P1.S6.3** `src/lib/payload.ts`:
  ```ts
  import { getPayload } from 'payload'
  import config from '@payload-config'

  export const getPayloadClient = () => getPayload({ config })
  ```
  Saytdagi barcha server kodi Payload'ga **faqat shu funksiya orqali** murojaat qiladi.
- [x] **P1.S6.4** `payload.config.ts` ga quyidagilarni qo'shing:
  ```ts
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  cors: [process.env.NEXT_PUBLIC_SERVER_URL!],
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL!],
  graphQL: { disable: true }, // ishlatilmaydi, hujum yuzasini kamaytiradi
  admin: {
    user: 'users',
    meta: { titleSuffix: ' — HISINF Admin' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  ```
- [x] **P1.S6.5** Admin panel tili: `i18n.supportedLanguages` ga `@payloadcms/translations` dagi mavjud tillardan `en` va `ru` ni, `uz` mavjud bo'lsa uni ham qo'shing va standart qilib belgilang. Mavjudligini paketning `languages` papkasidan tekshiring.

✅ **Qabul mezonlari:** `pnpm build` muvaffaqiyatli o'tadi.

---

## P1.S7 — Vercel'ga birinchi deploy

Erta deploy qilish muhim: muammolar boshidayoq ko'rinadi.

- [ ] **P1.S7.1** Kodni GitHub'ga push qiling (`main`).
- [ ] **P1.S7.2** Vercel → **Add New Project** → `aytmurat-dev/hisinf` → Framework: Next.js.
- [ ] **P1.S7.3** Build command: `pnpm ci`. Install command: `pnpm install`.
- [ ] **P1.S7.4** Environment Variables: `.env` dagi barcha kalitlarni kiriting. **Production** uchun `DATABASE_URI` = Neon `main` branch. **Preview** uchun alohida Neon branch (masalan `preview`) yoki `dev`.
- [ ] **P1.S7.5** Birinchi deploy'dan oldin lokalda `pnpm migrate:create initial` qiling va migratsiya faylini commit qiling.
- [ ] **P1.S7.6** Deploy → `https://<loyiha>.vercel.app/admin` → prod admin foydalanuvchini yarating (kuchli parol).
- [ ] **P1.S7.7** R2 CORS ro'yxatiga Vercel manzilini qo'shing (P1.S4.4) va prod'da rasm yuklashni tekshiring.

✅ **Qabul mezonlari:** Prod admin ishlaydi va prod'da yuklangan rasm R2'da paydo bo'ladi.

---

## P1.S8 — CI (GitHub Actions)

- [x] **P1.S8.1** `.github/workflows/ci.yml`:
  ```yaml
  name: ci
  on:
    pull_request:
    push:
      branches: [main]
  jobs:
    check:
      runs-on: ubuntu-latest
      env:
        PAYLOAD_SECRET: ci-secret-not-real
        DATABASE_URI: postgres://user:pass@localhost:5432/ci   # typecheck/lint uchun DB kerak emas
        NEXT_PUBLIC_SERVER_URL: http://localhost:3000
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 22
            cache: pnpm
        - run: pnpm install --frozen-lockfile
        - run: pnpm lint
        - run: pnpm typecheck
        - run: pnpm test
  ```
  Action versiyalarini GitHub Marketplace'dagi eng so'nggisiga moslang. `pnpm/action-setup` versiyani `package.json` dagi `packageManager` dan oladi. U yo'q bo'lsa, `"packageManager": "pnpm@9.x.x"` qo'shing.
- [ ] **P1.S8.2** GitHub → Settings → Branches → `main` uchun "Require status checks" (`check`) ni yoqing (ixtiyoriy, lekin tavsiya etiladi).

✅ **Qabul mezonlari:** GitHub'da push'dan keyin `ci` workflow yashil bo'ladi.

---

## P1 yakuniy tekshiruv
- [ ] Lokal: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` o'tadi.
- [ ] Prod: `/admin` ishlaydi, rasm R2'ga yuklanadi, email keladi.
- [ ] README 7-bo'limdagi progress jadvalida P1 = ✅.
