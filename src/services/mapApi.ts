// Map & Location Service using Leaflet/OpenStreetMap (free)
export interface MapLocation {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
}

export interface SearchResult {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  distance?: string;
  phone?: string;
  openingHours?: string;
}

// Hong Kong center coordinates
export const HK_CENTER: MapLocation = {
  lat: 22.3193,
  lng: 114.1694,
  name: '香港'
};

// Mock search results for Hong Kong
export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: '1',
    name: '翠華餐廳',
    category: '餐廳',
    address: '中環威靈頓街24號',
    lat: 22.2828,
    lng: 114.1578,
    rating: 4.2,
    distance: '0.3km',
    phone: '2522 1822',
    openingHours: '24小時',
  },
  {
    id: '2',
    name: '惠康超級廣場',
    category: '超市',
    address: '中環皇后大道中99號',
    lat: 22.2815,
    lng: 114.1567,
    rating: 4.0,
    distance: '0.5km',
    phone: '2841 0288',
  },
  {
    id: '3',
    name: '7-Eleven',
    category: '便利店',
    address: '中環畢打街1號',
    lat: 22.2820,
    lng: 114.1570,
    rating: 4.3,
    distance: '0.2km',
    openingHours: '24小時',
  },
  {
    id: '4',
    name: '屈臣氏',
    category: '藥房',
    address: '中環皇后大道中68號',
    lat: 22.2810,
    lng: 114.1560,
    rating: 4.1,
    distance: '0.6km',
    phone: '2522 1234',
  },
  {
    id: '5',
    name: '麥當勞',
    category: '快餐',
    address: '中環干諾道中17-18號',
    lat: 22.2835,
    lng: 114.1585,
    rating: 4.0,
    distance: '0.4km',
    openingHours: '24小時',
  },
  {
    id: '6',
    name: '港鐵中環站',
    category: '交通',
    address: '中環港鐵站',
    lat: 22.2819,
    lng: 114.1573,
    distance: '0.1km',
    openingHours: '05:55-00:48',
  },
  {
    id: '7',
    name: '中國銀行(香港)',
    category: '銀行',
    address: '中環花園道1號',
    lat: 22.2805,
    lng: 114.1555,
    rating: 4.2,
    distance: '0.8km',
    phone: '2822 6228',
  },
  {
    id: '8',
    name: '廁所',
    category: '設施',
    address: '中環天星碼頭',
    lat: 22.2840,
    lng: 114.1590,
    distance: '0.5km',
  },
  {
    id: '9',
    name: '星巴克',
    category: '咖啡',
    address: '中環畢打街12號',
    lat: 22.2822,
    lng: 114.1575,
    rating: 4.4,
    distance: '0.2km',
    openingHours: '06:30-22:00',
  },
  {
    id: '10',
    name: '大家樂',
    category: '餐廳',
    address: '中環干諾道中48號',
    lat: 22.2838,
    lng: 114.1592,
    rating: 3.9,
    distance: '0.4km',
    openingHours: '07:00-23:00',
  },
];

// Categories for filtering
export const SEARCH_CATEGORIES = [
  { key: 'all', label: '全部', emoji: '🔍' },
  { key: '餐廳', label: '餐廳', emoji: '🍜' },
  { key: '超市', label: '超市', emoji: '🛒' },
  { key: '便利店', label: '便利店', emoji: '🏪' },
  { key: '交通', label: '交通', emoji: '🚇' },
  { key: '銀行', label: '銀行', emoji: '🏦' },
  { key: '咖啡', label: '咖啡', emoji: '☕' },
  { key: '設施', label: '廁所', emoji: '🚻' },
];

// Get search results by category
export const searchByCategory = (category: string): SearchResult[] => {
  if (category === 'all') return MOCK_SEARCH_RESULTS;
  return MOCK_SEARCH_RESULTS.filter(r => r.category === category);
};

// Search by query
export const searchByQuery = (query: string): SearchResult[] => {
  const lowerQuery = query.toLowerCase();
  return MOCK_SEARCH_RESULTS.filter(
    r => r.name.toLowerCase().includes(lowerQuery) ||
         r.category.toLowerCase().includes(lowerQuery) ||
         r.address.toLowerCase().includes(lowerQuery)
  );
};

// Get nearby places (mock)
export const getNearbyPlaces = (lat: number, lng: number, radius: number = 1): SearchResult[] => {
  return MOCK_SEARCH_RESULTS.filter(r => {
    const distance = calculateDistance(lat, lng, r.lat, r.lng);
    return distance <= radius;
  });
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Format distance
export const formatDistance = (km: number): string => {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
};
