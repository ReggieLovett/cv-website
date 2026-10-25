/* eslint-disable @typescript-eslint/no-require-imports -- Deterministic derivative of the bundled CC0 source frames. */
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const FRAME_WIDTH = 16;
const FRAME_HEIGHT = 28;
const COLUMNS = 8;
const ATLASES = { variants: ['zelda'] };
const SOURCE_COLORS = {
  outline: '#222222', hairShade: '#ee8e2e', hair: '#facb3e',
  skinShade: '#e2b694', skin: '#fccba3', eyes: '#5698cc',
  belt: '#314152', clothes: '#4ba747', boots: '#3d734f',
};
const PALETTES = {
  zelda: {
    outline: SOURCE_COLORS.outline, hairShade: SOURCE_COLORS.hairShade, hair: SOURCE_COLORS.hair,
    skinShade: SOURCE_COLORS.skinShade, skin: SOURCE_COLORS.skin, eyes: SOURCE_COLORS.eyes,
    belt: '#69513b', clothes: '#3f8eab', boots: '#67503c',
    trim: '#ded9bb', shade: '#2e657c', pants: '#baa67d', metal: '#a5b5b3',
  },
};
const sourceCache = new Map();

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a); const pb = Math.abs(p - b); const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

/** The original frame PNGs are non-interlaced, 8-bit RGBA. No image library is required. */
function readSourcePng(filename) {
  const buffer = fs.readFileSync(filename);
  if (!buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error('Not a PNG');
  let width; let height; const chunks = [];
  for (let offset = 8; offset < buffer.length;) {
    const size = buffer.readUInt32BE(offset);
    const name = buffer.toString('ascii', offset + 4, offset + 8);
    const chunk = buffer.subarray(offset + 8, offset + 8 + size);
    if (name === 'IHDR') {
      width = chunk.readUInt32BE(0); height = chunk.readUInt32BE(4);
      if (chunk[8] !== 8 || chunk[9] !== 6 || chunk[12] !== 0) throw new Error('Source must be 8-bit non-interlaced RGBA');
    }
    if (name === 'IDAT') chunks.push(chunk);
    offset += size + 12;
  }
  if (width !== FRAME_WIDTH || height !== FRAME_HEIGHT) throw new Error('Unexpected source frame geometry');
  const data = zlib.inflateSync(Buffer.concat(chunks));
  const stride = width * 4;
  const decoded = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const filter = data[y * (stride + 1)];
    if (filter > 4) throw new Error('Unsupported PNG filter');
    for (let x = 0; x < stride; x += 1) {
      const byte = data[y * (stride + 1) + 1 + x];
      const left = x >= 4 ? decoded[y * stride + x - 4] : 0;
      const up = y ? decoded[(y - 1) * stride + x] : 0;
      const upperLeft = y && x >= 4 ? decoded[(y - 1) * stride + x - 4] : 0;
      const prediction = [0, left, up, Math.floor((left + up) / 2), paeth(left, up, upperLeft)][filter];
      decoded[y * stride + x] = (byte + prediction) & 255;
    }
  }
  return Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => {
    const offset = (y * width + x) * 4;
    return decoded[offset + 3] ? `#${decoded.subarray(offset, offset + 3).toString('hex')}` : null;
  }));
}

function sourceFrame(pose) {
  if (!Number.isInteger(pose) || pose < 0 || pose >= COLUMNS) throw new Error('Unknown pose');
  if (!sourceCache.has(pose)) {
    const animation = pose < 4 ? 'idle' : 'run';
    const filename = `elf_m_${animation}_anim_f${pose % 4}.png`;
    const original = readSourcePng(path.resolve(__dirname, '../public/sprites', filename));
    let bottom = -1;
    for (let y = 0; y < FRAME_HEIGHT; y += 1) if (original[y].some(Boolean)) bottom = y;
    const dy = FRAME_HEIGHT - 1 - bottom;
    const pixels = Array.from({ length: FRAME_HEIGHT }, (_, y) => y >= dy ? [...original[y - dy]] : Array(FRAME_WIDTH).fill(null));
    const headTop = pixels.findIndex((row) => row.some(Boolean));
    const bodyTop = pixels.findIndex((row) => row.includes(SOURCE_COLORS.clothes));
    sourceCache.set(pose, { pixels, headTop, bodyTop, source: filename, dy });
  }
  const source = sourceCache.get(pose);
  return { ...source, pixels: source.pixels.map((row) => [...row]) };
}

