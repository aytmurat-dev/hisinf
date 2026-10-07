# P0 — Tayyorgarlik

**Maqsad:** kod yozishdan oldin barcha akkauntlar, lokal muhit va boshlang'ich kontent tayyor bo'lsin.
**Kim bajaradi:** P0.S1 va P0.S4 ni loyiha egasi (inson) bajaradi. P0.S2–S3 ni AI model ham bajara oladi.

---

## P0.S1 — Akkauntlar (inson bajaradi)

- [x] **P0.S1.1** GitHub: `https://github.com/aytmurat-dev/hisinf` repo mavjud (bo'sh). Tekshirish: `git ls-remote https://github.com/aytmurat-dev/hisinf.git`.
- [x] **P0.S1.2** Vercel: https://vercel.com da GitHub orqali ro'yxatdan o'ting. Loyiha hozircha yaratilmaydi (P1.S7 da yaratiladi).
- [x] **P0.S1.3** Neon: Vercel → **Storage / Marketplace → Neon** orqali yarating. Bu P1.S3 da bajariladi, hozir faqat akkaunt kerak.
- [x] **P0.S1.4** Cloudflare: https://dash.cloudflare.com da akkaunt oching. R2 bo'limini yoqing (bepul tarif uchun ham karta so'ralishi mumkin).
- [x] **P0.S1.5** Resend: https://resend.com da akkaunt oching. Domen bo'lmasa, test uchun `onboarding@resend.dev` manzilidan yuborish mumkin (faqat o'zingizga).
- [ ] **P0.S1.6** Telegram (P11 uchun, hozir ixtiyoriy): @BotFather → `/newbot` bilan bot yarating va tokenni saqlang. Kanal yarating va botni kanalga **administrator** qilib qo'shing.
- [ ] **P0.S1.7** Domen (ixtiyoriy, P13 gacha): `.uz` domen akkreditatsiyalangan registrator orqali olinadi. Domen bo'lmasa, `*.vercel.app` bilan ishlanadi.

✅ **Qabul mezonlari:** GitHub, Vercel, Cloudflare va Resend'ga kirish mumkin. Telegram bot tokeni xavfsiz joyda saqlangan.

---

## P0.S2 — Lokal muhit

- [x] **P0.S2.1** Node.js ≥ 20.9 o'rnatilgan bo'lsin (tavsiya: 22 LTS yoki undan yuqori). Tekshirish: `node --version`.
- [x] **P0.S2.2** pnpm ≥ 9 o'rnatilgan bo'lsin. Tekshirish: `pnpm --version`. Yo'q bo'lsa: `npm i -g pnpm`.
- [x] **P0.S2.3** Git ≥ 2.40. Global sozlamalar: `git config --global user.name` va `user.email` to'ldirilgan bo'lsin.
- [x] **P0.S2.4** VS Code kengaytmalari: ESLint, Prettier, Tailwind CSS IntelliSense.
- [x] **P0.S2.5** Windows'da: Git uchun `git config --global core.autocrlf input` (qator oxirlari aralashib ketmasligi uchun).

✅ **Qabul mezonlari:** `node --version`, `pnpm --version` va `git --version` talab qilingan versiyalarni ko'rsatadi.

---

## P0.S3 — Repozitoriy

- [x] **P0.S3.1** Loyiha papkasi: `D:\Projects\hisinf`. Ichida `docs/plan/` (shu reja), `AGENTS.md` va `CLAUDE.md` bor.
- [x] **P0.S3.2** Git ishga tushirilgan, asosiy branch `main`, remote: `origin = https://github.com/aytmurat-dev/hisinf.git`.
- [x] **P0.S3.3** `docs/BLOCKERS.md` yarating. Mazmuni: `# Bloklovchi muammolar\n\n(hozircha yo'q)\n`.
- [x] **P0.S3.4** Birinchi commit (`docs: execution plan`) GitHub'ga push qilingan.

✅ **Qabul mezonlari:** GitHub'da `docs/plan/README.md` ko'rinadi.

---

## P0.S4 — Kontent tayyorgarligi (inson bajaradi, kod bilan parallel)

Bular P3 dagi seed (boshlang'ich ma'lumot) va P7 dagi menyu uchun kerak. Har birini `docs/content/` papkasida oddiy markdown ro'yxat sifatida yozing.

- [x] **P0.S4.1** `docs/content/periods.md` — **tarixiy davrlar** ro'yxati. Har bir davr uchun: nomi (uz/kaa), boshlanish va tugash yili, 1-2 gaplik tavsif. Masalan: Qadimgi davr; Antik davr (Xorazm, Kang'). Ilk o'rta asrlar; Xorazmshohlar davri; Mo'g'ullar va Oltin O'rda; Temuriylar; Xiva xonligi; Rossiya imperiyasi davri; Sovet davri; Mustaqillik davri. Ro'yxatni o'qituvchi tasdiqlaydi.
- [x] **P0.S4.2** `docs/content/regions.md` — **hududlar**: Qoraqalpog'iston, Xorazm, Buxoro, Samarqand va boshqalar (uz/kaa nomlari).
- [x] **P0.S4.3** `docs/content/menu.md` — **menyu daraxti** (maksimum 2 daraja, yuqori darajada ko'pi bilan 7 element). Tavsiya etilgan variant:
  - Bosh sahifa
  - Maqolalar → (kategoriyalar: Siyosiy tarix, Madaniyat, Arxeologiya, Shaxslar hayoti, Shaharlar tarixi)
  - Davrlar → (P0.S4.1 dagi davrlar)
  - Xronologiya
  - Shaxslar
  - Arxiv → (Fotosuratlar, Hujjatlar, Xaritalar, Qo'lyozmalar)
  - Xarita
  - Loyiha haqida → (Biz haqimizda, Mualliflar, Muallif bo'lish, Aloqa)
- [ ] **P0.S4.4** **Pilot kontent:** 5 ta maqola (o'zbekcha; iloji bo'lsa qoraqalpoqchasi ham), 10 ta shaxs, 20 ta voqea, 10 ta joy (koordinatalari bilan), 10 ta arxiv birligi. Har birida **manba** va **rasm litsenziyasi** ko'rsatilgan bo'lsin.
- [ ] **P0.S4.5** **Rollar:** kim admin (1–2 kishi), kim muharrir (o'qituvchilar) va kim muallif (ko'ngilli o'quvchilar) — ro'yxat tuzing (ism va email).
- [ ] **P0.S4.6** **Qoraqalpoq tili tekshiruvchisi** tayinlangan (o'qituvchi yoki ona tili egasi).
- [ ] **P0.S4.7** **Sayt nomi va logotip.** Vaqtincha nom: `HISINF`. Haqiqiy nom va logo SVG ko'rinishida (yorug' va qorong'i variantlari) tayyorlanadi.
- [ ] **P0.S4.8** **Matnlar:** "Biz haqimizda", "Maxfiylik siyosati", "Foydalanish shartlari", "Muallif bo'lish" (uz/kaa). Maxfiylik siyosati maktab rahbariyati bilan kelishiladi.

✅ **Qabul mezonlari:** `docs/content/` ichida 1–3 punktlar uchun fayllar bor. Pilot kontent kamida 50% tayyor.
