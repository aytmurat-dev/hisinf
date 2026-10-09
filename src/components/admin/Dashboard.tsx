'use client'

import React, { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import styles from './dashboard.module.css'
import type { AdminStats } from '@/lib/admin-stats'

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 11) return 'Xayrli tong'
  if (hour >= 11 && hour < 17) return 'Xayrli kun'
  if (hour >= 17 && hour < 23) return 'Xayrli kech'
  return 'Xayrli tun'
}

type CommentStatusAction = 'approved' | 'rejected'

export function Dashboard() {
  const [range, setRange] = useState<number>(30)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isAuthor, setIsAuthor] = useState<boolean>(false)
  const [authorPosts, setAuthorPosts] = useState<
    { id: number; title: string; workflowStatus: string; updatedAt: string }[]
  >([])
  const [loading, setLoading] = useState<boolean>(true)
  const [commentStates, setCommentStates] = useState<Record<number, CommentStatusAction>>({})
  const [, startTransition] = useTransition()

  const now = new Date()
  const greeting = getGreeting(now.getHours())

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetch(`/api/admin-stats?range=${range}`, { credentials: 'include' })
      .then(async (res) => {
        if (cancelled) return
        if (res.status === 403) {
          setIsAuthor(true)
          // Fetch author posts
          const postsRes = await fetch('/api/posts?limit=10&depth=0', { credentials: 'include' })
          if (postsRes.ok) {
            const data = await postsRes.json()
            setAuthorPosts(data.docs || [])
          }
          setStats(null)
        } else if (res.ok) {
          const data: AdminStats = await res.json()
          setStats(data)
          setIsAuthor(false)
        }
      })
      .catch(() => {
        // network or server error
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [range])

  const handleModerateComment = async (id: number, status: CommentStatusAction) => {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        startTransition(() => {
          setCommentStates((prev) => ({ ...prev, [id]: status }))
        })
      }
    } catch {
      // ignore
    }
  }

  // Calculate max value for chart bars
  const maxBarValue = stats
    ? Math.max(1, ...stats.bars.map((b) => b.uz + b.kaa))
    : 1

  const maxPeriodCount = stats
    ? Math.max(1, ...stats.byPeriod.map((p) => p.count))
    : 1

  return (
    <div className={styles.dashboard}>
      {/* 1. Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.breadcrumb}>
          <span>Ish stoli</span>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>Boshqaruv paneli</span>
        </div>
        <div className={styles.topBarRight}>
          <div className={styles.statusIndicator}>
            <span className={styles.pulseDot} />
            <span>Sayt ishlayapti</span>
          </div>
          <Link href="/admin/collections/posts/create" className={styles.createButton}>
            + Yangi maqola
          </Link>
        </div>
      </div>

      {/* 2. Greeting Row */}
      <div className={styles.greetingRow}>
        <div className={styles.greetingLeft}>
          <span className={styles.dateLabel}>
            {now.toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <h1 className={styles.greetingTitle}>{greeting}</h1>
        </div>
        {!isAuthor && (
          <div className={styles.rangePicker}>
            <button
              type="button"
              className={`${styles.rangeButton} ${range === 7 ? styles.rangeButtonActive : ''}`}
              onClick={() => setRange(7)}
            >
              7 kun
            </button>
            <button
              type="button"
              className={`${styles.rangeButton} ${range === 30 ? styles.rangeButtonActive : ''}`}
              onClick={() => setRange(30)}
            >
              30 kun
            </button>
            <button
              type="button"
              className={`${styles.rangeButton} ${range === 365 ? styles.rangeButtonActive : ''}`}
              onClick={() => setRange(365)}
            >
              1 yil
            </button>
          </div>
        )}
      </div>

      {/* Author view */}
      {isAuthor && (
        <div className={styles.cardSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Mening maqolalarim</span>
          </div>
          <div className={styles.queueList}>
            {authorPosts.map((p) => (
              <Link
                key={p.id}
                href={`/admin/collections/posts/${p.id}`}
                className={styles.queueItem}
              >
                <span className={styles.queueTitle}>{p.title || 'Sarlavhasiz'}</span>
                <span
                  className={`${styles.statusPill} ${
                    p.workflowStatus === 'changes_requested'
                      ? styles.statusChangesRequested
                      : styles.statusInReview
                  }`}
                >
                  {p.workflowStatus === 'changes_requested'
                    ? 'Tuzatishda'
                    : p.workflowStatus === 'in_review'
                      ? 'Tekshiruvda'
                      : p.workflowStatus}
                </span>
              </Link>
            ))}
            {authorPosts.length === 0 && !loading && (
              <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: '8px 0' }}>
                Hozircha hech qanday maqola yozilmagan.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Staff (Editor/Admin) View */}
      {!isAuthor && stats && (
        <>
          {/* 3. Four Stat Cards */}
          <div className={styles.statGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Oʻqishlar soni</span>
              <span className={styles.statValue}>{formatNumber(stats.reads.value)}</span>
              <span
                className={`${styles.statDelta} ${stats.reads.deltaPct >= 0 ? styles.deltaUp : styles.deltaDown}`}
              >
                {stats.reads.deltaPct >= 0 ? '↑' : '↓'} {Math.abs(stats.reads.deltaPct)}%
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Chop etilgan maqolalar</span>
              <span className={styles.statValue}>{stats.published.value}</span>
              <span
                className={`${styles.statDelta} ${stats.published.delta >= 0 ? styles.deltaUp : styles.deltaDown}`}
              >
                {stats.published.delta >= 0 ? '+' : ''}
                {stats.published.delta}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Yangi izohlar</span>
              <span className={styles.statValue}>{stats.newComments.value}</span>
              <span
                className={`${styles.statDelta} ${stats.newComments.deltaPct >= 0 ? styles.deltaUp : styles.deltaDown}`}
              >
                {stats.newComments.deltaPct >= 0 ? '↑' : '↓'} {Math.abs(stats.newComments.deltaPct)}%
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Yangi oʻquvchilar</span>
              <span className={styles.statValue}>{stats.newReaders.value}</span>
              <span
                className={`${styles.statDelta} ${stats.newReaders.deltaPct >= 0 ? styles.deltaUp : styles.deltaDown}`}
              >
                {stats.newReaders.deltaPct >= 0 ? '↑' : '↓'} {Math.abs(stats.newReaders.deltaPct)}%
              </span>
            </div>
          </div>

          {/* 4. Chart & Periods */}
          <div className={styles.twoColGrid}>
            {/* O'qishlar Grafigi */}
            <div className={styles.cardSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>Oʻqishlar</span>
                <div className={styles.chartLegend}>
                  <div className={styles.legendItem}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'var(--hf-primary, #8c2f1b)',
                      }}
                    />
                    <span>UZ</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'var(--hf-teal, #2f5d62)',
                      }}
                    />
                    <span>KAA</span>
                  </div>
                </div>
              </div>

              <div className={styles.barsContainer}>
                {stats.bars.map((b, i) => {
                  const uzPct = (b.uz / maxBarValue) * 100
                  const kaaPct = (b.kaa / maxBarValue) * 100
                  return (
                    <div
                      key={i}
                      className={styles.barCol}
                      title={`${b.label}: ${b.uz + b.kaa} oʻqish (UZ: ${b.uz}, KAA: ${b.kaa})`}
                    >
                      <span
                        className={styles.barKaa}
                        style={{ height: `${kaaPct}%` }}
                      />
                      <span
                        className={styles.barUz}
                        style={{ height: `${uzPct}%` }}
                      />
                    </div>
                  )
                })}
              </div>

              <div className={styles.chartAxis}>
                <span>{stats.bars[0]?.label || ''}</span>
                <span>{stats.bars[stats.bars.length - 1]?.label || ''}</span>
              </div>
            </div>

            {/* Davrlar bo'yicha */}
            <div className={styles.cardSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>Davrlar boʻyicha</span>
              </div>
              <div className={styles.periodList}>
                {stats.byPeriod.map((p, idx) => {
                  const widthPct = Math.round((p.count / maxPeriodCount) * 100)
                  return (
                    <div key={idx} className={styles.periodRow}>
                      <div className={styles.periodMeta}>
                        <span>{p.name}</span>
                        <span className={styles.periodCount}>{p.count}</span>
                      </div>
                      <div className={styles.periodTrack}>
                        <div
                          className={styles.periodFill}
                          style={{
                            width: `${widthPct}%`,
                            backgroundColor: p.color,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
                {stats.byPeriod.length === 0 && (
                  <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
                    Davrlar boʻyicha maʼlumot yoʻq.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 5. Review Queue & Comments Moderation */}
          <div className={styles.twoColGrid}>
            {/* Tekshiruv Navbati */}
            <div className={styles.cardSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>Tekshiruv navbati</span>
                <span
                  style={{
                    fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--hf-primary, #8c2f1b)',
                    color: 'var(--hf-primary-fg, #fff8ee)',
                  }}
                >
                  {stats.queueCount}
                </span>
              </div>

              <div className={styles.queueList}>
                {stats.queue.map((q) => (
                  <Link
                    key={q.id}
                    href={`/admin/collections/posts/${q.id}`}
                    className={styles.queueItem}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span className={styles.queueTitle}>{q.title}</span>
                      <span className={styles.queueMeta}>
                        {q.author} · {new Date(q.updatedAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                    <span
                      className={`${styles.statusPill} ${
                        q.status === 'changes_requested'
                          ? styles.statusChangesRequested
                          : styles.statusInReview
                      }`}
                    >
                      {q.status === 'changes_requested' ? 'Tuzatishda' : 'Yangi'}
                    </span>
                  </Link>
                ))}
                {stats.queue.length === 0 && (
                  <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '8px 0' }}>
                    Tekshiruv navbati boʻsh.
                  </p>
                )}
              </div>
            </div>

            {/* Izohlar Moderatsiyasi */}
            <div className={styles.cardSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>Izohlar moderatsiyasi</span>
                <span
                  style={{
                    fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
                    fontSize: '11px',
                    color: 'var(--muted, #6b5d4f)',
                  }}
                >
                  {stats.moderationCount} kutmoqda
                </span>
              </div>

              <div className={styles.commentList}>
                {stats.moderation.map((c) => {
                  const state = commentStates[c.id]
                  return (
                    <div
                      key={c.id}
                      className={styles.commentCard}
                      style={{ opacity: state ? 0.55 : 1 }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                        <span style={{ color: 'var(--muted)' }}>→ {c.postTitle}</span>
                        {c.flagged && (
                          <span style={{ color: 'var(--hf-primary, #8c2f1b)' }}>⚑ shubhali</span>
                        )}
                      </div>
                      <p className={styles.commentBody}>{c.body}</p>
                      {state ? (
                        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)' }}>
                          {state === 'approved' ? '✓ Chop etildi' : '✕ Rad etildi'}
                        </div>
                      ) : (
                        <div className={styles.commentActions}>
                          <button
                            type="button"
                            className={styles.approveBtn}
                            onClick={() => handleModerateComment(c.id, 'approved')}
                          >
                            ✓ Tasdiqlash
                          </button>
                          <button
                            type="button"
                            className={styles.rejectBtn}
                            onClick={() => handleModerateComment(c.id, 'rejected')}
                          >
                            Rad etish
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
                {stats.moderation.length === 0 && (
                  <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '8px 0' }}>
                    Kutilayotgan izohlar yoʻq.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* V2-P5.S4.4: Tezkor havolalar header */}
      <h2 className={styles.quickLinksHeader}>Tezkor havolalar</h2>
    </div>
  )
}
