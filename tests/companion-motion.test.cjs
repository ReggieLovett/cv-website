/* eslint-disable @typescript-eslint/no-require-imports -- Load the pure TS catalogue with the existing compiler. */
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
const {
  ACTION_POOLS,
  POWER_UPS,
  SPRITE_ACTIONS,
  isPowerUp,
  pickAmbientAction,
  pickPowerUp,
  pickSpriteAction,
  nextPowerUpDelay,
  nextSpriteDelay,
  nextTravelDelay,
} = require('../lib/companion-motion.ts');
if (previousLoader) require.extensions['.ts'] = previousLoader;
else delete require.extensions['.ts'];

test('persona repertoires preserve their identity while including valid power-ups', () => {
  const allActions = new Set();
  for (const pool of Object.values(ACTION_POOLS)) {
    assert.equal(pool.length, 3 + POWER_UPS.length);
    assert.equal(new Set(pool).size, pool.length);
    for (const action of pool) {
      assert.ok(SPRITE_ACTIONS[action], `Missing configuration for ${action}`);
      allActions.add(action);
    }
  }
  assert.equal(allActions.size, Object.keys(SPRITE_ACTIONS).length);
  assert.deepEqual(ACTION_POOLS.portfolio.filter((action) => !isPowerUp(action)), ['hop', 'salute', 'look-around']);
  assert.deepEqual(ACTION_POOLS.zelda.filter((action) => !isPowerUp(action)), ['twirl', 'levitate', 'sparkle']);
  for (const { action } of POWER_UPS) {
    assert.ok(ACTION_POOLS.portfolio.includes(action), `${action} unavailable in default persona`);
    assert.ok(ACTION_POOLS.zelda.includes(action), `${action} unavailable in Zelda persona`);
  }
  assert.ok(ACTION_POOLS.portfolio.some((action) => SPRITE_ACTIONS[action].effect === 'dust'));
  assert.ok(ACTION_POOLS.zelda.some((action) => SPRITE_ACTIONS[action].effect === 'spark'));
});

test('every pose stays grounded, returns to visible neutral, and avoids layout animation', () => {
  const allowedProperties = new Set(['transform', 'opacity', 'offset', 'easing']);
  const neutral = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
  for (const [name, action] of Object.entries(SPRITE_ACTIONS)) {
    assert.ok(action.duration >= 600 && action.duration <= 2600, `${name} duration`);
    assert.ok([
      'none', 'dust', 'spark', 'ring', 'sage', 'chakra', 'sword', 'lightning', 'fire', 'ice', 'shadow',
      'zetten', 'devil', 'star', 'spirit', 'baryon', 'six-paths',
    ].includes(action.effect));
    assert.ok(action.label.trim());
    assert.equal(action.keyframes[0].offset, 0);
    assert.equal(action.keyframes.at(-1).offset, 1);
    assert.equal(action.keyframes[0].transform, neutral);
    assert.equal(action.keyframes.at(-1).transform, neutral);
    assert.equal(action.keyframes.at(-1).opacity, 1);
    assert.ok(action.keyframes.some((frame) => frame.transform !== neutral), `${name} has no movement`);
    let previousOffset = -1;
    for (const frame of action.keyframes) {
      assert.ok(Object.keys(frame).every((property) => allowedProperties.has(property)), `${name} animates layout`);
      assert.ok(frame.offset >= previousOffset && frame.offset >= 0 && frame.offset <= 1);
      assert.ok(frame.opacity >= 0.5 && frame.opacity <= 1);
      assert.doesNotMatch(frame.transform, /scale(?:X|Y|3d)?\(\s*0(?:[\s,)])/);
      const translation = /translate3d\(([-\d.]+)(?:px)?, ([-\d.]+)(?:px)?, 0\)/.exec(frame.transform);
      assert.ok(translation, `${name} has a readable local pose`);
      assert.equal(Number(translation[2]), 0, `${name} lifts off the bottom baseline`);
      previousOffset = frame.offset;
    }
  }
});

test('selection can reach every action in each repertoire and never repeats the previous action', () => {
  const samples = Array.from({ length: 101 }, (_, index) => index / 100);
  for (const [persona, pool] of Object.entries(ACTION_POOLS)) {
    const reachable = new Set(samples.map((sample) => pickSpriteAction(persona, null, () => sample)));
    assert.deepEqual([...reachable].sort(), [...pool].sort());
    for (const previous of Object.keys(SPRITE_ACTIONS)) {
      for (const sample of samples) {
        const next = pickSpriteAction(persona, previous, () => sample);
        assert.ok(pool.includes(next));
        assert.notEqual(next, previous);
      }
    }
  }
});

test('all thirteen persistent forms have direct chooser entries and distinct effect contracts', () => {
  const expected = [
    ['sage-mode', 'Sage Mode', 'sage'],
    ['chakra-mode', 'Chakra Cloak', 'chakra'],
    ['sword-draw', 'Draw Sword', 'sword'],
    ['lightning-dash', 'Lightning Step', 'lightning'],
    ['fire-mode', 'Phoenix Flame', 'fire'],
    ['ice-mode', 'Frost Armor', 'ice'],
    ['shadow-mode', 'Shadow Clone', 'shadow'],
    ['zetten-mode', 'Zetten', 'zetten'],
    ['devil-union', 'Devil Union', 'devil'],
    ['star-magic', 'Star Magic', 'star'],
    ['spirit-dive', 'Spirit Dive', 'spirit'],
    ['baryon-mode', 'Baryon Mode', 'baryon'],
    ['six-paths-eyes', 'Six Paths Eyes', 'six-paths'],
  ];
  assert.equal(POWER_UPS.length, expected.length);
  assert.equal(new Set(POWER_UPS.map(({ action }) => action)).size, expected.length);
  for (const [action, label, effect] of expected) {
    const choice = POWER_UPS.find((powerUp) => powerUp.action === action);
    assert.ok(choice, `${action} must be reachable through the chooser`);
    assert.equal(choice.label, label);
    assert.ok(choice.description.trim());
    assert.equal(SPRITE_ACTIONS[action].effect, effect);
    assert.ok(SPRITE_ACTIONS[action].duration >= 1800 && SPRITE_ACTIONS[action].duration <= 2600);
  }
  for (const action of Object.keys(SPRITE_ACTIONS)) {
    assert.equal(isPowerUp(action), POWER_UPS.some((choice) => choice.action === action));
    if (!isPowerUp(action)) assert.ok(SPRITE_ACTIONS[action].duration <= 1200);
  }
  assert.equal(isPowerUp(null), false);
  assert.equal(isPowerUp(undefined), false);
});

