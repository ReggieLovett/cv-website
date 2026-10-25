import { makeTechnique as move } from './companion-technique';
import { NARUTO_TECHNIQUES, NARUTO_REPERTOIRES } from './companion-naruto-techniques';
import { CLOVER_TECHNIQUES, CLOVER_REPERTOIRES } from './companion-clover-techniques';
import { HYPER_TECHNIQUES, HYPER_REPERTOIRE } from './companion-hyper-techniques';
import { EXTRA_TECHNIQUES } from './companion-extra-techniques';
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
  | 'luck-ceranos' | 'luck-thunderclap-claw' | 'luck-thunderclap-orb'
  | 'calidos-brachium' | 'calidos-brachium-barrage' | 'calidos-brachium-purgatory-abyss'
  | 'gearshift-overdrive' | 'fa-jin-smash' | 'blackwhip-strike'
  | 'danger-sense-counter' | 'smokescreen-feint'
  | keyof typeof NARUTO_TECHNIQUES
  | keyof typeof CLOVER_TECHNIQUES
  | keyof typeof HYPER_TECHNIQUES
  | keyof typeof EXTRA_TECHNIQUES;

type NamedTechnique = Exclude<BattleMove,
  | 'draw-slash' | 'cross-slash' | 'guard-break'>;
export type BattleEffect = NamedTechnique | 'dash' | 'punch' | 'slash' | 'lightning';

export type BattleMoveConfig = {
  keyframes: Keyframe[];
  duration: number;
  effect: BattleEffect;
  label: string;
  travel: 'dash' | 'advance' | 'hover';
};

/** Named techniques are sourced in docs/companion-move-references.md.
 * Draw Sword is an original knight kit; named forms document their sources and adaptations.
 * Renderer families can be shared; data-battle-move selects a distinct variant.
 */
export const BATTLE_MOVES: Record<BattleMove, BattleMoveConfig> = {
  ...NARUTO_TECHNIQUES,
  ...CLOVER_TECHNIQUES,
  ...HYPER_TECHNIQUES,
  ...EXTRA_TECHNIQUES,
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
  conjunction: move('Conjunction: Hushed Dance Counter', 'conjunction', 'dash', 'vanish', 1100),
  'spirit-storm': move('Spirit Storm', 'spirit-storm', 'hover', 'cast', 1080),
  'spirit-of-zephyr': move('Saint Spirit of Zephyr', 'spirit-of-zephyr', 'advance', 'draw', 980),
  'spirit-of-euros': move('Spirit of Euros', 'spirit-of-euros', 'hover', 'cast', 1140),
  'draw-slash': move('Quickdraw Slash', 'slash', 'advance', 'draw', 820),
  'cross-slash': move('Cross Slash', 'slash', 'advance', 'spin', 940),
  'guard-break': move('Guard Break', 'punch', 'advance', 'strike', 780),
  'luck-ceranos': move('True Lightning Magic: Ceranos', 'luck-ceranos', 'dash', 'rush', 880),
  'luck-thunderclap-claw': move('Thunder God’s Gloves: Claw Strike', 'luck-thunderclap-claw', 'advance', 'strike', 820),
  'luck-thunderclap-orb': move('Lightning Magic: Thunderbolt Destruction', 'luck-thunderclap-orb', 'hover', 'cast', 1040),
  'calidos-brachium': move('Flame Magic: Calidos Brachium', 'calidos-brachium', 'advance', 'strike', 980),
  'calidos-brachium-barrage': move('Mana Zone: Calidos Brachium Barrage', 'calidos-brachium-barrage', 'advance', 'strike', 1120),
  'calidos-brachium-purgatory-abyss': move('Mana Zone Full Release: Calidos Brachium Purgatory: Abyss', 'calidos-brachium-purgatory-abyss', 'hover', 'brace', 1180),
  'gearshift-overdrive': move('Gearshift: Overdrive', 'gearshift-overdrive', 'dash', 'rush', 780),
  'fa-jin-smash': move('Fa Jin Smash', 'fa-jin-smash', 'advance', 'strike', 960),
  'blackwhip-strike': move('Blackwhip Strike', 'blackwhip-strike', 'hover', 'cast', 1100),
  'danger-sense-counter': move('Danger Sense: Evade', 'danger-sense-counter', 'dash', 'vanish', 900),
  'smokescreen-feint': move('Smokescreen: Feint', 'smokescreen-feint', 'dash', 'vanish', 1100),
};

/** Form-appropriate repertoires can share techniques; speed is horizontal CSS pixels per second. */
export const FORM_BATTLES: Record<PowerUpAction, { moves: readonly BattleMove[]; speed: number }> = {
  'sage-mode': { moves: NARUTO_REPERTOIRES['sage-mode'], speed: 300 },
  'chakra-mode': { moves: NARUTO_REPERTOIRES['chakra-mode'], speed: 520 },
  'sword-draw': { moves: ['draw-slash', 'cross-slash', 'guard-break', 'knight-spin-cut', 'knight-shield-riposte', 'knight-lunge', 'knight-rising-cut', 'knight-pommel-strike', 'knight-blade-beam', 'knight-counter-cut'], speed: 320 },
  'lightning-dash': { moves: CLOVER_REPERTOIRES['lightning-dash'], speed: 580 },
  'fire-mode': { moves: CLOVER_REPERTOIRES['fire-mode'], speed: 340 },
  'water-mode': { moves: CLOVER_REPERTOIRES['water-mode'], speed: 400 },
  'zetten-mode': { moves: CLOVER_REPERTOIRES['zetten-mode'], speed: 440 },
  'devil-union': { moves: CLOVER_REPERTOIRES['devil-union'], speed: 380 },
  'spirit-dive': { moves: CLOVER_REPERTOIRES['spirit-dive'], speed: 460 },
  'baryon-mode': { moves: NARUTO_REPERTOIRES['baryon-mode'], speed: 700 },
  'six-paths-eyes': { moves: NARUTO_REPERTOIRES['six-paths-eyes'], speed: 560 },
  'deku-overdrive': {
    moves: ['gearshift-overdrive', 'fa-jin-smash', 'blackwhip-strike', 'danger-sense-counter', 'smokescreen-feint', 'deku-air-force', 'deku-blackchain', 'deku-detroit-quintuple', 'deku-manchester-smash', 'deku-st-louis-air-force'],
    speed: 620,
  },
  'hyper-sonic': { moves: HYPER_REPERTOIRE, speed: 800 },
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
