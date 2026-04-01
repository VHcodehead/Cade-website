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

      {/* === ZONE 1: Pure dark — hero + logos + work === */}
      <div className="bg-[#0A0A0A]">
        <Hero heroVimeoId={heroVimeoId} />
        <BrandLogos />
        <PortfolioGrid projects={projects} thumbnailUrls={thumbnailUrls} />
      </div>

      {/* Gradient transition: dark → warm */}
      <div className="h-32 sm:h-48 bg-gradient-to-b from-[#0A0A0A] to-[#111113]" />

      {/* === ZONE 2: Warm shift — CTA + About === */}
      <div className="bg-[#111113]">
        <RevealSection>
          <section className="py-40 sm:py-52 flex flex-col items-center justify-center text-center px-6">
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

        <About />
      </div>

      {/* Gradient transition: warm → warmest */}
      <div className="h-32 sm:h-48 bg-gradient-to-b from-[#111113] to-[#141416]" />

      {/* === ZONE 3: Warmest — contact === */}
      <div className="bg-[#141416]">
        <ContactForm />
      </div>

      {/* Gradient transition: warmest → dark footer */}
      <div className="h-20 sm:h-32 bg-gradient-to-b from-[#141416] to-[#0A0A0A]" />
    </>
  );
}
