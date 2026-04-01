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
    <section className="py-32 sm:py-44 bg-bg-base overflow-hidden">
      <RevealSection>
        <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/20 text-center mb-20 sm:mb-28">
          Selected Clients
        </p>
      </RevealSection>

      <div className="relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

        <div className="marquee-track flex">
          <div className="marquee-inner flex items-center shrink-0 animate-marquee">
            {BRAND_LOGOS.map((logo, i) => (
              <div
                key={`a-${logo.name}-${i}`}
                className="shrink-0 mx-10 sm:mx-16"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={140}
                  height={50}
                  className="h-8 sm:h-10 w-auto object-contain invert opacity-30 hover:opacity-60 transition-opacity duration-500"
                  unoptimized
                />
              </div>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="marquee-inner flex items-center shrink-0 animate-marquee" aria-hidden="true">
            {BRAND_LOGOS.map((logo, i) => (
              <div
                key={`b-${logo.name}-${i}`}
                className="shrink-0 mx-10 sm:mx-16"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={140}
                  height={50}
                  className="h-8 sm:h-10 w-auto object-contain invert opacity-30 hover:opacity-60 transition-opacity duration-500"
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
