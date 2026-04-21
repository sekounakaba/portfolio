'use client';

import { useEffect, useRef, useSyncExternalStore, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react';

const emptySubscribe = () => () => {};

export default function Hero() {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isClient]);

  if (!isClient) return null;

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm md:text-base text-emerald-400 font-medium tracking-widest uppercase mb-4">
            Welcome to my portfolio
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="gradient-text">Sekouna KABA</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-2 font-medium">
            Full-Stack Developer | Data Engineer | AI Engineer | Data Architect
          </p>
          <p className="text-sm text-muted-foreground/70 mb-10">
            11+ years of experience building innovative solutions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8" onClick={() => scrollTo('projects')}>
            Voir mes projets
          </Button>
          <Button size="lg" variant="outline" className="border-emerald-600/50 text-emerald-400 hover:bg-emerald-600/10 px-8" onClick={() => scrollTo('contact')}>
            Me contacter
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center gap-6"
        >
          <a href="https://github.com/sekounakaba" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-emerald-400 transition-colors">
            <Github className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com/in/sekouna-kaba" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-emerald-400 transition-colors">
            <Linkedin className="w-6 h-6" />
          </a>
          <a href="mailto:kaba.sekouna@gmail.com" className="text-muted-foreground hover:text-emerald-400 transition-colors">
            <Mail className="w-6 h-6" />
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <button onClick={() => scrollTo('about')} className="text-muted-foreground hover:text-emerald-400 transition-colors animate-bounce">
          <ArrowDown className="w-6 h-6" />
        </button>
      </motion.div>
    </section>
  );
}
