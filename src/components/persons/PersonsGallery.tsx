'use client'

import React, { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { User, X, ArrowRight, Award, BookOpen } from 'lucide-react'

export interface HistoricalPerson {
  id: string
  nameUz: string
  nameKaa: string
  lifespan: string
  roleUz: string
  roleKaa: string
  birthPlaceUz: string
  birthPlaceKaa: string
  badgeUz: string
  badgeKaa: string
  category: 'statesman' | 'karakalpak' | 'scholar'
  shortBioUz: string
  shortBioKaa: string
  role1924Uz: string
  role1924Kaa: string
  articleSlug?: string
  avatarColor: string
}

export const HISTORICAL_PERSONS: HistoricalPerson[] = [
  {
    id: 'fayzulla-xojayev',
    nameUz: 'Fayzulla Xoʻjayev',
    nameKaa: 'Fayzulla Xojayev',
    lifespan: '1896 — 1938',
    roleUz: 'Oʻzbekiston SSR Xalq Komissarlari Soveti Raisi',
    roleKaa: 'Ózbekstan SSR Xalıq Komissarları Soveti Baslıǵı',
    birthPlaceUz: 'Buxoro',
    birthPlaceKaa: 'Buxara',
    badgeUz: 'Hukumat rahbari',
    badgeKaa: 'Húkimet basshısı',
    category: 'statesman',
    shortBioUz: 'Atoqli davlat va siyosat arbobi, jadid yetakchisi. 1920–1924-yillarda Buxoro Xalq Sovet Respublikasi hukumati rahbari boʻlgan.',
    shortBioKaa: 'Belgili mámleketlik ǵayratker, jadid jetekshisi. 1920–1924-jıllarda Buxara XSR húkimetin basqarǵan.',
    role1924Uz: '1924-yil oktyabrda yangi tashkil etilgan Oʻzbekiston SSR Inqilobiy Qoʻmitasi (Revkom) raisi etib tayinlangan. 1925-yilda Samarqandda Oʻzbekiston hukumati rahbari sifatida davlatchilik deklaratsiyasini eʼlon qilgan.',
    role1924Kaa: '1924-jıl oktyabrde jańa dúzilgen Ózbekstan SSR Revolyutsiyalıq Komiteti (Revkom) baslıǵı etip saylanǵan. Samarqandta mámleketshilikti basqarǵan.',
    articleSlug: 'ozbekiston-ssr-tashkil-topishi-1924',
    avatarColor: 'from-amber-600 to-amber-800',
  },
  {
    id: 'allayar-dostnazarov',
    nameUz: 'Allayar Doʻstnazarov',
    nameKaa: 'Allayar Dosnazarov',
    lifespan: '1896 — 1937',
    roleUz: 'Qoraqalpogʻiston Muxtoriyati asoschisi & "Qoshchi" yetakchisi',
    roleKaa: 'Qaraqalpaqstan Avtonomiyası tiykarın salıwshı & "Qoshshı" basshısı',
    birthPlaceUz: 'Chimboy',
    birthPlaceKaa: 'Shımbay',
    badgeUz: 'Qoraqalpogʻiston fidoyisi',
    badgeKaa: 'Qaraqalpaqstan pidákeri',
    category: 'karakalpak',
    shortBioUz: 'Qoraqalpoq milliy ozodlik va maʼrifat harakatining zabardast namoyandasi. Qoraqalpoq xalqining milliy birlashuvi uchun jon kuydirgan arbob.',
    shortBioKaa: 'Qaraqalpaq milliy azatlıq hám aǵartıwshılıq háreketiniń iri wákili. Qaraqalpaq xalqınıń aymaqlıq birligin támiyinlewge úlken úles qosqan.',
    role1924Uz: '1924-yilda boʻlingan qoraqalpoq yerlarini birlashtirib, Qoraqalpogʻiston Muxtor Viloyatini tuzish tashabbusini koʻtargan va 1925-yil fevralda Toʻrtkoʻldagi I syezdda muxtoriyatni rasmiylashtirgan.',
    role1924Kaa: '1924-jılda bólingen qaraqalpaq aymaqların birlestirip, Qaraqalpaqstan Avtonomiyalı Wálayatın dúziw baslamasın alǵa súrgen hám Tórtkúldegi I siezddi ótkergen.',
    articleSlug: 'qoraqalpogiston-muxtor-viloyatining-tashkil-topishi',
    avatarColor: 'from-teal-600 to-emerald-800',
  },
  {
    id: 'abu-qudabayev',
    nameUz: 'Abu Qudabayev',
    nameKaa: 'Ábiw Qudabaev',
    lifespan: '1899 — 1938',
    roleUz: 'Qoraqalpogʻiston Muxtor Viloyati Ijroiya Qoʻmitasi Raisi',
    roleKaa: 'Qaraqalpaqstan Avtonomiyalı Wálayatı Atqarıw Komiteti Baslıǵı',
    birthPlaceUz: 'Toʻrtkoʻl',
    birthPlaceKaa: 'Tórtkúl',
    badgeUz: 'Qoraqalpogʻiston rahbari',
    badgeKaa: 'Qaraqalpaqstan basshısı',
    category: 'karakalpak',
    shortBioUz: 'Qoraqalpoq davlat va jamoat arbobi, maʼrifatparvar. Yangi maktablar ochish, yoshlarni oʻqitish va madaniy muassasalarni barpo etishda ulkan xizmat qilgan.',
    shortBioKaa: 'Qaraqalpaq mámleketlik ǵayratkeri, aǵartıwshı. Jańa mektepler ashtırıw hám kadrlar tayarlawda zárúr xızmet kórsetken.',
    role1924Uz: '1924–1925-yillardagi chegaralanish jarayonlarida Qoraqalpogʻiston Muxtor Viloyatining birinchi rahbari sifatida Toʻrtkoʻl shahrida poytaxt apparatini yoʻlga qoʻygan.',
    role1924Kaa: '1924–1925-jıllarda QAW birinshi basshısı sıpatında Tórtkúl qalasında mámleketlik apparattı jolǵa qoyǵan.',
    articleSlug: 'qoraqalpogiston-muxtor-viloyatining-tashkil-topishi',
    avatarColor: 'from-blue-600 to-indigo-800',
  },
  {
    id: 'turor-risqulov',
    nameUz: 'Turor Risqulov',
    nameKaa: 'Turor Rısqulov',
    lifespan: '1894 — 1938',
    roleUz: 'Turkiston ASSR MIQ Raisi & Chegaralanish komissiyasi aʼzosi',
    roleKaa: 'Túrkstan ASSR OAK Baslıǵı & Shegaralanıw aǵzası',
    birthPlaceUz: 'Yettisuv',
    birthPlaceKaa: 'Jettisuw',
    badgeUz: 'Mintaqa yetakchisi',
    badgeKaa: 'Aymaq jetekshisi',
    category: 'statesman',
    shortBioUz: 'Markaziy Osiyoda taniqli siyosiy yetakchi, mintaqa xalqlarining milliy mustaqilligi va iqtisodiy rivojlanishi tarafdori.',
    shortBioKaa: 'Orta Aziyada belgili siyasatshı, aymaq xalıqlarınıń teń huqıqlılıǵı tárepdarı.',
    role1924Uz: '1924-yilgi chegaralanish loyihalarini muhokama qilishda barcha qardosh xalqlarning manfaatlarini teng hisobga olishni yoqlab chiqqan.',
    role1924Kaa: '1924-jılda shegaralanıw jobaların dodalawda qardosh xalıqlardıń máplerin esapqa alıwdı talap etken.',
    articleSlug: 'orta-osiyoda-milliy-hududiy-chegaralanish-sabablari',
    avatarColor: 'from-amber-700 to-stone-900',
  },
  {
    id: 'yoldosh-oxunboboyev',
    nameUz: 'Yoʻldosh Oxunboboyev',
    nameKaa: 'Yoldosh Oxunbobayev',
    lifespan: '1885 — 1943',
    roleUz: 'Oʻzbekiston SSR Markaziy Ijroiya Qoʻmitasi Raisi ("Oqsoqol")',
    roleKaa: 'Ózbekstan SSR Oraylıq Atqarıw Komiteti Baslıǵı ("Aqsaqal")',
    birthPlaceUz: 'Margʻilon',
    birthPlaceKaa: 'Margʻilon',
    badgeUz: 'Davlat arbobi',
    badgeKaa: 'Mámleket ǵayratkeri',
    category: 'statesman',
    shortBioUz: 'Mehnatkash xalq vakili, Oʻzbekiston SSRning uzoq yillik oliy davlat rahbari boʻlib, xalq orasida "Yurt oqsoqoli" nomi bilan eʼzozlangan.',
    shortBioKaa: 'Miynetkesh xalıq wákili, Ózbekstan SSRnıń kóp jıllıq joqarı mámleket basshısı.',
    role1924Uz: '1925-yil fevral oyida Buxoroda boʻlib oʻtgan I Taʼsis qurultoyida Oʻzbekiston SSR MIQ raisi etib saylangan va qonun chiqaruvchi organ boshida turgan.',
    role1924Kaa: '1925-jıl fevralda Buxarada bolıp ótken I Shólkemlestiriw qurultayında Ózbekstan SSR OAK baslıǵı etip saylanǵan.',
    articleSlug: 'ozbekiston-ssr-tashkil-topishi-1924',
    avatarColor: 'from-emerald-700 to-teal-900',
  },
  {
    id: 'qosim-avezov',
    nameUz: 'Qosim Avezov',
    nameKaa: 'Qosım Áwezov',
    lifespan: '1897 — 1938',
    roleUz: 'Qoraqalpogʻiston xalq komissari & jamoat arbobi',
    roleKaa: 'Qaraqalpaqstan xalıq komissarı & jámiyetlik ǵayratker',
    birthPlaceUz: 'Chimboy',
    birthPlaceKaa: 'Shımbay',
    badgeUz: 'Qoraqalpogʻiston fidoyisi',
    badgeKaa: 'Qaraqalpaqstan pidákeri',
    category: 'karakalpak',
    shortBioUz: 'Qoraqalpogʻistonning maʼmuriy va iqtisodiy tuzilmasini yaratishda faol ishtirok etgan vatanparvar arbob.',
    shortBioKaa: 'Qaraqalpaqstannıń maʼmuriy hám ekonomikalıq negizin qurıwda qatnasqan watansúyiwshi ǵayratker.',
    role1924Uz: 'Amudaryo va Xorazm qoraqalpoq tumanlarining Toʻrtkoʻl atrofida birlashishida muhim tashkiliy ishlarni bajargan.',
    role1924Kaa: 'Ámiwdárya hám Xorezm qaraqalpaq rayonlarınıń birlesiwinde zárúr shólkemlestiriw jumısların basqarǵan.',
    articleSlug: 'qoraqalpogiston-muxtor-viloyatining-tashkil-topishi',
    avatarColor: 'from-cyan-700 to-blue-900',
  },
  {
    id: 'munavvarqori',
    nameUz: 'Munavvarqori Abdurashidxonov',
    nameKaa: 'Munawwarqarı Abdurashidxanov',
    lifespan: '1878 — 1931',
    roleUz: 'Jadid maʼrifatparvari, matbuot va taʼlim yetakchisi',
    roleKaa: 'Jadid aǵartıwshısı, baspasóz hám bilimlendiriw jetekshisi',
    birthPlaceUz: 'Toshkent',
    birthPlaceKaa: 'Tashkent',
    badgeUz: 'Maʼrifatparvar jadid',
    badgeKaa: 'Aǵartıwshı jadid',
    category: 'scholar',
    shortBioUz: 'Turkistonda yangi usul maktablari, milliy teatr, matbuot va milliy birlik gʻoyasining eng buyuk nazariyotchisi va amaliyotchisi.',
    shortBioKaa: 'Túrkstanda jańa usıl mektepleri, teatr hám baspasózdiń tiykarın salıwshı milliy jetekshi.',
    role1924Uz: 'Milliy-hududiy chegaralanish orqali oʻzbek xalqining maʼnaviy va madaniy uygʻonishi, taʼlim tizimining milliy tilda yoʻlga qoʻyilishiga zamin yaratgan.',
    role1924Kaa: 'Milliy shegaralanıw arqalı xalıqtıń mádeniy oyanıwı hám ana tilindegi bilimlendiriwge tiykar salǵan.',
    articleSlug: 'chegaralanishning-iqtisodiy-va-madaniy-ahamiyati',
    avatarColor: 'from-amber-800 to-yellow-950',
  },
  {
    id: 'abdulla-qodiriy',
    nameUz: 'Abdulla Qodiriy (Julqunboy)',
    nameKaa: 'Abdulla Qodiriy (Julqunboy)',
    lifespan: '1894 — 1938',
    roleUz: 'Oʻzbek milliy romanchiligining asoschisi & "Mushtum" tashkilotchisi',
    roleKaa: 'Ózbek milliy romanınıń tiykarın salıwshı',
    birthPlaceUz: 'Toshkent',
    birthPlaceKaa: 'Tashkent',
    badgeUz: 'Adabiyot fidoiysi',
    badgeKaa: 'Ádebiyat pidákeri',
    category: 'scholar',
    shortBioUz: '"Oʻtkan kunlar" va "Mehrobdan chayon" asarlari muallifi, milliy oʻzlik va haqiqat kuychisi.',
    shortBioKaa: '"Ótken kúnler" romanınıń avtorı, milliy ózlikti sáwlelendirgen ullı jazıwshı.',
    role1924Uz: '1924-yilda "Mushtum" jurnali va milliy matbuot orqali xalqning madaniy konsolidatsiyasida va yangi davlat tuzilmasining shakllanishida faol qalam tebratgan.',
    role1924Kaa: '1924-jılda milliy baspasóz arqalı xalıqtıń mádeniy birlesiwinde belsendi qálem tebretken.',
    articleSlug: 'chegaralanishning-iqtisodiy-va-madaniy-ahamiyati',
    avatarColor: 'from-purple-800 to-indigo-950',
  },
]

export function PersonsGallery({ locale = 'uz' }: { locale: string }) {
  const [selectedPerson, setSelectedPerson] = useState<HistoricalPerson | null>(null)
  const [filter, setFilter] = useState<'all' | 'statesman' | 'karakalpak' | 'scholar'>('all')

  const isKaa = locale === 'kaa'

  const filteredPersons = HISTORICAL_PERSONS.filter((p) => {
    if (filter === 'all') return true
    return p.category === filter
  })

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-amber-500 text-black shadow-xs font-bold'
              : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]'
          }`}
        >
          {isKaa ? 'Barlıq tulǵalar' : 'Barcha shaxslar'}
        </button>
        <button
          type="button"
          onClick={() => setFilter('statesman')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === 'statesman'
              ? 'bg-amber-500 text-black shadow-xs font-bold'
              : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]'
          }`}
        >
          {isKaa ? 'Mámleket basshıları' : 'Davlat rahbarlari'}
        </button>
        <button
          type="button"
          onClick={() => setFilter('karakalpak')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === 'karakalpak'
              ? 'bg-amber-500 text-black shadow-xs font-bold'
              : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]'
          }`}
        >
          {isKaa ? 'Qaraqalpaqstan pidákerleri' : 'Qoraqalpogʻiston fidoyilari'}
        </button>
        <button
          type="button"
          onClick={() => setFilter('scholar')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === 'scholar'
              ? 'bg-amber-500 text-black shadow-xs font-bold'
              : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]'
          }`}
        >
          {isKaa ? 'Jadidler hám jazıwshılar' : 'Jadidlar va yozuvchilar'}
        </button>
      </div>

      {/* Grid of Persons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPersons.map((person) => {
          return (
            <div
              key={person.id}
              onClick={() => setSelectedPerson(person)}
              className="group flex flex-col bg-[var(--card)] rounded-2xl border border-[var(--border)] hover:border-amber-400 hover:shadow-xl transition-all overflow-hidden cursor-pointer p-4 text-center items-center space-y-4"
            >
              {/* Arched Portrait Frame */}
              <div className="relative w-36 h-44 rounded-t-[72px] rounded-b-xl overflow-hidden border-2 border-amber-500/40 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-stone-900 dark:to-stone-800 p-2 shadow-inner group-hover:scale-105 group-hover:border-amber-500 transition-all duration-300">
                <div
                  className={`w-full h-full rounded-t-[64px] rounded-b-lg bg-gradient-to-b ${person.avatarColor} flex flex-col items-center justify-center text-white relative shadow-sm`}
                >
                  <User className="w-16 h-16 opacity-80" />
                  <span className="font-mono text-[10px] tracking-widest uppercase opacity-75 mt-1">
                    {person.lifespan.split('—')[0].trim()}
                  </span>
                </div>
              </div>

              {/* Name & Role */}
              <div className="space-y-1.5 w-full">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {isKaa ? person.badgeKaa : person.badgeUz}
                </span>

                <h3 className="font-serif font-bold text-lg text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                  {isKaa ? person.nameKaa : person.nameUz}
                </h3>

                <p className="font-mono text-xs text-[var(--muted-foreground)]">
                  {person.lifespan}
                </p>

                <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed pt-1">
                  {isKaa ? person.roleKaa : person.roleUz}
                </p>
              </div>

              {/* Quick Trigger */}
              <span className="text-xs font-semibold text-amber-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
                <span>{isKaa ? 'Tolıq maǵlıwmat' : 'Batafsil maʼlumot'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          )
        })}
      </div>

      {/* Modal / Drawer for Person Details */}
      {selectedPerson && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="w-full max-w-2xl bg-[var(--card)] rounded-3xl border border-amber-500/50 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-b ${selectedPerson.avatarColor} text-white flex items-center justify-center shrink-0 shadow-md`}
                >
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                    {isKaa ? selectedPerson.badgeKaa : selectedPerson.badgeUz}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--foreground)]">
                    {isKaa ? selectedPerson.nameKaa : selectedPerson.nameUz}
                  </h2>
                  <p className="font-mono text-xs text-[var(--muted-foreground)]">
                    {selectedPerson.lifespan} · {isKaa ? selectedPerson.birthPlaceKaa : selectedPerson.birthPlaceUz}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPerson(null)}
                className="p-2 rounded-full hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role & Bio */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                {isKaa ? selectedPerson.roleKaa : selectedPerson.roleUz}
              </h4>
              <p className="text-sm text-[var(--foreground)] leading-relaxed">
                {isKaa ? selectedPerson.shortBioKaa : selectedPerson.shortBioUz}
              </p>
            </div>

            {/* 1924 Historical Contribution */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
                <Award className="w-4 h-4" />
                <span>
                  {isKaa
                    ? '1924-jılǵı shegaralanıwdaǵı ornı hám xızmeti'
                    : '1924-yilgi chegaralanishdagi oʻrni va xizmati'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">
                {isKaa ? selectedPerson.role1924Kaa : selectedPerson.role1924Uz}
              </p>
            </div>

            {/* Read Article Action */}
            {selectedPerson.articleSlug && (
              <div className="pt-2 flex justify-end">
                <Link
                  href={`/maqolalar/${selectedPerson.articleSlug}`}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-semibold hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2 shadow-md"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {isKaa ? 'Temaǵa baylanıslı maqalanı oqıw' : 'Mavzuga oid maqolani oʻqish'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
