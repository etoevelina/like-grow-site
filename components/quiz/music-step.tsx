'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight, Music } from 'lucide-react';
import { MusicGenre, MUSIC_GENRES } from '@/lib/quiz-types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MusicStepProps {
  selectedGenres: MusicGenre[];
  onToggleGenre: (genre: MusicGenre) => void;
  onNext: () => void;
}

export function MusicStep({ selectedGenres, onToggleGenre, onNext }: MusicStepProps) {
  const canProceed = selectedGenres.length >= 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-md mx-auto px-4"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Music className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          Your Music Taste
        </h2>
        <p className="text-muted-foreground text-sm">
          Select your favorite genres
        </p>
      </div>

      {/* Genre Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {MUSIC_GENRES.map((genre, index) => {
          const isSelected = selectedGenres.includes(genre.id);
          
          return (
            <motion.button
              key={genre.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => onToggleGenre(genre.id)}
              className={cn(
                'relative flex flex-col items-start p-4 rounded-2xl border transition-all duration-200 text-left',
                'active:scale-95',
                isSelected
                  ? 'bg-primary/15 border-primary'
                  : 'bg-card border-border hover:bg-muted'
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
              
              <span className={cn(
                'text-base font-semibold mb-1',
                isSelected ? 'text-primary' : 'text-foreground'
              )}>
                {genre.label}
              </span>
              
              <span className="text-xs text-muted-foreground leading-tight">
                {genre.artists}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected genres */}
      {selectedGenres.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap gap-2 justify-center mb-6"
        >
          {selectedGenres.map(genreId => {
            const genre = MUSIC_GENRES.find(g => g.id === genreId);
            return (
              <span 
                key={genreId}
                className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium"
              >
                {genre?.label}
              </span>
            );
          })}
        </motion.div>
      )}

      {/* Next Button */}
      <Button
        onClick={onNext}
        disabled={!canProceed}
        className={cn(
          'w-full py-6 rounded-2xl font-semibold text-lg transition-all',
          canProceed
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        )}
      >
        {canProceed ? (
          <>
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        ) : (
          'Select at least one'
        )}
      </Button>
    </motion.div>
  );
}
