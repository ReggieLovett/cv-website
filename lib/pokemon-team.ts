import type { ChatPersona } from './chat-persona';

/**
 * The chat companion's Pokémon teams.
 *
 * Fan tribute: Pokémon and its sprites belong to Nintendo, Creatures and GAME
 * FREAK / The Pokémon Company. The Gen 5 (Black/White style) sprites are
 * served from public/sprites/pokemon/, downloaded from Pokémon Showdown by
 * `npm run sprites:pokemon` (scripts/fetch-pokemon-sprites.mjs).
 *
 * To swap a team member, change its line in TEAMS. A species that is not in
 * the POKEDEX yet needs one line there too, plus its four moves in MOVES if
 * they are new. Then run `npm run sprites:pokemon` to fetch its sprites.
 *
 * Pure data and helpers only, so tests and the fetch script can load it.
 */

export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'grass' | 'electric' | 'ice' | 'fighting' | 'poison' | 'ground'
  | 'flying' | 'psychic' | 'bug' | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

/** How a move is drawn. Each kind is one effect in components/pokemon-effects.module.css. */
export type MoveKind = 'beam' | 'wave' | 'orb' | 'arrow' | 'slash' | 'claw' | 'dash' | 'quake' | 'burst' | 'boost';

export type Move = { type: PokemonType; kind: MoveKind };

export const MOVE_KINDS: readonly MoveKind[] = ['beam', 'wave', 'orb', 'arrow', 'slash', 'claw', 'dash', 'quake', 'burst', 'boost'];

/** Every move a team member knows: its real type, and the effect that draws it. */
export const MOVES = {
  'Aeroblast': { type: 'flying', kind: 'beam' },
  'Psychic': { type: 'psychic', kind: 'wave' },
  'Hydro Pump': { type: 'water', kind: 'beam' },
  'Calm Mind': { type: 'psychic', kind: 'boost' },
  'Ceaseless Edge': { type: 'dark', kind: 'slash' },
  'Razor Shell': { type: 'water', kind: 'slash' },
  'Aqua Jet': { type: 'water', kind: 'dash' },
  'Swords Dance': { type: 'normal', kind: 'boost' },
  'Blood Moon': { type: 'normal', kind: 'beam' },
  'Earth Power': { type: 'ground', kind: 'quake' },
  'Hyper Voice': { type: 'normal', kind: 'wave' },
  'Moonlight': { type: 'fairy', kind: 'boost' },
  'Dragon Claw': { type: 'dragon', kind: 'claw' },
  'Earthquake': { type: 'ground', kind: 'quake' },
  'Fire Fang': { type: 'fire', kind: 'claw' },
  'Extreme Speed': { type: 'normal', kind: 'dash' },
  'Hurricane': { type: 'flying', kind: 'wave' },
  'Fire Punch': { type: 'fire', kind: 'burst' },
  'Dragon Dance': { type: 'dragon', kind: 'boost' },
  'Spirit Shackle': { type: 'ghost', kind: 'arrow' },
  'Leaf Blade': { type: 'grass', kind: 'slash' },
  'Brave Bird': { type: 'flying', kind: 'dash' },
  'Shadow Sneak': { type: 'ghost', kind: 'dash' },
  'Sacred Sword': { type: 'fighting', kind: 'slash' },
  "King's Shield": { type: 'steel', kind: 'boost' },
  'Shadow Ball': { type: 'ghost', kind: 'orb' },
  'Water Shuriken': { type: 'water', kind: 'arrow' },
  'Dark Pulse': { type: 'dark', kind: 'wave' },
  'Night Slash': { type: 'dark', kind: 'slash' },
  'Double Team': { type: 'normal', kind: 'boost' },
  'Dazzling Gleam': { type: 'fairy', kind: 'burst' },
  'Draining Kiss': { type: 'fairy', kind: 'orb' },
  'Wood Hammer': { type: 'grass', kind: 'burst' },
  'Horn Leech': { type: 'grass', kind: 'claw' },
  'Phantom Force': { type: 'ghost', kind: 'dash' },
  "Forest's Curse": { type: 'grass', kind: 'boost' },
  'Flare Blitz': { type: 'fire', kind: 'dash' },
  'Acrobatics': { type: 'flying', kind: 'slash' },
  'Roost': { type: 'flying', kind: 'boost' },
  'Play Rough': { type: 'fairy', kind: 'burst' },
  'Iron Head': { type: 'steel', kind: 'dash' },
} satisfies Record<string, Move>;

