'use client';

import { useEffect, useSyncExternalStore } from 'react';
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
 * SoundEffects.
 *
 * Interface sounds are wired with one delegated listener rather than an
 * onClick on several dozen elements — nothing in the components has to know
 * that sound exists, and anything added later is covered automatically.
 *
 * It listens on `pointerdown`, not `click`: feedback belongs on the press.
 * Waiting for the release makes an interface feel like it is lagging behind
 * the finger.
 */
const SOUND_MAP: Array<[selector: string, sound: SoundName]> = [
  // Most specific first — the first match wins.
  ['.theme-toggle', 'chime'], // theme switch can afford the noise
  ['[role="tab"]', 'switch'],
  ['button[aria-current]', 'tick'],
  ['button, a[href]', 'tick'],
];

// Controls that own their feedback on `click` rather than the press — playing
// on pointerdown here would double up with the click handler's playback.
const SILENT = ['.sound-toggle', '[data-sound="close"]'];

export function SoundEffects() {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      // Only primary presses; a right-click or a scroll-wheel press shouldn't click.
      if (event.button !== 0) return;

      const target = event.target as Element | null;
      if (!target || typeof target.closest !== 'function') return;

      for (const selector of SILENT) {
        if (target.closest(selector)) return;
      }

      for (const [selector, sound] of SOUND_MAP) {
        const hit = target.closest(selector);
        if (!hit) continue;
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
  // Reading an external store keeps the preference out of component state, so
  // there is no setState-inside-an-effect to cascade a second render — and
  // React reconciles the server's "on" with the stored value on hydration.
  const on = useSyncExternalStore(subscribeToSound, isSoundEnabled, getSoundServerSnapshot);

  return (
    <button
      type="button"
      onClick={() => setSoundEnabled(!on)}
      className={`toggle-arm sound-toggle press ${className}`.trim()}
      aria-pressed={on}
      aria-label={on ? 'Mute interface sounds' : 'Unmute interface sounds'}
    >
      <span className="toggle-arm__glyphs" aria-hidden="true">
        <Volume2 className="toggle-arm__on h-4 w-4" />
        <VolumeX className="toggle-arm__off h-4 w-4" />
      </span>
      <span className="tag">{on ? 'Sound: On' : 'Sound: Off'}</span>
    </button>
  );
}