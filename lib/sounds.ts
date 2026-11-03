/**
 * Procedural interface sounds.
 *
 * Every sound here is synthesised at runtime with the Web Audio API rather
 * than loaded from a file. That keeps the page's zero-network-asset promise
 * intact, adds nothing to the bundle but a few hundred lines, and sidesteps
 * sample licensing entirely.
 *
 * The palette is modelled on small real-world objects — a wooden tock, a
 * mechanical switch, a sheet of paper — because those read as "physical
 * confirmation" rather than "computer noise". Each is a short transient plus
 * a decaying body, which is how a struck object actually behaves.
 *
 * The menu voices (cursor, select, back, page) borrow the *feel* of an
 * open-world game's pause menu rather than any of its recordings, and they are
 * the site's interface language everywhere (components/sound-effects.tsx):
 * the cursor landing on something is barely there, a glassy tap with a breath
 * of air; confirming is a soft pluck that blooms upward; backing out is the
 * same glass falling away; changing section is a panel of air sliding past.
 * All four are built here from the same two primitives as the rest.
 */

export type SoundName =
  | 'tap' | 'tick' | 'switch' | 'open' | 'close' | 'chime' | 'blade'
  | 'cursor' | 'select' | 'back' | 'page';

export const SOUND_NAMES: readonly SoundName[] = [
  'tap', 'tick', 'switch', 'open', 'close', 'chime', 'blade', 'cursor', 'select', 'back', 'page',
];

const STORAGE_KEY = 'sound-enabled';
const MASTER_GAIN = 0.45;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let enabled: boolean | null = null;
/** A press has happened this visit (fallback where navigator.userActivation is missing). */
let gestured = false;

/* ---------------------------------------------------------------- context */

function create(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = MASTER_GAIN;
  master.connect(ctx.destination);
  return ctx;
}

function audio(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === 'undefined') return null;

  if (!create() || !ctx) return null;

  // Browsers start the context suspended until a real user gesture; every
  // caller here is inside a pointer event, so this is the legal moment to run.
  if (ctx.state === 'suspended') void ctx.resume();

  return master ? { ctx, master } : null;
}

/** One second of white noise, reused by every transient. */
function noiseBuffer(c: AudioContext): AudioBuffer {
  if (!noise) {
    const length = Math.floor(c.sampleRate * 0.6);
    noise = c.createBuffer(1, length, c.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  return noise;
}

/* ------------------------------------------------------------- primitives */

type BurstOptions = {
  frequency: number;
  /** Sweep the filter here over the decay — air moving past, not a hit. */
  to?: number;
  q?: number;
  gain: number;
  decay: number;
  /** A swell instead of a hit; omitted, the burst starts at full gain. */
  attack?: number;
  type?: BiquadFilterType;
};

/** A filtered noise transient — the "contact" part of any impact. */
function burst(
  c: AudioContext,
  out: GainNode,
  at: number,
  { frequency, to, q = 1.2, gain, decay, attack, type = 'bandpass' }: BurstOptions,
) {
  const source = c.createBufferSource();
  source.buffer = noiseBuffer(c);

  const filter = c.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(frequency, at);
  if (to) filter.frequency.exponentialRampToValueAtTime(to, at + decay);
  filter.Q.value = q;

  const envelope = c.createGain();
  if (attack) {
    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.exponentialRampToValueAtTime(gain, at + attack);
  } else {
    envelope.gain.setValueAtTime(gain, at);
  }
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + decay);

  source.connect(filter).connect(envelope).connect(out);
  source.start(at);
  source.stop(at + decay + 0.02);
}

type ToneOptions = {
  frequency: number;
  to?: number;
  gain: number;
  decay: number;
  attack?: number;
  type?: OscillatorType;
};

/** A pitched body with an exponential decay — the "resonance" of the object. */
function tone(
  c: AudioContext,
  out: GainNode,
  at: number,
  { frequency, to, gain, decay, attack = 0.004, type = 'sine' }: ToneOptions,
) {
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, at);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, at + decay);

  const envelope = c.createGain();
  envelope.gain.setValueAtTime(0.0001, at);
  envelope.gain.exponentialRampToValueAtTime(gain, at + attack);
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + decay);

  osc.connect(envelope).connect(out);
  osc.start(at);
  osc.stop(at + decay + 0.03);
}

/* ----------------------------------------------------------------- voices */

