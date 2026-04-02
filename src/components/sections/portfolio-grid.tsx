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
  previewClipUrl?: string | null;
  thumbnailUrl?: string | null;
}

interface PortfolioGridProps {
  projects: Project[];
  thumbnailUrls: Record<string, string | null>;
}

export function PortfolioGrid({ projects, thumbnailUrls }: PortfolioGridProps) {
  return (
    <section id="work" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8" style={{ scrollMarginTop: '5rem' }}>
      <AnimatedGrid className="max-w-[1800px] mx-auto flex flex-col gap-4 sm:gap-5">
        {projects.map((project, index) => {
          // Layout pattern: first = full, then pairs of 2, every 5th is full again
          const isFullWidth = index === 0 || (index > 0 && index % 5 === 0);

          if (isFullWidth) {
            return (
              <AnimatedGridItem key={project.slug}>
                <ProjectCard
                  id={project.id}
                  slug={project.slug}
                  title={project.title}
                  client={project.client}
                  vimeoId={project.vimeoId}
                  thumbnailUrl={thumbnailUrls[project.slug] ?? null}
                  previewClipUrl={project.previewClipUrl ?? undefined}
                  layout="full"
                />
              </AnimatedGridItem>
            );
          }

          // Pair items side by side
          const isLeftOfPair = !isFullWidth && ((index % 5 === 1) || (index % 5 === 3));

          if (isLeftOfPair && index + 1 < projects.length) {
            const nextProject = projects[index + 1];
            const nextIsFullWidth = (index + 1) % 5 === 0;

            if (!nextIsFullWidth) {
              return (
                <div key={project.slug} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <AnimatedGridItem>
                    <ProjectCard
                      id={project.id}
                      slug={project.slug}
                      title={project.title}
                      client={project.client}
                      vimeoId={project.vimeoId}
                      thumbnailUrl={thumbnailUrls[project.slug] ?? null}
                      previewClipUrl={project.previewClipUrl ?? undefined}
                      layout="half"
                    />
                  </AnimatedGridItem>
                  <AnimatedGridItem>
                    <ProjectCard
                      id={nextProject.id}
                      slug={nextProject.slug}
                      title={nextProject.title}
                      client={nextProject.client}
                      vimeoId={nextProject.vimeoId}
                      thumbnailUrl={thumbnailUrls[nextProject.slug] ?? null}
                      previewClipUrl={nextProject.previewClipUrl ?? undefined}
                      layout="half"
                    />
                  </AnimatedGridItem>
                </div>
              );
            }
          }

          // Skip right-side items (already rendered in pair above)
          const isRightOfPair = !isFullWidth && ((index % 5 === 2) || (index % 5 === 4));
          if (isRightOfPair) return null;

          // Fallback for odd items at end
          return (
            <AnimatedGridItem key={project.slug}>
              <ProjectCard
                id={project.id}
                slug={project.slug}
                title={project.title}
                client={project.client}
                vimeoId={project.vimeoId}
                thumbnailUrl={thumbnailUrls[project.slug] ?? null}
                previewClipUrl={project.previewClipUrl ?? undefined}
                layout="full"
              />
            </AnimatedGridItem>
          );
        })}
      </AnimatedGrid>
    </section>
  );
}
