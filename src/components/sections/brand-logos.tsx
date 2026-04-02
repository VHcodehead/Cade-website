'use client';

import Image from 'next/image';
import { RevealSection } from '@/components/animations/reveal-section';

const BRAND_LOGOS = [
  { name: 'Nike', src: '/assets/Nike-Logo.png', white: true },
  { name: 'Disney', src: '/assets/Disney_logo.png', white: true },
  { name: 'Lululemon', src: '/assets/lululemon.png', white: true },
  { name: 'Chase', src: '/assets/Chase-Logo.png', white: false },
  { name: 'Columbia', src: '/assets/Columbia-logo.png', white: true },
  { name: 'BF Goodrich', src: '/assets/BFGoodrich-logo-3840x2160.png', white: false },
  { name: 'Kith', src: '/assets/kith_logo.png', white: true },
  { name: 'Brex', src: '/assets/Brex_Inc._Corporate_Logo.png', white: true },
  { name: 'Dr. Bronners', src: '/assets/bronner.png', white: false },
  { name: 'Old Navy', src: '/assets/old-navy-logo-png-transparent.png', white: false },
];

function LogoSet() {
  return (
    <>
      {BRAND_LOGOS.map((logo, i) => (
        <div
          key={i}
          className="shrink-0 flex items-center justify-center"
          style={{ width: '200px', height: '70px', marginLeft: '3rem', marginRight: '3rem' }}
        >
          <Image
            src={logo.src}
            alt={logo.name}
            width={180}
            height={60}
            className={`max-h-[40px] sm:max-h-[50px] w-auto max-w-[160px] sm:max-w-[180px] object-contain ${
              logo.white ? 'brightness-0 invert opacity-70' : 'opacity-80'
            }`}
            unoptimized
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

      <div className="relative bg-[#1a1a1a] border-y border-white/[0.06]" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
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
