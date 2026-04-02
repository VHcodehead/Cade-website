'use client';

import { RevealSection } from '@/components/animations/reveal-section';

// Each logo has a manually tuned height for visual uniformity
// The source images have wildly different aspect ratios and internal whitespace
const BRAND_LOGOS = [
  { name: 'Nike', src: '/assets/Nike-Logo.png', white: true, h: 55 },
  { name: 'Disney', src: '/assets/Disney_logo.png', white: true, h: 50 },
  { name: 'Lululemon', src: '/assets/lululemon.png', white: true, h: 55 },
  { name: 'Chase', src: '/assets/Chase-Logo.png', white: false, h: 50 },
  { name: 'Columbia', src: '/assets/Columbia-logo.png', white: true, h: 55 },
  { name: 'BF Goodrich', src: '/assets/BFGoodrich-logo-3840x2160.png', white: false, h: 50 },
  { name: 'Kith', src: '/assets/kith_logo.png', white: true, h: 50 },
  { name: 'Brex', src: '/assets/Brex_Inc._Corporate_Logo.png', white: true, h: 40 },
  { name: 'Dr. Bronners', src: '/assets/bronner.png', white: false, h: 22 },
  { name: 'Old Navy', src: '/assets/old-navy-logo-png-transparent.png', white: false, h: 55 },
];

function LogoSet() {
  return (
    <>
      {BRAND_LOGOS.map((logo, i) => (
        <div
          key={i}
          style={{ width: '200px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '3rem', marginRight: '3rem', flexShrink: 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={logo.name}
            className={logo.white ? 'brightness-0 invert opacity-70' : 'opacity-80'}
            style={{ height: `${logo.h}px`, width: 'auto', maxWidth: '180px', objectFit: 'contain' }}
          />
        </div>
      ))}
    </>
  );
}

export function BrandLogos() {
  return (
    <section className="bg-transparent overflow-hidden" style={{ paddingTop: '7rem', paddingBottom: '7rem' }}>
      <RevealSection>
        <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/20 text-center" style={{ marginBottom: '4rem' }}>
          Selected Clients
        </p>
      </RevealSection>

      <div className="relative bg-[#1a1a1a] border-y border-white/[0.06]" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#1a1a1a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#1a1a1a] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max logo-marquee">
          <div className="flex shrink-0">
            <LogoSet />
          </div>
          <div className="flex shrink-0" aria-hidden="true">
            <LogoSet />
          </div>
        </div>
      </div>
    </section>
  );
}
