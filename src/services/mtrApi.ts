// Hong Kong MTR Real-Time API Service
// Using data.gov.hk / rt.data.gov.hk Open Data API
// No API key required - free for public use

import { TransportRoute } from '../types';

// MTR Line Codes mapping
export const MTR_LINE_CODES: Record<string, { name: string; color: string; code: string }> = {
  'TWL': { name: '荃灣線', color: '#BA0C2F', code: 'TWL' },
  'ISL': { name: '港島線', color: '#007A3D', code: 'ISL' },
  'KTL': { name: '觀塘線', color: '#8E258D', code: 'KTL' },
  'WRL': { name: '東涌線', color: '#6ABFE4', code: 'WRL' },
  'TCL': { name: '機場快線', color: '#B0B0B0', code: 'TCL' },
  'ERL': { name: '東鐵線', color: '#00B0A0', code: 'ERL' },
  'DRL': { name: '迪士尼線', color: '#FBCD09', code: 'DRL' },
  'SIL': { name: '南港島線', color: '#CBD29B', code: 'SIL' },
  'TKL': { name: '將軍澳線', color: '#8E258D', code: 'TKL' },
  'AEL': { name: '機場快線', color: '#B0B0B0', code: 'AEL' },
  'TML': { name: '屯馬線', color: '#00B0A0', code: 'TML' },
};

// Station codes (used in API)
// Format: LINE-STATION (e.g., TWL-CEN for Tsuen Wan Line at Central)
export const MTR_STATIONS: Record<string, Record<string, string>> = {
  'TWL': {
    'CEN': '中環', 'ADM': '金鐘', 'TST': '尖沙咀', 'PRINCE': '太子', 
    'MONG': '旺角', 'SHAMSHUIPO': '深水埗', 'KOWLOON': '九龍', 
    'OMAK': '奧運', 'KOWLOON_TONG': '九龍塘', 'WONG_TAI_SIN': '黃大仙',
    'DIAMOND_HILL': '鑽石山', 'CHOI_HUNG': '彩虹', 'KOWLOON_BAY': '九龍灣',
    'NGGTAU': '牛頭角', 'KWUN_TONG': '觀塘', 'YAU_TONG': '油塘',
    'TIU_KENG_LENG': '調景嶺', 'TSW': '荃灣', 'KWH': '葵芳',
    'LAI_CHI_KOK': '荔景', 'CHEUNG_SHA_WAN': '長沙灣', 'SHAU_KEI_WAN': '筲箕灣',
    'TAI_KOO': '太古', 'QUARRY_BAY': '鰂魚涌', 'FORTress_HILL': '北角',
    'NORTH_POINT': '天后', 'CAUSEWAY_BAY': '銅鑼灣', 'WAN_CHAI': '灣仔', 'HOK': '香港'
  },
  'ISL': {
    'HOK': '香港', 'WAN_CHAI': '灣仔', 'CAUSEWAY_BAY': '銅鑼灣', 'NORTH_POINT': '北角',
    'TAI_KOO': '太古', 'QUARRY_BAY': '鰂魚涌', 'SHAU_KEI_WAN': '筲箕灣',
    'TIU_KENG_LENG': '調景嶺', 'SOUTH_HORIZONS': '海怡半島', 'LEI_TUNG': '利東',
    'AP_LEI_CHAU': '鴨脷洲'
  },
  'KTL': {
    'WHAMPOA': '黃埔', 'HUNG_HOM': '紅磡', 'MONG': '旺角', 'PRINCE': '太子',
    'KOWLOON_TONG': '九龍塘', 'WONG_TAI_SIN': '黃大仙', 'DIAMOND_HILL': '鑽石山',
    'CHOI_HUNG': '彩虹', 'KOWLOON_BAY': '九龍灣', 'NGGTAU': '牛頭角',
    'KWUN_TONG': '觀塘', 'YAU_TONG': '油塘', 'TKL': '調景嶺'
  },
  'WRL': {
    'HOK': '香港', 'KOWLOON': '九龍', 'OMAK': '奧運', 'PRINCE': '太子',
    'MONG': '旺角', 'KOWLOON_TONG': '九龍塘', 'DIAMOND_HILL': '鑽石山',
    'TSEUNG_KWAN_O': '將軍澳', 'TUNG_CHUNG': '東涌', 'SUNNY_BAY': '欣澳'
  },
  'ERL': {
    'HOK': '香港', 'WAC': '灣仔', 'HUNGHOM': '紅磡', 'SHATIN': '沙田',
    'FO_TAN': '火炭', 'RACE_COURSE': '馬場', 'UNIVERSITY': '大學',
    'TAIPO_MARKET': '大埔墟', 'LO_WU': '羅湖', 'SHEUNG_SHUI': '上水'
  },
  'TKL': {
    'NORTH_POINT': '北角', 'QUARRY_BAY': '鰂魚涌', 'YAU_TONG': '油塘', 'TSEUNG_KWAN_O': '將軍澳'
  },
  'TML': {
    'Tuen_Ma': '屯門', 'Siu_Hong': '小欖', 'Lam_Tin': '藍地', 'Hung_Fook': '洪水橋',
    'Wellington': '威爾斯親王', 'Cheung_Sha_Wan': '長沙灣', 'Nam_Cheong': '南昌',
    'Kowloon_Tong': '九龍塘', 'Hin_Keng': '顯徑', 'City_One': '第一城',
    'Tin_Ma_Court': '車公廟', 'Sun_Chun': '沙田圍', 'Che_Kung_M': '大圍'
  },
};

