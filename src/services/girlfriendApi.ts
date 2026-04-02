// Virtual Girlfriend Character & Instagram Posts Generator
export interface GFCharacter {
  id: string;
  name: string;
  nameCn: string;
  age: number;
  birthday: string;
  zodiac: string;
  height: string;
  occupation: string;
  personality: string;
  interests: string[];
  bio: string;
  avatar: string;
  coverImage: string;
  relationship: string;
  mood: 'happy' | 'cute' | 'thinking' | 'hungry' | 'sleepy' | 'excited';
  lastPost: string;
}

export interface InstagramPost {
  id: string;
  authorId: string;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  postedAt: string;
  location?: string;
  type: 'photo' | 'story' | 'reels';
}

// The fictional girlfriend character
export const GIRLFRIEND: GFCharacter = {
  id: 'gf_001',
  name: 'Mei Ling',
  nameCn: '阿玲',
  age: 26,
  birthday: '1999-08-15',
  zodiac: 'Leo',
  height: '165cm',
  occupation: '室內設計師',
  personality: '活潑開朗、鐘意影相、周圍打卡、鐘意美食',
  interests: ['美食', '旅行', '瑜伽', '攝影', '看書', 'Coffee'],
  bio: '室內設計師 🏠 | 美食愛好者 🍜 | 週記生活 🌸 | 用心感受每一刻\n香港 / 深圳 / 澳門',
  avatar: '👩‍🦰',
  coverImage: '',
  relationship: '戀愛中 💕',
  mood: 'happy',
  lastPost: '2小時前',
};

// Sample photos (emoji representations)
const PHOTO_SETS = [
  { emoji: '🍜', title: '美食', location: '中環' },
  { emoji: '🌅', title: '日落', location: '淺水灣' },
  { emoji: '☕', title: 'Coffee', location: '西環' },
  { emoji: '🧘‍♀️', title: 'Yoga', location: '家中' },
  { emoji: '🏖️', title: '沙灘', location: '石澳' },
  { emoji: '🍰', title: '甜品', location: '尖沙咀' },
  { emoji: '🌸', title: '賞花', location: '南丫島' },
  { emoji: '🛍️', title: 'Shopping', location: '銅鑼灣' },
  { emoji: '📚', title: '閱讀', location: '家中書房' },
  { emoji: '🎬', title: '電影', location: '又一城' },
  { emoji: '🌃', title: '夜景', location: '山頂' },
  { emoji: '🥗', title: '健康餐', location: '堅尼地城' },
];

