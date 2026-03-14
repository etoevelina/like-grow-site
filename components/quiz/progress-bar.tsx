'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">XP Progress</span>
        <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="relative h-4 bg-muted rounded-full overflow-hidden border border-border">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        {progress > 0 && (
          <motion.div
            className="absolute inset-y-0 right-0 flex items-center pr-1"
            style={{ left: `calc(${Math.min(progress, 95)}% - 12px)` }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Sparkles className="w-3 h-3 text-secondary" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
