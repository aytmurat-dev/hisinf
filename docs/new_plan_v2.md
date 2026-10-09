# HISINF v2 — Dizayn asosida yangilash rejasi (`new_plan_v2.md`)

> Versiya: 2.0 · Tuzilgan sana: 2026-10-09 · Asos: `main` @ `2e4a7ee` + `Hisinf historical website design.zip`
> Bu hujjat loyihani yangi dizayn va imkoniyatlarga o'tkazish uchun **yagona bajarish rejasi**dir. U kuchsizroq AI modellar ham bajara olishi uchun yozilgan: har bir qadam aniq fayl yo'li, kod namunasi va tekshiruv mezoni bilan berilgan.
> Eski reja (`docs/plan/P00…P14`) **ma'lumotnoma** sifatida qoladi. Agar eski reja va shu hujjat bir-biriga zid bo'lsa, **shu hujjat ustun**.

---

## 0. Hujjatdan qanday foydalanish

### 0.1 Tuzilma
- `Phase` → `Stage` → `Point`. ID formati: **`V2-P3.S2.4`** (v2 rejasi, 3-phase, 2-stage, 4-point).
- Har bir point boshida checkbox bor: `- [ ]`. Bajarilgach `- [x]` qiling va commit qiling.
- Har stage oxirida **"✅ Qabul mezonlari"** bor. Ular bajarilmaguncha keyingi stage'ga o'tilmaydi.
- Phase'lar **ketma-ket** bajariladi. **V2-P0 eng shoshilinch** (xavfsizlik teshiklari): uni hech narsani kutmasdan bajaring va darhol prod'ga chiqaring.

### 0.2 Ish boshlashdan oldin (har sessiyada)
1. `AGENTS.md` ni o'qing.
2. Shu hujjatning 1–5-bo'limlarini (tahlil, qarorlar, arxitektura, ma'lumotlar modeli, dizayn tizimi) o'qing.
3. 8-bo'limdagi progress jadvalidan joriy phase'ni toping.
4. Shu phase'ning birinchi bajarilmagan `- [ ]` point'idan davom eting.
5. `docs/BLOCKERS.md` da ochiq muammolar bor-yo'qligini tekshiring.

### 0.3 Dizayn fayllarini qanday o'qish kerak
Dizayn `docs/design/` papkasida turadi. Asl arxiv ildizdagi `Hisinf historical website design.zip` faylida.

