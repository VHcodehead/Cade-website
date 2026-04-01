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
        className="group relative inline-flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.25em] text-text-primary transition-colors duration-500 hover:text-accent"
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: DURATION.fast, ease: 'easeOut' }}
      >
        <span>{children}</span>
        <span className="inline-block w-8 h-[1px] bg-current transition-all duration-500 group-hover:w-12" />
      </m.a>
    );
  }

  return (
    <m.a
      href={href}
      className="group relative inline-flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.25em] text-text-muted/50 transition-colors duration-500 hover:text-text-primary"
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: DURATION.fast, ease: 'easeOut' }}
    >
      <span>{children}</span>
      <span className="inline-block w-6 h-[1px] bg-current transition-all duration-500 group-hover:w-10" />
    </m.a>
  );
}
