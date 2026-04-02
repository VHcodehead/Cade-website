'use client';

import Image from 'next/image';
import { RevealSection } from '@/components/animations/reveal-section';

const BRAND_LOGOS = [
  { name: 'Nike', src: '/assets/Nike-Logo.png' },
  { name: 'Disney', src: '/assets/Disney_logo.png' },
  { name: 'Lululemon', src: '/assets/lululemon.png' },
  { name: 'Chase', src: '/assets/Chase-Logo.png' },
  { name: 'Columbia', src: '/assets/Columbia-logo.png' },
  { name: 'BF Goodrich', src: '/assets/BFGoodrich-logo-3840x2160.png' },
  { name: 'Kith', src: '/assets/kith_logo.png' },
  { name: 'Brex', src: '/assets/Brex_Inc._Corporate_Logo.png' },
  { name: 'Dr. Bronners', src: '/assets/bronner.png' },
  { name: 'Old Navy', src: '/assets/old-navy-logo-png-transparent.png' },
];

function LogoSet() {
  return (
    <>
      {BRAND_LOGOS.map((logo, i) => (
        <div
          key={i}
          className="shrink-0 w-[160px] sm:w-[200px] h-[60px] sm:h-[70px] flex items-center justify-center mx-8 sm:mx-12 lg:mx-16"
        >
          <Image
            src={logo.src}
            alt={logo.name}
            width={180}
            height={60}
            className="max-h-[40px] sm:max-h-[50px] w-auto max-w-[160px] sm:max-w-[180px] object-contain brightness-0 invert opacity-70"
            unoptimized
          />
        </div>
      ))}
    </>
  );
}

export function BrandLogos() {
  return (
    <section className="py-28 sm:py-36 bg-transparent overflow-hidden">
      <RevealSection>
        <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/20 text-center mb-16 sm:mb-24">
          Selected Clients
        </p>
      </RevealSection>

      {/* Dark matte grey strip so all logos pop */}
      <div className="relative py-12 sm:py-16 bg-[#1a1a1a] border-y border-white/[0.06]">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#1a1a1a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#1a1a1a] to-transparent z-10 pointer-events-none" />

        {/* Seamless marquee */}
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
