'use client';

import { Briefcase, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const experiences = [
  {
    title: 'Student Leader',
    type: 'Leadership Role',
    period: 'Ongoing',
    description:
      'Serving as a student leader, contributing to the academic community through mentorship, organization of student initiatives, and fostering collaboration among peers. Demonstrating commitment to educational excellence and peer development.',
    technologies: ['Leadership', 'Mentorship', 'Organization', 'Communication'],
    icon: Users,
  },
  {
    title: 'UNESCO Summit Participant',
    type: 'Academic Engagement',
    period: 'Recent',
    description:
      'Participated in a UNESCO Summit, engaging with global perspectives on education and sustainable development. Contributed to meaningful discussions and gained insights into international educational initiatives and collaborative learning opportunities.',
    technologies: ['Global Perspectives', 'Education', 'Sustainability', 'Networking'],
    icon: Briefcase,
  },
  {
    title: 'DepEd Summit Speaker',
    type: 'Public Speaking',
    period: 'Recent',
    description:
      'Delivered a speech at a Department of Education summit, sharing perspectives on educational topics and contributing to the national dialogue on learning and development. Demonstrated public speaking skills and engagement with educational policy discussions.',
    technologies: ['Public Speaking', 'Education', 'Communication', 'Policy'],
    icon: Briefcase,
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Experience</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Academic and collaborative projects that demonstrate my technical abilities and teamwork skills
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>

          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const Icon = exp.icon;
              return (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10"></div>

                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            <Calendar className="mr-1 h-3 w-3" />
                            {exp.period}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{exp.title}</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">
                          {exp.type}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {exp.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
