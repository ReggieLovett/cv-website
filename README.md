# CV Website - Reggie Lovett

A modern, responsive CV website built with Next.js, React, and Tailwind CSS. Features a clean design with dark/light mode support, smooth animations, and professional sections showcasing skills, experience, and education.

## 🎨 Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode** - Toggle between themes for comfortable viewing
- **Smooth Animations** - Engaging fade-in and scroll animations
- **Professional Layout** - Well-organized sections for different parts of a CV
- **Modern Tech Stack** - Built with Next.js 16, React 18, and Tailwind CSS
- **Accessible Components** - Uses Radix UI for accessible UI components

## 📋 Sections

- **Hero Section** - Introduction with avatar and call-to-action buttons
- **Skills Section** - Categorized technical skills with visual badges
- **Experience Section** - Timeline of professional experiences and achievements
- **Education Section** - Academic background and learning focus areas
- **Contact Section** - Easy ways to get in touch via email and GitHub

## 🛠️ Tech Stack

- **Next.js 16.2.2** - React framework for production
- **React 18.2.0** - UI library
- **TypeScript 5.2.2** - Type-safe JavaScript
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component library
- **Lucide React** - Beautiful icon library

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ReggieLovett/cv-website.git
cd cv-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see your CV website.

### Portfolio chat setup

The walking portfolio guide opens a chat powered by Groq's `openai/gpt-oss-120b` model. Replies are grounded in the public information in `data/portfolio.ts`.

The guide is a **Pokémon team** drawn with Black/White-style (Gen 5) pixel sprites. One member is out at a time. It roams the bottom edge in its own way: Lugia, Dragonite, Decidueye and Talonflame fly in arcs, Aegislash and Hatterene float, Greninja hops, Garchomp and Zacian run, and the rest walk. Every 3–7 seconds it does something: a move (`Garchomp used Earthquake!`), a two-move combo, a wander, a switch with a Poké Ball recall, throw and release, or a transformation. The normal theme's team is Shiny Lugia, Hisuian Samurott, Bloodmoon Ursaluna, Garchomp (Mega Garchomp), Dragonite (Mega Dragonite) and Decidueye. The Zelda theme sends out a placeholder Gen 6–9 team for the Wayfinder persona: Aegislash, Greninja (Mega Greninja), Hatterene, Trevenant, Talonflame and Zacian.

**PC Box.** Each roster is bigger than its party of six; the rest wait in the PC Box. Pick any of them in the **⋯** menu to send it out (the one out now goes to the Box), and the team also rotates Box Pokémon in on its own. The portfolio Box holds Rayquaza (Mega), Groudon and Kyogre (Primal Reversion on entry, as in Omega Ruby and Alpha Sapphire), Zekrom, Reshiram, Latias (Mega), Darkrai, Articuno, Sceptile (Mega), Swampert (Mega), Metagross (Mega), Gallade (Mega), Haxorus, Darmanitan (Zen Mode), Feraligatr and Milotic. The Zelda Box keeps to Gen 6–9: Koraidon, Skeledirge, Tinkaton, Corviknight and Slither Wing. Only the party's sprites are preloaded; Box Pokémon load when sent out.

**Transformations.** Mega Evolution works as in the games. The Zelda team also changes form. Aegislash's Stance Change is automatic: it changes to Blade Forme before any attacking move and back to Shield Forme for King's Shield. Zacian takes up the Rusted Sword and becomes the Crowned Sword, which turns Iron Head into Behemoth Blade. Hatterene can Gigantamax for three moves, with Dazzling Gleam becoming G-Max Smite. Unlike in the games, a Mega or changed form ends when that Pokémon is recalled, so the transformations keep happening. **Moves.** Each move has its real type and category, and its own animation recipe modelled on Pokémon Showdown's battle animations, redrawn in CSS (`components/pokemon-moves.module.css`). Aeroblast fires a trail of swelling wisps and a volley on a darkened field. Blood Moon raises a red moon that rains flare balls. Swords Dance sweeps swords across the user. Hydro Pump is a flowing water jet, Hurricane a spinning funnel, Earth Power columns of fire from the ground, Spirit Shackle a shadow arrow that pins the target, Double Team sprite afterimages, King's Shield a steel shield, and so on. Hovering or focusing the guide, opening its menu or the chat, a hidden tab, **Pause animations** and reduced-motion preferences all stop the automatic actions. While paused or with reduced motion, still sprites replace animated ones and requested actions apply without staging. The **⋯** menu holds a Fight menu with the active Pokémon's four moves, Mega Evolve or its form change, the party, pause and **Reset team**. The chat header shows the active Pokémon on a battle platform, with its nameplate, types, form tag and party tray, so you can switch or transform from inside the chat.

