import styles from './companion-form-aura.module.css';

/**
 * Persistent form light that sits behind the active sprite: a glow cut from
 * its silhouette, energy rising along the outline, and constructs (tails,
 * wings, horns, orbs) whose roots the body hides. Colors come from the form
 * palette on the companion root, shared with the sprite's own tint and rim.
 */
export function FormAuraBack() {
  return <span className={styles.back}>
    <span className={styles.ground}><i /><i /></span>
    <span className={styles.shell}><i /><i /><i /></span>
    <span className={styles.streamers}><i /><i /><i /><i /></span>
    <span className={styles.flames}><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
    <span className={styles.gear}><i /><i /><i /><i /><i /></span>
    <span className={styles.satellites}><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
  </span>;
}

/** Light that crosses in front of the body: eye bloom, limb charges, licks, arcs and motes. */
export function FormAuraFront() {
  return <span className={styles.front}>
    <span className={styles.eyes}><i /><i /></span>
    <span className={styles.charges}><i /><i /><i /><i /></span>
    <span className={styles.licks}><i /><i /><i /></span>
    <svg className={styles.arcs} viewBox="0 0 64 84" fill="none" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M16 42 13 47 17 49 12 55 16 57" />
      <path d="M52 40 56 45 52 48 57 53 53 58" />
      <path d="M20 76 17 79 21 81 18 84" />
      <path d="M41 74 45 77 41 80 44 84" />
    </svg>
    <span className={styles.motes}><i /><i /><i /><i /><i /><i /></span>
  </span>;
}
