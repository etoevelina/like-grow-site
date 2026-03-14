'use client';

import { motion } from 'framer-motion';
import { Check, Film, Dumbbell, Plane, Music, Smile, Utensils, Shirt, Newspaper, Wrench, ArrowRight } from 'lucide-react';
import { Category, CATEGORY_OPTIONS } from '@/lib/quiz-types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  film: <Film className="w-6 h-6" />,
  dumbbell: <Dumbbell className="w-6 h-6" />,
  plane: <Plane className="w-6 h-6" />,
  music: <Music className="w-6 h-6" />,
  smile: <Smile className="w-6 h-6" />,
  utensils: <Utensils className="w-6 h-6" />,
  shirt: <Shirt className="w-6 h-6" />,
  newspaper: <Newspaper className="w-6 h-6" />,
  wrench: <Wrench className="w-6 h-6" />,
};

interface CategoriesStepProps {
  selectedCategories: Category[];
  onToggleCategory: (category: Category) => void;
  onNext: () => void;
}

export function CategoriesStep({ selectedCategories, onToggleCategory, onNext }: CategoriesStepProps) {
  const canProceed = selectedCategories.length >= 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-md mx-auto px-4"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          What interests you?
        </h2>
        <p className="text-muted-foreground text-sm">
          Select all that apply
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {CATEGORY_OPTIONS.map((option, index) => {
          const isSelected = selectedCategories.includes(option.id);
          
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => onToggleCategory(option.id)}
              className={cn(
                'relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200',
                'active:scale-95',
                isSelected
                  ? 'bg-primary/15 border-primary text-primary'
                  : 'bg-card border-border text-foreground hover:bg-muted'
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
              
              <div className={cn(
                'mb-2 transition-colors',
                isSelected ? 'text-primary' : 'text-muted-foreground'
              )}>
                {CATEGORY_ICONS[option.icon]}
              </div>
              
              <span className="text-xs font-medium text-center leading-tight">
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected tags */}
      {selectedCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap gap-2 justify-center mb-6"
        >
          {selectedCategories.map(cat => {
            const option = CATEGORY_OPTIONS.find(o => o.id === cat);
            return (
              <span 
                key={cat}
                className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium"
              >
                {option?.label}
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
