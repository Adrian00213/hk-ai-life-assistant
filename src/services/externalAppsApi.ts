// External App Links Service for Hong Kong
// Uses deep links and app store links to open native apps

export interface ServiceApp {
  id: string;
  name: string;
  nameCn: string;
  category: 'food' | 'taxi' | 'delivery';
  icon: string;
  color: string;
  description: string;
  // Deep link schemes
  iosScheme?: string;
  androidScheme?: string;
  // Web fallback
  webUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  // For web, we detect if app is installed
  isInstalled?: boolean;
}

export const FOOD_APPS: ServiceApp[] = [
  {
    id: 'foodpanda',
    name: 'Foodpanda',
    nameCn: '熊貓外賣',
    category: 'food',
    icon: '🐼',
    color: '#D4163C',
    description: '全港最大外賣平台，覆蓋廣泛',
    iosScheme: 'foodpanda://',
    androidScheme: 'com.foodpanda.foodpanda://',
    webUrl: 'https://www.foodpanda.hk',
    appStoreUrl: 'https://apps.apple.com/hk/app/foodpanda/id874283124',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.foodpanda.foodpanda',
  },
  {
    id: 'deliveroo',
    name: 'Deliveroo',
    nameCn: '戶戶送',
    category: 'food',
    icon: '🟠',
    color: '#FF4B00',
    description: '優質餐廳外賣，速遞快速',
    iosScheme: 'deliveroo://',
    androidScheme: 'com.deliveroo.app://',
    webUrl: 'https://deliveroo.hk',
    appStoreUrl: 'https://apps.apple.com/hk/app/deliveroo/id1063070981',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.deliveroo.app',
  },
  {
    id: 'keeta',
    name: 'Keeta',
    nameCn: 'KeeTa',
    category: 'food',
    icon: '🟣',
    color: '#7B2FF7',
    description: '美團旗下新力軍，優惠多多',
    iosScheme: 'keeta://',
    androidScheme: 'com.meituan.keeta://',
    webUrl: 'https://www.keeta.com.hk',
    appStoreUrl: 'https://apps.apple.com/hk/app/keeta/id1438827715',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.meituan.keeta',
  },
  {
    id: 'ubereats',
    name: 'Uber Eats',
    nameCn: 'Uber Eats',
    category: 'food',
    icon: '🔴',
    color: '#06C167',
    description: '全球最大外賣平台之一',
    iosScheme: 'ubereats://',
    androidScheme: 'com.ubercab.eats://',
    webUrl: 'https://www.ubereats.com/hk',
    appStoreUrl: 'https://apps.apple.com/hk/app/uber-eats-food-delivery/id1208951005',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ubercab.eats',
  },
];

export const TAXI_APPS: ServiceApp[] = [
  {
    id: 'uber',
    name: 'Uber',
    nameCn: 'Uber',
    category: 'taxi',
    icon: '🚗',
    color: '#000000',
    description: ' Premium 轎車服務，舒適快捷',
    iosScheme: 'uber://',
    androidScheme: 'com.ubercab://',
    webUrl: 'https://www.uber.com/hk/',
    appStoreUrl: 'https://apps.apple.com/hk/app/uber/id1229982708',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ubercab',
  },
  {
    id: 'hktaxi',
    name: 'HKTaxi',
    nameCn: '香港的士',
    category: 'taxi',
    icon: '🚕',
    color: '#FFD700',
    description: '本港最大的士App，線上叫車',
    iosScheme: 'hktaxi://',
    androidScheme: 'com.hktaxi.app://',
    webUrl: 'https://www.hktaxi.com',
    appStoreUrl: 'https://apps.apple.com/hk/app/hktaxi/id370810149',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.hktaxi.app',
  },
  {
    id: 'lalamove',
    name: 'Lalamove',
    nameCn: '啦啦快送',
    category: 'taxi',
    icon: '📦',
    color: '#FF6B35',
    description: '送貨/件/凍櫃，即時送達',
    iosScheme: 'lalamove://',
    androidScheme: 'com.lalamove.app://',
    webUrl: 'https://www.lalamove.com/hk',
    appStoreUrl: 'https://apps.apple.com/hk/app/lalamove/id1199424430',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lalamove.app',
  },
  {
    id: 'gogovan',
    name: 'GOGOVAN',
    nameCn: 'GOGOVAN',
    category: 'delivery',
    icon: '🚚',
    color: '#00B5E2',
    description: '多元化送貨服務，Call Van 就搵佢',
    iosScheme: 'gogovan://',
    androidScheme: 'com.gogovan.app://',
    webUrl: 'https://www.gogovan.com.hk',
    appStoreUrl: 'https://apps.apple.com/hk/app/gogovan/id1031890025',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.gogovan.app',
  },
];

// Open an app or fallback to web
export const openApp = async (app: ServiceApp): Promise<boolean> => {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  const scheme = isIOS ? app.iosScheme : (isAndroid ? app.androidScheme : null);
  
  if (scheme) {
    try {
      // Try to open the app
      window.location.href = scheme;
      return true;
    } catch (e) {
      console.log('Could not open app via scheme');
    }
  }
  
  // Fallback to web
  if (app.webUrl) {
    window.open(app.webUrl, '_blank');
    return true;
  }
  
  return false;
};

// Get all apps
export const getAllApps = (): ServiceApp[] => {
  return [...FOOD_APPS, ...TAXI_APPS];
};
