import styles from './companion-hyper-effects.module.css';

/** Each silhouette reads as its own Frontiers technique at the 3× pixel scale. */
export function HyperBattleEffects() {
  return <>
    <span aria-hidden="true" className={`${styles.fx} ${styles.boom}`}><i /><i /><i /></span>
    <span aria-hidden="true" className={`${styles.fx} ${styles.cross}`}><i /><i /><i /></span>
    <span aria-hidden="true" className={`${styles.fx} ${styles.cyloop}`}><i /><b /><em /></span>
    <span aria-hidden="true" className={`${styles.fx} ${styles.shot}`}><i /><i /><i /><i /><i /></span>
    <span aria-hidden="true" className={`${styles.fx} ${styles.kick}`}><i /><b /><em /></span>
    <span aria-hidden="true" className={`${styles.fx} ${styles.slam}`}><i /><b /><em /></span>
    <span aria-hidden="true" className={`${styles.fx} ${styles.parry}`}><i /><b /><em /></span>
    <span aria-hidden="true" className={`${styles.fx} ${styles.wild}`}><i /><i /><i /><b /><em /></span>
    <span aria-hidden="true" className={`${styles.fx} ${styles.cyclone}`}><i /><i /><i /><b /><em /></span>
    <span aria-hidden="true" className={`${styles.fx} ${styles.spin}`}><i /><i /><i /><b /><em /></span>
  </>;
}
