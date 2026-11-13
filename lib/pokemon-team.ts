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

export type MoveCategory = 'physical' | 'special' | 'status';

/** How the user's sprite moves while using a move (components/pokemon-actor.module.css). */
export type Motion = 'lunge' | 'dash' | 'cast' | 'stomp' | 'boost' | 'vanish' | 'dive';

/**
 * The effect pieces a move is drawn with, each one block in
 * components/pokemon-moves.module.css. Recipes follow Pokémon Showdown's
 * battle animations (play.pokemonshowdown.com/src/battle-animations-moves.ts),
 * redrawn in CSS: e.g. Aeroblast is a trail of expanding wisps plus a volley
 * of pale orbs on a darkened field; Blood Moon raises a red moon that rains
 * flare balls; Swords Dance sweeps swords across the user.
 */
export type Fx =
  | 'arrow' | 'aura' | 'charge' | 'claw' | 'cloak' | 'clones' | 'drain' | 'dust' | 'eruption' | 'fangs'
  | 'feathers' | 'flames' | 'flash' | 'hearts' | 'impact' | 'leaves' | 'moon' | 'orb' | 'quake'
  | 'rings-in' | 'rings-out' | 'ripple' | 'rise' | 'shield' | 'slash' | 'sneak' | 'sparkles' | 'speed'
  | 'spiral' | 'splinters' | 'stars' | 'stream' | 'sword' | 'swords' | 'volley' | 'vortex' | 'wreath';

export const FX: readonly Fx[] = [
  'arrow', 'aura', 'charge', 'claw', 'cloak', 'clones', 'drain', 'dust', 'eruption', 'fangs',
  'feathers', 'flames', 'flash', 'hearts', 'impact', 'leaves', 'moon', 'orb', 'quake',
  'rings-in', 'rings-out', 'ripple', 'rise', 'shield', 'slash', 'sneak', 'sparkles', 'speed',
  'spiral', 'splinters', 'stars', 'stream', 'sword', 'swords', 'volley', 'vortex', 'wreath',
];

export const MOTIONS: readonly Motion[] = ['lunge', 'dash', 'cast', 'stomp', 'boost', 'vanish', 'dive'];

export type Move = {
  type: PokemonType;
  category: MoveCategory;
  motion: Motion;
  fx: Fx[];
  /** Effect colour as space-separated RGB, where the type colour would look wrong. */
  color?: string;
  /** Darkens or tints the field behind the move, as Showdown's backgrounds do. */
  tint?: string;
  /** Follow-up battle text, one message at a time as in the games; {name} is the user. */
  after?: string[];
};

const BLACK = '0 0 0';

