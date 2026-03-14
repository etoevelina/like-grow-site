'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, Star, Sparkles } from 'lucide-react';
import { Avatar, AvatarProfile } from '@/lib/avatar-api';
import { Button } from '@/components/ui/button';

interface AvatarWindowProps {
  avatar: Avatar;
  profile: AvatarProfile;
  onContinue: () => void;
}

export function AvatarWindow({ avatar, profile, onContinue }: AvatarWindowProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Animate content appearance
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, oklch(0.6 0.2 320 / 0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -20 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Meet Your Avatar
          </h1>
          <p className="text-muted-foreground text-sm">
            {profile.personality_type}
          </p>
        </motion.div>

        {/* Avatar Window - The "peephole" into avatar's life */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative mx-auto"
        >
          {/* Window frame - dark outer border */}
          <div 
            className="relative rounded-3xl p-2"
            style={{
              background: 'linear-gradient(145deg, oklch(0.2 0.01 260), oklch(0.12 0.005 260))',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 oklch(0.3 0.01 260)',
            }}
          >
            {/* Inner window with glow */}
            <div 
              className="relative rounded-2xl overflow-hidden aspect-square"
              style={{
                boxShadow: 'inset 0 0 30px oklch(0.5 0.2 320 / 0.3), 0 0 20px oklch(0.5 0.2 320 / 0.2)',
              }}
            >
              {/* Video or Image */}
              {avatar.current_video_url ? (
                <>
                  <video
                    ref={videoRef}
                    src={avatar.current_video_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={() => setVideoLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      videoLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  {/* Loading placeholder */}
                  {!videoLoaded && (
                    <div className="absolute inset-0 bg-card flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                  )}
                </>
              ) : avatar.current_image_url ? (
                <img
                  src={avatar.current_image_url}
                  alt="Your Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Placeholder if no media yet */
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-primary/50" />
                </div>
              )}

              {/* Subtle vignette overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, transparent 50%, oklch(0.1 0.01 260 / 0.4) 100%)',
                }}
              />
            </div>

            {/* Corner decorations - like window brackets */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/50 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/50 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/50 rounded-br-xl" />
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center justify-center gap-4"
        >
          {/* Level */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {avatar.level_name}
            </span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-foreground">
              {avatar.coins}
            </span>
          </div>
        </motion.div>

        {/* Experience bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 px-4"
        >
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Level {avatar.level}</span>
            <span>{avatar.experience}/{avatar.exp_to_next_level} XP</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${avatar.exp_progress_percent}%` }}
              transition={{ delay: 0.8, duration: 1 }}
            />
          </div>
        </motion.div>

        {/* Personality description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-4 rounded-2xl bg-card border border-border"
        >
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            {profile.personality_description}
          </p>
        </motion.div>

        {/* Interests tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ delay: 0.8 }}
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
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ delay: 1 }}
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
    </div>
  );
}
