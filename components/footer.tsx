'use client';

import { Github, Linkedin, Mail, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/ReggieLovett',
      label: 'GitHub',
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/reggielovett/',
      label: 'LinkedIn',
    },
    {
      icon: Mail,
      href: 'mailto:reggielovett143@gmail.com',
      label: 'Email',
    },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex space-x-6">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={link.label}
                >
                  <Icon className="h-5 w-5 hover:scale-110 transition-transform" />
                </a>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <p>
              © {currentYear} Reggie Lovett. All rights reserved.
            </p>
          </div>

          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <p>Built with</p>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <p>using Next.js & shadcn/ui</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
