'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, LogOut, Sparkles, Trophy, Coins, Star, 
  Plus, X, Link2, Send, Loader2, CheckCircle2,
  Heart, Frown, AlertTriangle, Wifi, WifiOff
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useSocket, ContentSubmitResult } from '@/hooks/use-socket';
import { getAvatar, Avatar, AvatarProfile, AvatarState } from '@/lib/avatar-api';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [profile, setProfile] = useState<AvatarProfile | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Post submission modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [postUrl, setPostUrl] = useState('');
  const [submitResult, setSubmitResult] = useState<ContentSubmitResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Socket connection
  const handleAvatarUpdate = useCallback((updatedAvatar: Avatar) => {
    setAvatar(updatedAvatar);
  }, []);

  const { isConnected, isSubmitting, lastError, submitPost } = useSocket(handleAvatarUpdate);

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

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleSubmitPost = async () => {
    if (!postUrl.trim()) return;

    try {
      const result = await submitPost(postUrl);
      setSubmitResult(result);
      setShowResult(true);
      setPostUrl('');
      
      // Hide result after 4 seconds
      setTimeout(() => {
        setShowResult(false);
        setShowPostModal(false);
        setSubmitResult(null);
      }, 4000);
    } catch (err) {
      setSubmitResult({
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to submit post',
      });
      setShowResult(true);
    }
  };

  const getStateInfo = (state: AvatarState) => {
    switch (state) {
      case 'healthy':
        return { icon: Heart, color: 'text-green-500', bg: 'bg-green-500/20', label: 'Healthy' };
      case 'tired':
        return { icon: Frown, color: 'text-yellow-500', bg: 'bg-yellow-500/20', label: 'Tired' };
      case 'degraded':
        return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/20', label: 'Degrading' };
      default:
        return { icon: Sparkles, color: 'text-primary', bg: 'bg-primary/20', label: 'Idle' };
    }
  };

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

  const stateInfo = avatar ? getStateInfo(avatar.state) : null;
  const StateIcon = stateInfo?.icon || Sparkles;

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
          <div className="flex items-center gap-2">
            {/* Connection status */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isConnected ? 'bg-green-500/20' : 'bg-muted'}`}>
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
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
          <div 
            className="relative rounded-3xl p-2 mx-auto max-w-[280px]"
            style={{
              background: 'linear-gradient(145deg, oklch(0.2 0.01 260), oklch(0.12 0.005 260))',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 oklch(0.3 0.01 260)',
            }}
          >
            {/* State indicator */}
            {stateInfo && (
              <div className={`absolute -top-2 -right-2 z-10 px-2 py-1 rounded-full ${stateInfo.bg} flex items-center gap-1`}>
                <StateIcon className={`w-3 h-3 ${stateInfo.color}`} />
                <span className={`text-xs font-medium ${stateInfo.color}`}>{stateInfo.label}</span>
              </div>
            )}

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
                  className="w-full h-full object-cover object-center"
                  style={{ objectPosition: 'center center' }}
                />
              ) : avatar?.current_image_url ? (
                <img
                  src={avatar.current_image_url}
                  alt="Your Avatar"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <motion.div 
                    className="text-6xl"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="w-16 h-16 text-primary/50" />
                  </motion.div>
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

        {/* Warning for tired/degraded state */}
        {avatar && (avatar.state === 'tired' || avatar.state === 'degraded') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-6 p-4 rounded-2xl border ${
              avatar.state === 'degraded' 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}
          >
            <p className={`text-sm font-medium ${
              avatar.state === 'degraded' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {avatar.state === 'degraded' 
                ? 'Your avatar is degrading! Feed them content soon!' 
                : 'Your avatar is getting tired. Share some content!'}
            </p>
          </motion.div>
        )}

        {/* Add Post Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Button
            onClick={() => setShowPostModal(true)}
            className="w-full py-6 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg gap-2"
          >
            <Plus className="w-5 h-5" />
            Feed Your Avatar
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Share TikTok or Instagram links to grow your avatar
          </p>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-4"
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
                {avatar?.saved_posts_count || 0} posts saved
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Post Submission Modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end justify-center"
            onClick={() => !isSubmitting && setShowPostModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card border-t border-border rounded-t-3xl p-6"
            >
              {/* Close button */}
              <button
                onClick={() => !isSubmitting && setShowPostModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Success/Error Result */}
              <AnimatePresence>
                {showResult && submitResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 bg-card rounded-t-3xl flex items-center justify-center p-6"
                  >
                    {submitResult.ok ? (
                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 10 }}
                          className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                        >
                          <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Content Added!</h3>
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Trophy className="w-5 h-5 text-accent" />
                            <span className="font-bold text-accent">+{submitResult.xp || 0} XP</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Coins className="w-5 h-5 text-yellow-500" />
                            <span className="font-bold text-yellow-500">+{submitResult.coins || 0}</span>
                          </div>
                        </div>
                        {submitResult.leveled_up && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-4 py-2 bg-primary/20 rounded-full inline-flex items-center gap-2"
                          >
                            <Star className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                              Level Up! Now Level {submitResult.new_level}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                          <X className="w-10 h-10 text-destructive" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Oops!</h3>
                        <p className="text-muted-foreground">{submitResult.error}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              {!showResult && (
                <>
                  <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">Add Content</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Paste a TikTok or Instagram link to feed your avatar
                  </p>

                  {/* URL Input */}
                  <div className="relative mb-4">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="url"
                      value={postUrl}
                      onChange={(e) => setPostUrl(e.target.value)}
                      placeholder="https://www.tiktok.com/..."
                      className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Error message */}
                  {lastError && (
                    <p className="text-sm text-destructive mb-4">{lastError}</p>
                  )}

                  {/* Submit button */}
                  <Button
                    onClick={handleSubmitPost}
                    disabled={!postUrl.trim() || isSubmitting || !isConnected}
                    className="w-full py-6 rounded-2xl bg-primary text-primary-foreground font-semibold gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit
                      </>
                    )}
                  </Button>

                  {!isConnected && (
                    <p className="text-xs text-yellow-500 text-center mt-3">
                      Connecting to server...
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Processing may take 1-2 minutes
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
