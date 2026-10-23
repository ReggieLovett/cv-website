import type { PowerUpAction } from './companion-motion';

export type BattleMove =
  | 'frog-kumite' | 'sage-giant-rasengan' | 'rasenshuriken'
  | 'chakra-arm-barrage' | 'chakra-arm-rasengan' | 'tailed-beast-bomb'
  | 'baryon-rasengan' | 'baryon-tail-breaker' | 'baryon-breakthrough'
  | 'chidori' | 'amaterasu' | 'susanoo-slash'
  | 'anti-magic-zetten' | 'black-slash' | 'black-meteorite'
  | 'infinite-slash-equinox' | 'black-divider' | 'black-hurricane'
  | 'quartile-hasta' | 'quartile-scutum' | 'conjunction'
  | 'spirit-storm' | 'spirit-of-zephyr' | 'spirit-of-euros'
  | 'draw-slash' | 'cross-slash' | 'guard-break'
  | 'lightning-thrust' | 'thunder-step' | 'chain-lightning'
  | 'fireball' | 'flame-burst' | 'flame-wave'
  | 'ice-spike' | 'frost-shield' | 'ice-shards'
  | 'shadow-clone' | 'shadow-strike' | 'shadow-feint';

type NamedTechnique = Exclude<BattleMove,
  | 'draw-slash' | 'cross-slash' | 'guard-break'
  | 'lightning-thrust' | 'thunder-step' | 'chain-lightning'
  | 'flame-burst' | 'flame-wave' | 'ice-shards' | 'shadow-clone' | 'shadow-feint'>;
export type BattleEffect = NamedTechnique | 'dash' | 'punch' | 'slash' | 'lightning';

export type BattleMoveConfig = {
  keyframes: Keyframe[];
  duration: number;
  effect: BattleEffect;
  label: string;
  travel: 'dash' | 'advance' | 'hover';
};

type Pose = 'strike' | 'cast' | 'draw' | 'rush' | 'brace' | 'spin' | 'vanish';
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';
const NEUTRAL = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';

function frame(offset: number, x = 0, angle = 0, scale = '1', opacity = 1): Keyframe {
  return { offset, transform: `translate3d(${x === 0 ? '0' : `${x}px`}, 0, 0) rotate(${angle}deg) scale(${scale})`, opacity,
    easing: offset < 0.3 ? EASE_IN_OUT : EASE_OUT };
}

/** Body poses pivot at the feet. Only the outer actor owns horizontal travel. */
function poseFrames(pose: Pose): Keyframe[] {
  const middle: Record<Pose, Keyframe[]> = {
    strike: [frame(0.2, -4, -8, '0.98, 1.02'), frame(0.44, 10, 11, '1.06, 0.96'), frame(0.74, 3, -4)],
    cast: [frame(0.2, -2, -5, '1.03, 0.96'), frame(0.43, 0, -3, '1.04'), frame(0.68, 5, 5, '1.03')],
    draw: [frame(0.24, -5, -15, '0.98, 1.02'), frame(0.5, 11, 22, '1.06, 0.96'), frame(0.8, 2, -4)],
    rush: [frame(0.16, -4, -8, '1.03, 0.95'), frame(0.46, 12, 10, '1.08, 0.94', 0.84), frame(0.8, 2, 3)],
    brace: [frame(0.2, 0, 0, '1.06, 0.94'), frame(0.48, 0, -2, '1.03'), frame(0.76, 0, 2, '1.04, 0.97')],
    spin: [frame(0.22, -3, -18, '0.98, 1.02'), frame(0.48, 7, 28, '1.04, 0.97'), frame(0.76, -2, -10)],
    vanish: [frame(0.22, -3, -4, '0.98', 0.8), frame(0.47, 0, 0, '0.95', 0.5), frame(0.7, 6, 5, '1.02', 0.85)],
  };
  return [{ ...frame(0), transform: NEUTRAL }, ...middle[pose], { ...frame(1), transform: NEUTRAL }];
}