test('the four Black Clover performances have distinct poses within the local character bounds', () => {
  const actions = ['zetten-mode', 'devil-union', 'star-magic', 'spirit-dive'];
  const performances = new Set();
  for (const action of actions) {
    const config = SPRITE_ACTIONS[action];
    assert.ok(config.duration >= 2200 && config.duration <= 2600);
    performances.add(JSON.stringify(config.keyframes));
    for (const keyframe of config.keyframes) {
      const translation = /translate3d\(([-\d.]+)(?:px)?, ([-\d.]+)(?:px)?, 0\)/.exec(keyframe.transform);
      assert.ok(translation, `${action} must expose a bounded local translation`);
      assert.ok(Math.abs(Number(translation[1])) <= 18, `${action} travels too far sideways`);
      assert.equal(Number(translation[2]), 0, `${action} leaves the bottom baseline`);
    }
  }
  assert.equal(performances.size, actions.length);
});

test('power selection reaches every form, avoids the held form, and survives repeated automatic changes', () => {
  const samples = Array.from({ length: 101 }, (_, index) => index / 100);
  const actions = POWER_UPS.map(({ action }) => action);
  const reachable = new Set(samples.map((sample) => pickPowerUp(null, () => sample)));
  assert.deepEqual([...reachable].sort(), [...actions].sort());
  for (const previous of actions) {
    const successors = new Set(samples.map((sample) => pickPowerUp(previous, () => sample)));
    assert.deepEqual([...successors].sort(), actions.filter((action) => action !== previous).sort());
  }
  let previous = null;
  for (let turn = 0; turn < 100; turn += 1) {
    const next = pickPowerUp(previous, () => (turn % 11) / 10);
    assert.ok(actions.includes(next));
    assert.notEqual(next, previous);
    previous = next;
  }
  for (const sample of [-10, -1, 0, 1, 10, NaN, Infinity, -Infinity]) {
    const next = pickPowerUp('shadow-mode', () => sample);
    assert.ok(actions.includes(next));
    assert.notEqual(next, 'shadow-mode');
  }
});

test('ambient selection stays separate from powers and never repeats a persona trick immediately', () => {
  const samples = Array.from({ length: 101 }, (_, index) => index / 100);
  for (const [persona, pool] of Object.entries(ACTION_POOLS)) {
    const tricks = pool.filter((action) => !isPowerUp(action));
    const reachable = new Set(samples.map((sample) => pickAmbientAction(persona, null, () => sample)));
    assert.deepEqual([...reachable].sort(), [...tricks].sort());
    for (const previous of Object.keys(SPRITE_ACTIONS)) {
      const successors = new Set(samples.map((sample) => pickAmbientAction(persona, previous, () => sample)));
      assert.deepEqual([...successors].sort(), tricks.filter((action) => action !== previous).sort());
    }
    for (const sample of [-10, -1, 0, 1, 10, NaN, Infinity, -Infinity]) {
      const action = pickAmbientAction(persona, tricks[0], () => sample);
      assert.ok(tricks.includes(action));
      assert.equal(isPowerUp(action), false);
      assert.notEqual(action, tricks[0]);
    }
  }
});

test('persona switches select from the new repertoire even when the previous action belongs to the old one', () => {
  assert.ok(ACTION_POOLS.zelda.includes(pickSpriteAction('zelda', 'hop', () => 0.5)));
  assert.ok(ACTION_POOLS.portfolio.includes(pickSpriteAction('portfolio', 'twirl', () => 0.5)));
});

test('independent ambient, power, and travel delays cover their ranges without synchronized fixed intervals', () => {
  const clocks = [
    [nextSpriteDelay, 8000, 24000],
    [nextPowerUpDelay, 18000, 42000],
    [nextTravelDelay, 3000, 9000],
  ];
  const samples = [0, 0.07, 0.2, 0.38, 0.5, 0.8, 0.999999];
  for (const [clock, minimum, maximum] of clocks) {
    assert.equal(clock(() => 0), minimum);
    assert.equal(clock(() => 0.5), (minimum + maximum) / 2);
    assert.equal(clock(() => 1), maximum);
    const delays = samples.map((sample) => clock(() => sample));
    assert.ok(new Set(delays).size > 4);
    for (const sample of [-10, -1, 0, 0.3, 0.9, 1, 10, NaN, Infinity, -Infinity]) {
      const delay = clock(() => sample);
      assert.ok(Number.isInteger(delay) && delay >= minimum && delay <= maximum);
    }
  }
  for (const sample of [-10, -1, 0, 0.3, 0.9, 1, 10, NaN, Infinity, -Infinity]) {
    for (const persona of Object.keys(ACTION_POOLS)) {
      assert.ok(ACTION_POOLS[persona].includes(pickSpriteAction(persona, null, () => sample)));
    }
  }
});
