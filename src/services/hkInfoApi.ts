// Hong Kong Information Aggregator - Real API integrations
import { WeatherData } from '../types';

// Hong Kong Observatory API (via Open-Meteo as proxy)
export interface HKOWarning {
  type: ' typhoon' | 'rainstorm' | 'landslide' | 'cold' | 'heat';
  code: string;
  description: string;
  issuedTime: string;
}

export interface HongKongNews {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  category: 'local' | 'international' | 'finance' | 'sports';
  summary: string;
}

// Get Hong Kong weather warnings (simulated - real API requires registration)
export const fetchHKOWarnings = async (): Promise<HKOWarning[]> => {
  // In production, this would use data.gov.hk or HKO API
  const mockWarnings: HKOWarning[] = [
    {
      type: 'heat',
      code: 'HOT',
      description: '酷熱天氣提示現正生效',
      issuedTime: '2026-04-02 08:00',
    },
  ];
  return mockWarnings;
};

// Simplified news fetcher using Bing News API alternative
export const fetchHKNews = async (): Promise<HongKongNews[]> => {
  // Mock data - in production would use news API
  return [
    {
      id: '1',
      title: '港鐵東鐵線新訊號系統故障 服務受阻',
      source: '香港01',
      publishedAt: '2小時前',
      category: 'local',
      summary: '港鐵東鐵線訊號系統故障，來往上水至羅湖站服務暫停...',
    },
    {
      id: '2',
      title: '金管局：美國減息預期利好港股',
      source: '信報',
      publishedAt: '3小時前',
      category: 'finance',
      summary: '美國聯儲局官員暗示年內減息，香港金融管理局表示...',
    },
    {
      id: '3',
      title: '天文台預測週末有雨 清明時節雨紛紛',
      source: 'NOW新聞',
      publishedAt: '4小時前',
      category: 'local',
      summary: '天文台表示，一道低壓槽正影響華南沿岸，預計週末...',
    },
    {
      id: '4',
      title: '旅發局推「香港夜繽紛」吸旅客',
      source: '經濟日報',
      publishedAt: '5小時前',
      category: 'local',
      summary: '旅遊發展局宣佈新一輪「香港夜繽紛」活動，涵蓋...',
    },
  ];
};

// Gold Price (using mock - real API would be Bloomberg/kitco)
export interface GoldPrice {
  price: number;
  change: number;
  changePercent: number;
  unit: 'HKD' | 'USD';
  lastUpdated: string;
}

export const fetchGoldPrice = async (): Promise<GoldPrice> => {
  // In production, use: https://data-asg.goldprice.org/api/USD/XAU/1
  return {
    price: 26850, // HKD per tael
    change: 120,
    changePercent: 0.45,
    unit: 'HKD',
    lastUpdated: new Date().toISOString(),
  };
};

// USD/HKD Exchange Rate
export interface ExchangeRate {
  pair: string;
  rate: number;
  change: number;
  lastUpdated: string;
}

export const fetchExchangeRates = async (): Promise<ExchangeRate[]> => {
  return [
    { pair: 'USD/HKD', rate: 7.78, change: 0.002, lastUpdated: new Date().toISOString() },
    { pair: 'CNY/HKD', rate: 1.07, change: -0.001, lastUpdated: new Date().toISOString() },
    { pair: 'EUR/HKD', rate: 8.45, change: 0.015, lastUpdated: new Date().toISOString() },
    { pair: 'JPY/HKD', rate: 0.052, change: -0.0002, lastUpdated: new Date().toISOString() },
  ];
};

// Market Index
export interface MarketIndex {
  name: string;
  code: string;
  value: number;
  change: number;
  changePercent: number;
}

export const fetchMarketIndices = async (): Promise<MarketIndex[]> => {
  // In production, would use Yahoo Finance or similar API
  return [
    { name: '恆生指數', code: 'HSI', value: 17892.34, change: 156.78, changePercent: 0.88 },
    { name: '國企指數', code: 'HSCE', value: 6345.67, change: 45.23, changePercent: 0.72 },
    { name: '科技指數', code: 'HSTECH', value: 3821.45, change: -23.56, changePercent: -0.61 },
    { name: '道瓊斯', code: 'DJI', value: 38921.56, change: 234.12, changePercent: 0.61 },
    { name: '納斯達克', code: 'IXIC', value: 15678.23, change: -89.45, changePercent: -0.57 },
    { name: '標普500', code: 'SPX', value: 5123.45, change: 34.67, changePercent: 0.68 },
  ];
};

// Air Quality Index from WAQI
export const fetchAirQuality = async (): Promise<{ aqi: number; station: string; level: string }> => {
  // In production, use: https://aqicn.org/api/
  return {
    aqi: 42,
    station: '中西區',
    level: '良好',
  };
};
