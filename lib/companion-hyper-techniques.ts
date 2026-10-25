import { makeTechnique } from './companion-technique';

/** Frontiers combat choreography, adapted to the knight's Hyper palette.
 * Hyper Sonic is not a transformation in Sonic Frontiers.
 */
export const HYPER_TECHNIQUES = {
  'hyper-sonic-boom': makeTechnique('Hyper Sonic Boom', 'hyper-sonic-boom', 'hover', 'strike', 1100),
  'hyper-cross-slash': makeTechnique('Hyper Cross Slash', 'hyper-cross-slash', 'hover', 'spin', 1120),
  'hyper-quick-cyloop': makeTechnique('Hyper Quick Cyloop', 'hyper-quick-cyloop', 'dash', 'spin', 1080),
  'hyper-homing-shot': makeTechnique('Hyper Homing Shot', 'hyper-homing-shot', 'hover', 'cast', 1160),
  'hyper-loop-kick': makeTechnique('Hyper Loop Kick', 'hyper-loop-kick', 'advance', 'spin', 980),
  'hyper-grand-slam': makeTechnique('Hyper Grand Slam', 'hyper-grand-slam', 'advance', 'strike', 1140),
  'hyper-parry-counter': makeTechnique('Hyper Parry Counter', 'hyper-parry-counter', 'advance', 'brace', 1060),
  'hyper-wild-rush': makeTechnique('Hyper Wild Rush', 'hyper-wild-rush', 'dash', 'rush', 940),
  'hyper-cyclone-kick': makeTechnique('Hyper Cyclone Kick', 'hyper-cyclone-kick', 'advance', 'spin', 1140),
  'hyper-spin-slash': makeTechnique('Hyper Spin Slash', 'hyper-spin-slash', 'advance', 'spin', 1080),
} as const;

export const HYPER_REPERTOIRE = [
  'hyper-sonic-boom', 'hyper-cross-slash', 'hyper-quick-cyloop', 'hyper-homing-shot',
  'hyper-loop-kick', 'hyper-grand-slam', 'hyper-parry-counter',
  'hyper-wild-rush', 'hyper-cyclone-kick', 'hyper-spin-slash',
] as const;
