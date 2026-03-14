'use client';

import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface HumorStepProps {
  humorLevel: number;
  onHumorChange: (value: number) => void;
  onNext: () => void;
}

export function HumorStep({ humorLevel, onHumorChange, onNext }: HumorStepProps) {
  const getHumorEmoji = () => {
    if (humorLevel < 33) return '😊';
    if (humorLevel < 66) return '😏';
    return '🔥';
  };

  const getHumorLabel = () => {
    if (humorLevel < 33) return 'Wholesome & Light';
    if (humorLevel < 66) return 'Balanced Vibes';
    return 'Chaotic Energy';
  };

  const getHumorDescription = () => {
    if (humorLevel < 33) return 'Cute puppy memes & feel-good content';
    if (humorLevel < 66) return 'Mix of everything, you adapt';
    return '"This Is Fine" existential crises';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-lg mx-auto px-4"
    >
      {/* Header with meme reference */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
          transition={{ rotate: { repeat: Infinity, duration: 2 } }}
          className="inline-block mb-4"
        >
          <div className="text-6xl">🐕‍🦺</div>
          <div className="text-xs text-muted-foreground mt-1 italic">"This Is Fine"</div>
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
          Humor Level Check
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Pull the slider to rate your meme game! How chaotic is your humor?
        </p>
      </div>

      {/* Slider area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-3xl p-6 md:p-8 border border-border mb-8"
      >
        {/* Current level display */}
        <div className="text-center mb-8">
          <motion.div
            key={getHumorEmoji()}
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-7xl mb-4"
          >
            {getHumorEmoji()}
          </motion.div>
          <motion.h3
            key={getHumorLabel()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'text-xl font-bold mb-2',
              humorLevel < 33 && 'text-green-400',
              humorLevel >= 33 && humorLevel < 66 && 'text-secondary',
              humorLevel >= 66 && 'text-accent'
            )}
          >
            {getHumorLabel()}
          </motion.h3>
          <p className="text-sm text-muted-foreground">
            {getHumorDescription()}
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          <Slider
            value={[humorLevel]}
            onValueChange={(value) => onHumorChange(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
          
          {/* Labels under slider */}
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <span>Wholesome</span>
            <span>Balanced</span>
            <span>Chaotic</span>
          </div>
        </div>

        {/* Thermometer visual */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-8 h-32 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={cn(
                'absolute bottom-0 left-0 right-0 rounded-full',
                humorLevel < 33 && 'bg-green-400',
                humorLevel >= 33 && humorLevel < 66 && 'bg-secondary',
                humorLevel >= 66 && 'bg-gradient-to-t from-accent to-orange-500'
              )}
              animate={{ height: `${humorLevel}%` }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Next Button */}
      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-full font-bold text-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground glow-primary hover:opacity-90 transition-all duration-300"
      >
        Continue
      </motion.button>
    </motion.div>
  );
}
