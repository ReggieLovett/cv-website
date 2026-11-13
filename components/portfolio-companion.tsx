'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { CHAT_PERSONAS } from '@/lib/chat-persona';
import { getZeldaServerSnapshot, isZeldaOn, subscribeToZelda } from '@/lib/zelda';
import { PokemonActor, PokeBallGlyph } from './pokemon-actor';
import { PokemonTeamControls } from './pokemon-team-controls';
import { usePokemonTeam } from './use-pokemon-team';
import styles from './portfolio-companion.module.css';

const PortfolioChat = dynamic(() => import('./portfolio-chat'), { ssr: false });

/** Matches .companion's width in portfolio-companion.module.css. */
const ACTOR_WIDTH = 136;

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * The chat launcher: Reggie's Pokémon team, one member out at a time. It rests
 * at the bottom right, wanders along the bottom edge, attacks, switches through
 * its Poké Balls and Mega Evolves; the Zelda theme brings out a second team.
 */
export function PortfolioCompanion() {
  const [open, setOpen] = useState(false);
  const [visited, setVisited] = useState(false);
  const [paused, setPaused] = useState(false);
  const [comment, setComment] = useState(0);
  const [held, setHeld] = useState({ hover: false, focus: false, menu: false });
  const zelda = useSyncExternalStore(subscribeToZelda, isZeldaOn, getZeldaServerSnapshot);
  const persona = zelda ? 'zelda' : 'portfolio';
  const profile = CHAT_PERSONAS[persona];
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, () => true);
  const still = paused || reducedMotion;
  const hold = held.hover || held.focus || held.menu;
  const advanceComment = useCallback(() => setComment((current) => current + 1), []);
  const team = usePokemonTeam({
    persona,
    auto: !open && !still && !hold,
    instant: still,
    actorWidth: ACTOR_WIDTH,
    onMoment: advanceComment,
  });
  const { pokemon, party, stage, text, x, direction } = team;
  const onMenu = useCallback((menu: boolean) => setHeld((current) => ({ ...current, menu })), []);

  // Party stills are tiny and needed by the menus; animated sprites load once
  // the page is idle, so a switch never waits on the network.
  useEffect(() => {
    const load = (sources: string[]) => sources.forEach((src) => { new Image().src = src; });
    load(party.map((member) => member.still));
    if (still) return;
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => load(party.map((member) => member.sprite)));
    return () => cancel(handle);
  }, [party, still]);

  const style = {
    '--x': `${x}px`,
    '--walk-ms': stage.kind === 'walk' ? `${stage.duration}ms` : '0ms',
  } as CSSProperties;

  return (
    <>
      <div
        className={styles.companion}
        style={style}
        data-persona={persona}
        data-open={open}
        data-stage={stage.kind}
        data-speaking={Boolean(text)}
        onPointerEnter={() => setHeld((current) => ({ ...current, hover: true }))}
        onPointerLeave={() => setHeld((current) => ({ ...current, hover: false }))}
        onPointerDownCapture={() => setHeld((current) => ({ ...current, focus: false }))}
        onFocusCapture={(event) => {
          const focus = event.target.matches(':focus-visible');
          setHeld((current) => ({ ...current, focus }));
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHeld((current) => ({ ...current, focus: false }));
        }}
      >
        <button
          type="button"
          className={styles.launcher}
          aria-label={`${profile.launcherLabel}. ${pokemon.name} is out.`}
          aria-haspopup="dialog"
          data-sound="select"
          aria-expanded={open}
          aria-controls="portfolio-chat"
          onClick={() => { setVisited(true); setOpen(true); }}
        >
          <span className={styles.bubble} aria-hidden="true">
            {text ? <PokeBallGlyph className={styles.bubbleIcon} /> : <MessageCircle className={styles.bubbleIcon} size={13} strokeWidth={1.6} />}
            <span>{text ?? profile.comments[comment % profile.comments.length]}</span>
          </span>
          <PokemonActor pokemon={pokemon} stage={stage} still={still} facing={direction} />
          <span className={styles.caption}>
            <span className={styles.nameplate}>{pokemon.name}{pokemon.shiny ? ' ★' : ''}</span>
            <span className={styles.ask}>{profile.caption} <ArrowUpRight size={11} aria-hidden="true" /></span>
          </span>
        </button>
      </div>
      <PokemonTeamControls
        team={team}
        paused={paused}
        disabled={open}
        onPause={() => setPaused((current) => !current)}
        onExpandedChange={onMenu}
      />
      {visited && <PortfolioChat persona={persona} open={open} onClose={() => setOpen(false)} team={team} still={still} />}
    </>
  );
}
