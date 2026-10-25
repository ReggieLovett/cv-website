import type { PowerUpAction } from './companion-motion';

/** These forms have airborne movement; every power keeps its persona's body. */
export const FORM_MOBILITY: Readonly<Record<PowerUpAction, 'grounded' | 'hover'>> = {
  'sage-mode': 'grounded',
  'chakra-mode': 'hover',
  'baryon-mode': 'grounded',
  'six-paths-eyes': 'grounded',
  'deku-overdrive': 'hover',
  'hyper-sonic': 'hover',
  'zetten-mode': 'grounded',
  'devil-union': 'hover',
  'spirit-dive': 'hover',
  'sword-draw': 'grounded',
  'lightning-dash': 'grounded',
  'fire-mode': 'hover',
  'water-mode': 'hover',
};

export function canCompanionHover(form: PowerUpAction | null): boolean {
  return form !== null && FORM_MOBILITY[form] === 'hover';
}
