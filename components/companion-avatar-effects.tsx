import styles from './companion-avatar-effects.module.css';

/**
 * Chakra constructs around the active sprite; none replaces its body. Each is
 * drawn as translucent chakra: a gradient body that fades toward its edges,
 * a bright rim, and parts that assemble in order rather than one flat stamp.
 * Gradient ids are fixed because the companion renders once per page.
 */
export function CompanionAvatarEffects() {
  return <>
    <span className={styles.susanoo} aria-hidden="true">
      {/* A winged warrior of violet chakra. The ribcage forms first, then
          armor, the long-nosed helmet and wings; the knight stays visible
          through the hollow chest. Facing right, like the sprite. */}
      <svg viewBox="0 0 220 200" fill="none">
        <defs>
          <radialGradient id="cae-sus-aura" cx="113" cy="120" r="112" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#c8a6ff" stopOpacity=".34" />
            <stop offset=".6" stopColor="#7a46d8" stopOpacity=".14" />
            <stop offset="1" stopColor="#5a2fb0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cae-sus-plate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9c2ff" stopOpacity=".62" />
            <stop offset="1" stopColor="#7c4bd2" stopOpacity=".3" />
          </linearGradient>
          <linearGradient id="cae-sus-wing-l" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#c9a8ff" stopOpacity=".6" />
            <stop offset="1" stopColor="#6c3cc8" stopOpacity=".04" />
          </linearGradient>
          <linearGradient id="cae-sus-wing-r" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#c9a8ff" stopOpacity=".6" />
            <stop offset="1" stopColor="#6c3cc8" stopOpacity=".04" />
          </linearGradient>
        </defs>
        <g className={styles.susAura}>
          <path d="M113 4C140 8 151 28 155 48c22 6 46 20 60 46-18 8-28 22-30 44-2 28-16 50-34 62H76c-18-12-32-34-34-62-2-22-12-36-30-44 14-26 38-40 60-46 4-20 15-40 41-44Z" fill="url(#cae-sus-aura)" />
          <path d="m96 22 6-16 6 14 6-18 6 16 7-14 4 18" stroke="#d6bfff" strokeOpacity=".5" strokeWidth="1.5" strokeLinejoin="round" />
        </g>
        <g className={styles.susWingL} stroke="#dccaff" strokeOpacity=".75" strokeWidth="1.2" strokeLinejoin="round" fill="url(#cae-sus-wing-l)">
          <path d="M80 98C60 70 36 48 6 40c24 22 46 46 70 66Z" />
          <path d="M78 104C54 86 30 76 4 74c24 18 46 30 70 38Z" />
          <path d="M78 110c-22-6-44-6-66 0 22 10 42 12 64 8Z" />
          <path d="M80 116c-18 4-34 14-48 28 20-4 34-10 48-20Z" />
        </g>
        <g className={styles.susWingR} stroke="#dccaff" strokeOpacity=".75" strokeWidth="1.2" strokeLinejoin="round" fill="url(#cae-sus-wing-r)">
          <path d="M146 98c20-28 44-50 74-58-24 22-46 46-70 66Z" />
          <path d="M148 104c24-18 48-28 74-30-24 18-46 30-70 38Z" />
          <path d="M148 110c22-6 44-6 66 0-22 10-42 12-64 8Z" />
          <path d="M146 116c18 4 34 14 48 28-20-4-34-10-48-20Z" />
        </g>
        <g className={styles.susRibs} stroke="#d8c0ff" strokeOpacity=".8" strokeWidth="2.6" strokeLinecap="round">
          <path d="M113 100v74" />
          <path d="M113 112c-21-4-39 4-43 18m43-18c21-4 39 4 43 18M113 126c-21-4-39 4-43 18m43-18c21-4 39 4 43 18M113 140c-20-4-36 4-40 17m40-17c20-4 36 4 40 17M113 154c-18-3-32 4-36 15m36-15c18-3 32 4 36 15" />
        </g>
        <g className={styles.susArmor} fill="url(#cae-sus-plate)" stroke="#e2d2ff" strokeOpacity=".85" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M64 92c6-12 24-14 34-6l-2 18c-10-4-22-2-34 6Z" />
          <path d="M162 92c-6-12-24-14-34-6l2 18c10-4 22-2 34 6Z" />
          <path fillRule="evenodd" d="M84 92h58l8 38-12 38H88l-12-38Zm14 12h30l6 26-8 28h-26l-8-28Z" />
          <path d="M80 170h66l8 26H72Z" fillOpacity=".7" />
          <path d="M86 182h54" strokeOpacity=".5" />
          <path d="M146 104c14 4 26 12 34 24l-8 8c-10-10-20-16-30-18Z" />
          <path d="M72 106c-12 10-18 24-20 40l10 2c2-14 8-26 18-34Z" />
        </g>
        <g className={styles.susHead} stroke="#e8dcff" strokeOpacity=".9" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M104 30C96 14 84 6 70 4c12 10 20 20 26 32Zm16-6c-2-14-8-22-18-28 10 12 14 20 14 30Z" fill="#9b6ae0" fillOpacity=".55" />
          <path d="M88 62c0-22 12-36 28-38 16 0 26 12 28 26l26 8-24 8c-2 12-10 22-24 26h-22c-8-6-12-16-12-30Z" fill="url(#cae-sus-plate)" />
          <path d="M100 46h42M102 74l38-8-4 12-30 8Z" fill="#4c2c86" fillOpacity=".55" />
          <path d="M100 92v6m24-6v6" strokeOpacity=".6" />
        </g>
        <g className={styles.susEyes} fill="#fbf6ff">
          <path d="m118 50 16-2-6 6Z" />
          <path d="m104 52 10-1-4 4Z" fillOpacity=".55" />
        </g>
      </svg>
    </span>
    <span className={styles.susanooShockwave} aria-hidden="true"><i /></span>
    <span className={styles.kuramaHead} aria-hidden="true">
      {/* Only the fox head emerges, in profile above the knight. The jaw drops
          open as the bomb gathers at the muzzle (local 94, -43). */}
      <svg viewBox="0 0 132 115" fill="none">
        <defs>
          <radialGradient id="cae-fox-head" cx="72" cy="58" r="66" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff3c0" stopOpacity=".95" />
            <stop offset=".55" stopColor="#ffb22a" stopOpacity=".86" />
            <stop offset="1" stopColor="#f07810" stopOpacity=".62" />
          </radialGradient>
        </defs>
        <g className={styles.foxFur} stroke="#ffd27a" strokeOpacity=".7" strokeWidth="1.4" strokeLinejoin="round" fill="#ffa82a" fillOpacity=".62">
          <path d="M34 84 14 92l8-14-12-2 12-10-10-8 14-4-6-12 16 4 2-12 10 10Z" />
          <path d="m34 82-4 18 10-10 4 16 8-14 6 14 6-14 8 10 2-16Z" />
        </g>
        <g className={styles.foxSkull} stroke="#fff4cc" strokeOpacity=".85" strokeWidth="1.6" strokeLinejoin="round" fill="url(#cae-fox-head)">
          <path d="M44 46 30 2l32 32Zm20-10V-6l20 36Z" />
          <path d="M40 41 33 14l17 19m19-4V7l9 19" stroke="#8a4f1e" strokeOpacity=".7" fill="none" />
          <path d="M30 72c0-26 22-42 46-42 16 0 26 8 32 16l18 4c4 2 4 8 0 10l-16 4-18 2-14 14c-10 6-24 8-34 4-10-4-14-8-14-12Z" />
        </g>
        <g className={styles.foxMarks} stroke="#7a3f15" strokeWidth="2.6" strokeLinecap="round">
          <path d="M72 44c8-6 20-6 28-2" />
          <path d="M58 58c10 2 18 8 22 14M52 68c8 2 14 6 18 12" strokeWidth="2" />
        </g>
        <g className={styles.foxEye}>
          <path d="m80 46 16-2-6 8Z" fill="#fff6cf" />
          <path d="M89 45v6" stroke="#5a2b0c" strokeWidth="1.6" />
        </g>
        <g className={styles.foxJaw} stroke="#fff4cc" strokeOpacity=".85" strokeWidth="1.6" strokeLinejoin="round" fill="url(#cae-fox-head)">
          <path d="M86 66h34l-4 8-28 4Z" />
          <path d="m96 66 2 4 2-4m6 0 2 4 2-4" stroke="#fff8de" strokeWidth="1.4" fill="none" />
        </g>
        <path className={styles.foxFangs} d="m104 60 2 4 2-4m6 0 2 4 2-4" stroke="#fff8de" strokeWidth="1.4" />
      </svg>
    </span>
    <span className={styles.chakraHand} aria-hidden="true">
      {/* A giant clawed chakra arm grows from the sprite's arm, seal lines
          banding the forearm, its outline licking like flame. */}
      <svg viewBox="0 0 148 90" fill="none">
        <defs>
          <linearGradient id="cae-fox-arm" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffa82a" stopOpacity=".3" />
            <stop offset=".45" stopColor="#ffb83a" stopOpacity=".82" />
            <stop offset="1" stopColor="#fff3c0" stopOpacity=".95" />
          </linearGradient>
        </defs>
        <g className={styles.handFlame} stroke="#ffd27a" strokeOpacity=".55" strokeWidth="1.2" strokeLinejoin="round">
          <path d="m6 34 8-8 4 6 8-9 4 7 9-8 4 7 10-8 3 7 10-7 4 8" />
          <path d="m6 58 8 7 5-6 8 8 5-7 9 7 5-6 9 7 5-6 10 6" />
        </g>
        <g stroke="#fff1c4" strokeWidth="2" strokeLinejoin="round" fill="url(#cae-fox-arm)">
          <path d="M0 36c30-6 60-8 84-6v32c-24 0-54-2-84-6Z" />
          <path d="M84 26c12-4 24-2 32 4l2 32c-10 6-24 6-34 2Z" />
          <path d="m116 30 22-4 8 4-8 4-20 2Zm2 11 24-2 6 4-6 4-24 0Zm0 11 22 2 6 5-8 2-20-3Zm-18-28 12-14 6 4-8 14Z" />
        </g>
        <path d="m138 26 6 4-6 4m4 5 6 4-6 4m0 7 6 5-8 2" stroke="#fffbe8" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M34 34v24m14-25v26m14-26v26" stroke="#7a3f15" strokeOpacity=".75" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </span>
    <span className={styles.kuramaGuard} aria-hidden="true">
      {/* The guard is Kurama's face seen from the front: a hollow chakra dome
          with ears, eyes and muzzle wrapped around the knight. Its rim brightens
          where the incoming bolt breaks against the cheek. */}
      <svg viewBox="0 0 184 160" fill="none">
        <defs>
          <radialGradient id="cae-fox-dome" cx="92" cy="110" r="96" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffe9a6" stopOpacity=".05" />
            <stop offset=".72" stopColor="#f6c04f" stopOpacity=".12" />
            <stop offset="1" stopColor="#ffd77a" stopOpacity=".34" />
          </radialGradient>
        </defs>
        <g className={styles.domeShell}>
          <path d="M14 158c-8-42 2-76 26-96L30 14l36 30c16-6 42-6 58 0l36-30-10 48c24 20 34 54 26 96q-78 14-162 0Z" fill="url(#cae-fox-dome)" stroke="#ffe6a1" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="m40 50-6-24 20 18m76 0 20-18-6 24" fill="#f6b844" fillOpacity=".25" stroke="#8a4f1e" strokeOpacity=".55" strokeWidth="1.6" />
          <path d="M22 140q-4-44 26-72m114 72q4-44-26-72M28 148q64 12 128 0" stroke="#f9d17b" strokeOpacity=".42" strokeWidth="1.4" />
        </g>
        <g className={styles.domeFace} strokeLinejoin="round" strokeLinecap="round">
          <path d="M44 64c10-8 24-8 34 0m28 0c10-8 24-8 34 0" stroke="#7a3f15" strokeOpacity=".8" strokeWidth="3" />
          <path d="m52 72 22 6-10 6Zm80 0-22 6 10 6Z" fill="#fff2c6" />
          <path d="m84 78 8 16 8-16" stroke="#ffe39a" strokeOpacity=".8" strokeWidth="2.2" />
          <path d="M86 92h12l-6 7Z" fill="#7a3f15" fillOpacity=".85" />
          <path d="M92 99c-10 8-24 10-36 6m36-6c10 8 24 10 36 6" stroke="#7a3f15" strokeOpacity=".55" strokeWidth="2" />
          <path d="m22 104-14 2 10 8-12 8 16 2m140-20 14 2-10 8 12 8-16 2" stroke="#ffe39a" strokeOpacity=".7" strokeWidth="1.8" />
        </g>
      </svg>
      <i className={styles.guardIncoming} />
      <i className={styles.guardImpact} />
    </span>
  </>;
}