export type MoveName = keyof typeof MOVES;

export type Species = {
  name: string;
  types: PokemonType[];
  /** Four moves. Mega forms keep their base form's moves. */
  moves?: MoveName[];
  /** The POKEDEX key of this species' Mega Evolution. */
  mega?: string;
  /** No Gen 5 animated sprite exists, so the static Gen 5 sprite is used with a CSS idle bob. */
  still?: boolean;
  /**
   * Fetch the still sprite from the PokeAPI sprites repo's Black/White set
   * (this PokeAPI id) where Showdown's still is a blurry render, not pixel art.
   */
  pokeapi?: number;
};

/**
 * Keys are Pokémon Showdown sprite ids, which name the sprite files. Every
 * animated sprite is a Gen 5 "gen5ani" GIF. Decidueye (Gen 7), Mega Dragonite
 * and Mega Greninja (Legends: Z-A) have no animated Gen 5 sprite, only a still
 * one. Every move is in that species' learnset.
 */
export const POKEDEX = {
  'lugia': { name: 'Lugia', types: ['psychic', 'flying'], moves: ['Aeroblast', 'Psychic', 'Hydro Pump', 'Calm Mind'] },
  'samurott-hisui': { name: 'Hisuian Samurott', types: ['water', 'dark'], moves: ['Ceaseless Edge', 'Razor Shell', 'Aqua Jet', 'Swords Dance'] },
  'ursaluna-bloodmoon': { name: 'Bloodmoon Ursaluna', types: ['ground', 'normal'], moves: ['Blood Moon', 'Earth Power', 'Hyper Voice', 'Moonlight'] },
  'garchomp': { name: 'Garchomp', types: ['dragon', 'ground'], moves: ['Dragon Claw', 'Earthquake', 'Fire Fang', 'Swords Dance'], mega: 'garchomp-mega' },
  'garchomp-mega': { name: 'Mega Garchomp', types: ['dragon', 'ground'] },
  'dragonite': { name: 'Dragonite', types: ['dragon', 'flying'], moves: ['Extreme Speed', 'Hurricane', 'Fire Punch', 'Dragon Dance'], mega: 'dragonite-mega' },
  'dragonite-mega': { name: 'Mega Dragonite', types: ['dragon', 'flying'], still: true },
  'decidueye': { name: 'Decidueye', types: ['grass', 'ghost'], moves: ['Spirit Shackle', 'Leaf Blade', 'Brave Bird', 'Shadow Sneak'], still: true },
  'aegislash': { name: 'Aegislash', types: ['steel', 'ghost'], moves: ['Sacred Sword', 'Shadow Ball', 'Shadow Sneak', "King's Shield"] },
  'greninja': { name: 'Greninja', types: ['water', 'dark'], moves: ['Water Shuriken', 'Dark Pulse', 'Night Slash', 'Double Team'], mega: 'greninja-mega' },
  'greninja-mega': { name: 'Mega Greninja', types: ['water', 'dark'], still: true, pokeapi: 10294 },
  'hatterene': { name: 'Hatterene', types: ['psychic', 'fairy'], moves: ['Psychic', 'Dazzling Gleam', 'Draining Kiss', 'Calm Mind'] },
  'trevenant': { name: 'Trevenant', types: ['ghost', 'grass'], moves: ['Wood Hammer', 'Horn Leech', 'Phantom Force', "Forest's Curse"] },
  'talonflame': { name: 'Talonflame', types: ['fire', 'flying'], moves: ['Brave Bird', 'Flare Blitz', 'Acrobatics', 'Roost'] },
  'zacian': { name: 'Zacian', types: ['fairy'], moves: ['Play Rough', 'Sacred Sword', 'Iron Head', 'Swords Dance'] },
} satisfies Record<string, Species>;

export type SpeciesId = keyof typeof POKEDEX;
export type TeamSlot = { species: SpeciesId; shiny?: boolean };

/**
 * Six per persona, lead first. The Zelda team is a placeholder until its real
 * line-up is chosen: Gen 6–9 Pokémon with Gen 5-style animated sprites, cast
 * as Link's sword and shield, Sheik, Zelda's magic, the Great Deku Tree, a
 * Loftwing and the Hero.
 */
