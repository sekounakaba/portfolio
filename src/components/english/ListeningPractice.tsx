'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VOCABULARY_WORDS, type VocabCategory, type CourseProgress } from './english-data';
import { Volume2, VolumeX, ChevronLeft, ChevronRight, Headphones } from 'lucide-react';

const emptySubscribe = () => () => {};

interface Props {
  progress: CourseProgress;
  updateProgress: (updater: (prev: CourseProgress) => CourseProgress) => void;
}

const CATEGORIES: VocabCategory[] = ['Business', 'Tech', 'Daily', 'Travel', 'Food'];

const PHONETICS_GUIDE = [
  { sound: '/æ/', example: 'cat, bad, man', description: 'Short a sound, mouth open' },
  { sound: '/ɪ/', example: 'sit, big, list', description: 'Short i sound, relaxed' },
  { sound: '/ʊ/', example: 'put, good, look', description: 'Short u sound, rounded lips' },
  { sound: '/ə/', example: 'about, again, person', description: 'Schwa, most common sound' },
  { sound: '/θ/', example: 'think, through, both', description: 'Voiceless th, tongue between teeth' },
  { sound: '/ð/', example: 'this, that, the', description: 'Voiced th, tongue between teeth' },
  { sound: '/ʃ/', example: 'she, ship, action', description: 'Sh sound, air through teeth' },
  { sound: '/tʃ/', example: 'chip, much, teacher', description: 'Ch sound, combined t+sh' },
  { sound: '/dʒ/', example: 'job, bridge, just', description: 'J sound, soft d+zh' },
  { sound: '/ŋ/', example: 'sing, long, think', description: 'Ng sound, nasal' },
  { sound: '/r/', example: 'red, right, run', description: 'R sound, tongue curls back' },
  { sound: '/l/', example: 'light, fall, little', description: 'L sound, tongue touches roof' },
];

