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
      <div className="max-w-3xl mx-auto text-center">
        <RevealSection>
          <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/20 mb-8">
            About
          </p>
          <h2
            className="text-[clamp(1.75rem,3.5vw,3rem)] uppercase tracking-[0.12em] text-text-primary leading-[1.1] mb-12"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Creative Vision
          </h2>
        </RevealSection>

        <RevealSection>
          <div className="mb-16">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[15px] text-text-muted/45 leading-[1.9] tracking-wide mb-6 last:mb-0"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-[15px] text-text-muted/45 leading-[1.9] tracking-wide">
                A San Francisco Bay Area production house specializing in bold, authentic storytelling through film. We bring creative vision to life through production, post-production, and creative direction for brands that want to make an impact.
              </p>
            )}
          </div>
        </RevealSection>

        {/* Stats */}
        <RevealSection>
          <div className="flex justify-center gap-16 sm:gap-24 mb-20 py-10 border-t border-b border-white/[0.06]">
            <div>
              <p className="text-2xl sm:text-3xl text-text-primary font-heading tracking-wider">10+</p>
              <p className="text-[9px] uppercase tracking-[0.3em] text-text-muted/20 mt-2">Years</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl text-text-primary font-heading tracking-wider">50+</p>
              <p className="text-[9px] uppercase tracking-[0.3em] text-text-muted/20 mt-2">Projects</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl text-text-primary font-heading tracking-wider">Global</p>
              <p className="text-[9px] uppercase tracking-[0.3em] text-text-muted/20 mt-2">Reach</p>
            </div>
          </div>
        </RevealSection>

        {/* CTA — integrated, not a separate section */}
        <RevealSection>
          <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/15 mb-8">
            Ready?
          </p>
          <p
            className="text-[clamp(1.25rem,2.5vw,1.75rem)] uppercase tracking-[0.12em] text-text-primary/80 mb-12 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Let&apos;s create something worth watching.
          </p>
          <CTAButton variant="primary" href="#contact">
            Start a Project
          </CTAButton>
        </RevealSection>
      </div>
    </section>
  );
}
