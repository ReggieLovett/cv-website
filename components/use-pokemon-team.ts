'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChatPersona } from '@/lib/chat-persona';
import {
  battleText, DURATIONS, formText, nextAutoDelay, pickAutoAction, pickMove, pickNextSlot, planWander,
  resolveMember, SPEEDS, stanceFor, TEAMS, wanderMinX,
  type ActivePokemon, type AutoAction, type FormChange, type FormState, type MoveName, type ResolvedMove,
} from '@/lib/pokemon-team';

/**
 * What the sprite is doing. The companion and the chat header both render the
 * active Pokémon from this, so a switch or transformation plays in both.
 */
export type TeamStage =
  | { kind: 'idle' }
  | { kind: 'walk'; duration: number }
  | { kind: 'attack'; move: ResolvedMove; id: number }
  | { kind: 'recall' }
  | { kind: 'throw' }
  | { kind: 'release' }
  | { kind: 'mega-charge' }
  | { kind: 'mega-reveal' }
  | { kind: 'form-charge'; change: FormChange['kind'] }
  | { kind: 'form-reveal'; change: FormChange['kind'] }
  | { kind: 'form-revert'; change: FormChange['kind'] }
  /** An ability activating: Gen 5 shows its name in a banner (Stance Change, Intrepid Sword). */
  | { kind: 'stance'; ability?: string }
  | { kind: 'ability'; ability: string }
  /** A shiny Pokémon sparkles as it is sent out. */
  | { kind: 'shiny' };

export type TeamState = {
  pokemon: ActivePokemon;
  party: ActivePokemon[];
  stage: TeamStage;
  text: string | null;
  x: number;
  direction: 'left' | 'right';
  attack: (name?: MoveName) => void;
  switchTo: (slot: number) => void;
  megaEvolve: () => void;
  changeForm: () => void;
  reset: () => void;
};

type Snapshot = {
  persona: ChatPersona;
  slot: number;
  /** Each slot's current form; missing means base. */
  forms: Readonly<Record<number, FormState>>;
  /** Moves used in a time-limited form (Gigantamax). */
  turns: Readonly<Record<number, number>>;
  stage: TeamStage;
  text: string | null;
  x: number;
  direction: 'left' | 'right';
  /** Counts finished actions; each one restarts the automatic rest. */
  settled: number;
};

type Step = { stage: TeamStage; duration: number; text?: string; apply?: (snapshot: Snapshot) => Partial<Snapshot> };

type Options = {
  persona: ChatPersona;
  /** Automatic actions run only while this is true. */
  auto: boolean;
  /** Paused or reduced motion: requested actions apply at once, without staging. */
  instant: boolean;
  /** Approximate actor width, for keeping a wander inside the viewport. */
  actorWidth: number;
  onMoment?: () => void;
};

const IDLE: TeamStage = { kind: 'idle' };
/** Numbers each planned move, so a repeated move still restarts its animation. */
let moveCount = 0;

function fresh(persona: ChatPersona): Snapshot {
  return { persona, slot: 0, forms: {}, turns: {}, stage: IDLE, text: null, x: 0, direction: 'left', settled: 0 };
}

function viewportWidth() {
  return document.documentElement.clientWidth || window.innerWidth;
}

const setForm = (slot: number, state: FormState) => (snapshot: Snapshot): Partial<Snapshot> => ({
  forms: { ...snapshot.forms, [slot]: state },
  turns: { ...snapshot.turns, [slot]: 0 },
});

