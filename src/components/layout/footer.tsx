import { db } from '@/lib/db';

export async function Footer() {
  const siteConfig = await db.siteConfig.findFirst();
  const contactEmail = siteConfig?.contactEmail ?? 'cade@vlacovision.com';
  const rawInsta = siteConfig?.instagramUrl ?? 'https://www.instagram.com/vlacovision';
  const rawVimeo = siteConfig?.vimeoProfileUrl ?? 'https://vimeo.com/vlacovision';
  const instagramUrl = rawInsta.startsWith('http') ? rawInsta : 'https://' + rawInsta;
  const vimeoProfileUrl = rawVimeo.startsWith('http') ? rawVimeo : 'https://' + rawVimeo;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A]" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
      <div style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '2rem', paddingRight: '2rem' }}>

        {/* Main footer */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10" style={{ paddingTop: '1rem', paddingBottom: '2.5rem' }}>

          {/* Left */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo-cream.png"
              alt="VLACOVISION"
              style={{ height: '1.4rem', width: 'auto', objectFit: 'contain', marginBottom: '0.75rem' }}
            />
            <a
              href={`mailto:${contactEmail}`}
              className="text-[11px] text-white/60 hover:text-accent transition-colors duration-300"
            >
              {contactEmail}
            </a>
          </div>

          {/* Right */}
          <div className="flex gap-14 sm:gap-20">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/25" style={{ marginBottom: '0.75rem' }}>Navigate</p>
              <ul className="flex flex-col list-none" style={{ gap: '0.5rem' }}>
                <li><a href="/#work" className="text-[11px] text-white/50 hover:text-white transition-colors duration-300">Work</a></li>
                <li><a href="/#about" className="text-[11px] text-white/50 hover:text-white transition-colors duration-300">About</a></li>
                <li><a href="/#contact" className="text-[11px] text-white/50 hover:text-white transition-colors duration-300">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/25" style={{ marginBottom: '0.75rem' }}>Follow</p>
              <ul className="flex flex-col list-none" style={{ gap: '0.5rem' }}>
                <li><a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-white/50 hover:text-white transition-colors duration-300">Instagram</a></li>
                <li><a href={vimeoProfileUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-white/50 hover:text-white transition-colors duration-300">Vimeo</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] text-center">
            &copy; {year} VLACOVISION
          </p>
        </div>

      </div>
    </footer>
  );
}
