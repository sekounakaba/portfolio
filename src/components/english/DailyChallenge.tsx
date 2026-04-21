'use client';

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VOCABULARY_WORDS, GRAMMAR_QUESTIONS, FAKE_LEADERBOARD, type CourseProgress } from './english-data';
import { Zap, Clock, Trophy, Share2, RotateCcw, CheckCircle, XCircle, ArrowRight, Star } from 'lucide-react';

const emptySubscribe = () => () => {};

interface Props {
  progress: CourseProgress;
  updateProgress: (updater: (prev: CourseProgress) => CourseProgress) => void;
}

interface ChallengeQuestion {
  question: string;
  options: string[];
  answer: string;
  type: 'vocab' | 'grammar';
}

function generateChallengeQuestions(): ChallengeQuestion[] {
  const questions: ChallengeQuestion[] = [];
  const shuffledVocab = [...VOCABULARY_WORDS].sort(() => Math.random() - 0.5).slice(0, 5);
  for (const word of shuffledVocab) {
    const wrongOptions = VOCABULARY_WORDS.filter((w) => w.id !== word.id).sort(() => Math.random() - 0.5).slice(0, 3).map((w) => w.french);
    questions.push({ question: `What does "${word.english}" mean?`, options: [...wrongOptions, word.french].sort(() => Math.random() - 0.5), answer: word.french, type: 'vocab' });
  }
  const mcQuestions = GRAMMAR_QUESTIONS.filter((q) => q.type === 'multiple-choice' && q.options);
  const shuffledGrammar = [...mcQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
  for (const q of shuffledGrammar) {
    questions.push({ question: q.question, options: q.options!, answer: q.answer, type: 'grammar' });
  }
  return questions.sort(() => Math.random() - 0.5);
}

export default function DailyChallenge({ progress, updateProgress }: Props) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [state, setState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [questions, setQuestions] = useState<ChallengeQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showFeedback, setShowFeedback] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasEnded = useRef(false);

  const startChallenge = useCallback(() => {
    const qs = generateChallengeQuestions();
    setQuestions(qs);
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft(60);
    setState('playing');
    setXpEarned(0);
    hasEnded.current = false;
  }, []);

  // Timer effect - only manages the interval
  useEffect(() => {
    if (state !== 'playing') {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  }, [state]);

  // Time-up effect - triggers end when timer reaches 0
  useEffect(() => {
    if (state === 'playing' && timeLeft <= 0 && !hasEnded.current) {
      hasEnded.current = true;
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      // Use setTimeout to avoid sync setState in effect
      setTimeout(() => {
        const earnedXp = score * 20 + 50;
        setXpEarned(earnedXp);
        updateProgress((prev) => ({ ...prev, xp: prev.xp + earnedXp, challengesCompleted: prev.challengesCompleted + 1, bestChallengeScore: Math.max(prev.bestChallengeScore, score) }));
        setState('finished');
      }, 0);
    }
  }, [state, timeLeft, score, updateProgress]);

  const answerQuestion = useCallback((answer: string) => {
    if (showFeedback || state !== 'playing') return;
    const currentQuestions = questions;
    const currentQuestion = currentQuestions[currentQ];
    if (!currentQuestion) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);
    const isCorrect = answer === currentQuestion.answer;
    if (isCorrect) setScore((s) => s + 1);
  }, [showFeedback, state, questions, currentQ]);

  const finishQuiz = useCallback(() => {
    if (hasEnded.current) return;
    hasEnded.current = true;
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    const earnedXp = score * 20 + 50;
    setXpEarned(earnedXp);
    updateProgress((prev) => ({ ...prev, xp: prev.xp + earnedXp, challengesCompleted: prev.challengesCompleted + 1, bestChallengeScore: Math.max(prev.bestChallengeScore, score) }));
    setState('finished');
  }, [score, updateProgress]);

  const nextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      finishQuiz();
    }
  }, [currentQ, questions.length, finishQuiz]);

  if (!isClient) return null;

  const question = questions[currentQ];

  if (state === 'idle') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3"><Zap className="w-6 h-6 text-yellow-400" /><h3 className="text-xl font-semibold">Daily Challenge</h3></div>
        <Card className="glass-strong animated-border">
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-6xl">🏆</div>
            <h4 className="text-2xl font-bold">Ready for a Challenge?</h4>
            <p className="text-muted-foreground max-w-md mx-auto">10 questions, 60 seconds. Mix of vocabulary and grammar. Earn bonus XP!</p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              <div className="glass rounded-lg p-3"><div className="text-2xl font-bold text-emerald-400">10</div><div className="text-xs text-muted-foreground">Questions</div></div>
              <div className="glass rounded-lg p-3"><div className="text-2xl font-bold text-yellow-400">60s</div><div className="text-xs text-muted-foreground">Time Limit</div></div>
              <div className="glass rounded-lg p-3"><div className="text-2xl font-bold text-teal-400">250</div><div className="text-xs text-muted-foreground">Max XP</div></div>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Trophy className="w-4 h-4" /><span>Best score: {progress.bestChallengeScore}/10</span><span className="mx-2">•</span><span>Completed: {progress.challengesCompleted}</span>
            </div>
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12" onClick={startChallenge}><Zap className="w-5 h-5 mr-2" /> Start Challenge</Button>
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-muted-foreground mb-3">Leaderboard</h5>
              <div className="max-w-xs mx-auto space-y-2">
                {FAKE_LEADERBOARD.map((entry, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${entry.isUser ? 'glass glow-border' : ''}`}>
                    <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                    <span className="text-lg">{entry.avatar}</span>
                    <span className={`text-sm flex-1 ${entry.isUser ? 'font-semibold text-emerald-400' : ''}`}>{entry.name}</span>
                    <span className="text-sm font-bold text-yellow-400">{entry.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === 'playing') {
    if (!question) return null;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><Zap className="w-6 h-6 text-yellow-400" /><h3 className="text-xl font-semibold">Daily Challenge</h3></div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-muted-foreground'}`} /><span className={`font-mono font-bold ${timeLeft <= 10 ? 'text-red-400' : ''}`}>{timeLeft}s</span></div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /><span className="font-bold">{score}/{questions.length}</span></div>
          </div>
        </div>
        <Progress value={((currentQ + 1) / questions.length) * 100} className="h-2" />
        <AnimatePresence mode="wait">
          <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <Card className="glass-strong">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{question.type === 'vocab' ? '📚 Vocabulary' : '✏️ Grammar'}</Badge>
                  <span className="text-sm text-muted-foreground">Q{currentQ + 1}/{questions.length}</span>
                </div>
                <h4 className="text-xl font-semibold">{question.question}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {question.options.map((opt) => {
                    let bgClass = 'glass hover:bg-emerald-600/10 hover:border-emerald-600/50 cursor-pointer';
                    if (showFeedback) {
                      if (opt === question.answer) bgClass = 'bg-emerald-600/20 border-emerald-600 cursor-default';
                      else if (opt === selectedAnswer) bgClass = 'bg-red-600/20 border-red-600 cursor-default';
                      else bgClass = 'glass opacity-50 cursor-default';
                    }
                    return (
                      <button key={opt} className={`p-4 rounded-lg border border-border text-left transition-all ${bgClass}`} onClick={() => answerQuestion(opt)}>
                        <span className="font-medium">{opt}</span>
                        {showFeedback && opt === question.answer && <CheckCircle className="w-4 h-4 ml-2 inline text-emerald-400" />}
                        {showFeedback && opt === selectedAnswer && opt !== question.answer && <XCircle className="w-4 h-4 ml-2 inline text-red-400" />}
                      </button>
                    );
                  })}
                </div>
                {showFeedback && (
                  <div className="flex justify-end">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={nextQuestion}>{currentQ < questions.length - 1 ? 'Next' : 'See Results'} <ArrowRight className="w-4 h-4 ml-1" /></Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3"><Trophy className="w-6 h-6 text-yellow-400" /><h3 className="text-xl font-semibold">Challenge Complete!</h3></div>
      <Card className="glass-strong animated-border">
        <CardContent className="p-8 text-center space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <div className="text-7xl mb-4">{score >= 8 ? '🏆' : score >= 5 ? '⭐' : '💪'}</div>
          </motion.div>
          <h4 className="text-3xl font-bold gradient-text">{score}/{questions.length}</h4>
          <p className="text-muted-foreground">
            {score >= 9 ? 'Outstanding! You\'re a language champion!' : score >= 7 ? 'Great work! Keep it up!' : score >= 5 ? 'Good effort! Practice makes perfect.' : 'Keep practicing, you\'ll get there!'}
          </p>
          <div className="flex justify-center gap-6">
            <div className="glass rounded-lg p-4 text-center"><div className="text-2xl font-bold text-yellow-400">+{xpEarned}</div><div className="text-xs text-muted-foreground">XP Earned</div></div>
            <div className="glass rounded-lg p-4 text-center"><div className="text-2xl font-bold text-emerald-400">{questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%</div><div className="text-xs text-muted-foreground">Accuracy</div></div>
            <div className="glass rounded-lg p-4 text-center"><div className="text-2xl font-bold text-teal-400">{60 - timeLeft}s</div><div className="text-xs text-muted-foreground">Time Used</div></div>
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={startChallenge}><RotateCcw className="w-4 h-4 mr-2" /> Try Again</Button>
            <Button variant="outline" onClick={() => { if (typeof navigator !== 'undefined' && navigator.share) { navigator.share({ title: 'English Challenge', text: `I scored ${score}/10 on the English Daily Challenge!` }).catch(() => {}); } }}><Share2 className="w-4 h-4 mr-2" /> Share Score</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
