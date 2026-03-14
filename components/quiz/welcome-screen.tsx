'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          <span className="text-primary text-glow">Like</span>
          <span className="text-secondary">Grow</span>
        </h1>
        <motion.div
          className="absolute -top-4 -right-4"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-secondary" />
        </motion.div>
      </motion.div>

      {/* Mascot/Avatar preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mb-8"
      >
        <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center border-4 border-primary/30 animate-float">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center">
            <motion.span
              className="text-6xl md:text-7xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ✌️
            </motion.span>
          </div>
        </div>
        
        {/* Floating icons around avatar */}
        <motion.div
          className="absolute -top-2 left-0"
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Star className="w-6 h-6 text-secondary fill-secondary" />
        </motion.div>
        <motion.div
          className="absolute top-1/4 -right-4"
          animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Zap className="w-6 h-6 text-accent fill-accent" />
        </motion.div>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mb-10 max-w-sm"
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-3 text-foreground">
          Grow your digital self
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Take a fun quiz to discover your Internet Avatar. Feed it content, watch it evolve!
        </p>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Button
          onClick={onStart}
          size="lg"
          className="px-10 py-6 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-full animate-pulse-glow transition-all duration-300 hover:scale-105"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start Quest
        </Button>
      </motion.div>

      {/* Footer hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-sm text-muted-foreground"
      >
        5-7 quick questions ahead
      </motion.p>
    </div>
  );
}
