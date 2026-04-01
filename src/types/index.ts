export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  uvIndex: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partlyCloudy';
  description: string;
  aqi: number;
  hourlyForecast: HourlyForecast[];
  dressingAdvice: string;
}

export interface HourlyForecast {
  hour: string;
  temperature: number;
  condition: string;
}

export interface TransportRoute {
  id: string;
  name: string;
  line: 'mtr' | 'bus' | 'minibus';
  lineName?: string;
  lineColor?: string;
  origin: string;
  destination: string;
  nextArrival: number; // minutes
  secondArrival?: number;
  status: 'normal' | 'delayed' | 'severe';
}

export interface ExplorePlace {
  id: string;
  name: string;
  category: 'food' | 'history' | 'nature' | 'hidden';
  description: string;
  neighborhood: string;
  rating: number;
  imageUrl: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
