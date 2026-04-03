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

function MidGridCTA() {
  return (
    <div className="text-center" style={{ paddingTop: '5rem', paddingBottom: '5rem', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <p className="text-[9px] uppercase tracking-[0.4em] text-text-muted/15" style={{ marginBottom: '1.5rem' }}>
        Like what you see?
      </p>
      <a
        href="/#contact"
        className="group inline-flex items-center gap-3"
      >
        <span
          className="text-[clamp(1rem,2vw,1.5rem)] uppercase tracking-[0.2em] text-text-primary/50 group-hover:text-accent transition-colors duration-500"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Start a Project
        </span>
        <span className="inline-block w-6 h-[1px] bg-current transition-all duration-500 group-hover:w-12 text-text-primary/30 group-hover:text-accent" />
      </a>
    </div>
  );
}

export function PortfolioGrid({ projects, thumbnailUrls }: PortfolioGridProps) {
  const elements: React.ReactNode[] = [];
  let projectCount = 0;

  projects.forEach((project, index) => {
    const isFullWidth = index === 0 || (index > 0 && index % 5 === 0);
    const isLeftOfPair = !isFullWidth && ((index % 5 === 1) || (index % 5 === 3));
    const isRightOfPair = !isFullWidth && ((index % 5 === 2) || (index % 5 === 4));

    // Insert CTA break after every 10 projects
    if (projectCount > 0 && projectCount % 10 === 0 && isFullWidth) {
      elements.push(<MidGridCTA key={`cta-${index}`} />);
    }

    if (isFullWidth) {
      elements.push(
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
      projectCount++;
      return;
    }

    if (isLeftOfPair && index + 1 < projects.length) {
      const nextProject = projects[index + 1];
      const nextIsFullWidth = (index + 1) % 5 === 0;

      if (!nextIsFullWidth) {
        elements.push(
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
        projectCount += 2;
        return;
      }
    }

    if (isRightOfPair) return;

    // Fallback
    elements.push(
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
    projectCount++;
  });

  return (
    <section id="work" className="px-4 sm:px-5" style={{ scrollMarginTop: '5rem', paddingTop: '2rem', paddingBottom: '3rem' }}>
      <AnimatedGrid className="flex flex-col gap-4 sm:gap-5">
        {elements}
      </AnimatedGrid>
    </section>
  );
}
