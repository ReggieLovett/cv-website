/* eslint-disable @typescript-eslint/no-require-imports -- Use the existing TS compiler with Node's test runner. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');

const previousLoader = require.extensions['.ts'];
require.extensions['.ts'] = (module, filename) => {
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  module._compile(compiled.outputText, filename);
};
const { POWER_UPS } = require('../lib/companion-motion.ts');
const { BATTLE_MOVES, FORM_BATTLES, pickBattleSequence, nextBattleDelay } = require('../lib/companion-battle.ts');
if (previousLoader) require.extensions['.ts'] = previousLoader;
else delete require.extensions['.ts'];

test('all thirteen forms have complete, nonduplicated move sets and meaningful screen speeds', () => {
  assert.equal(POWER_UPS.length, 13);
  assert.deepEqual(Object.keys(FORM_BATTLES).sort(), POWER_UPS.map(({ action }) => action).sort());
  const usedMoves = new Set();
  for (const profile of Object.values(FORM_BATTLES)) {
    assert.ok(profile.moves.length >= 3);
    assert.equal(new Set(profile.moves).size, profile.moves.length);
    assert.ok(profile.speed >= 220 && profile.speed <= 700);
    for (const move of profile.moves) {
      assert.ok(BATTLE_MOVES[move], `Missing battle effect for ${move}`);
      usedMoves.add(move);
    }
  }
  assert.deepEqual([...usedMoves].sort(), Object.keys(BATTLE_MOVES).sort());
  assert.ok(FORM_BATTLES['chakra-mode'].speed > FORM_BATTLES['sage-mode'].speed);
  assert.ok(FORM_BATTLES['lightning-dash'].speed > FORM_BATTLES['fire-mode'].speed);
  assert.ok(Object.entries(FORM_BATTLES).every(([form, profile]) => (
    form === 'baryon-mode' || FORM_BATTLES['baryon-mode'].speed > profile.speed
  )));
});

test('battle poses stay grounded, have renderers, and return to visible neutral', () => {
  const neutral = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
  const allowed = new Set(['offset', 'easing', 'transform', 'opacity']);
  const css = fs.readFileSync(require('node:path').join(__dirname, '../components/portfolio-companion.module.css'), 'utf8');
  for (const [move, config] of Object.entries(BATTLE_MOVES)) {
    assert.ok(config.effect.trim());
    assert.ok(css.includes(`[data-battle='${config.effect}']`), `${move} has no visual renderer`);
    assert.ok(config.label.trim());
    assert.ok(['dash', 'advance', 'hover'].includes(config.travel));
    assert.ok(config.duration >= 650 && config.duration <= 1200);
    assert.equal(config.keyframes[0].offset, 0);
    assert.equal(config.keyframes.at(-1).offset, 1);
    assert.equal(config.keyframes[0].transform, neutral);
    assert.equal(config.keyframes.at(-1).transform, neutral);
    assert.equal(config.keyframes.at(-1).opacity, 1);
    let previousOffset = -1;
    for (const keyframe of config.keyframes) {
      assert.ok(Object.keys(keyframe).every((key) => allowed.has(key)), `${move} animates layout`);
      assert.ok(keyframe.offset >= previousOffset && keyframe.offset <= 1);
      assert.ok(keyframe.opacity >= 0.5 && keyframe.opacity <= 1);
      assert.doesNotMatch(keyframe.transform, /scale(?:X|Y|3d)?\(\s*0(?:[\s,)])/);
      const translation = /translate3d\(([-\d.]+)(?:px)?, ([-\d.]+)(?:px)?, 0\)/.exec(keyframe.transform);
      assert.ok(translation);
      assert.ok(Math.abs(Number(translation[1])) <= 12);
      assert.equal(Number(translation[2]), 0, `${move} lifts the body off the bottom baseline`);
      previousOffset = keyframe.offset;
    }
  }
});

test('each form can produce one, two, or three moves, with every profile move reachable', () => {
  for (const [form, profile] of Object.entries(FORM_BATTLES)) {
    for (const [roll, expectedLength] of [[0, 1], [0.6, 2], [0.95, 3]]) {
      const sequence = pickBattleSequence(form, null, () => roll);
      assert.equal(sequence.length, expectedLength);
      assert.ok(sequence.every((move) => profile.moves.includes(move)));
    }
    const reachable = new Set();
    for (let sample = 0; sample <= 100; sample += 1) {
      let calls = 0;
      const sequence = pickBattleSequence(form, null, () => calls++ === 0 ? 0 : sample / 100);
      reachable.add(sequence[0]);
    }
    assert.deepEqual([...reachable].sort(), [...profile.moves].sort());
  }
});

test('sequences avoid adjacent repeats, including the final move of the prior sequence', () => {
  for (const [form, profile] of Object.entries(FORM_BATTLES)) {
    for (const previous of Object.keys(BATTLE_MOVES)) {
      for (const sample of [0, 0.2, 0.5, 0.8, 0.999999, 1]) {
        let calls = 0;
        const sequence = pickBattleSequence(form, previous, () => calls++ === 0 ? 1 : sample);
        assert.equal(sequence.length, 3);
        let last = previous;
        for (const move of sequence) {
          assert.ok(profile.moves.includes(move));
          assert.notEqual(move, last);
          last = move;
        }
      }
    }
  }
});

test('a form signature is favored over its secondary moves without making either unreachable', () => {
  for (const [form, profile] of Object.entries(FORM_BATTLES)) {
    const counts = new Map(profile.moves.map((move) => [move, 0]));
    for (let sample = 0; sample < 100; sample += 1) {
      let calls = 0;
      const [move] = pickBattleSequence(form, null, () => calls++ === 0 ? 0 : sample / 100);
      counts.set(move, counts.get(move) + 1);
    }
    const weightedCounts = profile.moves.map((move) => counts.get(move));
    assert.ok(weightedCounts.every((count) => count > 0));
    assert.ok(weightedCounts.every((count, index) => index === 0 || weightedCounts[index - 1] > count));
  }
});

test('battle cadence and selection remain bounded for injected random boundaries and nonfinite values', () => {
  assert.equal(nextBattleDelay(() => 0), 9000);
  assert.equal(nextBattleDelay(() => 0.5), 13500);
  assert.equal(nextBattleDelay(() => 1), 18000);
  assert.ok(new Set([0, 0.1, 0.3, 0.6, 0.9, 1].map((sample) => nextBattleDelay(() => sample))).size > 4);
  for (const sample of [-10, -1, 0, 0.2, 0.9, 1, 10, NaN, Infinity, -Infinity]) {
    const delay = nextBattleDelay(() => sample);
    assert.ok(Number.isInteger(delay) && delay >= 9000 && delay <= 18000);
    for (const [form, profile] of Object.entries(FORM_BATTLES)) {
      const sequence = pickBattleSequence(form, profile.moves[0], () => sample);
      assert.ok(sequence.length >= 1 && sequence.length <= 3);
      assert.notEqual(sequence[0], profile.moves[0]);
      assert.ok(sequence.every((move) => profile.moves.includes(move)));
    }
  }
});

// These contracts catch plausible-looking but incorrect cross-form assignments.
test('kits stay distinct with Baryon Rasengan and KCM chakra hands plus Rasengan', () => {
  assert.equal(Object.keys(BATTLE_MOVES).length, 39);
  const allMoves = Object.values(FORM_BATTLES).flatMap(({ moves }) => moves);
  assert.equal(new Set(allMoves).size, Object.keys(BATTLE_MOVES).length);
  assert.ok(FORM_BATTLES['sage-mode'].moves.includes('rasenshuriken'));
  assert.ok(FORM_BATTLES['chakra-mode'].moves.includes('rasenshuriken'));
  assert.equal(allMoves.filter((move) => move === 'rasenshuriken').length, 2);
  assert.deepEqual(FORM_BATTLES['baryon-mode'].moves, ['baryon-rasengan', 'baryon-tail-breaker', 'baryon-breakthrough']);
  assert.deepEqual(FORM_BATTLES['chakra-mode'].moves, ['chakra-arm-barrage', 'chakra-arm-rasengan', 'rasenshuriken', 'tailed-beast-bomb']);
  assert.deepEqual(FORM_BATTLES['six-paths-eyes'].moves, ['chidori', 'amaterasu', 'susanoo-slash']);
  assert.deepEqual(FORM_BATTLES['star-magic'].moves, ['quartile-hasta', 'quartile-scutum', 'conjunction']);
  assert.deepEqual(FORM_BATTLES['spirit-dive'].moves, ['spirit-storm', 'spirit-of-zephyr', 'spirit-of-euros']);
  for (const form of ['sage-mode', 'chakra-mode', 'baryon-mode', 'six-paths-eyes', 'zetten-mode', 'devil-union', 'star-magic', 'spirit-dive']) {
    assert.equal(new Set(FORM_BATTLES[form].moves.map((move) => BATTLE_MOVES[move].effect)).size, FORM_BATTLES[form].moves.length, `${form} merely renames the same effect`);
  }
});
