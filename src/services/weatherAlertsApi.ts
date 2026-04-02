// Hong Kong Weather Warnings & Typhoon Tracking API
// Data sources: HKO via data.gov.hk (free APIs)

export interface TyphoonTrack {
  name: string;
  code: string;
  status: 'Monitor' | 'Active' | 'Past';
  currentPosition?: {
    lat: number;
    lon: number;
    description: string;
  };
  forecastPoints?: {
    time: string;
    lat: number;
    lon: number;
    strength: 'Tropical Depression' | 'Tropical Storm' | 'Severe Tropical Storm' | 'Typhoon' | 'Severe Typhoon' | 'Super Typhoon';
    windSpeed: number;
  }[];
}

export interface RainWarning {
  type: 'AMBER' | 'RED' | 'BLACK';
  issuedTime: string;
  description: string;
  expiredTime?: string;
  isActive: boolean;
}

export interface HolidayForecast {
  name: string;
  date: string;
  weather: string;
  tempRange: { min: number; max: number };
  recommendation: string;
}

// Fetch current typhoon information
export const fetchTyphoonInfo = async (): Promise<TyphoonTrack | null> => {
  try {
    // In production, use HKO API or data.gov.hk
    // For now, return mock data showing a simulated scenario
    return {
      name: '摩羯',
      code: '202418',
      status: 'Active',
      currentPosition: {
        lat: 21.5,
        lon: 116.8,
        description: '強颱風集結於香港以南約600公里',
      },
      forecastPoints: [
        { time: '2026-04-03 08:00', lat: 20.8, lon: 114.5, strength: 'Typhoon', windSpeed: 145 },
        { time: '2026-04-03 20:00', lat: 20.2, lon: 112.8, strength: 'Severe Typhoon', windSpeed: 155 },
        { time: '2026-04-04 08:00', lat: 19.5, lon: 111.2, strength: 'Typhoon', windSpeed: 140 },
      ],
    };
  } catch (error) {
    console.error('Typhoon fetch error:', error);
    return null;
  }
};

// Fetch rain warning status
export const fetchRainWarning = async (): Promise<RainWarning | null> => {
  try {
    // Mock data - in production would use HKO API
    const mockWarning: RainWarning = {
      type: 'AMBER',
      issuedTime: '2026-04-02 06:30',
      description: '香港廣泛地區已錄得或預料會有持續大雨， 每小時雨量超過30毫米。天文台已發出黃色暴雨警告。',
      isActive: true,
    };
    
    // Simulate no active warning most of the time
    if (Math.random() > 0.3) {
      return null; // No active warning
    }
    return mockWarning;
  } catch (error) {
    console.error('Rain warning fetch error:', error);
    return null;
  }
};

// Fetch extended forecast for holidays
export const fetchHolidayForecasts = async (): Promise<HolidayForecast[]> => {
  // Common Hong Kong holidays
  const holidays: HolidayForecast[] = [
    {
      name: '清明節',
      date: '2026-04-04',
      weather: '大致多雲，有驟雨',
      tempRange: { min: 20, max: 26 },
      recommendation: '帶遮，適合拜山',
    },
    {
      name: '耶穌受難節',
      date: '2026-04-10',
      weather: '天晴乾燥',
      tempRange: { min: 22, max: 29 },
      recommendation: '好天氣，出遊的好日子',
    },
    {
      name: '復活節連假',
      date: '2026-04-11-14',
      weather: '局部地區有雷暴',
      tempRange: { min: 21, max: 27 },
      recommendation: '留意天氣变化，記得帶遮',
    },
    {
      name: '勞動節',
      date: '2026-05-01',
      weather: '大致天晴',
      tempRange: { min: 24, max: 31 },
      recommendation: '陽光普照，防曬要做足',
    },
  ];
  
  return holidays;
};

// Get weather alerts for the day
export const getDailyWeatherAlerts = (weather: any): string[] => {
  const alerts: string[] = [];
  
  if (!weather) return alerts;
  
  if (weather.humidity > 85) {
    alerts.push('💨 回南天警告：濕度偏高，建議關閉窗戶');
  }
  
  if (weather.uvIndex > 7) {
    alerts.push('☀️ 紫外線注意：防曬措施要做足');
  }
  
  if (weather.temperature < 15) {
    alerts.push('🧥 天氣轉涼：建議著多件外套');
  }
  
  if (weather.temperature > 32) {
    alerts.push('🥵 酷熱警告：避免長時間戶外活動');
  }
  
  return alerts;
};
