'use client';

import type { ReactNode } from 'react';
import { m } from 'framer-motion';
import { DURATION } from '@/lib/animation-config';

interface CTAButtonProps {
  variant: 'primary' | 'secondary';
  href: string;
  children: ReactNode;
}

export function CTAButton({ variant, href, children }: CTAButtonProps) {
  if (variant === 'primary') {
    return (
      <m.a
        href={href}
        className="inline-block px-8 py-3 bg-accent text-white font-bold uppercase tracking-widest"
        whileHover={{ scale: 1.03, filter: 'brightness(1.12)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: DURATION.fast, ease: 'easeOut' }}
      >
        {children}
      </m.a>
    );
  }

  return (
    <m.a
      href={href}
      className="inline-block px-8 py-3 border border-text-muted text-text-primary uppercase tracking-widest"
      whileHover={{ scale: 1.03, filter: 'brightness(1.12)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: DURATION.fast, ease: 'easeOut' }}
    >
      {children}
    </m.a>
  );
}
