'use client';

import { ProjectCard } from '@/components/portfolio/project-card';
import { AnimatedGrid, AnimatedGridItem } from '@/components/animations/reveal-grid-item';

interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  vimeoId: string;
  sortOrder: number;
}

interface PortfolioGridProps {
  projects: Project[];
  thumbnailUrls: Record<string, string | null>;
}

export function PortfolioGrid({ projects, thumbnailUrls }: PortfolioGridProps) {
  return (
    <section id="work">
      <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-bg-base">
        {projects.map((project, index) => (
          <AnimatedGridItem key={project.slug}>
            <ProjectCard
              id={project.id}
              slug={project.slug}
              title={project.title}
              client={project.client}
              vimeoId={project.vimeoId}
              thumbnailUrl={thumbnailUrls[project.slug] ?? null}
              isFeatured={index === 0}
            />
          </AnimatedGridItem>
        ))}
      </AnimatedGrid>
    </section>
  );
}
