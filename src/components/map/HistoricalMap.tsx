'use client'

import React, { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
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
  Image as ImageIcon,
  Eye,
} from 'lucide-react'

// --- Types ---
export type EpochYear = 1917 | 1920 | 1924 | 1925 | 1930 | 1936

export interface HistoricalSite {
  id: string
  nameUz: string
  nameKaa: string
  nameRu: string
  x: number // SVG coordinates (0 - 1000)
  y: number // SVG coordinates (0 - 680)
  statusByYear: Record<
    EpochYear,
    {
      typeUz: string
      typeKaa: string
      isCapital?: boolean
      isSubCapital?: boolean
    }
  >
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
  nameRu: string
  dateLabel: string
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
  labelX: number
  labelY: number
}

export interface DelimitationStep {
  id: string
  stepNumber: number
  titleUz: string
  titleKaa: string
  dateLabelUz: string
  dateLabelKaa: string
  territoryId?: string
  siteId?: string
  descriptionUz: string
  descriptionKaa: string
  decreeUz: string
  decreeKaa: string
}

// --- 1924–1925 Real Historical Territories matching the Archival Map ---
const DELIMITATION_1924_TERRITORIES: Territory[] = [
  {
    id: 'kazakh-assr',
    nameUz: 'Qozogʻiston ASSR (1925-yilgacha Qirgʻiziston ASSR)',
    nameKaa: 'Qazaqstan ASSR (1925-jılǵa shekem Qırǵızstan ASSR)',
    nameRu: 'КАЗАХСКАЯ АССР (до 1925 г. Киргизская АССР)',
    dateLabel: 'RSFSR tarkibida',
    color: '#F29C96',
    strokeColor: '#C96862',
    fillOpacity: 0.65,
    capitalUz: 'Qiziloʻrda (1925–1929) / Orenburg',
    capitalKaa: 'Qızılorda (1925–1929) / Orenburg',
    legalStatusUz: 'RSFSR tarkibidagi Muxtor Sovet Respublikasi',
    legalStatusKaa: 'RSFSR quramındaǵı Avtonomiyalı Sovet Respublikası',
    populationUz: 'Taxminan 6.2 mln kishi (qozoqlar, ruslar va boshqalar)',
    populationKaa: 'Shama menen 6.2 mln adam (qazaqlar, ruslar hám basqalar)',
    decreeUz: 'Turkiston ASSRning shimoliy Sirdaryo va Yettisuv viloyatlari Qozogʻiston ASSRga birlashtirildi.',
    decreeKaa: 'Túrkstan ASSRnıń arqa Sırdárya hám Jetisuw wálayatları Qazaqstan ASSRge birlestirildi.',
    path: 'M 70 80 L 320 70 L 620 75 L 860 80 L 980 90 L 970 280 L 880 280 L 800 240 L 730 260 L 650 320 L 520 280 L 370 210 L 290 240 L 230 250 L 150 200 L 70 180 Z',
    labelX: 470,
    labelY: 130,
  },
  {
    id: 'turkmen-ssr',
    nameUz: 'Turkmaniston SSR (27.X.1924)',
    nameKaa: 'Túrkmenstan SSR (27.X.1924)',
    nameRu: 'ТУРКМЕНСКАЯ ССР (27.X.1924)',
    dateLabel: '27.X.1924',
    color: '#4E8A5E',
    strokeColor: '#2E5E3A',
    fillOpacity: 0.72,
    capitalUz: 'Ashxobod (Poltoratsk)',
    capitalKaa: 'Ashxabad (Poltoratsk)',
    legalStatusUz: 'Ittifoqdosh Sovet Sotsialistik Respublikasi',
    legalStatusKaa: 'Awqamlas Sovet Sotsialistlik Respublikası',
    populationUz: '1 million 25 ming kishi',
    populationKaa: '1 million 25 mıń adam',
    decreeUz: '1924-yil 27-oktyabrdagi SSSR MIQ qarori. Turkiston ASSR va Buxoro hamda Xorazmning turkman yerlari birlashtirildi.',
    decreeKaa: '1924-jıl 27-oktyabrdegi SSSR OAK qararı. Túrkstan, Buxara hám Xorezmniń túrkmen jerleri birlestirildi.',
    path: 'M 75 360 L 175 365 L 245 425 L 340 455 L 420 540 L 525 610 L 460 670 L 320 670 L 180 620 L 70 540 Z',
    labelX: 250,
    labelY: 530,
  },
  {
    id: 'uzbekistan-ssr',
    nameUz: 'Oʻzbekiston SSR (27.X.1924)',
    nameKaa: 'Ózbekstan SSR (27.X.1924)',
    nameRu: 'УЗБЕКСКАЯ ССР (27.X.1924)',
    dateLabel: '27.X.1924',
    color: '#EFA259',
    strokeColor: '#C46D20',
    fillOpacity: 0.75,
    capitalUz: 'Samarqand (1925–1930)',
    capitalKaa: 'Samarqand (1925–1930)',
    legalStatusUz: 'Ittifoqdosh Sovet Sotsialistik Respublikasi (SSSR asoschilaridan)',
    legalStatusKaa: 'Awqamlas Sovet Sotsialistlik Respublikası (SSSR shólkemlestiriwshilerinen)',
    populationUz: '4 million 445 ming kishi (Tojikiston ASSR bilan 5.2 mln)',
    populationKaa: '4 million 445 mıń adam (Tájikstan ASSR menen 5.2 mln)',
    decreeUz: '1924-yil 27-oktyabr SSSR MIQ tarixiy qarori. Oʻzbekiston Inqilobiy Qoʻmitasi (Fayzulla Xoʻjayev rahbarligida) tuzildi.',
    decreeKaa: '1924-jıl 27-oktyabr SSSR OAK tariyxıy qararı. Ózbekstan Revolyutsiyalıq Komiteti (Fayzulla Xojayev basshılıǵında) dúzildi.',
    path: 'M 320 440 L 410 420 L 490 390 L 560 370 L 610 390 L 710 420 L 830 430 L 880 445 L 870 480 L 780 470 L 720 500 L 660 625 L 525 610 L 420 540 L 340 455 Z',
    labelX: 520,
    labelY: 480,
  },
  {
    id: 'tajik-assr',
    nameUz: 'Tojikiston ASSR (14.X.1924)',
    nameKaa: 'Tájikstan ASSR (14.X.1924)',
    nameRu: 'ТАДЖИКСКАЯ АССР (14.X.1924)',
    dateLabel: '14.X.1924',
    color: '#DE7751',
    strokeColor: '#A8411C',
    fillOpacity: 0.72,
    capitalUz: 'Dushanbe (Dyushambe)',
    capitalKaa: 'Dushanbe (Dyushambe)',
    legalStatusUz: 'Oʻzbekiston SSR tarkibidagi Muxtor Sovet Sotsialistik Respublikasi',
    legalStatusKaa: 'Ózbekstan SSR quramındaǵı Avtonomiyalı Sovet Respublikası',
    populationUz: '740 ming kishi (tojiklar, oʻzbeklar, pomir xalqlari)',
    populationKaa: '740 mıń adam (tájikler, ózbekler, pomir xalıqları)',
    decreeUz: '1924-yil 14-oktyabrdagi qaror bilan Buxoroning sharqiy qismlari va Pomir asosida tashkil etilgan.',
    decreeKaa: '1924-jıl 14-oktyabrdegi qarar menen Buxaranıń shıǵıs bólimleri hám Pomir tiykarında dúzilgen.',
    path: 'M 720 500 L 780 470 L 870 480 L 920 520 L 960 570 L 900 640 L 760 640 L 660 625 Z',
    labelX: 810,
    labelY: 560,
  },
  {
    id: 'karakalpak-ao',
    nameUz: 'Qoraqalpogʻiston Muxtor Viloyati (11.V.1925)',
    nameKaa: 'Qaraqalpaqstan Avtonomiyalı Wálayatı (11.V.1925)',
    nameRu: 'КАРА-КАЛПАКСКАЯ АО (11.V.1925)',
    dateLabel: '11.V.1925',
    color: '#FAD2A8',
    strokeColor: '#BD7635',
    fillOpacity: 0.75,
    capitalUz: 'Toʻrtkoʻl (1925–1932)',
    capitalKaa: 'Tórtkúl (1925–1932)',
    legalStatusUz: 'Muxtor viloyat (Dastlab Qozogʻiston ASSR / RSFSR tarkibida, 1936-yildan OʻzSSR)',
    legalStatusKaa: 'Avtonomiyalı wálayat (Dáslep Qazaqstan ASSR / RSFSR quramında, 1936-jıldan ÓzSSR)',
    populationUz: '304 ming kishi (qoraqalpoqlar, qozoqlar, oʻzbeklar)',
    populationKaa: '304 mıń adam (qaraqalpaqlar, qazaqlar, ózbekler)',
    decreeUz: '1924-yil oktyabrda loyihasi tasdiqlanib, 1925-yil fevralda Toʻrtkoʻlda I Taʼsis syezdi boʻlib oʻtgan.',
    decreeKaa: '1924-jıl oktyabrde jobası tastıyıqlanıp, 1925-jıl fevralda Tórtkúlde I Shólkemlestiriw siezdi bolıp ótken.',
    path: 'M 175 250 L 245 230 L 330 260 L 370 330 L 340 455 L 245 425 L 175 365 Z',
    labelX: 255,
    labelY: 345,
  },
  {
    id: 'kara-kirghiz-ao',
    nameUz: 'Qora-Qirgʻiz Muxtor Viloyati (14.X.1924)',
    nameKaa: 'Qara-Qırǵız Avtonomiyalı Wálayatı (14.X.1924)',
    nameRu: 'КАРА-КИРГИЗСКАЯ АО (14.X.1924)',
    dateLabel: '14.X.1924',
    color: '#DE7E9B',
    strokeColor: '#A83B5E',
    fillOpacity: 0.68,
    capitalUz: 'Pishpek (Frunze / Bishkek)',
    capitalKaa: 'Pishpek (Frunze / Bishkek)',
    legalStatusUz: 'RSFSR tarkibidagi Muxtor Viloyat (1926-yildan Qirgʻiziston ASSR)',
    legalStatusKaa: 'RSFSR quramındaǵı Avtonomiyalı Wálayat (1926-jıldan Qırǵızstan ASSR)',
    populationUz: 'Taxminan 780 ming kishi',
    populationKaa: 'Shama menen 780 mıń adam',
    decreeUz: 'Turkiston ASSRning togʻli hududlari asosida tuzilgan.',
    decreeKaa: 'Túrkstan ASSRnıń tawlı aymaqları tiykarında dúzilgen.',
    path: 'M 730 260 L 800 240 L 880 280 L 970 280 L 980 430 L 880 445 L 830 430 L 710 420 L 650 320 Z',
    labelX: 830,
    labelY: 350,
  },
]

