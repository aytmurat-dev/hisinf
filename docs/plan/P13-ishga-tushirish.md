# P13 — Ishga tushirish (launch)

**Maqsad:** saytni haqiqiy domenda, zaxira nusxa tizimi bilan ishga tushirish va muallif hamda muharrirlarni o'qitish.

---

## P13.S1 — Domen va production muhiti

- [ ] **P13.S1.1** Domen Vercel'ga ulanadi: Vercel → Project → Settings → Domains → `<domen>` va `www.<domen>` (www → asosiy domenga redirect). Registrator DNS'iga Vercel ko'rsatgan yozuvlar (A / CNAME) kiritiladi.
- [ ] **P13.S1.2** Env yangilanadi: `NEXT_PUBLIC_SERVER_URL=https://<domen>` (Production). Qayta deploy qilinadi.
- [ ] **P13.S1.3** R2: custom domain `media.<domen>` ulanadi, `R2_PUBLIC_URL` yangilanadi, CORS ro'yxatiga `https://<domen>` qo'shiladi. **Diqqat:** `R2_PUBLIC_URL` o'zgarsa, eski media URL'lari (agar bazada saqlangan bo'lsa) yangilanishi kerak. Shuning uchun custom domain **birinchi haqiqiy kontentdan oldin** ulanadi.
- [ ] **P13.S1.4** Resend: domen tasdiqlanadi (SPF, DKIM, ixtiyoriy DMARC), `EMAIL_FROM=noreply@<domen>`.
- [ ] **P13.S1.5** Turnstile domenlar ro'yxatiga `<domen>` qo'shiladi.
- [ ] **P13.S1.6** `PAYLOAD_SECRET` prod uchun alohida, uzun va **hech qachon o'zgarmaydigan** qilib yaratiladi (o'zgarsa, hamma sessiyalar va tokenlar bekor bo'ladi).

✅ **Qabul mezonlari:** `https://<domen>/uz` ochiladi, HTTPS ishlaydi, `www` redirect qiladi, email `noreply@<domen>` dan keladi.

---

## P13.S2 — Zaxira nusxa (backup)

- [ ] **P13.S2.1** R2'da alohida **yopiq** bucket: `hisinf-backups`. Lifecycle qoidasi: 90 kundan eski fayllar o'chiriladi.
- [ ] **P13.S2.2** Faqat shu bucket uchun alohida R2 API token yaratiladi.
- [ ] **P13.S2.3** `.github/workflows/backup.yml`:
  ```yaml
  name: db-backup
  on:
    schedule:
      - cron: '0 22 * * 6'   # har shanba 22:00 UTC (yakshanba 03:00 Toshkent)
    workflow_dispatch: {}
  jobs:
    backup:
      runs-on: ubuntu-latest
      steps:
        - name: Dump database
          env:
            DATABASE_URL: ${{ secrets.DATABASE_URI_UNPOOLED }}
          run: |
            # pg_dump versiyasi Neon Postgres major versiyasiga teng bo'lishi shart (Neon konsolidan tekshiring)
            docker run --rm -e DATABASE_URL postgres:17 \
              pg_dump "$DATABASE_URL" --format=custom --no-owner --no-acl > backup.dump
            ls -lh backup.dump
        - name: Upload to R2
          env:
            AWS_ACCESS_KEY_ID: ${{ secrets.R2_BACKUP_ACCESS_KEY_ID }}
            AWS_SECRET_ACCESS_KEY: ${{ secrets.R2_BACKUP_SECRET_ACCESS_KEY }}
            AWS_DEFAULT_REGION: auto
          run: |
            aws s3 cp backup.dump "s3://hisinf-backups/db/db-$(date +%F).dump" \
              --endpoint-url "https://${{ secrets.R2_ACCOUNT_ID }}.r2.cloudflarestorage.com"
  ```
  GitHub → Settings → Secrets: `DATABASE_URI_UNPOOLED`, `R2_BACKUP_ACCESS_KEY_ID`, `R2_BACKUP_SECRET_ACCESS_KEY` va `R2_ACCOUNT_ID` qo'shiladi.
- [ ] **P13.S2.4** **Tiklashni sinash** (majburiy, aks holda backup'ga ishonib bo'lmaydi):
  1. Neon'da yangi `restore-test` branch yarating.
  2. Backup'ni yuklab oling: `pg_restore --no-owner --no-acl -d "<restore-test URL>" backup.dump`.
  3. Lokal `.env` ni shu branch'ga ulab `pnpm dev` qiling. Maqolalar ko'rinishi kerak.
  4. Natijani `docs/RUNBOOK.md` ga yozing va branch'ni o'chiring.
- [ ] **P13.S2.5** Media fayllar: R2 ishonchli saqlaydi, lekin tasodifiy o'chirishdan himoya uchun oyiga bir marta `rclone sync` yoki `aws s3 sync` bilan `hisinf-media` → `hisinf-backups/media/` nusxalanadi (alohida workflow, `cron: '0 23 1 * *'`).
- [ ] **P13.S2.6** Neon'ning o'z Point-in-time restore imkoniyati tarifga qarab bir necha soatdan bir necha kungacha ishlaydi. Bu qo'shimcha himoya qatlami.

✅ **Qabul mezonlari:** backup workflow qo'lda ishga tushirilganda yashil bo'ladi va fayl R2'da paydo bo'ladi. Tiklash testi muvaffaqiyatli.

---

## P13.S3 — Runbook (favqulodda vaziyatlar qo'llanmasi)

- [ ] **P13.S3.1** `docs/RUNBOOK.md` yarating. Unda quyidagi bo'limlar bo'ladi:
  - **Sayt ishlamayapti:** Vercel status → oxirgi deploy logi → kerak bo'lsa oldingi deploy'ga qaytarish (Vercel → Deployments → "Promote to Production").
  - **Bazani tiklash:** P13.S2.4 qadamlari.
  - **Admin parolini unutish:** "Forgot password" yoki boshqa admin parolni tiklaydi.
  - **Sir (token) oshkor bo'lsa:** qaysi kalitni qayerda almashtirish kerak (Neon, R2, Resend, Telegram, Turnstile, Upstash) va qayta deploy.
  - **Spam izohlar oqimi:** vaqtincha barcha postlarda `commentsEnabled = false` (bulk edit) yoki rate limit qiymatlarini kamaytirish.
  - **Migratsiya xatosi deploy'da:** build log → lokal `dev` branch'da takrorlash → tuzatish → yangi migratsiya.
  - Kontaktlar: kim admin, kimda qaysi akkauntga kirish huquqi bor (parollarsiz!).

✅ **Qabul mezonlari:** runbook'ni texnik bo'lmagan admin o'qib tushuna oladi.

---

## P13.S4 — Kontent va foydalanuvchilar

- [ ] **P13.S4.1** Prod bazada seed **ishlatilmaydi**. Taksonomiya (davrlar, hududlar, kategoriyalar) va menyu admin orqali qo'lda kiritiladi (yoki faqat taksonomiya uchun alohida, xavfsiz `seed-taxonomy` skripti).
- [ ] **P13.S4.2** P0.S4.4 dagi pilot kontent kiritiladi: 5 ta maqola, 10 ta shaxs, 20 ta voqea, 10 ta joy va 10 ta arxiv birligi. Hammasi muharrir tekshiruvidan o'tadi.
- [ ] **P13.S4.3** Statik sahifalar chop etiladi: Biz haqimizda, Maxfiylik siyosati, Foydalanish shartlari, Muallif bo'lish (AUTHOR_GUIDE asosida) va Aloqa.
- [ ] **P13.S4.4** Akkauntlar yaratiladi (P0.S4.5 ro'yxati): muharrirlar va mualliflar `isActive = true`. Har biriga "Forgot password" orqali parol o'rnatish havolasi yuboriladi (parollar chat yoki email orqali yuborilmaydi).

✅ **Qabul mezonlari:** saytda bo'sh bo'lim qolmagan, menyudagi hamma havola kontentga olib boradi.

---

## P13.S5 — O'qitish

- [ ] **P13.S5.1** Mualliflar uchun 45 daqiqalik amaliy mashg'ulot (AUTHOR_GUIDE bo'yicha): har bir ishtirokchi mashg'ulot davomida bitta qisqa maqolani tekshiruvga yuboradi.
- [ ] **P13.S5.2** Muharrirlar uchun 30 daqiqalik mashg'ulot (EDITOR_GUIDE): tekshiruv navbati, izoh yozish, chop etish va izohlarni moderatsiya qilish.
- [ ] **P13.S5.3** Qisqa video qo'llanmalar (ekran yozuvi, 3–5 daqiqa): "Maqola yozish" va "Rasm va manba qo'shish". Ular "Muallif bo'lish" sahifasiga joylashtiriladi.

✅ **Qabul mezonlari:** kamida 3 ta muallif mustaqil ravishda maqolani tekshiruvga yuborgan.

---

## P13.S6 — Launch checklist (ishga tushirish kuni)

- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` — yashil.
- [ ] Prod migratsiyalar qo'llangan, deploy yashil.
- [ ] Barcha env'lar prod qiymatlarida (`NEXT_PUBLIC_SERVER_URL` = haqiqiy domen).
- [ ] `robots.txt` prod'da indekslashga ruxsat beradi (preview'da bermaydi).
- [ ] `sitemap.xml` to'g'ri, faqat chop etilgan kontent.
- [ ] Google Search Console va Yandex Webmaster: domen tasdiqlangan, sitemap yuborilgan.
- [ ] Ikkala tilda, ikkala rejimda, telefon va kompyuterda tekshirilgan.
- [ ] 404 sahifa, xato sahifasi va qidiruv ishlaydi.
- [ ] Backup workflow ishlagan, tiklash testi o'tgan.
- [ ] Uptime monitoring yoqilgan.
- [ ] (P11 bo'lsa) Telegram asosiy kanalga ulangan, test post o'chirilgan.
- [ ] Maktab rahbariyati maxfiylik siyosatini tasdiqlagan.
- [ ] Launch e'loni: Telegram kanal, maktab chatlari.

---

## P13.S7 — Launch'dan keyingi 2 hafta

- [ ] **P13.S7.1** Har kuni: Vercel loglari, uptime va moderatsiya navbati tekshiriladi.
- [ ] **P13.S7.2** 1 haftadan keyin: CSP'ni majburiy rejimga o'tkazish (P12.S1.2).
- [ ] **P13.S7.3** O'quvchilar, mualliflar va muharrirlardan fikr yig'ish (Google Forms yoki qisqa so'rovnoma). Topilgan muammolar `docs/feedback.md` ga yoziladi va GitHub Issues'ga ko'chiriladi.
- [ ] **P13.S7.4** Vercel va Neon foydalanish ko'rsatkichlari (bandwidth, function invocations, storage) bepul limitlarga nisbatan tekshiriladi. 70% dan oshsa, tarifni ko'rib chiqing.

✅ **Qabul mezonlari:** 2 hafta davomida kritik xato yo'q, progress jadvalida P13 = ✅.
