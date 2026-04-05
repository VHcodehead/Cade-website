'use client';
import { m } from 'framer-motion';
import { EASING_SMOOTH, DURATION } from '@/lib/animation-config';

const variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps section headings and content blocks with a fade-up-on-scroll reveal.
 * Triggers when the element enters the viewport (80px margin to fire just before visible).
 * Animates once — does not re-trigger on scroll back.
 */
export function RevealSection({ children, className }: RevealSectionProps) {
  return (
    <m.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: DURATION.cinematic, ease: EASING_SMOOTH }}
      className={className}
    >
      {children}
    </m.div>
  );
}
