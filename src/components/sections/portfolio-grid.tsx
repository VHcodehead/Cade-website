import { ProjectCard } from '@/components/portfolio/project-card';

interface Project {
  slug: string;
  title: string;
  client: string;
  vimeoId: string;
  description: string;
  sortOrder: number;
}

interface PortfolioGridProps {
  projects: Project[];
  thumbnailUrls: Record<string, string | null>;
}

export function PortfolioGrid({ projects, thumbnailUrls }: PortfolioGridProps) {
  return (
    <section id="work" className="px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2px]">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            slug={project.slug}
            title={project.title}
            client={project.client}
            vimeoId={project.vimeoId}
            thumbnailUrl={thumbnailUrls[project.slug] ?? null}
            isFeatured={index % 5 === 0}
            description={project.description}
          />
        ))}
      </div>
    </section>
  );
}