export const TEAMS: Record<ChatPersona, TeamSlot[]> = {
  portfolio: [
    { species: 'lugia', shiny: true },
    { species: 'samurott-hisui' },
    { species: 'ursaluna-bloodmoon' },
    { species: 'garchomp' },
    { species: 'dragonite' },
    { species: 'decidueye' },
  ],
  zelda: [
    { species: 'aegislash' },
    { species: 'greninja' },
    { species: 'hatterene' },
    { species: 'trevenant' },
    { species: 'talonflame' },
    { species: 'zacian' },
  ],
};

/** The trainer named in Mega Evolution text. */
export const TRAINER = 'Reggie';

/** Standard type colours as space-separated RGB, for `rgb(var(--type) / a)`. */
export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: '168 167 122', fire: '238 129 48', water: '99 144 240', grass: '122 199 76',
  electric: '247 208 44', ice: '150 217 214', fighting: '194 46 40', poison: '163 62 161',
  ground: '226 191 101', flying: '169 143 243', psychic: '249 85 135', bug: '166 185 26',
  rock: '182 161 54', ghost: '115 87 151', dragon: '111 53 252', dark: '112 87 70',
  steel: '183 183 206', fairy: '214 133 173',
};

export type ResolvedMove = Move & { name: MoveName };

/** One team member with its data resolved, in base or Mega form. */
export type ActivePokemon = {
  slot: number;
  species: SpeciesId;
  name: string;
  baseName: string;
  types: PokemonType[];
  shiny: boolean;
  mega: boolean;
  canMega: boolean;
  moves: ResolvedMove[];
  /** The animated GIF, or the still sprite where no animation exists. */
  sprite: string;
  /** Always a still sprite: party icons, paused and reduced-motion views. */
  still: string;
  animated: boolean;
};

const SPRITE_ROOT = '/sprites/pokemon';

function speciesData(id: SpeciesId): Species {
  return POKEDEX[id];
}

/** Paths below SPRITE_ROOT, mirroring Showdown's /sprites/ directories. */
export function spriteFile(id: SpeciesId, shiny = false, animated = !speciesData(id).still): string {
  return animated ? `gen5ani${shiny ? '-shiny' : ''}/${id}.gif` : `gen5${shiny ? '-shiny' : ''}/${id}.png`;
}

export function spriteUrl(id: SpeciesId, shiny = false, animated = !speciesData(id).still): string {
  return `${SPRITE_ROOT}/${spriteFile(id, shiny, animated)}`;
}

const SHOWDOWN = 'https://play.pokemonshowdown.com/sprites/';
const POKEAPI_BW = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/';

/**
 * Every sprite file the teams need, with where to download it: animated where
 * one exists, plus a still for each form.
 */
export function teamSprites(teams: Record<string, TeamSlot[]> = TEAMS): { file: string; url: string }[] {
  const sprites = new Map<string, string>();
  for (const team of Object.values(teams)) {
    for (const { species, shiny = false } of team) {
      const forms: SpeciesId[] = [species];
      const mega = speciesData(species).mega;
      if (mega) forms.push(mega as SpeciesId);
      for (const form of forms) {
        const { still, pokeapi } = speciesData(form);
        if (!still) sprites.set(spriteFile(form, shiny, true), `${SHOWDOWN}${spriteFile(form, shiny, true)}`);
        const file = spriteFile(form, shiny, false);
        sprites.set(file, pokeapi ? `${POKEAPI_BW}${shiny ? 'shiny/' : ''}${pokeapi}.png` : `${SHOWDOWN}${file}`);
      }
    }
  }
  return Array.from(sprites, ([file, url]) => ({ file, url })).sort((a, b) => a.file.localeCompare(b.file));
}

export function resolveMember(team: TeamSlot[], slot: number, mega = false): ActivePokemon {
  const index = Math.max(0, Math.min(team.length - 1, Math.trunc(slot) || 0));
  const { species, shiny = false } = team[index];
  const base = speciesData(species);
  const megaId = base.mega as SpeciesId | undefined;
  const formId = mega && megaId ? megaId : species;
  const form = speciesData(formId);
  const animated = !form.still;
  return {
    slot: index,
    species: formId,
    name: form.name,
    baseName: base.name,
    types: form.types,
    shiny,
    mega: formId !== species,
    canMega: Boolean(megaId) && formId === species,
    moves: (base.moves ?? []).map((name) => ({ name, ...MOVES[name] })),
    sprite: spriteUrl(formId, shiny, animated),
    still: spriteUrl(formId, shiny, false),
    animated,
  };
}

