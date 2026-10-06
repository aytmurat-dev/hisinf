# P11 — Tarqatish: Telegram avto-post va email obuna

**Maqsad:** maqola chop etilganda u Telegram kanalga avtomatik yuborilsin. Obunachilarga haftada bir marta yangi maqolalar dayjesti borsin.

**Arxitektura qarori (o'zgartirmang):** Vercel Hobby'da cron **kuniga 1 marta** ishlaydi. Shuning uchun:
- Telegram post **darhol**, `after()` (Next.js, javob yuborilgandan keyin bajariladi) orqali yuboriladi. Xato bo'lsa, kunlik cron "yuborilmay qolgan"larni qayta yuboradi.
- Email per-post **yuborilmaydi** (Resend bepul limitlari kichik). Buning o'rniga **haftalik dayjest** (kunlik cron sozlangan hafta kunini tekshiradi) yuboriladi.
- Payload Jobs Queue ishlatilmaydi (soddalik uchun).

---

## P11.S1 — Kunlik cron

- [ ] **P11.S1.1** `vercel.json`:
  ```json
  { "crons": [{ "path": "/cron/daily", "schedule": "0 5 * * *" }] }
  ```
  `0 5 * * *` UTC 05:00, ya'ni Toshkent vaqti bilan 10:00. Hobby tarifda aniq vaqt kafolatlanmaydi (shu soat oralig'ida ishlaydi).
- [ ] **P11.S1.2** `src/app/(frontend)/cron/daily/route.ts`:
  ```ts
  export const maxDuration = 60

  export async function GET(req: Request) {
    if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }
    const payload = await getPayloadClient()
    const results = {
      telegram: await safe(() => sweepTelegram(payload)),
      digest: await safe(() => maybeSendWeeklyDigest(payload)),
      moderation: await safe(() => notifyPendingComments(payload)), // P10 bo'lsa
    }
    payload.logger.info({ msg: 'cron/daily', results })
    return Response.json(results)
  }
  ```
  `safe()` — `try/catch` o'rami. U `{ ok: boolean, error?: string, ...natija }` qaytaradi. Bitta vazifadagi xato qolganlarini to'xtatmaydi.
- [ ] **P11.S1.3** `CRON_SECRET` Vercel env'ga qo'shilgan bo'lsin. Vercel uni cron so'rovlariga avtomatik qo'shadi.
- [ ] **P11.S1.4** Middleware matcher'ida `cron` chiqarib tashlangan (P2.S2.5). Tekshiring.
- [ ] **P11.S1.5** Lokal sinov: `curl -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/cron/daily`.

✅ **Qabul mezonlari:** to'g'ri token bilan 200 va JSON natija qaytadi, tokensiz 401.

---

## P11.S2 — Telegram avto-post

