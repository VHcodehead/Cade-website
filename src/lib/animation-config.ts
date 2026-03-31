/**
 * Centralized animation timing constants for all cinematic animations.
 * Import from here — never hardcode easing curves or durations in components.
 */

/** Sharp ease-out for page transitions (clip-path wipes, dramatic reveals) */
export const EASING_CINEMATIC = [0.76, 0, 0.24, 1] as const;

/** Gentle ease-out for scroll reveals and hover states */
export const EASING_SMOOTH = [0.25, 0.1, 0.25, 1] as const;

/** Duration presets in seconds */
export const DURATION = {
  fast: 0.2,
  medium: 0.45,
  cinematic: 0.55,
} as const;

/** Delay between each grid item staggering in (120ms) */
export const STAGGER_GRID = 0.12;

/** Initial delay before the first staggered child animates (50ms) */
export const STAGGER_DELAY = 0.05;
