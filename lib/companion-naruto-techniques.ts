import { makeTechnique } from './companion-technique';

/** New techniques only. Source and adaptation boundaries are recorded in
 * docs/companion-naruto-references.md; the existing techniques keep their renderers.
 */
export const NARUTO_TECHNIQUES = {
  'sage-twin-rasengan': makeTechnique('Sage Art: Twin Rasengan', 'sage-twin-rasengan', 'advance', 'cast', 1000),
  'sage-rasengan-barrage': makeTechnique('Rasengan Barrage', 'sage-rasengan-barrage', 'advance', 'strike', 1180),
  'sage-shadow-clone': makeTechnique('Sage Mode: Shadow Clone Follow-Up', 'sage-shadow-clone', 'dash', 'vanish', 1080),
  'lava-rasenshuriken': makeTechnique('Sage Art: Lava Style Rasenshuriken', 'lava-rasenshuriken', 'hover', 'cast', 1180),
  'six-paths-shadow-rasen': makeTechnique('Six Paths: Shadow Clone: Rasen', 'six-paths-shadow-rasen', 'advance', 'draw', 1200),
  'baryon-bullet-barrage': makeTechnique('Baryon Bullet Barrage', 'baryon-bullet-barrage', 'dash', 'strike', 1040),
  'baryon-counter-kick': makeTechnique('Baryon Counter Kick', 'baryon-counter-kick', 'advance', 'spin', 820),
  'baryon-tail-barrage': makeTechnique('Baryon: Tail Barrage', 'baryon-tail-barrage', 'hover', 'brace', 1120),
  'heavenly-hand-power': makeTechnique('Heavenly Hand Power: Shadow Chidori', 'heavenly-hand-power', 'dash', 'vanish', 1060),
  'inferno-flame-control': makeTechnique('Inferno Style: Susano’o Flame Control', 'inferno-flame-control', 'hover', 'draw', 1160),
  'planetary-devastation': makeTechnique('Planetary Devastation', 'planetary-devastation', 'hover', 'brace', 1200),
  'sage-massive-rasengan-barrage': makeTechnique('Sage Art: Massive Rasengan Barrage', 'sage-massive-rasengan-barrage', 'advance', 'cast', 1200),
  'sage-uzumaki-barrage': makeTechnique('Sage Mode: Uzumaki Clone Barrage', 'sage-uzumaki-barrage', 'advance', 'strike', 1080),
  'sage-toad-summoning': makeTechnique('Summoning Jutsu: Toad Assist', 'sage-toad-summoning', 'hover', 'brace', 1180),
  'sage-shuriken-feint': makeTechnique('Shadow Clone: Rasenshuriken Feint', 'sage-shuriken-feint', 'dash', 'vanish', 1120),
  'six-paths-truthseeker-salvo': makeTechnique('Truth-Seeking Orbs: Salvo', 'six-paths-truthseeker-salvo', 'hover', 'cast', 1100),
  'six-paths-chakra-rebirth': makeTechnique('Six Paths Chakra: Rebirth', 'six-paths-chakra-rebirth', 'hover', 'brace', 1080),
  'six-paths-super-tailed-shuriken': makeTechnique('Six Paths: Super Tailed Beast Rasen Shuriken', 'six-paths-super-tailed-shuriken', 'hover', 'cast', 1200),
  'six-paths-tailed-beast-barrage': makeTechnique('Six Paths: Tailed Beast Barrage', 'six-paths-tailed-beast-barrage', 'hover', 'cast', 1180),
  'baryon-scarlet-rasengan': makeTechnique('Baryon: Scarlet Rasengan', 'baryon-scarlet-rasengan', 'advance', 'cast', 1160),
  'baryon-charge': makeTechnique('Baryon: Charge', 'baryon-charge', 'dash', 'rush', 820),
  'baryon-destructive-fist': makeTechnique('Baryon: Destructive Fist', 'baryon-destructive-fist', 'advance', 'spin', 980),
  'baryon-scarlet-flash': makeTechnique('Baryon: Scarlet Flash', 'baryon-scarlet-flash', 'dash', 'rush', 900),
  'sasuke-kirin': makeTechnique('Kirin', 'sasuke-kirin', 'hover', 'cast', 1200),
  'indra-arrow': makeTechnique('Indra’s Arrow', 'indra-arrow', 'hover', 'draw', 1200),
  'sasuke-chidori-flame-control': makeTechnique('Chidori Flame Control: Conclusion', 'sasuke-chidori-flame-control', 'dash', 'rush', 1100),
  'sasuke-fireball': makeTechnique('Fire Style: Fireball Jutsu', 'sasuke-fireball', 'hover', 'cast', 1120),
} as const;

/** Complete repertoires preserve the established signature order and techniques. */
export const NARUTO_REPERTOIRES = {
  'sage-mode': ['frog-kumite', 'sage-giant-rasengan', 'rasenshuriken', 'sage-twin-rasengan', 'sage-rasengan-barrage', 'sage-shadow-clone', 'sage-massive-rasengan-barrage', 'sage-uzumaki-barrage', 'sage-toad-summoning', 'sage-shuriken-feint'],
  'chakra-mode': ['chakra-arm-barrage', 'chakra-arm-rasengan', 'rasenshuriken', 'tailed-beast-bomb', 'lava-rasenshuriken', 'six-paths-shadow-rasen', 'six-paths-truthseeker-salvo', 'six-paths-chakra-rebirth', 'six-paths-super-tailed-shuriken', 'six-paths-tailed-beast-barrage'],
  'baryon-mode': ['baryon-rasengan', 'baryon-tail-breaker', 'baryon-breakthrough', 'baryon-bullet-barrage', 'baryon-counter-kick', 'baryon-tail-barrage', 'baryon-scarlet-rasengan', 'baryon-charge', 'baryon-destructive-fist', 'baryon-scarlet-flash'],
  'six-paths-eyes': ['chidori', 'amaterasu', 'susanoo-slash', 'heavenly-hand-power', 'inferno-flame-control', 'planetary-devastation', 'sasuke-kirin', 'indra-arrow', 'sasuke-chidori-flame-control', 'sasuke-fireball'],
} as const;
