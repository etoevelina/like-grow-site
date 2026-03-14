'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Zap, Star } from 'lucide-react';

interface MagicTransitionProps {
  onComplete: () => void;
}

export function MagicTransition({ onComplete }: MagicTransitionProps) {
  const [phase, setPhase] = useState<'clouds' | 'lightning' | 'stars' | 'reveal'>('clouds');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('lightning'), 800),
      setTimeout(() => setPhase('stars'), 1600),
      setTimeout(() => setPhase('reveal'), 2400),
      setTimeout(() => onComplete(), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Generate random stars
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 0.5,
  }));

  // Generate cloud particles
  const clouds = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: i < 4 ? -20 + i * 10 : 60 + (i - 4) * 10,
    y: 30 + Math.random() * 40,
    size: 80 + Math.random() * 60,
    direction: i < 4 ? -1 : 1,
  }));

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden">
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0"
        initial={{ background: 'radial-gradient(circle at 50% 50%, oklch(0.15 0.02 280) 0%, oklch(0.08 0.01 260) 100%)' }}
        animate={{
          background: phase === 'reveal'
            ? 'radial-gradient(circle at 50% 50%, oklch(0.12 0.03 320) 0%, oklch(0.08 0.01 260) 100%)'
            : 'radial-gradient(circle at 50% 50%, oklch(0.15 0.02 280) 0%, oklch(0.08 0.01 260) 100%)',
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Clouds */}
      <AnimatePresence>
        {(phase === 'clouds' || phase === 'lightning') && (
          <>
            {clouds.map((cloud) => (
              <motion.div
                key={cloud.id}
                className="absolute"
                style={{
                  left: `${cloud.x}%`,
                  top: `${cloud.y}%`,
                  width: cloud.size,
                  height: cloud.size * 0.6,
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: 0.6,
                  scale: 1,
                  x: phase === 'lightning' ? cloud.direction * 200 : 0,
                }}
                exit={{ 
                  opacity: 0,
                  x: cloud.direction * 400,
                  transition: { duration: 0.8 }
                }}
                transition={{ duration: 0.6, delay: cloud.id * 0.05 }}
              >
                <div className="relative w-full h-full">
                  <Cloud 
                    className="absolute w-full h-full text-muted-foreground/30" 
                    fill="currentColor"
                  />
                </div>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Lightning bolts */}
      <AnimatePresence>
        {phase === 'lightning' && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`lightning-${i}`}
                className="absolute"
                style={{
                  left: `${30 + i * 20}%`,
                  top: '20%',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.2, 1, 0.8],
                }}
                transition={{ 
                  duration: 0.4,
                  delay: i * 0.15,
                  times: [0, 0.2, 0.5, 1],
                }}
              >
                <Zap 
                  className="w-16 h-16 text-primary" 
                  fill="currentColor"
                  style={{
                    filter: 'drop-shadow(0 0 20px oklch(0.7 0.2 320))',
                  }}
                />
              </motion.div>
            ))}
            
            {/* Flash effect */}
            <motion.div
              className="absolute inset-0 bg-primary/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Stars */}
      <AnimatePresence>
        {(phase === 'stars' || phase === 'reveal') && (
          <>
            {stars.map((star) => (
              <motion.div
                key={`star-${star.id}`}
                className="absolute"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                }}
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ 
                  opacity: [0, 1, 0.8],
                  scale: [0, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ 
                  duration: 0.8,
                  delay: star.delay,
                }}
              >
                <Star 
                  className="text-primary"
                  style={{
                    width: star.size * 4,
                    height: star.size * 4,
                    filter: 'drop-shadow(0 0 8px oklch(0.7 0.2 320))',
                  }}
                  fill="currentColor"
                />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Sparkle particles */}
      <AnimatePresence>
        {phase === 'stars' && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 rounded-full bg-primary"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  opacity: [0, 1, 0],
                  scale: [0, 2, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.03,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Center glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.7 0.2 320 / 0.3) 0%, transparent 70%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: phase === 'reveal' ? [1, 1.5, 2] : [0, 1, 1.2],
          opacity: phase === 'reveal' ? [0.8, 0.5, 0] : [0, 0.6, 0.8],
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Reveal burst */}
      {phase === 'reveal' && (
        <motion.div
          className="absolute inset-0"
          initial={{ 
            background: 'radial-gradient(circle at 50% 50%, oklch(0.7 0.2 320 / 0.4) 0%, transparent 0%)' 
          }}
          animate={{ 
            background: 'radial-gradient(circle at 50% 50%, oklch(0.7 0.2 320 / 0) 0%, transparent 100%)' 
          }}
          transition={{ duration: 0.8 }}
        />
      )}
    </div>
  );
}
