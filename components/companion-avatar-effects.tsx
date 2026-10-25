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
    <span className={styles.kurama} aria-hidden="true">
      <svg viewBox="0 0 220 200" fill="none" shapeRendering="geometricPrecision">
        <g className={styles.nineTails} fill="#f4b942" fillOpacity=".24" stroke="#ffe59a" strokeWidth="2">
          <path d="M105 157 63 143 12 141 30 128 8 113 48 118 90 140Z" />
          <path d="m102 149-49-35L9 84l22 1L18 64l36 29 47 42Z" />
          <path d="m105 139-38-40L30 35l22 10-3-24 35 62 31 45Z" />
          <path d="M112 135 86 78 72 12 89 27 94 5l10 66 20 61Z" />
          <path d="m121 136-5-63 5-67 11 19 16-15-13 68-2 59Z" />
          <path d="m131 142 17-59 30-57 1 23 21-4-36 51-22 56Z" />
          <path d="m134 150 26-36 45-40-6 24 14 2-42 26-30 34Z" />
          <path d="m131 158 40-26 43-10-14 17 13 8-46 1-27 18Z" />
          <path d="m118 164 35-4 51 7-18 9 12 13-49-15-32-1Z" />
        </g>
        <g fill="#f8c651" fillOpacity=".25" stroke="#ffe7a5" strokeWidth="2.5" strokeLinejoin="miter">
          <path d="m93 83 27-2 22 29-8 46-20 35-34-6-7-41Z" />
          <path d="m92 100-16 13-15 41 22 8 13-32m35-24 24 17 22 26-10 12-33-25-12-24" />
          <path d="m85 157-15 22 3 16 29-3 8-28m12-6 12 17 27 18 15-4-31-35" />
        </g>
        <g fill="#f9cc5e" fillOpacity=".65" stroke="#ffedb2" strokeWidth="2">
          <path d="m93 93-11-25 5-31-10-26 24 19 19-4 20 11 29 13-10 9 14 9-21 13-17 21-26 7Z" />
          <path d="m93 43 6-8-8-15m31 17 11 3 12-12-10 17m-34 3 15 3 14-2-11 10-15-1Z" fill="#63402b" stroke="none" />
          <path d="m131 61 13 3-14 6m14 1 18-1-12 9-20 3" stroke="#66412b" strokeWidth="3" />
          <path d="m136 76 4 7 5-7m4-1 3 5 5-7" fill="#fff8d8" stroke="none" />
        </g>
        <g stroke="#8d5c2c" strokeWidth="2.5" strokeOpacity=".85">
          <path d="m97 102 19 9 12-10m-34 18 21 8 17-9m-39 17 21 5 13-10m-44 18 9 5m66-8 3 8m3-3 3 7" />
          <circle cx="111" cy="92" r="5" /><path d="m111 97 2 12" />
        </g>
      </svg>
    </span>
  </>;
}
