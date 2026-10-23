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

The Zelda theme changes the knight into a green elf called the Wayfinder, with its own greeting, comments, suggested questions, and server-selected reply voice. Both personalities use the same portfolio facts. Questions enter with a short transition, thinking dots indicate an active request, and new answers reveal in a brief word ripple; reduced-motion preferences show messages immediately.

Both sprites have animated idle frames and independent randomized clocks for small tricks (8–24 seconds), transformations (18–42 seconds), and rests between walks (3–9 seconds). Powers can interrupt a walk; ambient tricks keep their own timing. The knight bounces in place, salutes, and checks the horizon; the Wayfinder twirls, channels a forest charm, and conjures pixel sparkles. The actor stays anchored to the bottom edge and travels only left and right. Every idle, transformation, and battle pose keeps its feet on that baseline, while speech bubbles stay within the viewport edges. Pause holds the current animation until resumed, hover and keyboard focus hold automatic movement, and hidden tabs suspend the clocks. Actions avoid immediate repeats.

One fixed ellipsis button opens all sprite controls: battle moves, a random trick, pause/resume, reset appearance, and thirteen powers. Sage Mode keeps a headband, cape, and eye markings; Chakra Cloak keeps golden gear; Draw Sword leaves a held blade; Lightning Step keeps blue gear and a bolt mark. Phoenix Flame adds an ember cape, Frost Armor adds a crystal crown, and Shadow Clone leaves violet gear and faint companions. Four Asta- and Yuno-inspired forms extend the repertoire: Zetten releases a focused slash, Devil Union adds dark wings, Star Magic gathers a constellation, and Spirit Dive channels a guardian wind. Baryon Mode adds a red-orange fox cloak and tails; Six Paths Eyes adds a dark collar and paired purple/red eyes inspired by Sasuke. Both characters can use every power; the Wayfinder draws a gold sword. A completed form stays through idle, walking, pause, and chat until another transformation or Reset appearance. Switching themes restores the new character’s base form. Reduced motion keeps automatic movement off while allowing direct appearance changes without charging. Escape closes the controls panel.

Each completed transformation demonstrates a combination of one to three form-specific moves. Later battles use a separate randomized 9–18 second timer, and **Battle moves** replays a combination on demand. The named anime forms use researched moves: Sage Mode has Frog Kumite, Sage Art: Giant Rasengan, and Rasenshuriken; Baryon uses Rasengan, a tail strike, and a breakthrough dash; Chakra Cloak combines chakra-hand attacks with a Rasengan carried by an extended golden hand, Rasenshuriken, and a Tailed Beast Bomb; Sasuke uses Chidori, Amaterasu, and a Susanoo sword attack. Asta’s sets use anti-magic cuts and sword techniques, while Yuno’s Star Magic uses a constellation beam, shield, and Conjunction, separately from Spirit Dive’s wind cannon, sword, and bow. Each of the five original fantasy forms also has its own three-move set. [Move references and adaptation notes](docs/companion-move-references.md) distinguish manga/anime references, official game moves, and original fantasy effects.

All movement stays along the bottom, including charges, dashes, and resize recovery. Dashes leave horizontal afterimages; Chakra Cloak and Baryon Mode travel faster than base form, with Baryon the fastest. Opening the fixed controls pauses even a requested combination; pause/resume, hidden tabs, and interaction holds preserve the current move or gap. Reset, chat opening, resize, and theme changes cancel pending moves without leaving effects behind.

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
