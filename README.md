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

The normal guide uses the original 0x72 knight sprite. The Zelda theme switches to a separate blond adventurer in a blue Champion’s Tunic, accompanying the Wayfinder persona with its own greeting, comments, suggested questions, and server-selected reply voice. Both personalities use the same portfolio facts. Questions enter with a short transition, thinking dots indicate an active request, and new answers reveal in a brief word ripple; reduced-motion preferences show messages immediately.

Both sprites have animated idle frames and independent randomized clocks for small tricks (8–24 seconds), transformations (18–42 seconds), and rests between walks (3–9 seconds). Powers can interrupt a walk; ambient tricks keep their own timing. Reggie bounces in place, salutes, and checks the horizon; the Wayfinder twirls, channels a forest charm, and conjures pixel sparkles. The actor stays anchored to the bottom edge and travels only left and right. Root travel remains in that bottom lane. Six Paths KCM, OFA Full Overdrive, Hyper Sonic, Devil Union, Spirit Dive + Star Magic, Hellfire Incarnate, and Leviathan Dragon Armor hover 15–19 pixels above it; a separate ground shadow and idle flight pose keep the float readable. Other forms remain grounded. Speech bubbles stay within the viewport edges. Pause holds the current animation until resumed, hover and keyboard focus hold automatic movement, and hidden tabs suspend the clocks. Actions avoid immediate repeats.

One fixed ellipsis button opens all sprite controls: battle moves, a random trick, pause/resume, reset appearance, and thirteen powers. The original knight and existing cape, eye, wing, weapon, and elemental layers are restored. All bodies retain the 16×28 grid at 3× scale and four idle plus four run frames. Only the Zelda base character uses the dedicated one-row atlas. Every power keeps that persona’s original body, head, native frames, and proportions; clothing, collars, cuffs, markings, weapons, and effects are layered onto it. The researched appearances and their small-pixel adaptations are documented in the [move and appearance reference guide](docs/companion-move-references.md). Hyper Sonic uses the original body with a silver tint, quill layer, and soft prismatic aura; seven Super Emeralds converge during its transformation. Clones and dash echoes use the currently selected body. A completed form stays through idle, walking, pause, and chat until another transformation or Reset appearance. Switching themes restores that persona’s base character. Reduced motion keeps automatic movement off while allowing direct appearance changes without charging. Escape closes the controls panel. See the [sprite atlas documentation](public/sprites/README.md).

Every form has **ten researched/adapted battle techniques**, while individual performances stay at **one to three moves**. Later battles use a separate randomized 9–18 second timer, and **Battle moves** replays a combination on demand. The [complete repertoire and reference guide](docs/companion-move-references.md) lists every move, source, and visual adaptation. Naruto and Sasuke gain additional orb combinations, elemental chakra, tail attacks, teleportation, flame control, and gravity effects. Asta and Yuno gain sword applications, spirit weapons, star whips and territory magic. Luck and Mereoleona retain their distinct lightning and flame equipment with larger combat pools. Deku has ten moves, adding Detroit Smash: Quintuple, Faux 100%: Manchester Smash, and St. Louis Smash: Air Force. Draw Sword has ten original knight techniques. Yuno is a single Spirit Dive + Star Magic choice: the Spirit Dive costume keeps its crown, paired wind wings, armor and halo, adding four stars and two distinct Clover/Spade grimoires. Its ten moves combine five wind/spirit techniques and five star techniques.

**Hyper Sonic** keeps its silver/prismatic color palette and seven Super Emerald power-up, with ten attacks inspired by Super Sonic and the combat skills in **Sonic Frontiers**: Sonic Boom, Cross Slash, Quick Cyloop, Homing Shot, Loop Kick, Grand Slam, Parry Counter, Wild Rush, Cyclone Kick, and Spin Slash. The inspiration does not imply Hyper Sonic is a Frontiers character. **Leviathan Dragon Armor** replaces Frost Armor with Noelle’s water armor, dragon fins, spiral lance, and ten water/dragon techniques. The standalone **Shadow Clone** form is removed; Naruto’s sourced clone-based battle techniques remain part of his own repertoire.

All horizontal navigation stays along the bottom, including charges, dashes, and resize recovery. Seven airborne or Mana Zone costumes add a low hover within this lane; Luck’s instant Ceranos propulsion keeps a grounded idle. Pause, open controls, hidden tabs, and reduced-motion preferences also govern the new effects. Reset, chat opening, resize, and theme changes cancel pending combinations without leaving effects behind. Hyper Sonic remains the fastest form, followed by Baryon and Deku. Ranged techniques visibly release travelling discs, beams, arrows, orbs and pressure waves. Mana Zone and Never-Never Land show a bounded dome, ground perimeter and surrounding mana. Asta’s attacks equip the appropriate Demon-Slayer, Demon-Dweller, Demon-Destroyer or Demon-Slasher; Yuno uses Zephyr’s wind sword, Euros’s bow or Boreas’s halberd for the corresponding technique. These small CSS silhouettes preserve the original sprite.

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

Sasuke's Six Paths Eyes kit now summons a translucent purple Susano’o during its sword slash, Flame Control arrows and Indra’s Arrow. Six Paths KCM uses partial Kurama constructs: a fox head charges and fires tailed-beast bombs, giant chakra hands carry arm attacks and the tailed-beast Rasenshuriken, and a head-shaped shield dome appears for Fox-Head Guard. It does not summon a full nine-tailed body. These temporary chakra constructs surround the original knight or Zelda adventurer. KCM retains ten techniques, with the requested Fox-Head Guard replacing the healing move. Their appearance, attack assignments and official game references are recorded in the [Naruto move notes](docs/companion-naruto-references.md).
