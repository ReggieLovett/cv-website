'use client';

import { ExternalLink, Github, Image } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const projects = [
  {
    title: 'Task Management Dashboard',
    description:
      'A modern task management application with drag-and-drop functionality, real-time updates, and team collaboration features. Includes priority levels, due dates, and progress tracking.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    image: '/placeholder-project.jpg',
    github: 'https://github.com',
    demo: 'https://demo.com',
  },
  {
    title: 'Weather Forecast App',
    description:
      'Interactive weather application providing real-time weather data, 7-day forecasts, and location-based weather alerts. Features beautiful UI with animated weather icons and responsive design.',
    techStack: ['JavaScript', 'API Integration', 'CSS3', 'HTML5'],
    image: '/placeholder-project.jpg',
    github: 'https://github.com',
    demo: 'https://demo.com',
  },
  {
    title: 'Recipe Sharing Platform',
    description:
      'Community-driven recipe sharing platform where users can post, browse, and save recipes. Includes user authentication, rating system, and advanced search with filters.',
    techStack: ['PHP', 'MySQL', 'Bootstrap', 'jQuery'],
    image: '/placeholder-project.jpg',
    github: 'https://github.com',
    demo: 'https://demo.com',
  },
  {
    title: 'Expense Tracker',
    description:
      'Personal finance management tool for tracking income and expenses with visual analytics. Features budget planning, category management, and monthly financial reports with charts.',
    techStack: ['Python', 'Flask', 'SQLite', 'Chart.js'],
    image: '/placeholder-project.jpg',
    github: 'https://github.com',
    demo: 'https://demo.com',
  },
  {
    title: 'Blog Content Management System',
    description:
      'Full-featured CMS for creating and managing blog content with rich text editor, media uploads, and SEO optimization. Includes user roles, comments system, and analytics dashboard.',
    techStack: ['Next.js', 'Tailwind CSS', 'MySQL', 'REST API'],
    image: '/placeholder-project.jpg',
    github: 'https://github.com',
    demo: 'https://demo.com',
  },
  {
    title: 'Online Quiz Application',
    description:
      'Interactive quiz platform with timed questions, instant feedback, and score tracking. Features multiple question types, difficulty levels, and performance analytics for students.',
    techStack: ['JavaScript', 'PHP', 'MySQL', 'Bootstrap'],
    image: '/placeholder-project.jpg',
    github: 'https://github.com',
    demo: 'https://demo.com',
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and personal projects demonstrating various technologies and problem-solving approaches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              <CardHeader className="p-0">
                <div className="relative h-48 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 rounded-t-lg flex items-center justify-center overflow-hidden">
                  <Image className="h-16 w-16 text-muted-foreground/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 group/btn"
                  asChild
                >
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    View Project
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 group/btn"
                  asChild
                >
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                    GitHub
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
