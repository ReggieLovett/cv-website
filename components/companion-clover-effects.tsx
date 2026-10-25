import styles from './companion-clover-effects.module.css';

// Static decorative children: the existing data-battle attribute selects a
// single performance. No extra React state, listeners, clocks, or image assets.
const effects = (
  <>
    <span className={`${styles.effect} ${styles.counterCut}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.fateRelease}`} aria-hidden="true"><i /><i /><i /><b /></span>
    <span className={`${styles.effect} ${styles.bullThrust}`} aria-hidden="true"><i /><i /><b /><b /></span>
    <span className={`${styles.effect} ${styles.blackBarrage}`} aria-hidden="true"><i /><i /><i /></span>
    <span className={`${styles.effect} ${styles.causalityGuard}`} aria-hidden="true"><i /><i /><b /><b /></span>
    <span className={`${styles.effect} ${styles.crossCut}`} aria-hidden="true"><i /><i /><b /></span>
    <span className={`${styles.effect} ${styles.starWhip}`} aria-hidden="true"><i /><b /><b /><b /><b /></span>
    <span className={`${styles.effect} ${styles.starCounter}`} aria-hidden="true"><i /><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.starDome}`} aria-hidden="true"><i /><b /><b /><b /><b /><b /></span>
    <span className={`${styles.effect} ${styles.boreas}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.hushedDance}`} aria-hidden="true"><i /><i /><i /><b /></span>
    <span className={`${styles.effect} ${styles.notos}`} aria-hidden="true"><i /><b /><b /><em /></span>
    <span className={`${styles.effect} ${styles.lightningKick}`} aria-hidden="true"><i /><b /><b /></span>
    <span className={`${styles.effect} ${styles.runeRebound}`} aria-hidden="true"><i /><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.twinBolts}`} aria-hidden="true"><i /><i /><b /><b /></span>
    <span className={`${styles.effect} ${styles.purgatory}`} aria-hidden="true"><i /><i /><i /><b /></span>
    <span className={`${styles.effect} ${styles.flameBurial}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.flameAllies}`} aria-hidden="true"><i /><i /><i /><b /></span>
    <span className={`${styles.effect} ${styles.dragonRoar}`} aria-hidden="true"><i /><b /><em /><em /></span>
    <span className={`${styles.effect} ${styles.waterLance}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.waterCradle}`} aria-hidden="true"><i /><b /><b /><b /><b /></span>
    <span className={`${styles.effect} ${styles.waterNest}`} aria-hidden="true"><i /><i /><b /><b /></span>
    <span className={`${styles.effect} ${styles.pointBlank}`} aria-hidden="true"><i /><b /><em /><em /></span>
    <span className={`${styles.effect} ${styles.waterVortex}`} aria-hidden="true"><i /><i /><i /><b /></span>
    <span className={`${styles.effect} ${styles.waterTail}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.slasherDraw}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.slayerRebound}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.dwellerReturn}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.destroyerPulse}`} aria-hidden="true"><i /><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.dividerCleave}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.selectiveDraw}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.devilReturn}`} aria-hidden="true"><i /><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.releaseWave}`} aria-hidden="true"><i /><i /><b /></span>
    <span className={`${styles.effect} ${styles.lightningPalm}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.ceranosReturn}`} aria-hidden="true"><i /><i /><b /><b /><b /><b /><b /></span>
    <span className={`${styles.effect} ${styles.scatterBolts}`} aria-hidden="true"><i /><i /><i /><b /></span>
    <span className={`${styles.effect} ${styles.crossClaw}`} aria-hidden="true"><i /><i /><b /></span>
    <span className={`${styles.effect} ${styles.risingFist}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.crossfire}`} aria-hidden="true"><i /><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.burningCounter}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.flamePress}`} aria-hidden="true"><i /><i /><i /><b /></span>
    <span className={`${styles.effect} ${styles.dragonVolley}`} aria-hidden="true"><i /><i /><b /><b /></span>
    <span className={`${styles.effect} ${styles.spiralLance}`} aria-hidden="true"><i /><b /><b /><em /></span>
    <span className={`${styles.effect} ${styles.flowCounter}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.slayerSword}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.dwellerSword}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.destroyerSword}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.slasherSword}`} aria-hidden="true"><i /><b /><em /></span>
    <span className={`${styles.effect} ${styles.zephyrSword}`} aria-hidden="true"><i /><b /><em /></span>
  </>
);

/** Mount directly inside the existing floatBody so facing, floor clipping,
 * hover, and the motion engine's pause/cleanup state remain shared. */
export function CloverBattleEffects() {
  return effects;
}
