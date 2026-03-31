import { db } from '@/lib/db';
import { CTAButton } from '@/components/ui/cta-button';

export async function Footer() {
  const siteConfig = await db.siteConfig.findFirst();
  const contactEmail = siteConfig?.contactEmail ?? 'hello@vlacovision.com';
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-bg-base border-t border-bg-section"
      style={{ paddingTop: 'var(--spacing-16)', paddingBottom: 'var(--spacing-8)' }}
    >
      <div
        style={{ paddingLeft: 'var(--spacing-4)', paddingRight: 'var(--spacing-4)' }}
        className="max-w-7xl mx-auto"
      >
        {/* Three-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
          {/* Column 1: Brand + Location */}
          <div>
            <p className="font-heading text-text-primary uppercase tracking-widest font-bold text-lg mb-3">
              VLACOVISION
            </p>
            <p className="text-text-muted text-sm">Bay Area, CA</p>
          </div>

          {/* Column 2: Contact */}
          <div>
            <p className="text-text-primary uppercase tracking-widest text-sm font-bold mb-3">
              Contact
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-text-muted text-sm transition-colors hover:text-accent"
            >
              {contactEmail}
            </a>
          </div>

          {/* Column 3: Social */}
          <div>
            <p className="text-text-primary uppercase tracking-widest text-sm font-bold mb-3">
              Follow
            </p>
            <ul className="flex flex-col gap-2 list-none">
              <li>
                <a
                  href="https://www.instagram.com/vlacovision"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted text-sm transition-colors hover:text-accent"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://vimeo.com/vlacovision"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted text-sm transition-colors hover:text-accent"
                >
                  Vimeo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mb-12">
          <CTAButton variant="primary" href="/#contact">
            Start a Project
          </CTAButton>
        </div>

        {/* Copyright */}
        <p className="text-center text-text-muted text-xs uppercase tracking-widest">
          &copy; {year} VLACOVISION. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
