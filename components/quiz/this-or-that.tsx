"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ThisOrThatQuestion {
  id: string;
  optionA: { label: string; emoji: string; value: string };
  optionB: { label: string; emoji: string; value: string };
}

interface ThisOrThatProps {
  title: string;
  subtitle: string;
  questions: ThisOrThatQuestion[];
  onComplete: (answers: Record<string, string>) => void;
}

export function ThisOrThat({
  title,
  subtitle,
  questions,
  onComplete,
}: ThisOrThatProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedSide, setSelectedSide] = useState<"A" | "B" | null>(null);

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = (side: "A" | "B") => {
    setSelectedSide(side);
    const value = side === "A" ? current.optionA.value : current.optionB.value;
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedSide(null);
      } else {
        onComplete(newAnswers);
      }
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center w-full max-w-lg mx-auto px-4"
    >
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
        {title}
      </h2>
      <p className="text-muted-foreground text-center mb-4">{subtitle}</p>

      <div className="w-full h-1 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        {currentIndex + 1} of {questions.length}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="w-full flex gap-4"
        >
          <motion.button
            onClick={() => handleSelect("A")}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 aspect-square rounded-3xl glass-card flex flex-col items-center justify-center gap-4 p-6 transition-all duration-300 ${
              selectedSide === "A"
                ? "ring-2 ring-primary bg-primary/20"
                : selectedSide === "B"
                  ? "opacity-40"
                  : "hover:bg-muted/50"
            }`}
          >
            <span className="text-5xl">{current.optionA.emoji}</span>
            <span className="text-foreground font-semibold text-center">
              {current.optionA.label}
            </span>
          </motion.button>

          <div className="flex items-center">
            <span className="text-muted-foreground font-bold text-sm">OR</span>
          </div>

          <motion.button
            onClick={() => handleSelect("B")}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 aspect-square rounded-3xl glass-card flex flex-col items-center justify-center gap-4 p-6 transition-all duration-300 ${
              selectedSide === "B"
                ? "ring-2 ring-primary bg-primary/20"
                : selectedSide === "A"
                  ? "opacity-40"
                  : "hover:bg-muted/50"
            }`}
          >
            <span className="text-5xl">{current.optionB.emoji}</span>
            <span className="text-foreground font-semibold text-center">
              {current.optionB.label}
            </span>
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
