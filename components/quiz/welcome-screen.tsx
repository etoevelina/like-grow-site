'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
  onLogin: () => void;
}

export function WelcomeScreen({ onStart, onLogin }: WelcomeScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay video with sound, fallback to muted if blocked
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      // Try to play with sound first
      video.muted = false;
      video.play().catch(() => {
        // Autoplay with sound blocked - try muted
        video.muted = true;
        video.play().catch(() => {
          // Even muted autoplay blocked - do nothing
        });
      });
    };

    // Try immediately
    tryPlay();

    // Also try on canplay event
    video.addEventListener('canplay', tryPlay, { once: true });
    
    return () => {
      video.removeEventListener('canplay', tryPlay);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8 overflow-hidden"
    >
      {/* Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-bold text-foreground mb-3 text-center"
      >
        LikeGrow
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground text-center mb-10 max-w-xs leading-relaxed"
      >
        Create your AI twin from your taste. A short quiz to start—then feed it with what you save and watch it grow.
      </motion.p>

      {/* Video Preview - large size, overflow hidden beyond screen */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
        className="relative mb-12 w-full flex justify-center"
      >
        {/* Video container - 80% of screen width, max 400px */}
        <div className="relative w-[80vw] max-w-[400px]">
          {/* Video - tries to autoplay with sound, falls back to muted */}
          <video
            ref={videoRef}
            className="w-full h-auto"
            poster="/images/intro-poster.png"
            playsInline
            loop
            preload="auto"
          >
            <source src="/videos/intro-logo.mp4" type="video/mp4" />
          </video>
        </div>
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
          Create my twin
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>

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