export function usePokemonTeam({ persona, auto, instant, actorWidth, onMoment }: Options): TeamState {
  const [raw, setRaw] = useState<Snapshot>(() => fresh(persona));
  // A theme change brings out the other persona's team from the start.
  const state = raw.persona === persona ? raw : fresh(persona);
  const team = TEAMS[persona];
  const { slot, forms, turns, stage, text, x, direction, settled } = state;

  const pokemon = useMemo(() => resolveMember(team, slot, forms[slot]), [team, slot, forms]);
  const party = useMemo(() => team.map((_, index) => resolveMember(team, index, forms[index])), [team, forms]);

  /** Merges a change into this persona's snapshot, starting fresh if the persona changed. */
  const patch = useCallback((change: Partial<Snapshot> | ((current: Snapshot) => Partial<Snapshot>)) => {
    setRaw((previous) => {
      const base = previous.persona === persona ? previous : fresh(persona);
      return { ...base, ...(typeof change === 'function' ? change(base) : change) };
    });
  }, [persona]);

  // Timer callbacks outlive the render that scheduled them; they read these.
  const live = useRef({ pokemon, slot, x, forms, turns, teamSize: team.length });
  useEffect(() => {
    live.current = { pokemon, slot, x, forms, turns, teamSize: team.length };
  });
  const busy = useRef(false);
  const token = useRef(0);
  const timers = useRef<{ step?: ReturnType<typeof setTimeout>; text?: ReturnType<typeof setTimeout>; auto?: ReturnType<typeof setTimeout> }>({});
  const previousAction = useRef<AutoAction | null>(null);
  const previousMove = useRef<string | null>(null);
  const onMomentRef = useRef(onMoment);
  useEffect(() => { onMomentRef.current = onMoment; }, [onMoment]);

  const stop = useCallback(() => {
    token.current += 1;
    busy.current = false;
    clearTimeout(timers.current.step);
    clearTimeout(timers.current.text);
  }, []);

  const fadeText = useCallback((after: number) => {
    clearTimeout(timers.current.text);
    timers.current.text = setTimeout(() => patch({ text: null }), after);
  }, [patch]);

  /** Plays steps in order. A newer request cancels whatever is still running. */
  const run = useCallback((steps: Step[]) => {
    stop();
    const current = token.current;
    busy.current = true;
    const next = (index: number) => {
      if (current !== token.current) return;
      const step = steps[index];
      if (!step) {
        busy.current = false;
        patch((snapshot) => ({ stage: IDLE, settled: snapshot.settled + 1 }));
        fadeText(900);
        onMomentRef.current?.();
        return;
      }
      patch((snapshot) => ({ ...step.apply?.(snapshot), stage: step.stage, ...(step.text ? { text: step.text } : {}) }));
      timers.current.step = setTimeout(() => next(index + 1), step.duration);
    };
    next(0);
  }, [fadeText, patch, stop]);

  /** Applies a change at once, with its line of battle text. */
  const settle = useCallback((line: string, apply?: (snapshot: Snapshot) => Partial<Snapshot>) => {
    stop();
    patch((snapshot) => ({ ...apply?.(snapshot), stage: IDLE, text: line }));
    fadeText(DURATIONS.text);
  }, [fadeText, patch, stop]);

  /**
   * The steps for one move: a Stance Change first when Aegislash needs one,
   * then the move, then the end of a time-limited form once its turns run out.
   */
  const moveSteps = useCallback((member: ActivePokemon, move: ResolvedMove, used: number): Step[] => {
    const steps: Step[] = [];
    const change = member.formChange;
    const stance = stanceFor(member, move);
    if (change && stance) {
      steps.push({
        stage: { kind: 'stance', ability: change.ability },
        duration: DURATIONS.stance,
        text: formText(stance === 'form' ? change.done : change.revert ?? change.done, member.baseName),
        apply: setForm(member.slot, stance),
      });
    }
    const resolved = stance ? resolveMember(team, member.slot, stance) : member;
    const swapped = resolved.moves.find((candidate) => candidate.name === move.name) ?? move;
    steps.push({
      stage: { kind: 'attack', move: swapped, id: (moveCount += 1) },
      duration: swapped.motion === 'boost' ? DURATIONS.boost : DURATIONS.attack,
      text: battleText.used(resolved.name, swapped.name),
      apply: (snapshot) => (member.state === 'form' && change?.turns
        ? { turns: { ...snapshot.turns, [member.slot]: (snapshot.turns[member.slot] ?? 0) + 1 } }
        : {}),
    });
    // Gen 5 follows a status move with its result, one message at a time.
    for (const line of swapped.after ?? []) {
      steps.push({ stage: IDLE, duration: DURATIONS.after, text: formText(line, resolved.name) });
    }
    if (member.state === 'form' && change?.turns && used + 1 >= change.turns) {
      steps.push({
        stage: { kind: 'form-revert', change: change.kind },
        duration: DURATIONS.formReveal,
        text: formText(change.revert ?? '', member.baseName),
        apply: setForm(member.slot, 'base'),
      });
    }
    return steps;
  }, [team]);

  const attack = useCallback((name?: MoveName, combo = false) => {
    const { pokemon: current, turns: used } = live.current;
    const first = name
      ? current.moves.find((candidate) => candidate.name === name) ?? null
      : pickMove(current.moves, previousMove.current);
    if (!first) return;
    previousMove.current = first.name;
    if (instant) {
      const stance = stanceFor(current, first);
      settle(battleText.used(current.name, first.name), stance ? setForm(current.slot, stance) : undefined);
      return;
    }
    const steps = moveSteps(current, first, used[current.slot] ?? 0);
    // A combo follows with a second, different move, unless the form just ended.
    if (combo && !steps.some((step) => step.stage.kind === 'form-revert')) {
      const second = pickMove(current.moves.filter((move) => move.name !== first.name), null);
      if (second) {
        const after = stanceFor(current, first) ?? current.state;
        const member = resolveMember(team, current.slot, after);
        steps.push({ stage: IDLE, duration: 260 }, ...moveSteps(member, second, (used[current.slot] ?? 0) + 1));
        previousMove.current = second.name;
      }
    }
    run(steps);
  }, [instant, moveSteps, run, settle, team]);

  const switchTo = useCallback((target: number) => {
    const { pokemon: from, slot: current, teamSize, forms: states } = live.current;
    if (target === current || target < 0 || target >= teamSize) return;
    const to = resolveMember(team, target, states[target]);
    // A recalled Pokémon returns to its base form, so its transformation can play again.
    const leave = (snapshot: Snapshot): Partial<Snapshot> => ({ ...setForm(current, 'base')(snapshot), slot: target });
    if (instant) { settle(battleText.go(to.name), leave); return; }
    // A recalled form reverts, so the one coming out is always in its base form.
    const entering = resolveMember(team, target);
    const steps: Step[] = [
      { stage: { kind: 'recall' }, duration: DURATIONS.recall, text: battleText.recall(from.name) },
      { stage: { kind: 'throw' }, duration: DURATIONS.throw, text: battleText.go(to.name), apply: leave },
      { stage: { kind: 'release' }, duration: DURATIONS.release },
    ];
    if (entering.shiny) steps.push({ stage: { kind: 'shiny' }, duration: DURATIONS.shiny });
    if (entering.entry) {
      const { ability, text: lines } = entering.entry;
      lines.forEach((line, index) => steps.push({
        stage: index === 0 ? { kind: 'ability', ability } : IDLE,
        duration: index === 0 ? DURATIONS.ability : DURATIONS.after,
        text: formText(line, entering.name),
      }));
    }
    run(steps);
  }, [instant, run, settle, team]);

  const megaEvolve = useCallback(() => {
    const current = live.current.pokemon;
    if (!current.canMega) return;
    const evolved = resolveMember(team, current.slot, 'mega');
    const line = battleText.megaEvolved(current.name, evolved.name);
    if (instant) { settle(line, setForm(current.slot, 'mega')); return; }
    run([
      { stage: { kind: 'mega-charge' }, duration: DURATIONS.megaCharge, text: battleText.megaReacting(current.name) },
      { stage: { kind: 'mega-reveal' }, duration: DURATIONS.megaReveal, text: line, apply: setForm(current.slot, 'mega') },
    ]);
  }, [instant, run, settle, team]);

  const changeForm = useCallback(() => {
    const current = live.current.pokemon;
    const change = current.formChange;
    if (!current.canChange || !change) return;
    const line = formText(change.done, current.baseName);
    if (instant) { settle(line, setForm(current.slot, 'form')); return; }
    run([
      { stage: { kind: 'form-charge', change: change.kind }, duration: DURATIONS.formCharge, text: formText(change.charge, current.baseName) },
      { stage: { kind: 'form-reveal', change: change.kind }, duration: DURATIONS.formReveal, text: line, apply: setForm(current.slot, 'form') },
    ]);
  }, [instant, run, settle]);

  const walk = useCallback(() => {
    const { x: from, pokemon: current } = live.current;
    const plan = planWander(from, viewportWidth(), actorWidth, Math.random, SPEEDS[current.locomotion]);
    if (plan.x === from) return;
    run([{ stage: { kind: 'walk', duration: plan.duration }, duration: plan.duration, apply: () => ({ x: plan.x, direction: plan.direction }) }]);
  }, [actorWidth, run]);

  const reset = useCallback(() => {
    stop();
    previousAction.current = null;
    previousMove.current = null;
    setRaw(fresh(persona));
  }, [persona, stop]);

  // Anything still playing belongs to the previous persona's team.
  useEffect(() => () => {
    token.current += 1;
    busy.current = false;
    clearTimeout(timers.current.step);
  }, [persona]);

  // The automatic loop: rest, then one action, then rest again.
  useEffect(() => {
    if (!auto) return;
    const pending = timers.current;
    const schedule = () => {
      pending.auto = setTimeout(() => {
        if (document.hidden || busy.current) { schedule(); return; }
        const current = live.current.pokemon;
        const action = pickAutoAction(
          { canMega: current.canMega, canChange: current.canChange, teamSize: live.current.teamSize },
          previousAction.current,
        );
        previousAction.current = action;
        if (action === 'attack' || action === 'combo') attack(undefined, action === 'combo');
        else if (action === 'walk') walk();
        else if (action === 'switch') switchTo(pickNextSlot(live.current.teamSize, live.current.slot));
        else if (action === 'mega') megaEvolve();
        else changeForm();
      }, nextAutoDelay());
    };
    schedule();
    return () => clearTimeout(pending.auto);
    // `settled` restarts the rest after every finished action.
  }, [auto, settled, attack, walk, switchTo, megaEvolve, changeForm]);

  // A narrower window pulls a wandering actor back inside it.
  useEffect(() => {
    const onResize = () => {
      const minX = wanderMinX(viewportWidth(), actorWidth);
      if (live.current.x < minX) patch({ x: minX });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [actorWidth, patch]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      token.current += 1;
      clearTimeout(pending.step);
      clearTimeout(pending.text);
      clearTimeout(pending.auto);
    };
  }, []);

  const requestMove = useCallback((name?: MoveName) => attack(name), [attack]);

  return { pokemon, party, stage, text, x, direction, attack: requestMove, switchTo, megaEvolve, changeForm, reset };
}
