import Link from 'next/link'
import { verifySession } from '@/lib/dal'
import { db } from '@/lib/db'

export default async function AdminDashboard() {
  await verifySession()

  const [unreadCount, totalProjects, publishedProjects] = await Promise.all([
    db.contactSubmission.count({ where: { read: false } }),
    db.project.count(),
    db.project.count({ where: { published: true } }),
  ])

  const cards = [
    {
      label: 'Projects',
      href: '/admin/projects',
      description: `${totalProjects} project${totalProjects !== 1 ? 's' : ''} (${publishedProjects} published)`,
      badge: null,
    },
    {
      label: 'Messages',
      href: '/admin/messages',
      description: unreadCount > 0 ? `${unreadCount} unread` : 'No unread messages',
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      description: 'Manage site configuration and contact details',
      badge: null,
    },
    {
      label: 'Brand Logos',
      href: '/admin/logos',
      description: 'Upload and manage client brand logos',
      badge: null,
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(({ label, href, description, badge }) => (
          <Link
            key={href}
            href={href}
            className="group block bg-bg-card border border-white/10 rounded-lg p-6 hover:border-accent transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-text-primary font-semibold text-lg">{label}</h2>
              {badge !== null && (
                <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 text-xs font-bold bg-accent text-white rounded-full">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-text-muted text-sm">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
