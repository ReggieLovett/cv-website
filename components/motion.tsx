'use client';

import { MotionConfig, type Transition, type Variants } from 'framer-motion';

/**
 * The motion contract.
 *
 * ---- Why this file exists ----
 * Framer Motion does not respect `prefers-reduced-motion` on its own. The CSS
 * reveals in globals.css collapse under the media query, but a `whileInView`
 * variant animating `y` will keep animating for a reader who has asked the
 * system to stop — CSS cannot reach into it. `MotionConfig reducedMotion="user"`
 * is the switch: it makes every descendant motion component drop transform and
 * layout animations while still allowing opacity, which is the behaviour the
 * WCAG guidance actually wants (content still appears, nothing travels).
 *
 * It has to wrap the tree once, high up, or it silently covers only part of
 * the page — so `MotionProvider` goes around the whole document body.
 *
 * ---- Why the variants are shared ----
 * Three components were each declaring their own `hidden`/`show` pair with
 * slightly different durations and easings. Motion that is nearly-but-not-quite
 * consistent is what makes a page feel assembled rather than designed. One set,
 * used everywhere.
 *
 * ---- The properties ----
 * `opacity` and a `transform` string only. Motion hands both to the Web
 * Animations API, so the compositor runs them: a section revealing while the
 * page scrolls costs no main-thread frames. (Motion's independent `y` is
 * driven from JavaScript every frame and repainted the page under the reveal.)
 * Nothing here animates width, height, top, filter, or clip-path.
 *
 * MotionConfig's reduced-motion switch drops `y` but not a `transform` string,
 * so the rise carries its own instant transform for those readers: content
 * still fades in, nothing travels. `transitionEnd` clears the transform once
 * it lands, so a revealed block leaves no stacking context behind.
 */

/** The house curve. Fast out of the gate, long tail — settles rather than stops. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const transition: Transition = {
  duration: 0.45,
  ease: EASE,
};

/**
 * Parent container. Holds no visual state of its own — it exists so children
 * can inherit `show` on a stagger instead of each carrying a hand-tuned delay.
 */
export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

/** Slower cascade, for short lists where each item should register separately. */
export const staggerSlow: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Read once on the client; the server renders the hidden state either way. */
const REDUCED =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function rise(distance: number, duration: number): Variants {
  return {
    hidden: { opacity: 0, transform: `translateY(${distance}px)` },
    show: {
      opacity: 1,
      transform: 'translateY(0px)',
      transitionEnd: { transform: 'none' },
      transition: REDUCED ? { duration, ease: EASE, transform: { duration: 0 } } : { duration, ease: EASE },
    },
  };
}

/** The default child: rises a short distance and fades in. */
export const riseIn: Variants = rise(18, transition.duration as number);

/** A shorter rise, for dense rows where 18px of travel reads as noise. */
export const riseInTight: Variants = rise(10, 0.36);

/** Opacity only — for anything already in position, like a rule or a caption. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

/**
 * The viewport trigger every section shares. `once` so scrolling back up never
 * replays an entrance, and `amount: 0.15` so a tall block starts as soon as its
 * top edge is genuinely on screen rather than waiting to be 50% visible.
 */
export const viewport = { once: true, amount: 0.15 } as const;

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
