export type ChatPersona = 'portfolio' | 'zelda';

type PersonaCopy = {
  name: string;
  role: string;
  welcome: string;
  intro: string;
  starters: string[];
  comments: string[];
  thinking: string;
  speaker: string;
  caption: string;
  placeholder: string;
  launcherLabel: string;
};

// Public presentation copy only. Model instructions and portfolio grounding
// live separately in chat-context.ts and are assembled by the server.
export const CHAT_PERSONAS: Record<ChatPersona, PersonaCopy> = {
  portfolio: {
    name: 'Reggie’s guide',
    role: 'AI assistant',
    welcome: 'A little help exploring.',
    intro: 'I’m Reggie’s portfolio guide. Ask about his projects, skills, or how to get in touch.',
    starters: [
      'What does Reggie build?',
      'Show me his projects.',
      'How can I contact him?',
    ],
    comments: [
      'Need a guide? Ask me about Reggie.',
      'There’s a story behind every project. Ask me.',
      'Looking for skills, projects, or a way to say hello?',
      'You explore. I’ll be here if you need a hand.',
    ],
    thinking: 'Finding the details…',
    speaker: 'Guide',
    caption: 'Ask me',
    placeholder: 'Ask about Reggie’s work…',
    launcherLabel: 'Chat with Reggie’s portfolio guide',
  },
  zelda: {
    name: 'The Wayfinder',
    role: 'Woodland companion',
    welcome: 'Every quest starts somewhere.',
    intro: 'I’m the Wayfinder, your companion through Reggie’s work. Choose a trail: projects, skills, or a way to say hello.',
    starters: [
      'Where does Reggie’s journey begin?',
      'Show me his latest creations.',
      'How can I reach Reggie?',
    ],
    comments: [
      'A new trail awaits. Shall we explore?',
      'Every creation has a story. Ask me.',
      'Looking for Reggie’s skills? I know the path.',
      'Take your time, traveler. I’ll be right here.',
    ],
    thinking: 'Consulting the quest journal…',
    speaker: 'Wayfinder',
    caption: 'This way',
    placeholder: 'Where shall we explore next?',
    launcherLabel: 'Chat with the Wayfinder about Reggie’s work',
  },
};
