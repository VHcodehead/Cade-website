import { db } from '@/lib/db';
import { RevealSection } from '@/components/animations/reveal-section';
import { CTAButton } from '@/components/ui/cta-button';

export async function About() {
  const [config, teamMembers, testimonials] = await Promise.all([
    db.siteConfig.findFirst(),
    db.teamMember.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.testimonial.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  const aboutHeading = config?.aboutHeading || 'Vlacovision';
  const aboutText = config?.aboutText ?? '';
  const ctaHeading = config?.ctaHeading || "Let's create something worth watching.";
  const ctaButtonText = config?.ctaButtonText || 'Start a Project';

  const paragraphs = aboutText
    .split(/\n\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="about" className="py-32 sm:py-40 px-6 sm:px-10 lg:px-16">

      {/* ── About Story ── */}
      <div style={{ maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
        <RevealSection>
          <div className="text-center mb-24 sm:mb-28">
            <p className="text-[9px] uppercase tracking-[0.4em] text-text-muted/20 mb-6">
              About
            </p>
            <h2
              className="text-[clamp(1.25rem,2.5vw,2rem)] uppercase tracking-[0.15em] text-text-primary leading-[1.15] mb-10"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {aboutHeading}
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
                  A San Francisco Bay Area production house specializing in bold, authentic
                  storytelling through film. We bring creative vision to life through
                  production, post-production, and creative direction for brands that want to
                  make an impact.
                </p>
              )}
            </div>
          </div>
        </RevealSection>
      </div>

      {/* ── Team ── */}
      {teamMembers.length > 0 && (
        <div className="max-w-5xl mx-auto py-24 sm:py-28">
          <RevealSection>
            <p className="text-[9px] uppercase tracking-[0.4em] text-text-muted/20 mb-16 text-center">
              The Team
            </p>
          </RevealSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14">
            {teamMembers.map((member) => (
              <RevealSection key={member.id}>
                <div className="text-center group">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover mx-auto mb-5 grayscale transition-all duration-700 group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/[0.04] mx-auto mb-5" />
                  )}
                  <p
                    className="text-[13px] uppercase tracking-[0.12em] text-text-primary/80 mb-1"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {member.name}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted/25">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-[13px] text-text-muted/30 leading-[1.7] mt-3 max-w-[220px] mx-auto">
                      {member.bio}
                    </p>
                  )}
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      )}

      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <div style={{ maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }} className="py-24 sm:py-28">
          <RevealSection>
            <p className="text-[9px] uppercase tracking-[0.4em] text-text-muted/20 mb-16 text-center">
              Kind Words
            </p>
          </RevealSection>
          <div className="space-y-20 sm:space-y-24">
            {testimonials.map((testimonial) => (
              <RevealSection key={testimonial.id}>
                <blockquote className="text-center">
                  <p
                    className="text-[clamp(1rem,1.8vw,1.25rem)] italic text-text-primary/50 leading-[1.8] tracking-wide max-w-2xl mx-auto mb-8"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <footer>
                    <p className="text-[12px] uppercase tracking-[0.2em] text-text-primary/60">
                      {testimonial.personName}
                    </p>
                    {(testimonial.personTitle || testimonial.company) && (
                      <p className="text-[11px] uppercase tracking-[0.15em] text-text-muted/25 mt-1">
                        {[testimonial.personTitle, testimonial.company]
                          .filter(Boolean)
                          .join(' — ')}
                      </p>
                    )}
                  </footer>
                </blockquote>
              </RevealSection>
            ))}
          </div>
        </div>
      )}

      {/* ── Stats ── */}
      <div style={{ maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
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

        {/* ── CTA ── */}
        <RevealSection>
          <div className="text-center">
            <p
              className="text-[clamp(1rem,2vw,1.35rem)] uppercase tracking-[0.15em] text-text-primary/60 mb-10 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {ctaHeading}
            </p>
            <CTAButton variant="primary" href="#contact">
              {ctaButtonText}
            </CTAButton>
          </div>
        </RevealSection>
      </div>

    </section>
  );
}
