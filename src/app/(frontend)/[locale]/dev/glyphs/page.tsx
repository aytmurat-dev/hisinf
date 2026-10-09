import { notFound } from 'next/navigation'

export default function GlyphsDevPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  const sampleText =
    'Qaraqalpaqsha: Áá Óó Úú Ǵǵ Ńń Íı Shsh Chch — Oʻzbekcha: Oʻoʻ Gʻgʻ maʼno — «Iqtibos» “Iqtibos” — 1220–1405 ← → ✓ ♥ ◷ ⌘'

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-10">
      <h1 className="text-3xl font-bold font-serif mb-6">Shriftlar va gliflar testi</h1>

      <section className="p-6 rounded-lg border border-line bg-card space-y-3">
        <h2 className="text-sm font-mono uppercase text-muted tracking-widest">
          Literata (Serif — Sarlavhalar va maqola matni)
        </h2>
        <p className="font-serif text-2xl leading-relaxed">{sampleText}</p>
        <p className="font-serif italic text-xl leading-relaxed">{sampleText}</p>
      </section>

      <section className="p-6 rounded-lg border border-line bg-card space-y-3">
        <h2 className="text-sm font-mono uppercase text-muted tracking-widest">
          IBM Plex Sans (Sans — Matn va UI)
        </h2>
        <p className="font-sans text-xl leading-relaxed font-normal">{sampleText}</p>
        <p className="font-sans text-xl leading-relaxed font-medium">{sampleText}</p>
        <p className="font-sans text-xl leading-relaxed font-semibold">{sampleText}</p>
      </section>

      <section className="p-6 rounded-lg border border-line bg-card space-y-3">
        <h2 className="text-sm font-mono uppercase text-muted tracking-widest">
          IBM Plex Mono (Mono — Yorliqlar, sanalar, kod)
        </h2>
        <p className="font-mono text-lg leading-relaxed font-normal">{sampleText}</p>
        <p className="font-mono text-lg leading-relaxed font-medium">{sampleText}</p>
      </section>
    </div>
  )
}
