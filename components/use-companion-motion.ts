'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import {
  isPowerUp, nextPowerUpDelay, nextSpriteDelay, nextTravelDelay,
  pickAmbientAction, pickPowerUp, pickSpriteAction, SPRITE_ACTIONS,
  type CompanionPersona, type PowerUpAction, type SpriteAction,
} from '@/lib/companion-motion';
import { BATTLE_MOVES, FORM_BATTLES, nextBattleDelay, pickBattleSequence, type BattleMove } from '@/lib/companion-battle';
import { ACTOR_HEIGHT, ACTOR_WIDTH, clampBattlePoint, clampPoint, planTravel, type CompanionPoint } from '@/lib/companion-travel';

type Options = {
  roamerRef: RefObject<HTMLDivElement>;
  poseRef: RefObject<HTMLSpanElement>;
  persona: CompanionPersona;
  open: boolean;
  paused: boolean;
  reducedMotion: boolean;
  onMoment: () => void;
};
type Controls = { sync: () => void; trick: (action?: SpriteAction) => void; battle: () => void; reset: () => void };
type Clocks = { ambient: number; power: number; travel: number; battle: number };
const NO_CONTROLS: Controls = { sync: () => {}, trick: () => {}, battle: () => {}, reset: () => {} };
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const pointTransform = ({ x }: CompanionPoint) => `translate3d(${x}px, 0px, 0)`;