/* ------------------------------------------------------------ behaviour */

export type AutoAction = 'attack' | 'walk' | 'switch' | 'mega';

/** Milliseconds for each staged performance, shared by the hook and the stylesheet. */
export const DURATIONS = {
  attack: 1200,
  boost: 1000,
  recall: 480,
  throw: 620,
  release: 520,
  megaCharge: 1500,
  megaReveal: 700,
  text: 1700,
} as const;

function unit(random: () => number): number {
  const value = random();
  return Number.isFinite(value) ? Math.max(0, Math.min(0.999_999, value)) : 0.5;
}

/** The rest between automatic actions: 6–12 seconds. */
export function nextAutoDelay(random: () => number = Math.random): number {
  return Math.round(6_000 + unit(random) * 6_000);
}

/**
 * Attacks are the common case; walks, switches and Mega Evolution are rarer.
 * Never the same non-attack action twice in a row, and Mega only when possible.
 */
export function pickAutoAction(
  { canMega, teamSize }: { canMega: boolean; teamSize: number },
  previous: AutoAction | null,
  random: () => number = Math.random,
): AutoAction {
  const weights: [AutoAction, number][] = [
    ['attack', 5],
    ['walk', previous === 'walk' ? 0 : 2],
    ['switch', previous === 'switch' || teamSize < 2 ? 0 : 2],
    ['mega', canMega ? 2 : 0],
  ];
  const total = weights.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = unit(random) * total;
  for (const [action, weight] of weights) {
    if (roll < weight) return action;
    roll -= weight;
  }
  return 'attack';
}

/** A move other than the previous one, when there is a choice. */
export function pickMove<T extends { name: string }>(moves: T[], previous: string | null, random: () => number = Math.random): T | null {
  if (!moves.length) return null;
  const pool = moves.length > 1 ? moves.filter((move) => move.name !== previous) : moves;
  return pool[Math.floor(unit(random) * pool.length)];
}

/** A different team slot, chosen at random. */
export function pickNextSlot(teamSize: number, current: number, random: () => number = Math.random): number {
  if (teamSize < 2) return 0;
  const offset = 1 + Math.floor(unit(random) * (teamSize - 1));
  return (current + offset) % teamSize;
}

const EDGE = 16;

/**
 * The furthest left the actor may wander: `x` is its offset from the home
 * spot at the bottom right (inset 18px, or 12px on narrow screens), so every
 * position is between this and zero.
 */
export function wanderMinX(viewportWidth: number, actorWidth: number): number {
  const width = Number.isFinite(viewportWidth) ? Math.max(0, viewportWidth) : 0;
  const inset = width <= 600 ? 12 : 18;
  return Math.min(0, EDGE - (width - inset - actorWidth));
}

/** A short wander along the bottom edge, at most a few seconds long. */
export function planWander(
  x: number,
  viewportWidth: number,
  actorWidth: number,
  random: () => number = Math.random,
): { x: number; duration: number; direction: 'left' | 'right' } {
  const minX = wanderMinX(viewportWidth, actorWidth);
  const start = Math.max(minX, Math.min(0, Number.isFinite(x) ? x : 0));
  const reach = Math.min(Math.abs(minX), 80 + unit(random) * 140);
  let target = start - reach;
  // Head back home when the walk would leave the lane or barely move.
  if (target < minX || Math.abs(target - start) < 24) target = Math.min(0, start + reach);
  if (Math.abs(target - start) < 24) target = start === 0 ? Math.max(minX, -reach) : 0;
  target = Math.max(minX, Math.min(0, target));
  const distance = Math.abs(target - start);
  return {
    x: target,
    duration: Math.round(Math.max(400, Math.min(6_000, distance / 70 * 1_000))),
    direction: target > start ? 'right' : 'left',
  };
}

/* ------------------------------------------------------------ battle text */

export const battleText = {
  used: (pokemon: string, move: string) => `${pokemon} used ${move}!`,
  recall: (pokemon: string) => `${pokemon}, come back!`,
  go: (pokemon: string) => `Go! ${pokemon}!`,
  megaReacting: (pokemon: string) => `${pokemon} is reacting to ${TRAINER}'s Key Stone!`,
  megaEvolved: (pokemon: string, mega: string) => `${pokemon} has Mega Evolved into ${mega}!`,
};
