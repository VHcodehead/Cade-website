export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { getProjectThumbnails } from '@/lib/vimeo';
import { Hero } from '@/components/sections/hero';
import { BrandLogos } from '@/components/sections/brand-logos';
import { PortfolioGrid } from '@/components/sections/portfolio-grid';
import { About } from '@/components/sections/about';
import { ContactForm } from '@/components/sections/contact-form';
import { RevealSection } from '@/components/animations/reveal-section';
import { AnalyticsTracker } from '@/components/analytics/page-tracker';
import { CTAButton } from '@/components/ui/cta-button';

export const metadata: Metadata = {
  title: 'VLACOVISION — Premium Video Production',
  description:
    'Premium video production for brands that move people. Bay Area and worldwide. Nike, Disney, Lululemon, and more.',
  openGraph: {
    title: 'VLACOVISION — Premium Video Production',
    description:
      'Premium video production for brands that move people. Bay Area and worldwide. Nike, Disney, Lululemon, and more.',
    type: 'website',
    siteName: 'VLACOVISION',
  },
};

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
      {/* Silent page view tracker — fires sendBeacon on mount, no visible UI */}
      <AnalyticsTracker page="/" />

      {/* 1. Hero — full-viewport Vimeo background */}
      <Hero heroVimeoId={heroVimeoId} />

      {/* 2. Brand logos marquee — no CTA between hero and logos */}
      <BrandLogos />

      {/* 3. Portfolio grid — all published projects */}
      <PortfolioGrid projects={projects} thumbnailUrls={thumbnailUrls} />

      {/* 4. Inline CTA between work and about — editorial style */}
      <RevealSection>
        <section className="py-32 sm:py-40 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/25 mb-8">
            Ready to start?
          </p>
          <h2
            className="text-[clamp(1.25rem,2.5vw,2rem)] uppercase tracking-[0.15em] text-text-primary mb-10 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Let&apos;s create something
            <br />
            worth watching.
          </h2>
          <CTAButton variant="primary" href="#contact">
            Start a Project
          </CTAButton>
        </section>
      </RevealSection>

      {/* 5. About section */}
      <About />

      {/* 6. Contact form */}
      <ContactForm />
    </>
  );
}
