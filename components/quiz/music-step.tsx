'use client';

import { motion } from 'framer-motion';
import { Music, Headphones } from 'lucide-react';
import { MusicGenre, MUSIC_GENRES } from '@/lib/quiz-types';
import { cn } from '@/lib/utils';

interface MusicStepProps {
  selectedGenre: MusicGenre | null;
  onSelectGenre: (genre: MusicGenre) => void;
  onNext: () => void;
}

export function MusicStep({ selectedGenre, onSelectGenre, onNext }: MusicStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-lg mx-auto px-4"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 mb-4"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Headphones className="w-10 h-10 text-primary" />
          </motion.div>
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
          Music Vibes
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          What music do you vibe to most? This adds a soundtrack to your avatar!
        </p>
        <p className="text-sm text-muted-foreground/70 mt-2 italic">
          Think Coachella drops or chill playlists
        </p>
      </div>

      {/* Genre Selection */}
      <div className="space-y-3 mb-8">
        {MUSIC_GENRES.map((genre, index) => {
          const isSelected = selectedGenre === genre.id;
          
          return (
            <motion.button
              key={genre.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectGenre(genre.id)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300',
                'hover:scale-[1.02] active:scale-[0.98]',
                isSelected
                  ? 'bg-primary/20 border-primary shadow-lg'
                  : 'bg-card border-border hover:border-primary/50'
              )}
            >
              {/* Icon with gradient background */}
              <div className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br',
                genre.color
              )}>
                <Music className="w-7 h-7 text-white" />
              </div>
              
              {/* Text */}
              <div className="flex-1 text-left">
                <div className="font-bold text-foreground">{genre.label}</div>
                <div className="text-sm text-muted-foreground">{genre.description}</div>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.button
        onClick={onNext}
        disabled={!selectedGenre}
        whileHover={{ scale: selectedGenre ? 1.02 : 1 }}
        whileTap={{ scale: selectedGenre ? 0.98 : 1 }}
        className={cn(
          'w-full py-4 rounded-full font-bold text-lg transition-all duration-300',
          selectedGenre
            ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground glow-primary hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        )}
      >
        {selectedGenre ? 'Continue' : 'Pick a genre'}
      </motion.button>
    </motion.div>
  );
}
