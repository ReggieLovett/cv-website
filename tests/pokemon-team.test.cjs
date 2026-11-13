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
  MOVES, MOVE_KINDS, POKEDEX, TEAMS, TYPE_COLORS, DURATIONS,
  resolveMember, teamSprites, spriteUrl, battleText,
  nextAutoDelay, pickAutoAction, pickMove, pickNextSlot, planWander, wanderMinX,
} = require('../lib/pokemon-team.ts');
if (previousLoader) require.extensions['.ts'] = previousLoader;
else delete require.extensions['.ts'];

const spriteRoot = path.join(__dirname, '../public/sprites/pokemon');
const actorCss = fs.readFileSync(path.join(__dirname, '../components/pokemon-actor.module.css'), 'utf8');
/** A deterministic stand-in for Math.random. */
function sequence(...values) {
  let index = 0;
  return () => values[index++ % values.length];
}
const randoms = [0, 0.13, 0.27, 0.5, 0.74, 0.9, 0.999999];

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
      for (const name of entry.moves) {
        const move = MOVES[name];
        assert.ok(move, `${species}: unknown move ${name}`);
        assert.ok(TYPE_COLORS[move.type], `${name}: unknown type ${move.type}`);
        assert.ok(MOVE_KINDS.includes(move.kind), `${name}: unknown kind ${move.kind}`);
      }
      for (const type of entry.types) assert.ok(TYPE_COLORS[type], `${species}: unknown type ${type}`);
      if (entry.mega) {
        const mega = POKEDEX[entry.mega];
        assert.ok(mega, `${species}: missing Mega entry ${entry.mega}`);
        assert.match(mega.name, /^Mega /);
        assert.equal(mega.moves, undefined, 'Mega forms keep their base moves');
      }
    }
  }
});

test('every move and species in the data is used by a team', () => {
  const used = new Set();
  const species = new Set();
  for (const team of Object.values(TEAMS)) {
    for (const slot of team) {
      species.add(slot.species);
      if (POKEDEX[slot.species].mega) species.add(POKEDEX[slot.species].mega);
      for (const move of POKEDEX[slot.species].moves) used.add(move);
    }
  }
  assert.deepEqual([...species].sort(), Object.keys(POKEDEX).sort());
  assert.deepEqual([...used].sort(), Object.keys(MOVES).sort());
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
  assert.equal(garchomp.mega, false);

  const mega = resolveMember(TEAMS.portfolio, 3, true);
  assert.equal(mega.name, 'Mega Garchomp');
  assert.equal(mega.baseName, 'Garchomp');
  assert.equal(mega.sprite, '/sprites/pokemon/gen5ani/garchomp-mega.gif');
  assert.equal(mega.canMega, false);
  assert.equal(mega.mega, true);
  assert.deepEqual(mega.moves.map(({ name }) => name), garchomp.moves.map(({ name }) => name));

  const lugia = resolveMember(TEAMS.portfolio, 0);
  assert.equal(lugia.shiny, true);
  assert.equal(lugia.sprite, '/sprites/pokemon/gen5ani-shiny/lugia.gif');
  assert.equal(lugia.still, '/sprites/pokemon/gen5-shiny/lugia.png');

  // No animated Gen 5 sprite exists for these: the still is used, never a fake.
  const decidueye = resolveMember(TEAMS.portfolio, 5);
  assert.equal(decidueye.animated, false);
  assert.equal(decidueye.sprite, decidueye.still);
  const megaDragonite = resolveMember(TEAMS.portfolio, 4, true);
  assert.equal(megaDragonite.animated, false);
  assert.equal(megaDragonite.sprite, '/sprites/pokemon/gen5/dragonite-mega.png');

  // A species without a Mega ignores the request.
  assert.equal(resolveMember(TEAMS.portfolio, 1, true).mega, false);
  // Out-of-range slots clamp instead of throwing.
  assert.equal(resolveMember(TEAMS.portfolio, 99).slot, 5);
  assert.equal(resolveMember(TEAMS.portfolio, -3).slot, 0);
  assert.equal(spriteUrl('garchomp', true), '/sprites/pokemon/gen5ani-shiny/garchomp.gif');
});