- [ ] **P11.S2.1** Bot kanalga **admin** qilib qo'shilgan (P0.S1.6). `TELEGRAM_CHANNEL_ID` aniqlang: ochiq kanal uchun `@kanal_nomi`, yopiq kanal uchun `-100...` (botga kanal postini forward qilib yoki `getUpdates` orqali topiladi).
- [ ] **P11.S2.2** `src/lib/telegram.ts`:
  ```ts
  const api = (method: string) => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`

  export function escapeHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  /** Caption 1024 belgidan oshmasin. */
  export function buildCaption({ title, excerpt, periodTitle, url }: { title: string; excerpt?: string; periodTitle?: string; url: string }): string {
    const tag = periodTitle ? `\n\n#${periodTitle.replace(/[^\p{L}\p{N}]+/gu, '_')}` : ''
    const head = `<b>${escapeHtml(title)}</b>\n\n`
    const room = 1024 - head.length - tag.length - 5
    const body = excerpt ? escapeHtml(excerpt.length > room ? excerpt.slice(0, room - 1) + '…' : excerpt) : ''
    return `${head}${body}${tag}`
  }

  export async function sendPost({ caption, url, imageUrl, buttonText }: { caption: string; url: string; imageUrl?: string; buttonText: string }): Promise<number> {
    const common = {
      chat_id: process.env.TELEGRAM_CHANNEL_ID,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [[{ text: buttonText, url }]] },
    }
    const res = await fetch(api(imageUrl ? 'sendPhoto' : 'sendMessage'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(imageUrl ? { ...common, photo: imageUrl, caption } : { ...common, text: caption }),
    })
    const json = (await res.json()) as { ok: boolean; result?: { message_id: number }; description?: string }
    if (!json.ok || !json.result) throw new Error(`Telegram: ${json.description ?? res.status}`)
    return json.result.message_id
  }
  ```
  Unit testlar: `buildCaption` uzunligi ≤ 1024, `<` va `&` ekranlanadi.
- [ ] **P11.S2.3** `src/collections/TelegramLog.ts` (`slug: 'telegram-log'`): `post` (rel posts, required, **unique**), `messageId` (number), `sentAt` (date). `access`: `read: isStaff`, `create/update/delete: isAdmin` (server kodi Local API orqali yozadi). `admin.group: 'Sayt sozlamalari'`. Posts'ga sidebar'da ko'rinadigan join maydoni qo'shiladi: `{ name: 'telegramLog', type: 'join', collection: 'telegram-log', on: 'post' }`. Bu yondashuv post versiyalariga tegmaydi.
- [ ] **P11.S2.4** `src/lib/telegram-post.ts` → `publishPostToTelegram(payload, postId)`:
  1. `telegram-log` da shu post bor bo'lsa → `skip` (**idempotentlik**: ikki marta yuborilmaydi).
  2. Postni `locale: 'uz'`, `depth: 1` bilan oladi. `_status !== 'published'` yoki `telegram.disabled` bo'lsa → `skip`.
  3. `TELEGRAM_BOT_TOKEN` yoki `TELEGRAM_CHANNEL_ID` bo'lmasa → `skip`.
  4. URL: `${SERVER_URL}/uz/maqolalar/${slug}`.
  5. Rasm: `coverImage.url` (**asl fayl**, webp o'lcham emas, chunki Telegram JPEG/PNG'ni yaxshiroq ko'rsatadi).
  6. `sendPost({ ..., buttonText: '📖 Oʻqish' })`.
  7. `payload.create({ collection: 'telegram-log', data: { post: id, messageId, sentAt: now } })`. `post` unique bo'lgani uchun parallel ikkinchi urinish xato beradi — uni `catch` qilib e'tiborsiz qoldiring.
- [ ] **P11.S2.5** Hook `src/hooks/queueTelegram.ts` (`afterChange`, Posts):
  ```ts
  import { after } from 'next/server'

  export const queueTelegram: CollectionAfterChangeHook<Post> = ({ doc, previousDoc, req }) => {
    if (req.context?.skipTelegram || req.context?.disableRevalidate) return doc
    const justPublished = doc._status === 'published' && previousDoc?._status !== 'published'
    if (!justPublished) return doc
    try {
      after(() => publishPostToTelegram(req.payload, doc.id).catch((e) => req.payload.logger.error(e)))
    } catch {
      // after() Next so'rovidan tashqarida (skriptda) ishlamaydi — kunlik cron baribir yuboradi
    }
    return doc
  }
  ```
- [ ] **P11.S2.6** `sweepTelegram(payload)` (cron): oxirgi 3 kunda chop etilgan, `telegram.disabled` bo'lmagan va `telegram-log` da yozuvi yo'q postlar topiladi. Har biri uchun `publishPostToTelegram` chaqiriladi, ular orasida 1 soniya pauza qilinadi (Telegram limiti).
- [ ] **P11.S2.7** Admin'da muharrir uchun: post sidebar'ida `telegramLog` (yuborilgan sana) ko'rinadi. "Telegramga yuborilmasin" checkbox'i chop etishdan **oldin** belgilanishi kerak — buni `admin.description` da yozing.

✅ **Qabul mezonlari:** test kanalda postni chop etgach, 1 daqiqa ichida rasm, sarlavha va "Oʻqish" tugmali xabar chiqadi. Postni qayta saqlash ikkinchi xabar yubormaydi.

---

## P11.S3 — Email obuna (double opt-in)

- [ ] **P11.S3.1** `pnpm add resend` (batch yuborish uchun SDK).
- [ ] **P11.S3.2** `src/collections/Subscribers.ts`:
  - `email` (email, required, unique, index), `locale` (select uz/kaa), `status` (select: `pending` / `active` / `unsubscribed`, default `pending`), `confirmToken` (text, `admin.hidden`), `unsubscribeToken` (text, `admin.hidden`, index), `confirmedAt`, `lastDigestAt` (date).
  - `access`: `read`, `update` va `delete` → `isAdmin`. `create` → `() => false` (faqat server action).
  - `admin.group: "O'quvchilar"`.
- [ ] **P11.S3.3** Server action `subscribe({ email, locale, turnstileToken })`:
  1. zod email, `verifyTurnstile`, `limiters.subscribe.limit(ip)`.
  2. Mavjud `active` bo'lsa → hech narsa qilinmaydi, lekin **bir xil javob** qaytadi.
  3. Yangi yoki `pending`/`unsubscribed` bo'lsa → yangi `confirmToken` (`crypto.randomBytes(32).toString('hex')`) va `unsubscribeToken` (yo'q bo'lsa) yaratiladi, `status: 'pending'`.
  4. Tasdiqlash emaili: `${SERVER_URL}/${locale}/obuna/tasdiqlash?token=...`.
  5. Javob: "Emailingizni tekshiring — tasdiqlash havolasini yubordik".
- [ ] **P11.S3.4** `/[locale]/obuna/tasdiqlash?token=` → token bo'yicha topiladi, `status: 'active'`, `confirmedAt: now`, `confirmToken: null` qilinadi. Natija xabari ko'rsatiladi.
- [ ] **P11.S3.5** `/[locale]/obuna/bekor?token=` → `unsubscribeToken` bo'yicha `status: 'unsubscribed'` qilinadi. "Obuna bekor qilindi" xabari va "Qayta obuna bo'lish" havolasi chiqadi. Sahifa GET'da darhol bekor qiladi (email mijozlari bir marta bosishni kutadi).
- [ ] **P11.S3.6** `SubscribeForm` (client): email inputi, Turnstile va tugma. Footer'da va bosh sahifadagi CTA blokida (P7.S4.9) joylashadi.

✅ **Qabul mezonlari:** obuna → email → tasdiqlash → admin'da `active`; bekor qilish havolasi ishlaydi.

---

## P11.S4 — Haftalik dayjest

- [ ] **P11.S4.1** `maybeSendWeeklyDigest(payload)` (cron):
  1. `site-settings` dan `digestEnabled` va `digestWeekday` olinadi. Bugun (Toshkent vaqti bo'yicha) o'sha kun bo'lmasa → `skip`.
  2. Oxirgi 7 kunda chop etilgan postlar olinadi. 0 ta bo'lsa → `skip`.
  3. `active` obunachilar `locale` bo'yicha guruhlanadi. Faqat `lastDigestAt` bo'sh yoki 6 kundan eski bo'lganlar olinadi (cron ikki marta ishlasa, takror yuborilmasligi uchun).
  4. Har til uchun HTML shablon `src/emails/digest.ts` da: sarlavha "Bu haftada HISINF'da", har post uchun rasm (`card` o'lcham), sarlavha, excerpt va "Oʻqish" tugmasi. Pastida **bekor qilish havolasi**.
  5. `resend.batch.send([...])` — 100 tadan bo'laklarga bo'linadi. Har emailga `headers: { 'List-Unsubscribe': '<${unsubscribeUrl}>' }`.
  6. Yuborilganlarning `lastDigestAt = now` qilinadi.
- [ ] **P11.S4.2** **Limit himoyasi:** Resend tarifingizning kunlik limitini `DIGEST_DAILY_LIMIT` env'ga yozing (bepul tarif uchun 100 atrofida — joriy limitni Resend saytidan tekshiring). Limitdan ko'p obunachi bo'lsa, qolganlari ertasi kuni yuboriladi: `lastDigestAt` filtri buni avtomatik hal qiladi, buning uchun hafta kuni tekshiruvini "hafta kuni yoki undan keyingi 2 kun" qilib kengaytiring.
- [ ] **P11.S4.3** Admin'da "Test dayjest" imkoniyati: `site-settings` ga `ui` tugma (ixtiyoriy) yoki `/cron/daily?force=digest&to=<email>` (faqat `CRON_SECRET` bilan). U faqat ko'rsatilgan bitta manzilga yuboradi.

✅ **Qabul mezonlari:** test rejimida dayjest emaili ikkala tilda to'g'ri ko'rinadi (Gmail va mobil Gmail), bekor qilish havolasi ishlaydi.

---

## P11 yakuniy tekshiruv
- [ ] Unit testlar: `buildCaption`, `escapeHtml`, dayjest kun hisoblash.
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` o'tadi.
- [ ] Prod'da: Telegram test kanalida sinab ko'rilgan, keyin asosiy kanalga o'tkazilgan.
- [ ] Progress yangilangan.
