import { db } from '@/lib/db';
import { RevealSection } from '@/components/animations/reveal-section';
import { CTAButton } from '@/components/ui/cta-button';

export async function About() {
  const config = await db.siteConfig.findFirst();
  const aboutText = config?.aboutText ?? '';

  const paragraphs = aboutText
    .split(/\n\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="about" className="py-32 sm:py-40 px-6 sm:px-10 lg:px-16">
      <div className="w-full" style={{ maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>

        {/* About */}
        <RevealSection>
          <div className="text-center mb-24 sm:mb-28">
            <p className="text-[9px] uppercase tracking-[0.4em] text-text-muted/20 mb-6">
              About
            </p>
            <h2
              className="text-[clamp(1.25rem,2.5vw,2rem)] uppercase tracking-[0.15em] text-text-primary leading-[1.15] mb-10"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Vlacovision
            </h2>
            <div>
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[14px] text-text-muted/40 leading-[1.9] tracking-wide mb-5 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-[14px] text-text-muted/40 leading-[1.9] tracking-wide">
                  A San Francisco Bay Area production house specializing in bold, authentic storytelling through film. We bring creative vision to life through production, post-production, and creative direction for brands that want to make an impact.
                </p>
              )}
            </div>
          </div>
        </RevealSection>

        {/* Stats — more subtle */}
        <RevealSection>
          <div className="flex justify-center gap-14 sm:gap-20 mb-24 sm:mb-28 py-8 border-t border-b border-white/[0.05]">
            <div className="text-center">
              <p className="text-lg sm:text-xl text-text-primary/70 font-heading tracking-wider">10+</p>
              <p className="text-[8px] uppercase tracking-[0.3em] text-text-muted/15 mt-2">Years</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl text-text-primary/70 font-heading tracking-wider">50+</p>
              <p className="text-[8px] uppercase tracking-[0.3em] text-text-muted/15 mt-2">Projects</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl text-text-primary/70 font-heading tracking-wider">Global</p>
              <p className="text-[8px] uppercase tracking-[0.3em] text-text-muted/15 mt-2">Reach</p>
            </div>
          </div>
        </RevealSection>

        {/* CTA */}
        <RevealSection>
          <div className="text-center">
            <p
              className="text-[clamp(1rem,2vw,1.35rem)] uppercase tracking-[0.15em] text-text-primary/60 mb-10 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Let&apos;s create something worth watching.
            </p>
            <CTAButton variant="primary" href="#contact">
              Start a Project
            </CTAButton>
          </div>
        </RevealSection>

      </div>
    </section>
  );
}
