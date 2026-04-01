import { db } from '@/lib/db';

export async function Footer() {
  const siteConfig = await db.siteConfig.findFirst();
  const contactEmail = siteConfig?.contactEmail ?? 'hello@vlacovision.com';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-base pt-32 sm:pt-40 pb-10">
      {/* Top divider — subtle */}
      <div className="mx-6 sm:mx-10 lg:mx-16 border-t border-border-subtle" />

      <div className="px-6 sm:px-10 lg:px-16 pt-16 sm:pt-20">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-24 sm:mb-32">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <p
              className="text-text-primary uppercase tracking-[0.25em] text-sm mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              VLACOVISION
            </p>
            <p className="text-[13px] text-text-muted/30 leading-relaxed">
              Premium video production
              <br />
              Bay Area &amp; worldwide
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/25 mb-6">
              Navigation
            </p>
            <ul className="flex flex-col gap-3 list-none">
              <li>
                <a
                  href="#work"
                  className="text-[13px] text-text-muted/50 transition-colors duration-300 hover:text-text-primary"
                >
                  Work
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-[13px] text-text-muted/50 transition-colors duration-300 hover:text-text-primary"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-[13px] text-text-muted/50 transition-colors duration-300 hover:text-text-primary"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/25 mb-6">
              Get in Touch
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-[13px] text-text-muted/50 transition-colors duration-300 hover:text-text-primary"
            >
              {contactEmail}
            </a>
          </div>

          {/* Column 4: Social */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/25 mb-6">
              Follow
            </p>
            <ul className="flex flex-col gap-3 list-none">
              <li>
                <a
                  href="https://www.instagram.com/vlacovision"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-text-muted/50 transition-colors duration-300 hover:text-text-primary"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://vimeo.com/vlacovision"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-text-muted/50 transition-colors duration-300 hover:text-text-primary"
                >
                  Vimeo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar — copyright, very quiet */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-border-subtle">
          <p className="text-[10px] text-text-muted/20 uppercase tracking-[0.2em]">
            &copy; {year} VLACOVISION
          </p>
          <p className="text-[10px] text-text-muted/15 uppercase tracking-[0.2em]">
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