/** Every move a team member knows: real type and category, and how it is drawn. */
export const MOVES = {
  'Aeroblast': { type: 'flying', category: 'special', motion: 'cast', fx: ['charge', 'spiral', 'volley', 'impact'], color: '214 236 255', tint: BLACK },
  'Psychic': { type: 'psychic', category: 'special', motion: 'cast', fx: ['ripple'], tint: '170 68 187' },
  'Hydro Pump': { type: 'water', category: 'special', motion: 'cast', fx: ['stream'], tint: '0 0 170' },
  'Calm Mind': { type: 'psychic', category: 'status', motion: 'boost', fx: ['rings-in', 'rise'], color: '170 68 255', after: ["{name}'s Sp. Atk rose!", "{name}'s Sp. Def rose!"] },
  'Ceaseless Edge': { type: 'dark', category: 'physical', motion: 'lunge', fx: ['slash', 'splinters'], color: '190 160 255', tint: BLACK },
  'Razor Shell': { type: 'water', category: 'physical', motion: 'lunge', fx: ['slash', 'splinters'] },
  'Aqua Jet': { type: 'water', category: 'physical', motion: 'dash', fx: ['cloak', 'speed', 'impact'] },
  'Swords Dance': { type: 'normal', category: 'status', motion: 'boost', fx: ['swords', 'rise'], color: '214 220 235', after: ["{name}'s Attack sharply rose!"] },
  'Blood Moon': { type: 'normal', category: 'special', motion: 'cast', fx: ['moon', 'volley', 'impact'], color: '232 48 48', tint: BLACK },
  'Earth Power': { type: 'ground', category: 'special', motion: 'cast', fx: ['eruption'] },
  'Hyper Voice': { type: 'normal', category: 'special', motion: 'cast', fx: ['rings-out'], color: '255 255 255' },
  'Moonlight': { type: 'fairy', category: 'status', motion: 'boost', fx: ['moon', 'sparkles'], color: '226 232 255', tint: '16 22 64', after: ['{name} regained health!'] },
  'Dragon Claw': { type: 'dragon', category: 'physical', motion: 'lunge', fx: ['claw'] },
  'Earthquake': { type: 'ground', category: 'physical', motion: 'stomp', fx: ['quake'] },
  'Fire Fang': { type: 'fire', category: 'physical', motion: 'lunge', fx: ['fangs', 'flames'] },
  'Extreme Speed': { type: 'normal', category: 'physical', motion: 'vanish', fx: ['speed', 'impact'], color: '255 255 255' },
  'Hurricane': { type: 'flying', category: 'special', motion: 'cast', fx: ['vortex'], tint: BLACK },
  'Fire Punch': { type: 'fire', category: 'physical', motion: 'lunge', fx: ['impact', 'flames'] },
  'Dragon Dance': { type: 'dragon', category: 'status', motion: 'boost', fx: ['aura', 'rise'], color: '170 96 255', after: ["{name}'s Attack rose!", "{name}'s Speed rose!"] },
  'Spirit Shackle': { type: 'ghost', category: 'physical', motion: 'cast', fx: ['arrow'], tint: '68 0 68' },
  'Leaf Blade': { type: 'grass', category: 'physical', motion: 'lunge', fx: ['slash', 'leaves'] },
  'Brave Bird': { type: 'flying', category: 'physical', motion: 'dive', fx: ['cloak', 'speed', 'impact'], color: '96 168 255' },
  'Shadow Sneak': { type: 'ghost', category: 'physical', motion: 'cast', fx: ['sneak', 'impact'], tint: BLACK },
  'Sacred Sword': { type: 'fighting', category: 'physical', motion: 'lunge', fx: ['sword', 'sparkles'], color: '190 226 255' },
  "King's Shield": { type: 'steel', category: 'status', motion: 'boost', fx: ['shield'], after: ['{name} protected itself!'] },
  'Shadow Ball': { type: 'ghost', category: 'special', motion: 'cast', fx: ['charge', 'orb'], color: '150 90 200', tint: BLACK },
  'Water Shuriken': { type: 'water', category: 'special', motion: 'cast', fx: ['stars'] },
  'Dark Pulse': { type: 'dark', category: 'special', motion: 'cast', fx: ['rings-out'], color: '150 90 200', tint: BLACK },
  'Night Slash': { type: 'dark', category: 'physical', motion: 'lunge', fx: ['slash'], color: '190 160 255', tint: BLACK },
  'Double Team': { type: 'normal', category: 'status', motion: 'boost', fx: ['clones'], after: ["{name}'s evasiveness rose!"] },
  'Dazzling Gleam': { type: 'fairy', category: 'special', motion: 'cast', fx: ['flash', 'sparkles'], tint: '255 153 255' },
  'Draining Kiss': { type: 'fairy', category: 'special', motion: 'cast', fx: ['hearts', 'drain'] },
  'Wood Hammer': { type: 'grass', category: 'physical', motion: 'lunge', fx: ['impact', 'leaves'] },
  'Horn Leech': { type: 'grass', category: 'physical', motion: 'lunge', fx: ['impact', 'drain'] },
  'Phantom Force': { type: 'ghost', category: 'physical', motion: 'vanish', fx: ['impact'], tint: BLACK },
  "Forest's Curse": { type: 'grass', category: 'status', motion: 'cast', fx: ['wreath', 'leaves'], after: ['Grass type was added to the target!'] },
  'Flare Blitz': { type: 'fire', category: 'physical', motion: 'dash', fx: ['cloak', 'impact', 'flames'], tint: '57 0 0' },
  'Acrobatics': { type: 'flying', category: 'physical', motion: 'dive', fx: ['speed', 'impact'] },
  'Roost': { type: 'flying', category: 'status', motion: 'boost', fx: ['feathers', 'sparkles'], after: ['{name} regained health!'] },
  'Play Rough': { type: 'fairy', category: 'physical', motion: 'lunge', fx: ['dust', 'hearts'] },
  'Iron Head': { type: 'steel', category: 'physical', motion: 'dash', fx: ['cloak', 'impact'], color: '222 228 242' },
  'Behemoth Blade': { type: 'steel', category: 'physical', motion: 'dash', fx: ['sword', 'slash', 'impact'], color: '255 214 92' },
  'G-Max Smite': { type: 'fairy', category: 'physical', motion: 'cast', fx: ['flash', 'sparkles', 'impact'], tint: '255 120 200' },
} satisfies Record<string, Move>;

