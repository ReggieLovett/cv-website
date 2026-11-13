/* eslint-disable @typescript-eslint/no-require-imports -- Load the pure TS team data with the existing compiler. */
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
const {
  MOVES, FX, MOTIONS, POKEDEX, TEAMS, TYPE_COLORS, DURATIONS, SPEEDS,
  resolveMember, teamSprites, spriteUrl, speciesForms, battleText, formText, stanceFor, landingFor,
  nextAutoDelay, pickAutoAction, pickMove, pickNextSlot, planWander, wanderMinX,
} = require('../lib/pokemon-team.ts');
if (previousLoader) require.extensions['.ts'] = previousLoader;
else delete require.extensions['.ts'];

const spriteRoot = path.join(__dirname, '../public/sprites/pokemon');
const actorCss = fs.readFileSync(path.join(__dirname, '../components/pokemon-actor.module.css'), 'utf8');
const movesCss = fs.readFileSync(path.join(__dirname, '../components/pokemon-moves.module.css'), 'utf8');
/** A deterministic stand-in for Math.random. */
function sequence(...values) {
  let index = 0;
  return () => values[index++ % values.length];
}
const randoms = [0, 0.13, 0.27, 0.5, 0.74, 0.9, 0.999999];
const slotOf = (persona, species) => TEAMS[persona].findIndex((slot) => slot.species === species);

test('the portfolio team is the requested six, with Garchomp and Dragonite able to Mega Evolve', () => {
  assert.deepEqual(TEAMS.portfolio, [
    { species: 'lugia', shiny: true },
    { species: 'samurott-hisui' },
    { species: 'ursaluna-bloodmoon' },
    { species: 'garchomp' },
    { species: 'dragonite' },
    { species: 'decidueye' },
  ]);
  const megas = TEAMS.portfolio.filter(({ species }) => POKEDEX[species].mega).map(({ species }) => POKEDEX[POKEDEX[species].mega].name);
  assert.deepEqual(megas, ['Mega Garchomp', 'Mega Dragonite']);
});

test('every persona fields six distinct Pokémon, each with four valid moves', () => {
  for (const [persona, team] of Object.entries(TEAMS)) {
    assert.equal(team.length, 6, persona);
    assert.equal(new Set(team.map(({ species }) => species)).size, 6, `${persona} repeats a species`);
    for (const { species } of team) {
      const entry = POKEDEX[species];
      assert.ok(entry, `${species} is missing from the POKEDEX`);
      assert.equal(entry.moves?.length, 4, `${species} needs four moves`);
      assert.equal(new Set(entry.moves).size, 4, `${species} repeats a move`);
      for (const type of entry.types) assert.ok(TYPE_COLORS[type], `${species}: unknown type ${type}`);
      for (const form of speciesForms(species).slice(1)) {
        assert.ok(POKEDEX[form], `${species}: missing form ${form}`);
        assert.equal(POKEDEX[form].moves, undefined, `${form} keeps its base form's moves`);
      }
      if (entry.mega) assert.match(POKEDEX[entry.mega].name, /^Mega /);
    }
  }
});

test('every move has a real type and category and a recipe the stylesheets draw', () => {
  for (const [name, move] of Object.entries(MOVES)) {
    assert.ok(TYPE_COLORS[move.type], `${name}: unknown type ${move.type}`);
    assert.ok(['physical', 'special', 'status'].includes(move.category), `${name}: category`);
    assert.ok(MOTIONS.includes(move.motion), `${name}: unknown motion ${move.motion}`);
    assert.ok(move.fx.length >= 1, `${name} draws something`);
    for (const fx of move.fx) assert.ok(FX.includes(fx), `${name}: unknown effect ${fx}`);
    for (const colour of [move.color, move.tint].filter(Boolean)) assert.match(colour, /^\d{1,3} \d{1,3} \d{1,3}$/);
    if (move.category === 'status') assert.ok(['boost', 'cast'].includes(move.motion), `${name} is a status move`);
  }
  for (const fx of FX) {
    assert.match(movesCss, new RegExp(`\\[data-fx='${fx}'\\]`), `${fx} has styles`);
    assert.ok(Object.values(MOVES).some((move) => move.fx.includes(fx)), `${fx} is used by a move`);
  }
  for (const motion of MOTIONS) assert.match(actorCss, new RegExp(`\\[data-motion='${motion}'\\] \\.pose`), `${motion} moves the sprite`);
});

test('every move, species and form in the data is used by a team', () => {
  const moves = new Set();
  const species = new Set();
  for (const team of Object.values(TEAMS)) {
    for (const slot of team) {
      for (const form of speciesForms(slot.species)) species.add(form);
      const { moves: known, form } = POKEDEX[slot.species];
      for (const move of known) moves.add(move);
      for (const swapped of Object.values(form?.swap ?? {})) moves.add(swapped);
    }
  }
  assert.deepEqual([...species].sort(), Object.keys(POKEDEX).sort());
  assert.deepEqual([...moves].sort(), Object.keys(MOVES).sort());
});

