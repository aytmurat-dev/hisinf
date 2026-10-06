# P12 — Sifat, xavfsizlik, tezlik

**Maqsad:** launch'dan oldin sayt xavfsiz, tez, accessible va testlar bilan himoyalangan bo'lsin.
**Qachon:** P9 dan keyin (MVP launch'dan oldin). P10–P11 qo'shilganda ularning qismlari ham qayta tekshiriladi.

---

## P12.S1 — Xavfsizlik sarlavhalari (headers)

- [ ] **P12.S1.1** `next.config` → `headers()`:
  ```ts
  async headers() {
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, // live preview o'z domenida iframe ishlatadi — SAMEORIGIN yetarli
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    ]
    return [{ source: '/:path*', headers: security }]
  }
  ```
- [ ] **P12.S1.2** **CSP avval faqat hisobot rejimida** (`Content-Security-Policy-Report-Only`) va faqat sayt sahifalari uchun (`source: '/:locale(uz|kaa)/:path*'`). Admin uchun yoqilmaydi:
  ```
  default-src 'self';
  img-src 'self' data: blob: <R2_PUBLIC_URL host> https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://i.ytimg.com;
  script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com;
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com <R2_PUBLIC_URL host>;
  connect-src 'self' https://challenges.cloudflare.com;
  ```
  1 hafta davomida brauzer konsolidagi CSP ogohlantirishlarini kuzating. Keyin `Report-Only` ni olib tashlab, CSP'ni majburiy qiling.
- [ ] **P12.S1.3** https://securityheaders.com da prod manzilini tekshiring. Maqsad: **A** baho.

✅ **Qabul mezonlari:** securityheaders.com ≥ A. Sayt, admin, xarita, YouTube va Turnstile ishlaydi.

---

## P12.S2 — Ilova xavfsizligi tekshiruvi (checklist)

- [ ] **P12.S2.1** Barcha kolleksiyalarda `access` aniq yozilgan (hech qayerda standart qiymatga tayanilmagan). `grep -L "access:" src/collections/*.ts` bo'sh natija berishi kerak.
- [ ] **P12.S2.2** `overrideAccess: true` ishlatilgan **har bir** joy ko'rib chiqilgan va oldidan izoh bilan sababi yozilgan (`// overrideAccess: chunki ...`).
- [ ] **P12.S2.3** REST API orqali mehmon sifatida tekshiring (curl bilan):
  - `GET /api/users` → 403 yoki bo'sh.
  - `GET /api/readers` → 403 yoki bo'sh.
  - `GET /api/posts?draft=true` → faqat published.
  - `GET /api/posts?depth=2` → javobda `email` so'zi yo'q.
  - `GET /api/comments` → faqat approved, `reader` populate bo'lmagan.
  - `GET /api/subscribers` → 403.
  - `POST /api/comments` → 403.
- [ ] **P12.S2.4** Fayl yuklash: faqat ruxsat etilgan mime turlari qabul qilinadi. `.html` yoki `.svg` yuklashga urinib ko'ring — rad etilishi kerak. **SVG ruxsat etilmaydi** (XSS xavfi).
- [ ] **P12.S2.5** Barcha server action'lar foydalanuvchini serverda qayta tekshiradi (clientdan kelgan `userId` ga ishonilmaydi).
- [ ] **P12.S2.6** `pnpm audit --prod` — `high`/`critical` zaifliklar yo'q. Bo'lsa, paketlar yangilanadi. CI'ga qo'shing: `pnpm audit --prod --audit-level=high`.
- [ ] **P12.S2.7** Sirlar: `git log -p | grep -i "secret\|token\|password"` — tarixda haqiqiy sir yo'q. Topilsa, o'sha kalit **darhol almashtiriladi**.
- [ ] **P12.S2.8** Admin akkauntlari: kuchli parollar (12+ belgi). Admin soni 2 tadan oshmasin. Ishdan ketgan muharrir yoki muallif `isActive = false` qilinadi (o'chirilmaydi — maqolalari saqlanib qoladi).

✅ **Qabul mezonlari:** checklist'ning barcha bandlari bajarilgan va `docs/security-review.md` ga sana bilan yozilgan.

---

## P12.S3 — Testlar to'plami

- [ ] **P12.S3.1** **Unit (Vitest)** — barcha `src/lib/*` sof funksiyalari: `format-year`, `format-date`, `slugify`, `normalize-search`, `workflow`, `lexical-walk`, `safe-url`, `citation`, `alphabet`, `resolve-link`, `moderation`, `telegram`. Qamrov maqsadi: `src/lib` uchun ≥ 90%.
- [ ] **P12.S3.2** **Integratsion** — P4.S7 va P10.S7 testlari (Neon `test` branch).
- [ ] **P12.S3.3** **E2E (Playwright)** `tests/e2e/`:
  1. `home.spec.ts` — `/uz` va `/kaa` ochiladi, `<html lang>` to'g'ri, hero ko'rinadi.
  2. `language.spec.ts` — `/uz/maqolalar/<slug>` da til almashtirilsa `/kaa/maqolalar/<slug>` ochiladi.
  3. `theme.spec.ts` — qorong'i rejim tanlanadi, sahifa yangilanadi, `html.dark` saqlanadi.
  4. `nav-mobile.spec.ts` — 390px: burger → accordion → submenu havolasi → sahifa ochiladi.
  5. `nav-desktop.spec.ts` — klaviatura: Tab bilan menyuga o'tish, Enter bilan submenu ochiladi, Esc bilan yopiladi.
  6. `post.spec.ts` — izoh `[1]` bosilsa `#fn-1` ga o'tadi; manbalar bor; "Nusxa olish" toast chiqaradi.
  7. `search.spec.ts` — `oʻzbek` va `o'zbek` bir xil birinchi natijani beradi.
  8. `timeline.spec.ts` — davr filtri URL'ga yoziladi va natijalar kamayadi.
  9. `map.spec.ts` — xarita yuklanadi, marker bosilsa popup chiqadi.
  10. `workflow.spec.ts` — admin'da muallif sifatida kirish → postni tekshiruvga yuborish → muharrir sifatida chop etish → saytda ko'rinadi.
- [ ] **P12.S3.4** E2E test ma'lumotlari seed orqali tayyorlanadi (`ALLOW_SEED=true`, test DB).
- [ ] **P12.S3.5** CI: unit testlar har push'da ishlaydi. E2E esa qo'lda (`workflow_dispatch`) yoki Vercel preview URL'ga qarshi ishga tushiriladi (`BASE_URL` env bilan).

✅ **Qabul mezonlari:** barcha testlar yashil.

---

## P12.S4 — Accessibility (a11y)

- [ ] **P12.S4.1** Har sahifa turida (bosh, ro'yxat, maqola, xronologiya, shaxs, arxiv, xarita, qidiruv, 404) Lighthouse Accessibility ≥ 95 va axe DevTools'da `critical` yoki `serious` xatolar yo'q.
- [ ] **P12.S4.2** Faqat klaviatura bilan butun sayt bo'ylab sayohat qilib ko'ring: fokus doim ko'rinadi, menyu, dialog va sheet'lar fokusni ushlaydi va Esc bilan yopiladi.
- [ ] **P12.S4.3** Ekran o'quvchi (Windows: NVDA, bepul) bilan bosh sahifa va maqola tekshiriladi: sarlavhalar tartibi (h1 → h2 → h3), rasmlar alt matnlari, tugmalar nomlari.
- [ ] **P12.S4.4** Rang kontrasti (P6.S2.2) ikkala rejimda qayta tekshiriladi.
- [ ] **P12.S4.5** 200% zoom'da kontent kesilmaydi va gorizontal skroll chiqmaydi.

✅ **Qabul mezonlari:** `docs/a11y-report.md` da natijalar yozilgan va hamma band ✅.

---

## P12.S5 — Tezlik (performance)

- [ ] **P12.S5.1** Maqsadlar (Lighthouse, mobil, prod): Performance ≥ 85, LCP < 2.5s, CLS < 0.1, INP < 200ms.
- [ ] **P12.S5.2** Hero va muqova rasmlarida `priority` bor, boshqa rasmlar `loading="lazy"`. `MediaImage` da `sizes` to'g'ri berilgan.
- [ ] **P12.S5.3** Client JS: `pnpm build` chiqishida First Load JS bosh sahifa uchun ≤ 150 kB bo'lsin. Katta client komponentlar (xarita, lightbox, timeline) faqat kerakli sahifalarda `dynamic` bilan yuklanadi.
- [ ] **P12.S5.4** Shriftlar: faqat kerakli og'irliklar (400, 600, 700) va `display: swap`.
- [ ] **P12.S5.5** DB so'rovlari: ro'yxatlarda `select` ishlatilgan, `depth` minimal. Sekin sahifa bo'lsa, Neon konsolida so'rovlar tekshiriladi va kerakli `index: true` maydonlar qo'shiladi (`slug`, `publishedAt`, `workflowStatus`, `year`, `status` allaqachon indekslangan).
- [ ] **P12.S5.6** ISR ishlayotganini tekshiring: maqola sahifasining ikkinchi so'rovida `x-vercel-cache: HIT` sarlavhasi bo'lishi kerak.

✅ **Qabul mezonlari:** `docs/perf-report.md` da 5 ta sahifa uchun Lighthouse natijalari va hammasi maqsaddan yuqori.

---

## P12.S6 — Monitoring va xatolar

- [ ] **P12.S6.1** Vercel → Analytics (Web Analytics) yoqiladi. U cookie ishlatmaydi, maxfiylik uchun qulay. `@vercel/analytics` paketi `[locale]/layout.tsx` ga qo'shiladi. *Eslatma: bu yangi paket — README 3.2 jadvaliga qo'shing.*
- [ ] **P12.S6.2** Vercel → Logs: xatolar kuzatiladi. Muhim server xatolarini `payload.logger.error` bilan, kontekst (kolleksiya, ID, amal) bilan birga yozing.
- [ ] **P12.S6.3** Uptime monitoring (bepul: UptimeRobot yoki Better Stack): `/uz` va `/admin` har 5 daqiqada tekshiriladi, sayt ishlamay qolsa email keladi.

✅ **Qabul mezonlari:** uptime monitoring test ogohlantirishi kelgan.

---

## P12 yakuniy tekshiruv
- [ ] Barcha stage hisobotlari (`docs/security-review.md`, `docs/a11y-report.md`, `docs/perf-report.md`) mavjud.
- [ ] Progress yangilangan.
