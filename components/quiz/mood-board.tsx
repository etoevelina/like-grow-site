"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MoodOption {
  id: string;
  label: string;
  image: string;
  vibe: string;
}

// Re-export for compatibility
export type { MoodOption as MoodBoardOption };

interface MoodBoardProps {
  title: string;
  subtitle: string;
  options: MoodOption[];
  minSelect?: number;
  maxSelect?: number;
  onComplete: (selected: string[]) => void;
}

export function MoodBoard({
  title,
  subtitle,
  options,
  minSelect = 1,
  maxSelect = 3,
  onComplete,
}: MoodBoardProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((s) => s !== id);
      }
      if (prev.length >= maxSelect) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center w-full max-w-lg mx-auto px-4"
    >
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
        {title}
      </h2>
      <p className="text-muted-foreground text-center mb-6">{subtitle}</p>
      <p className="text-sm text-muted-foreground mb-4">
        Select {minSelect}-{maxSelect} vibes
      </p>

      <div className="grid grid-cols-2 gap-3 w-full mb-8">
        <AnimatePresence>
          {options.map((option, index) => {
            const isSelected = selected.includes(option.id);
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => toggleOption(option.id)}
                className={`relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[0.98]"
                    : "hover:scale-[0.98]"
                }`}
              >
                <img
                  src={option.image}
                  alt={option.label}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 transition-all duration-300 ${
                    isSelected
                      ? "bg-primary/30"
                      : "bg-gradient-to-t from-black/70 via-transparent to-transparent"
                  }`}
                />

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm">
                    {option.label}
                  </p>
                  <p className="text-white/70 text-xs">{option.vibe}</p>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <Button
        onClick={() => onComplete(selected)}
        disabled={selected.length < minSelect}
        className="w-full py-6 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg"
      >
        Continue
      </Button>
    </motion.div>
  );
}
