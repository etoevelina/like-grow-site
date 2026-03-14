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
