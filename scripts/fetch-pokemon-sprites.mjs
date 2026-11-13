#!/usr/bin/env node
/**
 * Downloads the Gen 5 (Black/White style) Pokémon sprites the chat companion
 * needs into public/sprites/pokemon/, mirroring Pokémon Showdown's sprite
 * directories. Existing files are kept, so after changing a team in
 * lib/pokemon-team.ts this fetches only the new Pokémon.
 *
 *   npm run sprites:pokemon            fetch missing sprites
 *   npm run sprites:pokemon -- --check list what is missing, download nothing
 *
 * Sources: play.pokemonshowdown.com/sprites, and the PokeAPI sprites repo for
 * any still sprite whose POKEDEX entry names a `pokeapi` id.
 * Requires Node 22.18+ (type stripping) to read lib/pokemon-team.ts.
 */
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { teamSprites } from '../lib/pokemon-team.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/sprites/pokemon');
const checkOnly = process.argv.includes('--check');
const HOSTS = new Set(['play.pokemonshowdown.com', 'raw.githubusercontent.com']);
const SIGNATURES = { '.gif': 'GIF8', '.png': '\x89PNG' };

async function exists(file) {
  try {
    return (await stat(file)).size > 0;
  } catch {
    return false;
  }
}

const missing = [];
for (const sprite of teamSprites()) {
  if (!/^[a-z0-9-]+\/[a-z0-9-]+\.(gif|png)$/.test(sprite.file)) throw new Error(`Unexpected sprite path: ${sprite.file}`);
  if (!HOSTS.has(new URL(sprite.url).hostname)) throw new Error(`Unexpected sprite source: ${sprite.url}`);
  if (!(await exists(path.join(root, sprite.file)))) missing.push(sprite);
}

if (!missing.length) {
  console.log('All Pokémon sprites are present.');
  process.exit(0);
}
if (checkOnly) {
  console.log(`Missing ${missing.length} sprite(s):\n${missing.map(({ file, url }) => `  ${file}  ← ${url}`).join('\n')}`);
  process.exit(1);
}

let failed = 0;
for (const { file, url } of missing) {
  const response = await fetch(url, { headers: { 'User-Agent': 'portfolio-sprite-fetch' } });
  const body = Buffer.from(await response.arrayBuffer());
  const signature = SIGNATURES[path.extname(file)];
  if (!response.ok || body.subarray(0, signature.length).toString('latin1') !== signature) {
    console.error(`✗ ${file} (${response.status}) — not found at ${url}`);
    failed += 1;
    continue;
  }
  await mkdir(path.dirname(path.join(root, file)), { recursive: true });
  await writeFile(path.join(root, file), body);
  console.log(`✓ ${file} (${(body.length / 1024).toFixed(1)} KB)`);
}
process.exit(failed ? 1 : 0);
