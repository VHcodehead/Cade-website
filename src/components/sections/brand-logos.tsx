'use client';

import { RevealSection } from '@/components/animations/reveal-section';

const BRAND_NAMES = [
  'Nike',
  'Disney',
  'Lululemon',
  'Chase',
  'Columbia',
  'BF Goodrich',
  'Kith',
  'Brex',
  'Dr. Bronner\'s',
  'Dick\'s Sporting Goods',
  'Old Navy',
  'Digital Realty',
  'Culinary Institute',
];

export function BrandLogos() {
  return (
    <section className="py-28 sm:py-36 bg-bg-base overflow-hidden">
      <RevealSection>
        <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/20 text-center mb-20 sm:mb-28">
          Selected Clients
        </p>
      </RevealSection>

      {/* Endless scrolling marquee — brand names as text */}
      <div className="relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

        <div className="marquee-track flex">
          <div className="marquee-inner flex items-center shrink-0 animate-marquee">
            {[...BRAND_NAMES, ...BRAND_NAMES].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="shrink-0 px-8 sm:px-12 text-[13px] sm:text-[15px] uppercase tracking-[0.25em] text-text-muted/20 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {name}
              </span>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="marquee-inner flex items-center shrink-0 animate-marquee" aria-hidden="true">
            {[...BRAND_NAMES, ...BRAND_NAMES].map((name, i) => (
              <span
                key={`dup-${name}-${i}`}
                className="shrink-0 px-8 sm:px-12 text-[13px] sm:text-[15px] uppercase tracking-[0.25em] text-text-muted/20 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
