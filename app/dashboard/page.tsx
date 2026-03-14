'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Sparkles, Trophy, Coins, Star, 
  Link2, Send, Loader2, CheckCircle2,
  Heart, Frown, AlertTriangle, 
  Home, ListPlus, ShoppingBag, Clock, X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useSocket, ContentSubmitResult } from '@/hooks/use-socket';
import { getAvatar, Avatar, AvatarProfile, AvatarState, saveAvatarData } from '@/lib/avatar-api';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

type TabType = 'home' | 'feed';

interface HistoryItem {
  id: string;
  url: string;
  xp: number;
  coins: number;
  timestamp: Date;
  status: 'success' | 'processing' | 'error';
  error?: string;
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [profile, setProfile] = useState<AvatarProfile | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');
  
  // Shop sheet
  const [showShop, setShowShop] = useState(false);

  // Feed tab state
  const [postUrl, setPostUrl] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // New user flow - shutter state
  const [isNewUser, setIsNewUser] = useState(false);
  const [shutterOpen, setShutterOpen] = useState(false);
  const [showShopPrompt, setShowShopPrompt] = useState(false);

  // Daily post limit
  const MAX_DAILY_POSTS = 5;
  const [todayPostCount, setTodayPostCount] = useState(0);

  // Check if avatar is ready (has actual content)
  const avatarReady = !!(avatar?.current_video_url || avatar?.current_image_url);

  // Socket connection
const handleAvatarUpdate = useCallback((updatedAvatar: Avatar) => {
    setAvatar(updatedAvatar);
    // Save to localStorage for persistence
    if (profile) {
      saveAvatarData(updatedAvatar, profile);
    }
  }, [profile]);

  const handleContentResult = useCallback((result: ContentSubmitResult & { url?: string }) => {
    // Update history item
    setHistory(prev => prev.map(item => {
      if (item.status === 'processing') {
        return {
          ...item,
          status: result.ok ? 'success' : 'error',
          xp: result.xp || 0,
          coins: result.coins || 0,
          error: result.error,
        };
      }
      return item;
    }));
  }, []);

  const { isConnected, isSubmitting, submitPost } = useSocket(handleAvatarUpdate, handleContentResult);

  useEffect(() => {
    setMounted(true);
    // Check if new user from URL param
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('new') === 'true') {
        setIsNewUser(true);
        setShowShopPrompt(true);
        // Clean URL
        window.history.replaceState({}, '', '/dashboard');
      }
      
      // Load today's post count from localStorage
      const today = new Date().toDateString();
      const savedData = localStorage.getItem('daily_posts');
      if (savedData) {
        const { date, count } = JSON.parse(savedData);
        if (date === today) {
          setTodayPostCount(count);
        }
      }
    }
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
          
