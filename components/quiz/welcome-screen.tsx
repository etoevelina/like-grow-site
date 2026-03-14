'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onStart: () => void;
  onLogin: () => void;
}

export function WelcomeScreen({ onStart, onLogin }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="mb-8"
      >
        <div className="w-20 h-20 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-foreground mb-3 text-center"
      >
        LikeGrow
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground text-center mb-10 max-w-xs leading-relaxed"
      >
        Discover your digital self through a quick interactive quiz
      </motion.p>

      {/* Avatar Preview */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
        className="relative mb-12"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl" />
        
        {/* Avatar container */}
        <div className="relative w-48 h-48 rounded-full glass-card flex items-center justify-center">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
            <span className="text-6xl">?</span>
          </div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-sm font-medium text-accent"
        >
          +5
        </motion.div>

        <motion.div
          animate={{ y: [5, -5, 5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center"
        >
          <Sparkles className="w-5 h-5 text-primary" />
        </motion.div>
      </motion.div>

      {/* Features list */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3 mb-10 w-full max-w-xs"
      >
        {[
          'Swipe through your interests',
          'Complete fun challenges',
          'Get your unique avatar'
        ].map((text, idx) => (
          <div key={idx} className="flex items-center gap-3 text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-medium">
              {idx + 1}
            </div>
            <span className="text-sm">{text}</span>
          </div>
        ))}
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-xs"
      >
        <Button
          onClick={onStart}
          className="w-full py-6 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg group"
        >
          Start Quiz
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>

      {/* Time estimate */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-muted-foreground text-xs mt-4"
      >
        Takes about 2 minutes
      </motion.p>

      {/* Already have account */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onLogin}
        className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Already have avatar? <span className="text-primary font-medium">Sign in</span>
      </motion.button>
    </motion.div>
  );
}