// --- Historical Sites matching the original Delimitation Map ---
export const HISTORICAL_SITES: HistoricalSite[] = [
  {
    id: 'samarqand',
    nameUz: 'Samarqand',
    nameKaa: 'Samarqand',
    nameRu: 'Самарканд',
    x: 520,
    y: 505,
    statusByYear: {
      1917: { typeUz: 'Samarqand viloyati markazi', typeKaa: 'Samarqand wálayatı orayı' },
      1920: { typeUz: 'Turkiston ASSR Samarqand viloyati', typeKaa: 'Túrkstan ASSR Samarqand wálayatı' },
      1924: { typeUz: '★ Oʻzbekiston SSR Bosh Poytaxti', typeKaa: '★ Ózbekstan SSR Bas Paytaxtı', isCapital: true },
      1925: { typeUz: '★ Oʻzbekiston SSR Poytaxti (1925–1930)', typeKaa: '★ Ózbekstan SSR Paytaxtı (1925–1930)', isCapital: true },
      1930: { typeUz: 'Poytaxt Toshkentga koʻchirilgach viloyat markazi', typeKaa: 'Paytaxt Tashkentke kóshirilgennen soń wálayat orayı' },
      1936: { typeUz: 'Tarixiy, ilmiy va madaniy markaz', typeKaa: 'Tariyxıy, ilimiy hám mádeniyat orayı' },
    },
    delimitationRoleUz: '1924-yilgi chegaralanishda Oʻzbekiston SSRning birinchi davlat poytaxti etib belgilangan. Hukumat qarorgohi va Revkom aynan Samarqandda joylashgan.',
    delimitationRoleKaa: '1924-jılǵı shegaralanıwda Ózbekstan SSRnıń birinshi mámleketlik paytaxtı etip belgilengen.',
    descriptionUz: 'Registon maydoni, Shir-Dor va Tillakori madrasalari davlat eʼlon qilingan tarixiy maskan.',
    descriptionKaa: 'Registan maydanı, Sherdor hám Tillakarı medireseleleri mámleket daǵaza etilgen tariyxıy orın.',
    articleSlug: 'samarqand-birinchi-poytaxt',
  },
  {
    id: 'tortkol',
    nameUz: 'Toʻrtkoʻl',
    nameKaa: 'Tórtkúl',
    nameRu: 'Турткуль',
    x: 345,
    y: 410,
    statusByYear: {
      1917: { typeUz: 'Petroaleksandrovsk (Amudaryo boʻlimi markazi)', typeKaa: 'Petroaleksandrovsk (Ámiwdárya bólimi orayı)' },
      1920: { typeUz: 'Turkiston ASSR Amudaryo viloyati markazi', typeKaa: 'Túrkstan ASSR Ámiwdárya wálayatı orayı' },
      1924: { typeUz: '◆ Qoraqalpogʻiston MV Markazi', typeKaa: '◆ Qaraqalpaqstan AW Orayı', isSubCapital: true },
      1925: { typeUz: '◆ Qoraqalpogʻiston MV Poytaxti (1925–1932)', typeKaa: '◆ Qaraqalpaqstan AW Paytaxtı (1925–1932)', isSubCapital: true },
      1930: { typeUz: 'Qoraqalpogʻiston ASSR poytaxti', typeKaa: 'Qaraqalpaqstan ASSR paytaxtı', isSubCapital: true },
      1936: { typeUz: 'Tarixiy shahar', typeKaa: 'Tariyxıy qala' },
    },
    delimitationRoleUz: '1925-yil fevral oyida Toʻrtkoʻlda Qoraqalpogʻiston sovetlarining I Taʼsis syezdi oʻtkazilgan va Qoraqalpoq Muxtoriyati rasman eʼlon qilingan.',
    delimitationRoleKaa: '1925-jıl fevral ayında Tórtkúlde Qaraqalpaqstan sovetleriniń I Shólkemlestiriw siezdi ótkerilgen hám Qaraqalpaq Avtonomiyası rásmiy daǵaza etilgen.',
    descriptionUz: 'Qoraqalpogʻistonning birinchi poytaxti. Amudaryoning yuvish xavfi tufayli 1932-yilda poytaxt Nukusga koʻchirilgan.',
    descriptionKaa: 'Qaraqalpaqstannıń birinshi paytaxtı. Ámiwdárya suw basıw qáwpi sebepli 1932-jılda paytaxt Nókiske kóshirilgen.',
    articleSlug: 'qoraqalpogiston-muxtor-viloyatining-tashkil-topishi',
  },
  {
    id: 'toshkent',
    nameUz: 'Toshkent',
    nameKaa: 'Tashkent',
    nameRu: 'Ташкент',
    x: 615,
    y: 435,
    statusByYear: {
      1917: { typeUz: 'Turkiston general-gubernatorligi markazi', typeKaa: 'Túrkstan general-gubernatorlıǵı orayı' },
      1920: { typeUz: '★ Turkiston ASSR poytaxti', typeKaa: '★ Túrkstan ASSR paytaxtı', isCapital: true },
      1924: { typeUz: 'Chegaralanish komissiyasi qarorgohi', typeKaa: 'Shegaralanıw komissiyası orayı' },
      1925: { typeUz: 'Toshkent viloyati markazi', typeKaa: 'Tashkent wálayatı orayı' },
      1930: { typeUz: '★ Oʻzbekiston SSR poytaxti (1930 dan)', typeKaa: '★ Ózbekstan SSR paytaxtı (1930 dan)', isCapital: true },
      1936: { typeUz: '★ Oʻzbekiston SSR poytaxti', typeKaa: '★ Ózbekstan SSR paytaxtı', isCapital: true },
    },
    delimitationRoleUz: '1924-yil 16-sentyabrda Turkiston MIQ chegaralanish toʻgʻrisidagi tarixiy qarorni aynan Toshkentda qabul qilgan.',
    delimitationRoleKaa: '1924-jıl 16-sentyabrde Túrkstan OAK shegaralanıw qararın aynan Tashkentte qabıl etken.',
    descriptionUz: '1930-yildan Oʻzbekiston davlatining bosh poytaxti.',
    descriptionKaa: '1930-jıldan Ózbekstan mámleketiniń bas paytaxtı.',
    articleSlug: 'orta-osiyoda-milliy-hududiy-chegaralanish-sabablari',
  },
  {
    id: 'buxoro',
    nameUz: 'Buxoro',
    nameKaa: 'Buxara',
    nameRu: 'Бухара',
    x: 435,
    y: 505,
    statusByYear: {
      1917: { typeUz: 'Buxoro amirligi poytaxti', typeKaa: 'Buxara ámirshiligi paytaxtı', isCapital: true },
      1920: { typeUz: '★ Buxoro XSR poytaxti', typeKaa: '★ Buxara XSR paytaxtı', isCapital: true },
      1924: { typeUz: 'Oʻzbekiston SSR viloyati', typeKaa: 'Ózbekstan SSR wálayatı' },
      1925: { typeUz: 'I Butun Oʻzbekiston Sovetlari qurultoyi oʻrni', typeKaa: 'I Pútkil Ózbekstan Sovetleri qurultayı ornı' },
      1930: { typeUz: 'Tarixiy va ilmiy markaz', typeKaa: 'Tariyxıy hám ilimiy oray' },
      1936: { typeUz: 'Buxoro viloyati markazi', typeKaa: 'Buxara wálayatı orayı' },
    },
    delimitationRoleUz: '1925-yil fevralda Buxoroda Oʻzbekiston SSR tashkil topganligi haqidagi Deklaratsiya tantanali eʼlon qilingan.',
    delimitationRoleKaa: '1925-jıl fevralda Buxarada Ózbekstan SSR dúzilgenligi haqqında Deklaratsiya daǵaza etilgen.',
    descriptionUz: 'Fayzulla Xoʻjayev vatani va jadidlar harakati markazi.',
    descriptionKaa: 'Fayzulla Xojayevtiń watanı hám jadidshilik orayı.',
    articleSlug: 'ozbekiston-ssr-tashkil-topishi-1924',
  },
  {
    id: 'xiva',
    nameUz: 'Xiva',
    nameKaa: 'Xiywa',
    nameRu: 'Хива',
    x: 300,
    y: 435,
    statusByYear: {
      1917: { typeUz: 'Xiva xonligi poytaxti', typeKaa: 'Xiywa xanlıǵı paytaxtı', isCapital: true },
      1920: { typeUz: '★ Xorazm XSR poytaxti', typeKaa: '★ Xorezm XSR paytaxtı', isCapital: true },
      1924: { typeUz: 'OʻzSSR Xorazm okrugi markazi', typeKaa: 'ÓzSSR Xorezm okrugı orayı' },
      1925: { typeUz: 'Tarixiy qalʼa shahri', typeKaa: 'Tariyxıy qala' },
      1930: { typeUz: 'Xorazm viloyati shahri', typeKaa: 'Xorezm wálayatı qalası' },
      1936: { typeUz: 'Jahon madaniy merosi', typeKaa: 'Dúnya mádeniy miyrası' },
    },
    delimitationRoleUz: 'Chegaralanish natijasida Xorazm oʻzbek aholisi Oʻzbekistonga, qoraqalpoq aholisi esa Qoraqalpogʻistonga kiritildi.',
    delimitationRoleKaa: 'Shegaralanıw nátiyjesinde Xorezmniń ózbekleri Ózbekstanǵa, qaraqalpaqları bolsa Qaraqalpaqstanǵa qosıldı.',
    descriptionUz: 'Ichan qalʼa meʼmoriy majmuasi va ming yillik madaniyat oʻchogʻi.',
    descriptionKaa: 'Iyshan qala arxitekturalıq orayı hám áyyemgi mádeniyat besigi.',
  },
  {
    id: 'ashxobod',
    nameUz: 'Ashxobod',
    nameKaa: 'Ashxabad',
    nameRu: 'Ашхабад',
    x: 235,
    y: 595,
    statusByYear: {
      1917: { typeUz: 'Kaspiyorti viloyati markazi', typeKaa: 'Kaspayanı wálayatı orayı' },
      1920: { typeUz: 'Poltoratsk (Turkiston ASSR)', typeKaa: 'Poltoratsk (Túrkstan ASSR)' },
      1924: { typeUz: '★ Turkmaniston SSR poytaxti', typeKaa: '★ Túrkmenstan SSR paytaxtı', isCapital: true },
      1925: { typeUz: '★ Turkmaniston SSR poytaxti', typeKaa: '★ Túrkmenstan SSR paytaxtı', isCapital: true },
      1930: { typeUz: '★ Turkmaniston SSR poytaxti', typeKaa: '★ Túrkmenstan SSR paytaxtı', isCapital: true },
      1936: { typeUz: '★ Turkmaniston SSR poytaxti', typeKaa: '★ Túrkmenstan SSR paytaxtı', isCapital: true },
    },
    delimitationRoleUz: 'Turkmaniston SSRning maʼmuriy va siyosiy poytaxti.',
    delimitationRoleKaa: 'Túrkmenstan SSRnıń administrativlik hám siyasiy paytaxtı.',
    descriptionUz: 'Kopetdogʻ etaklarida joylashgan turkman xalqining bosh shahri.',
    descriptionKaa: 'Kópetdaǵ eteginde ornalasqan túrkmen xalqınıń bas qalası.',
  },
  {
    id: 'dushanbe',
    nameUz: 'Dushanbe',
    nameKaa: 'Dushanbe',
    nameRu: 'Душанбе',
    x: 695,
    y: 575,
    statusByYear: {
      1917: { typeUz: 'Sharqiy Buxoro bekligi', typeKaa: 'Shıǵıs Buxara bekligi' },
      1920: { typeUz: 'Dyushambe qishlogʻi', typeKaa: 'Dyushambe awılı' },
      1924: { typeUz: '★ Tojikiston ASSR markazi (OʻzSSR)', typeKaa: '★ Tájikstan ASSR orayı (ÓzSSR)', isCapital: true },
      1925: { typeUz: '★ Tojikiston ASSR poytaxti', typeKaa: '★ Tájikstan ASSR paytaxtı', isCapital: true },
      1930: { typeUz: '★ Tojikiston SSR poytaxti (Stalinobod)', typeKaa: '★ Tájikstan SSR paytaxtı (Stalinabad)', isCapital: true },
      1936: { typeUz: '★ Tojikiston SSR poytaxti', typeKaa: '★ Tájikstan SSR paytaxtı', isCapital: true },
    },
    delimitationRoleUz: '1924-yilda Tojikiston ASSR poytaxti etib belgilangan.',
    delimitationRoleKaa: '1924-jılda Tájikstan ASSR paytaxtı etip belgilengen.',
    descriptionUz: 'Hisor vodiysida joylashgan Tojikistonning hozirgi poytaxti.',
    descriptionKaa: 'Hisar oypatlıǵında ornalasqan Tájikstannıń házirgi paytaxtı.',
  },
  {
    id: 'xorug',
    nameUz: 'Xorugʻ',
    nameKaa: 'Xorug',
    nameRu: 'Хорог',
    x: 820,
    y: 635,
    statusByYear: {
      1917: { typeUz: 'Pomir chegara posti', typeKaa: 'Pomir shegara postı' },
      1920: { typeUz: 'Sharqiy Pomir okrugi', typeKaa: 'Shıǵıs Pomir okrugı' },
      1924: { typeUz: 'Togʻli Badaxshon MV markazi', typeKaa: 'Tawlı Badaxshan AW orayı' },
      1925: { typeUz: 'Togʻli Badaxshon markazi', typeKaa: 'Tawlı Badaxshan orayı' },
      1930: { typeUz: 'Pomir markazi', typeKaa: 'Pomir orayı' },
      1936: { typeUz: 'Togʻli Badaxshon markazi', typeKaa: 'Tawlı Badaxshan orayı' },
    },
    delimitationRoleUz: 'Pomir togʻlaridagi strategik hudud va Togʻli Badaxshon markazi.',
    delimitationRoleKaa: 'Pomir tawlarındaǵı strategiyalıq aymaq hám Tawlı Badaxshan orayı.',
    descriptionUz: 'Dengiz sathidan 2200 metr balandlikda joylashgan baland togʻ shahri.',
    descriptionKaa: 'Teńiz betinen 2200 metr bálentlikte ornalasqan bálent taw qalası.',
  },
  {
    id: 'pishpek',
    nameUz: 'Pishpek (Bishkek)',
    nameKaa: 'Pishpek (Bishkek)',
    nameRu: 'Пишпек',
    x: 830,
    y: 350,
    statusByYear: {
      1917: { typeUz: 'Yettisuv viloyati uyezdi', typeKaa: 'Jetisuw wálayatı uyezdi' },
      1920: { typeUz: 'Turkiston ASSR shahri', typeKaa: 'Túrkstan ASSR qalası' },
      1924: { typeUz: '★ Qora-Qirgʻiz MV markazi', typeKaa: '★ Qara-Qırǵız AW orayı', isCapital: true },
      1925: { typeUz: '★ Qirgʻiziston MV poytaxti', typeKaa: '★ Qırǵızstan AW paytaxtı', isCapital: true },
      1930: { typeUz: '★ Qirgʻiziston ASSR poytaxti (Frunze)', typeKaa: '★ Qırǵızstan ASSR paytaxtı (Frunze)', isCapital: true },
      1936: { typeUz: '★ Qirgʻiziston SSR poytaxti', typeKaa: '★ Qırǵızstan SSR paytaxtı', isCapital: true },
    },
    delimitationRoleUz: 'Qora-Qirgʻiz muxtoriyatining bosh maʼmuriy markazi.',
    delimitationRoleKaa: 'Qara-Qırǵız avtonomiyasınıń bas administrativlik orayı.',
    descriptionUz: 'Qirgʻiziston Respublikasining hozirgi poytaxti.',
    descriptionKaa: 'Qırǵızstan Respublikasınıń házirgi paytaxtı.',
  },
  {
    id: 'alma-ata',
    nameUz: 'Olmaota (Varniy)',
    nameKaa: 'Almata (Verniy)',
    nameRu: 'Алма-Ата',
    x: 935,
    y: 295,
    statusByYear: {
      1917: { typeUz: 'Yettisuv viloyati markazi', typeKaa: 'Jetisuw wálayatı orayı' },
      1920: { typeUz: 'Yettisuv viloyati', typeKaa: 'Jetisuw wálayatı' },
      1924: { typeUz: 'Qozogʻiston ASSR sharqiy markazi', typeKaa: 'Qazaqstan ASSR shıǵıs orayı' },
      1925: { typeUz: 'Qozogʻiston ASSR shahri', typeKaa: 'Qazaqstan ASSR qalası' },
      1930: { typeUz: '★ Qozogʻiston ASSR poytaxti (1929 dan)', typeKaa: '★ Qazaqstan ASSR paytaxtı (1929 dan)', isCapital: true },
      1936: { typeUz: '★ Qozogʻiston SSR poytaxti', typeKaa: '★ Qazaqstan SSR paytaxtı', isCapital: true },
    },
    delimitationRoleUz: 'Yettisuv viloyatining Qozogʻistonga oʻtkazilgan yirik shahri.',
    delimitationRoleKaa: 'Jetisuw wálayatınıń Qazaqstanǵa ótkerilgen iri qalası.',
    descriptionUz: 'Tyan-Shan etaklarida joylashgan tarixiy megapolis.',
    descriptionKaa: 'Tyanshan eteklerinde ornalasqan tariyxıy qala.',
  },
  {
    id: 'kazalinsk',
    nameUz: 'Gʻazolinsk (Qazali)',
    nameKaa: 'Qazalı',
    nameRu: 'Казалинск',
    x: 375,
    y: 195,
    statusByYear: {
      1917: { typeUz: 'Sirdaryo viloyati qalʼa shahri', typeKaa: 'Sırdárya wálayatı qorǵan qalası' },
      1920: { typeUz: 'Turkiston ASSR temir yoʻl punkti', typeKaa: 'Túrkstan ASSR temirjol punktı' },
      1924: { typeUz: 'Qozogʻiston ASSR Sirdaryo okrugi', typeKaa: 'Qazaqstan ASSR Sırdárya okrugı' },
      1925: { typeUz: 'Orol dengizi temir yoʻl stansiyasi', typeKaa: 'Aral teńizi temirjol stanciyası' },
      1930: { typeUz: 'Transport tuguni', typeKaa: 'Transport túyini' },
      1936: { typeUz: 'Qiziloʻrda viloyati shahri', typeKaa: 'Qızılorda wálayatı qalası' },
    },
    delimitationRoleUz: 'Sirdaryoning quyi oqimi va Toshkent-Orenburg temir yoʻlidagi strategik post.',
    delimitationRoleKaa: 'Sırdáryanıń tómengi aǵımı hám Tashkent-Orenburg temirjolındaǵı post.',
    descriptionUz: 'Orolboʻyi mintaqasining qadimiy savdo va tranzit shahri.',
    descriptionKaa: 'Aralboyı aymaǵınıń áyyemgi sawda hám tranzit qalası.',
  },
]