const voices: Record<SoundName, (c: AudioContext, out: GainNode, at: number) => void> = {
  /** Knuckle on a solid wooden desk. Primary buttons. */
  tap(c, out, at) {
    tone(c, out, at, { frequency: 174, to: 104, gain: 0.38, decay: 0.1 });
    burst(c, out, at, { frequency: 1750, gain: 0.28, decay: 0.032 });
  },

  /** A fingernail tick on hard plastic. Small controls and nav. */
  tick(c, out, at) {
    tone(c, out, at, { frequency: 420, to: 300, gain: 0.34, decay: 0.045 });
    burst(c, out, at, { frequency: 3400, q: 0.9, gain: 0.44, decay: 0.018 });
  },

  /** A toggle switch: the press, then the sprung return. */
  switch(c, out, at) {
    burst(c, out, at, { frequency: 2600, q: 1.6, gain: 0.5, decay: 0.02 });
    tone(c, out, at, { frequency: 300, to: 220, gain: 0.3, decay: 0.04 });
    burst(c, out, at + 0.052, { frequency: 3600, q: 1.4, gain: 0.3, decay: 0.016 });
  },

  /** A sheet of paper lifted from a stack. Overlays opening. */
  open(c, out, at) {
    burst(c, out, at, { frequency: 900, q: 0.5, gain: 0.34, decay: 0.16, type: 'lowpass' });
    tone(c, out, at + 0.01, { frequency: 520, to: 880, gain: 0.26, decay: 0.2, attack: 0.03 });
  },

  /** The same sheet settling back down. Overlays closing. */
  close(c, out, at) {
    burst(c, out, at, { frequency: 700, q: 0.5, gain: 0.32, decay: 0.13, type: 'lowpass' });
    tone(c, out, at, { frequency: 700, to: 340, gain: 0.24, decay: 0.14, attack: 0.02 });
  },

  /**
   * Struck metal with a magical tail — the theme switch.
   *
   * Built from scratch to sit somewhere between a summoned blade and a
   * struck bell: inharmonic partials (the ratios below are deliberately not
   * a clean harmonic series, which is what makes metal sound like metal),
   * each entering a few milliseconds after the last so the strike blooms
   * rather than arriving flat. A rising sweep adds the sparkle, and a
   * high-passed noise tail gives it air.
   */
  chime(c, out, at) {
    const partials: Array<[number, number, number]> = [
      [987.77, 0.34, 1.7],
      [1318.51, 0.24, 1.45],
      [1975.53, 0.15, 1.2],
      [2637.02, 0.1, 0.95],
      [3520.0, 0.055, 0.75],
    ];

    partials.forEach(([frequency, gain, decay], i) => {
      tone(c, out, at + i * 0.006, {
        frequency,
        // Struck metal drifts slightly flat as it rings out.
        to: frequency * 0.993,
        gain,
        decay,
        attack: 0.005,
        type: i < 2 ? 'triangle' : 'sine',
      });
    });

    tone(c, out, at, {
      frequency: 1250,
      to: 4400,
      gain: 0.1,
      decay: 0.3,
      attack: 0.045,
    });

    burst(c, out, at, { frequency: 5200, q: 0.4, gain: 0.075, decay: 0.55, type: 'highpass' });
  },

  /**
   * A blade drawn and powered up — the anniversary badge.
   *
   * Synthesised from scratch, like everything else here, and deliberately so:
   * the sound people picture when they think of a legendary sword being raised
   * is Nintendo's recording, and shipping that would be shipping someone else's
   * copyrighted audio. This is built to evoke the same event rather than
   * reproduce the cue — an ascending arpeggio, not a transcribed melody.
   *
   * Three layers, in the order the ear assembles them:
   *   1. the draw — a rising filtered-noise sweep, steel leaving a scabbard
   *   2. the flourish — five ascending notes, each a beat behind the last
   *   3. the bloom — inharmonic partials ringing on, which is what makes the
   *      tail read as struck metal rather than as a synth pad
   */
  blade(c, out, at) {
    // 1. The draw. Highpassed noise rising under everything else.
    burst(c, out, at, { frequency: 2200, q: 0.35, gain: 0.16, decay: 0.26, type: 'highpass' });
    tone(c, out, at, { frequency: 380, to: 2600, gain: 0.07, decay: 0.24, attack: 0.05 });

    // 2. The flourish. An A-major arpeggio climbing two octaves — an ascending
    //    run rather than any particular tune, which keeps it original.
    const run = [440, 554.37, 659.25, 880, 1108.73];
    run.forEach((frequency, i) => {
      tone(c, out, at + 0.055 + i * 0.062, {
        frequency,
        gain: 0.2 - i * 0.012,
        decay: 0.2,
        attack: 0.006,
        type: 'triangle',
      });
    });

    // 3. The bloom, landing with the last note of the run. Ratios are not a
    //    clean harmonic series — that inharmonicity is the metal.
    const landing = at + 0.055 + run.length * 0.062;
    const partials: Array<[number, number, number]> = [
      [1108.73, 0.26, 1.9],
      [1661.22, 0.17, 1.6],
      [2217.46, 0.11, 1.3],
      [3322.44, 0.06, 1.0],
      [4434.92, 0.03, 0.8],
    ];

    partials.forEach(([frequency, gain, decay], i) => {
      tone(c, out, landing + i * 0.007, {
        frequency,
        // Struck metal drifts slightly flat as it rings out.
        to: frequency * 0.994,
        gain,
        decay,
        attack: 0.005,
        type: i < 2 ? 'triangle' : 'sine',
      });
    });

    burst(c, out, landing, { frequency: 6000, q: 0.4, gain: 0.06, decay: 0.7, type: 'highpass' });
  },

  /**
   * A fingertip on a pane of glass — the inventory cursor moving one slot.
   *
   * It plays dozens of times a visit, so it is the quietest voice here and
   * shorter than a tenth of a second. A pinprick of high noise is the touch;
   * a high sine with one inharmonic partial (2.76×, the overtone of a struck
   * glass bar) is the pane ringing; a wisp of air keeps it from sounding like
   * a beep. Each move is detuned by up to ±2.5%, so a sweep across a row
   * reads as a hand moving, not a machine repeating itself.
   */
  cursor(c, out, at) {
    const pitch = 2350 * (1 + (Math.random() - 0.5) * 0.05);
    burst(c, out, at, { frequency: 6200, q: 1.8, gain: 0.16, decay: 0.012 });
    tone(c, out, at, { frequency: pitch, to: pitch * 0.985, gain: 0.12, decay: 0.07, attack: 0.002 });
    tone(c, out, at, { frequency: pitch * 2.76, gain: 0.035, decay: 0.035, attack: 0.002 });
    burst(c, out, at, { frequency: 7500, q: 0.5, gain: 0.03, decay: 0.06, type: 'highpass' });
  },

  /**
   * A soft pluck that blooms into light — confirming an item.
   *
   * Two stages, so the ear hears the decision and then its answer: first a
   * short plucked triangle with a touch of contact noise, then, a beat later,
   * a brighter bell a fifth above that rings on. That bell is doubled 0.4%
   * sharp, and the two drifting against each other give the slow shimmer;
   * an inharmonic partial and a breath of high air finish it. A rising pair
   * of notes is an interval, not a melody, which keeps the cue our own.
   */
  select(c, out, at) {
    burst(c, out, at, { frequency: 4200, q: 1.2, gain: 0.14, decay: 0.015 });
    tone(c, out, at, { frequency: 1046.5, to: 1040, gain: 0.16, decay: 0.11, attack: 0.003, type: 'triangle' });

    const bloom = at + 0.06;
    tone(c, out, bloom, { frequency: 1568, gain: 0.13, decay: 0.45, attack: 0.006 });
    tone(c, out, bloom, { frequency: 1568 * 1.004, gain: 0.06, decay: 0.5, attack: 0.012 });
    tone(c, out, bloom, { frequency: 1568 * 2.4, gain: 0.035, decay: 0.25, attack: 0.006 });
    tone(c, out, bloom, { frequency: 2000, to: 3800, gain: 0.025, decay: 0.18, attack: 0.03 });
    burst(c, out, bloom, { frequency: 6800, q: 0.4, gain: 0.05, decay: 0.35, type: 'highpass' });
  },

  /**
   * The same glass, stepping back — closing a panel or cancelling.
   *
   * The mirror of `select`: where the confirm rises a fifth into a ringing
   * bell, this starts at the bell's pitch and falls a fifth in one short
   * pluck with no bloom, so leaving reads quieter than arriving. A breath of
   * air sweeping downward underneath carries the panel away.
   */
  back(c, out, at) {
    burst(c, out, at, { frequency: 3600, q: 1.2, gain: 0.1, decay: 0.012 });
    tone(c, out, at, { frequency: 1568, to: 1046.5, gain: 0.13, decay: 0.12, attack: 0.003, type: 'triangle' });
    tone(c, out, at, { frequency: 1568 * 2.4, to: 1046.5 * 2.4, gain: 0.02, decay: 0.05, attack: 0.003 });
    burst(c, out, at, { frequency: 2600, to: 900, q: 0.8, gain: 0.07, decay: 0.12, attack: 0.02 });
  },

  /**
   * A panel of air sliding past — switching section, category or picture.
   *
   * Band-passed noise swells in and sweeps from low to bright, the swish of
   * something light moving across the ear, then a soft tap lands where the
   * next category settles. No pitch climbs on its own, so stepping through
   * every tab in a row never turns into a scale.
   */
  page(c, out, at) {
    burst(c, out, at, { frequency: 700, to: 3800, q: 0.9, gain: 0.14, decay: 0.16, attack: 0.05 });
    const land = at + 0.09;
    burst(c, out, land, { frequency: 3000, q: 1.2, gain: 0.1, decay: 0.012 });
    tone(c, out, land, { frequency: 660, to: 520, gain: 0.1, decay: 0.06 });
  },
};

