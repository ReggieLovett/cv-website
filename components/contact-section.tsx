'use client';

import { useState } from 'react';
import { Mail, Github, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface ContactItem {
  label: string;
  href: string;
  color?: string;
  value?: string;
  icon?: LucideIcon;
  image?: string;
  isImage?: boolean;
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const contactInfo: ContactItem[] = [
    {
      icon: Mail,
      label: 'Email',
      value: 'reggielovett143@gmail.com',
      href: 'mailto:reggielovett143@gmail.com',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: '@ReggieLovett',
      href: 'https://github.com/ReggieLovett',
      color: 'from-gray-700 to-gray-900',
    },
    {
      image: '/superman.jpg',
      label: 'Hope Core',
      isImage: true,
      href: 'https://youtu.be/wxX6j3y0vaM?si=Q0siCI3kp430fLqf',
      color: 'from-red-500 to-blue-500',
    },
  ];

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Let's Connect</h3>
              <p className="text-muted-foreground mb-6">
                Whether you have a question, want to collaborate, or just want to say hi,
                I'll try my best to get back to you as soon as possible!
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((item) => {
                const isImageItem = item.isImage === true && !!item.image;
                const isIconItem = item.isImage !== true && !!item.icon;

                return (
                  <Card
                    key={item.label}
                    className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-4 group"
                      >
                        {isImageItem && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-primary/20 flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {isIconItem && item.icon && (
                          <div
                            className={`p-3 rounded-lg bg-gradient-to-br ${item.color || 'from-blue-500 to-cyan-500'}`}
                          >
                            {(() => {
                              const Icon = item.icon;
                              return <Icon className="h-5 w-5 text-white" />;
                            })()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          {item.value && (
                            <p className="font-medium group-hover:text-primary transition-colors">
                              {item.value}
                            </p>
                          )}
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full group" size="lg">
                  <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
