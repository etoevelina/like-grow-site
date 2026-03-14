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

export type MusicGenre = 'hiphop' | 'pop' | 'indie' | 'rock' | 'edm' | 'rnb';

export interface QuizState {
  step: number;
  selectedCategories: Category[];
  humorLevel: number;
  musicGenres: MusicGenre[];
  swipeResults: Record<string, SwipeResult[]>;
  triviaAnswers: Record<string, boolean>;
  quoteAnswers: Record<string, string>;
  progress: number;
}

export interface SwipeResult {
  id: string;
  liked: boolean;
}

export interface CategoryOption {
  id: Category;
  label: string;
  description: string;
  icon: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: 'movies', label: 'Movies & TV', description: 'Films, series, documentaries', icon: 'film' },
  { id: 'sports', label: 'Sports & Fitness', description: 'Workouts, teams, athletes', icon: 'dumbbell' },
  { id: 'travel', label: 'Travel', description: 'Destinations, adventures', icon: 'plane' },
  { id: 'music', label: 'Music', description: 'Artists, concerts, playlists', icon: 'music' },
  { id: 'memes', label: 'Memes & Humor', description: 'Jokes, viral content', icon: 'smile' },
  { id: 'food', label: 'Food & Dining', description: 'Restaurants, recipes, cuisines', icon: 'utensils' },
  { id: 'fashion', label: 'Fashion & Style', description: 'Outfits, trends, brands', icon: 'shirt' },
  { id: 'news', label: 'News & Tech', description: 'Current events, gadgets', icon: 'newspaper' },
  { id: 'diy', label: 'DIY & Crafts', description: 'Projects, tutorials, hacks', icon: 'wrench' },
];

export interface MusicGenreOption {
  id: MusicGenre;
  label: string;
  artists: string;
}

export const MUSIC_GENRES: MusicGenreOption[] = [
  { id: 'hiphop', label: 'Hip-Hop', artists: 'Drake, Kendrick, Travis' },
  { id: 'pop', label: 'Pop', artists: 'Taylor, Dua Lipa, The Weeknd' },
  { id: 'indie', label: 'Indie', artists: 'Tame Impala, Arctic Monkeys' },
  { id: 'rock', label: 'Rock', artists: 'Foo Fighters, Imagine Dragons' },
  { id: 'edm', label: 'EDM', artists: 'Calvin Harris, Marshmello' },
  { id: 'rnb', label: 'R&B', artists: 'SZA, Frank Ocean, Daniel Caesar' },
];

export interface SwipeCard {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  category: Category;
}

