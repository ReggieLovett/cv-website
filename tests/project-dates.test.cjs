/* eslint-disable @typescript-eslint/no-require-imports -- Load the pure TS date formatter with the existing compiler. */
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
const { formatBuilt } = require('../lib/project-dates.ts');
if (previousLoader) require.extensions['.ts'] = previousLoader;
else delete require.extensions['.ts'];

test('a day range in one year names the year once and counts weeks', () => {
  assert.deepEqual(formatBuilt({ from: '2026-10-27', to: '2026-11-16' }), {
    range: '27 Oct – 16 Nov 2026',
    length: '3 weeks',
    start: '2026-10-27',
    end: '2026-11-16',
  });
  assert.equal(formatBuilt({ from: '2026-09-10', to: '2026-10-26' }).length, '7 weeks');
});

test('a range across a new year names both years', () => {
  const built = formatBuilt({ from: '2025-12-20', to: '2026-01-05' });
  assert.equal(built.range, '20 Dec 2025 – 5 Jan 2026');
  assert.equal(built.length, '2 weeks');
});

test('short builds count days, inclusive of both ends', () => {
  assert.equal(formatBuilt({ from: '2026-05-01', to: '2026-05-01' }).length, '1 day');
  assert.equal(formatBuilt({ from: '2026-05-01', to: '2026-05-10' }).length, '10 days');
});

test('a month range counts months, inclusive of both ends', () => {
  const built = formatBuilt({ from: '2026-03', to: '2026-05' });
  assert.equal(built.range, 'Mar – May 2026');
  assert.equal(built.length, '3 months');
});

test('a label stands in for a rough date and keeps the machine-readable start', () => {
  assert.deepEqual(formatBuilt({ from: '2026-06', label: 'Mid 2026' }), {
    range: 'Mid 2026',
    length: null,
    start: '2026-06',
    end: null,
  });
});

test('an open start with no end shows just that date', () => {
  assert.equal(formatBuilt({ from: '2024' }).range, '2024');
  assert.equal(formatBuilt({ from: '2026-03' }).range, 'Mar 2026');
  assert.equal(formatBuilt({ from: '2026-03' }).length, null);
});
