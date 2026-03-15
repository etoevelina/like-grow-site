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
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Preload video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
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
        Discover your digital self through a quick interactive quiz
      </motion.p>

      {/* Video Preview - natural size, what fits fits */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
        className="relative mb-12 cursor-pointer"
        onClick={handleVideoClick}
      >
        {/* Video container */}
        <div className="relative w-56 bg-background rounded-3xl overflow-hidden">
          {/* Poster image shown until video loads */}
          {!videoLoaded && (
            <img
              src="/images/intro-poster.png"
              alt=""
              className="w-full h-auto"
            />
          )}
          
          {/* Video - natural aspect ratio */}
          <video
            ref={videoRef}
            className="w-full h-auto"
            poster="/images/intro-poster.png"
            playsInline
            loop
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            onEnded={() => setIsPlaying(false)}
          >
            <source src="/videos/intro-logo.mp4" type="video/mp4" />
          </video>

          {/* Play indicator */}
          {!isPlaying && videoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/20">
              <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-foreground border-b-[8px] border-b-transparent ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Tap to play hint */}
        {!isPlaying && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-muted-foreground mt-3"
          >
            Tap to play with sound
          </motion.p>
        )}
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