export const SWIPE_CARDS: Record<Category, SwipeCard[]> = {
  movies: [
    { id: 'mov1', title: 'Sci-Fi Thriller', subtitle: 'Mind-bending plots & epic visuals', image: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500', category: 'movies' },
    { id: 'mov2', title: 'Action & Superheroes', subtitle: 'Marvel, DC, explosions', image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500', category: 'movies' },
    { id: 'mov3', title: 'Comedy & Rom-Com', subtitle: 'Laughs and love stories', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500', category: 'movies' },
    { id: 'mov4', title: 'Horror & Thriller', subtitle: 'Jump scares & suspense', image: 'https://images.unsplash.com/photo-1509248961725-9d3c21cb8e26?w=500', category: 'movies' },
    { id: 'mov5', title: 'Drama & Indie', subtitle: 'Deep stories & emotions', image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500', category: 'movies' },
  ],
  food: [
    { id: 'food1', title: 'Italian', subtitle: 'Pasta, Pizza, Risotto', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=500', category: 'food' },
    { id: 'food2', title: 'Japanese', subtitle: 'Sushi, Ramen, Tempura', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500', category: 'food' },
    { id: 'food3', title: 'Mexican', subtitle: 'Tacos, Burritos, Guacamole', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500', category: 'food' },
    { id: 'food4', title: 'Thai', subtitle: 'Pad Thai, Curry, Tom Yum', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500', category: 'food' },
    { id: 'food5', title: 'French', subtitle: 'Croissants, Wine, Cheese', image: 'https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=500', category: 'food' },
  ],
  travel: [
    { id: 'trav1', title: 'Beach Paradise', subtitle: 'Maldives, Bali, Caribbean', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500', category: 'travel' },
    { id: 'trav2', title: 'Mountain Adventures', subtitle: 'Alps, Himalayas, Rockies', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500', category: 'travel' },
    { id: 'trav3', title: 'City Exploration', subtitle: 'Tokyo, Paris, New York', image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500', category: 'travel' },
    { id: 'trav4', title: 'Road Trips', subtitle: 'Route 66, Pacific Coast', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500', category: 'travel' },
    { id: 'trav5', title: 'Historical Sites', subtitle: 'Rome, Egypt, Greece', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500', category: 'travel' },
  ],
  sports: [
    { id: 'sport1', title: 'Basketball', subtitle: 'NBA, Street Ball', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500', category: 'sports' },
    { id: 'sport2', title: 'Soccer', subtitle: 'Champions League, World Cup', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500', category: 'sports' },
    { id: 'sport3', title: 'Yoga & Meditation', subtitle: 'Mindfulness, Flexibility', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', category: 'sports' },
    { id: 'sport4', title: 'Gym & Weights', subtitle: 'Strength Training', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500', category: 'sports' },
    { id: 'sport5', title: 'Extreme Sports', subtitle: 'Surfing, Snowboarding', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=500', category: 'sports' },
  ],
  fashion: [
    { id: 'fash1', title: 'Streetwear', subtitle: 'Supreme, Off-White, Nike', image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=500', category: 'fashion' },
    { id: 'fash2', title: 'Minimalist', subtitle: 'Clean lines, Neutral tones', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500', category: 'fashion' },
    { id: 'fash3', title: 'Vintage', subtitle: '90s, Retro, Thrift finds', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500', category: 'fashion' },
    { id: 'fash4', title: 'Luxury', subtitle: 'Gucci, Louis Vuitton', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500', category: 'fashion' },
  ],
  memes: [],
  news: [],
  diy: [],
  music: [],
};

export interface TriviaQuestion {
  id: string;
  category: Category;
  question: string;
  fact: string;
  isTrue: boolean;
}

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  { id: 'triv1', category: 'movies', question: 'The Lion King was the first Disney animated film with an original story', fact: 'It was actually inspired by Hamlet!', isTrue: false },
  { id: 'triv2', category: 'food', question: 'Honey never spoils and can last thousands of years', fact: 'Archaeologists found 3000-year-old honey in Egyptian tombs still edible!', isTrue: true },
  { id: 'triv3', category: 'travel', question: 'France is the most visited country in the world', fact: 'France receives over 89 million tourists annually!', isTrue: true },
  { id: 'triv4', category: 'music', question: 'The Beatles hold the record for most #1 hits on Billboard', fact: 'They have 20 number-one singles!', isTrue: true },
  { id: 'triv5', category: 'sports', question: 'Golf balls have exactly 336 dimples', fact: 'They typically have 300-500 dimples, varying by manufacturer', isTrue: false },
];

export interface QuoteChallenge {
  id: string;
  category: Category;
  quote: string;
  missingWord: string;
  options: string[];
  source: string;
}

export const QUOTE_CHALLENGES: QuoteChallenge[] = [
  { id: 'quote1', category: 'movies', quote: 'May the ___ be with you', missingWord: 'Force', options: ['Force', 'Light', 'Power', 'Way'], source: 'Star Wars' },
  { id: 'quote2', category: 'movies', quote: "I'll be ___", missingWord: 'back', options: ['back', 'there', 'ready', 'gone'], source: 'Terminator' },
  { id: 'quote3', category: 'movies', quote: 'Life is like a box of ___', missingWord: 'chocolates', options: ['chocolates', 'surprises', 'candies', 'dreams'], source: 'Forrest Gump' },
  { id: 'quote4', category: 'music', quote: "I got 99 problems but a ___ ain't one", missingWord: 'bitch', options: ['beat', 'bitch', 'break', 'bass'], source: 'Jay-Z' },
  { id: 'quote5', category: 'memes', quote: 'This is fine. Everything is ___', missingWord: 'fine', options: ['fine', 'great', 'okay', 'perfect'], source: 'This Is Fine Dog' },
];

export interface MusicChallenge {
  id: string;
  lyric: string;
  artist: string;
  song: string;
  options: string[];
  correctAnswer: string;
}

export const MUSIC_CHALLENGES: MusicChallenge[] = [
  { id: 'mus1', lyric: '"Cause all of me loves all of ___"', artist: 'John Legend', song: 'All of Me', options: ['you', 'her', 'this', 'us'], correctAnswer: 'you' },
  { id: 'mus2', lyric: '"We found love in a ___ place"', artist: 'Rihanna', song: 'We Found Love', options: ['hopeless', 'beautiful', 'secret', 'lonely'], correctAnswer: 'hopeless' },
  { id: 'mus3', lyric: '"Started from the bottom now we ___"', artist: 'Drake', song: 'Started From The Bottom', options: ['here', 'rich', 'won', 'there'], correctAnswer: 'here' },
];

// Priority Ranking Data
export interface PriorityRankingData {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  items: { id: string; label: string; emoji?: string }[];
}

export const PRIORITY_RANKINGS: PriorityRankingData[] = [
  {
    id: 'rank1',
    category: 'travel',
    title: 'Rank your travel priorities',
    subtitle: 'What matters most when traveling?',
    items: [
      { id: 'food', label: 'Local Food & Cuisine', emoji: '🍜' },
      { id: 'culture', label: 'Culture & History', emoji: '🏛️' },
      { id: 'adventure', label: 'Adventure & Outdoors', emoji: '🏔️' },
      { id: 'relaxation', label: 'Relaxation & Beach', emoji: '🏖️' },
      { id: 'nightlife', label: 'Nightlife & Entertainment', emoji: '🎉' },
    ],
  },
  {
    id: 'rank2',
    category: 'movies',
    title: 'Rank your movie priorities',
    subtitle: 'What makes a great film for you?',
    items: [
      { id: 'plot', label: 'Mind-blowing Plot', emoji: '🧠' },
      { id: 'visuals', label: 'Stunning Visuals', emoji: '🎬' },
      { id: 'acting', label: 'Amazing Acting', emoji: '🎭' },
      { id: 'soundtrack', label: 'Epic Soundtrack', emoji: '🎵' },
      { id: 'emotions', label: 'Emotional Impact', emoji: '💔' },
    ],
  },
  {
    id: 'rank3',
    category: 'food',
    title: 'Rank your food priorities',
    subtitle: 'What matters in a meal?',
    items: [
      { id: 'taste', label: 'Taste & Flavor', emoji: '👅' },
      { id: 'healthy', label: 'Healthy & Nutritious', emoji: '🥗' },
      { id: 'presentation', label: 'Beautiful Presentation', emoji: '📸' },
      { id: 'price', label: 'Good Value', emoji: '💰' },
      { id: 'authentic', label: 'Authentic & Traditional', emoji: '👨‍🍳' },
    ],
  },
  {
    id: 'rank4',
    category: 'music',
    title: 'Rank your music priorities',
    subtitle: 'What makes you love a song?',
    items: [
      { id: 'lyrics', label: 'Meaningful Lyrics', emoji: '📝' },
      { id: 'beat', label: 'Catchy Beat', emoji: '🥁' },
      { id: 'vocals', label: 'Amazing Vocals', emoji: '🎤' },
      { id: 'vibe', label: 'Overall Vibe', emoji: '✨' },
      { id: 'dance', label: 'Danceability', emoji: '💃' },
    ],
  },
];

// Puzzle Match Data
export interface PuzzleMatchData {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  pairs: { id: string; left: string; right: string; leftEmoji?: string; rightEmoji?: string }[];
}

export const PUZZLE_MATCHES: PuzzleMatchData[] = [
  {
    id: 'puzzle1',
    category: 'movies',
    title: 'Match the Quote',
    subtitle: 'Connect quotes to their movies',
    pairs: [
      { id: 'p1', left: '"I am your father"', right: 'Star Wars', leftEmoji: '⚔️', rightEmoji: '🌟' },
      { id: 'p2', left: '"Here\'s Johnny!"', right: 'The Shining', leftEmoji: '🪓', rightEmoji: '👻' },
      { id: 'p3', left: '"You talking to me?"', right: 'Taxi Driver', leftEmoji: '🚕', rightEmoji: '🎬' },
      { id: 'p4', left: '"I\'ll be back"', right: 'Terminator', leftEmoji: '🤖', rightEmoji: '💪' },
    ],
  },
  {
    id: 'puzzle2',
    category: 'food',
    title: 'Match the Dish',
    subtitle: 'Connect dishes to their countries',
    pairs: [
      { id: 'f1', left: 'Sushi', right: 'Japan', leftEmoji: '🍣', rightEmoji: '🇯🇵' },
      { id: 'f2', left: 'Pizza', right: 'Italy', leftEmoji: '🍕', rightEmoji: '🇮🇹' },
      { id: 'f3', left: 'Tacos', right: 'Mexico', leftEmoji: '🌮', rightEmoji: '🇲🇽' },
      { id: 'f4', left: 'Croissant', right: 'France', leftEmoji: '🥐', rightEmoji: '🇫🇷' },
    ],
  },
  {
    id: 'puzzle3',
    category: 'music',
    title: 'Match the Artist',
    subtitle: 'Connect songs to their artists',
    pairs: [
      { id: 'm1', left: '"Bad Guy"', right: 'Billie Eilish', leftEmoji: '🎵', rightEmoji: '💚' },
      { id: 'm2', left: '"Blinding Lights"', right: 'The Weeknd', leftEmoji: '💡', rightEmoji: '🌙' },
      { id: 'm3', left: '"Shape of You"', right: 'Ed Sheeran', leftEmoji: '💃', rightEmoji: '🎸' },
      { id: 'm4', left: '"Uptown Funk"', right: 'Bruno Mars', leftEmoji: '🕺', rightEmoji: '🎤' },
    ],
  },
  {
    id: 'puzzle4',
    category: 'sports',
    title: 'Match the Legend',
    subtitle: 'Connect athletes to their sports',
    pairs: [
      { id: 's1', left: 'Michael Jordan', right: 'Basketball', leftEmoji: '🏀', rightEmoji: '🦅' },
      { id: 's2', left: 'Lionel Messi', right: 'Soccer', leftEmoji: '⚽', rightEmoji: '🐐' },
      { id: 's3', left: 'Serena Williams', right: 'Tennis', leftEmoji: '🎾', rightEmoji: '👑' },
      { id: 's4', left: 'Usain Bolt', right: 'Track', leftEmoji: '🏃', rightEmoji: '⚡' },
    ],
  },
];

// Mixed question type for dynamic quiz flow
export type QuestionType = 'swipe' | 'trivia' | 'quote' | 'priority' | 'puzzle' | 'musicChallenge';

export interface MixedQuestion {
  type: QuestionType;
  id: string;
  category: Category;
  data: SwipeCard[] | TriviaQuestion | QuoteChallenge | PriorityRankingData | PuzzleMatchData | MusicChallenge;
}

export function generateMixedQuestions(selectedCategories: Category[], includeMusicChallenges: boolean): MixedQuestion[] {
  const questions: MixedQuestion[] = [];
  
  // Add swipe cards (max 1 per relevant category)
  selectedCategories.forEach(cat => {
    const cards = SWIPE_CARDS[cat];
    if (cards && cards.length > 0) {
      questions.push({
        type: 'swipe',
        id: `swipe-${cat}`,
        category: cat,
        data: cards,
      });
    }
  });
  
  // Add trivia questions (1 per category if available)
  selectedCategories.forEach(cat => {
    const trivia = TRIVIA_QUESTIONS.find(t => t.category === cat);
    if (trivia) {
      questions.push({
        type: 'trivia',
        id: trivia.id,
        category: cat,
        data: trivia,
      });
    }
  });
  
  // Add quote challenges (1 if movies selected)
  if (selectedCategories.includes('movies')) {
    const quote = QUOTE_CHALLENGES.find(q => q.category === 'movies');
    if (quote) {
      questions.push({
        type: 'quote',
        id: quote.id,
        category: 'movies',
        data: quote,
      });
    }
  }
  
  // Add priority rankings (1 per category if available)
  selectedCategories.forEach(cat => {
    const ranking = PRIORITY_RANKINGS.find(r => r.category === cat);
    if (ranking) {
      questions.push({
        type: 'priority',
        id: ranking.id,
        category: cat,
        data: ranking,
      });
    }
  });
  
  // Add puzzle matches (1 per category if available)
  selectedCategories.forEach(cat => {
    const puzzle = PUZZLE_MATCHES.find(p => p.category === cat);
    if (puzzle) {
      questions.push({
        type: 'puzzle',
        id: puzzle.id,
        category: cat,
        data: puzzle,
      });
    }
  });
  
  // Add music challenges if applicable
  if (includeMusicChallenges && MUSIC_CHALLENGES.length > 0) {
    questions.push({
      type: 'musicChallenge',
      id: MUSIC_CHALLENGES[0].id,
      category: 'music',
      data: MUSIC_CHALLENGES[0],
    });
  }
  
  // Shuffle questions but keep some order: swipes first, then mix others
  const swipes = questions.filter(q => q.type === 'swipe');
  const others = questions.filter(q => q.type !== 'swipe');
  
  // Shuffle non-swipe questions
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  
  // Interleave: swipe, other, swipe, other...
  const mixed: MixedQuestion[] = [];
  const maxLen = Math.max(swipes.length, others.length);
  for (let i = 0; i < maxLen; i++) {
    if (swipes[i]) mixed.push(swipes[i]);
    if (others[i]) mixed.push(others[i]);
  }
  
  return mixed;
}

export function generateAvatarTraits(state: QuizState): string[] {
  const traits: string[] = [];
  
  if (state.selectedCategories.includes('travel')) traits.push('Wanderer');
  if (state.selectedCategories.includes('sports')) traits.push('Athletic');
  if (state.selectedCategories.includes('movies')) traits.push('Cinephile');
  if (state.selectedCategories.includes('music')) traits.push('Melodic');
  if (state.selectedCategories.includes('memes')) traits.push('Meme Lord');
  if (state.selectedCategories.includes('food')) traits.push('Foodie');
  if (state.selectedCategories.includes('fashion')) traits.push('Stylish');
  if (state.selectedCategories.includes('news')) traits.push('Informed');
  if (state.selectedCategories.includes('diy')) traits.push('Creator');
  
  if (state.humorLevel < 33) traits.push('Wholesome');
  else if (state.humorLevel > 66) traits.push('Chaotic');
  else traits.push('Balanced');
  
  if (state.musicGenres.includes('edm')) traits.push('Energetic');
  if (state.musicGenres.includes('indie')) traits.push('Dreamy');
  if (state.musicGenres.includes('hiphop')) traits.push('Flow Master');
  if (state.musicGenres.includes('rnb')) traits.push('Soulful');
  
  return traits;
}
