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
    <section id="about" className="py-32 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <RevealSection>
          <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/50 mb-4">
            About
          </p>
          <h2
            className="text-3xl sm:text-5xl uppercase tracking-[0.15em] mb-12 text-text-primary"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Creative Vision
          </h2>
        </RevealSection>

        <RevealSection>
          <div className="space-y-6">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, i) => (
                <p key={i} className="text-base text-text-muted/70 leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-base text-text-muted/70 leading-relaxed">
                A San Francisco Bay Area production house specializing in bold, authentic storytelling through film. We bring creative vision to life through production, post-production, and creative direction for brands that want to make an impact.
              </p>
            )}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
