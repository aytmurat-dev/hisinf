# P10 — O'quvchilar: ro'yxatdan o'tish, saqlanganlar, izohlar

**Maqsad:** o'quvchi akkaunt ochib, maqolalarni saqlay olsin va izoh qoldira olsin (moderatsiyadan keyin ko'rinadi).
**⚠️ Boshlashdan oldin:** README 3.3-bo'lim, 1–2 bandlar (shaxsiy ma'lumotlar qonunchiligi va voyaga yetmaganlar). Maktab rahbariyati yoki yurist bilan kelishilganini `docs/BLOCKERS.md` da qayd eting. Kelishilmagan bo'lsa, bu phase'ni boshlamang.

---

## P10.S0 — Maxfiylik tamoyillari (majburiy)

- [ ] **P10.S0.1** O'quvchidan **faqat** email, parol, taxallus (`displayName`) va rozilik belgisi olinadi. Haqiqiy ism, maktab, sinf, telefon, tug'ilgan sana va rasm **so'ralmaydi**.
- [ ] **P10.S0.2** Avatar yuklanmaydi. Taxallusning bosh harfi va ID'dan hisoblangan rangli doira ko'rsatiladi.
- [ ] **P10.S0.3** O'quvchi o'z akkauntini **o'zi o'chira oladi** (kabinetda). O'chirilganda uning izohlari ham o'chiriladi.
- [ ] **P10.S0.4** "Maxfiylik siyosati" va "Foydalanish shartlari" sahifalari (P0.S4.8) chop etilgan. Ro'yxatdan o'tish formasida ularga havola va majburiy checkbox bor.
- [ ] **P10.S0.5** Barcha izohlar **oldindan moderatsiya** qilinadi (avtomatik chop etilmaydi).

---

## P10.S1 — `readers` kolleksiyasi

- [ ] **P10.S1.1** `src/collections/Readers.ts`:
  ```ts
  {
    slug: 'readers',
    labels: { singular: "O'quvchi", plural: "O'quvchilar" },
    auth: {
      verify: { generateEmailHTML: ..., generateEmailSubject: ... }, // P10.S2.4
      forgotPassword: { generateEmailHTML: ..., generateEmailSubject: ... },
      maxLoginAttempts: 5,
      lockTime: 10 * 60 * 1000,
      tokenExpiration: 60 * 60 * 24 * 30,
      cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
    },
    admin: { useAsTitle: 'displayName', group: "O'quvchilar", defaultColumns: ['displayName', 'email', '_verified', 'isBanned', 'createdAt'] },
    access: {
      create: isAdmin,                         // ro'yxatdan o'tish faqat server action orqali (overrideAccess)
      read: ({ req }) => hasRole(req.user, 'admin', 'editor') ? true
        : req.user?.collection === 'readers' ? { id: { equals: req.user.id } } : false,
      update: ({ req }) => hasRole(req.user, 'admin') ? true
        : req.user?.collection === 'readers' ? { id: { equals: req.user.id } } : false,
      delete: ({ req }) => hasRole(req.user, 'admin') ? true
        : req.user?.collection === 'readers' ? { id: { equals: req.user.id } } : false,
    },
    fields: [
      { name: 'displayName', type: 'text', required: true, minLength: 3, maxLength: 30 },
      { name: 'locale', type: 'select', options: ['uz', 'kaa'], defaultValue: 'uz' },
      { name: 'savedPosts', type: 'relationship', relationTo: 'posts', hasMany: true, maxRows: 500 },
      { name: 'acceptedTermsAt', type: 'date', admin: { readOnly: true } },
      { name: 'isBanned', type: 'checkbox', access: { update: fieldIsEditorOrAdmin } },
    ],
  }
  ```
- [ ] **P10.S1.2** `displayName` validatsiyasi: faqat harflar, raqamlar, bo'sh joy, `_` va `-`. Taqiqlangan so'zlar ro'yxati (P10.S5.3) bilan tekshiriladi.
- [ ] **P10.S1.3** `afterDelete` hook: o'quvchining barcha `comments` lari o'chiriladi.
- [ ] **P10.S1.4** **Admin panelga kirish:** `admin.user = 'users'` bo'lgani uchun o'quvchilar `/admin` ga kira olmaydi. Buni tekshiring.
- [ ] **P10.S1.5** **Cookie to'qnashuvi:** Payload barcha auth kolleksiyalari uchun bitta `payload-token` cookie ishlatadi. Bitta brauzerda xodim ham, o'quvchi ham login qilsa, oxirgisi qoladi. Buni hujjatlashtiring (`docs/EDITOR_GUIDE.md`: "admin va o'quvchi akkauntini bitta brauzerda bir vaqtda ishlatmang").