function move(label: string, effect: BattleEffect, travel: BattleMoveConfig['travel'], pose: Pose, duration: number): BattleMoveConfig {
  return { label, effect, travel, keyframes: poseFrames(pose), duration };
}

/** Named techniques are sourced in docs/companion-move-references.md.
 * The five original fantasy kits deliberately use their own descriptive labels.
 * Renderer families can be shared; data-battle-move selects a distinct variant.
 */
export const BATTLE_MOVES: Record<BattleMove, BattleMoveConfig> = {
  'frog-kumite': move('Frog Kumite', 'frog-kumite', 'advance', 'strike', 820),
  'sage-giant-rasengan': move('Sage Art: Giant Rasengan', 'sage-giant-rasengan', 'advance', 'cast', 1100),
  rasenshuriken: move('Wind Style: Rasenshuriken', 'rasenshuriken', 'hover', 'cast', 1140),
  'chakra-arm-barrage': move('Chakra Arm Barrage', 'chakra-arm-barrage', 'advance', 'strike', 960),
  'tailed-beast-bomb': move('Tailed Beast Bomb', 'tailed-beast-bomb', 'hover', 'brace', 1180),
  'chakra-arm-rasengan': move('Chakra Arm Rasengan', 'chakra-arm-rasengan', 'advance', 'cast', 1140),
  'baryon-rasengan': move('Baryon Rasengan', 'baryon-rasengan', 'dash', 'cast', 1050),
  'baryon-tail-breaker': move('Baryon Tail Breaker', 'baryon-tail-breaker', 'advance', 'spin', 900),
  'baryon-breakthrough': move('Baryon Breakthrough', 'baryon-breakthrough', 'dash', 'rush', 700),
  chidori: move('Chidori', 'chidori', 'dash', 'rush', 880),
  amaterasu: move('Amaterasu', 'amaterasu', 'hover', 'cast', 1100),
  'susanoo-slash': move('Susano’o Sword Slash', 'susanoo-slash', 'advance', 'draw', 1080),
  'anti-magic-zetten': move('Anti-Magic Zetten', 'anti-magic-zetten', 'advance', 'draw', 960),
  'black-slash': move('Demon-Dweller: Black Slash', 'black-slash', 'hover', 'draw', 1040),
  'black-meteorite': move('Black Meteorite', 'black-meteorite', 'dash', 'rush', 900),
  'infinite-slash-equinox': move('Demon-Slasher: Infinite Slash Equinox', 'infinite-slash-equinox', 'advance', 'draw', 1180),
  'black-divider': move('Demon-Slayer: Black Divider', 'black-divider', 'advance', 'draw', 1080),
  'black-hurricane': move('Black Hurricane', 'black-hurricane', 'advance', 'spin', 1100),
  'quartile-hasta': move('Star Magic: Quartile Hasta', 'quartile-hasta', 'hover', 'cast', 1160),
  'quartile-scutum': move('Star Magic: Quartile Scutum', 'quartile-scutum', 'hover', 'brace', 1080),
  conjunction: move('Star Magic: Conjunction', 'conjunction', 'dash', 'vanish', 900),
  'spirit-storm': move('Spirit Storm', 'spirit-storm', 'hover', 'cast', 1080),
  'spirit-of-zephyr': move('Spirit of Zephyr', 'spirit-of-zephyr', 'advance', 'draw', 980),
  'spirit-of-euros': move('Spirit of Euros', 'spirit-of-euros', 'hover', 'cast', 1140),
  'draw-slash': move('Quickdraw Slash', 'slash', 'advance', 'draw', 820),
  'cross-slash': move('Cross Slash', 'slash', 'advance', 'spin', 940),
  'guard-break': move('Guard Break', 'punch', 'advance', 'strike', 780),
  'lightning-thrust': move('Lightning Thrust', 'lightning', 'dash', 'rush', 880),
  'thunder-step': move('Thunder Step', 'dash', 'dash', 'rush', 760),
  'chain-lightning': move('Chain Lightning', 'lightning', 'hover', 'cast', 1040),
  fireball: move('Fireball', 'fireball', 'hover', 'cast', 1050),
  'flame-burst': move('Flame Burst', 'fireball', 'advance', 'strike', 920),
  'flame-wave': move('Flame Wave', 'fireball', 'hover', 'cast', 1120),
  'ice-spike': move('Ice Spike', 'ice-spike', 'advance', 'cast', 1100),
  'frost-shield': move('Frost Shield', 'frost-shield', 'hover', 'brace', 1080),
  'ice-shards': move('Ice Shards', 'ice-spike', 'hover', 'cast', 980),
  'shadow-clone': move('Shadow Clone', 'shadow-strike', 'hover', 'vanish', 1100),
  'shadow-strike': move('Shadow Strike', 'shadow-strike', 'dash', 'strike', 900),
  'shadow-feint': move('Shadow Feint', 'dash', 'dash', 'vanish', 780),
};

