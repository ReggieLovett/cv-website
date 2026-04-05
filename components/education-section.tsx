'use client';

import { GraduationCap, Award, BookOpen, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function EducationSection() {
  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Education</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My academic journey and continuous learning in technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  2022 - 2026
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Bachelor of Science in Information Technology
              </h3>
              <p className="text-muted-foreground font-medium">
                St. Paul University Philippines, Tuguegarao | 2nd Year Student
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Comprehensive program covering software development, database management,
                networking, and system analysis. Focus on modern web technologies,
                programming languages, and IT infrastructure.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Relevant Coursework</p>
                    <p className="text-sm text-muted-foreground">
                      Data Structures, Web Development, Database Systems,
                      Object-Oriented Programming, Software Engineering
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Academic Achievements</p>
                    <p className="text-sm text-muted-foreground">
                      Dean's List, Outstanding Academic Performance in Programming
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-1">Program Focus</h3>
                    <p className="text-sm text-muted-foreground">
                      Core competencies and practical skills
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 mr-3"></div>
                    <div>
                      <p className="font-medium">Programming Fundamentals</p>
                      <p className="text-sm text-muted-foreground">
                        C++, Python, Java, and PHP
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 mr-3"></div>
                    <div>
                      <p className="font-medium">Web Development</p>
                      <p className="text-sm text-muted-foreground">
                        HTML and CSS fundamentals
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 mr-3"></div>
                    <div>
                      <p className="font-medium">Academic Engagement</p>
                      <p className="text-sm text-muted-foreground">
                        Active participation in university and educational events
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
