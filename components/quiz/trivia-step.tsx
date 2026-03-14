'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TriviaQuestion } from '@/lib/quiz-types';

interface TriviaStepProps {
  question: TriviaQuestion;
  onAnswer: (questionId: string, correct: boolean) => void;
  onNext: () => void;
}

export function TriviaStep({ question, onAnswer, onNext }: TriviaStepProps) {
  const [answered, setAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const isCorrect = userAnswer === question.isTrue;

  const handleAnswer = (answer: boolean) => {
    if (answered) return;
    setUserAnswer(answer);
    setAnswered(true);
    onAnswer(question.id, answer === question.isTrue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto px-4"
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Did You Know?</h2>
      </div>

      {/* Question Card */}
      <div className="glass-card rounded-3xl p-6 mb-6">
        <p className="text-foreground text-lg text-center leading-relaxed mb-2">
          {question.question}
        </p>
        <p className="text-muted-foreground text-xs text-center uppercase tracking-wide">
          True or False?
        </p>
      </div>

      {/* Answer Buttons */}
      <div className="flex gap-4 mb-6">
        <motion.button
          onClick={() => handleAnswer(true)}
          disabled={answered}
          className={`flex-1 py-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${
            answered
              ? userAnswer === true
                ? question.isTrue
                  ? 'border-accent bg-accent/20 text-accent'
                  : 'border-destructive bg-destructive/20 text-destructive'
                : 'border-border bg-card text-muted-foreground opacity-50'
              : 'border-border bg-card text-foreground hover:border-accent hover:bg-accent/10'
          }`}
          whileTap={!answered ? { scale: 0.95 } : {}}
        >
          <Check className="w-5 h-5" />
          <span className="font-medium">True</span>
        </motion.button>

        <motion.button
          onClick={() => handleAnswer(false)}
          disabled={answered}
          className={`flex-1 py-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${
            answered
              ? userAnswer === false
                ? !question.isTrue
                  ? 'border-accent bg-accent/20 text-accent'
                  : 'border-destructive bg-destructive/20 text-destructive'
                : 'border-border bg-card text-muted-foreground opacity-50'
              : 'border-border bg-card text-foreground hover:border-destructive hover:bg-destructive/10'
          }`}
          whileTap={!answered ? { scale: 0.95 } : {}}
        >
          <X className="w-5 h-5" />
          <span className="font-medium">False</span>
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mb-6"
          >
            <div className={`p-4 rounded-2xl ${isCorrect ? 'bg-accent/10 border border-accent/30' : 'bg-destructive/10 border border-destructive/30'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <Check className="w-5 h-5 text-accent" />
                ) : (
                  <X className="w-5 h-5 text-destructive" />
                )}
                <span className={`font-semibold ${isCorrect ? 'text-accent' : 'text-destructive'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite!'}
                </span>
              </div>
              <p className="text-foreground/80 text-sm">{question.fact}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Button */}
      {answered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={onNext}
            className="w-full py-6 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
