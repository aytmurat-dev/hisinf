# P7 — Ommaviy sayt: layout va asosiy sahifalar

**Maqsad:** header (menyu, submenu, til, tema), footer, bosh sahifa, maqolalar ro'yxati, maqola sahifasi va taksonomiya sahifalarini yaratish.
**Oldingi shart:** P2, P3, P5.S3, P6 tugagan.

---

## P7.S1 — Ma'lumot olish qatlami va kesh

- [ ] **P7.S1.1** **Qoida:** sahifa komponentlari Payload'ni to'g'ridan-to'g'ri chaqirmaydi. Barcha so'rovlar `src/lib/queries/*.ts` funksiyalari orqali o'tadi. Masalan: `getPostBySlug(slug, locale, { draft })`, `getPosts({ locale, page, period, region, category, tag, limit })`, `getHeader(locale)`, `getFooter(locale)`, `getSiteSettings(locale)`, `getHomePage(locale)`.
- [ ] **P7.S1.2** Har bir so'rov uchun standart parametrlar: `locale`, `fallbackLocale: 'uz'`. `draft` rejimda: `draft: true, overrideAccess: true`, aks holda `where` ga `_status: { equals: 'published' }` qo'shiladi va `overrideAccess: false` beriladi.
- [ ] **P7.S1.3** Kerakli maydonlarni tanlash: ro'yxatlarda `select` bilan faqat kartochkaga kerakli maydonlar olinadi (`content` olinmaydi!), `depth: 1`.
- [ ] **P7.S1.4** **Muallif ma'lumoti (xavfsiz).** `getAuthorPublic(id)`: `payload.findByID({ collection: 'users', id, overrideAccess: true, select: { displayName: true, slug: true, avatar: true, bio: true } })`. Postlarda `author` populate qilinganda ham **email kelmasligi** kerak. `populate: { users: { displayName: true, slug: true, avatar: true } }` ishlatiladi yoki muallif alohida olinadi. Test yozing: maqola sahifasining HTML'ida `@` belgili email yo'q.
- [ ] **P7.S1.5** **Kesh strategiyasi (oddiy va ishonchli):**
  - Kontent sahifalari: `export const revalidate = 3600` (ISR).
  - Dinamik slug'li sahifalarda `generateStaticParams` bo'sh massiv `[]` qaytaradi. Shunda sahifa birinchi so'rovda render bo'lib, keshlanadi.
  - **Kontent sahifalarida `headers()`, `cookies()` yoki `payload.auth()` chaqirilmaydi.** Ular sahifani dinamik qilib qo'yadi. Foydalanuvchiga xos qismlar (saqlash tugmasi, izoh formasi) client komponent sifatida alohida yuklanadi (P10).
  - Filtrli ro'yxat sahifalari (`searchParams` ishlatadi) dinamik render bo'ladi. Bu normal holat.
- [ ] **P7.S1.6** **Revalidatsiya hook'i.** `src/hooks/revalidateSite.ts`:
  ```ts
  import { revalidatePath } from 'next/cache'

  export const revalidateSite = ({ doc, previousDoc, req }) => {
    if (req.context?.disableRevalidate) return doc
    const isOrWasPublished = doc?._status === 'published' || previousDoc?._status === 'published'
    const hasDrafts = doc && '_status' in doc
    if (hasDrafts && !isOrWasPublished) return doc
    try {
      revalidatePath('/[locale]', 'layout') // butun saytni yangilaydi — kichik sayt uchun yetarli
    } catch (e) {
      req.payload.logger.warn({ msg: 'revalidate skipped', e }) // skript ichida (seed) chaqirilganda
    }
    return doc
  }
  ```
  Barcha ommaviy kolleksiyalarga (`afterChange` va `afterDelete`) hamda barcha globallarga (`afterChange`) ulang.

✅ **Qabul mezonlari:** admin'da maqola tahrirlanib chop etilgach, saytda 5 soniya ichida yangilanadi (prod'da tekshiriladi).

---

## P7.S2 — Header (menyu, submenu, til, tema)

