/**
 * Brand marks for the Skills & Technologies badges.
 *
 * Every glyph is inline SVG on a 24×24 grid so the pills stay crisp at any size
 * and the page makes no network request for icon fonts or a CDN sprite sheet.
 */

/**
 * Each pill already carries the technology name as visible text, so the glyph is
 * purely decorative: hiding it from assistive tech keeps the badge from being
 * announced twice ("JavaScript JavaScript").
 */
const decorative = { 'aria-hidden': true as const, focusable: 'false' as const };

function JavaScriptIcon() {
  return (
    <svg viewBox="0 0 24 24" {...decorative}>
      <rect width="24" height="24" rx="5" fill="#F7DF1E" />
      <text
        x="12"
        y="17.4"
        textAnchor="middle"
        textLength="13"
        lengthAdjust="spacingAndGlyphs"
        fontSize="11"
        fontWeight="700"
        fontFamily="var(--font-display)"
        fill="#0B0B0B"
      >
        JS
      </text>
    </svg>
  );
}

function TypeScriptIcon() {
  return (
    <svg viewBox="0 0 24 24" {...decorative}>
      <rect width="24" height="24" rx="5" fill="#3178C6" />
      <text
        x="12"
        y="17.4"
        textAnchor="middle"
        textLength="13"
        lengthAdjust="spacingAndGlyphs"
        fontSize="11"
        fontWeight="700"
        fontFamily="var(--font-display)"
        fill="#FFFFFF"
      >
        TS
      </text>
    </svg>
  );
}

