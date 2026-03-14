'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Category, CATEGORY_OPTIONS } from '@/lib/quiz-types';
import { cn } from '@/lib/utils';

interface CategoriesStepProps {
  selectedCategories: Category[];
  onToggleCategory: (category: Category) => void;
  onNext: () => void;
}

export function CategoriesStep({ selectedCategories, onToggleCategory, onNext }: CategoriesStepProps) {
  const canProceed = selectedCategories.length >= 1 && selectedCategories.length <= 3;

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
          className="inline-block mb-4 px-4 py-2 bg-secondary/20 rounded-full"
        >
          <span className="text-2xl">🎯</span>
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
          Your Save Obsessions
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          What do you save most often? Pick your top 3 — this builds your avatar&apos;s core!
        </p>
        <p className="text-sm text-muted-foreground/70 mt-2 italic">
          (Be honest, no judgments — even if it&apos;s all cat videos)
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {CATEGORY_OPTIONS.map((option, index) => {
          const isSelected = selectedCategories.includes(option.id);
          const isDisabled = selectedCategories.length >= 3 && !isSelected;
          
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !isDisabled && onToggleCategory(option.id)}
              disabled={isDisabled}
              className={cn(
                'relative p-4 rounded-2xl border-2 transition-all duration-300 text-center',
                'hover:scale-105 active:scale-95',
                isSelected
                  ? 'bg-primary/20 border-primary shadow-lg glow-primary'
                  : 'bg-card border-border hover:border-primary/50',
                isDisabled && 'opacity-50 cursor-not-allowed hover:scale-100'
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="text-sm font-medium text-foreground leading-tight">
                {option.label.split('/')[0]}
              </div>
              <div className="text-xs text-muted-foreground mt-1 hidden md:block">
                {option.description}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selection counter */}
      <div className="text-center mb-6">
        <span className={cn(
          'text-sm font-medium px-4 py-2 rounded-full',
          canProceed ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
        )}>
          {selectedCategories.length}/3 selected
        </span>
      </div>

      {/* Next Button */}
      <motion.button
        onClick={onNext}
        disabled={!canProceed}
        whileHover={{ scale: canProceed ? 1.02 : 1 }}
        whileTap={{ scale: canProceed ? 0.98 : 1 }}
        className={cn(
          'w-full py-4 rounded-full font-bold text-lg transition-all duration-300',
          canProceed
            ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground glow-primary hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        )}
      >
        {canProceed ? 'Continue' : 'Pick 1-3 categories'}
      </motion.button>
    </motion.div>
  );
}
