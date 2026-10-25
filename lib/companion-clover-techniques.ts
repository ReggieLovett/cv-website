import { makeTechnique } from './companion-technique';

/** Additional named techniques and clearly labeled applications of the same
 * character's researched arsenal. See docs/companion-clover-references.md. */
export const CLOVER_TECHNIQUES = {
  'zetten-counter-cut': makeTechnique('Anti-Magic Zetten: Counter Cut', 'zetten-counter-cut', 'advance', 'draw', 940),
  'asta-causality-break': makeTechnique('Demon-Destroyer: Fate Release', 'asta-causality-break', 'hover', 'brace', 1080),
  'asta-bull-thrust': makeTechnique('Bull Thrust', 'asta-bull-thrust', 'dash', 'rush', 820),
  'zetten-slasher-draw': makeTechnique('Demon-Slasher: Zetten Draw', 'zetten-slasher-draw', 'advance', 'draw', 920),
  'zetten-slayer-rebound': makeTechnique('Demon-Slayer: Spell Rebound', 'zetten-slayer-rebound', 'hover', 'brace', 1060),
  'zetten-dweller-return': makeTechnique('Demon-Dweller: Magic Return', 'zetten-dweller-return', 'hover', 'cast', 1140),
  'zetten-destroyer-pulse': makeTechnique('Demon-Destroyer: Fate Release Pulse', 'zetten-destroyer-pulse', 'hover', 'brace', 1100),

  'devil-black-slash-barrage': makeTechnique('Demon-Dweller: Black Slash Barrage', 'devil-black-slash-barrage', 'hover', 'draw', 1160),
  'devil-causality-guard': makeTechnique('Demon-Destroyer: Anti-Magic Guard', 'devil-causality-guard', 'hover', 'brace', 1080),
  'devil-cross-slash': makeTechnique('Demon-Slasher: Cross Cut', 'devil-cross-slash', 'advance', 'spin', 980),
  'devil-divider-cleave': makeTechnique('Demon-Slayer: Black Divider Cleave', 'devil-divider-cleave', 'advance', 'draw', 1100),
  'devil-slasher-draw': makeTechnique('Demon-Slasher: Selective Draw', 'devil-slasher-draw', 'dash', 'draw', 900),
  'devil-dweller-return': makeTechnique('Demon-Dweller: Spell Return', 'devil-dweller-return', 'hover', 'cast', 1160),
  'devil-destroyer-release': makeTechnique('Demon-Destroyer: Fate Release Wave', 'devil-destroyer-release', 'hover', 'brace', 1180),

  'quartile-flagellum': makeTechnique('Star Magic: Quartile Flagellum', 'quartile-flagellum', 'advance', 'cast', 1060),
  'never-never-land': makeTechnique('Star × Wind Spirit Magic: Never-Never Land', 'never-never-land', 'hover', 'brace', 1200),

  'spirit-of-boreas': makeTechnique('Spirit of Boreas', 'spirit-of-boreas', 'advance', 'draw', 1100),
  'spirit-of-notos': makeTechnique('Spirit of Notos', 'spirit-of-notos', 'hover', 'brace', 1120),

  'luck-thunder-god-kick': makeTechnique('Thunder God’s Boots: Lightning Kick', 'luck-thunder-god-kick', 'advance', 'strike', 780),
  'luck-rune-rebound': makeTechnique('Mana Method: Rune Rebound', 'luck-rune-rebound', 'dash', 'spin', 880),
  'luck-twin-thunderbolt': makeTechnique('Thunderbolt Destruction: Twin Orbs', 'luck-twin-thunderbolt', 'hover', 'cast', 1060),
  'luck-thunder-god-palm': makeTechnique('Thunder God’s Gloves: Palm Strike', 'luck-thunder-god-palm', 'advance', 'strike', 820),
  'luck-ceranos-return': makeTechnique('True Lightning Magic: Ceranos Return', 'luck-ceranos-return', 'dash', 'rush', 900),
  'luck-thunderbolt-scatter': makeTechnique('Thunderbolt Destruction: Scatter Volley', 'luck-thunderbolt-scatter', 'hover', 'cast', 1120),
  'luck-cross-claw': makeTechnique('Thunder God’s Gloves: Cross Claw', 'luck-cross-claw', 'advance', 'spin', 880),

  'calidos-purgatory': makeTechnique('Mana Zone: Calidos Brachium Purgatory', 'calidos-purgatory', 'hover', 'brace', 1140),
  'calidos-flame-burial': makeTechnique('Calidos Brachium Purgatory: Flame Burial', 'calidos-flame-burial', 'advance', 'strike', 1160),
  'excelicitus-leonum': makeTechnique('Fire Ultimate Magic: Excelicitus Leonum', 'excelicitus-leonum', 'hover', 'cast', 1200),
  'calidos-uppercut': makeTechnique('Calidos Brachium: Rising Fist', 'calidos-uppercut', 'advance', 'strike', 980),
  'calidos-crossfire': makeTechnique('Mana Zone: Calidos Brachium Crossfire', 'calidos-crossfire', 'hover', 'cast', 1140),
  'calidos-burning-counter': makeTechnique('Calidos Brachium: Burning Counter', 'calidos-burning-counter', 'advance', 'brace', 1080),
  'calidos-zone-press': makeTechnique('Mana Zone: Surrounding Flame Press', 'calidos-zone-press', 'hover', 'brace', 1200),

  'sea-dragon-roar': makeTechnique('Water Creation Magic: Sea Dragon’s Roar', 'sea-dragon-roar', 'hover', 'cast', 1160),
  'valkyrie-lance': makeTechnique('Valkyrie Armor: Lance Thrust', 'valkyrie-lance', 'dash', 'rush', 900),
  'sea-dragon-cradle': makeTechnique('Water Creation Magic: Sea Dragon’s Cradle', 'sea-dragon-cradle', 'hover', 'brace', 1120),
  'sea-dragon-nest': makeTechnique('Water Creation Magic: Sea Dragon’s Nest', 'sea-dragon-nest', 'hover', 'brace', 1080),
  'noelle-point-blank-roar': makeTechnique('Point-Blank Sea Dragon’s Roar', 'noelle-point-blank-roar', 'advance', 'cast', 1060),
  'sea-dragon-gods-vortex': makeTechnique('Water Magic: Sea Dragon God’s Vortex', 'sea-dragon-gods-vortex', 'advance', 'spin', 1140),
  'sea-dragon-gods-tail': makeTechnique('Water Magic: Sea Dragon God’s Tail', 'sea-dragon-gods-tail', 'advance', 'spin', 1020),
  'sea-dragon-roar-volley': makeTechnique('Sea Dragon’s Roar: Twin Volley', 'sea-dragon-roar-volley', 'hover', 'cast', 1180),
  'valkyrie-lance-spiral': makeTechnique('Valkyrie Armor: Spiral Drill', 'valkyrie-lance-spiral', 'dash', 'rush', 1000),
  'sea-dragon-cradle-counter': makeTechnique('Sea Dragon’s Cradle: Flow Counter', 'sea-dragon-cradle-counter', 'advance', 'brace', 1120),
} as const;