export default function ListeningPractice({ progress, updateProgress }: Props) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [category, setCategory] = useState<VocabCategory>('Business');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(0.8);
  const [mode, setMode] = useState<'listen' | 'repeat' | 'phonetics'>('listen');
  const [userAttempt, setUserAttempt] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [phoneticsIdx, setPhoneticsIdx] = useState(0);

  const words = VOCABULARY_WORDS.filter((w) => w.category === category);
  const currentWord = isClient ? words[currentIdx] : undefined;
  const phonetic = PHONETICS_GUIDE[phoneticsIdx];

  const speak = useCallback((text: string, rate?: number) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate || speed;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [speed]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const checkSpelling = useCallback(() => {
    if (!userAttempt.trim() || !currentWord) return;
    setShowResult(true);
    const isCorrect = userAttempt.toLowerCase().trim() === currentWord.english.toLowerCase().trim();
    updateProgress((prev) => ({
      ...prev,
      totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
      totalAnswered: prev.totalAnswered + 1,
      xp: prev.xp + (isCorrect ? 15 : 2),
    }));
  }, [userAttempt, currentWord, updateProgress]);

  const nextWord = useCallback(() => {
    setCurrentIdx((i) => (i + 1) % words.length);
    setUserAttempt('');
    setShowResult(false);
  }, [words.length]);

  if (!isClient) return null;

  if (mode === 'phonetics') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Headphones className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-semibold">Phonetics Guide</h3>
          </div>
          <Button variant="outline" onClick={() => setMode('listen')}>Back to Listening</Button>
        </div>
        <Card className="glass-strong glow-border">
          <CardContent className="p-8 text-center space-y-4">
            <motion.div key={phoneticsIdx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="text-5xl font-bold gradient-text mb-4">{phonetic.sound}</p>
              <p className="text-lg text-muted-foreground mb-2">{phonetic.description}</p>
              <p className="text-sm text-emerald-400">Examples: {phonetic.example}</p>
              <div className="mt-6 flex justify-center gap-3">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => speak(phonetic.example.split(', ')[0])}>
                  <Volume2 className="w-5 h-5 mr-2" /> Hear Example
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => setPhoneticsIdx((i) => (i - 1 + PHONETICS_GUIDE.length) % PHONETICS_GUIDE.length)}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">{phoneticsIdx + 1}/{PHONETICS_GUIDE.length}</span>
          <Button variant="outline" onClick={() => setPhoneticsIdx((i) => (i + 1) % PHONETICS_GUIDE.length)}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (!currentWord) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Headphones className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-semibold">Listening Practice</h3>
        </div>
        <Button variant="outline" onClick={() => setMode('phonetics')}>📖 Phonetics Guide</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => (
          <Button key={cat} size="sm" variant={category === cat ? 'default' : 'outline'} onClick={() => { setCategory(cat); setCurrentIdx(0); setUserAttempt(''); setShowResult(false); }} className={category === cat ? 'bg-emerald-600 text-white text-xs' : 'text-xs border-emerald-600/30 text-emerald-400'}>
            {cat}
          </Button>
        ))}
        <div className="flex gap-1 ml-auto">
          <Button size="sm" variant={mode === 'listen' ? 'default' : 'outline'} onClick={() => setMode('listen')} className={mode === 'listen' ? 'bg-teal-600 text-white text-xs' : 'text-xs'}>Listen</Button>
          <Button size="sm" variant={mode === 'repeat' ? 'default' : 'outline'} onClick={() => { setMode('repeat'); setUserAttempt(''); setShowResult(false); }} className={mode === 'repeat' ? 'bg-teal-600 text-white text-xs' : 'text-xs'}>Repeat</Button>
        </div>
      </div>

      <Card className="glass-strong glow-border">
        <CardContent className="p-8 text-center space-y-6">
          {mode === 'listen' && (
            <div>
              <Badge variant="secondary" className="mb-3">{currentWord.category}</Badge>
              <h4 className="text-3xl font-bold gradient-text mb-2">{currentWord.english}</h4>
              <p className="text-muted-foreground text-lg">{currentWord.phonetic}</p>
            </div>
          )}

          {mode === 'repeat' && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">Listen and type what you hear</p>
              {showResult ? (
                <div className={`text-3xl font-bold mb-2 ${userAttempt.toLowerCase().trim() === currentWord.english.toLowerCase().trim() ? 'text-emerald-400' : 'text-red-400'}`}>
                  {userAttempt.toLowerCase().trim() === currentWord.english.toLowerCase().trim() ? '✅ Correct!' : `❌ It was: ${currentWord.english}`}
                </div>
              ) : (
                <p className="text-2xl text-muted-foreground">🎵 ...</p>
              )}
            </div>
          )}

          <div className="flex justify-center gap-3">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => speak(currentWord.english)}>
              <Volume2 className={`w-5 h-5 mr-2 ${isSpeaking ? 'animate-pulse' : ''}`} /> {isSpeaking ? 'Playing...' : 'Listen'}
            </Button>
            <Button size="lg" variant="outline" onClick={stopSpeaking}>
              <VolumeX className="w-5 h-5 mr-2" /> Stop
            </Button>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground">Speed:</span>
            {[0.5, 0.8, 1.0, 1.2].map((s) => (
              <Button key={s} size="sm" variant={speed === s ? 'default' : 'outline'} onClick={() => setSpeed(s)} className={speed === s ? 'bg-teal-600 text-white text-xs' : 'text-xs'}>
                {s}x
              </Button>
            ))}
          </div>

          {mode === 'repeat' && !showResult && (
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                className="flex-1 bg-black/30 border border-border rounded-lg px-4 py-3 text-lg outline-none focus:border-emerald-600 transition-colors text-center"
                placeholder="Type what you heard..."
                value={userAttempt}
                onChange={(e) => setUserAttempt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkSpelling()}
              />
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={checkSpelling}>Check</Button>
            </div>
          )}

          <div className="glass rounded-lg p-4 max-w-md mx-auto">
            <p className="text-lg font-semibold text-teal-400">{currentWord.french}</p>
            <p className="text-sm text-muted-foreground mt-1 italic">&ldquo;{currentWord.example}&rdquo;</p>
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => { setCurrentIdx((i) => (i - 1 + words.length) % words.length); setUserAttempt(''); setShowResult(false); }}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <span className="flex items-center text-sm text-muted-foreground">{currentIdx + 1}/{words.length}</span>
            <Button variant="outline" onClick={nextWord}>Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
