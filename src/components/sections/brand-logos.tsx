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
  { name: 'Dicks Sporting Goods', src: '/assets/dicks_sporting_goods-logo-brand.png' },
  { name: 'Old Navy', src: '/assets/old-navy-logo-png-transparent.png' },
  { name: 'Digital Realty', src: '/assets/Digital_Realty_TM_Brandmark_RGB_Black.png' },
  { name: 'Culinary Institute', src: '/assets/culinary-institute.png' },
];

export function BrandLogos() {
  return (
    <section className="py-32 sm:py-40 bg-transparent">
      <RevealSection>
        <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/20 text-center mb-16 sm:mb-24">
          Selected Clients
        </p>
      </RevealSection>

      {/* Frosted glass strip */}
      <div className="relative py-10 sm:py-14 bg-white/[0.03] backdrop-blur-sm border-y border-white/[0.04]">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

        <div className="marquee-track flex overflow-hidden">
          <div className="marquee-scroll flex items-center shrink-0">
            {BRAND_LOGOS.map((logo, i) => (
              <div key={`a-${i}`} className="shrink-0 mx-8 sm:mx-14">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={140}
                  height={50}
                  className="h-7 sm:h-9 w-auto object-contain brightness-0 invert opacity-40"
                  unoptimized
                />
              </div>
            ))}
          </div>
          <div className="marquee-scroll flex items-center shrink-0" aria-hidden="true">
            {BRAND_LOGOS.map((logo, i) => (
              <div key={`b-${i}`} className="shrink-0 mx-8 sm:mx-14">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={140}
                  height={50}
                  className="h-7 sm:h-9 w-auto object-contain brightness-0 invert opacity-40"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
