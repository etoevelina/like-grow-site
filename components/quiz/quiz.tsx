'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { 
  QuizState, 
  Category, 
  MusicGenre, 
  SwipeResult,
  SwipeCard,
  TriviaQuestion,
  QuoteChallenge as QuoteChallengeType,
  PriorityRankingData,
  PuzzleMatchData,
  MusicChallenge as MusicChallengeType,
  MixedQuestion,
  generateMixedQuestions,
  MoodBoardData,
  ThisOrThatData,
} from '@/lib/quiz-types';
import { ProgressBar } from './progress-bar';
import { WelcomeScreen } from './welcome-screen';
import { CategoriesStep } from './categories-step';
import { HumorStep } from './humor-step';
import { MusicStep } from './music-step';
import { SwipeCards } from './swipe-cards';
import { TriviaStep } from './trivia-step';
import { QuoteChallenge } from './quote-challenge';
import { PriorityRanking } from './priority-ranking';
import { PuzzleMatch } from './puzzle-match';
import { WorldMap } from './world-map';
import { MoodBoard } from './mood-board';
import { ThisOrThat } from './this-or-that';
import { MagicTransition } from './magic-transition';
import { AuthScreen } from './auth-screen';

type QuizPhase = 'welcome' | 'categories' | 'humor' | 'music' | 'questions' | 'magic' | 'auth';

