'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import {
  getSoundServerSnapshot,
  isSoundEnabled,
  play,
  setSoundEnabled,
  subscribeToSound,
  type SoundName,
} from '@/lib/sounds';

/**
 * Interface sounds are wired with one delegated listener rather than an
 * onClick on several dozen elements — nothing in the components has to know
 * that sound exists, and anything added later is covered automatically.
 *
 * It listens on `pointerdown`, not `click`: feedback belongs on the press.
 * Waiting for the release makes an interface feel like it's lagging behind
 * the finger.
 */
const SOUND_MAP: Array<[selector: string, sound: SoundName]> = [
  // Most specific first — the first match wins.
  ['.sound-toggle', 'tick'], // handled by the control itself; skipped below
  ['.theme-toggle', 'chime'],
  ['[data-sound="close"]', 'close'],
  ['.tile', 'open'],
  ['.filter-pill', 'switch'],
  ['.btn-solid, .btn-glass', 'tap'],
  ['.site-nav__link, .menu-link, .btn-quiet, .icon-btn, .chip', 'tick'],
  ['button, a[href]', 'tick'],
];

export function SoundEffects() {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      // Only primary presses; a right-click or a scroll-wheel press shouldn't click.
      if (event.button !== 0) return;

      const target = event.target as Element | null;
      if (!target || typeof target.closest !== 'function') return;

      for (const [selector, sound] of SOUND_MAP) {
        const hit = target.closest(selector);
        if (!hit) continue;
        // The mute control makes its own noise when switching back on, so
        // that it can confirm itself — and stays silent when switching off.
        if (hit.classList.contains('sound-toggle')) return;
        play(sound);
        return;
      }
    };

    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return null;
}

export function SoundToggle({ className = '' }: { className?: string }) {
  // Reading an external store this way keeps the preference out of component
  // state, so there is no setState-inside-an-effect to cascade a second render
  // — and React reconciles the server's "on" with the stored value on hydration.
  const on = useSyncExternalStore(subscribeToSound, isSoundEnabled, getSoundServerSnapshot);

  const toggle = useCallback(() => setSoundEnabled(!on), [on]);

  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle sound-toggle ${className}`.trim()}
      aria-pressed={on}
      aria-label={on ? 'Mute interface sounds' : 'Unmute interface sounds'}
    >
      <span className="theme-toggle__glyphs" data-dark={on} aria-hidden="true">
        <Volume2 className="h-4 w-4" />
        <VolumeX className="h-4 w-4" />
      </span>
    </button>
  );
}
