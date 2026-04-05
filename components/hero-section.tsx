'use client';

import { Github, Mail, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function HeroSection() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 inline-block animate-fade-in">
          <Avatar className="w-32 h-32 mx-auto border-4 border-primary/20 shadow-lg">
            <AvatarImage src="/profile.jpg" />
            <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              RL
            </AvatarFallback>
          </Avatar>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent animate-fade-in-up">
          Reggie Lovett
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground mb-4 animate-fade-in-up animation-delay-100">
          BSIT Student | Aspiring Developer
        </p>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
          A second-year Bachelor of Science in Information Technology student passionate about technology and software development.
          Committed to building strong technical foundations while developing practical problem-solving skills through academic projects and extracurricular activities.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-fade-in-up animation-delay-300">
          <Button size="lg" onClick={scrollToContact} className="group">
            <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Get in Touch
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://github.com/ReggieLovett"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Github className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              GitHub
            </a>
          </Button>
        </div>

        <div className="animate-bounce">
          <ArrowDown className="mx-auto h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
}
