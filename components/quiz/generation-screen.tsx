'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Coins, ArrowRight } from 'lucide-react';
import { QuizState, generateAvatarTraits } from '@/lib/quiz-types';
import { Button } from '@/components/ui/button';

interface GenerationScreenProps {
  quizState: QuizState;
  onComplete: () => void;
}

export function GenerationScreen({ quizState, onComplete }: GenerationScreenProps) {
  const [phase, setPhase] = useState<'generating' | 'reveal'>('generating');
  const traits = generateAvatarTraits(quizState);

  useEffect(() => {
    const timer = setTimeout(() => setPhase('reveal'), 2500);
    return () => clearTimeout(timer);
  }, []);

  const getAvatarEmoji = () => {
    if (quizState.humorLevel > 66) return '😈';
    if (quizState.humorLevel > 33) return '😎';
    return '🌟';
  };

  const getAvatarTitle = () => {
    const prefix = traits[0] || 'Digital';
    const suffix = traits[1] || 'Explorer';
    return `The ${prefix} ${suffix}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background particles */}
      <AnimatePresence>
        {phase === 'generating' && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/60"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 300,
                  y: (Math.random() - 0.5) * 300,
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.08,
                  repeat: Infinity,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            {/* Loading spinner */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-muted"
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Creating your avatar...
            </h2>
            <p className="text-muted-foreground text-sm">
              Analyzing your preferences
            </p>
          </motion.div>
        )}

        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center w-full max-w-sm"
          >
            {/* Avatar */}
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              className="relative mb-8"
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-150" />
              
              {/* Avatar circle */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-36 h-36 mx-auto rounded-full glass-card flex items-center justify-center"
              >
                <span className="text-6xl">{getAvatarEmoji()}</span>
              </motion.div>

              {/* Level badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium"
              >
                Level 1
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <p className="text-muted-foreground text-sm mb-1">You are</p>
              <h2 className="text-2xl font-bold text-foreground">
                {getAvatarTitle()}
              </h2>
            </motion.div>

            {/* Traits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {traits.slice(0, 4).map((trait, i) => (
                <motion.span
                  key={trait}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="px-3 py-1.5 rounded-full bg-card border border-border text-sm text-foreground"
                >
                  {trait}
                </motion.span>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-6 mb-10"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg font-bold text-foreground">100</span>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-2">
                  <Coins className="w-5 h-5 text-accent" />
                </div>
                <span className="text-lg font-bold text-foreground">50</span>
                <p className="text-xs text-muted-foreground">Coins</p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={onComplete}
                className="w-full py-6 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg"
              >
                Start Growing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-muted-foreground text-xs mt-4">
                Sign up to save your avatar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
