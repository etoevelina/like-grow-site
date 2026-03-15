'use client';
// Dashboard v4

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useSocket } from '@/hooks/use-socket';
import { 
  User, Sparkles, Trophy, Coins, Star, 
  Link2, Send, Loader2, CheckCircle2,
  Heart, Frown, AlertTriangle, 
  Home, ListPlus, ShoppingBag, Clock, X,
  ExternalLink, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Avatar as AvatarType, 
  AvatarProfile, 
  getAvatar, 
  submitContent,
  getSavedPosts,
  SavedPost,
  ContentSubmitResponse,
} from '@/lib/avatar-api';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { io, Socket } from 'socket.io-client';

const API_BASE = 'https://goldfish-app-ohjd4.ondigitalocean.app';

// State icons
const StateIcon = ({ state }: { state: string }) => {
  switch (state) {
    case 'healthy':
      return <Heart className="w-4 h-4 text-green-500" />;
    case 'tired':
      return <Frown className="w-4 h-4 text-yellow-500" />;
    case 'degraded':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    default:
      return <Sparkles className="w-4 h-4 text-primary" />;
  }
};

// History item component
const HistoryItem = ({ 
  item 
}: { 
  item: { url: string; status: 'processing' | 'success' | 'error'; xp?: number; coins?: number; platform?: string } 
}) => (
  <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
    <div className="flex-1 min-w-0">
      <p className="text-sm truncate text-foreground">{item.url}</p>
      <div className="flex items-center gap-2 mt-1">
        {item.status === 'processing' && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" /> Processing...
          </span>
        )}
        {item.status === 'success' && (
          <span className="flex items-center gap-1 text-xs text-green-500">
            <CheckCircle2 className="w-3 h-3" /> +{item.xp || 0} XP, +{item.coins || 0} coins
          </span>
        )}
        {item.status === 'error' && (
          <span className="flex items-center gap-1 text-xs text-red-500">
            <X className="w-3 h-3" /> Failed
          </span>
        )}
      </div>
    </div>
  </div>
);

