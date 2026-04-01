'use client';

import { ProjectCard } from '@/components/portfolio/project-card';
import { AnimatedGrid, AnimatedGridItem } from '@/components/animations/reveal-grid-item';
import { RevealSection } from '@/components/animations/reveal-section';

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
    <section id="work" className="pt-32 sm:pt-40 pb-8">
      <RevealSection>
        <div className="px-6 sm:px-10 lg:px-16 mb-16 sm:mb-24">
          <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/30 mb-5">
            Selected Work
          </p>
          <h2
            className="text-[clamp(1.75rem,4vw,3.5rem)] uppercase tracking-[0.12em] text-text-primary leading-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Portfolio
          </h2>
        </div>
      </RevealSection>

      <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 gap-[2px] px-0 sm:px-0">
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
