# HISINF — Tarixiy ma'lumotlar portali: bajarish rejasi

> Versiya: 1.0 · Tuzilgan sana: 2026-10-06
> Bu papka loyihaning **yagona bajarish rejasi**dir. Uni AI model ham, dasturchi ham bosqichma-bosqich bajaradi.

---

## 1. Hujjatdan qanday foydalanish

**Tuzilma:** `Phase` (bosqich) → `Stage` (qadam) → `Point` (aniq vazifa).

- ID formati: `P3.S2.4` = 3-phase, 2-stage, 4-point.
- Har bir phase alohida faylda (pastdagi jadvalga qarang). **Ishlayotganda faqat shu README va joriy phase faylini o'qing.**
- Har bir point boshida checkbox bor: `- [ ]`. Bajarilgach `- [x]` qiling va commit qiling.
- Har stage oxirida **"✅ Qabul mezonlari"** bor. Ular bajarilmaguncha keyingi stage'ga o'tmang.
- Phase'lar ketma-ket bajariladi. Istisno: P14 (keyingi g'oyalar) — ixtiyoriy.
- Agar point bajarib bo'lmasa: to'xtang, muammoni `docs/BLOCKERS.md` ga yozing (sana, point ID, xato matni, nima sinab ko'rildi) va foydalanuvchidan so'rang.

## 2. Phase'lar ro'yxati

| # | Fayl | Mazmuni | Hajm | MVP? |
|---|------|---------|------|------|
| P0 | [P00-tayyorgarlik.md](P00-tayyorgarlik.md) | Akkauntlar, lokal muhit, kontent tayyorgarligi | S | ✅ |
| P1 | [P01-poydevor.md](P01-poydevor.md) | Next.js + Payload loyihasi, DB, R2, email, Vercel, CI | M | ✅ |
| P2 | [P02-i18n.md](P02-i18n.md) | O'zbek/qoraqalpoq tillari: routing, tarjimalar, formatlash | M | ✅ |
| P3 | [P03-malumotlar-modeli.md](P03-malumotlar-modeli.md) | Barcha kolleksiyalar va globallar | L | ✅ |
| P4 | [P04-rollar-workflow.md](P04-rollar-workflow.md) | Rollar, ruxsatlar, Muallif → Muharrir → Chop jarayoni | L | ✅ |
| P5 | [P05-editor.md](P05-editor.md) | Professional Lexical editor, maxsus bloklar, renderer | L | ✅ |
| P6 | [P06-dizayn-tizimi.md](P06-dizayn-tizimi.md) | Ranglar, shriftlar, kunduzgi/tungi rejim, komponentlar | M | ✅ |
| P7 | [P07-sayt-sahifalari.md](P07-sayt-sahifalari.md) | Header/menyu/submenu, bosh sahifa, maqola sahifalari | L | ✅ |
| P8 | [P08-tarixiy-bolimlar.md](P08-tarixiy-bolimlar.md) | Xronologiya, shaxslar, media arxiv, interaktiv xarita | L | ✅ |
| P9 | [P09-qidiruv-seo.md](P09-qidiruv-seo.md) | Qidiruv, SEO, sitemap, JSON-LD | M | ✅ |
| P10 | [P10-oquvchilar.md](P10-oquvchilar.md) | O'quvchi akkaunti, saqlanganlar, izohlar (moderatsiya) | L | v1.1 |
| P11 | [P11-telegram-email.md](P11-telegram-email.md) | Telegram avto-post, email obuna, haftalik dayjest | M | v1.1 |
| P12 | [P12-sifat-xavfsizlik.md](P12-sifat-xavfsizlik.md) | Testlar, xavfsizlik, a11y, tezlik | M | ✅ |
| P13 | [P13-ishga-tushirish.md](P13-ishga-tushirish.md) | Domen, zaxira nusxa, mualliflarni o'qitish, launch | M | ✅ |
| P14 | [P14-keyingi-goyalar.md](P14-keyingi-goyalar.md) | MVP'dan keyingi g'oyalar | — | ❌ |

**Tavsiya etilgan tartib:** P0 → P9 (istisno: P5.S3 P6 tugagandan keyin bajariladi — P5 faylida eslatma bor), keyin P12 → P13 (birinchi ishga tushirish, MVP). P10–P11 esa launch'dan keyin, huquqiy tekshiruvdan so'ng bajariladi (3.3-bo'limga qarang). P10–P11 ni launch'dan oldin bajarish ham mumkin, lekin MVP'ni kechiktiradi.

---

## 3. Qabul qilingan qarorlar (O'ZGARTIRMANG)

### 3.1 Loyiha konteksti
- **Auditoriya:** maktab o'quvchilari (o'quvchilar va o'qituvchilar).
- **Kontent yaratuvchilar:** admin va ko'ngilli o'quvchilar (mualliflar). Ular voyaga yetmagan bo'lishi mumkin, shuning uchun **har bir post muharrir tekshiruvidan o'tadi**.
- **Tillar:** o'zbek (`uz`, lotin yozuvi) va qoraqalpoq (`kaa`, lotin yozuvi). Har bir post ikki tilda bo'lishi mumkin. Tarjima bo'lmasa, o'zbekcha versiya ko'rsatiladi va ogohlantirish chiqadi.
- **Dizayn:** arxiv/muzey uslubi: pergament fon, serif shriftlar, nozik milliy naqshlar, tungi rejimda to'q "kutubxona" palitrasi.

### 3.2 Texnologiyalar steki

| Qatlam | Tanlov | Izoh |
|--------|--------|------|
| Freymvork | **Next.js (App Router)** — Payload talab qiladigan versiya | Sayt va admin bitta loyihada |
| CMS / Admin | **Payload CMS 3.x** | Admin panel, auth, rollar, versiyalar, lokalizatsiya |
| Til | **TypeScript (strict)** | |
| Ma'lumotlar bazasi | **PostgreSQL — Neon** (Vercel Marketplace orqali) | `@payloadcms/db-postgres` |
| Fayllar (media) | **Cloudflare R2** (S3-mos) | `@payloadcms/storage-s3`, `clientUploads: true` |
| Hosting | **Vercel** | Hobby (notijorat) → kerak bo'lsa Pro |
| Rich text editor | **Lexical** (`@payloadcms/richtext-lexical`) | Maxsus bloklar bilan |
| UI | **Tailwind CSS v4 + shadcn/ui** | |
| i18n (sayt) | **next-intl** | `/uz/...`, `/kaa/...` |
| Tema | **next-themes** | light / dark / system |
| Xarita | **Leaflet + react-leaflet + OpenStreetMap** | Bepul |
| Email | **Resend** (`@payloadcms/email-resend` + `resend` SDK) | |
| Rate limit | **Upstash Redis** (`@upstash/ratelimit`) | Vercel Marketplace |
| Bot himoyasi | **Cloudflare Turnstile** (`@marsidev/react-turnstile`) | |
| Validatsiya | **zod** | Server action'larda |
| Lightbox | **yet-another-react-lightbox** | Media arxiv |
| Testlar | **Vitest** (unit/int) + **Playwright** (e2e) | Payload blank shabloni bilan keladi |
| Analitika | **@vercel/analytics** | Cookie'siz (P12) |
| Paket menejer | **pnpm** | |

**Ro'yxatda yo'q kutubxona qo'shish taqiqlanadi.** Juda zarur bo'lsa, sababini yozib foydalanuvchidan so'rang.

### 3.3 Xavflar va ochiq savollar (foydalanuvchi hal qiladi)
1. **Shaxsiy ma'lumotlar qonunchiligi.** O'zbekiston qonunchiligi fuqarolarning shaxsiy ma'lumotlarini O'zbekiston hududidagi serverlarda saqlashni talab qilishi mumkin. Vercel va Neon serverlari esa chet elda. Bu ayniqsa P10 (o'quvchi akkauntlari) va P11 (email obuna) uchun muhim. **P10/P11 dan oldin maktab rahbariyati yoki yurist bilan maslahatlashing.** Kerak bo'lsa, o'quvchi ma'lumotlarini mahalliy serverga ko'chirish alohida loyihalanadi.
2. **Voyaga yetmaganlar.** O'quvchilardan minimal ma'lumot olinadi: faqat email va taxallus. Haqiqiy ism, maktab, tug'ilgan sana va rasm so'ralmaydi. Barcha izohlar oldindan moderatsiya qilinadi.
3. **Qoraqalpoq tili sifati.** Barcha `kaa` matnlarni (UI tarjimalari, email shablonlari) ona tili egasi tekshiradi. Kodda tekshirilmagan matn `// TODO(kaa-review)` bilan belgilanadi.
4. **Bepul tarif limitlari.** Vercel Hobby'da cron kuniga 1 marta ishlaydi va funksiya so'rov hajmi 4.5 MB bilan cheklangan. Resend bepul tarifida kunlik va oylik email limiti bor. Neon bepul tarifida saqlash hajmi cheklangan. Joriy limitlarni rasmiy saytlardan tekshiring.

---

## 4. Ijrochi (AI model yoki dasturchi) uchun qat'iy qoidalar

1. **API'ni taxmin qilmang.** Reja ichidagi kod namunalari yo'nalish beradi. O'rnatilgan versiyada API boshqacha bo'lsa, rasmiy hujjat ustun:
   - Payload: https://payloadcms.com/docs
   - Next.js: https://nextjs.org/docs
   - next-intl: https://next-intl.dev/docs
   - Tailwind v4: https://tailwindcss.com/docs
   - shadcn/ui: https://ui.shadcn.com/docs
   Kodni hujjatga moslab o'zgartirsangiz, commit xabarida yozing: `note: API differs from plan, followed docs`.
2. **Ma'lumotnoma (reference) loyiha.** Payload'ning rasmiy `website` shabloni `../payload-website-reference` papkasiga klonlanadi (P1.S1). Live preview, draft preview, revalidatsiya va Lexical render uchun tayyor namunani o'sha yerdan oling.
3. **TypeScript strict.** `any`, `@ts-ignore` va `as unknown as` ishlatmang. Payload turlari `src/payload-types.ts` dan olinadi. Kolleksiya o'zgargach `pnpm generate:types` ishga tushiriladi.
4. **Admin komponent qo'shilgach** `pnpm generate:importmap` ishga tushiriladi.
5. **Har stage oxirida** quyidagilar xatosiz o'tishi shart: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`. Keyin commit qilinadi.
6. **Commit formati:** `feat(P3.S2): posts collection` · `fix(P7.S4): ...` · `docs(P13): ...`. Har commit oxirida `Co-Authored-By` qatori (agar AI yozgan bo'lsa).
7. **Sirlar** (`.env`, tokenlar) hech qachon commit qilinmaydi. Yangi env o'zgaruvchi qo'shilsa, `.env.example` ga kalit (qiymatsiz) va izoh qo'shiladi.
8. **Local API xavfsizligi.** `payload.find/create/update` standart holatda ruxsatlarni **chetlab o'tadi** (`overrideAccess: true`). Foydalanuvchi nomidan bajariladigan amalda `overrideAccess: false, user` bering yoki tekshiruvni qo'lda qiling.
9. **`req.user` ikki xil bo'ladi:** `users` (xodimlar: admin/muharrir/muallif) yoki `readers` (o'quvchilar, P10). Har access funksiyasida avval `user.collection === 'users'` tekshiriladi. Tayyor yordamchilar: `src/access/*`.
10. **Foydalanuvchilarning email'i hech qachon saytda ko'rsatilmaydi.** Muallif haqida faqat `displayName`, `slug`, `avatar` va `bio` chiqariladi.
11. **UI matnlari** faqat `messages/uz.json` va `messages/kaa.json` da saqlanadi. Komponent ichida matn yozib qo'yilmaydi. Istisno: admin panel maydon nomlari (o'zbekcha yoziladi).
12. **Ranglar** faqat CSS tokenlar orqali beriladi (P6). `#hex` va `text-red-500` kabi to'g'ridan-to'g'ri ranglar taqiqlanadi.
13. **Tutuq belgisi.** UI matnlarida `oʻ` va `gʻ` uchun `ʻ` (U+02BB), tutuq belgisi uchun `ʼ` (U+02BC) ishlatiladi. Qidiruv barcha apostrof turlarini normallashtiradi (P9).
14. **Yillar** `number` sifatida saqlanadi (`date` emas). Miloddan avvalgi yil manfiy son bilan yoziladi: `-329`. `0` yil mavjud emas.
15. **Fayl yaratishdan oldin** shu nomli fayl yo'qligini tekshiring. Bor bo'lsa, o'qib, keyin tahrirlang.
16. **Kichik qadamlar.** Bitta point, so'ng tekshiruv. Bir vaqtda bir nechta phase ustida ishlamang.

---

## 5. Arxitektura

```
                ┌──────────────────────── Vercel ────────────────────────┐
 Brauzer ──────▶│ Next.js App Router                                      │
 (o'quvchi)     │  ├─ (frontend)/[locale]/...   ommaviy sayt (ISR)        │
 (muallif)      │  ├─ (payload)/admin           Payload admin panel       │
                │  ├─ (payload)/api/...         Payload REST API          │
                │  ├─ next/preview, next/exit-preview   draft ko'rish     │
                │  └─ cron/daily                kunlik vazifalar          │
                └───┬──────────┬──────────┬──────────┬──────────┬─────────┘
                    │          │          │          │          │
               Neon Postgres  Cloudflare  Resend   Telegram   Upstash Redis
               (ma'lumot)     R2 (media)  (email)  Bot API    (rate limit)
                                          Cloudflare Turnstile (captcha)
```

### 5.1 Papka tuzilmasi (yakuniy ko'rinish)

```
hisinf/
├─ AGENTS.md                 # ijrochi uchun qoidalar (4-bo'limning qisqa nusxasi)
├─ CLAUDE.md                 # @AGENTS.md ga havola
├─ .env.example
├─ docs/
│  ├─ plan/                  # shu reja
│  ├─ BLOCKERS.md
│  ├─ AUTHOR_GUIDE.md        # mualliflar uchun qo'llanma (P5)
│  └─ EDITOR_GUIDE.md        # muharrirlar uchun qo'llanma (P4)
├─ messages/
│  ├─ uz.json
│  └─ kaa.json
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ (frontend)/
│  │  │  ├─ [locale]/        # barcha ommaviy sahifalar (5.2 ga qarang)
│  │  │  ├─ next/preview/route.ts
│  │  │  ├─ next/exit-preview/route.ts
│  │  │  └─ cron/daily/route.ts
│  │  ├─ (payload)/          # create-payload-app yaratadi, TEGMANG (importMap'dan tashqari)
│  │  ├─ sitemap.ts
│  │  └─ robots.ts
│  ├─ access/                # ruxsat yordamchilari
│  ├─ blocks/                # Lexical bloklari (Block konfiguratsiyalari)
│  ├─ collections/           # har kolleksiya alohida faylda
│  ├─ components/
│  │  ├─ ui/                 # shadcn komponentlari
│  │  ├─ layout/             # Header, Footer, MobileNav, LanguageSwitcher, ThemeToggle
│  │  ├─ post/               # PostCard, PostHeader, Toc, Footnotes, Sources, Citation
│  │  ├─ rich-text/          # RichText renderer va blok komponentlari
│  │  ├─ timeline/
│  │  ├─ map/
│  │  ├─ archive/
│  │  ├─ persons/
│  │  ├─ reader/             # P10
│  │  └─ admin/              # Payload admin uchun maxsus komponentlar
│  ├─ editor/                # lexicalEditor konfiguratsiyasi
│  ├─ emails/                # email HTML shablonlari
│  ├─ fields/                # qayta ishlatiladigan maydonlar (slug, sources, link, years)
│  ├─ globals/               # Header, Footer, SiteSettings, HomePage
│  ├─ hooks/                 # Payload hook'lar (revalidate, workflow, searchText ...)
│  ├─ i18n/                  # routing.ts, request.ts, navigation.ts
│  ├─ lib/                   # sof funksiyalar (format-year, slugify, normalize-search ...)
│  │  └─ queries/            # sayt uchun ma'lumot olish funksiyalari
│  ├─ seed/
│  ├─ middleware.ts          # (Next 16+ da: proxy.ts)
│  ├─ payload.config.ts
│  └─ payload-types.ts       # avtomatik generatsiya
└─ tests/
   ├─ unit/
   ├─ int/
   └─ e2e/
```

### 5.2 URL xaritasi

Barcha ommaviy sahifalar til prefiksi bilan ochiladi: `/uz/...` va `/kaa/...`. Yo'l segmentlari ikkala tilda ham **bir xil** (o'zbekcha). Slug'lar ham ikkala tilda bir xil.

| URL | Sahifa | Phase |
|-----|--------|-------|
| `/` | `/uz` ga redirect (yoki cookie'dagi tilga) | P2 |
| `/[locale]` | Bosh sahifa | P7 |
| `/[locale]/maqolalar` | Maqolalar ro'yxati (filtrlar bilan) | P7 |
| `/[locale]/maqolalar/[slug]` | Maqola | P7 |
| `/[locale]/kategoriya/[...slug]` | Kategoriya (ichma-ich) | P7 |
| `/[locale]/davrlar` va `/[locale]/davrlar/[slug]` | Tarixiy davrlar | P7 |
| `/[locale]/teg/[slug]` | Teg | P7 |
| `/[locale]/mualliflar/[slug]` | Muallif sahifasi | P7 |
| `/[locale]/sahifa/[slug]` | Statik sahifa (Biz haqimizda, Maxfiylik ...) | P7 |
| `/[locale]/xronologiya` va `/[locale]/xronologiya/[slug]` | Timeline va voqea | P8 |
| `/[locale]/shaxslar` va `/[locale]/shaxslar/[slug]` | Tarixiy shaxslar | P8 |
| `/[locale]/arxiv` va `/[locale]/arxiv/[slug]` | Media arxiv | P8 |
| `/[locale]/xarita` va `/[locale]/xarita/[slug]` | Interaktiv xarita va joy | P8 |
| `/[locale]/qidiruv?q=` | Qidiruv | P9 |
| `/[locale]/kirish`, `/royxatdan-otish`, `/parolni-tiklash`, `/tasdiqlash` | O'quvchi auth | P10 |
| `/[locale]/kabinet` | Saqlanganlar, profil | P10 |
| `/[locale]/obuna/tasdiqlash`, `/[locale]/obuna/bekor` | Email obuna | P11 |
| `/admin` | Payload admin | P1 |
| `/api/...` | Payload REST API | P1 |
| `/next/preview`, `/next/exit-preview` | Draft preview | P4 |
| `/cron/daily` | Vercel Cron | P11 |

### 5.3 Ma'lumotlar modeli (umumiy)

```
users (xodimlar: admin | editor | author)
  └─< posts.author, posts.coAuthors, posts.reviewedBy

posts ──> periods (1)          posts ──> categories (n)    posts ──> tags (n)
      ──> regions (n)          posts ──> persons (n)       posts ──> events (n)
      ──> places (n)           posts ──> media (cover)

persons ──> periods, regions        persons ⇠ posts (join)
events  ──> periods, places, persons  events ⇠ posts (join)
places  ──> regions, periods        places ⇠ posts, events (join)
archive-items ──> media (n), periods, regions, persons, places
pages (statik sahifalar)
categories (nested-docs: parent ──> categories)

readers (o'quvchilar, P10) ──> savedPosts: posts (n)
comments (P10) ──> posts, readers, parent: comments
subscribers (P11)

Globals: header, footer, site-settings, home-page
```

`──>` oddiy bog'lanish (relationship), `⇠` teskari ko'rinish (Payload `join` maydoni, bazada saqlanmaydi).

---

## 6. Muhit o'zgaruvchilari (to'liq ro'yxat)

`.env.example` shu ro'yxat asosida tuziladi (P1.S2):

```bash
# --- Asosiy ---
NEXT_PUBLIC_SERVER_URL=http://localhost:3000   # prod: https://<domen>
PAYLOAD_SECRET=                                 # 32+ belgili tasodifiy satr, prod'da hech qachon o'zgarmaydi
PREVIEW_SECRET=                                 # draft preview uchun tasodifiy satr
CRON_SECRET=                                    # Vercel Cron uchun tasodifiy satr

# --- Ma'lumotlar bazasi (Neon) ---
DATABASE_URI=                                   # pooled connection string
DATABASE_URI_UNPOOLED=                          # direct connection (migratsiya va zaxira uchun)

# --- Cloudflare R2 ---
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=hisinf-media
R2_PUBLIC_URL=                                  # https://media.<domen> yoki https://pub-xxxx.r2.dev

# --- Email (Resend) ---
RESEND_API_KEY=
EMAIL_FROM=noreply@<domen>

# --- Upstash Redis (P10/P11) ---
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# --- Cloudflare Turnstile (P10/P11) ---
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# --- Telegram (P11) ---
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHANNEL_ID=                            # @kanal_nomi yoki -100xxxxxxxxxx
```

Tasodifiy satr yaratish: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 7. Umumiy progress

Har phase tugagach shu jadvalni yangilang.

| Phase | Holat | Tugagan sana | Izoh |
|-------|-------|--------------|------|
| P0 | ⬜ | | |
| P1 | ⬜ | | |
| P2 | ⬜ | | |
| P3 | ⬜ | | |
| P4 | ⬜ | | |
| P5 | ⬜ | | |
| P6 | ⬜ | | |
| P7 | ⬜ | | |
| P8 | ⬜ | | |
| P9 | ⬜ | | |
| P10 | ⬜ | | |
| P11 | ⬜ | | |
| P12 | ⬜ | | |
| P13 | ⬜ | | |

Belgilar: ⬜ boshlanmagan · 🟨 jarayonda · ✅ tugagan · ⛔ bloklangan