✅ **Qabul mezonlari:** P10.S7 dagi ruxsat testlari o'tadi.

---

## P10.S2 — Himoya: Turnstile va rate limit

- [ ] **P10.S2.1** Cloudflare → Turnstile → sayt qo'shing (domenlar: `localhost`, vercel manzili, asosiy domen) va kalitlarni `.env` ga yozing.
- [ ] **P10.S2.2** `pnpm add @marsidev/react-turnstile @upstash/ratelimit @upstash/redis zod`.
- [ ] **P10.S2.3** Upstash: Vercel → Storage / Marketplace → Upstash Redis. Env nomlari `KV_REST_API_URL` / `KV_REST_API_TOKEN` bo'lib kelsa, `src/lib/rate-limit.ts` da ularni ham qabul qiling.
- [ ] **P10.S2.4** `src/lib/turnstile.ts`:
  ```ts
  export async function verifyTurnstile(token: string | null, ip?: string): Promise<boolean> {
    if (!token) return false
    const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token })
    if (ip) body.set('remoteip', ip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
    const json = (await res.json()) as { success: boolean }
    return json.success === true
  }
  ```
- [ ] **P10.S2.5** `src/lib/rate-limit.ts`:
  ```ts
  import { Ratelimit } from '@upstash/ratelimit'
  import { Redis } from '@upstash/redis'

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN!,
  })

  export const limiters = {
    register: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 h'), prefix: 'rl:register' }),
    comment: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '10 m'), prefix: 'rl:comment' }),
    subscribe: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 h'), prefix: 'rl:subscribe' }),
    bookmark: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, '1 m'), prefix: 'rl:bookmark' }),
  }

  export async function getClientIp(): Promise<string> {
    const h = await headers()
    return h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  }
  ```

✅ **Qabul mezonlari:** Turnstile tokenisiz so'rov rad etiladi; 4-chi ro'yxatdan o'tish urinishi 1 soat ichida bloklanadi.

---

## P10.S3 — Auth sahifalari

Hamma forma `useActionState` + server action bilan ishlaydi. Validatsiya `zod` bilan bajariladi va xatolar maydon ostida chiqadi.

- [ ] **P10.S3.1** `/[locale]/royxatdan-otish` — forma: taxallus, email, parol (kamida 8 belgi), parolni takrorlash, "Shartlarga roziman" checkbox va Turnstile. Server action `registerReader`:
  1. zod validatsiya.
  2. `verifyTurnstile`.
  3. `limiters.register.limit(ip)`.
  4. `payload.create({ collection: 'readers', data: { ..., acceptedTermsAt: now, locale } })` (`overrideAccess: true`, chunki access.create = admin).
  5. Email allaqachon mavjud bo'lsa ham **bir xil** javob qaytariladi: "Emailingizga tasdiqlash havolasi yuborildi" (email ro'yxatini aniqlab bo'lmasligi uchun).
- [ ] **P10.S3.2** **Tasdiqlash emaili:** `generateEmailHTML: ({ token, user }) => ...` → havola `${SERVER_URL}/${user.locale}/tasdiqlash?token=${token}`. Shablon `src/emails/verify.ts` da, ikki tilda.
- [ ] **P10.S3.3** `/[locale]/tasdiqlash?token=` — server komponent: `payload.verifyEmail({ collection: 'readers', token })`. Muvaffaqiyatli bo'lsa "Email tasdiqlandi, endi kirishingiz mumkin" va kirish havolasi, aks holda "Havola eskirgan yoki noto'g'ri".
- [ ] **P10.S3.4** `/[locale]/kirish` — email, parol. **Client** tomondan `fetch('/api/readers/login', { method: 'POST', credentials: 'include', body })`. Payload cookie'ni o'zi o'rnatadi. Muvaffaqiyatli bo'lsa `router.push(redirectTo ?? '/kabinet')` va `router.refresh()`. Xatolar: noto'g'ri parol, tasdiqlanmagan email, bloklangan.
- [ ] **P10.S3.5** `/[locale]/parolni-tiklash` — email → `POST /api/readers/forgot-password`. Email shablonidagi havola: `/${locale}/parolni-tiklash/yangi?token=`. Yangi parol sahifasi → `POST /api/readers/reset-password`.
- [ ] **P10.S3.6** Chiqish: `POST /api/readers/logout`, so'ng `router.refresh()`.
- [ ] **P10.S3.7** `src/lib/current-reader.ts` → `getCurrentReader()` (faqat dinamik route'larda va server action'larda): `payload.auth({ headers: await headers() })`. `user?.collection === 'readers'` bo'lsa o'quvchini qaytaradi, aks holda `null`.
- [ ] **P10.S3.8** **Header'dagi akkaunt ikonkasi** (client): `fetch('/api/readers/me', { credentials: 'include' })`. Kirgan bo'lsa taxallus doirasi va menyu (Kabinet, Chiqish), kirmagan bo'lsa "Kirish". Kontent sahifalari statik qoladi (P7.S1.5).