          // For existing users with ready avatar, open shutter immediately
          const hasContent = !!(result.data.avatar.current_video_url || result.data.avatar.current_image_url);
          if (!isNewUser && hasContent) {
            setShutterOpen(true);
          }
        }
        setAvatarLoading(false);
      };
      fetchAvatar();
    }
  }, [mounted, user, isNewUser]);

  // Handle shutter reveal - only allow if avatar has content
  const handleRevealAvatar = () => {
    if (!avatarReady) return; // Can't reveal until avatar has image/video
    setShutterOpen(true);
    setShowShopPrompt(false);
    localStorage.removeItem('avatar_creating');
  };

  // Poll for avatar readiness for new users
  useEffect(() => {
    if (!isNewUser || avatarReady || avatarLoading) return;
    
    const pollInterval = setInterval(async () => {
      const result = await getAvatar();
      if (result.success && result.data) {
        const hasContent = !!(result.data.avatar.current_video_url || result.data.avatar.current_image_url);
        if (hasContent) {
          setAvatar(result.data.avatar);
          setProfile(result.data.profile);
          // Avatar is ready - user can now reveal
        }
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [isNewUser, avatarReady, avatarLoading]);

  const handleSubmitPost = async () => {
    if (!postUrl.trim()) return;
    if (todayPostCount >= MAX_DAILY_POSTS) return;

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      url: postUrl,
      xp: 0,
      coins: 0,
      timestamp: new Date(),
      status: 'processing',
    };

    setHistory(prev => [newItem, ...prev]);
    setPostUrl('');
    
    // Update daily count
    const newCount = todayPostCount + 1;
    setTodayPostCount(newCount);
    localStorage.setItem('daily_posts', JSON.stringify({
      date: new Date().toDateString(),
      count: newCount,
    }));

    try {
      await submitPost(postUrl);
    } catch (err) {
      setHistory(prev => prev.map(item => 
        item.id === newItem.id 
          ? { ...item, status: 'error', error: err instanceof Error ? err.message : 'Failed' }
          : item
      ));
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

  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      if (domain.includes('tiktok')) return 'TikTok';
      if (domain.includes('instagram')) return 'Instagram';
      return domain;
    } catch {
      return 'Link';
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto px-4 py-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-foreground">LikeGrow</h1>
                    <p className="text-xs text-muted-foreground">
                      {avatar?.level_name || 'Seedling'}
                    </p>
                  </div>
                </div>
                {/* Shop button */}
                <button
                  onClick={() => setShowShop(true)}
                  className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

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
                    className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer"
                    style={{
                      boxShadow: 'inset 0 0 30px oklch(0.5 0.2 320 / 0.3), 0 0 20px oklch(0.5 0.2 320 / 0.2)',
                    }}
                    onClick={isNewUser && !shutterOpen ? handleRevealAvatar : undefined}
                  >
                    {/* Avatar content */}
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
                      />
                    ) : avatar?.current_image_url ? (
                      <img
                        src={avatar.current_image_url}
                        alt="Your Avatar"
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-4">
                        <motion.div 
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Sparkles className="w-16 h-16 text-primary/50 mb-4" />
                        </motion.div>
                        <p className="text-xs text-muted-foreground text-center">
                          Feed content to see your avatar
                        </p>
                      </div>
                    )}

                    {/* Vignette */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle, transparent 50%, oklch(0.1 0.01 260 / 0.4) 100%)',
                      }}
                    />

                    {/* Shutter overlay for new users */}
                    {isNewUser && !shutterOpen && !avatarLoading && (
                      <>
                        {/* Left shutter */}
                        <motion.div
                          initial={{ x: 0 }}
                          animate={{ x: shutterOpen ? '-100%' : 0 }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-card to-card/95 z-20"
                          style={{
                            boxShadow: 'inset -10px 0 30px oklch(0 0 0 / 0.5)',
                          }}
                        >
                          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/20 to-transparent" />
                        </motion.div>
                        {/* Right shutter */}
                        <motion.div
                          initial={{ x: 0 }}
                          animate={{ x: shutterOpen ? '100%' : 0 }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-card to-card/95 z-20"
                          style={{
                            boxShadow: 'inset 10px 0 30px oklch(0 0 0 / 0.5)',
                          }}
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent" />
                        </motion.div>
                        {/* Tap prompt - changes based on avatar readiness */}
                        <motion.div 
                          className="absolute inset-0 z-30 flex flex-col items-center justify-center"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {avatarReady ? (
                            <>
                              <Sparkles className="w-10 h-10 text-primary mb-2" />
                              <span className="text-sm font-medium text-foreground">Tap to reveal</span>
                            </>
                          ) : (
                            <>
                              <Loader2 className="w-10 h-10 text-primary mb-2 animate-spin" />
                              <span className="text-sm font-medium text-foreground">Creating...</span>
                            </>
                          )}
                        </motion.div>
                      </>
                    )}

                    {/* Magic glow effect when opening */}
                    <AnimatePresence>
                      {isNewUser && shutterOpen && (
                        <motion.div
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0 }}
                          transition={{ duration: 1.5, delay: 0.3 }}
                          className="absolute inset-0 z-10 pointer-events-none"
                          style={{
                            background: 'radial-gradient(circle, oklch(0.8 0.2 60) 0%, transparent 70%)',
                          }}
                        />
                      )}
                    </AnimatePresence>
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

              {/* Shop Prompt for new users - show while avatar is being created */}
              {showShopPrompt && isNewUser && !avatarReady && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">While you wait...</p>
                      <p className="text-xs text-muted-foreground">Check out the shop for accessories!</p>
                    </div>
                    <Button
                      onClick={() => setShowShop(true)}
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                    >
                      Browse
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Feed Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`glass-card rounded-2xl p-4 mb-6 ${
                  (!avatarReady && isNewUser) || avatarLoading ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Feed your avatar</span>
                  </div>
                  <span className={`text-xs ${todayPostCount >= MAX_DAILY_POSTS ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {todayPostCount}/{MAX_DAILY_POSTS} today
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    placeholder={
                      todayPostCount >= MAX_DAILY_POSTS
                        ? "Daily limit reached..."
                        : (!avatarReady && isNewUser) 
                          ? "Wait for avatar to be ready..." 
                          : "Paste TikTok or Instagram link..."
                    }
                    disabled={(!avatarReady && isNewUser) || avatarLoading || todayPostCount >= MAX_DAILY_POSTS}
                    className="flex-1 px-3 py-2 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitPost()}
                  />
                  <Button
                    onClick={handleSubmitPost}
                    disabled={!postUrl.trim() || !isConnected || (!avatarReady && isNewUser) || avatarLoading || todayPostCount >= MAX_DAILY_POSTS}
                    size="sm"
                    className="rounded-xl bg-primary text-primary-foreground px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {!isConnected && avatarReady && (
                  <p className="text-xs text-destructive mt-2">Connecting...</p>
                )}
                {todayPostCount >= MAX_DAILY_POSTS && (
                  <p className="text-xs text-muted-foreground mt-2">Come back tomorrow for more!</p>
                )}
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
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = '/';
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-md mx-auto px-4 py-6"
            >
              {/* Feed Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-1">Activity History</h1>
                <p className="text-sm text-muted-foreground">
                  Your submitted posts and earned rewards
                </p>
              </div>

              {/* History */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium text-muted-foreground">Recent Activity</h2>
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ListPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No content yet</p>
                    <p className="text-xs mt-1">Paste a link above to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl border ${
                          item.status === 'processing'
                            ? 'bg-card border-border'
                            : item.status === 'success'
                            ? 'bg-green-500/5 border-green-500/20'
                            : 'bg-red-500/5 border-red-500/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            item.status === 'processing'
                              ? 'bg-primary/20'
                              : item.status === 'success'
                              ? 'bg-green-500/20'
                              : 'bg-red-500/20'
                          }`}>
                            {item.status === 'processing' ? (
                              <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            ) : item.status === 'success' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <X className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-muted-foreground">
                                {extractDomain(item.url)}
                              </span>
                              <ExternalLink className="w-3 h-3 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-2">
                              {item.url}
                            </p>
                            {item.status === 'success' && (
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-accent">
                                  +{item.xp} XP
                                </span>
                                <span className="text-sm font-medium text-yellow-500">
                                  +{item.coins} coins
                                </span>
                              </div>
                            )}
                            {item.status === 'processing' && (
                              <p className="text-xs text-muted-foreground">
                                Processing... this may take 1-2 minutes
                              </p>
                            )}
                            {item.status === 'error' && (
                              <p className="text-xs text-red-400">
                                {item.error || 'Failed to process'}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border z-50">
        <div className="max-w-md mx-auto px-6 py-3 flex items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-colors ${
              activeTab === 'home' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-colors ${
              activeTab === 'feed' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ListPlus className="w-6 h-6" />
            <span className="text-xs font-medium">Feed</span>
          </button>
        </div>
      </nav>

      {/* Shop Sheet */}
      <Sheet open={showShop} onOpenChange={setShowShop}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="text-xl">Shop</SheetTitle>
            <SheetDescription>
              Spend your coins on accessories and items for your avatar
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Coming soon!</p>
              <p className="text-xs text-muted-foreground mt-1">
                You have {avatar?.coins || 0} coins to spend
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
