'use client';

import { useState, useMemo, useCallback, useSyncExternalStore, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame, Zap, BookOpen, Trophy, Star } from 'lucide-react';
import { LEVELS, type CEFRLevel } from './english-data';
import VocabularyBuilder from './VocabularyBuilder';
import GrammarExercises from './GrammarExercises';
import ListeningPractice from './ListeningPractice';
import DailyChallenge from './DailyChallenge';
import ProgressStats from './ProgressStats';

const emptySubscribe = () => () => {};

interface CourseProgress {
  xp: number;
  streak: number;
  lastActive: string;
  wordsMastered: number[];
  grammarCompleted: number[];
  challengesCompleted: number;
  bestChallengeScore: number;
  totalCorrect: number;
  totalAnswered: number;
}

const STORAGE_KEY = 'english-course-progress';

const defaultProgress: CourseProgress = {
  xp: 0,
  streak: 0,
  lastActive: '',
  wordsMastered: [],
  grammarCompleted: [],
  challengesCompleted: 0,
  bestChallengeScore: 0,
  totalCorrect: 0,
  totalAnswered: 0,
};

// Module-level cache so getSnapshot always returns the same ref if nothing changed
let cachedProgress: CourseProgress = defaultProgress;
let cachedRaw = '';

function getDefaultProgress(): CourseProgress {
  return defaultProgress;
}

function readProgressFromStorage(): CourseProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? '';
    if (raw === cachedRaw) return cachedProgress;
    cachedRaw = raw;
    cachedProgress = raw ? JSON.parse(raw) : defaultProgress;
    return cachedProgress;
  } catch { /* ignore */ }
  return defaultProgress;
}

function saveProgress(progress: CourseProgress) {
  try {
    const raw = JSON.stringify(progress);
    cachedRaw = raw;
    cachedProgress = progress;
    localStorage.setItem(STORAGE_KEY, raw);
  } catch { /* ignore */ }
}

// Subscribe to storage events to detect changes from other tabs
function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

// Module-level listener counter so updates from same tab re-render consumers
let listeners = new Set<() => void>();
function emitChange() { listeners.forEach((fn) => fn()); }
function subscribeToProgress(callback: () => void) {
  listeners.add(callback);
  window.addEventListener('storage', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

export function useCourseProgress() {
  const progress = useSyncExternalStore(subscribeToProgress, readProgressFromStorage, getDefaultProgress);

  const updateProgress = useCallback((updater: (prev: CourseProgress) => CourseProgress) => {
    const current = readProgressFromStorage();
    const next = updater(current);
    saveProgress(next);
    emitChange();
  }, []);

  // Update streak on first client render
  const streakInit = useRef(false);
  useEffect(() => {
    if (streakInit.current) return;
    streakInit.current = true;
    const current = readProgressFromStorage();
    const today = new Date().toDateString();
    if (current.lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newStreak = current.lastActive === yesterday.toDateString() ? current.streak + 1 : 1;
      saveProgress({ ...current, lastActive: today, streak: newStreak });
      emitChange();
    }
  }, []);

  return { progress, updateProgress };
}

function getCurrentLevel(xp: number): CEFRLevel {
  let current = 'A1';
  for (const l of LEVELS) {
    if (xp >= l.xpRequired) current = l.level;
    else break;
  }
  return current;
}

function getNextLevelInfo(currentLevel: CEFRLevel, xp: number) {
  const idx = LEVELS.findIndex((l) => l.level === currentLevel);
  if (idx >= LEVELS.length - 1) return null;
  const next = LEVELS[idx + 1];
  const currentLevelData = LEVELS[idx];
  const range = next.xpRequired - currentLevelData.xpRequired;
  const progressInRange = xp - currentLevelData.xpRequired;
  return {
    level: next.level,
    xpNeeded: range - progressInRange,
    progress: range > 0 ? (progressInRange / range) * 100 : 100,
  };
}

export default function CourseDashboard() {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const mounted = isClient;
  const { progress, updateProgress } = useCourseProgress();

  if (!isClient || !mounted) return null;

  const currentLevel = getCurrentLevel(progress.xp);
  const nextLevel = getNextLevelInfo(currentLevel, progress.xp);
  const levelInfo = LEVELS.find((l) => l.level === currentLevel)!;
  const accuracy = progress.totalAnswered > 0 ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) : 0;
  const levelProgress = nextLevel ? nextLevel.progress : 100;

  return (
    <section id="english-course" className="py-20 md:py-28 px-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-warm">English Learning Platform</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interactive English course with vocabulary, grammar, listening, and daily challenges. Track your progress from A1 to C2.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <Card className="glass-strong animated-border">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Level</div>
                  <div className="text-3xl font-bold gradient-text">{currentLevel}</div>
                  <div className="text-xs text-muted-foreground">{levelInfo.title}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400" /> XP
                  </div>
                  <div className="text-3xl font-bold text-yellow-400">{progress.xp}</div>
                  <div className="text-xs text-muted-foreground">{nextLevel ? `${nextLevel.xpNeeded} to ${nextLevel.level}` : 'MAX'}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider flex items-center justify-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400" /> Streak
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-orange-400">{progress.streak}</span>
                    <span className="text-lg streak-flame">🔥</span>
                  </div>
                  <div className="text-xs text-muted-foreground">days</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider flex items-center justify-center gap-1">
                    <BookOpen className="w-3 h-3 text-emerald-400" /> Words
                  </div>
                  <div className="text-3xl font-bold text-emerald-400">{progress.wordsMastered.length}</div>
                  <div className="text-xs text-muted-foreground">mastered</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{currentLevel} - {levelInfo.title}</span>
                  <span>{nextLevel ? nextLevel.level : 'MAX'} {Math.round(Math.min(levelProgress, 100))}%</span>
                </div>
                <Progress value={Math.min(levelProgress, 100)} className="h-3 bg-secondary" />
              </div>

              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>{progress.challengesCompleted} challenges</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-emerald-400" />
                  <span>{accuracy}% accuracy</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  <span>{progress.grammarCompleted.length} grammar done</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Tabs defaultValue="vocabulary" className="w-full">
            <TabsList className="w-full flex flex-wrap bg-card/50 backdrop-blur-sm border border-border h-auto p-1 gap-1">
              <TabsTrigger value="vocabulary" className="flex-1 min-w-[120px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <BookOpen className="w-4 h-4 mr-2" /> Vocabulary
              </TabsTrigger>
              <TabsTrigger value="grammar" className="flex-1 min-w-[120px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                ✏️ Grammar
              </TabsTrigger>
              <TabsTrigger value="listening" className="flex-1 min-w-[120px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                🎧 Listening
              </TabsTrigger>
              <TabsTrigger value="challenge" className="flex-1 min-w-[120px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Zap className="w-4 h-4 mr-2" /> Challenge
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex-1 min-w-[120px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                📊 Progress
              </TabsTrigger>
            </TabsList>
            <TabsContent value="vocabulary" className="mt-6">
              <VocabularyBuilder progress={progress} updateProgress={updateProgress} />
            </TabsContent>
            <TabsContent value="grammar" className="mt-6">
              <GrammarExercises progress={progress} updateProgress={updateProgress} />
            </TabsContent>
            <TabsContent value="listening" className="mt-6">
              <ListeningPractice progress={progress} updateProgress={updateProgress} />
            </TabsContent>
            <TabsContent value="challenge" className="mt-6">
              <DailyChallenge progress={progress} updateProgress={updateProgress} />
            </TabsContent>
            <TabsContent value="stats" className="mt-6">
              <ProgressStats progress={progress} updateProgress={updateProgress} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
