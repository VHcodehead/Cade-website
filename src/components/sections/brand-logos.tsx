'use client';

import { RevealSection } from '@/components/animations/reveal-section';

const BRAND_LOGOS = [
  { name: 'Nike', src: '/assets/brands/nike.png', white: true },
  { name: 'Disney', src: '/assets/brands/disney.png', white: true },
  { name: 'Lululemon', src: '/assets/brands/lululemon.png', white: true },
  { name: 'Chase', src: '/assets/brands/chase.png', white: false },
  { name: 'Columbia', src: '/assets/brands/columbia.png', white: true },
  { name: 'BF Goodrich', src: '/assets/brands/bfgoodrich.png', white: false },
  { name: 'Kith', src: '/assets/brands/kith.png', white: true },
  { name: 'Brex', src: '/assets/brands/brex.png', white: true },
  { name: 'Dr. Bronners', src: '/assets/brands/bronner.png', white: false },
  { name: 'Old Navy', src: '/assets/brands/oldnavy.png', white: false },
];

function LogoSet() {
  return (
    <>
      {BRAND_LOGOS.map((logo, i) => (
        <div
          key={i}
          style={{ width: '200px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '3rem', marginRight: '3rem', flexShrink: 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={logo.name}
            className={logo.white ? 'brightness-0 invert opacity-70' : 'opacity-80'}
            style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
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
