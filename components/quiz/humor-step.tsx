'use client';

import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ArrowRight, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HumorStepProps {
  humorLevel: number;
  onHumorChange: (value: number) => void;
  onNext: () => void;
}

export function HumorStep({ humorLevel, onHumorChange, onNext }: HumorStepProps) {
  const getHumorLabel = () => {
    if (humorLevel < 33) return 'Wholesome';
    if (humorLevel < 66) return 'Balanced';
    return 'Chaotic';
  };

  const getHumorDescription = () => {
    if (humorLevel < 33) return 'Cute puppy memes & feel-good content';
    if (humorLevel < 66) return 'A healthy mix of everything';
    return 'Existential crisis humor & dark memes';
  };

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
          <Smile className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          Humor Level
        </h2>
        <p className="text-muted-foreground text-sm">
          How chaotic is your sense of humor?
        </p>
      </div>

      {/* Slider Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-3xl p-6 mb-8"
      >
        {/* Visual representation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Background meter */}
            <div className="w-40 h-40 rounded-full border-8 border-muted flex items-center justify-center relative overflow-hidden">
              {/* Fill based on humor level */}
              <motion.div 
                className={cn(
                  'absolute bottom-0 left-0 right-0 transition-colors',
                  humorLevel < 33 && 'bg-accent/30',
                  humorLevel >= 33 && humorLevel < 66 && 'bg-chart-4/30',
                  humorLevel >= 66 && 'bg-destructive/30'
                )}
                animate={{ height: `${humorLevel}%` }}
                transition={{ type: 'spring', stiffness: 200 }}
              />
              
              {/* Center content */}
              <div className="relative z-10 text-center">
                <motion.span 
                  key={humorLevel}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-bold text-foreground"
                >
                  {humorLevel}%
                </motion.span>
                <motion.p 
                  key={getHumorLabel()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    'text-sm font-medium mt-1',
                    humorLevel < 33 && 'text-accent',
                    humorLevel >= 33 && humorLevel < 66 && 'text-chart-4',
                    humorLevel >= 66 && 'text-destructive'
                  )}
                >
                  {getHumorLabel()}
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="px-2">
          <Slider
            value={[humorLevel]}
            onValueChange={(value) => onHumorChange(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
          
          {/* Labels */}
          <div className="flex justify-between mt-3 text-xs text-muted-foreground">
            <span>Wholesome</span>
            <span>Chaotic</span>
          </div>
        </div>

        {/* Description */}
        <motion.p
          key={getHumorDescription()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          {getHumorDescription()}
        </motion.p>
      </motion.div>

      {/* Next Button */}
      <Button
        onClick={onNext}
        className="w-full py-6 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg"
      >
        Continue
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  );
}
