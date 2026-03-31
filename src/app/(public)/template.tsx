'use client';
import { m } from 'framer-motion';
import { EASING_CINEMATIC, DURATION } from '@/lib/animation-config';

/**
 * Public route page transition template.
 * Next.js re-renders template.tsx on every route change (unlike layout.tsx which persists),
 * so this produces an enter-only clip-path wipe on each navigation.
 * No AnimatePresence needed — the component mounts fresh on every route change.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      transition={{ duration: DURATION.medium, ease: EASING_CINEMATIC }}
    >
      {children}
    </m.div>
  );
}
