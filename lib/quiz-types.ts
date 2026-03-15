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
    { id: 'mov1', title: 'Sci-Fi Thriller', subtitle: 'Mind-bending plots & epic visuals', image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500', category: 'movies' },
    { id: 'mov2', title: 'Action & Superheroes', subtitle: 'Marvel, DC, explosions', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=500', category: 'movies' },
    { id: 'mov3', title: 'Comedy & Rom-Com', subtitle: 'Laughs and love stories', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500', category: 'movies' },
    { id: 'mov4', title: 'Horror & Thriller', subtitle: 'Jump scares & suspense', image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500', category: 'movies' },
    { id: 'mov5', title: 'Drama & Indie', subtitle: 'Deep stories & emotions', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500', category: 'movies' },
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

// This or That Data
export interface ThisOrThatData {
  id: string;
  title: string;
  subtitle: string;
  questions: {
    id: string;
    optionA: { label: string; emoji: string; value: string };
    optionB: { label: string; emoji: string; value: string };
  }[];
}

export const THIS_OR_THAT_SETS: ThisOrThatData[] = [
  {
    id: 'tot1',
    title: 'Quick Picks',
    subtitle: 'Choose your vibe',
    questions: [
      { id: 'tot1_1', optionA: { label: 'Morning Person', emoji: '🌅', value: 'morning' }, optionB: { label: 'Night Owl', emoji: '🌙', value: 'night' } },
      { id: 'tot1_2', optionA: { label: 'Introvert', emoji: '📚', value: 'introvert' }, optionB: { label: 'Extrovert', emoji: '🎉', value: 'extrovert' } },
      { id: 'tot1_3', optionA: { label: 'Planner', emoji: '📋', value: 'planner' }, optionB: { label: 'Spontaneous', emoji: '🎲', value: 'spontaneous' } },
      { id: 'tot1_4', optionA: { label: 'Sweet', emoji: '🍰', value: 'sweet' }, optionB: { label: 'Savory', emoji: '🍕', value: 'savory' } },
      { id: 'tot1_5', optionA: { label: 'Beach', emoji: '🏖️', value: 'beach' }, optionB: { label: 'Mountains', emoji: '🏔️', value: 'mountains' } },
    ],
  },
  {
    id: 'tot2',
    title: 'Entertainment Vibes',
    subtitle: 'How do you unwind?',
    questions: [
      { id: 'tot2_1', optionA: { label: 'Movies', emoji: '🎬', value: 'movies' }, optionB: { label: 'TV Series', emoji: '📺', value: 'series' } },
      { id: 'tot2_2', optionA: { label: 'Reading', emoji: '📖', value: 'reading' }, optionB: { label: 'Gaming', emoji: '🎮', value: 'gaming' } },
      { id: 'tot2_3', optionA: { label: 'Live Concert', emoji: '🎤', value: 'concert' }, optionB: { label: 'Chill Playlist', emoji: '🎧', value: 'playlist' } },
      { id: 'tot2_4', optionA: { label: 'Solo Chill', emoji: '😌', value: 'solo' }, optionB: { label: 'Party Time', emoji: '🎊', value: 'party' } },
    ],
  },
  {
    id: 'tot3',
    title: 'Social Style',
    subtitle: 'Your social personality',
    questions: [
      { id: 'tot3_1', optionA: { label: 'Few Close Friends', emoji: '👯', value: 'close' }, optionB: { label: 'Big Friend Group', emoji: '👥', value: 'big' } },
      { id: 'tot3_2', optionA: { label: 'Text First', emoji: '💬', value: 'text' }, optionB: { label: 'Call First', emoji: '📞', value: 'call' } },
      { id: 'tot3_3', optionA: { label: 'Early to Events', emoji: '⏰', value: 'early' }, optionB: { label: 'Fashionably Late', emoji: '😎', value: 'late' } },
    ],
  },
];

// Mood Board Data
export interface MoodBoardData {
  id: string;
  category: Category | 'general';
  title: string;
  subtitle: string;
  options: {
    id: string;
    label: string;
    image: string;
    vibe: string;
  }[];
}

export const MOOD_BOARDS: MoodBoardData[] = [
  {
    id: 'mood1',
    category: 'general',
    title: 'Pick Your Aesthetic',
    subtitle: 'What visual vibe speaks to you?',
    options: [
      { id: 'aesthetic1', label: 'Dark Academia', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400', vibe: 'Books & Mystery' },
      { id: 'aesthetic2', label: 'Coastal Calm', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', vibe: 'Ocean & Serenity' },
      { id: 'aesthetic3', label: 'Urban Edge', image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400', vibe: 'City & Energy' },
      { id: 'aesthetic4', label: 'Cottagecore', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', vibe: 'Nature & Cozy' },
      { id: 'aesthetic5', label: 'Y2K Futurism', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', vibe: 'Retro & Tech' },
      { id: 'aesthetic6', label: 'Minimalist', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400', vibe: 'Clean & Simple' },
    ],
  },
  {
    id: 'mood2',
    category: 'fashion',
    title: 'Your Style Energy',
    subtitle: 'Which outfit mood fits you?',
    options: [
      { id: 'style1', label: 'Street Casual', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400', vibe: 'Comfy & Cool' },
      { id: 'style2', label: 'Elegant Night', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400', vibe: 'Classy & Chic' },
      { id: 'style3', label: 'Sporty Active', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400', vibe: 'Athletic & Fresh' },
      { id: 'style4', label: 'Boho Free', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400', vibe: 'Free & Artistic' },
    ],
  },
  {
    id: 'mood3',
    category: 'travel',
    title: 'Dream Destination Vibe',
    subtitle: 'Where does your soul want to go?',
    options: [
      { id: 'dest1', label: 'Tropical Paradise', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400', vibe: 'Sun & Relaxation' },
      { id: 'dest2', label: 'European Romance', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', vibe: 'Culture & History' },
      { id: 'dest3', label: 'Mountain Escape', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400', vibe: 'Adventure & Peace' },
      { id: 'dest4', label: 'Urban Exploration', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', vibe: 'Energy & Discovery' },
    ],
  },
  {
    id: 'mood4',
    category: 'food',
    title: 'Food Mood',
    subtitle: 'What food aesthetic calls you?',
    options: [
      { id: 'foodm1', label: 'Cozy Comfort', image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400', vibe: 'Warm & Homey' },
      { id: 'foodm2', label: 'Fine Dining', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', vibe: 'Elegant & Refined' },
      { id: 'foodm3', label: 'Street Food', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', vibe: 'Authentic & Bold' },
      { id: 'foodm4', label: 'Healthy Fresh', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', vibe: 'Clean & Vibrant' },
    ],
  },
];

// More Trivia Questions
export const EXTENDED_TRIVIA: TriviaQuestion[] = [
  ...TRIVIA_QUESTIONS,
  { id: 'triv6', category: 'movies', question: 'Avatar (2009) took only 6 months to film', fact: 'It actually took over 4 years to complete!', isTrue: false },
  { id: 'triv7', category: 'travel', question: 'There are more than 190 countries in the world', fact: 'There are 195 recognized sovereign nations!', isTrue: true },
  { id: 'triv8', category: 'food', question: 'Wasabi is actually green-dyed horseradish in most restaurants', fact: 'Real wasabi is rare and expensive outside Japan!', isTrue: true },
  { id: 'triv9', category: 'sports', question: 'The Olympics have been held on every continent', fact: 'Africa and Antarctica have never hosted!', isTrue: false },
  { id: 'triv10', category: 'music', question: 'Spotify was launched in the United States first', fact: 'It launched in Sweden in 2008!', isTrue: false },
  { id: 'triv11', category: 'fashion', question: 'High heels were originally designed for men', fact: 'Persian cavalry wore them to stay in stirrups!', isTrue: true },
  { id: 'triv12', category: 'memes', question: 'The first meme was created in 2005', fact: 'Dancing Baby from 1996 is considered the first viral meme!', isTrue: false },
  { id: 'triv13', category: 'movies', question: 'The Wilhelm scream has been used in over 400 films', fact: 'From Star Wars to Marvel, this iconic scream is everywhere!', isTrue: true },
  { id: 'triv14', category: 'travel', question: 'Vatican City is the smallest country by area', fact: 'It covers only 0.44 square kilometers!', isTrue: true },
  { id: 'triv15', category: 'food', question: 'Pineapple on pizza was invented in Hawaii', fact: 'It was actually invented in Canada by a Greek immigrant!', isTrue: false },
  { id: 'triv16', category: 'sports', question: 'Golf is played on the Moon', fact: 'Alan Shepard hit two golf balls on the Moon in 1971!', isTrue: true },
  { id: 'triv17', category: 'music', question: 'The longest song ever recorded is over 24 hours long', fact: 'Longplayer by Jem Finer plays for 1000 years without repeating!', isTrue: true },
  { id: 'triv18', category: 'travel', question: 'Australia is wider than the Moon', fact: 'Australia is ~4000km wide, the Moon is ~3400km in diameter!', isTrue: true },
  { id: 'triv19', category: 'food', question: 'Carrots were originally purple', fact: 'Dutch growers bred orange carrots in the 17th century!', isTrue: true },
  { id: 'triv20', category: 'movies', question: 'The Godfather used real horse head in the famous scene', fact: 'It came from a dog food company!', isTrue: true },
];

// More Quote Challenges
export const EXTENDED_QUOTES: QuoteChallenge[] = [
  ...QUOTE_CHALLENGES,
  { id: 'quote6', category: 'movies', quote: 'Why so ___?', missingWord: 'serious', options: ['serious', 'angry', 'quiet', 'sad'], source: 'The Dark Knight' },
  { id: 'quote7', category: 'movies', quote: 'You shall not ___!', missingWord: 'pass', options: ['pass', 'fail', 'enter', 'leave'], source: 'Lord of the Rings' },
  { id: 'quote8', category: 'music', quote: 'Hello from the other ___', missingWord: 'side', options: ['side', 'world', 'place', 'life'], source: 'Adele' },
  { id: 'quote9', category: 'memes', quote: 'One does not simply ___ into Mordor', missingWord: 'walk', options: ['walk', 'go', 'run', 'drive'], source: 'Lord of the Rings meme' },
  { id: 'quote10', category: 'movies', quote: 'With great power comes great ___', missingWord: 'responsibility', options: ['responsibility', 'danger', 'strength', 'courage'], source: 'Spider-Man' },
  { id: 'quote11', category: 'movies', quote: 'I see ___ people', missingWord: 'dead', options: ['dead', 'strange', 'angry', 'ghost'], source: 'The Sixth Sense' },
  { id: 'quote12', category: 'memes', quote: 'Is this a ___?', missingWord: 'pigeon', options: ['pigeon', 'butterfly', 'bird', 'joke'], source: 'Is This a Pigeon?' },
  { id: 'quote13', category: 'music', quote: 'I will always ___ you', missingWord: 'love', options: ['love', 'need', 'want', 'miss'], source: 'Whitney Houston' },
];

// Extended Music Challenges
export const EXTENDED_MUSIC: MusicChallenge[] = [
  ...MUSIC_CHALLENGES,
  { id: 'mus4', lyric: '"Is it too late now to say ___?"', artist: 'Justin Bieber', song: 'Sorry', options: ['sorry', 'goodbye', 'hello', 'please'], correctAnswer: 'sorry' },
  { id: 'mus5', lyric: '"I got my mind on my ___ and my ___ on my mind"', artist: 'Snoop Dogg', song: 'Gin and Juice', options: ['money, money', 'music, music', 'game, game', 'life, life'], correctAnswer: 'money, money' },
  { id: 'mus6', lyric: '"Somebody once told me the world is gonna ___ me"', artist: 'Smash Mouth', song: 'All Star', options: ['roll', 'save', 'help', 'change'], correctAnswer: 'roll' },
  { id: 'mus7', lyric: '"I came in like a ___ ball"', artist: 'Miley Cyrus', song: 'Wrecking Ball', options: ['wrecking', 'cannon', 'beach', 'disco'], correctAnswer: 'wrecking' },
  { id: 'mus8', lyric: '"Uptown ___ gonna give it to ya"', artist: 'Bruno Mars', song: 'Uptown Funk', options: ['funk', 'love', 'style', 'beat'], correctAnswer: 'funk' },
];

// Mixed question type for dynamic quiz flow
export type QuestionType = 'swipe' | 'trivia' | 'quote' | 'priority' | 'puzzle' | 'musicChallenge' | 'worldMap' | 'moodBoard' | 'thisOrThat';

export interface MixedQuestion {
  type: QuestionType;
  id: string;
  category: Category | 'general';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

// Smart shuffle to avoid consecutive same types
function smartShuffle(questions: MixedQuestion[]): MixedQuestion[] {
  if (questions.length <= 1) return questions;
  
  const result: MixedQuestion[] = [];
  const remaining = [...questions];
  
  // Pick first randomly
  const firstIdx = Math.floor(Math.random() * remaining.length);
  result.push(remaining.splice(firstIdx, 1)[0]);
  
  while (remaining.length > 0) {
    const lastType = result[result.length - 1].type;
    
    // Find questions with different type
    const differentType = remaining.filter(q => q.type !== lastType);
    
    if (differentType.length > 0) {
      // Pick randomly from different types
      const idx = Math.floor(Math.random() * differentType.length);
      const picked = differentType[idx];
      remaining.splice(remaining.indexOf(picked), 1);
      result.push(picked);
    } else {
      // No choice, must use same type
      const idx = Math.floor(Math.random() * remaining.length);
      result.push(remaining.splice(idx, 1)[0]);
    }
  }
  
  return result;
}

export function generateMixedQuestions(selectedCategories: Category[], includeMusicChallenges: boolean): MixedQuestion[] {
  const questions: MixedQuestion[] = [];
  
  // 1. General aesthetic mood board (always)
  const generalMood = MOOD_BOARDS.find(m => m.category === 'general');
  if (generalMood) {
    questions.push({
      type: 'moodBoard',
      id: generalMood.id,
      category: 'general',
      data: generalMood,
    });
  }
  
  // 2. Quick personality questions (this-or-that) - shortened to 3 questions
  const quickPicks = {
    ...THIS_OR_THAT_SETS[0],
    questions: THIS_OR_THAT_SETS[0].questions.slice(0, 3),
  };
  questions.push({
    type: 'thisOrThat',
    id: quickPicks.id,
    category: 'general',
    data: quickPicks,
  });
  
  // 3. One swipe set for primary category (first selected)
  const primaryCategory = selectedCategories[0];
  if (primaryCategory) {
    const cards = SWIPE_CARDS[primaryCategory];
    if (cards && cards.length > 0) {
      questions.push({
        type: 'swipe',
        id: `swipe-${primaryCategory}`,
        category: primaryCategory,
        data: cards.slice(0, 4), // Limit to 4 cards
      });
    }
  }
  
  // 4. One trivia question (random from selected categories)
  const categoryTrivias = EXTENDED_TRIVIA.filter(t => selectedCategories.includes(t.category));
  if (categoryTrivias.length > 0) {
    const randomTrivia = categoryTrivias[Math.floor(Math.random() * categoryTrivias.length)];
    questions.push({
      type: 'trivia',
      id: randomTrivia.id,
      category: randomTrivia.category,
      data: randomTrivia,
    });
  }
  
  // 5. One quote challenge (if movies or memes selected)
  if (selectedCategories.includes('movies') || selectedCategories.includes('memes')) {
    const quoteCategory = selectedCategories.includes('movies') ? 'movies' : 'memes';
    const quotes = EXTENDED_QUOTES.filter(q => q.category === quoteCategory);
    if (quotes.length > 0) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      questions.push({
        type: 'quote',
        id: randomQuote.id,
        category: quoteCategory,
        data: randomQuote,
      });
    }
  }
  
  // 6. One music challenge (if music selected)
  if (includeMusicChallenges && EXTENDED_MUSIC.length > 0) {
    const randomMusic = EXTENDED_MUSIC[Math.floor(Math.random() * EXTENDED_MUSIC.length)];
    questions.push({
      type: 'musicChallenge',
      id: randomMusic.id,
      category: 'music',
      data: randomMusic,
    });
  }
  
  // Total: 4-6 questions max (mood board, this-or-that, swipe, trivia, quote/music)
  // Smart shuffle to vary the order
  return smartShuffle(questions);
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