// Generate a post caption based on theme
const generateCaption = (theme: string, location: string): { caption: string; hashtags: string[] } => {
  const captions: Record<string, string[]> = {
    '美食': [
      '今日終於試到間新餐廳 🍜 味道同環境都一流！',
      '為咗呢個甜品排咗半個鐘頭隊，不過值得 💕',
      '香港終於有間正嘅日本料理，感動到喊 😭',
    ],
    '日落': [
      '今日嘅日落特别靚 🌅 感恩每一個平凡又美好嘅瞬間',
      '放工追日落，山頂風景真係冇得輸 📸',
    ],
    'Coffee': [
      '尋晚訓得唔好，今日要靠咖啡續命 ☕',
      '发現咗間宝藏Café，環境好舒服 🍵',
    ],
    'Yoga': [
      '每個星期總要有幾個鐘屬於自己 🧘‍♀️',
      'Yoga係一種生活態度，唔係減肥先至學 💪',
    ],
    '沙灘': [
      '夏天就係要曬太陽游水 🏖️ 最緊要係開心！',
      '沙灘永遠係我嘅快樂源泉 🐚',
    ],
    '甜品': [
      '減肥？聽日先算啦 🍰',
      '甜甜嘅嘢真係可以療愈心情 💕',
    ],
    '賞花': [
      '春天就係要出去睇花 🌸',
      '大自然永遠係最好嘅調色盤 🌿',
    ],
    'Shopping': [
      '今日收獲滿滿 🛍️ 女人嘅快樂好簡單',
      'Shopping therapy 🏬',
    ],
    '閱讀': [
      '書係人類進步嘅階梯 📚',
      '難得休閒讀書嘅午後，perfect �阅读',
    ],
    '電影': [
      '呢套電影真係笑住喊完 🎬',
      '週末就係要睇戲食爆谷 🎥',
    ],
    '夜景': [
      '香港嘅夜景永遠睇唔厭 🌃',
      '山頂嘅夜景係香港最靚嘅風景 ✨',
    ],
    '健康餐': [
      '為咗夏天要開始注意飲食 🥗',
      '健康飲食day1 💪',
    ],
  };

  const themeCaptions = captions[theme] || ['美好嘅一天 💕'];
  const caption = themeCaptions[Math.floor(Math.random() * themeCaptions.length)];
  
  const hashtagSets: Record<string, string[]> = {
    '美食': ['#香港美食', '#香港打卡', '#美食推薦', '#吃貨', '#foodiehk'],
    '日落': ['#香港日落', '#風景攝影', '#香港打卡', '#sunset', '#hkig'],
    'Coffee': ['#hkcafe', '#coffeetime', '#香港咖啡', '#cafehopping'],
    'Yoga': ['#yogalife', '#hkfitness', '#身心平衡', '#hkyoga'],
    '沙灘': ['#hkhong', '#beachlife', '#夏天', '#沙灘打卡'],
    '甜品': ['#dessertporn', '#hkdessert', '#甜品控', '#hkfoodie'],
    '賞花': ['#spring', '#賞花', '#花季', '#hknature'],
    'Shopping': ['#hkshopping', '#shoppingtherapy', '#銅鑼灣'],
    '閱讀': ['#reading', '#bookstagram', '#香港閱讀'],
    '電影': ['#hkmovie', '#電影推薦', '#movieholic'],
    '夜景': ['#hknightview', '#香港夜景', '#lightup'],
    '健康餐': ['#healthyeating', '#香港減脂餐', '#clean-eating'],
  };

  const hashtags = hashtagSets[theme] || ['#hklife', '#香港生活'];

  return { caption, hashtags };
};

// Generate posts
export const generatePosts = (count: number = 6): InstagramPost[] => {
  const posts: InstagramPost[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const photoSet = PHOTO_SETS[i % PHOTO_SETS.length];
    const { caption, hashtags } = generateCaption(photoSet.title, photoSet.location);
    
    // Random likes between 200-5000
    const likes = Math.floor(Math.random() * 4800) + 200;
    // Random comments between 10-200
    const comments = Math.floor(Math.random() * 190) + 10;
    
    // Calculate time ago
    const hoursAgo = i * 6 + Math.floor(Math.random() * 3);
    const postedAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();

    posts.push({
      id: `post_${i + 1}`,
      authorId: GIRLFRIEND.id,
      imageUrl: photoSet.emoji,
      caption: caption,
      hashtags: hashtags,
      likes,
      comments,
      postedAt,
      location: photoSet.location,
      type: 'photo',
    });
  }

  return posts;
};

// Get daily quote
export const getDailyQuote = (): string => {
  const quotes = [
    '生活就像咖啡，苦中帶甜 ☕',
    '今日也要，元氣滿滿！💪',
    '平凡係最美嘅幸福 🌸',
    '繼續保持對世界嘅好奇心 💕',
    '每一日都係新嘅開始 ✨',
    '愛自己，先至識得愛別人 💗',
    '用相機記錄生活，用心感受當下 📸',
    '香港處處有美景，只係欠發現嘅眼睛 👀',
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

// Format time ago
export const formatTimeAgo = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}分鐘前`;
  if (diffHours < 24) return `${diffHours}小時前`;
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString('zh-HK');
};
