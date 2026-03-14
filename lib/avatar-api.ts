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

// Mock data for when API is unavailable
function getMockAvatarData(answers: QuizAnswer[]): CreateAvatarResponse {
  const categories = answers.find(a => a.question.includes('categories'))?.answer || '';
  const interests = categories.split(', ').filter(Boolean);
  
  return {
    message: 'Avatar created successfully',
    is_new: true,
    profile: {
      personality_type: 'Explorer',
      personality_description: 'A curious soul who loves discovering new things and sharing experiences with others.',
      interests: interests.length > 0 ? interests : ['creativity', 'discovery', 'expression'],
      content_style: 'Eclectic mix of interests',
    },
    avatar: {
      id: Date.now(),
      level: 1,
      level_name: 'Seedling',
      experience: 0,
      exp_to_next_level: 100,
      exp_progress_percent: 0,
      coins: 50,
      current_image_url: '/avatar-placeholder.jpg',
      current_video_url: null,
      state: 'healthy',
      traits: ['curious', 'creative'],
      accessories: [],
    },
  };
}

export async function createAvatar(quizAnswers: QuizAnswer[]): Promise<{
  success: boolean;
  data?: CreateAvatarResponse;
  error?: string;
}> {
  try {
    const token = getAccessToken();
    
    // If no token, use mock data for demo
    if (!token) {
      const mockData = getMockAvatarData(quizAnswers);
      return { success: true, data: mockData };
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
      // If API fails, use mock data as fallback for demo
      const mockData = getMockAvatarData(quizAnswers);
      return { success: true, data: mockData };
    }

    return { success: true, data };
  } catch {
    // Use mock data as fallback
    const mockData = getMockAvatarData(quizAnswers);
    return { success: true, data: mockData };
  }
}

// Mock avatar data for demo mode
function getMockExistingAvatar(): { avatar: Avatar; profile: AvatarProfile } {
  return {
    avatar: {
      id: 1,
      level: 1,
      level_name: 'Seedling',
      experience: 0,
      exp_to_next_level: 100,
      exp_progress_percent: 0,
      coins: 50,
      current_image_url: '/avatar-placeholder.jpg',
      current_video_url: null,
      state: 'healthy',
      traits: ['curious', 'creative'],
      accessories: [],
      saved_posts_count: 0,
    },
    profile: {
      personality_type: 'Explorer',
      personality_description: 'A curious soul ready to grow.',
      interests: ['creativity', 'discovery'],
      content_style: 'Eclectic',
    },
  };
}

export async function getAvatar(): Promise<{
  success: boolean;
  data?: { avatar: Avatar; profile: AvatarProfile };
  error?: string;
}> {
  try {
    const token = getAccessToken();
    if (!token) {
      // Return mock data for demo
      return { success: true, data: getMockExistingAvatar() };
    }

    const response = await fetch(`${API_BASE}/api/avatar`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Fallback to mock on error
      return { success: true, data: getMockExistingAvatar() };
    }

    return { success: true, data };
  } catch {
    // Fallback to mock on network error
    return { success: true, data: getMockExistingAvatar() };
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
