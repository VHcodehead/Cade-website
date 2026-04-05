'use client';
import { m } from 'framer-motion';
import { EASING_SMOOTH, DURATION, STAGGER_GRID, STAGGER_DELAY } from '@/lib/animation-config';

/**
 * Container variants: orchestrates staggered entry of child grid items.
 * The container itself has no visual transition — it just controls child timing.
 */
export const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_GRID,
      delayChildren: STAGGER_DELAY,
    },
  },
};

/**
 * Item variants: "coming into focus" effect — fades up from below with a subtle scale.
 * Each item's transition is self-contained so stagger from parent controls timing.
 */
export const gridItemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.cinematic, ease: EASING_SMOOTH },
  },
};

interface AnimatedGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Grid container that triggers staggered reveal when it enters the viewport.
 * Wrap your grid layout element (the div with grid classes) with this component.
 */
export function AnimatedGrid({ children, className }: AnimatedGridProps) {
  return (
    <m.div
      variants={gridContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      className={className}
    >
      {children}
    </m.div>
  );
}

interface AnimatedGridItemProps {
  children: React.ReactNode;
}

/**
 * Individual grid item wrapper that inherits the whileInView trigger from AnimatedGrid.
 * Place this AROUND each ProjectCard — it is a separate div above the card,
 * not inside it. This avoids conflicting with ProjectCard's internal IntersectionObserver
 * for lazy-loading video thumbnails.
 */
export function AnimatedGridItem({ children }: AnimatedGridItemProps) {
  return (
    <m.div variants={gridItemVariants}>
      {children}
    </m.div>
  );
}