export type MoveName = keyof typeof MOVES;

/** How a Pokémon gets around when it wanders. */
export type Locomotion = 'walk' | 'run' | 'hop' | 'fly' | 'float';

/** px per second for each way of getting around. */
export const SPEEDS: Record<Locomotion, number> = { walk: 70, run: 150, hop: 100, fly: 120, float: 60 };

/** A change into another form that is not Mega Evolution. */
export type FormChange = {
  /** The POKEDEX key of the changed form. */
  into: string;
  /** stance: Aegislash's automatic Stance Change. crowned: Zacian's Rusted Sword. gigantamax: lasts `turns` moves. */
  kind: 'stance' | 'crowned' | 'gigantamax';
  /** Short label for the nameplate. */
  tag: string;
  /** Label for the button that triggers it; stance changes happen on their own. */
  action?: string;
  /** A short button label for tight spaces ("G-Max"). */
  short?: string;
  /** Battle text; {name} is the Pokémon. */
  charge: string;
  done: string;
  revert?: string;
  /** The ability behind the change, shown in a Gen 5 ability banner (Stance Change). */
  ability?: string;
  /** Moves the form replaces, e.g. Iron Head becomes Behemoth Blade. */
  swap?: Partial<Record<MoveName, MoveName>>;
  /** The form ends on its own after this many moves. */
  turns?: number;
};

