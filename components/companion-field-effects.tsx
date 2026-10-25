import styles from './companion-field-effects.module.css';

/** Area techniques occupy the same bounded combat lane as the character. */
export function CompanionFieldEffects() {
  return <span className={styles.manaZone} aria-hidden="true">
    <i className={styles.dome} />
    <i className={styles.ground} />
    <b /><b /><b /><b /><b /><b />
  </span>;
}