export function Quiz() {
  const [currentPhase, setCurrentPhase] = useState<QuizPhase>('welcome');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [mixedQuestions, setMixedQuestions] = useState<MixedQuestion[]>([]);
  
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

  // Generate mixed questions when entering questions phase
  useEffect(() => {
    if (currentPhase === 'questions' && mixedQuestions.length === 0) {
      const includeMusicChallenges = quizState.selectedCategories.includes('music') || quizState.musicGenres.length > 0;
      const questions = generateMixedQuestions(quizState.selectedCategories, includeMusicChallenges);
      setMixedQuestions(questions);
    }
  }, [currentPhase, quizState.selectedCategories, quizState.musicGenres, mixedQuestions.length]);

  const currentQuestion = mixedQuestions[questionIndex];
  const totalSteps = 4 + mixedQuestions.length; // welcome, categories, humor, music + questions

  const calculateProgress = useCallback(() => {
    if (currentPhase === 'welcome') return 0;
    if (currentPhase === 'categories') return Math.round((1 / totalSteps) * 100);
    if (currentPhase === 'humor') return Math.round((2 / totalSteps) * 100);
    if (currentPhase === 'music') return Math.round((3 / totalSteps) * 100);
    if (currentPhase === 'questions') {
      return Math.round(((4 + questionIndex) / totalSteps) * 100);
    }
    return 100;
  }, [currentPhase, questionIndex, totalSteps]);

  const handleStart = () => {
    setCurrentPhase('categories');
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
    setCurrentPhase('humor');
  };

  const handleHumorChange = (value: number) => {
    setQuizState(prev => ({ ...prev, humorLevel: value }));
  };

  const handleHumorNext = () => {
    setCurrentPhase('music');
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
    // Generate questions now
    const includeMusicChallenges = quizState.selectedCategories.includes('music') || quizState.musicGenres.length > 0;
    const questions = generateMixedQuestions(quizState.selectedCategories, includeMusicChallenges);
    setMixedQuestions(questions);
    
    if (questions.length > 0) {
      setQuestionIndex(0);
      setCurrentPhase('questions');
    } else {
      // No questions, go straight to magic transition
      setCurrentPhase('magic');
    }
  };

  const handleQuestionComplete = () => {
    if (questionIndex < mixedQuestions.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      // Last question completed - show magic transition
      setCurrentPhase('magic');
    }
  };

  const handleMagicComplete = () => {
    setCurrentPhase('auth');
  };

  // Handlers for different question types
  const handleSwipeComplete = (results: SwipeResult[]) => {
    if (!currentQuestion) return;
    setQuizState(prev => ({
      ...prev,
      swipeResults: {
        ...prev.swipeResults,
        [currentQuestion.category]: results,
      },
    }));
    handleQuestionComplete();
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

  const handleQuoteAnswer = (challengeId: string, answer: string) => {
    setQuizState(prev => ({
      ...prev,
      quoteAnswers: {
        ...prev.quoteAnswers,
        [challengeId]: answer,
      },
    }));
  };

  const handleBack = () => {
    switch (currentPhase) {
      case 'categories':
        setCurrentPhase('welcome');
        break;
      case 'humor':
        setCurrentPhase('categories');
        break;
      case 'music':
        setCurrentPhase('humor');
        break;
      case 'questions':
        if (questionIndex > 0) {
          setQuestionIndex(prev => prev - 1);
        } else {
          setCurrentPhase('music');
        }
        break;
      default:
        break;
    }
  };

  const handleComplete = () => {
    // User successfully registered/logged in
    // In a full app, this would redirect to the main dashboard
    window.location.href = '/dashboard';
  };

  const showBackButton = currentPhase !== 'welcome' && currentPhase !== 'magic' && currentPhase !== 'auth';
  const showProgress = currentPhase !== 'welcome' && currentPhase !== 'magic' && currentPhase !== 'auth';
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

  const renderCurrentQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'swipe':
        return (
          <SwipeCards
            key={currentQuestion.id}
            cards={currentQuestion.data as SwipeCard[]}
            categoryLabel={getCategoryLabel(currentQuestion.category)}
            onComplete={handleSwipeComplete}
          />
        );
      
      case 'trivia':
        return (
          <TriviaStep
            key={currentQuestion.id}
            question={currentQuestion.data as TriviaQuestion}
            onAnswer={handleTriviaAnswer}
            onNext={handleQuestionComplete}
          />
        );
      
      case 'quote':
        return (
          <QuoteChallenge
            key={currentQuestion.id}
            challenge={currentQuestion.data as QuoteChallengeType}
            onAnswer={handleQuoteAnswer}
            onNext={handleQuestionComplete}
          />
        );
      
      case 'priority':
        const priorityData = currentQuestion.data as PriorityRankingData;
        return (
          <PriorityRanking
            key={currentQuestion.id}
            title={priorityData.title}
            subtitle={priorityData.subtitle}
            items={priorityData.items}
            onComplete={() => handleQuestionComplete()}
          />
        );
      
      case 'puzzle':
        const puzzleData = currentQuestion.data as PuzzleMatchData;
        return (
          <PuzzleMatch
            key={currentQuestion.id}
            title={puzzleData.title}
            subtitle={puzzleData.subtitle}
            pairs={puzzleData.pairs}
            onComplete={() => handleQuestionComplete()}
          />
        );
      
      case 'musicChallenge':
        const musicData = currentQuestion.data as MusicChallengeType;
        return (
          <QuoteChallenge
            key={currentQuestion.id}
            challenge={{
              id: musicData.id,
              category: 'music',
              quote: musicData.lyric,
              missingWord: musicData.correctAnswer,
              options: musicData.options,
              source: `${musicData.artist} - ${musicData.song}`,
            }}
            onAnswer={handleQuoteAnswer}
            onNext={handleQuestionComplete}
          />
        );
      
      case 'worldMap':
        return (
          <WorldMap
            key={currentQuestion.id}
            onComplete={() => handleQuestionComplete()}
          />
        );
      
      case 'moodBoard':
        const moodData = currentQuestion.data as MoodBoardData;
        return (
          <MoodBoard
            key={currentQuestion.id}
            title={moodData.title}
            subtitle={moodData.subtitle}
            options={moodData.options}
            onComplete={() => handleQuestionComplete()}
          />
        );
      
      case 'thisOrThat':
        const totData = currentQuestion.data as ThisOrThatData;
        return (
          <ThisOrThat
            key={currentQuestion.id}
            title={totData.title}
            subtitle={totData.subtitle}
            questions={totData.questions}
            onComplete={() => handleQuestionComplete()}
          />
        );
      
      default:
        return null;
    }
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
          {currentPhase === 'welcome' && (
            <WelcomeScreen key="welcome" onStart={handleStart} />
          )}

          {currentPhase === 'categories' && (
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

          {currentPhase === 'humor' && (
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

          {currentPhase === 'music' && (
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

          {currentPhase === 'questions' && currentQuestion && (
            <motion.div
              key={`question-${questionIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="min-h-screen flex items-center justify-center py-12"
            >
              {renderCurrentQuestion()}
            </motion.div>
          )}

          {currentPhase === 'magic' && (
            <MagicTransition
              key="magic"
              onComplete={handleMagicComplete}
            />
          )}

          {currentPhase === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen"
            >
              <AuthScreen onComplete={handleComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
