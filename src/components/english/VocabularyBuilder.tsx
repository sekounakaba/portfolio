'use client';

import { useState, useMemo, useSyncExternalStore, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VOCABULARY_WORDS, type VocabCategory, type CourseProgress } from './english-data';
import { CheckCircle, XCircle, RotateCcw, ChevronLeft, ChevronRight, Volume2, Shuffle, Filter } from 'lucide-react';

const emptySubscribe = () => () => {};

interface Props {
  progress: CourseProgress;
  updateProgress: (updater: (prev: CourseProgress) => CourseProgress) => void;
}

type DifficultyColor = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

const LEVEL_COLORS: Record<DifficultyColor, string> = {
  A1: 'bg-green-600/20 text-green-400',
  A2: 'bg-emerald-600/20 text-emerald-400',
  B1: 'bg-teal-600/20 text-teal-400',
  B2: 'bg-cyan-600/20 text-cyan-400',
  C1: 'bg-yellow-600/20 text-yellow-400',
  C2: 'bg-red-600/20 text-red-400',
};

const CATEGORIES: (VocabCategory | 'All')[] = ['All', 'Business', 'Tech', 'Daily', 'Travel', 'Food'];

export default function VocabularyBuilder({ progress, updateProgress }: Props) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [category, setCategory] = useState<VocabCategory | 'All'>('All');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [wrongWords, setWrongWords] = useState<number[]>([]);

  const filteredWords = useMemo(() => {
    if (!isClient) return [];
    let words = category === 'All' ? [...VOCABULARY_WORDS] : VOCABULARY_WORDS.filter((w) => w.category === category);
    words.sort((a, b) => {
      const aWrong = wrongWords.includes(a.id) ? -1 : 0;
      const bWrong = wrongWords.includes(b.id) ? -1 : 0;
      if (aWrong !== bWrong) return aWrong - bWrong;
      const aMastered = progress.wordsMastered.includes(a.id) ? 1 : 0;
      const bMastered = progress.wordsMastered.includes(b.id) ? 1 : 0;
      return aMastered - bMastered;
    });
    return words;
  }, [category, progress.wordsMastered, wrongWords, isClient]);

  const currentWord = isClient ? filteredWords[currentIdx] : undefined;
  const masteredCount = progress.wordsMastered.length;
  const totalCount = VOCABULARY_WORDS.length;

  const markWord = useCallback((wordId: number, mastered: boolean) => {
    updateProgress((prev) => {
      const newMastered = mastered
        ? prev.wordsMastered.includes(wordId)
          ? prev.wordsMastered
          : [...prev.wordsMastered, wordId]
        : prev.wordsMastered.filter((id) => id !== wordId);
      const xpGain = mastered ? (prev.wordsMastered.includes(wordId) ? 0 : 15) : 0;
      return { ...prev, wordsMastered: newMastered, xp: prev.xp + xpGain };
    });
    if (!mastered) {
      setWrongWords((prev) => prev.includes(wordId) ? prev : [...prev, wordId]);
    } else {
      setWrongWords((prev) => prev.filter((id) => id !== wordId));
    }
    setTimeout(() => {
      setCurrentIdx((prev) => {
        const len = filteredWords.length;
        const next = prev + 1;
        return next >= len ? 0 : next;
      });
      setFlipped(false);
    }, 500);
  }, [updateProgress, filteredWords.length]);

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const shuffle = useCallback(() => {
    setCurrentIdx(0);
    setFlipped(false);
  }, []);

  if (!isClient || !currentWord) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Vocabulary Builder</h3>
          <p className="text-sm text-muted-foreground">{masteredCount}/{totalCount} words mastered</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={shuffle}>
            <Shuffle className="w-4 h-4 mr-1" /> Shuffle
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setCurrentIdx(0); setFlipped(false); }}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </div>

      <Progress value={(masteredCount / totalCount) * 100} className="h-2" />
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={category === cat ? 'default' : 'outline'}
            onClick={() => { setCategory(cat); setCurrentIdx(0); setFlipped(false); }}
            className={category === cat ? 'bg-emerald-600 text-white text-xs' : 'text-xs border-emerald-600/30 text-emerald-400'}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => { setCurrentIdx((p) => Math.max(0, p - 1)); setFlipped(false); }} disabled={currentIdx === 0}>
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div className="w-full max-w-md h-72 cursor-pointer" onClick={() => setFlipped(!flipped)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Card className="w-full h-full relative overflow-hidden glow-border">
                <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`} style={{ perspective: '1000px' }}>
                  <div className="flashcard-front flex flex-col items-center justify-center p-6 bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={LEVEL_COLORS[currentWord.level]}>{currentWord.level}</Badge>
                      <Badge variant="secondary">{currentWord.category}</Badge>
                    </div>
                    <h3 className="text-3xl font-bold mb-2 gradient-text">{currentWord.english}</h3>
                    <p className="text-muted-foreground mb-3 text-sm">{currentWord.phonetic}</p>
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); speak(currentWord.english); }}>
                      <Volume2 className="w-4 h-4 mr-1" /> Listen
                    </Button>
                    <p className="text-xs text-muted-foreground/50 mt-4">Click to flip</p>
                  </div>
                  <div className="flashcard-back flex flex-col items-center justify-center p-6 bg-card">
                    <h3 className="text-2xl font-bold mb-3 text-teal-400">{currentWord.french}</h3>
                    <div className="glass rounded-lg p-3 mb-4 w-full max-w-xs text-center">
                      <p className="text-sm italic text-foreground/80">&ldquo;{currentWord.example}&rdquo;</p>
                      <p className="text-xs text-muted-foreground mt-1">{currentWord.exampleTranslation}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((d) => (
                        <div key={d} className={`w-2 h-2 rounded-full ${d <= currentWord.difficulty ? 'bg-emerald-400' : 'bg-muted'}`} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">Difficulty</span>
                    </div>
                    <p className="text-xs text-muted-foreground/50 mt-4">Click to flip back</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <Button variant="ghost" size="icon" onClick={() => { setCurrentIdx((p) => Math.min(filteredWords.length - 1, p + 1)); setFlipped(false); }} disabled={currentIdx >= filteredWords.length - 1}>
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex justify-center gap-4">
        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white min-w-[160px]" onClick={() => markWord(currentWord.id, false)}>
          <XCircle className="w-5 h-5 mr-2" /> Still Learning
        </Button>
        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[160px]" onClick={() => markWord(currentWord.id, true)}>
          <CheckCircle className="w-5 h-5 mr-2" /> Know It
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {currentIdx + 1} of {filteredWords.length} words in this set
      </p>
    </div>
  );
}
