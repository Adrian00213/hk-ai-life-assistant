// Dating / Social Matching Service
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatar: string;
  photos: string[];
  bio: string;
  interests: string[];
  location: string;
  distance: string;
  online: boolean;
  verified: boolean;
  lastActive: string;
}

export interface Match {
  id: string;
  user: UserProfile;
  matchedAt: string;
  interestMatch: number;
}

// Mock users
export const MOCK_USERS: UserProfile[] = [
  {
    id: 'u1',
    name: '小美',
    age: 26,
    gender: '女',
    avatar: '👩',
    photos: [],
    bio: '鐘意行山、美食、旅行 📸 搵個一樣鐘意探索世界嘅人 💫',
    interests: ['行山', '美食', '旅行', '瑜伽', '咖啡'],
    location: '中西區',
    distance: '2km',
    online: true,
    verified: true,
    lastActive: '剛剛在線',
  },
  {
    id: 'u2',
    name: '阿傑',
    age: 29,
    gender: '男',
    avatar: '👨',
    photos: [],
    bio: '工程師一枚，鐘意打機🎮 但係都鐘意戶外活動。搵個可以一齊睇Netflix又可以一齊行山嘅佢 💪',
    interests: ['打機', '行山', '投資', '健身', '烹飪'],
    location: '灣仔區',
    distance: '3km',
    online: true,
    verified: true,
    lastActive: '剛剛在線',
  },
  {
    id: 'u3',
    name: 'Coco',
    age: 24,
    gender: '女',
    avatar: '👩‍🦰',
    photos: [],
    bio: 'KOL / 模特兒 🕶️ 鐘意影相、品酒、精致嘢 💕 想要穩定關係',
    interests: ['攝影', '品酒', '時尚', '旅行', '健身'],
    location: '油尖旺',
    distance: '1km',
    online: false,
    verified: true,
    lastActive: '2小時前',
  },
  {
    id: 'u4',
    name: 'David',
    age: 31,
    gender: '男',
    avatar: '🧔',
    photos: [],
    bio: 'Startup創辦人 🚀 鐘意傾計、學習新嘢。婚姻係長遠目標👀',
    interests: ['Startup', '科技', '投資', '跑步', '讀書'],
    location: '中西區',
    distance: '4km',
    online: true,
    verified: false,
    lastActive: '15分鐘前',
  },
  {
    id: 'u5',
    name: '婷婷',
    age: 27,
    gender: '女',
    avatar: '👩‍🦱',
    photos: [],
    bio: '醫生 🏥 做嘢好忙，但係一係唔match就match就认真对待。鐘意簡單生活 🍃',
    interests: ['睇書', '電影', '烹飪', '狗', '行山'],
    location: '南區',
    distance: '5km',
    online: false,
    verified: true,
    lastActive: '1日前',
  },
  {
    id: 'u6',
    name: 'Kevin',
    age: 28,
    gender: '男',
    avatar: '👨‍💼',
    photos: [],
    bio: '金融從業員 💰 鐘意分析、搵錢、退休後周圍去 🎯',
    interests: ['投資', '健身', '足球', '旅行', '紅酒'],
    location: '灣仔區',
    distance: '2km',
    online: true,
    verified: true,
    lastActive: '剛剛在線',
  },
];

// Match suggestions
export const MATCH_SUGGESTIONS = MOCK_USERS.filter(u => u.online);

// Interest tags
export const INTEREST_TAGS = [
  '行山', '美食', '旅行', '健身', '打機', '電影', '音樂', 
  '讀書', '烹飪', '投資', '瑜伽', '跑步', '足球', '網球',
  '咖啡', '品酒', '時尚', '攝影', '旅行', '狗', '貓'
];

// Chat messages
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export const MOCK_CHATS: { [userId: string]: ChatMessage[] } = {
  'u1': [
    { id: 'm1', senderId: 'u1', text: '你好！睇到你都鐘意行山，你通常去邊度行多？⛰️', timestamp: '10:30', read: true },
    { id: 'm2', senderId: 'me', text: 'hi～我多數去港島徑或者大帽山！你呢？', timestamp: '10:32', read: true },
    { id: 'm3', senderId: 'u1', text: '我鐘意西貢！風景好正，而且唔多人 👍', timestamp: '10:33', read: false },
  ],
};

// Get user by ID
export const getUserById = (id: string): UserProfile | undefined => {
  return MOCK_USERS.find(u => u.id === id);
};

// Calculate interest match percentage
export const calculateInterestMatch = (userInterests: string[], targetInterests: string[]): number => {
  const common = userInterests.filter(i => targetInterests.includes(i));
  const match = Math.round((common.length / Math.max(userInterests.length, targetInterests.length)) * 100);
  return match;
};

// Get mutual interests
export const getMutualInterests = (userInterests: string[], targetInterests: string[]): string[] => {
  return userInterests.filter(i => targetInterests.includes(i));
};