✅ **Qabul mezonlari:** ro'yxatdan o'tish → email → tasdiqlash → kirish → chiqish → parolni tiklash sikli ikki tilda ishlaydi.

---

## P10.S4 — Saqlanganlar (bookmark)

- [ ] **P10.S4.1** `src/app/(frontend)/[locale]/actions/bookmarks.ts` — server action'lar:
  - `toggleBookmark(postId)`: `getCurrentReader()` → yo'q bo'lsa `{ error: 'auth' }`. Rate limit, keyin `savedPosts` ga qo'shish yoki olib tashlash (`payload.update` bilan, `overrideAccess: false, user: reader`).
  - `getBookmarkState(postId)`: `{ saved: boolean, loggedIn: boolean }`.
- [ ] **P10.S4.2** `BookmarkButton` (client) maqola sahifasida va `PostCard` da: mount bo'lganda `getBookmarkState` chaqiriladi. Bosilganda optimistik yangilanadi (`useOptimistic`). Kirmagan bo'lsa, "Saqlash uchun kiring" tooltip va kirish havolasi chiqadi (`?redirect=` bilan).
- [ ] **P10.S4.3** `/[locale]/kabinet` (dinamik sahifa, `getCurrentReader` bilan; kirmagan bo'lsa `/kirish` ga redirect):
  - Tab "Saqlanganlar": `PostCard` lar grid'i va har birida "olib tashlash".
  - Tab "Izohlarim": o'quvchining izohlari va ularning holati (Kutilmoqda / Chop etildi / Rad etildi).
  - Tab "Sozlamalar": taxallusni o'zgartirish, til, parolni o'zgartirish va **"Akkauntni o'chirish"** (tasdiqlash dialogi bilan, taxallusni yozib tasdiqlanadi).

✅ **Qabul mezonlari:** saqlangan maqola kabinetda ko'rinadi; akkaunt o'chirilgach, qayta kirib bo'lmaydi.

---

## P10.S5 — Izohlar

- [ ] **P10.S5.1** `src/collections/Comments.ts`:
  - Maydonlar: `post` (rel posts, required, index), `reader` (rel readers, required, readOnly), `authorName` (text, readOnly — yaratilgan paytdagi taxallus nusxasi), `body` (textarea, required, minLength 3, maxLength 1000), `parent` (rel comments — faqat 1 daraja javob), `status` (select: `pending` / `approved` / `rejected` / `spam`, default `pending`, index), `flagged` (checkbox, readOnly), `flagReason` (text, readOnly), `moderatedBy` (rel users, readOnly), `moderatedAt` (date, readOnly).
  - `access`: `read`: xodim → hammasi, boshqalar → `{ status: { equals: 'approved' } }`. `create`: `() => false` (faqat server action orqali yaratiladi). `update` va `delete`: `isEditorOrAdmin`.
  - `admin`: `group: "O'quvchilar"`, `useAsTitle: 'body'`, `defaultColumns: ['body', 'authorName', 'post', 'status', 'flagged', 'createdAt']`. Ro'yxatning standart filtri `status = pending` — `admin.components` yoki `baseListFilter` bilan (versiyaga qarab).
  - `beforeChange`: `status` o'zgarganda `moderatedBy = req.user.id`, `moderatedAt = now`.
  - `afterChange`: `status` `approved` ga o'tganda yoki undan chiqqanda → `revalidateSite`.
- [ ] **P10.S5.2** Server action `createComment({ postId, body, parentId, turnstileToken })`:
  1. `getCurrentReader()` — bo'lishi, `_verified === true` va `isBanned !== true` bo'lishi shart.
  2. `verifyTurnstile`.
  3. `limiters.comment.limit(reader.id)`.
  4. zod: `body` 3–1000 belgi.
  5. Post mavjud, `published` va `commentsEnabled === true`.
  6. `parentId` bo'lsa: parent shu postga tegishli, `approved` va o'zi javob emas (`parent.parent` bo'sh).
  7. `const { flagged, reason } = moderateText(body)` (P10.S5.3).
  8. `payload.create({ collection: 'comments', data: { post, reader: reader.id, authorName: reader.displayName, body, parent, status: 'pending', flagged, flagReason: reason }, overrideAccess: true })`.
  9. Javob: "Izohingiz moderatsiyadan soʻng koʻrinadi".
- [ ] **P10.S5.3** `src/lib/moderation.ts` → `moderateText(text): { flagged: boolean; reason?: string }`:
  - `src/lib/moderation-words.ts` dagi taqiqlangan so'zlar ro'yxati (uz/kaa/ru, `normalizeSearch` bilan solishtiriladi). Ro'yxatni o'qituvchilar to'ldiradi.
  - Havolalar (`http`, `www.`, `t.me/`) → flagged ("havola").
  - Telefon raqami naqshi (`\+?998[\s-]?\d{2}`, 9+ raqam) → flagged ("shaxsiy ma'lumot").
  - Email naqshi → flagged.
  - Unit testlar yozing.
- [ ] **P10.S5.4** **Saytda ko'rsatish** (maqola sahifasining pastida, client komponent `CommentsSection`):
  - Tasdiqlangan izohlar server action `getApprovedComments(postId)` orqali olinadi (`select`: `authorName, body, createdAt, parent`). Reader ID va email **qaytarilmaydi**.
  - Daraxt ko'rinishida chiqadi (asosiy izohlar va ularning javoblari, chap chiziq bilan).
  - Kirgan o'quvchi uchun forma (textarea, belgilar hisoblagichi, Turnstile), kirmagan uchun "Izoh qoldirish uchun kiring".
  - Har izohda "Javob berish" tugmasi bor.
  - Sana nisbiy formatda ("2 kun oldin"), `formatDate` asosida yoziladi.
  - Muloqot qoidalari havolasi (Foydalanish shartlari).
- [ ] **P10.S5.5** **Moderatsiya:** P4.S5.3 dagi dashboard'ga "Moderatsiya kutayotgan izohlar: N" qo'shiladi (`flagged` lar alohida sanaladi). List view'da tez tasdiqlash uchun Payload'ning bulk edit funksiyasi (bir nechta tanlab `status` ni o'zgartirish) ishlatiladi.
- [ ] **P10.S5.6** Muharrirga kunlik xabar (P11 cron'da): kutayotgan izohlar 0 dan ko'p bo'lsa, editorlarga bitta email yuboriladi.

✅ **Qabul mezonlari:**
- Izoh yuboriladi → admin'da `pending` holatida turadi → tasdiqlangach saytda paydo bo'ladi.
- Havolali izoh `flagged` bo'ladi.
- Bloklangan o'quvchi izoh yubora olmaydi.

---

## P10.S6 — Huquqiy matnlar va sozlamalar

- [ ] **P10.S6.1** "Maxfiylik siyosati"da quyidagilar yozilgan: qanday ma'lumot yig'iladi (email, taxallus), nima uchun, qayerda saqlanadi, qancha vaqt saqlanadi, qanday o'chiriladi (kabinet) va kim bilan bog'lanish kerak.
- [ ] **P10.S6.2** Foydalanish shartlarida muloqot qoidalari bor: hurmat, haqorat va reklama taqiqlanadi, shaxsiy ma'lumot yozilmaydi.

✅ **Qabul mezonlari:** ikkala sahifa ikki tilda chop etilgan va maktab tomonidan tasdiqlangan.

---

## P10.S7 — Testlar

- [ ] **P10.S7.1** Integratsion testlar (`tests/int/readers.test.ts`):
  1. O'quvchi `users` ni o'qiy olmaydi.
  2. O'quvchi boshqa o'quvchini o'qiy olmaydi.
  3. O'quvchi `isBanned` ni o'zgartira olmaydi.
  4. O'quvchi `comments` ni REST orqali yarata olmaydi (`create: false`).
  5. Mehmon faqat `approved` izohlarni ko'radi.
  6. O'quvchi o'chirilganda izohlari ham o'chadi.
  7. `isStaffUser(reader) === false`.
- [ ] **P10.S7.2** E2E (Playwright, Turnstile uchun Cloudflare'ning **test kalitlari**: site key `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA` — test muhitida doim muvaffaqiyatli):
  - Ro'yxatdan o'tish (emailni tasdiqlash qadami test muhitida Local API orqali `_verified: true` qilinadi) → kirish → maqolani saqlash → kabinetda ko'rish → izoh yozish → "moderatsiyada" xabari.

✅ **Qabul mezonlari:** barcha testlar o'tadi.

---

## P10 yakuniy tekshiruv
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` o'tadi.
- [ ] Migratsiya yaratilgan, Vercel'da env'lar (Turnstile, Upstash) qo'shilgan.
- [ ] Progress yangilangan.
