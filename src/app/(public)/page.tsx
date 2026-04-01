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
      'Premium video production for brands that move people. Bay Area and worldwide.',
    type: 'website',
  },
};

export default async function HomePage() {
  const siteConfig = await db.siteConfig.findFirst();
  const heroVimeoId = siteConfig?.heroVimeoId || '1129060654';

  const projects = await db.project.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      slug: true,
      title: true,
      client: true,
      vimeoId: true,
      sortOrder: true,
    },
  });

  const thumbnailUrls = await getProjectThumbnails(projects);

  return (
    <>
      <AnalyticsTracker page="/" />

      {/* 1. Hero — full viewport */}
      <Hero heroVimeoId={heroVimeoId} />

      {/* 2. Brand names marquee */}
      <BrandLogos />

      {/* 3. Portfolio grid */}
      <PortfolioGrid projects={projects} thumbnailUrls={thumbnailUrls} />

      {/* 4. About */}
      <About />

      {/* 5. Editorial CTA — after about, before contact */}
      <RevealSection>
        <section className="py-48 sm:py-56 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/20 mb-10">
            Ready?
          </p>
          <h2
            className="text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase tracking-[0.12em] text-text-primary mb-14 leading-tight"
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

      {/* 6. Contact form */}
      <ContactForm />
    </>
  );
}
