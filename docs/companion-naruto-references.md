# Naruto repertoire expansion

These additions keep the portfolio's original knight/elf body. Chakra, clones,
weapons, and impacts are local overlays. Shadow clones use the current persona's
original atlas through `--sprite-image`, `--sprite-size`, `--sprite-idle-x`, and
`--sprite-y`. No full-size Naruto/Sasuke body is introduced.

Each of the four repertoires has ten moves, including its existing moves. All new
move IDs equal their effect renderer IDs. The shared technique helper keeps body
translation at Y=0; the existing actor owns horizontal travel and any authorized
hover. Effects occupy a 64 × 84 local wrapper, with visible geometry bounded to local X approximately −92…156 px,
and clip at the existing 84 px floor. The animation duration is 820–1200 ms.

## Sage Mode

The [official Two Saviors retrospective](https://naruto-official.com/en/news/01_1321)
identifies Giant Rasengan, Frog Kumite, Rasenshuriken, and Rasengan Barrage during
the Pain fight. The [official Sage Mode figure article](https://naruto-official.com/en/news/01_1777)
specifically shows two Rasengan attachments for recreating Rasengan Barrage.
The [official Sage Mode Shinobi Striker introduction](https://naruto-official.com/en/news/01_2671)
describes a close-range natural-energy strike followed by a shadow clone carrying
a Rasengan, as well as clone follow-ups during the enhancement.

| New ID | Display / source boundary | Distinct local shape |
| --- | --- | --- |
| `sage-twin-rasengan` | Sage Art: Twin Rasengan is a descriptive two-orb rendition of the sourced Rasengan Barrage, not a separately asserted canonical jutsu name. | Two small hand orbs move together with counter-rotating rings. |
| `sage-rasengan-barrage` | Rasengan Barrage; based on the retrospective's Sage Mode attack. | Three staggered original-body clones each thrust a Rasengan. |
| `sage-shadow-clone` | Sage Mode: Shadow Clone Follow-Up; descriptive label for the official game's clone follow-up behavior. | Smoke marks a decoy and a second horizontal clone delivers one orb. |

## Six Paths KCM

This is the Six Paths-enhanced Kurama cloak, not a claim that early KCM has every
tailed-beast nature. Bandai's [official Tamashii Lava Rasenshuriken product](https://tamashiiweb.com/item/14626/?wovn=en)
names the technique and depicts its molten core, wind blade, and billowing smoke.
The [official Six Paths Sage Mode: Light Ninja Voltage announcement](https://naruto-official.com/en/news/01_1674)
describes a chakra-blade attack followed by shadow clones throwing Rasenshurikens
imbued with tailed-beast chakra. The latter is explicitly a licensed game move.

| New ID | Display | Distinct local shape |
| --- | --- | --- |
| `lava-rasenshuriken` | Sage Art: Lava Style Rasenshuriken | Orange molten nucleus, white four-point spinning wind disc, and rising steam. |
| `six-paths-shadow-rasen` | Six Paths: Shadow Clone: Rasen | Short gold blade slash, then two original-body clones and separate thrown discs. |

## Baryon Mode

The [official Baryon database](https://naruto-official.com/en/news/01_1895)
explains the form's life-consuming fusion and its effect through physical contact.
That is the basis for keeping additions focused on close combat. The
[official Shinobi Striker Baryon DLC page](https://naruto-official.com/en/news/01_1322)
names Bullet Barrage, Tail Breaker, Breakthrough, and a Rasengan follow-up, while
describing the chakra-coated fist rush. The [official Ninja Voltage card announcement](https://naruto-official.com/en/news/01_1633)
names Baryon: Tail Barrage and describes repeated tail attacks. These game moves
are documented as game adaptations, rather than attributed to the manga fight.
The [officially distributed Crunchyroll episode 217 clip](https://www.youtube.com/watch?v=rAwl5ucyQYo)
provides the close-range physical-combat reference for the counter kick.

| New ID | Display / source boundary | Distinct local shape |
| --- | --- | --- |
| `baryon-bullet-barrage` | Baryon Bullet Barrage; Shinobi Striker name. | Five staggered chakra-coated fists with three compact contact impacts. |
| `baryon-counter-kick` | Baryon Counter Kick; a descriptive taijutsu adaptation, not a new canonical named ninjutsu. | One low foot thrust and curved kick path, followed by a small contact burst. |
| `baryon-tail-barrage` | Baryon: Tail Barrage; Ninja Voltage name. | Three independently timed long chakra-tail strikes at different angles. |

## Sasuke with Six Paths eyes

The [official Six Paths Light / Rinne Sharingan Shadow card announcement](https://naruto-official.com/en/news/01_1674)
describes Heavenly Hand Power swapping with an arrow before a Chidori follow-up.
The [official Bandai patch 2.56](https://www.bandainamcoent.com/es_mx/news/naruto-to-boruto-shinobi-striker-patch-version-2-56)
names Inferno Style: Susano'o Flame Control and describes multiple arrow shots
that explode on impact. The [official Storm Connections form reveal](https://naruto-official.com/en/news/01_1446)
and [Bandai character announcement](https://en.bandainamcoent.eu/naruto/news/naruto-x-boruto-ultimate-ninja-storm-connections-discover-the-new-characters)
explicitly attribute Planetary Devastation to Sasuke. These sources concern his
Rinnegan-equipped game appearances; no ability is assigned to a later version
that has lost that eye.

| New ID | Display | Distinct local shape |
| --- | --- | --- |
| `heavenly-hand-power` | Heavenly Hand Power: Shadow Chidori | Two Rinnegan-colored swap markers, an arrow moving the opposite way, then a short blue-white lightning fork. |
| `inferno-flame-control` | Inferno Style: Susano'o Flame Control | Purple Susano’o armor surrounds the original sprite, with a bow and three separately released black-flame arrows. |
| `planetary-devastation` | Planetary Devastation | A dark gravity seed visibly pulls six pieces of rubble inward. This is a bounded abstraction of the trapping technique, without a falling full-page meteor. |

## Motion and lifecycle contract

- Predetermined CSS effects signal the currently selected battle move; only
  `transform` and `opacity` animate. Existing duration and easing variables apply.
- Child opacity defaults to zero, so only the active `data-battle` selector draws.
- Top-level effect spans must remain direct children of `floatBody`; its existing
  pause selector freezes all their descendants during pause, interaction holds,
  hidden state, and chat opening.
- The effects stylesheet hides all transient wrappers under reduced motion.
  It does not alter persistent form clothing, original sprite frames, or mobility.

## Ten-move expansion

These four additions per kit preserve the existing six. The labels below distinguish licensed game techniques and descriptive performances of established abilities. The [official Six Paths game notes](https://naruto-official.com/en/news/01_1825) explicitly describe Naruto's tailed-beast Rasenshurikens, small-bomb barrage and Kurama firing bombs from his mouth. The [official development article](https://naruto-official.com/en/news/01_1719) identifies Six Paths Naruto among users of Truthseeker Orbs; the compact salvo is a creative application of that established mechanic. The [official Naruto birthday summoning event](https://naruto-official.com/en/news/01_2435) depicts Sage Naruto and his toad summons; the assist choreography is a small adaptation.

| Form | Added move | Visual and source boundary |
| --- | --- | --- |
| Sage | Sage Art: Massive Rasengan Barrage | Two current-body clones press oversized blue hand orbs; a larger version of the sourced Sage barrage. |
| Sage | Sage Mode: Uzumaki Clone Barrage | Three original-body clones strike at staggered positions; descriptive clone/taijutsu combination. |
| Sage | Summoning Jutsu: Toad Assist | A bounded toad head rises from smoke and releases a short water stream. Summoning is established; the small assist is creative choreography. |
| Sage | Shadow Clone: Rasenshuriken Feint | One decoy fades as a rotating wind disc releases; descriptive use of clones and the sourced ranged technique. |
| Six Paths KCM | Truth-Seeking Orbs: Salvo | Five dark, gold-edged orbs separate and travel; descriptive application of the Six Paths orb arsenal. |
| Six Paths KCM | Kurama Chakra: Fox-Head Guard | A golden fox-head-shaped shield dome protects the same original knight. This is the user's requested defensive visual adaptation, not an asserted canonical or licensed-game jutsu name. It replaces the healing move while preserving ten techniques. |
| Six Paths KCM | Six Paths: Super Tailed Beast Rasen Shuriken | Giant chakra hands accompany several colored chakra-nature discs that spin and travel away; licensed Ninja Voltage name. The hands are a partial construct without a full fox body. |
| Six Paths KCM | Six Paths: Tailed Beast Barrage | A partial Kurama head charges and fires three staggered dark chakra bombs; licensed Ninja Voltage name, adapted to the requested head-only presentation. |
| Baryon | Baryon: Scarlet Rasengan | A concentrated warm Rasengan with red arcs and a compact impact; [official game card](https://naruto-official.com/en/news/01_1633). |
| Baryon | Baryon: Charge | Orange speed wake, original-body echoes and a contact burst; the same official game announcement names the forward charge. |
| Baryon | Baryon: Destructive Fist | Two staged chakra fists and four compact impacts; [official Baryon game notes](https://naruto-official.com/en/news/01_1340). |
| Baryon | Baryon: Scarlet Flash | Original-body echoes cross horizontally with scarlet impact marks; the same official Baryon game notes supply the name. |
| Sasuke | Kirin | A dragon-like lightning head and descending bolt. [Official Final Showdown cards](https://naruto-official.com/en/news/01_1472) describe Kirin's thunderbolts; the electric dragon is a compact technique adaptation. |
| Sasuke | Indra’s Arrow | Purple Susano’o armor forms with a drawn bow and one large travelling lightning arrow. The [official Last Battle move list](https://naruto-official.com/en/news/01_1874) names both Susano’o Armor and Indra’s Arrow. |
| Sasuke | Chidori Flame Control: Conclusion | A blue-white hand thrust wrapped in violet-edged black flame; licensed Final Showdown game technique. |
| Sasuke | Fire Style: Fireball Jutsu | An orange/yellow fireball detaches, travels and blooms at its endpoint. The [official Vengeance-arc retrospective](https://naruto-official.com/en/news/01_1316) anchors Sasuke's fire arsenal. |

## Visible chakra constructs

Sasuke's **Susano’o Sword Slash**, **Inferno Style: Susano’o Flame Control**, and **Indra’s Arrow** summon a large purple translucent warrior with a pointed tengu-style helmet, bright eye slits, segmented ribs, armored arms and paired wings. Its corresponding sword or bow remains the attacking weapon; the knight/elf stays visible inside. The [official Final Showdown notes](https://naruto-official.com/en/news/01_1472) explicitly describe Susano’o swinging a katana and producing a shock wave. The larger armor silhouette is a stylized construct around the sprite, not a replacement character atlas.

Six Paths KCM uses **partial Kurama constructs** rather than a complete nine-tailed body:

- **Tailed Beast Bomb** and **Tailed Beast Barrage** form a translucent golden fox head. Dark bombs charge at its muzzle, then visibly travel across the bottom lane.
- **Chakra Arm Barrage**, **Chakra Arm Rasengan**, and **Super Tailed Beast Rasen Shuriken** form giant chakra hands. The hands strike or carry the orb/disc release without summoning a fox torso, legs or tails.
- **Kurama Chakra: Fox-Head Guard** forms a head-shaped shield dome. Its descriptive name and defensive choreography are the user's requested creative companion adaptation.

The [official Kurama/bomb cards](https://naruto-official.com/en/news/01_1825) support the mouth-fired bomb behavior; [official Kurama Link weapon notes](https://naruto-official.com/en/news/01_1794?nolangsuggestion=1) describe Kurama's claws. The compact head, hands and shield are visual adaptations of that chakra language. These references do not establish Fox-Head Guard as a separate named canonical technique.

Constructs emerge only during their designated moves and fade before the next performance. They layer behind the 48 × 84 original character, remain within the existing horizontal effect reserve, share facing and the bottom clip, pause with controls/hidden/chat state, and are absent under reduced motion. Only transform and opacity animate. These partial Kurama effects belong to Six Paths KCM; Baryon and Sage retain their own distinct effects. Every repertoire still contains ten techniques.
