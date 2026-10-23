export type CompanionPersona = 'portfolio' | 'zelda';

export type PowerUpAction =
  | 'sage-mode'
  | 'chakra-mode'
  | 'sword-draw'
  | 'lightning-dash'
  | 'fire-mode'
  | 'ice-mode'
  | 'shadow-mode'
  | 'zetten-mode'
  | 'devil-union'
  | 'star-magic'
  | 'spirit-dive'
  | 'baryon-mode'
  | 'six-paths-eyes';

export type SpriteAction = 'hop' | 'salute' | 'look-around' | 'twirl' | 'levitate' | 'sparkle' | PowerUpAction;

export type SpriteActionConfig = {
  keyframes: Keyframe[];
  duration: number;
  effect:
    | 'none' | 'dust' | 'spark' | 'ring'
    | 'sage' | 'chakra' | 'sword' | 'lightning' | 'fire' | 'ice' | 'shadow'
    | 'zetten' | 'devil' | 'star' | 'spirit' | 'baryon' | 'six-paths';
  label: string;
};

// These are the existing --ease-out and --ease-in-out tokens from globals.css.
// WAAPI keyframe easing needs concrete curves, rather than CSS var() references.
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';
const NEUTRAL = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';

function frame(
  offset: number,
  transform = NEUTRAL,
  easing = EASE_OUT,
  opacity = 1,
): Keyframe {
  return { offset, transform, easing, opacity };
}

/**
 * Occasional character performances, applied to a pose wrapper inside the
 * direction-flipping wrapper. Feet stay on the bottom baseline in every pose.
 * Every action starts and ends at rest so removing
 * a completed WAAPI effect cannot snap the sprite to a different pose.
 * The caller owns cancellation, interaction holds, and reduced-motion gating.
 */
