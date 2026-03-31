'use client';

import Image from 'next/image';

const BRAND_LOGOS = [
  { name: 'AETHER', src: '/assets/AETHER_PNG.png' },
  { name: 'Asset 11', src: '/assets/Asset 11 (1).png' },
  { name: 'Asset 12', src: '/assets/Asset_12.png' },
  { name: 'BF Goodrich', src: '/assets/BFGoodrich-logo-3840x2160.png' },
  { name: 'Brex', src: '/assets/Brex_Inc._Corporate_Logo.png' },
  { name: 'Chase', src: '/assets/Chase-Logo.png' },
  { name: 'Columbia', src: '/assets/Columbia-logo.png' },
  { name: 'Digital Realty', src: '/assets/Digital_Realty_TM_Brandmark_RGB_Black.png' },
  { name: 'Disney', src: '/assets/Disney_logo.png' },
  { name: 'MEWO', src: '/assets/LOGO_noBG.jpg' },
  { name: 'Nike', src: '/assets/Nike-Logo.png' },
  { name: 'Bronner', src: '/assets/bronner.png' },
  { name: 'Culinary Institute', src: '/assets/culinary-institute.png' },
  { name: "Dick's Sporting Goods", src: '/assets/dicks_sporting_goods-logo-brand.png' },
  { name: 'Girl Swirl', src: '/assets/grlswirl.png' },
  { name: 'JuneShine', src: '/assets/juneshine.png' },
  { name: 'KITH', src: '/assets/kith_logo.png' },
  { name: 'lululemon', src: '/assets/lululemon.png' },
  { name: 'Old Navy', src: '/assets/old-navy-logo-png-transparent.png' },
];

export function BrandLogos() {
  return (
    <section className="py-spacing-8 bg-bg-base overflow-hidden">
      <p className="text-xs uppercase tracking-widest text-text-muted text-center mb-6">
        TRUSTED BY
      </p>

      {/* Marquee container */}
      <div
        className="relative flex"
        style={{ willChange: 'transform' }}
        onMouseEnter={(e) => {
          const inner = e.currentTarget.querySelector('.marquee-inner') as HTMLElement | null;
          if (inner) inner.style.animationPlayState = 'paused';
        }}
        onMouseLeave={(e) => {
          const inner = e.currentTarget.querySelector('.marquee-inner') as HTMLElement | null;
          if (inner) inner.style.animationPlayState = 'running';
        }}
      >
        {/* Two identical sets for seamless loop */}
        <div
          className="marquee-inner flex gap-12 items-center"
          style={{
            animation: 'marquee 30s linear infinite',
            display: 'flex',
            gap: '3rem',
          }}
        >
          {/* First copy */}
          {BRAND_LOGOS.map((logo) => (
            <div
              key={`a-${logo.name}`}
              className="flex-shrink-0 h-10 w-auto relative"
              style={{ minWidth: '80px' }}
            >
              <Image
                src={logo.src}
                alt={logo.name}
                height={40}
                width={120}
                className="object-contain h-10 w-auto"
                style={{
                  filter: 'grayscale(100%)',
                  transition: 'filter 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0%)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(100%)';
                }}
              />
            </div>
          ))}
          {/* Second copy for seamless infinite loop */}
          {BRAND_LOGOS.map((logo) => (
            <div
              key={`b-${logo.name}`}
              className="flex-shrink-0 h-10 w-auto relative"
              style={{ minWidth: '80px' }}
            >
              <Image
                src={logo.src}
                alt={logo.name}
                height={40}
                width={120}
                className="object-contain h-10 w-auto"
                style={{
                  filter: 'grayscale(100%)',
                  transition: 'filter 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0%)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(100%)';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
