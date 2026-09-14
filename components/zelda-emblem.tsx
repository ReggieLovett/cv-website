'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { isSoundEnabled, play } from '@/lib/sounds';
import { revealFrom } from '@/lib/reveal';
import { syncChromeColor } from '@/lib/theme';
import {
  getZeldaServerSnapshot,
  isZeldaOn,
  setZelda,
  subscribeToZelda,
} from '@/lib/zelda';
import { EASE } from './motion';

/**
 * The Zelda 40th-anniversary emblem — one crest, two homes.
 *
 *   Theme off → ZeldaCornerEmblem: a small crest in the top-right control
 *               cluster, beside the light/dark and sound switches.
 *   Theme on  → ZeldaCrest: the large centred crest band above the name.
 *
 * Pressing either switches the theme, and the crest physically flies between
 * the two positions while the new theme grows outward from where you pressed.
 *
 * ---- Why both are always in the page ----
 * Which one shows is decided by CSS off the `zelda-theme` class, not by React
 * mounting one or the other. The pre-paint script sets that class before first
 * paint, but React cannot know it until it hydrates — so a React-chosen layout
 * would render the corner crest first for a returning visitor who left Zelda on,
 * then jump to the centre. CSS gets it right on the first frame.
 *
 * ---- The flight ----
 * A FLIP animation: measure the crest where it is, switch the theme, measure it
 * where it has landed, then animate a transform from the old box back to none.
 * Transform only, so it runs on the compositor. It uses the same duration and
 * curve as the circular reveal, so the crest never outruns the edge of the
 * reveal it is travelling inside.
 *
 * ---- The sound ----
 * Played through the HTML5 Audio API — an `HTMLAudioElement` held in a ref. The
 * Master Sword clip from Breath of the Wild is Nintendo's recording and is not
 * shipped; drop a clip you have the rights to at
 * `public/sounds/master-sword-unsheath.mp3` and it is picked up at the next
 * build (detected on the server in app/page.tsx). Until then, or if the file
 * fails, the site's original synthesised `blade` voice plays instead. Both
 * respect the mute control.
 */

const EMBLEM_SRC = '/images/zelda-emblem.png';

/** Matches the circular reveal, so the crest stays inside the reveal's edge. */
const SWITCH_MS = 720;
const SWITCH_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)';

/** Whether the Zelda theme is on. */
export function useZeldaTheme(): boolean {
  return useSyncExternalStore(subscribeToZelda, isZeldaOn, getZeldaServerSnapshot);
}

/**
 * Animate `element` from the box it occupied (`first`) to where it is now.
 * Transform-origin is the top-left corner (set in CSS on the flip wrappers), so
 * translating by the corner offset and scaling by the width ratio maps the new
 * box exactly onto the old one at the first frame.
 */
function flipFrom(element: HTMLElement, first: DOMRect) {
  const last = element.getBoundingClientRect();
  if (!first.width || !last.width) return;

  const scale = first.width / last.width;
  const dx = first.left - last.left;
  const dy = first.top - last.top;

  element.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
      { transform: 'translate(0px, 0px) scale(1)' },
    ],
    { duration: SWITCH_MS, easing: SWITCH_EASING },
  );
}

export type ZeldaSwitch = {
  active: boolean;
  /** Incremented each time the theme is switched on; keys the flourish. */
  strikes: number;
  /**
   * Callback refs for the two flight wrappers. Setters rather than ref objects:
   * the refs stay private to the hook, so nothing reads `.current` from props
   * during render (react-hooks/refs).
   */
  setCornerEl: (element: HTMLSpanElement | null) => void;
  setCrestEl: (element: HTMLSpanElement | null) => void;
  toggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

/**
 * The switch itself — state, sound, and the flight. Called once in the hero and
 * handed to both presentations, so there is exactly one audio element and one
 * press counter however many crests are on screen.
 */
export function useZeldaSwitch(soundSrc: string | null): ZeldaSwitch {
  const active = useZeldaTheme();
  const [strikes, setStrikes] = useState(0);
  const cornerRef = useRef<HTMLSpanElement | null>(null);
  const crestRef = useRef<HTMLSpanElement | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // null = not yet known, true = loaded and playable, false = failed to load.
  const fileReady = useRef<boolean | null>(null);

  // The pre-paint script restores a stored theme by setting classes before
  // React runs, but nothing repaints the browser's theme-color meta until a
  // switch is pressed. Sync once on mount. Writes to the document only.
  useEffect(() => {
    syncChromeColor();
  }, []);

  // Create and preload the clip, if the server found one.
  useEffect(() => {
    if (!soundSrc) return;

    const audio = new Audio();
    audio.preload = 'auto';
    const onReady = () => {
      fileReady.current = true;
    };
    const onError = () => {
      fileReady.current = false;
    };
    audio.addEventListener('canplaythrough', onReady);
    audio.addEventListener('error', onError);
    audio.src = soundSrc;
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('canplaythrough', onReady);
      audio.removeEventListener('error', onError);
      audio.pause();
      audioRef.current = null;
    };
  }, [soundSrc]);

  const unsheathe = useCallback(() => {
    if (!isSoundEnabled()) return;

    const audio = audioRef.current;
    if (!audio || fileReady.current === false) {
      play('blade');
      return;
    }

    // Restart rather than overlap.
    audio.currentTime = 0;
    audio.volume = 0.8;
    audio.play().catch(() => {
      fileReady.current = false;
      play('blade');
    });
  }, []);

  const toggle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const next = !isZeldaOn();
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Where the crest is now, measured before anything changes.
      const from = next ? cornerRef.current : crestRef.current;
      const to = next ? crestRef.current : cornerRef.current;
      const first = !reduced && from ? from.getBoundingClientRect() : null;

      revealFrom(
        event.currentTarget,
        () => {
          // The class flips synchronously, so the landing box can be measured
          // straight away — layout is forced by getBoundingClientRect.
          setZelda(next);
          if (first && to) flipFrom(to, first);
        },
        { duration: SWITCH_MS },
      );

      // The fanfare belongs to switching on. On the way out, a plain switch.
      if (next) {
        setStrikes((n) => n + 1);
        unsheathe();
      } else {
        play('switch');
      }
    },
    [unsheathe],
  );

  const setCornerEl = useCallback((element: HTMLSpanElement | null) => {
    cornerRef.current = element;
  }, []);
  const setCrestEl = useCallback((element: HTMLSpanElement | null) => {
    crestRef.current = element;
  }, []);

  return { active, strikes, setCornerEl, setCrestEl, toggle };
}

