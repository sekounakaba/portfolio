'use client';

import { useSyncExternalStore } from 'react';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Projects from '@/components/portfolio/Projects';
import CourseDashboard from '@/components/english/CourseDashboard';
import Contact from '@/components/portfolio/Contact';
import { Separator } from '@/components/ui/separator';

const emptySubscribe = () => () => {};

export default function Home() {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  if (!isClient) return null;

  return (
    <main className="min-h-screen">
      <Hero />
      <Separator className="section-gradient" />
      <About />
      <Separator className="section-gradient" />
      <Projects />
      <Separator className="section-gradient" />
      <CourseDashboard />
      <Separator className="section-gradient" />
      <Contact />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sekouna KABA. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="https://datasphereinnovation.fr" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
              DataSphere Innovation
            </a>
            <span>•</span>
            <a href="https://github.com/sekounakaba" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
