'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, Check, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PuzzlePair {
  id: string;
  left: string;
  right: string;
  leftEmoji?: string;
  rightEmoji?: string;
}

interface PuzzleMatchProps {
  title: string;
  subtitle?: string;
  pairs: PuzzlePair[];
  onComplete: (score: number) => void;
}

export function PuzzleMatch({ title, subtitle, pairs, onComplete }: PuzzleMatchProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Shuffle right side options
  const [shuffledRight] = useState(() => 
    [...pairs].sort(() => Math.random() - 0.5)
  );

  const handleLeftSelect = (id: string) => {
    if (matches[id]) return; // Already matched
    setSelectedLeft(id);
    setWrongPair(null);
  };

  const handleRightSelect = useCallback((rightId: string) => {
    if (!selectedLeft) return;
    
    // Check if this right option is already matched
    const isRightMatched = Object.values(matches).includes(rightId);
    if (isRightMatched) return;

    // Check if correct
    const correctPair = pairs.find(p => p.id === selectedLeft);
    if (correctPair && correctPair.id === rightId) {
      // Correct match
      setMatches(prev => ({ ...prev, [selectedLeft]: rightId }));
      setSelectedLeft(null);
    } else {
      // Wrong match - show feedback
      setWrongPair({ left: selectedLeft, right: rightId });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
      }, 600);
    }
  }, [selectedLeft, matches, pairs]);

  const allMatched = Object.keys(matches).length === pairs.length;

  const handleComplete = () => {
    setShowResults(true);
    setTimeout(() => {
      onComplete(Object.keys(matches).length);
    }, 1500);
  };

  const getLeftStatus = (id: string) => {
    if (matches[id]) return 'matched';
    if (selectedLeft === id) return 'selected';
    if (wrongPair?.left === id) return 'wrong';
    return 'default';
  };

  const getRightStatus = (id: string) => {
    if (Object.values(matches).includes(id)) return 'matched';
    if (wrongPair?.right === id) return 'wrong';
    return 'default';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto px-4"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center"
        >
          <Puzzle className="w-8 h-8 text-accent" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2 text-balance">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        )}
      </div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl px-4 py-2 mb-6 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm text-muted-foreground">
          {Object.keys(matches).length} / {pairs.length} matched
        </span>
      </motion.div>

      {/* Matching area */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-3">
          {pairs.map((pair, index) => {
            const status = getLeftStatus(pair.id);
            return (
              <motion.button
                key={`left-${pair.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleLeftSelect(pair.id)}
                disabled={status === 'matched' || showResults}
                className={`
                  w-full p-4 rounded-2xl text-left transition-all duration-200
                  ${status === 'matched' 
                    ? 'glass-card border-2 border-accent/50 opacity-60' 
                    : status === 'selected'
                    ? 'glass-card border-2 border-primary ring-2 ring-primary/30'
                    : status === 'wrong'
                    ? 'glass-card border-2 border-destructive animate-shake'
                    : 'glass-card hover:border-primary/50 border-2 border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {pair.leftEmoji && (
                    <span className="text-xl">{pair.leftEmoji}</span>
                  )}
                  <span className="text-sm font-medium text-foreground">{pair.left}</span>
                </div>
                {status === 'matched' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-accent-foreground" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-3">
          {shuffledRight.map((pair, index) => {
            const status = getRightStatus(pair.id);
            return (
              <motion.button
                key={`right-${pair.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleRightSelect(pair.id)}
                disabled={status === 'matched' || !selectedLeft || showResults}
                className={`
                  w-full p-4 rounded-2xl text-left transition-all duration-200
                  ${status === 'matched' 
                    ? 'glass-card border-2 border-accent/50 opacity-60' 
                    : status === 'wrong'
                    ? 'glass-card border-2 border-destructive'
                    : selectedLeft
                    ? 'glass-card hover:border-accent/50 border-2 border-transparent cursor-pointer'
                    : 'glass-card border-2 border-transparent opacity-60'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {pair.rightEmoji && (
                    <span className="text-xl">{pair.rightEmoji}</span>
                  )}
                  <span className="text-sm font-medium text-foreground">{pair.right}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Success animation */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="glass-card rounded-3xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-accent" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-2">Perfect Match!</h3>
              <p className="text-muted-foreground">
                {Object.keys(matches).length}/{pairs.length} correct
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button */}
      {allMatched && !showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Button
            onClick={handleComplete}
            className="w-full h-14 rounded-2xl bg-accent text-accent-foreground font-semibold text-lg"
          >
            Continue
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