- [ ] **P7.S2.1** `src/components/layout/Header.tsx` (server): `getHeader(locale)` va `getSiteSettings(locale)` ni oladi va client qismlarga uzatadi.
- [ ] **P7.S2.2** **Desktop (≥1024px):**
  - Chapda logo (yorug'/qorong'i variant `dark:hidden` / `hidden dark:block` bilan) va sayt nomi (serif).
  - Markazda menyu: shadcn `NavigationMenu`. `children` bo'lsa, trigger + panel chiqadi. Panelda 4 tagacha element bitta ustunda, ko'proq bo'lsa 2 ustunli grid bo'ladi. Har elementda `label` va `description` (kichik, muted) ko'rsatiladi.
  - Submenu **sichqoncha olib borilganda ham, bosilganda ham** ochiladi. `Esc` bilan yopiladi. Klaviaturada `Tab`/`Enter`/strelkalar ishlaydi (Radix buni ta'minlaydi).
  - Joriy sahifaga mos menyu elementi `aria-current="page"` va pastki chiziq bilan belgilanadi.
  - O'ngda: qidiruv ikonkasi (→ `/qidiruv`), `LanguageSwitcher`, `ThemeToggle`, (P10 dan keyin) akkaunt ikonkasi.
- [ ] **P7.S2.3** **Mobil (<1024px):**
  - Chapda logo, o'ngda qidiruv ikonkasi va "burger" tugmasi.
  - Burger → shadcn `Sheet` (o'ngdan chiqadi, kengligi `min(88vw, 360px)`).
  - Sheet ichida menyu `Accordion` bo'ladi: submenu'li element bosilsa ochiladi, submenu'siz element to'g'ridan-to'g'ri havola.
  - Sheet pastida til tanlash (2 ta katta tugma: "Oʻzbekcha" / "Qaraqalpaqsha") va tema tanlash (3 ta segment).
  - Havola bosilganda Sheet yopiladi.
- [ ] **P7.S2.4** `LanguageSwitcher` (P2.S5 mantig'i): desktop'da `DropdownMenu`. Tugmada qisqa kod ("UZ" / "QQ") turadi, ro'yxatda to'liq nomlar bo'ladi va joriy til belgilanadi.
- [ ] **P7.S2.5** Header `sticky top-0`, foni `bg-background/85 backdrop-blur`, pastida `border-b`. Skroll qilinganda balandligi 72px → 60px ga kichrayadi (ixtiyoriy, `prefers-reduced-motion` hisobga olinadi).
- [ ] **P7.S2.6** Skip link (P6.S7.5) header'dan oldin turadi.

✅ **Qabul mezonlari:**
- Desktop'da 2 darajali menyu sichqoncha va klaviatura bilan ishlaydi.
- 390px kenglikda burger menyu, accordion submenu, til va tema tanlash ishlaydi.
- Tilni almashtirganda menyu yorliqlari ham o'zgaradi.

---

## P7.S3 — Footer

- [ ] **P7.S3.1** `Footer.tsx`: yuqorida `OrnamentDivider`, keyin `footer` globalidagi ustunlar (mobilda bitta ustun), ijtimoiy tarmoq ikonkalari, `showInFooter` sahifalari (Maxfiylik va boshqalar), copyright satri va (P11 dan keyin) obuna formasi.
- [ ] **P7.S3.2** Foni `bg-secondary`.

✅ **Qabul mezonlari:** footer ikkala tilda to'g'ri chiqadi.

---

## P7.S4 — Bosh sahifa

`src/app/(frontend)/[locale]/page.tsx` — bo'limlar quyidagi tartibda:

- [ ] **P7.S4.1** **Hero:** `home-page.hero` dagi rasm fonda (to'q gradient qoplama bilan, matn o'qiladigan bo'lishi uchun) yoki rasm o'ngda. Sarlavha (serif, katta), subtitle, qidiruv inputi (GET `/qidiruv`), CTA tugmasi. Burchaklarda `OrnamentCorner`. Mobilda rasm matn ostida bo'ladi.
- [ ] **P7.S4.2** **"Bugun tarixda":** `getTodayInTashkent()` → `events` dan `month == bugun.month && day == bugun.day` bo'yicha qidiriladi. Topilmasa, tasodifiy `importance = 1` voqea olinadi (kun raqami bo'yicha deterministik: `events[dayOfYear % count]`). Kartochkada yil (katta, `tabular-nums`), sarlavha, qisqa matn va havola. `revalidate = 3600` bo'lgani uchun kun almashganda 1 soat ichida yangilanadi.
- [ ] **P7.S4.3** **Tanlangan maqolalar:** `featuredPosts` (bo'sh bo'lsa `featured = true` bo'lgan oxirgi 4 ta). Layout: 1 ta katta (`featured` variant) va 3 ta kichik (`horizontal`). Mobilda hammasi ustma-ust.
- [ ] **P7.S4.4** **Davrlar bo'yicha:** `featuredPeriods` (bo'sh bo'lsa barcha davrlar `startYear` bo'yicha). Gorizontal skroll-lenta (`scroll-snap`): davr rangi, nomi, yillar oralig'i (`formatYearRange`) va maqolalar soni.
- [ ] **P7.S4.5** **So'nggi maqolalar:** 6 ta, grid (1/2/3 ustun) va "Barcha maqolalar →".
- [ ] **P7.S4.6** **Tarixiy shaxslar:** `featuredPersons` yoki oxirgi 8 ta, gorizontal lenta (portret doira shaklida, ism, yillar).
- [ ] **P7.S4.7** **Xarita teaser'i:** statik rasm yoki SVG va "Xaritada ko'rish →" tugmasi. Bosh sahifada Leaflet **yuklanmaydi**.
- [ ] **P7.S4.8** **Arxivdan:** 4 ta oxirgi arxiv birligi.
- [ ] **P7.S4.9** **Obuna / Telegram CTA bloki:** Telegram kanal havolasi (P11 dan keyin email forma ham qo'shiladi).
- [ ] **P7.S4.10** Har bo'lim bo'sh bo'lsa, umuman ko'rsatilmaydi (bo'sh sarlavha qolmasin).

✅ **Qabul mezonlari:** seed ma'lumotlari bilan bosh sahifa 390/768/1440 kengliklarda chiroyli ko'rinadi. Lighthouse Performance (mobil) ≥ 85.

---

## P7.S5 — Maqolalar ro'yxati

- [ ] **P7.S5.1** `/[locale]/maqolalar/page.tsx`. `searchParams`: `davr`, `hudud`, `kategoriya`, `teg` (slug'lar) va `sahifa` (raqam).
- [ ] **P7.S5.2** Slug'larni ID'larga aylantiring (har biri uchun bitta `find`). Noto'g'ri slug bo'lsa, o'sha filtr e'tiborsiz qoldiriladi.
- [ ] **P7.S5.3** `getPosts` → `limit: 12`, `sort: '-publishedAt'`, `page`. `totalPages` dan `Pagination` quriladi.
- [ ] **P7.S5.4** Yuqorida `FilterBar` (davr, hudud, kategoriya) va faol filtrlar "chip" ko'rinishida (× bilan olib tashlanadi).
- [ ] **P7.S5.5** Natija bo'lmasa `EmptyState` ko'rsatiladi va "Filtrlarni tozalash" taklif qilinadi.
- [ ] **P7.S5.6** `generateMetadata`: sarlavha filtrga qarab, masalan "Temuriylar davri — Maqolalar".

✅ **Qabul mezonlari:** filtrlar birgalikda ishlaydi, sahifalash to'g'ri, URL ulashilganda xuddi shu natija chiqadi.

---

## P7.S6 — Maqola sahifasi

`/[locale]/maqolalar/[slug]/page.tsx`

- [ ] **P7.S6.1** Ma'lumot: `getPostBySlug(slug, locale, { draft })`, `depth: 2`. Topilmasa `notFound()`.
- [ ] **P7.S6.2** **Tarjima holati:** `locale === 'kaa'` bo'lsa `hasTranslation('posts', id, 'kaa')`. Tarjima yo'q bo'lsa, sahifa tepasida banner chiqadi: "Bu maqola hali qoraqalpoq tiliga tarjima qilinmagan. Oʻzbekcha matn koʻrsatilmoqda." Bunday sahifaga `robots: { index: false }` qo'yiladi (P9).
- [ ] **P7.S6.3** **Tuzilma:**
  1. `Breadcrumbs`: Bosh sahifa / Maqolalar / {birinchi kategoriya} / {sarlavha}.
  2. Header: kategoriya badge'lari, `h1` sarlavha, excerpt (katta, muted), meta qatori (muallif avatari va ismi → `/mualliflar/{slug}`, `publishedAt` (`formatDate`), o'qish vaqti, `PeriodBadge`).
  3. Muqova rasmi: `MediaImage priority`, ostida caption va credit.
  4. Ikki ustun (≥1280px): chapda matn (`Container narrow`, `.prose-hisinf`), o'ngda sticky **mundarija** (`collectHeadings`). Mobilda mundarija matn tepasida yig'ilgan `<details>` ichida bo'ladi.
  5. `RichText` (P5).
  6. **Izohlar** (`Footnotes`) — `collectFootnotes` bo'sh bo'lmasa.
  7. **Manbalar** — `sources` raqamlangan ro'yxat. Format: `Muallif. Nomi. — Nashriyot, Yil. — B. sahifalar.` Veb-sayt uchun: `Nomi // URL (murojaat sanasi: …)`.
  8. **"Iqtibos keltirish"** bloki: `src/lib/citation.ts` → `buildCitation({ authorName, title, siteName, year, url, accessedAt, locale })`. Natija: `R. Aziza. "Xiva xonligi tarixi". HISINF, 2026. https://... (murojaat sanasi: 6-oktabr, 2026)`. "Nusxa olish" tugmasi (client, `navigator.clipboard`) va `sonner` toast. Unit test yozing.
  9. Teglar, bog'liq shaxslar, voqealar va joylar (chip'lar, ular havola).
  10. **Ulashish:** Telegram (`https://t.me/share/url?url=&text=`), Facebook, "Havolani nusxalash". Mobilda mavjud bo'lsa `navigator.share` ham ishlatiladi.
  11. **O'xshash maqolalar:** shu davrdagi (joriydan tashqari) oxirgi 3 ta.
  12. (P10) Saqlash tugmasi va izohlar bo'limi — hozircha joy qoldiriladi.
- [ ] **P7.S6.4** **O'qish progressi:** header ostidagi ingichka chiziq (client komponent, `scroll` hodisasi `requestAnimationFrame` bilan).
- [ ] **P7.S6.5** **Chop etish (print) stillari:** `@media print` — header, footer, ulashish va izohlar formasi yashiriladi, havolalar URL'i ko'rsatiladi (`a::after { content: " (" attr(href) ")" }` faqat tashqi havolalarga).
- [ ] **P7.S6.6** Draft rejim: P4.S6.4 dagi `RefreshRouteOnSave` va "Qoralama ko'rinishi" paneli.
- [ ] **P7.S6.7** `generateMetadata`: P9 da to'ldiriladi, hozircha `title` va `description`.
- [ ] **P7.S6.8** P5.S3 dagi vaqtinchalik `dev/rich-text` sahifasini o'chiring.

✅ **Qabul mezonlari:**
- Barcha bloklar, izohlar, manbalar va iqtibos ishlaydi.
- `kaa` da tarjimasiz maqolada banner chiqadi.
- 390px kenglikda matn qulay o'qiladi (qatorda 45–75 belgi).
- HTML ichida muallif email'i yo'q.

---

## P7.S7 — Taksonomiya, muallif va statik sahifalar

- [ ] **P7.S7.1** `/[locale]/davrlar` — barcha davrlar vertikal ro'yxatda: rang chizig'i, nomi, yillar, tavsif va maqolalar soni.
- [ ] **P7.S7.2** `/[locale]/davrlar/[slug]` — davr sarlavhasi (cover rasm bilan), tavsif, shu davr maqolalari (sahifalash bilan), shu davr shaxslari (lenta), shu davr voqealari (mini timeline, 10 ta) va "To'liq xronologiya →" (`/xronologiya?davr=slug`).
- [ ] **P7.S7.3** `/[locale]/kategoriya/[...slug]` — oxirgi segment slug bo'yicha kategoriya topiladi. To'liq yo'l `breadcrumbs` bilan mos kelmasa, to'g'ri yo'lga `redirect` qilinadi. Bola kategoriyalar chip sifatida ko'rsatiladi, maqolalar ro'yxati sahifalash bilan.
- [ ] **P7.S7.4** `/[locale]/teg/[slug]` — teg bo'yicha maqolalar.
- [ ] **P7.S7.5** `/[locale]/mualliflar/[slug]` — avatar, `displayName`, bio va muallifning chop etilgan maqolalari. **Email, sinf va maktab ko'rsatilmaydi.**
- [ ] **P7.S7.6** `/[locale]/sahifa/[slug]` — `Pages` (sarlavha va RichText).

✅ **Qabul mezonlari:** menyudagi barcha havolalar ishlaydigan sahifaga olib boradi (404 yo'q).

---

## P7.S8 — Xato va yuklanish holatlari

- [ ] **P7.S8.1** `[locale]/not-found.tsx` — "Sahifa topilmadi". Naqshli bezak, qidiruv inputi va bosh sahifa havolasi bilan. Ikkala tilda.
- [ ] **P7.S8.2** `[locale]/error.tsx` (`'use client'`) — "Xatolik yuz berdi" va "Qayta urinish" tugmasi (`reset()`).
- [ ] **P7.S8.3** `loading.tsx` — ro'yxat sahifalari uchun skeleton kartochkalar.
- [ ] **P7.S8.4** Mavjud bo'lmagan til (`/en/...`) → 404.

✅ **Qabul mezonlari:** `/uz/yoq-sahifa` va `/uz/maqolalar/yoq` chiroyli 404 sahifasini ko'rsatadi.

---

## P7 yakuniy tekshiruv
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` o'tadi.
- [ ] Qo'lda tekshirish: 390 / 768 / 1440 kengliklar × yorug' / qorong'i rejim × uz / kaa (12 ta kombinatsiya) bosh sahifa va maqola sahifasida.
- [ ] Progress yangilangan.
