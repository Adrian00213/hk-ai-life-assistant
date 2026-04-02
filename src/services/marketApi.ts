// Hong Kong Market Information Service
// Including wet markets, traditional fairs, and price tracking

export interface Market {
  id: string;
  name: string;
  district: string;
  type: 'wet' | 'cooked' | 'flea' | 'flower' | 'bird';
  address: string;
  coordinates: { lat: number; lon: number };
  openingHours: string;
  closedDays?: string;
  features: string[];
  phone?: string;
  description: string;
}

export interface MarketPrice {
  item: string;
  unit: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  lastUpdated: string;
  bestMarket?: string;
}

export interface MarketEvent {
  id: string;
  name: string;
  type: 'fair' | 'festival' | 'market';
  date: string;
  endDate?: string;
  location: string;
  description: string;
  highlight: string;
  district: string;
}

// All Hong Kong wet markets
export const HONG_KONG_WET_MARKETS: Market[] = [
  // Hong Kong Island
  {
    id: 'hk_1',
    name: '香港街市（東涌段）',
    district: '南區',
    type: 'wet',
    address: '香港仔大道203號A',
    coordinates: { lat: 22.2461, lon: 114.1535 },
    openingHours: '06:00 - 19:00',
    features: ['海鮮', '鮮肉', '蔬菜', '水果'],
    description: '南區最大嘅濕貨街市，海鮮檔特別出名',
  },
  {
    id: 'hk_2',
    name: '渣華道街市',
    district: '東區',
    type: 'wet',
    address: '北角渣華道123號',
    coordinates: { lat: 22.2847, lon: 114.1925 },
    openingHours: '06:00 - 18:00',
    features: ['鮮肉', '蔬菜', '鹹魚', '乾貨'],
    description: '北角老牌街市，價錢實惠',
  },
  {
    id: 'hk_3',
    name: '士瓜欄',
    district: '中西區',
    type: 'wet',
    address: '上環磅巷',
    coordinates: { lat: 22.2869, lon: 114.1543 },
    openingHours: '06:00 - 17:00',
    closedDays: '週日',
    features: ['蔬菜', '水果', '鮮花'],
    description: '上環傳統濕貨市場，歷史悠久',
  },
  {
    id: 'hk_4',
    name: '正街街市',
    district: '中西區',
    type: 'wet',
    address: '中環正街',
    coordinates: { lat: 22.2828, lon: 114.1578 },
    openingHours: '06:00 - 18:00',
    features: ['鮮肉', '蔬菜', '豆腐'],
    description: '中環上班一族嘅後勤基地',
  },
  // Kowloon
  {
    id: 'kl_1',
    name: '大成街市',
    district: '九龍城區',
    type: 'wet',
    address: '九龍城道58號',
    coordinates: { lat: 22.3287, lon: 114.1812 },
    openingHours: '06:00 - 19:00',
    features: ['海鮮', '鮮肉', '蔬菜', '燒味'],
    description: '九龍城區出名嘅街市，雞檔性價比高',
  },
  {
    id: 'kl_2',
    name: '牛頭角街市',
    district: '觀塘區',
    type: 'wet',
    address: '牛頭角道235號',
    coordinates: { lat: 22.3068, lon: 114.2327 },
    openingHours: '06:00 - 18:00',
    features: ['鮮肉', '蔬菜', '豆製品'],
    description: '觀塘打工仔嘅廚房後援',
  },
  {
    id: 'kl_3',
    name: '鯉魚門街市',
    district: '觀塘區',
    type: 'wet',
    address: '鯉魚門海傍道',
    coordinates: { lat: 22.2839, lon: 114.2372 },
    openingHours: '06:00 - 17:00',
    features: ['海鮮', '乾貨', '特產'],
    description: '鯉魚門三部曲之一，遊客必到',
  },
  {
    id: 'kl_4',
    name: '花園街街市',
    district: '深水埗區',
    type: 'wet',
    address: '深水埗花園街',
    coordinates: { lat: 22.3279, lon: 114.1687 },
    openingHours: '06:00 - 18:00',
    features: ['蔬菜', '水果', '鮮花', '寵物'],
    description: '又有濕貨又有乾貨，花園街聞名',
  },
  {
    id: 'kl_5',
    name: '北河街街市',
    district: '深水埗區',
    type: 'wet',
    address: '深水埗北河街',
    coordinates: { lat: 22.3305, lon: 114.1627 },
    openingHours: '06:00 - 18:00',
    features: ['鮮肉', '蔬菜', '燒味', '鹹魚'],
    description: '深水埗良心價，街坊至愛',
  },
  // New Territories
  {
    id: 'nt_1',
    name: '大埔墟街市',
    district: '大埔區',
    type: 'wet',
    address: '大埔墟寶湖道',
    coordinates: { lat: 22.4432, lon: 114.1651 },
    openingHours: '06:00 - 19:00',
    features: ['海鮮', '鮮肉', '蔬菜', '水果', '鮮花'],
    description: '大埔區最大嘅公眾街市',
  },
  {
    id: 'nt_2',
    name: '屯門街市',
    district: '屯門區',
    type: 'wet',
    address: '屯門鄉事會路',
    coordinates: { lat: 22.3936, lon: 113.9782 },
    openingHours: '06:00 - 19:00',
    features: ['鮮肉', '蔬菜', '海鮮', '燒味'],
    description: '屯門區核心街市，週六週日墟',
  },
  {
    id: 'nt_3',
    name: '沙田街市',
    district: '沙田區',
    type: 'wet',
    address: '沙田大會堂路',
    coordinates: { lat: 22.3754, lon: 114.1833 },
    openingHours: '06:00 - 18:00',
    features: ['鮮肉', '蔬菜', '水果'],
    description: '沙田中心地帶，交通方便',
  },
  {
    id: 'nt_4',
    name: '元朗街市',
    district: '元朗區',
    type: 'wet',
    address: '元朗教育路',
    coordinates: { lat: 22.4427, lon: 114.0223 },
    openingHours: '06:00 - 19:00',
    features: ['鮮肉', '蔬菜', '水果', '燒鵝', '老婆餅'],
    description: '元朗核心，元朗特產多',
  },
  {
    id: 'nt_5',
    name: '上水街市',
    district: '北區',
    type: 'wet',
    address: '上水新豐路',
    coordinates: { lat: 22.5006, lon: 114.1298 },
    openingHours: '06:00 - 18:00',
    features: ['鮮肉', '蔬菜', '水果', '海鮮'],
    description: '北區最大街市，内地旅客掃貨熱點',
  },
  {
    id: 'nt_6',
    name: '將軍澳街市',
    district: '西貢區',
    type: 'wet',
    address: '將軍澳寶琳北路',
    coordinates: { lat: 22.3047, lon: 114.2647 },
    openingHours: '06:00 - 18:00',
    features: ['鮮肉', '蔬菜', '水果'],
    description: '將軍澳新市鎮核心',
  },
];

