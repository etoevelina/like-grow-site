'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, TrendingUp, Skull, Baby, Link2 } from 'lucide-react';
import { createAvatar, formatQuizAnswers, Avatar, AvatarProfile, QuizAnswer, saveAvatarData } from '@/lib/avatar-api';
import { QuizState } from '@/lib/quiz-types';
import { Button } from '@/components/ui/button';

interface AvatarCreationProps {
  quizState: QuizState;
  onComplete: (avatar: Avatar, profile: AvatarProfile) => void;
  onError: (error: string) => void;
}

// Onboarding slides after registration: what the avatar is + how the app works
const ONBOARDING_SLIDES = [
  {
    id: 'newborn',
    icon: Baby,
    title: 'Your Avatar is Born',
    description: 'A twin that grows from your taste. Share links from Instagram and TikTok to shape who they become.',
    highlight: 'Fitness = muscular, Travel = explorer, Fashion = stylish',
    color: 'primary',
  },
  {
    id: 'how-it-works',
    icon: Link2,
    title: 'How the App Works',
    description: 'On the dashboard you’ll feed your avatar with TikTok or Instagram links. Each post gives XP and coins. Complete tasks for extra rewards, spend coins in the shop on looks, and tap your avatar for bonus XP.',
    highlight: 'Connect LikePost to unlock more daily submissions and keep growing.',
    color: 'accent',
  },
  {
    id: 'grow',
    icon: TrendingUp,
    title: 'Level Up & Earn',
    description: 'Every post earns XP and coins. Level up from Seedling to Legend. Buy accessories in the shop—your avatar’s look updates when you equip them.',
    highlight: 'Your content taste has real value here',
    color: 'accent',
  },
  {
    id: 'warning',
    icon: Skull,
    title: 'Keep Them Alive',
    description: 'Without fresh content, your avatar will degrade and fade. Feed them regularly to keep them thriving.',
    highlight: 'Connect LikePost to avoid limits and organize your saves',
    color: 'destructive',
  },
];

const CREATION_STEP_MESSAGES = [
  'Reading your taste...',
  'Drawing your twin...',
  'Choosing the right vibes...',
  'Adding the finishing touches...',
  'Almost there...',
  'Your twin is taking shape...',
];

export function AvatarCreation({ quizState, onComplete }: AvatarCreationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [creationStatus, setCreationStatus] = useState<'creating' | 'waiting' | 'ready'>('creating');
  const [stepMessageIndex, setStepMessageIndex] = useState(0);
  const creationSentRef = useRef(false);

  // Rotate progress messages so the user sees things moving
  useEffect(() => {
    if (creationStatus === 'ready') return;
    const t = setInterval(() => {
      setStepMessageIndex((i) => (i + 1) % CREATION_STEP_MESSAGES.length);
    }, 3800);
    return () => clearInterval(t);
  }, [creationStatus]);

  // Start avatar creation once when component mounts (ref prevents double send in React Strict Mode)
  useEffect(() => {
    if (creationSentRef.current) return;
    creationSentRef.current = true;
    setCreationStatus('creating');

    (async () => {
      try {
        const answers: QuizAnswer[] = formatQuizAnswers(quizState);
        const result = await createAvatar(answers);

        if (result.success && result.data && result.data.avatar) {
          saveAvatarData(result.data.avatar, result.data.profile);
          localStorage.setItem('avatar_creating', 'true');
          if (result.data.avatar.current_video_url || result.data.avatar.current_image_url) {
            setCreationStatus('ready');
          } else {
            setCreationStatus('waiting');
          }
        } else {
          setCreationStatus('waiting');
        }
      } catch {
        setCreationStatus('waiting');
      }
    })();
  }, [quizState]);

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

  const handleGoToDashboard = () => {
    // Go to dashboard - avatar will be under shutter
    window.location.href = '/dashboard?new=true';
  };

  const slide = ONBOARDING_SLIDES[currentSlide];
  const Icon = slide.icon;
  const isLastSlide = currentSlide === ONBOARDING_SLIDES.length - 1;

  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'text-primary bg-primary/10 border-primary/20';
      case 'accent': return 'text-accent bg-accent/10 border-accent/20';
      case 'destructive': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const getGlowColor = (color: string) => {
    switch (color) {
      case 'primary': return 'oklch(0.7 0.2 320 / 0.3)';
      case 'accent': return 'oklch(0.65 0.18 145 / 0.3)';
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
        {/* Creation status indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
            {creationStatus === 'creating' && (
              <>
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-muted-foreground">{CREATION_STEP_MESSAGES[stepMessageIndex]}</span>
              </>
            )}
            {creationStatus === 'waiting' && (
              <>
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">{CREATION_STEP_MESSAGES[stepMessageIndex]}</span>
              </>
            )}
            {creationStatus === 'ready' && (
              <>
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-xs text-muted-foreground">Avatar ready to meet you!</span>
              </>
            )}
          </div>
        </motion.div>

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
          {isLastSlide ? (
            <Button
              onClick={handleGoToDashboard}
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Enter App
              <ChevronRight className="w-5 h-5 ml-2" />
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
        </div>
      </div>
    </div>
  );
}
