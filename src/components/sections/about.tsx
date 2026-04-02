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
    <section id="about" className="px-6 sm:px-10 lg:px-16" style={{ scrollMarginTop: '6rem' }}>

      {/* ── About Story ── */}
      <div style={{ maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', paddingTop: '6rem', paddingBottom: '6rem' }}>
        <RevealSection>
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.4em] text-text-muted/20" style={{ marginBottom: '2rem' }}>
              About
            </p>
            <h2
              className="text-[clamp(1.25rem,2.5vw,2rem)] uppercase tracking-[0.15em] text-text-primary leading-[1.15]"
              style={{ fontFamily: 'var(--font-heading)', marginBottom: '3rem' }}
            >
              {aboutHeading}
            </h2>
            <div>
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[14px] text-text-muted/40 leading-[1.9] tracking-wide"
                    style={{ marginBottom: i < paragraphs.length - 1 ? '1.25rem' : 0 }}
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
        <div style={{ paddingTop: '7rem', paddingBottom: '7rem' }}>
          <RevealSection>
            <p className="text-[9px] uppercase tracking-[0.4em] text-text-muted/20 text-center" style={{ marginBottom: '3.5rem' }}>
              The Team
            </p>
          </RevealSection>
          <div className="flex flex-wrap justify-center" style={{ gap: '3rem 4rem' }}>
            {teamMembers.map((member) => (
              <RevealSection key={member.id}>
                <div className="text-center group flex flex-col items-center" style={{ width: '220px' }}>
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="rounded-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                      style={{ width: '128px', height: '128px', marginBottom: '1.5rem' }}
                    />
                  ) : (
                    <div className="rounded-full bg-white/[0.04]" style={{ width: '128px', height: '128px', marginBottom: '1.5rem' }} />
                  )}
                  <p
                    className="text-[13px] uppercase tracking-[0.12em] text-text-primary/80"
                    style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.375rem' }}
                  >
                    {member.name}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted/25">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-[13px] text-text-muted/30 leading-[1.7]" style={{ marginTop: '1rem', maxWidth: '220px' }}>
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
        <div style={{ maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', paddingTop: '7rem', paddingBottom: '7rem' }}>
          <RevealSection>
            <p className="text-[9px] uppercase tracking-[0.4em] text-text-muted/20 text-center" style={{ marginBottom: '3.5rem' }}>
              Kind Words
            </p>
          </RevealSection>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            {testimonials.map((testimonial) => (
              <RevealSection key={testimonial.id}>
                <blockquote className="text-center">
                  <p
                    className="text-[clamp(1rem,1.8vw,1.25rem)] italic text-text-primary/50 leading-[1.8] tracking-wide"
                    style={{ fontFamily: 'var(--font-body)', marginBottom: '2.5rem', maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto' }}
                  >
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <footer>
                    <p className="text-[12px] uppercase tracking-[0.2em] text-text-primary/60">
                      {testimonial.personName}
                    </p>
                    {(testimonial.personTitle || testimonial.company) && (
                      <p className="text-[11px] uppercase tracking-[0.15em] text-text-muted/25" style={{ marginTop: '0.5rem' }}>
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
      <div style={{ maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', paddingTop: '6rem', paddingBottom: '6rem' }}>
        <RevealSection>
          <div className="flex justify-center" style={{ gap: '4rem', paddingTop: '2.5rem', paddingBottom: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-center">
              <p className="text-lg sm:text-xl text-text-primary/70 font-heading tracking-wider">10+</p>
              <p className="text-[8px] uppercase tracking-[0.3em] text-text-muted/15" style={{ marginTop: '0.5rem' }}>Years</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl text-text-primary/70 font-heading tracking-wider">50+</p>
              <p className="text-[8px] uppercase tracking-[0.3em] text-text-muted/15" style={{ marginTop: '0.5rem' }}>Projects</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl text-text-primary/70 font-heading tracking-wider">Global</p>
              <p className="text-[8px] uppercase tracking-[0.3em] text-text-muted/15" style={{ marginTop: '0.5rem' }}>Reach</p>
            </div>
          </div>
        </RevealSection>
      </div>

      {/* ── CTA ── */}
      <div style={{ maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', paddingTop: '7rem', paddingBottom: '7rem' }}>
        <RevealSection>
          <div className="text-center">
            <p
              className="text-[clamp(1rem,2vw,1.35rem)] uppercase tracking-[0.15em] text-text-primary/60 leading-tight"
              style={{ fontFamily: 'var(--font-heading)', marginBottom: '3.5rem' }}
            >
              {ctaHeading}
            </p>
            <CTAButton variant="primary" href="/#contact">
              {ctaButtonText}
            </CTAButton>
          </div>
        </RevealSection>
      </div>

    </section>
  );
}
