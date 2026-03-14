'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Star, Sparkles } from 'lucide-react';
import { Avatar, AvatarProfile } from '@/lib/avatar-api';
import { Button } from '@/components/ui/button';

interface AvatarWindowProps {
  avatar: Avatar;
  profile: AvatarProfile;
  onContinue: () => void;
}

// Magic particles that appear when shutters open
function MagicParticles() {
  return (
    <>
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: `hsl(${40 + Math.random() * 30}, 90%, ${60 + Math.random() * 20}%)`,
            boxShadow: `0 0 6px hsl(${40 + Math.random() * 30}, 90%, 70%)`,
            left: '50%',
            top: '50%',
          }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}

// Light rays emanating from opened window
function LightRays() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 origin-center"
          style={{
            width: '2px',
            height: '150px',
            background: 'linear-gradient(to top, oklch(0.9 0.15 85 / 0.8), transparent)',
            transform: `rotate(${i * 30}deg)`,
            marginLeft: '-1px',
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.5, delay: 0.2 + i * 0.05 }}
        />
      ))}
    </motion.div>
  );
}

export function AvatarWindow({ avatar, profile, onContinue }: AvatarWindowProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shuttersOpen, setShuttersOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Pre-load video
  useEffect(() => {
    if (avatar.current_video_url && videoRef.current) {
      videoRef.current.load();
    }
  }, [avatar.current_video_url]);

  const handleOpenShutters = () => {
    setShuttersOpen(true);
    // Show stats after animation
    setTimeout(() => setShowStats(true), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background relative overflow-hidden">
      {/* Background glow - intensifies when shutters open */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: shuttersOpen 
            ? 'radial-gradient(circle at 50% 40%, oklch(0.5 0.15 85 / 0.3) 0%, transparent 60%)'
            : 'radial-gradient(circle at 50% 40%, oklch(0.3 0.1 260 / 0.2) 0%, transparent 60%)',
        }}
        transition={{ duration: 1 }}
      />

      {/* Magic effects on open */}
      <AnimatePresence>
        {shuttersOpen && (
          <>
            <MagicParticles />
            <LightRays />
          </>
        )}
      </AnimatePresence>

      {/* Header - only visible after shutters open */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 relative z-10"
          >
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Meet Your Avatar
            </h1>
            <p className="text-muted-foreground text-sm">
              {profile.personality_type}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Window with Shutters */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[280px]"
      >
        {/* Window frame */}
        <div 
          className="relative rounded-3xl p-3"
          style={{
            background: 'linear-gradient(145deg, oklch(0.22 0.015 260), oklch(0.14 0.008 260))',
            boxShadow: shuttersOpen 
              ? '0 0 60px oklch(0.7 0.15 85 / 0.4), 0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 oklch(0.3 0.01 260)',
          }}
        >
          {/* Inner window container */}
          <div 
            className="relative rounded-2xl overflow-hidden aspect-square"
            style={{
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
            }}
          >
            {/* Video/Image - crops horizontal to square center */}
            <div className="absolute inset-0 flex items-center justify-center bg-card overflow-hidden">
              {avatar.current_video_url ? (
                <video
                  ref={videoRef}
                  src={avatar.current_video_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedData={() => setVideoLoaded(true)}
                  className="min-w-full min-h-full object-cover"
                  style={{
                    // This ensures horizontal video is cropped to center square
                    width: 'auto',
                    height: '100%',
                  }}
                />
              ) : avatar.current_image_url ? (
                <img
                  src={avatar.current_image_url}
                  alt="Your Avatar"
                  className="min-w-full min-h-full object-cover"
                  onLoad={() => setVideoLoaded(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-primary/50" />
                </div>
              )}
            </div>

            {/* Left Shutter */}
            <motion.div
              className="absolute top-0 left-0 h-full w-1/2 origin-left"
              style={{
                background: 'linear-gradient(90deg, oklch(0.18 0.01 260) 0%, oklch(0.14 0.008 260) 100%)',
                boxShadow: 'inset -2px 0 10px rgba(0,0,0,0.3), 2px 0 10px rgba(0,0,0,0.2)',
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: shuttersOpen ? -110 : 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Shutter slats */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-full border-b border-border/30"
                  style={{ height: '12.5%', background: `linear-gradient(180deg, oklch(0.2 0.01 260) 0%, oklch(0.15 0.008 260) 100%)` }}
                />
              ))}
              {/* Handle */}
              <div 
                className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full"
                style={{ background: 'oklch(0.35 0.02 260)' }}
              />
            </motion.div>

            {/* Right Shutter */}
            <motion.div
              className="absolute top-0 right-0 h-full w-1/2 origin-right"
              style={{
                background: 'linear-gradient(270deg, oklch(0.18 0.01 260) 0%, oklch(0.14 0.008 260) 100%)',
                boxShadow: 'inset 2px 0 10px rgba(0,0,0,0.3), -2px 0 10px rgba(0,0,0,0.2)',
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: shuttersOpen ? 110 : 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Shutter slats */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-full border-b border-border/30"
                  style={{ height: '12.5%', background: `linear-gradient(180deg, oklch(0.2 0.01 260) 0%, oklch(0.15 0.008 260) 100%)` }}
                />
              ))}
              {/* Handle */}
              <div 
                className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full"
                style={{ background: 'oklch(0.35 0.02 260)' }}
              />
            </motion.div>

            {/* Click prompt when shutters closed */}
            {!shuttersOpen && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10"
                onClick={handleOpenShutters}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center"
                >
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Tap to reveal</p>
                  <p className="text-xs text-muted-foreground mt-1">Your avatar awaits</p>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Corner decorations */}
          <div className="absolute top-1 left-1 w-5 h-5 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl" />
          <div className="absolute top-1 right-1 w-5 h-5 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl" />
          <div className="absolute bottom-1 left-1 w-5 h-5 border-b-2 border-l-2 border-primary/40 rounded-bl-2xl" />
          <div className="absolute bottom-1 right-1 w-5 h-5 border-b-2 border-r-2 border-primary/40 rounded-br-2xl" />
        </div>

        {/* Windowsill */}
        <div 
          className="mx-auto w-[90%] h-3 rounded-b-lg -mt-1"
          style={{
            background: 'linear-gradient(180deg, oklch(0.2 0.01 260) 0%, oklch(0.16 0.008 260) 100%)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}
        />
      </motion.div>

      {/* Stats and info - only after shutters open */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm mt-6 relative z-10"
          >
            {/* Stats bar */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {avatar.level_name}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-foreground">
                  {avatar.coins}
                </span>
              </div>
            </div>

            {/* XP bar */}
            <div className="mt-4 px-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Level {avatar.level}</span>
                <span>{avatar.experience}/{avatar.exp_to_next_level} XP</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${avatar.exp_progress_percent}%` }}
                  transition={{ delay: 0.3, duration: 1 }}
                />
              </div>
            </div>

            {/* Personality */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 p-4 rounded-2xl bg-card border border-border"
            >
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                {profile.personality_description}
              </p>
            </motion.div>

            {/* Interests */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex flex-wrap justify-center gap-2"
            >
              {profile.interests.slice(0, 5).map((interest, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {interest}
                </span>
              ))}
            </motion.div>

            {/* Continue button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <Button
                onClick={onContinue}
                className="w-full py-6 rounded-xl bg-primary text-primary-foreground font-semibold text-lg"
              >
                Start Growing
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt to tap - subtle reminder */}
      {!shuttersOpen && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-sm text-muted-foreground text-center relative z-10"
        >
          Tap the window to meet your avatar
        </motion.p>
      )}
    </div>
  );
}
