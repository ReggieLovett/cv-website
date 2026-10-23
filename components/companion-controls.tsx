'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import {
  Check, Eye, Flame, Ghost, Leaf, MoreHorizontal, Pause, Play, RotateCcw,
  Skull, Snowflake, Sparkles, Star, Swords, Wind, Zap, type LucideIcon,
} from 'lucide-react';
import { POWER_UPS, type PowerUpAction } from '@/lib/companion-motion';
import styles from './companion-controls.module.css';

type CompanionControlsProps = {
  paused: boolean;
  disabled: boolean;
  reducedMotion: boolean;
  form: PowerUpAction | null;
  onPower: (action: PowerUpAction) => void;
  onTrick: () => void;
  onBattle: () => void;
  onPause: () => void;
  onReset: () => void;
  onExpandedChange: (open: boolean) => void;
};

const POWER_ICONS: Record<string, LucideIcon> = {
  'sage-mode': Leaf,
  'chakra-mode': Flame,
  'sword-draw': Swords,
  'lightning-dash': Zap,
  'fire-mode': Flame,
  'ice-mode': Snowflake,
  'shadow-mode': Ghost,
  'zetten-mode': Swords,
  'devil-union': Skull,
  'star-magic': Star,
  'spirit-dive': Wind,
  'baryon-mode': Flame,
  'six-paths-eyes': Eye,
};

const BLACK_CLOVER_ACTIONS = new Set<PowerUpAction>(['zetten-mode', 'devil-union', 'star-magic', 'spirit-dive']);
const NINJA_ACTIONS = new Set<PowerUpAction>(['baryon-mode', 'six-paths-eyes', 'sage-mode', 'chakra-mode']);
const POWER_GROUPS = [
  { label: 'Ninja forms', powers: [
    ...POWER_UPS.filter(({ action }) => action === 'baryon-mode' || action === 'six-paths-eyes'),
    ...POWER_UPS.filter(({ action }) => action === 'sage-mode' || action === 'chakra-mode'),
  ] },
  { label: 'Black Clover', powers: POWER_UPS.filter(({ action }) => BLACK_CLOVER_ACTIONS.has(action)) },
  { label: 'More forms', powers: POWER_UPS.filter(({ action }) => !BLACK_CLOVER_ACTIONS.has(action) && !NINJA_ACTIONS.has(action)) },
];

export function CompanionControls({
  paused, disabled, reducedMotion, form,
  onPower, onTrick, onBattle, onPause, onReset, onExpandedChange,
}: CompanionControlsProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef(false);
  const expandedChangeRef = useRef(onExpandedChange);
  const id = useId();
  const activePower = POWER_UPS.find((power) => power.action === form);

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
    // Closing for a chat/dialog must not pull focus out of that new surface.
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
        aria-label="Sprite controls"
        aria-controls={`${id}-panel`}
        aria-disabled={disabled}
        title="Sprite controls"
        onClick={(event) => { if (disabled) event.preventDefault(); }}
      >
        <MoreHorizontal size={15} strokeWidth={1.75} aria-hidden="true" />
      </summary>

      <div ref={panelRef} id={`${id}-panel`} className={styles.panel} role="group" aria-labelledby={`${id}-heading`}>
        <p id={`${id}-heading`} className={styles.heading}>Sprite controls</p>
        {activePower ? (
          <p className={styles.currentForm}>Current form <span>{activePower.label}</span></p>
        ) : null}

        <button
          type="button"
          className={styles.action}
          disabled={!form || paused || disabled || reducedMotion}
          title={form ? 'Play a short combination of this form’s battle moves' : 'Choose a form first'}
          onClick={() => choose(onBattle)}
        >
          <Swords size={15} aria-hidden="true" />
          <span>Battle moves</span>
        </button>

        <button
          type="button"
          className={styles.action}
          disabled={paused || disabled || reducedMotion}
          title={reducedMotion ? 'Random tricks are off while reduced motion is enabled' : undefined}
          onClick={() => choose(onTrick)}
        >
          <Sparkles size={15} aria-hidden="true" />
          <span>Random trick</span>
        </button>
        <button
          type="button"
          className={styles.action}
          disabled={disabled}
          aria-pressed={paused}
          onClick={() => choose(onPause)}
        >
          {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
          <span>{paused ? 'Resume animations' : 'Pause animations'}</span>
        </button>
        <button
          type="button"
          className={styles.action}
          disabled={disabled}
          onClick={() => choose(onReset)}
        >
          <RotateCcw size={15} aria-hidden="true" />
          <span>Reset appearance</span>
        </button>

        <div className={styles.separator} role="separator" />

        {POWER_GROUPS.map((group) => (
          <div key={group.label} role="group" aria-label={`${group.label} powers`}>
            <p className={styles.powerHeading}>{group.label}</p>
            {group.powers.map((power) => {
              const Icon = POWER_ICONS[power.action] || Sparkles;
              const selected = form === power.action;
              return (
                <button
                  key={power.action}
                  type="button"
                  className={styles.action}
                  aria-pressed={selected}
                  disabled={paused || disabled}
                  title={reducedMotion ? 'Apply this appearance without animation' : power.description}
                  onClick={() => choose(() => onPower(power.action))}
                >
                  <Icon size={15} aria-hidden="true" />
                  <span>{power.label}</span>
                  {selected ? <Check className={styles.selected} size={14} aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </details>
  );
}
