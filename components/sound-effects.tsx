'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import {
  SOUND_NAMES,
  getSoundServerSnapshot,
  isSoundEnabled,
  markGesture,
  play,
  setSoundEnabled,
  subscribeToSound,
  warmSound,
  type SoundName,
} from '@/lib/sounds';

/**
 * SoundEffects — the whole site's interface voice.
 *
 * One delegated set of listeners, mounted once in the root layout, rather
 * than an onClick on several dozen elements: nothing in the components has to
 * know that sound exists, and anything added later is covered automatically.
 *
 * It speaks the same menu language as the certificate inventory, everywhere:
 *
 *   cursor  the selection lands on something — the pointer arriving on a
 *           card or control (the bracket cursor), or focus moved by Tab or
 *           an arrow key (focus a script moves, like a dialog focusing its
 *           field, stays quiet: the opening already spoke)
 *   select  a confirm — any button or link pressed, Enter, Space
 *   back    closing or backing out (overlays voice their own close)
 *   page    moving between sections, tabs or pictures
 *
 * Presses sound on `pointerdown` for a mouse — feedback belongs on the press,
 * and waiting for the release feels like lag. A finger only sounds on its
 * `click`, so starting a scroll on a link stays silent; keyboard activations
 * arrive as clicks with no pointer (`detail === 0`).
 *
 * Elements can steer it with `data-sound`: a voice name chooses the press
 * voice, `silent` means the element's own handler voices its press (a close
 * button, a gallery step), and `own` means the whole subtree voices itself,
 * cursor included (the certificate inventory). Triggers marked
 * `aria-haspopup="dialog"` stay quiet because the dialog voices its opening.
 */
const UNITS = '.card, .frame, .cred-cell';
const CONTROLS = 'a[href], button, summary, [role="tab"], input, textarea, select';
const VOICES = new Set<string>(SOUND_NAMES);
/** Keys that move focus or a selection; focus that follows one of them is the cursor moving. */
const NAVIGATION_KEYS = new Set(['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown']);

/** Classes whose components voice themselves on click. */
const SELF_VOICED = '.sound-toggle, .zelda-emblem, [aria-haspopup="dialog"]';

function steering(target: Element): string | null {
  return target.closest('[data-sound]')?.getAttribute('data-sound') ?? null;
}

function isInert(control: Element): boolean {
  return control.matches(':disabled, [aria-disabled="true"]');
}

/** The voice a press on `target` should make, or null for none. */
function pressVoice(target: Element): SoundName | null {
  const control = target.closest(CONTROLS);
  if (!control || isInert(control)) return null;
  const steer = steering(control);
  if (steer === 'own' || steer === 'silent') return null;
  if (steer && VOICES.has(steer)) return steer as SoundName;
  if (control.closest(SELF_VOICED)) return null;
  if (control.matches('.theme-toggle')) return 'chime'; // the one switch that can afford a flourish
  if (control.matches('[role="tab"]')) return 'page';
  if (control.matches('input, textarea, select')) return null; // typing is not a confirm
  // A summary about to close its disclosure is backing out of it.
  if (control.matches('summary') && control.parentElement instanceof HTMLDetailsElement && control.parentElement.open) return 'back';
  return 'select';
}

/** What the cursor is "on": the whole card when inside one, else the control. */
function unitOf(target: Element): Element | null {
  const unit = target.closest(UNITS) ?? target.closest(CONTROLS);
  if (!unit || steering(unit) === 'own' || (unit.matches(CONTROLS) && isInert(unit))) return null;
  return unit;
}

export function SoundEffects() {
  useEffect(() => warmSound(), []);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let hovered: Element | null = null;
    let lastPointer = 'mouse';
    let navigatedAt = -Infinity;
    let pointerX = Number.NaN;
    let pointerY = Number.NaN;

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (NAVIGATION_KEYS.has(event.key)) navigatedAt = event.timeStamp;
    };

    const onPointerDown = (event: PointerEvent) => {
      markGesture();
      lastPointer = event.pointerType;
      onPointerMove(event);
      // Only primary mouse presses here; a right-click or a wheel press is not a confirm.
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const voice = pressVoice(target);
      if (voice) play(voice);
    };

    const onClick = (event: MouseEvent) => {
      const keyboard = event.detail === 0;
      if (!keyboard && lastPointer === 'mouse') return; // voiced on the press
      const target = event.target;
      if (!(target instanceof Element)) return;
      const voice = pressVoice(target);
      if (voice) play(voice);
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !finePointer.matches) return;
      const target = event.target;
      const unit = target instanceof Element ? unitOf(target) : null;
      if (unit === hovered) return;
      hovered = unit;
      // Only a pointer that moved is the cursor moving. Content scrolling
      // under a still mouse, a dialog opening beneath it or a theme reveal
      // ending all re-target hover without the reader doing anything.
      const still = event.clientX === pointerX && event.clientY === pointerY;
      if (unit && !still) play('cursor');
    };

    const onFocusIn = (event: FocusEvent) => {
      if (event.timeStamp - navigatedAt > 400) return;
      const target = event.target;
      if (!(target instanceof Element) || !target.matches(':focus-visible')) return;
      if (target.closest(CONTROLS) && unitOf(target)) play('cursor');
    };

    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('click', onClick);
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('keydown', onKeyDown, { capture: true });
    return () => {
      document.removeEventListener('keydown', onKeyDown, { capture: true });
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('click', onClick);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('focusin', onFocusIn);
    };
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