// Traditional fairs and events
export const MARKET_EVENTS: MarketEvent[] = [
  {
    id: 'event_1',
    name: '長洲太平清醮',
    type: 'fair',
    date: '2026-05-03',
    endDate: '2026-05-07',
    location: '長洲',
    district: '離島區',
    description: '香港非物質文化遺產，搶包山、飄色巡遊',
    highlight: '🏔️ 搶包山比賽、🎭 飄色巡遊',
  },
  {
    id: 'event_2',
    name: '佛誕卡萊羅',
    type: 'festival',
    date: '2026-05-02',
    location: '荃灣海濱',
    district: '荃灣區',
    description: '浴佛節嘉年華，素食檔、祈福攤位',
    highlight: '🙏 浴佛儀式、🥗 素食市集',
  },
  {
    id: 'event_3',
    name: '端午龍舟賽',
    type: 'festival',
    date: '2026-05-31',
    location: '大澳',
    district: '離島區',
    description: '大澳端午龍舟自由賽，傳統扒龍舟',
    highlight: '🐉 龍舟競渡、🦐 龍舟飯',
  },
  {
    id: 'event_4',
    name: '天后誕庙会',
    type: 'fair',
    date: '2026-04-18',
    location: '元朗十八鄉',
    district: '元朗區',
    description: '天后寶誕大型庙会，花炮巡遊、粤剧表演',
    highlight: '🎪 花炮巡遊、🎭 粤剧匯演',
  },
  {
    id: 'event_5',
    name: '中環嘉年華',
    type: 'market',
    date: '2026-04-25',
    endDate: '2026-04-27',
    location: '中環海濱',
    district: '中西區',
    description: '大型戶外嘉年華，本地品牌、手工藝品',
    highlight: '🎨 本地設計品牌、🎪 美食車',
  },
  {
    id: 'event_6',
    name: '西貢海鮮節',
    type: 'fair',
    date: '2026-06-15',
    endDate: '2026-06-30',
    location: '西貢市',
    district: '西貢區',
    description: '西貢海鮮特惠月，多間酒樓推出優惠',
    highlight: '🦐 海鮮優惠、🚤 遊艇團',
  },
];

