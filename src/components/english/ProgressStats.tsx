'use client';

import { useState, useMemo, useSyncExternalStore, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LEVELS, ACHIEVEMENTS, type CourseProgress } from './english-data';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { Trophy, Target, Flame, Brain, BookOpen, Zap, Calendar, Star } from 'lucide-react';

const emptySubscribe = () => () => {};

interface Props {
  progress: CourseProgress;
  updateProgress: (updater: (prev: CourseProgress) => CourseProgress) => void;
}

export default function ProgressStats({ progress }: Props) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [mounted, setMounted] = useState(false);

  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day) => ({
      name: day,
      words: Math.round((progress.wordsMastered.length / 7) * (0.5 + Math.random())),
      xp: Math.round((progress.xp / 7) * (0.3 + Math.random())),
    }));
  }, [progress.wordsMastered.length, progress.xp]);

  const accuracyData = useMemo(() => {
    const totalAccuracy = progress.totalAnswered > 0 ? (progress.totalCorrect / progress.totalAnswered) * 100 : 0;
    return [
      { name: 'Week 1', accuracy: Math.max(20, totalAccuracy - 30 + Math.random() * 10) },
      { name: 'Week 2', accuracy: Math.max(30, totalAccuracy - 20 + Math.random() * 10) },
      { name: 'Week 3', accuracy: Math.max(40, totalAccuracy - 10 + Math.random() * 5) },
      { name: 'Week 4', accuracy: totalAccuracy },
    ];
  }, [progress.totalCorrect, progress.totalAnswered]);

  const heatmapData = useMemo(() => {
    const data: { week: number; day: number; level: number }[] = [];
    for (let w = 0; w < 12; w++) {
      for (let d = 0; d < 7; d++) {
        const isRecent = w >= 10;
        const level = isRecent ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 3);
        data.push({ week: w, day: d, level: w < 2 ? 0 : level });
      }
    }
    return data;
  }, []);

  const unlockedAchievements = useMemo(() => {
    return ACHIEVEMENTS.map((a) => {
      let current = 0;
      switch (a.type) {
        case 'words': current = progress.wordsMastered.length; break;
        case 'streak': current = progress.streak; break;
        case 'accuracy': current = progress.totalAnswered > 0 ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) : 0; break;
        case 'challenges': current = progress.challengesCompleted; break;
        case 'grammar': current = progress.grammarCompleted.length; break;
      }
      return { ...a, unlocked: current >= a.requirement, current };
    });
  }, [progress]);

  const resetProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('english-course-progress');
      window.location.reload();
    }
  }, []);

  // Use effect for mounted check
  useMemo(() => { if (isClient) setMounted(true); }, [isClient]);

  if (!isClient || !mounted) return null;

  const totalAccuracy = progress.totalAnswered > 0 ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) : 0;

  // Compute current level index
  let currentLevelIdx = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (progress.xp >= LEVELS[i].xpRequired) { currentLevelIdx = i; break; }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-semibold">Progress & Stats</h3>
        </div>
        <button onClick={resetProgress} className="text-xs text-red-400/50 hover:text-red-400 transition-colors">Reset Progress</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: progress.xp, icon: <Zap className="w-5 h-5 text-yellow-400" />, color: 'text-yellow-400' },
          { label: 'Words Mastered', value: progress.wordsMastered.length, icon: <BookOpen className="w-5 h-5 text-emerald-400" />, color: 'text-emerald-400' },
          { label: 'Accuracy', value: `${totalAccuracy}%`, icon: <Brain className="w-5 h-5 text-teal-400" />, color: 'text-teal-400' },
          { label: 'Streak', value: `${progress.streak} days`, icon: <Flame className="w-5 h-5 text-orange-400" />, color: 'text-orange-400' },
        ].map((stat) => (
          <Card key={stat.label} className="glass">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400" /> CEFR Roadmap</h4>
          <div className="space-y-3">
            {LEVELS.map((level, idx) => {
              const isActive = idx <= currentLevelIdx;
              const isCurrent = idx === currentLevelIdx;
              const nextLevel = LEVELS[idx + 1];
              const range = nextLevel ? nextLevel.xpRequired - level.xpRequired : level.xpRequired + 1000;
              const progressPercent = isCurrent ? Math.min(100, ((progress.xp - level.xpRequired) / range) * 100) : isActive ? 100 : 0;
              return (
                <div key={level.level} className={`flex items-center gap-4 skill-node ${isCurrent ? 'glow-border rounded-lg p-3 -mx-3' : ''}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${isActive ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                    {isActive ? '✓' : level.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{level.level}</span>
                      <Badge variant="secondary" className="text-xs">{level.title}</Badge>
                      {isCurrent && <Badge className="bg-emerald-600/20 text-emerald-400 text-xs">Current</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                    {isActive && <Progress value={progressPercent} className="mt-1 h-1.5" />}
                  </div>
                  <div className="text-sm text-muted-foreground">{level.xpRequired} XP</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4">Weekly Activity</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #10b98140', borderRadius: 8 }} />
                <Bar dataKey="words" fill="#10b981" radius={[4, 4, 0, 0]} name="Words" />
                <Bar dataKey="xp" fill="#14b8a6" radius={[4, 4, 0, 0]} name="XP" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4">Accuracy Trend</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #10b98140', borderRadius: 8 }} />
                <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-teal-400" /> Activity Heatmap</h4>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {Array.from({ length: 12 }, (_, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {heatmapData.filter((d) => d.week === weekIdx).map((d, dayIdx) => {
                  const colors = ['bg-muted/30', 'bg-emerald-900/40', 'bg-emerald-700/60', 'bg-emerald-500/80', 'bg-emerald-400'];
                  return (
                    <div key={dayIdx} className={`heatmap-cell w-3 h-3 rounded-sm ${colors[d.level]}`} title={`Week ${weekIdx + 1}, Day ${d.day + 1}`} />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <span>Less</span>
            {['bg-muted/30', 'bg-emerald-900/40', 'bg-emerald-700/60', 'bg-emerald-500/80', 'bg-emerald-400'].map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span>More</span>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" /> Achievements
            <Badge variant="secondary">{unlockedAchievements.filter((a) => a.unlocked).length}/{unlockedAchievements.length}</Badge>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
            {unlockedAchievements.map((achievement) => (
              <motion.div key={achievement.id} whileHover={{ scale: 1.02 }} className={`rounded-lg p-4 text-center transition-all ${achievement.unlocked ? 'glass glow-border' : 'bg-muted/20 opacity-50'}`}>
                <div className="text-3xl mb-2">{achievement.unlocked ? achievement.icon : '🔒'}</div>
                <h5 className="text-sm font-semibold mb-1">{achievement.title}</h5>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                {!achievement.unlocked && (
                  <div className="mt-2">
                    <Progress value={(achievement.current / achievement.requirement) * 100} className="h-1" />
                    <p className="text-xs text-muted-foreground mt-1">{achievement.current}/{achievement.requirement}</p>
                  </div>
                )}
                {achievement.unlocked && <Badge className="mt-2 bg-yellow-600/20 text-yellow-400 border-yellow-600/30 text-xs">Unlocked!</Badge>}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
