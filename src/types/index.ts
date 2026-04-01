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

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: 'general' | 'food' | 'transport' | 'investment' | 'lifestyle';
  createdAt: Date;
  likes: number;
  comments: ForumComment[];
  isPinned: boolean;
  isAI?: boolean;
}

export interface ForumComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  likes: number;
}
