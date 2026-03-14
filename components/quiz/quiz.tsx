'use client';

import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { 
  QuizState, 
  Category, 
  MusicGenre, 
  SwipeResult,
  SWIPE_CARDS,
  TRIVIA_QUESTIONS,
  QUOTE_CHALLENGES,
  MUSIC_CHALLENGES
} from '@/lib/quiz-types';
import { ProgressBar } from './progress-bar';
import { WelcomeScreen } from './welcome-screen';
import { CategoriesStep } from './categories-step';
import { HumorStep } from './humor-step';
import { MusicStep } from './music-step';
import { SwipeCards } from './swipe-cards';
import { TriviaStep } from './trivia-step';
import { QuoteChallenge } from './quote-challenge';
import { GenerationScreen } from './generation-screen';

type QuizStep = 
  | 'welcome' 
  | 'categories' 
  | 'humor' 
  | 'music' 
  | 'swipe' 
  | 'trivia' 
  | 'quote'
  | 'musicChallenge'
  | 'generation';

export function Quiz() {
  const [currentStep, setCurrentStep] = useState<QuizStep>('welcome');
  const [swipeCategoryIndex, setSwipeCategoryIndex] = useState(0);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [musicChallengeIndex, setMusicChallengeIndex] = useState(0);
  
  const [quizState, setQuizState] = useState<QuizState>({
    step: 0,
    selectedCategories: [],
    humorLevel: 50,
    musicGenres: [],
    swipeResults: {},
    triviaAnswers: {},
    quoteAnswers: {},
    progress: 0,
  });

  // Get categories that have swipe cards
  const swipeCategories = useMemo(() => {
    return quizState.selectedCategories.filter(cat => 
      SWIPE_CARDS[cat] && SWIPE_CARDS[cat].length > 0
    );
  }, [quizState.selectedCategories]);

  // Get relevant trivia questions
  const relevantTrivia = useMemo(() => {
    return TRIVIA_QUESTIONS.filter(q => 
      quizState.selectedCategories.includes(q.category)
    ).slice(0, 2);
  }, [quizState.selectedCategories]);

  // Get relevant quote challenges
  const relevantQuotes = useMemo(() => {
    return QUOTE_CHALLENGES.filter(q => 
      quizState.selectedCategories.includes(q.category)
    ).slice(0, 1);
  }, [quizState.selectedCategories]);

  // Check if music challenges should be shown
  const showMusicChallenges = useMemo(() => {
    return quizState.selectedCategories.includes('music') || quizState.musicGenres.length > 0;
  }, [quizState.selectedCategories, quizState.musicGenres]);

  const calculateProgress = useCallback(() => {
    const steps: QuizStep[] = ['welcome', 'categories', 'humor', 'music'];
    
    // Add swipe steps
    swipeCategories.forEach(() => steps.push('swipe'));
    
    // Add trivia steps
    relevantTrivia.forEach(() => steps.push('trivia'));
    
    // Add quote steps
    relevantQuotes.forEach(() => steps.push('quote'));
    
    // Add music challenge if applicable
    if (showMusicChallenges) {
      steps.push('musicChallenge');
    }
    
    steps.push('generation');
    
    const currentIndex = (() => {
      switch (currentStep) {
        case 'welcome': return 0;
        case 'categories': return 1;
        case 'humor': return 2;
        case 'music': return 3;
        case 'swipe': return 4 + swipeCategoryIndex;
        case 'trivia': return 4 + swipeCategories.length + triviaIndex;
        case 'quote': return 4 + swipeCategories.length + relevantTrivia.length + quoteIndex;
        case 'musicChallenge': return 4 + swipeCategories.length + relevantTrivia.length + relevantQuotes.length + musicChallengeIndex;
        case 'generation': return steps.length - 1;
        default: return 0;
      }
    })();
    
    return Math.round((currentIndex / (steps.length - 1)) * 100);
  }, [currentStep, swipeCategories, relevantTrivia, relevantQuotes, showMusicChallenges, swipeCategoryIndex, triviaIndex, quoteIndex, musicChallengeIndex]);

  const handleStart = () => {
    setCurrentStep('categories');
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
      return {
        ...prev,
        selectedCategories: [...prev.selectedCategories, category],
      };
    });
  };

  const handleCategoriesNext = () => {
    setCurrentStep('humor');
  };

  const handleHumorChange = (value: number) => {
    setQuizState(prev => ({ ...prev, humorLevel: value }));
  };

  const handleHumorNext = () => {
    setCurrentStep('music');
  };

  const handleToggleMusicGenre = (genre: MusicGenre) => {
    setQuizState(prev => {
      const isSelected = prev.musicGenres.includes(genre);
      if (isSelected) {
        return {
          ...prev,
          musicGenres: prev.musicGenres.filter(g => g !== genre),
        };
      }
      return {
        ...prev,
        musicGenres: [...prev.musicGenres, genre],
      };
    });
  };

  const handleMusicNext = () => {
    if (swipeCategories.length > 0) {
      setSwipeCategoryIndex(0);
      setCurrentStep('swipe');
    } else if (relevantTrivia.length > 0) {
      setTriviaIndex(0);
      setCurrentStep('trivia');
    } else if (relevantQuotes.length > 0) {
      setQuoteIndex(0);
      setCurrentStep('quote');
    } else if (showMusicChallenges) {
      setMusicChallengeIndex(0);
      setCurrentStep('musicChallenge');
    } else {
      setCurrentStep('generation');
    }
  };

  const handleSwipeComplete = (results: SwipeResult[]) => {
    const currentCategory = swipeCategories[swipeCategoryIndex];
    setQuizState(prev => ({
      ...prev,
      swipeResults: {
        ...prev.swipeResults,
        [currentCategory]: results,
      },
    }));

    const nextSwipeIndex = swipeCategoryIndex + 1;
    if (nextSwipeIndex < swipeCategories.length) {
      setSwipeCategoryIndex(nextSwipeIndex);
    } else if (relevantTrivia.length > 0) {
      setTriviaIndex(0);
      setCurrentStep('trivia');
    } else if (relevantQuotes.length > 0) {
      setQuoteIndex(0);
      setCurrentStep('quote');
    } else if (showMusicChallenges) {
      setMusicChallengeIndex(0);
      setCurrentStep('musicChallenge');
    } else {
      setCurrentStep('generation');
    }
  };

  const handleTriviaAnswer = (questionId: string, correct: boolean) => {
    setQuizState(prev => ({
      ...prev,
      triviaAnswers: {
        ...prev.triviaAnswers,
        [questionId]: correct,
      },
    }));
  };

  const handleTriviaNext = () => {
    const nextIndex = triviaIndex + 1;
    if (nextIndex < relevantTrivia.length) {
      setTriviaIndex(nextIndex);
    } else if (relevantQuotes.length > 0) {
      setQuoteIndex(0);
      setCurrentStep('quote');
    } else if (showMusicChallenges) {
      setMusicChallengeIndex(0);
      setCurrentStep('musicChallenge');
    } else {
      setCurrentStep('generation');
    }
  };

  const handleQuoteAnswer = (challengeId: string, answer: string) => {
    setQuizState(prev => ({
      ...prev,
      quoteAnswers: {
        ...prev.quoteAnswers,
        [challengeId]: answer,
      },
    }));
  };

  const handleQuoteNext = () => {
    const nextIndex = quoteIndex + 1;
    if (nextIndex < relevantQuotes.length) {
      setQuoteIndex(nextIndex);
    } else if (showMusicChallenges) {
      setMusicChallengeIndex(0);
      setCurrentStep('musicChallenge');
    } else {
      setCurrentStep('generation');
    }
  };

  const handleMusicChallengeNext = () => {
    const nextIndex = musicChallengeIndex + 1;
    if (nextIndex < MUSIC_CHALLENGES.length) {
      setMusicChallengeIndex(nextIndex);
    } else {
      setCurrentStep('generation');
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'categories':
        setCurrentStep('welcome');
        break;
      case 'humor':
        setCurrentStep('categories');
        break;
      case 'music':
        setCurrentStep('humor');
        break;
      case 'swipe':
        if (swipeCategoryIndex > 0) {
          setSwipeCategoryIndex(swipeCategoryIndex - 1);
        } else {
          setCurrentStep('music');
        }
        break;
      case 'trivia':
        if (triviaIndex > 0) {
          setTriviaIndex(triviaIndex - 1);
        } else if (swipeCategories.length > 0) {
          setSwipeCategoryIndex(swipeCategories.length - 1);
          setCurrentStep('swipe');
        } else {
          setCurrentStep('music');
        }
        break;
      case 'quote':
        if (quoteIndex > 0) {
          setQuoteIndex(quoteIndex - 1);
        } else if (relevantTrivia.length > 0) {
          setTriviaIndex(relevantTrivia.length - 1);
          setCurrentStep('trivia');
        } else if (swipeCategories.length > 0) {
          setSwipeCategoryIndex(swipeCategories.length - 1);
          setCurrentStep('swipe');
        } else {
          setCurrentStep('music');
        }
        break;
      case 'musicChallenge':
        if (musicChallengeIndex > 0) {
          setMusicChallengeIndex(musicChallengeIndex - 1);
        } else if (relevantQuotes.length > 0) {
          setQuoteIndex(relevantQuotes.length - 1);
          setCurrentStep('quote');
        } else if (relevantTrivia.length > 0) {
          setTriviaIndex(relevantTrivia.length - 1);
          setCurrentStep('trivia');
        } else if (swipeCategories.length > 0) {
          setSwipeCategoryIndex(swipeCategories.length - 1);
          setCurrentStep('swipe');
        } else {
          setCurrentStep('music');
        }
        break;
      default:
        break;
    }
  };

  const handleComplete = () => {
    console.log('Quiz completed!', quizState);
    alert('Avatar created! In a full app, this would redirect to your profile.');
  };

  const showBackButton = currentStep !== 'welcome' && currentStep !== 'generation';
  const showProgress = currentStep !== 'welcome' && currentStep !== 'generation';
  const progress = calculateProgress();

  const getCategoryLabel = (category: Category) => {
    const labels: Record<Category, string> = {
      movies: 'Movies & TV',
      sports: 'Sports & Fitness',
      travel: 'Travel Destinations',
      music: 'Music',
      memes: 'Memes',
      food: 'Cuisines',
      fashion: 'Fashion Styles',
      news: 'News',
      diy: 'DIY Projects',
    };
    return labels[category];
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      {(showBackButton || showProgress) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 px-4 py-4 bg-background/90 backdrop-blur-sm border-b border-border"
        >
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
              )}
              <div className="flex-1">
                {showProgress && <ProgressBar progress={progress} />}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className={showProgress ? 'pt-24' : ''}>
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
                selectedGenres={quizState.musicGenres}
                onToggleGenre={handleToggleMusicGenre}
                onNext={handleMusicNext}
              />
            </motion.div>
          )}

          {currentStep === 'swipe' && swipeCategories[swipeCategoryIndex] && (
            <motion.div
              key={`swipe-${swipeCategoryIndex}`}
              className="min-h-screen flex items-center justify-center py-12"
            >
              <SwipeCards
                cards={SWIPE_CARDS[swipeCategories[swipeCategoryIndex]]}
                categoryLabel={getCategoryLabel(swipeCategories[swipeCategoryIndex])}
                onComplete={handleSwipeComplete}
              />
            </motion.div>
          )}

          {currentStep === 'trivia' && relevantTrivia[triviaIndex] && (
            <motion.div
              key={`trivia-${triviaIndex}`}
              className="min-h-screen flex items-center justify-center py-12"
            >
              <TriviaStep
                question={relevantTrivia[triviaIndex]}
                onAnswer={handleTriviaAnswer}
                onNext={handleTriviaNext}
              />
            </motion.div>
          )}

          {currentStep === 'quote' && relevantQuotes[quoteIndex] && (
            <motion.div
              key={`quote-${quoteIndex}`}
              className="min-h-screen flex items-center justify-center py-12"
            >
              <QuoteChallenge
                challenge={relevantQuotes[quoteIndex]}
                onAnswer={handleQuoteAnswer}
                onNext={handleQuoteNext}
              />
            </motion.div>
          )}

          {currentStep === 'musicChallenge' && MUSIC_CHALLENGES[musicChallengeIndex] && (
            <motion.div
              key={`musicChallenge-${musicChallengeIndex}`}
              className="min-h-screen flex items-center justify-center py-12"
            >
              <QuoteChallenge
                challenge={{
                  id: MUSIC_CHALLENGES[musicChallengeIndex].id,
                  category: 'music',
                  quote: MUSIC_CHALLENGES[musicChallengeIndex].lyric,
                  missingWord: MUSIC_CHALLENGES[musicChallengeIndex].correctAnswer,
                  options: MUSIC_CHALLENGES[musicChallengeIndex].options,
                  source: `${MUSIC_CHALLENGES[musicChallengeIndex].artist} - ${MUSIC_CHALLENGES[musicChallengeIndex].song}`,
                }}
                onAnswer={handleQuoteAnswer}
                onNext={handleMusicChallengeNext}
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
