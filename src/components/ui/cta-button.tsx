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
        className="inline-block px-10 py-4 text-xs font-medium uppercase tracking-[0.25em] text-white border border-white/20 hover:border-accent hover:text-accent transition-colors duration-300"
        whileHover={{ scale: 1.02 }}
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
      className="inline-block px-10 py-4 text-xs font-medium uppercase tracking-[0.25em] text-text-muted border border-white/10 hover:border-white/40 hover:text-text-primary transition-colors duration-300"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: DURATION.fast, ease: 'easeOut' }}
    >
      {children}
    </m.a>
  );
}