export const SPRITE_ACTIONS: Record<SpriteAction, SpriteActionConfig> = {
  hop: {
    keyframes: [
      frame(0),
      frame(0.12, 'translate3d(0, 0, 0) rotate(0deg) scale(1.06, 0.92)'),
      frame(0.42, 'translate3d(0, 0, 0) rotate(-5deg) scale(0.97, 1.03)', EASE_IN_OUT),
      frame(0.7, 'translate3d(0, 0, 0) rotate(2deg) scale(1.07, 0.94)'),
      frame(0.86, 'translate3d(0, 0, 0) rotate(0deg) scale(1)'),
      frame(1),
    ],
    duration: 920,
    effect: 'dust',
    label: 'A cheerful grounded bounce',
  },
  salute: {
    keyframes: [
      frame(0),
      frame(0.2, 'translate3d(0, 0, 0) rotate(-9deg) scale(0.98, 1.04)'),
      frame(0.48, 'translate3d(0, 0, 0) rotate(-9deg) scale(0.98, 1.04)', EASE_IN_OUT),
      frame(0.74, 'translate3d(0, 0, 0) rotate(3deg) scale(1)'),
      frame(1),
    ],
    duration: 840,
    effect: 'none',
    label: 'A knightly salute',
  },
  'look-around': {
    keyframes: [
      frame(0),
      frame(0.2, 'translate3d(-4px, 0, 0) rotate(-6deg) scale(1)'),
      frame(0.4, 'translate3d(-4px, 0, 0) rotate(-6deg) scale(1)', EASE_IN_OUT),
      frame(0.64, 'translate3d(4px, 0, 0) rotate(6deg) scale(1)'),
      frame(0.82, 'translate3d(4px, 0, 0) rotate(6deg) scale(1)', EASE_IN_OUT),
      frame(1),
    ],
    duration: 1120,
    effect: 'none',
    label: 'Checking the horizon',
  },
  twirl: {
    keyframes: [
      frame(0),
      frame(0.2, 'translate3d(-4px, 0, 0) rotate(-18deg) scale(0.94, 1.02)', EASE_IN_OUT),
      frame(0.48, 'translate3d(5px, 0, 0) rotate(24deg) scale(0.88, 1.04)', EASE_IN_OUT),
      frame(0.74, 'translate3d(-2px, 0, 0) rotate(-8deg) scale(1.03, 0.97)'),
      frame(1),
    ],
    duration: 1040,
    effect: 'ring',
    label: 'A woodland twirl',
  },
  levitate: {
    keyframes: [
      frame(0),
      frame(0.18, 'translate3d(0, 0, 0) rotate(-2deg) scale(1)', EASE_IN_OUT),
      frame(0.4, 'translate3d(0, 0, 0) rotate(2deg) scale(1)', EASE_IN_OUT),
      frame(0.64, 'translate3d(0, 0, 0) rotate(-2deg) scale(1)', EASE_IN_OUT),
      frame(0.82, 'translate3d(0, 0, 0) rotate(1deg) scale(1)'),
      frame(1),
    ],
    duration: 1200,
    effect: 'spark',
    label: 'A grounded forest charm',
  },
  sparkle: {
    keyframes: [
      frame(0),
      frame(0.22, 'translate3d(0, 0, 0) rotate(-5deg) scale(1.06)', EASE_IN_OUT),
      frame(0.4, 'translate3d(0, 0, 0) rotate(5deg) scale(0.98)', EASE_OUT, 0.86),
      frame(0.58, 'translate3d(0, 0, 0) rotate(-3deg) scale(1.04)', EASE_IN_OUT),
      frame(0.78, 'translate3d(0, 0, 0) rotate(2deg) scale(1)', EASE_OUT, 0.94),
      frame(1),
    ],
    duration: 980,
    effect: 'spark',
    label: 'A sparkle for the road',
  },
  // Requested power-ups have a longer charge/release arc than the small idle
  // flourishes. Effects live outside the sprite so its original art stays intact.
  'sage-mode': {
    keyframes: [
      frame(0),
      frame(0.1, 'translate3d(0, 0, 0) rotate(0deg) scale(1.04, 0.94)', EASE_IN_OUT),
      frame(0.24, 'translate3d(-1px, 0, 0) rotate(-2deg) scale(1.03)'),
      frame(0.3, 'translate3d(1px, 0, 0) rotate(2deg) scale(1.03)'),
      frame(0.36, 'translate3d(-1px, 0, 0) rotate(-1deg) scale(1.04)'),
      frame(0.52, 'translate3d(0, 0, 0) rotate(0deg) scale(1.07)', EASE_IN_OUT),
      frame(0.7, 'translate3d(0, 0, 0) rotate(1deg) scale(1.06)', EASE_IN_OUT),
      frame(0.86, 'translate3d(0, 0, 0) rotate(-1deg) scale(1.03)'),
      frame(1),
    ],
    duration: 2600,
    effect: 'sage',
    label: 'Gathering nature’s energy',
  },
  'chakra-mode': {
    keyframes: [
      frame(0),
      frame(0.1, 'translate3d(0, 0, 0) rotate(-2deg) scale(1.05, 0.93)', EASE_IN_OUT),
      frame(0.22, 'translate3d(-2px, 0, 0) rotate(-3deg) scale(1.04)'),
      frame(0.29, 'translate3d(2px, 0, 0) rotate(3deg) scale(1.05)'),
      frame(0.42, 'translate3d(0, 0, 0) rotate(0deg) scale(1.1)', EASE_IN_OUT),
      frame(0.6, 'translate3d(0, 0, 0) rotate(-2deg) scale(1.08)', EASE_IN_OUT),
      frame(0.78, 'translate3d(0, 0, 0) rotate(2deg) scale(1.06)'),
      frame(0.9, 'translate3d(0, 0, 0) rotate(0deg) scale(1.02)'),
      frame(1),
    ],
    duration: 2400,
    effect: 'chakra',
    label: 'A cloak of golden energy',
  },
  'sword-draw': {
    keyframes: [
      frame(0),
      frame(0.18, 'translate3d(-3px, 0, 0) rotate(-7deg) scale(1)', EASE_IN_OUT),
      frame(0.36, 'translate3d(-5px, 0, 0) rotate(-10deg) scale(0.98, 1.02)'),
      frame(0.48, 'translate3d(7px, 0, 0) rotate(14deg) scale(1.04, 0.97)'),
      frame(0.6, 'translate3d(10px, 0, 0) rotate(19deg) scale(1.02)', EASE_IN_OUT),
      frame(0.78, 'translate3d(3px, 0, 0) rotate(-4deg) scale(1)'),
      frame(1),
    ],
    duration: 2000,
    effect: 'sword',
    label: 'A blade, ready for adventure',
  },
  'lightning-dash': {
    keyframes: [
      frame(0),
      frame(0.18, 'translate3d(-4px, 0, 0) rotate(-8deg) scale(1.04, 0.93)', EASE_IN_OUT),
      frame(0.32, 'translate3d(-8px, 0, 0) rotate(-12deg) scale(0.98, 1.03)'),
      frame(0.44, 'translate3d(16px, 0, 0) rotate(12deg) scale(1.1, 0.92)', EASE_OUT, 0.82),
      frame(0.56, 'translate3d(20px, 0, 0) rotate(8deg) scale(1.05, 0.98)', EASE_IN_OUT, 0.94),
      frame(0.72, 'translate3d(-9px, 0, 0) rotate(-6deg) scale(0.98, 1.03)'),
      frame(0.88),
      frame(1),
    ],
    duration: 1800,
    effect: 'lightning',
    label: 'A flash across the trail',
  },
  'fire-mode': {
    keyframes: [
      frame(0),
      frame(0.12, 'translate3d(0, 0, 0) rotate(-3deg) scale(1.06, 0.92)', EASE_IN_OUT),
      frame(0.26, 'translate3d(-2px, 0, 0) rotate(-5deg) scale(1.04)'),
      frame(0.36, 'translate3d(2px, 0, 0) rotate(5deg) scale(1.07)'),
      frame(0.5, 'translate3d(0, 0, 0) rotate(-10deg) scale(1.1)', EASE_IN_OUT),
      frame(0.68, 'translate3d(3px, 0, 0) rotate(10deg) scale(1.08)', EASE_IN_OUT),
      frame(0.84, 'translate3d(0, 0, 0) rotate(-3deg) scale(1.07, 0.95)'),
      frame(1),
    ],
    duration: 2400,
    effect: 'fire',
    label: 'A phoenix stirs within',
  },
  'ice-mode': {
    keyframes: [
      frame(0),
      frame(0.16, 'translate3d(0, 0, 0) rotate(0deg) scale(1.08, 0.94)', EASE_IN_OUT),
      frame(0.32, 'translate3d(0, 0, 0) rotate(0deg) scale(1.09, 1.02)', EASE_IN_OUT),
      frame(0.7, 'translate3d(0, 0, 0) rotate(0deg) scale(1.09, 1.02)', EASE_IN_OUT),
      frame(0.84, 'translate3d(0, 0, 0) rotate(0deg) scale(1.04, 0.98)'),
      frame(1),
    ],
    duration: 2200,
    effect: 'ice',
    label: 'A shield of winter',
  },
  'shadow-mode': {
    keyframes: [
      frame(0),
      frame(0.14, 'translate3d(0, 0, 0) rotate(-2deg) scale(0.98, 1.02)', EASE_IN_OUT, 0.86),
      frame(0.3, 'translate3d(-11px, 0, 0) rotate(-6deg) scale(0.97)', EASE_IN_OUT, 0.58),
      frame(0.5, 'translate3d(11px, 0, 0) rotate(6deg) scale(1.03)', EASE_IN_OUT, 0.68),
      frame(0.7, 'translate3d(-5px, 0, 0) rotate(-3deg) scale(0.99)', EASE_IN_OUT, 0.8),
      frame(0.86, 'translate3d(2px, 0, 0) rotate(1deg) scale(1)', EASE_OUT, 0.94),
      frame(1),
    ],
    duration: 2300,
    effect: 'shadow',
    label: 'A shadow at my side',
  },
  'zetten-mode': {
    keyframes: [
      frame(0),
      frame(0.12, 'translate3d(0, 0, 0) rotate(-3deg) scale(1.08, 0.88)', EASE_IN_OUT),
      frame(0.3, 'translate3d(-4px, 0, 0) rotate(-7deg) scale(0.97, 1.04)', EASE_IN_OUT),
      frame(0.44, 'translate3d(-6px, 0, 0) rotate(-12deg) scale(0.98, 1.03)'),
      frame(0.5, 'translate3d(18px, 0, 0) rotate(16deg) scale(1.1, 0.94)'),
      frame(0.66, 'translate3d(12px, 0, 0) rotate(9deg) scale(1.04)', EASE_IN_OUT),
      frame(0.84, 'translate3d(2px, 0, 0) rotate(-3deg) scale(1)'),
      frame(1),
    ],
    duration: 2400,
    effect: 'zetten',
    label: 'One focused burst of power',
  },
  'devil-union': {
    keyframes: [
      frame(0),
      frame(0.14, 'translate3d(0, 0, 0) rotate(0deg) scale(1.12, 0.9)', EASE_IN_OUT),
      frame(0.3, 'translate3d(0, 0, 0) rotate(-3deg) scale(1.06)', EASE_IN_OUT),
      frame(0.42, 'translate3d(-2px, 0, 0) rotate(-5deg) scale(1.1)'),
      frame(0.58, 'translate3d(0, 0, 0) rotate(0deg) scale(1.12)', EASE_IN_OUT),
      frame(0.76, 'translate3d(0, 0, 0) rotate(3deg) scale(1.1)', EASE_IN_OUT),
      frame(0.9, 'translate3d(0, 0, 0) rotate(-1deg) scale(1.04)'),
      frame(1),
    ],
    duration: 2600,
    effect: 'devil',
    label: 'Wings of a darker resolve',
  },
  'star-magic': {
    keyframes: [
      frame(0),
      frame(0.16, 'translate3d(-8px, 0, 0) rotate(-8deg) scale(1.02)', EASE_IN_OUT),
      frame(0.36, 'translate3d(10px, 0, 0) rotate(6deg) scale(1.05)', EASE_IN_OUT),
      frame(0.56, 'translate3d(-10px, 0, 0) rotate(-5deg) scale(1.04)', EASE_IN_OUT),
      frame(0.74, 'translate3d(7px, 0, 0) rotate(5deg) scale(1.03)', EASE_IN_OUT),
      frame(0.9, 'translate3d(0, 0, 0) rotate(0deg) scale(1.01)'),
      frame(1),
    ],
    duration: 2500,
    effect: 'star',
    label: 'A constellation, close at hand',
  },
  'spirit-dive': {
    keyframes: [
      frame(0),
      frame(0.12, 'translate3d(0, 0, 0) rotate(-5deg) scale(1.03, 0.95)', EASE_IN_OUT),
      frame(0.28, 'translate3d(-5px, 0, 0) rotate(-14deg) scale(0.98, 1.04)'),
      frame(0.48, 'translate3d(6px, 0, 0) rotate(20deg) scale(1.04)', EASE_IN_OUT),
      frame(0.66, 'translate3d(-4px, 0, 0) rotate(-14deg) scale(1.02)', EASE_IN_OUT),
      frame(0.84, 'translate3d(3px, 0, 0) rotate(7deg) scale(1.01)'),
      frame(1),
    ],
    duration: 2400,
    effect: 'spirit',
    label: 'Carried by a guardian wind',
  },
  'baryon-mode': {
    keyframes: [
      frame(0),
      frame(0.12, 'translate3d(0, 0, 0) rotate(-3deg) scale(1.08, 0.9)', EASE_IN_OUT),
      frame(0.24, 'translate3d(-2px, 0, 0) rotate(-5deg) scale(1.06)'),
      frame(0.32, 'translate3d(2px, 0, 0) rotate(5deg) scale(1.08)'),
      frame(0.46, 'translate3d(0, 0, 0) rotate(-6deg) scale(1.13)', EASE_IN_OUT),
      frame(0.64, 'translate3d(0, 0, 0) rotate(-4deg) scale(1.1)', EASE_IN_OUT),
      frame(0.8, 'translate3d(6px, 0, 0) rotate(7deg) scale(1.06)'),
      frame(0.92, 'translate3d(0, 0, 0) rotate(0deg) scale(1.02)'),
      frame(1),
    ],
    duration: 2500,
    effect: 'baryon',
    label: 'The final spark ignites',
  },
  'six-paths-eyes': {
    keyframes: [
      frame(0),
      frame(0.12, 'translate3d(0, 0, 0) rotate(0deg) scale(1.02, 0.98)', EASE_IN_OUT),
      frame(0.3, 'translate3d(0, 0, 0) rotate(-2deg) scale(1.03)', EASE_IN_OUT),
      frame(0.46, 'translate3d(-2px, 0, 0) rotate(-4deg) scale(1.05)'),
      frame(0.64, 'translate3d(2px, 0, 0) rotate(4deg) scale(1.04)', EASE_IN_OUT),
      frame(0.82, 'translate3d(0, 0, 0) rotate(0deg) scale(1.02)'),
      frame(1),
    ],
    duration: 2400,
    effect: 'six-paths',
    label: 'A crimson-and-violet awakening',
  },
};

