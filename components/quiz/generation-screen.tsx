'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Star, User, Trophy, Coins } from 'lucide-react';
import { QuizState, generateAvatarTraits, CATEGORY_OPTIONS } from '@/lib/quiz-types';
import { Button } from '@/components/ui/button';

interface GenerationScreenProps {
  quizState: QuizState;
  onComplete: () => void;
}

export function GenerationScreen({ quizState, onComplete }: GenerationScreenProps) {
  const [phase, setPhase] = useState<'generating' | 'reveal' | 'complete'>('generating');
  const traits = generateAvatarTraits(quizState);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('reveal'), 2500);
    const timer2 = setTimeout(() => setPhase('complete'), 4000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getAvatarName = () => {
    const trait1 = traits[0] || 'Digital';
    const trait2 = traits[1] || 'Explorer';
    return `${trait1} ${trait2}`;
  };

  const getCategoryIcons = () => {
    return quizState.selectedCategories.map(cat => {
      const option = CATEGORY_OPTIONS.find(o => o.id === cat);
      return option?.icon || '✨';
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Magic particles */}
      <AnimatePresence>
        {phase === 'generating' && (
          <>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: i % 2 === 0 ? 'oklch(0.7 0.18 220)' : 'oklch(0.85 0.18 85)',
                  left: '50%',
                  top: '50%',
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  repeat: Infinity,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {phase === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-dashed border-primary/50 flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl"
              >
                ✨
              </motion.div>
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Activating Your Portal...
            </h2>
            <p className="text-muted-foreground">
              Analyzing your digital DNA
            </p>
          </motion.div>
        )}

        {(phase === 'reveal' || phase === 'complete') && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="text-center w-full max-w-md"
          >
            {/* Avatar */}
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="relative mb-6"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 rounded-full" />
              
              {/* Avatar container */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-primary/30 via-card to-secondary/30 border-4 border-primary/50 flex items-center justify-center overflow-hidden"
              >
                {/* Avatar face */}
                <div className="text-6xl">
                  {quizState.humorLevel > 66 ? '😎' : quizState.humorLevel > 33 ? '😊' : '🥰'}
                </div>
                
                {/* Category badges */}
                <div className="absolute -bottom-1 flex gap-1">
                  {getCategoryIcons().map((icon, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="text-lg bg-card rounded-full w-8 h-8 flex items-center justify-center border border-border"
                    >
                      {icon}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 left-1/4"
              >
                <Star className="w-6 h-6 text-secondary fill-secondary" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute top-1/4 right-1/4"
              >
                <Zap className="w-5 h-5 text-accent fill-accent" />
              </motion.div>
            </motion.div>

            {/* Avatar name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-muted-foreground mb-1">Your Internet Avatar</p>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {getAvatarName()}
              </h2>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="px-2 py-1 bg-primary/20 rounded-full text-primary">Level 1</span>
                <span className="px-2 py-1 bg-secondary/20 rounded-full text-secondary">Newbie</span>
              </div>
            </motion.div>

            {/* Traits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-2 mt-6 mb-8"
            >
              {traits.slice(0, 5).map((trait, i) => (
                <motion.span
                  key={trait}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="px-3 py-1 bg-card border border-border rounded-full text-sm font-medium text-foreground"
                >
                  {trait}
                </motion.span>
              ))}
            </motion.div>

            {/* Stats preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-4 mb-8 p-4 bg-card rounded-2xl border border-border"
            >
              <div className="text-center">
                <User className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-lg font-bold text-foreground">1</div>
                <div className="text-xs text-muted-foreground">Level</div>
              </div>
              <div className="text-center">
                <Trophy className="w-5 h-5 mx-auto mb-1 text-secondary" />
                <div className="text-lg font-bold text-foreground">0</div>
                <div className="text-xs text-muted-foreground">XP</div>
              </div>
              <div className="text-center">
                <Coins className="w-5 h-5 mx-auto mb-1 text-accent" />
                <div className="text-lg font-bold text-foreground">50</div>
                <div className="text-xs text-muted-foreground">Coins</div>
              </div>
            </motion.div>

            {/* CTA Button */}
            {phase === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  onClick={onComplete}
                  size="lg"
                  className="w-full py-6 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full animate-pulse-glow"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Growing
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Sign up to save your progress
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