test('every sprite the teams need is on disk, real, and from the expected sources', () => {
  const sprites = teamSprites();
  for (const { file, url } of sprites) {
    const body = fs.readFileSync(path.join(spriteRoot, file));
    const signature = file.endsWith('.gif') ? 'GIF8' : '\x89PNG';
    assert.equal(body.subarray(0, 4).toString('latin1'), signature, file);
    assert.match(url, /^https:\/\/(play\.pokemonshowdown\.com\/sprites\/|raw\.githubusercontent\.com\/PokeAPI\/sprites\/)/);
  }
  // Nothing stale is left behind after a team change.
  const onDisk = fs.readdirSync(spriteRoot, { recursive: true })
    .filter((entry) => /\.(gif|png)$/.test(entry))
    .map((entry) => entry.split(path.sep).join('/'))
    .sort();
  assert.deepEqual(onDisk, sprites.map(({ file }) => file));
});

test('members resolve to animated sprites where they exist, and stills everywhere', () => {
  const garchomp = resolveMember(TEAMS.portfolio, 3);
  assert.equal(garchomp.name, 'Garchomp');
  assert.equal(garchomp.sprite, '/sprites/pokemon/gen5ani/garchomp.gif');
  assert.equal(garchomp.still, '/sprites/pokemon/gen5/garchomp.png');
  assert.equal(garchomp.canMega, true);
  assert.equal(garchomp.tag, null);
  assert.equal(garchomp.locomotion, 'run');

  const mega = resolveMember(TEAMS.portfolio, 3, 'mega');
  assert.equal(mega.name, 'Mega Garchomp');
  assert.equal(mega.baseName, 'Garchomp');
  assert.equal(mega.sprite, '/sprites/pokemon/gen5ani/garchomp-mega.gif');
  assert.equal(mega.canMega, false);
  assert.equal(mega.tag, 'Mega');
  assert.deepEqual(mega.moves.map(({ name }) => name), garchomp.moves.map(({ name }) => name));

  const lugia = resolveMember(TEAMS.portfolio, 0);
  assert.equal(lugia.shiny, true);
  assert.equal(lugia.locomotion, 'fly');
  assert.equal(lugia.sprite, '/sprites/pokemon/gen5ani-shiny/lugia.gif');
  assert.equal(lugia.still, '/sprites/pokemon/gen5-shiny/lugia.png');

  // No animated Gen 5 sprite exists for these: the still is used, never a fake.
  const decidueye = resolveMember(TEAMS.portfolio, 5);
  assert.equal(decidueye.animated, false);
  assert.equal(decidueye.sprite, decidueye.still);
  assert.equal(resolveMember(TEAMS.portfolio, 4, 'mega').sprite, '/sprites/pokemon/gen5/dragonite-mega.png');

  // A form the species does not have is ignored; out-of-range slots clamp.
  assert.equal(resolveMember(TEAMS.portfolio, 1, 'mega').state, 'base');
  assert.equal(resolveMember(TEAMS.portfolio, 3, 'form').state, 'base');
  assert.equal(resolveMember(TEAMS.portfolio, 99).slot, 5);
  assert.equal(resolveMember(TEAMS.portfolio, -3).slot, 0);
  assert.equal(spriteUrl('garchomp', true), '/sprites/pokemon/gen5ani-shiny/garchomp.gif');
});

