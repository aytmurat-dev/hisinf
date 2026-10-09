import type { Payload } from 'payload'

export type AdminStats = {
  reads: { value: number; deltaPct: number }
  published: { value: number; delta: number }
  newComments: { value: number; deltaPct: number }
  newReaders: { value: number; deltaPct: number }
  bars: { label: string; uz: number; kaa: number }[]
  byPeriod: { name: string; color: string; count: number }[]
  queue: { id: number; title: string; author: string; updatedAt: string; status: string }[]
  moderation: { id: number; name: string; postTitle: string; body: string; flagged: boolean }[]
  queueCount: number
  moderationCount: number
}

function formatDateISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export async function getAdminStats(payload: Payload, range = 30): Promise<AdminStats> {
  const safeRange = range <= 0 ? 30 : range
  const now = new Date()

  const currentFrom = new Date(now.getTime() - safeRange * 86400000)
  const prevFrom = new Date(now.getTime() - safeRange * 2 * 86400000)

  const currentFromDay = formatDateISO(currentFrom)
  const prevFromDay = formatDateISO(prevFrom)

  // 1. Reads from daily-stats
  let curReadsUz = 0
  let curReadsKaa = 0
  let prevReadsTotal = 0

  // 14 bars calculation
  const barCount = 14
  const barIntervalDays = Math.max(1, Math.round(safeRange / barCount))
  const bars: { label: string; uz: number; kaa: number }[] = Array.from({ length: barCount }, (_, i) => {
    const d = new Date(currentFrom.getTime() + i * barIntervalDays * 86400000)
    return {
      label: `${d.getDate()}-${d.getMonth() + 1}`,
      uz: 0,
      kaa: 0,
    }
  })

  try {
    const dailyStatsRes = await payload.find({
      collection: 'daily-stats',
      where: {
        day: { greater_than_equal: prevFromDay },
      },
      limit: 10000,
      depth: 0,
      pagination: false,
    })

    for (const doc of dailyStatsRes.docs) {
      const views = typeof doc.views === 'number' ? doc.views : 0
      const isCurrent = doc.day >= currentFromDay
      const isUz = doc.locale === 'uz'

      if (isCurrent) {
        if (isUz) curReadsUz += views
        else curReadsKaa += views

        // place into bar
        const docDate = new Date(doc.day).getTime()
        const diffDays = Math.floor((docDate - currentFrom.getTime()) / 86400000)
        const barIdx = Math.min(barCount - 1, Math.max(0, Math.floor(diffDays / barIntervalDays)))
        if (bars[barIdx]) {
          if (isUz) bars[barIdx].uz += views
          else bars[barIdx].kaa += views
        }
      } else {
        prevReadsTotal += views
      }
    }
  } catch {
    // If table is empty or error
  }

  const curReadsTotal = curReadsUz + curReadsKaa
  const readsDeltaPct =
    prevReadsTotal > 0
      ? Math.round(((curReadsTotal - prevReadsTotal) / prevReadsTotal) * 100)
      : curReadsTotal > 0
        ? 100
        : 0

  // 2. Published posts
  let curPublishedCount = 0
  let prevPublishedCount = 0
  try {
    const [curPub, prevPub] = await Promise.all([
      payload.count({
        collection: 'posts',
        where: {
          _status: { equals: 'published' },
          publishedAt: { greater_than_equal: currentFrom.toISOString() },
        },
      }),
      payload.count({
        collection: 'posts',
        where: {
          _status: { equals: 'published' },
          and: [
            { publishedAt: { greater_than_equal: prevFrom.toISOString() } },
            { publishedAt: { less_than: currentFrom.toISOString() } },
          ],
        },
      }),
    ])
    curPublishedCount = curPub.totalDocs
    prevPublishedCount = prevPub.totalDocs
  } catch {
    // ignore
  }

  // 3. New comments
  let curCommentsCount = 0
  let prevCommentsCount = 0
  try {
    const [curCom, prevCom] = await Promise.all([
      payload.count({
        collection: 'comments',
        where: {
          createdAt: { greater_than_equal: currentFrom.toISOString() },
        },
      }),
      payload.count({
        collection: 'comments',
        where: {
          and: [
            { createdAt: { greater_than_equal: prevFrom.toISOString() } },
            { createdAt: { less_than: currentFrom.toISOString() } },
          ],
        },
      }),
    ])
    curCommentsCount = curCom.totalDocs
    prevCommentsCount = prevCom.totalDocs
  } catch {
    // ignore
  }
  const commentsDeltaPct =
    prevCommentsCount > 0
      ? Math.round(((curCommentsCount - prevCommentsCount) / prevCommentsCount) * 100)
      : curCommentsCount > 0
        ? 100
        : 0

  // 4. New readers
  let curReadersCount = 0
  let prevReadersCount = 0
  try {
    const [curRead, prevRead] = await Promise.all([
      payload.count({
        collection: 'readers',
        where: {
          createdAt: { greater_than_equal: currentFrom.toISOString() },
        },
      }),
      payload.count({
        collection: 'readers',
        where: {
          and: [
            { createdAt: { greater_than_equal: prevFrom.toISOString() } },
            { createdAt: { less_than: currentFrom.toISOString() } },
          ],
        },
      }),
    ])
    curReadersCount = curRead.totalDocs
    prevReadersCount = prevRead.totalDocs
  } catch {
    // ignore
  }
  const readersDeltaPct =
    prevReadersCount > 0
      ? Math.round(((curReadersCount - prevReadersCount) / prevReadersCount) * 100)
      : curReadersCount > 0
        ? 100
        : 0

  // 5. By period (top 6)
  const byPeriod: { name: string; color: string; count: number }[] = []
  try {
    const periodsRes = await payload.find({
      collection: 'periods',
      limit: 50,
      depth: 0,
      sort: 'order',
    })
    const counted = await Promise.all(
      periodsRes.docs.map(async (p) => {
        const c = await payload.count({
          collection: 'posts',
          where: {
            _status: { equals: 'published' },
            period: { equals: p.id },
          },
        })
        return {
          name: (p.title as string) || `Davr ${p.id}`,
          color: (p.color as string) || 'var(--hf-teal, #2f5d62)',
          count: c.totalDocs,
        }
      }),
    )
    counted.sort((a, b) => b.count - a.count)
    byPeriod.push(...counted.slice(0, 6))
  } catch {
    // ignore
  }

  // 6. Queue (in_review + changes_requested)
  const queue: { id: number; title: string; author: string; updatedAt: string; status: string }[] = []
  let queueCount = 0
  try {
    const queueDocs = await payload.find({
      collection: 'posts',
      where: {
        workflowStatus: { in: ['in_review', 'changes_requested'] },
      },
      sort: 'updatedAt',
      limit: 6,
      depth: 1,
    })
    queueCount = queueDocs.totalDocs
    for (const doc of queueDocs.docs) {
      const authorObj = doc.author as { displayName?: string; username?: string } | undefined
      queue.push({
        id: doc.id,
        title: (doc.title as string) || 'Sarlavhasiz',
        author: authorObj?.displayName || authorObj?.username || 'Nomaʼlum',
        updatedAt: doc.updatedAt,
        status: (doc.workflowStatus as string) || 'in_review',
      })
    }
  } catch {
    // ignore
  }

  // 7. Moderation (pending comments)
  const moderation: { id: number; name: string; postTitle: string; body: string; flagged: boolean }[] = []
  let moderationCount = 0
  try {
    const modDocs = await payload.find({
      collection: 'comments',
      where: {
        status: { equals: 'pending' },
      },
      sort: '-createdAt',
      limit: 5,
      depth: 1,
    })
    moderationCount = modDocs.totalDocs
    for (const doc of modDocs.docs) {
      const postObj = doc.post as { title?: string } | undefined
      moderation.push({
        id: doc.id,
        name: (doc.authorName as string) || 'Mehmon',
        postTitle: postObj?.title || 'Maqola',
        body: (doc.body as string) || '',
        flagged: Boolean(doc.flagged),
      })
    }
  } catch {
    // ignore
  }

  return {
    reads: { value: curReadsTotal, deltaPct: readsDeltaPct },
    published: { value: curPublishedCount, delta: curPublishedCount - prevPublishedCount },
    newComments: { value: curCommentsCount, deltaPct: commentsDeltaPct },
    newReaders: { value: curReadersCount, deltaPct: readersDeltaPct },
    bars,
    byPeriod,
    queue,
    moderation,
    queueCount,
    moderationCount,
  }
}