/** Direct choices expose every power-up regardless of the active sprite persona. */
export const POWER_UPS: readonly { action: PowerUpAction; label: string; description: string }[] = [
  {
    action: 'sage-mode',
    label: 'Sage Mode',
    description: 'Gather nature’s energy into a grounded stance and release a forest aura.',
  },
  {
    action: 'chakra-mode',
    label: 'Chakra Cloak',
    description: 'Charge up inside a flowing cloak of golden energy.',
  },
  {
    action: 'sword-draw',
    label: 'Draw Sword',
    description: 'Draw a blade, make a quick slash, and settle back into guard.',
  },
  {
    action: 'lightning-dash',
    label: 'Lightning Step',
    description: 'Build a charge and dash through a trail of blue sparks.',
  },
  {
    action: 'fire-mode',
    label: 'Phoenix Flame',
    description: 'Ignite phoenix fire and carry a warm aura of embers.',
  },
  {
    action: 'ice-mode',
    label: 'Frost Armor',
    description: 'Brace as frost crystals gather into a coat of icy armor.',
  },
  {
    action: 'shadow-mode',
    label: 'Shadow Clone',
    description: 'Slip between shadows and summon a companion silhouette.',
  },
  {
    action: 'zetten-mode',
    label: 'Zetten',
    description: 'An Asta-inspired effect: compress energy into a precise burst, step, and decisive slash.',
  },
  {
    action: 'devil-union',
    label: 'Devil Union',
    description: 'An Asta-inspired effect: release dark wings and brace in a united battle form.',
  },
  {
    action: 'star-magic',
    label: 'Star Magic',
    description: 'A Yuno-inspired effect: gather a constellation around a grounded stance.',
  },
  {
    action: 'spirit-dive',
    label: 'Spirit Dive',
    description: 'A Yuno-inspired effect: summon guardian wind into a grounded spirit form.',
  },
  {
    action: 'baryon-mode',
    label: 'Baryon Mode',
    description: 'A Naruto-inspired effect: ignite a fierce orange mantle and release a last-reserve burst.',
  },
  {
    action: 'six-paths-eyes',
    label: 'Six Paths Eyes',
    description: 'A Sasuke-inspired effect: awaken crimson and violet eyes inside a cool electric aura.',
  },
];