/** Two rotationally symmetric hooks — the interlocking snakes of the Python mark. */
function PythonIcon() {
  const hook =
    'M12 1.2c-2.4 0-4.1.3-5 .9C6.2 2.6 6 3.4 6 4.6v2.6h6.2v.9H5.5c-1.3 0-2.4.8-2.9 2.2C2.1 11.8 2 13 2 14.4c0 1.5.1 2.7.5 3.7.5 1.3 1.5 2.1 2.8 2.1h2.1v-3.1c0-1.6 1.3-2.9 2.9-2.9h6.2c1.2 0 2.2-1 2.2-2.2V4.6c0-1.2-1-2.1-2.2-2.4-1.1-.7-2.8-1-4.5-1z';
  return (
    <svg viewBox="0 0 24 24" {...decorative}>
      <g>
        <path d={hook} fill="#3776AB" />
        <circle cx="9" cy="4.7" r="1.05" fill="#FFFFFF" />
      </g>
      <g transform="rotate(180 12 12)">
        <path d={hook} fill="#FFD43B" />
        <circle cx="9" cy="4.7" r="1.05" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

function CppIcon() {
  return (
    <svg viewBox="0 0 24 24" {...decorative}>
      <path d="M12 1.2 21.4 6.6v10.8L12 22.8 2.6 17.4V6.6z" fill="#00599C" />
      <text
        x="11.4"
        y="16.2"
        textAnchor="middle"
        textLength="12.5"
        lengthAdjust="spacingAndGlyphs"
        fontSize="9.5"
        fontWeight="700"
        fontFamily="var(--font-display)"
        fill="#FFFFFF"
      >
        C++
      </text>
    </svg>
  );
}

function PhpIcon() {
  return (
    <svg viewBox="0 0 24 24" {...decorative}>
      <ellipse cx="12" cy="12" rx="11.4" ry="6.6" fill="#777BB4" />
      <text
        x="12"
        y="15"
        textAnchor="middle"
        textLength="15"
        lengthAdjust="spacingAndGlyphs"
        fontSize="8.6"
        fontWeight="700"
        fontStyle="italic"
        fontFamily="var(--font-display)"
        fill="#FFFFFF"
      >
        php
      </text>
    </svg>
  );
}

function HtmlIcon() {
  return (
    <svg viewBox="0 0 24 24" {...decorative}>
      <path d="M3 1.8h18l-1.63 18.36L12 22.2l-7.37-2.04z" fill="#E34F26" />
      <path d="M12 3.6v16.9l5.94-1.65L19.3 3.6z" fill="#EF652A" />
      <path
        d="M12 6.6H6.9l.5 5.6h4.6v2.6l-2.4-.66-.16-1.8H6.86l.32 3.66L12 17.4v-2.6l.02.01v-2.6H9.6l-.16-1.8H12z"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <path
        d="M12 6.6v2.6h4.86l.2-2.6zm0 5.6v2.6h2.28l-.2 2.2-2.08.58v2.7l4.8-1.32.66-6.76z"
        fill="#EBEBEB"
      />
    </svg>
  );
}

function CssIcon() {
  return (
    <svg viewBox="0 0 24 24" {...decorative}>
      <path d="M3 1.8h18l-1.63 18.36L12 22.2l-7.37-2.04z" fill="#1572B6" />
      <path d="M12 3.6v16.9l5.94-1.65L19.3 3.6z" fill="#33A9DC" />
      <path
        d="M12 6.6H6.9l.18 2.06H12V6.6zm0 5.2H9.28l.18 2.06H12v-2.06zm0 5.6-2.08-.58-.14-1.6H7.7l.28 3.16L12 19.5z"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <path
        d="M12 6.6v2.06h4.9l.2-2.06zm0 5.2v2.06h2.6l-.25 2.72-2.35.66v2.26l4.32-1.2.6-6.5z"
        fill="#EBEBEB"
      />
    </svg>
  );
}

function ReactIcon() {
  return (
    <svg viewBox="0 0 24 24" {...decorative}>
      <circle cx="12" cy="12" r="2.05" fill="#61DAFB" />
      <g fill="none" stroke="#61DAFB" strokeWidth="1.05">
        <ellipse cx="12" cy="12" rx="10.4" ry="3.95" />
        <ellipse cx="12" cy="12" rx="10.4" ry="3.95" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10.4" ry="3.95" transform="rotate(120 12 12)" />
      </g>
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" {...decorative}>
      <circle cx="12" cy="12" r="11.2" fill="#000000" stroke="#FFFFFF" strokeOpacity="0.28" />
      <path
        d="M8.6 16.9V7.3l8.1 10.4"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.55"
        strokeLinecap="square"
      />
      <path d="M15.5 7.3v6.1" fill="none" stroke="#FFFFFF" strokeWidth="1.55" strokeLinecap="square" />
    </svg>
  );
}

function NodeIcon() {
  return (
    <svg viewBox="0 0 24 24" {...decorative}>
      <path d="M12 1.2 21.4 6.6v10.8L12 22.8 2.6 17.4V6.6z" fill="#539E43" />
      <path d="M12 4.6 18.5 8.3v7.4L12 19.4 5.5 15.7V8.3z" fill="#3F7E35" />
      <path
        d="M10.05 9.1h1.62l3.02 4.76V9.1h1.32v6.02h-1.6l-3.04-4.8v4.8h-1.32z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function SqlIcon() {
  return (
    <svg viewBox="0 0 24 24" {...decorative}>
      <ellipse cx="12" cy="5.4" rx="8.4" ry="3.3" fill="#8FB4E3" />
      <path d="M3.6 5.4v13.2c0 1.82 3.76 3.3 8.4 3.3s8.4-1.48 8.4-3.3V5.4z" fill="#5C86BE" />
      <ellipse cx="12" cy="5.4" rx="8.4" ry="3.3" fill="#A8C6EC" />
      <path
        d="M3.6 10.1c0 1.82 3.76 3.3 8.4 3.3s8.4-1.48 8.4-3.3M3.6 15c0 1.82 3.76 3.3 8.4 3.3s8.4-1.48 8.4-3.3"
        fill="none"
        stroke="#0B1220"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
    </svg>
  );
}

/** Slonik, the PostgreSQL elephant, reduced to a silhouette that survives 24px. */
function PostgresIcon() {
  return (
    <svg viewBox="0 0 24 24" {...decorative}>
      <circle cx="12" cy="12" r="11.2" fill="#336791" />
      <path
        d="M11.7 4.4c-3.7 0-6.6 2.3-6.6 5.6 0 1.6.6 3 1.7 4.1-.5 1.1-.7 2.4-.3 3.6.2.6.9.9 1.5.6.5-.3.7-.9.7-1.5 0-.5.4-.8.9-.6.8.3 1.6.5 2.5.5.5 0 1 0 1.4-.1-.1 1.3-.3 2.6-.6 3.9-.2.7.3 1.3 1 1.3.6 0 1.1-.4 1.2-1.1.3-1.6.5-3.2.5-4.9 1.9-1 3.1-2.8 3.1-5 0-3.5-3.3-6.4-7-6.4z"
        fill="#FFFFFF"
      />
      <path
        d="M16 14.4c.3 1.6.3 3.3.1 4.9-.1.7.4 1.2 1 1.2s1-.5 1-1.2c.1-1.8 0-3.6-.4-5.3z"
        fill="#FFFFFF"
      />
      <circle cx="9.3" cy="9.5" r="1" fill="#336791" />
    </svg>
  );
}

/** Icon key → component. Keys are referenced from `techStack` in data/portfolio.ts. */
export const techIcons = {
  javascript: JavaScriptIcon,
  typescript: TypeScriptIcon,
  python: PythonIcon,
  cpp: CppIcon,
  php: PhpIcon,
  html: HtmlIcon,
  css: CssIcon,
  react: ReactIcon,
  next: NextIcon,
  node: NodeIcon,
  sql: SqlIcon,
  postgres: PostgresIcon,
} as const;

export type TechIconKey = keyof typeof techIcons;

export function TechIcon({ name }: { name: TechIconKey }) {
  const Glyph = techIcons[name];
  return (
    <span className="tech-pill__icon" aria-hidden="true">
      <Glyph />
    </span>
  );
}
