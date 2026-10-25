import type { CSSProperties } from 'react';
import type { CompanionPersona, PowerUpAction } from './companion-motion';

export const SPRITE_LOGICAL_WIDTH = 16;
export const SPRITE_LOGICAL_HEIGHT = 28;
export const SPRITE_SCALE = 3;
export const SPRITE_FRAME_WIDTH = SPRITE_LOGICAL_WIDTH * SPRITE_SCALE;
export const SPRITE_FRAME_HEIGHT = SPRITE_LOGICAL_HEIGHT * SPRITE_SCALE;
export const SPRITE_SEQUENCE_LENGTH = 4;

export const CLASSIC_COMPANION_SPRITE = {
  kind: 'classic',
  src: '/sprites/dungeon-tileset.png',
  size: '1536px 1536px',
  idleX: -384,
  walkX: -576,
  y: -300,
} as const;

export const COMPANION_VARIANT_ATLAS = {
  src: '/sprites/companion-variants.svg',
  columns: 8,
  rows: 1,
} as const;

export type CompanionSprite = typeof CLASSIC_COMPANION_SPRITE | {
  readonly kind: 'variant';
  readonly row: number;
};

export const BASE_COMPANION_SPRITES = {
  portfolio: CLASSIC_COMPANION_SPRITE,
  zelda: { kind: 'variant', row: 0 },
} as const satisfies Record<CompanionPersona, CompanionSprite>;

/** Power-ups add equipment to the active persona instead of swapping its body. */
export const POWER_UP_SPRITES: Partial<Record<PowerUpAction, CompanionSprite>> = {};

export type CompanionSpriteStyle = CSSProperties & {
  '--sprite-image': string;
  '--sprite-y': string;
  '--sprite-size': string;
  '--sprite-idle-x': string;
  '--sprite-idle-end': string;
  '--sprite-walk-x': string;
  '--sprite-walk-end': string;
};

export function getCompanionSpriteStyle(
  persona: CompanionPersona,
  form: PowerUpAction | null,
): CompanionSpriteStyle {
  const override = form ? (POWER_UP_SPRITES as Partial<Record<PowerUpAction, CompanionSprite>>)[form] : undefined;
  const sprite = override ?? BASE_COMPANION_SPRITES[persona];
  const variant = sprite.kind === 'variant';
  const idleX = variant ? 0 : sprite.idleX;
  const walkX = variant ? -SPRITE_FRAME_WIDTH * SPRITE_SEQUENCE_LENGTH : sprite.walkX;
  const sequenceWidth = SPRITE_FRAME_WIDTH * SPRITE_SEQUENCE_LENGTH;
  return {
    '--sprite-image': `url("${variant ? COMPANION_VARIANT_ATLAS.src : sprite.src}")`,
    '--sprite-size': variant
      ? `${SPRITE_FRAME_WIDTH * COMPANION_VARIANT_ATLAS.columns}px ${SPRITE_FRAME_HEIGHT * COMPANION_VARIANT_ATLAS.rows}px`
      : sprite.size,
    '--sprite-y': `${variant ? -SPRITE_FRAME_HEIGHT * sprite.row : sprite.y}px`,
    '--sprite-idle-x': `${idleX}px`,
    '--sprite-idle-end': `${idleX - sequenceWidth}px`,
    '--sprite-walk-x': `${walkX}px`,
    '--sprite-walk-end': `${walkX - sequenceWidth}px`,
  };
}