**Gen 5 presentation.** Following Black/White: the chat's battle camera zooms in on moves, transformations and send-outs. A sent-out Pokémon grows out of the ball, rises, then drops onto its platform; heavy Pokémon (by their real weight) land with a thud, dust and a tremor, while fliers and floaters land silently. Shiny Pokémon sparkle as they come out. Activating abilities show a banner (Aegislash's Stance Change, Zacian's Intrepid Sword on entry). Status moves report their result one message at a time ("Garchomp's Attack sharply rose!"). Contact moves hop onto the target in an arc. Pokémon and forms with no animated Gen 5 sprite (Decidueye, Mega Dragonite, Mega Greninja, Mega Sceptile, Mega Swampert, Mega Metagross, Mega Gallade, Skeledirge, Koraidon, Slither Wing and Tinkaton) get a Gen 5-style idle from their real still sprites: cut into head, body and feet bands that shift, stretch and skew a pixel at a time in hard frame steps, the way Gen 5 builds its idle animations.

Sprites live in `public/sprites/pokemon/`, downloaded from Pokémon Showdown (and one from the PokeAPI sprites repo). See [the sprite credits](public/sprites/pokemon/CREDITS.md). To change a team, edit its line in `TEAMS` in `lib/pokemon-team.ts` (add the species to `POKEDEX` if it's new), then run `npm run sprites:pokemon` to fetch the missing sprites. The Pokémon companion is a fan tribute and is not affiliated with or endorsed by Nintendo, Creatures, GAME FREAK or The Pokémon Company.

1. Copy `.env.example` to `.env.local`.
2. Set `GROQ_API_KEY` to your key from the [Groq console](https://console.groq.com/keys).
3. Restart `npm run dev`. For deployment, add the same `GROQ_API_KEY` environment variable in your Vercel or Netlify project and redeploy.

For Vercel, follow the [step-by-step Groq API key setup guide](docs/vercel-chat-setup.md), including Production/Preview selection, redeployment, and live chat testing. The local `.env.local` file does not automatically configure Vercel.

Keep the key on the server: never give it a `NEXT_PUBLIC_` prefix or paste it into a client component. `.env.local` is ignored by Git. Without a key, the guide still opens and explains that chat is not connected; it does not generate demo answers.

The browser sends recent conversation text to `POST /api/chat`; the server forwards it with the public portfolio context to Groq. Conversation history stays in page memory and is not stored by this app. Avoid including sensitive information in messages. The API validates roles and message lengths, caps request bodies at 64 KiB, forwards at most 12 recent messages within a 12,000-character budget, and times out upstream calls after 25 seconds. It returns only final answer text, excluding model reasoning.

Basic abuse controls reject requests from other browser origins and limit each server instance to 12 requests per client per minute, 60 total per minute, and four concurrent Groq calls. Client identification uses Vercel or Netlify's platform-provided IP header; other hosts share a client bucket. These in-memory limits reset on restart and do not coordinate across instances. For public production traffic, configure your hosting provider's edge rate limits and Groq project spend limits as well.

Run the isolated API tests without a real key or paid requests:

```bash
node --test tests/*.test.cjs
```

Implementation references: [Groq Chat Completions API](https://console.groq.com/docs/api-reference#chat-create), [GPT-OSS 120B](https://console.groq.com/docs/model/openai/gpt-oss-120b), and [GPT-OSS reasoning parameters](https://console.groq.com/docs/reasoning#GPT-OSS-Models).

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checker

## 🎯 Customization

To customize your CV website, edit the component files:

- **Hero Section** - `components/hero-section.tsx`
- **Skills** - `components/skills-section.tsx`
- **Experience** - `components/experience-section.tsx`
- **Education** - `components/education-section.tsx`
- **Contact Info** - `components/contact-section.tsx`

## 🌐 Deployment

This project is ready to deploy on Vercel. Simply connect your GitHub repository to Vercel for automatic deployments.

```bash
# Build for production
npm run build

# Test production build locally
npm run start
```

## 📄 About

This CV website showcases:
- **Name:** Reggie Lovett
- **Education:** BSIT 2nd Year Student
- **Skills:** C++, Python, Java, PHP, HTML, CSS
- **Contact:** reggielovett143@gmail.com

## 🔗 Links

- **GitHub:** https://github.com/ReggieLovett
- **Email:** reggielovett143@gmail.com

## 📝 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Feel free to fork this project and create your own version for your CV website!

