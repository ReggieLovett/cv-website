/* eslint-disable @typescript-eslint/no-require-imports -- Use the existing TS compiler with Node's test runner. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');

const previousLoader = require.extensions['.ts'];
require.extensions['.ts'] = (module, filename) => {
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  module._compile(compiled.outputText, filename);
};
const { POWER_UPS, SPRITE_ACTIONS } = require('../lib/companion-motion.ts');
const { canCompanionHover } = require('../lib/companion-appearance.ts');
const { BATTLE_MOVES, FORM_BATTLES, pickBattleSequence, nextBattleDelay } = require('../lib/companion-battle.ts');
if (previousLoader) require.extensions['.ts'] = previousLoader;
else delete require.extensions['.ts'];

test('every selectable form has a complete, nonduplicated move set and meaningful screen speed', () => {
  assert.equal(POWER_UPS.length, 13);
  assert.deepEqual(Object.keys(FORM_BATTLES).sort(), POWER_UPS.map(({ action }) => action).sort());
  const usedMoves = new Set();
  for (const profile of Object.values(FORM_BATTLES)) {
    assert.equal(profile.moves.length, 10, 'Every remaining form needs exactly ten attacks');
    assert.equal(new Set(profile.moves).size, profile.moves.length);
    assert.ok(profile.speed >= 220 && profile.speed <= 800);
    for (const move of profile.moves) {
      assert.ok(BATTLE_MOVES[move], `Missing battle effect for ${move}`);
      usedMoves.add(move);
    }
  }
  assert.deepEqual([...usedMoves].sort(), Object.keys(BATTLE_MOVES).sort());
  assert.ok(FORM_BATTLES['chakra-mode'].speed > FORM_BATTLES['sage-mode'].speed);
  assert.ok(FORM_BATTLES['lightning-dash'].speed > FORM_BATTLES['fire-mode'].speed);
  const speedRanking = Object.entries(FORM_BATTLES).sort((left, right) => right[1].speed - left[1].speed);
  assert.deepEqual(speedRanking.slice(0, 3).map(([form]) => form), ['hyper-sonic', 'baryon-mode', 'deku-overdrive']);
});

test('battle poses stay grounded, have renderers, and return to visible neutral', () => {
  const neutral = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
  const allowed = new Set(['offset', 'easing', 'transform', 'opacity']);
  const componentDirectory = path.join(__dirname, '../components');
  const css = ['portfolio-companion.module.css', ...fs.readdirSync(componentDirectory)
    .filter((filename) => /^companion-.*-effects\.module\.css$/.test(filename))]
    .map((filename) => fs.readFileSync(path.join(componentDirectory, filename), 'utf8')).join('\n');
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
    assert.ok(weightedCounts[0] > Math.max(...weightedCounts.slice(1)));
    // Expanded repertoires give their extra techniques the same low weight.
    assert.ok(weightedCounts.every((count, index) => index === 0 || weightedCounts[index - 1] >= count));
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
test('kits retain their signature techniques, intentional shared Rasenshuriken, and new hero repertoires', () => {
  const allMoves = Object.values(FORM_BATTLES).flatMap(({ moves }) => moves);
  assert.equal(new Set(allMoves).size, Object.keys(BATTLE_MOVES).length);
  assert.ok(FORM_BATTLES['sage-mode'].moves.includes('rasenshuriken'));
  assert.ok(FORM_BATTLES['chakra-mode'].moves.includes('rasenshuriken'));
  assert.equal(allMoves.filter((move) => move === 'rasenshuriken').length, 2);
  const retainedSignatures = {
    'baryon-mode': ['baryon-rasengan', 'baryon-tail-breaker', 'baryon-breakthrough'],
    'chakra-mode': ['chakra-arm-barrage', 'chakra-arm-rasengan', 'rasenshuriken', 'tailed-beast-bomb'],
    'six-paths-eyes': ['chidori', 'amaterasu', 'susanoo-slash'],
    'spirit-dive': ['spirit-storm', 'spirit-of-zephyr', 'spirit-of-euros', 'quartile-hasta', 'quartile-scutum', 'conjunction'],
  };
  for (const [form, signatures] of Object.entries(retainedSignatures)) {
    for (const signature of signatures) assert.ok(FORM_BATTLES[form].moves.includes(signature), `${form} lost ${signature}`);
  }
  for (const form of ['sage-mode', 'chakra-mode', 'baryon-mode', 'six-paths-eyes', 'zetten-mode', 'devil-union', 'spirit-dive', 'lightning-dash', 'fire-mode', 'water-mode', 'deku-overdrive', 'hyper-sonic']) {
    assert.equal(new Set(FORM_BATTLES[form].moves.map((move) => BATTLE_MOVES[move].effect)).size, FORM_BATTLES[form].moves.length, `${form} merely renames the same effect`);
  }
  for (const form of ['lightning-dash', 'fire-mode', 'deku-overdrive', 'hyper-sonic']) {
    for (const move of FORM_BATTLES[form].moves) assert.equal(BATTLE_MOVES[move].effect, move);
  }
});

test('the single Yuno form combines five spirit techniques and five star techniques without losing either arsenal', () => {
  assert.equal(FORM_BATTLES['star-magic'], undefined, 'The separate Star Magic form should be merged into Spirit Dive');
  const combined = FORM_BATTLES['spirit-dive'].moves;
  const spirit = ['spirit-storm', 'spirit-of-zephyr', 'spirit-of-euros', 'spirit-of-boreas', 'spirit-of-notos'];
  const star = ['quartile-hasta', 'quartile-scutum', 'quartile-flagellum', 'conjunction', 'never-never-land'];
  assert.equal(combined.filter((move) => spirit.includes(move)).length, 5);
  assert.equal(combined.filter((move) => star.includes(move)).length, 5);
  assert.equal(BATTLE_MOVES['conjunction'].travel, 'dash', 'The combined kit must retain star-based relocation');
  assert.equal(BATTLE_MOVES['quartile-hasta'].travel, 'hover', 'The star projectile should be cast instead of becoming a melee strike');
  assert.equal(BATTLE_MOVES['quartile-scutum'].travel, 'hover', 'The star shield should retain a held defensive stance');
});

test('Luck uses a True Lightning rush alongside his distinct ordinary lightning attacks', () => {
  const profile = FORM_BATTLES['lightning-dash'];
  const [ceranos, claw, orb] = profile.moves.map((move) => BATTLE_MOVES[move]);
  assert.match(ceranos.label, /True Lightning Magic: Ceranos/);
  assert.equal(ceranos.travel, 'dash');
  assert.match(claw.label, /Thunder God’s Gloves: Claw Strike/);
  assert.equal(claw.travel, 'advance');
  assert.match(orb.label, /Lightning Magic: Thunderbolt Destruction/);
  assert.equal(orb.travel, 'hover');
  for (const ordinaryAttack of [claw, orb]) {
    assert.doesNotMatch(ordinaryAttack.label, /True Lightning|Ultimate|Battle Fiend/i);
  }
  assert.notDeepEqual(ceranos.keyframes, claw.keyframes, 'The whole-body rush should not use the close claw-strike pose');
  assert.notDeepEqual(claw.keyframes, orb.keyframes, 'The close strike should not use the fingertip projectile pose');
});

test('Mereoleona escalates from a flaming fist to Mana Zone barrage and sustained full release', () => {
  const profile = FORM_BATTLES['fire-mode'];
  const [fist, barrage, abyss] = profile.moves.map((move) => BATTLE_MOVES[move]);
  assert.match(fist.label, /^Flame Magic: Calidos Brachium$/);
  assert.match(barrage.label, /^Mana Zone: Calidos Brachium Barrage$/);
  assert.match(abyss.label, /^Mana Zone Full Release: Calidos Brachium Purgatory: Abyss$/);
  assert.equal(fist.travel, 'advance');
  assert.equal(barrage.travel, 'advance');
  assert.equal(abyss.travel, 'hover');
  assert.ok(fist.duration < barrage.duration && barrage.duration < abyss.duration, 'Successive punches and full release need more time than one fist');
  assert.notDeepEqual(abyss.keyframes, fist.keyframes, 'The full-release stance must remain distinct from a single punch');
  for (const config of [fist, barrage, abyss]) {
    assert.doesNotMatch(config.label, /fireball|phoenix/i);
  }
});

test('Full Overdrive represents all seven quirks without dropping existing active techniques', () => {
  const profile = FORM_BATTLES['deku-overdrive'];
  const activeQuirks = {
    Gearshift: 'gearshift-overdrive',
    'Fa Jin': 'fa-jin-smash',
    Blackwhip: 'blackwhip-strike',
    'Danger Sense': 'danger-sense-counter',
    Smokescreen: 'smokescreen-feint',
  };
  assert.match(SPRITE_ACTIONS['deku-overdrive'].label, /One For All/i, 'The base strength form must remain One For All');
  assert.equal(canCompanionHover('deku-overdrive'), true, 'Float must remain available independently of the active move pool');
  assert.equal(profile.moves.length, 10);
  for (const [quirk, move] of Object.entries(activeQuirks)) {
    assert.ok(profile.moves.includes(move), `${quirk} has no selectable technique`);
    assert.equal(BATTLE_MOVES[move].effect, move, `${quirk} needs its own renderer`);
  }
});

test('Hyper Sonic replaces generic speed tricks with ten distinct Frontiers-inspired attacks', () => {
  assert.deepEqual(FORM_BATTLES['hyper-sonic'].moves, [
    'hyper-sonic-boom', 'hyper-cross-slash', 'hyper-quick-cyloop', 'hyper-homing-shot',
    'hyper-loop-kick', 'hyper-grand-slam', 'hyper-parry-counter',
    'hyper-wild-rush', 'hyper-cyclone-kick', 'hyper-spin-slash',
  ]);
  assert.equal(BATTLE_MOVES['hyper-quick-cyloop'].travel, 'dash');
  assert.equal(BATTLE_MOVES['hyper-sonic-boom'].travel, 'hover');
  assert.equal(BATTLE_MOVES['hyper-homing-shot'].travel, 'hover');
  assert.equal(BATTLE_MOVES['hyper-wild-rush'].travel, 'dash');
  assert.notDeepEqual(BATTLE_MOVES['hyper-grand-slam'].keyframes, BATTLE_MOVES['hyper-parry-counter'].keyframes,
    'The held parry must precede its counter instead of using the immediate slam pose');
  for (const oldMove of ['hyper-boost', 'hyper-homing-attack', 'hyper-spin-dash']) assert.equal(BATTLE_MOVES[oldMove], undefined);
});

test('removed ice and shadow kits cannot be chosen or reached through any remaining form', () => {
  assert.equal(FORM_BATTLES['ice-mode'], undefined);
  assert.equal(FORM_BATTLES['shadow-mode'], undefined);
  for (const move of Object.keys(BATTLE_MOVES)) assert.doesNotMatch(move, /^(?:ice-|frost-|shadow-)/);
  assert.equal(SPRITE_ACTIONS['water-mode'].effect, 'water');
  assert.equal(canCompanionHover('water-mode'), true, 'Leviathan armor should retain its low airborne lane');
});

test('Deku defensive techniques evade horizontally, briefly conceal the body, then restore visibility', () => {
  const dangerSense = BATTLE_MOVES['danger-sense-counter'];
  const smokescreen = BATTLE_MOVES['smokescreen-feint'];
  assert.ok(dangerSense.duration < smokescreen.duration, 'A warning dodge should finish before a smoke feint');
  for (const config of [dangerSense, smokescreen]) {
    assert.equal(config.travel, 'dash');
    assert.ok(config.keyframes.some((frame) => frame.offset > 0 && frame.offset < 1 && frame.opacity <= 0.5));
    assert.equal(config.keyframes.at(-1).opacity, 1);
    assert.equal(config.keyframes.at(-1).transform, config.keyframes[0].transform);
  }
});
