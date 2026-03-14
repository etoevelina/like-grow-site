'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Sparkles, Trophy, Coins, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      window.location.href = '/';
    }
  }, [mounted, loading, user]);

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
              <span className="text-xl">🌟</span>
            </div>
            <div>
              <h1 className="font-semibold text-foreground text-sm">LikeGrow</h1>
              <p className="text-xs text-muted-foreground">Level 1</p>
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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150" />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-24 h-24 rounded-full glass-card flex items-center justify-center mx-auto"
            >
              <span className="text-5xl">😎</span>
            </motion.div>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            Welcome, {user.first_name || 'Explorer'}!
          </h2>
          <p className="text-muted-foreground text-sm">
            Your digital avatar is ready to grow
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">100</span>
            <p className="text-xs text-muted-foreground">XP</p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-2">
              <Coins className="w-5 h-5 text-accent" />
            </div>
            <span className="text-lg font-bold text-foreground">50</span>
            <p className="text-xs text-muted-foreground">Coins</p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
            <span className="text-lg font-bold text-foreground">1</span>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 text-center"
        >
          <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Coming Soon</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Save content, feed your avatar, and watch it evolve with your personality!
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Content Feed', 'Avatar Evolution', 'Achievements', 'Social Features'].map((feature) => (
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
          transition={{ delay: 0.3 }}
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
