'use client'

import React, { useState, useMemo } from 'react'
import { Link } from '@/i18n/navigation'
import {
  BookOpen,
  Clock,
  BarChart3,
  Users,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  Search,
  ExternalLink,
  ChevronRight,
  Quote,
  MapPin,
  Layers,
  Award,
} from 'lucide-react'
import { SmartImage } from '@/components/SmartImage'
import type { InteractiveChapter } from '@/data/interactive-history-data'

interface InteractiveHistoryExplorerProps {
  chapters: InteractiveChapter[]
  locale: string
  initialChapterIndex?: number
}

type ExplorerMode = 'reading' | 'timeline' | 'stats' | 'persons' | 'quiz'

export function InteractiveHistoryExplorer({
  chapters,
  locale,
  initialChapterIndex = 0,
}: InteractiveHistoryExplorerProps) {
  const isKaa = locale === 'kaa'
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(initialChapterIndex)
  const [activeMode, setActiveMode] = useState<ExplorerMode>('reading')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [expandedSection, setExpandedSection] = useState<number | null>(0)

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)

  const activeChapter = chapters[selectedChapterIndex] || chapters[0]

  // Filtered chapters for search
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters
    const q = searchQuery.toLowerCase().trim()
    return chapters.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.badges.some((b) => b.toLowerCase().includes(q)),
    )
  }, [chapters, searchQuery])

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (showQuizResults) return
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }))
  }

  const handleResetQuiz = () => {
    setQuizAnswers({})
    setShowQuizResults(false)
  }

  const quizScore = useMemo(() => {
    if (!activeChapter?.quiz) return 0
    let correctCount = 0
    activeChapter.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answerIndex) {
        correctCount++
      }
    })
    return correctCount
  }, [activeChapter, quizAnswers])

  if (!activeChapter) return null

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Breadcrumb & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isKaa ? '1920–1940 Tariyxıy Derekler' : '1920–1940 Tarixiy Manbalar'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[var(--foreground)] tracking-tight">
            {isKaa ? 'Interaktiv Tariyxıy Modul' : 'Interaktiv Tarixiy Modul'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            {isKaa
              ? 'Kitap maǵlıwmatları tiykarındaǵı 5 tiykarǵı tariyxıy bólim, waqıyalar dizbegi, arxiv sanları hám viktorina'
              : 'Tarixiy kitob manbalari asosidagi 5 ta asosiy boʻlim, xronologiya, arxiv koʻrsatkichlari va viktorina'}
          </p>
        </div>

        {/* Real-time search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isKaa
                ? 'Temalardan izlew...'
                : 'Mavzular yoki faktlardan qidirish...'
            }
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-hidden focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* 5 Chapters Selector Bar (Horizontal Cards) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {isKaa ? 'Tariyxıy Bólimler (5 Tema)' : 'Tarixiy Boʻlimlar (5 Mavzu)'}
            </span>
          </span>
          <span className="text-xs font-mono text-amber-500 font-semibold">
            {selectedChapterIndex + 1} / {chapters.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {filteredChapters.map((ch, idx) => {
            const isSelected = ch.id === activeChapter.id
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  const originalIndex = chapters.findIndex((c) => c.id === ch.id)
                  setSelectedChapterIndex(originalIndex >= 0 ? originalIndex : idx)
                  setExpandedSection(0)
                  handleResetQuiz()
                }}
                className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 cursor-pointer group ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-[var(--card)] border-[var(--border)] hover:border-amber-400/50 hover:bg-[var(--secondary)]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-black'
                        : 'bg-[var(--secondary)] text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]'
                    }`}
                  >
                    #{ch.number}
                  </span>
                  <span className="text-[10px] font-mono font-medium text-[var(--muted-foreground)]">
                    {ch.period.split(' ')[0]}
                  </span>
                </div>

                <h3
                  className={`font-serif font-bold text-xs line-clamp-2 transition-colors ${
                    isSelected
                      ? 'text-amber-500'
                      : 'text-[var(--foreground)] group-hover:text-amber-500'
                  }`}
                >
                  {ch.title}
                </h3>

                <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)] pt-1 border-t border-[var(--border)]/60">
                  <span>{ch.readTime}</span>
                  <ChevronRight
                    className={`w-3 h-3 transition-transform ${
                      isSelected
                        ? 'translate-x-0.5 text-amber-500'
                        : 'text-[var(--muted-foreground)] group-hover:translate-x-0.5'
                    }`}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Chapter Showcase Card */}
      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden shadow-lg">
        {/* Header Hero Area */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-black/80 via-black/60 to-transparent text-white overflow-hidden min-h-[220px] flex flex-col justify-end">
          <SmartImage
            src={activeChapter.coverImage}
            alt={activeChapter.title}
            fill
            unoptimized
            className="object-cover -z-10 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 -z-10" />

          <div className="max-w-4xl space-y-3 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-xs font-mono font-bold">
                {isKaa ? `${activeChapter.number}-Bólim` : `${activeChapter.number}-Mavzu`}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-amber-300 border border-white/20 text-xs font-mono">
                {activeChapter.period}
              </span>
              {activeChapter.badges.map((badge, bIdx) => (
                <span
                  key={bIdx}
                  className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-xs text-slate-200 text-[11px] font-sans hidden sm:inline-block"
                >
                  {badge}
                </span>
              ))}
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black leading-snug text-white">
              {activeChapter.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed">
              {activeChapter.excerpt}
            </p>
          </div>
        </div>

        {/* Interactive Mode Tabs */}
        <div className="border-b border-[var(--border)] px-4 sm:px-6 bg-[var(--background)] flex flex-wrap items-center justify-between gap-2 py-2.5">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveMode('reading')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'reading'
                  ? 'bg-amber-500 text-black shadow-xs font-bold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isKaa ? 'Sabaqlıq & Konspekt' : 'Darslik & Konspekt'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'timeline'
                  ? 'bg-amber-500 text-black shadow-xs font-bold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isKaa ? 'Waqıyalar Dizbegi' : 'Voqealar Lentasi'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('stats')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'stats'
                  ? 'bg-amber-500 text-black shadow-xs font-bold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{isKaa ? 'Arxiv Sanları' : 'Arxiv Raqamlari'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('persons')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'persons'
                  ? 'bg-amber-500 text-black shadow-xs font-bold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{isKaa ? 'Tariyxıy Tulǵalar' : 'Tarixiy Shaxslar'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'quiz'
                  ? 'bg-amber-500 text-black shadow-xs font-bold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isKaa ? 'Test / Viktorina' : 'Test / Viktorina'}</span>
            </button>
          </div>

          {/* Quick link to detailed article */}
          <Link
            href={`/maqolalar/${activeChapter.slug}`}
            className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{isKaa ? 'Tolıq oqıw' : 'Toʻliq oʻqish'}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Tab 1: Reading Mode & Expandable Sections */}
        {activeMode === 'reading' && (
          <div className="p-6 sm:p-8 space-y-6 animate-fade-in">
            {/* Audio summary simulator */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-[var(--card)] to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-amber-500 text-black shadow-md animate-pulse'
                      : 'bg-[var(--foreground)] text-[var(--background)]'
                  }`}
                  aria-label="Toggle audio summary"
                >
                  {isPlayingAudio ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
                <div>
                  <h4 className="text-xs font-bold text-[var(--foreground)]">
                    {isKaa ? 'Dawıslı tariyxıy konspekt' : 'Ovozli tarixiy konspekt'}
                  </h4>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {isPlayingAudio
                      ? isKaa
                        ? 'Konspekt esittirilmekte...'
                        : 'Konspekt eshittirilmoqda...'
                      : isKaa
                      ? 'Bólim qısqasha mazmunın tıńlaw múmkin'
                      : 'Boʻlimning qisqacha mazmunini tinglashingiz mumkin'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[var(--secondary)] text-[var(--muted-foreground)]">
                {activeChapter.readTime}
              </span>
            </div>

            {/* Overview Box */}
            <div className="p-5 rounded-xl bg-[var(--secondary)]/40 border border-[var(--border)] space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-amber-500">
                {isKaa ? 'Bólim mazmunı' : 'Boʻlim mazmuni'}
              </h4>
              <p className="text-sm text-[var(--foreground)] leading-relaxed font-serif">
                {activeChapter.summary}
              </p>
            </div>

            {/* Expandable Chapter Sections */}
            <div className="space-y-3">
              {activeChapter.sections.map((section, sIdx) => {
                const isExpanded = expandedSection === sIdx
                return (
                  <div
                    key={sIdx}
                    className="rounded-xl border border-[var(--border)] overflow-hidden transition-all bg-[var(--card)]"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedSection(isExpanded ? null : sIdx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[var(--secondary)]/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {sIdx + 1}
                        </span>
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[var(--foreground)]">
                          {section.title}
                        </h4>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-[var(--muted-foreground)] transition-transform duration-200 shrink-0 ${
                          isExpanded ? 'rotate-90 text-amber-500' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-[var(--border)]/50 space-y-4 animate-fade-in text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">
                        <p className="pt-4 font-sans whitespace-pre-line">
                          {section.content}
                        </p>
                        {section.keyNote && (
                          <div className="p-3.5 rounded-lg bg-amber-500/10 border-l-4 border-amber-500 text-xs text-[var(--foreground)] font-serif italic">
                            {section.keyNote}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Archival Quotes Drawer */}
            {activeChapter.quotes.length > 0 && (
              <div className="space-y-3 pt-4">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-amber-500 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5" />
                  <span>
                    {isKaa
                      ? 'Tariyxıy derekler hám úzindiler'
                      : 'Tarixiy manbalar va iqtiboslar'}
                  </span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeChapter.quotes.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="p-4 rounded-xl bg-[var(--secondary)]/30 border border-[var(--border)] flex flex-col justify-between space-y-3"
                    >
                      <p className="text-xs sm:text-sm font-serif italic text-[var(--foreground)] leading-relaxed">
                        “{q.text}”
                      </p>
                      <div className="text-[11px] text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)] flex items-center justify-between">
                        <span className="font-bold text-[var(--foreground)]">
                          {q.author}
                        </span>
                        <span>{q.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Timeline Stepper Mode */}
        {activeMode === 'timeline' && (
          <div className="p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[var(--foreground)]">
                {isKaa
                  ? 'Waqıyalar xronologiyası'
                  : 'Voqealar xronologiyasi'}
              </h3>
              <span className="text-xs text-[var(--muted-foreground)]">
                {activeChapter.timeline.length} {isKaa ? 'tiykarǵı waqıya' : 'asosiy bosqich'}
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-500/40 space-y-8 my-4">
              {activeChapter.timeline.map((event, tIdx) => (
                <div key={tIdx} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[var(--background)] border-2 border-amber-500 group-hover:bg-amber-500 transition-colors" />

                  <div className="p-4 sm:p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-amber-400 transition-all space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {event.year}
                        </span>
                        {event.date && (
                          <span className="text-[var(--muted-foreground)] font-medium">
                            {event.date}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted-foreground)] font-mono">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span>{event.location}</span>
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[var(--foreground)]">
                      {event.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Archival Stats Mode */}
        {activeMode === 'stats' && (
          <div className="p-6 sm:p-8 space-y-6 animate-fade-in">
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--foreground)]">
                {isKaa
                  ? 'Arxiv sanları hám tariyxıy kórsetkishler'
                  : 'Arxiv raqamlari va tarixiy koʻrsatkichlar'}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                {isKaa
                  ? 'Kitapta keltirilgen anıq arxiv hújjetleri hám rásmiy statistika'
                  : 'Kitobda keltirilgan aniq arxiv hujjatlari va rasmiy statistika'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeChapter.stats.map((stat, sIdx) => (
                <div
                  key={sIdx}
                  className="p-5 rounded-2xl bg-[var(--secondary)]/40 border border-[var(--border)] hover:border-amber-400 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1">
                    <span className="font-mono font-black text-2xl sm:text-3xl text-amber-600 dark:text-amber-400 block group-hover:scale-105 transition-transform">
                      {stat.number}
                    </span>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[var(--foreground)]">
                      {stat.label}
                    </h4>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed pt-2 border-t border-[var(--border)]/60">
                    {stat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Historical Persons Mode */}
        {activeMode === 'persons' && (
          <div className="p-6 sm:p-8 space-y-6 animate-fade-in">
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--foreground)]">
                {isKaa
                  ? 'Ushı bólimdegi tariyxıy tulǵalar'
                  : 'Ushbu boʻlimdagi tarixiy shaxslar'}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                {isKaa
                  ? 'Sol dáwirde xalıq mápi ushın gúresken mámleketlik ǵayratkerler hám jadidler'
                  : 'Oʻsha davrda xalq manfaatlari uchun kurashgan davlat arboblari va jadidlar'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeChapter.persons.map((person, pIdx) => (
                <div
                  key={pIdx}
                  className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-amber-400 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 font-bold flex items-center justify-center font-serif text-sm">
                        {person.name.charAt(0)}
                      </span>
                      <span className="text-[11px] font-mono text-amber-500 font-medium">
                        {person.years}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[var(--foreground)]">
                      {person.name}
                    </h4>
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      {person.role}
                    </p>
                  </div>

                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed pt-2 border-t border-[var(--border)]">
                    {person.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Interactive Quiz Mode */}
        {activeMode === 'quiz' && (
          <div className="p-6 sm:p-8 space-y-6 animate-fade-in max-w-3xl mx-auto">
            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase">
                <Award className="w-3.5 h-3.5" />
                <span>{isKaa ? 'Bilimdi tekseriw' : 'Bilimni tekshirish'}</span>
              </span>
              <h3 className="font-serif font-bold text-xl text-[var(--foreground)]">
                {isKaa ? 'Interaktiv Viktorina' : 'Interaktiv Viktorina'}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                {isKaa
                  ? 'Bólimdi qanshelli jaqsı úyrenip shıqqanıńızdı sınań'
                  : 'Mavzuni qanchalik yaxshi oʻzlashtirganingizni sinab koʻring'}
              </p>
            </div>

            {/* Questions list */}
            <div className="space-y-6">
              {activeChapter.quiz.map((q, qIdx) => {
                const selectedOpt = quizAnswers[qIdx]
                const isCorrect = selectedOpt === q.answerIndex

                return (
                  <div
                    key={qIdx}
                    className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4 shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-[var(--foreground)]">
                        {q.question}
                      </h4>
                    </div>

                    {/* Options */}
                    <div className="space-y-2 pl-9">
                      {q.options.map((opt, oIdx) => {
                        const isThisSelected = selectedOpt === oIdx
                        const isThisTheCorrectAnswer = q.answerIndex === oIdx

                        let optClasses =
                          'bg-[var(--secondary)]/40 border-[var(--border)] hover:border-amber-400 text-[var(--foreground)]'

                        if (showQuizResults) {
                          if (isThisTheCorrectAnswer) {
                            optClasses =
                              'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                          } else if (isThisSelected) {
                            optClasses =
                              'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 line-through'
                          }
                        } else if (isThisSelected) {
                          optClasses =
                            'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleSelectAnswer(qIdx, oIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-2 cursor-pointer ${optClasses}`}
                          >
                            <span>{opt}</span>
                            {showQuizResults && isThisTheCorrectAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            )}
                            {showQuizResults && isThisSelected && !isThisTheCorrectAnswer && (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Explanation if results shown */}
                    {showQuizResults && (
                      <div className="pl-9 pt-2">
                        <div
                          className={`p-3 rounded-xl text-xs leading-relaxed border ${
                            isCorrect
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          <span className="font-bold">
                            {isCorrect
                              ? isKaa
                                ? 'Durıs! '
                                : 'Toʻgʻri! '
                              : isKaa
                              ? 'Qáte! '
                              : 'Notoʻgʻri! '}
                          </span>
                          {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Quiz Submit & Results Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
              {showQuizResults ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-serif font-bold text-[var(--foreground)]">
                    {isKaa ? 'Nátiyjeńiz:' : 'Natijangiz:'}{' '}
                    <span className="text-amber-500 font-mono text-base">
                      {quizScore} / {activeChapter.quiz.length}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--secondary)]/80 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isKaa ? 'Qaytadan urinip kóriw' : 'Qaytadan urinish'}</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowQuizResults(true)}
                  disabled={Object.keys(quizAnswers).length === 0}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isKaa ? 'Juwaptı tekseriw' : 'Javoblarni tekshirish'}
                </button>
              )}

              {/* Next Chapter button */}
              {selectedChapterIndex < chapters.length - 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedChapterIndex((prev) => prev + 1)
                    setExpandedSection(0)
                    handleResetQuiz()
                  }}
                  className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>
                    {isKaa ? 'Keyingi bólimge ótiw' : 'Keyingi mavzuga oʻtish'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
