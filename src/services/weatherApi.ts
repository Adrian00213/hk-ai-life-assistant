// Weather API Service using Open-Meteo (free, no API key required)
import { WeatherData, HourlyForecast } from '../types';

const HONG_KONG_COORDS = {
  latitude: 22.3193,
  longitude: 114.1694,
};

// WMO Weather condition codes mapping
const wmoToCondition = (code: number): 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partlyCloudy' => {
  if (code === 0 || code === 1) return 'sunny';
  if (code === 2 || code === 3) return 'partlyCloudy';
  if (code >= 45 && code <= 48) return 'cloudy'; // Fog
  if (code >= 51 && code <= 67) return 'rainy';
  if (code >= 71 && code <= 77) return 'cloudy'; // Snow
  if (code >= 80 && code <= 82) return 'rainy';
  if (code >= 85 && code <= 86) return 'cloudy'; // Snow showers
  if (code >= 95 && code <= 99) return 'stormy';
  return 'cloudy';
};

const getConditionDescription = (code: number): string => {
  if (code === 0) return '天晴';
  if (code === 1) return '大致天晴';
  if (code === 2) return '局部多雲';
  if (code === 3) return '多雲';
  if (code >= 45 && code <= 48) return '有霧';
  if (code >= 51 && code <= 55) return '毛毛雨';
  if (code >= 56 && code <= 57) return '凍毛雨';
  if (code >= 61 && code <= 65) return '有雨';
  if (code >= 66 && code <= 67) return '凍雨';
  if (code >= 71 && code <= 75) return '有雪';
  if (code === 77) return '有霧/雪';
  if (code >= 80 && code <= 82) return '有驟雨';
  if (code >= 85 && code <= 86) return '有陣雪';
  if (code >= 95 && code <= 99) return '有雷暴';
  return '多雲';
};

export const fetchWeather = async (): Promise<WeatherData> => {
  try {
    const { latitude, longitude } = HONG_KONG_COORDS;
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weather_code,uv_index_max&timezone=Asia/Hong_Kong&forecast_days=1`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const current = data.current;
    const hourly = data.hourly;
    
    // Get next 6 hours forecast
    const now = new Date();
    const currentHour = now.getHours();
    const hourlyForecast: HourlyForecast[] = [];
    
    for (let i = 0; i < 6; i++) {
      const hourIndex = (currentHour + i) % 24;
      hourlyForecast.push({
        hour: i === 0 ? '現在' : `${hourly.time[hourIndex].split('T')[1].substring(0, 5)}`,
        temperature: Math.round(hourly.temperature_2m[hourIndex]),
        condition: wmoToCondition(hourly.weather_code[hourIndex]),
      });
    }
    
    // AQI estimation based on weather conditions (simplified)
    // Real AQI would require a separate API like WAQI
    let aqi = 35; // Default "good"
    if (current.relative_humidity_2m > 85) aqi = 55; // Humid = worse
    if (wmoToCondition(current.weather_code) === 'rainy') aqi = 45;
    if (wmoToCondition(current.weather_code) === 'stormy') aqi = 65;
    
    return {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: Math.round(current.relative_humidity_2m),
      uvIndex: Math.round((data.daily?.uv_index_max?.[0] || 0) * 10) / 10,
      condition: wmoToCondition(current.weather_code),
      description: getConditionDescription(current.weather_code),
      aqi,
      hourlyForecast,
      dressingAdvice: getDressingAdvice(Math.round(current.temperature_2m), Math.round(current.relative_humidity_2m)),
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    // Return mock data if API fails
    return getMockWeather();
  }
};

const getDressingAdvice = (temp: number, humidity: number): string => {
  if (temp < 10) return '大褸/羽絨+保暖內層';
  if (temp < 15) return '外套/大褸';
  if (temp < 20) return '長袖外套/薄外套';
  if (temp < 25) return '短袖/薄長袖';
  if (temp < 30) return '清涼衣物/短袖';
  return '透氣衣物/背心';
};

const getMockWeather = (): WeatherData => ({
  temperature: 24,
  feelsLike: 26,
  humidity: 75,
  uvIndex: 6,
  condition: 'partlyCloudy',
  description: '局部多雲',
  aqi: 42,
  hourlyForecast: [
    { hour: '現在', temperature: 24, condition: 'partlyCloudy' },
    { hour: '14:00', temperature: 25, condition: 'sunny' },
    { hour: '15:00', temperature: 26, condition: 'sunny' },
    { hour: '16:00', temperature: 25, condition: 'cloudy' },
    { hour: '17:00', temperature: 24, condition: 'cloudy' },
    { hour: '18:00', temperature: 23, condition: 'cloudy' },
  ],
  dressingAdvice: '長袖外套',
});

export const getAirQualityAdvice = (aqi: number): string => {
  if (aqi <= 25) return '✅ 空氣質量極佳';
  if (aqi <= 50) return '✅ 空氣質量良好';
  if (aqi <= 75) return '⚠️ 空氣質量一般，敏感人士注意';
  if (aqi <= 100) return '⚠️ 空氣質量欠佳，長時間戶外活動請留意';
  return '❌ 空氣污染嚴重，避免戶外活動';
};
