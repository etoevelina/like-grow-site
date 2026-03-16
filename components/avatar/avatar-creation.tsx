'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, TrendingUp, Skull, Baby, Link2, Hand, Sparkles } from 'lucide-react';
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

// Reinforcement between slides: different types (choice, slider, tap) so it stays fun
const REINFORCEMENTS: Array<{
  type: 'choice' | 'slider' | 'tap';
  question: string;
  choiceA?: string;
  choiceB?: string;
  correctChoice?: 'A' | 'B';
  explanation: string;
  sliderLabel?: string;
  sliderLabelEnd?: string;
  sliderMin?: number;
  sliderMax?: number;
  tapLabel?: string;
  tapDoneText?: string;
}> = [
  {
    type: 'choice',
    question: 'What happens to your avatar when you share posts about food?',
    choiceA: 'Gets a foodie vibe',
    choiceB: 'Nothing changes',
    correctChoice: 'A',
    explanation: 'Your twin reflects what you save — food posts shape their style!',
  },
  {
    type: 'slider',
    question: 'How much do you think one post helps your avatar grow?',
    sliderLabel: 'A little',
    sliderLabelEnd: 'A lot',
    sliderMin: 0,
    sliderMax: 100,
    explanation: 'Each post gives XP, coins, and shapes their look — the more you feed, the more they grow!',
  },
  {
    type: 'tap',
    question: 'How can you get bonus XP on the dashboard?',
    tapLabel: "I'll tap my avatar for +XP!",
    tapDoneText: 'Nice! Tap your avatar anytime for extra XP.',
    explanation: 'Tap your avatar on the dashboard for bonus XP — no cooldown.',
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

// Total steps: slide0, reinforce0, slide1, reinforce1, slide2, reinforce2, slide3 → 7 steps
const TOTAL_STEPS = ONBOARDING_SLIDES.length + REINFORCEMENTS.length;

export function AvatarCreation({ quizState, onComplete }: AvatarCreationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [creationStatus, setCreationStatus] = useState<'creating' | 'waiting' | 'ready'>('creating');
  const [stepMessageIndex, setStepMessageIndex] = useState(0);
  const creationSentRef = useRef(false);
  // Reinforcement state
  const [choiceSelected, setChoiceSelected] = useState<'A' | 'B' | null>(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [tapDone, setTapDone] = useState(false);
  const [reinforceShowExplanation, setReinforceShowExplanation] = useState(false);

  const isSlideStep = currentStep % 2 === 0;
  const slideIndex = currentStep === TOTAL_STEPS - 1 ? ONBOARDING_SLIDES.length - 1 : Math.floor(currentStep / 2);
  const reinforceIndex = isSlideStep ? -1 : Math.floor(currentStep / 2);
  const reinforcement = reinforceIndex >= 0 ? REINFORCEMENTS[reinforceIndex] : null;

  // Reset slider when entering slider reinforcement
  useEffect(() => {
    if (reinforcement?.type === 'slider') setSliderValue(50);
  }, [currentStep, reinforcement?.type]);

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

  const goNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
      setChoiceSelected(null);
      setReinforceShowExplanation(false);
      setTapDone(false);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setReinforceShowExplanation(false);
      setChoiceSelected(null);
      setTapDone(false);
    }
  };

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard?new=true';
  };

  const onReinforcementDone = () => {
    setReinforceShowExplanation(false);
    setChoiceSelected(null);
    setTapDone(false);
    setCurrentStep((s) => s + 1);
  };

  const slide = ONBOARDING_SLIDES[slideIndex];
  const Icon = slide?.icon;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

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

      {/* Progress dots (4 slides) */}
      <div className="pt-8 pb-4 px-6 flex items-center justify-center gap-2 relative z-10">
        {ONBOARDING_SLIDES.map((_, i) => (
          <motion.div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === slideIndex ? 'w-8 bg-primary' : i < slideIndex ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Main content: slide or reinforcement */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <AnimatePresence mode="wait">
          {isSlideStep ? (
            <motion.div
              key={`slide-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm text-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border ${getColorClass(slide.color)}`}
              >
                <Icon className="w-10 h-10" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl font-bold text-foreground mb-4"
              >
                {slide.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground leading-relaxed mb-6"
              >
                {slide.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className={`p-4 rounded-xl border ${getColorClass(slide.color)}`}
              >
                <p className="text-sm font-medium">{slide.highlight}</p>
              </motion.div>
            </motion.div>
          ) : reinforcement ? (
            <motion.div
              key={`reinforce-${currentStep}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm"
            >
              {/* Reinforcement: choice */}
              {reinforcement.type === 'choice' && (
                <div className="text-center space-y-6">
                  <p className="text-lg font-medium text-foreground">{reinforcement.question}</p>
                  {!reinforceShowExplanation ? (
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        className="h-12 rounded-xl border-2"
                        onClick={() => {
                          setChoiceSelected('A');
                          setReinforceShowExplanation(true);
                        }}
                      >
                        A) {reinforcement.choiceA}
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 rounded-xl border-2"
                        onClick={() => {
                          setChoiceSelected('B');
                          setReinforceShowExplanation(true);
                        }}
                      >
                        B) {reinforcement.choiceB}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl">
                        {reinforcement.explanation}
                      </p>
                      <Button onClick={onReinforcementDone} className="w-full h-12 rounded-xl">
                        Continue <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Reinforcement: slider */}
              {reinforcement.type === 'slider' && (
                <div className="text-center space-y-6">
                  <div>
                    <p className="text-lg font-medium text-foreground">{reinforcement.question}</p>
                    <p className="text-sm text-muted-foreground mt-1">Slide to your guess — no wrong answer.</p>
                  </div>
                  {!reinforceShowExplanation ? (
                    <div className="space-y-5">
                      <div className="px-1">
                        <input
                          type="range"
                          min={reinforcement.sliderMin ?? 0}
                          max={reinforcement.sliderMax ?? 100}
                          value={sliderValue}
                          onChange={(e) => setSliderValue(Number(e.target.value))}
                          className="w-full h-4 rounded-full bg-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:shadow-md"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                          <span>{reinforcement.sliderLabel ?? 'A little'}</span>
                          <span>{reinforcement.sliderLabelEnd ?? 'A lot'}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setReinforceShowExplanation(true)}
                        className="w-full h-12 rounded-xl"
                      >
                        See how it works
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl leading-relaxed">
                        {reinforcement.explanation}
                      </p>
                      <Button onClick={onReinforcementDone} className="w-full h-12 rounded-xl">
                        Continue <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Reinforcement: tap */}
              {reinforcement.type === 'tap' && (
                <div className="text-center space-y-6">
                  <p className="text-lg font-medium text-foreground">{reinforcement.question}</p>
                  {!tapDone ? (
                    <Button
                      onClick={() => setTapDone(true)}
                      className="w-full h-14 rounded-xl text-lg gap-2"
                    >
                      <Hand className="w-5 h-5" />
                      {reinforcement.tapLabel}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {reinforcement.tapDoneText}
                      </p>
                      <p className="text-xs text-muted-foreground">{reinforcement.explanation}</p>
                      <Button onClick={onReinforcementDone} className="w-full h-12 rounded-xl">
                        Continue <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : null}
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

        {/* Navigation buttons (only on slide steps; reinforcement has its own Continue) */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={goPrev}
            disabled={currentStep === 0}
            className="rounded-xl h-12 w-12 border-border"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          {isLastStep ? (
            <Button
              onClick={handleGoToDashboard}
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Enter App
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : isSlideStep ? (
            <Button
              onClick={goNext}
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <div className="flex-1 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Answer above to continue</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
