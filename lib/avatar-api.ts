const API_BASE = 'https://goldfish-app-ohjd4.ondigitalocean.app';

export interface QuizAnswer {
  question: string;
  answer: string;
}

export interface AvatarProfile {
  personality_type: string;
  personality_description: string;
  interests: string[];
  content_style: string;
}

export type AvatarState = 'healthy' | 'tired' | 'degraded' | 'idle';

export interface Avatar {
  id: number;
  user_id?: number;
  level: number;
  level_name: string;
  experience: number;
  exp_to_next_level: number;
  exp_progress_percent: number;
  coins: number;
  current_image_url: string | null;
  current_video_url: string | null;
  state: AvatarState;
  traits: string[];
  accessories: string[];
  last_fed_at?: string;
  saved_posts_count?: number;
  last_content_at?: string;
  last_evolution_at?: string;
}

export interface CreateAvatarResponse {
  message: string;
  is_new: boolean;
  profile: AvatarProfile;
  avatar: Avatar;
}

export interface AvatarDataState {
  isLoading: boolean;
  isGenerating: boolean;
  profile: AvatarProfile | null;
  avatar: Avatar | null;
  error: string | null;
}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export async function createAvatar(quizAnswers: QuizAnswer[]): Promise<{
  success: boolean;
  data?: CreateAvatarResponse;
  error?: string;
}> {
  try {
    const token = getAccessToken();
    
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/api/avatar/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        answers: quizAnswers,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to create avatar' };
    }

    // Save avatar data to localStorage for persistence
    saveAvatarData(data.avatar, data.profile);

    return { success: true, data };
  } catch (error) {
    console.error('Create avatar error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Save avatar data to localStorage
export function saveAvatarData(avatar: Avatar, profile: AvatarProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('avatar_data', JSON.stringify({ avatar, profile }));
}

// Get saved avatar data from localStorage
export function getSavedAvatarData(): { avatar: Avatar; profile: AvatarProfile } | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('avatar_data');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// Clear saved avatar data
export function clearAvatarData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('avatar_data');
}

export async function getAvatar(): Promise<{
  success: boolean;
  data?: { avatar: Avatar; profile: AvatarProfile };
  error?: string;
}> {
  try {
    const token = getAccessToken();
    if (!token) {
      // Try to get from localStorage
      const saved = getSavedAvatarData();
      if (saved) {
        return { success: true, data: saved };
      }
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/api/avatar`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Try localStorage as fallback
      const saved = getSavedAvatarData();
      if (saved) {
        return { success: true, data: saved };
      }
      return { success: false, error: data.message || 'Failed to get avatar' };
    }

    // Update localStorage with fresh data
    saveAvatarData(data.avatar, data.profile);

    return { success: true, data };
  } catch (error) {
    console.error('Get avatar error:', error);
    // Try localStorage as fallback
    const saved = getSavedAvatarData();
    if (saved) {
      return { success: true, data: saved };
    }
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Get avatar profile (internet portrait)
export async function getAvatarProfile(): Promise<{
  success: boolean;
  data?: AvatarProfile;
  error?: string;
}> {
  try {
    const token = getAccessToken();
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/api/avatar/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to get profile' };
    }

    return { success: true, data };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Submit content via HTTP (alternative to socket)
export interface ContentSubmitResponse {
  ok: boolean;
  xp?: number;
  coins?: number;
  avatar?: Avatar;
  leveled_up?: boolean;
  old_level?: number;
  new_level?: number;
  evolution?: {
    image_url: string;
    video_url: string;
  };
  content_evolution?: {
    image_url: string;
    video_url: string;
  };
  error?: string;
}

export async function submitContent(url: string): Promise<{
  success: boolean;
  data?: ContentSubmitResponse;
  error?: string;
}> {
  try {
    const token = getAccessToken();
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/api/content/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to submit content' };
    }

    return { success: true, data };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Get avatar history
export interface EvolutionHistoryItem {
  image_url: string;
  video_url: string;
  trigger_type: string;
  created_at: string;
}

export async function getAvatarHistory(limit: number = 10): Promise<{
  success: boolean;
  data?: EvolutionHistoryItem[];
  error?: string;
}> {
  try {
    const token = getAccessToken();
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/api/avatar/history?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to get history' };
    }

    return { success: true, data };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Convert quiz state to API format
export function formatQuizAnswers(quizState: {
  selectedCategories: string[];
  humorLevel: number;
  musicGenres: string[];
  swipeResults: Record<string, { id: string; liked: boolean }[]>;
  triviaAnswers: Record<string, boolean>;
  quoteAnswers: Record<string, string>;
}): QuizAnswer[] {
  const answers: QuizAnswer[] = [];

  // Categories
  if (quizState.selectedCategories.length > 0) {
    answers.push({
      question: 'What content categories interest you most?',
      answer: quizState.selectedCategories.join(', '),
    });
  }

  // Humor level
  const humorLabels = ['Wholesome & Light', 'Balanced Mix', 'Chaotic Energy'];
  const humorIndex = quizState.humorLevel < 33 ? 0 : quizState.humorLevel < 66 ? 1 : 2;
  answers.push({
    question: 'What is your humor style?',
    answer: humorLabels[humorIndex],
  });

  // Music genres
  if (quizState.musicGenres.length > 0) {
    answers.push({
      question: 'What music genres do you enjoy?',
      answer: quizState.musicGenres.join(', '),
    });
  }

  // Swipe results - liked items
  Object.entries(quizState.swipeResults).forEach(([category, results]) => {
    const liked = results.filter(r => r.liked).map(r => r.id);
    if (liked.length > 0) {
      answers.push({
        question: `What ${category} content do you like?`,
        answer: liked.join(', '),
      });
    }
  });

  // Trivia performance
  const triviaCorrect = Object.values(quizState.triviaAnswers).filter(Boolean).length;
  const triviaTotal = Object.keys(quizState.triviaAnswers).length;
  if (triviaTotal > 0) {
    answers.push({
      question: 'How knowledgeable are you about pop culture?',
      answer: `${triviaCorrect}/${triviaTotal} correct - ${triviaCorrect >= triviaTotal / 2 ? 'Pop culture expert' : 'Casual observer'}`,
    });
  }

  // Quote answers
  Object.entries(quizState.quoteAnswers).forEach(([, answer]) => {
    if (answer) {
      answers.push({
        question: 'Can you complete famous quotes?',
        answer: 'Yes - knows iconic references',
      });
    }
  });

  // Ensure minimum 3 answers
  while (answers.length < 3) {
    answers.push({
      question: 'What inspires you?',
      answer: 'Creativity and self-expression',
    });
  }

  return answers;
}
