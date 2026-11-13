'use client';

import type { CSSProperties } from 'react';
import { TYPE_COLORS, type ActivePokemon } from '@/lib/pokemon-team';
import type { TeamStage } from './use-pokemon-team';
import styles from './pokemon-actor.module.css';

type Props = {
  pokemon: ActivePokemon;
  stage: TeamStage;
  /** Show the still sprite: paused, or reduced motion. */
  still: boolean;
  facing?: 'left' | 'right';
  className?: string;
};

/**
 * One Pokémon on its patch of ground: the Gen 5 sprite, the Poké Ball that
 * recalls and releases it, the Mega Evolution sphere, and the effect layer
 * that draws the current move in its type's colour. Purely visual.
 */
export function PokemonActor({ pokemon, stage, still, facing = 'left', className }: Props) {
  const move = stage.kind === 'attack' ? stage.move : null;
  const src = still ? pokemon.still : pokemon.sprite;
  const style = {
    '--type': TYPE_COLORS[move?.type ?? pokemon.types[0]],
    '--walk-ms': stage.kind === 'walk' ? `${stage.duration}ms` : undefined,
  } as CSSProperties;

  return (
    <span
      className={`${styles.actor}${className ? ` ${className}` : ''}`}
      data-stage={stage.kind}
      data-move={move?.kind ?? 'none'}
      data-facing={facing}
      data-still={still || !pokemon.animated}
      data-mega={pokemon.mega}
      data-paused={still}
      style={style}
      aria-hidden="true"
    >
      <span className={styles.ground} />
      <span className={styles.megaSphere}><i /><i /><i /><i /></span>
      <span className={styles.body}>
        {/* Pixel sprites render at their native size; next/image needs fixed
            dimensions and has nothing to optimise in a local GIF. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={src} className={styles.sprite} src={src} alt="" draggable={false} decoding="async" />
      </span>
      <span className={styles.effects}><i /><i /><i /><i /></span>
      <span className={styles.flash} />
      <span className={styles.ball} />
    </span>
  );
}

/** A small Poké Ball glyph for labels and buttons. */
export function PokeBallGlyph({ className }: { className?: string }) {
  return <span className={`${styles.glyph}${className ? ` ${className}` : ''}`} aria-hidden="true" />;
}