// --- Chronological Auto-Play Steps of the 1924–1925 Delimitation ---
const DELIMITATION_STEPS: DelimitationStep[] = [
  {
    id: 'step-overview',
    stepNumber: 1,
    titleUz: '1924-yilgacha boʻlgan holat',
    titleKaa: '1924-jılǵa shekemgi jaǵday',
    dateLabelUz: '1924-yil boshigacha',
    dateLabelKaa: '1924-jıl basına shekem',
    territoryId: undefined,
    siteId: 'toshkent',
    descriptionUz: 'Oʻrta Osiyoda Turkiston ASSR, Buxoro Xalq Sovet Respublikasi va Xorazm Xalq Sovet Respublikasi mavjud edi. Chegaralar milliy xususiyatlarni hisobga olmagan holda shakllangan edi.',
    descriptionKaa: 'Oraylıq Aziyada Túrkstan ASSR, Buxara Xalıq Sovet Respublikası hám Xorezm Xalıq Sovet Respublikası bar edi.',
    decreeUz: 'Qizil nuqtali chiziqlar chegaralanishgacha boʻlgan sobiq respublikalar chegarasini bildiradi.',
    decreeKaa: 'Qızıl noqatlı sızıqlar shegaralanıwǵa shekemgi respublikalar shegarasın bildiredi.',
  },
  {
    id: 'step-tajik',
    stepNumber: 2,
    titleUz: 'Tojikiston ASSR tashkil topishi',
    titleKaa: 'Tájikstan ASSR dúziliwi',
    dateLabelUz: '1924-yil 14-oktyabr',
    dateLabelKaa: '1924-jıl 14-oktyabr',
    territoryId: 'tajik-assr',
    siteId: 'dushanbe',
    descriptionUz: 'Butunrossiya MIQ qarori bilan Sharqiy Buxoro va Pomir yerlarida Oʻzbekiston SSR tarkibida Tojikiston Muxtor Sovet Sotsialistik Respublikasi tuzildi.',
    descriptionKaa: 'Pútkilrossiya OAK qararı menen Shıǵıs Buxara hám Pomir jerlerinde Ózbekstan SSR quramında Tájikstan ASSR dúzildi.',
    decreeUz: 'Poytaxti Dyushambe (Dushanbe) etib belgilandi.',
    decreeKaa: 'Paytaxtı Dyushambe awılı etip belgilendi.',
  },
  {
    id: 'step-kara-kirghiz',
    stepNumber: 3,
    titleUz: 'Qora-Qirgʻiz Muxtor Viloyati',
    titleKaa: 'Qara-Qırǵız Avtonomiyalı Wálayatı',
    dateLabelUz: '1924-yil 14-oktyabr',
    dateLabelKaa: '1924-jıl 14-oktyabr',
    territoryId: 'kara-kirghiz-ao',
    siteId: 'pishpek',
    descriptionUz: 'Turkiston ASSR tarkibidagi qirgʻizlar yashaydigan Tyan-Shan va Issiqkoʻl viloyatlari ajratilib, RSFSR tarkibida Qora-Qirgʻiz muxtoriyati tuzildi.',
    descriptionKaa: 'Túrkstan ASSR quramındaǵı qırǵızlar jasaytuǵın Tyanshan hám Íssıqkól aymaqları bólinip, Qara-Qırǵız avtonomiyası dúzildi.',
    decreeUz: 'Markazi Pishpek (hozirgi Bishkek) shahri.',
    decreeKaa: 'Orayı Pishpek (házirgi Bishkek) qalası.',
  },
  {
    id: 'step-uzbek',
    stepNumber: 4,
    titleUz: 'Oʻzbekiston SSR tashkil topishi',
    titleKaa: 'Ózbekstan SSR dúziliwi',
    dateLabelUz: '1924-yil 27-oktyabr',
    dateLabelKaa: '1924-jıl 27-oktyabr',
    territoryId: 'uzbekistan-ssr',
    siteId: 'samarqand',
    descriptionUz: 'SSSR MIQ sessiyasida Oʻzbekiston SSR tashkil etildi. Samarqand yangi ittifoqdosh respublikaning birinchi poytaxti etib eʼlon qilindi (1925–1930).',
    descriptionKaa: 'SSSR OAK sessiyasında Ózbekstan SSR dúzildi. Samarqand jańa awqamlas respublikanıń birinshi paytaxtı etip járiyalandı.',
    decreeUz: 'Fayzulla Xoʻjayev Inqilobiy qoʻmita raisi etib tayinlandi.',
    decreeKaa: 'Fayzulla Xojayev Revolyutsiyalıq komitet baslıǵı etip tayınlandı.',
  },
  {
    id: 'step-turkmen',
    stepNumber: 5,
    titleUz: 'Turkmaniston SSR tashkil topishi',
    titleKaa: 'Túrkmenstan SSR dúziliwi',
    dateLabelUz: '1924-yil 27-oktyabr',
    dateLabelKaa: '1924-jıl 27-oktyabr',
    territoryId: 'turkmen-ssr',
    siteId: 'ashxobod',
    descriptionUz: 'Turkistonning Kaspiyorti viloyati hamda Xiva va Buxorodagi turkman tumanlari birlashtirilib, mustaqil Turkmaniston SSR tuzildi.',
    descriptionKaa: 'Túrkstannıń Kaspayanı wálayatı hámde Xiywa hám Buxaradaǵı túrkmen rayonları birlestirilip, Túrkmenstan SSR dúzildi.',
    decreeUz: 'Poytaxti Ashxobod (Poltoratsk) shahri boʻldi.',
    decreeKaa: 'Paytaxtı Ashxabad qalası boldı.',
  },
  {
    id: 'step-karakalpak',
    stepNumber: 6,
    titleUz: 'Qoraqalpogʻiston Muxtor Viloyati',
    titleKaa: 'Qaraqalpaqstan Avtonomiyalı Wálayatı',
    dateLabelUz: '1925-yil fevral – may',
    dateLabelKaa: '1925-jıl fevral – may',
    territoryId: 'karakalpak-ao',
    siteId: 'tortkol',
    descriptionUz: 'Toʻrtkoʻl shahrida Qoraqalpogʻiston sovetlarining I Taʼsis syezdi boʻlib oʻtdi. Allayar Doʻstnazarov va Abu Qudabayev tashabbusi bilan Qoraqalpogʻiston Muxtor Viloyati tuzildi.',
    descriptionKaa: 'Tórtkúl qalasında Qaraqalpaqstan I Shólkemlestiriw siezdi ótkerildi. Allayar Dosnazarov hám Ábiw Qudabaev basshılıǵında Qaraqalpaq avtonomiyası dúzildi.',
    decreeUz: 'Birinchi poytaxti Toʻrtkoʻl shahri. 1925-yil 11-mayda rasman tasdiqlandi.',
    decreeKaa: 'Birinshi paytaxtı Tórtkúl qalası. 1925-jıl 11-mayda rásmiy tastıyıqlangʻan.',
  },
  {
    id: 'step-kazakh',
    stepNumber: 7,
    titleUz: 'Qozogʻiston ASSR chegaralari',
    titleKaa: 'Qazaqstan ASSR shegaraları',
    dateLabelUz: '1925-yil',
    dateLabelKaa: '1925-jıl',
    territoryId: 'kazakh-assr',
    siteId: 'kazalinsk',
    descriptionUz: 'Sirdaryo va Yettisuv viloyatlarining qozoq aholisi yashaydigan hududlari Qozogʻiston ASSRga birlashtirildi, poytaxt Qiziloʻrdaga koʻchirildi.',
    descriptionKaa: 'Sırdárya hám Jetisuw wálayatlarınıń qazaq xalqı jasaytuǵın aymaqları Qazaqstan ASSRge birlestirildi.',
    decreeUz: 'Respublika nomi rasman Qozogʻiston ASSR deb oʻzgartirildi (ungacha Qirgʻiziston ASSR deb atalgan).',
    decreeKaa: 'Respublika atı rásmiy Qazaqstan ASSR dep ózgertildi.',
  },
  {
    id: 'step-final',
    stepNumber: 8,
    titleUz: '1925-yil yakuni: Yangi Oʻrta Osiyo xaritasi',
    titleKaa: '1925-jıl juwmaǵı: Jańa Oraylıq Aziya kartası',
    dateLabelUz: '1925-yil yakuniy natijasi',
    dateLabelKaa: '1925-jıl juwmaqlawshı nátiyjesi',
    territoryId: undefined,
    siteId: 'samarqand',
    descriptionUz: 'Chegaralanish jarayoni toʻliq yakunlandi. Oʻzbekiston va Qoraqalpogʻiston milliy davlatchiligi yangi tarixiy bosqichga qadam qoʻydi.',
    descriptionKaa: 'Shegaralanıw procesi tolıq juwmaqlandı. Ózbekstan hám Qaraqalpaqstan milliy mámleketshiligi jańa basqıshqa qádem qoydı.',
    decreeUz: 'Rasmdagi 1924–1925-yillardagi real atlas xaritasi butun mintaqa qiyofasini shakllantirdi.',
    decreeKaa: 'Súwrettegi 1924–1925-jıllardaǵı real atlas kartası mintaqa qıyapasın qáliplestirdi.',
  },
]

