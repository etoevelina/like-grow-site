'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Region {
  id: string;
  name: string;
  emoji: string;
  countries: string[];
  color: string;
  position: { x: number; y: number };
}

const REGIONS: Region[] = [
  { id: 'europe', name: 'Europe', emoji: '🇪🇺', countries: ['France', 'Italy', 'Spain', 'Greece'], color: 'from-blue-500 to-indigo-500', position: { x: 48, y: 28 } },
  { id: 'asia', name: 'Asia', emoji: '🌏', countries: ['Japan', 'Thailand', 'Bali', 'Vietnam'], color: 'from-rose-500 to-pink-500', position: { x: 72, y: 38 } },
  { id: 'namerica', name: 'North America', emoji: '🗽', countries: ['New York', 'LA', 'Miami', 'Hawaii'], color: 'from-amber-500 to-orange-500', position: { x: 22, y: 32 } },
  { id: 'samerica', name: 'South America', emoji: '🌴', countries: ['Brazil', 'Peru', 'Argentina', 'Colombia'], color: 'from-green-500 to-emerald-500', position: { x: 28, y: 62 } },
  { id: 'africa', name: 'Africa', emoji: '🦁', countries: ['Morocco', 'Egypt', 'Safari', 'Cape Town'], color: 'from-yellow-500 to-amber-500', position: { x: 50, y: 55 } },
  { id: 'oceania', name: 'Oceania', emoji: '🦘', countries: ['Australia', 'New Zealand', 'Fiji', 'Tahiti'], color: 'from-cyan-500 to-teal-500', position: { x: 82, y: 68 } },
  { id: 'middle_east', name: 'Middle East', emoji: '🕌', countries: ['Dubai', 'Jordan', 'Turkey', 'Israel'], color: 'from-purple-500 to-violet-500', position: { x: 58, y: 42 } },
];

interface WorldMapProps {
  onComplete: (selectedRegions: string[]) => void;
}

export function WorldMap({ onComplete }: WorldMapProps) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const toggleRegion = (regionId: string) => {
    setSelectedRegions(prev => 
      prev.includes(regionId) 
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const handleContinue = () => {
    onComplete(selectedRegions);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto px-4"
    >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
        >
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">Dream Destinations</span>
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Where do you dream of going?
        </h2>
        <p className="text-muted-foreground">
          Tap the regions you want to explore
        </p>
      </div>

      {/* Interactive Map */}
      <div className="relative aspect-[16/10] bg-card rounded-3xl border border-border overflow-hidden mb-6">
        {/* World map background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 60" className="w-full h-full">
            <path
              d="M15,20 Q25,15 35,20 L40,25 Q45,30 40,35 L30,40 Q20,45 15,35 Z"
              fill="currentColor"
              className="text-muted-foreground"
            />
            <path
              d="M45,22 Q55,18 65,25 L70,35 Q68,45 60,48 L50,50 Q42,45 45,35 Z"
              fill="currentColor"
              className="text-muted-foreground"
            />
            <path
              d="M60,25 Q75,20 85,30 L88,45 Q85,55 75,55 L65,50 Q58,42 60,32 Z"
              fill="currentColor"
              className="text-muted-foreground"
            />
            <path
              d="M25,45 Q32,42 35,50 L30,58 Q22,60 20,52 Z"
              fill="currentColor"
              className="text-muted-foreground"
            />
            <path
              d="M75,55 Q82,52 88,58 L85,65 Q78,68 75,62 Z"
              fill="currentColor"
              className="text-muted-foreground"
            />
          </svg>
        </div>

        {/* Region pins */}
        {REGIONS.map((region) => {
          const isSelected = selectedRegions.includes(region.id);
          const isHovered = hoveredRegion === region.id;

          return (
            <motion.button
              key={region.id}
              onClick={() => toggleRegion(region.id)}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${region.position.x}%`, top: `${region.position.y}%` }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center text-xl
                  transition-all duration-300 cursor-pointer
                  ${isSelected 
                    ? `bg-gradient-to-br ${region.color} shadow-lg` 
                    : 'bg-card border-2 border-border hover:border-primary/50'
                  }
                `}
                animate={{
                  scale: isSelected ? 1.1 : 1,
                  boxShadow: isSelected ? '0 0 20px rgba(255,255,255,0.3)' : '0 0 0px rgba(0,0,0,0)',
                }}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-accent-foreground" />
                  </motion.div>
                )}
                <span>{region.emoji}</span>
              </motion.div>

              {/* Tooltip */}
              <AnimatePresence>
                {(isHovered || isSelected) && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                  >
                    <div className="px-3 py-1.5 rounded-lg bg-popover border border-border shadow-lg">
                      <p className="text-xs font-medium text-foreground">{region.name}</p>
                      <p className="text-xs text-muted-foreground">{region.countries.slice(0, 2).join(', ')}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}

        {/* Decorative grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '10% 10%'
          }} />
        </div>
      </div>

      {/* Selected count */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          {selectedRegions.length === 0 
            ? 'Select at least one region'
            : `${selectedRegions.length} region${selectedRegions.length > 1 ? 's' : ''} selected`
          }
        </p>
      </div>

      {/* Continue button */}
      <Button
        onClick={handleContinue}
        disabled={selectedRegions.length === 0}
        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg disabled:opacity-50"
      >
        Continue
      </Button>
    </motion.div>
  );
}
