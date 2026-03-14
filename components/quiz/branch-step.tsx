'use client';

import { motion } from 'framer-motion';
import { Category, BRANCH_QUESTIONS, CATEGORY_OPTIONS } from '@/lib/quiz-types';
import { cn } from '@/lib/utils';

interface BranchStepProps {
  category: Category;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  onNext: () => void;
}

export function BranchStep({ category, selectedOption, onSelectOption, onNext }: BranchStepProps) {
  const categoryInfo = CATEGORY_OPTIONS.find(c => c.id === category);
  const branchData = BRANCH_QUESTIONS[category];
  const question = branchData.questions[0];

  const getGradientColor = (index: number) => {
    const gradients = [
      'from-primary/40 to-primary/20',
      'from-secondary/40 to-secondary/20',
      'from-accent/40 to-accent/20',
      'from-purple-500/40 to-purple-500/20',
    ];
    return gradients[index % gradients.length];
  };

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
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-card rounded-full border border-border"
        >
          <span className="text-2xl">{categoryInfo?.icon}</span>
          <span className="font-medium text-foreground">{categoryInfo?.label}</span>
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
          {question.text}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          This fine-tunes your avatar&apos;s personality!
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option;
          
          return (
            <motion.button
              key={option}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectOption(option)}
              className={cn(
                'relative p-5 rounded-2xl border-2 transition-all duration-300 text-center',
                'hover:scale-[1.03] active:scale-[0.97]',
                isSelected
                  ? 'bg-primary/20 border-primary shadow-lg'
                  : 'bg-card border-border hover:border-primary/50'
              )}
            >
              {/* Background gradient */}
              <div className={cn(
                'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-50',
                getGradientColor(index)
              )} />
              
              {/* Content */}
              <div className="relative">
                <div className="text-3xl mb-2">
                  {index === 0 && '⚡'}
                  {index === 1 && '🎯'}
                  {index === 2 && '✨'}
                  {index === 3 && '🚀'}
                </div>
                <div className="font-semibold text-foreground text-sm leading-tight">
                  {option}
                </div>
              </div>

              {/* Selection ring */}
              {isSelected && (
                <motion.div
                  layoutId="selection-ring"
                  className="absolute inset-0 rounded-2xl border-2 border-primary"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.button
        onClick={onNext}
        disabled={!selectedOption}
        whileHover={{ scale: selectedOption ? 1.02 : 1 }}
        whileTap={{ scale: selectedOption ? 0.98 : 1 }}
        className={cn(
          'w-full py-4 rounded-full font-bold text-lg transition-all duration-300',
          selectedOption
            ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground glow-primary hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        )}
      >
        {selectedOption ? 'Continue' : 'Make a choice'}
      </motion.button>
    </motion.div>
  );
}
