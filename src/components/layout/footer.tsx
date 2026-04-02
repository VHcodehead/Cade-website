import { db } from '@/lib/db';

export async function Footer() {
  const siteConfig = await db.siteConfig.findFirst();
  const contactEmail = siteConfig?.contactEmail ?? 'cade@vlacovision.com';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A]" style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '2rem', paddingRight: '2rem' }}>

        {/* Top CTA — compact */}
        <div className="text-center" style={{ paddingBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <a href="/#contact" className="group inline-flex items-center gap-3">
            <span
              className="text-[12px] uppercase tracking-[0.2em] text-text-muted/30 group-hover:text-accent transition-colors duration-500"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Start a Project
            </span>
            <span className="inline-block w-6 h-[1px] bg-current transition-all duration-500 group-hover:w-12 text-text-muted/20 group-hover:text-accent" />
          </a>
        </div>

        {/* Main footer — all in one row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>

          {/* Left — Logo + tagline + email */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo-cream.png"
              alt="VLACOVISION"
              style={{ height: '1.4rem', width: 'auto', objectFit: 'contain', marginBottom: '0.75rem' }}
            />
            <p className="text-[11px] text-text-muted/20 leading-[1.7]">
              Premium video production · Bay Area &amp; worldwide
            </p>
            <a
              href="mailto:cade@vlacovision.com"
              className="text-[11px] text-text-muted/35 hover:text-accent transition-colors duration-300"
              style={{ marginTop: '0.5rem', display: 'inline-block' }}
            >
              cade@vlacovision.com
            </a>
          </div>

          {/* Right — Links in a row */}
          <div className="flex gap-14 sm:gap-20">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-text-muted/15" style={{ marginBottom: '0.75rem' }}>Navigate</p>
              <ul className="flex flex-col list-none" style={{ gap: '0.5rem' }}>
                <li><a href="/#work" className="text-[11px] text-text-muted/30 hover:text-text-primary transition-colors duration-300">Work</a></li>
                <li><a href="/#about" className="text-[11px] text-text-muted/30 hover:text-text-primary transition-colors duration-300">About</a></li>
                <li><a href="/#contact" className="text-[11px] text-text-muted/30 hover:text-text-primary transition-colors duration-300">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-text-muted/15" style={{ marginBottom: '0.75rem' }}>Follow</p>
              <ul className="flex flex-col list-none" style={{ gap: '0.5rem' }}>
                <li><a href="https://www.instagram.com/vlacovision" target="_blank" rel="noopener noreferrer" className="text-[11px] text-text-muted/30 hover:text-text-primary transition-colors duration-300">Instagram</a></li>
                <li><a href="https://vimeo.com/vlacovision" target="_blank" rel="noopener noreferrer" className="text-[11px] text-text-muted/30 hover:text-text-primary transition-colors duration-300">Vimeo</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-[9px] text-text-muted/12 uppercase tracking-[0.2em] text-center">
            &copy; {year} VLACOVISION
          </p>
        </div>

      </div>
    </footer>
  );
}
