export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { getProjectThumbnails } from '@/lib/vimeo';
import { Hero } from '@/components/sections/hero';
import { BrandLogos } from '@/components/sections/brand-logos';
import { PortfolioGrid } from '@/components/sections/portfolio-grid';
import { About } from '@/components/sections/about';
import { ContactForm } from '@/components/sections/contact-form';
import { AnalyticsTracker } from '@/components/analytics/page-tracker';

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
      previewClipUrl: true,
      thumbnailUrl: true,
    },
  });

  // Use DB thumbnail if exists, otherwise fetch from Vimeo
  const vimeoThumbnails = await getProjectThumbnails(projects);
  const thumbnailUrls: Record<string, string | null> = {};
  for (const p of projects) {
    thumbnailUrls[p.slug] = (p.thumbnailUrl && p.thumbnailUrl.length > 0) ? p.thumbnailUrl : (vimeoThumbnails[p.slug] ?? null);
  }

  return (
    <>
      <AnalyticsTracker page="/" />

      {/* 1. Hero */}
      <div className="bg-[#0A0A0A]">
        <Hero heroVimeoId={heroVimeoId} />
      </div>

      {/* 2. Brand logos */}
      <div className="bg-[#0A0A0A]">
        <BrandLogos />
      </div>

      {/* 3. Portfolio */}
      <div className="bg-[#0A0A0A]">
        <PortfolioGrid projects={projects} thumbnailUrls={thumbnailUrls} />
      </div>

      {/* Gradient: dark → warm */}
      <div className="h-24 sm:h-32 bg-gradient-to-b from-[#0A0A0A] to-[#111113]" />

      {/* 4. About + CTA (merged) */}
      <div className="bg-[#111113]">
        <About />
      </div>

      {/* Gradient: warm → warmest */}
      <div className="h-24 sm:h-32 bg-gradient-to-b from-[#111113] to-[#141416]" />

      {/* 5. Contact */}
      <div className="bg-[#141416]">
        <ContactForm />
      </div>

      {/* Gradient: warmest → dark */}
      <div className="h-16 sm:h-20 bg-gradient-to-b from-[#141416] to-[#0A0A0A]" />
    </>
  );
}