export function HistoricalMap({ locale = 'uz' }: { locale: string }) {
  const isKaa = locale === 'kaa'

  // View mode: 'interactive' (SVG real atlas) vs 'original' (1924 archival scan)
  const [viewMode, setViewMode] = useState<'interactive' | 'original' | 'split'>('interactive')

  // Selected territories & sites
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(DELIMITATION_1924_TERRITORIES[2]) // Default: O'zbekiston SSR
  const [selectedSite, setSelectedSite] = useState<HistoricalSite | null>(HISTORICAL_SITES[0]) // Default: Samarqand

  // Auto-play state
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1 | 2>(1)
  const [progressPercent, setProgressPercent] = useState<number>(0)

  // Map display toggles
  const [showPre1924Borders, setShowPre1924Borders] = useState<boolean>(true)
  const showRivers = true
  const [showCities, setShowCities] = useState<boolean>(true)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [languageMode, setLanguageMode] = useState<'local' | 'historical'>('local')

  const currentStep = DELIMITATION_STEPS[currentStepIndex]

  // Automatic timeline player interval with smooth sub-step progress line
  useEffect(() => {
    if (!isPlaying) {
      setProgressPercent(0)
      return
    }

    const stepDuration = playbackSpeed === 2 ? 2000 : playbackSpeed === 0.5 ? 6000 : 3800
    const intervalMs = 50
    const stepIncrement = (intervalMs / stepDuration) * 100

    const timer = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev + stepIncrement >= 100) {
          setCurrentStepIndex((curr) => (curr >= DELIMITATION_STEPS.length - 1 ? 0 : curr + 1))
          return 0
        }
        return prev + stepIncrement
      })
    }, intervalMs)

    return () => clearInterval(timer)
  }, [isPlaying, playbackSpeed])

  // Sync selected territory & site when step changes during auto-play
  useEffect(() => {
    const step = DELIMITATION_STEPS[currentStepIndex]
    if (!step) return

    if (step.territoryId) {
      const foundT = DELIMITATION_1924_TERRITORIES.find((t) => t.id === step.territoryId)
      if (foundT) setSelectedTerritory(foundT)
    } else {
      setSelectedTerritory(null)
    }

    if (step.siteId) {
      const foundS = HISTORICAL_SITES.find((s) => s.id === step.siteId)
      if (foundS) setSelectedSite(foundS)
    }
  }, [currentStepIndex])

  const handleStepChange = (index: number) => {
    setProgressPercent(0)
    setCurrentStepIndex(index)
  }

  const handleManualTerritorySelect = (t: Territory) => {
    setIsPlaying(false) // pause auto-play on manual click
    setSelectedTerritory(t)
    setSelectedSite(null)
  }

  const handleManualSiteSelect = (s: HistoricalSite) => {
    setIsPlaying(false) // pause auto-play on manual click
    setSelectedSite(s)
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Top Banner & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-black text-lg text-[var(--foreground)] tracking-wide">
              {isKaa
                ? '1924–1925 Milliy-aymaqlıq shegaralanıw rásmiy kartası'
                : '1924–1925 Milliy-davlat chegaralanishi rasmiy xaritasi'}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              {isKaa
                ? 'Arxiv kartası, avto ijro xronologiyası hám tolıq interaktiv model'
                : 'Arxiv xaritasi, avto ijro xronologiyasi va toʻliq interaktiv model'}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--secondary)] border border-[var(--border)] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('interactive')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'interactive'
                ? 'bg-amber-500 text-black shadow-xs font-bold'
                : 'text-[var(--foreground)] hover:text-amber-500'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isKaa ? 'Interaktiv Karta' : 'Interaktiv Xarita'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('original')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'original'
                ? 'bg-amber-500 text-black shadow-xs font-bold'
                : 'text-[var(--foreground)] hover:text-amber-500'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isKaa ? 'Asl Arxiv Kartası' : 'Asl Arxiv Xaritasi'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-amber-500 text-black shadow-xs font-bold'
                : 'text-[var(--foreground)] hover:text-amber-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isKaa ? 'Yonma-yon solıstırıw' : 'Yonma-yon solishtirish'}</span>
          </button>
        </div>
      </div>

      {/* Main Map Box Layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-[380px_minmax(0,1fr)] min-h-[740px] rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl bg-[var(--background)]">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--card)] space-y-6 overflow-y-auto">
          <div className="space-y-5">
            {/* Historical Header */}
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>1924 – 1925</span>
                </div>

                {/* Auto Play indicator badge */}
                {isPlaying && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-rose-500 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>{isKaa ? 'Avto Ijro Aktiv' : 'Avto Ijro Faol'}</span>
                  </span>
                )}
              </div>

              <h3 className="font-serif font-black text-xl text-[var(--foreground)] mt-2 leading-snug">
                {isKaa
                  ? 'Oraylıq Aziya Respubilkalarınıń Milliy-Mámleketlik Shegaralanıwı'
                  : 'Oʻrta Osiyo Respublikalarining Milliy-Davlat Chegaralanishi'}
              </h3>
            </div>

            {/* ================= AUTO PLAY CONTROLLER ================= */}
            <div className="p-3.5 rounded-2xl bg-[var(--secondary)]/70 border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--muted-foreground)] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isKaa ? 'Avto Ijro Xronologiyası' : 'Avto Ijro Xronologiyasi'}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center bg-[var(--card)] border border-[var(--border)] rounded-md overflow-hidden text-[10px] font-mono font-bold">
                    {([0.5, 1, 2] as const).map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-1.5 py-0.5 transition-colors cursor-pointer ${
                          playbackSpeed === spd
                            ? 'bg-amber-500 text-black'
                            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      isPlaying
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : 'bg-amber-500 text-black hover:brightness-110'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>{isKaa ? 'Toqtatıw' : 'Toʻxtatish'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isKaa ? 'Avto Ijro' : 'Avto Ijro'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step Title & Timeline navigator */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-500 font-serif">
                    {currentStep.stepNumber}/{DELIMITATION_STEPS.length}: {isKaa ? currentStep.titleKaa : currentStep.titleUz}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                    {isKaa ? currentStep.dateLabelKaa : currentStep.dateLabelUz}
                  </span>
                </div>

                {/* Micro Progress Bar */}
                <div className="relative w-full h-1 bg-[var(--border)] rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-amber-500 transition-all duration-75 ease-linear rounded-full"
                    style={{
                      width: isPlaying
                        ? `${((currentStepIndex + progressPercent / 100) / DELIMITATION_STEPS.length) * 100}%`
                        : `${((currentStepIndex + 1) / DELIMITATION_STEPS.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Progress Step Dots */}
                <div className="grid grid-cols-8 gap-1 pt-1">
                  {DELIMITATION_STEPS.map((s, idx) => {
                    const isCurrent = idx === currentStepIndex
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setIsPlaying(false)
                          handleStepChange(idx)
                        }}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500 scale-110 shadow-xs'
                            : idx < currentStepIndex
                            ? 'bg-amber-500/50'
                            : 'bg-[var(--border)] hover:bg-amber-400/40'
                        }`}
                        title={`${s.stepNumber}. ${isKaa ? s.titleKaa : s.titleUz}`}
                      />
                    )
                  })}
                </div>

                {/* Prev / Next buttons */}
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying(false)
                      handleStepChange(Math.max(0, currentStepIndex - 1))
                    }}
                    disabled={currentStepIndex === 0}
                    className="flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <SkipBack className="w-3 h-3" />
                    <span>{isKaa ? 'Aldınǵı' : 'Oldingi'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying(false)
                      handleStepChange(Math.min(DELIMITATION_STEPS.length - 1, currentStepIndex + 1))
                    }}
                    disabled={currentStepIndex === DELIMITATION_STEPS.length - 1}
                    className="flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <span>{isKaa ? 'Keyingi' : 'Keyingi'}</span>
                    <SkipForward className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Republic Selector Buttons */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--muted-foreground)] block">
                {isKaa ? 'Respublikalardı tańlań:' : 'Respublikalarni tanlang:'}
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {DELIMITATION_1924_TERRITORIES.map((t) => {
                  const isSelected = selectedTerritory?.id === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleManualTerritorySelect(t)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/15 text-[var(--foreground)] shadow-xs'
                          : 'border-[var(--border)] hover:border-amber-400/50 bg-[var(--secondary)]/40 text-[var(--foreground)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-md border shrink-0"
                          style={{ backgroundColor: t.color, borderColor: t.strokeColor }}
                        />
                        <span className="truncate">{isKaa ? t.nameKaa : t.nameUz}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-70 shrink-0 ml-2">
                        {t.dateLabel}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected Republic or City Info Panel */}
            {selectedTerritory ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--secondary)]/70 to-[var(--card)] border border-[var(--border)] space-y-3 animate-fade-in shadow-xs">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-white shadow-xs"
                    style={{ backgroundColor: selectedTerritory.strokeColor }}
                  >
                    {selectedTerritory.dateLabel}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                    1924–1925
                  </span>
                </div>

                <h4 className="font-serif font-black text-base text-[var(--foreground)]">
                  {isKaa ? selectedTerritory.nameKaa : selectedTerritory.nameUz}
                </h4>

                <p className="text-[11px] font-serif italic text-amber-600 dark:text-amber-400">
                  {selectedTerritory.nameRu}
                </p>

                <div className="space-y-1.5 text-xs text-[var(--foreground)] border-t border-[var(--border)] pt-2.5">
                  <p>
                    <strong className="text-[var(--muted-foreground)]">
                      {isKaa ? 'Paytaxtı:' : 'Poytaxti / Markazi:'}
                    </strong>{' '}
                    <span className="font-semibold text-amber-500">
                      {isKaa ? selectedTerritory.capitalKaa : selectedTerritory.capitalUz}
                    </span>
                  </p>
                  <p>
                    <strong className="text-[var(--muted-foreground)]">
                      {isKaa ? 'Aholisi:' : 'Aholisi:'}
                    </strong>{' '}
                    <span>{isKaa ? selectedTerritory.populationKaa : selectedTerritory.populationUz}</span>
                  </p>
                  <p>
                    <strong className="text-[var(--muted-foreground)]">
                      {isKaa ? 'Huquqiy maqomi:' : 'Huquqiy maqomi:'}
                    </strong>{' '}
                    <span>{isKaa ? selectedTerritory.legalStatusKaa : selectedTerritory.legalStatusUz}</span>
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-[var(--foreground)] space-y-1">
                  <strong className="text-amber-600 dark:text-amber-400 block font-mono text-[10px] uppercase">
                    {isKaa ? 'Tariyxıy Qarar:' : 'Tarixiy Qaror:'}
                  </strong>
                  <p className="leading-relaxed">
                    {isKaa ? selectedTerritory.decreeKaa : selectedTerritory.decreeUz}
                  </p>
                </div>
              </div>
            ) : selectedSite ? (
              <div className="p-4 rounded-2xl bg-[var(--secondary)]/70 border border-[var(--border)] space-y-3 animate-fade-in shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedSite.statusByYear[1924]?.isCapital ? (isKaa ? '★ Bas Paytaxt' : '★ Bosh Poytaxt') : (isKaa ? 'Tariyxıy Qala' : 'Tarixiy Shahar')}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                    {selectedSite.nameRu}
                  </span>
                </div>

                <h4 className="font-serif font-black text-xl text-[var(--foreground)]">
                  {isKaa ? selectedSite.nameKaa : selectedSite.nameUz}
                </h4>

                <p className="text-xs text-[var(--foreground)] leading-relaxed">
                  {isKaa ? selectedSite.delimitationRoleKaa : selectedSite.delimitationRoleUz}
                </p>

                <p className="text-[11px] text-[var(--muted-foreground)] italic">
                  {isKaa ? selectedSite.descriptionKaa : selectedSite.descriptionUz}
                </p>

                {selectedSite.articleSlug && (
                  <Link
                    href={`/maqolalar/${selectedSite.articleSlug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 hover:text-amber-600 pt-1"
                  >
                    <span>{isKaa ? 'Maqalada tolıq oqıw' : 'Maqolada toʻliq oʻqish'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <h4 className="font-serif font-black text-base text-[var(--foreground)]">
                  {isKaa ? currentStep.titleKaa : currentStep.titleUz}
                </h4>
                <p className="text-xs text-[var(--foreground)] leading-relaxed">
                  {isKaa ? currentStep.descriptionKaa : currentStep.descriptionUz}
                </p>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                  {isKaa ? currentStep.decreeKaa : currentStep.decreeUz}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Info note */}
          <div className="text-[11px] text-[var(--muted-foreground)] p-3 rounded-xl bg-[var(--secondary)]/40 border border-[var(--border)] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
              <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{isKaa ? 'Karta haqqında esletpe:' : 'Xarita haqida eslatma:'}</span>
            </div>
            <p className="leading-relaxed">
              {isKaa
                ? 'Qızıl noqatlı sızıqlar shegaralanıwǵa shekemgi Túrkstan, Buxara hám Xorezm shegaraların bildiredi.'
                : 'Qizil nuqtali chiziqlar chegaralanishgacha boʻlgan sobiq Turkiston, Buxoro va Xorazm chegaralarini bildiradi.'}
            </p>
          </div>
        </aside>

        {/* ================= RIGHT MAP CANVAS ================= */}
        <div className="relative flex-1 min-h-[580px] bg-[#fbf6ed] dark:bg-[#181512] overflow-hidden flex flex-col justify-between p-4 sm:p-6 select-none">
          {/* Top Controls Toolbar */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-3">
            {/* Title Badge on map with Auto-Play live pulse */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-300 dark:border-stone-700 shadow-sm text-xs font-serif font-black tracking-wide text-stone-900 dark:text-stone-100">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isPlaying ? 'bg-rose-500 animate-ping' : 'bg-amber-500'
                }`}
              />
              <span>
                {isPlaying
                  ? `${currentStep.stepNumber}/${DELIMITATION_STEPS.length}: ${
                      isKaa ? currentStep.titleKaa : currentStep.titleUz
                    }`
                  : languageMode === 'historical'
                  ? 'НАЦИОНАЛЬНО-ГОСУДАРСТВЕННОЕ РАЗМЕЖЕВАНИЕ (1924–1925 гг.)'
                  : isKaa
                  ? 'ORAYLIQ AZIYA RESPUBLIKALARINIŃ SHEGARALANIWI (1924–1925)'
                  : 'OʻRTA OSIYO RESPUBLIKALARINING CHEGARALANISHI (1924–1925)'}
              </span>
            </div>

            {/* Interactive Layer Toggles & Zoom */}
            <div className="flex items-center gap-1.5 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md p-1 rounded-xl border border-stone-300 dark:border-stone-700 shadow-sm text-xs">
              <button
                type="button"
                onClick={() => setShowPre1924Borders((v) => !v)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  showPre1924Borders
                    ? 'bg-amber-500 text-black font-bold'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
                title="Chegaralanishdan oldingi chegaralar"
              >
                {isKaa ? 'Aldınǵı shegara' : 'Avvalgi chegara'}
              </button>

              <button
                type="button"
                onClick={() => setShowCities((v) => !v)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  showCities
                    ? 'bg-amber-500 text-black font-bold'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
                title="Tarixiy shaharlar"
              >
                {isKaa ? 'Qalalar' : 'Shaharlar'}
              </button>

              <button
                type="button"
                onClick={() => setLanguageMode((m) => (m === 'local' ? 'historical' : 'local'))}
                className="px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border border-stone-300 dark:border-stone-700 hover:border-amber-500 transition-colors cursor-pointer"
                title="Til / Tarixiy yozuvlar"
              >
                {languageMode === 'historical' ? 'RU / 1924' : 'UZ / KAA'}
              </button>

              <div className="w-px h-4 bg-stone-300 dark:bg-stone-700 mx-1" />

              {/* Zoom Buttons */}
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                title="Kattalashtirish"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
                className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                title="Kichiklashtirish"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                title="Asl oʻlcham"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ================= MAP CONTENT DISPLAY ================= */}
          {viewMode === 'original' ? (
            /* Direct High-Resolution Display of the User's Image */
            <div className="relative flex-1 w-full my-4 flex items-center justify-center overflow-auto rounded-2xl border-2 border-amber-900/20 bg-stone-100 dark:bg-stone-900 p-2 shadow-inner">
              <div
                className="relative transition-transform duration-300 max-w-full"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <Image
                  src="/images/delimitation-1924-original.png"
                  alt="1924-1925 Milliy-hududiy chegaralanish xaritasi"
                  width={1400}
                  height={800}
                  unoptimized
                  className="rounded-xl shadow-xl border border-stone-400 object-contain max-h-[580px] w-auto"
                />
              </div>
            </div>
          ) : viewMode === 'split' ? (
            /* Split View: Side-by-side original archive scan and interactive vector map */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 my-3">
              <div className="relative rounded-xl overflow-hidden border border-amber-900/30 bg-stone-900 flex items-center justify-center p-2">
                <Image
                  src="/images/delimitation-1924-original.png"
                  alt="Asl xarita"
                  width={700}
                  height={400}
                  unoptimized
                  className="rounded-lg object-contain max-h-[480px]"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-amber-400 font-mono">
                  1924 Arxiv Asl Nusxasi
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-amber-900/30 bg-[#fbf6ed] dark:bg-[#181512] flex items-center justify-center">
                <RealisticSvgMap
                  territories={DELIMITATION_1924_TERRITORIES}
                  sites={HISTORICAL_SITES}
                  selectedTerritory={selectedTerritory}
                  selectedSite={selectedSite}
                  onSelectTerritory={handleManualTerritorySelect}
                  onSelectSite={handleManualSiteSelect}
                  showPre1924Borders={showPre1924Borders}
                  showRivers={showRivers}
                  showCities={showCities}
                  languageMode={languageMode}
                  isKaa={isKaa}
                  isPlaying={isPlaying}
                />
              </div>
            </div>
          ) : (
            /* Full Interactive Authentic SVG Map matching the picture */
            <div className="relative flex-1 w-full my-2 flex flex-col items-center justify-center">
              {/* Floating Active Step Event Card overlaying map during Auto-Play or navigation */}
              <div className="absolute top-2 left-2 sm:left-4 z-20 max-w-sm sm:max-w-md p-3 sm:p-3.5 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-amber-500/40 shadow-xl pointer-events-none transition-all duration-300">
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{isKaa ? currentStep.dateLabelKaa : currentStep.dateLabelUz}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold">
                    {currentStep.stepNumber} / {DELIMITATION_STEPS.length}
                  </span>
                </div>
                <h4 className="font-serif font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100 mt-1.5">
                  {isKaa ? currentStep.titleKaa : currentStep.titleUz}
                </h4>
                <p className="text-[11px] text-stone-700 dark:text-stone-300 mt-1 leading-snug">
                  {isKaa ? currentStep.descriptionKaa : currentStep.descriptionUz}
                </p>
                <div className="mt-1.5 pt-1 border-t border-dashed border-stone-200 dark:border-stone-800 flex items-start gap-1 text-[10px] text-amber-700 dark:text-amber-300 font-serif italic">
                  <Sparkles className="w-3 h-3 shrink-0 mt-0.5" />
                  <span>{isKaa ? currentStep.decreeKaa : currentStep.decreeUz}</span>
                </div>
              </div>

              <div
                className="w-full flex-1 transition-transform duration-300 ease-out flex items-center justify-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <RealisticSvgMap
                  territories={DELIMITATION_1924_TERRITORIES}
                  sites={HISTORICAL_SITES}
                  selectedTerritory={selectedTerritory}
                  selectedSite={selectedSite}
                  activeStep={currentStep}
                  onSelectTerritory={handleManualTerritorySelect}
                  onSelectSite={handleManualSiteSelect}
                  showPre1924Borders={showPre1924Borders}
                  showRivers={showRivers}
                  showCities={showCities}
                  languageMode={languageMode}
                  isKaa={isKaa}
                  isPlaying={isPlaying}
                />
              </div>
            </div>
          )}

          {/* ================= FLOATING ON-MAP AUTO PLAY DECK ================= */}
          <div className="relative z-20 my-2 p-3 sm:p-4 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-stone-700 shadow-xl space-y-3">
            {/* Top Row: Play/Pause, Step controls, Speed toggle, Step title */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                    isPlaying
                      ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                      : 'bg-amber-500 hover:bg-amber-400 text-black'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>{isKaa ? 'Toqtatıw' : 'Toʻxtatish'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isKaa ? 'Avto Ijro (Boshlash)' : 'Avto Ijro (Boshlash)'}</span>
                    </>
                  )}
                </button>

                {/* Step controls */}
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
                  <button
                    type="button"
                    onClick={() => {
                      handleStepChange(Math.max(0, currentStepIndex - 1))
                    }}
                    disabled={currentStepIndex === 0}
                    className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title={isKaa ? 'Aldınǵı bosqısh' : 'Oldingi bosqich'}
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleStepChange(Math.min(DELIMITATION_STEPS.length - 1, currentStepIndex + 1))
                    }}
                    disabled={currentStepIndex === DELIMITATION_STEPS.length - 1}
                    className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title={isKaa ? 'Keyingi bosqısh' : 'Keyingi bosqich'}
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleStepChange(0)
                    }}
                    className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
                    title={isKaa ? 'Qaytadan baslaw' : 'Boshidan boshlash'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Speed toggle */}
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-[11px] font-mono font-bold">
                  {([0.5, 1, 2] as const).map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                        playbackSpeed === spd
                          ? 'bg-amber-500 text-black shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Step info pill */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
                  {isKaa ? currentStep.dateLabelKaa : currentStep.dateLabelUz}
                </span>
                <span className="text-xs font-serif font-black text-stone-900 dark:text-stone-100 hidden md:inline">
                  {currentStep.stepNumber}-bosqich: {isKaa ? currentStep.titleKaa : currentStep.titleUz}
                </span>
              </div>
            </div>

            {/* Micro Progress Bar & 8 Step Buttons */}
            <div className="space-y-1.5">
              <div className="relative w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-75 ease-linear rounded-full"
                  style={{
                    width: isPlaying
                      ? `${((currentStepIndex + progressPercent / 100) / DELIMITATION_STEPS.length) * 100}%`
                      : `${((currentStepIndex + 1) / DELIMITATION_STEPS.length) * 100}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
                {DELIMITATION_STEPS.map((s, idx) => {
                  const isCurrent = idx === currentStepIndex
                  const isPassed = idx < currentStepIndex
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleStepChange(idx)}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-amber-500 bg-amber-500/20 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                          : isPassed
                          ? 'border-amber-500/40 bg-amber-500/5 text-stone-600 dark:text-stone-400'
                          : 'border-stone-200 dark:border-stone-800 hover:border-amber-400/50 text-stone-500 dark:text-stone-500'
                      }`}
                    >
                      <span className="text-[10px] font-mono leading-none font-bold">
                        {s.stepNumber}
                      </span>
                      <span className="text-[9px] font-serif truncate max-w-[80px] mt-0.5 leading-tight text-center">
                        {idx === 0
                          ? isKaa ? '1924 arafasi' : '1924 arafasi'
                          : idx === 1
                          ? isKaa ? 'Tájikstan' : 'Tojikiston'
                          : idx === 2
                          ? isKaa ? 'Qara-Qırǵız' : 'Qora-Qirgʻiz'
                          : idx === 3
                          ? isKaa ? 'Ózbekstan' : 'Oʻzbekiston'
                          : idx === 4
                          ? isKaa ? 'Túrkmenstan' : 'Turkmaniston'
                          : idx === 5
                          ? isKaa ? 'Qaraqalpaq' : 'Qoraqalpoq'
                          : idx === 6
                          ? isKaa ? 'Qazaqstan' : 'Qozogʻiston'
                          : isKaa ? 'Yakun 1925' : 'Yakun 1925'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Bottom Cartographic Legend & Scale bar */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-300/80 dark:border-stone-800 text-[11px] text-stone-700 dark:text-stone-300 font-serif">
            {/* Scale Bar matching original picture */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start font-mono text-[9px]">
                <div className="flex items-center w-28 h-2 border border-black dark:border-white">
                  <div className="w-1/2 h-full bg-black dark:bg-white" />
                  <div className="w-1/2 h-full bg-transparent" />
                </div>
                <div className="flex justify-between w-28 mt-0.5 text-[9px] font-bold">
                  <span>0</span>
                  <span>120</span>
                  <span>240 km</span>
                </div>
              </div>
              <span className="text-[10px] text-stone-500 font-mono hidden sm:inline">
                Masshtab: 1:2 400 000
              </span>
            </div>

            {/* Dotted border explanation */}
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold">
              <span className="border-b-2 border-dotted border-red-700 dark:border-red-400 w-8 inline-block" />
              <span>
                {languageMode === 'historical'
                  ? '....... Границы до размежевания'
                  : isKaa
                  ? '....... Shegaralanıwǵa shekemgi shegaralar'
                  : '....... Chegaralanishgacha boʻlgan chegaralar'}
              </span>
            </div>

            {/* Switch to Original Button */}
            {viewMode !== 'original' && (
              <button
                type="button"
                onClick={() => setViewMode('original')}
                className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isKaa ? 'Asl hújjet kartasın kóriw' : 'Asl hujjat xaritasini koʻrish'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Realistic SVG Vector Component ---
function RealisticSvgMap({
  territories,
  sites,
  selectedTerritory,
  selectedSite,
  activeStep,
  onSelectTerritory,
  onSelectSite,
  showPre1924Borders,
  showRivers,
  showCities,
  languageMode,
  isKaa,
  isPlaying,
}: {
  territories: Territory[]
  sites: HistoricalSite[]
  selectedTerritory: Territory | null
  selectedSite: HistoricalSite | null
  activeStep?: DelimitationStep
  onSelectTerritory: (t: Territory) => void
  onSelectSite: (s: HistoricalSite) => void
  showPre1924Borders: boolean
  showRivers: boolean
  showCities: boolean
  languageMode: 'local' | 'historical'
  isKaa: boolean
  isPlaying?: boolean
}) {
  return (
    <svg
      viewBox="0 0 1000 680"
      className="w-full h-full max-h-[580px] drop-shadow-lg select-none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Authentic Gradients */}
        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8D5EA" />
          <stop offset="100%" stopColor="#8AC4DE" />
        </linearGradient>

        <linearGradient id="riverGradReal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4FA0C7" />
          <stop offset="100%" stopColor="#3182CE" />
        </linearGradient>

        {/* Vintage Paper Texture Filter */}
        <pattern id="vintageGrid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path
            d="M 50 0 L 0 0 0 50"
            fill="none"
            stroke="#78350f"
            strokeWidth="0.3"
            strokeOpacity="0.12"
          />
        </pattern>
      </defs>

      {/* Parchment Background */}
      <rect width="1000" height="680" fill="#fcf8f0" className="dark:fill-[#1a1714]" />
      <rect width="1000" height="680" fill="url(#vintageGrid)" />

      {/* Outer Foreign Territories Shading (White/Grey with vintage borders) */}
      <g id="foreign-countries" className="select-none font-serif font-black text-stone-700 dark:text-stone-300">
        {/* Iran (South-West) */}
        <path d="M 0 550 L 70 540 L 180 620 L 320 670 L 0 670 Z" fill="#eae4d3" className="dark:fill-[#24201c]" />
        <text x="80" y="620" className="text-sm tracking-[0.4em] fill-stone-600 dark:fill-stone-400 font-bold">
          И Р А Н
        </text>

        {/* Afghanistan (South) */}
        <path d="M 320 670 L 460 670 L 525 610 L 660 625 L 760 640 L 900 640 L 900 680 L 320 680 Z" fill="#eae4d3" className="dark:fill-[#24201c]" />
        <text x="500" y="655" className="text-sm tracking-[0.4em] fill-stone-600 dark:fill-stone-400 font-bold">
          А Ф Г А Н И С Т А Н
        </text>

        {/* India / Kashmir (South-East) */}
        <text x="770" y="665" className="text-xs tracking-[0.3em] fill-stone-600 dark:fill-stone-400 font-bold">
          И Н Д И Я
        </text>

        {/* China (East) */}
        <path d="M 970 280 L 1000 280 L 1000 640 L 960 570 L 920 520 L 980 430 Z" fill="#eae4d3" className="dark:fill-[#24201c]" />
        <text x="965" y="490" transform="rotate(90 965 490)" className="text-sm tracking-[0.4em] fill-stone-600 dark:fill-stone-400 font-bold">
          К И Т А Й
        </text>
      </g>

      {/* ================= WATER BODIES ================= */}
      {/* 1. Caspian Sea (Far West) */}
      <path
        d="M 0 100 Q 40 200 45 320 Q 50 440 0 550 Z"
        fill="url(#waterGrad)"
        stroke="#4FA0C7"
        strokeWidth="1.2"
      />
      <text
        x="20"
        y="310"
        transform="rotate(-90 20 310)"
        className="text-[11px] font-serif font-black tracking-widest fill-[#1e4e6b] drop-shadow-xs"
      >
        {isKaa ? 'KASPIY TEŃIZI' : 'КАСПИЙСКОЕ МОРЕ'}
      </text>

      {/* 2. Aral Sea (Pristine 1924 Outline) */}
      <g id="aral-sea-1924">
        <path
          d="M 210 220 C 240 180 280 185 290 225 C 300 270 270 330 230 350 C 190 360 170 320 175 270 C 180 230 185 230 210 220 Z"
          fill="url(#waterGrad)"
          stroke="#4FA0C7"
          strokeWidth="1.5"
        />
        {/* Northern Bay (Saryshyganak) */}
        <path
          d="M 260 200 C 275 180 305 185 310 205 C 315 220 285 230 268 215 Z"
          fill="url(#waterGrad)"
        />
        {/* Barsakelmes & Vozrozhdeniya */}
        <ellipse cx="230" cy="285" rx="8" ry="12" fill="#d97706" fillOpacity="0.5" />
        <text
          x="235"
          y="270"
          textAnchor="middle"
          className="text-xs font-serif font-black tracking-wider fill-[#1e4e6b] drop-shadow-xs"
        >
          {isKaa ? 'ARAL TEŃIZI' : 'АРАЛЬСКОЕ МОРЕ'}
        </text>
      </g>

      {/* 3. Lake Balkhash (North-East) */}
      <path
        d="M 720 180 C 760 160 810 175 840 195 C 830 205 780 190 735 200 Z"
        fill="url(#waterGrad)"
        stroke="#4FA0C7"
        strokeWidth="1.2"
      />
      <text x="770" y="180" className="text-[10px] font-serif italic font-bold fill-[#1e4e6b]">
        {isKaa ? 'Balqash kóli' : 'оз. Балхаш'}
      </text>

      {/* 4. Issyk-Kul */}
      <ellipse cx="890" cy="360" rx="28" ry="12" fill="url(#waterGrad)" stroke="#4FA0C7" strokeWidth="1" />
      <text x="890" y="363" textAnchor="middle" className="text-[9px] font-serif font-bold fill-[#1e4e6b]">
        {isKaa ? 'Íssıqkól' : 'оз. Иссык-Куль'}
      </text>

      {/* ================= RIVERS ================= */}
      {showRivers && (
        <g id="rivers-layer">
          {/* Amu Darya */}
          <path
            d="M 750 635 Q 670 610 590 560 T 490 505 T 390 440 T 330 380 T 260 340 T 230 345"
            fill="none"
            stroke="url(#riverGradReal)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text
            x="400"
            y="465"
            transform="rotate(-25 400 465)"
            className="text-[10px] font-serif font-black italic fill-[#1e4e6b]"
          >
            {isKaa ? 'Ámiwdárya' : 'Амударья'}
          </text>

          {/* Syr Darya */}
          <path
            d="M 870 440 Q 800 425 730 420 T 630 370 T 520 280 T 390 220 T 300 210"
            fill="none"
            stroke="url(#riverGradReal)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <text
            x="540"
            y="280"
            transform="rotate(-22 540 280)"
            className="text-[10px] font-serif font-black italic fill-[#1e4e6b]"
          >
            {isKaa ? 'Sırdárya' : 'Сырдарья'}
          </text>

          {/* Ural River (North-West) */}
          <path
            d="M 80 80 Q 85 130 90 170"
            fill="none"
            stroke="url(#riverGradReal)"
            strokeWidth="2"
          />
          <text x="75" y="120" transform="rotate(-75 75 120)" className="text-[9px] font-serif italic fill-[#1e4e6b]">
            Урал
          </text>
        </g>
      )}

      {/* ================= REPUBLIC TERRITORIES ================= */}
      <g id="territories">
        {territories.map((t) => {
          const isSelected = selectedTerritory?.id === t.id
          const isActiveStepTerritory = isPlaying && activeStep?.territoryId === t.id
          const hasActiveTerritoryInStep = isPlaying && Boolean(activeStep?.territoryId)

          let fillOpacity = t.fillOpacity
          let strokeWidth = 2
          let strokeColor = t.strokeColor

          if (isActiveStepTerritory) {
            fillOpacity = 0.95
            strokeWidth = 4.5
            strokeColor = '#f59e0b'
          } else if (isSelected) {
            fillOpacity = 0.92
            strokeWidth = 3.8
            strokeColor = '#d97706'
          } else if (hasActiveTerritoryInStep) {
            // Dim other territories when focusing on the newly formed republic
            fillOpacity = 0.28
            strokeWidth = 1.2
            strokeColor = t.strokeColor
          }

          return (
            <g key={t.id} className="cursor-pointer group" onClick={() => onSelectTerritory(t)}>
              <path
                d={t.path}
                fill={t.color}
                fillOpacity={fillOpacity}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className={`transition-all duration-500 ease-in-out hover:fill-opacity-95 ${
                  isSelected || isActiveStepTerritory ? 'drop-shadow-lg' : ''
                }`}
              />

              {/* Pulsing highlight when territory is selected or active during Auto-Play */}
              {(isActiveStepTerritory || (isSelected && isPlaying)) && (
                <path
                  d={t.path}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  className="animate-pulse pointer-events-none"
                />
              )}

              {/* Territory Name on Map matching the picture */}
              <text
                x={t.labelX}
                y={t.labelY}
                textAnchor="middle"
                className={`font-serif font-black text-[12px] sm:text-[14px] tracking-[0.25em] drop-shadow-sm pointer-events-none uppercase transition-opacity duration-300 ${
                  hasActiveTerritoryInStep && !isActiveStepTerritory
                    ? 'opacity-35 fill-stone-600 dark:fill-stone-400'
                    : 'fill-[#231f1d] dark:fill-white'
                }`}
              >
                {languageMode === 'historical'
                  ? t.nameRu
                  : isKaa
                  ? t.nameKaa.replace(/ \(.*\)/, '')
                  : t.nameUz.replace(/ \(.*\)/, '')}
              </text>
              {t.dateLabel && (
                <text
                  x={t.labelX}
                  y={t.labelY + 16}
                  textAnchor="middle"
                  className={`font-mono font-bold text-[10px] pointer-events-none transition-opacity duration-300 ${
                    hasActiveTerritoryInStep && !isActiveStepTerritory
                      ? 'opacity-30 fill-stone-600 dark:fill-stone-400'
                      : 'fill-[#4a3f35] dark:fill-stone-200'
                  }`}
                >
                  {t.dateLabel}
                </text>
              )}
            </g>
          )
        })}
      </g>

      {/* ================= PRE-1924 DOTTED BORDERS ("Границы до размежевания") ================= */}
      {showPre1924Borders && (
        <g id="pre-1924-boundaries" className="pointer-events-none">
          {/* Border between former Turkestan ASSR and Bukhara PSR */}
          <path
            d="M 400 450 Q 480 435 560 440 T 670 425 T 780 470 T 890 530"
            fill="none"
            stroke="#991b1b"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          {/* Border of Khorezm PSR */}
          <path
            d="M 245 425 Q 310 390 350 330 T 260 260"
            fill="none"
            stroke="#991b1b"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          {/* Bukhara eastern border */}
          <path
            d="M 670 425 Q 690 510 700 580"
            fill="none"
            stroke="#991b1b"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </g>
      )}

      {/* Outer border highlighting Russian Empire / Foreign boundary */}
      <path
        d="M 70 540 L 180 620 L 320 670 L 460 670 L 525 610 L 660 625 L 760 640 L 900 640 L 960 570 L 980 430 L 970 280"
        fill="none"
        stroke="#831843"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="8 4"
        className="opacity-70 pointer-events-none"
      />

      {/* ================= HISTORICAL CITIES ================= */}
      {showCities && (
        <g id="historical-cities">
          {sites.map((site) => {
            const isSelected = selectedSite?.id === site.id
            const isActiveStepSite = isPlaying && activeStep?.siteId === site.id
            const isCapital = site.statusByYear[1924]?.isCapital
            const isSubCapital = site.statusByYear[1924]?.isSubCapital

            return (
              <g
                key={site.id}
                transform={`translate(${site.x}, ${site.y})`}
                className="cursor-pointer group"
                onClick={() => onSelectSite(site)}
              >
                {/* Glowing Beacon Ripple for Active City during Auto-Play */}
                {isActiveStepSite && (
                  <g className="pointer-events-none">
                    <circle
                      r="24"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      className="animate-ping opacity-80"
                    />
                    <circle
                      r="12"
                      fill="#f59e0b"
                      fillOpacity="0.35"
                    />
                  </g>
                )}

                {/* Concentric Double Ring for Capital (Samarkand) as in antique map */}
                {isCapital && (
                  <circle
                    r="10"
                    fill="none"
                    stroke="#b45309"
                    strokeWidth="1.5"
                    className={isActiveStepSite ? 'animate-spin' : 'animate-pulse'}
                  />
                )}

                {/* City marker dot */}
                <circle
                  r={isActiveStepSite ? 7 : isCapital ? 5.5 : isSubCapital ? 5 : 4}
                  fill={isActiveStepSite ? '#f59e0b' : isCapital ? '#dc2626' : isSubCapital ? '#059669' : '#1f2937'}
                  stroke="#ffffff"
                  strokeWidth={isActiveStepSite ? 2.5 : 1.5}
                  className="transition-transform group-hover:scale-125"
                />

                {/* City Name Label */}
                <text
                  x="0"
                  y={isActiveStepSite ? -14 : -10}
                  textAnchor="middle"
                  className={`text-[11px] font-serif font-black select-none pointer-events-none drop-shadow-sm ${
                    isActiveStepSite
                      ? 'fill-amber-600 dark:fill-amber-400 font-black text-[13px] underline'
                      : isSelected
                      ? 'fill-amber-600 dark:fill-amber-400 font-bold underline'
                      : isCapital
                      ? 'fill-red-800 dark:fill-red-400 font-extrabold text-[12px]'
                      : 'fill-stone-900 dark:fill-stone-100'
                  }`}
                >
                  {isCapital ? '★ ' : ''}
                  {languageMode === 'historical'
                    ? site.nameRu
                    : isKaa
                    ? site.nameKaa
                    : site.nameUz}
                </text>
              </g>
            )
          })}
        </g>
      )}

      {/* Antique Compass & Scale */}
      <g transform="translate(920, 60)" className="opacity-80 select-none pointer-events-none">
        <circle r="24" fill="none" stroke="#78350f" strokeWidth="0.8" />
        <polygon points="0,-22 4,-3 0,0" fill="#dc2626" />
        <polygon points="0,-22 -4,-3 0,0" fill="#7f1d1d" />
        <polygon points="0,22 4,3 0,0" fill="#78350f" />
        <polygon points="0,22 -4,3 0,0" fill="#451a03" />
        <text x="0" y="-25" textAnchor="middle" className="text-[10px] font-serif font-black fill-red-600">
          С (N)
        </text>
      </g>
    </svg>
  )
}
