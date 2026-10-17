'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Link } from '@/i18n/navigation'
import {
  Play,
  Pause,
  RotateCcw,
  Compass,
  ArrowRight,
  Layers,
  ZoomIn,
  ZoomOut,
  Info,
  MapPin,
  Sparkles,
  Calendar,
} from 'lucide-react'

// --- Types ---
export type EpochYear = 1917 | 1920 | 1924 | 1925 | 1930 | 1936

export interface HistoricalSite {
  id: string
  nameUz: string
  nameKaa: string
  x: number // SVG coordinates (0 - 1000)
  y: number // SVG coordinates (0 - 680)
  statusByYear: Record<EpochYear, {
    typeUz: string
    typeKaa: string
    isCapital?: boolean
    isSubCapital?: boolean
  }>
  delimitationRoleUz: string
  delimitationRoleKaa: string
  descriptionUz: string
  descriptionKaa: string
  articleSlug?: string
}

export interface Territory {
  id: string
  nameUz: string
  nameKaa: string
  color: string
  strokeColor: string
  fillOpacity: number
  capitalUz: string
  capitalKaa: string
  legalStatusUz: string
  legalStatusKaa: string
  populationUz: string
  populationKaa: string
  decreeUz: string
  decreeKaa: string
  path: string // SVG polygon / path definition
}

export interface EpochData {
  year: EpochYear
  titleUz: string
  titleKaa: string
  shortLabelUz: string
  shortLabelKaa: string
  descriptionUz: string
  descriptionKaa: string
  legalDecreeUz: string
  legalDecreeKaa: string
  territories: Territory[]
}

