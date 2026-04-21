'use client';

import { useState, useCallback, useSyncExternalStore, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GRAMMAR_QUESTIONS, GRAMMAR_TOPICS, type CourseProgress } from './english-data';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, ChevronRight, Lightbulb, ListChecks } from 'lucide-react';

const emptySubscribe = () => () => {};

interface Props {
  progress: CourseProgress;
  updateProgress: (updater: (prev: CourseProgress) => CourseProgress) => void;
}

export default function GrammarExercises({ progress, updateProgress }: Props) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<typeof GRAMMAR_QUESTIONS>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [dragWords, setDragWords] = useState<string[]>([]);
  const [sentenceSlots, setSentenceSlots] = useState<string[]>([]);

  const question = questions[currentQ];

  const startTopic = useCallback((topicId: string) => {
    const topicQuestions = GRAMMAR_QUESTIONS.filter(
      (q) => q.topic.toLowerCase().replace(/\s+/g, '-') === topicId
    );
    const qs = topicQuestions.length > 0 ? topicQuestions : GRAMMAR_QUESTIONS.slice(0, 3);
    setSelectedTopic(topicId);
    setQuestions(qs);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswered(0);
    // Initialize first question if sentence order
    if (qs[0]?.type === 'sentence-order') {
      const words = qs[0].question.split(' / ');
      setDragWords([...words].sort(() => Math.random() - 0.5));
      setSentenceSlots([]);
    } else {
      setDragWords([]);
      setSentenceSlots([]);
    }
  }, []);

  const checkAnswer = useCallback((answer: string) => {
    if (!question || showExplanation) return;
    setSelectedAnswer(answer);
    setShowExplanation(true);
    const isCorrect = answer.toLowerCase().trim() === question.answer.toLowerCase().trim();
    setScore((s) => isCorrect ? s + 1 : s);
    setAnswered((a) => a + 1);
    updateProgress((prev) => ({
      ...prev,
      totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
      totalAnswered: prev.totalAnswered + 1,
      xp: prev.xp + (isCorrect ? 10 : 2),
      grammarCompleted: [...new Set([...prev.grammarCompleted, question.id])],
    }));
  }, [question, showExplanation, updateProgress]);

  const nextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQ < questions.length - 1) {
      const nextIdx = currentQ + 1;
      setCurrentQ(nextIdx);
      const nextQ = questions[nextIdx];
      if (nextQ?.type === 'sentence-order') {
        const words = nextQ.question.split(' / ');
        setDragWords([...words].sort(() => Math.random() - 0.5));
        setSentenceSlots([]);
      } else {
        setDragWords([]);
        setSentenceSlots([]);
      }
    }
  }, [currentQ, questions]);

  const handleDragToSlot = useCallback((word: string, slotIdx: number) => {
    setSentenceSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = word;
      return next;
    });
    setDragWords((prev) => prev.filter((w) => w !== word));
  }, []);

  const removeFromSlot = useCallback((word: string, slotIdx: number) => {
    setSentenceSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = '';
      return next;
    });
    setDragWords((prev) => [...prev, word]);
  }, []);

  const submitSentence = useCallback(() => {
    const sentence = sentenceSlots.filter(Boolean).join(' ');
    checkAnswer(sentence);
  }, [sentenceSlots, checkAnswer]);

  if (!isClient) return null;

  if (!selectedTopic) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <ListChecks className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-semibold">Grammar Exercises</h3>
          <Badge variant="secondary">{progress.grammarCompleted.length} completed</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
          {GRAMMAR_TOPICS.map((topic) => {
            const topicQs = GRAMMAR_QUESTIONS.filter((q) => q.topic === topic.name);
            const completedCount = topicQs.filter((q) => progress.grammarCompleted.includes(q.id)).length;
            return (
              <Card key={topic.id} className="glass hover:glow-border transition-all cursor-pointer" onClick={() => startTopic(topic.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={topic.level === 'A1' || topic.level === 'A2' ? 'bg-green-600/20 text-green-400' : topic.level === 'B1' ? 'bg-teal-600/20 text-teal-400' : 'bg-cyan-600/20 text-cyan-400'}>
                      {topic.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{completedCount}/{topicQs.length}</span>
                  </div>
                  <h4 className="font-semibold mb-1">{topic.name}</h4>
                  <p className="text-xs text-muted-foreground">{topic.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center space-y-6 py-12">
        <h3 className="text-2xl font-bold gradient-text">No questions for this topic</h3>
        <Button onClick={() => setSelectedTopic(null)}>Back to Topics</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setSelectedTopic(null)}>← Back to Topics</Button>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Q {currentQ + 1}/{questions.length}</span>
          <span>Score: {score}/{answered}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={question.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="glass-strong">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600/20 text-emerald-400">{question.topic}</Badge>
                <Badge variant="secondary" className="text-xs">{question.level}</Badge>
                <Badge variant="outline" className="text-xs">{question.type.replace('-', ' ')}</Badge>
              </div>

              <h4 className="text-xl font-semibold">{question.question}</h4>

              {question.type === 'multiple-choice' && question.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {question.options.map((opt) => {
                    let bgClass = 'glass hover:bg-emerald-600/10 hover:border-emerald-600/50';
                    if (showExplanation) {
                      if (opt === question.answer) bgClass = 'bg-emerald-600/20 border-emerald-600';
                      else if (opt === selectedAnswer) bgClass = 'bg-red-600/20 border-red-600';
                      else bgClass = 'glass opacity-50';
                    }
                    return (
                      <button key={opt} className={`p-4 rounded-lg border border-border text-left transition-all ${bgClass} ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`} onClick={() => checkAnswer(opt)} disabled={showExplanation}>
                        <span className="font-medium">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {question.type === 'fill-blank' && (
                <div>
                  <div className="flex gap-2">
                    <input className="flex-1 bg-black/30 border border-border rounded-lg px-4 py-3 text-lg outline-none focus:border-emerald-600 transition-colors" placeholder="Type your answer..." value={selectedAnswer || ''} onChange={(e) => setSelectedAnswer(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && selectedAnswer && checkAnswer(selectedAnswer)} disabled={showExplanation} />
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => selectedAnswer && checkAnswer(selectedAnswer)} disabled={showExplanation || !selectedAnswer}>Check</Button>
                  </div>
                  {showExplanation && (
                    <p className="mt-2 text-sm">
                      {selectedAnswer?.toLowerCase().trim() === question.answer.toLowerCase().trim() ? (
                        <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Correct!</span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1"><XCircle className="w-4 h-4" /> Answer: <strong>{question.answer}</strong></span>
                      )}
                    </p>
                  )}
                </div>
              )}

              {question.type === 'sentence-order' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 min-h-[50px] p-3 glass rounded-lg">
                    {sentenceSlots.map((word, idx) => (
                      <button key={`slot-${idx}-${word}`} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${word ? (showExplanation ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 cursor-default' : 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 cursor-pointer hover:bg-red-600/20 hover:text-red-400 hover:border-red-600/50') : 'bg-muted/30 text-muted-foreground/30 border border-dashed border-muted-foreground/20 min-w-[60px]'}`} onClick={() => word && !showExplanation && removeFromSlot(word, idx)}>
                        {word || '___'}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dragWords.map((word) => (
                      <button key={`drag-${word}`} className="px-3 py-2 rounded-lg text-sm font-medium glass hover:bg-emerald-600/10 hover:border-emerald-600/50 border border-border transition-all cursor-grab active:cursor-grabbing" onClick={() => { const emptySlot = sentenceSlots.indexOf(''); if (emptySlot !== -1) handleDragToSlot(word, emptySlot); }} disabled={showExplanation}>
                        {word}
                      </button>
                    ))}
                  </div>
                  {!showExplanation && sentenceSlots.filter(Boolean).length > 0 && (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={submitSentence}>Submit Sentence</Button>
                  )}
                </div>
              )}

              {showExplanation && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-4 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm mb-1">Explanation</p>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                </motion.div>
              )}

              {showExplanation && currentQ < questions.length - 1 && (
                <div className="flex justify-end">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={nextQuestion}>Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
                </div>
              )}

              {showExplanation && currentQ >= questions.length - 1 && (
                <div className="text-center space-y-4">
                  <h4 className="text-2xl font-bold">
                    {score === questions.length ? '🎉 Perfect!' : score >= questions.length * 0.7 ? '👏 Great job!' : '💪 Keep practicing!'}
                  </h4>
                  <p className="text-muted-foreground">Score: {score}/{questions.length}</p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => startTopic(selectedTopic)}><RotateCcw className="w-4 h-4 mr-2" /> Retry</Button>
                    <Button onClick={() => setSelectedTopic(null)}><ArrowRight className="w-4 h-4 mr-2" /> Other Topics</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
