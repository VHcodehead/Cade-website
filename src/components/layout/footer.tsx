import { db } from '@/lib/db';

export async function Footer() {
  const siteConfig = await db.siteConfig.findFirst();
  const contactEmail = siteConfig?.contactEmail ?? 'cade@vlacovision.com';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A]" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
      <div className="px-6 sm:px-10 lg:px-16">

        {/* Top CTA */}
        <div className="text-center" style={{ paddingBottom: '5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <a
            href="/#contact"
            className="group inline-flex items-center gap-3"
          >
            <span
              className="text-[clamp(0.85rem,1.5vw,1.1rem)] uppercase tracking-[0.2em] text-text-muted/30 group-hover:text-accent transition-colors duration-500"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Start a Project
            </span>
            <span className="inline-block w-6 h-[1px] bg-current transition-all duration-500 group-hover:w-12 text-text-muted/20 group-hover:text-accent" />
          </a>
        </div>

        {/* Main footer content */}
        <div style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="flex flex-col lg:flex-row lg:justify-between gap-16 lg:gap-24">

            {/* Left — Logo + tagline + email */}
            <div className="lg:max-w-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logo-cream.png"
                alt="VLACOVISION"
                style={{ height: '1.8rem', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }}
              />
              <p className="text-[12px] text-text-muted/20 leading-[1.8]" style={{ marginBottom: '1.5rem' }}>
                Premium video production for brands that move people.
                <br />
                San Francisco Bay Area &amp; worldwide.
              </p>
              <a
                href="mailto:cade@vlacovision.com"
                className="text-[13px] text-text-muted/40 hover:text-accent transition-colors duration-300"
              >
                cade@vlacovision.com
              </a>
            </div>

            {/* Right — Two link columns */}
            <div className="flex gap-20 sm:gap-28">
              {/* Navigation */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-text-muted/15" style={{ marginBottom: '1.5rem' }}>
                  Navigate
                </p>
                <ul className="flex flex-col list-none" style={{ gap: '0.85rem' }}>
                  <li>
                    <a href="/#work" className="text-[12px] text-text-muted/30 transition-colors duration-300 hover:text-text-primary">
                      Work
                    </a>
                  </li>
                  <li>
                    <a href="/#about" className="text-[12px] text-text-muted/30 transition-colors duration-300 hover:text-text-primary">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="/#contact" className="text-[12px] text-text-muted/30 transition-colors duration-300 hover:text-text-primary">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-text-muted/15" style={{ marginBottom: '1.5rem' }}>
                  Follow
                </p>
                <ul className="flex flex-col list-none" style={{ gap: '0.85rem' }}>
                  <li>
                    <a
                      href="https://www.instagram.com/vlacovision"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-text-muted/30 transition-colors duration-300 hover:text-text-primary"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://vimeo.com/vlacovision"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-text-muted/30 transition-colors duration-300 hover:text-text-primary"
                    >
                      Vimeo
                    </a>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Copyright — single centered line */}
        <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-[9px] text-text-muted/12 uppercase tracking-[0.2em] text-center">
            &copy; {year} VLACOVISION
          </p>
        </div>

      </div>
    </footer>
  );
}
