export type Category = 
  | 'movies'
  | 'sports'
  | 'travel'
  | 'music'
  | 'memes'
  | 'food'
  | 'fashion'
  | 'news'
  | 'diy';

export type HumorLevel = 'wholesome' | 'balanced' | 'chaotic';

export type MusicGenre = 'hiphop' | 'pop' | 'indie' | 'country' | 'edm';

export interface QuizState {
  step: number;
  selectedCategories: Category[];
  humorLevel: number;
  musicGenre: MusicGenre | null;
  branchAnswers: Record<string, string[]>;
  progress: number;
}

export interface CategoryOption {
  id: Category;
  label: string;
  description: string;
  icon: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: 'movies', label: 'Movies/TV Shows', description: 'Netflix binges', icon: '🎬' },
  { id: 'sports', label: 'Sports/Fitness', description: 'Gym motivation', icon: '💪' },
  { id: 'travel', label: 'Travel/Adventures', description: 'Wanderlust pins', icon: '✈️' },
  { id: 'music', label: 'Music/Playlists', description: 'Spotify vibes', icon: '🎵' },
  { id: 'memes', label: 'Memes/Humor', description: 'Laughs for days', icon: '😂' },
  { id: 'food', label: 'Food/Recipes', description: 'Yum inspiration', icon: '🍕' },
  { id: 'fashion', label: 'Fashion/Style', description: 'Outfit ideas', icon: '👗' },
  { id: 'news', label: 'News/Trends', description: 'Stay informed', icon: '📰' },
  { id: 'diy', label: 'DIY/Crafts', description: 'Maker mode', icon: '🔧' },
];

export const MUSIC_GENRES = [
  { id: 'hiphop' as MusicGenre, label: 'Hip-Hop/Rap', description: 'Kendrick flows', color: 'from-orange-500 to-red-500' },
  { id: 'pop' as MusicGenre, label: 'Pop', description: 'Taylor anthems', color: 'from-pink-500 to-purple-500' },
  { id: 'indie' as MusicGenre, label: 'Indie', description: 'Tame Impala dreams', color: 'from-teal-500 to-cyan-500' },
  { id: 'country' as MusicGenre, label: 'Country', description: 'Luke Combs stories', color: 'from-amber-500 to-yellow-500' },
  { id: 'edm' as MusicGenre, label: 'EDM', description: 'Festival energy', color: 'from-blue-500 to-purple-500' },
];

export const BRANCH_QUESTIONS: Record<Category, { questions: { id: string; text: string; options: string[] }[] }> = {
  movies: {
    questions: [
      {
        id: 'movie-genre',
        text: 'What genres do you binge-save most?',
        options: ['Action/Superheroes', 'Comedy/Rom-Com', 'Horror/Thriller', 'Drama/Series'],
      },
    ],
  },
  sports: {
    questions: [
      {
        id: 'sports-type',
        text: 'Who inspires your fitness saves?',
        options: ['NBA Stars', 'Yoga Gurus', 'Gym Motivation', 'Outdoor Adventures'],
      },
    ],
  },
  travel: {
    questions: [
      {
        id: 'travel-style',
        text: 'Pick your travel save style',
        options: ['Beach Chill', 'Adventure Thrills', 'City Exploration', 'Road Trips'],
      },
    ],
  },
  music: {
    questions: [
      {
        id: 'music-vibe',
        text: 'What music content do you save?',
        options: ['Concert clips', 'Playlist covers', 'Artist news', 'Lyrics & quotes'],
      },
    ],
  },
  memes: {
    questions: [
      {
        id: 'meme-style',
        text: 'What meme format is your go-to?',
        options: ['Classic templates', 'Video memes', 'Reaction images', 'Text posts'],
      },
    ],
  },
  food: {
    questions: [
      {
        id: 'food-type',
        text: 'What food content do you save most?',
        options: ['Quick recipes', 'Restaurant finds', 'Healthy meals', 'Desserts & treats'],
      },
    ],
  },
  fashion: {
    questions: [
      {
        id: 'fashion-style',
        text: 'Your fashion save aesthetic?',
        options: ['Streetwear', 'Minimalist', 'Vintage vibes', 'Athleisure'],
      },
    ],
  },
  news: {
    questions: [
      {
        id: 'news-type',
        text: 'What news topics interest you?',
        options: ['Tech & gadgets', 'Pop culture', 'World events', 'Finance & crypto'],
      },
    ],
  },
  diy: {
    questions: [
      {
        id: 'diy-type',
        text: 'What DIY projects catch your eye?',
        options: ['Home decor', 'Tech hacks', 'Art & crafts', 'Life hacks'],
      },
    ],
  },
};

export function generateAvatarTraits(state: QuizState): string[] {
  const traits: string[] = [];
  
  // Based on categories
  if (state.selectedCategories.includes('travel')) traits.push('Wanderer');
  if (state.selectedCategories.includes('sports')) traits.push('Athletic');
  if (state.selectedCategories.includes('movies')) traits.push('Cinephile');
  if (state.selectedCategories.includes('music')) traits.push('Melodic');
  if (state.selectedCategories.includes('memes')) traits.push('Meme Lord');
  if (state.selectedCategories.includes('food')) traits.push('Foodie');
  if (state.selectedCategories.includes('fashion')) traits.push('Stylish');
  if (state.selectedCategories.includes('news')) traits.push('Informed');
  if (state.selectedCategories.includes('diy')) traits.push('Creator');
  
  // Based on humor level
  if (state.humorLevel < 33) traits.push('Wholesome');
  else if (state.humorLevel > 66) traits.push('Chaotic');
  else traits.push('Balanced');
  
  // Based on music
  if (state.musicGenre === 'edm') traits.push('Energetic');
  if (state.musicGenre === 'indie') traits.push('Dreamy');
  if (state.musicGenre === 'hiphop') traits.push('Flow Master');
  
  return traits;
}