export type CloverTechnique = keyof typeof CLOVER_TECHNIQUES;

/** Complete pools include the existing main-catalogue moves. Adding a technique
 * expands the repertoire; it does not lengthen the scheduler's 1–3 move combos. */
export const CLOVER_REPERTOIRES = {
  'zetten-mode': [
    'anti-magic-zetten', 'black-slash', 'black-meteorite',
    'zetten-counter-cut', 'asta-causality-break', 'asta-bull-thrust',
    'zetten-slasher-draw', 'zetten-slayer-rebound', 'zetten-dweller-return', 'zetten-destroyer-pulse',
  ],
  'devil-union': [
    'infinite-slash-equinox', 'black-divider', 'black-hurricane',
    'devil-black-slash-barrage', 'devil-causality-guard', 'devil-cross-slash',
    'devil-divider-cleave', 'devil-slasher-draw', 'devil-dweller-return', 'devil-destroyer-release',
  ],
  'spirit-dive': [
    'spirit-storm', 'spirit-of-zephyr', 'spirit-of-euros',
    'spirit-of-boreas', 'spirit-of-notos',
    'quartile-hasta', 'quartile-scutum', 'quartile-flagellum', 'conjunction', 'never-never-land',
  ],
  'lightning-dash': [
    'luck-ceranos', 'luck-thunderclap-claw', 'luck-thunderclap-orb',
    'luck-thunder-god-kick', 'luck-rune-rebound', 'luck-twin-thunderbolt',
    'luck-thunder-god-palm', 'luck-ceranos-return', 'luck-thunderbolt-scatter', 'luck-cross-claw',
  ],
  'fire-mode': [
    'calidos-brachium', 'calidos-brachium-barrage', 'calidos-brachium-purgatory-abyss',
    'calidos-purgatory', 'calidos-flame-burial', 'excelicitus-leonum',
    'calidos-uppercut', 'calidos-crossfire', 'calidos-burning-counter', 'calidos-zone-press',
  ],
  'water-mode': [
    'sea-dragon-roar', 'valkyrie-lance', 'sea-dragon-cradle', 'sea-dragon-nest',
    'noelle-point-blank-roar', 'sea-dragon-gods-vortex', 'sea-dragon-gods-tail',
    'sea-dragon-roar-volley', 'valkyrie-lance-spiral', 'sea-dragon-cradle-counter',
  ],
} as const;
