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
 */

export type SoundName = 'tap' | 'tick' | 'switch' | 'open' | 'close' | 'chime';

const STORAGE_KEY = 'sound-enabled';
const MASTER_GAIN = 0.45;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let enabled: boolean | null = null;

/* ---------------------------------------------------------------- context */

function audio(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === 'undefined') return null;

  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;

    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = MASTER_GAIN;
    master.connect(ctx.destination);
  }

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
  q?: number;
  gain: number;
  decay: number;
  type?: BiquadFilterType;
};

/** A filtered noise transient — the "contact" part of any impact. */
function burst(
  c: AudioContext,
  out: GainNode,
  at: number,
  { frequency, q = 1.2, gain, decay, type = 'bandpass' }: BurstOptions,
) {
  const source = c.createBufferSource();
  source.buffer = noiseBuffer(c);

  const filter = c.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = q;

  const envelope = c.createGain();
  envelope.gain.setValueAtTime(gain, at);
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
};

/* ------------------------------------------------------------------- api */

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
  if (next) play('tick');
  listeners.forEach((listener) => listener());
}

export function play(name: SoundName): void {
  if (!isSoundEnabled()) return;

  const nodes = audio();
  if (!nodes) return;

  try {
    voices[name](nodes.ctx, nodes.master, nodes.ctx.currentTime);
  } catch {
    /* An exhausted or interrupted context must never break an interaction. */
  }
}
