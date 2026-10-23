/* eslint-disable @typescript-eslint/no-require-imports -- Exercise the real TS hook with the existing compiler and Node's test runner. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

function compile(relativePath) {
  const filename = path.resolve(__dirname, '..', relativePath);
  return {
    filename,
    code: ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
  };
}

const hookSource = compile('components/use-companion-motion.ts');
const catalogueSource = compile('lib/companion-motion.ts');
const battleSource = compile('lib/companion-battle.ts');
const travelSource = compile('lib/companion-travel.ts');

function pointFromTransform(transform = '') {
  const pair = /^translate3d\(([-+\d.eE]+)px,\s*([-+\d.eE]+)px,\s*0(?:px)?\)$/.exec(transform);
  if (pair) return { x: Number(pair[1]), y: Number(pair[2]) };
  const horizontal = /^translateX\(([-+\d.eE]+)px\)$/.exec(transform);
  if (horizontal) return { x: Number(horizontal[1]), y: 0 };
  return { x: 0, y: 0 };
}

// Only the browser/React boundary is simulated. The scheduler, action selection,
// keyframes, and clock calculations below come from the actual application code.
class VirtualClock {
  now = 0;
  nextId = 1;
  timers = new Map();
  afterTask = () => {};

  setTimeout = (callback, delay = 0) => {
    const id = this.nextId++;
    this.timers.set(id, { at: this.now + Math.max(0, Number(delay)), callback });
    return id;
  };

  clearTimeout = (id) => this.timers.delete(id);

  advance(milliseconds) {
    const destination = this.now + milliseconds;
    let tasks = 0;
    while (true) {
      const next = [...this.timers.entries()]
        .filter(([, timer]) => timer.at <= destination)
        .sort(([leftId, left], [rightId, right]) => left.at - right.at || leftId - rightId)[0];
      if (!next) break;
      assert.ok(++tasks < 10000, 'Scheduler produced an unbounded timer loop');
      const [id, timer] = next;
      this.now = timer.at;
      this.timers.delete(id);
      timer.callback();
      this.afterTask();
    }
    this.now = destination;
    this.afterTask();
  }
}

class FakeAnimation {
  constructor(clock, element, keyframes, options, action, battle, battleMove) {
    this.clock = clock;
    this.element = element;
    this.keyframes = keyframes;
    this.duration = Number(options.duration);
    this.createdAt = clock.now;
    this.action = action;
    this.battle = battle;
    this.battleMove = battleMove;
    this.playState = 'running';
    this.onfinish = null;
    this.cancelled = false;
    this.elapsed = 0;
    this.startedAt = clock.now;
    this.scheduleFinish();
  }

  get currentTime() {
    return this.playState === 'running'
      ? Math.min(this.duration, this.elapsed + this.clock.now - this.startedAt)
      : this.elapsed;
  }

  scheduleFinish() {
    this.clock.clearTimeout(this.finishTimer);
    this.finishTimer = this.clock.setTimeout(() => {
      this.elapsed = this.duration;
      this.playState = 'finished';
      this.onfinish?.({ currentTarget: this });
    }, this.duration - this.currentTime);
  }

  pause() {
    if (this.playState !== 'running') return;
    this.elapsed = this.currentTime;
    this.playState = 'paused';
    this.clock.clearTimeout(this.finishTimer);
  }

  play() {
    if (this.playState !== 'paused') return;
    this.startedAt = this.clock.now;
    this.playState = 'running';
    this.scheduleFinish();
  }

  cancel() {
    this.clock.clearTimeout(this.finishTimer);
    this.playState = 'idle';
    this.cancelled = true;
  }

  // Travel is linear WAAPI motion. A representative current pose is sufficient
  // for checking that interruption captures it instead of restarting at rest.
  computed() {
    const progress = this.currentTime / this.duration;
    const first = this.keyframes[0];
    const last = this.keyframes.at(-1);
    if (this.keyframes.length === 2 && /^translate(?:3d|X)\([^)]*\)$/.test(first.transform)
      && /^translate(?:3d|X)\([^)]*\)$/.test(last.transform)) {
      const from = pointFromTransform(first.transform);
      const to = pointFromTransform(last.transform);
      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress;
      return { transform: `translate3d(${x}px, ${y}px, 0)`, opacity: '1' };
    }
    const frame = this.keyframes.filter((keyframe, index) => (
      (keyframe.offset ?? index / (this.keyframes.length - 1)) <= progress
    )).at(-1) ?? first;
    return { transform: frame.transform, opacity: String(frame.opacity ?? 1) };
  }
}

function sameDependencies(left, right) {
  return left && right && left.length === right.length && left.every((value, index) => Object.is(value, right[index]));
}

function createEngine(options = {}) {
  const clock = new VirtualClock();
  const slots = [];
  let cursor = 0;
  let dirty = true;
  let disposed = false;
  let pendingEffects = [];
  let output;
  let hook;
  let moments = 0;
  const animations = [];
  const document = new EventTarget();
  document.hidden = false;
  const window = new EventTarget();
  window.innerWidth = options.viewport?.width ?? 1024;
  window.innerHeight = options.viewport?.height ?? 800;
  window.performance = { now: () => clock.now };
  window.setTimeout = clock.setTimeout;
  window.clearTimeout = clock.clearTimeout;
  const math = Object.create(Math);
  let random = options.random ?? (() => 0);
  math.random = () => random(); // Deterministic values, not replacement scheduler logic.

  function element() {
    return {
      dataset: { form: 'none', phase: 'idle', action: 'none', effect: 'none', battle: 'none', battleMove: 'none' },
      style: {
        transform: 'translate3d(0px, 0px, 0)',
        setProperty(name, value) { this[name] = value; },
        getPropertyValue(name) { return this[name] ?? ''; },
        removeProperty(name) { delete this[name]; },
      },
      animate(keyframes, animationOptions) {
        const animation = new FakeAnimation(clock, this, keyframes, animationOptions, roamer.dataset.action, roamer.dataset.battle, roamer.dataset.battleMove);
        animations.push(animation);
        return animation;
      },
    };
  }
  const roamer = element();
  const pose = element();
  pose.style.transform = 'none';
  let props = {
    roamerRef: { current: roamer },
    poseRef: { current: pose },
    persona: 'portfolio', open: false, paused: false, reducedMotion: false,
    onMoment: () => { moments += 1; },
    ...options,
  };

  const react = {
    useRef(initial) {
      const index = cursor++;
      if (!slots[index]) slots[index] = { value: { current: initial } };
      return slots[index].value;
    },
    useState(initial) {
      const index = cursor++;
      if (!slots[index]) {
        const slot = { value: initial };
        slot.set = (value) => {
          const next = typeof value === 'function' ? value(slot.value) : value;
          if (!Object.is(next, slot.value)) { slot.value = next; dirty = true; }
        };
        slots[index] = slot;
      }
      return [slots[index].value, slots[index].set];
    },
    useCallback(callback, dependencies) {
      const index = cursor++;
      if (!slots[index] || !sameDependencies(slots[index].dependencies, dependencies)) {
        slots[index] = { value: callback, dependencies };
      }
      return slots[index].value;
    },
    useEffect(create, dependencies) {
      const index = cursor++;
      if (!slots[index]) slots[index] = {};
      if (!sameDependencies(slots[index].dependencies, dependencies)) {
        pendingEffects.push({ slot: slots[index], create, dependencies });
      }
    },
  };

  function computedStyle(target) {
    const animation = animations.filter((entry) => entry.element === target && !entry.cancelled).at(-1);
    return animation ? animation.computed() : { transform: target.style.transform, opacity: '1' };
  }

  class Matrix {
    constructor(transform) {
      const point = pointFromTransform(transform);
      this.m41 = point.x;
      this.m42 = point.y;
    }
  }

  const globals = {
    document, window, Math: math, getComputedStyle: computedStyle, DOMMatrixReadOnly: Matrix,
    setTimeout: clock.setTimeout, clearTimeout: clock.clearTimeout,
  };
  function evaluate(source, requireModule) {
    const moduleRecord = { exports: {} };
    vm.runInNewContext(source.code, {
      ...globals, module: moduleRecord, exports: moduleRecord.exports, require: requireModule,
    }, { filename: source.filename });
    return moduleRecord.exports;
  }
  const catalogue = evaluate(catalogueSource, (name) => { throw new Error(`Unexpected catalogue import: ${name}`); });
  const battle = evaluate(battleSource, (name) => { throw new Error(`Unexpected battle import: ${name}`); });
  const travel = evaluate(travelSource, (name) => { throw new Error(`Unexpected travel import: ${name}`); });
  ({ useCompanionMotion: hook } = evaluate(hookSource, (name) => {
    if (name === 'react') return react;
    if (name === '@/lib/companion-motion') return catalogue;
    if (name === '@/lib/companion-battle') return battle;
    if (name === '@/lib/companion-travel') return travel;
    throw new Error(`Unexpected hook import: ${name}`);
  }));

  function flush() {
    if (disposed) return;
    let renders = 0;
    while (dirty) {
      assert.ok(++renders < 30, 'Hook produced an unbounded effect/render loop');
      dirty = false;
      cursor = 0;
      pendingEffects = [];
      output = hook(props);
      const effects = pendingEffects;
      for (const { slot } of effects) slot.cleanup?.();
      for (const { slot, create, dependencies } of effects) {
        slot.dependencies = dependencies;
        slot.cleanup = create();
      }
    }
  }
  clock.afterTask = flush;
  flush();

  return {
    clock, roamer, pose, animations, catalogue, battle, travel, window,
    get output() { return output; },
    get moments() { return moments; },
    get poseAnimations() { return animations.filter((entry) => entry.element === pose); },
    get travelAnimations() { return animations.filter((entry) => entry.element === roamer); },
    get battleAnimations() { return animations.filter((entry) => entry.element === pose && entry.battle !== 'none'); },
    get battleTravels() { return animations.filter((entry) => entry.element === roamer && entry.battle !== 'none'); },
    computedStyle,
    advance(milliseconds) { clock.advance(milliseconds); },
    act(callback) { callback(output); flush(); },
    update(values) { props = { ...props, ...values }; dirty = true; flush(); },
    setHidden(hidden) { document.hidden = hidden; document.dispatchEvent(new Event('visibilitychange')); flush(); },
    setRandom(next) { random = next; },
    resize(width, height = window.innerHeight) { window.innerWidth = width; window.innerHeight = height; window.dispatchEvent(new Event('resize')); flush(); },
    dispose() {
      if (disposed) return;
      for (const slot of slots) slot.cleanup?.();
      disposed = true;
    },
  };
}

function engineFor(t, options) {
  const engine = createEngine(options);
  t.after(() => engine.dispose());
  return engine;
}

function advanceUntil(engine, predicate, maximum = 10000) {
  let elapsed = 0;
  while (!predicate() && elapsed < maximum) {
    engine.advance(20);
    elapsed += 20;
  }
  assert.ok(predicate(), `Expected engine state was not reached in ${maximum}ms`);
}

function travelDistance(animation) {
  const from = pointFromTransform(animation.keyframes[0].transform);
  const to = pointFromTransform(animation.keyframes.at(-1).transform);
  return Math.hypot(to.x - from.x, to.y - from.y);
}

function assertPoint(actual, expected) {
  assert.ok(Math.abs(actual.x - expected.x) < 0.0001, `x=${actual.x}, expected ${expected.x}`);
  assert.ok(Math.abs(actual.y - expected.y) < 0.0001, `y=${actual.y}, expected ${expected.y}`);
}

function assertBottomTravel(engine) {
  for (const animation of engine.travelAnimations) {
    for (const frame of animation.keyframes) {
      assert.equal(pointFromTransform(frame.transform).y, 0, `Root animation left the bottom edge: ${frame.transform}`);
    }
  }
  assert.equal(pointFromTransform(engine.roamer.style.transform).y, 0);
  assert.equal(pointFromTransform(engine.computedStyle(engine.roamer).transform).y, 0);
}

test('automatic powers reach their active-time deadline despite travel and ambient interruptions', (t) => {
  const engine = engineFor(t);
  engine.advance(17999);
  assert.ok(engine.travelAnimations.length >= 2, 'Expected actual roaming before the power deadline');
  assert.ok(engine.poseAnimations.length >= 2, 'Expected ambient performances before the power deadline');
  assert.ok(engine.poseAnimations.every((animation) => !engine.catalogue.isPowerUp(animation.action)));
  engine.advance(1);
  assert.equal(engine.roamer.dataset.phase, 'performing');
  assert.equal(engine.poseAnimations.at(-1).createdAt, 18000);
  assert.equal(engine.catalogue.isPowerUp(engine.roamer.dataset.action), true);
});

test('a completed transformation persists through later walking and ambient tricks', (t) => {
  const engine = engineFor(t);
  engine.act((controls) => controls.showTrick('sage-mode'));
  engine.advance(2600);
  assert.equal(engine.output.form, 'sage-mode');
  assert.equal(engine.roamer.dataset.form, 'sage-mode');
  assert.equal(engine.roamer.dataset.effect, 'none');
  advanceUntil(engine, () => engine.roamer.dataset.phase === 'walking');
  assert.equal(engine.roamer.dataset.form, 'sage-mode');
  assert.ok(engine.battleTravels.some((animation) => travelDistance(animation) > 0));
  engine.advance(2000);
  assert.equal(engine.roamer.dataset.form, 'sage-mode');
  assert.equal(engine.output.form, 'sage-mode');
});

test('Pause and Resume preserve the same charge and its remaining duration', (t) => {
  const engine = engineFor(t);
  engine.act((controls) => controls.showTrick('chakra-mode'));
  engine.advance(700);
  const charge = engine.poseAnimations.at(-1);
  engine.update({ paused: true });
  assert.equal(charge.cancelled, false, 'Pause must retain the charge instead of cancelling it');
  assert.equal(charge.playState, 'paused');
  engine.advance(10000);
  assert.equal(charge.currentTime, 700);
  assert.equal(engine.output.form, null);
  engine.update({ paused: false });
  assert.equal(engine.poseAnimations.at(-1), charge);
  assert.equal(charge.playState, 'running');
  engine.advance(1699);
  assert.equal(engine.output.form, null);
  engine.advance(1);
  assert.equal(engine.output.form, 'chakra-mode');
});

test('hidden time freezes movement and is excluded from the automatic power deadline', (t) => {
  const engine = engineFor(t);
  engine.advance(4000);
  const walk = engine.travelAnimations.at(-1);
  engine.setHidden(true);
  assert.equal(walk.playState, 'paused');
  const progress = walk.currentTime;
  const animationCount = engine.animations.length;
  engine.advance(60000);
  assert.equal(walk.currentTime, progress);
  assert.equal(engine.animations.length, animationCount);
  engine.setHidden(false);
  engine.advance(13999);
  assert.ok(engine.poseAnimations.every((animation) => !engine.catalogue.isPowerUp(animation.action)));
  engine.advance(1);
  assert.equal(engine.poseAnimations.at(-1).createdAt, 78000);
  assert.equal(engine.catalogue.isPowerUp(engine.roamer.dataset.action), true);
});

test('interaction holds freeze autonomous clocks after a requested charge and demonstration finish', (t) => {
  const engine = engineFor(t);
  engine.act((controls) => controls.setHeld(true));
  engine.advance(60000);
  assert.equal(engine.animations.length, 0);
  engine.act((controls) => controls.showTrick('ice-mode'));
  engine.advance(2200);
  assert.equal(engine.output.form, 'ice-mode');
  engine.advance(550);
  const demonstration = engine.battleAnimations.at(-1);
  assert.ok(demonstration, 'The requested power should demonstrate its completed form');
  engine.advance(demonstration.duration);
  const animationCount = engine.animations.length;
  engine.advance(60000);
  assert.equal(engine.animations.length, animationCount);
  engine.act((controls) => controls.setHeld(false));
  const remainingPowerTime = 18000 - 2200 - 550 - demonstration.duration;
  engine.advance(remainingPowerTime - 1);
  assert.equal(engine.output.form, 'ice-mode');
  engine.advance(1);
  assert.equal(engine.catalogue.isPowerUp(engine.roamer.dataset.action), true);
  assert.notEqual(engine.roamer.dataset.action, 'ice-mode');
});

test('interrupted charges start at the visible pose and cancellation restores the prior completed form', (t) => {
  const engine = engineFor(t);
  engine.act((controls) => controls.showTrick('sage-mode'));
  engine.advance(2600);
  engine.act((controls) => controls.showTrick('chakra-mode'));
  engine.advance(800);
  const originalCharge = engine.poseAnimations.at(-1);
  const visiblePose = engine.computedStyle(engine.pose);
  engine.act((controls) => controls.showTrick('fire-mode'));
  assert.equal(originalCharge.cancelled, true);
  const replacement = engine.poseAnimations.at(-1);
  assert.equal(replacement.keyframes[0].transform, visiblePose.transform);
  assert.equal(replacement.keyframes[0].opacity, visiblePose.opacity);
  engine.update({ open: true });
  assert.equal(replacement.cancelled, true);
  assert.equal(engine.roamer.dataset.form, 'sage-mode');
  assert.equal(engine.output.form, 'sage-mode');
  engine.advance(60000);
  engine.update({ open: false });
  assert.equal(engine.roamer.dataset.form, 'sage-mode');
  assert.equal(engine.roamer.dataset.effect, 'none');
});

test('reset cancels the first unfinished charge and its finish callback cannot restore it', (t) => {
  const engine = engineFor(t);
  engine.act((controls) => controls.showTrick('ice-mode'));
  engine.advance(800);
  const charge = engine.poseAnimations.at(-1);
  const queuedFinish = charge.onfinish;
  engine.act((controls) => controls.resetForm());
  assert.equal(charge.cancelled, true);
  assert.equal(charge.onfinish, null);
  assert.equal(engine.output.form, null);
  assert.equal(engine.roamer.dataset.phase, 'idle');
  assert.equal(engine.roamer.dataset.form, 'none');
  queuedFinish({ currentTarget: charge });
  engine.advance(1500);
  assert.equal(engine.output.form, null);
  assert.equal(engine.roamer.dataset.form, 'none');
});

test('a persona change cancels a pending charge, clears the held form, and uses the new ambient repertoire', (t) => {
  const engine = engineFor(t);
  engine.act((controls) => controls.showTrick('sage-mode'));
  engine.advance(2600);
  engine.act((controls) => controls.showTrick('shadow-mode'));
  engine.advance(600);
  const charge = engine.poseAnimations.at(-1);
  engine.update({ persona: 'zelda' });
  assert.equal(charge.cancelled, true);
  assert.equal(engine.output.form, null);
  assert.equal(engine.roamer.dataset.form, 'none');
  engine.advance(4800);
  assert.equal(engine.roamer.dataset.action, 'twirl');
});

test('reduced motion applies and resets forms directly without creating animation effects', (t) => {
  const engine = engineFor(t, { reducedMotion: true });
  engine.advance(60000);
  engine.act((controls) => controls.showTrick('fire-mode'));
  assert.equal(engine.output.form, 'fire-mode');
  assert.equal(engine.roamer.dataset.form, 'fire-mode');
  engine.act((controls) => controls.showTrick('ice-mode'));
  assert.equal(engine.output.form, 'ice-mode');
  assert.equal(engine.roamer.dataset.effect, 'none');
  assert.equal(engine.animations.length, 0);
  engine.act((controls) => controls.resetForm());
  assert.equal(engine.output.form, null);
  assert.equal(engine.roamer.dataset.form, 'none');
});

test('resize preserves the live walking point and clamps both coordinates to the new viewport', (t) => {
  const engine = engineFor(t);
  engine.advance(4000);
  const walk = engine.travelAnimations.at(-1);
  const before = pointFromTransform(engine.computedStyle(engine.roamer).transform);
  engine.resize(300, 700);
  assert.equal(walk.cancelled, true);
  assertPoint(pointFromTransform(engine.roamer.style.transform), engine.travel.clampPoint(before, { width: 300, height: 700 }));
  engine.resize(100, 140);
  assertPoint(pointFromTransform(engine.roamer.style.transform), engine.travel.clampPoint(before, { width: 100, height: 140 }));
});

for (const action of ['zetten-mode', 'devil-union', 'star-magic', 'spirit-dive']) {
  test(`${action} completes into a persistent form and reset also cancels its unfinished charge`, (t) => {
    const engine = engineFor(t);
    const { duration, effect } = engine.catalogue.SPRITE_ACTIONS[action];
    engine.act((controls) => controls.showTrick(action));
    assert.equal(engine.roamer.dataset.effect, effect);
    engine.advance(duration - 1);
    assert.equal(engine.output.form, null);
    engine.advance(1);
    assert.equal(engine.output.form, action);
    assert.equal(engine.roamer.dataset.form, action);
    assert.equal(engine.roamer.dataset.effect, 'none');
    advanceUntil(engine, () => engine.roamer.dataset.phase === 'walking');
    assert.equal(engine.roamer.dataset.form, action);
    engine.act((controls) => controls.resetForm());
    assert.equal(engine.output.form, null);
    assert.equal(engine.roamer.dataset.form, 'none');

    engine.act((controls) => controls.showTrick(action));
    const charge = engine.poseAnimations.at(-1);
    engine.advance(500);
    engine.act((controls) => controls.resetForm());
    assert.equal(charge.cancelled, true);
    assert.equal(charge.onfinish, null);
    engine.advance(duration);
    assert.equal(engine.output.form, null);
    assert.equal(engine.roamer.dataset.form, 'none');
  });

  test(`${action} can be selected and reset without animation under reduced motion`, (t) => {
    const engine = engineFor(t, { reducedMotion: true });
    engine.act((controls) => controls.showTrick(action));
    assert.equal(engine.output.form, action);
    assert.equal(engine.roamer.dataset.form, action);
    engine.advance(5000);
    assert.equal(engine.output.form, action);
    assert.equal(engine.roamer.dataset.effect, 'none');
    assert.equal(engine.animations.length, 0);
    engine.act((controls) => controls.resetForm());
    assert.equal(engine.output.form, null);
    assert.equal(engine.roamer.dataset.form, 'none');
  });
}

test('all thirteen forms perform one-, two-, and three-move combinations along the bottom edge', (t) => {
  const forms = [
    'sage-mode', 'chakra-mode', 'sword-draw', 'lightning-dash', 'fire-mode', 'ice-mode', 'shadow-mode',
    'zetten-mode', 'devil-union', 'star-magic', 'spirit-dive', 'baryon-mode', 'six-paths-eyes',
  ];
  for (const form of forms) {
    for (const [roll, expectedLength] of [[0, 1], [0.7, 2], [0.95, 3]]) {
      const engine = engineFor(t, { random: () => roll });
      engine.act((controls) => controls.showTrick(form));
      engine.advance(engine.catalogue.SPRITE_ACTIONS[form].duration);
      assert.equal(engine.output.form, form);
      engine.advance(549);
      assert.equal(engine.battleAnimations.length, 0, `${form} starts its combination too early`);
      engine.advance(1);
      assert.equal(engine.roamer.dataset.phase, 'battling');
      assert.equal(engine.roamer.dataset.battleLabel, engine.battle.BATTLE_MOVES[engine.roamer.dataset.battleMove].label);
      engine.advance(5000);
      assert.equal(engine.battleAnimations.length, expectedLength, `${form}, roll=${roll}`);
      assert.equal(engine.battleTravels.length, expectedLength, `${form} must move through the scene`);
      for (const animation of engine.battleAnimations) {
        const move = engine.battle.BATTLE_MOVES[animation.battleMove];
        assert.ok(move, `${form} must expose its exact move ID`);
        assert.equal(animation.battle, move.effect, `${form} must select the move’s renderer effect`);
      }
      for (const animation of engine.battleTravels) {
        assert.ok(travelDistance(animation) > 0, `${form} battle has no world movement`);
        const start = pointFromTransform(animation.keyframes[0].transform);
        const finish = pointFromTransform(animation.keyframes.at(-1).transform);
        assert.notEqual(start.x, finish.x, `${form} must change horizontal position`);
        assert.equal(start.y, 0, `${form} must start at the bottom`);
        assert.equal(finish.y, 0, `${form} must stay at the bottom`);
        const bounds = engine.travel.getCompanionBattleBounds({ width: 1024, height: 800 });
        assert.ok(finish.x >= bounds.minX && finish.x <= bounds.maxX);
        assert.ok(finish.y >= bounds.minY && finish.y <= bounds.maxY);
      }
      assert.equal(engine.output.form, form);
      assert.equal(engine.roamer.dataset.form, form);
      assert.equal(engine.roamer.dataset.battleMove, 'none');
      assertBottomTravel(engine);
      engine.dispose();
    }
  }
});

test('all thirteen power charges stage horizontally inside effect-safe bounds before their release', (t) => {
  for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 1024, height: 800 }]) {
    const catalogue = engineFor(t, { viewport }).catalogue;
    assert.equal(catalogue.POWER_UPS.length, 13);
    for (const { action } of catalogue.POWER_UPS) {
      const engine = engineFor(t, { viewport });
      engine.act((controls) => controls.showTrick(action));
      const staging = engine.travelAnimations[0];
      const charge = engine.poseAnimations[0];
      assert.ok(staging && charge, `${action} must stage its charge from the screen edge`);
      assert.equal(staging.createdAt, charge.createdAt);
      assert.ok(travelDistance(staging) > 0);
      const destination = pointFromTransform(staging.keyframes.at(-1).transform);
      const bounds = engine.travel.getCompanionBattleBounds(viewport);
      assert.ok(destination.x >= bounds.minX && destination.x <= bounds.maxX, `${action} horizontal staging`);
      assert.equal(destination.y, 0, `${action} must stage along the bottom`);
      const firstLift = charge.keyframes.find((frame) => {
        const y = /^translate3d\([^,]+,\s*([-+\d.eE]+)px,/.exec(frame.transform)?.[1];
        return y !== undefined && Number(y) < 0;
      });
      // Small local pose effects may retain a lift; entirely grounded poses
      // instead finish staging during the first fifth of the charge.
      const releaseTime = firstLift ? firstLift.offset * charge.duration : charge.duration * 0.2;
      assert.ok(staging.duration <= releaseTime, `${action} stages after its release`);
      engine.advance(staging.duration);
      assertPoint(pointFromTransform(engine.computedStyle(engine.roamer).transform), destination);
      assert.equal(engine.roamer.dataset.phase, 'performing');
      assert.equal(engine.output.form, null);
      assertBottomTravel(engine);
      engine.dispose();
    }
  }
});

test('Baryon and Chakra battles move faster through the world than Sage form', (t) => {
  const speeds = {};
  for (const form of ['sage-mode', 'chakra-mode', 'baryon-mode']) {
    const engine = engineFor(t);
    engine.act((controls) => controls.showTrick(form));
    engine.advance(engine.catalogue.SPRITE_ACTIONS[form].duration + 550);
    const movement = engine.battleTravels[0];
    assert.ok(movement, `${form} has no battle travel`);
    speeds[form] = travelDistance(movement) / movement.duration * 1000;
  }
  assert.ok(speeds['chakra-mode'] > speeds['sage-mode']);
  assert.ok(speeds['baryon-mode'] > speeds['chakra-mode']);
});

test('pause, hidden tabs, and interaction holds suspend the same automatic battle pose and world movement', (t) => {
  for (const kind of ['paused', 'hidden', 'held']) {
    const engine = engineFor(t);
    engine.advance(18000);
    const form = engine.roamer.dataset.action;
    engine.advance(engine.catalogue.SPRITE_ACTIONS[form].duration + 550 + 200);
    const pose = engine.battleAnimations.at(-1);
    const movement = engine.battleTravels.at(-1);
    const freeze = (value) => {
      if (kind === 'paused') engine.update({ paused: value });
      else if (kind === 'hidden') engine.setHidden(value);
      else engine.act((controls) => controls.setHeld(value));
    };
    freeze(true);
    assert.equal(pose.playState, 'paused', kind);
    assert.equal(movement.playState, 'paused', kind);
    const poseTime = pose.currentTime;
    const travelTime = movement.currentTime;
    const position = engine.computedStyle(engine.roamer).transform;
    engine.advance(10000);
    assert.equal(pose.currentTime, poseTime);
    assert.equal(movement.currentTime, travelTime);
    assert.equal(engine.computedStyle(engine.roamer).transform, position);
    freeze(false);
    assert.equal(pose.playState, 'running');
    assert.equal(movement.cancelled, false);
    engine.advance(100);
    assert.ok(pose.currentTime > poseTime);
    assert.equal(engine.output.form, form);
  }
});

test('the controls disclosure hard-pauses a requested battle and resumes the same move', (t) => {
  const engine = engineFor(t, { reducedMotion: true });
  engine.act((controls) => controls.showTrick('chakra-mode'));
  engine.update({ reducedMotion: false });
  engine.act((controls) => controls.setHeld(true));
  engine.act((controls) => controls.showBattle());
  assert.equal(engine.roamer.dataset.phase, 'battling');
  engine.advance(100);
  const pose = engine.battleAnimations.at(-1);
  const movement = engine.battleTravels.at(-1);
  const poseTime = pose.currentTime;
  const travelTime = movement.currentTime;
  engine.act((controls) => controls.setControlsOpen(true));
  assert.equal(pose.playState, 'paused');
  assert.equal(movement.playState, 'paused');
  engine.advance(10000);
  assert.equal(pose.currentTime, poseTime);
  assert.equal(movement.currentTime, travelTime);
  engine.act((controls) => controls.setControlsOpen(false));
  engine.advance(100);
  assert.ok(pose.currentTime > poseTime);
  assert.equal(engine.output.form, 'chakra-mode');
});

test('pause, hidden, held, and controls-open states preserve a combination gap and its next move', (t) => {
  for (const kind of ['paused', 'hidden', 'held', 'controls']) {
    const engine = engineFor(t);
    engine.setRandom(() => 0.95);
    engine.advance(18000);
    const form = engine.roamer.dataset.action;
    engine.advance(engine.catalogue.SPRITE_ACTIONS[form].duration + 550);
    const first = engine.battleAnimations[0];
    engine.advance(first.duration + 60);
    assert.equal(engine.battleAnimations.length, 1);
    const freeze = (value) => {
      if (kind === 'paused') engine.update({ paused: value });
      else if (kind === 'hidden') engine.setHidden(value);
      else if (kind === 'held') engine.act((controls) => controls.setHeld(value));
      else engine.act((controls) => controls.setControlsOpen(value));
    };
    freeze(true);
    engine.advance(10000);
    assert.equal(engine.battleAnimations.length, 1, kind);
    freeze(false);
    engine.advance(99);
    assert.equal(engine.battleAnimations.length, 1, kind);
    engine.advance(1);
    assert.equal(engine.battleAnimations.length, 2, kind);
  }
});

test('reset and chat opening cancel battle motion and every queued continuation', (t) => {
  for (const action of ['reset', 'chat']) {
    const engine = engineFor(t, { random: () => 0.95 });
    engine.act((controls) => controls.showTrick('baryon-mode'));
    engine.advance(engine.catalogue.SPRITE_ACTIONS['baryon-mode'].duration + 550 + 10);
    const pose = engine.battleAnimations.at(-1);
    const movement = engine.battleTravels.at(-1);
    const queuedPoseFinish = pose.onfinish;
    const queuedTravelFinish = movement.onfinish;
    if (action === 'reset') engine.act((controls) => controls.resetForm());
    else engine.update({ open: true });
    assert.equal(pose.cancelled, true);
    assert.equal(movement.cancelled, true);
    assert.equal(pose.onfinish, null);
    assert.equal(movement.onfinish, null);
    assert.equal(engine.roamer.dataset.battle, 'none');
    assert.equal(engine.roamer.dataset.battleMove, 'none');
    assert.equal(engine.roamer.dataset.phase, 'idle');
    assert.equal(engine.output.form, action === 'reset' ? null : 'baryon-mode');
    const count = engine.battleAnimations.length;
    queuedTravelFinish({ currentTarget: movement });
    queuedPoseFinish({ currentTarget: pose });
    engine.advance(5000);
    assert.equal(engine.battleAnimations.length, count, 'A cancelled combo scheduled another move');
    assert.equal(engine.roamer.dataset.battle, 'none');
  }
});

test('resizing cancels a combination and clamps both actor coordinates without delayed battle effects', (t) => {
  const engine = engineFor(t, { random: () => 0.95 });
  engine.act((controls) => controls.showTrick('baryon-mode'));
  engine.advance(engine.catalogue.SPRITE_ACTIONS['baryon-mode'].duration + 550 + 10);
  const pose = engine.battleAnimations.at(-1);
  const movement = engine.battleTravels.at(-1);
  const live = pointFromTransform(engine.computedStyle(engine.roamer).transform);
  engine.resize(320, 568);
  assert.equal(pose.cancelled, true);
  assert.equal(movement.cancelled, true);
  assertPoint(pointFromTransform(engine.roamer.style.transform), engine.travel.clampPoint(live, { width: 320, height: 568 }));
  assert.equal(engine.output.form, 'baryon-mode');
  assert.equal(engine.roamer.dataset.battle, 'none');
  const count = engine.battleAnimations.length;
  engine.advance(3000);
  assert.equal(engine.battleAnimations.length, count);
  assertBottomTravel(engine);
});

test('roaming, pause, chat, reset, and resize keep the actor anchored to the bottom', (t) => {
  for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 1024, height: 800 }]) {
    const engine = engineFor(t, { viewport });
    assertPoint(pointFromTransform(engine.roamer.style.transform), { x: 0, y: 0 });
    engine.advance(4000);
    assertBottomTravel(engine);
    engine.act((controls) => controls.showTrick('baryon-mode'));
    engine.advance(engine.catalogue.SPRITE_ACTIONS['baryon-mode'].duration + 650);
    assertBottomTravel(engine);
    engine.update({ paused: true });
    engine.advance(5000);
    assertBottomTravel(engine);
    engine.update({ paused: false });
    engine.update({ open: true });
    assertBottomTravel(engine);
    engine.update({ open: false });
    engine.act((controls) => controls.resetForm());
    assertBottomTravel(engine);
    engine.resize(320, 300);
    assertBottomTravel(engine);
    engine.update({ reducedMotion: true });
    assertPoint(pointFromTransform(engine.roamer.style.transform), { x: 0, y: 0 });
    assertBottomTravel(engine);
  }
});

test('reduced motion applies forms instantly and does not start battles', (t) => {
  const engine = engineFor(t, { reducedMotion: true });
  engine.act((controls) => controls.showTrick('baryon-mode'));
  engine.act((controls) => controls.showBattle());
  engine.advance(60000);
  assert.equal(engine.output.form, 'baryon-mode');
  assert.equal(engine.animations.length, 0);
  assert.equal(engine.roamer.dataset.battle, 'none');
});