// Saved post component
const SavedPostItem = ({ post }: { post: SavedPost }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card rounded-xl p-3 mb-2"
  >
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        {post.platform === 'tiktok' ? (
          <span className="text-xs font-bold">TT</span>
        ) : (
          <span className="text-xs font-bold">IG</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{post.caption || post.post_url}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-green-500">+{post.xp} XP</span>
          <span className="text-xs text-yellow-500">+{post.coins} coins</span>
          <span className="text-xs text-muted-foreground">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      <a 
        href={post.post_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  
  // Avatar state
  const [avatar, setAvatar] = useState<AvatarType | null>(null);
  const [profile, setProfile] = useState<AvatarProfile | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  
  // Content submission
  const [postUrl, setPostUrl] = useState('');
  const [history, setHistory] = useState<{ url: string; status: 'processing' | 'success' | 'error'; xp?: number; coins?: number }[]>([]);
  
  // Saved posts
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [savedPostsTotal, setSavedPostsTotal] = useState(0);
  
  // Socket for real-time avatar updates
  const handleAvatarUpdate = useCallback((updatedAvatar: AvatarType) => {
    setAvatar(updatedAvatar);
  }, []);

  const { isConnected, socket } = useSocket(handleAvatarUpdate);
  
  // UI state
  const [activeTab, setActiveTab] = useState<'home' | 'feed'>('home');
  const [showShop, setShowShop] = useState(false);
  
  // New user flow
  const [isNewUser, setIsNewUser] = useState(false);
  const [shutterOpen, setShutterOpen] = useState(false);
  const [isAvatarCreating, setIsAvatarCreating] = useState(false);
  
  // Daily post limit
  const MAX_DAILY_POSTS = 50;
  const [todayPostCount, setTodayPostCount] = useState(0);
  
  // Check if avatar is ready
  const avatarReady = !!(avatar?.current_video_url || avatar?.current_image_url);

  // Check for new user on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const avatarCreatingFlag = localStorage.getItem('avatar_creating') === 'true';
      
      if (avatarCreatingFlag) {
        setIsAvatarCreating(true);
      }
      
      if (params.get('new') === 'true') {
        setIsNewUser(true);
        setIsAvatarCreating(true);
        window.history.replaceState({}, '', '/dashboard');
      }
      
      // Load today's post count
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

  // Load avatar data
  useEffect(() => {
    async function loadAvatar() {
      setAvatarLoading(true);
      const result = await getAvatar();
      if (result.success && result.data) {
        setAvatar(result.data.avatar);
        setProfile(result.data.profile);
      }
      setAvatarLoading(false);
    }
    
    if (user) {
      loadAvatar();
    }
  }, [user]);

  // Poll for avatar readiness while creating
  useEffect(() => {
    if (!isAvatarCreating || avatarReady) return;
    
    const pollInterval = setInterval(async () => {
      const result = await getAvatar();
      if (result.success && result.data) {
        const hasContent = !!(result.data.avatar.current_video_url || result.data.avatar.current_image_url);
        setAvatar(result.data.avatar);
        setProfile(result.data.profile);
        
        if (hasContent) {
          setIsAvatarCreating(false);
          localStorage.removeItem('avatar_creating');
        }
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [isAvatarCreating, avatarReady]);

  // Load saved posts
  useEffect(() => {
    async function loadPosts() {
      const result = await getSavedPosts(20, 0);
      if (result.success && result.data) {
        setSavedPosts(result.data.posts);
        setSavedPostsTotal(result.data.total);
      }
    }
    
    if (user) {
      loadPosts();
    }
  }, [user]);

  // Socket connection
  useEffect(() => {
    if (!user) return;
    
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    const socket = io(API_BASE, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    
    socket.on('connect', () => {
      setIsConnected(true);
    });
    
    socket.on('disconnect', () => {
      setIsConnected(false);
    });
    
    socket.on('content_result', (data: ContentSubmitResponse) => {
      if (data.ok && data.avatar) {
        setAvatar(data.avatar);
        
        // Update history
        setHistory(prev => prev.map(h => 
          h.status === 'processing' 
            ? { ...h, status: 'success' as const, xp: data.xp, coins: data.coins }
            : h
        ));
        
        // Update post count
        setTodayPostCount(prev => {
          const newCount = prev + 1;
          localStorage.setItem('daily_posts', JSON.stringify({
            date: new Date().toDateString(),
            count: newCount
          }));
          return newCount;
        });
      }
    });
    
    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Submit post
  const handleSubmitPost = useCallback(async () => {
    if (!postUrl.trim() || todayPostCount >= MAX_DAILY_POSTS) return;
    
    const url = postUrl.trim();
    setPostUrl('');
    
    setHistory(prev => [{ url, status: 'processing' }, ...prev]);
    
    // Try socket first (from useSocket hook)
    if (socket?.connected) {
      socket.emit('submit_content', { url });
    } else {
      // Fallback to HTTP
      const result = await submitContent(url);
      if (result.success && result.data?.avatar) {
        setAvatar(result.data.avatar);
        setHistory(prev => prev.map(h => 
          h.url === url 
            ? { ...h, status: 'success', xp: result.data?.xp, coins: result.data?.coins }
            : h
        ));
        setTodayPostCount(prev => {
          const newCount = prev + 1;
          localStorage.setItem('daily_posts', JSON.stringify({
            date: new Date().toDateString(),
            count: newCount
          }));
          return newCount;
        });
      } else {
        setHistory(prev => prev.map(h => 
          h.url === url ? { ...h, status: 'error' } : h
        ));
      }
    }
  }, [postUrl, todayPostCount]);

  // Reveal avatar for new users
  const handleReveal = () => {
    setShutterOpen(true);
    localStorage.setItem('onboarding_complete', 'true');
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/';
    }
  }, [authLoading, user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Home Tab */}
      <div className={`max-w-md mx-auto px-4 py-6 ${activeTab !== 'home' ? 'hidden' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src="/images/likegrow-logo.png" alt="LikeGrow" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">LikeGrow</h1>
              <p className="text-xs text-muted-foreground">{avatar?.level_name || 'Seedling'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(user?.role === 'admin' || user?.email?.includes('admin') || user?.email === 'likegrow.app@gmail.com') && (
              <a href="/admin" className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </a>
            )}
            <button onClick={() => setShowShop(true)} className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Avatar Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square rounded-3xl overflow-hidden mb-6 glass-card border-2 border-primary/30"
        >
          {avatarReady ? (
            <>
              {avatar?.current_video_url ? (
                <video
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
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : null}
              
              {/* State badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm flex items-center gap-2">
                <StateIcon state={avatar?.state || 'idle'} />
                <span className="text-xs capitalize">{avatar?.state || 'Idle'}</span>
              </div>
              
              {/* Reveal animation for new users */}
              {isNewUser && !shutterOpen && (
                <motion.div
                  initial={{ y: 0 }}
                  animate={shutterOpen ? { y: '-100%' } : { y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer"
                  onClick={handleReveal}
                >
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-white/80 mx-auto mb-4" />
                    <p className="text-white font-medium">Tap to reveal your avatar!</p>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-4">
              {isAvatarCreating ? (
                <>
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                  <p className="text-xs text-muted-foreground text-center">Creating...</p>
                </>
              ) : (
                <>
                  <Sparkles className="w-16 h-16 text-primary/50 mb-4" />
                  <p className="text-xs text-muted-foreground text-center">Feed content to see your avatar</p>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Personality */}
        {profile && (
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-foreground">{profile.personality_type}</h2>
            {profile.personality_description && (
              <p className="text-sm text-muted-foreground mt-1">{profile.personality_description}</p>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div className="glass-card rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 mx-auto mb-2 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{avatar?.level || 1}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </motion.div>
          
          <motion.div className="glass-card rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 mx-auto mb-2 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{avatar?.experience || 0}</p>
            <p className="text-xs text-muted-foreground">XP</p>
          </motion.div>
          
          <motion.div className="glass-card rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 mx-auto mb-2 flex items-center justify-center">
              <Coins className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{avatar?.coins || 0}</p>
            <p className="text-xs text-muted-foreground">Coins</p>
          </motion.div>
        </div>

        {/* Avatar Status */}
        {avatar && avatar.state !== 'healthy' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card rounded-2xl p-4 mb-6 flex items-center gap-3 border-l-4 ${
              avatar.state === 'tired' 
                ? 'border-l-yellow-500 bg-yellow-500/5'
                : 'border-l-red-500 bg-red-500/5'
            }`}
          >
            <StateIcon state={avatar.state} />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground capitalize">{avatar.state}</p>
              <p className="text-xs text-muted-foreground">
                {avatar.state === 'tired'
                  ? 'Your avatar is getting tired. Share some content to keep them happy!'
                  : 'Your avatar is neglected. Share content to revive them!'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Experience Progress */}
        {avatar && (
          <motion.div className="glass-card rounded-2xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">{avatar.level_name}</span>
              <span className="text-xs text-muted-foreground">
                {avatar.experience}/{avatar.exp_to_next_level + avatar.experience} XP
              </span>
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

        {/* Shop Prompt for new users */}
        {isAvatarCreating && !avatarReady && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">While you wait...</p>
              <p className="text-sm text-muted-foreground">Check out the shop for accessories!</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowShop(true)}>
              Browse
            </Button>
          </motion.div>
        )}

        {/* Feed Widget */}
        <motion.div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Feed your avatar</span>
            </div>
            <span className="text-xs text-muted-foreground">{todayPostCount}/{MAX_DAILY_POSTS} today</span>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="Paste TikTok or Instagram link..."
              disabled={(!avatarReady && isNewUser) || avatarLoading || todayPostCount >= MAX_DAILY_POSTS}
              className="flex-1 px-3 py-2 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitPost()}
            />
            <Button
              onClick={handleSubmitPost}
              disabled={!postUrl.trim() || (!avatarReady && isNewUser) || avatarLoading || todayPostCount >= MAX_DAILY_POSTS}
              size="sm"
              className="rounded-xl bg-primary text-primary-foreground px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          
          {todayPostCount >= MAX_DAILY_POSTS && (
            <p className="text-xs text-muted-foreground mt-2">Come back tomorrow for more!</p>
          )}
        </motion.div>

        {/* Account Info */}
        <motion.div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">{user?.role === 'admin' ? 'Admin' : 'Member'}</p>
            </div>
            <button onClick={logout} className="text-xs text-muted-foreground hover:text-foreground">
              Logout
            </button>
                </div>
              </motion.div>
            </div>

            {/* Feed Tab */}
      <div className={`max-w-md mx-auto px-4 py-6 ${activeTab !== 'feed' ? 'hidden' : ''}`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Activity History</h1>
          <p className="text-sm text-muted-foreground">{savedPostsTotal} posts saved</p>
        </div>

        {/* Processing items */}
        {history.filter(h => h.status === 'processing').length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
              <Clock className="w-3 h-3" /> Processing
            </p>
            {history.filter(h => h.status === 'processing').map((item, i) => (
              <HistoryItem key={`processing-${i}`} item={item} />
            ))}
          </div>
        )}

        {/* Saved posts */}
        {savedPosts.length > 0 ? (
          <div>
            {savedPosts.map(post => (
              <SavedPostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ListPlus className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No posts yet</p>
            <p className="text-sm text-muted-foreground mt-1">Feed content to your avatar to see history</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border">
        <div className="max-w-md mx-auto flex">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${activeTab === 'feed' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <ListPlus className="w-5 h-5" />
            <span className="text-xs">Feed</span>
          </button>
        </div>
      </nav>

      {/* Shop Sheet */}
      <Sheet open={showShop} onOpenChange={setShowShop}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Shop
            </SheetTitle>
            <SheetDescription>Spend coins on accessories and items for your avatar</SheetDescription>
          </SheetHeader>
          <div className="py-6 text-center text-muted-foreground">
            <p>Shop coming soon!</p>
            <p className="text-sm mt-2">Spend coins on accessories and items</p>
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
