'use client';

import { RevealSection } from '@/components/animations/reveal-section';

export type LogoItem = {
  name: string;
  src: string;
  white: boolean;
};

function LogoSet({ logos }: { logos: LogoItem[] }) {
  return (
    <>
      {logos.map((logo, i) => (
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

export function BrandLogosMarquee({ logos }: { logos: LogoItem[] }) {
  if (logos.length === 0) return null;

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
            <LogoSet logos={logos} />
          </div>
          <div className="flex shrink-0" aria-hidden="true">
            <LogoSet logos={logos} />
          </div>
        </div>
      </div>
    </section>
  );
}
