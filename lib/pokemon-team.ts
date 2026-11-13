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
  | 'arrow' | 'aura' | 'bolt' | 'charge' | 'claw' | 'cloak' | 'clones' | 'drain' | 'dust' | 'eruption' | 'fangs'
  | 'feathers' | 'flames' | 'flash' | 'hearts' | 'impact' | 'leaves' | 'moon' | 'orb' | 'quake'
  | 'rings-in' | 'rings-out' | 'ripple' | 'rise' | 'rocks' | 'shield' | 'slash' | 'sneak' | 'sparkles' | 'speed'
  | 'spiral' | 'splinters' | 'stars' | 'stream' | 'sword' | 'swords' | 'volley' | 'vortex' | 'wreath';

export const FX: readonly Fx[] = [
  'arrow', 'aura', 'bolt', 'charge', 'claw', 'cloak', 'clones', 'drain', 'dust', 'eruption', 'fangs',
  'feathers', 'flames', 'flash', 'hearts', 'impact', 'leaves', 'moon', 'orb', 'quake',
  'rings-in', 'rings-out', 'ripple', 'rise', 'rocks', 'shield', 'slash', 'sneak', 'sparkles', 'speed',
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
  /* -------------------------------------------- PC Box moves */
  'Waterfall': { type: 'water', category: 'physical', motion: 'dash', fx: ['cloak', 'impact'] },
  'Ice Punch': { type: 'ice', category: 'physical', motion: 'lunge', fx: ['impact', 'splinters'] },
  'Superpower': { type: 'fighting', category: 'physical', motion: 'lunge', fx: ['impact', 'dust'] },
  'Dragon Ascent': { type: 'flying', category: 'physical', motion: 'dive', fx: ['cloak', 'speed', 'impact'], color: '120 230 140' },
  'Bolt Strike': { type: 'electric', category: 'physical', motion: 'dash', fx: ['cloak', 'bolt', 'impact'], tint: BLACK },
  'Fusion Bolt': { type: 'electric', category: 'physical', motion: 'dive', fx: ['cloak', 'bolt', 'impact'] },
  'Hone Claws': { type: 'dark', category: 'status', motion: 'boost', fx: ['claw', 'rise'], color: '190 160 255', after: ["{name}'s Attack rose!", "{name}'s accuracy rose!"] },
  'Blue Flare': { type: 'fire', category: 'special', motion: 'cast', fx: ['charge', 'spiral', 'impact'], color: '110 170 255', tint: '0 0 40' },
  'Fusion Flare': { type: 'fire', category: 'special', motion: 'cast', fx: ['charge', 'orb', 'flames'], tint: '57 0 0' },
  'Dragon Pulse': { type: 'dragon', category: 'special', motion: 'cast', fx: ['rings-out'], color: '130 90 255' },
  'Flamethrower': { type: 'fire', category: 'special', motion: 'cast', fx: ['stream', 'flames'] },
  'Precipice Blades': { type: 'ground', category: 'physical', motion: 'stomp', fx: ['quake', 'eruption'], color: '232 110 56', tint: '60 10 0' },
  'Stone Edge': { type: 'rock', category: 'physical', motion: 'cast', fx: ['eruption', 'splinters'] },
  'Bulk Up': { type: 'fighting', category: 'status', motion: 'boost', fx: ['aura', 'rise'], color: '232 80 64', after: ["{name}'s Attack rose!", "{name}'s Defense rose!"] },
  'Origin Pulse': { type: 'water', category: 'special', motion: 'cast', fx: ['charge', 'rings-out', 'volley'], color: '80 160 255', tint: '0 0 110' },
  'Water Spout': { type: 'water', category: 'special', motion: 'cast', fx: ['eruption', 'volley'] },
  'Ice Beam': { type: 'ice', category: 'special', motion: 'cast', fx: ['charge', 'stream', 'splinters'], color: '170 230 255' },
  'Thunder': { type: 'electric', category: 'special', motion: 'cast', fx: ['bolt', 'impact'], tint: BLACK },
  'Meteor Mash': { type: 'steel', category: 'physical', motion: 'lunge', fx: ['impact', 'sparkles'], color: '170 200 255' },
  'Zen Headbutt': { type: 'psychic', category: 'physical', motion: 'dash', fx: ['cloak', 'rings-out', 'impact'] },
  'Bullet Punch': { type: 'steel', category: 'physical', motion: 'vanish', fx: ['speed', 'impact'], color: '222 228 242' },
  'Agility': { type: 'psychic', category: 'status', motion: 'boost', fx: ['speed', 'rise'], after: ["{name}'s Speed sharply rose!"] },
  'Rock Slide': { type: 'rock', category: 'physical', motion: 'cast', fx: ['rocks', 'impact'] },
  'Belly Drum': { type: 'normal', category: 'status', motion: 'boost', fx: ['aura', 'rise'], color: '255 96 72', after: ['{name} cut its own HP and maximized its Attack!'] },
  'Outrage': { type: 'dragon', category: 'physical', motion: 'dash', fx: ['cloak', 'impact', 'dust'], color: '255 96 96', tint: '70 0 0' },
  'Close Combat': { type: 'fighting', category: 'physical', motion: 'lunge', fx: ['dust', 'impact'] },
  'Liquidation': { type: 'water', category: 'physical', motion: 'dash', fx: ['cloak', 'impact', 'splinters'] },
  'Crunch': { type: 'dark', category: 'physical', motion: 'lunge', fx: ['fangs'], color: '190 160 255' },
  'Ice Fang': { type: 'ice', category: 'physical', motion: 'lunge', fx: ['fangs', 'splinters'], color: '170 230 255' },
  'Torch Song': { type: 'fire', category: 'special', motion: 'cast', fx: ['rings-out', 'flames'], after: ["{name}'s Sp. Atk rose!"] },
  'Will-O-Wisp': { type: 'fire', category: 'status', motion: 'cast', fx: ['volley'], color: '120 160 255', tint: '20 0 40', after: ['The target was burned!'] },
  'Collision Course': { type: 'fighting', category: 'physical', motion: 'dash', fx: ['cloak', 'impact', 'flash'], color: '255 120 60' },
  'First Impression': { type: 'bug', category: 'physical', motion: 'vanish', fx: ['impact'] },
  'Leech Life': { type: 'bug', category: 'physical', motion: 'lunge', fx: ['fangs', 'drain'] },
  'Wild Charge': { type: 'electric', category: 'physical', motion: 'dash', fx: ['cloak', 'bolt', 'impact'] },
  'Body Press': { type: 'fighting', category: 'physical', motion: 'stomp', fx: ['quake', 'impact'] },
  'Gigaton Hammer': { type: 'steel', category: 'physical', motion: 'stomp', fx: ['quake', 'impact', 'sparkles'], color: '214 220 235' },
  'Knock Off': { type: 'dark', category: 'physical', motion: 'lunge', fx: ['slash', 'impact'], color: '190 160 255' },
  'Freeze-Dry': { type: 'ice', category: 'special', motion: 'cast', fx: ['charge', 'volley', 'splinters'], color: '170 230 255' },
  'Psycho Cut': { type: 'psychic', category: 'physical', motion: 'lunge', fx: ['slash'] },
  'Scald': { type: 'water', category: 'special', motion: 'cast', fx: ['stream'] },
  'Recover': { type: 'normal', category: 'status', motion: 'boost', fx: ['rings-in', 'sparkles'], color: '160 255 200', after: ['{name} regained health!'] },
  'Dark Void': { type: 'dark', category: 'status', motion: 'cast', fx: ['rings-out', 'sneak'], color: '150 90 200', tint: BLACK, after: ['The target fell asleep!'] },
  'Sludge Bomb': { type: 'poison', category: 'special', motion: 'cast', fx: ['orb', 'splinters'] },
  'Nasty Plot': { type: 'dark', category: 'status', motion: 'boost', fx: ['aura', 'rise'], color: '150 90 200', after: ["{name}'s Sp. Atk sharply rose!"] },
  'Mist Ball': { type: 'psychic', category: 'special', motion: 'cast', fx: ['charge', 'orb'], color: '255 200 230' },
  'Draco Meteor': { type: 'dragon', category: 'special', motion: 'cast', fx: ['rocks', 'impact'], color: '150 110 255', tint: '20 0 40' },
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
  /**
   * stance: Aegislash's automatic Stance Change. crowned: Zacian's Rusted Sword.
   * gigantamax: lasts `turns` moves. primal: Groudon and Kyogre's Primal
   * Reversion. zen: Darmanitan's Zen Mode.
   */
  kind: 'stance' | 'crowned' | 'gigantamax' | 'primal' | 'zen';
  /** The colour of the change's light (RGB). */
  glow?: string;
  /** entry: happens by itself as the Pokémon is sent out, as Primal Reversion does in the games. */
  auto?: 'entry';
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
  /** The line before a Mega Evolution, when it is not the Key Stone ({trainer}, {name}). */
  megaCharge?: string;
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
      into: 'hatterene-gmax', kind: 'gigantamax', tag: 'Gigantamax', action: 'Gigantamax', short: 'G-Max', glow: '232 32 72',
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
      into: 'zacian-crowned', kind: 'crowned', tag: 'Crowned Sword', action: 'Crowned Sword', short: 'Crown', glow: '255 214 92',
      charge: 'The Rusted Sword is shining!', done: '{name} became the Crowned Sword!', swap: { 'Iron Head': 'Behemoth Blade' },
    },
  },
  'zacian-crowned': { name: 'Zacian', weight: 355, types: ['fairy', 'steel'], tag: 'Crowned Sword', locomotion: 'run' },
  /* ------------------------------------------------ the PC Box */
  'sceptile': { name: 'Sceptile', weight: 52.2, types: ['grass'], moves: ['Leaf Blade', 'Dragon Claw', 'Earthquake', 'Swords Dance'], mega: 'sceptile-mega', locomotion: 'hop' },
  'sceptile-mega': { name: 'Mega Sceptile', weight: 55.2, types: ['grass', 'dragon'], still: true, locomotion: 'hop' },
  'swampert': { name: 'Swampert', weight: 81.9, types: ['water', 'ground'], moves: ['Waterfall', 'Earthquake', 'Ice Punch', 'Superpower'], mega: 'swampert-mega', locomotion: 'walk' },
  'swampert-mega': { name: 'Mega Swampert', weight: 102, types: ['water', 'ground'], still: true, locomotion: 'walk' },
  'rayquaza': {
    name: 'Rayquaza', weight: 206.5, types: ['dragon', 'flying'], moves: ['Dragon Ascent', 'Dragon Claw', 'Extreme Speed', 'Dragon Dance'], locomotion: 'fly',
    mega: 'rayquaza-mega', megaCharge: "{trainer}'s fervent wish has reached {name}!",
  },
  'rayquaza-mega': { name: 'Mega Rayquaza', weight: 392, types: ['dragon', 'flying'], locomotion: 'fly' },
  'zekrom': { name: 'Zekrom', weight: 345, types: ['dragon', 'electric'], moves: ['Bolt Strike', 'Fusion Bolt', 'Dragon Claw', 'Hone Claws'], locomotion: 'fly' },
  'reshiram': { name: 'Reshiram', weight: 330, types: ['dragon', 'fire'], moves: ['Blue Flare', 'Fusion Flare', 'Dragon Pulse', 'Flamethrower'], locomotion: 'fly' },
  'groudon': {
    name: 'Groudon', weight: 950, types: ['ground'], moves: ['Precipice Blades', 'Fire Punch', 'Stone Edge', 'Bulk Up'], locomotion: 'walk',
    form: {
      into: 'groudon-primal', kind: 'primal', tag: 'Primal', action: 'Primal Reversion', short: 'Primal', glow: '255 92 40', auto: 'entry',
      charge: "{name}'s Primal Reversion!", done: 'It reverted to its primal form!',
    },
  },
  'groudon-primal': { name: 'Primal Groudon', weight: 999.7, types: ['ground', 'fire'], tag: 'Primal', locomotion: 'walk' },
  'kyogre': {
    name: 'Kyogre', weight: 352, types: ['water'], moves: ['Origin Pulse', 'Water Spout', 'Ice Beam', 'Thunder'], locomotion: 'float',
    form: {
      into: 'kyogre-primal', kind: 'primal', tag: 'Primal', action: 'Primal Reversion', short: 'Primal', glow: '64 140 255', auto: 'entry',
      charge: "{name}'s Primal Reversion!", done: 'It reverted to its primal form!',
    },
  },
  'kyogre-primal': { name: 'Primal Kyogre', weight: 430, types: ['water'], tag: 'Primal', locomotion: 'float' },
  'metagross': { name: 'Metagross', weight: 550, types: ['steel', 'psychic'], moves: ['Meteor Mash', 'Zen Headbutt', 'Bullet Punch', 'Agility'], mega: 'metagross-mega', locomotion: 'float' },
  'metagross-mega': { name: 'Mega Metagross', weight: 942.9, types: ['steel', 'psychic'], still: true, locomotion: 'float' },
  'darmanitan': {
    name: 'Darmanitan', weight: 92.9, types: ['fire'], moves: ['Flare Blitz', 'Superpower', 'Rock Slide', 'Belly Drum'], locomotion: 'walk',
    form: {
      into: 'darmanitan-zen', kind: 'zen', tag: 'Zen Mode', action: 'Zen Mode', short: 'Zen', glow: '120 180 255', ability: 'Zen Mode',
      charge: 'Zen Mode triggered!', done: '{name} entered Zen Mode!', revert: 'Zen Mode ended!', turns: 3,
    },
  },
  'darmanitan-zen': { name: 'Darmanitan', weight: 92.9, types: ['fire', 'psychic'], tag: 'Zen Mode', locomotion: 'walk' },
  'haxorus': { name: 'Haxorus', weight: 105.5, types: ['dragon'], moves: ['Outrage', 'Earthquake', 'Close Combat', 'Dragon Dance'], locomotion: 'walk' },
  'feraligatr': { name: 'Feraligatr', weight: 88.8, types: ['water'], moves: ['Liquidation', 'Crunch', 'Ice Fang', 'Dragon Dance'], locomotion: 'walk' },
  'articuno': { name: 'Articuno', weight: 55.4, types: ['ice', 'flying'], moves: ['Freeze-Dry', 'Ice Beam', 'Hurricane', 'Roost'], locomotion: 'fly' },
  'gallade': { name: 'Gallade', weight: 52, types: ['psychic', 'fighting'], moves: ['Sacred Sword', 'Psycho Cut', 'Leaf Blade', 'Swords Dance'], mega: 'gallade-mega', locomotion: 'run' },
  'gallade-mega': { name: 'Mega Gallade', weight: 56.4, types: ['psychic', 'fighting'], still: true, locomotion: 'run' },
  'milotic': { name: 'Milotic', weight: 162, types: ['water'], moves: ['Scald', 'Ice Beam', 'Dragon Pulse', 'Recover'], locomotion: 'float' },
  'darkrai': { name: 'Darkrai', weight: 50.5, types: ['dark'], moves: ['Dark Void', 'Dark Pulse', 'Sludge Bomb', 'Nasty Plot'], locomotion: 'float' },
  'latias': { name: 'Latias', weight: 40, types: ['dragon', 'psychic'], moves: ['Mist Ball', 'Draco Meteor', 'Calm Mind', 'Recover'], mega: 'latias-mega', locomotion: 'fly' },
  'latias-mega': { name: 'Mega Latias', weight: 52, types: ['dragon', 'psychic'], locomotion: 'fly' },
  'skeledirge': { name: 'Skeledirge', weight: 326.5, types: ['fire', 'ghost'], moves: ['Torch Song', 'Shadow Ball', 'Hyper Voice', 'Will-O-Wisp'], still: true, locomotion: 'walk' },
  'koraidon': { name: 'Koraidon', weight: 303, types: ['fighting', 'dragon'], moves: ['Collision Course', 'Flare Blitz', 'Dragon Claw', 'Swords Dance'], still: true, locomotion: 'run' },
  'slitherwing': { name: 'Slither Wing', weight: 92, types: ['bug', 'fighting'], moves: ['First Impression', 'Close Combat', 'Leech Life', 'Wild Charge'], still: true, locomotion: 'walk' },
  'corviknight': { name: 'Corviknight', weight: 75, types: ['flying', 'steel'], moves: ['Brave Bird', 'Body Press', 'Iron Head', 'Bulk Up'], locomotion: 'fly' },
  'tinkaton': { name: 'Tinkaton', weight: 112.8, types: ['fairy', 'steel'], moves: ['Gigaton Hammer', 'Play Rough', 'Knock Off', 'Swords Dance'], still: true, locomotion: 'walk' },
} satisfies Record<string, Species>;