/** One owner coordinates bottom-edge travel, transformations, and form-specific battles. */
export function useCompanionMotion({ roamerRef, poseRef, persona, open, paused, reducedMotion, onMoment }: Options) {
  const [form, setForm] = useState<PowerUpAction | null>(null);
  const formRef = useRef<PowerUpAction | null>(null);
  const controlsRef = useRef<Controls>(NO_CONTROLS);
  const pausedRef = useRef(paused);
  const heldRef = useRef(false);
  const controlsOpenRef = useRef(false);
  const positionRef = useRef<CompanionPoint>({ x: 0, y: 0 });
  const previousActionRef = useRef<SpriteAction | null>(null);
  const previousPowerRef = useRef<PowerUpAction | null>(null);
  const previousBattleRef = useRef<BattleMove | null>(null);
  const clocksRef = useRef<Clocks | null>(null);
  const personaRef = useRef(persona);

  useEffect(() => {
    const roamer = roamerRef.current;
    const pose = poseRef.current;
    if (!roamer || !pose) return;
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let activeSince: number | null = null;
    let manual = false;
    let pendingManualBattle = false;
    let movement: Animation | null = null;
    let performance: Animation | null = null;
    let phase: 'idle' | 'walking' | 'performing' | 'battling' = 'idle';
    let continuation: (() => void) | null = null;
    let continuationRemaining = 0;
    let moves: BattleMove[] = [];
    let operation = 0;
    const clocks = clocksRef.current ?? {
      ambient: nextSpriteDelay(), power: nextPowerUpDelay(), travel: nextTravelDelay(), battle: nextBattleDelay(),
    };
    clocksRef.current = clocks;
    const viewport = () => ({
      width: document.documentElement?.clientWidth || window.innerWidth,
      height: document.documentElement?.clientHeight || window.innerHeight,
    });
    const applyForm = (value: PowerUpAction | null) => {
      formRef.current = value;
      roamer.dataset.form = value ?? 'none';
      setForm(value);
    };
    if (personaRef.current !== persona) {
      personaRef.current = persona;
      previousActionRef.current = null;
      previousPowerRef.current = null;
      previousBattleRef.current = null;
      applyForm(null);
    }
    const enabled = () => !disposed && !open && !pausedRef.current && !reducedMotion && !document.hidden;
    const allowed = () => enabled() && !controlsOpenRef.current && (!heldRef.current || manual);
    const setPhase = (value: typeof phase) => { phase = value; roamer.dataset.phase = value; };
    const clearTimer = () => { if (timer !== undefined) clearTimeout(timer); timer = undefined; };
    const advanceClocks = () => {
      if (activeSince === null) return;
      const now = window.performance.now();
      const elapsed = Math.max(0, now - activeSince);
      for (const key of Object.keys(clocks) as (keyof Clocks)[]) clocks[key] = Math.max(0, clocks[key] - elapsed);
      if (continuation) continuationRemaining = Math.max(0, continuationRemaining - elapsed);
      activeSince = now;
    };
    const livePoint = () => {
      if (!movement) return { x: positionRef.current.x, y: 0 };
      const matrix = new DOMMatrixReadOnly(getComputedStyle(roamer).transform);
      return { x: matrix.m41, y: 0 };
    };
    const positionSpeech = (point = livePoint()) => {
      const { width, height } = viewport();
      const inset = width <= 600 ? 12 : 18;
      const left = width - inset - ACTOR_WIDTH + point.x;
      const top = height - inset - ACTOR_HEIGHT + point.y;
      const bubbleWidth = Math.min(208, Math.max(64, width - 32));
      const bubbleLeft = Math.max(16, Math.min(width - 16 - bubbleWidth, left + 32 - bubbleWidth / 2));
      roamer.style.setProperty('--speech-x', `${bubbleLeft - left}px`);
      roamer.style.setProperty('--speech-tail-x', `${Math.max(10, Math.min(bubbleWidth - 18, left + 28 - bubbleLeft))}px`);
      const labelLeft = Math.max(16, Math.min(width - 196, left - 58));
      roamer.style.setProperty('--attack-x', `${labelLeft - left}px`);
      roamer.dataset.speechSide = top < 90 ? 'below' : 'above';
    };
    const freezeTravel = () => {
      positionRef.current = livePoint();
      roamer.style.transform = pointTransform(positionRef.current);
      if (movement) movement.onfinish = null;
      movement?.cancel();
      movement = null;
      positionSpeech();
    };
    const cancelPose = () => {
      if (performance) performance.onfinish = null;
      performance?.cancel();
      performance = null;
    };
    const cancelAction = () => {
      operation += 1;
      cancelPose();
      continuation = null;
      continuationRemaining = 0;
      moves = [];
      roamer.dataset.action = 'none';
      roamer.dataset.effect = 'none';
      roamer.dataset.battle = 'none';
      roamer.dataset.battleMove = 'none';
      roamer.dataset.battleLabel = '';
      roamer.dataset.form = formRef.current ?? 'none';
      pendingManualBattle = false;
      manual = false;
    };
    const sync = () => {
      advanceClocks();
      clearTimer();
      if (!allowed()) {
        activeSince = null;
        movement?.pause();
        performance?.pause();
        roamer.dataset.motion = 'paused';
        positionSpeech();
        return;
      }
      activeSince = window.performance.now();
      roamer.dataset.motion = 'running';
      if (movement?.playState === 'paused') movement.play();
      if (performance?.playState === 'paused') performance.play();
      if (phase === 'battling' && continuation) {
        timer = setTimeout(() => {
          timer = undefined;
          advanceClocks();
          const next = continuation;
          continuation = null;
          if (!disposed) next?.();
        }, continuationRemaining);
        return;
      }
      if (phase === 'performing' || phase === 'battling') return;
      let kind: keyof Clocks = 'power';
      if (formRef.current && clocks.battle < clocks[kind]) kind = 'battle';
      if (clocks.ambient < clocks[kind]) kind = 'ambient';
      if (phase === 'idle' && clocks.travel < clocks[kind]) kind = 'travel';
      timer = setTimeout(() => {
        timer = undefined;
        if (!allowed()) { sync(); return; }
        advanceClocks();
        if (kind === 'power') perform(false, pickPowerUp(previousPowerRef.current));
        else if (kind === 'battle') battle(pendingManualBattle);
        else if (kind === 'ambient') perform(false, pickAmbientAction(persona, previousActionRef.current));
        else walk();
      }, clocks[kind]);
    };
    const finishBattle = () => {
      advanceClocks();
      freezeTravel();
      cancelAction();
      setPhase('idle');
      clocks.battle = nextBattleDelay();
      clocks.travel = nextTravelDelay();
      clocks.ambient = Math.max(2500, clocks.ambient);
      clocks.power = Math.max(2500, clocks.power);
      sync();
    };
    const nextMove = () => {
      const heldForm = formRef.current;
      const move = moves.shift();
      if (!heldForm || !move) { finishBattle(); return; }
      const config = BATTLE_MOVES[move];
      const profile = FORM_BATTLES[heldForm];
      const token = operation;
      const origin = positionRef.current;
      const plan = planTravel(origin, viewport(), config.travel, profile.speed);
      const pathLength = Math.max(1, Math.hypot(plan.destination.x - origin.x, plan.destination.y - origin.y));
      roamer.style.setProperty('--dash-trail-x', `${-Math.abs(plan.destination.x - origin.x) / pathLength * 30}px`);
      roamer.style.setProperty('--dash-trail-y', `${-(plan.destination.y - origin.y) / pathLength * 30}px`);
      roamer.dataset.direction = plan.direction;
      roamer.dataset.battle = config.effect;
      roamer.dataset.battleMove = move;
      roamer.dataset.battleLabel = config.label;
      roamer.style.setProperty('--battle-duration', `${config.duration}ms`);
      previousBattleRef.current = move;
      movement = roamer.animate(
        [{ transform: pointTransform(origin) }, { transform: pointTransform(plan.destination) }],
        { duration: Math.min(config.duration, plan.duration), easing: EASE_OUT, fill: 'forwards' },
      );
      movement.onfinish = () => {
        if (disposed || token !== operation) return;
        positionRef.current = plan.destination;
        freezeTravel();
      };
      performance = pose.animate(config.keyframes, { duration: config.duration, fill: 'both' });
      performance.onfinish = () => {
        if (disposed || token !== operation) return;
        advanceClocks();
        freezeTravel();
        cancelPose();
        roamer.dataset.battle = 'none';
        roamer.dataset.battleMove = 'none';
        roamer.dataset.battleLabel = '';
        if (!moves.length) { finishBattle(); return; }
        continuation = nextMove;
        continuationRemaining = 160;
        sync();
      };
      sync();
    };
    const battle = (requested = false) => {
      if (!enabled() || !formRef.current || controlsOpenRef.current) return;
      if (heldRef.current && !requested) { sync(); return; }
      advanceClocks();
      clearTimer();
      freezeTravel();
      cancelAction();
      manual = requested;
      moves = pickBattleSequence(formRef.current, previousBattleRef.current);
      clocks.battle = nextBattleDelay();
      setPhase('battling');
      nextMove();
    };
    const perform = (requested = false, chosen?: SpriteAction) => {
      if (reducedMotion && requested && chosen && isPowerUp(chosen) && !open && !pausedRef.current && !disposed) {
        applyForm(chosen);
        previousPowerRef.current = chosen;
        return;
      }
      if (!enabled() || controlsOpenRef.current) return;
      if (heldRef.current && !requested) { sync(); return; }
      if (phase === 'performing' && (!requested || chosen === previousActionRef.current)) return;
      advanceClocks();
      let interruptedPose: Pick<Keyframe, 'transform' | 'opacity'> | null = null;
      if (performance) {
        const currentPose = getComputedStyle(pose);
        interruptedPose = { transform: currentPose.transform, opacity: currentPose.opacity };
      }
      clearTimer();
      freezeTravel();
      cancelAction();
      const token = operation;
      const action = chosen ?? pickSpriteAction(persona, previousActionRef.current);
      const config = SPRITE_ACTIONS[action];
      if (isPowerUp(action)) {
        roamer.dataset.direction = 'left';
        roamer.dataset.form = 'none';
        previousPowerRef.current = action;
        clocks.power = nextPowerUpDelay();
        // Enter the effect-safe area during the initial crouch, before the lift.
        const origin = positionRef.current;
        const stagingPoint = clampBattlePoint(origin, viewport());
        if (Math.hypot(stagingPoint.x - origin.x, stagingPoint.y - origin.y) > 1) {
          movement = roamer.animate(
            [{ transform: pointTransform(origin) }, { transform: pointTransform(stagingPoint) }],
            { duration: 300, easing: EASE_OUT, fill: 'forwards' },
          );
          movement.onfinish = () => {
            if (disposed || token !== operation) return;
            positionRef.current = stagingPoint;
            freezeTravel();
          };
        }
      } else clocks.ambient = nextSpriteDelay();
      previousActionRef.current = action;
      manual = requested;
      setPhase('performing');
      roamer.dataset.action = action;
      roamer.dataset.effect = config.effect;
      roamer.style.setProperty('--moment-duration', `${config.duration}ms`);
      const keyframes = interruptedPose
        ? config.keyframes.map((frame, index) => index === 0 ? { ...frame, ...interruptedPose } : frame)
        : config.keyframes;
      performance = pose.animate(keyframes, { duration: config.duration, fill: 'both' });
      performance.onfinish = () => {
        if (disposed || token !== operation) return;
        advanceClocks();
        if (isPowerUp(action)) applyForm(action);
        cancelAction();
        setPhase('idle');
        clocks.travel = nextTravelDelay();
        clocks.ambient = Math.max(3000, clocks.ambient);
        if (isPowerUp(action)) {
          // Finish the transformation, take a breath, then demonstrate its moves.
          clocks.battle = 550;
          pendingManualBattle = requested;
          manual = requested;
        }
        sync();
      };
      onMoment();
      sync();
    };
    const walk = () => {
      if (!allowed()) { sync(); return; }
      const origin = positionRef.current;
      const speed = formRef.current ? Math.max(45, FORM_BATTLES[formRef.current].speed * 0.18) : 24 + Math.random() * 12;
      const plan = planTravel(origin, viewport(), 'wander', speed);
      clocks.travel = nextTravelDelay();
      if (Math.hypot(plan.destination.x - origin.x, plan.destination.y - origin.y) < 2) { sync(); return; }
      roamer.dataset.direction = plan.direction;
      setPhase('walking');
      movement = roamer.animate(
        [{ transform: pointTransform(origin) }, { transform: pointTransform(plan.destination) }],
        { duration: plan.duration, easing: 'linear', fill: 'forwards' },
      );
      movement.onfinish = () => {
        if (disposed) return;
        advanceClocks();
        positionRef.current = plan.destination;
        freezeTravel();
        setPhase('idle');
        clocks.travel = nextTravelDelay();
        sync();
      };
      sync();
    };
    const resetForm = () => {
      advanceClocks();
      clearTimer();
      freezeTravel();
      cancelAction();
      setPhase('idle');
      applyForm(null);
      clocks.power = nextPowerUpDelay();
      clocks.travel = nextTravelDelay();
      clocks.battle = nextBattleDelay();
      sync();
    };
    const onResize = () => {
      advanceClocks();
      clearTimer();
      freezeTravel();
      cancelAction();
      positionRef.current = clampPoint(positionRef.current, viewport());
      roamer.style.transform = pointTransform(positionRef.current);
      positionSpeech();
      setPhase('idle');
      clocks.travel = nextTravelDelay();
      clocks.battle = nextBattleDelay();
      sync();
    };
    setPhase('idle');
    cancelAction();
    if (reducedMotion) positionRef.current = { x: 0, y: 0 };
    positionRef.current = clampPoint(positionRef.current, viewport());
    roamer.style.transform = pointTransform(positionRef.current);
    positionSpeech();
    controlsRef.current = { sync, trick: (action) => perform(true, action), battle: () => battle(true), reset: resetForm };
    sync();
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      advanceClocks();
      disposed = true;
      clearTimer();
      activeSince = null;
      controlsRef.current = NO_CONTROLS;
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('resize', onResize);
      freezeTravel();
      cancelAction();
      setPhase('idle');
      roamer.dataset.motion = 'paused';
    };
  }, [roamerRef, poseRef, persona, open, reducedMotion, onMoment]);

  useEffect(() => {
    pausedRef.current = paused;
    controlsRef.current.sync();
  }, [paused]);
  const setHeld = useCallback((value: boolean) => { heldRef.current = value; controlsRef.current.sync(); }, []);
  const setControlsOpen = useCallback((value: boolean) => { controlsOpenRef.current = value; controlsRef.current.sync(); }, []);
  const showTrick = useCallback((action?: SpriteAction) => controlsRef.current.trick(action), []);
  const showBattle = useCallback(() => controlsRef.current.battle(), []);
  const resetForm = useCallback(() => controlsRef.current.reset(), []);
  return { setHeld, setControlsOpen, showTrick, showBattle, form, resetForm };
}
