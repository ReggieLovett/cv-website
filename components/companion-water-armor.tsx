import styles from './companion-water-armor.module.css';

/** Dragon Form is water worn by the current persona, rather than a new body. */
export function WaterArmor() {
  return <span className={styles.armor}>
    <span className={styles.fins}><i /><i /></span>
    <span className={styles.plumes}><i /><i /></span>
    <span className={styles.tail} />
    <span className={styles.lance}><i /><i /></span>
  </span>;
}

export function WaterCharge() {
  return <span className={styles.charge}><i /><i /><i /><i /></span>;
}
