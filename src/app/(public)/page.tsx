import { db } from '@/lib/db';
import { getProjectThumbnails } from '@/lib/vimeo';
import { Hero } from '@/components/sections/hero';
import { BrandLogos } from '@/components/sections/brand-logos';
import { PortfolioGrid } from '@/components/sections/portfolio-grid';
import { About } from '@/components/sections/about';
import { CTAButton } from '@/components/ui/cta-button';

export default async function HomePage() {
  // Fetch all published projects ordered by sortOrder
  const projects = await db.project.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
  });

  // Fetch SiteConfig for heroVimeoId
  const config = await db.siteConfig.findFirst();
  const heroVimeoId = config?.heroVimeoId ?? '';

  // Fetch thumbnails for all projects in parallel
  const thumbnailUrls = await getProjectThumbnails(
    projects.map((p) => ({ slug: p.slug, vimeoId: p.vimeoId }))
  );

  return (
    <>
      {/* 1. Hero — full-viewport Vimeo background */}
      <Hero heroVimeoId={heroVimeoId} />

      {/* 2. Primary CTA after hero */}
      <section className="flex justify-center py-spacing-8">
        <CTAButton variant="primary" href="#contact">
          Start a Project
        </CTAButton>
      </section>

      {/* 3. Brand logos marquee */}
      <BrandLogos />

      {/* 4. Secondary CTA after brand logos (per locked CTA placement decision) */}
      <section className="flex justify-center py-spacing-8">
        <CTAButton variant="secondary" href="#contact">
          Get in Touch
        </CTAButton>
      </section>

      {/* 5. Portfolio grid — all published projects */}
      <PortfolioGrid projects={projects} thumbnailUrls={thumbnailUrls} />

      {/* 6. About section */}
      <About />

      {/* 7. Contact placeholder — Plan 03 replaces this */}
      <section id="contact" className="py-spacing-16 px-spacing-4 text-center">
        <p className="text-text-muted text-sm uppercase tracking-widest">
          Contact coming soon
        </p>
      </section>
    </>
  );
}