export type SpeciesId = keyof typeof POKEDEX;
export type TeamSlot = { species: SpeciesId; shiny?: boolean };

/** How many Pokémon travel in the party; the rest of a roster waits in the PC Box. */
export const PARTY_SIZE = 6;

/**
 * Each persona's roster. The first six are the starting party, lead first;
 * the rest wait in the PC Box, from where any can be sent out (the one it
 * replaces goes back to the Box). The Zelda roster is Gen 6–9 only: its party
 * is a placeholder cast as Link's sword and shield, Sheik, Zelda's magic, the
 * Great Deku Tree, a Loftwing and the Hero.
 */
export const TEAMS: Record<ChatPersona, TeamSlot[]> = {
  portfolio: [
    { species: 'lugia', shiny: true },
    { species: 'samurott-hisui' },
    { species: 'ursaluna-bloodmoon' },
    { species: 'garchomp' },
    { species: 'dragonite' },
    { species: 'decidueye' },
    // PC Box
    { species: 'rayquaza' },
    { species: 'groudon' },
    { species: 'kyogre' },
    { species: 'zekrom' },
    { species: 'reshiram' },
    { species: 'latias' },
    { species: 'darkrai' },
    { species: 'articuno' },
    { species: 'sceptile' },
    { species: 'swampert' },
    { species: 'metagross' },
    { species: 'gallade' },
    { species: 'haxorus' },
    { species: 'darmanitan' },
    { species: 'feraligatr' },
    { species: 'milotic' },
  ],
  zelda: [
    { species: 'aegislash' },
    { species: 'greninja' },
    { species: 'hatterene' },
    { species: 'trevenant' },
    { species: 'talonflame' },
    { species: 'zacian' },
    // PC Box
    { species: 'koraidon' },
    { species: 'skeledirge' },
    { species: 'tinkaton' },
    { species: 'corviknight' },
    { species: 'slitherwing' },
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
  /** Its index in the persona's roster (party and PC Box together). */
  slot: number;
  species: SpeciesId;
  /** The roster entry's species, whatever form it is in now. */
  baseSpecies: SpeciesId;
  name: string;
  baseName: string;
  types: PokemonType[];
  shiny: boolean;
  state: FormState;
  mega: boolean;
  canMega: boolean;
  /** The line before its Mega Evolution ("Reggie's fervent wish has reached Rayquaza!"). */
  megaCharge: string;
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
    baseSpecies: species,
    name: form.name,
    baseName: base.name,
    types: form.types,
    shiny,
    state,
    mega: state === 'mega',
    canMega: Boolean(base.mega) && state === 'base',
    megaCharge: base.megaCharge ? formText(base.megaCharge, base.name) : battleText.megaReacting(base.name),
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

/** Fills {name} (the Pokémon) and {trainer} in battle text. */
export function formText(template: string, name: string): string {
  return template.split('{name}').join(name).split('{trainer}').join(TRAINER);
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

/** box: send out a Pokémon from the PC Box in place of the one out now. */
export type AutoAction = 'attack' | 'combo' | 'walk' | 'switch' | 'box' | 'mega' | 'form';

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
  { canMega, canChange, teamSize, boxSize = 0 }: { canMega: boolean; canChange?: boolean; teamSize: number; boxSize?: number },
  previous: AutoAction | null,
  random: () => number = Math.random,
): AutoAction {
  const weights: [AutoAction, number][] = [
    ['attack', 4],
    ['combo', previous === 'combo' ? 0 : 2],
    ['walk', previous === 'walk' ? 0 : 3],
    ['switch', previous === 'switch' || teamSize < 2 ? 0 : 2],
    ['box', previous === 'box' || boxSize < 1 ? 0 : 2],
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
