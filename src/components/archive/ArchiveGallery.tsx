'use client'

import React, { useState } from 'react'
import { FileText, Map, Image as ImageIcon, X, ZoomIn } from 'lucide-react'
import { SmartImage } from '@/components/SmartImage'

export interface ArchiveDocument {
  id: string
  titleUz: string
  titleKaa: string
  kind: 'document' | 'map' | 'photo'
  year: string
  sourceUz: string
  sourceKaa: string
  descriptionUz: string
  descriptionKaa: string
  imageUrl: string
  license: string
}

export const ARCHIVE_DOCUMENTS: ArchiveDocument[] = [
  {
    id: 'qaror-1924-oktyabr',
    titleUz: '1924-yil 27-oktyabrdagi SSSR MIQ Tarixiy Qarori matni',
    titleKaa: '1924-jıl 27-oktyabrdegi SSSR OAK Tariyxıy Qararı teksti',
    kind: 'document',
    year: '1924',
    sourceUz: 'Oʻzbekiston Respublikasi Milliy Davlat Arxivi (OʻzR MDA)',
    sourceKaa: 'Ózbekstan Respublikası Milliy Mámleketlik Arxivi',
    descriptionUz: '"Oʻrta Osiyo sovet respublikalarida milliy-davlat chegaralanishi toʻgʻrisida"gi qarorning rasmiy bayonnomasi.',
    descriptionKaa: '"Orta Aziya sovet respublikalarında milliy-mámleketlik shegaralanıw haqqında"ǵı rásmiy qarar teksti.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
    license: 'Jamoat mulki (Public Domain)',
  },
  {
    id: 'chegaralanish-xaritasi-1924',
    titleUz: '1924-yilgi Milliy-hududiy chegaralanish rasmiy xaritasi',
    titleKaa: '1924-jılǵı Milliy-aymaqlıq shegaralanıw rásmiy kartası',
    kind: 'map',
    year: '1924',
    sourceUz: 'Markaziy Osiyo tarixiy kartografiya fondi',
    sourceKaa: 'Orta Aziya tariyxıy kartografiya fondı',
    descriptionUz: 'Oʻzbekiston SSR va Qoraqalpogʻiston Muxtor Viloyatining ilk chegaralari belgilangan arxiv xaritasi.',
    descriptionKaa: 'Ózbekstan SSR hám Qaraqalpaqstan Avtonomiyalı Wálayatınıń dáslepki shegaraları kórsetilgen arxiv kartası.',
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop',
    license: 'Jamoat mulki (Public Domain)',
  },
  {
    id: 'tortkol-syezdi-1925',
    titleUz: 'Toʻrtkoʻl — Qoraqalpogʻiston sovetlarining I Taʼsis syezdi delegatlari',
    titleKaa: 'Tórtkúl — Qaraqalpaqstan sovetleriniń I Shólkemlestiriw siezdi delegatları',
    kind: 'photo',
    year: '1925',
    sourceUz: 'Qoraqalpogʻiston Davlat Arxivi fotofondi',
    sourceKaa: 'Qaraqalpaqstan Mámleketlik Arxivi fotofondı',
    descriptionUz: 'Allayar Doʻstnazarov va Abu Qudabayev boshchiligidagi qoraqalpoq muxtoriyati taʼsischilari, Toʻrtkoʻl shahri.',
    descriptionKaa: 'Allayar Dosnazarov hám Ábiw Qudabaev basshılıǵındaǵı delegatlar, Tórtkúl qalası.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
    license: 'Tarixiy arxiv hujjati',
  },
  {
    id: 'samarqand-poytaxt-1925',
    titleUz: 'Samarqand — Oʻzbekiston SSR poytaxti (1925–1930)',
    titleKaa: 'Samarqand — Ózbekstan SSR paytaxtı (1925–1930)',
    kind: 'photo',
    year: '1925',
    sourceUz: 'OʻzR MDA fotofondi',
    sourceKaa: 'ÓzR MMA fotofondı',
    descriptionUz: 'Samarqand shahri Registon maydoni va Oʻzbekiston hukumati qarorgohi joylashgan davrdagi koʻrinishi.',
    descriptionKaa: 'Samarqand qalası Registon maydanı hám húkimet ornalasqan dáwir kórinisi.',
    imageUrl: 'https://images.unsplash.com/photo-1599818815525-4c07c6f017ad?q=80&w=1200&auto=format&fit=crop',
    license: 'Jamoat mulki (Public Domain)',
  },
  {
    id: 'fayzulla-revkom-1924',
    titleUz: 'Fayzulla Xoʻjayev va Oʻzbekiston Revkomi aʼzolari',
    titleKaa: 'Fayzulla Xojayev hám Ózbekstan Revkom aǵzaları',
    kind: 'photo',
    year: '1924',
    sourceUz: 'Oʻzbekiston Tarixi Davlat Muzeyi kolleksiyasi',
    sourceKaa: 'Ózbekstan Tariyxı Mámleketlik Muzeyi',
    descriptionUz: 'Yangi davlat tuzilmasining dastlabki ijroiya organi aʼzolari, 1924-yil dekabr.',
    descriptionKaa: 'Jańa mámleketlik dúzilis aǵzalarınıń tariyxıy fotosúwreti, 1924-jıl dekabr.',
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200&auto=format&fit=crop',
    license: 'Tarixiy arxiv hujjati',
  },
  {
    id: 'deklaratsiya-1925-buxoro',
    titleUz: 'Oʻzbekiston SSR tuzilishi toʻgʻrisidagi Deklaratsiya hujjati',
    titleKaa: 'Ózbekstan SSR dúziliwi haqqındaǵı Deklaratsiya teksti',
    kind: 'document',
    year: '1925',
    sourceUz: 'OʻzR MDA qonunchilik fondi',
    sourceKaa: 'ÓzR MMA nızamshılıq fondı',
    descriptionUz: 'Buxoro shahrida Oʻzbekiston Sovetlarining I Taʼsis qurultoyida qabul qilingan davlatchilik hujjati.',
    descriptionKaa: 'Buxara qalasında qabıl etilgen mámleketshilik hám huqıqıy hújjet.',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop',
    license: 'Jamoat mulki (Public Domain)',
  },
  {
    id: 'turkiston-xaritasi-1923',
    titleUz: 'Turkiston, Buxoro va Xorazmning chegaralanishgacha boʻlgan xaritasi',
    titleKaa: 'Túrkstan, Buxara hám Xorezmniń shegaralanıwǵa shekemgi kartası',
    kind: 'map',
    year: '1923',
    sourceUz: 'Rossiya Davlat Harbiy-Tarixiy Arxivi',
    sourceKaa: 'Rossiya Mámleketlik Áskeriy-Tariyxıy Arxivi',
    descriptionUz: '1924-yilgacha boʻlgan uchta respublikaning maʼmuriy boʻlinishi va etnik tarkibi xaritasi.',
    descriptionKaa: '1924-jılǵa shekemgi úsh respublikanıń maʼmuriy hám etnikalıq bóliniwi.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    license: 'Jamoat mulki (Public Domain)',
  },
  {
    id: 'toshkent-miq-1924',
    titleUz: 'Toshkent — Turkiston ASSR MIQ binosi (Chegaralanish sessiyasi oʻtgan bino)',
    titleKaa: 'Tashkent — Túrkstan ASSR OAK imaratı',
    kind: 'photo',
    year: '1924',
    sourceUz: 'Toshkent shahar arxivi fotofondi',
    sourceKaa: 'Tashkent qala arxivi fotofondı',
    descriptionUz: '1924-yil 16-sentyabrda chegaralanish toʻgʻrisidagi muhim qaror qabul qilingan tarixiy bino.',
    descriptionKaa: '1924-jıl 16-sentyabrde shegaralanıw haqqındaǵı qarar qabıl etilgen tariyxıy imarat.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    license: 'Tarixiy arxiv hujjati',
  },
]