/**
 * Shortest gap, in seconds, between two plays of the same voice. A held arrow
 * key repeats about thirty times a second; past this rate the ticks smear into
 * a buzz, so the extra repeats are dropped rather than stacked.
 */
const MIN_GAP: Partial<Record<SoundName, number>> = { cursor: 0.04, page: 0.08 };

/** Repeats inside this window play softer, so a fast sweep sits back in the mix. */
const SWEEP_WINDOW = 0.12;
const SWEEP_GAIN = 0.6;

const lastPlayed: Partial<Record<SoundName, number>> = {};

/**
 * A cursor landing right after another voice is the same moment heard twice —
 * a press that moves focus, a panel that opens and focuses its close button —
 * so it yields to whatever just played.
 */
const CURSOR_YIELD = 0.12;
let lastVoice = -Infinity;

/**
 * Before the first press of a visit the browser keeps the context suspended
 * with its clock stopped, so anything scheduled then would all sound at once
 * on that first press. Hover and focus voices simply wait for it.
 */
function canSchedule(c: AudioContext): boolean {
  if (c.state === 'running') return true;
  const activation = typeof navigator !== 'undefined' ? navigator.userActivation : undefined;
  return activation ? activation.hasBeenActive : gestured;
}

/** Called from the delegated press listener, for browsers without userActivation. */
export function markGesture(): void {
  gestured = true;
}

