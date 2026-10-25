import styles from './companion-avatar-effects.module.css';

/** Chakra constructs surround the active sprite; neither replaces its body. */
export function CompanionAvatarEffects() {
  return <>
    <span className={styles.susanoo} aria-hidden="true">
      <svg viewBox="0 0 220 200" fill="none" shapeRendering="geometricPrecision">
        <g className={styles.spectralWings} fill="#9866cd" fillOpacity=".25" stroke="#c19ce8" strokeWidth="2">
          <path d="M89 82 57 49 10 28 25 63 13 77 51 89 35 102 77 105 93 123Z" />
          <path d="m137 81 29-30 43-17-12 32 13 12-34 13 14 12-41 5-18 17Z" />
          <path d="m58 63 21 29M34 54l40 30m95-17-26 28m39-31-34 20" />
        </g>
        <g fill="#7350a8" fillOpacity=".3" stroke="#be98ed" strokeWidth="2.5" strokeLinejoin="miter">
          <path d="m80 80 24-13 30 8 15 32-8 58-25 30-39-16-13-47Z" />
          <path d="m80 81-19 2-21 34 13 31 22-4 5-30m63-23 21 12 19 37-12 14-25-20-15-29" />
          <path d="m72 149 29 7 3 38-27-2-13-28m46-9 28-3 13 37-28 6-14-28" />
        </g>
        <g stroke="#cfb1f7" strokeWidth="3" strokeLinecap="square">
          <path d="m83 104 18 7 33-6m-55 15 23 7 32-6m-55 16 24 6 29-7m-30-35 1 52" />
          <path d="m56 112 11 8m-14 5 12 8m92-14 10 10m-17-1 10 11" />
        </g>
        <g fill="#9262c7" fillOpacity=".72" stroke="#ddc6ff" strokeWidth="2">
          <path d="m86 68-6-24 14-17-6-20 20 16 21 3 13 14 20 9-16 11-5 21-27 8Z" />
          <path d="m94 38 22 8 25-1-11 13 26-4-15 17-23 4-11-12-14-5Z" fill="#4d346e" />
          <path d="m105 46 10 3-7 4m18-4 10-2-7 7" fill="#fbf3ff" stroke="#fbf3ff" strokeWidth="1" />
          <path d="m109 68 8 10 13-4m-29-49 4 15" />
        </g>
      </svg>
    </span>
    <span className={styles.susanooShockwave} aria-hidden="true"><i /></span>
    <span className={styles.kuramaHead} aria-hidden="true">
      <svg viewBox="0 0 156 136" fill="none">
        <path d="m26 88-8-30 8-28 4-23 26 22 23-5 18 7 14-26 6 34 16 14 13 7-10 8 13 8-15 12-17 4-17 17-29 4-24-11Z" fill="#facb58" fillOpacity=".38" stroke="#ffeba4" strokeWidth="2.5" />
        <path d="m31 30 1-15 15 19m48 2 10-20 3 25m-56 6 17 5 19-2-13 12-20-3Z" fill="#785027" fillOpacity=".85" />
        <path d="m78 53 8-1-7 6" fill="#fff8cf" />
        <path d="m100 63 14 4-14 6m15 1 17-1-11 10-20 1m-63-9 13 6m-8 2 12 7m7 6 18 7" stroke="#84542c" strokeWidth="3" />
        <path d="m116 78 4 7 5-8m2-1 3 5 4-8" fill="#fff7d8" />
        <path d="m42 103 22 18 17-13 17 13-4-24" fill="#f8c64f" fillOpacity=".18" stroke="#ffe9a1" strokeOpacity=".5" strokeWidth="2" />
      </svg>
    </span>
    <span className={styles.chakraHand} aria-hidden="true">
      <svg viewBox="0 0 148 90" fill="none">
        <path d="m2 45 57-7 14-15 11-8 13 3 7 10 25-1 9 6v11l-4 4 5 6-5 10-13 4-12 11H82L62 67H2Z" fill="#f6c355" fillOpacity=".54" stroke="#ffe9a0" strokeWidth="2.5" />
        <path d="m75 32 15 5 11-9m-9 12 11 8 29 1m-33 9 32 1m-27 9 17 0M8 53l48-5m-39 13 39-4" stroke="#8d5a28" strokeWidth="3" />
        <path d="m110 32 20 1m-21 6 21 1" stroke="#fff0b8" strokeWidth="2" />
      </svg>
    </span>
    <span className={styles.kuramaGuard} aria-hidden="true">
      <svg viewBox="0 0 184 160" fill="none">
        <path d="M12 148C4 104 14 66 40 47L32 10 66 38C82 32 102 32 118 38L152 10 144 47C170 66 180 104 172 148Q92 165 12 148Z" fill="#f5c34f" fillOpacity=".09" stroke="#ffe6a1" strokeWidth="2.5" />
        <path d="m40 48-3-25 22 20m64 0 24-20-3 25M43 76l27 10 11-4m60-6-27 10-11-4m-34 18 23 15 23-15m-30 18 7 10 7-10" stroke="#ecc970" strokeWidth="3" strokeLinejoin="round" />
        <path d="m51 82 17 5-7 5m72-10-17 5 7 5" fill="#ffe9a6" />
        <path d="M22 139Q17 93 47 66m115 73q5-46-25-73M29 146q63 13 126 0" stroke="#f9d17b" strokeOpacity=".48" strokeWidth="1.5" />
      </svg>
      <i className={styles.guardIncoming} />
      <i className={styles.guardImpact} />
    </span>
  </>;
}
