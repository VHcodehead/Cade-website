import { db } from '@/lib/db';
import { RevealSection } from '@/components/animations/reveal-section';

export async function About() {
  const config = await db.siteConfig.findFirst();
  const aboutText = config?.aboutText ?? '';

  const paragraphs = aboutText
    .split(/\n\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="about" className="py-40 sm:py-52 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Left column — label and heading */}
            <div className="lg:col-span-4">
              <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted/30 mb-6">
                About
              </p>
              <h2
                className="text-[clamp(1.5rem,3vw,2.5rem)] uppercase tracking-[0.12em] text-text-primary leading-[1.1]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Creative
                <br />
                Vision
              </h2>
            </div>

            {/* Right column — body text */}
            <div className="lg:col-span-8 lg:pt-2">
              <div className="space-y-7">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-[15px] sm:text-base text-text-muted/60 leading-[1.85] tracking-wide"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-[15px] sm:text-base text-text-muted/60 leading-[1.85] tracking-wide">
                    A San Francisco Bay Area production house specializing in bold, authentic storytelling through film. We bring creative vision to life through production, post-production, and creative direction for brands that want to make an impact.
                  </p>
                )}
              </div>

              {/* Subtle stat line */}
              <div className="mt-16 pt-10 border-t border-border-subtle flex flex-wrap gap-16">
                <div>
                  <p className="text-2xl sm:text-3xl text-text-primary font-heading tracking-wider">10+</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/30 mt-2">Years</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl text-text-primary font-heading tracking-wider">50+</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/30 mt-2">Projects</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl text-text-primary font-heading tracking-wider">Global</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/30 mt-2">Reach</p>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