export function ArchiveGallery({ locale = 'uz' }: { locale: string }) {
  const [selectedDoc, setSelectedDoc] = useState<ArchiveDocument | null>(null)
  const [filter, setFilter] = useState<'all' | 'document' | 'map' | 'photo'>('all')

  const isKaa = locale === 'kaa'

  const filteredDocs = ARCHIVE_DOCUMENTS.filter((doc) => {
    if (filter === 'all') return true
    return doc.kind === filter
  })

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
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
          {isKaa ? 'Barlıq hújjetler' : 'Barcha hujjatlar'}
        </button>
        <button
          type="button"
          onClick={() => setFilter('photo')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'photo'
              ? 'bg-amber-500 text-black shadow-xs font-bold'
              : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{isKaa ? 'Tariyxıy Fotosúwretler' : 'Tarixiy Fotosuratlar'}</span>
        </button>
        <button
          type="button"
          onClick={() => setFilter('map')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'map'
              ? 'bg-amber-500 text-black shadow-xs font-bold'
              : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>{isKaa ? 'Kartalar' : 'Xaritalar'}</span>
        </button>
        <button
          type="button"
          onClick={() => setFilter('document')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'document'
              ? 'bg-amber-500 text-black shadow-xs font-bold'
              : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isKaa ? 'Qarar hám Hújjetler' : 'Qaror va Hujjatlar'}</span>
        </button>
      </div>

      {/* Masonry / Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => {
          return (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="flex flex-col bg-[var(--card)] rounded-2xl border border-[var(--border)] hover:border-amber-400 hover:shadow-xl transition-all overflow-hidden cursor-pointer group"
            >
              <div className="relative h-56 w-full overflow-hidden bg-[var(--secondary)]">
                <SmartImage
                  src={doc.imageUrl}
                  alt={isKaa ? doc.titleKaa : doc.titleUz}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Badge on Image */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-black/60 backdrop-blur-md text-amber-400 border border-white/20">
                    {doc.year}
                  </span>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="p-1.5 rounded-full bg-amber-500 text-black shadow-md block">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                    {doc.kind === 'photo'
                      ? isKaa
                        ? 'Fotosúwret'
                        : 'Fotosurat'
                      : doc.kind === 'map'
                      ? isKaa
                        ? 'Karta'
                        : 'Xarita'
                      : isKaa
                      ? 'Arxiv hújjeti'
                      : 'Arxiv hujjati'}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[var(--foreground)] group-hover:text-amber-500 transition-colors line-clamp-2">
                    {isKaa ? doc.titleKaa : doc.titleUz}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                    {isKaa ? doc.descriptionKaa : doc.descriptionUz}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] text-[11px] text-[var(--muted-foreground)] truncate font-mono">
                  {isKaa ? doc.sourceKaa : doc.sourceUz}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="w-full max-w-4xl bg-[var(--card)] rounded-3xl border border-amber-500/50 shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-[1.4fr_1fr] max-h-[90vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Preview Box */}
            <div className="relative min-h-[320px] md:min-h-full bg-black flex items-center justify-center p-4">
              <SmartImage
                src={selectedDoc.imageUrl}
                alt={isKaa ? selectedDoc.titleKaa : selectedDoc.titleUz}
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            {/* Document Details */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    {selectedDoc.year} ·{' '}
                    {selectedDoc.kind === 'photo'
                      ? (isKaa ? 'Fotosúwret' : 'Fotosurat')
                      : selectedDoc.kind === 'map'
                      ? (isKaa ? 'Karta' : 'Xarita')
                      : (isKaa ? 'Hújjet' : 'Hujjat')}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedDoc(null)}
                    className="p-1.5 rounded-full hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--foreground)] leading-snug">
                  {isKaa ? selectedDoc.titleKaa : selectedDoc.titleUz}
                </h2>

                <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">
                  {isKaa ? selectedDoc.descriptionKaa : selectedDoc.descriptionUz}
                </p>

                <div className="p-3.5 rounded-xl bg-[var(--secondary)]/60 border border-[var(--border)] space-y-1.5 text-xs">
                  <div className="font-semibold text-amber-600 dark:text-amber-400">
                    {isKaa ? 'Arxiv deregi:' : 'Arxiv manbasi:'}
                  </div>
                  <div className="text-[var(--muted-foreground)] font-mono">
                    {isKaa ? selectedDoc.sourceKaa : selectedDoc.sourceUz}
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)]/80 pt-1">
                    {isKaa ? 'Licenziya:' : 'Litsenziya:'} {selectedDoc.license}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="px-5 py-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {isKaa ? 'Jabıw' : 'Yopish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
