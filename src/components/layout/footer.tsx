import { db } from '@/lib/db';

export async function Footer() {
  const siteConfig = await db.siteConfig.findFirst();
  const contactEmail = siteConfig?.contactEmail ?? 'hello@vlacovision.com';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] pt-20 sm:pt-24 pb-12">

      <div className="px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 sm:gap-20 mb-32 sm:mb-40">
          {/* Brand */}
          <div>
            <p
              className="text-text-primary uppercase tracking-[0.25em] text-sm mb-5"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              VLACOVISION
            </p>
            <p className="text-[12px] text-text-muted/20 leading-[1.8]">
              Premium video production
              <br />
              Bay Area &amp; worldwide
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/20 mb-7">
              Navigation
            </p>
            <ul className="flex flex-col gap-4 list-none">
              <li>
                <a href="#work" className="text-[12px] text-text-muted/40 transition-colors duration-300 hover:text-text-primary">
                  Work
                </a>
              </li>
              <li>
                <a href="#about" className="text-[12px] text-text-muted/40 transition-colors duration-300 hover:text-text-primary">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[12px] text-text-muted/40 transition-colors duration-300 hover:text-text-primary">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/20 mb-7">
              Get in Touch
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-[12px] text-text-muted/40 transition-colors duration-300 hover:text-text-primary"
            >
              {contactEmail}
            </a>
          </div>

          {/* Social */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted/20 mb-7">
              Follow
            </p>
            <ul className="flex flex-col gap-4 list-none">
              <li>
                <a
                  href="https://www.instagram.com/vlacovision"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-text-muted/40 transition-colors duration-300 hover:text-text-primary"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://vimeo.com/vlacovision"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-text-muted/40 transition-colors duration-300 hover:text-text-primary"
                >
                  Vimeo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-10 border-t border-border-subtle">
          <p className="text-[10px] text-text-muted/15 uppercase tracking-[0.2em]">
            &copy; {year} VLACOVISION
          </p>
          <p className="text-[10px] text-text-muted/10 uppercase tracking-[0.2em]">
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
