// Transport API Service for Hong Kong MTR
import { TransportRoute } from '../types';

// MTR Line Colors
export const MTR_LINE_COLORS: Record<string, string> = {
  'TWL': '#BA0C2F',  // Tsuen Wan Line
  'ISL': '#007A3D',  // Island Line
  'KTL': '#8E258D',  // Kwun Tong Line
  'WRL': '#6ABFE4',  // Tung Chung Line
  'TCL': '#6ABFE4',  // Same as WRL for airport
  'ERL': '#B0B0B0',  // Airport Express
  'DRL': '#FBCD09',  // Disneyland Resort Line
  'DTL': '#6B3E8B',  // Downtown Line
  'SIL': '#CBD29B',  // South Island Line
  'AEL': '#B0B0B0',  // Airport Express (same as ERL)
  'HEI': '#00B0A0',  // East Rail Line (formerly KCR)
  'WKW': '#00B0A0',  // West Rail Line (formerly KCR)
  'TMK': '#00B0A0',  // Tuen Ma Line
};

// MTR Station codes mapping
const STATION_CODES: Record<string, string> = {
  '中環': 'CEN',
  '金鐘': 'ADM',
  '尖沙咀': 'TST',
  '旺角': 'MONG',
  '太子': 'PRINCE',
  '九龍塘': 'KOWS',
  '觀塘': 'KTW',
  '調景嶺': 'TKL',
  '黃埔': 'WHT',
  '荃灣': 'TSW',
  '葵芳': 'KWH',
  '荔景': 'LKT',
  '北角': 'NHB',
  '天后': 'TIH',
  '銅鑼灣': 'CWB',
  '灣仔': 'WAC',
  '香港': 'HOK',
  '東涌': 'TUC',
  '迪士尼': 'DIS',
  '機場': 'AIR',
};

// MTR Open API base URL (if available)
// Note: MTR's real API requires registration. This is a mock for demo purposes.
const MTR_API_BASE = 'https://api.mtr.com.hk';

// Fallback to mock data when API is not available
export const fetchMTRArrival = async (
  stationCode: string,
  lineCode: string
): Promise<{ next: number; second: number } | null> => {
  try {
    // Try MTR Open API (would need API key in production)
    // For now, return mock data based on time of day
    return getMockMTRArrival(lineCode);
  } catch (error) {
    console.error('MTR API error:', error);
    return getMockMTRArrival(lineCode);
  }
};

const getMockMTRArrival = (lineCode: string): { next: number; second: number } => {
  // Generate realistic mock data based on time
  const now = new Date();
  const minutes = now.getMinutes();
  
  // Simulate different frequencies for different lines
  const baseInterval = lineCode === 'DRL' || lineCode === 'AEL' ? 10 : 3;
  
  const next = (baseInterval + (minutes % baseInterval));
  const second = next + baseInterval + (minutes % 2);
  
  return {
    next: Math.max(1, next % 10),
    second: Math.max(2, second % 15),
  };
};

// Get all saved routes with real-time data
export const refreshRoutes = async (routes: TransportRoute[]): Promise<TransportRoute[]> => {
  const updatedRoutes: TransportRoute[] = [];
  
  for (const route of routes) {
    if (route.line === 'mtr') {
      const arrival = await fetchMTRArrival(
        STATION_CODES[route.origin] || route.origin,
        route.lineName?.split('線')[0] || 'TWL'
      );
      
      if (arrival) {
        updatedRoutes.push({
          ...route,
          nextArrival: arrival.next,
          secondArrival: arrival.second,
        });
      } else {
        updatedRoutes.push(route);
      }
    } else {
      updatedRoutes.push(route);
    }
  }
  
  return updatedRoutes;
};

// Bus route estimation (using data.gov.hk API)
export const fetchBusArrival = async (
  routeNumber: string,
  stopId: string
): Promise<{ next: number; second: number } | null> => {
  try {
    // Hong Kong bus API (data.gov.hk) - simplified for demo
    // Real implementation would use: https://data.gov.hk/en-data/service/hk-tfl-rtbus-arrival
    const mockMinutes = Math.floor(Math.random() * 10) + 2;
    return {
      next: mockMinutes,
      second: mockMinutes + Math.floor(Math.random() * 8) + 3,
    };
  } catch (error) {
    console.error('Bus API error:', error);
    return null;
  }
};

// Popular route presets for Hong Kong
export const POPULAR_ROUTES = [
  { from: '中環', to: '尖沙咀', line: 'TWL', lineName: '荃灣線' },
  { from: '旺角', to: '中環', line: 'TWL', lineName: '荃灣線' },
  { from: '觀塘', to: '香港', line: 'KTL', lineName: '觀塘線' },
  { from: '將軍澳', to: '油塘', line: 'KTL', lineName: '觀塘線' },
  { from: '沙田', to: '中環', line: 'HEI', lineName: '東鐵線' },
  { from: '東涌', to: '香港', line: 'WRL', lineName: '東涌線' },
  { from: '迪士尼', to: '欣澳', line: 'DRL', lineName: '迪士尼線' },
  { from: '機場', to: '香港', line: 'AEL', lineName: '機場快線' },
];

export const getLineColor = (lineCode: string): string => {
  return MTR_LINE_COLORS[lineCode] || '#FF6B35';
};
