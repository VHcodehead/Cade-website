import { verifySession } from '@/lib/dal'
import { db } from '@/lib/db'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ range?: string }>
}

function getDateFilter(range: string): Date | undefined {
  const now = new Date()
  if (range === '7d') {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }
  if (range === '30d') {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
  return undefined // 'all' — no date filter
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
  await verifySession()

  const { range = '30d' } = await searchParams
  const since = getDateFilter(range)
  const dateFilter = since ? { createdAt: { gte: since } } : {}

  const [totalPageViews, totalVideoPlays, videoPlays, topPages] = await Promise.all([
    db.analyticsEvent.count({
      where: { eventType: 'PAGE_VIEW', ...dateFilter },
    }),
    db.analyticsEvent.count({
      where: { eventType: 'VIDEO_PLAY', ...dateFilter },
    }),
    db.analyticsEvent.groupBy({
      by: ['projectId'],
      where: {
        eventType: 'VIDEO_PLAY',
        projectId: { not: null },
        ...dateFilter,
      },
      _count: { projectId: true },
      orderBy: { _count: { projectId: 'desc' } },
    }),
    db.analyticsEvent.groupBy({
      by: ['page'],
      where: { eventType: 'PAGE_VIEW', ...dateFilter },
      _count: { page: true },
      orderBy: { _count: { page: 'desc' } },
      take: 10,
    }),
  ])

  // Fetch project titles for the video plays results
  const projectIds = videoPlays
    .map((v) => v.projectId)
    .filter((id): id is string => id !== null)

  const projects = await db.project.findMany({
    where: { id: { in: projectIds } },
    select: { id: true, title: true },
  })

  const projectMap = new Map(projects.map((p) => [p.id, p.title]))

  const hasData = totalPageViews > 0 || totalVideoPlays > 0

  const RANGE_OPTIONS = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: 'All time', value: 'all' },
  ]

  return (
    <div className="p-8 max-w-5xl">
      {/* Page header */}
      <h1 className="text-2xl font-bold text-text-primary mb-8">Analytics</h1>

      {/* Date range filter */}
      <div className="flex gap-2 mb-8">
        {RANGE_OPTIONS.map(({ label, value }) => (
          <Link
            key={value}
            href={`?range=${value}`}
            className={[
              'px-4 py-2 rounded text-sm transition-colors',
              range === value
                ? 'bg-accent/20 text-accent font-medium'
                : 'bg-bg-section text-text-muted hover:text-text-primary',
            ].join(' ')}
          >
            {label}
          </Link>
        ))}
      </div>

      {!hasData ? (
        <p className="text-text-muted text-sm">
          No analytics data yet. Events will appear as visitors browse the public site.
        </p>
      ) : (
        <>
          {/* Overview cards row */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 bg-bg-card border border-white/10 rounded-lg p-6">
              <p className="text-4xl font-bold text-text-primary">{totalPageViews.toLocaleString()}</p>
              <p className="text-sm text-text-muted mt-2 uppercase tracking-widest">Page Views</p>
            </div>
            <div className="flex-1 bg-bg-card border border-white/10 rounded-lg p-6">
              <p className="text-4xl font-bold text-text-primary">{totalVideoPlays.toLocaleString()}</p>
              <p className="text-sm text-text-muted mt-2 uppercase tracking-widest">Video Plays</p>
            </div>
          </div>

          {/* Most Viewed Projects table */}
          {videoPlays.length > 0 && (
            <div className="bg-bg-card border border-white/10 rounded-lg mb-8 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-sm font-semibold text-text-primary uppercase tracking-widest">
                  Most Viewed Projects
                </h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-3 text-text-muted font-medium">Rank</th>
                    <th className="text-left px-6 py-3 text-text-muted font-medium">Project</th>
                    <th className="text-right px-6 py-3 text-text-muted font-medium">Video Plays</th>
                  </tr>
                </thead>
                <tbody>
                  {videoPlays.map((row, index) => (
                    <tr
                      key={row.projectId ?? index}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-3 text-text-muted">{index + 1}</td>
                      <td className="px-6 py-3 text-text-primary">
                        {row.projectId && projectMap.has(row.projectId)
                          ? projectMap.get(row.projectId)
                          : 'Unknown project'}
                      </td>
                      <td className="px-6 py-3 text-text-primary text-right">
                        {row._count.projectId.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Top Pages table */}
          {topPages.length > 0 && (
            <div className="bg-bg-card border border-white/10 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-sm font-semibold text-text-primary uppercase tracking-widest">
                  Top Pages
                </h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-3 text-text-muted font-medium">Page</th>
                    <th className="text-right px-6 py-3 text-text-muted font-medium">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((row) => (
                    <tr
                      key={row.page}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-3 text-text-primary font-mono text-xs">{row.page}</td>
                      <td className="px-6 py-3 text-text-primary text-right">
                        {row._count.page.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
