/* eslint-disable @typescript-eslint/no-require-imports -- Load the pure TS planner with the existing compiler. */
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
const { ACTOR_WIDTH, ACTOR_HEIGHT, getCompanionBounds, getCompanionBattleBounds, clampPoint, clampBattlePoint, planTravel } = require('../lib/companion-travel.ts');
if (previousLoader) require.extensions['.ts'] = previousLoader;
else delete require.extensions['.ts'];

const viewports = [
  { width: 320, height: 568 }, { width: 390, height: 844 },
  { width: 1024, height: 800 }, { width: 1920, height: 800 },
];
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function inside(point, bounds) {
  assert.ok(point.x >= bounds.minX && point.x <= bounds.maxX, `x=${point.x}`);
  assert.ok(point.y >= bounds.minY && point.y <= bounds.maxY, `y=${point.y}`);
}

test('ordinary bounds cover the bottom edge while preserving the actor and its home', () => {
  assert.equal(ACTOR_WIDTH, 64);
  assert.equal(ACTOR_HEIGHT, 104);
  for (const viewport of viewports) {
    const inset = viewport.width <= 600 ? 12 : 18;
    const bounds = getCompanionBounds(viewport);
    assert.equal(bounds.maxX, 0);
    assert.equal(bounds.maxY, 0);
    assert.equal(bounds.minY, 0);
    assert.equal(viewport.width - inset - ACTOR_WIDTH + bounds.minX, 16);
    assert.deepEqual(clampPoint({ x: 0, y: 0 }, viewport), { x: 0, y: 0 });
    assert.deepEqual(clampPoint({ x: -99999, y: -99999 }, viewport), { x: bounds.minX, y: bounds.minY });
  }
});

test('battle bounds reserve 100px horizontally without moving the actor above the bottom', () => {
  for (const viewport of viewports) {
    const inset = viewport.width <= 600 ? 12 : 18;
    const home = { x: viewport.width - inset - 64 };
    const bounds = getCompanionBattleBounds(viewport);
    assert.equal(home.x + bounds.minX, 116);
    assert.equal(home.x + bounds.maxX + 64, viewport.width - 116);
    assert.equal(bounds.minY, 0);
    assert.equal(bounds.maxY, 0);
    inside(clampBattlePoint({ x: 0, y: 0 }, viewport), bounds);
  }
  const narrow = getCompanionBattleBounds({ width: 320, height: 568 });
  assert.equal(narrow.maxX - narrow.minX, 24);
});

test('all travel kinds stay inside their bounds with varied, deterministic random samples', () => {
  for (const viewport of viewports) {
    for (const kind of ['wander', 'dash', 'advance', 'hover']) {
      for (const sample of [0, 0.25, 0.5, 0.75, 1]) {
        const origin = clampPoint({ x: -200, y: -200 }, viewport);
        const plan = planTravel(origin, viewport, kind, kind === 'wander' ? 36 : 420, () => sample);
        inside(plan.destination, kind === 'wander' ? getCompanionBounds(viewport) : getCompanionBattleBounds(viewport));
        assert.ok(Number.isFinite(plan.duration) && plan.duration >= (kind === 'wander' ? 180 : 32));
        assert.equal(plan.destination.y, 0);
        assert.ok(distance(origin, plan.destination) > 1);
        assert.ok(['left', 'right'].includes(plan.direction));
      }
    }
  }
});

test('dashes use the available horizontal corridor and complete faster than ordinary walking', () => {
  for (const viewport of viewports) {
    const bounds = getCompanionBattleBounds(viewport);
    const origin = { x: bounds.minX, y: bounds.maxY };
    const wander = planTravel(origin, viewport, 'wander', 36, () => 0.5);
    const dash = planTravel(origin, viewport, 'dash', 420, () => 0.5);
    assert.ok(distance(origin, dash.destination) >= Math.min(bounds.maxX - bounds.minX, viewport.width >= 768 ? 160 : 60));
    assert.notEqual(dash.destination.x, origin.x);
    assert.equal(dash.destination.y, 0);
    assert.ok(dash.duration <= 1000 && dash.duration < wander.duration);
    assert.equal(dash.direction, 'right');
  }
});

test('battle planning preserves the original point and times travel from that live origin', () => {
  const viewport = { width: 390, height: 844 };
  const origin = Object.freeze({ x: 0, y: 0 });
  const plan = planTravel(origin, viewport, 'advance', 700, () => 0.25);
  inside(plan.destination, getCompanionBattleBounds(viewport));
  assert.deepEqual(origin, { x: 0, y: 0 });
  assert.equal(plan.duration, Math.max(32, Math.min(1200, distance(origin, plan.destination) / 700 * 1000)));
});

test('resizing clamps stale positions and replans a safe destination', () => {
  const wide = { width: 1920, height: 800 };
  const narrow = { width: 320, height: 568 };
  const stale = { x: getCompanionBounds(wide).minX, y: -500 };
  const clamped = clampPoint(stale, narrow);
  inside(clamped, getCompanionBounds(narrow));
  assert.ok(clamped.x > stale.x && clamped.y > stale.y);
  assert.equal(clamped.y, 0);
  inside(planTravel(stale, narrow, 'dash', 420, () => 0.75).destination, getCompanionBattleBounds(narrow));
});

test('old vertical offsets and viewport height changes never produce root travel above the bottom', () => {
  for (const kind of ['wander', 'dash', 'advance', 'hover']) {
    for (const height of [140, 568, 844, 2000]) {
      const viewport = { width: 390, height };
      const origin = { x: -180, y: -600 };
      assert.equal(clampPoint(origin, viewport).y, 0);
      assert.equal(clampBattlePoint(origin, viewport).y, 0);
      assert.equal(planTravel(origin, viewport, kind, 420, () => 0.5).destination.y, 0);
      assert.equal(origin.y, -600, 'Planning must not mutate the caller’s old snapshot');
    }
  }
});

test('fast forms retain different horizontal speeds in the narrow mobile battle corridor', () => {
  const viewport = { width: 320, height: 568 };
  const bounds = getCompanionBattleBounds(viewport);
  const origin = { x: bounds.minX, y: 0 };
  const base = planTravel(origin, viewport, 'dash', 300, () => 0.5);
  const chakra = planTravel(origin, viewport, 'dash', 520, () => 0.5);
  const baryon = planTravel(origin, viewport, 'dash', 700, () => 0.5);
  assert.deepEqual(base.destination, chakra.destination);
  assert.deepEqual(chakra.destination, baryon.destination);
  assert.ok(baryon.duration < chakra.duration && chakra.duration < base.duration);
});

test('invalid numbers, extreme inputs, and tiny viewports produce finite non-inverted plans', () => {
  for (const viewport of [{ width: 0, height: 0 }, { width: 70, height: 90 }, { width: NaN, height: Infinity }, { width: -10, height: -20 }, { width: 1e308, height: 1e308 }]) {
    for (const bounds of [getCompanionBounds(viewport), getCompanionBattleBounds(viewport)]) {
      assert.ok(Object.values(bounds).every(Number.isFinite));
      assert.ok(bounds.minX <= bounds.maxX && bounds.minY <= bounds.maxY);
    }
    for (const speed of [0, -10, NaN, Infinity, 'fast']) {
      const plan = planTravel({ x: Infinity, y: NaN }, viewport, 'dash', speed, () => NaN);
      assert.ok(Object.values(plan.destination).every(Number.isFinite));
      assert.ok(Number.isFinite(plan.duration));
      inside(plan.destination, getCompanionBattleBounds(viewport));
    }
  }
});