// --- Historical Epochs Data ---
const EPOCHS: EpochData[] = [
  {
    year: 1917,
    titleUz: '1917-yil: Imperiya va xonliklar davri',
    titleKaa: '1917-jıl: Imperiya hám xanlıqlar dáwiri',
    shortLabelUz: '1917 Imperiya',
    shortLabelKaa: '1917 Imperiya',
    descriptionUz: 'Rossiya imperiyasi qulashi arafasida Markaziy Osiyo: Turkiston general-gubernatorligi, Buxoro amirligi va Xiva xonligi protektorat maqomida mavjud edi.',
    descriptionKaa: 'Rossiya imperiyası qulawı aldında Oraylıq Aziya: Túrkstan general-gubernatorlıǵı, Buxara ámirshiligi hám Xiywa xanlıǵı protektorat formasında bar edi.',
    legalDecreeUz: 'Tsarizm maʼmuriy boʻlinishi: Turkiston oʻlkasi (Sirdaryo, Samarqand, Fargʻona viloyatlari).',
    legalDecreeKaa: 'Tsarizm administrativlik bólinisi: Túrkstan úlkesi (Sırdárya, Samarqand, Ferǵana wálayatları).',
    territories: [
      {
        id: 'turkestan-general',
        nameUz: 'Turkiston general-gubernatorligi',
        nameKaa: 'Túrkstan general-gubernatorlıǵı',
        color: '#d97706',
        strokeColor: '#b45309',
        fillOpacity: 0.35,
        capitalUz: 'Toshkent',
        capitalKaa: 'Tashkent',
        legalStatusUz: 'Rossiya imperiyasi maʼmuriy boshqaruvi',
        legalStatusKaa: 'Rossiya imperiyası administrativlik basqarıwı',
        populationUz: 'Taxminan 6.5 mln kishi (oʻzbeklar, qozogʻlar, qirgʻizlar, tojiklar)',
        populationKaa: 'Shama menen 6.5 mln adam (ózbekler, qazaqlar, qırǵızlar, tájikler)',
        decreeUz: '1886-yilgi Turkiston oʻlkasini boshqarish toʻgʻrisidagi nizom.',
        decreeKaa: '1886-jılǵı Túrkstan úlkesin basqarıw haqqındaǵı nızam.',
        path: 'M 260 120 L 520 120 L 760 220 L 970 300 L 990 480 L 890 530 L 780 470 L 680 420 L 520 400 L 350 340 L 260 260 Z',
      },
      {
        id: 'bukhara-emirate',
        nameUz: 'Buxoro amirligi (Protektorat)',
        nameKaa: 'Buxara ámirshiligi (Protektorat)',
        color: '#059669',
        strokeColor: '#047857',
        fillOpacity: 0.35,
        capitalUz: 'Buxoro',
        capitalKaa: 'Buxara',
        legalStatusUz: 'Mustaqil amirlik (Rossiya imperiyasi protektorati)',
        legalStatusKaa: 'Gárezsiz ámirshilik (Rossiya imperiyası protektoratı)',
        populationUz: 'Taxminan 3 mln kishi',
        populationKaa: 'Shama menen 3 mln adam',
        decreeUz: 'Amir Said Olimxon boshqaruvi.',
        decreeKaa: 'Ámir Seyid Álimxan basqarıwı.',
        path: 'M 400 450 L 560 440 L 680 420 L 780 470 L 890 530 L 820 620 L 680 640 L 520 560 L 400 500 Z',
      },
      {
        id: 'khiva-khanate',
        nameUz: 'Xiva xonligi (Protektorat)',
        nameKaa: 'Xiywa xanlıǵı (Protektorat)',
        color: '#dc2626',
        strokeColor: '#b91c1c',
        fillOpacity: 0.35,
        capitalUz: 'Xiva',
        capitalKaa: 'Xiywa',
        legalStatusUz: 'Mustaqil xonlik (Rossiya imperiyasi protektorati)',
        legalStatusKaa: 'Gárezsiz xanlıq (Rossiya imperiyası protektoratı)',
        populationUz: 'Taxminan 800 ming kishi (oʻzbeklar, qoraqalpoqlar, turkmanlar)',
        populationKaa: 'Shama menen 800 mıń adam (ózbekler, qaraqalpaqlar, túrkmenler)',
        decreeUz: 'Asfandiyorxon boshqaruvi (1910–1918).',
        decreeKaa: 'Asfandiyarxan basqarıwı (1910–1918).',
        path: 'M 160 270 L 290 260 L 360 340 L 400 450 L 330 480 L 250 430 L 160 350 Z',
      },
    ],
  },
  {
    year: 1920,
    titleUz: '1920-yil: Xalq Sovet Respublikalari davri',
    titleKaa: '1920-jıl: Xalıq Sovet Respublikaları dáwiri',
    shortLabelUz: '1920 Respublikalar',
    shortLabelKaa: '1920 Respublikalar',
    descriptionUz: 'Inqilob natijasida amirlik va xonlik agʻdarildi. Buxoro Xalq Sovet Respublikasi (BXSR) va Xorazm Xalq Sovet Respublikasi (XXSR) tuzildi, Turkiston ASSR RSFSR tarkibida kengaydi.',
    descriptionKaa: 'Revolyutsiya nátiyjesinde ámirshilik hám xanlıq awdarıldı. Buxara Xalıq Sovet Respublikası (BXSR) hám Xorezm Xalıq Sovet Respublikası (XXSR) dúzildi, Túrkstan ASSR RSFSR quramında keńeydi.',
    legalDecreeUz: '1920-yil 26-aprel XXSR eʼlon qilinishi; 1920-yil 6-oktyabr BXSR eʼlon qilinishi.',
    legalDecreeKaa: '1920-jıl 26-aprel XXSR daǵaza etiliwi; 1920-jıl 6-oktyabr BXSR daǵaza etiliwi.',
    territories: [
      {
        id: 'turkestan-assr',
        nameUz: 'Turkiston ASSR (RSFSR tarkibida)',
        nameKaa: 'Túrkstan ASSR (RSFSR quramında)',
        color: '#d97706',
        strokeColor: '#b45309',
        fillOpacity: 0.38,
        capitalUz: 'Toshkent',
        capitalKaa: 'Tashkent',
        legalStatusUz: 'Muxtor Sovet Respublikasi (RSFSR)',
        legalStatusKaa: 'Avtonomiyalı Sovet Respublikası (RSFSR)',
        populationUz: 'Taxminan 5.2 mln kishi',
        populationKaa: 'Shama menen 5.2 mln adam',
        decreeUz: 'Turkiston Sovetlarining V syezdi qarori.',
        decreeKaa: 'Túrkstan Sovetleriniń V siezdi qararı.',
        path: 'M 260 120 L 520 120 L 760 220 L 970 300 L 990 480 L 890 530 L 780 470 L 680 420 L 520 400 L 350 340 L 260 260 Z',
      },
      {
        id: 'bukhara-bxsr',
        nameUz: 'Buxoro Xalq Sovet Respublikasi (BXSR)',
        nameKaa: 'Buxara Xalıq Sovet Respublikası (BXSR)',
        color: '#059669',
        strokeColor: '#047857',
        fillOpacity: 0.38,
        capitalUz: 'Buxoro (Eski Buxoro)',
        capitalKaa: 'Buxara (Eski Buxara)',
        legalStatusUz: 'Mustaqil Xalq Sovet Respublikasi',
        legalStatusKaa: 'Gárezsiz Xalıq Sovet Respublikası',
        populationUz: 'Taxminan 2.8 mln kishi',
        populationKaa: 'Shama menen 2.8 mln adam',
        decreeUz: 'Fayzulla Xoʻjayev boshchiligidagi Xalq Nozirlar Shoʻrosi.',
        decreeKaa: 'Fayzulla Xojayev basshılıǵındaǵı Xalıq Nazirler Keńesi.',
        path: 'M 400 450 L 560 440 L 680 420 L 780 470 L 890 530 L 820 620 L 680 640 L 520 560 L 400 500 Z',
      },
      {
        id: 'khorezm-xxsr',
        nameUz: 'Xorazm Xalq Sovet Respublikasi (XXSR)',
        nameKaa: 'Xorezm Xalıq Sovet Respublikası (XXSR)',
        color: '#dc2626',
        strokeColor: '#b91c1c',
        fillOpacity: 0.38,
        capitalUz: 'Xiva',
        capitalKaa: 'Xiywa',
        legalStatusUz: 'Mustaqil Xalq Sovet Respublikasi',
        legalStatusKaa: 'Gárezsiz Xalıq Sovet Respublikası',
        populationUz: 'Taxminan 820 ming kishi',
        populationKaa: 'Shama menen 820 mıń adam',
        decreeUz: 'I Butunxorazm Xalq Vakillari Qurultoyi qarori.',
        decreeKaa: 'I Pútkilxorezm Xalıq Wákilleri Qurultayı qararı.',
        path: 'M 160 270 L 290 260 L 360 340 L 400 450 L 330 480 L 250 430 L 160 350 Z',
      },
    ],
  },
  {
    year: 1924,
    titleUz: '1924-yil: Milliy-hududiy chegaralanish (Tarixiy burilish)',
    titleKaa: '1924-jıl: Milliy-aymaqlıq shegaralanıw (Tariyxıy burılıs)',
    shortLabelUz: '★ 1924 Chegaralanish',
    shortLabelKaa: '★ 1924 Shegaralanıw',
    descriptionUz: '1924-yil 27-oktyabrda SSSR MIQ qarori bilan Oʻzbekiston SSR tashkil etildi (poytaxti Samarqand). Toʻrtkoʻl markazi bilan Qoraqalpogʻiston Muxtor Viloyati tuzildi. Tojikiston ASSR Oʻzbekiston tarkibida muxtoriyat oldi.',
    descriptionKaa: '1924-jıl 27-oktyabrde SSSR OAK qararı menen Ózbekstan SSR dúzildi (paytaxtı Samarqand). Tórtkúl orayı menen Qaraqalpaqstan Avtonomiyalı Wálayatı dúzildi. Tájikstan ASSR Ózbekstan quramında avtonomiya aldı.',
    legalDecreeUz: 'SSSR Markaziy Ijroiya Qoʻmitasi (MIQ) II sessiyasi qarori: «Oʻrta Osiyo respublikalarini milliy-davlat chegaralanishi toʻgʻrisida».',
    legalDecreeKaa: 'SSSR Oraylıq Atqarıw Komiteti (OAK) II sessiyası qararı: «Oraylıq Aziya respublikaların milliy-mámleketlik shegaralanıwı haqqında».',
    territories: [
      {
        id: 'uzbekistan-ssr-1924',
        nameUz: 'Oʻzbekiston SSR',
        nameKaa: 'Ózbekstan SSR',
        color: '#2563eb',
        strokeColor: '#1d4ed8',
        fillOpacity: 0.44,
        capitalUz: 'Samarqand (1925–1930)',
        capitalKaa: 'Samarqand (1925–1930)',
        legalStatusUz: 'Ittifoqdosh Sovet Sotsialistik Respublikasi',
        legalStatusKaa: 'Awqamlas Sovet Sotsialistlik Respublikası',
        populationUz: '4 million 445 ming kishi',
        populationKaa: '4 million 445 mıń adam',
        decreeUz: '1924-yil 27-oktyabr SSSR MIQ qarori; Fayzulla Xoʻjayev Inqilobiy qoʻmita raisi.',
        decreeKaa: '1924-jıl 27-oktyabr SSSR OAK qararı; Fayzulla Xojayev Revolyutsiyalıq komitet baslıǵı.',
        path: 'M 320 440 L 410 420 L 510 390 L 610 380 L 730 360 L 850 410 L 980 430 L 970 480 L 880 490 L 790 480 L 710 510 L 670 630 L 580 610 L 480 540 L 360 480 Z',
      },
      {
        id: 'karakalpak-ao-1924',
        nameUz: 'Qoraqalpogʻiston Muxtor Viloyati',
        nameKaa: 'Qaraqalpaqstan Avtonomiyalı Wálayatı',
        color: '#059669',
        strokeColor: '#047857',
        fillOpacity: 0.44,
        capitalUz: 'Toʻrtkoʻl (1925–1932)',
        capitalKaa: 'Tórtkúl (1925–1932)',
        legalStatusUz: 'Muxtor viloyat (Qozogʻiston ASSR / RSFSR tarkibida)',
        legalStatusKaa: 'Avtonomiyalı wálayat (Qazaqstan ASSR / RSFSR quramında)',
        populationUz: '304 ming kishi (qoraqalpoqlar, qozoqlar, oʻzbeklar)',
        populationKaa: '304 mıń adam (qaraqalpaqlar, qazaqlar, ózbekler)',
        decreeUz: 'Allayar Doʻstnazarov va Abu Qudabayev tashabbusi bilan birlashtirilgan milliy hudud.',
        decreeKaa: 'Allayar Dosnazarov hám Ábiw Qudabaev baslaması menen birlestirilgen milliy aymaq.',
        path: 'M 140 180 L 250 160 L 340 260 L 380 370 L 320 440 L 260 430 L 190 350 L 140 270 Z',
      },
      {
        id: 'tajik-assr-1924',
        nameUz: 'Tojikiston ASSR (OʻzSSR tarkibida)',
        nameKaa: 'Tájikstan ASSR (ÓzSSR quramında)',
        color: '#7c3aed',
        strokeColor: '#6d28d9',
        fillOpacity: 0.44,
        capitalUz: 'Dushanbe (Dyushambe)',
        capitalKaa: 'Dushanbe (Dyushambe)',
        legalStatusUz: 'Oʻzbekiston SSR tarkibidagi Muxtor Sovet Respublikasi',
        legalStatusKaa: 'Ózbekstan SSR quramındaǵı Avtonomiyalı Sovet Respublikası',
        populationUz: 'Taxminan 740 ming kishi',
        populationKaa: 'Shama menen 740 mıń adam',
        decreeUz: '1924-yil 14-oktyabr Butunrossiya MIQ qarori.',
        decreeKaa: '1924-jıl 14-oktyabr Pútkilrossiya OAK qararı.',
        path: 'M 790 480 L 880 490 L 970 480 L 980 570 L 890 620 L 780 610 L 710 510 Z',
      },
      {
        id: 'turkmen-ssr-1924',
        nameUz: 'Turkmaniston SSR',
        nameKaa: 'Túrkmenstan SSR',
        color: '#ea580c',
        strokeColor: '#c2410c',
        fillOpacity: 0.28,
        capitalUz: 'Ashxobod (Poltoratsk)',
        capitalKaa: 'Ashxabad (Poltoratsk)',
        legalStatusUz: 'Ittifoqdosh respublika',
        legalStatusKaa: 'Awqamlas respublika',
        populationUz: 'Taxminan 1 mln kishi',
        populationKaa: 'Shama menen 1 mln adam',
        decreeUz: '1924-yil 27-oktyabr SSSR MIQ qarori.',
        decreeKaa: '1924-jıl 27-oktyabr SSSR OAK qararı.',
        path: 'M 200 450 L 360 480 L 480 540 L 580 610 L 520 670 L 340 670 L 180 560 Z',
      },
    ],
  },
  {
    year: 1925,
    titleUz: '1925-yil: Davlatchilik deklaratsiyasi va Taʼsis syezdlari',
    titleKaa: '1925-jıl: Mámleketshilik deklaratsiyası hám Shólkemlestiriw siezdleri',
    shortLabelUz: '1925 Taʼsis',
    shortLabelKaa: '1925 Shólkemlestiriw',
    descriptionUz: 'Buxoro va Samarqandda Oʻzbekiston SSR I Taʼsis qurultoylari oʻtkazildi. Toʻrtkoʻlda Qoraqalpogʻiston Muxtor Viloyati I Taʼsis syezdi boʻlib oʻtdi. Chegaralar amalda mustahkamlandi.',
    descriptionKaa: 'Buxara hám Samarqandta Ózbekstan SSR I Shólkemlestiriw qurultayları ótkerildi. Tórtkúlde Qaraqalpaqstan Avtonomiyalı Wálayatı I Shólkemlestiriw siezdi bolıp ótti. Shegaralar ámelde bekkemlendi.',
    legalDecreeUz: '1925-yil 13-fevral Buxoro: Oʻzbekiston SSR tuzilganligi toʻgʻrisida Deklaratsiya qabul qilindi.',
    legalDecreeKaa: '1925-jıl 13-fevral Buxara: Ózbekstan SSR dúzilgenligi haqqında Deklaratsiya qabıl etildi.',
    territories: [
      {
        id: 'uzbekistan-ssr-1925',
        nameUz: 'Oʻzbekiston SSR',
        nameKaa: 'Ózbekstan SSR',
        color: '#2563eb',
        strokeColor: '#1d4ed8',
        fillOpacity: 0.44,
        capitalUz: 'Samarqand (Rasmiy poytaxt)',
        capitalKaa: 'Samarqand (Rásmiy paytaxt)',
        legalStatusUz: 'SSSR tarkibidagi toʻla huquqli ittifoqdosh davlat',
        legalStatusKaa: 'SSSR quramındaǵı tolıq huqıqlı awqamlas mámleket',
        populationUz: '4.5 million kishi',
        populationKaa: '4.5 million adam',
        decreeUz: '1925-yil may: SSSR Sovetlari III syezdida Oʻzbekiston SSR rasman SSSR tarkibiga qabul qilindi.',
        decreeKaa: '1925-jıl may: SSSR Sovetleri III siezdinde Ózbekstan SSR rásmiy SSSR quramına qabıl etildi.',
        path: 'M 320 440 L 410 420 L 510 390 L 610 380 L 730 360 L 850 410 L 980 430 L 970 480 L 880 490 L 790 480 L 710 510 L 670 630 L 580 610 L 480 540 L 360 480 Z',
      },
      {
        id: 'karakalpak-ao-1925',
        nameUz: 'Qoraqalpogʻiston Muxtor Viloyati',
        nameKaa: 'Qaraqalpaqstan Avtonomiyalı Wálayatı',
        color: '#059669',
        strokeColor: '#047857',
        fillOpacity: 0.44,
        capitalUz: 'Toʻrtkoʻl',
        capitalKaa: 'Tórtkúl',
        legalStatusUz: 'Muxtor viloyat (Toʻrtkoʻl I Syezdi)',
        legalStatusKaa: 'Avtonomiyalı wálayat (Tórtkúl I Siezdi)',
        populationUz: '310 ming kishi',
        populationKaa: '310 mıń adam',
        decreeUz: '1925-yil 12–19-fevral: Toʻrtkoʻlda I Taʼsis syezdi boʻlib oʻtdi.',
        decreeKaa: '1925-jıl 12–19-fevral: Tórtkúlde I Shólkemlestiriw siezdi bolıp ótti.',
        path: 'M 140 180 L 250 160 L 340 260 L 380 370 L 320 440 L 260 430 L 190 350 L 140 270 Z',
      },
      {
        id: 'tajik-assr-1925',
        nameUz: 'Tojikiston ASSR (OʻzSSR tarkibida)',
        nameKaa: 'Tájikstan ASSR (ÓzSSR quramında)',
        color: '#7c3aed',
        strokeColor: '#6d28d9',
        fillOpacity: 0.44,
        capitalUz: 'Dushanbe',
        capitalKaa: 'Dushanbe',
        legalStatusUz: 'OʻzSSR tarkibidagi muxtoriyat',
        legalStatusKaa: 'ÓzSSR quramındaǵı avtonomiya',
        populationUz: '750 ming kishi',
        populationKaa: '750 mıń adam',
        decreeUz: 'Tojikiston Inqilobiy qoʻmitasi faoliyati.',
        decreeKaa: 'Tájikstan Revolyutsiyalıq komiteti jumısı.',
        path: 'M 790 480 L 880 490 L 970 480 L 980 570 L 890 620 L 780 610 L 710 510 Z',
      },
    ],
  },
  {
    year: 1930,
    titleUz: '1930-yil: Poytaxtning Toshkentga koʻchirilishi & Tojikiston SSR ajralishi',
    titleKaa: '1930-jıl: Paytaxttıń Tashkentke kóshiriliwi & Tájikstan SSR ajıralıwı',
    shortLabelUz: '1930 Toshkent',
    shortLabelKaa: '1930 Tashkent',
    descriptionUz: '1929-yilda Tojikiston ASSR Oʻzbekiston tarkibidan chiqib, alohida 7-Ittifoqdosh respublikaga aylandi. 1930-yilda Oʻzbekiston SSR poytaxti Samarqanddan Toshkentga koʻchirildi.',
    descriptionKaa: '1929-jılda Tájikstan ASSR Ózbekstan quramınan shıǵıp, bólek 7-Awqamlas respublikaǵa aylandı. 1930-jılda Ózbekstan SSR paytaxtı Samarqandtan Tashkentke kóshirildi.',
    legalDecreeUz: '1930-yil OʻzSSR Markaziy Ijroiya Qoʻmitasi qarori: Poytaxt Toshkent shahri deb eʼlon qilindi.',
    legalDecreeKaa: '1930-jıl ÓzSSR Oraylıq Atqarıw Komiteti qararı: Paytaxt Tashkent qalası dep daǵaza etildi.',
    territories: [
      {
        id: 'uzbekistan-ssr-1930',
        nameUz: 'Oʻzbekiston SSR (Yangi poytaxt: Toshkent)',
        nameKaa: 'Ózbekstan SSR (Jańa paytaxt: Tashkent)',
        color: '#2563eb',
        strokeColor: '#1d4ed8',
        fillOpacity: 0.44,
        capitalUz: 'Toshkent (1930-yildan yangi poytaxt)',
        capitalKaa: 'Tashkent (1930-jıldan jańa paytaxt)',
        legalStatusUz: 'Ittifoqdosh respublika',
        legalStatusKaa: 'Awqamlas respublika',
        populationUz: '4.8 million kishi',
        populationKaa: '4.8 million adam',
        decreeUz: '1930-yilda hukumat muassasalari Samarqanddan Toshkentga toʻliq koʻchirildi.',
        decreeKaa: '1930-jılda húkimet mákemeleri Samarqandtan Tashkentke tolıq kóshirildi.',
        path: 'M 320 440 L 410 420 L 510 390 L 610 380 L 730 360 L 850 410 L 980 430 L 970 480 L 880 490 L 790 480 L 710 510 L 670 630 L 580 610 L 480 540 L 360 480 Z',
      },
      {
        id: 'karakalpak-ao-1930',
        nameUz: 'Qoraqalpogʻiston Muxtor Viloyati',
        nameKaa: 'Qaraqalpaqstan Avtonomiyalı Wálayatı',
        color: '#059669',
        strokeColor: '#047857',
        fillOpacity: 0.44,
        capitalUz: 'Toʻrtkoʻl',
        capitalKaa: 'Tórtkúl',
        legalStatusUz: 'Muxtor viloyat (1932-yilda ASSRga aylantirilgan)',
        legalStatusKaa: 'Avtonomiyalı wálayat (1932-jılda ASSRge aylandırılǵan)',
        populationUz: '330 ming kishi',
        populationKaa: '330 mıń adam',
        decreeUz: 'RSFSR bevosita boʻysunuviga oʻtkazilgan davr.',
        decreeKaa: 'RSFSR tikkeley boysınıwına ótkerilgen dáwir.',
        path: 'M 140 180 L 250 160 L 340 260 L 380 370 L 320 440 L 260 430 L 190 350 L 140 270 Z',
      },
      {
        id: 'tajik-ssr-1930',
        nameUz: 'Tojikiston SSR (Alohida Ittifoqdosh Respublika)',
        nameKaa: 'Tájikstan SSR (Bólek Awqamlas Respublika)',
        color: '#7c3aed',
        strokeColor: '#6d28d9',
        fillOpacity: 0.28,
        capitalUz: 'Stalinobod (Dushanbe)',
        capitalKaa: 'Stalinabad (Dushanbe)',
        legalStatusUz: 'SSSRning 7-Ittifoqdosh respublikasi (1929-yildan)',
        legalStatusKaa: 'SSSRdiń 7-Awqamlas respublikası (1929-jıldan)',
        populationUz: 'Taxminan 1.1 mln kishi',
        populationKaa: 'Shama menen 1.1 mln adam',
        decreeUz: '1929-yil 16-oktyabr Tojikiston Sovetlarining navbatdan tashqari syezdi.',
        decreeKaa: '1929-jıl 16-oktyabr Tájikstan Sovetleriniń náwbettegi tıs siezdi.',
        path: 'M 790 480 L 880 490 L 970 480 L 980 570 L 890 620 L 780 610 L 710 510 Z',
      },
    ],
  },
  {
    year: 1936,
    titleUz: '1936-yil: Qoraqalpogʻiston ASSRning Oʻzbekiston tarkibiga kirishi',
    titleKaa: '1936-jıl: Qaraqalpaqstan ASSRnıń Ózbekstan quramına kiriwi',
    shortLabelUz: '1936 Birlashuv',
    shortLabelKaa: '1936 Birlesiw',
    descriptionUz: '1936-yilgi SSSR Konstitutsiyasi bilan Qoraqalpogʻiston ASSR toʻgʻridan-toʻgʻri Oʻzbekiston SSR tarkibiga oʻtkazildi. Tarixiy qardosh xalqlarning zamonaviy birlashgan chegaralari toʻliq shakllandi.',
    descriptionKaa: '1936-jılǵı SSSR Konstitutsiyası menen Qaraqalpaqstan ASSR tikkeley Ózbekstan SSR quramına ótkerildi. Tariyxıy qardas xalıqlardıń házirgi birlesken shegaraları tolıq qáliplesti.',
    legalDecreeUz: '1936-yil 5-dekabr Butunittifoq Sovetlar syezdi: Yangi Konstitutsiyaga asosan Qoraqalpogʻiston ASSR Oʻzbekiston SSR tarkibiga kirdi.',
    legalDecreeKaa: '1936-jıl 5-dekabr Pútkilawqamlıq Sovetler siezdi: Jańa Konstitutsiyaǵa muwapıq Qaraqalpaqstan ASSR Ózbekstan SSR quramına kirdi.',
    territories: [
      {
        id: 'uzbekistan-ssr-main-1936',
        nameUz: 'Oʻzbekiston SSR (Asosiy hudud)',
        nameKaa: 'Ózbekstan SSR (Tiykarǵı aymaq)',
        color: '#2563eb',
        strokeColor: '#1d4ed8',
        fillOpacity: 0.44,
        capitalUz: 'Toshkent',
        capitalKaa: 'Tashkent',
        legalStatusUz: 'Ittifoqdosh respublika',
        legalStatusKaa: 'Awqamlas respublika',
        populationUz: '6.3 million kishi',
        populationKaa: '6.3 million adam',
        decreeUz: '1936-yilgi Konstitutsiya bilan mustahkamlangan yagona davlatchilik.',
        decreeKaa: '1936-jılǵı Konstitutsiya menen bekkemlengen bir tutas mámleketshilik.',
        path: 'M 320 440 L 410 420 L 510 390 L 610 380 L 730 360 L 850 410 L 980 430 L 970 480 L 880 490 L 790 480 L 710 510 L 670 630 L 580 610 L 480 540 L 360 480 Z',
      },
      {
        id: 'karakalpak-assr-1936',
        nameUz: 'Qoraqalpogʻiston ASSR (OʻzSSR tarkibida)',
        nameKaa: 'Qaraqalpaqstan ASSR (ÓzSSR quramında)',
        color: '#059669',
        strokeColor: '#047857',
        fillOpacity: 0.48,
        capitalUz: 'Nukus (1932-yildan yangi poytaxt)',
        capitalKaa: 'Nókis (1932-jıldan jańa paytaxt)',
        legalStatusUz: 'Oʻzbekiston SSR tarkibidagi Muxtor Sovet Respublikasi',
        legalStatusKaa: 'Ózbekstan SSR quramındaǵı Avtonomiyalı Sovet Respublikası',
        populationUz: '390 ming kishi',
        populationKaa: '390 mıń adam',
        decreeUz: '1936-yil 5-dekabr SSSR Konstitutsiyasi 26-moddasi.',
        decreeKaa: '1936-jıl 5-dekabr SSSR Konstitutsiyası 26-statyası.',
        path: 'M 140 180 L 250 160 L 340 260 L 380 370 L 320 440 L 260 430 L 190 350 L 140 270 Z',
      },
    ],
  },
]

