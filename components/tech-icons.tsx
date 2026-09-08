import type { SVGProps } from 'react';

const paths: Record<string, React.ReactNode> = {
  javascript: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.12" />
      <path
        d="M12 8.5v7M9.2 10.5h1.2l2.3 4 0.7-1v-3.8M15.5 12v-1.5a1 1 0 0 0-1-1h-0.5a1.3 1.3 0 0 0-1.3 1.3v0.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  typescript: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.12" />
      <text x="6.5" y="17" fontSize="11" fontWeight="700" fill="currentColor" fontFamily="inherit">
        TS
      </text>
    </>
  ),
  python: (
    <>
      <ellipse cx="12" cy="12" rx="8.5" ry="5" transform="rotate(0)" fill="currentColor" fillOpacity="0.15" />
      <path
        d="M8.5 12h-2m11 0h-2M12 6.5c3-0.3 4.5 0 4.5 0M8 6.5c-3 0.3-4.5 0-4.5 0"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="16.5" cy="13" r="0.7" fill="currentColor" />
      <circle cx="7.5" cy="13" r="0.7" fill="currentColor" />
    </>
  ),
  php: (
    <>
      <text x="6" y="16.5" fontSize="13" fontWeight="700" fill="currentColor" fontFamily="inherit">
        &lt;?php
      </text>
    </>
  ),
  cpp: (
    <>
      <path
        d="M7 8v8M13 8l-6 3v2l6 3M17 8l-6 3v2l6 3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  html: (
    <>
      <path
        d="M8 3l-1 14 5 3 5-3-1-14H8zM10 9h4M10 12h4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  css: (
    <>
      <path
        d="M6 3l-1 15 7 3 7-3-1-15H6zM9 9h6M16 12H8M10 16h4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  react: (
    <>
      <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.4" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="3.6"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="3.6"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        transform="rotate(120 12 12)"
      />
    </>
  ),
  next: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M8 15V9l8 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </>
  ),
  node: (
    <>
      <path
        d="M12 3l8 4.6v8.8L12 21l-8-4.6V7.6L12 3z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <path d="M12 8v8M8 9.5l4-2.5 4 2.5" stroke="currentColor" strokeWidth="1.1" fill="none" />
    </>
  ),
  sql: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.7" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <path d="M5 5.5v6c0 1.5 3.1 2.7 7 2.7s7-1.2 7-2.7v-6" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <path d="M5 11.5v6c0 1.5 3.1 2.7 7 2.7s7-1.2 7-2.7v-6" stroke="currentColor" strokeWidth="1.1" fill="none" />
    </>
  ),
  postgres: (
    <>
      <ellipse cx="12" cy="4.8" rx="7" ry="2.6" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M5 4.8v6" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M19 4.8v6" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M7 5.5h3M14 5.5h3" stroke="currentColor" strokeWidth="0.8" />
      <path d="M12 4.8v2M8 20v4M12 20v4M8 16h-4M8 20h8v4" stroke="currentColor" strokeWidth="1.1" fill="none" />
    </>
  ),
};

export function TechIcon({ name, ...props }: { name: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] ?? <circle cx="12" cy="12" r="8" strokeWidth="1" />}
    </svg>
  );
}