function makeFrame(form, pose) {
  const p = PALETTES[form];
  if (!p) throw new Error('Unknown variant');
  const source = sourceFrame(pose);
  const { bodyTop: b } = source;
  const grid = Array.from({ length: FRAME_HEIGHT }, () => Array(FRAME_WIDTH).fill(null));
  const rect = (x, y, width, height, color) => {
    if (![x, y, width, height].every(Number.isInteger) || x < 0 || y < 0 || x + width > FRAME_WIDTH || y + height > FRAME_HEIGHT || !color) {
      throw new Error(`${form}: invalid native pixel rectangle`);
    }
    for (let py = y; py < y + height; py += 1) for (let px = x; px < x + width; px += 1) grid[py][px] = color;
  };
  const pixel = (x, y, color) => rect(x, y, 1, 1, color);
  const vertical = (x, y, width, bottom, color) => rect(x, y, width, bottom - y + 1, color);

  // The rear sword is behind the source pixels; the original face wins every overlap.
  vertical(1, b - 3, 2, 26, p.outline); vertical(2, b - 2, 1, 25, p.belt);
  rect(0, b - 3, 4, 1, p.belt); rect(1, b - 5, 1, 2, p.trim);

  const remap = Object.fromEntries(Object.entries(SOURCE_COLORS).map(([name, color]) => [color, p[name]]));
  for (let y = 0; y < FRAME_HEIGHT; y += 1) for (let x = 0; x < FRAME_WIDTH; x += 1) {
    const color = source.pixels[y][x];
    if (color) grid[y][x] = remap[color] || color;
  }

  // Blue Champion's Tunic and beige trousers; the original blond elf head is untouched.
  for (let y = Math.min(b + 3, 24); y <= 24; y += 1) for (let x = 3; x <= 12; x += 1) {
    if (source.pixels[y][x] === SOURCE_COLORS.clothes) grid[y][x] = p.pants;
  }
  pixel(7, b, p.trim); pixel(8, Math.min(b + 1, 24), p.trim); pixel(9, b, p.trim);
  return grid;
}

function frameRects(grid) {
  const result = [];
  for (let y = 0; y < FRAME_HEIGHT; y += 1) for (let x = 0; x < FRAME_WIDTH;) {
    const color = grid[y][x];
    if (!color) { x += 1; continue; }
    let width = 1;
    while (x + width < FRAME_WIDTH && grid[y][x + width] === color) width += 1;
    result.push(`<rect x="${x}" y="${y}" width="${width}" height="1" fill="${color}"/>`);
    x += width;
  }
  return result.join('');
}

function buildAtlas(name) {
  const forms = ATLASES[name];
  if (!forms) throw new Error('Unknown atlas');
  const width = FRAME_WIDTH * COLUMNS;
  const height = FRAME_HEIGHT * forms.length;
  const frames = forms.flatMap((form, row) => Array.from({ length: COLUMNS }, (_, pose) => {
    const label = `${pose < 4 ? 'idle' : 'run'}-${pose % 4}`;
    return `<g id="${form}-${label}" transform="translate(${pose * FRAME_WIDTH} ${row * FRAME_HEIGHT})">${frameRects(makeFrame(form, pose))}</g>`;
  }));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges"><title>Champion tunic elf companion</title><desc>One Zelda-inspired clothing variant of the original 0x72 CC0 elf, preserving its face and eight source poses. Four idle and four running frames.</desc>${frames.join('')}</svg>\n`;
}

function writeAtlases() {
  const output = path.resolve(__dirname, '../public/sprites/companion-variants.svg');
  fs.writeFileSync(output, buildAtlas('variants'));
  process.stdout.write('companion-variants.svg: 128 × 28, one Zelda row, four idle + four run poses\n');
}

if (require.main === module) writeAtlases();
module.exports = { ATLASES, COLUMNS, FRAME_HEIGHT, FRAME_WIDTH, SOURCE_COLORS, PALETTES, readSourcePng, sourceFrame, makeFrame, buildAtlas, writeAtlases };