export type Species = {
  name: string;
  /** Kilograms, from the games. Sets how hard it lands when sent out. */
  weight: number;
  types: PokemonType[];
  /** Four moves. Mega and changed forms keep their base form's moves. */
  moves?: MoveName[];
  /** The POKEDEX key of this species' Mega Evolution. */
  mega?: string;
  form?: FormChange;
  /** Nameplate label for a changed form ("Blade Forme"). */
  tag?: string;
  locomotion?: Locomotion;
  /** An ability that activates when it is sent out, with its battle text (Zacian's Intrepid Sword). */
  entry?: { ability: string; text: string[] };
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
  'lugia': { name: 'Lugia', weight: 216, types: ['psychic', 'flying'], moves: ['Aeroblast', 'Psychic', 'Hydro Pump', 'Calm Mind'], locomotion: 'fly' },
  'samurott-hisui': { name: 'Hisuian Samurott', weight: 58.2, types: ['water', 'dark'], moves: ['Ceaseless Edge', 'Razor Shell', 'Aqua Jet', 'Swords Dance'], locomotion: 'walk' },
  'ursaluna-bloodmoon': { name: 'Bloodmoon Ursaluna', weight: 333, types: ['ground', 'normal'], moves: ['Blood Moon', 'Earth Power', 'Hyper Voice', 'Moonlight'], locomotion: 'walk' },
  'garchomp': { name: 'Garchomp', weight: 95, types: ['dragon', 'ground'], moves: ['Dragon Claw', 'Earthquake', 'Fire Fang', 'Swords Dance'], mega: 'garchomp-mega', locomotion: 'run' },
  'garchomp-mega': { name: 'Mega Garchomp', weight: 95, types: ['dragon', 'ground'], locomotion: 'run' },
  'dragonite': { name: 'Dragonite', weight: 210, types: ['dragon', 'flying'], moves: ['Extreme Speed', 'Hurricane', 'Fire Punch', 'Dragon Dance'], mega: 'dragonite-mega', locomotion: 'fly' },
  'dragonite-mega': { name: 'Mega Dragonite', weight: 290, types: ['dragon', 'flying'], still: true, locomotion: 'fly' },
  'decidueye': { name: 'Decidueye', weight: 36.6, types: ['grass', 'ghost'], moves: ['Spirit Shackle', 'Leaf Blade', 'Brave Bird', 'Shadow Sneak'], still: true, locomotion: 'fly' },
  'aegislash': {
    name: 'Aegislash', weight: 53, types: ['steel', 'ghost'], moves: ['Sacred Sword', 'Shadow Ball', 'Shadow Sneak', "King's Shield"], locomotion: 'float',
    form: { into: 'aegislash-blade', kind: 'stance', tag: 'Blade Forme', ability: 'Stance Change', charge: 'Stance Change!', done: 'Changed to Blade Forme!', revert: 'Changed to Shield Forme!' },
  },
  'aegislash-blade': { name: 'Aegislash', weight: 53, types: ['steel', 'ghost'], tag: 'Blade Forme', locomotion: 'float' },
  'greninja': { name: 'Greninja', weight: 40, types: ['water', 'dark'], moves: ['Water Shuriken', 'Dark Pulse', 'Night Slash', 'Double Team'], mega: 'greninja-mega', locomotion: 'hop' },
  'greninja-mega': { name: 'Mega Greninja', weight: 40, types: ['water', 'dark'], still: true, pokeapi: 10294, locomotion: 'hop' },
  'hatterene': {
    name: 'Hatterene', weight: 5.1, types: ['psychic', 'fairy'], moves: ['Psychic', 'Dazzling Gleam', 'Draining Kiss', 'Calm Mind'], locomotion: 'float',
    form: {
      into: 'hatterene-gmax', kind: 'gigantamax', tag: 'Gigantamax', action: 'Gigantamax', short: 'G-Max',
      charge: '{name} is Gigantamaxing!', done: '{name} Gigantamaxed!', revert: '{name} returned to normal!',
      swap: { 'Dazzling Gleam': 'G-Max Smite' }, turns: 3,
    },
  },
  'hatterene-gmax': { name: 'Hatterene', weight: 5.1, types: ['psychic', 'fairy'], tag: 'Gigantamax', locomotion: 'float' },
  'trevenant': { name: 'Trevenant', weight: 71, types: ['ghost', 'grass'], moves: ['Wood Hammer', 'Horn Leech', 'Phantom Force', "Forest's Curse"], locomotion: 'walk' },
  'talonflame': { name: 'Talonflame', weight: 24.5, types: ['fire', 'flying'], moves: ['Brave Bird', 'Flare Blitz', 'Acrobatics', 'Roost'], locomotion: 'fly' },
  'zacian': {
    name: 'Zacian', weight: 110, types: ['fairy'], moves: ['Play Rough', 'Sacred Sword', 'Iron Head', 'Swords Dance'], locomotion: 'run',
    entry: { ability: 'Intrepid Sword', text: ["{name}'s Attack rose!"] },
    form: {
      into: 'zacian-crowned', kind: 'crowned', tag: 'Crowned Sword', action: 'Crowned Sword', short: 'Crown',
      charge: 'The Rusted Sword is shining!', done: '{name} became the Crowned Sword!', swap: { 'Iron Head': 'Behemoth Blade' },
    },
  },
  'zacian-crowned': { name: 'Zacian', weight: 355, types: ['fairy', 'steel'], tag: 'Crowned Sword', locomotion: 'run' },
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

const DARK_INK = '20 20 24';
const LIGHT_INK = '255 255 255';

function luminance(rgb: string): number {
  const [r, g, b] = rgb.split(' ').map((value) => {
    const channel = Number(value) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Text colour for a type chip: whichever of near-black and white reads better on it. */
export const TYPE_INK = Object.fromEntries(
  (Object.entries(TYPE_COLORS) as [PokemonType, string][]).map(([type, colour]) => [
    type,
    contrast(colour, DARK_INK) >= contrast(colour, LIGHT_INK) ? DARK_INK : LIGHT_INK,
  ]),
) as Record<PokemonType, string>;

export type ResolvedMove = Move & { name: MoveName };

/** Which form a team member is in: its base form, its Mega Evolution, or its other form. */
export type FormState = 'base' | 'mega' | 'form';

/** One team member with its data resolved in its current form. */
export type ActivePokemon = {
  slot: number;
  species: SpeciesId;
  name: string;
  baseName: string;
  types: PokemonType[];
  shiny: boolean;
  state: FormState;
  mega: boolean;
  canMega: boolean;
  /** The species' other form, if it has one. */
  formChange: FormChange | null;
  /** True when that form can be triggered by hand now (not stance, not already in it). */
  canChange: boolean;
  /** Nameplate label: "Mega", "Blade Forme", "Crowned Sword", "Gigantamax". */
  tag: string | null;
  locomotion: Locomotion;
  /** Kilograms, and how it lands when sent out (Gen 5: heavier Pokémon thud and raise dust). */
  weight: number;
  landing: Landing;
  /** An ability that activates on entry, if any. */
  entry: Species['entry'] | null;
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

/** Every form a species can appear in: itself, its Mega, its other form. */
export function speciesForms(id: SpeciesId): SpeciesId[] {
  const { mega, form } = speciesData(id);
  return [id, ...(mega ? [mega as SpeciesId] : []), ...(form ? [form.into as SpeciesId] : [])];
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
      for (const form of speciesForms(species)) {
        const { still, pokeapi } = speciesData(form);
        if (!still) sprites.set(spriteFile(form, shiny, true), `${SHOWDOWN}${spriteFile(form, shiny, true)}`);
        const file = spriteFile(form, shiny, false);
        sprites.set(file, pokeapi ? `${POKEAPI_BW}${shiny ? 'shiny/' : ''}${pokeapi}.png` : `${SHOWDOWN}${file}`);
      }
    }
  }
  return Array.from(sprites, ([file, url]) => ({ file, url })).sort((a, b) => a.file.localeCompare(b.file));
}

export function resolveMember(team: TeamSlot[], slot: number, requested: FormState = 'base'): ActivePokemon {
  const index = Math.max(0, Math.min(team.length - 1, Math.trunc(slot) || 0));
  const { species, shiny = false } = team[index];
  const base = speciesData(species);
  const formChange = base.form ?? null;
  const state: FormState = requested === 'mega' && base.mega ? 'mega' : requested === 'form' && formChange ? 'form' : 'base';
  const formId = (state === 'mega' ? base.mega : state === 'form' ? formChange?.into : species) as SpeciesId;
  const form = speciesData(formId);
  const animated = !form.still;
  const swap: Partial<Record<MoveName, MoveName>> = state === 'form' ? formChange?.swap ?? {} : {};
  return {
    slot: index,
    species: formId,
    name: form.name,
    baseName: base.name,
    types: form.types,
    shiny,
    state,
    mega: state === 'mega',
    canMega: Boolean(base.mega) && state === 'base',
    formChange,
    canChange: Boolean(formChange && formChange.kind !== 'stance') && state === 'base',
    tag: state === 'mega' ? 'Mega' : state === 'form' ? form.tag ?? formChange?.tag ?? null : null,
    locomotion: form.locomotion ?? base.locomotion ?? 'walk',
    weight: form.weight,
    landing: landingFor(form.weight, form.locomotion ?? base.locomotion ?? 'walk'),
    entry: base.entry ?? null,
    moves: (base.moves ?? []).map((original) => {
      const name = swap[original] ?? original;
      return { name, ...MOVES[name] };
    }),
    sprite: spriteUrl(formId, shiny, animated),
    still: spriteUrl(formId, shiny, false),
    animated,
  };
}

/**
 * How a Pokémon lands when sent out. In Gen 5 the landing has a weight-based
 * tremor and thud and heavy Pokémon kick up dust; fliers and levitating
 * Pokémon land silently.
 */
export type Landing = 'none' | 'thud' | 'heavy';

export function landingFor(weight: number, locomotion: Locomotion): Landing {
  if (locomotion === 'fly' || locomotion === 'float') return 'none';
  if (weight >= 100) return 'heavy';
  return weight >= 30 ? 'thud' : 'none';
}

/** Fills {name} in a form change's battle text. */
export function formText(template: string, name: string): string {
  return template.split('{name}').join(name);
}

/**
 * The stance Aegislash must be in to use a move: Blade Forme for any damaging
 * move, Shield Forme for King's Shield. Null when no change is needed.
 */
export function stanceFor(pokemon: Pick<ActivePokemon, 'formChange' | 'state'>, move: Pick<ResolvedMove, 'name' | 'category'>): FormState | null {
  if (pokemon.formChange?.kind !== 'stance') return null;
  if (move.name === "King's Shield") return pokemon.state === 'form' ? 'base' : null;
  if (move.category !== 'status') return pokemon.state === 'base' ? 'form' : null;
  return null;
}

/* ------------------------------------------------------------ behaviour */

export type AutoAction = 'attack' | 'combo' | 'walk' | 'switch' | 'mega' | 'form';

/** Milliseconds for each staged performance, shared by the hook and the stylesheets. */
export const DURATIONS = {
  attack: 1200,
  boost: 1000,
  recall: 480,
  throw: 620,
  /** Gen 5: grow out of the ball and rise (≈400 ms), drop onto the platform (≈250 ms), then the landing. */
  release: 900,
  shiny: 760,
  ability: 900,
  /** Each follow-up message ("Garchomp's Attack sharply rose!"). */
  after: 700,
  megaCharge: 1500,
  megaReveal: 700,
  formCharge: 1100,
  formReveal: 600,
  stance: 700,
  text: 1700,
} as const;

function unit(random: () => number): number {
  const value = random();
  return Number.isFinite(value) ? Math.max(0, Math.min(0.999_999, value)) : 0.5;
}

/** The rest between automatic actions: 3–7 seconds. */
export function nextAutoDelay(random: () => number = Math.random): number {
  return Math.round(3_000 + unit(random) * 4_000);
}

/**
 * Moves and walks are the common case; switches and transformations are
 * rarer. Never the same non-attack action twice in a row, and Mega or a form
 * change only when one is possible.
 */
export function pickAutoAction(
  { canMega, canChange, teamSize }: { canMega: boolean; canChange?: boolean; teamSize: number },
  previous: AutoAction | null,
  random: () => number = Math.random,
): AutoAction {
  const weights: [AutoAction, number][] = [
    ['attack', 4],
    ['combo', previous === 'combo' ? 0 : 2],
    ['walk', previous === 'walk' ? 0 : 3],
    ['switch', previous === 'switch' || teamSize < 2 ? 0 : 2],
    ['mega', canMega ? 2 : 0],
    ['form', canChange ? 2 : 0],
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

/** A wander along the bottom edge at the Pokémon's own pace, at most a few seconds long. */
export function planWander(
  x: number,
  viewportWidth: number,
  actorWidth: number,
  random: () => number = Math.random,
  speed: number = SPEEDS.walk,
): { x: number; duration: number; direction: 'left' | 'right' } {
  const minX = wanderMinX(viewportWidth, actorWidth);
  const start = Math.max(minX, Math.min(0, Number.isFinite(x) ? x : 0));
  const reach = Math.min(Math.abs(minX), 110 + unit(random) * 260);
  let target = start - reach;
  // Head back home when the walk would leave the lane or barely move.
  if (target < minX || Math.abs(target - start) < 24) target = Math.min(0, start + reach);
  if (Math.abs(target - start) < 24) target = start === 0 ? Math.max(minX, -reach) : 0;
  target = Math.max(minX, Math.min(0, target));
  const distance = Math.abs(target - start);
  const pace = Number.isFinite(speed) && speed > 0 ? speed : SPEEDS.walk;
  return {
    x: target,
    duration: Math.round(Math.max(400, Math.min(5_000, distance / pace * 1_000))),
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
