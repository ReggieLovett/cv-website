'use client';

import { useCallback, useEffect, useId, useRef, type CSSProperties } from 'react';
import { Check, MoreHorizontal, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { TYPE_COLORS, TYPE_INK } from '@/lib/pokemon-team';
import { PokeBallGlyph } from './pokemon-actor';
import type { TeamState } from './use-pokemon-team';
import styles from './pokemon-team-controls.module.css';

type Props = {
  team: TeamState;
  paused: boolean;
  disabled: boolean;
  onPause: () => void;
  onExpandedChange: (open: boolean) => void;
};

const typeStyle = (type: keyof typeof TYPE_COLORS) => ({ '--type': TYPE_COLORS[type], '--type-ink': TYPE_INK[type] }) as CSSProperties;

/** The companion's menu: Fight (four moves), Mega Evolution, the party, pause and reset. */
export function PokemonTeamControls({ team, paused, disabled, onPause, onExpandedChange }: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef(false);
  const expandedChangeRef = useRef(onExpandedChange);
  const id = useId();
  const { pokemon, party, box } = team;

  useEffect(() => { expandedChangeRef.current = onExpandedChange; }, [onExpandedChange]);

  const publishExpanded = useCallback((expanded: boolean) => {
    if (expandedRef.current === expanded) return;
    expandedRef.current = expanded;
    expandedChangeRef.current(expanded);
  }, []);

  const close = useCallback((restoreFocus = false) => {
    if (detailsRef.current) detailsRef.current.open = false;
    publishExpanded(false);
    if (restoreFocus) summaryRef.current?.focus({ preventScroll: true });
  }, [publishExpanded]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !detailsRef.current?.contains(event.target)) close();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      publishExpanded(false);
    };
  }, [close, publishExpanded]);

  useEffect(() => {
    // Closing for the chat must not pull focus out of that new surface.
    if (disabled) close();
  }, [disabled, close]);

  function choose(action: () => void) {
    close(true);
    action();
  }

  return (
    <details
      ref={detailsRef}
      className={styles.controls}
      data-disabled={disabled}
      onToggle={(event) => {
        if (disabled && event.currentTarget.open) {
          close();
          return;
        }
        if (event.currentTarget.open && panelRef.current) panelRef.current.scrollTop = 0;
        publishExpanded(event.currentTarget.open);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && detailsRef.current?.open) {
          event.preventDefault();
          event.stopPropagation();
          close(true);
        }
      }}
    >
      <summary
        ref={summaryRef}
        className={styles.toggle}
        aria-label="Pokémon team controls"
        aria-controls={`${id}-panel`}
        aria-disabled={disabled}
        title="Pokémon team"
        onClick={(event) => { if (disabled) event.preventDefault(); }}
      >
        <MoreHorizontal size={15} strokeWidth={1.75} aria-hidden="true" />
      </summary>

      <div ref={panelRef} id={`${id}-panel`} className={styles.panel} role="group" aria-labelledby={`${id}-heading`}>
        <p id={`${id}-heading`} className={styles.heading}>Pokémon team</p>
        <p className={styles.current} style={typeStyle(pokemon.types[0])}>
          <span className={styles.name}>
            {pokemon.name}
            {pokemon.shiny ? <span className={styles.shiny} title="Shiny"><Sparkles size={12} strokeWidth={2} aria-hidden="true" /><span className="sr-only">Shiny</span></span> : null}
          </span>
          {pokemon.tag ? <span className={styles.formTag}>{pokemon.tag}</span> : null}
          <span className={styles.types}>
            {pokemon.types.map((type) => <span key={type} className={styles.type} style={typeStyle(type)}>{type}</span>)}
          </span>
        </p>

        <div role="group" aria-label={`${pokemon.name}'s moves`} className={styles.moves}>
          {pokemon.moves.map((move) => (
            <button
              key={move.name}
              type="button"
              className={styles.move}
              style={typeStyle(move.type)}
              disabled={disabled}
              onClick={() => choose(() => team.attack(move.name))}
            >
              <span>{move.name}</span>
              <small>{move.type}</small>
            </button>
          ))}
        </div>

        {pokemon.canMega || pokemon.mega ? (
          <button
            type="button"
            className={`${styles.action} ${styles.mega}`}
            disabled={disabled || !pokemon.canMega}
            onClick={() => choose(team.megaEvolve)}
          >
            <span className={styles.keyStone} aria-hidden="true" />
            <span>{pokemon.canMega ? 'Mega Evolve' : 'Mega Evolved'}</span>
          </button>
        ) : null}
        {pokemon.formChange?.action ? (
          <button
            type="button"
            className={`${styles.action} ${styles.mega}`}
            data-change={pokemon.formChange.kind}
            style={pokemon.formChange.glow ? ({ '--glow': pokemon.formChange.glow } as CSSProperties) : undefined}
            disabled={disabled || !pokemon.canChange}
            onClick={() => choose(team.changeForm)}
          >
            <span className={styles.keyStone} aria-hidden="true" />
            <span>{pokemon.canChange ? pokemon.formChange.action : `${pokemon.formChange.tag} active`}</span>
          </button>
        ) : null}
        {pokemon.formChange?.kind === 'stance' ? (
          <p className={styles.note}>Stance Change: Blade Forme to attack, Shield Forme for King&rsquo;s Shield.</p>
        ) : null}

        <div className={styles.separator} role="separator" />
        <p className={styles.subheading}>Party</p>
        <div role="group" aria-label="Party">
          {party.map((member) => {
            const active = member.slot === pokemon.slot;
            return (
              <button
                key={member.slot}
                type="button"
                className={styles.action}
                aria-pressed={active}
                disabled={disabled}
                onClick={() => choose(() => team.switchTo(member.slot))}
              >
                <span className={styles.icon} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element -- native-size pixel icon */}
                  <img src={member.still} alt="" width={48} height={48} draggable={false} />
                </span>
                <span>{member.name}</span>
                {member.shiny ? <span className={styles.shiny} title="Shiny"><Sparkles size={12} strokeWidth={2} aria-hidden="true" /><span className="sr-only">Shiny</span></span> : null}
                {active ? <Check className={styles.selected} size={14} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>

        {box.length ? (
          <>
            <p className={styles.subheading}>PC Box</p>
            <div role="group" aria-label="PC Box" className={styles.box}>
              {box.map((member) => (
                <button
                  key={member.slot}
                  type="button"
                  className={styles.boxSlot}
                  disabled={disabled}
                  title={`Send out ${member.name}`}
                  aria-label={`Send out ${member.name} from the PC Box`}
                  onClick={() => choose(() => team.switchTo(member.slot))}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- native-size pixel icon */}
                  <img src={member.still} alt="" width={48} height={48} draggable={false} />
                </button>
              ))}
            </div>
            <p className={styles.note}>Sending one out puts {pokemon.name} in the Box.</p>
          </>
        ) : null}

        <div className={styles.separator} role="separator" />
        <button type="button" className={styles.action} disabled={disabled} aria-pressed={paused} onClick={() => choose(onPause)}>
          {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
          <span>{paused ? 'Resume animations' : 'Pause animations'}</span>
        </button>
        <button type="button" className={styles.action} disabled={disabled} onClick={() => choose(team.reset)}>
          <RotateCcw size={15} aria-hidden="true" />
          <span>Reset team</span>
        </button>
        <p className={styles.fanNote}>
          <PokeBallGlyph /> Pokémon fan tribute. Not affiliated with or endorsed by Nintendo or The Pokémon Company.
        </p>
      </div>
    </details>
  );
}
