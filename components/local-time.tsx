'use client';

import { useEffect, useState } from 'react';

/**
 * LocalTime — the clock where Reggie is.
 *
 * A small, true, human detail. It says a real person in a real place made
 * this, which is the thing a portfolio full of credentials is otherwise bad
 * at saying.
 *
 * ---- On hydration ----
 * The server has no idea what time it is in Manila for the reader's benefit,
 * and rendering a time on the server guarantees it differs from the client's
 * first render — a hydration mismatch React will warn about and then repaint.
 * So it renders nothing until mounted. The row is reserved by `min-height` in
 * the parent, so it does not shift when it arrives.
 *
 * ---- On the interval ----
 * It ticks to the top of the next minute rather than every 60s from mount, so
 * the clock changes when the minute changes instead of drifting a few seconds
 * behind it. Cleared on unmount.
 */

const FORMAT: Intl.DateTimeFormatOptions = {
  timeZone: 'Asia/Manila',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
};

export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      setTime(new Intl.DateTimeFormat('en-PH', FORMAT).format(new Date()));
      // Line the next update up with the start of the next minute.
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000));
    };

    tick();
    return () => clearTimeout(timer);
  }, []);

  if (!time) return null;

  return (
    <span className="inline-flex items-center gap-2">
      <span className="live-dot" aria-hidden="true" />
      <span>Philippines — {time} local</span>
    </span>
  );
}