/* -------------------------------------------------------------------------- */

/** Theme off: the small crest in the top-right control cluster. */
export function ZeldaCornerEmblem({
  active,
  onToggle,
  artRef,
}: {
  active: boolean;
  onToggle: ZeldaSwitch['toggle'];
  artRef: ZeldaSwitch['setCornerEl'];
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      // `.zelda-emblem` keeps the global click-sound handler from firing a
      // generic tap on top of the blade. See SILENT in sound-effects.tsx.
      className="zelda-emblem zelda-corner toggle-arm press"
      aria-pressed={active}
      aria-label="Turn on the Legend of Zelda 40th anniversary theme"
    >
      <span ref={artRef} className="zelda-corner__art">
        <Image
          src={EMBLEM_SRC}
          alt=""
          width={184}
          height={274}
          sizes="36px"
          className="zelda-corner__img"
        />
      </span>
      {/* Hidden on narrow screens, where the control row has no room for it. */}
      <span className="tag hidden sm:inline">Zelda 40th</span>
    </button>
  );
}

/** Theme on: the centred crest band above the name. */
export function ZeldaCrest({
  active,
  strikes,
  onToggle,
  artRef,
}: {
  active: boolean;
  strikes: number;
  onToggle: ZeldaSwitch['toggle'];
  artRef: ZeldaSwitch['setCrestEl'];
}) {

  // The rules and captions animate on the theme state, not on mount, so they
  // draw in after the crest has landed each time the theme is switched on.
  const shown = { opacity: 1, y: 0 };
  const hidden = { opacity: 0, y: 6 };

  return (
    <div className="zelda-band">
      <div className="zelda-crest">
        <motion.span
          className="zelda-crest__rule zelda-crest__rule--left"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={active ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: active ? 0.45 : 0 }}
          aria-hidden="true"
        />

        <motion.button
          type="button"
          onClick={onToggle}
          className="zelda-emblem zelda-crest__button"
          aria-pressed={active}
          aria-label="Turn off the Legend of Zelda 40th anniversary theme"
          initial={{ opacity: 0, y: 14, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="zelda-crest__halo" aria-hidden="true" />

          {/* The flight wrapper. Nothing else animates this element's transform,
              so the FLIP never fights Framer Motion for it. */}
          <span ref={artRef} className="zelda-crest__flip">
            {/* The lift-and-settle, once the crest has landed. */}
            <motion.span
              key={`lift-${strikes}`}
              className="zelda-crest__art"
              initial={strikes === 0 ? false : { y: -8, scale: 1.05 }}
              animate={{ y: 0, scale: 1 }}
              transition={{ type: 'spring', duration: 0.6, bounce: 0.25, delay: 0.5 }}
            >
              <Image
                src={EMBLEM_SRC}
                alt=""
                width={184}
                height={274}
                priority
                className="zelda-crest__img"
              />
              {strikes > 0 && (
                // Light across the banner, masked to the emblem's own alpha.
                <span key={`glint-${strikes}`} className="zelda-crest__glint" aria-hidden="true" />
              )}
            </motion.span>
          </span>

          {strikes > 0 && (
            <span key={`ring-${strikes}`} className="zelda-crest__ring" aria-hidden="true" />
          )}
        </motion.button>

        <motion.span
          className="zelda-crest__rule zelda-crest__rule--right"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={active ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: active ? 0.45 : 0 }}
          aria-hidden="true"
        />
      </div>

      <motion.p
        className="zelda-eyebrow mt-6"
        initial={hidden}
        animate={active ? shown : hidden}
        transition={{ duration: 0.8, ease: EASE, delay: active ? 0.6 : 0 }}
      >
        40th Anniversary Tribute
      </motion.p>
      <motion.p
        className="tag mt-2 normal-case tracking-normal text-faint"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.8, delay: active ? 0.9 : 0 }}
      >
        Press the crest to return
      </motion.p>
    </div>
  );
}
