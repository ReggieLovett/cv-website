/* eslint-disable @typescript-eslint/no-require-imports -- Exercise the procedural sound library against a recording AudioContext. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');

/** Records every node the voices build, so schedules can be inspected without speakers. */
class Param {
  constructor(value = 0) { this.value = value; this.events = []; }
  setValueAtTime(value, at) { this.events.push([value, at]); }
  exponentialRampToValueAtTime(value, at) { this.events.push([value, at]); }
}
class Node {
  constructor(ctx, kind) { this.ctx = ctx; this.kind = kind; this.outputs = []; ctx.nodes.push(this); }
  connect(node) { this.outputs.push(node); return node; }
}
class RecordingContext {
  constructor() { this.currentTime = 0; this.sampleRate = 48000; this.state = 'running'; this.nodes = []; this.destination = new Node(this, 'destination'); }
  createGain() { const node = new Node(this, 'gain'); node.gain = new Param(1); return node; }
  createBiquadFilter() { const node = new Node(this, 'filter'); node.frequency = new Param(); node.Q = new Param(); return node; }
  createOscillator() { return this.source('oscillator'); }
  createBufferSource() { return this.source('noise'); }
  createBuffer(_channels, length) { return { getChannelData: () => new Float32Array(length) }; }
  source(kind) {
    const node = new Node(this, kind);
    node.frequency = new Param();
    node.start = (at) => { node.startAt = at; };
    node.stop = (at) => { node.stopAt = at; };
    return node;
  }
  resume() {}
}

const storage = new Map();
globalThis.window = {
  AudioContext: RecordingContext,
  localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
};

const previousLoader = require.extensions['.ts'];
require.extensions['.ts'] = (module, filename) => {
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  module._compile(compiled.outputText, filename);
};
const { play, setSoundEnabled, markGesture } = require('../lib/sounds.ts');
if (previousLoader) require.extensions['.ts'] = previousLoader;
else delete require.extensions['.ts'];

// The library creates its context lazily inside play() and keeps it private;
// a constructor that returns a recorded instance hands it back to the tests
// (`new` yields the returned object).
let context;
window.AudioContext = function RecordedAudioContext() {
  context = new RecordingContext();
  return context;
};
play('tap');

/** Play one voice at `time` and return the nodes it created. */
function nodesOf(name, time) {
  context.currentTime = time;
  const before = context.nodes.length;
  play(name);
  return context.nodes.slice(before);
}
const sources = (nodes) => nodes.filter((node) => node.kind === 'oscillator' || node.kind === 'noise');
const loudness = (nodes) => nodes.filter((node) => node.kind === 'gain')
  .reduce((sum, node) => sum + Math.max(0, ...node.gain.events.map(([value]) => value)), 0);

test('inventory voices start on the press, stay short, and the cursor is the quietest move', () => {
  let time = 10;
  for (const [name, longest] of [['cursor', 0.1], ['select', 0.6], ['page', 0.2]]) {
    time += 1;
    const played = sources(nodesOf(name, time));
    assert.ok(played.length >= 3, `${name} has no layers`);
    for (const source of played) {
      assert.ok(source.startAt >= time, `${name} starts before the press`);
      assert.ok(source.stopAt - time <= longest + 0.03, `${name} rings for ${(source.stopAt - time).toFixed(3)}s`);
    }
  }
  assert.ok(loudness(nodesOf('cursor', 20)) < loudness(nodesOf('tick', 21)), 'cursor is louder than tick');
});

test('select confirms in two stages: a pluck, then a brighter bloom a beat later', () => {
  const played = sources(nodesOf('select', 30));
  const starts = [...new Set(played.map((source) => Number((source.startAt - 30).toFixed(3))))].sort((a, b) => a - b);
  assert.deepEqual(starts, [0, 0.06]);
  const pitches = (offset) => played.filter((source) => source.kind === 'oscillator' && Math.abs(source.startAt - 30 - offset) < 1e-9)
    .map((source) => source.frequency.events[0][0]);
  assert.ok(Math.min(...pitches(0.06)) > Math.max(...pitches(0)), 'the bloom does not rise above the pluck');
});

test('held arrow keys drop cursor repeats faster than 40 ms and soften a fast sweep', () => {
  assert.ok(sources(nodesOf('cursor', 40)).length > 0);
  assert.equal(sources(nodesOf('cursor', 40.02)).length, 0, 'a repeat inside 40 ms stacked');
  const sweep = nodesOf('cursor', 40.07);
  const duck = sweep.find((node) => node.kind === 'gain' && node.gain.value < 1 && node.outputs.length === 1);
  assert.ok(duck && duck.gain.value === 0.6, 'a fast repeat played at full level');
  const settled = nodesOf('cursor', 42);
  assert.ok(!settled.some((node) => node.kind === 'gain' && node.gain.value === 0.6), 'a lone move was ducked');
});

test('muting stops every voice before it reaches the audio graph', () => {
  setSoundEnabled(false);
  for (const name of ['cursor', 'select', 'page']) assert.equal(nodesOf(name, 50).length, 0, `${name} played while muted`);
  setSoundEnabled(true);
  assert.equal(storage.get('sound-enabled'), 'on');
  assert.ok(sources(nodesOf('cursor', 60)).length > 0);
});

test('back is the select falling away: one short pluck, pitch descending, quieter than the confirm', () => {
  const played = sources(nodesOf('back', 70));
  assert.ok(played.length >= 3);
  for (const source of played) {
    assert.ok(source.startAt >= 70 && source.stopAt - 70 <= 0.18, `back rings for ${(source.stopAt - 70).toFixed(3)}s`);
  }
  const body = played.find((source) => source.kind === 'oscillator');
  const [[from], [to]] = [body.frequency.events[0], body.frequency.events.at(-1)];
  assert.ok(to < from, 'back does not fall');
  assert.ok(loudness(nodesOf('back', 72)) < loudness(nodesOf('select', 74)), 'back is louder than select');
});

test('a cursor right after another voice yields to it, then sounds again once it has passed', () => {
  nodesOf('select', 80);
  assert.equal(sources(nodesOf('cursor', 80.05)).length, 0, 'cursor stacked on a select');
  assert.ok(sources(nodesOf('cursor', 80.2)).length > 0);
});

test('nothing is scheduled on a suspended context before the first press of a visit', () => {
  context.state = 'suspended';
  assert.equal(nodesOf('cursor', 90).length, 0, 'a hover queued onto the stopped clock');
  assert.equal(nodesOf('select', 91).length, 0);
  markGesture();
  assert.ok(sources(nodesOf('select', 92)).length > 0, 'the first press stayed silent');
  context.state = 'running';
});
