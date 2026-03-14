'use client';

import { useState } from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { GripVertical, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface RankingItem {
  id: string;
  label: string;
  emoji?: string;
}

interface PriorityRankingProps {
  title: string;
  subtitle?: string;
  items: RankingItem[];
  onComplete: (order: string[]) => void;
}

function DraggableItem({ item, index }: { item: RankingItem; index: number }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      dragListener={false}
      dragControls={controls}
      className="touch-none"
    >
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card rounded-2xl p-4 flex items-center gap-4 cursor-grab active:cursor-grabbing"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Rank number */}
        <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
          {index + 1}
        </div>
        
        {/* Content */}
        <div className="flex-1 flex items-center gap-3">
          {item.emoji && (
            <span className="text-2xl">{item.emoji}</span>
          )}
          <span className="text-foreground font-medium">{item.label}</span>
        </div>
        
        {/* Drag handle */}
        <div
          onPointerDown={(e) => controls.start(e)}
          className="p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
      </motion.div>
    </Reorder.Item>
  );
}

export function PriorityRanking({ title, subtitle, items: initialItems, onComplete }: PriorityRankingProps) {
  const [items, setItems] = useState(initialItems);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      onComplete(items.map(item => item.id));
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto px-4"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
        >
          <GripVertical className="w-8 h-8 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2 text-balance">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        )}
      </div>

      {/* Instruction */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl px-4 py-3 mb-6 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Drag to reorder from most to least important
        </p>
      </motion.div>

      {/* Reorderable list */}
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-3"
      >
        {items.map((item, index) => (
          <DraggableItem key={item.id} item={item} index={index} />
        ))}
      </Reorder.Group>

      {/* Submit button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Button
          onClick={handleSubmit}
          disabled={isSubmitted}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg"
        >
          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Saved</span>
            </motion.div>
          ) : (
            'Confirm Order'
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