test('form changes: Crowned Sword, Gigantamax and Stance Change behave as in the games', () => {
  const zacian = resolveMember(TEAMS.zelda, slotOf('zelda', 'zacian'));
  assert.equal(zacian.canChange, true);
  assert.ok(zacian.moves.some(({ name }) => name === 'Iron Head'));
  const crowned = resolveMember(TEAMS.zelda, zacian.slot, 'form');
  assert.equal(crowned.sprite, '/sprites/pokemon/gen5ani/zacian-crowned.gif');
  assert.deepEqual(crowned.types, ['fairy', 'steel']);
  assert.equal(crowned.tag, 'Crowned Sword');
  assert.equal(crowned.canChange, false);
  assert.ok(crowned.moves.some(({ name }) => name === 'Behemoth Blade'), 'Iron Head becomes Behemoth Blade');
  assert.ok(!crowned.moves.some(({ name }) => name === 'Iron Head'));

  const hatterene = resolveMember(TEAMS.zelda, slotOf('zelda', 'hatterene'), 'form');
  assert.equal(hatterene.tag, 'Gigantamax');
  assert.equal(hatterene.formChange.turns, 3);
  assert.ok(hatterene.moves.some(({ name }) => name === 'G-Max Smite'));

  const shield = resolveMember(TEAMS.zelda, slotOf('zelda', 'aegislash'));
  const blade = resolveMember(TEAMS.zelda, shield.slot, 'form');
  assert.equal(shield.canChange, false, 'Stance Change is never triggered by hand');
  assert.equal(blade.sprite, '/sprites/pokemon/gen5ani/aegislash-blade.gif');
  const move = (name) => ({ name, ...MOVES[name] });
  assert.equal(stanceFor(shield, move('Sacred Sword')), 'form', 'attacking switches to Blade Forme');
  assert.equal(stanceFor(shield, move('Shadow Ball')), 'form');
  assert.equal(stanceFor(blade, move('Sacred Sword')), null);
  assert.equal(stanceFor(blade, move("King's Shield")), 'base', "King's Shield returns to Shield Forme");
  assert.equal(stanceFor(shield, move("King's Shield")), null);
  assert.equal(stanceFor(resolveMember(TEAMS.portfolio, 3), move('Dragon Claw')), null);

  assert.equal(formText('{name} Gigantamaxed!', 'Hatterene'), 'Hatterene Gigantamaxed!');
});

test('automatic actions vary, and transformations only happen when they can', () => {
  for (const value of randoms) {
    const random = () => value;
    assert.notEqual(pickAutoAction({ canMega: false, teamSize: 6 }, null, random), 'mega');
    assert.notEqual(pickAutoAction({ canMega: false, canChange: false, teamSize: 6 }, null, random), 'form');
    assert.notEqual(pickAutoAction({ canMega: true, teamSize: 6 }, 'walk', random), 'walk');
    assert.notEqual(pickAutoAction({ canMega: true, teamSize: 6 }, 'switch', random), 'switch');
    assert.notEqual(pickAutoAction({ canMega: true, teamSize: 6 }, 'combo', random), 'combo');
    assert.notEqual(pickAutoAction({ canMega: false, teamSize: 1 }, null, random), 'switch');
    const delay = nextAutoDelay(random);
    assert.ok(delay >= 3_000 && delay <= 7_000, `delay ${delay}`);
  }
  const seen = new Set();
  for (let step = 0; step < 100; step += 1) seen.add(pickAutoAction({ canMega: true, canChange: true, teamSize: 6 }, null, () => step / 100));
  assert.deepEqual([...seen].sort(), ['attack', 'combo', 'form', 'mega', 'switch', 'walk']);
});

test('moves and switches never repeat the current choice', () => {
  const moves = resolveMember(TEAMS.portfolio, 3).moves;
  for (const value of randoms) {
    assert.notEqual(pickMove(moves, 'Earthquake', () => value).name, 'Earthquake');
    for (let current = 0; current < 6; current += 1) {
      const next = pickNextSlot(6, current, () => value);
      assert.ok(next >= 0 && next < 6 && next !== current, `${current} → ${next}`);
    }
  }
  assert.equal(pickMove([], null), null);
  assert.equal(pickMove([{ name: 'Only' }], 'Only').name, 'Only');
  assert.equal(pickNextSlot(1, 0), 0);
});

test('wandering stays on the bottom edge, inside the viewport, at each Pokémon’s pace', () => {
  const actor = 136;
  for (const width of [320, 390, 768, 1280, 1920]) {
    const minX = wanderMinX(width, actor);
    const inset = width <= 600 ? 12 : 18;
    assert.equal(width - inset - actor + minX, 16, `${width}px keeps a 16px margin`);
    let x = 0;
    for (const value of [...randoms, ...randoms]) {
      const plan = planWander(x, width, actor, sequence(value));
      assert.ok(plan.x <= 0 && plan.x >= minX, `${width}: ${plan.x}`);
      assert.ok(plan.duration >= 400 && plan.duration <= 5_000);
      assert.equal(plan.direction, plan.x > x ? 'right' : 'left');
      if (minX < -24) assert.notEqual(plan.x, x, 'a walk goes somewhere');
      x = plan.x;
    }
  }
  const slow = planWander(0, 1920, actor, () => 0.5, SPEEDS.float);
  const fast = planWander(0, 1920, actor, () => 0.5, SPEEDS.run);
  assert.equal(slow.x, fast.x);
  assert.ok(fast.duration < slow.duration, 'runners cover the same ground faster');
  assert.equal(planWander(0, 150, actor).x, 0, 'too narrow to move: stay home');
});

