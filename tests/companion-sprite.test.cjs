/* eslint-disable @typescript-eslint/no-require-imports -- Exercise the pure TS sprite contract with the existing compiler. */
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
const { POWER_UP_SPRITES, getCompanionSpriteStyle } = require('../lib/companion-sprite.ts');
const { POWER_UPS } = require('../lib/companion-motion.ts');
const { FORM_MOBILITY, canCompanionHover } = require('../lib/companion-appearance.ts');
if (previousLoader) require.extensions['.ts'] = previousLoader;
else delete require.extensions['.ts'];

const classic = {
  '--sprite-image': 'url("/sprites/dungeon-tileset.png")',
  '--sprite-size': '1536px 1536px',
  '--sprite-y': '-300px',
  '--sprite-idle-x': '-384px',
  '--sprite-idle-end': '-576px',
  '--sprite-walk-x': '-576px',
  '--sprite-walk-end': '-768px',
};

function variant(row) {
  return {
    '--sprite-image': 'url("/sprites/companion-variants.svg")',
    '--sprite-size': '384px 84px',
    '--sprite-y': `${-84 * row}px`,
    '--sprite-idle-x': '0px',
    '--sprite-idle-end': '-192px',
    '--sprite-walk-x': '-192px',
    '--sprite-walk-end': '-384px',
  };
}

test('the normal companion restores the exact original knight frames and four-frame cadence', () => {
  assert.deepEqual(getCompanionSpriteStyle('portfolio', null), classic);
  const original = fs.readFileSync(path.join(__dirname, '../public/sprites/dungeon-tileset.png'));
  assert.equal(original.readUInt32BE(16), 512);
  assert.equal(original.readUInt32BE(20), 512);
  for (const pose of ['idle', 'run']) {
    for (let frame = 0; frame < 4; frame += 1) {
      const source = fs.readFileSync(path.join(__dirname, `../public/sprites/knight_m_${pose}_anim_f${frame}.png`));
      assert.equal(source.readUInt32BE(16), 16);
      assert.equal(source.readUInt32BE(20), 28);
    }
  }
});

test('Zelda has a separate hero while all other existing powers keep their original persona body', () => {
  assert.deepEqual(getCompanionSpriteStyle('zelda', null), variant(0));
  assert.equal(POWER_UPS.length, 12);
  for (const { action } of POWER_UPS) {
    if (Object.hasOwn(POWER_UP_SPRITES, action)) continue;
    assert.deepEqual(getCompanionSpriteStyle('portfolio', action), classic, action);
    assert.deepEqual(getCompanionSpriteStyle('zelda', action), variant(0), action);
  }
});

test('every power retains its persona body, including Deku and Devil Union', () => {
  assert.deepEqual(POWER_UP_SPRITES, {});
  for (const { action } of POWER_UPS) {
    assert.deepEqual(getCompanionSpriteStyle('portfolio', action), classic);
    assert.deepEqual(getCompanionSpriteStyle('zelda', action), variant(0));
  }
});

test('idle and run sequences stay within each atlas and reduced motion retains the selected first frame', () => {
  for (const persona of ['portfolio', 'zelda']) {
    for (const form of [null, ...POWER_UPS.map(({ action }) => action)]) {
      const style = getCompanionSpriteStyle(persona, form);
      const [width, height] = style['--sprite-size'].split(' ').map(Number.parseFloat);
      const top = -Number.parseFloat(style['--sprite-y']);
      assert.ok(top >= 0 && top + 84 <= height);
      for (const sequence of ['idle', 'walk']) {
        const start = -Number.parseFloat(style[`--sprite-${sequence}-x`]);
        const end = -Number.parseFloat(style[`--sprite-${sequence}-end`]);
        assert.equal(end - start, 48 * 4);
        for (let frame = 0; frame < 4; frame += 1) {
          assert.ok(start + frame * 48 >= 0 && start + (frame + 1) * 48 <= width);
        }
      }
    }
  }
  const css = fs.readFileSync(path.join(__dirname, '../components/portfolio-companion.module.css'), 'utf8');
  const reduced = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: reduce)'));
  // The strip rests on the idle sequence's first frame, and reduced motion stops its step there.
  assert.match(css, /\.spriteIdle \.frames \{\n  background-position: var\(--sprite-idle-x\) var\(--sprite-y\);/);
  assert.match(reduced, /\.companion\[data-persona\] \.frames \{ animation: none; \}/);
  assert.doesNotMatch(css, /\.companion :is\([^\n]*\.formCape[^\n]*display: none !important/);
  assert.doesNotMatch(css, /\.companion:not\(\[data-form='shadow-mode'\]\) \.formOrbs \{ display: none/);
});


test('flight belongs to airborne forms and Mana Zone while instant lightning propulsion stays grounded', () => {
  assert.deepEqual(Object.keys(FORM_MOBILITY).sort(), POWER_UPS.map(({ action }) => action).sort());
  assert.deepEqual(Object.keys(FORM_MOBILITY).filter((form) => canCompanionHover(form)).sort(), [
    'chakra-mode', 'deku-overdrive', 'devil-union', 'fire-mode', 'hyper-sonic', 'spirit-dive', 'water-mode',
  ]);
  assert.equal(canCompanionHover(null), false);
  for (const form of ['sage-mode', 'baryon-mode', 'six-paths-eyes', 'lightning-dash']) assert.equal(canCompanionHover(form), false);
});

test('form light animates only transform and opacity, pauses with the companion, and stills under reduced motion', () => {
  const css = fs.readFileSync(path.join(__dirname, '../components/companion-form-aura.module.css'), 'utf8')
    + fs.readFileSync(path.join(__dirname, '../components/companion-water-armor.module.css'), 'utf8');
  const keyframes = [...css.matchAll(/@keyframes (\w+) \{/g)].map((match) => {
    let depth = 1;
    let end = match.index + match[0].length;
    for (; depth > 0; end += 1) depth += css[end] === '{' ? 1 : css[end] === '}' ? -1 : 0;
    return [match[1], css.slice(match.index + match[0].length, end - 1).replace(/[^{]*\{/g, '')];
  });
  assert.ok(keyframes.length >= 10);
  for (const [name, body] of keyframes) {
    const properties = [...body.matchAll(/([a-z-]+):/g)].map(([, property]) => property);
    assert.ok(properties.length > 0, name);
    for (const property of properties) assert.ok(['transform', 'opacity'].includes(property), `${name} animates ${property}`);
  }
  assert.match(css, /:global\(:is\(\[data-motion='paused'\], \[data-paused='true'\], \[data-open='true'\]\)\) :is\(\.back, \.front\) \* \{ animation-play-state: paused; \}/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\n  \.back, \.back \*, \.front \* \{ animation: none !important; \}/);
  const companion = fs.readFileSync(path.join(__dirname, '../components/portfolio-companion.module.css'), 'utf8');
  const reduced = companion.slice(companion.lastIndexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(reduced, /\.companion\[data-persona\] \.frames \{ animation: none; \}/);
});
