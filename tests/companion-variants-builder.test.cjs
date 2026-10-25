/* eslint-disable @typescript-eslint/no-require-imports -- Test the dependency-free SVG asset builder directly. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {
  ATLASES, COLUMNS, FRAME_WIDTH, FRAME_HEIGHT,
  SOURCE_COLORS, PALETTES, readSourcePng, sourceFrame, makeFrame, buildAtlas,
} = require('../scripts/build-companion-sprites.cjs');

const forms = ['zelda'];

test('the source decoder reads the bundled original elf pixel geometry and palette', () => {
  const grid = readSourcePng(path.join(__dirname, '../public/sprites/elf_m_idle_anim_f0.png'));
  assert.equal(grid.length, 28);
  assert.ok(grid.every((row) => row.length === 16));
  assert.equal(grid.flat().filter(Boolean).length, 200);
  assert.deepEqual([...new Set(grid.flat().filter(Boolean))].sort(), Object.values(SOURCE_COLORS).sort());
  assert.ok(grid.slice(0, 9).flat().every((pixel) => pixel === null));
  assert.ok(grid[27].some(Boolean));
});

test('the single Zelda row preserves four original idle and four original run poses', () => {
  assert.equal(FRAME_WIDTH, 16);
  assert.equal(FRAME_HEIGHT, 28);
  assert.equal(COLUMNS, 8);
  assert.deepEqual(ATLASES, { variants: forms });
  for (let pose = 0; pose < 8; pose += 1) {
    const source = sourceFrame(pose);
    assert.equal(source.source, `elf_m_${pose < 4 ? 'idle' : 'run'}_anim_f${pose % 4}.png`);
    assert.ok(source.dy >= 0 && source.dy <= 2);
    assert.ok(source.pixels[27].some(Boolean), `Source pose ${pose} lost its normalized foot baseline`);
    assert.ok(source.headTop >= 9 && source.bodyTop >= 20);
  }
  for (const form of forms) {
    const poses = Array.from({ length: 8 }, (_, pose) => makeFrame(form, pose));
    assert.equal(new Set(poses.slice(0, 4).map((grid) => JSON.stringify(grid))).size, 4, `${form} dropped original idle cadence`);
    assert.equal(new Set(poses.slice(4).map((grid) => JSON.stringify(grid))).size, 4, `${form} dropped original run cadence`);
    for (const grid of poses) {
      assert.equal(grid.length, 28);
      assert.ok(grid.every((row) => row.length === 16));
      assert.ok(grid[27].some(Boolean), `${form} feet leave the common baseline`);
      assert.ok(new Set(grid.flat().filter(Boolean)).size <= 16, `${form} exceeds the original palette scale`);
    }
  }
});

test('the Zelda costume leaves the original elf skin, blond hair, eyes, and profile untouched', () => {
  for (const form of forms) {
    const palette = PALETTES[form];
    for (let pose = 0; pose < 8; pose += 1) {
      const source = sourceFrame(pose);
      const grid = makeFrame(form, pose);
      const faceColors = [SOURCE_COLORS.skin, SOURCE_COLORS.skinShade, SOURCE_COLORS.eyes, SOURCE_COLORS.hair, SOURCE_COLORS.hairShade];
      for (let y = 0; y < source.bodyTop; y += 1) {
        for (let x = 0; x < 16; x += 1) {
          const color = source.pixels[y][x];
          if (faceColors.includes(color)) assert.equal(grid[y][x], color, `${form} changed an original face/hair pixel in pose ${pose}`);
          if (x >= 4) assert.equal(Boolean(grid[y][x]), Boolean(color), `${form} changed the face profile in pose ${pose}`);
        }
      }
      assert.equal(palette.skin, SOURCE_COLORS.skin);
      assert.equal(palette.skinShade, SOURCE_COLORS.skinShade);
      assert.equal(palette.eyes, SOURCE_COLORS.eyes);
      assert.ok(grid.flat().includes(palette.clothes), `Zelda pose ${pose} lost the blue tunic`);
    }
  }
});

test('power forms have no alternate body rows in the Zelda-only builder', () => {
  assert.deepEqual(Object.keys(PALETTES), ['zelda']);
  for (const form of ['deku-overdrive', 'zetten-mode', 'devil-union']) {
    assert.throws(() => makeFrame(form, 0), /Unknown variant/);
  }
});

test('the shipped SVG is deterministic and contains only bounded native pixel rectangles', () => {
  const source = fs.readFileSync(path.join(__dirname, '../public/sprites/companion-variants.svg'), 'utf8');
  assert.equal(source, buildAtlas('variants'));
  assert.match(source, /width="128" height="28" viewBox="0 0 128 28" shape-rendering="crispEdges"/);
  assert.doesNotMatch(source, /<(?:image|foreignObject|script|filter)\b|(?:href|src)=|data:|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i);
  const groups = [...source.matchAll(/<g id="([^"]+)" transform="translate\((\d+) (\d+)\)">([\s\S]*?)<\/g>/g)];
  assert.equal(groups.length, 8);
  for (const [, label, x, y, contents] of groups) {
    assert.ok(Number(x) % 16 === 0 && Number(x) + 16 <= 128, `${label} leaves its column`);
    assert.equal(Number(y), 0, `${label} leaves the only Zelda row`);
    const rectangles = [...contents.matchAll(/<rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)" fill="(#[0-9a-f]{6})"\/>/g)];
    assert.ok(rectangles.length > 0);
    for (const [, px, py, width, height] of rectangles) {
      assert.ok(Number(px) + Number(width) <= 16);
      assert.ok(Number(py) + Number(height) <= 28);
      assert.equal(Number(height), 1);
    }
  }
});