export function isPowerUp(action: SpriteAction | null | undefined): action is PowerUpAction {
  return POWER_UPS.some((powerUp) => powerUp.action === action);
}

const powerUpActions = POWER_UPS.map(({ action }) => action);

export const ACTION_POOLS: Readonly<Record<CompanionPersona, readonly SpriteAction[]>> = {
  portfolio: ['hop', 'salute', 'look-around', ...powerUpActions],
  zelda: ['twirl', 'levitate', 'sparkle', ...powerUpActions],
};

function randomUnit(random: () => number): number {
  const value = random();
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

/** Choose within the active character's repertoire without repeating its last action. */
export function pickSpriteAction(
  persona: CompanionPersona,
  previous: SpriteAction | null = null,
  random: () => number = Math.random,
): SpriteAction {
  const options = ACTION_POOLS[persona].filter((action) => action !== previous);
  const index = Math.min(options.length - 1, Math.floor(randomUnit(random) * options.length));
  return options[index];
}

/** The ambient clock never triggers a transformation or replaces the held form. */
export function pickAmbientAction(
  persona: CompanionPersona,
  previous: SpriteAction | null = null,
  random: () => number = Math.random,
): SpriteAction {
  const options = ACTION_POOLS[persona].filter((action) => !isPowerUp(action) && action !== previous);
  const index = Math.min(options.length - 1, Math.floor(randomUnit(random) * options.length));
  return options[index];
}

/** Every form remains eligible after persona changes; skip the currently held power. */
export function pickPowerUp(
  previous: PowerUpAction | null = null,
  random: () => number = Math.random,
): PowerUpAction {
  const options = powerUpActions.filter((action) => action !== previous);
  const index = Math.min(options.length - 1, Math.floor(randomUnit(random) * options.length));
  return options[index];
}

function randomDelay(minimum: number, maximum: number, random: () => number): number {
  return minimum + Math.round(randomUnit(random) * (maximum - minimum));
}

/** Separate irregular clocks let the caller vary tricks, powers, and travel independently. */
export function nextSpriteDelay(random: () => number = Math.random): number {
  return randomDelay(8_000, 24_000, random);
}

export function nextPowerUpDelay(random: () => number = Math.random): number {
  return randomDelay(18_000, 42_000, random);
}

export function nextTravelDelay(random: () => number = Math.random): number {
  return randomDelay(3_000, 9_000, random);
}
