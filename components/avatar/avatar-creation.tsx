'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Share2, TrendingUp, Coins, Skull, Sparkles, Check } from 'lucide-react';
import { createAvatar, formatQuizAnswers, Avatar, AvatarProfile, QuizAnswer } from '@/lib/avatar-api';
import { QuizState } from '@/lib/quiz-types';
import { Button } from '@/components/ui/button';

interface AvatarCreationProps {
  quizState: QuizState;
  onComplete: (avatar: Avatar, profile: AvatarProfile) => void;
  onError: (error: string) => void;
}

// Onboarding slides explaining the app mechanics
const ONBOARDING_SLIDES = [
  {
    id: 'share',
    icon: Share2,
    title: 'Share Your Content',
    description: 'Share videos from Instagram and TikTok with your avatar. We analyze what you save and watch to understand your unique personality.',
    highlight: 'Every post shapes who your avatar becomes',
    color: 'primary',
  },
  {
    id: 'grow',
    icon: TrendingUp,
    title: 'Watch Them Grow',
    description: 'Your avatar earns XP from every piece of content you share. Level up and unlock new animations, outfits, and abilities.',
    highlight: 'Fitness posts = muscular avatar. Travel posts = explorer avatar',
    color: 'accent',
  },
  {
    id: 'earn',
    icon: Coins,
    title: 'Earn Coins',
    description: 'Each post also earns coins! Spend them in the shop to customize your avatar with exclusive items and accessories.',
    highlight: 'Your content has real value here',
    color: 'yellow',
  },
  {
    id: 'warning',
    icon: Skull,
    title: 'Keep Them Alive',
    description: 'Your avatar needs you! Without fresh content, they will slowly degrade and eventually... fade away.',
    highlight: 'This shows how social media truly affects us',
    color: 'destructive',
  },
];

export function AvatarCreation({ quizState, onComplete, onError }: AvatarCreationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [avatarReady, setAvatarReady] = useState(false);
  const [avatarData, setAvatarData] = useState<{ avatar: Avatar; profile: AvatarProfile } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSeenAllSlides, setHasSeenAllSlides] = useState(false);

  // Track if user has seen all slides
  useEffect(() => {
    if (currentSlide === ONBOARDING_SLIDES.length - 1) {
      setHasSeenAllSlides(true);
    }
  }, [currentSlide]);

  // API call in background
  const createAvatarFromQuiz = useCallback(async () => {
    try {
      const answers: QuizAnswer[] = formatQuizAnswers(quizState);
      const result = await createAvatar(answers);
      
      if (result.success && result.data) {
        setAvatarData({ avatar: result.data.avatar, profile: result.data.profile });
        setAvatarReady(true);
      } else {
        // This shouldn't happen now since we have mock fallback
        setError(result.error || 'Failed to create avatar');
      }
    } catch (err) {
      // This shouldn't happen now since we have mock fallback
      setError('Something went wrong. Please try again.');
    }
  }, [quizState]);

  useEffect(() => {
    createAvatarFromQuiz();
  }, [createAvatarFromQuiz]);

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleMeetAvatar = () => {
    if (avatarData) {
      onComplete(avatarData.avatar, avatarData.profile);
    }
  };

  const slide = ONBOARDING_SLIDES[currentSlide];
  const Icon = slide.icon;

  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'text-primary bg-primary/10 border-primary/20';
      case 'accent': return 'text-accent bg-accent/10 border-accent/20';
      case 'yellow': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'destructive': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const getGlowColor = (color: string) => {
    switch (color) {
      case 'primary': return 'oklch(0.7 0.2 320 / 0.3)';
      case 'accent': return 'oklch(0.65 0.18 145 / 0.3)';
      case 'yellow': return 'oklch(0.8 0.15 85 / 0.3)';
      case 'destructive': return 'oklch(0.6 0.22 25 / 0.3)';
      default: return 'oklch(0.7 0.2 320 / 0.3)';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background glow */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(circle at 50% 30%, ${getGlowColor(slide.color)} 0%, transparent 60%)`,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Progress dots */}
      <div className="pt-8 pb-4 px-6 flex items-center justify-center gap-2 relative z-10">
        {ONBOARDING_SLIDES.map((_, i) => (
          <motion.div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentSlide ? 'w-8 bg-primary' : i < currentSlide ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border ${getColorClass(slide.color)}`}
            >
              <Icon className="w-10 h-10" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-bold text-foreground mb-4"
            >
              {slide.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground leading-relaxed mb-6"
            >
              {slide.description}
            </motion.p>

            {/* Highlight box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className={`p-4 rounded-xl border ${getColorClass(slide.color)}`}
            >
              <p className="text-sm font-medium">
                {slide.highlight}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 relative z-10">
        {/* Avatar ready indicator */}
        {avatarReady && hasSeenAllSlides && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Your avatar is ready!</span>
            </div>
          </motion.div>
        )}

        {/* Generation status when not ready */}
        {!avatarReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">Creating your avatar...</span>
            </div>
          </motion.div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center gap-3">
          {/* Back button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="rounded-xl h-12 w-12 border-border"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Main action button */}
          {currentSlide === ONBOARDING_SLIDES.length - 1 ? (
            <Button
              onClick={handleMeetAvatar}
              disabled={!avatarReady}
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              {avatarReady ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Meet Your Avatar
                </>
              ) : (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2" />
                  Almost ready...
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}

          {/* Skip to meet avatar (only if ready and seen all) */}
          {avatarReady && !hasSeenAllSlides && currentSlide < ONBOARDING_SLIDES.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMeetAvatar}
              className="rounded-xl h-12 w-12"
            >
              <Check className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Error display */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
}
