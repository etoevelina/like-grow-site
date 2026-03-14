'use client';

import { useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SwipeCard, SwipeResult } from '@/lib/quiz-types';

interface SwipeCardsProps {
  cards: SwipeCard[];
  categoryLabel: string;
  onComplete: (results: SwipeResult[]) => void;
}

export function SwipeCards({ cards, categoryLabel, onComplete }: SwipeCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SwipeResult[]>([]);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;

  const handleSwipe = useCallback((liked: boolean) => {
    if (!currentCard) return;

    const newResult: SwipeResult = {
      id: currentCard.id,
      liked,
    };

    const newResults = [...results, newResult];
    setResults(newResults);
    setExitDirection(liked ? 'right' : 'left');

    setTimeout(() => {
      if (isLastCard) {
        onComplete(newResults);
      } else {
        setCurrentIndex(prev => prev + 1);
        setExitDirection(null);
      }
    }, 300);
  }, [currentCard, results, isLastCard, onComplete]);

  if (!currentCard) {
    return null;
  }

  return (
    <div className="flex flex-col items-center px-4 w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-muted-foreground text-sm mb-1">
          {currentIndex + 1} of {cards.length}
        </p>
        <h2 className="text-xl font-semibold text-foreground">
          Swipe what you like
        </h2>
        <p className="text-muted-foreground text-sm mt-1">{categoryLabel}</p>
      </div>

      {/* Card Stack */}
      <div className="relative w-full aspect-[3/4] mb-8">
        {/* Background cards for depth effect */}
        {cards.slice(currentIndex + 1, currentIndex + 3).map((card, idx) => (
          <div
            key={card.id}
            className="absolute inset-0 rounded-3xl overflow-hidden glass-card"
            style={{
              transform: `scale(${1 - (idx + 1) * 0.05}) translateY(${(idx + 1) * 12}px)`,
              zIndex: 10 - idx,
              opacity: 1 - (idx + 1) * 0.3,
            }}
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        ))}

        {/* Current card */}
        <AnimatePresence mode="wait">
          <SwipeableCard
            key={currentCard.id}
            card={currentCard}
            onSwipe={handleSwipe}
            exitDirection={exitDirection}
          />
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => handleSwipe(false)}
          className="w-16 h-16 rounded-full bg-card border-2 border-destructive/50 flex items-center justify-center transition-all hover:scale-110 hover:bg-destructive/20 hover:border-destructive active:scale-95"
        >
          <X className="w-7 h-7 text-destructive" />
        </button>

        <button
          onClick={() => handleSwipe(true)}
          className="w-16 h-16 rounded-full bg-card border-2 border-accent/50 flex items-center justify-center transition-all hover:scale-110 hover:bg-accent/20 hover:border-accent active:scale-95"
        >
          <Heart className="w-7 h-7 text-accent" />
        </button>
      </div>

      {/* Swipe hints */}
      <div className="flex items-center justify-between w-full mt-6 px-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs">Nope</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-xs">Like</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

interface SwipeableCardProps {
  card: SwipeCard;
  onSwipe: (liked: boolean) => void;
  exitDirection: 'left' | 'right' | null;
}

function SwipeableCard({ card, onSwipe, exitDirection }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe(true);
    } else if (info.offset.x < -threshold) {
      onSwipe(false);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing swipe-card z-20"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: exitDirection === 'left' ? -300 : exitDirection === 'right' ? 300 : 0,
      }}
      exit={{ 
        opacity: 0,
        x: exitDirection === 'left' ? -300 : 300,
        transition: { duration: 0.3 }
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden glass-card shadow-2xl">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Like indicator */}
        <motion.div 
          className="absolute top-6 right-6 px-4 py-2 rounded-xl border-2 border-accent bg-accent/20 rotate-12"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-accent font-bold text-lg">LIKE</span>
        </motion.div>

        {/* Nope indicator */}
        <motion.div 
          className="absolute top-6 left-6 px-4 py-2 rounded-xl border-2 border-destructive bg-destructive/20 -rotate-12"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-destructive font-bold text-lg">NOPE</span>
        </motion.div>

        {/* Card info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-foreground mb-1">
            {card.title}
          </h3>
          {card.subtitle && (
            <p className="text-muted-foreground text-sm">
              {card.subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
