// Live Shopping / Flash Deals Service
export interface Product {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  currentPrice: number;
  discount: number; // percentage
  category: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  stock: number;
  isFlashDeal: boolean;
  isLive: boolean;
  streamer: string;
  endsAt?: string;
  tags: string[];
}

export interface FlashDeal {
  id: string;
  product: Product;
  endsAt: string;
  progress: number; // 0-100, percentage sold
  remaining: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Mock live streamers
const STREAMERS = [
  { id: 's1', name: '小楊哥', avatar: '😎', followers: '500萬' },
  { id: 's2', name: '羅永浩', avatar: '🤓', followers: '300萬' },
  { id: 's3', name: '薇婭', avatar: '👩', followers: '800萬' },
  { id: 's4', name: '李佳琦', avatar: '🧑', followers: '600萬' },
];

// Mock products
export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max 256GB',
    description: '蘋果最新旗艦手機，A17 Pro芯片，鈦金屬設計',
    originalPrice: 10999,
    currentPrice: 8999,
    discount: 18,
    category: '電子',
    imageUrl: '',
    rating: 4.9,
    reviews: 2340,
    stock: 50,
    isFlashDeal: true,
    isLive: true,
    streamer: 's1',
    endsAt: '2026-04-02T12:00:00',
    tags: ['iPhone', '蘋果', '旗艦'],
  },
  {
    id: 'p2',
    name: 'SK-II 神仙水 230ml',
    description: '日本原裝SK-II護膚精華水，保濕修護',
    originalPrice: 1599,
    currentPrice: 1199,
    discount: 25,
    category: '美妝',
    imageUrl: '',
    rating: 4.8,
    reviews: 1890,
    stock: 120,
    isFlashDeal: true,
    isLive: true,
    streamer: 's4',
    endsAt: '2026-04-02T14:00:00',
    tags: ['護膚', '神仙水', 'SK-II'],
  },
  {
    id: 'p3',
    name: 'Nike Air Jordan 1 Retro High',
    description: '經典籃球鞋，黑紅配色，限量版',
    originalPrice: 1899,
    currentPrice: 1499,
    discount: 21,
    category: '運動',
    imageUrl: '',
    rating: 4.7,
    reviews: 856,
    stock: 30,
    isFlashDeal: true,
    isLive: false,
    streamer: 's2',
    tags: ['波鞋', 'Nike', 'Jordan'],
  },
  {
    id: 'p4',
    name: '戴森吹風機 Supersonic',
    description: 'Dyson旗艦吹風機，快速乾髮，智能溫控',
    originalPrice: 3399,
    currentPrice: 2599,
    discount: 24,
    category: '美妝',
    imageUrl: '',
    rating: 4.9,
    reviews: 3450,
    stock: 80,
    isFlashDeal: false,
    isLive: true,
    streamer: 's3',
    tags: ['吹風機', 'Dyson', '美髮'],
  },
  {
    id: 'p5',
    name: 'Sony WH-1000XM5 耳機',
    description: 'Sony旗艦降噪耳機，30小時續航',
    originalPrice: 2899,
    currentPrice: 2199,
    discount: 24,
    category: '電子',
    imageUrl: '',
    rating: 4.8,
    reviews: 2100,
    stock: 65,
    isFlashDeal: true,
    isLive: false,
    streamer: 's1',
    endsAt: '2026-04-02T16:00:00',
    tags: ['耳機', 'Sony', '降噪'],
  },
  {
    id: 'p6',
    name: '華為 Mate 60 Pro',
    description: '華為旗艦手機，鴻蒙系統，衛星通話',
    originalPrice: 8999,
    currentPrice: 6999,
    discount: 22,
    category: '電子',
    imageUrl: '',
    rating: 4.7,
    reviews: 1560,
    stock: 40,
    isFlashDeal: true,
    isLive: true,
    streamer: 's2',
    endsAt: '2026-04-02T18:00:00',
    tags: ['華為', 'Mate', '旗艦'],
  },
  {
    id: 'p7',
    name: 'La Mer 精華面霜 60ml',
    description: '海藍之謎經典面霜，修護保濕',
    originalPrice: 2999,
    currentPrice: 2299,
    discount: 23,
    category: '美妝',
    imageUrl: '',
    rating: 4.6,
    reviews: 980,
    stock: 25,
    isFlashDeal: false,
    isLive: false,
    streamer: 's3',
    tags: ['面霜', 'La Mer', '貴婦'],
  },
  {
    id: 'p8',
    name: 'Tesla Model Y 續航版',
    description: '電動SUV，續航500公里，自動駕駛',
    originalPrice: 338000,
    currentPrice: 298000,
    discount: 12,
    category: '汽車',
    imageUrl: '',
    rating: 4.5,
    reviews: 320,
    stock: 5,
    isFlashDeal: true,
    isLive: true,
    streamer: 's1',
    endsAt: '2026-04-02T20:00:00',
    tags: ['Tesla', '電動車', 'SUV'],
  },
];

// Flash deals
export const FLASH_DEALS: FlashDeal[] = PRODUCTS.filter(p => p.isFlashDeal).slice(0, 4).map(p => ({
  id: `fd_${p.id}`,
  product: p,
  endsAt: p.endsAt || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  progress: Math.floor(Math.random() * 80) + 10,
  remaining: p.stock,
}));

// Categories
export const CATEGORIES = [
  { key: 'all', label: '全部', emoji: '✨' },
  { key: '電子', label: '電子產品', emoji: '📱' },
  { key: '美妝', label: '美妝護理', emoji: '💄' },
  { key: '運動', label: '運動戶外', emoji: '🏃' },
  { key: '家居', label: '家居生活', emoji: '🏠' },
  { key: '食品', label: '美食保健', emoji: '🍜' },
];

// Live streamers
export const LIVE_STREAMERS = STREAMERS;

// Get streamer info
export const getStreamer = (id: string) => STREAMERS.find(s => s.id === id);

// Get products by category
export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
};

// Get live products
export const getLiveProducts = (): Product[] => {
  return PRODUCTS.filter(p => p.isLive);
};

// Get flash deal products
export const getFlashDealProducts = (): Product[] => {
  return PRODUCTS.filter(p => p.isFlashDeal);
};

// Calculate time remaining
export const getTimeRemaining = (endsAt: string): { hours: number; minutes: number; seconds: number } => {
  const end = new Date(endsAt).getTime();
  const now = Date.now();
  const diff = Math.max(0, end - now);
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
};

// Format price
export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString()}`;
};

// Calculate savings
export const calculateSavings = (original: number, current: number): number => {
  return original - current;
};
