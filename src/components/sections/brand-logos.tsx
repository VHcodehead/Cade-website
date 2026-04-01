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
    <section className="py-16 bg-bg-base overflow-hidden">
      <RevealSection>
        <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/50 text-center mb-10">
          Trusted By
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
        <div className="marquee-inner flex items-center gap-16 animate-marquee">
          {[...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={120}
                height={40}
                className="h-8 w-auto object-contain invert"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
