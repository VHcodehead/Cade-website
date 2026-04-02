'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-bg-base/90 backdrop-blur-md border-b border-border-subtle'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between h-20" style={{ paddingLeft: 'clamp(2.5rem, 5vw, 5rem)', paddingRight: 'clamp(2.5rem, 5vw, 5rem)' }}>
          {/* Logo */}
          <a href="/" className="flex items-center" style={scrolled ? { filter: 'sepia(0.6) saturate(2) hue-rotate(345deg)' } : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Asset 11 (1).png"
              alt="VLACOVISION"
              className="invert brightness-200"
              style={{
                height: '2rem',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-12 list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-[11px] uppercase tracking-[0.2em] text-text-muted/70 transition-colors duration-300 hover:text-text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2 text-text-primary"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${
                menuOpen ? 'translate-y-[6.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-current transition-all duration-300 ${
                menuOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${
                menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-40 bg-bg-base flex flex-col items-center justify-center md:hidden transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col items-center gap-12 list-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-text-primary uppercase text-lg tracking-[0.3em] font-heading transition-colors duration-300 hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Email in mobile menu */}
        <div className="absolute bottom-12 left-0 right-0 text-center">
          <a
            href="mailto:hello@vlacovision.com"
            className="text-[11px] uppercase tracking-[0.2em] text-text-muted/40 transition-colors duration-300 hover:text-text-muted"
          >
            hello@vlacovision.com
          </a>
        </div>
      </div>
    </>
  );
}
