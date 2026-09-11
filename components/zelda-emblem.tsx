'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { play } from '@/lib/sounds';

/**
 * The Legend of Zelda — 40th anniversary badge.
 *
 * Built to sit in the control cluster beside ThemeToggle and SoundToggle, so it
 * borrows their markup shape exactly: `.toggle-arm` for the row, a glyph slot,
 * and a `.tag` label that states the state in words. A control that looks like a
 * sibling of the two next to it reads as part of the site; the same control
 * floating in a corner reads as a widget someone bolted on.
 *
 * The theme lives as one class on `<html>`, not in a React wrapper, because it
 * has to reach `body`, the fixed chrome, and anything portalled to
 * `document.body` — a wrapper inside the tree would leave those behind.
 */

const EMBLEM_SRC = '/images/zelda-emblem.png';
const THEME_CLASS = 'zelda-theme';
const STORAGE_KEY = 'zelda-theme';

/**
 * The document is the source of truth, so it is read as an external store rather
 * than mirrored into component state. Mirroring would need a setState in a mount
 * effect — a second render pass before paint — and would let the badge and the
 * page disagree for a frame if anything else ever touched the class.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function emit() {
  // forEach rather than for...of: tsconfig targets ES5, where iterating a Set
  // needs `downlevelIteration`. Not worth a compiler flag for this.
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  return document.documentElement.classList.contains(THEME_CLASS);
}

/**
 * The server has no document. Returning `false` is what lets React hydrate
 * without a mismatch: it renders the off state to match the server, then re-reads
 * the real snapshot straight after hydrating and corrects if they differ.
 */
function getServerSnapshot() {
  return false;
}

function applyTheme(on: boolean) {
  document.documentElement.classList.toggle(THEME_CLASS, on);
  emit();
}

export function ZeldaEmblem({ className = '' }: { className?: string }) {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Restore the visitor's choice. Writes to an external system and never calls
  // setState — the store notification above is what re-renders the badge.
  useEffect(() => {
    let stored = false;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      // Private browsing can throw on access. Fall back to off.
    }

    if (stored && !getSnapshot()) applyTheme(true);
  }, []);

  const toggle = useCallback(() => {
    const next = !getSnapshot();
    applyTheme(next);

    // The blade only sings on the way in. Playing it on the way out too would
    // make the flourish feel like a click noise rather than an event, and it is
    // long enough (~0.7s) that hearing it on every press would wear thin fast.
    if (next) play('blade');
    else play('switch');

    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, '1');
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Not fatal — the theme just will not survive a reload.
    }
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      // `aria-pressed` makes this a toggle rather than a button that fires an
      // action, and it is what the CSS keys the lit state off.
      aria-pressed={active}
      aria-label={
        active
          ? 'Turn off the Legend of Zelda 40th anniversary theme'
          : 'Turn on the Legend of Zelda 40th anniversary theme'
      }
      className={`toggle-arm zelda-emblem press ${className}`.trim()}
    >
      <span className="zelda-emblem__crest" aria-hidden="true">
        <Image
          src={EMBLEM_SRC}
          alt=""
          // The file's true intrinsic size — 184 × 274. Passing a square would
          // squash it; CSS sizes it by height inside the crest.
          width={184}
          height={274}
          className="zelda-emblem__img"
        />
      </span>
      <span className="tag">{active ? 'Zelda: On' : 'Zelda 40th'}</span>
    </button>
  );
}
