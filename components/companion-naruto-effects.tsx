import styles from './companion-naruto-effects.module.css';

/** Direct floatBody children inherit the companion's facing, floor clip and pause. */
export default function NarutoBattleEffects() {
  return (
    <>
      <span className={styles.twinRasengan} aria-hidden="true"><i /><i /><b /><b /></span>
      <span className={styles.rasenganBarrage} aria-hidden="true"><i /><i /><i /><b /><b /><b /></span>
      <span className={styles.shadowFollowUp} aria-hidden="true"><i /><i /><b /><b /><em /></span>
      <span className={styles.lavaShuriken} aria-hidden="true"><b /><i /><i /><i /><em /><em /><em /></span>
      <span className={styles.sixPathsRasen} aria-hidden="true"><i /><i /><b /><em /><em /></span>
      <span className={styles.bulletBarrage} aria-hidden="true"><i /><i /><i /><i /><i /><b /><b /><b /></span>
      <span className={styles.counterKick} aria-hidden="true"><i /><b /><em /><em /><em /></span>
      <span className={styles.tailBarrage} aria-hidden="true"><i /><i /><i /><b /><b /><b /></span>
      <span className={styles.handPower} aria-hidden="true"><i /><i /><b /><em /><em /></span>
      <span className={styles.flameControl} aria-hidden="true"><b /><i /><i /><i /><em /></span>
      <span className={styles.planetarySeal} aria-hidden="true"><b /><em /><i /><i /><i /><i /><i /><i /></span>
      <span className={styles.massiveBarrage} aria-hidden="true"><i /><i /><b /><b /><em /></span>
      <span className={styles.uzumakiBarrage} aria-hidden="true"><i /><i /><i /><b /><b /><b /></span>
      <span className={styles.toadSummon} aria-hidden="true"><b /><i /><i /><em /><strong /></span>
      <span className={styles.shurikenFeint} aria-hidden="true"><i /><b /><em /><strong /></span>
      <span className={styles.truthseekerSalvo} aria-hidden="true"><i /><i /><i /><i /><i /><b /></span>
      <span className={styles.superTailedShuriken} aria-hidden="true"><i /><i /><i /><i /><i /></span>
      <span className={styles.beastBombBarrage} aria-hidden="true"><b /><b /><b /></span>
      <span className={styles.scarletRasengan} aria-hidden="true"><b /><em /><i /><i /><i /></span>
      <span className={styles.baryonCharge} aria-hidden="true"><b /><i /><i /><i /><em /></span>
      <span className={styles.destructiveFist} aria-hidden="true"><i /><i /><b /><b /><b /><b /></span>
      <span className={styles.scarletFlash} aria-hidden="true"><i /><i /><i /><i /><b /><b /></span>
      <span className={styles.kirin} aria-hidden="true"><b /><i /><i /><i /><em /></span>
      <span className={styles.indraArrow} aria-hidden="true"><b /><em /><i /><strong /></span>
      <span className={styles.chidoriFlame} aria-hidden="true"><b /><i /><i /><i /><em /></span>
      <span className={styles.sasukeFireball} aria-hidden="true"><b /><i /><i /><i /><em /></span>
    </>
  );
}
