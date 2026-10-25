'use client';

import dynamic from 'next/dynamic';
import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { CHAT_PERSONAS } from '@/lib/chat-persona';
import { getZeldaServerSnapshot, isZeldaOn, subscribeToZelda } from '@/lib/zelda';
import { getCompanionSpriteStyle } from '@/lib/companion-sprite';
import { canCompanionHover } from '@/lib/companion-appearance';
import { CompanionControls } from './companion-controls';
import { useCompanionMotion } from './use-companion-motion';
import NarutoBattleEffects from './companion-naruto-effects';
import { CloverBattleEffects } from './companion-clover-effects';
import { HyperBattleEffects } from './companion-hyper-effects';
import { ExtraBattleEffects } from './companion-extra-effects';
import { CompanionFieldEffects } from './companion-field-effects';
import { CompanionAvatarEffects } from './companion-avatar-effects';
import { WaterArmor, WaterCharge } from './companion-water-armor';
import styles from './portfolio-companion.module.css';

const PortfolioChat = dynamic(() => import('./portfolio-chat'), { ssr: false });

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function PortfolioCompanion() {
  const [open, setOpen] = useState(false);
  const [visited, setVisited] = useState(false);
  const [paused, setPaused] = useState(false);
  const [comment, setComment] = useState(0);
  const zelda = useSyncExternalStore(subscribeToZelda, isZeldaOn, getZeldaServerSnapshot);
  const persona = zelda ? 'zelda' : 'portfolio';
  const profile = CHAT_PERSONAS[persona];
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, () => true);
  const roamerRef = useRef<HTMLDivElement>(null);
  const poseRef = useRef<HTMLSpanElement>(null);
  const controlsOpenRef = useRef(false);
  const hoveringRef = useRef(false);
  const focusedRef = useRef(false);
  const advanceComment = useCallback(() => setComment((current) => current + 1), []);
  const { setHeld, setControlsOpen, showTrick, showBattle, form, resetForm } = useCompanionMotion({
    roamerRef, poseRef, persona, open, paused, reducedMotion, onMoment: advanceComment,
  });
  const syncHeld = useCallback(() => {
    setHeld(hoveringRef.current || focusedRef.current || controlsOpenRef.current);
  }, [setHeld]);
  const onControlsExpanded = useCallback((expanded: boolean) => {
    controlsOpenRef.current = expanded;
    setControlsOpen(expanded);
    syncHeld();
  }, [setControlsOpen, syncHeld]);

  return (
    <>
      <div
        ref={roamerRef}
        className={styles.companion}
        style={getCompanionSpriteStyle(persona, form)}
        data-persona={persona}
        data-open={open}
        data-paused={paused}
        data-phase="idle"
        data-motion="paused"
        data-direction="left"
        data-action="none"
        data-effect="none"
        data-battle="none"
        data-battle-move="none"
        data-battle-label=""
        data-speech-side="above"
        data-form={form ?? 'none'}
        data-flight={canCompanionHover(form)}
        onPointerEnter={() => { hoveringRef.current = true; syncHeld(); }}
        onPointerLeave={() => { hoveringRef.current = false; syncHeld(); }}
        onPointerDownCapture={() => { focusedRef.current = false; syncHeld(); }}
        onFocusCapture={(event) => {
          focusedRef.current = event.target.matches(':focus-visible');
          syncHeld();
        }}
        onKeyDownCapture={() => {
          focusedRef.current = true;
          syncHeld();
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            focusedRef.current = false;
            syncHeld();
          }
        }}
      >
        <button
          type="button"
          className={styles.launcher}
          aria-label={profile.launcherLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="portfolio-chat"
          onClick={() => { setVisited(true); setOpen(true); }}
        >
          <span className={styles.comment} aria-hidden="true">
            <MessageCircle size={13} strokeWidth={1.6} />
            <span>{profile.comments[comment % profile.comments.length]}</span>
          </span>
          <span className={styles.character} aria-hidden="true">
            <span className={styles.flight}>
              <span className={styles.floatBody}>
                <span className={styles.sageAura}><i /><i /><i /></span>
                <span className={styles.chakraAura}><i /><i /><i /><i /><i /></span>
                <span className={styles.afterimages}><i /><i /></span>
                <span ref={poseRef} className={styles.pose}>
                  <span className={styles.formCape} />
                  <span className={styles.foxTails}><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
                  <span className={styles.formWings}><i /><i /></span>
                  <span className={styles.hyperAura}><i /><i /><i /></span>
                  <span className={styles.hellfireMantle}><i /><i /><i /><i /><i /><i /><i /></span>
                  <span className={styles.luckArmor}><i /><i /><i /><i /><i /><i /></span>
                  <span className={styles.manaRunes}><i /><i /><i /><i /><i /></span>
                  <span className={styles.truthOrbs}><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
                  <span className={styles.spriteIdle} />
                  <span className={styles.spriteWalk} />
                  <span className={styles.formHorns}><i /><i /><i /><i /></span>
                  <span className={styles.formCrown} />
                  <span className={styles.formMark} />
                  <span className={styles.formOrbs}><i /><i /><i /></span>
                  <span className={styles.formStars}><i /><i /><i /><i /></span>
                  <span className={styles.powerEyes}><i /><i /></span>
                  <span className={styles.chakraCloak} />
                  <span className={styles.sageEyes} />
                  <span className={styles.weapon} />
                  <span className={styles.formCloth} />
                  <span className={styles.formCollar} />
                  <span className={styles.formCuffs}><i /><i /></span>
                  <span className={styles.formScroll} />
                  <span className={styles.formScarf} />
                  <span className={styles.energyCrest} />
                  <span className={styles.formGreaves}><i /><i /></span>
                  <span className={styles.formArmor}><i /><i /></span>
                  <span className={styles.formSigil} />
                  <span className={styles.saintBlade}><i /><i /><i /></span>
                  <span className={styles.formSeals}><i /><i /><i /><i /><i /><i /></span>
                  <span className={styles.formBook}><i /><i /></span>
                  <span className={styles.spiritHalo}><i /><i /><i /><i /><i /><i /><i /><i /></span>
                  <WaterArmor />
                </span>
                <span className={styles.slash}><i /><i /></span>
                <span className={styles.lightning}><i /><i /><i /></span>
                <span className={styles.fireBurst}><i /><i /><i /></span>
                <span className={styles.zettenBurst}><i /><i /><i /></span>
                <span className={styles.devilBurst}><i /><i /><i /></span>
                <span className={styles.starBurst}><i /><i /><i /><i /></span>
                <span className={styles.spiritBurst}><i /><i /><i /><i /></span>
                <span className={styles.baryonBurst}><i /><i /><i /></span>
                <span className={styles.sixPathsBurst}><i /><i /><i /></span>
                <span className={styles.battleOrb}><i /><i /><i /></span>
                <span className={styles.battleFire}><i /><i /><i /></span>
                <span className={styles.battleSlash}><i /><i /></span>
                <span className={styles.battleLightning}><i /><i /><i /></span>
                <span className={styles.battleStars}><i /><i /><i /></span>
                <span className={styles.battleWind}><i /><i /><i /></span>
                <span className={styles.battleImpact}><i /><i /><i /></span>
                <span className={styles.battleAfterimages}><i /><i /></span>
                <span className={styles.battleConstellation}><i /><i /><i /><i /><b /></span>
                <span className={styles.battleArms}><i /><i /><i /></span>
                <span className={styles.battleTails}><i /><i /><i /><i /></span>
                <span className={styles.battleDarkFlame}><i /><i /><i /></span>
                <span className={styles.battleSusanoo}><i /><i /><i /></span>
                <span className={styles.battleRoar}><i /><i /><i /></span>
                <span className={styles.dekuWhip}><i /><i /><i /></span>
                <span className={styles.dangerSense}><i /><i /><i /></span>
                <span className={styles.smokescreen}><i /><i /><i /><i /><i /></span>
                <span className={styles.kineticCharge}><i /><i /></span>
                <span className={styles.luckSpear}><i /><i /><i /></span>
                <span className={styles.luckClaw}><i /><i /><i /></span>
                <span className={styles.flameFists}><i /><i /><i /><i /><i /><i /></span>
                <span className={styles.purgatoryFlame}><i /><i /><i /></span>
                <NarutoBattleEffects />
                <CloverBattleEffects />
                <HyperBattleEffects />
                <ExtraBattleEffects />
                <CompanionFieldEffects />
                <CompanionAvatarEffects />
                <WaterCharge />
                <span className={styles.superEmeralds}><i /><i /><i /><i /><i /><i /><i /></span>
                <span className={styles.hyperBloom}><i /><i /><i /></span>
                <span className={styles.powerMotes}><i /><i /><i /><i /><i /><i /></span>
                <span className={styles.dust}><i /><i /><i /></span>
                <span className={styles.ring} />
                <span className={styles.sparks}><i /><i /><i /><i /><i /></span>
              </span>
            </span>
          </span>
          <span className={styles.caption}>{profile.caption} <ArrowUpRight size={11} aria-hidden="true" /></span>
        </button>
      </div>
      <CompanionControls
        paused={paused}
        disabled={open}
        reducedMotion={reducedMotion}
        form={form}
        onPower={showTrick}
        onTrick={() => showTrick()}
        onBattle={showBattle}
        onPause={() => setPaused((current) => !current)}
        onReset={resetForm}
        onExpandedChange={onControlsExpanded}
      />
      {visited && <PortfolioChat persona={persona} open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