interface MTRAPIResponse {
  sys_time: string;
  curr_time: string;
  data: {
    [key: string]: {
      curr_time: string;
      sys_time: string;
      UP?: MTRTrain[];
      DOWN?: MTRTrain[];
    };
  };
  isdelay: string;
  status: number;
  message: string;
}

interface MTRTrain {
  seq: string;
  dest: string;
  plat: string;
  time: string;
  ttnt: string;
  valid: string;
  source: string;
}

// Fetch real MTR arrival times
export const fetchMTRArrival = async (
  lineCode: string,
  stationCode: string
): Promise<{ next: number; second: number; dest: string; direction: string } | null> => {
  try {
    const url = `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${lineCode}&sta=${stationCode}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`MTR API error: ${response.status}`);
    }
    
    const data: MTRAPIResponse = await response.json();
    
    if (data.status !== 1 || !data.data) {
      return null;
    }
    
    const key = `${lineCode}-${stationCode}`;
    const stationData = data.data[key];
    
    if (!stationData) {
      return null;
    }
    
    // Get UP (towards Tsuen Wan/Tuen Ma direction) or DOWN (towards Hong Kong direction)
    const trains = stationData.UP || stationData.DOWN || [];
    
    if (trains.length === 0) {
      return null;
    }
    
    // Find the first valid train
    const validTrains = trains.filter(t => t.valid === 'Y');
    
    if (validTrains.length === 0) {
      return null;
    }
    
    const nextTrain = validTrains[0];
    const secondTrain = validTrains[1];
    
    return {
      next: parseInt(nextTrain.ttnt) || 0,
      second: secondTrain ? parseInt(secondTrain.ttnt) || 0 : 0,
      dest: nextTrain.dest,
      direction: stationData.UP ? 'UP' : 'DOWN',
    };
  } catch (error) {
    console.error('MTR API fetch error:', error);
    return null;
  }
};

// Get station name from code
export const getStationName = (lineCode: string, stationCode: string): string => {
  const lineStations = MTR_STATIONS[lineCode];
  if (!lineStations) return stationCode;
  return lineStations[stationCode] || stationCode;
};

// Get destination station name
export const getDestName = (destCode: string): string => {
  // Common destination mappings
  const destMap: Record<string, string> = {
    'TSW': '荃灣',
    'HOK': '香港',
    'TUC': '東涌',
    'DIS': '迪士尼',
    'AIR': '機場',
    'KOWLOON': '羅湖',
    'LO_WU': '羅湖',
    'Tuen_Ma': '屯門',
    'Central': '中環',
    'Whampoa': '黃埔',
    'Tseung_Kwan_O': '將軍澳',
    'Po_Lam': '寶琳',
    'North_Point': '北角',
    'Chu_Kong': '市中心',
    'Tung_Chung': '東涌',
    'Sunny_Bay': '欣澳',
  };
  
  return destMap[destCode] || destCode;
};

// Popular routes with real station codes
export const POPULAR_MTR_ROUTES = [
  // Tsuen Wan Line
  { line: 'TWL', station: 'CEN', name: '荃灣線', stationName: '中環' },
  { line: 'TWL', station: 'TST', name: '荃灣線', stationName: '尖沙咀' },
  { line: 'TWL', station: 'MONG', name: '荃灣線', stationName: '旺角' },
  { line: 'TWL', station: 'KWH', name: '荃灣線', stationName: '葵芳' },
  { line: 'TWL', station: 'TSW', name: '荃灣線', stationName: '荃灣' },
  // Kwun Tong Line
  { line: 'KTL', station: 'KWUN_TONG', name: '觀塘線', stationName: '觀塘' },
  { line: 'KTL', station: 'CHOI_HUNG', name: '觀塘線', stationName: '彩虹' },
  { line: 'KTL', station: 'MONG', name: '觀塘線', stationName: '旺角' },
  // Island Line
  { line: 'ISL', station: 'HOK', name: '港島線', stationName: '香港' },
  { line: 'ISL', station: 'WAN_CHAI', name: '港島線', stationName: '灣仔' },
  { line: 'ISL', station: 'CAUSEWAY_BAY', name: '港島線', stationName: '銅鑼灣' },
  { line: 'ISL', station: 'TAI_KOO', name: '港島線', stationName: '太古' },
  // Tung Chung Line
  { line: 'WRL', station: 'HOK', name: '東涌線', stationName: '香港' },
  { line: 'WRL', station: 'KOWLOON', name: '東涌線', stationName: '九龍' },
  { line: 'WRL', station: 'TUNG_CHUNG', name: '東涌線', stationName: '東涌' },
  // Tseung Kwan O Line
  { line: 'TKL', station: 'TSEUNG_KWAN_O', name: '將軍澳線', stationName: '將軍澳' },
  { line: 'TKL', station: 'NORTH_POINT', name: '將軍澳線', stationName: '北角' },
  // East Rail Line
  { line: 'ERL', station: 'HOK', name: '東鐵線', stationName: '香港' },
  { line: 'ERL', station: 'KOWLOON', name: '東鐵線', stationName: '九龍' },
  { line: 'ERL', station: 'SHATIN', name: '東鐵線', stationName: '沙田' },
  { line: 'ERL', station: 'UNIVERSITY', name: '東鐵線', stationName: '大學' },
  // Disneyland Resort Line
  { line: 'DRL', station: 'SUNNY_BAY', name: '迪士尼線', stationName: '欣澳' },
  // Airport Express
  { line: 'AEL', station: 'HOK', name: '機場快線', stationName: '香港' },
  { line: 'AEL', station: 'KOWLOON', name: '機場快線', stationName: '九龍' },
  { line: 'AEL', station: 'AIR', name: '機場快線', stationName: '機場' },
  // Tuen Ma Line
  { line: 'TML', station: 'Tuen_Ma', name: '屯馬線', stationName: '屯門' },
  { line: 'TML', station: 'Wellington', name: '屯馬線', stationName: '威爾斯親王' },
  { line: 'TML', station: 'Nam_Cheong', name: '屯馬線', stationName: '南昌' },
];

// Refresh multiple routes with real-time data
export const refreshRoutes = async (
  routes: TransportRoute[]
): Promise<TransportRoute[]> => {
  const updatedRoutes: TransportRoute[] = [];
  
  for (const route of routes) {
    if (route.line === 'mtr') {
      // Extract line code from route.name (e.g., "荃灣線" -> "TWL")
      const lineCode = Object.entries(MTR_LINE_CODES).find(
        ([_, info]) => info.name === route.lineName
      )?.[0];
      
      // Try to find station code from station name
      let stationCode = '';
      for (const [line, stations] of Object.entries(MTR_STATIONS)) {
        for (const [code, name] of Object.entries(stations)) {
          if (name === route.origin || name === route.destination) {
            stationCode = code;
            if (!lineCode || line !== lineCode) continue;
            break;
          }
        }
      }
      
      if (lineCode && stationCode) {
        const arrival = await fetchMTRArrival(lineCode, stationCode);
        if (arrival) {
          updatedRoutes.push({
            ...route,
            nextArrival: arrival.next,
            secondArrival: arrival.second,
            status: arrival.next > 10 ? 'delayed' : 'normal',
          });
          continue;
        }
      }
      updatedRoutes.push(route);
    } else {
      updatedRoutes.push(route);
    }
  }
  
  return updatedRoutes;
};
