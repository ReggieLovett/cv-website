'use client';

import type { CSSProperties } from 'react';
import { TYPE_COLORS, type ActivePokemon } from '@/lib/pokemon-team';
import type { TeamStage } from './use-pokemon-team';
import styles from './pokemon-actor.module.css';
import moves from './pokemon-moves.module.css';

type Props = {
  pokemon: ActivePokemon;
  stage: TeamStage;
  /** Show the still sprite: paused, or reduced motion. */
  still: boolean;
  facing?: 'left' | 'right';
  className?: string;
};

const PARTICLES = [0, 1, 2, 3, 4, 5];

/**
 * One Pokémon on its patch of ground: the Gen 5 sprite, the Poké Ball that
 * recalls and releases it, the light of a Mega Evolution or form change, and
 * the pieces that draw its current move (pokemon-moves.module.css). Visual only.
 */
export function PokemonActor({ pokemon, stage, still, facing = 'left', className }: Props) {
  const move = stage.kind === 'attack' ? stage.move : null;
  const src = still ? pokemon.still : pokemon.sprite;
  const type = TYPE_COLORS[move?.type ?? pokemon.types[0]];
  const style = {
    '--type': type,
    '--fx': move?.color ?? type,
    '--tint': move?.tint,
    '--walk-ms': stage.kind === 'walk' ? `${stage.duration}ms` : undefined,
  } as CSSProperties;
  const change = 'change' in stage ? stage.change : pokemon.formChange?.kind;
  // A fresh key restarts the pose animation even when the same move repeats.
  const poseKey = stage.kind === 'attack' ? `move-${stage.id}` : 'pose';
  const ability = 'ability' in stage ? stage.ability : undefined;
  /*
   * No Gen 5 animated sprite exists for this form, so its real still sprite is
   * animated the way Gen 5 builds idles: body parts (head, body, feet) moving
   * a pixel at a time, with small stretches and skews.
   */
  const cutout = !still && !pokemon.animated;

  return (
    <span
      className={`${styles.actor}${className ? ` ${className}` : ''}`}
      data-stage={stage.kind}
      data-motion={move?.motion ?? 'none'}
      data-facing={facing}
      data-paused={still}
      data-shiny={pokemon.shiny}
      data-landing={pokemon.landing}
      data-form={pokemon.state}
      data-change={change ?? 'none'}
      data-locomotion={pokemon.locomotion}
      style={style}
      aria-hidden="true"
    >
      <span className={styles.ground} />
      {move?.tint ? <span key={`tint-${poseKey}`} className={moves.tint} /> : null}
      <span className={styles.megaSphere}><i /><i /><i /><i /></span>
      <span className={styles.formLight}><i /><i /><i /><i /></span>
      <span className={styles.body}>
        <span key={poseKey} className={styles.pose}>
          {/* Pixel sprites render at their native size; next/image needs fixed
              dimensions and has nothing to optimise in a local GIF. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={src} className={styles.sprite} src={src} alt="" draggable={false} decoding="async" data-band={cutout ? 'feet' : undefined} />
          {cutout ? ['body', 'head'].map((band) => (
            // eslint-disable-next-line @next/next/no-img-element -- a moving body part of the same sprite
            <img key={`${src}-${band}`} className={styles.band} src={src} alt="" draggable={false} data-band={band} />
          )) : null}
        </span>
        <span className={styles.crown}><i /><i /><i /></span>
      </span>
      {move ? (
        <span key={poseKey} className={styles.effects}>
          {move.fx.map((fx) => (
            <span key={fx} className={moves.fx} data-fx={fx}>
              {fx === 'clones'
                // eslint-disable-next-line @next/next/no-img-element -- Double Team's afterimages are the sprite itself
                ? [0, 1].map((index) => <img key={index} src={src} alt="" draggable={false} />)
                : PARTICLES.map((index) => <i key={index} />)}
            </span>
          ))}
        </span>
      ) : null}
      <span className={styles.flash} />
      <span className={styles.ball} />
      <span className={styles.landing}><i /><i /><i /><i /></span>
      <span className={styles.shine}><i /><i /><i /><i /><i /><i /></span>
      {ability ? <span key={ability} className={styles.abilityBar}>{pokemon.baseName}&rsquo;s {ability}</span> : null}
    </span>
  );
}

/** A small Poké Ball glyph for labels and buttons. */
export function PokeBallGlyph({ className }: { className?: string }) {
  return <span className={`${styles.glyph}${className ? ` ${className}` : ''}`} aria-hidden="true" />;
}
