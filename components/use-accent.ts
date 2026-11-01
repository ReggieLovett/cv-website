'use client';

import { useSyncExternalStore } from 'react';
import { subscribeToTheme } from '@/lib/theme';
import { subscribeToZelda } from '@/lib/zelda';

/**
 * useAccent — the live `signal` token as a colour a canvas can paint with.
 *
 * Anything drawn with CSS can say `rgb(var(--signal))` and follow light, dark,
 * and the Zelda gold for free. A 2D canvas cannot: `fillStyle` does not resolve
 * custom properties, so an unresolved `var()` silently paints black. This reads
 * the computed token once per theme change and hands back a plain `rgb()`.
 *
 * The value is cached and only invalidated by the two stores that can change
 * it, so the getComputedStyle read never runs on an ordinary render.
 */

const DARK_SIGNAL = '94 200 236';

let cached: string | null = null;

function subscribe(onChange: () => void): () => void {
  const invalidate = () => {
    cached = null;
    onChange();
  };
  const offTheme = subscribeToTheme(invalidate);
  const offZelda = subscribeToZelda(invalidate);
  return () => {
    offTheme();
    offZelda();
  };
}

function getSnapshot(): string {
  if (cached === null) {
    const token = getComputedStyle(document.documentElement).getPropertyValue('--signal').trim();
    cached = `rgb(${token || DARK_SIGNAL})`;
  }
  return cached;
}

function getServerSnapshot(): string {
  return `rgb(${DARK_SIGNAL})`;
}

export function useAccent(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
