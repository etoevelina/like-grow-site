'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Sparkles, ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuoteChallenge as QuoteChallengeType } from '@/lib/quiz-types';

interface QuoteChallengeProps {
  challenge: QuoteChallengeType;
  onAnswer: (challengeId: string, answer: string) => void;
  onNext: () => void;
}

export function QuoteChallenge({ challenge, onAnswer, onNext }: QuoteChallengeProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const isCorrect = selectedOption === challenge.missingWord;

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelectedOption(option);
    setAnswered(true);
    onAnswer(challenge.id, option);
  };

  // Split quote to highlight missing word
  const quoteParts = challenge.quote.split('___');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto px-4"
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <Quote className="w-5 h-5 text-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Complete the Quote</h2>
      </div>

      {/* Quote Card */}
      <div className="glass-card rounded-3xl p-8 mb-6 relative overflow-hidden">
        {/* Decorative quotes */}
        <div className="absolute top-4 left-4 text-6xl text-primary/10 font-serif leading-none">
          &ldquo;
        </div>
        <div className="absolute bottom-4 right-4 text-6xl text-primary/10 font-serif leading-none">
          &rdquo;
        </div>

        <p className="text-foreground text-xl text-center leading-relaxed relative z-10">
          {quoteParts[0]}
          <span className="inline-block mx-1">
            {answered ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`px-3 py-1 rounded-lg font-bold ${
                  isCorrect 
                    ? 'bg-accent/20 text-accent' 
                    : 'bg-destructive/20 text-destructive line-through'
                }`}
              >
                {selectedOption}
              </motion.span>
            ) : (
              <span className="px-4 py-1 rounded-lg bg-primary/20 text-primary border-2 border-dashed border-primary">
                ???
              </span>
            )}
          </span>
          {quoteParts[1]}
        </p>

        {/* Source */}
        <p className="text-muted-foreground text-sm text-center mt-4 relative z-10">
          — {challenge.source}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {challenge.options.map((option, index) => (
          <motion.button
            key={option}
            onClick={() => handleSelect(option)}
            disabled={answered}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`py-4 px-4 rounded-2xl border-2 transition-all font-medium ${
              answered
                ? option === challenge.missingWord
                  ? 'border-accent bg-accent/20 text-accent'
                  : option === selectedOption
                    ? 'border-destructive bg-destructive/20 text-destructive'
                    : 'border-border bg-card text-muted-foreground opacity-50'
                : 'border-border bg-card text-foreground hover:border-primary hover:bg-primary/10 active:scale-95'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {answered && option === challenge.missingWord && (
                <Check className="w-4 h-4" />
              )}
              {answered && option === selectedOption && option !== challenge.missingWord && (
                <X className="w-4 h-4" />
              )}
              {option}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Result */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <div className={`p-4 rounded-2xl flex items-center gap-3 ${
              isCorrect 
                ? 'bg-accent/10 border border-accent/30' 
                : 'bg-destructive/10 border border-destructive/30'
            }`}>
              {isCorrect ? (
                <>
                  <Sparkles className="w-6 h-6 text-accent" />
                  <span className="text-accent font-semibold">You know your classics!</span>
                </>
              ) : (
                <>
                  <X className="w-6 h-6 text-destructive" />
                  <span className="text-foreground">
                    The correct answer was <span className="text-accent font-semibold">{challenge.missingWord}</span>
                  </span>
                </>
              )}
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
