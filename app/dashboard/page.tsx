'use client';
// Dashboard v9 - JSX fix

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useSocket } from '@/hooks/use-socket';
import { 
  User, Sparkles, Trophy, Coins, Star, 
  Link2, Send, Loader2, CheckCircle2,
  Heart, Frown, AlertTriangle, 
  Home, ListPlus, ShoppingBag, Clock, X,
  ExternalLink, Settings, ClipboardList, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Avatar as AvatarType, 
  AvatarProfile, 
  getAvatar, 
  submitContent,
  getSavedPosts,
  getTodayPostCount,
  tapAvatar,
  SavedPost,
  ContentSubmitResponse,
} from '@/lib/avatar-api';
import { getShopItems, purchaseItem, type ShopItem } from '@/lib/shop-api';
import { getTasks, completeTask, type Task } from '@/lib/tasks-api';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

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

function formatXp(value: number | undefined | null): string {
  const n = Number(value ?? 0);
  return n === Math.floor(n) ? String(Math.round(n)) : n.toFixed(2);
}

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
  
  // Socket: single connection, avatar updates + content submit results
  const handleAvatarUpdate = useCallback((updatedAvatar: AvatarType) => {
    setAvatar(updatedAvatar);
    setIsBackgroundRegenerating(false);
  }, []);

  const handleContentResult = useCallback((data: ContentSubmitResponse) => {
    if (pendingPostUrlsRef.current.length > 0) pendingPostUrlsRef.current = pendingPostUrlsRef.current.slice(1);
    // Update the first 'processing' row (FIFO) so we don't rely on URL match — avoids "Processing" stuck when URL differs
    const updateFirstProcessing = (status: 'success' | 'error', xp?: number, coins?: number) => {
      setHistory((prev) => {
        const idx = prev.findIndex((h) => h.status === 'processing');
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = { ...next[idx], status, ...(status === 'success' && xp != null && coins != null ? { xp, coins } : {}) };
        return next;
      });
    };
    if (data.ok && data.avatar) {
      setAvatar(data.avatar);
      updateFirstProcessing('success', data.xp, data.coins);
      setTodayPostCount((prev) => prev + 1);
      getSavedPosts(20, 0).then((result) => {
        if (result.success && result.data) {
          setSavedPosts(result.data.posts);
          setSavedPostsTotal(result.data.total);
        }
      });
      // Post submit evolution is synchronous — new avatar is already in data.avatar; no need for background indicator
    } else {
      updateFirstProcessing('error');
      if (data.error && (data.error.toLowerCase().includes('limit') || data.error.toLowerCase().includes('daily'))) {
        setTodayPostCount(MAX_DAILY_POSTS);
        setShowLimitSheet(true);
      }
    }
  }, []);

  const { isConnected, submitPost } = useSocket(handleAvatarUpdate, handleContentResult);
  
  // UI state
  const [activeTab, setActiveTab] = useState<'home' | 'feed' | 'tasks'>('home');
  const [showShop, setShowShop] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);
  
  // Shop state
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [shopLoading, setShopLoading] = useState(false);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [purchaseToast, setPurchaseToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingMessage, setGeneratingMessage] = useState('Creating your avatar...');
  const [purchaseSuccess, setPurchaseSuccess] = useState<{ itemName: string; show: boolean }>({ itemName: '', show: false });
  const pendingPostUrlsRef = useRef<string[]>([]); // Track pending posts in order (using ref to avoid stale closure)
  
  // New user flow
  const [isNewUser, setIsNewUser] = useState(false);
  const [shutterOpen, setShutterOpen] = useState(false);
  const [isAvatarCreating, setIsAvatarCreating] = useState(false);
  
  // Daily post limit
  const MAX_DAILY_POSTS = 5;
  const [todayPostCount, setTodayPostCount] = useState(0);
  const [showLimitSheet, setShowLimitSheet] = useState(false);
  const [tapMessage, setTapMessage] = useState<string | null>(null);
  const [tapPulse, setTapPulse] = useState(false);
  // Level-up: congrats modal; background regeneration (avatar visible, subtle "Updating..." indicator)
  const [showLevelUpModal, setShowLevelUpModal] = useState<{ show: boolean; newLevel?: number }>({ show: false });
  const [isBackgroundRegenerating, setIsBackgroundRegenerating] = useState(false);
  
  // Check if avatar is ready
  const avatarReady = !!(avatar?.current_video_url || avatar?.current_image_url);

  // Rotating messages while avatar is generating — so the user sees progress and stays engaged
  const CREATION_STEPS = [
    'Reading your taste...',
    'Drawing your twin...',
    'Choosing the right vibes...',
    'Adding the finishing touches...',
    'Almost there...',
    'Your twin is taking shape...',
  ];
  useEffect(() => {
    if (!isGenerating && avatarReady) return;
    let i = 0;
    setGeneratingMessage(CREATION_STEPS[0]);
    const t = setInterval(() => {
      i = (i + 1) % CREATION_STEPS.length;
      setGeneratingMessage(CREATION_STEPS[i]);
    }, 3800);
    return () => clearInterval(t);
  }, [isGenerating, avatarReady]);

  // Check for new user on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const avatarCreatingFlag = localStorage.getItem('avatar_creating') === 'true';
      
      if (avatarCreatingFlag) {
        setIsAvatarCreating(true);
        setIsGenerating(true);
      }
      
      if (params.get('new') === 'true') {
        setIsNewUser(true);
        setIsAvatarCreating(true);
        setIsGenerating(true);
        window.history.replaceState({}, '', '/dashboard');
      }
      
      // Remove stale localStorage daily_posts - now using server
      localStorage.removeItem('daily_posts');
    }
  }, []);

  // Load avatar and profile; refetch on tab focus so XP/coins stay in sync (silent, no loader)
  useEffect(() => {
    if (!user) return;

    async function loadAvatar(showLoading = true) {
      if (showLoading) setAvatarLoading(true);
      const result = await getAvatar();
      if (result.success && result.data) {
        setAvatar(result.data.avatar);
        setProfile(result.data.profile);
      }
      if (showLoading) setAvatarLoading(false);
    }

    loadAvatar(true);

    const onFocus = () => loadAvatar(false);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
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
      setIsGenerating(false);
      localStorage.removeItem('avatar_creating');
        }
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [isAvatarCreating, avatarReady]);

  // Load shop items when shop opens
  useEffect(() => {
    async function loadShopItems() {
      if (!showShop) return;
      setShopLoading(true);
      const result = await getShopItems();
      if (result.success && result.items) {
        setShopItems(result.items.filter(item => item.is_active));
      }
      setShopLoading(false);
    }
    
    loadShopItems();
  }, [showShop]);

  // Load tasks when Tasks tab is open
  useEffect(() => {
    if (activeTab !== 'tasks' || !user) return;
    let cancelled = false;
    setTasksLoading(true);
    getTasks().then((result) => {
      if (!cancelled && result.success && result.tasks) setTasks(result.tasks);
      if (!cancelled) setTasksLoading(false);
    });
    return () => { cancelled = true; };
  }, [activeTab, user]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setPurchaseToast({ message, type });
    setTimeout(() => setPurchaseToast(null), 3000);
  };

  // Handle purchase
  const handlePurchase = async (item: ShopItem) => {
    if (!avatar || avatar.coins < item.cost) return;
    
    // Show immediate feedback - remove spinner, show toast, deduct coins optimistically
    setPurchasingId(item.id);
    
    // Optimistically update UI immediately
    showToast(`Purchasing: ${item.name}...`, 'success');
    setAvatar(prev => prev ? { ...prev, coins: prev.coins - item.cost } : prev);
    setPurchasingId(null); // Remove button spinner immediately
    setGeneratingMessage('Applying purchase...');
    setIsGenerating(true); // Show generating overlay on avatar
    
    // Now wait for server response in background
    const result = await purchaseItem(item.id);
    
    if (result.success) {
      showToast(`Purchased: ${item.name}!`, 'success');
      setPurchaseSuccess({ itemName: item.name, show: true });
      setIsBackgroundRegenerating(true);
      // Auto-hide success after 2 seconds
      setTimeout(() => setPurchaseSuccess({ itemName: '', show: false }), 2000);
      // Update full avatar when ready (backend may send updated avatar later via socket)
      if (result.avatar) {
        setAvatar(result.avatar as AvatarType);
      }
    } else {
      // Refund coins on failure
      showToast(result.error || 'Purchase failed', 'error');
      setAvatar(prev => prev ? { ...prev, coins: prev.coins + item.cost } : prev);
    }
    setIsGenerating(false);
    setGeneratingMessage('Creating your avatar...'); // Reset to default
  };

  // Load saved posts on mount and when opening Feed tab (so we can clear stale "Processing" if socket event was lost)
  useEffect(() => {
    if (!user) return;
    async function loadPosts() {
      const result = await getSavedPosts(20, 0);
      if (result.success && result.data) {
        setSavedPosts(result.data.posts);
        setSavedPostsTotal(result.data.total);
        // If there are still "processing" rows but server has posts, first one likely completed (socket event missed)
        if (result.data.posts.length > 0) {
          setHistory((prev) => {
            const idx = prev.findIndex((h) => h.status === 'processing');
            if (idx === -1) return prev;
            const next = [...prev];
            const first = result.data!.posts[0];
            next[idx] = { ...next[idx], status: 'success' as const, xp: first.xp ?? 0, coins: first.coins ?? 0 };
            return next;
          });
        }
      }
    }
    loadPosts();
  }, [user, activeTab]);

  // Load today's post count from server
  useEffect(() => {
    async function loadTodayCount() {
      const result = await getTodayPostCount();
      if (result.success && result.count !== undefined) {
        setTodayPostCount(result.count);
      }
    }
    if (user) loadTodayCount();
  }, [user]);

  // Submit post — check limit first: on 6th+ attempt show sheet; otherwise submit if URL present
  const handleSubmitPost = useCallback(async () => {
    let currentCount: number = todayPostCount;
    try {
      const countResult = await getTodayPostCount();
      const serverCount = countResult.success && countResult.count !== undefined ? countResult.count : null;
      if (serverCount !== null) {
        setTodayPostCount(serverCount);
        currentCount = serverCount;
      }
    } catch {
      // use state as fallback so sheet still shows when at limit
    }

    if (currentCount >= MAX_DAILY_POSTS) {
      setShowLimitSheet(true);
      return;
    }

    if (!postUrl.trim()) return;

    const url = postUrl.trim();
    setPostUrl('');
    
    setHistory(prev => [{ url, status: 'processing' }, ...prev]);
    pendingPostUrlsRef.current = [...pendingPostUrlsRef.current, url];

    if (isConnected) {
      submitPost(url).catch(() => {});
    } else {
      const result = await submitContent(url);
      if (result.success && result.data?.avatar) {
        setAvatar(result.data.avatar);
        setHistory(prev => prev.map(h => 
          h.url === url 
            ? { ...h, status: 'success', xp: result.data?.xp, coins: result.data?.coins }
            : h
        ));
        setTodayPostCount(prev => prev + 1);
        getSavedPosts(20, 0).then((res) => {
          if (res.success && res.data) {
            setSavedPosts(res.data.posts);
            setSavedPostsTotal(res.data.total);
          }
        });
      } else {
        setHistory(prev => prev.map(h => 
          h.url === url ? { ...h, status: 'error' } : h
        ));
        const err = (result.error || '').toLowerCase();
        if (err.includes('limit') || err.includes('daily')) {
          setTodayPostCount(MAX_DAILY_POSTS);
          setShowLimitSheet(true);
        }
      }
    }
  }, [postUrl, todayPostCount, isConnected, submitPost]);

  // Reveal avatar for new users
  const handleReveal = () => {
    setShutterOpen(true);
    localStorage.setItem('onboarding_complete', 'true');
  };

  // Tap avatar for bonus XP (no cooldown). On level up: show congrats modal and set background regeneration.
  const handleTapAvatar = async () => {
    if (!avatarReady || isGenerating || purchaseSuccess.show) return;
    if (isNewUser && !shutterOpen) return;
    const result = await tapAvatar();
    if (result.success && result.avatar) {
      setAvatar(result.avatar as AvatarType);
      setTapPulse(true);
      const xp = Number(result.xp_awarded ?? 0);
      const xpStr = xp < 1 || xp !== Math.floor(xp) ? xp.toFixed(3) : String(Math.round(xp));
      setTapMessage(`+${xpStr} XP!`);
      setTimeout(() => setTapMessage(null), 2000);
      if (result.leveled_up) {
        setShowLevelUpModal({ show: true, newLevel: result.new_level ?? undefined });
        setIsBackgroundRegenerating(true);
      }
    }
  };

  // Complete a task (XP + coins)
  const handleCompleteTask = async (taskId: number) => {
    setCompletingTaskId(taskId);
    const result = await completeTask(taskId);
    setCompletingTaskId(null);
    if (result.success && result.avatar) {
      setAvatar(result.avatar as AvatarType);
      const list = await getTasks();
      if (list.success && list.tasks) setTasks(list.tasks);
    } else if (result.error) {
      console.error(result.error);
    }
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

        {/* Avatar Window — tap for bonus XP */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={avatarReady && !isGenerating && !purchaseSuccess.show && (!isNewUser || shutterOpen) ? handleTapAvatar : undefined}
          className={`relative aspect-square rounded-3xl overflow-hidden mb-6 glass-card border-2 border-primary/30 ${
            avatarReady && !isGenerating && !purchaseSuccess.show && (!isNewUser || shutterOpen) ? 'cursor-pointer' : ''
          }`}
        >
          {avatarReady ? (
            <>
              {/* Full-screen generating overlay only for first creation (not background regeneration) */}
              {isGenerating && !purchaseSuccess.show && !isBackgroundRegenerating && (
                <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-10 rounded-3xl">
                  <video
                    src="/videos/loading.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-72 h-72 object-contain"
                  />
                  <p className="text-white text-xl mt-8 font-medium">{generatingMessage}</p>
                  <div className="w-40 h-0.5 bg-white/20 rounded-full mt-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      animate={{ width: ['0%', '70%', '100%', '30%'] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              )}
              {/* Subtle "Updating avatar" bar for background regeneration — avatar stays visible */}
              {isBackgroundRegenerating && (
                <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-b-3xl flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-white/90" />
                  <span className="text-sm text-white/90">Updating your avatar...</span>
                </div>
              )}
              
              {/* Success overlay */}
              {purchaseSuccess.show && (
                <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-10 rounded-3xl">
                  <div className="flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-6">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </div>
                  <p className="text-white text-2xl font-bold">Success!</p>
                  <p className="text-white/70 text-lg mt-2">Equipped: {purchaseSuccess.itemName}</p>
                </div>
              )}
              
              {/* Avatar display — pulse on tap */}
              <motion.div
                className="absolute inset-0"
                animate={{ scale: tapPulse ? [1, 1.07, 1] : 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                onAnimationComplete={() => tapPulse && setTapPulse(false)}
              >
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
              </motion.div>
              
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

              {/* Tap-for-XP feedback */}
              {tapMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                >
                  <span className="px-4 py-2 rounded-full bg-primary/90 text-primary-foreground font-semibold text-lg shadow-lg">
                    {tapMessage}
                  </span>
                </motion.div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4">
              <video
                src="/videos/loading.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-72 h-72 object-contain"
              />
              <p className="text-xl text-white mt-8 font-medium">{generatingMessage}</p>
              <div className="w-48 h-1 bg-white/20 rounded-full mt-4 overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: ['0%', '70%', '100%', '30%', '70%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Personality type only — description hidden */}
        {profile && (
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-foreground">{profile.personality_type}</h2>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div className="glass-tile rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 mx-auto mb-2 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{avatar?.level || 1}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </motion.div>
          
          <motion.div className="glass-tile rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 mx-auto mb-2 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{formatXp(avatar?.experience)}</p>
            <p className="text-xs text-muted-foreground">XP</p>
          </motion.div>
          
          <motion.div className="glass-tile rounded-2xl p-4 text-center">
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
                {formatXp(avatar.experience)}/{formatXp((avatar.exp_to_next_level ?? 0) + (avatar.experience ?? 0))} XP
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

        {/* While avatar is generating: send to shop and tasks */}
        {isAvatarCreating && !avatarReady && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 space-y-3"
          >
            <p className="text-sm font-medium text-foreground">While you wait...</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowShop(true)}
                className="glass-card rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm">Shop</p>
                  <p className="text-xs text-muted-foreground">Accessories for your avatar</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tasks')}
                className="glass-card rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-green-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm">Tasks</p>
                  <p className="text-xs text-muted-foreground">Earn XP and coins</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* Feed Widget — no counter, no "limit reached" until user tries to send; then show sheet */}
        <motion.div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Feed your avatar</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="Paste TikTok or Instagram link..."
              disabled={(!avatarReady && isNewUser) || avatarLoading}
              className="flex-1 px-3 py-2 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitPost()}
            />
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmitPost();
              }}
              disabled={avatarLoading}
              size="sm"
              className="rounded-xl bg-primary text-primary-foreground px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
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

      {/* Tasks Tab */}
      <div className={`max-w-md mx-auto px-4 py-6 pb-24 ${activeTab !== 'tasks' ? 'hidden' : ''}`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Tasks</h1>
          <p className="text-sm text-muted-foreground">Complete tasks to earn XP and coins</p>
        </div>
        {tasksLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No tasks yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card rounded-2xl p-4 border ${
                  task.completed ? 'border-green-500/30 bg-green-500/5' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{task.name}</h3>
                      {task.completed && (
                        <span className="flex items-center gap-1 text-xs text-green-500">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Done
                        </span>
                      )}
                      {!task.can_complete && !task.completed && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Lock className="w-3.5 h-3.5" /> Complete first task
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    )}
                    {task.key === 'sync_likepost' && !task.completed && (
                      <a
                        href="https://likepost.onelink.me/0Rxw/yu98euh9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Open LikePost App
                      </a>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-green-500">+{task.xp_reward} XP</span>
                      <span className="text-xs text-yellow-500">+{task.coins_reward} coins</span>
                    </div>
                  </div>
                  {task.can_complete && (
                    <Button
                      size="sm"
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={completingTaskId === task.id}
                      className="shrink-0 rounded-xl bg-primary text-primary-foreground"
                    >
                      {completingTaskId === task.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : task.key === 'sync_likepost' ? (
                        'I\'ve synced'
                      ) : (
                        'Complete'
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
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
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'tasks' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-xs">Tasks</span>
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'feed' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <ListPlus className="w-5 h-5" />
            <span className="text-xs">Feed</span>
          </button>
        </div>
      </nav>

      {/* Purchase Toast */}
      {purchaseToast && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-medium shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4 ${
          purchaseToast.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-destructive text-destructive-foreground'
        }`}>
          {purchaseToast.message}
        </div>
      )}

      {/* Shop Sheet */}
      <Sheet open={showShop} onOpenChange={setShowShop}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl overflow-hidden flex flex-col">
          <SheetHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Shop
              </SheetTitle>
              <div className="flex items-center gap-1 bg-card px-3 py-1 rounded-full">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">{avatar?.coins || 0}</span>
              </div>
            </div>
            <SheetDescription>Spend coins on accessories and items for your avatar</SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto py-4">
            {shopLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : shopItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No items available yet</p>
                <p className="text-sm mt-2">Check back later for new items!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {shopItems.map(item => {
                  const canAfford = (avatar?.coins || 0) >= item.cost;
                  const isPurchasing = purchasingId === item.id;
                  
                  return (
                    <div
                      key={item.id}
                      className="glass-tile rounded-2xl overflow-hidden"
                    >
                      {/* Item Image */}
                      <div className="aspect-square bg-muted/30 relative">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
                          </div>
                        )}
                        {/* Price badge */}
                        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1">
                          <Coins className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs font-semibold">{item.cost}</span>
                        </div>
                      </div>
                      
                      {/* Item Info */}
                      <div className="p-3">
                        <h3 className="font-medium text-sm truncate">{item.name}</h3>
                        {item.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        )}
                        
                        {/* Buy Button */}
                        <button
                          onClick={() => handlePurchase(item)}
                          disabled={!canAfford || isPurchasing}
                          className={`w-full mt-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                            canAfford
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }`}
                        >
                          {isPurchasing ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                          ) : canAfford ? (
                            'Buy'
                          ) : (
                            'Not enough coins'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Daily limit reached sheet — 6th post attempt or tap when at limit */}
      <Sheet open={showLimitSheet} onOpenChange={setShowLimitSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-center pb-4">
            <SheetTitle className="text-xl">Want to share more?</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center gap-6 pb-8">
            <img
              src="/images/likepost-logo.gif"
              alt="LikePost"
              className="w-28 h-28 rounded-2xl object-contain flex-shrink-0"
              onError={(e) => {
                const t = e.currentTarget;
                if (t.src && !t.src.endsWith('.jpeg')) t.src = '/images/likepost-logo.jpeg';
              }}
            />
            <p className="text-center text-muted-foreground max-w-sm">
              Sync with LikePost to organize your content from socials. We’ll count your experience and coins — and your avatar will keep growing.
            </p>
            <a
              href="https://likepost.onelink.me/0Rxw/yu98euh9"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs py-4 rounded-2xl bg-primary text-primary-foreground text-base font-semibold text-center hover:opacity-90 transition-opacity"
            >
              Open LikePost App
            </a>
            <button
              onClick={() => setShowLimitSheet(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Level-up congrats modal — semi-transparent overlay */}
      <AnimatePresence>
        {showLevelUpModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLevelUpModal({ show: false })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="glass-card rounded-2xl p-6 max-w-sm w-full border border-border shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Congratulations!</h3>
                <p className="text-muted-foreground mb-6">
                  Your character has grown up{showLevelUpModal.newLevel != null ? ` — Level ${showLevelUpModal.newLevel}` : ''}. We&apos;re updating their look.
                </p>
                <Button
                  onClick={() => setShowLevelUpModal({ show: false })}
                  className="w-full"
                >
                  OK
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