// --- Historical City Sites ---
const HISTORICAL_SITES: HistoricalSite[] = [
  {
    id: 'samarqand',
    nameUz: 'Samarqand',
    nameKaa: 'Samarqand',
    x: 620,
    y: 500,
    statusByYear: {
      1917: { typeUz: 'Samarqand viloyati markazi', typeKaa: 'Samarqand wálayatı orayı' },
      1920: { typeUz: 'Turkiston ASSR viloyat markazi', typeKaa: 'Túrkstan ASSR wálayat orayı' },
      1924: { typeUz: '★ Oʻzbekiston SSR poytaxti (1925–1930)', typeKaa: '★ Ózbekstan SSR paytaxtı (1925–1930)', isCapital: true },
      1925: { typeUz: '★ Oʻzbekiston SSR poytaxti & Taʼsis syezdi', typeKaa: '★ Ózbekstan SSR paytaxtı & Shólkemlestiriw siezdi', isCapital: true },
      1930: { typeUz: 'Tarixiy madaniyat va fan markazi', typeKaa: 'Tariyxıy mádeniyat hám ilim orayı' },
      1936: { typeUz: 'Yirik viloyat va sanoat markazi', typeKaa: 'Iri wálayat hám sanaat orayı' },
    },
    delimitationRoleUz: '1924-yil 27-oktyabrdan soʻng yangi tuzilgan Oʻzbekiston SSRning birinchi poytaxti. Fayzulla Xoʻjayev boshchiligidagi hukumat Registon maydonida faoliyat yuritgan.',
    delimitationRoleKaa: '1924-jıl 27-oktyabrden soń jańa dúzilgen Ózbekstan SSRnıń birinshi paytaxtı. Fayzulla Xojayev basshılıǵındaǵı húkimet Registon maydanında islegen.',
    descriptionUz: '1925-yilda Oʻzbekiston SSR Deklaratsiyasi Registonda tantanali eʼlon qilingan. 1930-yilda poytaxt Toshkentga koʻchirildi.',
    descriptionKaa: '1925-jılda Ózbekstan SSR Deklaratsiyası Registonda daǵaza etilgen. 1930-jılda paytaxt Tashkentke kóshirildi.',
    articleSlug: 'ozbekiston-ssr-tashkil-topishi-1924',
  },
  {
    id: 'tortkol',
    nameUz: 'Toʻrtkoʻl (Petroaleksandrovsk)',
    nameKaa: 'Tórtkúl (Petroaleksandrovsk)',
    x: 350,
    y: 390,
    statusByYear: {
      1917: { typeUz: 'Amudaryo boʻlimi harbiy markazi', typeKaa: 'Ámiwdárya bólimi áskeriy orayı' },
      1920: { typeUz: 'Amudaryo viloyati markazi', typeKaa: 'Ámiwdárya wálayatı orayı' },
      1924: { typeUz: '★ Qoraqalpogʻiston MV birinchi poytaxti', typeKaa: '★ Qaraqalpaqstan AW birinshi paytaxtı', isSubCapital: true },
      1925: { typeUz: '★ Qoraqalpogʻiston MV poytaxti (I Taʼsis syezdi)', typeKaa: '★ Qaraqalpaqstan AW paytaxtı (I Shólkemlestiriw siezdi)', isSubCapital: true },
      1930: { typeUz: 'Qoraqalpogʻiston poytaxti (1932 gacha)', typeKaa: 'Qaraqalpaqstan paytaxtı (1932 ge shekem)', isSubCapital: true },
      1936: { typeUz: 'Qadimiy shahar va tuman markazi', typeKaa: 'Áyyemgi qala hám rayon orayı' },
    },
    delimitationRoleUz: 'Qoraqalpogʻiston Muxtor Viloyatining birinchi poytaxti. Allayar Doʻstnazarov va Abu Qudabayev tashabbusi bilan 1925-yil fevralda I Taʼsis syezdi shu yerda oʻtkazilgan.',
    delimitationRoleKaa: 'Qaraqalpaqstan Avtonomiyalı Wálayatınıń birinshi paytaxtı. Allayar Dosnazarov hám Ábiw Qudabaev baslaması menen 1925-jıl fevralda I Shólkemlestiriw siezdi usı jerde ótkerilgen.',
    descriptionUz: 'Amudaryo qirgʻogʻini suv yuvishi xavfi tufayli 1932-yilda poytaxt Nukus shahriga koʻchirilgan.',
    descriptionKaa: 'Ámiwdárya qırǵaǵın suw jıwıwı qáwpi sebepli 1932-jılda paytaxt Nókis qalasına kóshirilgen.',
    articleSlug: 'qoraqalpogiston-muxtor-viloyatining-tashkil-topishi',
  },
  {
    id: 'toshkent',
    nameUz: 'Toshkent',
    nameKaa: 'Tashkent',
    x: 730,
    y: 360,
    statusByYear: {
      1917: { typeUz: 'Turkiston general-gubernatorligi markazi', typeKaa: 'Túrkstan general-gubernatorlıǵı orayı' },
      1920: { typeUz: '★ Turkiston ASSR poytaxti', typeKaa: '★ Túrkstan ASSR paytaxtı', isCapital: true },
      1924: { typeUz: 'Chegaralanish komissiyasi qarorgohi', typeKaa: 'Shegaralanıw komissiyası orayı' },
      1925: { typeUz: 'Toshkent viloyati markazi', typeKaa: 'Tashkent wálayatı orayı' },
      1930: { typeUz: '★ Oʻzbekiston SSR poytaxti (1930 dan)', typeKaa: '★ Ózbekstan SSR paytaxtı (1930 dan)', isCapital: true },
      1936: { typeUz: '★ Oʻzbekiston SSR poytaxti', typeKaa: '★ Ózbekstan SSR paytaxtı', isCapital: true },
    },
    delimitationRoleUz: 'Mintaqaviy boshqaruv markazi. 1924-yil 16-sentyabrda Turkiston MIQ sessiyasida chegaralanish toʻgʻrisidagi tarixiy qaror aynan Toshkentda qabul qilingan.',
    delimitationRoleKaa: 'Aymaqlıq basqarıw orayı. 1924-jıl 16-sentyabrde Túrkstan OAK sessiyasında shegaralanıw haqqındaǵı tariyxıy qarar Tashkentte qabıl etilgen.',
    descriptionUz: '1930-yildan to hozirgi kungacha Oʻzbekiston davlatining bosh poytaxti va eng yirik megapolisi.',
    descriptionKaa: '1930-jıldan házirgi kúnge shekem Ózbekstan mámleketiniń bas paytaxtı hám eń iri qalası.',
    articleSlug: 'orta-osiyoda-milliy-hududiy-chegaralanish-sabablari',
  },
  {
    id: 'buxoro',
    nameUz: 'Buxoro',
    nameKaa: 'Buxara',
    x: 480,
    y: 520,
    statusByYear: {
      1917: { typeUz: 'Buxoro amirligi poytaxti', typeKaa: 'Buxara ámirshiligi paytaxtı', isCapital: true },
      1920: { typeUz: '★ Buxoro Xalq Sovet Respublikasi poytaxti', typeKaa: '★ Buxara Xalıq Sovet Respublikası paytaxtı', isCapital: true },
      1924: { typeUz: 'Oʻzbekiston SSR tarkibidagi viloyat', typeKaa: 'Ózbekstan SSR quramındaǵı wálayat' },
      1925: { typeUz: 'I Butun Oʻzbekiston Sovetlari qurultoyi oʻrni', typeKaa: 'I Pútkil Ózbekstan Sovetleri qurultayı ornı' },
      1930: { typeUz: 'Tarixiy va ilmiy markaz', typeKaa: 'Tariyxıy hám ilimiy oray' },
      1936: { typeUz: 'Buxoro viloyati markazi', typeKaa: 'Buxara wálayatı orayı' },
    },
    delimitationRoleUz: 'Fayzulla Xoʻjayev vatani. 1925-yil fevralda Buxoroda Oʻzbekiston SSR tashkil topganligi haqidagi Deklaratsiya tantanali eʼlon qilingan.',
    delimitationRoleKaa: 'Fayzulla Xojayevtiń watanı. 1925-jıl fevralda Buxarada Ózbekstan SSR dúzilgenligi haqqındaǵı Deklaratsiya daǵaza etilgen.',
    descriptionUz: 'Ming yillik madaniyat, islom sivilizatsiyasi va jadidlar harakatining eng nufuzli markazi.',
    descriptionKaa: 'Mıń jıllıq mádeniyat, islam sivilizatsiyası hám jadidshilik háreketiniń zárúr orayı.',
    articleSlug: 'ozbekiston-ssr-tashkil-topishi-1924',
  },
  {
    id: 'xiva',
    nameUz: 'Xiva',
    nameKaa: 'Xiywa',
    x: 290,
    y: 400,
    statusByYear: {
      1917: { typeUz: 'Xiva xonligi poytaxti', typeKaa: 'Xiywa xanlıǵı paytaxtı', isCapital: true },
      1920: { typeUz: '★ Xorazm Xalq Sovet Respublikasi poytaxti', typeKaa: '★ Xorezm Xalıq Sovet Respublikası paytaxtı', isCapital: true },
      1924: { typeUz: 'OʻzSSR Xorazm okrugi markazi', typeKaa: 'ÓzSSR Xorezm okrugı orayı' },
      1925: { typeUz: 'Tarixiy qalʼa shahri', typeKaa: 'Tariyxıy qala' },
      1930: { typeUz: 'Xorazm viloyati shahri', typeKaa: 'Xorezm wálayatı qalası' },
      1936: { typeUz: 'Jahon madaniy merosi obyekti', typeKaa: 'Dúnya mádeniy miyrası obyekti' },
    },
    delimitationRoleUz: 'Chegaralanish natijasida Xorazmning oʻzbek aholisi Oʻzbekiston SSRga, qoraqalpoq aholisi esa Qoraqalpogʻiston Muxtor Viloyatiga kiritildi.',
    delimitationRoleKaa: 'Shegaralanıw nátiyjesinde Xorezmniń ózbek xalqı Ózbekstan SSRge, qaraqalpaq xalqı bolsa Qaraqalpaqstan AWge qosıldı.',
    descriptionUz: 'Ichan qalʼa meʼmoriy majmuasi va ming yillik Xorazm davlatchiligi oʻchogʻi.',
    descriptionKaa: 'Iyshan qala arxitekturalıq orayı hám mıń jıllıq Xorezm mámleketshiligi besigi.',
    articleSlug: 'orta-osiyoda-milliy-hududiy-chegaralanish-sabablari',
  },
  {
    id: 'nukus',
    nameUz: 'Nukus',
    nameKaa: 'Nókis',
    x: 230,
    y: 310,
    statusByYear: {
      1917: { typeUz: 'Amudaryo boʻyidagi aholi punkti', typeKaa: 'Ámiwdárya boyındaǵı elatlı punkt' },
      1920: { typeUz: 'Qoʻngʻirot boʻlimi hududi', typeKaa: 'Qońırat bólimi aymaǵı' },
      1924: { typeUz: 'Qoraqalpogʻiston MV muhim shahri', typeKaa: 'Qaraqalpaqstan AW zárúr qalası' },
      1925: { typeUz: 'Rivojlanayotgan maʼmuriy hudud', typeKaa: 'Rawajlanıp atırǵan oray' },
      1930: { typeUz: 'Boʻlgʻusi poytaxt loyihasi', typeKaa: 'Keleshek paytaxt jobası' },
      1936: { typeUz: '★ Qoraqalpogʻiston ASSR yangi poytaxti (1932 dan)', typeKaa: '★ Qaraqalpaqstan ASSR jańa paytaxtı (1932 den)', isSubCapital: true },
    },
    delimitationRoleUz: 'Toʻrtkoʻl shahri daryo toshqini xavfi ostida qolganligi tufayli 1932-yilda Qoraqalpogʻiston poytaxti Nukusga koʻchirildi.',
    delimitationRoleKaa: 'Tórtkúl qalası dárya suw basıw qáwpi astında qalǵanlıǵı sebepli 1932-jılda Qaraqalpaqstan paytaxtı Nókiske kóshirildi.',
    descriptionUz: 'Bugungi kunda Qoraqalpogʻiston Respublikasining bosh poytaxti, Savitskiy muzeyi va madaniy markazi.',
    descriptionKaa: 'Búgingi kúnde Qaraqalpaqstan Respublikasınıń bas paytaxtı, Savitskiy muzeyi hám mádeniyat orayı.',
    articleSlug: 'qoraqalpogiston-muxtor-viloyatining-tashkil-topishi',
  },
  {
    id: 'termiz',
    nameUz: 'Termiz',
    nameKaa: 'Termiz',
    x: 690,
    y: 630,
    statusByYear: {
      1917: { typeUz: 'Buxoro amirligi janubiy qalʼasi', typeKaa: 'Buxara ámirshiligi qubla qorǵanı' },
      1920: { typeUz: 'BXSR Surxondaryo viloyati markazi', typeKaa: 'BXSR Surxondárya wálayatı orayı' },
      1924: { typeUz: 'OʻzSSR janubiy chegarasi & porti', typeKaa: 'ÓzSSR qubla shegarası & portı' },
      1925: { typeUz: 'OʻzSSR strategik chegara posti', typeKaa: 'ÓzSSR strategiyalıq shegara postı' },
      1930: { typeUz: 'Amudaryo boʻyidagi muhim logistika tuguni', typeKaa: 'Ámiwdárya boyındaǵı zárúr túyin' },
      1936: { typeUz: 'Surxondaryo viloyati markazi', typeKaa: 'Surxondárya wálayatı orayı' },
    },
    delimitationRoleUz: 'Oʻzbekiston SSRning eng janubiy darvozasi va Amudaryo boʻyidagi strategik chegarasi.',
    delimitationRoleKaa: 'Ózbekstan SSRnıń eń qubla dárwazası hám Ámiwdárya boyındaǵı strategiyalıq shegarası.',
    descriptionUz: '2500 yillik tarixga ega qadimiy shahar, Budda ibodatxonalari va Hakim at-Termiziy majmuasi.',
    descriptionKaa: '2500 jıllıq tariyxqa iye áyyemgi qala, Budda ibadatxanaları hám Hákim at-Termiziy orayı.',
  },
  {
    id: 'qoqon',
    nameUz: 'Qoʻqon',
    nameKaa: 'Qoqon',
    x: 840,
    y: 410,
    statusByYear: {
      1917: { typeUz: 'Fargʻona vodiysi tarixiy markazi', typeKaa: 'Ferǵana oypatlıǵı tariyxıy orayı' },
      1920: { typeUz: 'Turkiston ASSR Fargʻona viloyati', typeKaa: 'Túrkstan ASSR Ferǵana wálayatı' },
      1924: { typeUz: 'OʻzSSR Fargʻona okrugi markazi', typeKaa: 'ÓzSSR Ferǵana okrugı orayı' },
      1925: { typeUz: 'Yirik sanoat va paxtachilik oʻchogʻi', typeKaa: 'Iri sanaat hám paxtashılıq orayı' },
      1930: { typeUz: 'Madaniy va ilmiy shahar', typeKaa: 'Mádeniy hám ilimiy qala' },
      1936: { typeUz: 'Fargʻona vodiysi markaziy shahri', typeKaa: 'Ferǵana oypatlıǵı oraylıq qalası' },
    },
    delimitationRoleUz: 'Qoʻqon xonligining qadimiy poytaxti. 1924-yilda serhosil Fargʻona vodiysi toʻliq Oʻzbekiston SSR tarkibiga biriktirildi.',
    delimitationRoleKaa: 'Qoqon xanlıǵınıń áyyemgi paytaxtı. 1924-jılda ónimli Ferǵana oypatlıǵı tolıq Ózbekstan SSR quramına biriktirildi.',
    descriptionUz: 'Xudoyorxon oʻrdasi va Qoʻqon adabiy muhitining oʻchogʻi.',
    descriptionKaa: 'Xudayorxan ordası hám Qoqon ádebiy orayınıń besigi.',
  },
]