test('automatic actions vary, and Mega Evolution only happens when it can', () => {
  for (const value of randoms) {
    const random = () => value;
    assert.notEqual(pickAutoAction({ canMega: false, teamSize: 6 }, null, random), 'mega');
    assert.notEqual(pickAutoAction({ canMega: true, teamSize: 6 }, 'walk', random), 'walk');
    assert.notEqual(pickAutoAction({ canMega: true, teamSize: 6 }, 'switch', random), 'switch');
    assert.notEqual(pickAutoAction({ canMega: false, teamSize: 1 }, null, random), 'switch');
    const delay = nextAutoDelay(random);
    assert.ok(delay >= 6_000 && delay <= 12_000, `delay ${delay}`);
  }
  const seen = new Set(randoms.map((value) => pickAutoAction({ canMega: true, teamSize: 6 }, null, () => value)));
  assert.deepEqual([...seen].sort(), ['attack', 'mega', 'switch', 'walk']);
  assert.equal(pickAutoAction({ canMega: true, teamSize: 6 }, null, () => Number.NaN), 'walk');
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
  const reached = new Set(randoms.map((value) => pickNextSlot(6, 2, () => value)));
  assert.ok(reached.size >= 4);
});

test('wandering stays on the bottom edge, inside the viewport', () => {
  const actor = 136;
  for (const width of [320, 390, 768, 1280, 1920]) {
    const minX = wanderMinX(width, actor);
    const inset = width <= 600 ? 12 : 18;
    assert.equal(width - inset - actor + minX, 16, `${width}px keeps a 16px margin`);
    let x = 0;
    for (const value of [...randoms, ...randoms]) {
      const plan = planWander(x, width, actor, sequence(value));
      assert.ok(plan.x <= 0 && plan.x >= minX, `${width}: ${plan.x}`);
      assert.ok(plan.duration >= 400 && plan.duration <= 6_000);
      assert.equal(plan.direction, plan.x > x ? 'right' : 'left');
      if (minX < -24) assert.notEqual(plan.x, x, 'a walk goes somewhere');
      x = plan.x;
    }
  }
  // Too narrow to move: stay home.
  assert.equal(planWander(0, 150, actor).x, 0);
  assert.equal(planWander(Number.NaN, 1280, actor, () => 0.5).x <= 0, true);
});

test('battle text reads like the games', () => {
  assert.equal(battleText.used('Garchomp', 'Earthquake'), 'Garchomp used Earthquake!');
  assert.equal(battleText.recall('Lugia'), 'Lugia, come back!');
  assert.equal(battleText.go('Dragonite'), 'Go! Dragonite!');
  assert.equal(battleText.megaReacting('Garchomp'), "Garchomp is reacting to Reggie's Key Stone!");
  assert.equal(battleText.megaEvolved('Garchomp', 'Mega Garchomp'), 'Garchomp has Mega Evolved into Mega Garchomp!');
});

test('the stylesheet draws every move kind and keeps the hook’s timings', () => {
  for (const kind of MOVE_KINDS) {
    assert.match(actorCss, new RegExp(`\\[data-move='${kind}'\\] \\.sprite`), `${kind} has a sprite motion`);
    assert.match(actorCss, new RegExp(`\\[data-move='${kind}'\\] \\.effects`), `${kind} has an effect`);
  }
  const cssDuration = (name) => Number(new RegExp(`--${name}-ms:\\s*(\\d+)ms`).exec(actorCss)?.[1]);
  assert.equal(cssDuration('attack'), DURATIONS.attack);
  assert.equal(cssDuration('boost'), DURATIONS.boost);
  assert.equal(cssDuration('recall'), DURATIONS.recall);
  assert.equal(cssDuration('throw'), DURATIONS.throw);
  assert.equal(cssDuration('release'), DURATIONS.release);
  assert.equal(cssDuration('mega-charge'), DURATIONS.megaCharge);
  assert.equal(cssDuration('mega-reveal'), DURATIONS.megaReveal);
  for (const stage of ['walk', 'recall', 'throw', 'release', 'mega-charge', 'mega-reveal']) {
    assert.match(actorCss, new RegExp(`\\[data-stage='${stage}'\\]`), `${stage} is styled`);
  }
  assert.match(actorCss, /prefers-reduced-motion: reduce/);
});