test('battle text reads like the games', () => {
  assert.equal(battleText.used('Garchomp', 'Earthquake'), 'Garchomp used Earthquake!');
  assert.equal(battleText.recall('Lugia'), 'Lugia, come back!');
  assert.equal(battleText.go('Dragonite'), 'Go! Dragonite!');
  assert.equal(battleText.megaReacting('Garchomp'), "Garchomp is reacting to Reggie's Key Stone!");
  assert.equal(battleText.megaEvolved('Garchomp', 'Mega Garchomp'), 'Garchomp has Mega Evolved into Mega Garchomp!');
  assert.equal(POKEDEX.aegislash.form.done, 'Changed to Blade Forme!');
  assert.equal(POKEDEX.aegislash.form.revert, 'Changed to Shield Forme!');
});

test('the stylesheets keep the hook’s timings and honour reduced motion', () => {
  const cssDuration = (name) => Number(new RegExp(`--${name}-ms:\\s*(\\d+)ms`).exec(actorCss)?.[1]);
  assert.equal(cssDuration('attack'), DURATIONS.attack);
  assert.equal(cssDuration('boost'), DURATIONS.boost);
  assert.equal(cssDuration('recall'), DURATIONS.recall);
  assert.equal(cssDuration('throw'), DURATIONS.throw);
  assert.equal(cssDuration('release'), DURATIONS.release);
  assert.equal(cssDuration('mega-charge'), DURATIONS.megaCharge);
  assert.equal(cssDuration('mega-reveal'), DURATIONS.megaReveal);
  assert.equal(cssDuration('form-charge'), DURATIONS.formCharge);
  assert.equal(cssDuration('form-reveal'), DURATIONS.formReveal);
  assert.equal(cssDuration('stance'), DURATIONS.stance);
  assert.equal(cssDuration('shiny'), DURATIONS.shiny);
  assert.equal(cssDuration('ability'), DURATIONS.ability);
  for (const stage of ['walk', 'recall', 'throw', 'release', 'mega-charge', 'mega-reveal', 'form-charge', 'form-reveal', 'form-revert', 'stance', 'shiny']) {
    assert.match(actorCss, new RegExp(`\\[data-stage='${stage}'\\]`), `${stage} is styled`);
  }
  for (const locomotion of Object.keys(SPEEDS)) {
    assert.match(actorCss, new RegExp(`\\[data-stage='walk'\\]\\[data-locomotion='${locomotion}'\\]`), `${locomotion} has a gait`);
  }
  assert.match(actorCss, /prefers-reduced-motion: reduce/);
});

test('Gen 5 touches: weight-based landings, ability banners and follow-up text', () => {
  // Fliers and floaters land silently; heavy Pokémon thud and tremble.
  assert.equal(landingFor(333, 'walk'), 'heavy');
  assert.equal(landingFor(95, 'run'), 'thud');
  assert.equal(landingFor(24.5, 'walk'), 'none');
  assert.equal(landingFor(216, 'fly'), 'none');
  assert.equal(landingFor(53, 'float'), 'none');
  for (const id of Object.keys(POKEDEX)) assert.ok(POKEDEX[id].weight > 0, `${id} has a weight`);
  assert.equal(resolveMember(TEAMS.portfolio, slotOf('portfolio', 'ursaluna-bloodmoon')).landing, 'heavy');
  assert.equal(resolveMember(TEAMS.portfolio, 0).landing, 'none', 'Lugia flies');
  assert.equal(resolveMember(TEAMS.zelda, slotOf('zelda', 'zacian'), 'form').landing, 'heavy', 'Crowned Zacian weighs 355 kg');

  assert.equal(POKEDEX.aegislash.form.ability, 'Stance Change');
  const zacian = resolveMember(TEAMS.zelda, slotOf('zelda', 'zacian'));
  assert.equal(zacian.entry.ability, 'Intrepid Sword');
  assert.equal(formText(zacian.entry.text[0], 'Zacian'), "Zacian's Attack rose!");

  // Every status move reports its result; damaging moves do not.
  for (const [name, move] of Object.entries(MOVES)) {
    if (move.category === 'status') assert.ok(move.after?.length, `${name} has follow-up text`);
    else assert.equal(move.after, undefined, `${name} is a damaging move`);
  }
  assert.deepEqual(MOVES['Dragon Dance'].after.map((line) => formText(line, 'Dragonite')), ["Dragonite's Attack rose!", "Dragonite's Speed rose!"]);
  assert.equal(formText(MOVES['Swords Dance'].after[0], 'Garchomp'), "Garchomp's Attack sharply rose!");

  // Forms with no animated Gen 5 sprite get a Gen 5-style body-part idle instead.
  assert.match(actorCss, /\.band\[data-band='head'\][^}]*animation-name: bandHead/);
  assert.match(actorCss, /\.band\[data-band='body'\][^}]*animation-name: bandBody/);
  assert.match(actorCss, /steps\(1, end\)/);
});
