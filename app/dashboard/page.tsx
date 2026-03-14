'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Sparkles, Trophy, Coins, TrendingUp, Star } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getAvatar, Avatar, AvatarProfile } from '@/lib/avatar-api';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [profile, setProfile] = useState<AvatarProfile | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      window.location.href = '/';
    }
  }, [mounted, loading, user]);

  // Fetch avatar data
  useEffect(() => {
    if (mounted && user) {
      const fetchAvatar = async () => {
        const result = await getAvatar();
        if (result.success && result.data) {
          setAvatar(result.data.avatar);
          setProfile(result.data.profile);
        }
        setAvatarLoading(false);
      };
      fetchAvatar();
    }
  }, [mounted, user]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground text-sm">LikeGrow</h1>
              <p className="text-xs text-muted-foreground">
                {avatar?.level_name || 'Level 1'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Avatar Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {/* Avatar display - the "window" */}
          <div 
            className="relative rounded-3xl p-2 mx-auto max-w-[280px]"
            style={{
              background: 'linear-gradient(145deg, oklch(0.2 0.01 260), oklch(0.12 0.005 260))',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 oklch(0.3 0.01 260)',
            }}
          >
            <div 
              className="relative rounded-2xl overflow-hidden aspect-square"
              style={{
                boxShadow: 'inset 0 0 30px oklch(0.5 0.2 320 / 0.3), 0 0 20px oklch(0.5 0.2 320 / 0.2)',
              }}
            >
              {avatarLoading ? (
                <div className="w-full h-full bg-card flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              ) : avatar?.current_video_url ? (
                <video
                  ref={videoRef}
                  src={avatar.current_video_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : avatar?.current_image_url ? (
                <img
                  src={avatar.current_image_url}
                  alt="Your Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <motion.span 
                    className="text-6xl"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🌟
                  </motion.span>
                </div>
              )}

              {/* Vignette */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, transparent 50%, oklch(0.1 0.01 260 / 0.4) 100%)',
                }}
              />
            </div>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/50 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/50 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/50 rounded-br-xl" />
          </div>

          {/* Personality type */}
          {profile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-4"
            >
              <h2 className="text-lg font-bold text-foreground">
                {profile.personality_type}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user.first_name ? `${user.first_name}'s Avatar` : 'Your Avatar'}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">
              {avatar?.level || 1}
            </span>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-5 h-5 text-accent" />
            </div>
            <span className="text-lg font-bold text-foreground">
              {avatar?.experience || 0}
            </span>
            <p className="text-xs text-muted-foreground">XP</p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-2">
              <Coins className="w-5 h-5 text-yellow-500" />
            </div>
            <span className="text-lg font-bold text-foreground">
              {avatar?.coins || 0}
            </span>
            <p className="text-xs text-muted-foreground">Coins</p>
          </div>
        </motion.div>

        {/* Experience bar */}
        {avatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 px-2"
          >
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{avatar.level_name}</span>
              <span>{avatar.experience}/{avatar.exp_to_next_level} XP</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${avatar.exp_progress_percent}%` }}
                transition={{ delay: 0.4, duration: 1 }}
              />
            </div>
          </motion.div>
        )}

        {/* Interests */}
        {profile && profile.interests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h3 className="text-sm font-medium text-foreground mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {interest}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 text-center"
        >
          <TrendingUp className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Feed Your Avatar</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Save content from social media to help your avatar grow and evolve!
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Content Feed', 'Evolution', 'Achievements'].map((feature) => (
              <span
                key={feature}
                className="px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground"
              >
                {feature}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 glass-card rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm truncate">
                {user.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.is_verified ? 'Verified Account' : 'Pending Verification'}
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