// Daily price tracking
export const DAILY_PRICES: MarketPrice[] = [
  {
    item: '菜心',
    unit: '斤',
    avgPrice: 18,
    minPrice: 12,
    maxPrice: 28,
    trend: 'up',
    trendPercent: 5.2,
    lastUpdated: '2026-04-02 06:30',
    bestMarket: '北河街街市',
  },
  {
    item: '西生菜',
    unit: '斤',
    avgPrice: 12,
    minPrice: 8,
    maxPrice: 18,
    trend: 'stable',
    trendPercent: 0,
    lastUpdated: '2026-04-02 06:30',
    bestMarket: '花園街街市',
  },
  {
    item: '瘦豬肉',
    unit: '斤',
    avgPrice: 55,
    minPrice: 48,
    maxPrice: 68,
    trend: 'down',
    trendPercent: -3.2,
    lastUpdated: '2026-04-02 06:30',
    bestMarket: '大成街市',
  },
  {
    item: '急凍蝦仁',
    unit: '斤',
    avgPrice: 68,
    minPrice: 55,
    maxPrice: 88,
    trend: 'up',
    trendPercent: 8.5,
    lastUpdated: '2026-04-02 06:30',
    bestMarket: '鯉魚門街市',
  },
  {
    item: '鮮牛肉',
    unit: '斤',
    avgPrice: 148,
    minPrice: 128,
    maxPrice: 178,
    trend: 'stable',
    trendPercent: 0,
    lastUpdated: '2026-04-02 06:30',
    bestMarket: '北河街街市',
  },
  {
    item: '雞蛋',
    unit: '打',
    avgPrice: 28,
    minPrice: 22,
    maxPrice: 38,
    trend: 'down',
    trendPercent: -2.1,
    lastUpdated: '2026-04-02 06:30',
    bestMarket: '元朗街市',
  },
  {
    item: '鯇魚',
    unit: '斤',
    avgPrice: 38,
    minPrice: 28,
    maxPrice: 52,
    trend: 'up',
    trendPercent: 4.8,
    lastUpdated: '2026-04-02 06:30',
    bestMarket: '大埔墟街市',
  },
  {
    item: '豆腐',
    unit: '塊',
    avgPrice: 6,
    minPrice: 4,
    maxPrice: 10,
    trend: 'stable',
    trendPercent: 0,
    lastUpdated: '2026-04-02 06:30',
    bestMarket: '牛頭角街市',
  },
];

// Category colors and icons
export const MARKET_TYPE_CONFIG = {
  wet: { icon: '🥬', color: '#4ADE80', label: '濕貨市場' },
  cooked: { icon: '🍜', color: '#FF6B35', label: '熟食中心' },
  flea: { icon: '🛒', color: '#FFD93D', label: '墟市' },
  flower: { icon: '💐', color: '#FF69B4', label: '花園街市' },
  bird: { icon: '🐦', color: '#8E258D', label: '雀鳥花園' },
};

// District grouping
export const DISTRICTS = [
  '中西區', '灣仔區', '東區', '南區',
  '九龍城區', '觀塘區', '深水埗區', '黃大仙區', '油尖旺區',
  '北區', '大埔區', '沙田區', '西貢區', '屯門區', '元朗區', '荃灣區', '葵青區', '離島區'
];

// Get markets by district
export const getMarketsByDistrict = (district: string): Market[] => {
  return HONG_KONG_WET_MARKETS.filter(m => m.district === district);
};

// Get market by ID
export const getMarketById = (id: string): Market | undefined => {
  return HONG_KONG_WET_MARKETS.find(m => m.id === id);
};

// Get upcoming events
export const getUpcomingEvents = (days: number = 30): MarketEvent[] => {
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  return MARKET_EVENTS.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= now && eventDate <= future;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Format price
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(0)}`;
};

// Format trend
export const formatTrend = (trend: 'up' | 'down' | 'stable', percent: number): string => {
  if (trend === 'up') return `↑ ${percent}%`;
  if (trend === 'down') return `↓ ${Math.abs(percent)}%`;
  return '→';
};
