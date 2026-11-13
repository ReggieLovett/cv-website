# Pokémon sprites

Fan tribute. Pokémon and these sprites are © Nintendo, Creatures Inc. and GAME FREAK inc. / The Pokémon Company. This site is not affiliated with or endorsed by any of them.

Black/White (Gen 5) style sprites, kept in Pokémon Showdown's directory layout:

- `gen5ani/`, `gen5ani-shiny/`: animated sprites from [Pokémon Showdown](https://play.pokemonshowdown.com/sprites/). For Pokémon introduced after Black/White, these are community-made sprites in the Gen 5 style.
- `gen5/`, `gen5-shiny/`: still sprites from Pokémon Showdown. They are used for party icons, paused or reduced-motion views, and forms with no animated sprite (Decidueye, Mega Dragonite, Mega Greninja), which the site animates in a Gen 5 style by moving bands of the still sprite.
- `gen5/greninja-mega.png`: from the [PokeAPI sprites repository](https://github.com/PokeAPI/sprites) (Black/White set, id 10294). Showdown only has a downscaled render of it.

Run `npm run sprites:pokemon` after changing a team in `lib/pokemon-team.ts`. It downloads any sprites that are missing.