export function HistoricalMap({ locale = 'uz' }: { locale: string }) {
  const isKaa = locale === 'kaa'

  // --- Animation & Epoch State ---
  const [currentYear, setCurrentYear] = useState<EpochYear>(1924)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1)
  const [selectedSite, setSelectedSite] = useState<HistoricalSite>(HISTORICAL_SITES[0])
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null)

  // Map display toggles
  const [showTerrain, setShowTerrain] = useState<boolean>(true)
  const [showBorders, setShowBorders] = useState<boolean>(true)
  const [showCities, setShowCities] = useState<boolean>(true)
  const [zoomLevel, setZoomLevel] = useState<number>(1)

  const activeEpoch = useMemo(() => {
    return EPOCHS.find((e) => e.year === currentYear) || EPOCHS[2]
  }, [currentYear])

  // Automatic timeline player
  useEffect(() => {
    if (!isPlaying) return

    const yearsList: EpochYear[] = [1917, 1920, 1924, 1925, 1930, 1936]
    const intervalMs = playbackSpeed === 1 ? 3600 : 1800

    const timer = setInterval(() => {
      setCurrentYear((prev) => {
        const idx = yearsList.indexOf(prev)
        if (idx === -1 || idx >= yearsList.length - 1) {
          return yearsList[0] // Loop back to 1917
        }
        return yearsList[idx + 1]
      })
    }, intervalMs)

    return () => clearInterval(timer)
  }, [isPlaying, playbackSpeed])

  const handleYearChange = (year: EpochYear) => {
    setCurrentYear(year)
    setSelectedTerritory(null)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentYear(1924)
    setSelectedSite(HISTORICAL_SITES[0])
    setSelectedTerritory(null)
    setZoomLevel(1)
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[400px_minmax(0,1fr)] min-h-[780px] rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl bg-[var(--background)]">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--card)] space-y-6">
        <div>
          {/* Header Badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-semibold tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>{isKaa ? '1924 Tariyxıy Karta' : '1924 Tarixiy Xarita'}</span>
            </div>

            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--secondary)] text-[var(--foreground)]">
              {currentYear}
            </span>
          </div>

          <h2 className="text-2xl font-serif font-black text-[var(--foreground)] mt-3 leading-tight">
            {isKaa ? activeEpoch.titleKaa : activeEpoch.titleUz}
          </h2>

          <p className="text-xs text-[var(--muted-foreground)] mt-2 leading-relaxed">
            {isKaa ? activeEpoch.descriptionKaa : activeEpoch.descriptionUz}
          </p>

          {/* Legal Decree Card */}
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-[var(--foreground)] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>{isKaa ? 'Rásmiy Hújjet' : 'Rasmiy Hujjat'}</span>
            </span>
            <p className="text-[11px] leading-relaxed italic text-[var(--foreground)]">
              &ldquo;{isKaa ? activeEpoch.legalDecreeKaa : activeEpoch.legalDecreeUz}&rdquo;
            </p>
          </div>

          {/* Timeline Animation Controller */}
          <div className="mt-6 space-y-3 p-4 rounded-xl bg-[var(--secondary)]/70 border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>{isKaa ? 'Waqıt Shkalası' : 'Vaqt Shkalasi'}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : 1))}
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:border-amber-400 cursor-pointer transition-all"
                  title={isKaa ? 'Tezlik' : 'Tezlik'}
                >
                  {playbackSpeed}x
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                    isPlaying
                      ? 'bg-rose-500 text-white'
                      : 'bg-amber-500 text-black hover:brightness-110'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>{isKaa ? 'Pauza' : 'Pauza'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>{isKaa ? 'Avto Ijro' : 'Avto Ijro'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors cursor-pointer"
                  title={isKaa ? 'Qayta baslaw' : 'Qayta boshlash'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Year Timeline Buttons */}
            <div className="grid grid-cols-6 gap-1 pt-1">
              {EPOCHS.map((epoch) => {
                const isActive = epoch.year === currentYear
                return (
                  <button
                    key={epoch.year}
                    type="button"
                    onClick={() => handleYearChange(epoch.year)}
                    className={`py-2 rounded-lg text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-black shadow-md ring-2 ring-amber-400/50 scale-105'
                        : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-amber-400 border border-[var(--border)]'
                    }`}
                  >
                    {epoch.year}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Territories in Current Epoch */}
          <div className="mt-5 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>{isKaa ? 'Dáwir aymaqları' : 'Davr hududlari'}</span>
            </span>

            <div className="space-y-1.5">
              {activeEpoch.territories.map((t) => {
                const isSelected = selectedTerritory?.id === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTerritory(t)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-[var(--foreground)] shadow-xs'
                        : 'bg-[var(--card)] hover:bg-[var(--secondary)]/60 border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="font-serif font-bold text-xs truncate text-[var(--foreground)]">
                        {isKaa ? t.nameKaa : t.nameUz}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-medium text-[var(--muted-foreground)] truncate max-w-[120px]">
                      {isKaa ? t.capitalKaa : t.capitalUz}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Selected Territory / Site Quick Preview Box */}
        {selectedTerritory ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                {isKaa ? 'Tańlanǵan Aymaq' : 'Tanlangan Hudud'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedTerritory(null)}
                className="text-[10px] text-muted-foreground hover:text-foreground underline cursor-pointer"
              >
                {isKaa ? 'Jabıw' : 'Yopish'}
              </button>
            </div>
            <h4 className="font-serif font-bold text-sm text-[var(--foreground)]">
              {isKaa ? selectedTerritory.nameKaa : selectedTerritory.nameUz}
            </h4>
            <div className="text-[11px] text-[var(--foreground)] space-y-1">
              <p>
                <strong>{isKaa ? 'Paytaxt:' : 'Poytaxt:'}</strong>{' '}
                {isKaa ? selectedTerritory.capitalKaa : selectedTerritory.capitalUz}
              </p>
              <p>
                <strong>{isKaa ? 'Xalqı:' : 'Aholisi:'}</strong>{' '}
                {isKaa ? selectedTerritory.populationKaa : selectedTerritory.populationUz}
              </p>
              <p>
                <strong>{isKaa ? 'Maqamı:' : 'Maqomi:'}</strong>{' '}
                {isKaa ? selectedTerritory.legalStatusKaa : selectedTerritory.legalStatusUz}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-2 p-3 rounded-xl bg-[var(--secondary)]/40 border border-[var(--border)]">
            <Info className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {isKaa
                ? 'Shegara yamasa qalanı basıp maǵlıwmatlardı kóriń. Avto ijro arqalı shegaralardı baqlap barıń.'
                : 'Chegara yoki shaharni bosib maʼlumotlarni koʻring. Avto ijro orqali chegaralanishni kuzating.'}
            </span>
          </div>
        )}
      </aside>

      {/* ================= RIGHT MAP CANVAS ================= */}
      <div className="relative flex-1 min-h-[560px] bg-amber-50/20 dark:bg-stone-950/90 overflow-hidden flex flex-col justify-between p-4 sm:p-6 select-none">
        {/* Top Controls: Layers, Status Banner, Zoom */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3">
          {/* Active Era Status Banner */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--card)]/95 backdrop-blur-md border border-[var(--border)] shadow-md text-xs font-serif font-bold text-[var(--foreground)]">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isPlaying ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
              }`}
            />
            <span>
              {isKaa ? activeEpoch.shortLabelKaa : activeEpoch.shortLabelUz}
            </span>
          </div>

          {/* Map Display Toggles */}
          <div className="flex items-center gap-1.5 bg-[var(--card)]/90 backdrop-blur-md p-1 rounded-xl border border-[var(--border)] shadow-md">
            <button
              type="button"
              onClick={() => setShowTerrain((v) => !v)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                showTerrain
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
              title={isKaa ? 'Tábiyiy relyef' : 'Tabiiy relyef'}
            >
              {isKaa ? 'Relyef' : 'Relyef'}
            </button>
            <button
              type="button"
              onClick={() => setShowBorders((v) => !v)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                showBorders
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
              title={isKaa ? 'Shegara sızıqları' : 'Chegara chiziqlari'}
            >
              {isKaa ? 'Shegaralar' : 'Chegaralar'}
            </button>
            <button
              type="button"
              onClick={() => setShowCities((v) => !v)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                showCities
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
              title={isKaa ? 'Qalalar' : 'Shaharlar'}
            >
              {isKaa ? 'Qalalar' : 'Shaharlar'}
            </button>

            <div className="w-px h-4 bg-[var(--border)] mx-1" />

            {/* Zoom Controls */}
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] cursor-pointer"
              title={isKaa ? 'Úlkeytiw' : 'Kattalashtirish'}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] cursor-pointer"
              title={isKaa ? 'Kishireytiw' : 'Kichiklashtirish'}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Central Realistic SVG Map */}
        <div
          className="relative flex-1 w-full my-2 transition-transform duration-500 ease-out flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 1000 680"
            className="w-full h-full max-h-[560px] drop-shadow-md select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="aralSeaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#0369a1" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#075985" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              <radialGradient id="kyzylkumSand" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.02" />
              </radialGradient>

              <radialGradient id="karakumSand" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#b45309" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.01" />
              </radialGradient>

              {/* Topographic pattern */}
              <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-stone-400/20 dark:text-stone-700/20"
                />
              </pattern>
            </defs>

            {/* Coordinate Grid Background */}
            <rect width="1000" height="680" fill="url(#gridPattern)" />

            {/* Latitude / Longitude Markings */}
            <g className="text-[10px] font-mono fill-stone-400 dark:fill-stone-600 select-none">
              <text x="15" y="160">44°N</text>
              <text x="15" y="340">42°N</text>
              <text x="15" y="520">40°N</text>
              <text x="15" y="660">38°N</text>

              <text x="160" y="670">58°E</text>
              <text x="360" y="670">62°E</text>
              <text x="560" y="670">66°E</text>
              <text x="760" y="670">70°E</text>
              <text x="940" y="670">74°E</text>
            </g>

            {/* ================= TERRAIN LAYER ================= */}
            {showTerrain && (
              <g id="terrain-layer" className="transition-opacity duration-300">
                {/* Deserts Shading */}
                {/* Kyzylkum Desert (between Amu Darya and Syr Darya) */}
                <ellipse cx="480" cy="330" rx="170" ry="90" fill="url(#kyzylkumSand)" />
                <text
                  x="480"
                  y="335"
                  textAnchor="middle"
                  className="text-xs font-serif italic fill-amber-700/30 dark:fill-amber-400/20 tracking-widest pointer-events-none select-none uppercase font-bold"
                >
                  {isKaa ? 'Qızılqum shóli' : 'Qizilqum choʻli'}
                </text>

                {/* Karakum Desert (Southwest) */}
                <ellipse cx="260" cy="560" rx="140" ry="70" fill="url(#karakumSand)" />
                <text
                  x="260"
                  y="565"
                  textAnchor="middle"
                  className="text-xs font-serif italic fill-amber-700/25 dark:fill-amber-400/15 tracking-widest pointer-events-none select-none uppercase font-bold"
                >
                  {isKaa ? 'Qaraqum shóli' : 'Qoraqum choʻli'}
                </text>

                {/* Ustyurt Plateau (West of Aral) */}
                <path
                  d="M 50 140 Q 120 180 130 320 L 70 360 Z"
                  fill="currentColor"
                  className="text-stone-500/10 dark:text-stone-400/5"
                />
                <text
                  x="90"
                  y="240"
                  textAnchor="middle"
                  className="text-[10px] font-mono uppercase tracking-wider fill-stone-500/35 dark:fill-stone-400/25 select-none"
                >
                  {isKaa ? 'Ústirt platosı' : 'Ustyurt platosi'}
                </text>

                {/* Eastern Mountain Ranges (Tian Shan, Pamir-Alay, Fergana) */}
                {/* Tian Shan ridges */}
                <g className="fill-stone-600/20 dark:fill-stone-300/10 stroke-stone-600/30 dark:stroke-stone-400/20 stroke-[1]">
                  <path d="M 780 270 L 820 230 L 860 270 L 910 220 L 960 280 Z" />
                  <path d="M 830 310 L 870 270 L 920 320 L 980 280 L 995 350 Z" />
                  {/* Fergana Basin enclosing ridges */}
                  <path d="M 880 380 L 930 340 L 980 390 L 940 460 L 880 430 Z" />
                  {/* Pamir-Alay ridges */}
                  <path d="M 720 520 L 770 470 L 830 530 L 880 480 L 960 560 L 910 610 L 830 580 Z" />
                </g>
                <text
                  x="900"
                  y="260"
                  textAnchor="middle"
                  className="text-[10px] font-serif uppercase tracking-widest fill-stone-600/40 dark:fill-stone-400/30 select-none font-bold"
                >
                  {isKaa ? 'Tyanshan tawları' : 'Tyan-Shan togʻlari'}
                </text>
                <text
                  x="880"
                  y="550"
                  textAnchor="middle"
                  className="text-[10px] font-serif uppercase tracking-widest fill-stone-600/40 dark:fill-stone-400/30 select-none font-bold"
                >
                  {isKaa ? 'Pomir-Oloy' : 'Pomir-Oloy'}
                </text>

                {/* Fergana Valley Oasis */}
                <ellipse cx="910" cy="420" rx="55" ry="25" fill="#10b981" fillOpacity="0.12" />
                <text
                  x="910"
                  y="423"
                  textAnchor="middle"
                  className="text-[10px] font-serif font-bold fill-emerald-700/50 dark:fill-emerald-400/40 select-none"
                >
                  {isKaa ? 'Ferǵana oypatlıǵı' : 'Fargʻona vodiysi'}
                </text>

                {/* ================= WATER BODIES ================= */}
                {/* 1. Aral Sea (1920s full pristine extent: ~68,000 km²) */}
                <g id="aral-sea" className="drop-shadow-sm">
                  {/* Aral Sea Main Body */}
                  <path
                    d="M 180 160 C 220 130 260 140 270 180 C 280 230 250 300 210 320 C 170 330 150 290 155 240 C 160 190 150 180 180 160 Z"
                    fill="url(#aralSeaGrad)"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                  {/* Northern Aral Bay */}
                  <path
                    d="M 230 145 C 245 125 280 130 285 150 C 290 170 260 180 240 165 Z"
                    fill="url(#aralSeaGrad)"
                  />
                  {/* Vozrozhdeniya Island (Historic 1920s) */}
                  <ellipse cx="210" cy="235" rx="12" ry="18" fill="#ca8a04" fillOpacity="0.7" />
                  {/* Barsa-Kelmes Island */}
                  <ellipse cx="250" cy="170" rx="8" ry="6" fill="#ca8a04" fillOpacity="0.7" />

                  {/* Aral Sea Label */}
                  <text
                    x="210"
                    y="210"
                    textAnchor="middle"
                    className="text-xs font-serif font-black tracking-wider fill-white drop-shadow-md select-none"
                  >
                    {isKaa ? 'ARAL TEŃIZI' : 'OROL DENGIZI'}
                  </text>
                  <text
                    x="210"
                    y="280"
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-white/80 select-none"
                  >
                    (1924: 68 000 km²)
                  </text>
                </g>

                {/* 2. Caspian Sea snippet (West coast) */}
                <path
                  d="M 0 200 C 30 220 40 280 30 380 C 20 460 40 520 0 560 Z"
                  fill="url(#aralSeaGrad)"
                  stroke="#0284c7"
                  strokeWidth="1"
                />
                <text
                  x="15"
                  y="360"
                  textAnchor="middle"
                  transform="rotate(-90 15 360)"
                  className="text-[10px] font-serif font-bold fill-white/80 select-none tracking-widest"
                >
                  {isKaa ? 'KASPIY TEŃIZI' : 'KASPIY DENGIZI'}
                </text>

                {/* 3. Amu Darya (Jayhun) River & Delta */}
                <g id="amu-darya">
                  {/* River line from Pamir to Aral Sea */}
                  <path
                    d="M 750 640 Q 690 630 620 590 T 520 530 T 400 440 T 350 390 T 280 360 T 230 310 Q 210 295 210 320"
                    fill="none"
                    stroke="url(#riverGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Delta branches into Aral Sea */}
                  <path
                    d="M 230 310 Q 200 320 180 310 M 230 310 Q 215 305 190 290 M 230 310 Q 240 295 235 285"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <text
                    x="420"
                    y="475"
                    transform="rotate(-25 420 475)"
                    className="text-[10px] font-serif font-bold fill-sky-600 dark:fill-sky-400 select-none"
                  >
                    {isKaa ? 'Ámiwdárya' : 'Amudaryo (Jayhun)'}
                  </text>
                </g>

                {/* 4. Syr Darya (Sayhun) River */}
                <g id="syr-darya">
                  <path
                    d="M 940 430 Q 860 420 800 430 T 730 360 T 640 290 T 510 230 T 360 180 T 285 150"
                    fill="none"
                    stroke="url(#riverGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <text
                    x="560"
                    y="250"
                    transform="rotate(-22 560 250)"
                    className="text-[10px] font-serif font-bold fill-sky-600 dark:fill-sky-400 select-none"
                  >
                    {isKaa ? 'Sırdárya' : 'Sirdaryo (Sayhun)'}
                  </text>
                </g>

                {/* 5. Zarafshan River */}
                <g id="zarafshan">
                  <path
                    d="M 750 490 Q 660 500 620 500 T 540 490 T 480 520"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <text
                    x="570"
                    y="492"
                    className="text-[9px] font-serif italic fill-sky-700 dark:fill-sky-300 select-none"
                  >
                    {isKaa ? 'Zarafshan' : 'Zarafshon'}
                  </text>
                </g>
              </g>
            )}

            {/* ================= HISTORICAL TERRITORIES LAYER ================= */}
            {showBorders && (
              <g id="territories-layer" className="transition-all duration-700 ease-in-out">
                {activeEpoch.territories.map((territory) => {
                  const isSelected = selectedTerritory?.id === territory.id
                  return (
                    <g key={territory.id} className="cursor-pointer group">
                      <path
                        d={territory.path}
                        fill={territory.color}
                        fillOpacity={isSelected ? 0.6 : territory.fillOpacity}
                        stroke={territory.strokeColor}
                        strokeWidth={isSelected ? 3.5 : 2}
                        strokeDasharray={isSelected ? 'none' : '6 3'}
                        className="transition-all duration-500 ease-in-out hover:fill-opacity-60"
                        onClick={() => setSelectedTerritory(territory)}
                      />
                    </g>
                  )
                })}
              </g>
            )}

            {/* ================= CITIES & BEACONS LAYER ================= */}
            {showCities && (
              <g id="cities-layer">
                {HISTORICAL_SITES.map((site) => {
                  const status = site.statusByYear[currentYear]
                  const isSelected = selectedSite.id === site.id
                  const isCapital = status?.isCapital
                  const isSubCapital = status?.isSubCapital

                  return (
                    <g
                      key={site.id}
                      transform={`translate(${site.x}, ${site.y})`}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedSite(site)
                        setSelectedTerritory(null)
                      }}
                    >
                      {/* Pulsing ring for capitals */}
                      {(isCapital || isSubCapital) && (
                        <circle
                          r="16"
                          fill="none"
                          stroke={isCapital ? '#eab308' : '#10b981'}
                          strokeWidth="2"
                          className="animate-ping opacity-60 pointer-events-none"
                        />
                      )}

                      {/* City Marker Base */}
                      <circle
                        r={isCapital ? 7 : isSubCapital ? 6 : isSelected ? 6 : 4}
                        fill={
                          isCapital
                            ? '#eab308'
                            : isSubCapital
                            ? '#10b981'
                            : isSelected
                            ? '#f59e0b'
                            : '#ffffff'
                        }
                        stroke="#000000"
                        strokeWidth="1.5"
                        className="transition-all duration-300 drop-shadow-md"
                      />

                      {/* Diamond Star Icon for Capitals */}
                      {isCapital && (
                        <polygon
                          points="0,-4 3,0 0,4 -3,0"
                          fill="#000000"
                          className="pointer-events-none"
                        />
                      )}

                      {/* City Name Badge */}
                      <g transform="translate(0, -12)">
                        <rect
                          x={-(site.nameUz.length * 4.2 + 8)}
                          y="-16"
                          width={site.nameUz.length * 8.4 + 16}
                          height="18"
                          rx="4"
                          fill={
                            isSelected
                              ? '#d97706'
                              : isCapital
                              ? '#ca8a04'
                              : isSubCapital
                              ? '#059669'
                              : 'var(--card)'
                          }
                          stroke={isSelected ? '#f59e0b' : 'var(--border)'}
                          strokeWidth="1"
                          className="drop-shadow-sm transition-colors"
                        />
                        <text
                          x="0"
                          y="-3.5"
                          textAnchor="middle"
                          fill={
                            isSelected || isCapital || isSubCapital ? '#ffffff' : 'var(--foreground)'
                          }
                          className="text-[11px] font-serif font-black select-none pointer-events-none"
                        >
                          {isCapital ? '★ ' : isSubCapital ? '◆ ' : ''}
                          {isKaa ? site.nameKaa : site.nameUz}
                        </text>
                      </g>
                    </g>
                  )
                })}
              </g>
            )}

            {/* Antique Compass Rose (Top Right) */}
            <g transform="translate(930, 75)" className="select-none pointer-events-none opacity-80">
              <circle r="32" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-600/40" />
              <circle r="26" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="text-amber-600/30" />
              {/* North Pointer */}
              <polygon points="0,-28 6,-4 0,0" fill="#dc2626" />
              <polygon points="0,-28 -6,-4 0,0" fill="#991b1b" />
              {/* South Pointer */}
              <polygon points="0,28 6,4 0,0" fill="#ca8a04" />
              <polygon points="0,28 -6,4 0,0" fill="#854d0e" />
              {/* East / West */}
              <polygon points="28,0 4,6 0,0" fill="#ca8a04" />
              <polygon points="-28,0 -4,6 0,0" fill="#854d0e" />
              {/* Labels */}
              <text x="0" y="-32" textAnchor="middle" className="text-[11px] font-serif font-bold fill-red-600">
                {isKaa ? 'Sh (N)' : 'Sh (N)'}
              </text>
              <text x="0" y="42" textAnchor="middle" className="text-[9px] font-serif font-bold fill-amber-700">
                {isKaa ? 'Q (S)' : 'J (S)'}
              </text>
            </g>

            {/* Cartographic Scale Bar (Bottom Left) */}
            <g transform="translate(40, 630)" className="select-none pointer-events-none">
              <rect x="0" y="0" width="160" height="4" fill="#ca8a04" />
              <rect x="0" y="0" width="80" height="4" fill="#000000" />
              <line x1="0" y1="-2" x2="0" y2="6" stroke="currentColor" strokeWidth="1" className="text-[var(--foreground)]" />
              <line x1="80" y1="-2" x2="80" y2="6" stroke="currentColor" strokeWidth="1" className="text-[var(--foreground)]" />
              <line x1="160" y1="-2" x2="160" y2="6" stroke="currentColor" strokeWidth="1" className="text-[var(--foreground)]" />
              <text x="0" y="-5" className="text-[9px] font-mono fill-[var(--muted-foreground)]">0</text>
              <text x="80" y="-5" textAnchor="middle" className="text-[9px] font-mono fill-[var(--muted-foreground)]">150</text>
              <text x="160" y="-5" textAnchor="end" className="text-[9px] font-mono fill-[var(--muted-foreground)]">300 km</text>
            </g>
          </svg>
        </div>

        {/* ================= BOTTOM SELECTED SITE DETAIL CARD ================= */}
        {selectedSite && (
          <div className="relative z-20 w-full max-w-2xl self-center p-4 sm:p-5 rounded-2xl bg-[var(--card)]/95 backdrop-blur-md border border-amber-500/40 shadow-2xl animate-fade-in space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {isKaa
                      ? selectedSite.statusByYear[currentYear]?.typeKaa || selectedSite.nameKaa
                      : selectedSite.statusByYear[currentYear]?.typeUz || selectedSite.nameUz}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-black text-[var(--foreground)] mt-0.5 flex items-center gap-2">
                  <span>{isKaa ? selectedSite.nameKaa : selectedSite.nameUz}</span>
                  <span className="font-mono text-xs text-[var(--muted-foreground)] font-normal">
                    ({currentYear})
                  </span>
                </h3>
              </div>

              {selectedSite.articleSlug && (
                <Link
                  href={`/maqolalar/${selectedSite.articleSlug}`}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-black text-xs font-bold hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-1.5 shadow-xs shrink-0 self-start"
                >
                  <span>{isKaa ? 'Maqalanı oqıw' : 'Maqolani oʻqish'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            <p className="text-xs text-[var(--foreground)] leading-relaxed">
              {isKaa ? selectedSite.delimitationRoleKaa : selectedSite.delimitationRoleUz}
            </p>

            <div className="pt-2 border-t border-[var(--border)] text-[11px] text-[var(--muted-foreground)] italic">
              {isKaa ? selectedSite.descriptionKaa : selectedSite.descriptionUz}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
