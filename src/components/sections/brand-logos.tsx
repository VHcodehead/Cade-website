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
    <section className="py-20 sm:py-28 bg-bg-base overflow-hidden">
      <RevealSection>
        <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/30 text-center mb-16 sm:mb-20">
          Selected Clients
        </p>
      </RevealSection>

      <div
        className="relative flex"
        onMouseEnter={(e) => {
          const inner = e.currentTarget.querySelector('.marquee-inner') as HTMLElement | null;
          if (inner) inner.style.animationPlayState = 'paused';
        }}
        onMouseLeave={(e) => {
          const inner = e.currentTarget.querySelector('.marquee-inner') as HTMLElement | null;
          if (inner) inner.style.animationPlayState = 'running';
        }}
      >
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

        <div className="marquee-inner flex items-center gap-20 sm:gap-28 animate-marquee">
          {[...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex-shrink-0 grayscale opacity-25 hover:grayscale-0 hover:opacity-60 transition-all duration-700"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={120}
                height={40}
                className="h-6 sm:h-7 w-auto object-contain invert"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
