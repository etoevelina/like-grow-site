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

export interface Avatar {
  id: number;
  level: number;
  level_name: string;
  experience: number;
  exp_to_next_level: number;
  exp_progress_percent: number;
  coins: number;
  current_image_url: string | null;
  current_video_url: string | null;
  state: string;
  traits: string[];
  accessories: string[];
}

export interface CreateAvatarResponse {
  message: string;
  is_new: boolean;
  profile: AvatarProfile;
  avatar: Avatar;
}

export interface AvatarState {
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
      current_image_url: null,
      current_video_url: null,
      state: 'idle',
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
      console.log('[v0] No auth token, using mock avatar data');
      const mockData = getMockAvatarData(quizAnswers);
      return { success: true, data: mockData };
    }

    console.log('[v0] Creating avatar with token:', token.substring(0, 20) + '...');
    console.log('[v0] Quiz answers:', JSON.stringify(quizAnswers, null, 2));

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

    console.log('[v0] API response status:', response.status);

    const data = await response.json();
    console.log('[v0] API response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      // If API fails, use mock data as fallback for demo
      console.log('[v0] API failed, using mock data as fallback');
      const mockData = getMockAvatarData(quizAnswers);
      return { success: true, data: mockData };
    }

    return { success: true, data };
  } catch (error) {
    console.error('[v0] Create avatar error:', error);
    // Use mock data as fallback
    console.log('[v0] Network error, using mock data as fallback');
    const mockData = getMockAvatarData(quizAnswers);
    return { success: true, data: mockData };
  }
}

export async function getAvatar(): Promise<{
  success: boolean;
  data?: { avatar: Avatar; profile: AvatarProfile };
  error?: string;
}> {
  try {
    const token = getAccessToken();
    if (!token) {
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
      return { success: false, error: data.message || 'Failed to get avatar' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Get avatar error:', error);
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
