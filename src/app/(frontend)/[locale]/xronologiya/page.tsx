import React from 'react'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Clock, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react'

export const revalidate = 3600

interface TimelineEvent {
  id: string
  dateLabelUz: string
  dateLabelKaa: string
  titleUz: string
  titleKaa: string
  badgeUz: string
  badgeKaa: string
  locationUz: string
  locationKaa: string
  descriptionUz: string
  descriptionKaa: string
  significanceUz: string
  significanceKaa: string
  articleSlug?: string
  isCrucial?: boolean
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: '1917-1923',
    dateLabelUz: '1917 — 1923-yillar',
    dateLabelKaa: '1917 — 1923-jıllar',
    titleUz: 'Tarixiy zamin: Turkiston, Buxoro va Xorazm respublikalari',
    titleKaa: 'Tariyxıy negiz: Túrkstan, Buxara hám Xorezm respublikaları',
    badgeUz: 'Zamin davri',
    badgeKaa: 'Negiz dáwiri',
    locationUz: 'Toshkent, Buxoro, Xiva',
    locationKaa: 'Tashkent, Buxara, Xiywa',
    descriptionUz: 'Mintaqadagi xalqlar uch xil maʼmuriy tuzilmaga boʻlinib yashar edi. Jadid maʼrifatparvarlari va milliy ziyolilar oʻzbek va qoraqalpoq xalqlarining yagona milliy davlatchiligini tiklash gʻoyasini ilgari surdilar.',
    descriptionKaa: 'Aymaqtaǵı xalıqlar úsh túrli mámleketlik dúziliske bólingen edi. Jadid aǵartıwshıları hám milliy basshılar ózbek hám qaraqalpaq xalıqlarınıń milliy mámleketshiligin tiklew ideyasın kóterip shıqtı.',
    significanceUz: 'Yagona milliy chegaralarga ega boʻlish zaruriyatining anglab yetilishi.',
    significanceKaa: 'Birden-bir milliy shegaralarǵa iye bolıw zárúrliginiń túsiniwi.',
    articleSlug: 'orta-osiyoda-milliy-hududiy-chegaralanish-sabablari',
  },
  {
    id: '1924-jan',
    dateLabelUz: '1924-yil yanvar — fevral',
    dateLabelKaa: '1924-jıl yanvar — fevral',
    titleUz: 'Milliy chegaralanish boʻyicha tayyorgarlik komissiyalari tuzildi',
    titleKaa: 'Milliy shegaralanıw boyınsha tayarlıq komissiyaları dúzildi',
    badgeUz: 'Tayyorgarlik',
    badgeKaa: 'Tayarlıq',
    locationUz: 'Toshkent, Samarqand',
    locationKaa: 'Tashkent, Samarqand',
    descriptionUz: 'Har bir millat (oʻzbek, qoraqalpoq, tojik, turkman, qozoq, qirgʻiz) vakillaridan iborat maxsus hududiy komissiyalar tashkil etilib, aholi soni, iqtisodiy aloqalar va yer-suv tarmoqlari oʻrganila boshlandi.',
    descriptionKaa: 'Hár bir millat wákillerinen ibarat arnawlı aymaqlıq komissiyalar dúzildi, xalıq sanı, ekonomikalıq baylanıslar hám jer-suw sistemaları úyrenildi.',
    significanceUz: 'Etnik va madaniy xaritalarning dastlabki ilmiy loyihalari tuzildi.',
    significanceKaa: 'Etnikalıq hám mádeniy kartalardıń dáslepki ilimiy jobaları dúzildi.',
    articleSlug: 'orta-osiyoda-milliy-hududiy-chegaralanish-sabablari',
  },
  {
    id: '1924-sep-16',
    dateLabelUz: '1924-yil 16-sentyabr',
    dateLabelKaa: '1924-jıl 16-sentyabr',
    titleUz: 'Turkiston ASSR MIQning chegaralanish toʻgʻrisidagi tarixiy sessiyasi',
    titleKaa: 'Túrkstan ASSR OAKnıń shegaralanıw haqqındaǵı tariyxıy sessiyası',
    badgeUz: 'Qaror qabul qilinishi',
    badgeKaa: 'Qarar qabıllanıwı',
    locationUz: 'Toshkent',
    locationKaa: 'Tashkent',
    descriptionUz: 'Turkiston ASSR Markaziy Ijroiya Qoʻmitasi mintaqa xalqlarining oʻz taqdirini oʻzi belgilash huquqiga tayanib, alohida milliy sovet respublikalari tashkil etish haqida qaror chiqardi.',
    descriptionKaa: 'Túrkstan ASSR Oraylıq Atqarıw Komiteti xalıqlardıń óz táǵdirin ózi belgilew huqıqına súyenip, bólek milliy sovet respublikaların dúziw haqqında qarar qabıl etti.',
    significanceUz: 'Mintaqadagi eng yirik maʼmuriy birlik rasman milliy asosda boʻlinishga rozilik berdi.',
    significanceKaa: 'Aymaqtaǵı eń iri maʼmuriy birlik rásmiy túrde milliy tiykarda bóliniwge razılıq berdi.',
    articleSlug: 'orta-osiyoda-milliy-hududiy-chegaralanish-sabablari',
  },
  {
    id: '1924-oct-27',
    dateLabelUz: '1924-yil 27-oktyabr ★',
    dateLabelKaa: '1924-jıl 27-oktyabr ★',
    titleUz: 'Oʻzbekiston SSR va Qoraqalpogʻiston Muxtor Viloyatining rasman tashkil topishi',
    titleKaa: 'Ózbekstan SSR hám Qaraqalpaqstan Avtonomiyalı Wálayatınıń rásmiy dúziliwi',
    badgeUz: 'Eng muhim sana',
    badgeKaa: 'Eń áhmiyetli sáne',
    locationUz: 'Moskva / Toshkent / Samarqand / Toʻrtkoʻl',
    locationKaa: 'Moskva / Tashkent / Samarqand / Tórtkúl',
    descriptionUz: 'SSSR Markaziy Ijroiya Qoʻmitasi "Oʻrta Osiyo sovet respublikalarida milliy-davlat chegaralanishi toʻgʻrisida"gi qarorni tasdiqladi. Oʻzbekiston SSR ittifoqdosh respublika maqomida, Qoraqalpogʻiston esa muxtor viloyat sifatida dunyo siyosiy xaritasida paydo boʻldi.',
    descriptionKaa: 'SSSR Oraylıq Atqarıw Komiteti "Orta Aziya sovet respublikalarında milliy-mámleketlik shegaralanıw haqqında" tariyxıy qarardı tastıyıqladı. Ózbekstan SSR awqamlas respublika dárejesinde, Qaraqalpaqstan bolsa avtonomiyalı wálayat sıpatında dúzildi.',
    significanceUz: 'Zamonaviy Oʻzbekiston va Qoraqalpogʻiston chegaralari va davlatchiligining huquqiy asosi.',
    significanceKaa: 'Házirgi Ózbekstan hám Qaraqalpaqstan shegaraları hám mámleketshiliginiń huqıqıy tiykarı.',
    articleSlug: 'ozbekiston-ssr-tashkil-topishi-1924',
    isCrucial: true,
  },
  {
    id: '1924-dec',
    dateLabelUz: '1924-yil dekabr',
    dateLabelKaa: '1924-jıl dekabr',
    titleUz: 'Oʻzbekiston Inqilobiy Qoʻmitasi (Revkom) va Fayzulla Xoʻjayev rahbarligi',
    titleKaa: 'Ózbekstan Revolyutsiyalıq Komiteti (Revkom) hám Fayzulla Xojayev basshılıǵı',
    badgeUz: 'Ijro hokimiyati',
    badgeKaa: 'Atqarıw húkimeti',
    locationUz: 'Samarqand',
    locationKaa: 'Samarqand',
    descriptionUz: 'Yangi davlat apparatini tuzish, poytaxt Samarqandda vazirliklar va idoralarni shakllantirish uchun Oʻzbekiston Inqilobiy Qoʻmitasi tuzildi. Uning raisi etib atoqli davlat arbobi Fayzulla Xoʻjayev tayinlandi.',
    descriptionKaa: 'Jańa mámleketlik apparattı dúziw, paytaxt Samarqandta ministrliklerdi shólkemlestiriw ushın Revkom dúzildi. Fayzulla Xojayev basshı etip saylandı.',
    significanceUz: 'Oʻzbekiston mustaqil ijroiya boshqaruviga va xalq komissarliklariga ega boʻldi.',
    significanceKaa: 'Ózbekstan ǵárezsiz atqarıw basqarıwına iye boldı.',
    articleSlug: 'ozbekiston-ssr-tashkil-topishi-1924',
  },
  {
    id: '1925-feb-bukhara',
    dateLabelUz: '1925-yil fevral',
    dateLabelKaa: '1925-jıl fevral',
    titleUz: 'Oʻzbekiston Sovetlarining I Taʼsis qurultoyi va Davlatchilik Deklaratsiyasi',
    titleKaa: 'Ózbekstan Sovetleriniń I Shólkemlestiriw qurultayı hám Mámleketshilik Deklaratsiyası',
    badgeUz: 'Qurultoy',
    badgeKaa: 'Qurultay',
    locationUz: 'Buxoro / Samarqand',
    locationKaa: 'Buxara / Samarqand',
    descriptionUz: 'Buxoroda boʻlib oʻtgan qurultoyda Oʻzbekiston SSR tuzilganligi toʻgʻrisidagi Deklaratsiya tantanali eʼlon qilindi. Samarqand shahri yangi respublikaning poytaxti etib rasman tasdiqlandi.',
    descriptionKaa: 'Buxarada bolıp ótken qurultayda Ózbekstan SSR dúzilgenligi haqqındaǵı Deklaratsiya daǵaza etildi. Samarqand qalası respublika paytaxtı etip tastıyıqlandı.',
    significanceUz: 'Respublika qonunchiligi va oliy vakillik organi shakllandi.',
    significanceKaa: 'Respublika nızamshılıǵı hám joqarı shólkemi qáliplesti.',
    articleSlug: 'ozbekiston-ssr-tashkil-topishi-1924',
  },
  {
    id: '1925-feb-turtkol',
    dateLabelUz: '1925-yil fevral',
    dateLabelKaa: '1925-jıl fevral',
    titleUz: 'Qoraqalpogʻiston sovetlarining I Taʼsis syezdi (Toʻrtkoʻl)',
    titleKaa: 'Qaraqalpaqstan sovetleriniń I Shólkemlestiriw siezdi (Tórtkúl)',
    badgeUz: 'Qoraqalpogʻiston muxtoriyati',
    badgeKaa: 'Qaraqalpaqstan avtonomiyası',
    locationUz: 'Toʻrtkoʻl',
    locationKaa: 'Tórtkúl',
    descriptionUz: 'Toʻrtkoʻl shahrida Qoraqalpogʻiston xalqining barcha tumanlaridan delegatlar toʻplandi. Qoraqalpogʻiston Muxtor Viloyatining tashkiliy tuzilmasi, maʼmuriy markazi va ijroiya qoʻmitasi rahbariyati tasdiqlandi.',
    descriptionKaa: 'Tórtkúl qalasında Qaraqalpaqstan xalqınıń barlıq rayonlarınan wákiller jıynaldı. QAW dúzilisi, orayı hám basshıları tastıyıqlandı.',
    significanceUz: 'Qoraqalpoq xalqining asrlar davomida boʻlinib ketgan yerlari yagona muxtor viloyatga birlashdi.',
    significanceKaa: 'Qaraqalpaq xalqınıń bólinip ketken aymaqları bir pútin avtonomiyalı wálayatqa birlesken kún.',
    articleSlug: 'qoraqalpogiston-muxtor-viloyatining-tashkil-topishi',
    isCrucial: true,
  },
  {
    id: '1930-1936',
    dateLabelUz: '1930 — 1936-yillar',
    dateLabelKaa: '1930 — 1936-jıllar',
    titleUz: 'Poytaxtning Toshkentga koʻchishi va Qoraqalpogʻistonning Oʻzbekistonga qoʻshilishi',
    titleKaa: 'Paytaxttıń Tashkentke kóshiwi hám Qaraqalpaqstannıń Ózbekstanǵa qosılıwı',
    badgeUz: 'Mustahkamlanish',
    badgeKaa: 'Bekkemlew',
    locationUz: 'Toshkent, Nukus, Samarqand',
    locationKaa: 'Tashkent, Nókis, Samarqand',
    descriptionUz: '1930-yilda Oʻzbekiston poytaxti Samarqanddan Toshkentga koʻchirildi. 1936-yil 5-dekabrdagi Konstitutsiyaga muvofiq, Qoraqalpogʻiston Oʻzbekiston SSR tarkibiga teng huquqli muxtor respublika sifatida kirdi.',
    descriptionKaa: '1930-jılda paytaxt Tashkentke kóshirildi. 1936-jıl 5-dekabrdegi Konstitutsiya boyınsha Qaraqalpaqstan Ózbekstan SSR quramına kirdi.',
    significanceUz: 'Bugungi Oʻzbekiston Respublikasi va Qoraqalpogʻiston Respublikasi yaxlit davlat hududining uzil-kesil shakllanishi.',
    significanceKaa: 'Búgingi Ózbekstan hám Qaraqalpaqstan yaxlit aymaǵınıń qáliplesiwi.',
    articleSlug: 'chegaralanishning-iqtisodiy-va-madaniy-ahamiyati',
  },
]

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const isKaa = locale === 'kaa'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {isKaa
                ? '1924-jıl waqıyalar dizbegi'
                : '1924-yil voqealar ketma-ketligi'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[var(--foreground)]">
            {isKaa ? '1924 Xronologiyası' : '1924 Xronologiyasi'}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)] max-w-2xl leading-relaxed">
            {isKaa
              ? 'Milliy-aymaqlıq shegaralanıwdıń baslanıwınan baslap Ózbekstan SSR hám Qaraqalpaqstan Avtonomiyalı Wálayatınıń dúziliwine shekemgi tiykarǵı basqıshlar.'
              : 'Milliy-hududiy chegaralanishning boshlanishidan tortib Oʻzbekiston SSR va Qoraqalpogʻiston Muxtor Viloyatining tashkil topishigacha boʻlgan taqdiriy bosqichlar.'}
          </p>
        </div>

        <Link
          href="/xarita"
          className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-semibold hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-1.5 shadow-xs"
        >
          <span>{isKaa ? 'Kartada kóriw' : 'Xaritada koʻrish'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Visual Timeline Spine */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-[11px] sm:before:left-[19px] before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-amber-500 before:via-amber-400 before:to-emerald-500">
        {TIMELINE_EVENTS.map((event) => {
          return (
            <div key={event.id} className="relative group">
              {/* Spine Node Marker */}
              <div
                className={`absolute -left-[23px] sm:-left-[31px] top-4 w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-125 ${
                  event.isCrucial
                    ? 'bg-amber-500 ring-4 ring-amber-500/30 shadow-md text-black'
                    : 'bg-[var(--card)] border-2 border-amber-500 text-amber-500'
                }`}
              >
                <div
                  className={`w-2 h-2 rotate-45 ${
                    event.isCrucial ? 'bg-black' : 'bg-amber-500'
                  }`}
                />
              </div>

              {/* Event Card */}
              <div
                className={`p-6 sm:p-7 rounded-2xl bg-[var(--card)] border transition-all hover:shadow-xl space-y-4 ${
                  event.isCrucial
                    ? 'border-amber-500 shadow-md ring-1 ring-amber-500/20'
                    : 'border-[var(--border)] hover:border-amber-400'
                }`}
              >
                {/* Meta Top Line */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                        event.isCrucial
                          ? 'bg-amber-500 text-black'
                          : 'bg-[var(--secondary)] text-amber-600 dark:text-amber-400 border border-[var(--border)]'
                      }`}
                    >
                      {isKaa ? event.dateLabelKaa : event.dateLabelUz}
                    </span>

                    <span className="text-xs font-serif font-medium text-[var(--muted-foreground)] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isKaa ? event.locationKaa : event.locationUz}</span>
                    </span>
                  </div>

                  <span className="text-[11px] font-mono tracking-wider uppercase text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {isKaa ? event.badgeKaa : event.badgeUz}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                  {isKaa ? event.titleKaa : event.titleUz}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--foreground)] leading-relaxed">
                  {isKaa ? event.descriptionKaa : event.descriptionUz}
                </p>

                {/* Historical Significance Box */}
                <div className="p-3.5 rounded-xl bg-[var(--secondary)]/50 border border-[var(--border)] flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[var(--foreground)]">
                      {isKaa ? 'Tariyxıy áhmiyeti: ' : 'Tarixiy ahamiyati: '}
                    </span>
                    <span className="text-[var(--muted-foreground)]">
                      {isKaa ? event.significanceKaa : event.significanceUz}
                    </span>
                  </div>
                </div>

                {/* Read Related Article Link */}
                {event.articleSlug && (
                  <div className="pt-2 flex justify-end">
                    <Link
                      href={`/maqolalar/${event.articleSlug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 hover:underline group-hover:translate-x-1 transition-all"
                    >
                      <span>
                        {isKaa ? 'Tolıq maqalanı oqıw' : 'Batafsil maqolani oʻqish'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
