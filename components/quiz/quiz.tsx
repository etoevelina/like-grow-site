'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { QuizState, Category, MusicGenre } from '@/lib/quiz-types';
import { ProgressBar } from './progress-bar';
import { WelcomeScreen } from './welcome-screen';
import { CategoriesStep } from './categories-step';
import { HumorStep } from './humor-step';
import { MusicStep } from './music-step';
import { BranchStep } from './branch-step';
import { GenerationScreen } from './generation-screen';

type QuizStep = 'welcome' | 'categories' | 'humor' | 'music' | 'branch' | 'generation';

export function Quiz() {
  const [currentStep, setCurrentStep] = useState<QuizStep>('welcome');
  const [currentBranchIndex, setCurrentBranchIndex] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>({
    step: 0,
    selectedCategories: [],
    humorLevel: 50,
    musicGenre: null,
    branchAnswers: {},
    progress: 0,
  });

  const calculateProgress = useCallback((step: QuizStep, branchIndex: number = 0) => {
    const baseProgress: Record<QuizStep, number> = {
      welcome: 0,
      categories: 20,
      humor: 40,
      music: 60,
      branch: 70,
      generation: 100,
    };
    
    if (step === 'branch' && quizState.selectedCategories.length > 0) {
      const branchProgress = (branchIndex / quizState.selectedCategories.length) * 30;
      return 60 + branchProgress;
    }
    
    return baseProgress[step];
  }, [quizState.selectedCategories.length]);

  const updateProgress = useCallback((step: QuizStep, branchIndex: number = 0) => {
    setQuizState(prev => ({
      ...prev,
      progress: calculateProgress(step, branchIndex),
    }));
  }, [calculateProgress]);

  const handleStart = () => {
    setCurrentStep('categories');
    updateProgress('categories');
  };

  const handleToggleCategory = (category: Category) => {
    setQuizState(prev => {
      const isSelected = prev.selectedCategories.includes(category);
      if (isSelected) {
        return {
          ...prev,
          selectedCategories: prev.selectedCategories.filter(c => c !== category),
        };
      }
      if (prev.selectedCategories.length >= 3) {
        return prev;
      }
      return {
        ...prev,
        selectedCategories: [...prev.selectedCategories, category],
      };
    });
  };

  const handleCategoriesNext = () => {
    setCurrentStep('humor');
    updateProgress('humor');
  };

  const handleHumorChange = (value: number) => {
    setQuizState(prev => ({ ...prev, humorLevel: value }));
  };

  const handleHumorNext = () => {
    setCurrentStep('music');
    updateProgress('music');
  };

  const handleMusicSelect = (genre: MusicGenre) => {
    setQuizState(prev => ({ ...prev, musicGenre: genre }));
  };

  const handleMusicNext = () => {
    if (quizState.selectedCategories.length > 0) {
      setCurrentStep('branch');
      setCurrentBranchIndex(0);
      updateProgress('branch', 0);
    } else {
      setCurrentStep('generation');
      updateProgress('generation');
    }
  };

  const handleBranchSelect = (option: string) => {
    const currentCategory = quizState.selectedCategories[currentBranchIndex];
    setQuizState(prev => ({
      ...prev,
      branchAnswers: {
        ...prev.branchAnswers,
        [currentCategory]: [option],
      },
    }));
  };

  const handleBranchNext = () => {
    const nextIndex = currentBranchIndex + 1;
    if (nextIndex < quizState.selectedCategories.length) {
      setCurrentBranchIndex(nextIndex);
      updateProgress('branch', nextIndex);
    } else {
      setCurrentStep('generation');
      updateProgress('generation');
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'categories':
        setCurrentStep('welcome');
        updateProgress('welcome');
        break;
      case 'humor':
        setCurrentStep('categories');
        updateProgress('categories');
        break;
      case 'music':
        setCurrentStep('humor');
        updateProgress('humor');
        break;
      case 'branch':
        if (currentBranchIndex > 0) {
          setCurrentBranchIndex(currentBranchIndex - 1);
          updateProgress('branch', currentBranchIndex - 1);
        } else {
          setCurrentStep('music');
          updateProgress('music');
        }
        break;
      default:
        break;
    }
  };

  const handleComplete = () => {
    // In a real app, this would save the quiz results and redirect to the profile
    console.log('Quiz completed!', quizState);
    alert('Avatar created! In a full app, this would redirect to your profile.');
  };

  const showBackButton = currentStep !== 'welcome' && currentStep !== 'generation';
  const showProgress = currentStep !== 'welcome' && currentStep !== 'generation';

  return (
    <div className="min-h-screen gradient-bg relative">
      {/* Header with back button and progress */}
      {(showBackButton || showProgress) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 px-4 py-4 bg-background/80 backdrop-blur-sm"
        >
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-4 mb-4">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="p-2 rounded-full bg-card border border-border hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
              )}
              <div className="flex-1">
                {showProgress && <ProgressBar progress={quizState.progress} />}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className={showProgress ? 'pt-28' : ''}>
        <AnimatePresence mode="wait">
          {currentStep === 'welcome' && (
            <WelcomeScreen key="welcome" onStart={handleStart} />
          )}

          {currentStep === 'categories' && (
            <motion.div
              key="categories"
              className="min-h-screen flex items-center justify-center py-12"
            >
              <CategoriesStep
                selectedCategories={quizState.selectedCategories}
                onToggleCategory={handleToggleCategory}
                onNext={handleCategoriesNext}
              />
            </motion.div>
          )}

          {currentStep === 'humor' && (
            <motion.div
              key="humor"
              className="min-h-screen flex items-center justify-center py-12"
            >
              <HumorStep
                humorLevel={quizState.humorLevel}
                onHumorChange={handleHumorChange}
                onNext={handleHumorNext}
              />
            </motion.div>
          )}

          {currentStep === 'music' && (
            <motion.div
              key="music"
              className="min-h-screen flex items-center justify-center py-12"
            >
              <MusicStep
                selectedGenre={quizState.musicGenre}
                onSelectGenre={handleMusicSelect}
                onNext={handleMusicNext}
              />
            </motion.div>
          )}

          {currentStep === 'branch' && (
            <motion.div
              key={`branch-${currentBranchIndex}`}
              className="min-h-screen flex items-center justify-center py-12"
            >
              <BranchStep
                category={quizState.selectedCategories[currentBranchIndex]}
                selectedOption={quizState.branchAnswers[quizState.selectedCategories[currentBranchIndex]]?.[0] || null}
                onSelectOption={handleBranchSelect}
                onNext={handleBranchNext}
              />
            </motion.div>
          )}

          {currentStep === 'generation' && (
            <GenerationScreen
              key="generation"
              quizState={quizState}
              onComplete={handleComplete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
