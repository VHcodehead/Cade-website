export const dynamic = 'force-dynamic'

import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await db.project.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  const projectRoutes = projects.map((project) => ({
    url: `https://www.vlacovision.com/projects/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://www.vlacovision.com',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    ...projectRoutes,
  ]
}