| Fayl | Nima |
|------|------|
| `hisinf.css` | **Rang tokenlari** (light/dark), davr ranglari, qog'oz teksturasi, barcha `@keyframes` |
| `hisinf-fx.js` | Effektlar: `reveal` (paydo bo'lish), pero-kursor, `tilt`, sahifa burchagi qayrilishi (`curl`), SVG chizish (`draw`) |
| `SiteHeader.dc.html`, `SiteFooter.dc.html` | Header va footer |
| `Home.dc.html` | Bosh sahifa |
| `Maqolalar.dc.html` | Maqolalar ro'yxati (grid/list, filtrlar) |
| `Maqola.dc.html` | Maqola sahifasi va izohlar |
| `Xronologiya.dc.html` | Davrlar va voqealar xronologiyasi |
| `Shaxslar.dc.html` | Tarixiy shaxslar (drawer bilan) |
| `Media Arxiv.dc.html` | Media arxiv (masonry va lightbox) |
| `Xarita.dc.html` | Interaktiv xarita |
| `Qidiruv.dc.html` | Qidiruv |
| `Kirish.dc.html` | Kirish va ro'yxatdan o'tish |
| `AdminSidebar.dc.html`, `Admin Dashboard.dc.html`, `Admin Muharrir.dc.html`, `Admin Foydalanuvchilar.dc.html` | Tahririyat (admin) ekranlari |
| `Logo prompt.md` | Logotip uchun AI-prompt |
| `support.js` | Dizayn vositasining runtime fayli. **Uni o'qimang va loyihaga ko'chirmang.** |

**`.dc.html` faylini o'qish qoidalari:**
- Vizual tuzilma `<x-dc>…</x-dc>` ichida, **inline `style="…"`** atributlarida yozilgan. Shu qiymatlar (px, rang tokeni, shrift) **aniq spetsifikatsiya** hisoblanadi.
- `{{ nom }}` — dinamik qiymat. Uning manbasi pastdagi `<script data-dc-script>` ichidagi `renderVals()` funksiyasida. **O'zbekcha va qoraqalpoqcha matnlar** ham shu yerda, `kaa ? {...} : {...}` ko'rinishida turadi.
- `<sc-for list="{{ x }}" as="y">` — massiv bo'yicha takrorlash (React'da `x.map(y => …)`).
- `<sc-if value="{{ x }}">` — shartli render (`{x && …}`).
- `style-hover="…"` — `:hover` holatidagi stillar (Tailwind'da `hover:` prefiksi).
- `style-focus`, `style-active` — `:focus` va `:active` holatlari.
- `data-reveal="80"` — element ko'rinishga kirganda 80ms kechikish bilan paydo bo'ladi (V2-P2.S5).
- `data-tilt`, `data-curl`, `data-hot`, `data-draw` — effektlar (V2-P2.S5).
- `<dc-import name="SiteHeader" …>` — boshqa dizayn komponentini import qilish.
- Kulrang chiziqli to'rtburchaklar (`repeating-linear-gradient(135deg,var(--ph)…)`) **rasm uchun joy**. Ular ichidagi yozuv ("gravyura portret", "arxiv fotosurati · 1924") qanday rasm turishi kerakligini bildiradi. Rasm bo'lmasa, aynan shu "joy" (`PlateFrame` komponenti) ko'rsatiladi.
- Dizayn **faqat 1440px kenglik** uchun chizilgan. Mobil va planshet qoidalari shu rejada har sahifa uchun alohida yozilgan.

### 0.4 Dizayndan kodga o'tkazish qoidalari
1. Inline style → **Tailwind klasslari**. Rang faqat token orqali beriladi: `var(--primary)` → `text-primary` yoki `bg-primary`. To'liq jadval 5-bo'limda.
2. Aniq px qiymatlar → Tailwind arbitrary qiymatlar: `font-size:52px` → `text-[52px]`, `letter-spacing:-.02em` → `tracking-[-.02em]`.
3. `font:500 12px/1 'IBM Plex Mono'` → `font-mono text-[12px] leading-none font-medium`.
4. Dizayndagi **namuna ma'lumotlar** (maqola nomlari, shaxslar, sanalar) **kodga yozilmaydi**. Ular bazadan olinadi. Ularni faqat seed (boshlang'ich ma'lumot) sifatida ishlatish mumkin.
5. Dizayndagi **matnlar** (sarlavhalar, tugmalar, yorliqlar) `messages/uz.json` va `messages/kaa.json` ga ko'chiriladi. To'liq ro'yxat 6-bo'limda.

### 0.5 Ijrochi uchun qat'iy qoidalar (AGENTS.md ga qo'shimcha)
1. **API'ni taxmin qilmang.** O'rnatilgan versiyalar: `payload@3.90.2`, `next@15.4.11`, `next-intl@4`, `tailwindcss@4`. Rejadagi kod va rasmiy hujjat farq qilsa, rasmiy hujjat ustun (https://payloadcms.com/docs, https://nextjs.org/docs/15). Farqni commit xabarida yozing.
2. **`@payloadcms/*` paketlari** hammasi bir xil versiyada (`3.90.2`) o'rnatiladi: `pnpm add @payloadcms/plugin-seo@3.90.2`.
3. **Rejada yo'q kutubxona qo'shilmaydi.** Ruxsat etilganlari 3.3-bo'limda.
4. **Local API ruxsatlarni chetlab o'tadi.** Ommaviy sahifalarda `overrideAccess: false` ishlatiladi. Foydalanuvchi nomidan bajariladigan amalda `overrideAccess: false, user` beriladi. `overrideAccess: true` faqat izoh bilan (`// overrideAccess: sababi …`) yoziladi.
5. **`req.user` uch xil bo'lishi mumkin:** `undefined` (mehmon), `users` (xodim) yoki `readers` (o'quvchi). Har access funksiyasida `user.collection` tekshiriladi.
6. **Parol hech qachon ochiq matnda saqlanmaydi va ko'rsatilmaydi.** (Hozirgi `displayPassword` maydoni o'chiriladi — V2-P0.)
7. **Email va telefon** saytda hech qachon ko'rinmaydi.
8. **Har stage oxirida:** `pnpm lint && pnpm typecheck && pnpm test && pnpm build`, keyin commit: `feat(V2-P6.S3): maqolalar ro'yxati`.
9. **Kolleksiya o'zgargach:** `pnpm generate:types`. **Admin komponent qo'shilgach:** `pnpm generate:importmap`. **Prod'ga chiqishdan oldin:** `pnpm migrate:create <nom>`.
10. **Bajarib bo'lmasa:** to'xtang va `docs/BLOCKERS.md` ga yozing (sana, point ID, xato matni, nima sinab ko'rilgani).
11. **Fayl o'chirishdan oldin** uni o'qing va undagi kerakli mantiq ko'chirilganiga ishonch hosil qiling. O'chirish ro'yxati 7.2-bo'limda.
12. **Windows muhiti:** skriptlar `cross-env` bilan ishlaydi. Yangi skriptlar ham shu uslubda yoziladi (`package.json` dagi mavjudlariga qarang).

---

## 1. Joriy holat tahlili (2026-10-09, `main` @ `2e4a7ee`)

### 1.1 Nima bor (inventar)

| Qism | Holat | Izoh |
|------|-------|------|
| Stek | ✅ | Next 15.4 + Payload 3.90.2 + Postgres (Neon) + next-intl + Tailwind 4 + next-themes |
| Lokalizatsiya | 🟨 | `uz`/`kaa` Payload localization bor. Lekin `posts.language` maydoni lokalizatsiyani takrorlaydi va kaa'ga uz matnini nusxalaydi |
| Kolleksiyalar | 🟨 | `users`, `media`, `readers`, `posts`, `comments`, `inquiries`, `periods`. **Yo'q:** persons, events, places, archive-items, categories, tags, pages, subscribers, globals |
| Maqola matni | ❌ | `content` oddiy `textarea`. Rich text, izoh (footnote), manba, rasm va bloklar yo'q |
| Admin | ❌ | Saytning ichida o'zi yozilgan `/[locale]/admin` sahifasi (1875 qator, bitta fayl) va `/api/admin/*`. Payload `/admin` ham bor, lekin ishlatilmaydi |
| O'quvchi auth | ❌ | O'zi yozilgan cookie (`hisinf_reader_session`). **Imzosiz**, osongina soxtalashtiriladi (1.2, K1) |
| Ish jarayoni (workflow) | ❌ | Yo'q: post yaratilishi bilanoq chop etiladi. Drafts va versiyalar yo'q |
| Izohlar | 🟨 | Bor, lekin moderatsiyasiz, captcha va rate limit'siz |
| Qidiruv | 🟨 | `/api/search` — 50 ta postni xotiraga olib, JS'da filtrlaydi. Faqat postlar bo'yicha qidiradi |
| Chat (murojaatlar) | 🟨 | `/chat`. Telefon raqam bo'yicha boshqalarning xabarlarini ko'rish mumkin (H1) |
| Word/PDF import | 🟨 | `/api/parse-document` — autentifikatsiyasiz |
| Dizayn | ❌ | Georgia/system shriftlari, `gold` aksentli boshqa palitra, `lucide` ikonkalar. Yangi dizayndan butunlay farq qiladi |
| Kesh | ❌ | Hamma sahifada `force-dynamic` — kesh yo'q |
| Testlar | ❌ | `expect(true).toBe(true)` darajasida. CI build qilmaydi |
| Seed | 🟨 | 1924-yil chegaralanish kontenti bor (foydali). Lekin `admin/admin123` paroli qattiq yozilgan |

### 1.2 Xavfsizlik muammolari (V2-P0 da DARHOL tuzatiladi)

| ID | Daraja | Muammo | Joyi | Oqibat |
|----|--------|--------|------|--------|
| **K1** | 🔴 Kritik | Sessiya tokeni `base64("<id>:<vaqt>")`, **imzosiz**. `getCurrentReader()` faqat id'ni o'qiydi | `src/lib/reader-auth.ts`, `src/app/api/readers/login/route.ts` | Istalgan odam `hisinf_reader_session=MTow` (`"1:0"`) cookie'sini qo'yib, superadmin bo'ladi va `/api/admin/*` orqali hamma narsani o'chiradi yoki o'zgartiradi |
| **K2** | 🔴 Kritik | `/api/posts/create` **hech qanday tekshiruvsiz** post yaratadi va darhol chop etadi | `src/app/api/posts/create/route.ts` | Istalgan odam saytga kontent chop eta oladi (spam, haqorat, zararli havolalar) |
| **K3** | 🔴 Kritik | `readers` kolleksiyasida `read: () => true` va `displayPassword` maydonida **parollar ochiq matnda** saqlanadi | `src/collections/Readers.ts` | `GET /api/readers` hamma o'quvchilarning username, telefon va **parolini** qaytaradi. O'quvchilar voyaga yetmaganlar! |
| **K4** | 🔴 Kritik | Qattiq yozilgan `admin/admin123` va "username === 'admin' bo'lsa superadmin" qoidasi | `src/seed/seedAdmin.ts`, `scripts/ensureAdminReader.ts`, `src/lib/reader-auth.ts`, `src/app/api/admin/users/route.ts` (`'admin123'` default) | Standart parol bilan kirish mumkin |
| **K5** | 🔴 Kritik | `PAYLOAD_SECRET` bo'lmasa, qattiq yozilgan zaxira satr ishlatiladi | `src/payload.config.ts` | Env yo'qolsa, JWT'larni soxtalashtirish mumkin bo'ladi |
| **H1** | 🟠 Yuqori | `GET /api/inquiries?phone=…` istalgan telefon bo'yicha xabarlarni va admin javoblarini qaytaradi | `src/app/api/inquiries/route.ts` | Shaxsiy yozishmalar oshkor bo'ladi |
| **H2** | 🟠 Yuqori | `/api/parse-document` autentifikatsiyasiz va hajm cheklovisiz | `src/app/api/parse-document/route.ts` | Katta PDF'lar bilan serverni band qilish (DoS) |
| **H3** | 🟠 Yuqori | `readers.update: Boolean(req.user)` — har qanday kirgan foydalanuvchi **istalgan** o'quvchini, jumladan uning `role` maydonini o'zgartira oladi | `src/collections/Readers.ts` | Rolni ko'tarish (privilege escalation) |
| **H4** | 🟠 Yuqori | `comments` da `read: () => true`, `create: Boolean(req.user)`. Moderatsiya, captcha va rate limit yo'q | `src/collections/Comments.ts`, `src/app/api/comments/route.ts` | Spam, haqoratli matnlar bolalar saytida darhol ko'rinadi |
| **H5** | 🟠 Yuqori | `postgresAdapter({ push: true })` | `src/payload.config.ts` | Lokal dev prod DB'ga ulansa, sxema avtomatik o'zgaradi va ma'lumot yo'qolishi mumkin |
| **M1** | 🟡 O'rta | Ommaviy sahifalarda `overrideAccess: true` | `src/app/(frontend)/[locale]/**/page.tsx` | Kelajakdagi qoralamalar ommaga chiqib ketadi |
| **M2** | 🟡 O'rta | O'quvchilardan telefon raqam yig'iladi | `Readers.ts`, `royxatdan-otish` | Voyaga yetmaganlar haqida ortiqcha shaxsiy ma'lumot |
| **M3** | 🟡 O'rta | `coverImageUrl` — istalgan tashqi rasm havolasi | `Posts.ts` | Litsenziyasiz rasm, buzilgan havolalar, `next/image` xatolari |

### 1.3 Arxitektura va sifat kamchiliklari
1. **Ikkita admin tizimi** (Payload `/admin` va o'zi yozilgan `/[locale]/admin`) va **ikkita foydalanuvchi tizimi**: `readers.role = admin/superadmin` va `users.role = admin`. Ular `users` ga "sinxronlanadi". Bu chalkash va xavfli.
2. `src/app/(frontend)/layout.tsx` `<html>` siz fragment qaytaradi, `[locale]/layout.tsx` esa `<html>` beradi. Bu Next.js qoidasiga zid ("root layout must have html/body").
3. Bosh sahifadagi izohlar soxta post (`slug = 'bosh-sahifa-izohlari'`) orqali ishlaydi. U qidiruv va ro'yxatlarda maxsus filtrlanadi. Bu "hack".
4. `posts.language` + "kaa bo'sh bo'lsa uz'ni nusxalash" mantig'i Payload `fallback` ni buzadi: tarjima borligini aniqlab bo'lmaydi.
5. Qidiruv kodi bazada emas, Node xotirasida ishlaydi.
6. Komponentlarda rang klasslari qattiq yozilgan (`bg-[#a67c3b]`, `text-black`).
7. `messages/*.json` dizayn matnlariga mos emas.
8. Migratsiyalar qo'lda yozilgan (`20261009_090000_add_roles_and_languages.ts`). `push: true` bilan aralashib ketgan.
9. CI `build` qilmaydi. Integratsion testlar ruxsatlarni tekshirmaydi.
10. Yangi dizayndagi imkoniyatlarning ko'pchiligi yo'q: xronologiya, shaxslar, arxiv, xarita, ⌘K, izoh like'lari, saqlash, shrift o'lchami, mundarija, o'qish progressi, dashboard statistikasi, ko'rishlar soni.

### 1.4 Dizayn bilan farqlar (gap analysis)

| Sahifa | Hozir | Dizaynda | Ish hajmi |
|--------|-------|----------|-----------|
| Header | Oddiy navbar + qidiruv | Yuqori satr (tagline · sana · nashr), romb-logo, 6 ta bo'lim, dumaloq qidiruv, UZ/KAA pill, tema tugmasi, qora "Kirish" pill | M |
| Footer | Oddiy | Qora fon, romb-ajratgich, 4 ustun, dayjest obunasi, Telegram | S |
| Bosh sahifa | Hero + davrlar + postlar + izohlar | I hero (gravyura, muhr, "Bugun tarixda"), marquee, II davrlar (5×2 grid), III muharrir tavsiyasi, IV "uch qo'ldan o'tadi", V shaxslar, CTA "Muallif bo'lish", izohlar | L |
| Maqolalar | Oddiy grid | Statistika, sticky filtr paneli, kategoriya pill'lari, saralash, grid/list, davr tab'lari, katta birinchi kartochka, sahifalash | L |
| Maqola | textarea matni | Progress bar, mundarija (sticky), A−/A+, saqlash, drop cap, izoh (footnote) popover'lari, iqtibos, galereya, manbalar, teglar, bog'liq shaxs, izohlar (like, javob, moderatsiya), oldingi/keyingi | XL |
| Xronologiya | yo'q | Davr paneli (flex), chapda sticky davr kartochkasi, o'ngda voqealar "umurtqasi" | L |
| Shaxslar | yo'q | Rol filtrlari, alifbo, arka shaklidagi portretlar, o'ngdan chiquvchi drawer | L |
| Media arxiv | yo'q | Tur filtrlari (soni bilan), masonry, lightbox | M |
| Xarita | yo'q | Davr slayderi, joylar ro'yxati, pinlar, info kartochka | L |
| Qidiruv | Header dropdown | Alohida sahifa: ulkan input, tab'lar (soni bilan), ommabop so'rovlar, natijada belgilangan (highlight) so'z | M |
| Kirish | 2 ta alohida sahifa (username/telefon) | Bitta split-sahifa: sirpanuvchi tab, email, parol kuchi ko'rsatkichi, rozilik checkbox'i | M |
| Admin | O'zi yozilgan panel | Tahririyat: sidebar, dashboard (statistika, grafiklar, navbat, moderatsiya), blokli muharrir (workflow, versiyalar, tarjima %), foydalanuvchilar (rollar, taklif) | XL |

### 1.5 Eski rejadan (`docs/plan`) chetga chiqishlar
- P1 dan keyin boshqa ishtirokchi rejadan tashqari, tezkor funksiyalar qo'shgan (custom admin, username auth). Ular **ishlaydi, lekin xavfsiz emas** va dizaynga mos emas.
- v2 eski rejaning qarorlarini (workflow, drafts, Lexical, ruxsatlar matritsasi, i18n) **saqlaydi**, dizayn va mavjud kontentga moslab qayta tartiblaydi.

---

## 2. Qabul qilingan qarorlar (O'ZGARTIRMANG)

| # | Qaror | Asos |
|---|-------|------|
| D1 | **Admin = Payload `/admin`**, dizayn ranglari, shriftlari va komponentlari bilan ("Tahririyat"). O'zi yozilgan `/[locale]/admin`, `/[locale]/admin-post-yaratish` va `/api/admin/*` **o'chiriladi** | Foydalanuvchi tanlovi. Xavfsizroq, kod kam, Lexical'da `/`, `+` va drag tayyor |
| D2 | **O'quvchi auth = Payload `readers` auth**: email + parol, email tasdiqlash, parolni tiklash. Eski akkauntlar username bilan ham kira oladi. **Telegram/Google tugmalari olib tashlanadi** | Foydalanuvchi tanlovi. K1 ni tubdan yo'qotadi |
| D3 | **Xodimlar** (admin/editor/author) faqat `users` kolleksiyasida. `readers` da rol bo'lmaydi | Bitta manba, privilege escalation yo'q |
| D4 | **Saqlanadi:** chat (→ "Aloqa" sahifasi, xavfsiz), Word/PDF import (→ Lexical'ga, admin ichida), bosh sahifa izohlari (→ `comments.context = 'home'`) | Foydalanuvchi tanlovi |
| D5 | **Maqola matni = Lexical richText** (`posts.body`, lokalizatsiyalangan). Eski `content` (textarea) skript bilan ko'chiriladi, keyin o'chiriladi | Dizayn: footnote, manba, iqtibos, galereya |
| D6 | **Manbalar** maqola ichidagi **"Manba" bloki** sifatida yoziladi (dizayn muharriridagidek). Saytda maqola oxiridagi "Manbalar" qutisiga yig'iladi | Dizayn: `Admin Muharrir` → `source` bloki |
| D7 | **Workflow:** `draft → in_review → (changes_requested) → approved → published`. Muallif chop eta olmaydi | Dizayn: Qoralama → Tekshiruvda → Tasdiqlandi → Chop etildi |
| D8 | **Shriftlar:** Literata (serif), IBM Plex Sans (matn/UI), IBM Plex Mono (yorliqlar, raqamlar) — `next/font/google` orqali | Dizayn |
| D9 | **Tema:** `next-themes`, `attribute="data-theme"`, qiymatlar `light`/`dark`, standart `system` | Dizayn tokenlari `[data-theme]` selektorida |
| D10 | **Tokenlar dizayndagi nomlar bilan** (`--bg`, `--fg`, `--card`, `--primary` …). shadcn CLI ishlatilmaydi — Radix primitivlari to'g'ridan-to'g'ri o'raladi | Dizayndan kodga o'tkazish oson; shadcn'ning `--muted` tokeni dizaynnikiga zid |
| D11 | **Xarita:** Leaflet + react-leaflet + OSM tile'lar. "Gravyura" ko'rinishi CSS filtr bilan beriladi. Pin'lar `divIcon` (label + romb) | Bepul, kalit kerak emas, kuchsiz model uchun oddiy |
| D12 | **Statistika (dashboard):** o'zimizning `daily-stats` jadvali (kun × til × maqola → ko'rishlar soni). Tashqi servis ishlatilmaydi | Dizayn dashboard'idagi grafiklar uchun |
| D13 | **Navigatsiya:** `header` global'ida 2 darajali menyu saqlanadi (submenu dropdown dizayn uslubida). Standart 6 ta element dizayndagidek | Foydalanuvchining asl talabi (submenu) va dizayn |
| D14 | **Davrlar sahifasi = Xronologiya** (`/xronologiya?davr=slug`). `/davrlar` va `/davrlar/[slug]` xronologiyaga redirect qilinadi | Dizayn: "Davrlar" menyusi Xronologiyaga olib boradi |
| D15 | **Izohlar oldindan moderatsiya qilinadi.** Xodim javobi avtomatik tasdiqlanadi va "Muharrir" belgisi bilan chiqadi | Bolalar sayti, dizayn |
| D16 | **O'quvchidan minimal ma'lumot olinadi:** ism (yoki taxallus), email va parol. Telefon **so'ralmaydi** va mavjud telefon raqamlar o'chiriladi | Voyaga yetmaganlar maxfiyligi (M2) |
| D17 | **Effektlar** (pero-kursor, reveal, tilt, curl, marquee) qo'llanadi, lekin `prefers-reduced-motion` da o'chadi. Kursor faqat `(hover:hover)` qurilmalarda ishlaydi | Dizayn + a11y |
| D18 | **Ishlash tartibi:** V2-P0 to'g'ridan-to'g'ri `main` ga (hotfix). Qolganlari `v2` branch'ida (Vercel preview + Neon `v2` branch), oxirida `main` ga merge qilinadi | Prod'ni buzmaslik uchun |

---

## 3. Maqsadli arxitektura

### 3.1 Umumiy ko'rinish
```
 Brauzer ─▶ Vercel / Next.js 15 (App Router)
            ├─ (frontend)/[locale]/…        ommaviy sayt (ISR, revalidate)
            ├─ (frontend)/next/preview       draft preview
            ├─ (frontend)/cron/daily         kunlik vazifalar (dayjest, tozalash)
            ├─ (payload)/admin               Tahririyat (Payload admin + custom komponentlar)
            ├─ (payload)/api/[...slug]       Payload REST (+ collection endpoints)
            ├─ app/api/search                sayt qidiruvi (v2)
            └─ app/api/track                 ko'rishlarni hisoblash (beacon)
                 │
       Neon Postgres · Cloudflare R2 (media) · Resend (email) · Upstash Redis (rate limit) · Cloudflare Turnstile
```

### 3.2 Papka tuzilmasi (yakuniy)
```
src/
├─ app/
│  ├─ (frontend)/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx               # html/body, shriftlar, ThemeProvider, Header, Footer, fx
│  │  │  ├─ page.tsx                 # Bosh sahifa
│  │  │  ├─ maqolalar/page.tsx  ·  maqolalar/[slug]/page.tsx
│  │  │  ├─ xronologiya/page.tsx ·  xronologiya/[slug]/page.tsx
│  │  │  ├─ shaxslar/page.tsx   ·  shaxslar/[slug]/page.tsx
│  │  │  ├─ arxiv/page.tsx      ·  arxiv/[slug]/page.tsx
│  │  │  ├─ xarita/page.tsx     ·  xarita/[slug]/page.tsx
│  │  │  ├─ qidiruv/page.tsx
│  │  │  ├─ kirish/page.tsx · parolni-tiklash/page.tsx · parolni-tiklash/yangi/page.tsx · tasdiqlash/page.tsx
│  │  │  ├─ kabinet/page.tsx
│  │  │  ├─ aloqa/page.tsx           # eski /chat
│  │  │  ├─ muallif-bolish/page.tsx
│  │  │  ├─ mualliflar/page.tsx · mualliflar/[slug]/page.tsx
│  │  │  ├─ sahifa/[slug]/page.tsx
│  │  │  ├─ obuna/tasdiqlash/page.tsx · obuna/bekor/page.tsx
│  │  │  ├─ not-found.tsx · error.tsx
│  │  │  └─ actions/                 # server action'lar (auth, comments, bookmarks, contact, subscribe)
│  │  ├─ next/preview/route.ts · next/exit-preview/route.ts
│  │  ├─ cron/daily/route.ts
│  │  └─ globals.css
│  ├─ (payload)/…                    # Payload shabloni + custom.css (Tahririyat mavzusi)
│  ├─ api/search/route.ts            # v2 qidiruv
│  ├─ api/track/route.ts             # ko'rishlar
│  ├─ sitemap.ts · robots.ts
├─ access/        # isStaffUser, hasRole, isReader …
├─ blocks/        # Lexical bloklari (Footnote, Source, Quote, Gallery, Callout …)
├─ collections/   # har kolleksiya alohida faylda
├─ globals/       # Header, Footer, SiteSettings, HomePage
├─ hooks/         # revalidateSite, enforcePostWorkflow, buildSearchText …
├─ fields/        # slug, years, link, sourceFields
├─ editor/        # postEditor, simpleEditor
├─ components/
│  ├─ ui/         # Radix o'ramlari (Dialog, Sheet, DropdownMenu, Popover, Tooltip)
│  ├─ brand/      # Logo, LogoMark, Seal
│  ├─ fx/         # Reveal, InkRipple, Tilt, Marquee, DrawPath
│  ├─ primitives/ # Kicker, SectionHeader, Pill, PlateFrame, DiamondDivider, PeriodDot, Avatar, Pagination …
│  ├─ layout/     # SiteHeader, MobileNav, LangToggle, ThemeToggle, SiteFooter, CommandPalette
│  ├─ home/ · posts/ · post/ · comments/ · timeline/ · persons/ · archive/ · map/ · search/ · auth/ · account/
│  ├─ rich-text/  # RichText renderer + blok komponentlari
│  └─ admin/      # Payload admin komponentlari (Dashboard, NavLinks, WorkflowTimeline …)
├─ i18n/ · lib/ (sof funksiyalar) · lib/queries/ (ma'lumot olish) · emails/ · seed/ · migrations/
scripts/v2/       # bir martalik ma'lumot ko'chirish skriptlari
docs/design/      # dizayn ma'lumotnomasi
```

### 3.3 Paketlar
**Qo'shiladi** (aniq shu ro'yxat):

| Paket | Nima uchun |
|-------|-----------|
| `@payloadcms/plugin-seo@3.90.2`, `@payloadcms/plugin-nested-docs@3.90.2`, `@payloadcms/live-preview-react@3.90.2` | SEO maydonlari, ichma-ich kategoriyalar, live preview |
| `zod` | Server action validatsiyasi |
| `@upstash/ratelimit`, `@upstash/redis` | Rate limit |
| `@marsidev/react-turnstile` | Bot himoyasi |
| `resend` | Dayjest uchun batch email |
| `leaflet`, `react-leaflet`, `@types/leaflet` (dev) | Xarita |
| `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-popover`, `@radix-ui/react-tooltip`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge` | Accessible primitivlar (o'zimiz o'raymiz, shadcn CLI'siz) |
| `@vercel/analytics` | (ixtiyoriy) trafik |

**Saqlanadi:** `mammoth`, `pdf-parse` (faqat admin ichida), `lucide-react` (faqat admin va kichik ikonkalar uchun; saytda dizayn CSS-ikonkalarini afzal ko'ring), `next-themes`, `next-intl`, `sharp`.

### 3.4 URL xaritasi
| URL | Sahifa | Phase |
|-----|--------|-------|
| `/` | `/uz` ga redirect (middleware) | P1 |
| `/[locale]` | Bosh sahifa | P6 |
| `/[locale]/maqolalar?q=&kategoriya=&davr=&saralash=new|pop|old&korinish=grid|list&sahifa=` | Maqolalar | P6 |
| `/[locale]/maqolalar/[slug]` | Maqola | P6 |
| `/[locale]/xronologiya?davr=slug` · `/[locale]/xronologiya/[slug]` | Xronologiya · voqea | P6 |
| `/[locale]/davrlar`, `/[locale]/davrlar/[slug]` | → xronologiyaga 308 redirect | P6 |
| `/[locale]/shaxslar?rol=&harf=&shaxs=slug` · `/[locale]/shaxslar/[slug]` | Shaxslar · shaxs | P6 |
| `/[locale]/arxiv?tur=&ochiq=slug` · `/[locale]/arxiv/[slug]` | Arxiv · birlik | P6 |
| `/[locale]/xarita?davr=&joy=slug` · `/[locale]/xarita/[slug]` | Xarita · joy | P6 |
| `/[locale]/qidiruv?q=&tur=` | Qidiruv | P6 |
| `/[locale]/kirish?rejim=kirish|royxat&qaytish=/…` | Kirish / ro'yxatdan o'tish | P6 |
| `/[locale]/royxatdan-otish` | → `/kirish?rejim=royxat` redirect | P6 |
| `/[locale]/tasdiqlash?token=` · `/[locale]/parolni-tiklash` · `/[locale]/parolni-tiklash/yangi?token=` | Auth yordamchi sahifalari | P6 |
| `/[locale]/kabinet?tab=saqlangan|izohlar|murojaatlar|sozlamalar` | Shaxsiy kabinet | P6 |
| `/[locale]/aloqa` | Aloqa (eski `/chat`) | P6 |
| `/[locale]/chat` | → `/aloqa` redirect | P6 |
| `/[locale]/muallif-bolish` | Muallif bo'lish arizasi | P6 |
| `/[locale]/mualliflar` · `/[locale]/mualliflar/[slug]` | Mualliflar | P6 |
| `/[locale]/sahifa/[slug]` | Statik sahifalar | P6 |
| `/[locale]/obuna/tasdiqlash?token=` · `/[locale]/obuna/bekor?token=` | Dayjest obunasi | P7 |
| `/admin` | Tahririyat | P5 |
| `/api/…` | Payload REST + `/api/search`, `/api/track` | P5/P7 |

---

## 4. Ma'lumotlar modeli v2 (umumiy ko'rinish)

Batafsil maydonlar V2-P3 da berilgan. Bu yerda umumiy xarita.

```
users (xodim: admin | editor | author)  ── posts.author, posts.coAuthors, posts.reviewedBy, comments.staffAuthor
readers (o'quvchi)                      ── comments.reader, comment-likes.reader, readers.savedPosts → posts, inquiries.reader

posts ──> periods (1) · categories (n) · tags (n) · persons (n) · events (n) · places (n) · media (cover)
posts.body (Lexical, localized) ichida bloklar: Footnote(inline), Source, Quote, Gallery, Callout, DocumentEmbed, YouTube,
                                                PersonCard, EventsTimeline, MapEmbed, ArchiveItemEmbed, upload, divider
periods ⇠ posts, persons, events (join)       persons ──> periods, regions ; ⇠ posts (join)
events ──> periods (1), places (1), persons (n) ; ⇠ posts (join)
places ──> regions, appearsIn: periods (1) ; ⇠ posts, events (join)
archive-items ──> media (n), periods, regions, persons, places
pages · categories (nested) · tags · regions
comments (context: post | home) ──> posts?, readers?, users? (staffAuthor), parent: comments
comment-likes (comment × reader, unique)
inquiries (type: contact | author_application) ──> readers?
subscribers (dayjest)
daily-stats (day × locale × post → views, unique)
Globals: header, footer, site-settings, home-page
```

**Asosiy o'zgarishlar (hozirgi holatga nisbatan):**

| Kolleksiya | O'zgarish |
|------------|-----------|
| `posts` | `+body` (richText), `+versions.drafts`, `+workflowStatus`, `+reviewNotes`, `+noteToEditor`, `+coAuthors`, `+reviewedBy`, `+categories/tags/persons/events/places`, `+readingTime`, `+views`, `+featured`, `+seo`. **O'chiriladi:** `content` (textarea), `coverImageUrl`, `language` (ko'chirilgandan keyin) |
| `readers` | `+email` (yangilar uchun majburiy), `+displayName`, `+auth.verify`, `+isBanned`, `+acceptedTermsAt`, `+locale`. **O'chiriladi:** `displayPassword`, `role`, `phone`, `firstName/lastName` (`displayName` ga birlashtiriladi) |
| `users` | `+slug`, `+isActive`, `+bio`, `+classInfo`, rol default `author`, invite endpoint |
| `comments` | `+status`, `+context`, `+parent`, `+staffAuthor`, `+likesCount`, `+flagged`; `post` ixtiyoriy (home uchun) |
| `inquiries` | `+type`, `+reader`, `+email`, `+subject`; `phone` o'chiriladi; GET faqat o'z xabarlari |
| `media` | `+imageSizes`, `alt` lokalizatsiya qilinadi, `+caption`, `+credit`, `+license`, `+year` |
| `periods` | `+order`, `+shortTitle`, `+yearsLabel`, `+timelineWeight`, `+cover`, `+coverCaption`, rang `sand` qo'shiladi |
| Yangi | `persons`, `events`, `places`, `archive-items`, `categories`, `tags`, `regions`, `pages`, `comment-likes`, `subscribers`, `daily-stats`, globals |

---

## 5. Dizayn tizimi spetsifikatsiyasi (manba: `docs/design/hisinf.css` va `.dc.html` fayllar)

### 5.1 Rang tokenlari (AYNAN shu qiymatlar)

| Token | Light | Dark | Tailwind klassi | Qayerda |
|-------|-------|------|-----------------|---------|
| `--bg` | `#f5efe3` | `#15110d` | `bg-bg`, `text-bg` | sahifa foni |
| `--fg` | `#2b2118` | `#ede4d3` | `bg-fg`, `text-fg` | asosiy matn, qora pill'lar |
| `--card` | `#fbf7ee` | `#1f1914` | `bg-card` | kartochkalar |
| `--surface-2` | `#efe6d4` | `#2a221b` | `bg-surface-2` | ikkinchi darajali fon |
| `--muted` | `#6b5d4f` | `#a89a86` | `text-muted` | ikkinchi darajali matn |
| `--primary` | `#8c2f1b` | `#d9785c` | `bg-primary`, `text-primary` | muhr qizili, aksent |
| `--primary-fg` | `#fff8ee` | `#1a120c` | `text-primary-fg` | primary ustidagi matn |
| `--teal` | `#2f5d62` | `#6fb1b5` | `text-teal`, `bg-teal` | ikkinchi aksent, "tekshirilgan" |
| `--border` | `#dccfb8` | `#3a3027` | `border-border` | ingichka chegara |
| `--line` | `#2b2118` | `#ede4d3` | `border-line` | **asosiy chiziq** (gravyura uslubi) |
| `--gold` | `#a07a3c` | `#cfae74` | `text-gold` | "moderatsiyada" kabi belgilar (matnda kam) |
| `--ornament` | `#b89a6a` | `#7a6446` | `text-ornament`, `bg-ornament` | bezak rombchalar |
| `--ring` | `#2f5d62` | `#6fb1b5` | `ring-ring`, `outline-ring` | fokus |
| `--ph` | `rgba(43,33,24,.07)` | `rgba(237,228,211,.06)` | — | rasm joyi shtrixi |
| `--shadow` | `rgba(60,40,20,.12)` | `rgba(0,0,0,.4)` | — | soya |
| `--p-ochre` | `#b7791f` | `#e0a54a` | `text-p-ochre`, `bg-p-ochre` | davr rangi |
| `--p-teal` | `#2f5d62` | `#6fb1b5` | `…-p-teal` | davr rangi |
| `--p-brick` | `#8c2f1b` | `#d9785c` | `…-p-brick` | davr rangi |
| `--p-olive` | `#5f6b2e` | `#a5b36a` | `…-p-olive` | davr rangi |
| `--p-indigo` | `#3b4a7a` | `#8d9be0` | `…-p-indigo` | davr rangi |
| `--p-sand` | `#9c7f57` | `#c9ad86` | `…-p-sand` | davr rangi |
| `--paper` | SVG `feTurbulence` data-URI | xuddi shu | `bg-paper` | body fon teksturasi |

Davr rangi qiymati (`periods.color`): `ochre | teal | brick | olive | indigo | sand` → CSS: `var(--p-${color})`.

### 5.2 Tipografiya

| Rol | Shrift | Desktop (1440) | Mobil (<768) | Tailwind |
|-----|--------|----------------|--------------|----------|
| Hero H1 | Literata 400 | `clamp(52px,6.4vw,92px)`, lh .98, ls -.035em | 44px | `font-serif font-normal text-[clamp(44px,6.4vw,92px)] leading-[.98] tracking-[-.035em]` |
| Sahifa H1 (Maqolalar, Shaxslar…) | Literata 400 | `clamp(56px,7vw,104px)`, lh .95, ls -.04em | 48px | `text-[clamp(48px,7vw,104px)] leading-[.95] tracking-[-.04em]` |
| Maqola H1 | Literata 400 | `clamp(44px,5.4vw,78px)`, lh 1.02, ls -.03em | 36px | |
| Bo'lim H2 | Literata 400 | 52px, lh 1.05, ls -.02em | 34px | `text-[34px] md:text-[52px] leading-[1.05] tracking-[-.02em]` |
| Maqola ichidagi H2 | Literata 500 | 34px, lh 1.2 | 28px | |
| Rim raqami (bo'lim) | Literata 400 | 64px, `text-primary` | 40px | |
| Kartochka sarlavhasi | Literata 500 | 22–38px (kontekstga qarab), lh 1.12–1.25 | 20–26px | |
| Lead/subtitle | Literata 400 | 19–21px, lh 1.55, `text-muted` | 17px | |
| Maqola matni | Literata 400 | 19px (16–23 oralig'ida A−/A+), lh 1.72 | 18px | `.prose-hisinf` |
| UI matni | IBM Plex Sans 400/500/600 | 13–15.5px | xuddi shu | `font-sans` |
| **Kicker** (yuqori yorliq) | IBM Plex Mono 500 | 12px, uppercase, ls .14em, `text-primary` | 11px | `font-mono text-[12px] font-medium uppercase tracking-[.14em]` |
| Meta (sana, daqiqa) | IBM Plex Mono 400/500 | 11–12.5px | xuddi shu | `font-mono text-[12px]` |
| Tugma | IBM Plex Sans 500 | 14–15.5px | xuddi shu | |

Qoidalar: sarlavhalarda `text-wrap: balance` (`text-balance`), paragraflarda `text-wrap: pretty` (`text-pretty`) ishlatiladi. Yillar va raqamlarda `tabular-nums`.

### 5.3 Shakl va masofa
- **Chiziqlar:** asosiy bo'linishlar `1px solid var(--line)` (to'q), ikkinchi darajalilari `1px solid var(--border)`.
- **Radius:** kartochkalarda radius **yo'q** (0, gravyura uslubi). Tugma va pill'lar `rounded-full`. Inputlar `rounded-[8px]`. Admin kartochkalari `rounded-[10px]`.
- **"Ofset soya":** `box-shadow: 8px 8px 0 var(--fg)` yoki `6px 6px 0 var(--fg)` (hover'da), tugmalarda `0 4px 0 var(--fg)`.
- **Sahifa ichki chetlari (gutter):** desktop `px-12` (48px), planshet `px-8`, mobil `px-4` (16px).
- **Bo'limlar orasi:** desktop `py-28` (112px), mobil `py-16`.
- **Kontent kengligi:** maqola matni `max-w-[680px]`, maqola layout'i `max-w-[1200px]`, qidiruv `max-w-[1040px]`.

### 5.4 Breakpoint'lar va moslashuv (dizaynda yo'q, shu yerda belgilanadi)
| Nom | Kenglik | Asosiy qoidalar |
|-----|---------|-----------------|
| mobil | <768 | Bitta ustun, header'da burger. Yuqori satr (tagline) yashiriladi. Gutter 16px |
| planshet | 768–1023 | 2 ustun, header'da burger |
| desktop | ≥1024 | To'liq nav. Grid'lar dizayndagidek (≥1280 da to'liq ustunlar soni) |

**Har sahifaning mobil qoidalari** P6 dagi tegishli stage'da yozilgan.

### 5.5 Animatsiyalar (`hisinf.css` dan, AYNAN shu nomlar bilan)
`hf-up` (pastdan chiqish 18px), `hf-ink` (chapdan o'ngga siyoh chizig'i, `clip-path`), `hf-spin`, `hf-pulse` (qizil to'lqin), `hf-blink`, `hf-marquee` (`translateX(-50%)`), `hf-draw` (SVG chizish), `hf-float` (−6px suzish), `hf-grow` (`scaleY` 0→1), `hf-pop` (dialog paydo bo'lishi), `hf-slide` (o'ngdan sirpanish), `hf-drop` (pin tushishi), `hf-ping` (pin atrofidagi halqa).
Easing: `cubic-bezier(.2,.7,.2,1)`. `prefers-reduced-motion: reduce` da **hammasi o'chadi**.

### 5.6 Effektlar (`hisinf-fx.js` dan → React)
| Effekt | Dizayndagi atribut | Implementatsiya |
|--------|-------------------|-----------------|
| Reveal | `data-reveal="<ms>"` | `<Reveal delay={ms}>` client komponenti: `IntersectionObserver` (threshold .12) + `element.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'none'}],{duration:700,delay,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'})` |
| Pero-kursor | butun sahifa | **CSS** (`html.fx-cursor`) + kichik `<InkRipple/>` (mousedown'da kengayuvchi halqa) |
| Tilt | `data-tilt` | `<Tilt>`: `mousemove` → `perspective(900px) rotateX(-y*5deg) rotateY(x*6deg) translateY(-3px)` |
| Curl | `data-curl` | **Faqat CSS**: `.curl::after` burchagi hover'da 0→46px |
| Draw | `data-draw` | `<DrawPath>`: SVG `path` uchun `strokeDasharray`/`strokeDashoffset` 2.4s |
| Marquee | bosh sahifa | CSS `animation: hf-marquee 48s linear infinite` (ro'yxat 2 marta takrorlanadi), hover'da pauza |

### 5.7 Komponentlar katalogi (P2 da yaratiladi)
| Komponent | Dizayndagi manba | Qisqa tavsif |
|-----------|------------------|--------------|
| `LogoMark` | SiteHeader 26–30-qatorlar | 38×38: ikki ichma-ich aylantirilgan kvadrat (romb) va "H" (Literata 700, `text-primary`) |
| `Logo` | SiteHeader | `LogoMark` + "hisinf**.uz**" (`.uz` primary) + "historical info" (mono 9.5px) |
| `Seal` | Home 41–48, Kirish 23 | Dumaloq muhr: chegara, ichida aylanuvchi uzuq-uzuq halqa (`hf-spin 30s`), suzish (`hf-float`) |
| `Kicker` | ko'p joyda | 28px chiziq + mono uppercase matn |
| `SectionHeader` | Home 66–73 | `[rim raqam] [kicker + h2] [havola →]` grid'i, pastida `border-line` |
| `Pill` | ko'p joyda | variantlar: `primary` (ofset soyali), `outline`, `dark`, `filter` (tanlangan/tanlanmagan), `ghost` |
| `IconCircleButton` | Header | 40px dumaloq, `border-border`, hover'da `border-line` |
| `PlateFrame` | ko'p joyda | Gravyura "plastinkasi": tashqi `border-line p-[10px] bg-card`, ichki `border-line bg-hatch`, ichida rasm yoki yorliq |
| `DiamondDivider` | Footer 14–20, editor | chiziq · romb · **qizil romb** · romb · chiziq |
| `PeriodDot` | ko'p joyda | 7–14px aylantirilgan kvadrat, davr rangida |
| `PeriodBadge` | Maqolalar | `rounded-full border` davr rangida, mono 10–11px uppercase |
| `Avatar` | Maqola, admin | Initsiallar, doira, fon davr/palitra rangida (id'dan hash) |
| `Pagination` | Maqolalar 110–118 | ← Oldingi · 42px doira raqamlar · Keyingi → |
| `EmptyState` | Maqolalar 61–66 | uzuq-uzuq chegara, kursiv serif sarlavha |
| `StatNumber` | Maqolalar 23–26 | Literata 44px raqam + mono yorliq |
| `CountTabs` | Arxiv, Qidiruv | yorliq + soni (mono, .6 opacity) bilan filter pill'lar |

---

# V2-P0 — Xavfsizlik hotfix'i (SHOSHILINCH, birinchi navbatda)

**Maqsad:** 1.2-bo'limdagi K1–K5 va H1–H5 teshiklarini **mavjud kodni qayta yozmasdan** yopish va darhol prod'ga chiqarish.
**Branch:** `main` (to'g'ridan-to'g'ri). Bitta stage — bitta commit.
**Muhim:** bu phase'da UI o'zgarmaydi. Faqat server tomonidagi tekshiruvlar qo'shiladi.

## V2-P0.S1 — Zaxira nusxa

- [ ] **V2-P0.S1.1** Neon konsoli → Branches → `main` dan yangi branch: `backup-2026-10-09-pre-v2`. Bu bir zumda olingan to'liq nusxa. Uni **o'chirmang**.
- [ ] **V2-P0.S1.2** Vercel → Settings → Environment Variables → Production'da `PAYLOAD_SECRET` mavjudligini va 32+ belgidan iboratligini tekshiring. Yo'q bo'lsa: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` bilan yarating va qo'shing. Natijani `docs/BLOCKERS.md` ga emas, xavfsiz joyga yozing.

✅ **Qabul mezonlari:** Neon'da backup branch ko'rinadi; prod'da `PAYLOAD_SECRET` bor.

## V2-P0.S2 — Imzolangan sessiya (K1)

- [x] **V2-P0.S2.1** Yangi fayl `src/lib/session.ts`:
  ```ts
  import { createHmac, timingSafeEqual } from 'crypto'

  const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

  function getSecret(): string {
    const s = process.env.PAYLOAD_SECRET
    if (!s || s.length < 32) throw new Error('PAYLOAD_SECRET is missing or too short')
    return s
  }

  function sign(data: string): string {
    return createHmac('sha256', getSecret()).update(data).digest('base64url')
  }

  /** Token formati: "<readerId>.<issuedAtMs>.<hmac>" */
  export function createSessionToken(readerId: number): string {
    const data = `${readerId}.${Date.now()}`
    return `${data}.${sign(data)}`
  }

  /** To'g'ri va muddati o'tmagan bo'lsa readerId, aks holda null */
  export function verifySessionToken(token: string | undefined | null): number | null {
    if (!token) return null
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [idStr, issuedStr, sig] = parts
    const expected = sign(`${idStr}.${issuedStr}`)
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
    const issued = Number(issuedStr)
    if (!Number.isFinite(issued) || Date.now() - issued > MAX_AGE_MS) return null
    const id = Number(idStr)
    return Number.isInteger(id) && id > 0 ? id : null
  }
  ```
- [x] **V2-P0.S2.2** `src/app/api/readers/login/route.ts` va `src/app/api/readers/register/route.ts`: `Buffer.from(\`${reader.id}:${Date.now()}\`).toString('base64')` qatorini `createSessionToken(reader.id)` bilan almashtiring.
- [x] **V2-P0.S2.3** `src/lib/reader-auth.ts` → `getCurrentReader()`: token'ni `verifySessionToken(token)` bilan tekshiring. `null` bo'lsa `return null`. Eski `Buffer.from(token,'base64')…split(':')` mantig'ini **o'chiring**. Natijada eski (imzosiz) cookie'lar bekor bo'ladi va hamma qayta kiradi. Bu kutilgan holat.
- [x] **V2-P0.S2.4** Shu faylda va `src/app/api/readers/login/route.ts`, `src/app/api/admin/users/route.ts` ichida **`username === 'admin'` sehrli qoidasini olib tashlang**. Rol faqat bazadagi `role` maydonidan olinadi: `const role = readerData.role ?? 'reader'`, `const isSuperAdmin = role === 'superadmin'`.
- [ ] **V2-P0.S2.5** Prod bazasida `admin` username'li reader'ning `role` maydoni `superadmin` ekanini Payload `/admin` → "Foydalanuvchilar (Sayt)" orqali tekshiring. Bo'lmasa, qo'lda `superadmin` qilib qo'ying (aks holda sehrli qoida o'chgach admin huquqi yo'qoladi).

✅ **Qabul mezonlari:**
- `curl -s -o /dev/null -w "%{http_code}" -H "Cookie: hisinf_reader_session=MTow" https://<prod>/api/admin/users` → **403**.
- Haqiqiy login → admin panel ishlaydi.

## V2-P0.S3 — Ochiq endpoint'larni yopish (K2, H1, H2)

- [x] **V2-P0.S3.1** `src/app/api/posts/create/route.ts` — `POST` funksiyasining eng boshiga:
  ```ts
  if (!(await isCurrentReaderAdmin())) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
  }
  ```
  (`import { isCurrentReaderAdmin } from '@/lib/reader-auth'`)
- [x] **V2-P0.S3.2** `src/app/api/parse-document/route.ts` — xuddi shu admin tekshiruvi. Qo'shimcha: `if (file.size > 10 * 1024 * 1024) return 413` ("Fayl 10 MB dan katta"). Faqat `.docx`, `.pdf`, `.txt` qabul qilinadi (`.doc` ni olib tashlang — mammoth uni o'qimaydi).
- [x] **V2-P0.S3.3** `src/app/api/inquiries/route.ts` → `GET`: `?phone=` parametri bo'yicha qidirish **butunlay olib tashlanadi**. Faqat kirgan o'quvchi uchun ishlaydi: `if (!reader) return NextResponse.json({ inquiries: [] })`, so'ng `where: { phone: { equals: reader.phone } }` (P3 da `reader` bog'lanishiga o'tkaziladi). `src/app/(frontend)/[locale]/chat/page.tsx` dagi telefon bo'yicha qidirish formasini ham olib tashlang. Mehmonga "Javoblarni ko'rish uchun kiring" matni ko'rsatiladi.
- [x] **V2-P0.S3.4** `src/app/api/comments/route.ts`: `body` uzunligini 3–1000 belgi bilan cheklang (400 qaytaradi). `authorName` ni klientdan **olmang** (hozir ham readerdan olinadi — tekshiring).

✅ **Qabul mezonlari:** mehmon sifatida `POST /api/posts/create` → 403, `POST /api/parse-document` → 403, `GET /api/inquiries?phone=+998…` → `{"inquiries":[]}`.

## V2-P0.S4 — Kolleksiya ruxsatlari va ochiq parollar (K3, H3, H4)

- [x] **V2-P0.S4.1** `src/collections/Readers.ts` → `access` ni almashtiring:
  ```ts
  access: {
    // Faqat xodimlar (Payload admin) yoki o'quvchining o'zi
    read: ({ req }) =>
      req.user?.collection === 'users' ? true
      : req.user?.collection === 'readers' ? { id: { equals: req.user.id } }
      : false,
    create: ({ req }) => req.user?.collection === 'users', // ro'yxatdan o'tish custom route orqali (overrideAccess)
    update: ({ req }) =>
      req.user?.collection === 'users' ? true
      : req.user?.collection === 'readers' ? { id: { equals: req.user.id } }
      : false,
    delete: ({ req }) => req.user?.collection === 'users',
  },
  ```
- [x] **V2-P0.S4.2** Shu faylda `role` va `displayPassword` maydonlariga field access qo'shing:
  ```ts
  access: {
    read: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => req.user?.collection === 'users',
    create: ({ req }) => req.user?.collection === 'users',
  },
  ```
- [x] **V2-P0.S4.3** **Ochiq parollarni o'chirish.** `displayPassword` ga yozadigan **barcha** joylarni olib tashlang. `grep -rn "displayPassword" src scripts` bilan toping (`register`, `admin/users`, `ensureAdminReader`). `/api/admin/users` GET javobida `displayPassword` maydonini **qaytarmang**. Admin sahifasidagi (`src/app/(frontend)/[locale]/admin/page.tsx`) parol ustunini olib tashlang yoki `••••••` ko'rsating.
- [ ] **V2-P0.S4.4** Bazadagi mavjud ochiq parollarni tozalash — bir martalik skript `scripts/v2/00-wipe-display-passwords.ts`:
  ```ts
  import 'dotenv/config'
  import { getPayload } from 'payload'
  import config from '../../src/payload.config'

  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'readers', limit: 10000, depth: 0, overrideAccess: true })
  let n = 0
  for (const r of docs) {
    if ((r as { displayPassword?: string | null }).displayPassword) {
      await payload.update({ collection: 'readers', id: r.id, data: { displayPassword: null } as never, overrideAccess: true })
      n++
    }
  }
  console.log(`Tozalandi: ${n}`)
  process.exit(0)
  ```
  Ishga tushirish: `pnpm payload run scripts/v2/00-wipe-display-passwords.ts` (avval `dev`, keyin prod `DATABASE_URI` bilan). Agar `as never` typecheck'da muammo bersa, `payload-types` dagi `Reader` turidan foydalaning.
- [x] **V2-P0.S4.5** `src/collections/Comments.ts` → `create: ({ req }) => req.user?.collection === 'users'` (o'quvchilar faqat `/api/comments` custom route orqali yozadi). `body` maydoniga `maxLength: 1000`.
- [x] **V2-P0.S4.6** `src/collections/Users.ts` → `role.defaultValue` ni `'author'` qiling (hozir `'admin'`). `role` maydoniga `access: { update: ({ req }) => req.user?.collection === 'users' && req.user.role === 'admin' }`.

✅ **Qabul mezonlari:** `curl https://<prod>/api/readers` → 403 yoki `docs: []`. Javobda `displayPassword` va `phone` yo'q.

## V2-P0.S5 — Qattiq yozilgan parol va secret (K4, K5, H5)

- [x] **V2-P0.S5.1** `src/payload.config.ts`:
  ```ts
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET env o‘zgaruvchisi majburiy')
  // …
  secret,
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI || '' } }), // push: true OLIB TASHLANDI
  ```
- [x] **V2-P0.S5.2** `src/seed/seedAdmin.ts` va `scripts/ensureAdminReader.ts`: `'admin123'` o'rniga `process.env.SEED_ADMIN_PASSWORD` ishlatiladi. U yo'q yoki 12 belgidan qisqa bo'lsa, `throw new Error(...)`. `.env.example` ga `SEED_ADMIN_PASSWORD=` qo'shing.
- [x] **V2-P0.S5.3** `src/app/api/admin/users/route.ts` dagi `String(password || 'admin123')` → `password` bo'lmasa `crypto.randomBytes(18).toString('base64url')` ishlatiladi va javobda "Parolni tiklash orqali o'rnating" deyiladi.
- [ ] **V2-P0.S5.4** **Prod parollarini almashtiring:** `admin` reader va `admin` user (agar mavjud bo'lsa) parollarini 16+ belgili yangi parolga o'zgartiring. Bu qo'lda bajariladi va yangi parol parol menejerida saqlanadi.
- [ ] **V2-P0.S5.5** Lokal `.env` dagi `DATABASE_URI` **Neon `dev` branch'iga** ishora qilishini tekshiring. Prod `main` ga ishora qilsa, darhol almashtiring.

✅ **Qabul mezonlari:** `grep -rn "admin123" src scripts` bo'sh natija beradi. `grep -n "push: true" src/payload.config.ts` bo'sh.

## V2-P0.S6 — Deploy va tekshiruv

- [ ] **V2-P0.S6.1** `pnpm lint && pnpm typecheck && pnpm build` → commit `fix(V2-P0): security hotfix (signed sessions, closed endpoints, no plaintext passwords)` → push → Vercel deploy.
- [ ] **V2-P0.S6.2** Prod'da S2–S5 dagi qabul mezonlaridagi curl buyruqlarini qayta bajaring va natijani `docs/security-review.md` ga sana bilan yozing.
- [ ] **V2-P0.S6.3** Jamoaga xabar bering: hamma qayta kirishi kerak, admin parollari almashtirildi.

✅ **Qabul mezonlari:** barcha tekshiruvlar o'tdi va `docs/security-review.md` mavjud.

---

# V2-P1 — Poydevorni tozalash va tayyorlash

**Maqsad:** v2 branch'ini, muhitni, paketlarni va layout tuzilmasini dizayn ishiga tayyorlash.

## V2-P1.S1 — Branch va muhit

- [x] **V2-P1.S1.1** `git switch main && git pull && git switch -c v2 && git push -u origin v2`.
- [ ] **V2-P1.S1.2** Neon: P0 dan keyingi `main` dan `v2` branch yarating. Vercel → Environment Variables → **Preview** muhiti uchun (Git branch: `v2`) `DATABASE_URI` = Neon `v2` branch pooled URL.
- [x] **V2-P1.S1.3** Lokal `.env` → `DATABASE_URI` = Neon `v2` branch'ining **dev uchun nusxasi** (`v2-dev` branch) yoki `dev`. **Hech qachon** `main` emas.
- [x] **V2-P1.S1.4** *(reja tuzilganda bajarildi — tekshiring)* `.gitignore` ga qo'shing: `*.zip`, `/docs/design/uploads/`.
- [x] **V2-P1.S1.5** *(reja tuzilganda bajarildi — tekshiring)* `docs/plan/README.md` boshiga qo'shing: `> ⚠️ Bu reja v2 tomonidan almashtirildi: docs/new_plan_v2.md. Bu fayllar faqat ma'lumotnoma.`
- [x] **V2-P1.S1.6** *(reja tuzilganda bajarildi — tekshiring)* `AGENTS.md` dagi "Ishni boshlashdan oldin" bo'limini yangilang: 1-qadam `docs/new_plan_v2.md`, progress jadvali — uning 8-bo'limi. 0.5-bo'limdagi qo'shimcha qoidalarni ham qisqacha qo'shing.

✅ **Qabul mezonlari:** `v2` branch GitHub'da bor. Vercel preview'da `v2` deploy'i Neon `v2` ga ulangan.

## V2-P1.S2 — Layout tuzilmasini to'g'rilash

- [x] **V2-P1.S2.1** O'chiring: `src/app/(frontend)/layout.tsx`, `src/app/(frontend)/page.tsx`, `src/app/(frontend)/styles.css` (agar ishlatilmasa — `grep -rn "styles.css" src`).
- [x] **V2-P1.S2.2** `src/app/(frontend)/[locale]/layout.tsx` yagona root layout bo'lib qoladi. `import '../globals.css'` shu yerda turadi. Root `/` → `/uz` redirect'ini middleware bajaradi: `curl -I http://localhost:3000/` → `307 Location: /uz`.
- [x] **V2-P1.S2.3** `src/middleware.ts` matcher'i: `['/((?!api|admin|next|cron|_next|_vercel|.*\\..*).*)']` — tekshiring, o'zgartirmang.

✅ **Qabul mezonlari:** `pnpm dev` da konsolda "Missing <html> tags" ogohlantirishi yo'q. `/`, `/uz`, `/kaa` va `/admin` ishlaydi.

## V2-P1.S3 — Paketlar

- [x] **V2-P1.S3.1** O'rnating (3.3-bo'lim):
  ```bash
  pnpm add @payloadcms/plugin-seo@3.90.2 @payloadcms/plugin-nested-docs@3.90.2 @payloadcms/live-preview-react@3.90.2
  pnpm add zod @upstash/ratelimit @upstash/redis @marsidev/react-turnstile resend leaflet react-leaflet
  pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-popover @radix-ui/react-tooltip @radix-ui/react-navigation-menu @radix-ui/react-slot class-variance-authority clsx tailwind-merge
  pnpm add -D @types/leaflet
  ```
  **Eslatma:** shadcn CLI **ishlatilmaydi**. Radix primitivlari to'g'ridan-to'g'ri, o'zimizning tokenlar bilan o'raladi (P2.S4). Sabab: shadcn'ning `--muted` tokeni dizaynnikiga zid (shadcn'da fon, dizaynda matn rangi).
- [x] **V2-P1.S3.2** `react-leaflet` versiyasi React 19 bilan mos ekanini tekshiring (`pnpm why react-leaflet`, peerDependencies). Mos bo'lmasa `react-leaflet@next` ni sinang yoki `docs/BLOCKERS.md` ga yozing.
- [x] **V2-P1.S3.3** `src/lib/cn.ts`:
  ```ts
  import { clsx, type ClassValue } from 'clsx'
  import { twMerge } from 'tailwind-merge'
  export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
  ```

✅ **Qabul mezonlari:** `pnpm build` o'tadi.

## V2-P1.S4 — Env va skriptlar

- [x] **V2-P1.S4.1** `.env.example` ni yangilang (izohlar bilan): mavjudlariga qo'shimcha `SEED_ADMIN_PASSWORD`, `PREVIEW_SECRET`, `CRON_SECRET`, `TRACK_SALT` (ko'rishlar hisoblagichi uchun tasodifiy satr), `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `DIGEST_DAILY_LIMIT=90`.
- [x] **V2-P1.S4.2** `package.json` scripts'ga qo'shing:
  ```json
  "check": "pnpm lint && pnpm typecheck && pnpm test",
  "v2:script": "cross-env NODE_OPTIONS=\"--no-deprecation --require ./scripts/swc-fix.cjs\" payload run"
  ```
  Foydalanish: `pnpm v2:script scripts/v2/02-convert-content.ts`.
- [x] **V2-P1.S4.3** `vitest.config.mts` da unit testlar (`tests/unit/**`) DB'siz ishlashini tekshiring. Int testlar (`tests/int/**`) alohida: `pnpm test:int`.
- [x] **V2-P1.S4.4** `src/lib/payload.ts` dagi `getPayloadClient` dan foydalaning. Yangi kodda `getPayload({ config })` ni to'g'ridan-to'g'ri chaqirmang.

✅ **Qabul mezonlari:** `pnpm check` o'tadi.

---

# V2-P2 — Dizayn tizimi (tokenlar, shriftlar, tema, effektlar, primitivlar)

**Maqsad:** 5-bo'limdagi spetsifikatsiyani kodga aylantirish. Bu phase'dan keyin har bir sahifa faqat shu primitivlardan yig'iladi.

## V2-P2.S1 — Shriftlar

- [x] **V2-P2.S1.1** `src/app/(frontend)/fonts.ts`:
  ```ts
  import { Literata, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'

  export const literata = Literata({
    subsets: ['latin', 'latin-ext', 'cyrillic'],
    style: ['normal', 'italic'],
    axes: ['opsz'],
    variable: '--font-literata',
    display: 'swap',
  })
  export const plexSans = IBM_Plex_Sans({
    subsets: ['latin', 'latin-ext', 'cyrillic'],
    weight: ['400', '500', '600'],
    variable: '--font-plex-sans',
    display: 'swap',
  })
  export const plexMono = IBM_Plex_Mono({
    subsets: ['latin', 'latin-ext'],
    weight: ['400', '500'],
    variable: '--font-plex-mono',
    display: 'swap',
  })
  ```
  `next/font` bitta shrift uchun `axes` bilan `weight` ni birga qabul qilmasa, Literata'da `weight` bermang (variable font).
- [x] **V2-P2.S1.2** `[locale]/layout.tsx`: `<html lang={locale} className={cn(literata.variable, plexSans.variable, plexMono.variable)} suppressHydrationWarning>`.
- [x] **V2-P2.S1.3** **Glif testi:** `src/app/(frontend)/[locale]/dev/glyphs/page.tsx` (faqat `process.env.NODE_ENV === 'development'` da ochiladi, aks holda `notFound()`). U uchala shriftda quyidagi satrni ko'rsatadi:
  `Qaraqalpaqsha: Áá Óó Úú Ǵǵ Ńń Íı Shsh Chch — Oʻzbekcha: Oʻoʻ Gʻgʻ maʼno — «Iqtibos» “Iqtibos” — 1220–1405 ← → ✓ ♥ ◷ ⌘`
  DevTools → Elements → Computed → "Rendered Fonts" bo'limida har bir glif kerakli shriftda chizilganini tekshiring. Biror glif zaxira shriftga tushsa, uni `docs/design-fonts.md` ga yozing. Belgi muhim bo'lsa (`ǵ`, `ń`, `ı`), o'sha rol uchun zaxira sifatida `Noto Sans`/`Noto Serif` qo'shing.

✅ **Qabul mezonlari:** `docs/design-fonts.md` da natija bor; qoraqalpoq harflari asosiy shriftda chiziladi.

## V2-P2.S2 — `globals.css` (to'liq almashtiriladi)

- [x] **V2-P2.S2.1** `src/app/(frontend)/globals.css` ni **to'liq** quyidagiga almashtiring. Hozirgi `gold-*`, `historical-divider` klasslari o'chadi. Ularni ishlatgan komponentlar P6 da qayta yoziladi.
- [x] **V2-P2.S2.2** Klass nomlari to'g'ri ishlashini tekshiring: `bg-bg`, `text-fg`, `bg-card`, `bg-surface-2`, `text-muted`, `bg-primary`, `text-primary-fg`, `border-line`, `border-border`, `text-p-indigo`, `bg-hatch`, `bg-paper`, `shadow-offset`, `font-serif`, `font-mono`, `animate-hf-up`. Hammasini dev sahifasiga (S7) qo'ying.
- [x] **V2-P2.S2.3** `.prose-hisinf` (maqola matni) stillari — shu faylning oxiriga.

✅ **Qabul mezonlari:** dev sahifasida (S7) barcha klasslar to'g'ri rangda. Tema almashganda ranglar ham o'zgaradi.

## V2-P2.S3 — Tema (kunduz/tun)

- [x] **V2-P2.S3.1** `src/components/layout/ThemeProvider.tsx` (mavjud `src/components/ThemeProvider.tsx` ko'chiriladi):
  ```tsx
  'use client'
  import { ThemeProvider as NextThemes } from 'next-themes'
  export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
      <NextThemes attribute="data-theme" themes={['light', 'dark']} defaultTheme="system" enableSystem>
        {children}
      </NextThemes>
    )
  }
  ```
- [x] **V2-P2.S3.2** `src/components/layout/ThemeToggle.tsx` — dizayn: `SiteHeader.dc.html` 54–56-qatorlar. 40×40 doira tugma, ichida 16px doira (yarmi to'ldirilgan: `background: linear-gradient(90deg, var(--fg) 50%, transparent 50%)`, `border: 1.5px solid var(--fg)`). Hover'da `rotate(180deg)`, `transition-transform duration-500`. Bosilganda `setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')`. `aria-label={t('theme.toggle')}`. Hydration xatosi bo'lmasligi uchun `mounted` holati kutiladi (mount bo'lmaguncha bo'sh doira chiziladi).
- [x] **V2-P2.S3.3** Eski `src/components/ThemeProvider.tsx` va `src/components/ThemeToggle.tsx` ni o'chiring va importlarni yangilang.

✅ **Qabul mezonlari:** tema almashadi, sahifa yangilanganda saqlanib qoladi va oq chaqnash bo'lmaydi.

## V2-P2.S4 — UI primitivlari (Radix o'ramlari)

Har biri `src/components/ui/` da. Ranglar faqat tokenlar orqali.

- [x] **V2-P2.S4.1** `Dialog.tsx` — `@radix-ui/react-dialog` o'rami. Overlay: `fixed inset-0 z-50 bg-[rgba(20,14,8,.45)] data-[state=open]:animate-hf-pop`. Content variantlari (`cva`):
  - `center`: `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(480px,92vw)] bg-card border border-line rounded-[12px] p-7 shadow-[0_24px_60px_var(--shadow)]`.
  - `right` (drawer): `fixed right-0 top-0 bottom-0 w-[min(560px,100vw)] bg-paper border-l border-line p-10 overflow-auto data-[state=open]:animate-hf-slide`.
  - `full` (lightbox): `fixed inset-0 bg-[rgba(15,10,6,.88)]`.
  Har birida yopish tugmasi bor: 40px doira, `border-line`, `✕`, `aria-label`.
- [x] **V2-P2.S4.2** `Sheet.tsx` — mobil menyu uchun `Dialog` ning chap/o'ng variantlari (`left` qo'shiladi).
- [x] **V2-P2.S4.3** `DropdownMenu.tsx` — Content: `min-w-[220px] bg-card border border-line p-1.5 rounded-[10px] shadow-[0_12px_32px_var(--shadow)] animate-hf-pop`. Item: `rounded-[6px] px-2.5 py-2 text-[14px] text-fg outline-none data-[highlighted]:bg-surface-2`.
- [x] **V2-P2.S4.4** `Popover.tsx` — footnote'lar uchun. Content: `max-w-[360px] bg-card border border-line px-4 py-3.5 font-sans text-[14px] leading-[1.55] text-fg animate-hf-up`.
- [x] **V2-P2.S4.5** `Tooltip.tsx` — `bg-fg text-bg text-[12px] px-2 py-1 rounded`.

✅ **Qabul mezonlari:** dev sahifasida 5 ta primitiv klaviatura bilan ochiladi va `Esc` bilan yopiladi.

## V2-P2.S5 — Effektlar (`src/components/fx/`)

- [x] **V2-P2.S5.1** `src/lib/use-reduced-motion.ts` — `matchMedia('(prefers-reduced-motion: reduce)')` ni kuzatuvchi hook.
- [x] **V2-P2.S5.2** `Reveal.tsx` (`'use client'`):
  ```tsx
  'use client'
  import { useEffect, useRef } from 'react'
  export function Reveal({ delay = 0, as: Tag = 'div', className, children }: {
    delay?: number; as?: React.ElementType; className?: string; children: React.ReactNode
  }) {
    const ref = useRef<HTMLElement>(null)
    useEffect(() => {
      const el = ref.current
      if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          el.animate(
            [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }],
            { duration: 700, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' },
          )
          io.unobserve(el)
        }
      }, { threshold: 0.12 })
      io.observe(el)
      return () => io.disconnect()
    }, [delay])
    return <Tag ref={ref} className={className}>{children}</Tag>
  }
  ```
  **Eslatma:** element JS yuklanmaguncha ham ko'rinib turadi (SSR'da yashirilmaydi). Bu SEO va JS'siz holat uchun to'g'ri.
- [x] **V2-P2.S5.3** `InkCursor.tsx` (`'use client'`) — layout'da bir marta mount qilinadi:
  - `matchMedia('(hover: hover) and (pointer: fine)')` true bo'lsa, `document.documentElement.classList.add('fx-cursor')`. Unmount'da olib tashlanadi.
  - `prefers-reduced-motion` bo'lmasa, `mousedown` (input/textarea'dan tashqari) bo'lganda `position:fixed` span yaratiladi (10px doira, `border:1.5px solid var(--primary)`, `pointer-events:none`, `z-index:999`) va `animate([{transform:'scale(.4)',opacity:.9},{transform:'scale(3.2)',opacity:0}],{duration:520})` dan keyin o'chiriladi. Koordinatalar `clientX/clientY` dan olinadi.
- [x] **V2-P2.S5.4** `Tilt.tsx` — `hisinf-fx.js` dagi `tilt()` ning React versiyasi (`onMouseMove` / `onMouseLeave`). Reduced-motion va touch qurilmalarda effektsiz `div` qaytaradi.
- [x] **V2-P2.S5.5** `Marquee.tsx` — `children` ni 2 marta render qiladi: `<div className="flex w-max animate-hf-marquee hover:[animation-play-state:paused]">`. Ota element: `overflow-hidden`. Ikkinchi nusxa `aria-hidden="true"`.
- [x] **V2-P2.S5.6** `DrawPath.tsx` — SVG `path` uchun `getTotalLength()` bilan `strokeDasharray/Offset`. Ko'ringanda 2.4s davomida chiziladi.

✅ **Qabul mezonlari:** effektlar dev sahifasida ishlaydi va OS'da "Reduce motion" yoqilganda o'chadi.

## V2-P2.S6 — Brend va asosiy primitivlar (`src/components/brand/`, `src/components/primitives/`)

Har bir komponent uchun dizayndagi manba qatorlari ko'rsatilgan. O'lchamlarni aynan shu yerdan oling.

- [x] **V2-P2.S6.1** `LogoMark.tsx` (manba: `SiteHeader.dc.html` 26–30):
  ```tsx
  export function LogoMark({ size = 38 }: { size?: number }) {
    const s = size / 38
    return (
      <span aria-hidden className="relative grid place-items-center" style={{ width: size, height: size }}>
        <span className="absolute rotate-45 border-[1.5px] border-primary" style={{ inset: 5 * s }} />
        <span className="absolute rotate-45 border border-primary" style={{ inset: 10 * s }} />
        <span className="relative font-serif font-bold leading-none text-primary" style={{ fontSize: 15 * s }}>H</span>
      </span>
    )
  }
  ```
- [x] **V2-P2.S6.2** `Logo.tsx` — `LogoMark` + wordmark: `<span className="font-serif text-[24px] font-semibold leading-none tracking-[-.01em]">hisinf<span className="text-primary">.uz</span></span>` va ostida `font-mono text-[9.5px] font-medium uppercase tracking-[.18em] text-muted` "historical info". Props: `compact` (faqat mark + wordmark, footer va admin uchun). Haqiqiy SVG logo tayyor bo'lganda (`Logo prompt.md`) shu komponent ichi almashtiriladi.
- [x] **V2-P2.S6.3** `Seal.tsx` (manba: `Home.dc.html` 41–48): props `size` (132), `top` ("MUHR"), `value` ("10"), `bottom` ("TARIXIY\nDAVR"). Tashqi doira `rounded-full bg-bg border border-line animate-hf-float`, ichki `absolute inset-2 rounded-full border border-dashed border-primary animate-hf-spin`.
- [x] **V2-P2.S6.4** `Kicker.tsx`:
  ```tsx
  export function Kicker({ children, center = false, className }: { children: React.ReactNode; center?: boolean; className?: string }) {
    return (
      <span className={cn('inline-flex items-center gap-3 font-mono text-[11px] md:text-[12px] font-medium uppercase tracking-[.14em] text-primary', className)}>
        <span className="h-px w-7 bg-current" />
        {children}
        {center && <span className="h-px w-7 bg-current" />}
      </span>
    )
  }
  ```
- [x] **V2-P2.S6.5** `SectionHeader.tsx` (manba: `Home.dc.html` 66–73): props `numeral` ("II"), `kicker`, `title`, `href?`, `linkLabel?`.
  Klasslar: konteyner `grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)_auto] gap-4 md:gap-8 items-end pb-7 border-b border-line`; rim raqami `font-serif text-[40px] md:text-[64px] leading-none text-primary`; kicker `font-mono text-[12px] uppercase tracking-[.14em] text-muted`; h2 `font-serif font-normal text-[34px] md:text-[52px] leading-[1.05] tracking-[-.02em]`; havola `text-[15px] font-medium border-b border-current pb-[3px]`.
- [x] **V2-P2.S6.6** `Pill.tsx` (`cva` bilan). Variantlar:
  | variant | klasslar | manba |
  |---------|----------|-------|
  | `primary` | `bg-primary text-primary-fg shadow-btn hover:translate-y-0.5 hover:shadow-[0_2px_0_var(--fg)] active:translate-y-1 active:shadow-none hover:text-primary-fg` | Home CTA |
  | `outline` | `border border-line text-fg hover:bg-fg hover:text-bg` | Home 2-CTA |
  | `dark` | `bg-fg text-bg hover:-translate-y-0.5 hover:shadow-[0_4px_0_var(--primary)] hover:text-bg` | Header "Kirish" |
  | `filter` | `border text-[13px]` + `data-[on=true]:border-fg data-[on=true]:bg-fg data-[on=true]:text-bg data-[on=false]:border-border data-[on=false]:bg-card data-[on=false]:text-fg hover:border-line` | filtrlar |
  | `light` | `bg-primary-fg text-primary hover:translate-x-1` | CTA blok ichida |
  O'lchamlar: `lg` = `px-[26px] py-4 text-[15.5px]`, `md` = `px-[18px] py-[11px] text-[14px]`, `sm` = `px-[15px] py-[9px] text-[13px]`. Umumiy: `inline-flex items-center gap-2.5 rounded-full font-medium transition-[transform,box-shadow,background-color] duration-200`. `asChild` (Radix Slot) qo'llab-quvvatlanadi, shunda `<Link>` ham pill bo'la oladi. O'q belgisi `→` doim `font-mono` da.
- [x] **V2-P2.S6.7** `IconCircleButton.tsx` — `grid size-10 place-items-center rounded-full border border-border text-fg transition-colors hover:border-line`.
- [x] **V2-P2.S6.8** `PlateFrame.tsx` — rasm joyi yoki rasm ramkasi. Props: `media?` (Payload Media), `label?` (rasm yo'q bo'lganda ko'rsatiladigan yozuv), `height` yoki `aspect`, `inset` (10 | 8 | 12 px), `caption?`, `priority?`, `sizes?`.
  - Tashqi: `border border-line bg-card` + `padding: inset`.
  - Ichki: `border border-line bg-hatch relative overflow-hidden grid place-items-center`.
  - Rasm bo'lsa: `MediaImage` (`object-cover`, `fill`).
  - Rasm bo'lmasa: yorliq chipi `font-mono text-[11px] uppercase tracking-[.08em] text-muted bg-card border border-border px-3 py-2 text-center`.
  - `caption` bo'lsa: ostida `font-serif italic text-[14px] text-muted pt-3 px-1`.
- [x] **V2-P2.S6.9** `MediaImage.tsx` — Payload `Media` → `next/image` (`unoptimized`, `srcSet` Payload o'lchamlaridan: `thumb 400w, card 800w, hero 1600w`). `alt` lokalizatsiyalangan media'dan, `object-position` focal point'dan olinadi. Media `null` bo'lsa, `null` qaytaradi.
- [x] **V2-P2.S6.10** `DiamondDivider.tsx` (manba: `SiteFooter.dc.html` 14–20): `flex items-center gap-[18px]` → `flex-1 h-px bg-current opacity-30` · `size-2 border border-current rotate-45 opacity-60` · `size-3 bg-primary rotate-45` · (takror) · chiziq. Props: `className` (rangni `text-…` bilan beradi).
- [x] **V2-P2.S6.11** `PeriodDot.tsx` — `<span className="inline-block rotate-45" style={{ width: size, height: size, background: periodColorVar(color) }} />`. `PeriodBadge.tsx` — `rounded-full border px-2.5 py-[5px] font-mono text-[10px] md:text-[11px] font-medium uppercase tracking-[.1em] bg-bg`, `style={{ borderColor: c, color: c }}`.
- [x] **V2-P2.S6.12** `Avatar.tsx` — props `name`, `id`, `size` (26 | 34 | 36 | 44). Initsiallar: `initials(name)` (birinchi 2 so'zning bosh harflari). Fon: `avatarColor(id)` = `['var(--teal)','var(--p-ochre)','var(--p-indigo)','var(--primary)','var(--p-olive)'][id % 5]`, matn `text-bg font-serif font-semibold`.
- [x] **V2-P2.S6.13** `Pagination.tsx` (manba: `Maqolalar.dc.html` 110–118): chapda "← Oldingi", markazda raqamlar (42px doira, tanlangani `bg-fg text-bg border-fg`), o'ngda "Keyingi →". Ko'p sahifa bo'lsa `1 2 3 4 … 25`. Havolalar `?sahifa=N` ni boshqa parametrlarni saqlagan holda o'rnatadi. `aria-current="page"`, `<nav aria-label>`.
- [x] **V2-P2.S6.14** `EmptyState.tsx`, `StatNumber.tsx`, `CountTabs.tsx` — 5.7-bo'limdagi jadval bo'yicha.
- [x] **V2-P2.S6.15** `src/lib/period-color.ts`:
  ```ts
  export type PeriodColor = 'ochre' | 'teal' | 'brick' | 'olive' | 'indigo' | 'sand'
  export const periodColorVar = (c?: string | null) => `var(--p-${(c as PeriodColor) || 'sand'})`
  ```
  `src/lib/initials.ts`, `src/lib/avatar-color.ts` — unit testlari bilan.

✅ **Qabul mezonlari:** barcha komponentlar dev sahifasida 390 va 1440 kengliklarda, ikkala temada to'g'ri ko'rinadi.

## V2-P2.S7 — Dizayn tizimi sahifasi

- [x] **V2-P2.S7.1** `src/app/(frontend)/[locale]/dev/design/page.tsx` (faqat development). Bo'limlar: ranglar (har token kvadrat + nomi), davr ranglari, tipografiya shkalasi (5.2-jadvaldagi har bir rol), pill'lar (barcha variantlar va o'lchamlar), PlateFrame (rasm bilan va rasmsiz), DiamondDivider, Seal, Kicker, SectionHeader, Avatar, Pagination, EmptyState, Dialog/Drawer/Popover demo, effektlar (Reveal, Tilt, curl, marquee).
- [x] **V2-P2.S7.2** Shu sahifani `docs/design/Home.dc.html` (brauzerda ochilgan) bilan yonma-yon solishtiring. Farqlarni (rang, o'lcham) tuzating.

✅ **Qabul mezonlari:** dizayn tizimi sahifasi dizayn fayllari bilan vizual mos keladi (ko'z bilan solishtirish).

---

# V2-P3 — Ma'lumotlar modeli v2 va ma'lumotlarni ko'chirish

**Maqsad:** 4-bo'limdagi modelni yaratish va mavjud prod ma'lumotlarini **yo'qotmasdan** ko'chirish.

> ### ⚠️ Migratsiya oltin qoidasi
> Mavjud maydonning **turini** (`textarea` → `richText`) yoki **`localized`** xususiyatini **joyida o'zgartirmang**. Payload migratsiya generatori bunday holatda ustunni o'chirib, yangisini yaratadi va **ma'lumot yo'qoladi**.
> To'g'ri yo'l uch qadamdan iborat:
> 1. **Yangi nomli** maydon qo'shiladi (masalan, `content` → `body`).
> 2. Skript bilan ma'lumot ko'chiriladi (V2-P3.S12).
> 3. Tekshirilgandan keyin eski maydon alohida migratsiyada o'chiriladi (V2-P10.S3).
> Har migratsiya faylini commit qilishdan oldin **o'qing**: unda kutilmagan `DROP COLUMN` / `DROP TABLE` bo'lmasligi kerak.

## V2-P3.S1 — Yordamchilar va umumiy maydonlar

- [ ] **V2-P3.S1.1** `src/access/index.ts` (mavjud `.gitkeep` o'rniga):
  ```ts
  import type { Access, FieldAccess, PayloadRequest } from 'payload'
  import type { User, Reader } from '@/payload-types'

  export type StaffRole = User['role']
  type ReqUser = PayloadRequest['user']

  export function isStaffUser(u: ReqUser): u is User & { collection: 'users' } {
    return Boolean(u && u.collection === 'users' && (u as User).isActive !== false)
  }
  export function isReaderUser(u: ReqUser): u is Reader & { collection: 'readers' } {
    return Boolean(u && u.collection === 'readers' && (u as Reader).isBanned !== true)
  }
  export function hasRole(u: ReqUser, ...roles: StaffRole[]): boolean {
    return isStaffUser(u) && roles.includes(u.role)
  }

  export const anyone: Access = () => true
  export const nobody: Access = () => false
  export const isStaff: Access = ({ req }) => isStaffUser(req.user)
  export const isAdmin: Access = ({ req }) => hasRole(req.user, 'admin')
  export const isEditorOrAdmin: Access = ({ req }) => hasRole(req.user, 'admin', 'editor')
  /** Ommaga faqat chop etilgan; xodimga hammasi */
  export const publishedOrStaff: Access = ({ req }) =>
    isStaffUser(req.user) ? true : { _status: { equals: 'published' } }

  export const fieldStaffOnly: FieldAccess = ({ req }) => isStaffUser(req.user)
  export const fieldAdminOnly: FieldAccess = ({ req }) => hasRole(req.user, 'admin')
  export const fieldEditorOrAdmin: FieldAccess = ({ req }) => hasRole(req.user, 'admin', 'editor')
  ```
  `isActive` va `isBanned` maydonlari qo'shilmaguncha (S4, S9) typecheck xato beradi. Shuning uchun bu fayl S4 va S9 bilan bitta commit'da bo'ladi. Unit test `tests/unit/access.test.ts`: reader hech qachon xodim emas; bloklangan reader `isReaderUser` = false.
- [ ] **V2-P3.S1.2** `src/fields/slug.ts` ni yangilang: slug faqat **uz** sarlavhadan yaratiladi (`req.locale === 'uz'` yoki `create`). Boshqa tilda saqlanganda va slug bo'sh bo'lsa, `originalDoc.slug` saqlanadi. Bo'sh natija → `${prefix}-${Date.now()}`. Maydon `localized` emas. `admin.description`: "Avtomatik. Chop etilgandan keyin o'zgartirmang."
- [ ] **V2-P3.S1.3** `src/fields/years.ts` → `yearField(name, label, opts?)`: `type:'number'`, `validate`: butun son, `!== 0`, `-200000..2100` (Teshiktosh: −70 000). `admin.description`: "Miloddan avvalgi yil manfiy: −329".
- [ ] **V2-P3.S1.4** `src/fields/link.ts` → `linkField(name = 'link')`: group `{ type: 'internal' | 'route' | 'custom', reference (rel ['pages','posts','categories']), route (select: home, posts, timeline, persons, archive, map, search, authors, contact, become-author), url (text, http(s) yoki `/`), newTab }`. `src/lib/resolve-link.ts` → `resolveLink(link): { href: string; external: boolean }`. Route jadvali: `home:'/'`, `posts:'/maqolalar'`, `timeline:'/xronologiya'`, `persons:'/shaxslar'`, `archive:'/arxiv'`, `map:'/xarita'`, `search:'/qidiruv'`, `authors:'/mualliflar'`, `contact:'/aloqa'`, `become-author:'/muallif-bolish'`. Unit test yozing.
- [ ] **V2-P3.S1.5** `src/lib/format-year.ts`, `src/lib/format-date.ts`, `src/lib/today.ts` — eski rejadagi `docs/plan/P02-i18n.md` P2.S4 kodi **aynan** olinadi va unit testlari yoziladi. Qo'shimcha: `toRomanMonth(month)` (`9 · X` uchun) va `formatYearsLabel({ yearsLabel, start, end, approximate }, locale)`. Agar `yearsLabel` (qo'lda yozilgan matn) bo'lsa, o'sha qaytadi, aks holda `formatYearRange` ishlaydi.
- [ ] **V2-P3.S1.6** `src/lib/lexical-text.ts` → `extractPlainText(root): string` (rekursiv, `text` tugunlari, bloklar orasiga bo'sh joy) va `countWords(text)`. `src/lib/lexical-walk.ts` → `walk(node, visit)`, `collectFootnotes(data)`, `collectHeadings(data)`, `collectSources(data)` (blockType `source` bo'lgan bloklar). Unit testlari yoziladi.

✅ **Qabul mezonlari:** `pnpm test` — barcha yangi unit testlar o'tadi.

## V2-P3.S2 — Media v2

- [ ] **V2-P3.S2.1** `src/collections/Media.ts`:
  - `upload`: `mimeTypes: ['image/jpeg','image/png','image/webp','image/avif','application/pdf']`, `focalPoint: true`, `imageSizes`: `thumb` 400, `card` 800, `hero` 1600 (hammasi `formatOptions: { format: 'webp', options: { quality: 80 } }`), `adminThumbnail: 'thumb'`.
  - Mavjud `alt` (localized emas) **qoladi**, lekin `required: false` va `admin.hidden: true` bo'ladi (V2-P10 da o'chiriladi).
  - **Yangi** `altText` — text, `localized`, label "Alt matn (rasmda nima bor)". Yangi yuklashlar uchun admin'da `required` (validate: create'da bo'sh bo'lmasin).
  - `caption` (text, localized), `credit` (text, "Manba / muallif"), `license` (select, default `unknown`: `public-domain`, `cc-by`, `cc-by-sa`, `cc-by-nc`, `permission`, `own`, `unknown`), `year` (yearField), `uploadedBy` (rel users, readOnly, `beforeChange` da `req.user.id`).
  - `access`: `read: anyone`, `create: isStaff`, `update`: editor/admin yoki `uploadedBy == user`, `delete: isEditorOrAdmin`.
  - `admin.group: 'Media'`.
- [ ] **V2-P3.S2.2** `src/lib/media-alt.ts` → `getAlt(media, locale)`: `media.altText || media.alt || ''`.

## V2-P3.S3 — Taksonomiya

- [ ] **V2-P3.S3.1** `Periods` (mavjud fayl kengaytiriladi, mavjud maydonlar **o'zgartirilmaydi**):
  - Yangi: `order` (number, required, unique — xronologiyadagi tartib 1..N), `shortTitle` (text, localized — davr panelidagi qisqa nom: "Temuriylar"), `yearsLabel` (text, localized — "mil. avv. 100 000 – 600" kabi qo'lda yoziladigan oraliq), `timelineWeight` (number, default 1, min .5, max 4 — xronologiya panelidagi ustun kengligi), `cover` (upload media — gravyura), `coverCaption` (text, localized), `mapYear` (yearField — xarita slayderidagi yil yorlig'i).
  - `color` options'ga `{ label: 'Qum (Sand)', value: 'sand' }` qo'shiladi.
  - `defaultSort: 'order'`, `admin.defaultColumns: ['order','title','yearsLabel','color']`.
  - `access`: read anyone, create/update `isEditorOrAdmin`, delete `isAdmin`.
  - Join'lar: `posts` (`collection:'posts', on:'period'`), `persons` (`on:'period'`), `events` (`on:'period'`).
- [ ] **V2-P3.S3.2** `Regions` (yangi): `title` (localized, required), `slug`. `admin.group: 'Taksonomiya'`.
- [ ] **V2-P3.S3.3** `Categories` (yangi): `title` (localized, required), `slug`, `description` (textarea, localized). `nestedDocsPlugin({ collections: ['categories'], generateLabel: (_, d) => String(d.title ?? ''), generateURL: (docs) => docs.reduce((u, d) => `${u}/${d.slug}`, '') })`. Dizayndagi kategoriyalar: Siyosiy tarix, Madaniyat, Arxeologiya, Adabiyot, Ilm-fan, Harbiy tarix, Ta'lim, Iqtisod.
- [ ] **V2-P3.S3.4** `Tags` (yangi): `title` (localized, required), `slug`.

## V2-P3.S4 — Users (xodimlar) v2

- [ ] **V2-P3.S4.1** `src/collections/Users.ts` (mavjud `username` login saqlanadi):
  - `role`: options `admin` (Administrator), `editor` (Muharrir), `author` (Muallif); `defaultValue: 'author'`; `saveToJWT: true`; field access: `create/update: fieldAdminOnly`.
  - Yangi: `slug` (slugField('displayName')), `isActive` (checkbox, default true, field access admin), `bio` (textarea, localized, maxLength 500), `classInfo` (text — "9-B, 12-maktab", field access `read: fieldEditorOrAdmin`).
  - `auth`: mavjudlariga qo'shimcha `tokenExpiration: 60 * 60 * 8`, `forgotPassword.generateEmailHTML` (P4.S6) va `hooks.beforeLogin`: `isActive === false` bo'lsa `throw new APIError('Akkaunt faol emas', 403)`.
  - `access`: `read`: admin → hammasi, boshqa xodim → `{ id: { equals: user.id } }`, mehmon/reader → `false`; `create: isAdmin`; `update`: admin yoki o'zi; `delete: isAdmin`; `admin: ({ req }) => isStaffUser(req.user)`.
  - `admin.group: 'Foydalanuvchilar'`, `useAsTitle: 'displayName'`, `defaultColumns: ['displayName','username','email','role','isActive']`.

## V2-P3.S5 — Posts v2

- [ ] **V2-P3.S5.1** `src/collections/Posts.ts` ni qayta yozing. Mavjud `title`, `slug`, `excerpt`, `coverImage`, `period`, `publishedAt`, `commentsEnabled`, `author`, `searchText` maydonlari **nomi va turi o'zgarmaydi**.
  ```ts
  slug: 'posts',
  labels: { singular: 'Maqola', plural: 'Maqolalar' },
  admin: {
    useAsTitle: 'title',
    group: 'Kontent',
    defaultColumns: ['title', 'workflowStatus', 'author', 'period', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
  },
  versions: { drafts: { autosave: { interval: 2000 } }, maxPerDoc: 30 },
  defaultSort: '-publishedAt',
  ```
- [ ] **V2-P3.S5.2** Maydonlar (`tabs`):
  - **Tab "Matn":** `title` (text, localized, maxLength 160, `required: false`), `excerpt` (textarea, localized, maxLength 300), `coverImage` (upload media), **`body` (richText, localized, `editor: postEditor` — P5 da; hozircha `lexicalEditor()`)**.
  - **Tab "Tarix":** `period` (rel periods), `categories` (rel hasMany), `tags` (rel hasMany), `persons` (rel hasMany), `events` (rel hasMany), `places` (rel hasMany), `regions` (rel hasMany).
  - **Tab "Tekshiruv":** `noteToEditor` (textarea, label "Muharrir uchun izoh" — muallif yozadi), `reviewNotes` (array: `note` textarea required, `by` rel users readOnly, `at` date readOnly; field access `update: fieldEditorOrAdmin`).
  - **Tab "SEO":** seo plagini (S10).
  - **Sidebar:** `slug`, `workflowStatus` (select, required, default `draft`, index: `draft` Qoralama, `in_review` Tekshiruvda, `changes_requested` Tuzatish kerak, `approved` Tasdiqlandi, `published` Chop etildi), `author` (rel users, required, `defaultValue: ({ user }) => user?.collection === 'users' ? user.id : undefined`, field access update: editor/admin), `coAuthors` (rel users hasMany), `reviewedBy` (rel users, readOnly), `publishedAt` (date, index), `featured` (checkbox, field access editor/admin), `commentsEnabled` (checkbox, default true), `readingTime` (number, localized, readOnly), `views` (number, default 0, readOnly, index).
  - **Yashirin:** `searchText` (mavjud, localized textarea, `admin.hidden`).
  - **ESKIRGAN (ko'chirilgandan keyin o'chiriladi):** `content` (`required: false`, `admin.readOnly: true`, label "ESKIRGAN matn — body'ga ko'chirildi"), `coverImageUrl` (`admin.readOnly`), `language` (`admin.hidden`). Bularni **o'chirmang** — V2-P10.S3 da o'chiriladi.
- [ ] **V2-P3.S5.3** Hook'lar (`beforeChange` tartibi bo'yicha): `enforcePostWorkflow` (P4.S3), `computeReadingTime` (`body` dan, 180 so'z/daq), `buildSearchText` (`title + excerpt + extractPlainText(body)` → `normalizeSearch` → 30 000 belgigacha). `afterChange`: `revalidateSite` (P6.S1), `notifyWorkflow` (P4.S4). Mavjud inline hook (`searchText` ni `content` dan hisoblaydigan va `publishedAt` ni har doim qo'yadigan) **olib tashlanadi**.
- [ ] **V2-P3.S5.4** `access` (to'liq matritsa P4.S2 da): `read`: editor/admin → true; author → `{ or: [{ _status: { equals: 'published' } }, { author: { equals: user.id } }] }`; reader va mehmon → `{ _status: { equals: 'published' } }`. `create: isStaff`. `update`: editor/admin → true; author → `{ and: [{ author: { equals: id } }, { workflowStatus: { in: ['draft','changes_requested'] } }] }`. `delete: isAdmin`. `readVersions: isStaff`.

## V2-P3.S6 — Tarixiy kolleksiyalar (yangi)

Har birida: `versions: { drafts: true, maxPerDoc: 20 }`, `admin.group: 'Tarix'`, `author` (rel users, default joriy xodim, sidebar), hook `preventAuthorPublish` (P4.S3.4), `revalidateSite`, `buildSearchText`. `access`: read `publishedOrStaff`, create `isStaff`, update editor/admin yoki (author && o'ziniki && qoralama), delete `isEditorOrAdmin`.

- [ ] **V2-P3.S6.1** `Persons` (`slug: 'persons'`):
  `name` (localized, required), `slug` (slugField('name')), `personType` (select, required: `scholar` Olim, `ruler` Hukmdor, `poet` Shoir, `commander` Sarkarda, `enlightener` Ma'rifatparvar, `statesman` Davlat arbobi, `other` Boshqa), `birthYear`, `deathYear` (yearField), `yearsApproximate` (checkbox), `lifespanLabel` (text, localized — masalan "? – mil. avv. 328"), `birthPlace` (text, localized — "Kat", "Kesh"), `portrait` (upload), `shortBio` (textarea, localized, maxLength 300), `biography` (richText, localized, `simpleEditor`), `period` (rel periods), `regions` (rel hasMany), `featured` (checkbox), `posts` (join: `collection:'posts', on:'persons'`), `searchText` (hidden). `defaultSort: 'name'`.
- [ ] **V2-P3.S6.2** `Events` (`slug: 'events'`):
  `title` (localized, required), `slug`, `year` (yearField, **required**), `endYear`, `month` (1–12), `day` (1–31), `approximate` (checkbox), `yearLabel` (text, localized — "VI asr", "1960-yillar"; bo'lsa raqam o'rniga ko'rsatiladi), `importance` (select `1` Juda muhim / `2` Muhim / `3` Qo'shimcha, default `2`), `summary` (textarea, localized, required, maxLength 500), `description` (richText, `simpleEditor`), `image` (upload), `period` (rel, **required**), `place` (rel places), `persons` (rel hasMany), `posts` (join `on:'events'`), `searchText`. Validatsiya: `day` bo'lsa `month` ham bo'lishi kerak; `endYear >= year`. `defaultSort: 'year'`.
- [ ] **V2-P3.S6.3** `Places` (`slug: 'places'`):
  `name` (localized, required), `slug`, `lat` (number, required, −90..90), `lng` (number, required, −180..180), `placeType` (select: `palace` Saroy, `fortress` Qal'a, `city` Shahar, `square` Maydon, `port` Port, `mausoleum` Maqbara, `mosque` Masjid/madrasa, `archaeological` Arxeologik yodgorlik, `battle` Jang joyi, `natural` Tabiiy ob'ekt, `other`), `fromLabel` (text, localized — "mil. avv. I asr"), `appearsIn` (rel periods, **required** — xarita slayderi shu davrdan boshlab ko'rsatadi), `summary` (textarea, localized), `image` (upload), `region` (rel regions), `posts` (join `on:'places'`), `events` (join `collection:'events', on:'place'`), `searchText`.
- [ ] **V2-P3.S6.4** `ArchiveItems` (`slug: 'archive-items'`):
  `title` (localized, required), `slug`, `kind` (select, required: `photo` Foto, `document` Hujjat, `map` Xarita, `engraving` Gravyura, `video` Video, `manuscript` Qo'lyozma, `newspaper` Gazeta), `files` (upload media, `hasMany`; validate: `kind !== 'video'` bo'lsa kamida 1 ta), `videoUrl` (text — YouTube; validate: `kind === 'video'` bo'lsa majburiy va `youtube.com/watch?v=` yoki `youtu.be/` formatida), `year` (yearField), `yearText` (text, localized), `description` (textarea, localized), `provenance` (text, required — "OʻzR MDA", "S. Tolstov arxivi"), `license` (Media'dagi select, required), `period`, `region`, `persons` (hasMany), `places` (hasMany), `relatedPost` (rel posts — "Maqolada ko'rish"), `searchText`.

## V2-P3.S7 — Sahifalar va Globallar

- [ ] **V2-P3.S7.1** `Pages` (`slug: 'pages'`): `title` (localized, required), `slug`, `kicker` (text, localized), `body` (richText, localized, `simpleEditor`), `showInFooter` (checkbox). `versions.drafts: true`. `admin.group: 'Kontent'`. Access: read `publishedOrStaff`, write `isEditorOrAdmin`.
- [ ] **V2-P3.S7.2** `src/globals/Header.ts` (`slug: 'header'`): `navItems` (array, maxRows 8: `label` localized required, `link` linkField, `children` array maxRows 12: `label`, `description` (localized), `link`).
- [ ] **V2-P3.S7.3** `src/globals/Footer.ts` (`slug: 'footer'`): `about` (textarea, localized), `columns` (array, maxRows 2: `title` localized, `links` array: `label` localized + `link`), `digestTitle`, `digestText` (localized), `note` (localized — "Har bir maqola muharrir tekshiruvidan oʻtadi"), `rights` (localized).
- [ ] **V2-P3.S7.4** `src/globals/SiteSettings.ts` (`slug: 'site-settings'`): `siteName` (localized, default "hisinf.uz"), `tagline` (localized), `editionLabel` (localized), `telegramUrl`, `telegramHandle` ("@hisinf_uz"), `contactEmail`, `defaultOgImage` (upload), `loginImage` (upload), `loginImageLabel` (localized), `loginQuote` (textarea, localized), `loginQuoteSource` (localized), `popularSearches` (array: `term` localized), `digestEnabled` (checkbox), `digestWeekday` (select 1–7, default 5).
- [ ] **V2-P3.S7.5** `src/globals/HomePage.ts` (`slug: 'home-page'`):
  - `hero` group: `kicker`, `titleA`, `titleB` (kursiv qizil qism), `subtitle`, `image` (upload), `imageLabel`, `cta1Label` + `cta1Link`, `cta2Label` + `cta2Link`, `searchPlaceholder` — matnlar localized.
  - `onThisDayFallback` (rel events — bugungi sanaga voqea topilmasa ko'rsatiladi).
  - `periodsSection` group: `kicker`, `title`, `linkLabel` (localized).
  - `featuredPost` (rel posts), `picks` (rel posts, hasMany, maxRows 2), `picksSection` group (kicker, title, linkLabel).
  - `aboutSection` group: `kicker`, `title`, `text` (localized), `steps` (array, maxRows 4: `title`, `text` localized).
  - `personsSection` group (kicker, title, linkLabel), `featuredPersons` (rel persons, maxRows 4).
  - `authorCta` group: `kicker`, `title`, `text`, `buttonLabel` (localized), `image` (upload), `imageLabel`.
  - `showHomeComments` (checkbox, default true), `homeCommentsTitle` (localized).
- [ ] **V2-P3.S7.6** Barcha globallar: `access.read: anyone`, `update: isEditorOrAdmin`, `admin.group: 'Sozlamalar'`, `hooks.afterChange: [revalidateSite]`.

## V2-P3.S8 — Muloqot kolleksiyalari

- [ ] **V2-P3.S8.1** `Comments` v2 (mavjud fayl qayta yoziladi, mavjud maydon nomlari saqlanadi):
  - Mavjud: `post` (endi `required: false`), `reader`, `authorName` (readOnly), `body` (minLength 3, maxLength 1000). **Mavjud `createdAt` maydoni olib tashlanadi** — Payload `timestamps` ni o'zi qo'shadi. Olib tashlashdan oldin generatsiya qilingan migratsiyada `created_at` ustuni **o'chirilmasligini** tekshiring. Agar o'chirilsa, maydonni saqlab qoldiring va `admin.hidden` qiling.
  - Yangi: `context` (select `post` | `home`, required, default `post`, index), `parent` (rel comments), `staffAuthor` (rel users, readOnly), `status` (select `pending` | `approved` | `rejected` | `spam`, default `pending`, index), `flagged` (checkbox, readOnly), `flagReason` (text, readOnly), `likesCount` (number, default 0, readOnly), `moderatedBy` (rel users, readOnly), `moderatedAt` (date, readOnly).
  - Validatsiya: `context === 'post'` bo'lsa `post` majburiy; `parent` bo'lsa uning `parent` i bo'sh bo'lishi kerak (1 daraja javob).
  - `access`: `read`: xodim → hammasi, boshqalar → `{ status: { equals: 'approved' } }`; `create: isStaff` (o'quvchilar faqat server action orqali yozadi); `update`/`delete: isEditorOrAdmin`.
  - `beforeChange`: create'da `req.user` xodim bo'lsa → `staffAuthor = user.id`, `authorName = user.displayName`, `status = 'approved'`. `status` o'zgarganda → `moderatedBy`, `moderatedAt`.
  - `afterChange`: `status` `approved` ga o'tsa yoki undan chiqsa → `revalidateSite`.
  - `admin`: `group: 'Muloqot'`, `useAsTitle: 'body'`, `defaultColumns: ['body','authorName','context','post','status','flagged','createdAt']`.
- [ ] **V2-P3.S8.2** `CommentLikes` (`slug: 'comment-likes'`): `comment` (rel, required), `reader` (rel, required). `indexes: [{ fields: ['comment', 'reader'], unique: true }]`. `access`: read `isStaff`, create/update/delete `nobody` (faqat server action). `admin.hidden: true`.
- [ ] **V2-P3.S8.3** `Inquiries` v2 (mavjud fayl):
  - Yangi: `type` (select `contact` Aloqa | `author_application` Muallif arizasi, default `contact`), `reader` (rel readers), `email` (email), `subject` (text), `school` (text — faqat ariza uchun, `condition`), `topic` (textarea — faqat ariza), `repliedBy` → endi `rel users` bo'ladi. Mavjud `repliedBy` text maydoni **qoladi** (`admin.hidden`), yangisi `repliedByUser` deb nomlanadi.
  - `phone` → `admin.hidden: true` (V2-P10 da o'chiriladi).
  - Mavjud `createdAt` maydoni — Comments'dagi kabi ehtiyotkorlik bilan.
  - `access`: `read`: xodim → hammasi, reader → `{ reader: { equals: user.id } }`, mehmon → false; `create: nobody`; `update: isStaff`; `delete: isAdmin`.
  - `afterChange`: `reply` birinchi marta to'ldirilganda → `status='replied'`, `repliedAt=now`, `repliedByUser=req.user.id`, `email` bo'lsa javob emaili yuboriladi (shablon `src/emails/inquiry-reply.ts`).
  - `admin.group: 'Muloqot'`.
- [ ] **V2-P3.S8.4** `Subscribers` — eski rejadagi `docs/plan/P11-telegram-email.md` P11.S3.2 bo'yicha **aynan**.
- [ ] **V2-P3.S8.5** `DailyStats` (`slug: 'daily-stats'`): `day` (text, required, index — `YYYY-MM-DD`, Toshkent vaqti), `locale` (select uz | kaa, required), `post` (rel posts, ixtiyoriy — bo'sh bo'lsa bu sahifa ko'rishi), `views` (number, default 0). `indexes: [{ fields: ['day','locale','post'], unique: true }]`. `access`: read `isStaff`, qolganlari `nobody`. `admin.group: 'Tizim'`, `admin.hidden: ({ user }) => user?.role !== 'admin'`.

## V2-P3.S9 — Readers v2

- [ ] **V2-P3.S9.1** `src/collections/Readers.ts`:
  ```ts
  auth: {
    loginWithUsername: { allowEmailLogin: true, requireEmail: false, requireUsername: false },
    verify: { generateEmailSubject: …, generateEmailHTML: … },   // P4.S5
    forgotPassword: { generateEmailSubject: …, generateEmailHTML: … },
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 60 * 60 * 24 * 30,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
  },
  ```
  `verify` yoqilganda **mavjud** o'quvchilar tasdiqlanmagan bo'lib qoladi va kira olmaydi. Buni V2-P3.S12.6 skripti tuzatadi. Skript ishlamaguncha prod'ga chiqarmang!
- [ ] **V2-P3.S9.2** Maydonlar:
  - Yangi: `displayName` (text, maxLength 40 — "Ism-familiya yoki taxallus"), `locale` (select uz | kaa, default uz), `acceptedTermsAt` (date, readOnly), `isBanned` (checkbox, field access `update: fieldStaffOnly`).
  - Mavjud: `savedPosts` (saqlanadi, `maxRows: 500`).
  - Eskirgan (`admin.hidden`, field access faqat xodim): `firstName`, `lastName`, `phone`, `role`, `displayPassword`. Bular V2-P10 da o'chiriladi.
- [ ] **V2-P3.S9.3** `access`: P0.S4.1 dagi ruxsatlar saqlanadi. Qo'shimcha: `admin: () => false` — o'quvchilar `/admin` ga kira olmaydi (`admin.user = 'users'` buni allaqachon ta'minlaydi). `afterDelete`: o'quvchining `comments` va `comment-likes` yozuvlari o'chiriladi.
- [ ] **V2-P3.S9.4** `admin`: `useAsTitle: 'displayName'`, `group: 'Foydalanuvchilar'`, `defaultColumns: ['displayName','email','username','_verified','isBanned','createdAt']`.

## V2-P3.S10 — Plaginlar

- [ ] **V2-P3.S10.1** `payload.config.ts` → `plugins` (s3Storage'dan keyin):
  ```ts
  nestedDocsPlugin({ collections: ['categories'], … }),
  seoPlugin({
    collections: ['posts', 'pages', 'persons', 'events', 'places', 'archive-items'],
    uploadsCollection: 'media',
    tabbedUI: true,
    generateTitle: ({ doc }) => `${(doc as { title?: string; name?: string }).title ?? (doc as { name?: string }).name ?? ''} — hisinf.uz`,
    generateDescription: ({ doc }) => (doc as { excerpt?: string; summary?: string; shortBio?: string }).excerpt ?? (doc as { summary?: string }).summary ?? (doc as { shortBio?: string }).shortBio ?? '',
  }),
  ```
  SEO `meta.title`/`meta.description` localized ekanini admin'da tekshiring.
- [ ] **V2-P3.S10.2** `collections` tartibi: `Users, Readers, Posts, Pages, Periods, Persons, Events, Places, ArchiveItems, Categories, Tags, Regions, Media, Comments, CommentLikes, Inquiries, Subscribers, DailyStats`. `globals: [Header, Footer, SiteSettings, HomePage]`.

## V2-P3.S11 — Migratsiya (faqat qo'shuvchi)

- [ ] **V2-P3.S11.1** `pnpm generate:types && pnpm typecheck`.
- [ ] **V2-P3.S11.2** `v2-dev` DB'da `pnpm dev` ni bir marta ishga tushiring (dev'da push sxemani moslaydi) va admin ochilishini tekshiring.
- [ ] **V2-P3.S11.3** `pnpm migrate:create v2_additive`. Hosil bo'lgan faylni **satrma-satr o'qing**:
  - `DROP COLUMN` / `DROP TABLE` qatorlari bo'lmasligi kerak. Bo'lsa, qaysi maydon sababchi ekanini toping (odatda tur yoki `localized` o'zgargan). Maydonni asl holiga qaytaring va qayta generatsiya qiling.
  - `ALTER COLUMN … SET NOT NULL` ustunlari mavjud qatorlarda bo'sh bo'lmasligi kerak, aks holda migratsiya yiqiladi.
- [ ] **V2-P3.S11.4** **Drafts backfill.** `posts`, `pages` va boshqa drafts yoqilgan kolleksiyalarda mavjud qatorlar `_status = NULL` bo'lib qoladi va ommaviy so'rovlarda ko'rinmaydi. Migratsiyaning `up` funksiyasi oxiriga qo'shing:
  ```ts
  await db.execute(sql`UPDATE "posts" SET "_status" = 'published' WHERE "_status" IS NULL`)
  await db.execute(sql`UPDATE "posts" SET "workflow_status" = 'published' WHERE "workflow_status" IS NULL OR "workflow_status" = 'draft'`)
  await db.execute(sql`UPDATE "comments" SET "status" = 'approved' WHERE "status" IS NULL OR "status" = 'pending'`)
  await db.execute(sql`UPDATE "comments" SET "context" = 'post' WHERE "context" IS NULL`)
  // readers.auth.verify yoqilganda eski o'quvchilar kira olmay qolmasligi uchun (S12.6 skriptining atomik varianti):
  await db.execute(sql`UPDATE "readers" SET "_verified" = true WHERE "_verified" IS NOT TRUE`)
  ```
  **Ustun nomlarini** (`workflow_status` va boshqalar) generatsiya qilingan SQL'dan tekshirib oling. Comments uchun qaror: mavjud izohlar avval ham ochiq edi, shuning uchun `approved` qilinadi.
- [ ] **V2-P3.S11.5** Toza `v2-test` Neon branch'ida (prod nusxasi) `pnpm migrate` → xatosiz o'tishi kerak. Keyin admin'da eski maqolalar ko'rinishini va ochilishini tekshiring.

✅ **Qabul mezonlari:** prod nusxasida migratsiya o'tdi va eski maqolalar, izohlar va o'quvchilar joyida.

## V2-P3.S12 — Ma'lumot ko'chirish skriptlari (`scripts/v2/`)

**Umumiy qoidalar:**
- Har skript **idempotent** bo'ladi: ikkinchi marta ishga tushirilsa, hech narsani buzmaydi.
- Har skript `--dry-run` flagini qo'llab-quvvatlaydi: faqat nima o'zgarishini yozadi.
- Barcha yozish amallarida `context: { disableRevalidate: true, disableNotifications: true, skipWorkflow: true }` beriladi.
- Ishga tushirish: `pnpm v2:script scripts/v2/<fayl>.ts [--dry-run]`.
- Natija `docs/migration-log.md` ga yoziladi (sana, muhit, nechta yozuv o'zgardi).

- [ ] **V2-P3.S12.1** `01-backfill-check.ts` — tekshiruvchi: postlar soni, `_status IS NULL` qolganlar soni (0 bo'lishi kerak), har til uchun `title` bor postlar soni.
- [ ] **V2-P3.S12.2** `02-convert-content.ts` — `posts.content` (oddiy matn) → `posts.body` (Lexical), **har til uchun alohida**:
  ```ts
  // Oddiy matn → Lexical JSON (paragraflar bo'sh qator bo'yicha ajratiladi)
  function textToLexical(text: string) {
    const paragraphs = text.replace(/\r\n/g, '\n').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    return {
      root: {
        type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
        children: paragraphs.map((p) => ({
          type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
          children: p.split('\n').flatMap((line, i) => [
            ...(i > 0 ? [{ type: 'linebreak', version: 1 }] : []),
            { type: 'text', text: line, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
          ]),
        })),
      },
    }
  }
  ```
  Algoritm: har post uchun `locale: 'uz'` va `locale: 'kaa'` da (`fallbackLocale: false`) `content` o'qiladi. Bo'sh bo'lmasa va `body` bo'sh bo'lsa → `body = textToLexical(content)` shu locale'da yoziladi (`draft: false`). Yaratilgan JSON tuzilmasini admin'da ochib tekshiring. Lexical "Invalid node" xatosi bersa, tugun maydonlarini `@payloadcms/richtext-lexical` bilan yaratilgan namuna JSON bilan solishtiring: admin'da qo'lda bitta paragraf yozing, so'ng `GET /api/posts/:id` qiling.
- [ ] **V2-P3.S12.3** `03-fix-kaa-duplicates.ts` — eski kod kaa tarjima bo'lmaganda uz matnini kaa'ga nusxalagan. Har post uchun kaa `title`/`excerpt`/`body` matni uz'niki bilan **aynan bir xil** bo'lsa, kaa qiymatlari `null` qilinadi (fallback ishlashi va "tarjima yo'q" banneri chiqishi uchun). `language === 'uz'` bo'lgan postlarda ham kaa tozalanadi. `language === 'kaa'` (faqat kaa) postlar uchun: agar uz maydonlari kaa bilan bir xil bo'lsa, ular qoldiriladi va ro'yxat `docs/migration-log.md` ga yoziladi (bunday postlar qo'lda ko'rib chiqiladi).
- [ ] **V2-P3.S12.4** `04-import-cover-urls.ts` — `coverImageUrl` bor va `coverImage` bo'sh postlar uchun: rasmni `fetch` qiladi (timeout 15s, faqat `image/*`, ≤10 MB), `payload.create({ collection: 'media', data: { altText: title, credit: 'Internet: ' + url, license: 'unknown' }, file: { data, mimetype, name, size } })`, so'ng `coverImage` ga bog'laydi. Yuklab bo'lmaganlari log'ga yoziladi. `license: unknown` bo'lgan rasmlar ro'yxati muharrirga beriladi.
- [ ] **V2-P3.S12.5** `05-readers-to-display-name.ts` — `displayName = trim(firstName + ' ' + lastName) || username`.
- [ ] **V2-P3.S12.6** `06-readers-verify.ts` — **barcha mavjud** o'quvchilarni tasdiqlangan qiladi: `payload.update({ collection: 'readers', id, data: { _verified: true }, overrideAccess: true })`. Local API bu maydonni yozishga ruxsat bermasa, migratsiyada SQL ishlatiladi: `UPDATE "readers" SET "_verified" = true WHERE "_verified" IS NOT TRUE`.
- [ ] **V2-P3.S12.7** `07-reader-admins-report.ts` — `role IN ('admin','superadmin')` bo'lgan o'quvchilar ro'yxatini chiqaradi (username, ism). **Avtomatik ko'chirilmaydi.** Admin har biri uchun `/admin` → Xodimlar orqali `users` da akkaunt yaratadi (P5.S6 dagi taklif funksiyasi bilan) va ro'yxatni `docs/migration-log.md` da belgilaydi.
- [ ] **V2-P3.S12.8** `08-home-comments.ts` — `slug = 'bosh-sahifa-izohlari'` postga bog'langan izohlar → `context = 'home'`, `post = null`. Keyin bu soxta post **o'chiriladi** (avval uning ID'si log'ga yoziladi).
- [ ] **V2-P3.S12.9** `09-inquiries-link-readers.ts` — `phone` bo'yicha mos keladigan `readers.phone` topilsa, `inquiries.reader` bog'lanadi.
- [ ] **V2-P3.S12.10** `10-media-alt.ts` — `media.alt` → `media.altText` (uz).
- [ ] **V2-P3.S12.11** `11-rebuild-search.ts` — barcha postlarni ikki tilda qayta saqlab, `searchText` va `readingTime` ni `body` dan qayta hisoblaydi.

✅ **Qabul mezonlari:** `v2-test` (prod nusxasi) da 01–11 skriptlar ketma-ket o'tdi. Admin'da eski maqola `body` da paragraflar bilan ko'rinadi. kaa'da nusxa matnlar yo'q. Eski o'quvchi username + parol bilan kira oladi.

## V2-P3.S13 — Seed (dev va test uchun)

- [ ] **V2-P3.S13.1** `src/seed/v2/index.ts` — `ALLOW_SEED=true` bo'lmasa chiqib ketadi. Idempotent (slug bo'yicha upsert). Hamma yozuvlar `context: { disableRevalidate: true, disableNotifications: true, skipWorkflow: true }` bilan.
- [ ] **V2-P3.S13.2** **Davrlar** (manba: `docs/design/Xronologiya.dc.html` `ERAS`) — **aynan shu 10 ta**:
  | order | title (uz) | shortTitle | yearsLabel | color | timelineWeight | coverCaption | mapYear |
  |---|---|---|---|---|---|---|---|
  | 1 | Qadimgi davr | Qadimgi | mil. avv. 100 000 – 600 | sand | 3 | Teshiktosh gʻori | −3000 |
  | 2 | Antik davr | Antik | mil. avv. 600 – 400 | ochre | 2 | Tuproqqalʼa | −300 |
  | 3 | Ilk oʻrta asrlar | Ilk OʻA | 401 – 850 | olive | 1.4 | Afrosiyob devoriy surati | 700 |
  | 4 | Musulmon renessansi va Xorazmshohlar | Renessans | 851 – 1220 | teal | 1.4 | Maʼmun akademiyasi | 1100 |
  | 5 | Moʻgʻullar va Oltin Oʻrda | Moʻgʻullar | 1221 – 1370 | brick | 1 | Urganch qamali | 1250 |
  | 6 | Temuriylar davri | Temuriylar | 1370 – 1507 | indigo | 1 | Registon | 1420 |
  | 7 | Xonliklar davri | Xonliklar | 1508 – 1873 | ochre | 1.2 | Ichan qalʼa | 1700 |
  | 8 | Rossiya imperiyasi davri | Rossiya imp. | 1873 – 1917 | sand | .9 | jadid maktabi | 1890 |
  | 9 | Sovet davri | Sovet | 1917 – 1991 | brick | 1.1 | Toʻrtkoʻl, 1925 | 1950 |
  | 10 | Mustaqillik davri | Mustaqillik | 1991 – 2026 | teal | 1 | Mustaqillik maydoni | 2026 |
  `description` lar `ERAS[i][5]` dan olinadi. `startYear`/`endYear` `yearsLabel` dagi raqamlardan (miloddan avvalgi bo'lsa manfiy). kaa nomlari hozircha uz bilan bir xil (`TODO(kaa-review)` — `docs/kaa-review.md` ga qo'shing).
- [ ] **V2-P3.S13.3** **Voqealar** — `ERAS[i][9]` dagi har bir `[yil, sarlavha, matn]` → `events`. `yil` raqam bo'lsa `year` ga, "VI asr" yoki "1960-yillar" kabi bo'lsa `yearLabel` ga yoziladi va `year` taxminiy son bo'ladi (VI asr → 550, "1960-yillar" → 1960, `approximate: true`). "mil. avv. 70 000" → `-70000`.
- [ ] **V2-P3.S13.4** **Shaxslar** — `docs/design/Shaxslar.dc.html` `PEOPLE` (12 ta): `[name, yillar, birthPlace, personType, davr, rang, shortBio]`. `personType` xaritasi: Olim→scholar, Hukmdor→ruler, Shoir→poet, Sarkarda→commander, Maʼrifatparvar→enlightener, Davlat arbobi→statesman. Davr nomi bo'yicha `period` bog'lanadi.
- [ ] **V2-P3.S13.5** **Joylar** — `docs/design/Xarita.dc.html` `SITES` (10 ta). Dizayndagi `x/y` foizlari koordinata **emas**. Haqiqiy koordinatalar (taxminiy — openstreetmap.org da tekshiring):
  | Joy | lat | lng | placeType | appearsIn (order) |
  |-----|-----|-----|-----------|-------------------|
  | Tuproqqalʼa | 41.928 | 60.817 | palace | 2 |
  | Ayozqalʼa | 41.998 | 61.006 | fortress | 2 |
  | Mizdahkon | 42.405 | 59.620 | city | 2 |
  | Koʻhna Urganch | 42.332 | 59.150 | city | 4 |
  | Afrosiyob | 39.670 | 66.990 | city | 2 |
  | Registon | 39.655 | 66.976 | square | 6 |
  | Ichan qalʼa | 41.378 | 60.359 | fortress | 7 |
  | Toʻrtkoʻl | 41.550 | 61.000 | city | 8 |
  | Nukus | 42.460 | 59.610 | city | 9 |
  | Moʻynoq | 43.770 | 59.020 | port | 8 |
  `fromLabel`, `summary` dizayndan olinadi.
- [ ] **V2-P3.S13.6** **Arxiv** — `docs/design/Media Arxiv.dc.html` `M` (12 ta): turi, nomi, yili, manbasi. Fayl sifatida `src/seed/v2/images/` dagi jamoat mulki (public domain) rasmlaridan biri ishlatiladi. Rasm bo'lmasa, 1×1 placeholder yaratilmaydi — birlik `files`siz qoladi (faqat dev). Video uchun `videoUrl` — istalgan ochiq YouTube havola.
- [ ] **V2-P3.S13.7** **Kategoriyalar** (S3.3 ro'yxati), **maqolalar** (`docs/design/Maqolalar.dc.html` `A` — 10 ta sarlavha, excerpt, kategoriya, muallif nomi). Har biriga 3 paragraf + 1 ta `Manba` bloki + 1 ta footnote bilan `body` yaratiladi. `src/seed/seedDelimitation1924.ts` dagi haqiqiy kontentdan 1924-yil maqolasi uchun foydalaning. Xodim akkauntlari (admin, editor, author — parollar `SEED_*_PASSWORD` env'dan).
- [ ] **V2-P3.S13.8** **Globallar:** Header (6 ta element: Bosh sahifa→home, Maqolalar→posts, Davrlar→timeline, Shaxslar→persons, Media arxiv→archive, Xarita→map), Footer va HomePage — matnlar 6-bo'limdagi uz/kaa qiymatlaridan.

✅ **Qabul mezonlari:** toza dev DB'da `pnpm seed` → hamma sahifa dizayndagidek ma'lumot bilan to'ladi. Qayta ishga tushirilganda dublikat yaratilmaydi.

---

# V2-P4 — Auth, rollar va tahririy ish jarayoni

## V2-P4.S1 — Ruxsatlar matritsasi (yakuniy)

| Kolleksiya | read | create | update | delete |
|---|---|---|---|---|
| `users` | admin: hammasi · xodim: o'zi · boshqa: ❌ | admin | admin · o'zi (role/isActive'siz) | admin |
| `readers` | xodim · o'zi | ❌ (server action) | xodim · o'zi (isBanned'siz) | xodim · o'zi |
| `posts` | ommaga: published · author: +o'ziniki · editor/admin: hammasi | xodim | editor/admin · author: o'ziniki && draft/changes_requested | admin |
| `persons, events, places, archive-items, pages` | ommaga: published · xodim | xodim (pages: editor/admin) | editor/admin · author: o'ziniki qoralama | editor/admin |
| `periods, categories, tags, regions` | hamma | editor/admin | editor/admin | admin |
| `media` | hamma | xodim | editor/admin · o'zi yuklagan | editor/admin |
| `comments` | ommaga: approved · xodim | xodim (o'quvchi — server action) | editor/admin | editor/admin |
| `comment-likes` | xodim | ❌ (server action) | ❌ | ❌ |
| `inquiries` | xodim · reader: o'ziniki | ❌ (server action) | xodim | admin |
| `subscribers`, `daily-stats` | admin (stats: xodim) | ❌ | ❌ | admin |
| globals | hamma | — | editor/admin | — |

- [ ] **V2-P4.S1.1** Jadvalni barcha kolleksiyalarda tekshiring. `grep -L "access:" src/collections/*.ts` bo'sh natija berishi kerak.

## V2-P4.S2 — Workflow (holatlar mashinasi)

```
 draft ──(muallif: yuborish)──▶ in_review ──(muharrir: tasdiqlash)──▶ approved ──(muharrir: chop etish)──▶ published
   ▲                              │                                    │
   └──(muallif tuzatadi)── changes_requested ◀──(muharrir: qaytarish)──┘ (approved'dan ham qaytarish mumkin)
```

- [ ] **V2-P4.S2.1** `src/lib/workflow.ts`:
  ```ts
  export type WorkflowStatus = 'draft' | 'in_review' | 'changes_requested' | 'approved' | 'published'
  export type StaffRole = 'admin' | 'editor' | 'author'

  const AUTHOR: Record<WorkflowStatus, WorkflowStatus[]> = {
    draft: ['draft', 'in_review'],
    changes_requested: ['changes_requested', 'in_review'],
    in_review: [], approved: [], published: [],
  }
  export function canTransition(role: StaffRole, from: WorkflowStatus, to: WorkflowStatus): boolean {
    if (role === 'admin' || role === 'editor') return true
    return AUTHOR[from].includes(to)
  }

  /** Tekshiruvga yuborishdan oldingi talablar (o'zbekcha xatolar) */
  export function getReviewProblems(doc: {
    title?: string | null; excerpt?: string | null; body?: unknown; coverImage?: unknown
    period?: unknown; categories?: unknown[] | null
  }): string[] {
    const p: string[] = []
    if (!doc.title?.trim()) p.push('Sarlavha yoʻq')
    if ((doc.excerpt ?? '').trim().length < 50) p.push('Qisqa tavsif kamida 50 belgi boʻlsin')
    const words = countWords(extractPlainText(doc.body))
    if (words < 150) p.push(`Matn juda qisqa (${words} soʻz, kamida 150)`)
    if (!doc.coverImage) p.push('Muqova rasmi tanlanmagan')
    if (!doc.period) p.push('Davr tanlanmagan')
    if (!doc.categories?.length) p.push('Kamida bitta kategoriya tanlang')
    if (collectSources(doc.body).length < 1) p.push('Kamida bitta «Manba» bloki qoʻshing')
    return p
  }
  ```
  Unit testlar: author `draft→in_review` ✅, `draft→published` ❌, `in_review→draft` ❌; editor hammasi ✅; bo'sh hujjat → 7 ta muammo.
- [ ] **V2-P4.S2.2** `src/hooks/enforcePostWorkflow.ts` (`beforeChange`, Posts):
  ```ts
  export const enforcePostWorkflow: CollectionBeforeChangeHook = ({ data, originalDoc, req, operation }) => {
    if (req.context?.skipWorkflow) return data
    const user = req.user
    if (!user) return data                    // server kodi (seed, cron) — ishonchli
    if (!isStaffUser(user)) throw new APIError('Ruxsat yoʻq', 403)

    const merged = { ...originalDoc, ...data }
    const from = (originalDoc?.workflowStatus ?? 'draft') as WorkflowStatus
    let to = (data.workflowStatus ?? from) as WorkflowStatus

    if (user.role === 'author' && data._status === 'published') {
      throw new APIError('Faqat muharrir chop eta oladi. «Tekshiruvga yuborish» tugmasini bosing.', 403)
    }
    if (!canTransition(user.role, from, to)) {
      throw new APIError(`Holatni «${from}» dan «${to}» ga oʻzgartirib boʻlmaydi`, 403)
    }
    if (operation === 'create' && user.role === 'author') data.author = user.id
    if (to === 'in_review' && from !== 'in_review') {
      if (req.locale && req.locale !== 'uz') throw new APIError('Tekshiruvga yuborishni Oʻzbekcha versiyada bajaring', 400)
      const problems = getReviewProblems(merged)
      if (problems.length) throw new APIError(`Yuborishdan oldin tuzating: ${problems.join('; ')}`, 400)
    }
    if (from === 'in_review' && to === 'changes_requested') {
      const before = originalDoc?.reviewNotes?.length ?? 0
      if ((data.reviewNotes?.length ?? 0) <= before) throw new APIError('Qaytarishdan oldin izoh yozing', 400)
    }
    if (data._status === 'published') {
      to = 'published'
      data.reviewedBy = user.id
      data.publishedAt = merged.publishedAt ?? new Date().toISOString()
    }
    data.workflowStatus = to
    return data
  }
  ```
- [ ] **V2-P4.S2.3** `reviewNotes` uchun `beforeChange`: yangi qatorlarga `by = req.user.id`, `at = now`.
- [ ] **V2-P4.S2.4** `src/hooks/preventAuthorPublish.ts` — tarixiy kolleksiyalar uchun: `hasRole(req.user,'author') && data._status === 'published'` → 403.

## V2-P4.S3 — Bildirishnomalar

- [ ] **V2-P4.S3.1** `src/emails/layout.ts` → `emailLayout({ title, bodyHtml, locale })`: inline style'li HTML. Fon `#f5efe3`, sarlavha Georgia serif, qizil `#8c2f1b` tugma, pastda "hisinf.uz".
- [ ] **V2-P4.S3.2** `src/hooks/notifyWorkflow.ts` (`afterChange`, Posts). `workflowStatus` o'zgarganda: `→ in_review` bo'lsa faol editor/admin'larga; `→ changes_requested` bo'lsa muallifga (oxirgi izoh bilan); `→ approved` va `→ published` bo'lsa muallifga. Hammasi `try/catch` ichida, `req.context.disableNotifications` bo'lsa yuborilmaydi.

## V2-P4.S4 — O'quvchi auth'ini Payload'ga ko'chirish

- [ ] **V2-P4.S4.1** **O'chiring:** `src/app/api/readers/login/route.ts`, `register/route.ts`, `me/route.ts`, `logout/route.ts` (va bo'sh qolgan papkalar). Ular Payload'ning `/api/readers/login`, `/api/readers/me`, `/api/readers/logout` endpoint'larini to'sib qo'yayotgan edi. O'chirilgach, Payload REST endpoint'lari ishlaydi.
- [ ] **V2-P4.S4.2** `src/lib/reader-auth.ts` va `src/lib/session.ts` ni o'chiring. O'rniga `src/lib/current-reader.ts`:
  ```ts
  import 'server-only'
  import { headers } from 'next/headers'
  import { getPayloadClient } from './payload'
  import { isReaderUser } from '@/access'

  /** FAQAT dinamik joylarda (server action, route handler, kabinet) chaqiring — sahifani dinamik qiladi */
  export async function getCurrentReader() {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: await headers() })
    return isReaderUser(user) ? user : null
  }
  ```
  `server-only` paketi o'rnatilmagan bo'lsa, `import 'server-only'` qatorini olib tashlang (`server-only` Next bilan keladi, tekshiring).
- [ ] **V2-P4.S4.3** `hisinf_reader_session` cookie'si endi ishlatilmaydi. Logout vaqtida uni ham o'chiring (`cookies().delete('hisinf_reader_session')`). Eski foydalanuvchilar bir marta qayta kiradi.
- [ ] **V2-P4.S4.4** **Email shablonlari** (`src/emails/verify.ts`, `src/emails/reset-password.ts`) — ikki tilda, `user.locale` bo'yicha:
  - verify havolasi: `${SERVER_URL}/${user.locale ?? 'uz'}/tasdiqlash?token=${token}`
  - reset havolasi: `${SERVER_URL}/${user.locale ?? 'uz'}/parolni-tiklash/yangi?token=${token}`
  `Readers.auth.verify.generateEmailHTML` va `forgotPassword.generateEmailHTML` ga ulang.
- [ ] **V2-P4.S4.5** **Muhim cheklov:** Payload barcha auth kolleksiyalari uchun bitta `payload-token` cookie'sini ishlatadi. Bitta brauzerda xodim va o'quvchi bir vaqtda kira olmaydi — oxirgi kirgan qoladi. Buni `docs/EDITOR_GUIDE.md` ga yozing.

## V2-P4.S5 — Himoya: Turnstile va rate limit

- [ ] **V2-P4.S5.1** `src/lib/turnstile.ts` va `src/lib/rate-limit.ts` — eski rejadagi `docs/plan/P10-oquvchilar.md` P10.S2.4–S2.5 kodi **aynan**. Limitlar: `register` 3/1 soat (IP), `login` 10/10 daqiqa (IP), `comment` 5/10 daqiqa (reader), `like` 60/1 daqiqa (reader), `contact` 3/1 soat (IP yoki reader), `subscribe` 3/1 soat (IP), `search` 60/1 daqiqa (IP), `track` 120/1 daqiqa (IP).
- [ ] **V2-P4.S5.2** Upstash env'lari bo'lmasa (lokal dev), `rate-limit.ts` "har doim ruxsat" qaytaruvchi stub ishlatadi va ogohlantirish yozadi. Turnstile kaliti bo'lmasa — dev'da tekshiruv o'tkazib yuboriladi, **prod'da** esa xato beriladi.
- [ ] **V2-P4.S5.3** Test muhiti uchun Cloudflare test kalitlari: site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`.

## V2-P4.S6 — Xodimlarni taklif qilish (invite)

- [ ] **V2-P4.S6.1** `Users` kolleksiyasiga endpoint:
  ```ts
  endpoints: [{
    path: '/invite',
    method: 'post',
    handler: async (req) => {
      if (!hasRole(req.user, 'admin')) return Response.json({ error: 'Ruxsat yoʻq' }, { status: 403 })
      const body = await req.json?.()
      const parsed = z.object({
        displayName: z.string().min(2).max(80),
        email: z.string().email(),
        role: z.enum(['editor', 'author']),
      }).safeParse(body)
      if (!parsed.success) return Response.json({ error: 'Maʼlumot notoʻgʻri' }, { status: 400 })
      const password = randomBytes(24).toString('base64url')   // hech kimga ko'rsatilmaydi
      const user = await req.payload.create({ collection: 'users', data: { ...parsed.data, password, isActive: true }, req })
      await req.payload.forgotPassword({ collection: 'users', data: { email: parsed.data.email }, req })
      return Response.json({ ok: true, id: user.id })
    },
  }],
  ```
  URL: `POST /api/users/invite`. `forgotPassword` emaili "Taklif" matni bilan yuboriladi. `Users.auth.forgotPassword.generateEmailHTML` da `user.lastLoginAt` yo'q bo'lsa (birinchi marta), "Sizni hisinf.uz tahririyatiga taklif qilishdi. Parol o'rnatish uchun…" matni chiqadi. `lastLoginAt` maydoni bo'lmasa, `afterLogin` hook bilan qo'shing.

## V2-P4.S7 — Draft va Live preview

- [ ] **V2-P4.S7.1** `src/app/(frontend)/next/preview/route.ts` va `exit-preview/route.ts` — eski rejadagi `docs/plan/P04-rollar-workflow.md` P4.S6.1–S6.2 bo'yicha (`PREVIEW_SECRET` + `payload.auth` → faqat xodim).
- [ ] **V2-P4.S7.2** Posts va Pages: `admin.livePreview.url` va `admin.preview` → `/next/preview?path=/${locale}/maqolalar/${slug}&previewSecret=…`. Breakpoints: 390×844, 768×1024, 1440×900.
- [ ] **V2-P4.S7.3** Sayt sahifalarida `draftMode().isEnabled` bo'lsa: `draft: true, overrideAccess: true` (`// overrideAccess: preview faqat xodimga yoqiladi`) va `<RefreshRouteOnSave />` (`@payloadcms/live-preview-react`). Tepada qora panel: "Qoralama koʻrinishi · Chiqish".

## V2-P4.S8 — Integratsion testlar (`tests/int/access.int.spec.ts`)

- [ ] **V2-P4.S8.1** Neon `test` branch'ida, Local API `overrideAccess: false, user` bilan:
  1. Mehmon faqat `published` postlarni oladi.
  2. Author A author B ning qoralamasini o'qiy olmaydi.
  3. Author `_status: 'published'` bilan saqlay olmaydi (403).
  4. To'liq bo'lmagan post `in_review` ga o'tmaydi (400, xato matnida "Manba" bor).
  5. To'liq post `in_review` ga o'tadi, keyin author uni tahrirlay olmaydi.
  6. Editor izoh bilan `changes_requested` qiladi → author yana tahrirlaydi.
  7. Editor chop etadi → `workflowStatus='published'`, `reviewedBy`, `publishedAt` to'ldirilgan.
  8. Mehmon va reader `users` ni o'qiy olmaydi; reader boshqa reader'ni o'qiy olmaydi.
  9. Reader o'z `isBanned` ini o'zgartira olmaydi.
  10. Mehmon `comments` dan faqat `approved` larni oladi; REST orqali `comments` yarata olmaydi.
  11. Author o'z `role` ini `admin` qila olmaydi.
  12. `GET /api/readers` (mehmon) javobida `email`, `phone`, `displayPassword` yo'q.

✅ **Qabul mezonlari:** 12 ta test yashil.

---

# V2-P5 — Tahririyat: Payload admin dizayn asosida

**Maqsad:** `/admin` ni `AdminSidebar`, `Admin Dashboard`, `Admin Muharrir` va `Admin Foydalanuvchilar` dizaynlariga yaqinlashtirish. Keyin o'zi yozilgan admin o'chiriladi.
**Asosiy tamoyil:** Payload'ning standart imkoniyatlari (ro'yxatlar, filtrlar, bulk edit, versiyalar, autosave, locale tanlash, Lexical'dagi `/` menyu va drag) **saqlanadi**. Biz ularni **bezaymiz** va dizayndagi yetishmayotgan qismlarni **custom komponent** sifatida qo'shamiz.
**Hujjat:** https://payloadcms.com/docs/custom-components/overview, https://payloadcms.com/docs/admin/react-hooks.

**Komponent yo'llari:** `importMap.baseDir = src`, shuning uchun yo'l `'/components/admin/X#X'` → `src/components/admin/X.tsx`. Har yangi komponentdan keyin `pnpm generate:importmap` ishga tushiriladi.
**Server va client:** admin komponentlari standart holatda server komponent. `useField`, `useAuth`, `useForm`, `useTheme` kerak bo'lsa, fayl boshida `'use client'`. Server komponentga beriladigan props turi — `payload` dagi `ServerProps` (ichida `payload`, `user`, `i18n`, `locale`, `searchParams` bor — o'rnatilgan versiyada tekshiring).

## V2-P5.S1 — Mavzu (ranglar, shriftlar)

- [ ] **V2-P5.S1.1** `src/app/(payload)/custom.css` ni to'liq yozing:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400..700;1,7..72,400&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

  :root {
    --font-body: 'IBM Plex Sans', system-ui, sans-serif;
    --font-serif: 'Literata', Georgia, serif;
    --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
    --style-radius-s: 6px;
    --style-radius-m: 8px;
    --style-radius-l: 10px;
  }

  html[data-theme='light'] {
    --hf-primary: #8c2f1b; --hf-primary-fg: #fff8ee; --hf-teal: #2f5d62; --hf-card: #fbf7ee; --hf-surface-2: #efe6d4;
    --hf-gold: #a07a3c; --hf-ornament: #b89a6a; --hf-line: #2b2118; --hf-border: #dccfb8;
    --theme-elevation-0: #f5efe3;   --theme-elevation-50: #ebe5d9;  --theme-elevation-100: #e1dacf;
    --theme-elevation-150: #d7d0c5; --theme-elevation-200: #cdc6ba; --theme-elevation-250: #c2bcb0;
    --theme-elevation-300: #b8b1a6; --theme-elevation-350: #aea79c; --theme-elevation-400: #a49d92;
    --theme-elevation-450: #9a9288; --theme-elevation-500: #90887e; --theme-elevation-550: #867e73;
    --theme-elevation-600: #7c7369; --theme-elevation-650: #72695f; --theme-elevation-700: #685f55;
    --theme-elevation-750: #5e544b; --theme-elevation-800: #534a41; --theme-elevation-850: #494036;
    --theme-elevation-900: #3f362c; --theme-elevation-950: #352b22; --theme-elevation-1000: #2b2118;
    --theme-border-color: #dccfb8;
    --theme-input-bg: #fbf7ee;
  }
  html[data-theme='dark'] {
    --hf-primary: #d9785c; --hf-primary-fg: #1a120c; --hf-teal: #6fb1b5; --hf-card: #1f1914; --hf-surface-2: #2a221b;
    --hf-gold: #cfae74; --hf-ornament: #7a6446; --hf-line: #ede4d3; --hf-border: #3a3027;
    --theme-elevation-0: #15110d;   --theme-elevation-50: #201c17;  --theme-elevation-100: #2b2621;
    --theme-elevation-150: #35312b; --theme-elevation-200: #403b35; --theme-elevation-250: #4b463e;
    --theme-elevation-300: #565048; --theme-elevation-350: #615b52; --theme-elevation-400: #6b655c;
    --theme-elevation-450: #767066; --theme-elevation-500: #817a70; --theme-elevation-550: #8c857a;
    --theme-elevation-600: #979084; --theme-elevation-650: #a19a8e; --theme-elevation-700: #aca598;
    --theme-elevation-750: #b7afa2; --theme-elevation-800: #c2baab; --theme-elevation-850: #cdc4b5;
    --theme-elevation-900: #d7cfbf; --theme-elevation-950: #e2d9c9; --theme-elevation-1000: #ede4d3;
    --theme-border-color: #3a3027;
    --theme-input-bg: #1f1914;
  }

  /* Asosiy tugma — muhr qizili */
  .btn--style-primary { background-color: var(--hf-primary) !important; color: var(--hf-primary-fg) !important; }
  .btn--style-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }

  /* Sidebar (nav) — dizayn: surface-2 fon */
  .nav { background: var(--hf-surface-2); border-right: 1px solid var(--hf-border); }
  .nav__link { border-radius: 6px; font-size: 13.5px; }
  .nav-group__toggle { font-family: var(--font-mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; }

  /* Sarlavhalar Literata'da */
  .doc-header__title, .list-header h1, .dashboard h1, .collection-list h1 { font-family: var(--font-serif); font-weight: 400; letter-spacing: -.02em; }

  /* Maqola sarlavhasi maydoni — dizayn: 46px Literata */
  .collection-edit--posts #field-title input { font: 500 40px/1.15 var(--font-serif); letter-spacing: -.02em; border: 0; background: transparent; padding-left: 0; }

  /* Lexical matni — dizayn: 18px/1.7 Literata */
  .rich-text-lexical .editor, .rich-text-lexical .ContentEditable__root { font-family: var(--font-serif); font-size: 18px; line-height: 1.7; }
  .rich-text-lexical h2 { font: 500 30px/1.25 var(--font-serif); }
  .rich-text-lexical h3 { font: 500 22px/1.3 var(--font-serif); }
  .rich-text-lexical blockquote { border-left: 2px solid var(--hf-primary); padding-left: 20px; font-style: italic; font-size: 21px; }
  ```
  **Muhim:** CSS selektorlari (`.nav`, `.nav__link`, `#field-title`, `.rich-text-lexical …`) o'rnatilgan versiyada boshqacha bo'lishi mumkin. DevTools'da haqiqiy klass nomlarini tekshiring va moslang. `!important` faqat zarur joylarda ishlatiladi.
- [ ] **V2-P5.S1.2** `payload.config.ts` → `admin.meta`: `titleSuffix: ' — hisinf.uz Tahririyat'`, `icons: [{ url: '/favicon.svg' }]`.

✅ **Qabul mezonlari:** `/admin` ikkala temada pergament / kutubxona ranglarida, sarlavhalar Literata'da, asosiy tugmalar qizil.

## V2-P5.S2 — Logo va ikonka

- [ ] **V2-P5.S2.1** `src/components/admin/AdminLogo.tsx` — login sahifasi uchun: `LogoMark` (52px) + "hisinf**.uz**" (Literata 600 32px) + "Tahririyat" (mono 10px uppercase tracking .14em). Faqat inline style yoki `custom.css` klasslari ishlatiladi (admin'da Tailwind yo'q).
- [ ] **V2-P5.S2.2** `src/components/admin/AdminIcon.tsx` — nav uchun kichik romb + H (30px, dizayn: AdminSidebar 15-qator).
- [ ] **V2-P5.S2.3** `admin.components.graphics = { Logo: '/components/admin/AdminLogo#AdminLogo', Icon: '/components/admin/AdminIcon#AdminIcon' }`.
- [ ] **V2-P5.S2.4** `public/favicon.svg` — romb + H (`#8c2f1b`), 32×32 viewBox.

## V2-P5.S3 — Sidebar ("Ish stoli" bloki)

Dizayn: `docs/design/AdminSidebar.dc.html`.

- [ ] **V2-P5.S3.1** Kolleksiya guruhlari (`admin.group`) — dizayn guruhlariga mos:
  - **Kontent:** Maqolalar, Sahifalar.
  - **Tarix:** Davrlar, Shaxslar, Voqealar, Joylar, Arxiv.
  - **Taksonomiya:** Kategoriyalar, Teglar, Hududlar.
  - **Media:** Media.
  - **Muloqot:** Izohlar, Murojaatlar, Obunachilar.
  - **Tizim:** Xodimlar, O'quvchilar, Statistika.
  - **Sozlamalar:** globallar.
- [ ] **V2-P5.S3.2** `src/components/admin/NavWorkdesk.tsx` (server komponent) → `admin.components.beforeNavLinks`. U "ISH STOLI" sarlavhasi (mono 10px uppercase) ostida 3 ta havola chiqaradi:
  1. **Boshqaruv paneli** → `/admin`.
  2. **Tekshiruv navbati** → `/admin/collections/posts?where[workflowStatus][equals]=in_review` + badge (`count` so'rovi; faqat editor/admin uchun).
  3. **Izohlar** → `/admin/collections/comments?where[status][equals]=pending` + badge (pending soni; faqat editor/admin).
  Muallif uchun buning o'rniga **Mening maqolalarim** → `/admin/collections/posts?where[author][equals]=<id>` va "Tuzatish kerak: N" badge'i chiqadi.
  Har havola oldida 7px romb (`border:1.3px solid var(--hf-ornament)`), joriy sahifada to'ldirilgan qizil. Badge: `font:500 10.5px var(--font-mono); padding:3px 6px; border-radius:999px; background:var(--hf-primary); color:var(--hf-primary-fg)`.
  Sonlarni olish: `payload.count({ collection: 'posts', where: {...}, overrideAccess: false, user })`.
- [ ] **V2-P5.S3.3** `src/components/admin/NavThemeToggle.tsx` (`'use client'`) — `useTheme()` (`@payloadcms/ui`) bilan yorug'/qorong'i almashtiruvchi 28px tugma (dizayn: AdminSidebar 20-qator). `beforeNavLinks` ga `NavWorkdesk` dan keyin qo'shiladi.
- [ ] **V2-P5.S3.4** (Ixtiyoriy) Nav pastidagi foydalanuvchi kartochkasi: `afterNavLinks` — avatar (initsiallar), ism va rol (mono 10px, teal).

✅ **Qabul mezonlari:** sidebar dizayndagi tuzilmaga o'xshaydi, badge'lardagi sonlar to'g'ri, muallif boshqa havolalarni ko'radi.

## V2-P5.S4 — Boshqaruv paneli (Dashboard)

Dizayn: `docs/design/Admin Dashboard.dc.html`. Payload'ning standart kolleksiya kartochkalari pastda "Tezkor havolalar" sifatida qoladi. Dizayndagi bloklar `beforeDashboard` ga qo'shiladi.

- [ ] **V2-P5.S4.1** **Statistika endpoint'i** — `payload.config.ts` → root `endpoints`:
  ```ts
  endpoints: [{
    path: '/admin-stats',
    method: 'get',
    handler: async (req) => {
      if (!hasRole(req.user, 'admin', 'editor')) return Response.json({ error: 'forbidden' }, { status: 403 })
      const range = Number(new URL(req.url!).searchParams.get('range') ?? 30) // 7 | 30 | 365
      return Response.json(await getAdminStats(req.payload, range))
    },
  }],
  ```
  URL: `GET /api/admin-stats?range=30`.
- [ ] **V2-P5.S4.2** `src/lib/admin-stats.ts` → `getAdminStats(payload, range)`:
  ```ts
  type AdminStats = {
    reads: { value: number; deltaPct: number }          // daily-stats yig'indisi, oldingi davrga nisbatan %
    published: { value: number; delta: number }         // shu davrda publishedAt bo'lgan postlar
    newComments: { value: number; deltaPct: number }
    newReaders: { value: number; deltaPct: number }
    bars: { label: string; uz: number; kaa: number }[]  // 14 ta ustun (range/14 kunlik bo'laklar)
    byPeriod: { name: string; color: string; count: number }[] // eng ko'p 6 davr (chop etilgan postlar)
    queue: { id: number; title: string; author: string; updatedAt: string; status: string }[] // in_review + changes_requested, eng eskisi birinchi, 6 ta
    moderation: { id: number; name: string; postTitle: string; body: string; flagged: boolean }[] // pending, 5 ta
    queueCount: number; moderationCount: number
  }
  ```
  `daily-stats` dan yig'ish uchun `payload.find({ collection: 'daily-stats', where: { day: { greater_than_equal: from } }, limit: 10000, depth: 0, pagination: false })` va JS'da guruhlash (kichik sayt uchun yetarli). Kunlar `Asia/Tashkent` bo'yicha hisoblanadi (`src/lib/today.ts`).
- [ ] **V2-P5.S4.3** `src/components/admin/Dashboard.tsx` (`'use client'`) → `admin.components.beforeDashboard`. Tuzilma (dizayn qatorlari bo'yicha):
  1. **Yuqori qator** (17–21): breadcrumb "Ish stoli / Boshqaruv paneli", o'ngda pulslanuvchi teal nuqta (`animation: hf-pulse 2s infinite` — keyframe'ni `custom.css` ga qo'shing) va "Sayt ishlayapti", qizil "+ Yangi maqola" tugmasi → `/admin/collections/posts/create`.
  2. **Salomlashish** (24): mono uppercase sana ("Payshanba, 9-oktabr") va Literata 42px "Xayrli kun, {ism}" (soatga qarab: 5–11 "Xayrli tong", 11–17 "Xayrli kun", 17–23 "Xayrli kech", aks holda "Xayrli tun"). O'ngda segmentli range tanlagich: `7 kun | 30 kun | 1 yil`.
  3. **4 ta stat kartochka** (29–36): `grid 4 ustun`, `bg card, border, radius 10px, padding 20px`. Yorliq 13px muted, qiymat Literata 38px, delta mono 12px (↑ teal, ↓ primary). Qiymat formati: ≥1000 → `48.2K`.
  4. **"Oʻqishlar" grafigi** (39–50): 14 ta ustun, har biri ikki qismli (pastda UZ — primary, tepada KAA — teal), balandligi maksimumga nisbatan %, `animation: hf-grow .8s` (`transform-origin: bottom`) va 40ms qadamli kechikish. `title` atributida "N oʻqish". Ostida o'q yorliqlari (birinchi va oxirgi sana). Legenda: ■ UZ ■ KAA.
  5. **"Davrlar boʻyicha"** (51–56): 6 qator: nom, soni (mono) va 6px balandlikdagi bar (davr rangida, kenglik = max'ga nisbatan %).
  6. **"Tekshiruv navbati"** (59–67): sarlavha va qizil badge (`queueCount`), 4–6 qator: sarlavha (ellipsis), "muallif · qachon" (mono 12px), status pill (`in_review` "Yangi" primary, `changes_requested` "Tuzatishda" gold). Qator bosilsa post tahririga o'tadi.
  7. **"Izohlar moderatsiyasi"** (68–83): "N kutmoqda", har izoh: ism → maqola, matn (Literata 15px), "✓ Tasdiqlash" (teal) va "Rad etish" tugmalari. Bosilganda `fetch('/api/comments/' + id, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'approved' | 'rejected' }) })`. Natijada qator xiralashadi (`opacity .55`) va "✓ Chop etildi" / "✕ Rad etildi" yozuvi chiqadi. `flagged` izohda kichik "⚑ shubhali" belgisi bo'ladi.
  Ma'lumot: `useEffect` → `fetch('/api/admin-stats?range=' + range, { credentials: 'include' })`. Yuklanayotganda skelet ko'rinadi. **Muallif uchun** (403 qaytsa) faqat 1–2 qatorlar va "Mening maqolalarim" ro'yxati chiqadi (`/api/posts?where[author][equals]=…`).
  Stillar: admin'da Tailwind yo'q, shuning uchun `src/components/admin/dashboard.module.css` (CSS Modules) yoki inline style ishlatiladi. Ranglar `var(--hf-*)` va `var(--theme-elevation-*)` orqali beriladi.
- [ ] **V2-P5.S4.4** Standart kolleksiya kartochkalari ustiga "Tezkor havolalar" sarlavhasi qo'shing (CSS `::before` yoki `afterDashboard` komponenti).

✅ **Qabul mezonlari:** seed ma'lumotlari bilan dashboard dizaynga o'xshaydi. Range almashtirilganda sonlar o'zgaradi. Izohni tasdiqlash ishlaydi va saytda paydo bo'ladi.

## V2-P5.S5 — Lexical muharriri (bloklar)

Dizayn: `docs/design/Admin Muharrir.dc.html` (`TYPES` massivi — 10 ta blok turi).

- [ ] **V2-P5.S5.1** `src/editor/config.ts`:
  ```ts
  import {
    lexicalEditor, FixedToolbarFeature, HeadingFeature, BlocksFeature, UploadFeature,
    EXPERIMENTAL_TableFeature, LinkFeature, HorizontalRuleFeature,
  } from '@payloadcms/richtext-lexical'
  import { postBlocks, inlineBlocks } from '@/blocks'

  export const postEditor = lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((f) => !['heading', 'upload', 'link', 'horizontalRule'].includes(f.key)),
      FixedToolbarFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
      LinkFeature({ enabledCollections: ['posts', 'persons', 'events', 'places', 'pages', 'archive-items'] }),
      UploadFeature({
        collections: {
          media: {
            fields: [
              { name: 'caption', type: 'text', label: 'Rasm izohi va manbasi' },
              { name: 'size', type: 'select', defaultValue: 'wide', options: [
                { label: 'Matn kengligida', value: 'normal' }, { label: 'Keng', value: 'wide' }, { label: 'Toʻliq', value: 'full' } ] },
            ],
          },
        },
      }),
      HorizontalRuleFeature(),          // dizayndagi «Ajratgich» (◆)
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
  ```
  `f.key` qiymatlarini `console.log(defaultFeatures.map(f => f.key))` bilan tekshiring. `payload.config.ts` → `editor: postEditor`. Posts `body` → `postEditor`. Persons/Events/Pages → `simpleEditor`.
- [ ] **V2-P5.S5.2** Bloklar (`src/blocks/*.ts`, har birida `interfaceName` va o'zbekcha `labels`). `/` menyusida dizayndagi tartibda chiqadi:
  | Dizayn | Payload | Fayl | Maydonlar |
  |--------|---------|------|-----------|
  | ¶ Matn | paragraph (standart) | — | — |
  | H2 / H3 | HeadingFeature | — | — |
  | “ Iqtibos | **QuoteBlock** (standart blockquote'dan boy) | `Quote.ts` (`slug:'quote'`) | `text` (textarea, req), `source` (text — "«Qizil Qoraqalpogʻiston», 1925-yil, 3-son") |
  | ¹ Izoh (footnote) | **inline block** | `Footnote.ts` (`slug:'footnote'`) | `text` (textarea, req), `sourceUrl` (text) |
  | § Manba | **block** | `Source.ts` (`slug:'source'`) | `type` (book/article/archive/website/interview/newspaper/other), `title` (req), `author`, `year`, `publisher`, `pages`, `archiveRef` ("fond R-25, roʻyxat 1, ish 162"), `url`, `accessedAt` |
  | • Ro'yxat | list (standart) | — | — |
  | ▣ Rasm | UploadFeature | — | caption, size |
  | ▦ Galereya | **GalleryBlock** | `Gallery.ts` | `images` (upload hasMany, min 2, max 20), `layout` (grid/carousel), `caption` |
  | ◆ Ajratgich | HorizontalRuleFeature | — | — |
  | qo'shimcha | Callout ("Bilasizmi?"), DocumentEmbed (PDF), YouTube, PersonCard, EventsTimeline, MapEmbed, ArchiveItemEmbed | eski reja `docs/plan/P05-editor.md` P5.S2.3–S2.10 bo'yicha | |
  `src/blocks/index.ts`: `export const postBlocks = [QuoteBlock, SourceBlock, GalleryBlock, CalloutBlock, DocumentEmbedBlock, YouTubeBlock, PersonCardBlock, EventsTimelineBlock, MapEmbedBlock, ArchiveItemBlock]`, `export const inlineBlocks = [FootnoteBlock]`.
- [ ] **V2-P5.S5.3** **Manba qoidasi (D6):** `Source` bloki saytda **joyida ko'rinmaydi**. Maqola oxiridagi "Manbalar" qutisiga tartib raqami bilan yig'iladi (P6). Admin'da blok kartochka sifatida "MANBA · {title}" ko'rinishida chiqadi (dizayn: `pre: 'MANBA'`, teal). Buning uchun `admin.components.Label` yoki blokning `labels` dan foydalaning.
- [ ] **V2-P5.S5.4** `pnpm generate:types && pnpm generate:importmap`. Admin'da `/` bosilganda bloklar ro'yxati chiqadi, `+` va `⋮⋮` (drag) ishlaydi.

✅ **Qabul mezonlari:** barcha blok turlari qo'shiladi, saqlanadi va qayta ochilganda joyida turadi.

## V2-P5.S6 — Maqola tahriri ekrani (dizayn: Admin Muharrir)

- [ ] **V2-P5.S6.1** **So'zlar soni** — `src/components/admin/WordCountField.tsx` (`'use client'`, `ui` maydon, sidebar'ning eng tepasida): `useFormFields(([fields]) => fields.body?.value)` → `extractPlainText` → "1 240 soʻz · 7 daq" (mono 12px muted). Har 500ms dan ko'p bo'lmagan tezlikda yangilanadi (debounce).
- [ ] **V2-P5.S6.2** **Workflow vaqt chizig'i** — `src/components/admin/WorkflowTimelineField.tsx` (`ui` maydon, sidebar). Dizayn qatorlari 93–101: 4 qadam (Qoralama → Tekshiruvda → Tasdiqlandi → Chop etildi). Har qadamda 12px doira (o'tgan: to'ldirilgan teal, joriy: `bg` fonli teal chegara, kelajak: ornament chegara) va vertikal chiziq. Ostida kim va qachon: muallif ismi · `createdAt`, muharrir ismi (`reviewedBy`), "hisinf.uz/maqola" (chop etilgan bo'lsa havola). `changes_requested` holatida 2-qadam qizil bo'ladi va ostida "Tuzatish kerak: <oxirgi izoh>" yoziladi.
- [ ] **V2-P5.S6.3** **Tarjima holati** — `src/components/admin/TranslationStatusField.tsx` (`ui`, `body` tepasida). Dizayn 29–33: ikkita pill "OʻZBEKCHA · asl" va "QARAQALPAQSHA · 64%". Foiz: kaa `body` dagi bo'sh bo'lmagan bloklar soni / uz'dagi soni. Ikkala til ma'lumotini olish uchun `fetch('/api/posts/' + id + '?locale=all&depth=0&draft=true', { credentials: 'include' })` ishlatiladi. Pill bosilsa locale almashadi: `router.push('?locale=kaa')` (Payload locale query parametri) yoki `useLocale`/`LocaleSelector` mantig'idan foydalaning. Joriy locale `bg fg` bilan to'ldiriladi.
- [ ] **V2-P5.S6.4** **Davr chip'lari** — `src/components/admin/PeriodChipsField.tsx` (`'use client'`), `period` maydoniga `admin.components.Field` sifatida ulanadi. Dizayn 104–108: davrlar ro'yxati (`/api/periods?sort=order&limit=50&depth=0`) 6px romb (davr rangida) va qisqa nom bilan pill bo'lib chiqadi. Tanlangani `border fg + bg card`. `useField<number | null>({ path })` → `setValue(id)`. Label: "DAVR" (mono 10px uppercase).
- [ ] **V2-P5.S6.5** **Muharrir uchun izoh** — `noteToEditor` maydoni sidebar'da kartochka ko'rinishida (dizayn 113–116): `admin.position: 'sidebar'`, `admin.placeholder: 'Masalan: 2-manbani tekshirib bering'`.
- [ ] **V2-P5.S6.6** **Harakat tugmalari** — `src/components/admin/WorkflowPublishButton.tsx` (`'use client'`) → Posts `admin.components.edit.PublishButton`. Mantiq:
  | Rol | Holat | Ko'rinadigan tugma | Bosilganda |
  |-----|-------|--------------------|------------|
  | author | draft / changes_requested | **Tekshiruvga yuborish** | `workflowStatus = 'in_review'` + qoralamani saqlash |
  | author | in_review / approved / published | "Tekshiruvda…" (disabled) | — |
  | editor/admin | in_review | **Tasdiqlash** + ikkinchi tugma **Qaytarish** | `approved` + saqlash / `changes_requested` (izoh talab qilinadi) |
  | editor/admin | approved | **Chop etish** | Payload'ning standart `PublishButton` i (`_status: 'published'`) |
  | editor/admin | published | **Yangilash** | standart `PublishButton` |
  | editor/admin | draft | **Chop etish** (to'g'ridan-to'g'ri) | standart `PublishButton` |
  Qoralamani saqlash mantig'ini Payload'ning `SaveDraftButton` manbasidan oling: `node_modules/@payloadcms/ui/dist/elements/SaveDraftButton/index.js` (`useForm().submit({ overrides: { _status: 'draft' }, skipValidation: true, … })`). Maydon qiymatini o'rnatish: `useField({ path: 'workflowStatus' }).setValue(...)`. Natija `toast.success('Muharrir tekshiruviga yuborildi')` (`import { toast } from '@payloadcms/ui'`). Server xatosi (400/403) bo'lsa, matni `toast.error` da ko'rsatiladi.
  Ulash: `admin: { components: { edit: { PublishButton: '/components/admin/WorkflowPublishButton#WorkflowPublishButton' } } }`.
  **Agar API mos kelmasa:** tugmani olib tashlang, `workflowStatus` select'ini sidebar'da qoldiring (server hook baribir himoya qiladi) va `docs/BLOCKERS.md` ga yozing.
- [ ] **V2-P5.S6.7** **Word/PDF import (D4)** — `src/components/admin/ImportDocumentField.tsx` (`ui`, `body` dan oldin). Tugma "📄 Word/PDF'dan import" modal ochadi. Modal ichida fayl tanlash (`.docx`, `.pdf`, `.txt`, ≤10 MB) va "Almashtirish / Oxiriga qo'shish" tanlovi bor.
  Server: root endpoint `POST /api/import-document` (multipart, faqat xodim):
  ```ts
  // .docx → HTML (mammoth.convertToHtml) → Lexical (convertHTMLToLexical)
  import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
  import { JSDOM } from 'jsdom'
  const editorConfig = await editorConfigFactory.fromEditor({ config: req.payload.config, editor: postEditor })
  const lexical = convertHTMLToLexical({ editorConfig, html, JSDOM })
  // .pdf / .txt → matn → textToLexical (scripts/v2/02 dagi funksiya src/lib/text-to-lexical.ts ga ko'chiriladi)
  ```
  `editorConfigFactory` metod nomini (`fromEditor` / `default`) o'rnatilgan versiyaning `index.d.ts` faylidan tekshiring. `jsdom` hozir devDependency, uni **dependencies** ga ko'chiring.
  Client: javobdagi Lexical JSON `useField({ path: 'body' }).setValue(...)` bilan qo'yiladi (almashtirish yoki `root.children` ni birlashtirish). Muvaffaqiyatda "Import qilindi: N paragraf" toast chiqadi. Word izohlari (footnote) oddiy matn bo'lib keladi — muallif ularni qo'lda "Izoh" blokiga aylantiradi (toast'da eslatma).
  Eski `src/app/api/parse-document/route.ts` o'chiriladi (mantiq endpoint'ga ko'chdi).
- [ ] **V2-P5.S6.8** **Versiyalar** — Payload'ning standart "Versions" tab'i (dizayn 119–129 ga mos). Qo'shimcha ish yo'q. `maxPerDoc: 30` va autosave ishlashini tekshiring.

✅ **Qabul mezonlari:** muallif yozadi → "Tekshiruvga yuborish" → editor "Tasdiqlash" → "Chop etish" sikli toast'lar bilan ishlaydi. Vaqt chizig'i holatni ko'rsatadi. Word fayl import qilinadi.

## V2-P5.S7 — Foydalanuvchilar ekrani (dizayn: Admin Foydalanuvchilar)

- [ ] **V2-P5.S7.1** `src/components/admin/UsersListHeader.tsx` (`'use client'`) → Users `admin.components.beforeListTable`:
  - **Rol tab'lari** (dizayn 24–26): `Barchasi · Admin · Muharrir · Muallif` va har birining soni (`/api/users?where[role][equals]=…&limit=0` → `totalDocs`). Tab bosilganda `router.push('?where[role][equals]=editor')`.
  - Izoh matni (dizayn 20): "Rollar: Admin — hammasi, Muharrir — tekshiruv va chop etish, Muallif — qoralama yozish."
  - **"+ Foydalanuvchi qo'shish"** (faqat admin) → modal (dizayn 52–66): ism-familiya, pochta, rol kartochkalari (Muharrir "Tekshiradi va chop etadi", Muallif "Qoralama yozadi"), "Bekor qilish" va "Taklif yuborish". `POST /api/users/invite` (P4.S6). Muvaffaqiyatda toast chiqadi va ro'yxat yangilanadi (`router.refresh()`).
- [ ] **V2-P5.S7.2** **Ustun komponentlari** (`admin.components.Cell`):
  - `displayName` → `UserCell`: avatar (initsiallar, `avatarColor(id)`) va ism (500 14.5px).
  - `role` → `RoleCell`: rangli matn (Admin primary, Muharrir teal, Muallif indigo).
  - `isActive` → `StatusCell`: 7px nuqta + "Faol" (ornament) yoki "Bloklangan" (primary).
- [ ] **V2-P5.S7.3** **Bloklash:** Payload'ning bulk "Edit" funksiyasi → `isActive = false`. EDITOR_GUIDE'ga yozing.
- [ ] **V2-P5.S7.4** **O'quvchilar** (`readers`) ro'yxati uchun ham xuddi shunday sarlavha qo'shiladi (tab'lar: Barchasi · Tasdiqlangan · Tasdiqlanmagan · Bloklangan). Bloklash `isBanned` orqali.

✅ **Qabul mezonlari:** admin taklif yuboradi → email keladi → yangi xodim parol o'rnatib kiradi.

## V2-P5.S8 — Izohlar va murojaatlar

- [ ] **V2-P5.S8.1** `src/components/admin/CommentsListHeader.tsx` → Comments `beforeListTable`: status tab'lari (Kutilmoqda N · Tasdiqlangan · Rad etilgan · Spam · ⚑ Shubhali). Standart: ro'yxat `?where[status][equals]=pending` bilan ochiladi. Nav'dagi havola ham shunday.
- [ ] **V2-P5.S8.2** `StatusCell` (comments): pill — pending (gold, uzuq-uzuq chegara), approved (teal), rejected (primary), spam (muted).
- [ ] **V2-P5.S8.3** **Xodim javobi:** Comments edit ekranida `src/components/admin/StaffReplyField.tsx` (`ui`) — textarea va "Javob yozish" tugmasi. U `POST /api/comments` (`credentials: 'include'`) ga `{ context, post, parent: <joriy izoh id>, body }` yuboradi. Server hook xodim javobini avtomatik `approved` qiladi.
- [ ] **V2-P5.S8.4** Inquiries ro'yxati: tab'lar `Aloqa · Mualliflik arizalari` (`type`) va status. Edit ekranida `reply` maydoni katta textarea. Saqlanganda email ketadi (P3.S8.3). Mualliflik arizasida "Xodim qilib taklif qilish" tugmasi (`ui`) invite modalini ism va email bilan to'ldirilgan holda ochadi.

✅ **Qabul mezonlari:** izohni tasdiqlash yoki rad etish va xodim javobi saytda "Muharrir" belgisi bilan chiqishi ishlaydi.

## V2-P5.S9 — Eski admin'ni o'chirish

- [ ] **V2-P5.S9.1** Quyidagilarni **o'qib**, kerakli mantiq ko'chirilganiga ishonch hosil qiling, keyin o'chiring:
  - `src/app/(frontend)/[locale]/admin/` (1875 qator)
  - `src/app/(frontend)/[locale]/admin-post-yaratish/`
  - `src/app/api/admin/` (comments, inquiries, posts, upload, users)
  - `src/app/api/posts/create/`
  - `src/app/api/parse-document/` (P5.S6.7 ga ko'chdi)
  - `scripts/ensureAdminReader.ts`, `src/seed/runAdminSeed.ts`, `src/seed/seedAdmin.ts` (P3.S13 seed'i bilan almashtirildi)
- [ ] **V2-P5.S9.2** `next.config.ts` → `redirects()`: `/:locale(uz|kaa)/admin` → `/admin` (308). `/:locale/admin-post-yaratish` → `/admin/collections/posts/create`.
- [ ] **V2-P5.S9.3** `grep -rn "api/admin\|reader-auth\|hisinf_reader_session\|displayPassword" src` — bo'sh natija berishi kerak (eskirgan maydon ta'riflaridan tashqari).

✅ **Qabul mezonlari:** o'chirilgan yo'llar 404 yoki redirect qaytaradi. `pnpm build` o'tadi. Kontent faqat `/admin` orqali boshqariladi.

## V2-P5.S10 — Qo'llanmalar

- [ ] **V2-P5.S10.1** `docs/AUTHOR_GUIDE.md` (o'quvchi-mualliflar uchun, sodda tilda, skrinshotlar bilan): kirish → yangi maqola → sarlavha va qisqa tavsif → matn (`/` menyusi: Sarlavha, Iqtibos, Izoh, Manba, Rasm, Galereya, Ajratgich) → Word'dan import → davr va kategoriya → qoraqalpoqcha versiya → Preview → "Tekshiruvga yuborish" → muharrir izohlarini o'qish → manba va rasm litsenziyasi qoidalari.
- [ ] **V2-P5.S10.2** `docs/EDITOR_GUIDE.md`: dashboard, tekshiruv navbati, tasdiqlash / qaytarish / chop etish, izohlar moderatsiyasi, javob yozish, murojaatlar, xodim taklif qilish, bloklash, "bitta brauzerda ikki akkaunt" cheklovi.

---

# V2-P6 — Ommaviy sayt (dizayn asosida)

**Maqsad:** `docs/design/` dagi har bir sahifani piksel darajasida yaqin qilib, haqiqiy ma'lumot bilan qurish.
**Tartib:** S1 (ma'lumot qatlami) → S2 (header/footer) → S3… Har sahifa tugagach, uni dizayn fayli bilan **yonma-yon** solishtiring: brauzerda `docs/design/<Sahifa>.dc.html` ni oching. Dizayn vositasi bo'lmasa, HTML va inline stillarni o'qing.

**Har sahifa uchun umumiy talablar (har safar tekshiriladi):**
1. Matnlar `messages/*.json` dan olinadi (6-bo'lim).
2. Ma'lumot `src/lib/queries/*` orqali olinadi, `overrideAccess: false`.
3. `generateMetadata` (P8.S2).
4. Mobil (390), planshet (768) va desktop (1440) ko'rinishlari, ikkala tema va ikkala til.
5. Bo'sh holat: ma'lumot bo'lmasa, bo'lim yashiriladi yoki `EmptyState` ko'rsatiladi.
6. `setRequestLocale(locale)` har `page.tsx` va `layout.tsx` boshida chaqiriladi.

## V2-P6.S1 — Ma'lumot qatlami va kesh

- [ ] **V2-P6.S1.1** `src/lib/queries/` fayllari (har biri `import 'server-only'`):
  - `posts.ts`: `getPosts({ locale, page, limit, q, category, period, sort })`, `getPostBySlug(slug, locale, { draft })`, `getAdjacentPosts(post, locale)`, `getRelatedPosts(post, locale, 3)`, `getPostsStats()` → `{ total, authors }`.
  - `periods.ts`: `getPeriods(locale)` (sort `order`, `posts`/`persons` join'lari bo'yicha sonlar bilan).
  - `events.ts`: `getEventsByPeriod(periodId, locale)`, `getOnThisDay(locale)`.
  - `persons.ts`: `getPersons(locale)`, `getPersonBySlug`.
  - `archive.ts`: `getArchiveItems({ kind, locale })`, `getArchiveCounts()`, `getArchiveItemBySlug`.
  - `places.ts`: `getPlaces(locale)`, `getPlaceBySlug`.
  - `comments.ts`: `getApprovedComments({ context, postId })` → daraxt (`replies` bilan). Qaytariladigan maydonlar: `id, authorName, body, createdAt, likesCount, parent, isStaff`. Reader ID va email **qaytarilmaydi**.
  - `globals.ts`: `getHeader`, `getFooter`, `getSiteSettings`, `getHomePage` (locale bilan).
  - `authors.ts`: `getAuthorPublic(idOrSlug)` → faqat `displayName, slug, avatar, bio` (`overrideAccess: true` + `select` — **izoh bilan**).
- [ ] **V2-P6.S1.2** Standart parametrlar: `locale`, `fallbackLocale: 'uz'`, `overrideAccess: false`. Ro'yxatlarda `select` bilan **faqat kerakli maydonlar** olinadi (`body` olinmaydi!), `depth: 1`.
- [ ] **V2-P6.S1.3** **Kesh:** barcha sahifalardagi `export const dynamic = 'force-dynamic'` va `revalidate = 0` **olib tashlanadi**. O'rniga:
  - Kontent sahifalari: `export const revalidate = 3600`.
  - Slug'li sahifalar: `generateStaticParams` → `[]` (birinchi so'rovda render bo'lib keshlanadi).
  - `searchParams` ishlatadigan sahifalar (maqolalar, qidiruv, arxiv filtri) dinamik qoladi — bu normal.
  - **Kontent sahifalarida `headers()`, `cookies()` va `payload.auth()` chaqirilmaydi.** O'quvchiga xos qismlar (saqlash, like, izoh formasi, header'dagi akkaunt) client komponent sifatida mount bo'lgandan keyin `/api/readers/me` yoki server action orqali yuklanadi.
- [ ] **V2-P6.S1.4** `src/hooks/revalidateSite.ts` — eski rejadagi `docs/plan/P07-sayt-sahifalari.md` P7.S1.6 bo'yicha (`revalidatePath('/[locale]', 'layout')`, `req.context.disableRevalidate` tekshiruvi, `try/catch`). Barcha ommaviy kolleksiya va globallarga ulanadi.
- [ ] **V2-P6.S1.5** `src/lib/has-translation.ts` — kaa'da tarjima bormi (eski reja P2.S1.4). Maqola, shaxs, voqea sahifalarida ishlatiladi.

✅ **Qabul mezonlari:** prod'da maqola sahifasining ikkinchi so'rovida `x-vercel-cache: HIT`. Admin'da chop etilgan o'zgarish 5 soniya ichida saytda ko'rinadi.

## V2-P6.S2 — Layout: Header, Footer, mobil menyu, ⌘K

### Header (dizayn: `SiteHeader.dc.html`)
- [ ] **V2-P6.S2.1** `src/components/layout/SiteHeader.tsx` (server) → `getHeader`, `getSiteSettings` va client qismlarni chaqiradi. Tuzilma:
  1. **Yuqori satr** (16–23; `md` dan kichikda yashiriladi): `flex justify-between px-12 py-[7px] border-b border-border font-mono text-[11px] font-medium uppercase tracking-[.08em] text-muted`. Chapda `siteSettings.tagline`. O'ngda bugungi sana (`formatDate(today, locale)` → "9-oktabr, 2026"), 4px `bg-ornament rotate-45` romb va `siteSettings.editionLabel`.
  2. **Asosiy satr** (24–59): `flex items-center gap-8 px-4 md:px-8 lg:px-12 py-[18px]`.
     - Logo (`<Link href="/">`, `text-fg`).
     - Nav (`lg` dan kattada): `flex-1 flex justify-center gap-1`. Element: `relative px-3.5 py-2.5 text-[14.5px] font-medium text-fg rounded-[2px] hover:bg-surface-2 hover:text-fg`. **Faol** elementda pastki chiziq: `absolute left-3.5 right-3.5 bottom-[3px] h-0.5 bg-primary animate-hf-ink`. Faollik `usePathname()` bilan aniqlanadi (`NavLinks` client komponenti).
     - **Submenu** (D13): `children` bor elementlar `@radix-ui/react-navigation-menu` bilan ochiladi. Panel: `bg-card border border-line shadow-offset p-2 min-w-[280px]`, ichidagi element `block px-3 py-2.5` → label (Literata 17px) va description (13px muted). Hover va klik bilan ochiladi, `Esc` bilan yopiladi.
     - O'ng blok: `IconCircleButton` qidiruv (lupa: CSS doira + dum, dizayn 48-qator) → `/qidiruv`. **⌘K** ham ochadi (S2.6). `LangToggle` (S2.3), `ThemeToggle` (P2.S3), `AccountButton` (S2.4).
  3. Header `relative z-20 border-b border-line bg-bg`. Sticky **emas** (dizaynda statik). Faqat maqolalar sahifasidagi filtr paneli sticky bo'ladi.
- [ ] **V2-P6.S2.2** **Mobil (<1024):** logo · (o'ngda) qidiruv · burger (`IconCircleButton`, uch chiziq). Burger → `Sheet` (o'ngdan, `w-[min(88vw,380px)] bg-paper`): nav elementlari `font-serif text-[28px] py-3 border-b border-border` (submenu — ichma-ich ro'yxat, 17px). Pastda `LangToggle`, `ThemeToggle` va to'liq kenglikdagi "Kirish" pill. Havola bosilganda sheet yopiladi.
- [ ] **V2-P6.S2.3** `LangToggle.tsx` (`'use client'`, dizayn 50–53): `flex border border-border rounded-full p-[3px] font-mono text-[11.5px] font-medium`. Ikkita tugma "UZ" / "KAA": faoli `bg-fg text-bg`, nofaoli `bg-transparent text-muted`, `px-[11px] py-2 rounded-full transition-all duration-250`. Bosilganda `router.replace(pathname, { locale })`, query saqlanadi (eski reja P2.S5). `aria-pressed`. Mavjud `src/components/LanguageSwitcher.tsx` va `src/components/layout/LanguageSwitcher.tsx` o'chiriladi.
- [ ] **V2-P6.S2.4** `AccountButton.tsx` (`'use client'`): mount'da `fetch('/api/readers/me', { credentials: 'include' })`.
  - Kirmagan: `Pill variant="dark" size="md"` "Kirish →" → `/kirish?qaytish=<joriy yo'l>`.
  - Kirgan: `Avatar` (34px) + `DropdownMenu`: "Kabinet", "Saqlanganlar", "Chiqish" (`POST /api/readers/logout` → `router.refresh()`).
  - Xodim (`user.collection === 'users'`) bo'lsa: "Tahririyat" → `/admin`.
- [ ] **V2-P6.S2.5** Skip link: "Asosiy kontentga oʻtish" (`sr-only focus:not-sr-only`) → `#main`.

### Footer (dizayn: `SiteFooter.dc.html`)
- [ ] **V2-P6.S2.6** `SiteFooter.tsx` (server): `bg-fg text-bg px-4 md:px-12 pt-[72px] pb-7 relative overflow-hidden font-sans`.
  1. `DiamondDivider` (mb-14).
  2. Grid: desktop `grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,1fr))_minmax(0,1.4fr)] gap-12`, planshet 2 ustun, mobil 1 ustun.
     - Ustun 1: "hisinf**.uz**" (Literata 600 40px, `.uz` primary) va `footer.about` (Literata 17px/1.55, opacity .82, `max-w-[34ch]`).
     - Ustun 2–3: sarlavha (mono 11px uppercase tracking .14em opacity .55) va havolalar (14.5px, opacity .85, hover'da opacity 1 va `translate-x-1`). Havolalar `footer.columns` dan `resolveLink` bilan quriladi. Havola rangi `text-bg hover:text-bg` (global `a` rangini bekor qiladi).
     - Ustun 4: `digestTitle`, `digestText` (14.5px opacity .8), `SubscribeForm` (P7.S6 — pastki chiziqli input + qizil "Obuna →" pill) va Telegram havolasi (28px doira ichida "TG" + `telegramHandle`).
  3. Pastki satr: `mt-16 pt-5 border-t border-[rgba(127,127,127,.35)] font-mono text-[12px] opacity-60 flex justify-between flex-wrap gap-4` → "© {yil} hisinf.uz — {rights}" va `footer.note`.
- [ ] **V2-P6.S2.7** Eski `src/components/Header.tsx`, `Footer.tsx`, `HeaderSearch.tsx` o'chiriladi (qidiruv mantig'i S10 ga va ⌘K ga ko'chadi).

### ⌘K buyruqlar paneli
- [ ] **V2-P6.S2.8** `CommandPalette.tsx` (`'use client'`, layout'da bir marta): `⌘K` / `Ctrl+K` va `/` (input fokusda bo'lmasa) bilan ochiladi. `Dialog center`, `w-[min(640px,94vw)]`. Ichida katta input (Literata 26px), 250ms debounce bilan `/api/search?q=&limit=8`. Natijalar turi bo'yicha guruhlanadi (rangli tur yorlig'i + sarlavha). `↑↓` bilan tanlanadi, `Enter` bilan ochiladi. Pastda "Barcha natijalar →" (`/qidiruv?q=`). Bosh sahifadagi qidiruv inputi ham shu panelni ochadi.

### Layout
- [ ] **V2-P6.S2.9** `[locale]/layout.tsx`: `<body className="min-h-screen flex flex-col bg-paper text-fg font-sans antialiased">` → `ThemeProvider` → `NextIntlClientProvider` → `SkipLink`, `SiteHeader`, `<main id="main" className="flex-1">`, `SiteFooter`, `CommandPalette`, `InkCursor`, `Toaster` (oddiy toast komponenti: `src/components/ui/Toast.tsx` — CSS bilan `fixed bottom-7 left-1/2 -translate-x-1/2 bg-fg text-bg rounded-[8px] px-[18px] py-3 animate-hf-up`; context provider orqali `toast(msg)`).

✅ **Qabul mezonlari:** header va footer 1440 da `SiteHeader.dc.html` / `SiteFooter.dc.html` bilan bir xil. 390 da burger ishlaydi. Til va tema almashadi, ⌘K ochiladi.

## V2-P6.S3 — Bosh sahifa (dizayn: `Home.dc.html`)

`src/app/(frontend)/[locale]/page.tsx` — bo'limlar tartibi aynan dizayndagidek. Komponentlar `src/components/home/`.
**Matnlar manbai:** avval `homePage` globali (admin tahrirlaydi); maydon bo'sh bo'lsa — `messages.home.*` zaxira sifatida.

- [ ] **V2-P6.S3.1** **I · Hero** (18–55) `HomeHero.tsx`:
  - Desktop: `grid grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-16 px-12 pt-20 pb-24 items-center`. Mobil: 1 ustun (`px-4 pt-10 pb-16 gap-10`), rasm matn ostida va balandligi `420px`.
  - Chap ustun (`flex flex-col gap-7`):
    - `Kicker` (`hero.kicker`, "I · Tarixiy maʼlumotlar portali") — `animate-hf-up`.
    - H1: `{titleA} <em className="italic text-primary">{titleB}</em>` (5.2-jadval Hero H1), `[animation-delay:.1s] animate-hf-up`.
    - Subtitle: Literata 20px/1.55, `text-muted max-w-[46ch]`, delay .2s.
    - 2 ta CTA: `Pill primary lg` (`cta1` → `/maqolalar`) va `Pill outline lg` (`cta2` → `/xronologiya`), delay .3s.
    - Qidiruv pill (29–33): `mt-2 flex items-center gap-3.5 max-w-[520px] rounded-full border border-border bg-card py-1.5 pr-1.5 pl-5`. Ichida 13px lupa doirasi, input (15px) va `⌘ K` belgisi (mono 11px, `border border-border rounded-full px-3.5 py-[9px]`). Input fokus olganda yoki bosilganda `CommandPalette` ochiladi. Enter → `/qidiruv?q=`.
  - O'ng ustun (`relative h-[620px]`, mobil `h-[420px]`):
    - `PlateFrame` (`absolute inset-0 left-10`, mobilda `left-0`) — `hero.image` yoki yorliq `hero.imageLabel` ("chiziqli gravyura illyustratsiya / Xiva · Ichan qalʼa, Kalta minor").
    - `Seal` (`absolute -right-[18px] -top-[22px]`, mobilda `right-2 top-2` va 100px): "MUHR" / davrlar soni / "TARIXIY DAVR".
    - **"Bugun tarixda" kartochkasi** (49–53) `OnThisDayCard.tsx`: `absolute left-0 bottom-[42px] w-[300px] bg-card border border-line shadow-offset p-[20px_22px] flex flex-col gap-2.5 transition-transform hover:-translate-x-1 hover:-translate-y-1` (mobilda `static w-full mt-4`). Ichida: tepada mono 10.5px teal "Bugun tarixda" va o'ngda `{kun} · {toRomanMonth(oy)}` ("9 · X"); sarlavha Literata 500 21px — `{yearLabel || formatYear(year)} — {title}`; "Maqolani oʻqish →" (event'ning birinchi post'i bo'lsa unga, aks holda `/xronologiya/{slug}`).
    - Ma'lumot: `getOnThisDay(locale)` — `month`/`day` bugungi kunga teng voqealar (`importance` bo'yicha saralangan). Topilmasa `homePage.onThisDayFallback`. U ham bo'lmasa kartochka ko'rsatilmaydi.
- [ ] **V2-P6.S3.2** **Marquee** (57–63): `border-y border-line bg-fg text-bg overflow-hidden py-4`. `Marquee` ichida har davr uchun: `<em>` nom (Literata 19px), `yearsLabel` (mono 12px opacity .6) va 7px `bg-primary rotate-45` romb. Elementlar orasida `px-[18px]`.
- [ ] **V2-P6.S3.3** **II · Davrlar** (65–83): `px-12 pt-28 pb-24` (mobil `px-4 py-16`). `SectionHeader numeral="II"`. Grid: `grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 border-l border-line`. Har kartochka `Link` → `/xronologiya?davr={slug}`, `Reveal delay={(i % 5) * 80}`: `relative flex flex-col gap-3.5 p-[28px_24px_30px] min-h-[200px] border-r border-b border-line text-fg hover:bg-card hover:text-fg transition-colors duration-300`. Ichida: tepada `{order}` (mono 12px muted, "01") va o'ngda 12px `PeriodDot`; nom (Literata 500 23px/1.2, `text-balance`); pastda `mt-auto` `yearsLabel` (mono 12.5px, davr rangida). **Eslatma:** grid'ning birinchi qatorida `border-t` ham bo'lishi uchun konteynerga `border-t border-line` qo'shing (dizaynda `SectionHeader` ning `border-b` si shu vazifani bajaradi — tekshiring).
- [ ] **V2-P6.S3.4** **III · Muharrir tavsiyasi** (85–116): `SectionHeader numeral="III"` (mb-10). Grid `md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8`.
  - Katta kartochka (`homePage.featuredPost`): `Tilt` + `Reveal` → `flex flex-col gap-5 bg-card border border-line p-[14px_14px_28px] text-fg hover:text-fg`. `PlateFrame` balandligi 400px (mobil 240) va `coverImage`. Ostida (`px-3.5`): `PeriodBadge` + "kategoriya · N daq" (mono 11px muted), sarlavha Literata 500 38px/1.12 (mobil 28px), excerpt Literata 17px muted `max-w-[60ch]`.
  - O'ng ustun: 2 ta kichik kartochka (`homePage.picks`), `flex flex-col gap-8`, har biri `grid grid-cols-[150px_minmax(0,1fr)] gap-5 flex-1 bg-card border border-line p-3.5`. Chapda PlateFrame, o'ngda: davr nomi (mono 10.5px uppercase, davr rangida), sarlavha (Literata 500 22px/1.22), pastda `mt-auto` "Kategoriya · N daq" (mono 12.5px muted). Mobilda `grid-cols-[110px_1fr]`.
  - `featuredPost` bo'sh bo'lsa `featured: true` bo'lgan oxirgi post, `picks` bo'sh bo'lsa keyingi 2 tasi olinadi.
- [ ] **V2-P6.S3.5** **IV · Platforma haqida** (118–136): `px-12 py-28 bg-card border-y border-line`. Yuqori grid `md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-16 mb-[72px]`: chapda kicker ("IV · Platforma haqida", `IV` primary) va h2 ("Har bir maqola uch qoʻldan oʻtadi"), o'ngda matn (Literata 19px/1.65 muted, `pt-7`).
  Qadamlar: `relative grid grid-cols-2 md:grid-cols-4 gap-6`. Desktop'da orqada uzuq-uzuq chiziq: `absolute left-[12.5%] right-[12.5%] top-9 border-t-[1.5px] border-dashed border-line` (mobilda yashiriladi). Har qadam (`Reveal delay={i*120}`): 72px doira (`rounded-full border border-line bg-bg grid place-items-center font-serif text-[28px] text-primary`, hover'da `scale-[1.08] bg-primary text-primary-fg`), ichida rim raqam; sarlavha (Literata 500 22px); matn (15px/1.55 muted, `max-w-[28ch]`). Manba: `homePage.aboutSection.steps`.
- [ ] **V2-P6.S3.6** **V · Tarixiy shaxslar** (138–158): `SectionHeader numeral="V"` (mb-12). Grid `grid-cols-2 md:grid-cols-4 gap-8`. Har shaxs `Link` → `/shaxslar?shaxs={slug}` (drawer ochiladi), hover'da `text-primary`: 200px doira ramka (`rounded-full border border-line p-2`, hover'da `-rotate-[4deg] scale-[1.03]`, mobil 140px), ichida `portrait` (`rounded-full object-cover`) yoki `bg-hatch` va "gravyura portret" yorlig'i; ism (Literata 500 23px); `{yillar} · {rol}` (mono 12.5px muted). Manba: `homePage.featuredPersons` yoki `featured: true` bo'lgan 4 ta shaxs.
- [ ] **V2-P6.S3.7** **CTA "Muallif bo'lish"** (160–168): `mx-12 mb-28 grid md:grid-cols-[minmax(0,1fr)_420px] border border-line bg-primary text-primary-fg`. Chap (`p-16`, mobil `p-8`): kicker (mono 12px opacity .8), h2 (Literata 56px/1.04, `max-w-[16ch]`, mobil 36px), matn (Literata 18px/1.6 opacity .9), `Pill variant="light"` "Ariza qoldirish →" → `/muallif-bolish`. O'ng (mobilda yashiriladi): `border-l border-line` va shtrix `repeating-linear-gradient(135deg, rgba(255,255,255,.12) 0 1px, transparent 1px 8px)`, `authorCta.image` yoki yorliq "gravyura · siyohdon va pero".
- [ ] **V2-P6.S3.8** **Bosh sahifa izohlari (D4):** `homePage.showHomeComments` bo'lsa, CTA dan keyin `px-12 pb-28`: `SectionHeader numeral="VI"` (kicker "Muhokama", sarlavha `homeCommentsTitle`) va ostida `CommentsSection context="home"` (P6.S5.7 dagi komponent, `max-w-[760px]`).

✅ **Qabul mezonlari:** bosh sahifa 1440 da `Home.dc.html` bilan solishtirilganda bo'limlar tartibi, o'lchamlari va ranglari mos. 390 da gorizontal skroll yo'q. Lighthouse Performance (mobil) ≥ 85.

## V2-P6.S4 — Maqolalar ro'yxati (dizayn: `Maqolalar.dc.html`)

- [ ] **V2-P6.S4.1** `maqolalar/page.tsx` — `searchParams`: `q`, `kategoriya` (slug), `davr` (slug), `saralash` (`new` | `pop` | `old`), `korinish` (`grid` | `list`), `sahifa` (≥1). Server qismi ma'lumotni oladi, filtr paneli esa client komponent bo'lib URL'ni o'zgartiradi (`router.replace`, `scroll: false`).
- [ ] **V2-P6.S4.2** **Sarlavha** (18–27): `px-12 pt-[72px] pb-10 grid md:grid-cols-[minmax(0,1fr)_auto] gap-12 items-end border-b border-line`. Chapda `Kicker` ("Arxiv · Barcha maqolalar") va H1 "Maqolalar" (5.2 Sahifa H1). O'ngda 2 ta `StatNumber`: jami maqolalar (Literata 44px) va mualliflar (teal) — `getPostsStats()`.
- [ ] **V2-P6.S4.3** **Filtr paneli** (29–53) `PostsFilterBar.tsx` (`'use client'`): `sticky top-0 z-10 px-12 py-[18px] flex flex-col gap-3.5 bg-bg border-b border-border` (mobil `px-4`).
  - 1-qator: qidiruv inputi (`flex-1 min-w-[260px] max-w-[420px] rounded-full border border-line bg-card px-4`, 12px lupa, 14.5px input, 300ms debounce → `?q=`), kategoriya pill'lari (`Pill filter sm`: "Barchasi" + kategoriyalar — 4–6 tasi ko'rinadi, qolgani "Yana ▾" dropdown'da), o'ngda (`ml-auto`) saralash `select` (`border border-border bg-card rounded-[6px] px-2.5 py-[9px] text-[13px] font-medium`: Eng yangi / Eng koʻp oʻqilgan / Eng eski) va grid/list almashtirgich (2 ta 38×36 tugma, `border border-border rounded-[6px] overflow-hidden`, tanlangani `bg-surface-2`; ikonkalar dizayn 43–44-qatorlarda CSS gradientlar bilan chizilgan, aynan ko'chiring).
  - 2-qator: davr tab'lari (`flex gap-1 overflow-x-auto`): "Barcha davrlar" + har davr (7px `PeriodDot` + `shortTitle`, mono 12px). Tanlangan tab'da `border-b-2` davr rangida va `text-fg`, qolganlari `text-muted hover:text-fg`.
  - Mobil: 1-qatordagi pill'lar gorizontal skroll bo'ladi, saralash va ko'rinish o'ngda qoladi.
- [ ] **V2-P6.S4.4** **Natija qatori** (56–59): mono 12px muted "Koʻrsatilmoqda: {n} / {jami}". Filtr faol bo'lsa o'ngda "Filtrni tozalash" (primary, tagiga chizilgan).
- [ ] **V2-P6.S4.5** **Grid ko'rinishi** (68–90): `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7`. **Birinchi kartochka** (sahifada 2 tadan ko'p natija va grid bo'lsa) `xl:col-span-2`, rasm 340px, sarlavha 34px; qolganlari rasm 200px, sarlavha 23px. `PostCard` (`src/components/posts/PostCard.tsx`):
  - `curl` klassi, `flex flex-col gap-4 p-[12px_12px_22px] bg-card border border-line text-fg animate-hf-up hover:-translate-y-1 hover:shadow-offset-sm hover:text-fg transition-[transform,box-shadow] duration-300`. Animatsiya kechikishi `style={{ animationDelay: k*60 + 'ms' }}`.
  - `PlateFrame` (inset 0, faqat ichki ramka) va chap yuqorida `PeriodBadge` (`absolute left-2.5 top-2.5`).
  - Matn bloki `px-2.5 flex flex-col gap-2.5`: "KATEGORIYA · N DAQ" (mono 11px uppercase muted), sarlavha (Literata 500, o'lcham yuqorida), excerpt (Literata 15px/1.55 muted), pastki qator (`mt-1.5 pt-3 border-t border-border text-[13px] text-muted flex items-center gap-2.5`): `Avatar size 26`, muallif ismi (`flex-1 text-fg`), `◷ {izohlar soni}` (mono 12px) va sana `dd.mm.yyyy` (mono 12px).
  - kaa'da tarjima bo'lmasa, sarlavha yonida kichik "UZ" belgisi chiqadi.
- [ ] **V2-P6.S4.6** **List ko'rinishi** (92–107): `flex flex-col border-t border-line`. Qator: `grid grid-cols-[60px_180px_minmax(0,1fr)_160px] gap-7 items-center py-[22px] px-2 border-b border-line hover:bg-card hover:pl-5 transition-[background-color,padding] duration-300` (mobil: `grid-cols-[100px_1fr]`, raqam va o'ng ustun yashiriladi). Ustunlar: tartib raqami (Literata 30px `text-ornament`, "01"), rasm (110px balandlik), davr · kategoriya (mono 11px) + sarlavha (Literata 500 25px) + excerpt, o'ngda (`items-end`) muallif, sana va "N daq · ◷ N".
- [ ] **V2-P6.S4.7** **Bo'sh holat** (61–66): `EmptyState` — "Hech narsa topilmadi" (kursiv Literata 34px), "Boshqa davr yoki soʻzni tanlab koʻring." va "Filtrni tozalash" tugmasi.
- [ ] **V2-P6.S4.8** **Sahifalash** (110–118): `Pagination`, `limit: 12`.
- [ ] **V2-P6.S4.9** **Saralash mantiqi:** `new` → `-publishedAt`, `old` → `publishedAt`, `pop` → `-views`. `q` → `searchText like normalizeSearch(q)`. Muallif ismi bo'yicha qidiruv uchun: `q` ga mos `users` ID'lari topiladi va `or: [{ searchText: { like } }, { author: { in: ids } }]` qilinadi.

✅ **Qabul mezonlari:** barcha filtrlar birga ishlaydi va URL'ga yoziladi (ulashilganda tiklanadi). Grid va list ko'rinishlari dizaynga mos, mobil ko'rinish ham ishlaydi.

## V2-P6.S5 — Maqola sahifasi (dizayn: `Maqola.dc.html`)

### Renderer
- [ ] **V2-P6.S5.1** `src/components/rich-text/RichText.tsx` (server) — eski rejadagi `docs/plan/P05-editor.md` P5.S3.2 asosida, quyidagi farqlar bilan:
  - `heading` converter `id` beradi (`collectHeadings` bilan bir xil algoritm), `h2` uchun `scroll-mt-24`.
  - `blocks.source` → **`null`** qaytaradi (manbalar pastda yig'iladi, D6).
  - `blocks.quote` → `QuoteBlock` (dizayn 56–60): `relative my-4 py-2 pl-8 border-l-2 border-primary`, katta `“` (`absolute -left-3.5 -top-[18px] font-serif text-[80px] leading-none text-primary bg-bg`), matn `font-serif italic text-[28px] leading-[1.4]` (mobil 22px), `cite` — mono 12px uppercase tracking .08em muted "— {source}".
  - `blocks.gallery` → `GalleryBlock` (dizayn 66–69): `grid grid-cols-1 sm:grid-cols-2 gap-3 my-3`. Har rasm `PlateFrame` (220px, label pastki chap burchakda `place-items-end start`), bosilganda `ArchiveLightbox` (S8) ochiladi.
  - `upload` → `MediaFigure`: `PlateFrame` (inset 12) + caption (Literata kursiv 14px muted) + `credit`. `size: wide` bo'lsa `md:-mx-16`, `full` bo'lsa `md:-mx-[220px]` (yon ustunlar ustiga chiqadi, `lg` dan katta ekranlarda).
  - `horizontalrule` → `DiamondDivider` (`text-border my-8`).
  - `inlineBlocks.footnote` → `FootnoteRef` (S5.4).
  - `link` → xavfsiz href (`isSafeHref`) va ichki havolalar uchun next-intl `Link`.
  - Qolgan bloklar (Callout, YouTube, PersonCard, …) — eski reja P5.S3.3.
- [ ] **V2-P6.S5.2** `src/lib/safe-url.ts` → `isSafeHref` (eski reja P5.S3.4), unit testi bilan.

### Sahifa tuzilmasi
- [ ] **V2-P6.S5.3** `maqolalar/[slug]/page.tsx` (`revalidate = 3600`, `generateStaticParams → []`):
  1. **O'qish progressi** (17): `ReadingProgress.tsx` (`'use client'`) — header ostida `h-[3px] bg-surface-2`, ichida `bg-primary` (kenglik = maqola elementi bo'yicha skroll %). `requestAnimationFrame` bilan hisoblanadi.
  2. **Sarlavha bloki** (20–30): `max-w-[980px] mx-auto flex flex-col items-center gap-6 text-center px-4 pt-16`.
     - Breadcrumb (mono 12px uppercase tracking .1em muted): "Maqolalar" havolasi / `PeriodBadge` / kategoriya.
     - H1 (5.2 Maqola H1), `animate-hf-up`.
     - Excerpt: Literata kursiv 21px/1.5 muted `max-w-[56ch]`.
     - Muallif qatori: `Avatar size 44` (fon teal), ism (600 15px) va ostida mono 12px "02.10.2026 · 14 daq · Tekshirdi: D. Rahimova" (`reviewedBy.displayName` — `getAuthorPublic` orqali). Hammuallif bo'lsa ismlar vergul bilan.
  3. **Muqova** (31–34): `max-w-[1200px] mx-auto mt-6` `PlateFrame` (inset 12, 520px; mobil 260px, `priority`) va caption (Literata kursiv 14px muted: `caption` + " Manba: " + `credit`).
  4. **Uch ustun** (36–93): `max-w-[1200px] mx-auto mt-[72px] grid lg:grid-cols-[220px_minmax(0,680px)_220px] gap-12 justify-center px-4`.
     - **Chap aside** (`sticky top-6 self-start`, `lg` dan kichikda — matn tepasida yig'iladigan `<details>` "Mundarija"):
       - "MUNDARIJA" (mono 11px uppercase tracking .14em muted mb-2).
       - Har `h2`: tugma `flex gap-2.5 text-left border-l-2 px-3 py-2 text-[14px] leading-[1.35]`, ichida raqam (mono 11px, "01"). Faol bo'limda `border-primary text-fg font-semibold`, qolganlarida `border-border text-muted`. Faol bo'lim `IntersectionObserver` (rootMargin `-30% 0px -60% 0px`) bilan aniqlanadi. Bosilganda silliq skroll. Komponent: `TableOfContents.tsx` (`'use client'`, `headings` props).
       - Asboblar (dizayn 42–46): `mt-6 pt-[18px] border-t border-border flex gap-1.5`, 3 ta tugma (`flex-1 h-9 border border-border bg-card rounded-[6px]`):
         - **A−** va **A+**: `--article-fs` ni 16..23px oralig'ida o'zgartiradi (standart 19). Qiymat `localStorage('hisinf:fs')` da saqlanadi (`try/catch` bilan).
         - **❏ Saqlash**: `BookmarkButton` (P7.S3). Saqlangan holatda `bg-primary text-primary-fg border-primary`.
     - **Markaz:** `<article className="prose-hisinf">` `RichText`. Ostida:
       - **Manbalar** qutisi (72–77): `mt-6 p-[24px_28px] border border-line bg-card flex flex-col gap-3 font-sans text-[14.5px] leading-[1.55]`, sarlavha "MANBALAR" (mono 11px uppercase tracking .14em teal), har manba `{n}. {formatSource(source)}`. `src/lib/format-source.ts` → "Muallif. Nomi. Shahar: Nashriyot, Yil. N-bet." / arxiv: "OʻzR MDA, fond R-25, roʻyxat 1, ish 162." / veb: "Nomi. URL (murojaat: sana)". Unit testi bilan.
       - **Izohlar ro'yxati** (footnote'lar, ekran o'quvchilari va print uchun): `<details>` "Izohlar (N)", ichida `<ol>`, `id="fn-n"`, `↩` havolasi.
       - **Teglar** (78–80): `flex gap-2 flex-wrap font-mono text-[12px] font-medium`, har teg `px-3 py-[7px] border border-border rounded-full` "#{title}" → `/qidiruv?q={title}`.
       - **Iqtibos keltirish**: kichik `details` ("Iqtibos keltirish") — `buildCitation` (eski reja P7.S6.3-8) va "Nusxa olish" tugmasi.
     - **O'ng aside** (`sticky top-6 self-start`, `lg` dan kichikda — matndan keyin, 2 ustunli grid):
       - "BOGʻLIQ" (mono 11px uppercase).
       - Birinchi bog'liq shaxs kartochkasi (85–88): `flex flex-col gap-2.5 p-4 border border-line bg-card text-fg hover:-translate-y-[3px] hover:text-fg transition-transform`, 56px doira portret, ism (Literata 17px), "1897–1938 · Davlat arbobi" (mono 12px muted) → `/shaxslar/{slug}`.
       - Davr kartochkasi (89–91): `p-4 border border-line hover:bg-card`, `yearsLabel` (mono 11px, davr rangida) va "{davr} xronologiyasi →" (Literata 17px) → `/xronologiya?davr={slug}`.
       - Qo'shimcha bog'liq voqealar va joylar (bo'lsa) — oddiy havolalar ro'yxati.
  5. **Izohlar** (96–126): bir xil 3 ustunli grid, markaz ustunda `CommentsSection context="post" postId` (S5.7). `commentsEnabled === false` bo'lsa "Izohlar oʻchirilgan".
  6. **Oldingi/keyingi** (128–131): `mx-12 my-24 grid md:grid-cols-2 border border-line`. Har tomon `curl flex flex-col gap-2.5 p-9 text-fg hover:bg-card hover:text-fg` (chapda `border-r border-line`), ichida "← OLDINGI MAQOLA" (mono 11px uppercase tracking .14em muted) va sarlavha (Literata 500 26px/1.25). O'ng tomon `text-right`. `getAdjacentPosts` (`publishedAt` bo'yicha).
- [ ] **V2-P6.S5.4** **Footnote popover** (dizayn 50–53, 62–65): `FootnoteRef.tsx` (`'use client'`) — `<button className="align-super font-mono text-[13px] font-semibold text-primary px-0.5" aria-expanded aria-controls>[n]</button>`. Bosilganda `Popover` ochiladi (dizayndagi panel: `bg-card border border-line px-4 py-3.5 text-[14px] leading-[1.55] animate-hf-up`, ichida `<b className="font-mono text-primary">[n]</b> {matn}` va `sourceUrl` bo'lsa havola). Mobilda popover kenglik `calc(100vw-32px)`. `id="fnref-n"` (pastdagi `↩` shu yerga qaytaradi).
- [ ] **V2-P6.S5.5** **Tarjima banneri:** kaa'da tarjima bo'lmasa (`hasTranslation`), sarlavha blokidan oldin `max-w-[980px] mx-auto mt-6 px-4 py-3 border border-dashed border-gold text-gold font-mono text-[12px]` banner: "Bu maqola hali qoraqalpoq tiliga tarjima qilinmagan — oʻzbekcha matn koʻrsatilmoqda." va `robots: noindex`.
- [ ] **V2-P6.S5.6** **Ko'rishlar soni:** `ViewTracker.tsx` (`'use client'`) — mount'da 1 marta `navigator.sendBeacon('/api/track', JSON.stringify({ postId, locale }))` (P7.S5). Draft rejimida yuborilmaydi.

### Izohlar komponenti (maqola va bosh sahifa uchun umumiy)
- [ ] **V2-P6.S5.7** `src/components/comments/CommentsSection.tsx` (server qism: `getApprovedComments`) + `CommentsClient.tsx` (`'use client'`). Dizayn 98–124:
  - Sarlavha: `flex items-baseline gap-4 pb-4 border-b border-line` → h2 "Izohlar" (Literata 40px) va soni (mono 14px primary).
  - **Forma** (100–106): `flex flex-col gap-3 p-5 border border-line bg-card`. Textarea (`rows 3`, Literata 17px/1.55, `bg-transparent border-0 outline-0 resize-y`, belgilar hisoblagichi `n/1000`). Pastki qator `pt-3 border-t border-border`: chapda "Izohlar moderatsiyadan oʻtadi" (mono 12px muted), o'ngda "Yuborish →" pill (matn bo'sh bo'lsa `bg-ornament`, bo'lmasa `bg-primary`). Turnstile vidjeti (`size: 'flexible'`, `appearance: 'interaction-only'`) formaning ichida.
  - **Kirmagan foydalanuvchi:** forma o'rnida xuddi shu kartochka ichida "Izoh qoldirish uchun kiring" va `Pill dark sm` "Kirish →" (`?qaytish=` bilan).
  - **Yuborilgandan keyin:** yangi izoh ro'yxat boshida "MODERATSIYADA" belgisi (mono 10px uppercase, `border border-dashed border-gold text-gold rounded-full px-[7px] py-[3px]`) bilan **faqat shu foydalanuvchiga** ko'rinadi (lokal holat). Toast: "Izohingiz moderatsiyadan soʻng koʻrinadi".
  - **Izoh** (108–122): `grid grid-cols-[44px_minmax(0,1fr)] gap-4 pt-1.5 pb-[22px] border-b border-border animate-hf-up`. Javob bo'lsa `ml-[60px]` (mobil `ml-6`). `Avatar 44`. Sarlavha qatori: ism (600 15px), xodim bo'lsa `bg-teal text-bg` pill "MUHARRIR" (mono 10px uppercase), vaqt (mono 12px muted, nisbiy: "2 kun oldin" — `src/lib/relative-time.ts`, uz/kaa). Matn: Literata 16.5px/1.6 (`whitespace-pre-line`). Harakatlar (12.5px muted): `♥ {likes}` (like qilingan bo'lsa primary, bosilganda `active:scale-[1.2]`; kirmagan bo'lsa → kirish taklifi) va "Javob berish" (formani shu izoh ostida ochadi, `parent` bilan; faqat asosiy izohlarga).
  - Server action'lar: P7.S1–S2.
- [ ] **V2-P6.S5.8** Eski `src/components/PostComments.tsx` va `src/app/api/comments/route.ts` o'chiriladi.

✅ **Qabul mezonlari:** maqola 1440 da `Maqola.dc.html` ga mos. Mundarija faol bo'limni ko'rsatadi. A−/A+ ishlaydi va saqlanadi. Footnote popover ochiladi. Manbalar pastda yig'iladi. Izoh yuborish, like va javob berish ishlaydi. Mobil ko'rinish qulay.

## V2-P6.S6 — Xronologiya (dizayn: `Xronologiya.dc.html`)

- [ ] **V2-P6.S6.1** `xronologiya/page.tsx` — `?davr=slug` (yo'q bo'lsa — birinchi davr yoki `siteSettings` dagi standart; dizaynda `era: 8` → Sovet davri). Server barcha davrlarni (sonlari bilan) va tanlangan davr voqealarini oladi. Davr almashganda `router.push('?davr=…', { scroll: false })` ishlaydi va sahifa server'da qayta render bo'ladi (bu oddiyroq). Alternativa: barcha voqealarni bir marta yuklab, client'da filtrlash — voqealar soni 500 dan kam bo'lsa ruxsat etiladi.
- [ ] **V2-P6.S6.2** **Sarlavha** (17–21): markazda `Kicker center` ("Davrlar"), H1 "Xronologiya", subtitle (Literata 19px muted `max-w-[52ch]`).
- [ ] **V2-P6.S6.3** **Davr paneli** (23–35) `EraBar.tsx` (`'use client'`):
  - Yuqorida: `flex justify-between items-center mb-3.5` — "←" tugma (40px doira `border-line`, hover'da `bg-fg text-bg`), markazda "09 / 10" (mono 11px tracking .1em muted), "→" tugma. Oxiridan keyin birinchisiga aylanadi.
  - Panel: `flex border border-line bg-card`. Har davr tugmasi: `relative min-w-0 flex flex-col gap-2.5 px-3 pt-4 pb-[18px] border-r border-line text-left transition-[flex,background-color] duration-[600ms] ease-ink hover:bg-surface-2`, `style={{ flex: active ? 3.2 : period.timelineWeight }}`. Tepada rangli chiziq (`absolute inset-x-0 top-0`, balandligi faolda 6px, aks holda 3px, `background: periodColor`). Ichida: raqam (mono 11px opacity .7), `shortTitle` (Literata 500 15px, ellipsis), `yearsLabel` (mono 10.5px opacity .7, ellipsis). Faol: `bg-fg text-bg`.
  - Klaviatura: `←/→` tugmalari (panel fokusda bo'lganda), `role="tablist"`, har tugma `role="tab"` `aria-selected`.
  - **Mobil:** panel gorizontal skroll (`overflow-x-auto snap-x`, har tugma `min-w-[120px]`, faoli `min-w-[200px]`). Faol tugma ko'rinishga avtomatik skroll qilinadi.
- [ ] **V2-P6.S6.4** **Asosiy qism** (37–56): `px-12 pt-[72px] pb-28 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-[72px]`.
  - **Chap (sticky top-6)** `EraPanel`: katta raqam (Literata 120px/.85, davr rangida, mobil 72px), nom (Literata 48px/1.05, mobil 34px), `yearsLabel` (mono 14px, davr rangida), `description` (Literata 18px/1.6 muted), `PlateFrame` 260px (`cover` yoki "gravyura · {coverCaption}"), sonlar: `{posts} maqola` va `{persons} shaxs` (Literata 30px + mono 10.5px uppercase muted). Davr almashganda elementlar 70ms qadam bilan `hf-up` animatsiyasida paydo bo'ladi (dizayndagi `anim()`).
  - **O'ng — voqealar "umurtqasi"**: `relative flex flex-col pl-14`. Vertikal chiziq: `absolute left-[15px] top-2 bottom-2 w-[1.5px] bg-line origin-top`, davr almashganda `scaleY 0→1` (1.1s). Har voqea (`Link`): `relative grid grid-cols-[120px_minmax(0,1fr)] gap-6 p-[26px_24px] mb-3 border border-transparent text-fg hover:bg-card hover:border-line hover:translate-x-1.5 hover:text-fg transition`. Romb marker: `absolute -left-[49px] top-8 size-3.5 rotate-45 bg-bg border-[1.5px]` (davr rangida). Yil (Literata 28px/1.1, davr rangida): `yearLabel || formatYear(year, locale, approximate)`. O'ngda: sarlavha (Literata 500 22px/1.25), `summary` (Literata 15.5px/1.55 muted) va havola (mono 12px primary): bog'liq post bo'lsa "Maqolani oʻqish →" (post'ga), aks holda "Batafsil →" (`/xronologiya/{slug}`). `importance === 1` voqealarda romb to'ldiriladi.
  - Mobil: chap panel tepada (sticky emas), umurtqa `pl-10`, yil ustuni `grid-cols-[84px_1fr]`.
- [ ] **V2-P6.S6.5** `xronologiya/[slug]/page.tsx` — voqea sahifasi: kicker (davr), yil (katta), sarlavha, rasm (`PlateFrame`), summary, `description` (RichText), joy (havola va kichik xarita `PlacesMapLazy interactive={false}`), shaxslar (chip'lar), bog'liq maqolalar va "Xronologiyada koʻrish →".
- [ ] **V2-P6.S6.6** `next.config.ts` redirects: `/:locale/davrlar` → `/:locale/xronologiya`, `/:locale/davrlar/:slug` → `/:locale/xronologiya?davr=:slug` (308).

✅ **Qabul mezonlari:** davr tanlash (klik, strelkalar, URL) ishlaydi. Panel kengayish animatsiyasi silliq. Voqealar to'g'ri tartibda (miloddan avvalgilar birinchi). Mobil skroll ishlaydi.

## V2-P6.S7 — Shaxslar (dizayn: `Shaxslar.dc.html`)

- [ ] **V2-P6.S7.1** `shaxslar/page.tsx` — server barcha chop etilgan shaxslarni oladi (`select`: name, slug, birthYear, deathYear, yearsApproximate, lifespanLabel, birthPlace, personType, portrait, period → title, color). Filtrlash client'da bajariladi (`PersonsBrowser.tsx`). URL: `?rol=scholar&harf=A&shaxs=slug`.
- [ ] **V2-P6.S7.2** **Sarlavha** (17–23): `grid md:grid-cols-2 gap-12 items-end px-12 pt-[72px] pb-8 border-b border-line`, chapda kicker va H1, o'ngda subtitle (`justify-self-end max-w-[46ch]`).
- [ ] **V2-P6.S7.3** **Filtrlar** (24–31): `px-12 py-5 flex gap-[18px] items-center flex-wrap border-b border-border`. Chapda rol pill'lari (`Pill filter sm`: Barchasi, Olim, Hukmdor, Shoir, Sarkarda, Maʼrifatparvar, Davlat arbobi — faqat ma'lumotda mavjudlari). O'ngda (`ml-auto`) alifbo: `flex gap-0.5 font-serif text-[13px] font-medium`, har harf `w-7 h-[30px] rounded-[4px]` tugmasi. Shaxsi bor harflar `opacity-100`, qolganlari `opacity-30` va disabled. Tanlangani `bg-primary text-primary-fg`. Qayta bosilsa filtr bekor bo'ladi. Alifbo `src/lib/alphabet.ts` → `ALPHABET.uz = ['A','B','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','X','Y','Z','Oʻ','Gʻ','Sh','Ch']`, `ALPHABET.kaa = ['A','Á','B','D','E','F','G','Ǵ','H','X','Í','I','J','K','Q','L','M','N','Ń','O','Ó','P','R','S','T','U','Ú','V','W','Y','Z','Sh','Ch']` (`TODO(kaa-review)`). `firstLetter(name, locale)` digraflarni (`Sh`, `Ch`, `Oʻ`, `Gʻ`) birinchi tekshiradi. Mobilda alifbo gorizontal skroll bo'ladi.
- [ ] **V2-P6.S7.4** **Grid** (32–43): `grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 px-12 pt-12 pb-28` (mobil `gap-x-4 px-4`). Kartochka — `button` (drawer ochadi) va unga parallel ravishda yashirin `Link` (SEO uchun `/shaxslar/{slug}` — `<a>` ga JS'siz ham bosish mumkin bo'lishi kerak. Yechim: kartochka `<Link href="?shaxs=slug" scroll={false}>`, JS'siz esa `/shaxslar/{slug}` ga yo'naltiruvchi `noscript` havola). Hover'da `text-primary`.
  - **Arka shaklidagi portret** (35–38): `relative w-[220px] h-[260px] border border-line rounded-[110px_110px_4px_4px] p-2 bg-card transition-[transform,box-shadow] duration-[450ms] ease-ink group-hover:-translate-y-1.5 group-hover:-rotate-[1.5deg] group-hover:shadow-[8px_10px_0_var(--fg)]` (mobil `w-full aspect-[220/260] h-auto`). Ichki: `rounded-[102px_102px_2px_2px] overflow-hidden bg-hatch` + `portrait` (`object-cover`) yoki "gravyura portret" yorlig'i. Pastda rol badge'i: `absolute left-1/2 -bottom-[11px] -translate-x-1/2 px-2.5 py-1 bg-bg border rounded-full font-mono text-[10px] uppercase tracking-[.08em] whitespace-nowrap` (davr rangida).
  - Ism (Literata 500 23px, mt-2) va `{yillar} · {birthPlace}` (mono 12.5px muted).
  - Kartochkalar 60ms qadam bilan `animate-hf-up`.
- [ ] **V2-P6.S7.5** **Drawer** (44–60) `PersonDrawer.tsx`: `?shaxs=slug` bo'lsa ochiladi (`Dialog right`). Ichida: yopish (40px doira, o'ng yuqorida), `PlateFrame` 300px (portret), "ROL · DAVR" (mono 11px uppercase tracking .12em, davr rangida), ism (Literata 46px/1.05), "yillar · tug'ilgan joyi" (mono 14px muted), `shortBio` (Literata 18px/1.65), "MAQOLALAR" ro'yxati (`border-t border-line`, har biri `flex justify-between py-3.5 border-b border-border font-serif text-[17px] text-fg hover:text-primary` "{sarlavha} →") va pastda "Toʻliq sahifa →" (`/shaxslar/{slug}`). Maqolalar drawer ochilganda `fetch('/api/persons/{id}?depth=1&locale=…&select[posts]=true')` orqali yoki server'dan oldindan olinadi (shaxslar soni kam bo'lsa — oldindan). Yopilganda URL'dan `shaxs` olib tashlanadi. `Esc` va overlay bosish yopadi.
- [ ] **V2-P6.S7.6** `shaxslar/[slug]/page.tsx` — to'liq sahifa (SEO): drawer'dagi ma'lumot, qo'shimcha `biography` (RichText), hayot xronologiyasi (shu shaxs bog'langan voqealar, umurtqa uslubida) va bog'liq maqolalar grid'i. `Person` JSON-LD (P8).

✅ **Qabul mezonlari:** rol va harf filtrlari birga ishlaydi. Drawer ochiladi, URL yangilanadi va orqaga tugmasi uni yopadi. To'liq sahifa ishlaydi.

## V2-P6.S8 — Media arxiv (dizayn: `Media Arxiv.dc.html`)

- [ ] **V2-P6.S8.1** `arxiv/page.tsx` — `?tur=photo|document|map|engraving|video` va `?ochiq=slug` (lightbox). Server: tanlangan turdagi birliklar (24 tadan, "Yana yuklash" tugmasi yoki sahifalash) va `getArchiveCounts()` (har tur soni).
- [ ] **V2-P6.S8.2** **Sarlavha** (17–25): `flex justify-between items-end gap-8 flex-wrap px-12 pt-[72px] pb-9 border-b border-line`: chapda kicker ("Fotosuratlar, hujjatlar, xaritalar") va H1 "Media arxiv"; o'ngda `CountTabs` (`Barchasi 1240`, `Foto 612` …: label + soni mono 11px opacity .6; tanlangani `bg-fg text-bg border-fg`).
- [ ] **V2-P6.S8.3** **Masonry** (26–37): `px-12 pt-10 pb-28 [columns:4_260px] gap-x-6` (mobil `[columns:2_150px] gap-x-3 px-4`). Kartochka `button`: `curl block w-full break-inside-avoid mb-6 p-[8px_8px_14px] border border-line bg-card text-left text-fg cursor-zoom-in animate-hf-up hover:-translate-y-1 hover:shadow-offset-sm transition`. Ichida:
  - Rasm qutisi: `relative grid place-items-center border border-line bg-hatch` (balandlik rasmning tabiiy nisbatida, `MediaImage` `w-full h-auto`; rasm bo'lmasa 200–380px oralig'ida, slug'dan deterministik). Video bo'lsa markazda 52px `bg-fg text-bg rounded-full` "▶". Chap yuqorida tur badge'i (`absolute left-2 top-2 px-2 py-1 rounded-full bg-bg font-mono text-[10px] uppercase tracking-[.08em] text-teal`). PDF bo'lsa PDF belgisi.
  - Ostida `pt-3 px-1.5`: sarlavha (Literata 500 17px/1.3) va "yil · manba" (mono 11.5px muted).
- [ ] **V2-P6.S8.4** **Lightbox** (38–50) `ArchiveLightbox.tsx` (`'use client'`, `Dialog full`): `grid grid-cols-[80px_minmax(0,1fr)_380px_80px] items-center h-full` (mobil: `grid-cols-1`, pastda ma'lumot paneli, chap/o'ng tugmalar rasm ustida). Ichida:
  - "←" / "→" (52px doira, `border border-[#ede4d3] text-[#ede4d3]` — lightbox doim qorong'i, ranglar dizayndagidek qattiq).
  - Markaz: `h-[76vh] max-h-[760px] border border-[#ede4d3]` ichida rasm (`object-contain`), PDF (`iframe`, mobilda "PDF'ni ochish" tugmasi) yoki YouTube iframe (`youtube-nocookie.com/embed/{id}`). Bir nechta fayl bo'lsa pastda kichik eskizlar.
  - O'ng panel (`text-[#ede4d3] px-8 flex flex-col justify-center gap-4`): "TUR · 3 / 12" (mono 11px teal `#6fb1b5`), sarlavha (Literata 34px/1.15), "Yil / Manba / Litsenziya" (mono 13px/1.7 `#a89a86`), tugmalar: "Maqolada koʻrish" (`relatedPost` bo'lsa; `bg-[#d9785c] text-[#1a120c] rounded-full`), "Batafsil" (`/arxiv/{slug}`), "Yopish" (outline).
  - Klaviatura: `←/→` navigatsiya, `Esc` yopadi. URL `?ochiq=slug` bilan sinxronlanadi. Litsenziya ruxsat bersa (`public-domain`, `cc-*`, `own`) "Yuklab olish" havolasi chiqadi.
- [ ] **V2-P6.S8.5** `arxiv/[slug]/page.tsx` — eski reja `docs/plan/P08-tarixiy-bolimlar.md` P8.S3.3 bo'yicha, yangi dizayn uslubida.

✅ **Qabul mezonlari:** tur filtri va sonlar to'g'ri. Masonry tartibli joylashadi. Lightbox klaviatura bilan boshqariladi. Video va PDF ochiladi.

## V2-P6.S9 — Xarita (dizayn: `Xarita.dc.html`)

- [ ] **V2-P6.S9.1** `xarita/page.tsx` — server barcha chop etilgan joylarni (`select`: name, slug, lat, lng, placeType, fromLabel, appearsIn → order, color; summary, image, `posts` soni) va davrlarni oladi. `MapExplorer.tsx` (`'use client'`) ga uzatadi. URL: `?davr=<order>&joy=<slug>`.
- [ ] **V2-P6.S9.2** **Layout** (17–57): `grid lg:grid-cols-[400px_minmax(0,1fr)] h-[820px] border-b border-line` (mobil: `flex flex-col`, xarita `h-[65vh]`, panel pastda).
  - **Chap panel** (18–36): `flex flex-col border-r border-line bg-bg min-h-0`.
    - Tepasi (`p-[32px_28px_20px] border-b border-border flex flex-col gap-3.5`): kicker "Tarixiy joylar" (mono 12px primary), H1 "Xarita" (Literata 54px), slayder bloki: "DAVR BOʻYICHA" + o'ngda yil yorlig'i (`formatYear(period.mapYear)`, 14px fg), `<input type="range" min=0 max={periods.length-1} className="w-full accent-[var(--primary)]">`, ostida davr nomi (Literata 13px, davr rangida).
    - Ro'yxat (`flex-1 overflow-auto py-2`): har joy tugmasi `w-full grid grid-cols-[28px_minmax(0,1fr)] gap-3 px-7 py-3.5 border-l-[3px] text-left hover:bg-card transition`. Tanlangani `border-primary bg-card`. Raqam (mono 12px muted), nom (Literata 500 18px) va "Tur · fromLabel" (mono 12px muted). Hali paydo bo'lmagan joylar (`appearsIn.order > tanlangan + 1`) `opacity-35`. Bosilganda joy tanlanadi, slayder kamida o'sha davrga o'tadi (dizayn: `era: Math.max(s.era, x[3])`) va xarita `flyTo` qiladi.
  - **Xarita** (37–56) `PlacesMap.tsx` (react-leaflet, `PlacesMapLazy` orqali `ssr:false` — eski reja P8.S4.3):
    - `MapContainer` `zoomControl={false}`, `attributionControl` (OSM attribution majburiy), boshlang'ich `fitBounds` (barcha joylar).
    - Tile: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`. **Gravyura uslubi** (CSS): `.hf-map .leaflet-tile-pane { filter: grayscale(1) sepia(.35) contrast(.92) brightness(1.04); }`, `[data-theme=dark] .hf-map .leaflet-tile-pane { filter: invert(1) grayscale(1) sepia(.3) brightness(.78) contrast(.9); }`. Ustidan nozik to'r (dizayn 37: 80px oraliqli `border` chiziqlar) — `pointer-events-none absolute inset-0 z-[400]` overlay, `opacity-40`.
    - **Pin** (39–46): `L.divIcon({ className: 'hf-pin', html, iconSize: [0,0] })`. HTML: label (`px-2.5 py-[5px] border border-line font-serif text-[12px] whitespace-nowrap`, tanlangani `bg-fg text-bg`, aks holda `bg-card text-fg`) va ostida 14px romb (`rotate-45 border-2 border-bg shadow-[0_0_0_1px_var(--line)]`, `background` davr rangida). Tanlangan pin atrofida `hf-ping` halqasi. Pin'lar `translate(-50%,-100%)` bilan joylashadi. Birinchi yuklanishda `hf-drop` animatsiyasi (70ms qadam). `divIcon` HTML ichida CSS o'zgaruvchilar ishlaydi, chunki u DOM'ga qo'shiladi.
    - Slayderdan keyingi davrlarda paydo bo'ladigan pin'lar ko'rsatilmaydi (dizayn: `.filter(p => vis(p.i))`).
    - **Zoom tugmalari** (54): `absolute right-16 top-16 z-[500] flex flex-col border border-line bg-card`, `+` va `−` (40×40), `map.zoomIn()` / `zoomOut()`. Mobilda `right-3 top-3`.
    - **Info kartochka** (47–53): tanlangan joy uchun `absolute right-16 bottom-16 z-[500] w-[340px] p-5 bg-card border border-line shadow-offset flex flex-col gap-3 animate-hf-up` (mobil: pastda to'liq kenglikda). Ichida: `PlateFrame` 140px (`image`), "Tur · fromLabel" (mono 11px uppercase teal), nom (Literata 500 26px), `summary` (Literata 15px muted), "{N} ta maqola →" (`/xarita/{slug}` yoki `/qidiruv?q=`), "Batafsil →".
    - Pastki chap yorliq (55): "Amudaryo · Orol boʻyi · Movarounnahr" (Literata kursiv 15px muted) — `siteSettings` yoki messages'dan.
- [ ] **V2-P6.S9.3** `xarita/[slug]/page.tsx` — eski reja P8.S4.5 bo'yicha, yangi uslubda.
- [ ] **V2-P6.S9.4** Admin'da xaritadan nuqta tanlash (`MapPickerField`) — eski reja P8.S4.7.

✅ **Qabul mezonlari:** slayder joylarni davr bo'yicha ko'rsatadi yoki yashiradi. Ro'yxat va pin'lar sinxron. Tungi rejimda xarita qorong'i. Leaflet faqat xarita sahifasi va `MapEmbed` bor maqolalarda yuklanadi.

## V2-P6.S10 — Qidiruv sahifasi (dizayn: `Qidiruv.dc.html`)

- [ ] **V2-P6.S10.1** `qidiruv/page.tsx` — `?q=&tur=all|post|person|period|media|place`. Dastlabki natijalar server'da render qilinadi (SEO va JS'siz holat uchun), keyin `SearchClient.tsx` live yangilaydi (250ms debounce, `/api/search`), URL `router.replace` bilan sinxronlanadi.
- [ ] **V2-P6.S10.2** Tuzilma (17–49), `max-w-[1040px] mx-auto px-4 md:px-12`:
  - Kicker "Qidiruv".
  - Ulkan input qatori: `flex items-center gap-[18px] border-b-2 border-line pb-3.5`. 30px lupa (dizayn 20: 2.4px chegara + dum), input `font-serif text-[56px] leading-[1.1] tracking-[-.025em] bg-transparent border-0 outline-0` (mobil 32px), `q` bo'lsa "ESC" tugmasi (mono 12px, `border border-border rounded-full px-3.5 py-2`). `Esc` tozalaydi. Sahifa ochilganda input avtomatik fokus oladi.
  - Tab'lar: `CountTabs` — Barchasi / Maqola / Shaxs / Davr / Media / Joy va har birining soni.
  - `q` bo'sh bo'lsa: "KOʻP QIDIRILADI" va `siteSettings.popularSearches` pill'lari (`px-[18px] py-3 border border-line rounded-full bg-card font-serif italic text-[18px] hover:bg-fg hover:text-bg`).
  - Natija yo'q bo'lsa: `«{q}» boʻyicha hech narsa topilmadi` (Literata kursiv 30px muted).
  - Natija qatori (40–47): `grid grid-cols-[110px_minmax(0,1fr)_auto] gap-6 items-baseline py-[22px] border-b border-border text-fg hover:pl-3.5 hover:bg-card hover:text-fg transition-[padding,background-color]` (mobil `grid-cols-1 gap-1`). Tur yorlig'i (mono 10.5px uppercase tracking .12em, rangi: Maqola primary, Shaxs p-indigo, Davr teal, Media p-ochre, Joy p-olive), sarlavha (Literata 500 24px/1.25) — **mos qism** `<mark className="bg-primary text-primary-fg px-[3px]">`, subtitle (Literata 15px muted), o'ngda "→".
- [ ] **V2-P6.S10.3** `src/lib/highlight.ts` → `highlightParts(text, query): { s: string; m: boolean }[]` — `normalizeSearch` asosida (apostrof va diakritikdan qat'i nazar topadi), lekin asl matn bo'laklarini qaytaradi. Unit testi: `highlightParts("Oʻzbekiston", "ozbek")` → `[{s:'Oʻzbek', m:true}, {s:'iston', m:false}]`. Indekslarni moslash uchun asl matn belgima-belgi normallashtiriladi va xarita (map) tuziladi.
- [ ] **V2-P6.S10.4** `robots: { index: false }`.

✅ **Qabul mezonlari:** "Xiva" so'rovi maqola, joy va media natijalarini turlari bilan qaytaradi. `oʻzbek`, `o'zbek` va `ozbek` bir xil natija beradi. Highlight to'g'ri.

## V2-P6.S11 — Kirish / Ro'yxatdan o'tish (dizayn: `Kirish.dc.html`)

- [ ] **V2-P6.S11.1** `kirish/page.tsx` — `?rejim=kirish|royxat&qaytish=/…`. Bu sahifada **Header va Footer ko'rsatilmaydi**: route group `src/app/(frontend)/[locale]/(auth)/kirish/` va `(auth)/layout.tsx` (faqat children). `[locale]/layout.tsx` dagi Header/Footer'ni `(site)` guruhiga ko'chiring — **yoki** oddiyroq yo'l: `SiteHeader` va `SiteFooter` ichida `usePathname()` bilan auth sahifalarida `null` qaytaring. Tanlangan usulni commit xabarida yozing.
- [ ] **V2-P6.S11.2** **Layout** (15): `min-h-screen grid lg:grid-cols-2 bg-paper`.
  - **Chap panel** (16–29, `lg` dan kichikda yashiriladi): `relative border-r border-line px-12 py-10 flex flex-col justify-between gap-8 bg-surface-2`. Tepada `Logo compact` (→ `/`). O'rtada `PlateFrame` (`flex-1 min-h-[420px]`, `siteSettings.loginImage` yoki "chiziqli gravyura / kutubxona · ochiq kitob") va `Seal` (110px, `absolute -right-5 bottom-10`, ichida kursiv "Est. 2026"). Pastda iqtibos (Literata kursiv 30px/1.3 `max-w-[22ch]`) va manba (mono 11px uppercase muted) — `siteSettings.loginQuote`.
  - **O'ng panel** (31–85): `flex flex-col px-4 md:px-12 py-10`. Yuqorida o'ngda `LangToggle` va `ThemeToggle` (38px). Markazda `w-full max-w-[440px] flex flex-col gap-[26px]`:
    1. **Sirpanuvchi tab** (41–45): `relative grid grid-cols-2 border border-line rounded-full p-1`. Fon: `absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-fg transition-transform duration-[450ms] ease-ink`, `translateX(0%)` yoki `translateX(100%)`. Tugmalar "Kirish" / "Roʻyxatdan oʻtish" (500 14px, faoli `text-bg`). Tab almashganda URL `?rejim=` yangilanadi.
    2. Sarlavha (Literata 48px/1.05, mobil 36px): kirish "Xush kelibsiz", ro'yxat "Arxivga qoʻshiling". Subtitle (Literata 17px muted).
    3. Muvaffaqiyat xabari (50–52): `p-[18px_20px] border border-teal bg-card text-teal text-[15px] animate-hf-up` "✓ …".
    4. Maydonlar (`flex flex-col gap-4`). Label: mono 11px uppercase tracking .12em muted. Input: `border border-border rounded-[8px] bg-card px-4 py-3.5 text-[16px] text-fg outline-0 focus:border-line focus:shadow-[0_0_0_3px_var(--ph)]`.
       - (ro'yxat) **Ism-familiya yoki taxallus** → `displayName`.
       - **Email** (kirishda "Email yoki login" — eski akkauntlar username bilan kiradi). Xato bo'lsa chegara primary va ostida 13px primary "Toʻgʻri pochta manzilini kiriting".
       - **Parol**: o'ng tomonida "KOʻRSATISH / YASHIRISH" tugmasi (mono 12px muted). Kirishda label yonida "Parolni unutdingizmi?" → `/parolni-tiklash`.
       - (ro'yxat) **Parol kuchi** (67–69): 4 ta `h-[3px] rounded-[2px]` bar. Daraja `lvl = min(4, (len>=6)+(len>=10)+/[0-9]/+/[A-Z!@#$%]/)`, ranglar `[primary, gold, gold, teal][lvl-1]`. `src/lib/password-strength.ts`, unit testi bilan.
       - (ro'yxat) Checkbox (72): "Qoidalar va maxfiylik siyosati bilan tanishdim" (havolalar bilan), `accent-[var(--primary)]`. Belgilanmasa yuborilmaydi.
       - (ro'yxat) Turnstile (`interaction-only`).
    5. Submit (75): to'liq kenglikdagi `Pill primary` (`py-[17px] text-[16px] justify-center`, `active:translate-y-1 active:shadow-none`) "Kirish →" / "Roʻyxatdan oʻtish →". Yuborilayotganda disabled va "…".
    6. **"yoki" ajratgichi va Telegram/Google tugmalari dizaynda bor, lekin (D2) KO'RSATILMAYDI.**
    7. Almashtirish matni (81): "Akkauntingiz yoʻqmi? **Roʻyxatdan oʻtish**" (tagiga chizilgan primary tugma).
    8. Pastki izoh (84): mono 12px muted markazda — "Izoh qoldirish uchun akkaunt kerak. Maqola yozish — muharrir ruxsati bilan."
- [ ] **V2-P6.S11.3** **Mantiq:**
  - **Kirish:** client `fetch('/api/readers/login', { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify(input.includes('@') ? { email, password } : { username, password }) })`. Oldin `rateLimitLogin()` server action (IP bo'yicha) chaqiriladi. Muvaffaqiyatda "Kirdingiz. Bosh sahifaga oʻtilmoqda…" va `router.push(qaytish ?? '/')` + `router.refresh()`. Xatolar: 401 → "Email/login yoki parol notoʻgʻri", "tasdiqlanmagan" → "Avval emailingizni tasdiqlang" va "Havolani qayta yuborish" tugmasi, 423/lock → "Juda koʻp urinish. 10 daqiqadan soʻng urinib koʻring".
  - **Ro'yxatdan o'tish:** server action `registerReader` (P7.S1). Muvaffaqiyatda "Akkaunt yaratildi. Pochtangizni tasdiqlang." Email allaqachon band bo'lsa ham **bir xil** javob qaytadi.
- [ ] **V2-P6.S11.4** `tasdiqlash/page.tsx` — server: `payload.verifyEmail({ collection: 'readers', token })`. Natija kartochkasi xuddi shu split-layout'da: ✓ "Email tasdiqlandi" + "Kirish →" yoki "Havola eskirgan".
- [ ] **V2-P6.S11.5** `parolni-tiklash/page.tsx` (email → `POST /api/readers/forgot-password`, javob doim "Agar bu email roʻyxatda boʻlsa, havola yuborildi") va `parolni-tiklash/yangi/page.tsx` (yangi parol + takror + kuch ko'rsatkichi → `POST /api/readers/reset-password` `{ token, password }` → avtomatik kirish).
- [ ] **V2-P6.S11.6** Eski `kirish/page.tsx` (username/telefon) va `royxatdan-otish/page.tsx` qayta yoziladi yoki o'chiriladi. `royxatdan-otish` → `/kirish?rejim=royxat` redirect.

✅ **Qabul mezonlari:** ro'yxatdan o'tish → email → tasdiqlash → kirish → chiqish → parolni tiklash sikli ikki tilda ishlaydi. Eski akkaunt username bilan kiradi. Tab animatsiyasi silliq.

## V2-P6.S12 — Kabinet

Dizaynda yo'q — umumiy dizayn tilida quriladi.

- [ ] **V2-P6.S12.1** `kabinet/page.tsx` (dinamik; `getCurrentReader()`; kirmagan bo'lsa `redirect('/kirish?qaytish=/kabinet')`). Sarlavha: `Kicker` "Shaxsiy kabinet", H1 `displayName`, ostida mono "Aʼzo: oktabr 2026".
- [ ] **V2-P6.S12.2** Tab'lar (`CountTabs`, URL `?tab=`):
  - **Saqlanganlar** — `PostCard` grid'i, har kartochkada "olib tashlash" (✕).
  - **Izohlarim** — ro'yxat: maqola nomi, matn va holat pill'i (Moderatsiyada gold / Chop etildi teal / Rad etildi primary).
  - **Murojaatlarim** — `inquiries` (o'ziniki): mavzu, xabar, admin javobi (kartochka ichida `border-l-2 border-teal pl-4`) va holat.
  - **Sozlamalar** — ism, til (uz/kaa — email'lar shu tilda keladi), parolni o'zgartirish (joriy + yangi), **"Akkauntni oʻchirish"** (qizil outline; `Dialog` ichida taxallusni yozib tasdiqlash → `DELETE /api/readers/{id}` → logout). Email o'zgartirish **yo'q** (MVP).
  - Eski akkauntlar uchun (email bo'lmasa): tepada `border-dashed border-gold` banner "Parolni tiklay olishingiz uchun email qoʻshing" va email qo'shish formasi (server action: `email` saqlanadi va tasdiqlash emaili yuboriladi).

✅ **Qabul mezonlari:** hamma tab ishlaydi. Akkaunt o'chirilgach, qayta kirib bo'lmaydi va izohlar yo'qoladi.

## V2-P6.S13 — Aloqa (eski `/chat`) va Muallif bo'lish

- [ ] **V2-P6.S13.1** `aloqa/page.tsx`: chapda kicker "Aloqa", H1 "Biz bilan bogʻlaning", matn, `contactEmail` va Telegram. O'ngda forma kartochkasi (`bg-card border border-line p-7`): mavzu, xabar (≤2000), mehmon uchun ism va email ("javob shu pochtaga keladi"), Turnstile, "Yuborish →" (`Pill primary`). Kirgan foydalanuvchida ism va email avtomatik to'ladi va forma ostida "Mening murojaatlarim" (oxirgi 5 ta, admin javoblari bilan; to'liq ro'yxat kabinetda) chiqadi. Server action `submitInquiry` (P7.S4).
- [ ] **V2-P6.S13.2** `chat/page.tsx` → `aloqa` ga redirect (`next.config.ts` redirects). Eski `chat/page.tsx` o'chiriladi.
- [ ] **V2-P6.S13.3** `muallif-bolish/page.tsx`: yuqorida bosh sahifadagi CTA bloki uslubidagi qizil banner (sarlavha + matn). Ostida `Pages` dan "muallif-bolish" sahifasining matni (qoidalar: manbalar, litsenziya, tekshiruv jarayoni — bosh sahifadagi IV bo'limdagi 4 qadam qayta ishlatiladi). Pastda ariza formasi: ism, email, maktab va sinf (ixtiyoriy), qaysi mavzuda yozmoqchisiz (textarea), rozilik checkbox'i, Turnstile → `submitInquiry({ type: 'author_application' })`. Muvaffaqiyat: "Arizangiz qabul qilindi. Muharrir siz bilan bogʻlanadi."

## V2-P6.S14 — Mualliflar, statik sahifalar va xatolar

- [ ] **V2-P6.S14.1** `mualliflar/page.tsx` — kamida 1 ta chop etilgan maqolasi bor xodimlar: shaxslar sahifasidagidek grid, lekin portret o'rnida 120px doira avatar, ism, "N maqola". `mualliflar/[slug]/page.tsx` — avatar, ism, bio va maqolalar grid'i. **Email, sinf va maktab ko'rsatilmaydi.**
- [ ] **V2-P6.S14.2** `sahifa/[slug]/page.tsx` — `Pages`: kicker, H1, `RichText` (`prose-hisinf`, markazda `max-w-[680px]`).
- [ ] **V2-P6.S14.3** `not-found.tsx` — markazda: "404" (Literata 120px, primary), "Sahifa topilmadi" (Literata 48px), qidiruv pill'i va "Bosh sahifa →" (`Pill primary`). Fonda `DiamondDivider`. `error.tsx` (`'use client'`) — "Xatolik yuz berdi" va "Qayta urinish" (`reset()`).
- [ ] **V2-P6.S14.4** `loading.tsx` (ro'yxat sahifalari uchun) — `bg-hatch` skelet kartochkalar.

✅ **Qabul mezonlari:** footer'dagi barcha havolalar ishlaydigan sahifaga olib boradi (404 yo'q).

---

# V2-P7 — Interaktiv funksiyalar (server action'lar va API)

**Umumiy qoidalar** (har bir action uchun):
1. `'use server'`, fayllar `src/app/(frontend)/[locale]/actions/*.ts` da.
2. Kirish zod bilan tekshiriladi. Javob formati: `{ ok: true, … } | { ok: false, error: string, field?: string }`. Xato matni locale'ga mos (`getTranslations`).
3. Foydalanuvchi `getCurrentReader()` bilan **serverda** aniqlanadi. Client'dan kelgan `readerId` ga ishonilmaydi.
4. Rate limit va (yozish amallarida) Turnstile tekshiriladi.
5. `overrideAccess: true` faqat izoh bilan ishlatiladi (kolleksiyada `create: nobody` bo'lgan joylarda shart).

## V2-P7.S1 — Ro'yxatdan o'tish

- [ ] **V2-P7.S1.1** `actions/auth.ts` → `registerReader({ displayName, email, password, agree, turnstileToken, locale })`:
  1. zod: `displayName` 2–40 (harf, raqam, bo'sh joy, `-`, `.`, `ʻ`, `ʼ`), `email`, `password` ≥ 8, `agree === true`.
  2. `verifyTurnstile`, `limiters.register.limit(ip)`.
  3. `moderateText(displayName)` — haqoratli ism → xato.
  4. `payload.create({ collection: 'readers', data: { displayName, email, password, locale, acceptedTermsAt: now }, overrideAccess: true })` (`// overrideAccess: readers.create = staff only`). Payload tasdiqlash emailini o'zi yuboradi.
  5. Email band bo'lsa (unique xato) ham `{ ok: true }` qaytadi (email ro'yxatini aniqlab bo'lmasligi uchun).
- [ ] **V2-P7.S1.2** `rateLimitLogin()` — login oldidan chaqiriladi (IP, 10/10 daq). Limit oshsa `{ ok:false }` qaytadi va client so'rov yubormaydi.
- [ ] **V2-P7.S1.3** `resendVerification(email)` — `limiters.register`, so'ng Payload'ning verify emailini qayta yuborish (Payload 3'da tayyor operatsiya bo'lmasa: yangi `_verificationToken` yaratib, `payload.sendEmail` bilan shablonni yuboring — hujjatni tekshiring).

## V2-P7.S2 — Izohlar va like'lar

- [ ] **V2-P7.S2.1** `actions/comments.ts` → `createComment({ context, postId?, parentId?, body, turnstileToken })`:
  1. Reader bo'lishi, `_verified` va `!isBanned` bo'lishi shart.
  2. Turnstile va `limiters.comment.limit(reader.id)`.
  3. zod: `body` 3–1000.
  4. `context === 'post'`: post mavjud, `_status === 'published'` va `commentsEnabled`. `context === 'home'`: `homePage.showHomeComments`.
  5. `parentId` bo'lsa: parent shu kontekst/postga tegishli, `approved` va o'zi javob emas.
  6. `moderateText(body)` → `flagged`, `flagReason` (eski reja `docs/plan/P10-oquvchilar.md` P10.S5.3: taqiqlangan so'zlar, havolalar, telefon va email naqshlari).
  7. `payload.create({ collection: 'comments', data: { context, post, parent, reader: reader.id, authorName: reader.displayName, body, status: 'pending', flagged, flagReason }, overrideAccess: true })`.
  8. Javob: `{ ok: true, comment: { id, body, createdAt } }` (client "moderatsiyada" holatida ko'rsatadi).
- [ ] **V2-P7.S2.2** `toggleLike(commentId)` → reader majburiy, `limiters.like`. `comment-likes` da bor bo'lsa o'chiriladi va `likesCount - 1`, yo'q bo'lsa yaratiladi va `+1` (`payload.update` bilan, `overrideAccess: true`). Unique indeks dublikatdan himoya qiladi. Javob: `{ liked, likesCount }`. Client optimistik yangilaydi (`useOptimistic`).
- [ ] **V2-P7.S2.3** `getMyLikes(commentIds)` → reader like qilgan izohlar ID'lari (client mount'da chaqiradi).
- [ ] **V2-P7.S2.4** `src/lib/moderation.ts` + `src/lib/moderation-words.ts` — unit testlari bilan.

## V2-P7.S3 — Saqlash (bookmark)

- [ ] **V2-P7.S3.1** `actions/bookmarks.ts` → `toggleBookmark(postId)` va `getBookmarkState(postId)` — eski reja P10.S4.1 bo'yicha. `BookmarkButton.tsx`: maqola sahifasidagi ❏ tugma (P6.S5.3) va kabinet. Kirmagan foydalanuvchiga toast "Saqlash uchun kiring" va kirish havolasi.

## V2-P7.S4 — Murojaatlar (aloqa va muallif arizasi)

- [ ] **V2-P7.S4.1** `actions/inquiries.ts` → `submitInquiry({ type, name?, email?, subject?, message, school?, topic?, turnstileToken })`:
  - Reader bo'lsa: `reader`, `name = displayName`, `email = reader.email`.
  - Mehmon bo'lsa: `name` va `email` majburiy (javob emailga keladi).
  - Turnstile va `limiters.contact`. `message` 5–2000.
  - `payload.create({ collection: 'inquiries', …, overrideAccess: true })`. Admin'larga bildirishnoma emaili yuboriladi (ixtiyoriy).
- [ ] **V2-P7.S4.2** `getMyInquiries()` → reader'ning murojaatlari (`overrideAccess: false, user: reader`).

## V2-P7.S5 — Ko'rishlar hisoblagichi (`/api/track`)

- [ ] **V2-P7.S5.1** `src/app/api/track/route.ts` (`POST`, body `{ postId?: number, locale: 'uz'|'kaa' }`):
  1. Botlarni o'tkazib yuborish: `user-agent` da `bot|crawl|spider|preview` bo'lsa → 204.
  2. `limiters.track.limit(ip)`.
  3. **Takrorlanishga qarshi:** `dedupeKey = sha256(ip + ua + postId + day + TRACK_SALT)` → Upstash `SET key 1 NX EX 86400`. Allaqachon bor bo'lsa → 204 (bir kishi kuniga bir marta hisoblanadi). Upstash bo'lmasa (dev) → har doim hisoblanadi.
  4. **Atomik upsert** (Payload'da atomik increment yo'q, shuning uchun SQL ishlatiladi):
     ```ts
     import { sql } from '@payloadcms/db-postgres'
     const db = payload.db.drizzle
     await db.execute(sql`
       INSERT INTO "daily_stats" ("day", "locale", "post_id", "views", "updated_at", "created_at")
       VALUES (${day}, ${locale}, ${postId ?? null}, 1, now(), now())
       ON CONFLICT ("day", "locale", "post_id") DO UPDATE SET "views" = "daily_stats"."views" + 1, "updated_at" = now()`)
     if (postId) await db.execute(sql`UPDATE "posts" SET "views" = COALESCE("views", 0) + 1 WHERE "id" = ${postId}`)
     ```
     **Jadval va ustun nomlarini** (`daily_stats`, `post_id`, `locale` turi — enum bo'lishi mumkin) P3 migratsiyasidan tekshirib oling. `post_id` NULL bo'lsa Postgres unique indeksi NULL'larni teng deb hisoblamaydi. Shuning uchun sahifa ko'rishlari (`postId` yo'q) uchun `post_id = 0` emas — **alohida** unique indeks kerak bo'ladi. MVP'da faqat maqola ko'rishlari hisoblanadi (`postId` majburiy).
  5. Javob 204.
- [ ] **V2-P7.S5.2** Draft rejimida va xodim kirgan bo'lsa (cookie bo'yicha aniqlab bo'lmaydi — e'tiborsiz qoldiring) — faqat draft'da yuborilmaydi.

## V2-P7.S6 — Dayjest obunasi (footer formasi)

- [ ] **V2-P7.S6.1** `actions/subscribe.ts` va `obuna/tasdiqlash`, `obuna/bekor` sahifalari — eski reja `docs/plan/P11-telegram-email.md` P11.S3.3–S3.6 bo'yicha **aynan**. `SubscribeForm` (footer dizayni: pastki chiziqli input + qizil pill).
- [ ] **V2-P7.S6.2** Haftalik dayjest (`cron/daily`) — eski reja P11.S1 va P11.S4. Telegram avto-post — ixtiyoriy (V2-P11).

## V2-P7.S7 — Qidiruv API v2 (`/api/search`)

- [ ] **V2-P7.S7.1** `src/app/api/search/route.ts` ni qayta yozing. `GET ?q=&locale=&type=all|post|person|period|media|place&limit=10`:
  - `nq = normalizeSearch(q)`; uzunligi 2 dan kam bo'lsa → bo'sh natija.
  - `limiters.search.limit(ip)`.
  - Har tur uchun **bazada** qidiriladi (`Promise.all`), `overrideAccess: false`:
    - post: `posts`, `where: { searchText: { like: nq } }`, `select: { title, slug, excerpt, period, author }`.
    - person: `persons` (`searchText`), period: `periods` (`title like q`), media: `archive-items` (`searchText`), place: `places` (`searchText`).
  - Har natija: `{ type, title, sub, href }`. `sub`: post → "Davr · Muallif", person → "yillar · rol", period → `yearsLabel`, media → "Tur · manba", place → "Tur · fromLabel". `href` locale bilan.
  - Javob: `{ q, counts: { all, post, … }, results: [...] }`. `Cache-Control: public, s-maxage=60`.
  - **Muhim:** `src/app/api/search` Payload'ning `/api/[...slug]` catch-all'idan oldin ishlaydi (statik yo'l ustun). Payload'da `search` nomli kolleksiya **yaratmang**.
- [ ] **V2-P7.S7.2** `buildSearchText` hook'i barcha qidiriladigan kolleksiyalarga ulanganini tekshiring (P3). Kerak bo'lsa `scripts/v2/11-rebuild-search.ts` ni qayta ishga tushiring.

✅ **V2-P7 qabul mezonlari:** hamma action'lar uchun unit/int testlar bor. Rate limit oshganda xabar chiqadi. Turnstile tokenisiz yozish rad etiladi.

---

# V2-P8 — i18n, SEO, tezlik va accessibility

## V2-P8.S1 — Tarjima fayllari

- [ ] **V2-P8.S1.1** `messages/uz.json` va `messages/kaa.json` ni **6-bo'limdagi** tuzilma bilan almashtiring. Hozirgi fayllardagi kalitlar ishlatilmay qolsa, o'chiriladi (`grep -rn "t('" src` bilan tekshiring).
- [ ] **V2-P8.S1.2** `tests/unit/messages.test.ts` — ikki fayldagi kalitlar (ichma-ich) aynan bir xil.
- [ ] **V2-P8.S1.3** `docs/kaa-review.md` — 6-bo'limda `⚠` bilan belgilangan (dizayndan olinmagan) kaa matnlar ro'yxati. Ona tili egasi tekshirgach, ro'yxatdan o'chiriladi.
- [ ] **V2-P8.S1.4** Komponentlarda qattiq yozilgan matn yo'qligini tekshiring: `grep -rnE ">[A-ZʻʼOʻGʻ][a-zʻʼ]+ [a-z]" src/components src/app --include=*.tsx`. Topilganlarni (admin komponentlaridan tashqari) messages'ga ko'chiring.

## V2-P8.S2 — SEO

- [ ] **V2-P8.S2.1** Eski reja `docs/plan/P09-qidiruv-seo.md` P9.S3–S5 to'liq bajariladi (`buildMetadata`, hreflang, tarjimasiz kaa uchun `noindex`, `sitemap.ts`, `robots.ts`, JSON-LD: `Article`, `Person`, `Event` (xronologiya voqealari uchun ixtiyoriy), `BreadcrumbList`, `WebSite` + `SearchAction`). Title shabloni: `'%s — hisinf.uz'`.
- [ ] **V2-P8.S2.2** OG rasm: `src/app/(frontend)/[locale]/opengraph-image.tsx` (`next/og`) — pergament fon, `DiamondDivider`, sarlavha (Literata, `latin-ext` .ttf `fetch` bilan yuklanadi) va "hisinf.uz". Maqola sahifasida `coverImage` bo'lsa o'sha ishlatiladi.
- [ ] **V2-P8.S2.3** Eski URL'lar uchun redirect'lar (`next.config.ts`): `/:locale/chat` → `/:locale/aloqa`, `/:locale/royxatdan-otish` → `/:locale/kirish?rejim=royxat`, `/:locale/davrlar(/:slug)` → xronologiya, `/:locale/admin*` → `/admin`.

## V2-P8.S3 — Tezlik

- [ ] **V2-P8.S3.1** Maqsadlar (prod, mobil, Lighthouse): Performance ≥ 85, LCP < 2.5s, CLS < 0.1, INP < 200ms — bosh sahifa, maqolalar, maqola, xronologiya, shaxslar sahifalari uchun.
- [ ] **V2-P8.S3.2** Shriftlar: faqat kerakli og'irliklar (P2.S1). Hero va muqova rasmlarida `priority`, qolganlarida lazy.
- [ ] **V2-P8.S3.3** Client JS: Leaflet faqat xarita va `MapEmbed`'da, lightbox — `dynamic()` bilan. `pnpm build` chiqishida bosh sahifa First Load JS ≤ 160 kB.
- [ ] **V2-P8.S3.4** Qog'oz teksturasi (`--paper`) SVG filtri katta ekranlarda og'ir bo'lishi mumkin. Lighthouse'da "Rendering" muammosi chiqsa, uni 220×220 PNG'ga (`public/paper.png`, ≤ 8 KB) almashtiring.
- [ ] **V2-P8.S3.5** Marquee, aylanuvchi muhr va `hf-float` — faqat `transform` animatsiyasi. Ular ekrandan tashqarida bo'lsa ham ishlaydi, lekin arzon. Reduced-motion'da o'chadi.

## V2-P8.S4 — Accessibility

- [ ] **V2-P8.S4.1** Eski reja `docs/plan/P12-sifat-xavfsizlik.md` P12.S4 bo'yicha. Qo'shimcha tekshiruvlar:
  - **Kontrast:** `text-muted` (#6b5d4f) `bg-surface-2` (#efe6d4) ustida ≥ 4.5 bo'lishi kerak — tekshiring. `text-gold` faqat bezak yoki katta matnda ishlatiladi. Footer'dagi `opacity-55` sarlavhalar (qora fon ustida) ≥ 4.5 ekanini tekshiring, bo'lmasa `opacity-70` qiling.
  - **Pero-kursor** ko'rish qiyinlashtirmasin: kursor 28px, uchi (hotspot) `4 24`. Foydalanuvchi uchun o'chirish imkoniyati — footer'da "Effektlarni oʻchirish" kichik tugmasi (`localStorage('hisinf:fx')` → `fx-cursor` va `Reveal` o'chadi).
  - Drawer, lightbox va ⌘K: fokus tuzog'i, `Esc`, ochilganda fokus birinchi elementga, yopilganda tetikka qaytadi (Radix buni ta'minlaydi — tekshiring).
  - Davr paneli va tab'lar: `role="tablist"`.
  - Footnote tugmalari: `aria-label="Izoh 1"`.
  - Xarita: pin'lar klaviaturada ham tanlanishi kerak — chapdagi ro'yxat bu vazifani bajaradi (ro'yxat → xarita sinxron).

---

# V2-P9 — Testlar va QA

## V2-P9.S1 — Unit testlar (`tests/unit/`)
- [ ] **V2-P9.S1.1** Barcha `src/lib/*` sof funksiyalari: `format-year`, `format-date`, `relative-time`, `slugify`, `normalize-search`, `highlight`, `workflow`, `lexical-walk`, `lexical-text`, `text-to-lexical`, `safe-url`, `format-source`, `citation`, `alphabet`, `resolve-link`, `moderation`, `password-strength`, `period-color`, `initials`, `avatar-color`, `messages` (kalitlar mosligi). `src/lib` qamrovi ≥ 90%.

## V2-P9.S2 — Integratsion testlar (`tests/int/`)
- [ ] **V2-P9.S2.1** P4.S8 dagi 12 ta test.
- [ ] **V2-P9.S2.2** Action'lar: `registerReader` (dublikat email → baribir ok), `createComment` (bloklangan reader → xato; havolali matn → `flagged`), `toggleLike` (ikki marta → 0), `submitInquiry` (mehmon email'siz → xato), `/api/track` (bir xil kalit ikki marta → 1 ta ko'rish), `/api/search` (apostrof variantlari bir xil).
- [ ] **V2-P9.S2.3** Migratsiya skriptlari: `textToLexical` natijasi `convertLexicalToPlaintext` (yoki `extractPlainText`) bilan asl matnga qaytadi.

## V2-P9.S3 — E2E (Playwright, `tests/e2e/`)
- [ ] **V2-P9.S3.1** `home.spec.ts` — uz/kaa, `<html lang>`, hero, "Bugun tarixda", marquee, 10 ta davr kartochkasi.
- [ ] **V2-P9.S3.2** `header.spec.ts` — til toggle yo'lni saqlaydi; tema toggle reload'dan keyin saqlanadi (`html[data-theme=dark]`); 390px burger va submenu; ⌘K ochiladi va natija tanlanadi.
- [ ] **V2-P9.S3.3** `posts.spec.ts` — kategoriya + davr + qidiruv filtrlari URL'ga yoziladi; grid/list; sahifalash; bo'sh holat.
- [ ] **V2-P9.S3.4** `post.spec.ts` — mundarija bosilganda skroll; A+ shriftni kattalashtiradi va reload'da saqlanadi; footnote popover; manbalar qutisi; izoh yozish (test reader) → "Moderatsiyada"; like.
- [ ] **V2-P9.S3.5** `timeline.spec.ts` — davr tanlash (klik, `→` tugma, URL), voqealar soni o'zgaradi.
- [ ] **V2-P9.S3.6** `persons.spec.ts` — rol va harf filtri; drawer ochiladi/yopiladi; orqaga tugmasi.
- [ ] **V2-P9.S3.7** `archive.spec.ts` — tur filtri; lightbox `→`/`Esc`.
- [ ] **V2-P9.S3.8** `map.spec.ts` — xarita yuklanadi; slayder pin'lar sonini o'zgartiradi; ro'yxatdan tanlash info kartochkani ochadi.
- [ ] **V2-P9.S3.9** `search.spec.ts` — `oʻzbek`/`o'zbek` bir xil birinchi natija; highlight.
- [ ] **V2-P9.S3.10** `auth.spec.ts` — ro'yxatdan o'tish (test muhitida Local API bilan `_verified: true`) → kirish → kabinet → saqlash → chiqish; eski username bilan kirish.
- [ ] **V2-P9.S3.11** `admin.spec.ts` — author: post yozish → "Tekshiruvga yuborish"; editor: "Tasdiqlash" → "Chop etish" → saytda ko'rinadi; dashboard'da izohni tasdiqlash.
- [ ] **V2-P9.S3.12** `security.spec.ts` — soxta `hisinf_reader_session` cookie bilan hech narsa ochilmaydi; `/api/readers` mehmonga yopiq; o'chirilgan `/api/admin/*` 404.

## V2-P9.S4 — Vizual solishtirish
- [ ] **V2-P9.S4.1** `tests/visual/` — Playwright `toHaveScreenshot` bilan har asosiy sahifa uchun 1440 va 390 kenglikda, light va dark temada skrinshot (seed ma'lumot bilan, animatsiyalar `reducedMotion: 'reduce'` bilan o'chirilgan). Birinchi ishga tushirishda "golden" rasmlar yaratiladi va qo'lda dizayn bilan solishtiriladi. Keyingi o'zgarishlarda regressiya aniqlanadi.
- [ ] **V2-P9.S4.2** Qo'lda tekshiruv ro'yxati `docs/qa-checklist.md`: har sahifa × 3 kenglik × 2 tema × 2 til — jadval va ✅ belgilari.

✅ **V2-P9 qabul mezonlari:** barcha testlar yashil, `docs/qa-checklist.md` to'ldirilgan.

---

# V2-P10 — Prod'ga chiqarish va ma'lumot ko'chirish

## V2-P10.S1 — Tayyorgarlik
- [ ] **V2-P10.S1.1** Neon: `main` dan yangi backup branch `backup-<sana>-pre-v2-launch`.
- [ ] **V2-P10.S1.2** Vercel Production env'ga yangi kalitlarni qo'shing: `PREVIEW_SECRET`, `CRON_SECRET`, `TRACK_SALT`, Turnstile, Upstash, `RESEND_API_KEY`, `EMAIL_FROM`, `DIGEST_DAILY_LIMIT`. R2 CORS'ga prod domen kiritilgan bo'lsin.
- [ ] **V2-P10.S1.3** "Texnik ishlar" e'loni (Telegram kanal): 30 daqiqa davomida admin'da tahrir qilinmasin.

## V2-P10.S2 — Ko'chirish tartibi (prod)
- [ ] **V2-P10.S2.1** `v2` → `main` PR. CI yashil, preview'da QA o'tgan.
- [ ] **V2-P10.S2.2** Merge → Vercel build (`pnpm ci` → `payload migrate` → `v2_additive` qo'llanadi).
- [ ] **V2-P10.S2.3** Darhol, ketma-ket, **prod `DATABASE_URI`** bilan lokal terminaldan: `scripts/v2/02` → `03` → `04` → `05` → `06` → `08` → `09` → `10` → `11` → `01` (tekshiruv). Har birini avval `--dry-run` bilan ishga tushiring. Natijalar `docs/migration-log.md` ga yoziladi.
- [ ] **V2-P10.S2.4** Tutun testi (smoke test): bosh sahifa, 3 ta eski maqola (matn joyida), eski reader kirishi, admin kirishi, izoh yozish, qidiruv.
- [ ] **V2-P10.S2.5** `07-reader-admins-report.ts` ro'yxati bo'yicha xodim akkauntlarini taklif qiling (P5.S7).

## V2-P10.S3 — Eskirgan maydonlarni o'chirish (1–2 hafta barqaror ishlagandan keyin)
- [ ] **V2-P10.S3.1** Yana bir backup branch oling.
- [ ] **V2-P10.S3.2** Kodda quyidagilarni olib tashlang: `posts.content`, `posts.coverImageUrl`, `posts.language`, `readers.firstName/lastName/phone/role/displayPassword`, `media.alt`, `inquiries.phone`, `inquiries.repliedBy` (eski text). `getAlt` dan `alt` fallback'ini olib tashlang. `next.config.ts` → `images.remotePatterns` dan `images.unsplash.com` va `raw.githubusercontent.com` ni olib tashlang (agar ishlatilmasa).
- [ ] **V2-P10.S3.3** `pnpm migrate:create v2_drop_legacy` → faylda **faqat** shu ustunlar/jadvallar o'chirilayotganini tekshiring → deploy.
- [ ] **V2-P10.S3.4** `hisinf_reader_session` bilan bog'liq qolgan kodni o'chiring.

## V2-P10.S4 — Qaytarish rejasi (rollback)
- [ ] **V2-P10.S4.1** `docs/RUNBOOK.md` ga yozing: muammo bo'lsa (1) Vercel → oldingi deploy'ni "Promote to Production"; (2) DB'ni backup branch'dan tiklash (Neon → branch → "Restore" yoki `DATABASE_URI` ni backup branch'ga vaqtincha almashtirish); (3) qaysi skriptlar qayta ishga tushirilishi mumkin (hammasi idempotent).

## V2-P10.S5 — Launch'dan keyin
- [ ] **V2-P10.S5.1** Eski reja `docs/plan/P13-ishga-tushirish.md` P13.S2 (haftalik DB backup GitHub Actions), P13.S6 (launch checklist) va P13.S7 (2 haftalik kuzatuv) bajariladi.
- [ ] **V2-P10.S5.2** Google Search Console: yangi sitemap. Eski URL'lar redirect bo'layotganini tekshiring.
- [ ] **V2-P10.S5.3** Logotip: `docs/design/Logo prompt.md` bo'yicha yaratilgan SVG → `Logo`/`LogoMark`/`AdminLogo`/`favicon.svg` ichi almashtiriladi.

---

# V2-P11 — Ixtiyoriy (MVP'dan keyin)

| # | Ish | Manba |
|---|-----|-------|
| 1 | Telegram kanalga avto-post | eski reja P11.S2 |
| 2 | "Bugun tarixda" kunlik Telegram posti | eski reja P14 #3 |
| 3 | Testlar (viktorinalar) maqola oxirida | eski reja P14 #1 |
| 4 | Atamalar lug'ati (tooltip) | eski reja P14 #2 |
| 5 | Xaritada tarixiy chegaralar (GeoJSON davr qatlamlari) — dizayndagi "tarixiy xarita qatlami" g'oyasi | eski reja P14 #6 |
| 6 | MapLibre + o'zimizning "gravyura" vektor uslubi (OSM raster + CSS filtr o'rniga) | dizayn izohi (`Xarita.dc.html` 38) |
| 7 | Admin'da ⌘K buyruqlar paneli (dizayn: AdminSidebar 22–24) | — |
| 8 | Mahalliy server (agar qonun talab qilsa) | eski reja README 3.3 |

---

## 6. Tarjima fayllari (to'liq tuzilma)

**Manba:** dizayn fayllaridagi `renderVals()` lug'atlari. **Dizayndan olinmagan kaa qiymatlari** (6.3-ro'yxat) ona tili egasi tomonidan tekshiriladi. `{n}`, `{total}`, `{period}` — ICU parametrlari (`t('posts.showing', { n, total })`).

### 6.1 `messages/uz.json`
```json
{
  "common": {
    "siteName": "hisinf.uz", "historicalInfo": "historical info", "min": "daq", "minutes": "{n} daq",
    "all": "Barchasi", "prev": "Oldingi", "next": "Keyingi", "close": "Yopish", "send": "Yuborish",
    "loading": "Yuklanmoqda…", "copy": "Nusxa olish", "copied": "Nusxa olindi", "readMore": "Batafsil →",
    "skipToContent": "Asosiy kontentga oʻtish", "fxOff": "Effektlarni oʻchirish", "fxOn": "Effektlarni yoqish",
    "uzOnly": "UZ"
  },
  "header": {
    "tagline": "Oʻzbekiston va Qoraqalpogʻiston tarixi", "edition": "Tekshirilgan maqolalar",
    "signin": "Kirish", "search": "Qidiruv", "menu": "Menyu", "account": "Kabinet",
    "saved": "Saqlanganlar", "logout": "Chiqish", "editorial": "Tahririyat"
  },
  "nav": { "home": "Bosh sahifa", "posts": "Maqolalar", "periods": "Davrlar", "persons": "Shaxslar", "archive": "Media arxiv", "map": "Xarita", "timeline": "Xronologiya" },
  "theme": { "toggle": "Temani almashtirish" },
  "lang": { "uz": "UZ", "kaa": "KAA", "label": "Til" },
  "footer": {
    "about": "Maktab oʻquvchilari va oʻqituvchilar uchun tekshirilgan tarixiy maqolalar, davrlar, shaxslar va arxiv hujjatlari.",
    "sections": "Boʻlimlar", "project": "Loyiha",
    "digestTitle": "Haftalik dayjest", "digestText": "Har juma eng yaxshi maqolalar pochtangizga.",
    "subscribe": "Obuna", "emailPh": "email@manzil.uz", "subscribed": "Pochtangizni tekshiring — tasdiqlash havolasini yubordik",
    "rights": "Barcha huquqlar himoyalangan", "note": "Har bir maqola muharrir tekshiruvidan oʻtadi"
  },
  "home": {
    "kicker": "I · Tarixiy maʼlumotlar portali", "h1a": "Ming yillik tarix,", "h1b": "sahifama-sahifa.",
    "sub": "Maktab oʻquvchilari va oʻqituvchilar uchun Oʻzbekiston va Qoraqalpogʻiston tarixi boʻyicha muharrir tekshirgan maqolalar, davrlar va arxiv hujjatlari.",
    "cta1": "Maqolalarni oʻqish", "cta2": "Xronologiya", "searchPh": "Shaxs, voqea yoki davrni qidiring",
    "onThisDay": "Bugun tarixda", "readPost": "Maqolani oʻqish →",
    "sealTop": "MUHR", "sealBottom": "TARIXIY DAVR",
    "periodsKicker": "Davrlar", "periodsTitle": "Tosh davridan mustaqillikkacha", "openTimeline": "Xronologiyani ochish →",
    "picksKicker": "Tanlangan maqolalar", "picksTitle": "Muharrir tavsiyasi", "allPosts": "Barcha maqolalar →",
    "aboutKicker": "Platforma haqida", "aboutTitle": "Har bir maqola uch qoʻldan oʻtadi",
    "aboutText": "hisinf.uz — maktab oʻquvchilari va oʻqituvchilar uchun oʻzbek va qoraqalpoq tillaridagi tarixiy maʼlumotlar portali. Maqolalarni mualliflar yozadi, muharrir manbalar boʻyicha tekshiradi, shundan keyingina ular saytda chop etiladi.",
    "step1t": "Muallif yozadi", "step1d": "Ochiq manbalar va arxiv hujjatlari asosida maqola tayyorlanadi.",
    "step2t": "Muharrir tekshiradi", "step2d": "Faktlar, sanalar va manbalar havolasi birma-bir koʻrib chiqiladi.",
    "step3t": "Chop etiladi", "step3d": "Maqola oʻzbek va qoraqalpoq tillarida saytga joylanadi.",
    "step4t": "Oʻquvchi muhokama qiladi", "step4d": "Izohlar moderatsiyadan oʻtib, maqola ostida koʻrinadi.",
    "personsKicker": "Tarixiy shaxslar", "personsTitle": "Tarixni yaratganlar", "allPersons": "Barcha shaxslar →",
    "ctaKicker": "Muallif boʻlish", "ctaTitle": "Oʻz hududingiz tarixini yozing",
    "ctaText": "Maktab oʻquvchilari va oʻqituvchilar muallif boʻlishi mumkin. Maqolangizni muharrir tekshiradi va manbalar boʻyicha maslahat beradi.",
    "ctaButton": "Ariza qoldirish →", "commentsKicker": "Muhokama", "commentsTitle": "Fikr almashamiz"
  },
  "posts": {
    "kicker": "Arxiv · Barcha maqolalar", "title": "Maqolalar", "total": "maqola", "authors": "muallif",
    "search": "Maqola nomi yoki muallif…", "sNew": "Eng yangi", "sPop": "Eng koʻp oʻqilgan", "sOld": "Eng eski",
    "reset": "Filtrni tozalash", "emptyT": "Hech narsa topilmadi", "emptyD": "Boshqa davr yoki soʻzni tanlab koʻring.",
    "allPeriods": "Barcha davrlar", "showing": "Koʻrsatilmoqda: {n} / {total}", "more": "Yana",
    "grid": "Jadval koʻrinishi", "list": "Roʻyxat koʻrinishi", "sort": "Saralash"
  },
  "post": {
    "posts": "Maqolalar", "checked": "Tekshirdi", "toc": "Mundarija", "sources": "Manbalar", "related": "Bogʻliq",
    "footnotes": "Sahifa osti izohlari", "footnote": "Izoh {n}", "backToText": "Matnga qaytish",
    "prev": "Oldingi maqola", "next": "Keyingi maqola", "timelineOf": "{period} xronologiyasi →",
    "fontSmaller": "Shriftni kichraytirish", "fontLarger": "Shriftni kattalashtirish",
    "save": "Saqlash", "saved": "Saqlandi", "loginToSave": "Saqlash uchun kiring",
    "translationMissing": "Bu maqola hali qoraqalpoq tiliga tarjima qilinmagan — oʻzbekcha matn koʻrsatilmoqda.",
    "cite": "Iqtibos keltirish", "tags": "Teglar", "share": "Ulashish", "accessed": "murojaat sanasi"
  },
  "comments": {
    "title": "Izohlar", "ph": "Fikringizni yozing…", "rules": "Izohlar moderatsiyadan oʻtadi", "send": "Yuborish",
    "pending": "Moderatsiyada", "reply": "Javob berish", "staff": "Muharrir",
    "loginToComment": "Izoh qoldirish uchun kiring", "loginToLike": "Yoqtirish uchun kiring",
    "disabled": "Bu maqolada izohlar oʻchirilgan", "sent": "Izohingiz moderatsiyadan soʻng koʻrinadi",
    "justNow": "hozir", "minutesAgo": "{n} daqiqa oldin", "hoursAgo": "{n} soat oldin", "daysAgo": "{n} kun oldin"
  },
  "timeline": {
    "kicker": "Davrlar", "title": "Xronologiya",
    "sub": "Oʻnta tarixiy davr — tosh davridan mustaqillikkacha. Davrni tanlang va voqealarni koʻring.",
    "posts": "maqola", "persons": "shaxs", "readPost": "Maqolani oʻqish →", "details": "Batafsil →",
    "seeOnTimeline": "Xronologiyada koʻrish →", "prevEra": "Oldingi davr", "nextEra": "Keyingi davr", "engraving": "gravyura"
  },
  "persons": {
    "kicker": "Tarixiy shaxslar", "title": "Shaxslar",
    "sub": "Olimlar, hukmdorlar, shoirlar va sarkardalar — tarixni yaratganlar haqida qisqa maʼlumot va maqolalar.",
    "articles": "Maqolalar", "fullPage": "Toʻliq sahifa →", "portrait": "gravyura portret", "letter": "Harf",
    "role": { "scholar": "Olim", "ruler": "Hukmdor", "poet": "Shoir", "commander": "Sarkarda", "enlightener": "Maʼrifatparvar", "statesman": "Davlat arbobi", "other": "Boshqa" }
  },
  "archive": {
    "kicker": "Fotosuratlar, hujjatlar, xaritalar", "title": "Media arxiv",
    "kind": { "photo": "Foto", "document": "Hujjat", "map": "Xarita", "engraving": "Gravyura", "video": "Video", "manuscript": "Qoʻlyozma", "newspaper": "Gazeta" },
    "year": "Yil", "source": "Manba", "license": "Litsenziya", "seeInPost": "Maqolada koʻrish", "download": "Yuklab olish", "openPdf": "PDF'ni ochish", "loadMore": "Yana yuklash"
  },
  "map": {
    "kicker": "Tarixiy joylar", "title": "Xarita", "byPeriod": "Davr boʻyicha", "postsCount": "{n} ta maqola →",
    "zoomIn": "Yaqinlashtirish", "zoomOut": "Uzoqlashtirish", "caption": "Amudaryo · Orol boʻyi · Movarounnahr", "list": "Roʻyxat",
    "type": { "palace": "Saroy", "fortress": "Qalʼa", "city": "Shahar", "square": "Maydon", "port": "Port", "mausoleum": "Maqbara", "mosque": "Masjid", "archaeological": "Yodgorlik", "battle": "Jang joyi", "natural": "Tabiiy obyekt", "other": "Boshqa" }
  },
  "search": {
    "kicker": "Qidiruv", "ph": "Nimani qidiryapsiz?", "popular": "Koʻp qidiriladi", "none": "«{q}» boʻyicha hech narsa topilmadi",
    "allResults": "Barcha natijalar →", "esc": "ESC",
    "type": { "all": "Barchasi", "post": "Maqola", "person": "Shaxs", "period": "Davr", "media": "Media", "place": "Joy" }
  },
  "auth": {
    "signin": "Kirish", "signup": "Roʻyxatdan oʻtish", "name": "Ism-familiya yoki taxallus", "email": "Elektron pochta",
    "emailOrLogin": "Email yoki login", "pass": "Parol", "passRepeat": "Parolni takrorlang", "forgot": "Parolni unutdingizmi?",
    "agree": "Qoidalar va maxfiylik siyosati bilan tanishdim", "emailErr": "Toʻgʻri pochta manzilini kiriting",
    "show": "KOʻRSATISH", "hide": "YASHIRISH", "welcome": "Xush kelibsiz", "join": "Arxivga qoʻshiling",
    "signinSub": "Akkauntingizga kiring.", "signupSub": "Maqolalarni saqlang va izoh qoldiring.",
    "doneIn": "Kirdingiz. Bosh sahifaga oʻtilmoqda…", "doneUp": "Akkaunt yaratildi. Pochtangizni tasdiqlang.",
    "haveAccount": "Akkauntingiz bormi?", "noAccount": "Akkauntingiz yoʻqmi?",
    "note": "Izoh qoldirish uchun akkaunt kerak. Maqola yozish — muharrir ruxsati bilan.",
    "wrongCreds": "Email/login yoki parol notoʻgʻri", "notVerified": "Avval emailingizni tasdiqlang",
    "resend": "Havolani qayta yuborish", "locked": "Juda koʻp urinish. 10 daqiqadan soʻng urinib koʻring",
    "verifyOk": "Email tasdiqlandi. Endi kirishingiz mumkin.", "verifyFail": "Havola eskirgan yoki notoʻgʻri.",
    "resetTitle": "Parolni tiklash", "resetSent": "Agar bu email roʻyxatda boʻlsa, havola yuborildi.",
    "newPassTitle": "Yangi parol", "mismatch": "Parollar mos emas", "passWeak": "Parol kamida 8 belgi boʻlsin",
    "quoteSource": "Xalq maqoli"
  },
  "account": {
    "kicker": "Shaxsiy kabinet", "memberSince": "Aʼzo: {date}", "saved": "Saqlanganlar", "myComments": "Izohlarim",
    "myInquiries": "Murojaatlarim", "settings": "Sozlamalar", "remove": "Olib tashlash", "status": { "pending": "Moderatsiyada", "approved": "Chop etildi", "rejected": "Rad etildi", "spam": "Rad etildi" },
    "language": "Xatlar tili", "changePass": "Parolni oʻzgartirish", "currentPass": "Joriy parol",
    "deleteAccount": "Akkauntni oʻchirish", "deleteConfirm": "Tasdiqlash uchun ismingizni yozing", "addEmail": "Parolni tiklay olishingiz uchun email qoʻshing",
    "save": "Saqlash", "emptySaved": "Hali hech narsa saqlanmagan"
  },
  "contact": {
    "kicker": "Aloqa", "title": "Biz bilan bogʻlaning", "text": "Savol, taklif yoki xato haqida yozing — muharrirlar javob beradi.",
    "subject": "Mavzu", "message": "Xabar", "name": "Ismingiz", "email": "Javob uchun email",
    "sent": "Xabaringiz yuborildi. Javob pochtangizga va kabinetingizga keladi.", "adminReply": "Admin javobi", "my": "Mening murojaatlarim"
  },
  "becomeAuthor": {
    "title": "Muallif boʻlish", "school": "Maktab va sinf (ixtiyoriy)", "topic": "Qaysi mavzuda yozmoqchisiz?",
    "sent": "Arizangiz qabul qilindi. Muharrir siz bilan bogʻlanadi."
  },
  "authors": { "kicker": "Mualliflar", "title": "Mualliflar", "posts": "{n} maqola" },
  "errors": { "notFound": "Sahifa topilmadi", "notFoundText": "Bu sahifa koʻchirilgan yoki hech qachon boʻlmagan.", "generic": "Xatolik yuz berdi", "retry": "Qayta urinish", "backHome": "Bosh sahifa →", "rateLimited": "Juda koʻp soʻrov. Birozdan soʻng urinib koʻring", "captcha": "Bot tekshiruvidan oʻtmadi. Sahifani yangilang" },
  "preview": { "banner": "Qoralama koʻrinishi", "exit": "Chiqish" }
}
```

### 6.2 `messages/kaa.json`
```json
{
  "common": {
    "siteName": "hisinf.uz", "historicalInfo": "historical info", "min": "min", "minutes": "{n} min",
    "all": "Barlıǵı", "prev": "Aldıńǵı", "next": "Keyingi", "close": "Jabıw", "send": "Jiberiw",
    "loading": "Júklenbekte…", "copy": "Kóshirip alıw", "copied": "Kóshirildi", "readMore": "Tolıǵıraq →",
    "skipToContent": "Tiykarǵı mazmunǵa ótiw", "fxOff": "Effektlerdi óshiriw", "fxOn": "Effektlerdi qosıw",
    "uzOnly": "UZ"
  },
  "header": {
    "tagline": "Ózbekstan hám Qaraqalpaqstan tariyxı", "edition": "Tekserilgen maqalalar",
    "signin": "Kiriw", "search": "Izlew", "menu": "Menyu", "account": "Kabinet",
    "saved": "Saqlanǵanlar", "logout": "Shıǵıw", "editorial": "Redakciya"
  },
  "nav": { "home": "Bas bet", "posts": "Maqalalar", "periods": "Dáwirler", "persons": "Shaxslar", "archive": "Media arxiv", "map": "Karta", "timeline": "Xronologiya" },
  "theme": { "toggle": "Temanı almastırıw" },
  "lang": { "uz": "UZ", "kaa": "KAA", "label": "Til" },
  "footer": {
    "about": "Mektep oqıwshıları hám oqıtıwshılar ushın tekserilgen tariyxıy maqalalar, dáwirler, shaxslar hám arxiv hújjetleri.",
    "sections": "Bólimler", "project": "Joybar",
    "digestTitle": "Hápte dayjesti", "digestText": "Hár juma eń jaqsı maqalalar pochtańızǵa.",
    "subscribe": "Jazılıw", "emailPh": "email@manzil.uz", "subscribed": "Pochtańızdı tekseriń — tastıyıqlaw siltemesin jiberdik",
    "rights": "Barlıq huqıqlar qorǵalǵan", "note": "Hár bir maqala redaktor tekseriwinen ótedi"
  },
  "home": {
    "kicker": "I · Tariyxıy maǵlıwmatlar portalı", "h1a": "Mıń jıllıq tariyx,", "h1b": "bet-betten.",
    "sub": "Mektep oqıwshıları hám oqıtıwshılar ushın Ózbekstan hám Qaraqalpaqstan tariyxı boyınsha redaktor tekserilgen maqalalar, dáwirler hám arxiv hújjetleri.",
    "cta1": "Maqalalardı oqıw", "cta2": "Xronologiya", "searchPh": "Shaxs, waqıya yamasa dáwirdi izleń",
    "onThisDay": "Búgin tariyxta", "readPost": "Maqalanı oqıw →",
    "sealTop": "MÓR", "sealBottom": "TARIYXIY DÁWIR",
    "periodsKicker": "Dáwirler", "periodsTitle": "Tas dáwirinen ǵárezsizlikke shekem", "openTimeline": "Xronologiyanı ashıw →",
    "picksKicker": "Saylanǵan maqalalar", "picksTitle": "Redaktor usınısı", "allPosts": "Barlıq maqalalar →",
    "aboutKicker": "Platforma haqqında", "aboutTitle": "Hár bir maqala úsh qoldan ótedi",
    "aboutText": "hisinf.uz — mektep oqıwshıları hám oqıtıwshılar ushın ózbek hám qaraqalpaq tillerindegi tariyxıy maǵlıwmatlar portalı. Maqalalardı avtorlar jazadı, redaktor dereklerdi tekseredi, sonnan keyin ǵana olar saytta járiyalanadı.",
    "step1t": "Avtor jazadı", "step1d": "Ashıq derekler hám arxiv hújjetleri tiykarında maqala tayarlanadı.",
    "step2t": "Redaktor tekseredi", "step2d": "Faktler, sánelar hám derekler birme-bir qarap shıǵıladı.",
    "step3t": "Járiyalanadı", "step3d": "Maqala ózbek hám qaraqalpaq tillerinde saytqa jaylastırıladı.",
    "step4t": "Oqıwshı talqılaydı", "step4d": "Pikirler moderaciyadan ótip, maqala astında kórinedi.",
    "personsKicker": "Tariyxıy shaxslar", "personsTitle": "Tariyxtı jaratqanlar", "allPersons": "Barlıq shaxslar →",
    "ctaKicker": "Avtor bolıw", "ctaTitle": "Óz aymaǵıńız tariyxın jazıń",
    "ctaText": "Mektep oqıwshıları hám oqıtıwshılar avtor bola aladı. Maqalańızdı redaktor tekseredi hám derekler boyınsha másláhát beredi.",
    "ctaButton": "Arza qaldırıw →", "commentsKicker": "Talqılaw", "commentsTitle": "Pikir alısamız"
  },
  "posts": {
    "kicker": "Arxiv · Barlıq maqalalar", "title": "Maqalalar", "total": "maqala", "authors": "avtor",
    "search": "Maqala atı yamasa avtor…", "sNew": "Eń jańa", "sPop": "Eń kóp oqılǵan", "sOld": "Eń eski",
    "reset": "Filtrdi tazalaw", "emptyT": "Hesh nárse tabılmadı", "emptyD": "Basqa dáwir yamasa sózdi saylap kóriń.",
    "allPeriods": "Barlıq dáwirler", "showing": "Kórsetilgen: {n} / {total}", "more": "Jáne",
    "grid": "Keste kórinisi", "list": "Dizim kórinisi", "sort": "Saralaw"
  },
  "post": {
    "posts": "Maqalalar", "checked": "Tekserdi", "toc": "Mazmunı", "sources": "Derekler", "related": "Baylanıslı",
    "footnotes": "Bet astı túsindirmeleri", "footnote": "Túsindirme {n}", "backToText": "Tekstke qaytıw",
    "prev": "Aldıńǵı maqala", "next": "Keyingi maqala", "timelineOf": "{period} xronologiyası →",
    "fontSmaller": "Shrifttı kishireytiw", "fontLarger": "Shrifttı úlkeytiw",
    "save": "Saqlaw", "saved": "Saqlandı", "loginToSave": "Saqlaw ushın kiriń",
    "translationMissing": "Bul maqala ele qaraqalpaq tiline awdarılmaǵan — ózbekshe tekst kórsetilmekte.",
    "cite": "Citata keltiriw", "tags": "Tegler", "share": "Bólisiw", "accessed": "kirilgen sánesi"
  },
  "comments": {
    "title": "Pikirler", "ph": "Pikirińizdi jazıń…", "rules": "Pikirler moderaciyadan ótedi", "send": "Jiberiw",
    "pending": "Moderaciyada", "reply": "Juwap beriw", "staff": "Redaktor",
    "loginToComment": "Pikir qaldırıw ushın kiriń", "loginToLike": "Unatıw ushın kiriń",
    "disabled": "Bul maqalada pikirler óshirilgen", "sent": "Pikirińiz moderaciyadan keyin kórinedi",
    "justNow": "házir", "minutesAgo": "{n} minut aldın", "hoursAgo": "{n} saat aldın", "daysAgo": "{n} kún aldın"
  },
  "timeline": {
    "kicker": "Dáwirler", "title": "Xronologiya",
    "sub": "On tariyxıy dáwir — tas dáwirinen ǵárezsizlikke shekem. Dáwirdi saylań.",
    "posts": "maqala", "persons": "shaxs", "readPost": "Maqalanı oqıw →", "details": "Tolıǵıraq →",
    "seeOnTimeline": "Xronologiyada kóriw →", "prevEra": "Aldıńǵı dáwir", "nextEra": "Keyingi dáwir", "engraving": "gravyura"
  },
  "persons": {
    "kicker": "Tariyxıy shaxslar", "title": "Shaxslar",
    "sub": "Alımlar, húkimdarlar, shayırlar hám sarkardalar — tariyxtı jaratqanlar.",
    "articles": "Maqalalar", "fullPage": "Tolıq bet →", "portrait": "gravyura portret", "letter": "Hárip",
    "role": { "scholar": "Alım", "ruler": "Húkimdar", "poet": "Shayır", "commander": "Sarkarda", "enlightener": "Aǵartıwshı", "statesman": "Mámleket ǵayratkeri", "other": "Basqa" }
  },
  "archive": {
    "kicker": "Fotosúwretler, hújjetler, kartalar", "title": "Media arxiv",
    "kind": { "photo": "Foto", "document": "Hújjet", "map": "Karta", "engraving": "Gravyura", "video": "Video", "manuscript": "Qoljazba", "newspaper": "Gazeta" },
    "year": "Jıl", "source": "Derek", "license": "Licenziya", "seeInPost": "Maqalada kóriw", "download": "Júklep alıw", "openPdf": "PDF ashıw", "loadMore": "Jáne júklew"
  },
  "map": {
    "kicker": "Tariyxıy orınlar", "title": "Karta", "byPeriod": "Dáwir boyınsha", "postsCount": "{n} maqala →",
    "zoomIn": "Jaqınlastırıw", "zoomOut": "Uzaqlastırıw", "caption": "Ámiwdárya · Aral boyı · Mawarannahr", "list": "Dizim",
    "type": { "palace": "Saray", "fortress": "Qala", "city": "Qala (shahar)", "square": "Maydan", "port": "Port", "mausoleum": "Maqbara", "mosque": "Meshit", "archaeological": "Estelik", "battle": "Urıs orını", "natural": "Tábiyiy obyekt", "other": "Basqa" }
  },
  "search": {
    "kicker": "Izlew", "ph": "Ne izleysiz?", "popular": "Kóp izlenetuǵın", "none": "«{q}» boyınsha hesh nárse tabılmadı",
    "allResults": "Barlıq nátiyjeler →", "esc": "ESC",
    "type": { "all": "Barlıǵı", "post": "Maqala", "person": "Shaxs", "period": "Dáwir", "media": "Media", "place": "Orın" }
  },
  "auth": {
    "signin": "Kiriw", "signup": "Dizimnen ótiw", "name": "Atı-familiyası yamasa laqabı", "email": "Elektron pochta",
    "emailOrLogin": "Email yamasa login", "pass": "Parol", "passRepeat": "Paroldi qaytalań", "forgot": "Paroldi umıttıńız ba?",
    "agree": "Qaǵıydalar hám qupıyalıq siyasatı menen tanıstım", "emailErr": "Durıs pochta mánzilin kiritiń",
    "show": "KÓRSETIW", "hide": "JASIRIW", "welcome": "Qaytqanıńız menen", "join": "Arxivke qosılıń",
    "signinSub": "Akkauntıńızǵa kiriń.", "signupSub": "Maqalalardı saqlań hám pikir qaldırıń.",
    "doneIn": "Kirdińiz. Bas betke ótilmekte…", "doneUp": "Akkaunt jaratıldı. Pochtańızdı tastıyıqlań.",
    "haveAccount": "Akkauntıńız bar ma?", "noAccount": "Akkauntıńız joq pa?",
    "note": "Pikir qaldırıw ushın akkaunt kerek. Maqala jazıw — redaktor ruxsatı menen.",
    "wrongCreds": "Email/login yamasa parol qáte", "notVerified": "Aldın emailıńızdı tastıyıqlań",
    "resend": "Siltemeni qayta jiberiw", "locked": "Júdá kóp urınıs. 10 minuttan keyin qayta urınıp kóriń",
    "verifyOk": "Email tastıyıqlandı. Endi kire alasız.", "verifyFail": "Silteme eskirgen yamasa qáte.",
    "resetTitle": "Paroldi tiklew", "resetSent": "Eger bul email dizimde bolsa, silteme jiberildi.",
    "newPassTitle": "Jańa parol", "mismatch": "Paroller sáykes emes", "passWeak": "Parol keminde 8 belgi bolsın",
    "quoteSource": "Xalıq naqılı"
  },
  "account": {
    "kicker": "Jeke kabinet", "memberSince": "Aǵza: {date}", "saved": "Saqlanǵanlar", "myComments": "Pikirlerim",
    "myInquiries": "Múrájatlarım", "settings": "Sazlawlar", "remove": "Alıp taslaw", "status": { "pending": "Moderaciyada", "approved": "Járiyalandı", "rejected": "Biykarlandı", "spam": "Biykarlandı" },
    "language": "Xatlar tili", "changePass": "Paroldi ózgertiw", "currentPass": "Házirgi parol",
    "deleteAccount": "Akkauntı óshiriw", "deleteConfirm": "Tastıyıqlaw ushın atıńızdı jazıń", "addEmail": "Paroldi tiklewińiz ushın email qosıń",
    "save": "Saqlaw", "emptySaved": "Ele hesh nárse saqlanbaǵan"
  },
  "contact": {
    "kicker": "Baylanıs", "title": "Biz benen baylanısıń", "text": "Soraw, usınıs yamasa qátelik haqqında jazıń — redaktorlar juwap beredi.",
    "subject": "Tema", "message": "Xabar", "name": "Atıńız", "email": "Juwap ushın email",
    "sent": "Xabarıńız jiberildi. Juwap pochtańızǵa hám kabinetińizge keledi.", "adminReply": "Admin juwabı", "my": "Meniń múrájatlarım"
  },
  "becomeAuthor": {
    "title": "Avtor bolıw", "school": "Mektep hám klass (májbúriy emes)", "topic": "Qaysı tema boyınsha jazbaqshısız?",
    "sent": "Arzańız qabıllandı. Redaktor siz benen baylanısadı."
  },
  "authors": { "kicker": "Avtorlar", "title": "Avtorlar", "posts": "{n} maqala" },
  "errors": { "notFound": "Bet tabılmadı", "notFoundText": "Bul bet kóshirilgen yamasa hesh qashan bolmaǵan.", "generic": "Qátelik júz berdi", "retry": "Qayta urınıw", "backHome": "Bas bet →", "rateLimited": "Júdá kóp soraw. Azdan keyin qayta urınıp kóriń", "captcha": "Bot tekseriwinen ótpedi. Betti jańalań" },
  "preview": { "banner": "Qoralama kórinisi", "exit": "Shıǵıw" }
}
```

### 6.3 Tekshirilishi kerak bo'lgan kaa matnlar (⚠)
Dizayndan **olingan** (ishonchli): `header.*` (signin, tagline, edition), `nav.*` (home, posts, periods, persons, archive, map), `footer.*` (about, sections, project, digestTitle, digestText, subscribe, rights, note), `home` (kicker, h1a, h1b, sub, cta1, searchPh), `posts` (kicker, title, total, authors, search, sNew, sPop, sOld, reset, emptyT, emptyD, allPeriods, showing, prev/next), `post` (posts, checked, toc, sources, related, prev, next), `comments` (title, ph, rules, send, pending, reply), `timeline` (kicker, sub), `persons` (kicker, sub), `archive.kicker`, `map` (kicker, title, byPeriod), `search` (kicker, ph, popular, none), `auth` (signin, signup, email, pass, forgot, agree, emailErr, show, hide, welcome, join, signinSub, signupSub, doneIn, doneUp, haveAccount, noAccount, note).
**Qolgan barcha kaa qiymatlar ⚠** — `docs/kaa-review.md` ga ko'chiriladi va ona tili egasi tasdiqlaydi.

---

## 7. Ilovalar

### 7.1 Dizayn → Tailwind tezkor jadval
| Dizayn (inline) | Tailwind |
|-----------------|----------|
| `background:var(--bg)` | `bg-bg` |
| `color:var(--muted)` | `text-muted` |
| `border:1px solid var(--line)` | `border border-line` |
| `border-bottom:1px solid var(--border)` | `border-b border-border` |
| `font:500 12px/1 'IBM Plex Mono';letter-spacing:.14em;text-transform:uppercase` | `font-mono text-[12px] leading-none font-medium tracking-[.14em] uppercase` |
| `font:400 52px/1.05 Literata,serif;letter-spacing:-.02em` | `font-serif font-normal text-[52px] leading-[1.05] tracking-[-.02em]` |
| `padding:72px 48px 40px` | `pt-[72px] px-12 pb-10` |
| `grid-template-columns:minmax(0,1.4fr) minmax(0,1fr)` | `grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]` |
| `border-radius:999px` | `rounded-full` |
| `box-shadow:8px 8px 0 var(--fg)` | `shadow-offset` |
| `box-shadow:0 4px 0 var(--fg)` | `shadow-btn` |
| `transform:rotate(45deg)` | `rotate-45` |
| `background:repeating-linear-gradient(135deg,var(--ph)…),var(--surface-2)` | `bg-hatch` |
| `animation:hf-up .7s .16s both` | `animate-hf-up [animation-delay:.16s]` |
| `style-hover="transform:translateY(-4px);box-shadow:6px 6px 0 var(--fg)"` | `hover:-translate-y-1 hover:shadow-offset-sm` |
| `text-wrap:balance` / `pretty` | `text-balance` / `text-pretty` |
| `background:{{ p.color }}` (davr rangi) | `style={{ background: periodColorVar(color) }}` |

### 7.2 O'chiriladigan fayllar (umumiy ro'yxat)
| Fayl / papka | Qachon | O'rniga |
|--------------|--------|---------|
| `src/app/(frontend)/layout.tsx`, `page.tsx`, `styles.css` | P1.S2 | `[locale]/layout.tsx`, middleware |
| `src/lib/reader-auth.ts`, `src/lib/session.ts` | P4.S4 | `src/lib/current-reader.ts` (Payload auth) |
| `src/app/api/readers/*` | P4.S4 | Payload REST `/api/readers/*` + server action |
| `src/app/api/comments/route.ts` | P6.S5 | `actions/comments.ts` |
| `src/app/api/inquiries/route.ts` | P7.S4 | `actions/inquiries.ts` |
| `src/app/api/admin/*`, `src/app/api/posts/create`, `src/app/api/parse-document` | P5.S9 | Payload admin + `/api/import-document` |
| `src/app/(frontend)/[locale]/admin`, `admin-post-yaratish` | P5.S9 | `/admin` |
| `src/app/(frontend)/[locale]/chat` | P6.S13 | `/aloqa` |
| `src/app/(frontend)/[locale]/royxatdan-otish` | P6.S11 | `/kirish?rejim=royxat` |
| `src/components/Header.tsx`, `Footer.tsx`, `HeaderSearch.tsx`, `LanguageSwitcher.tsx`, `PostComments.tsx`, `ThemeProvider.tsx`, `ThemeToggle.tsx` | P2/P6 | `src/components/layout/*`, `comments/*` |
| `src/seed/seedAdmin.ts`, `runAdminSeed.ts`, `scripts/ensureAdminReader.ts` | P5.S9 | `src/seed/v2` |
| `scripts/checkPosts.ts`, `cleanupOldPosts.ts`, `updatePeriodsAndHomePost.ts` | P10.S3 | (eski kontent uchun bir martalik — ko'chirishdan keyin keraksiz) |

### 7.3 Atamalar lug'ati
- **Payload** — CMS (admin + API). **Local API** — server kodidan `payload.find()` kabi to'g'ridan-to'g'ri chaqiruv.
- **Lexical** — Payload'ning rich text muharriri. Matn JSON daraxt sifatida saqlanadi.
- **ISR** — sahifa bir marta render bo'lib keshlanadi va `revalidate` / `revalidatePath` bilan yangilanadi.
- **Server action** — `'use server'` funksiya. Formadan to'g'ridan-to'g'ri chaqiriladi.
- **Drafts / `_status`** — Payload versiyalari: `draft` yoki `published`.
- **Turnstile** — Cloudflare'ning captcha alternativasi.
- **Idempotent** — qayta ishga tushirilsa ham natija o'zgarmaydigan skript.

---

## 8. Progress jadvali

| Phase | Nomi | Holat | Sana | Izoh |
|-------|------|-------|------|------|
| V2-P0 | Xavfsizlik hotfix'i | 🟡 | 2026-10-09 | Kod tayyor (S2–S5). Qo'lda qoldi: S1, S2.5, S4.4 ishga tushirish, S5.4, S5.5, S6 |
| V2-P1 | Poydevor | ✅ | 2026-10-09 | S1–S4 to'liq bajarildi, paketlar, layout, cn.ts, env |
| V2-P2 | Dizayn tizimi | ✅ | 2026-10-09 | S1–S7 to'liq bajarildi: tokenlar, shriftlar, tema, UI primitivlar, effektlar, dev sahifalar |
| V2-P3 | Ma'lumotlar modeli va ko'chirish | ⬜ | | |
| V2-P4 | Auth, rollar, workflow | ⬜ | | |
| V2-P5 | Tahririyat (admin) | ⬜ | | |
| V2-P6 | Ommaviy sayt | ⬜ | | |
| V2-P7 | Interaktiv funksiyalar | ⬜ | | |
| V2-P8 | i18n, SEO, tezlik, a11y | ⬜ | | |
| V2-P9 | Testlar va QA | ⬜ | | |
| V2-P10 | Prod'ga chiqarish | ⬜ | | |
| V2-P11 | Ixtiyoriy | ⬜ | | |

Belgilar: ⬜ boshlanmagan · 🟨 jarayonda · ✅ tugagan · ⛔ bloklangan

**Bog'liqliklar:** P0 → P1 → P2 → P3 → P4 → P5 ∥ P6 (P5 va P6 parallel bajarilishi mumkin: P6.S5 dagi renderer P5.S5 dagi bloklarga bog'liq) → P7 → P8 → P9 → P10.
