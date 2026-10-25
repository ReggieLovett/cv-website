import { makeTechnique } from './companion-technique';

/** OFA's ranged pressure and reinforced binding, plus original knight techniques. */
export const EXTRA_TECHNIQUES = {
  'deku-air-force': makeTechnique('Delaware Smash: Air Force', 'deku-air-force', 'hover', 'cast', 1020),
  'deku-blackchain': makeTechnique('Blackchain', 'deku-blackchain', 'advance', 'cast', 1120),
  'deku-detroit-quintuple': makeTechnique('Detroit Smash: Quintuple', 'deku-detroit-quintuple', 'advance', 'strike', 1160),
  'deku-manchester-smash': makeTechnique('Faux 100%: Manchester Smash', 'deku-manchester-smash', 'dash', 'strike', 1100),
  'deku-st-louis-air-force': makeTechnique('St. Louis Smash: Air Force', 'deku-st-louis-air-force', 'hover', 'spin', 1120),
  'knight-spin-cut': makeTechnique('Whirling Blade', 'knight-spin-cut', 'advance', 'spin', 980),
  'knight-shield-riposte': makeTechnique('Shield Riposte', 'knight-shield-riposte', 'advance', 'brace', 1080),
  'knight-lunge': makeTechnique('Piercing Lunge', 'knight-lunge', 'dash', 'rush', 840),
  'knight-rising-cut': makeTechnique('Rising Cut', 'knight-rising-cut', 'advance', 'draw', 940),
  'knight-pommel-strike': makeTechnique('Pommel Strike', 'knight-pommel-strike', 'advance', 'strike', 820),
  'knight-blade-beam': makeTechnique('Blade Beam', 'knight-blade-beam', 'hover', 'draw', 1080),
  'knight-counter-cut': makeTechnique('Deflect & Counter', 'knight-counter-cut', 'advance', 'brace', 1100),
} as const;
