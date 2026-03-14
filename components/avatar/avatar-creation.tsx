'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { createAvatar, formatQuizAnswers, Avatar, AvatarProfile, QuizAnswer } from '@/lib/avatar-api';
import { QuizState } from '@/lib/quiz-types';

interface AvatarCreationProps {
  quizState: QuizState;
  onComplete: (avatar: Avatar, profile: AvatarProfile) => void;
  onError: (error: string) => void;
}

// Magical particles
function MagicParticle({ delay, index }: { delay: number; index: number }) {
  const angle = (index / 20) * Math.PI * 2;
  const radius = 80 + Math.random() * 40;
  
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        background: `hsl(${280 + Math.random() * 60}, 80%, 60%)`,
        boxShadow: `0 0 10px hsl(${280 + Math.random() * 60}, 80%, 60%)`,
      }}
      initial={{
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
      }}
      animate={{
        x: [0, Math.cos(angle) * radius, Math.cos(angle) * radius * 0.3],
        y: [0, Math.sin(angle) * radius, Math.sin(angle) * radius * 0.3],
        scale: [0, 1.5, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2.5,
        delay: delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Swirling elements around the cauldron
function SwirlingElement({ index, total }: { index: number; total: number }) {
  const icons = ['🎬', '🎵', '✈️', '🍕', '⚽', '👗', '📸', '🎮', '📚', '🎨'];
  const icon = icons[index % icons.length];
  
  return (
    <motion.div
      className="absolute text-2xl"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        rotate: 360 * 3,
        x: Math.cos((index / total) * Math.PI * 2) * 120,
        y: Math.sin((index / total) * Math.PI * 2) * 120 - 50,
      }}
      transition={{
        duration: 4,
        delay: index * 0.3,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {icon}
    </motion.div>
  );
}

// Loading messages
const LOADING_MESSAGES = [
  'Analyzing your vibe...',
  'Mixing the ingredients...',
  'Adding a pinch of magic...',
  'Stirring the cauldron...',
  'Infusing your personality...',
  'Crystallizing your avatar...',
  'Almost there...',
];

export function AvatarCreation({ quizState, onComplete, onError }: AvatarCreationProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [phase, setPhase] = useState<'brewing' | 'generating'>('brewing');
  
  // Rotate loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // API call
  const createAvatarFromQuiz = useCallback(async () => {
    try {
      const answers: QuizAnswer[] = formatQuizAnswers(quizState);
      
      // Start generating phase after initial animation
      setTimeout(() => setPhase('generating'), 3000);
      
      const result = await createAvatar(answers);
      
      if (result.success && result.data) {
        // Wait a bit for dramatic effect
        setTimeout(() => {
          onComplete(result.data!.avatar, result.data!.profile);
        }, 2000);
      } else {
        onError(result.error || 'Failed to create avatar');
      }
    } catch (err) {
      onError('Something went wrong. Please try again.');
    }
  }, [quizState, onComplete, onError]);

  useEffect(() => {
    createAvatarFromQuiz();
  }, [createAvatarFromQuiz]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, oklch(0.5 0.2 290 / 0.5) 0%, oklch(0.4 0.15 320 / 0.3) 40%, transparent 70%)',
          }}
        />
      </div>

      {/* Magical cauldron area */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Swirling elements */}
        {Array.from({ length: 10 }).map((_, i) => (
          <SwirlingElement key={i} index={i} total={10} />
        ))}
        
        {/* Magic particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <MagicParticle key={`particle-${i}`} delay={i * 0.15} index={i} />
        ))}
        
        {/* Central cauldron/orb */}
        <motion.div
          className="relative w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, oklch(0.3 0.15 290) 0%, oklch(0.15 0.1 280) 100%)',
            boxShadow: '0 0 60px oklch(0.5 0.2 290 / 0.5), inset 0 0 30px oklch(0.4 0.15 300 / 0.5)',
          }}
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 60px oklch(0.5 0.2 290 / 0.5), inset 0 0 30px oklch(0.4 0.15 300 / 0.5)',
              '0 0 80px oklch(0.6 0.25 290 / 0.7), inset 0 0 40px oklch(0.5 0.2 300 / 0.7)',
              '0 0 60px oklch(0.5 0.2 290 / 0.5), inset 0 0 30px oklch(0.4 0.15 300 / 0.5)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Inner glow */}
          <motion.div
            className="w-16 h-16 rounded-full"
            style={{
              background: 'radial-gradient(circle, oklch(0.7 0.2 320) 0%, oklch(0.5 0.15 290) 100%)',
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
        
        {/* Bubbling effect */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute w-3 h-3 rounded-full bg-primary/60"
            style={{
              left: `${40 + Math.random() * 20}%`,
              bottom: '30%',
            }}
            animate={{
              y: [-20, -80],
              x: [0, (Math.random() - 0.5) * 30],
              scale: [0.5, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      <div className="mt-12 text-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg font-medium text-foreground"
          >
            {LOADING_MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
        
        <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{phase === 'brewing' ? 'Brewing your avatar' : 'Generating visuals'}</span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 w-48">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: phase === 'brewing' ? '40%' : '90%' }}
            transition={{ duration: phase === 'brewing' ? 3 : 10, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
