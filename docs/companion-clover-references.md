# Black Clover companion repertoires

These five kits keep the original knight sprite and add costume, weapon, and magic layers. Each has exactly ten choices. They are small screen adaptations of a character's broader arsenal, rather than claims that every move debuted in the selected form. Yuno's Star Magic is merged into his Spirit Dive kit, retaining both magic systems, and Asta's Zetten is merged into his complete Devil Union. The scheduler still performs only one to three moves per combo.

The additions live in `lib/companion-clover-techniques.ts` and `components/companion-clover-effects.*`. Each new move has its own effect ID and renderer. All root travel stays on the bottom lane (`y = 0`); an eligible form's small body hover is separate. Effects last 650–1200 ms, follow the shared facing and pause state, and disappear under reduced motion. Their visible horizontal bounds fit the existing mobile battle corridor.

## Source and naming limits

Official publisher and anime pages establish the characters, story periods, and published material. Many late manga spell panels require licensed access. The chapter-cited Black Clover Wiki pages below are secondary references for those spell names and shapes; they are identified as such rather than presented as official art. Descriptive applications are explicitly marked in the tables and are not additional canonical spell names.

Primary references:

- [VIZ, Black Clover volume 35](https://www.viz.com/manga-books/manga/black-clover-volume-35-0/product/7830/paperback) covers Asta's Land of the Sun training. [Official Shonen Jump chapter 340 post](https://x.com/shonenjump/status/1579488432757559297) supplies the training-period costume reference.
- [Official Asta profile](https://bclover.jp/en/character/asta.php) describes his sword cutting through and deflecting magic, supporting the Spell Rebound application below.
- [Official anime Devil Union announcement](https://bclover.jp/news/detail.php?id=1136710) supplies Asta's Devil Union visual. Zetten, a technique he uses inside it, adds no costume of its own.
- [Official Yuno character page](https://bclover.jp/character/yuno.php) and [official Spirit Dive merchandise](https://bclover.jp/season1/goods/item.php?id=1021444) establish the wind-spirit visual context. The latter shows an earlier Spirit Dive appearance, not proof of every later manga feature. [VIZ chapter 310](https://www.viz.com/shonenjump/black-clover-chapter-310/chapter/23457) is the licensed Saint Spirit of Zephyr reference.
- [Official Luck character page](https://bclover.jp/en/character/luck.php) and [official Mereoleona character page](https://bclover.jp/en/character/mereoleona.php) establish their lightning and flame magic. [Shueisha volume 28](https://books.shueisha.co.jp/items/contents.html?jdcn=08882594880416315501) contains the chapter 275 Hellfire Incarnate period.
- [Official Noelle character page](https://www.shonenjump.com/j/sp_bclover/character/chara005.html), [VIZ volume 36](https://www.viz.com/manga-books/manga/black-clover-volume-36/product/8148), and [Shueisha volume 36](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-883665-2) establish her water magic and the later new power. The publisher cover asset did not load during research, so this implementation does not claim its blue/silver pixel palette reproduces a visually inspected official Dragon Form color sheet.

## Asta: complete Devil Union with Zetten

Zetten is a sword technique Asta learned in the Land of the Sun by swapping ki for anti-magic, and in the final arc he wields it inside his complete Devil Union ([Asta overview](https://en.wikipedia.org/wiki/Asta_(Black_Clover)), [Judgment Day reference](https://blackclover.fandom.com/wiki/Judgment_Day)). So it is not a transformation of its own: one Devil Union + Zetten form carries five Zetten-pool cuts beside five Devil Union techniques, the same way Yuno's Star Magic was merged into Spirit Dive. Black Slash barrages and a cross cut are recognizable uses of that arsenal, not newly named spells. Demon-Destroyer's VIZ ability name is **Fate Release**; its inward removal of magical effects motivates the contracting rings. Secondary references: [Demon-Destroyer Sword](https://blackclover.fandom.com/wiki/Demon-Destroyer_Sword) and [Anti Magic](https://blackclover.fandom.com/wiki/Anti_Magic).

| ID | Display label | Status and effect cue |
| --- | --- | --- |
| `zetten-counter-cut` | Anti-Magic Zetten: Counter Cut | Descriptive counter application: a brief concentrated cut and dark contact flash. |
| `asta-causality-break` | Demon-Destroyer: Fate Release | Named sword ability: magic contracts inward and vanishes around the sword. The internal ID retains the commonly used Causality Break wording. |
| `zetten-slasher-draw` | Demon-Slasher: Zetten Draw | Descriptive concentrated draw: a katana and a narrow contact line. |
| `devil-black-slash-barrage` | Demon-Dweller: Black Slash Barrage | Descriptive repeated Black Slash application: three staggered dark crescents. |
| `devil-cross-slash` | Demon-Slasher: Cross Cut | Descriptive sword application: two intersecting cuts; not a claim of another named Demon-Slasher spell. |

Complete Devil Union + Zetten pool: `anti-magic-zetten`, `black-divider`, `zetten-slasher-draw`, `infinite-slash-equinox`, `zetten-counter-cut`, `black-hurricane`, `devil-black-slash-barrage`, `black-meteorite`, `devil-cross-slash`, `asta-causality-break`. Zetten leads the scheduler's weighting. Black Slash, Bull Thrust, Spell Rebound, both Return attacks, the Fate Release Pulse and Wave, Anti-Magic Guard, Black Divider Cleave and Selective Draw left with the separate Zetten form.

The form's look: the anti-magic body and inside red rim, five horns, torn wings, red eyes with dark marks around them, the Demon-Slayer greatsword strapped across the back, and the Demon-Slasher katana in hand. Zetten itself adds no costume: it is the katana's bright honed edge, a slow ki ripple at the feet, and a charge that settles before one forward cut.

Visible battle weapon coverage:

| Weapon | Silhouette | Attack IDs |
| --- | --- | --- |
| Demon-Slayer | Broad blunt slab, straight crossguard, wrapped grip | `black-meteorite`, `black-divider`, `black-hurricane` |
| Demon-Dweller | Slimmer patterned double-edged blade and diamond guard | `devil-black-slash-barrage` |
| Demon-Destroyer | Scalloped blade and large ornate guard | `asta-causality-break` |
| Demon-Slasher | Narrow curved katana, small guard, wrapped hilt | `anti-magic-zetten`, `zetten-counter-cut`, `zetten-slasher-draw`, `infinite-slash-equinox`, `devil-cross-slash` |

These silhouettes are compact CSS interpretations, not traced official weapon art.

## Yuno: Star Magic and Saint Spirit Dive

The single ten-move repertoire has five Star Magic choices and five spirit choices. Its appearance retains Spirit Dive's crown, cloak, and wings, with four stars and two grimoires layered over the original knight. Quartile Flagellum connects four stars into a whip. Conjunction supplies the teleport mechanic; “Hushed Dance Counter” describes the merged animation's wind-assisted evasive counter. Never-Never Land is the later Star × Wind Spirit union field, represented by a visible miniature star dome without changing page time or other characters. Secondary references: [Quartile Flagellum](https://blackclover.fandom.com/wiki/Quartile_Flagellum), [Star Magic](https://blackclover.fandom.com/wiki/Star_Magic), and [Never-Never Land](https://blackclover.fandom.com/wiki/Never-Never_Land).

Spirit Dive's additional shapes use a wind halberd, evasive wind movement, and Notos's winged clover shield. Saint Stage describes Yuno's spirit synchronization and its effectiveness against devils; this catalogue does not invent a separate full-body “Saint” transformation. Secondary references: [Spirit of Boreas](https://blackclover.fandom.com/wiki/Spirit_of_Boreas), [Spirit's Hushed Dance](https://blackclover.fandom.com/wiki/Spirit%27s_Hushed_Dance), and [Spirit of Notos](https://blackclover.fandom.com/wiki/Spirit_of_Notos).

| New ID | Display label | Status and effect cue |
| --- | --- | --- |
| `quartile-flagellum` | Star Magic: Quartile Flagellum | Named spell: four bright star nodes joined by a sweeping light tether. |
| `conjunction` | Conjunction: Hushed Dance Counter | Descriptive combination: paired star gates, displaced wind tracks, a fading echo, and an arrival strike. The former separate teleport-counter and Hushed Dance choices are folded into this one ID. |
| `never-never-land` | Star × Wind Spirit Magic: Never-Never Land | Named field spell: a small enclosing star dome and orbiting points. |
| `spirit-of-boreas` | Spirit of Boreas | Named spirit weapon: a long shaft with a broad wind-forged halberd blade. |
| `spirit-of-notos` | Spirit of Notos | Named defensive spell: a condensed wind shield with wings and a four-leaf-clover center. |

Complete merged Spirit Dive pool: `spirit-storm`, `spirit-of-zephyr`, `spirit-of-euros`, `spirit-of-boreas`, `spirit-of-notos`, `quartile-hasta`, `quartile-scutum`, `quartile-flagellum`, `conjunction`, `never-never-land`. Zephyr displays an irregular wind-forged sword, while Boreas displays its distinct long-shafted halberd. There is no separate Star Magic chooser entry.

## Luck: Lightning Step

The selected reference remains **True Lightning Magic: Ceranos**: natural-mana arrays propel Luck as actual lightning. His equipped claws and boots support the extra combat applications. **Ultimate Lightning Magic: Lightning Battle Fiend** is a later, separate technique; its horns, tail, and body treatment are not silently added to this kit. The VIZ/Funimation orb name is **Thunderbolt Destruction**. Secondary references: [Ceranos / Keraunos](https://blackclover.fandom.com/wiki/Keraunos), [Thunderbolt Destruction / Thunderclap Crumbling Orb](https://blackclover.fandom.com/wiki/Thunderclap_Crumbling_Orb), and [Lightning Battle Fiend](https://blackclover.fandom.com/wiki/Lightning_Battle_Fiend).

| New ID | Display label | Status and effect cue |
| --- | --- | --- |
| `luck-thunder-god-kick` | Thunder God's Boots: Lightning Kick | Descriptive equipment application: an electrified boot strike and a short lightning wake. |
| `luck-rune-rebound` | Mana Method: Rune Rebound | Descriptive array-assisted movement: two angled rune footholds and a turning lightning path. |
| `luck-twin-thunderbolt` | Thunderbolt Destruction: Twin Orbs | Descriptive two-hand volley of the established orb spell: two separately timed spheres. |
| `luck-thunder-god-palm` | Thunder God's Gloves: Palm Strike | Descriptive equipment application: an open electrified palm and contact ring. |
| `luck-ceranos-return` | True Lightning Magic: Ceranos Return | Descriptive Ceranos application: a forward lightning spear and a shorter return wake over five natural-mana arrays. |
| `luck-thunderbolt-scatter` | Thunderbolt Destruction: Scatter Volley | Descriptive orb application: three projectiles travel outward on separated paths. |
| `luck-cross-claw` | Thunder God's Gloves: Cross Claw | Descriptive equipment application: two intersecting sets of claw tracks. |

Complete Luck pool: `luck-ceranos`, `luck-thunderclap-claw`, `luck-thunderclap-orb`, `luck-thunder-god-kick`, `luck-rune-rebound`, `luck-twin-thunderbolt`, `luck-thunder-god-palm`, `luck-ceranos-return`, `luck-thunderbolt-scatter`, `luck-cross-claw`. The existing Claw Strike label is descriptive too. Ceranos remains the explicitly named True Lightning attack; the ordinary orb spell is not relabeled True Magic. The additional close combat follows his equipped [Thunder God's Boots](https://blackclover.fandom.com/wiki/Thunder_God%27s_Boots) and gloves, while the volley uses the established multiple-orb capability.

## Mereoleona: Hellfire Incarnate

Hellfire Incarnate assimilates the body with fire mana; its layers use a burning mane, mantle, and limbs rather than phoenix wings. The expanded pool reaches later material, including Flame Burial and the Ultimate Magic flame allies. The VIZ spell spelling **Calidos** and VIZ label **Excelicitus Leonum** are used even where secondary page titles use other romanizations. Secondary references: [Hellfire Incarnate](https://blackclover.fandom.com/wiki/Hellfire_Incarnate), [Calidos Brachium Purgatory: Abyss](https://blackclover.fandom.com/wiki/Calidus_Brachium_Purgatory%3A_Abyss), [Flame Burial](https://blackclover.fandom.com/wiki/Calidus_Brachium_Purgatory%3A_Flame_Burial), and [Excelicitus / Exercitus Leonum](https://blackclover.fandom.com/wiki/Exercitus_Leonum).

| New ID | Display label | Status and effect cue |
| --- | --- | --- |
| `calidos-purgatory` | Mana Zone: Calidos Brachium Purgatory | Named spell: radial heat rings and surrounding fire distinguish it from the directed Abyss stream. |
| `calidos-flame-burial` | Calidos Brachium Purgatory: Flame Burial | Named later attack: a concentrated oversized flame fist with a compressed wake. |
| `excelicitus-leonum` | Fire Ultimate Magic: Excelicitus Leonum | Named later spell: three small flame ally silhouettes. The decorative motif does not simulate resurrection or an independent game system. |
| `calidos-uppercut` | Calidos Brachium: Rising Fist | Descriptive flame-fist application: a rising fist and curved heat wake. The root actor stays in its bottom lane. |
| `calidos-crossfire` | Mana Zone: Calidos Brachium Crossfire | Descriptive Mana Zone application: flame fists visibly travel inward from opposite sides of a marked area. |
| `calidos-burning-counter` | Calidos Brachium: Burning Counter | Descriptive contact application: a flame guard receives an incoming spell before the return punch. |
| `calidos-zone-press` | Mana Zone: Surrounding Flame Press | Descriptive Mana Zone application: three surrounding flame pillars and a visible ground ellipse. |

Complete Mereoleona pool: `calidos-brachium`, `calidos-brachium-barrage`, `calidos-brachium-purgatory-abyss`, `calidos-purgatory`, `calidos-flame-burial`, `excelicitus-leonum`, `calidos-uppercut`, `calidos-crossfire`, `calidos-burning-counter`, `calidos-zone-press`. The additional directional punches use the established ability to attack from several directions inside Mana Zone, rather than introducing four new canonical spell names. Secondary reference: [Mereoleona's combat and spells](https://blackclover.fandom.com/wiki/Mereoleona_Vermillion).

## Noelle: Leviathan Valkyrie Armor

This kit replaces the former ice option with `water-mode`. The intended story reference is Noelle's **Leviathan Dragon Form**, introduced in chapter 359, using water-forged Valkyrie armor. It is distinct from Undine's Saint Valkyrie form, the mermaid variation, and the later Anti-Magic Black Dragon form. The knight's armor, water lance, head ornaments, and wing-like water accents are an adaptation to the existing sprite's proportions, not a replacement character body. Secondary reference: [Valkyrie Dress / official-English Valkyrie Armor](https://blackclover.fandom.com/wiki/Valkyrie_Dress).

The ten moves draw from her broader water arsenal. A lance thrust is a descriptive attack with her established weapon. Cradle and Nest share a protective water-sphere family but retain different roles and silhouettes: smooth transport bubble versus rough defensive currents. The Dragon God's Vortex and Tail are later named Dragon Form techniques. Secondary references: [Sea Dragon's Roar](https://blackclover.fandom.com/wiki/Sea_Dragon%27s_Roar), [Point-Blank Sea Dragon's Roar](https://blackclover.fandom.com/wiki/Point-Blank_Sea_Dragon%27s_Roar), [Cradle](https://blackclover.fandom.com/wiki/Sea_Dragon%27s_Cradle), [Nest](https://blackclover.fandom.com/wiki/Sea_Dragon%27s_Nest), [Vortex](https://blackclover.fandom.com/wiki/Sea_Dragon_God%27s_Vortex), and [Tail](https://blackclover.fandom.com/wiki/Sea_Dragon_God%27s_Tail).

| New ID | Display label | Status and effect cue |
| --- | --- | --- |
| `sea-dragon-roar` | Water Creation Magic: Sea Dragon's Roar | Named spell: an open-jawed water-dragon head driven along a short water jet. |
| `valkyrie-lance` | Valkyrie Armor: Lance Thrust | Descriptive weapon application: a spiral water lance and narrow rush. |
| `sea-dragon-cradle` | Water Creation Magic: Sea Dragon's Cradle | Named transport spell: a smooth rounded enclosure with orbiting water globs. |
| `sea-dragon-nest` | Water Creation Magic: Sea Dragon's Nest | Named defensive spell: overlapping rough water-current rings. |
| `noelle-point-blank-roar` | Point-Blank Sea Dragon's Roar | Named close-range variation: a compact contact burst instead of another long traveling dragon. |
| `sea-dragon-gods-vortex` | Water Magic: Sea Dragon God's Vortex | Named Dragon Form spell: rotating overlapping water coils around the armor. |
| `sea-dragon-gods-tail` | Water Magic: Sea Dragon God's Tail | Named Dragon Form spell: a broad curved water-tail sweep. |
| `sea-dragon-roar-volley` | Sea Dragon's Roar: Twin Volley | Descriptive repeated Roar application: two compact dragon-head projectiles travel on staggered paths. |
| `valkyrie-lance-spiral` | Valkyrie Armor: Spiral Drill | Descriptive lance application: moving coils visibly spin around a thrusting water lance. |
| `sea-dragon-cradle-counter` | Sea Dragon's Cradle: Flow Counter | Descriptive defensive application: a transport bubble receives the incoming cue and a short water crescent follows. It does not claim Cradle canonically reflects spells. |

Complete Noelle pool: `sea-dragon-roar`, `valkyrie-lance`, `sea-dragon-cradle`, `sea-dragon-nest`, `noelle-point-blank-roar`, `sea-dragon-gods-vortex`, `sea-dragon-gods-tail`, `sea-dragon-roar-volley`, `valkyrie-lance-spiral`, `sea-dragon-cradle-counter`.