/** Form-appropriate repertoires can share techniques; speed is horizontal CSS pixels per second. */
export const FORM_BATTLES: Record<PowerUpAction, { moves: readonly BattleMove[]; speed: number }> = {
  'sage-mode': { moves: ['frog-kumite', 'sage-giant-rasengan', 'rasenshuriken'], speed: 300 },
  'chakra-mode': { moves: ['chakra-arm-barrage', 'chakra-arm-rasengan', 'rasenshuriken', 'tailed-beast-bomb'], speed: 520 },
  'sword-draw': { moves: ['draw-slash', 'cross-slash', 'guard-break'], speed: 320 },
  'lightning-dash': { moves: ['lightning-thrust', 'thunder-step', 'chain-lightning'], speed: 580 },
  'fire-mode': { moves: ['fireball', 'flame-burst', 'flame-wave'], speed: 340 },
  'ice-mode': { moves: ['ice-spike', 'frost-shield', 'ice-shards'], speed: 260 },
  'shadow-mode': { moves: ['shadow-clone', 'shadow-strike', 'shadow-feint'], speed: 420 },
  'zetten-mode': { moves: ['anti-magic-zetten', 'black-slash', 'black-meteorite'], speed: 440 },
  'devil-union': { moves: ['infinite-slash-equinox', 'black-divider', 'black-hurricane'], speed: 380 },
  'star-magic': { moves: ['quartile-hasta', 'quartile-scutum', 'conjunction'], speed: 400 },
  'spirit-dive': { moves: ['spirit-storm', 'spirit-of-zephyr', 'spirit-of-euros'], speed: 460 },
  'baryon-mode': { moves: ['baryon-rasengan', 'baryon-tail-breaker', 'baryon-breakthrough'], speed: 700 },
  'six-paths-eyes': { moves: ['chidori', 'amaterasu', 'susanoo-slash'], speed: 560 },
};

function randomUnit(random: () => number): number {
  const value = random();
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

/** Short combinations favor the signature without repeating adjacent techniques. */
export function pickBattleSequence(form: PowerUpAction, previous: BattleMove | null = null, random: () => number = Math.random): BattleMove[] {
  const lengthRoll = randomUnit(random);
  const length = lengthRoll < 0.5 ? 1 : lengthRoll < 0.85 ? 2 : 3;
  const profile = FORM_BATTLES[form];
  const sequence: BattleMove[] = [];
  let last = previous;
  for (let index = 0; index < length; index += 1) {
    const candidates = profile.moves.map((candidate, rank) => ({ move: candidate, weight: [5, 3, 2][rank] ?? 1 })).filter(({ move }) => move !== last);
    const total = candidates.reduce((sum, candidate) => sum + candidate.weight, 0);
    let threshold = randomUnit(random) * total;
    let chosen = candidates[candidates.length - 1].move;
    for (const candidate of candidates) {
      threshold -= candidate.weight;
      if (threshold < 0) { chosen = candidate.move; break; }
    }
    sequence.push(chosen);
    last = chosen;
  }
  return sequence;
}

export function nextBattleDelay(random: () => number = Math.random): number {
  return 9_000 + Math.round(randomUnit(random) * 9_000);
}