/* ------------------------------------------------------------------- api */

/**
 * Build the context before the first press. Constructing an AudioContext
 * opens the audio device synchronously — about 140ms of blocked main thread
 * on macOS, which landed inside the first click or arrow key as a visible
 * hitch. Built during idle time it starts suspended (no gesture yet), and the
 * first press only resumes it, which returns at once. Returns a cancel.
 */
export function warmSound(): () => void {
  if (typeof window === 'undefined' || ctx || !isSoundEnabled()) return () => {};
  const build = () => {
    if (isSoundEnabled()) create();
  };
  if (typeof window.requestIdleCallback === 'function') {
    const handle = window.requestIdleCallback(build, { timeout: 5000 });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(build, 1500);
  return () => window.clearTimeout(handle);
}

export function isSoundEnabled(): boolean {
  if (enabled !== null) return enabled;
  if (typeof window === 'undefined') return false;
  try {
    enabled = window.localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    enabled = true; // private mode, blocked storage — fall back to on
  }
  return enabled;
}

/**
 * The mute preference lives outside React (localStorage + a module flag), so
 * components read it through useSyncExternalStore rather than copying it into
 * state inside an effect. These are the store's subscribe/snapshot halves.
 */
const listeners = new Set<() => void>();

export function subscribeToSound(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** Server render has no storage to read; assume on so the markup matches. */
export function getSoundServerSnapshot(): boolean {
  return true;
}

export function setSoundEnabled(next: boolean): void {
  enabled = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
  } catch {
    /* storage unavailable; the in-memory flag still applies for this visit */
  }
  if (next) play('select');
  listeners.forEach((listener) => listener());
}

export function play(name: SoundName): void {
  if (!isSoundEnabled()) return;

  const nodes = audio();
  if (!nodes) return;

  if (!canSchedule(nodes.ctx)) return;

  const now = nodes.ctx.currentTime;
  if (name === 'cursor' && now - lastVoice < CURSOR_YIELD) return;
  if (name !== 'cursor') lastVoice = now;
  const gap = MIN_GAP[name];
  const since = now - (lastPlayed[name] ?? -Infinity);
  if (gap !== undefined) {
    if (since < gap) return;
    lastPlayed[name] = now;
  }

  try {
    let out = nodes.master;
    if (gap !== undefined && since < SWEEP_WINDOW) {
      out = nodes.ctx.createGain();
      out.gain.value = SWEEP_GAIN;
      out.connect(nodes.master);
    }
    voices[name](nodes.ctx, out, now);
  } catch {
    /* An exhausted or interrupted context must never break an interaction. */
  }
}
