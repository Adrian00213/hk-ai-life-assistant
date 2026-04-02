// Hong Kong News & Information API
// Aggregates news from various Hong Kong sources

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  category: 'local' | 'finance' | 'international' | 'property' | 'ipo' | 'lifestyle';
  summary: string;
  imageUrl?: string;
  isHot?: boolean;
}

export interface PropertyTransaction {
  address: string;
  price: number;
  size: number;
  pricePerSqft: number;
  date: string;
  district: string;
}

export interface IPOItem {
  name: string;
  code: string;
  listingDate: string;
  priceRange: string;
  minLot: number;
  highlight: string;
  status: 'Upcoming' | 'Open' | 'Closed' | 'Listed';
}

// Fetch Hong Kong local news
export const fetchHKNews = async (): Promise<NewsItem[]> => {
  // In production, would use news API like News API or custom scraper
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: '港鐵東鐵線新訊號系統全面啟用 班次更加密',
      source: '香港01',
      publishedAt: '2小時前',
      category: 'local',
      summary: '港鐵宣佈東鐵線新訊號系統已完成更新，繁忙時段班次加密至2分鐘一班...',
      isHot: true,
    },
    {
      id: '2',
      title: '金管局：美國減息預期降溫 本港樓市平穩',
      source: '信報',
      publishedAt: '3小時前',
      category: 'finance',
      summary: '美國聯儲局官員言論顯示減息時間可能延後，本港銀行同業拆息略微上升...',
    },
    {
      id: '3',
      title: '天文台預測週末有雨 清明時節雨紛紛',
      source: 'NOW新聞',
      publishedAt: '4小時前',
      category: 'local',
      summary: '一道低壓槽正影響華南沿岸，預計週末期間香港有幾陣驟雨...',
    },
    {
      id: '4',
      title: '旅發局推「香港夜繽紛」吸旅客 冀帶動夜經濟',
      source: '經濟日報',
      publishedAt: '5小時前',
      category: 'lifestyle',
      summary: '旅發局推出新一輪「香港夜繽紛」活動，包括廟街夜市、維港燈光匯演...',
    },
    {
      id: '5',
      title: '啟德新樓盤超購40倍 首批單位即日近乎沽清',
      source: '明報',
      publishedAt: '6小時前',
      category: 'property',
      summary: '啟德區再有新盤推出首批156伙，收票超購40倍，平均成交呎價約2.3萬...',
      isHot: true,
    },
    {
      id: '6',
      title: '菜鳥物流IPO集資50億 估值逾500億',
      source: '蘋果日報',
      publishedAt: '7小時前',
      category: 'ipo',
      summary: '阿里巴巴旗下菜鳥網絡物流擬在本港上市，預計集資約50億元...',
    },
    {
      id: '7',
      title: '中學文憑試明日放榜 逾1.7萬考生達大學門檻',
      source: '星島日報',
      publishedAt: '8小時前',
      category: 'local',
      summary: '今年文憑試考生整體表現平稳，約1.7萬人符合大學入學要求...',
    },
    {
      id: '8',
      title: 'Tesla Model 3降至30萬有找 電車大戰升溫',
      source: '香港經濟日報',
      publishedAt: '9小時前',
      category: 'lifestyle',
      summary: '代理決定减價求客，Tesla Model 3低配版售價首次跌穿30萬...',
      isHot: true,
    },
  ];
  
  return mockNews;
};

// Fetch recent property transactions
export const fetchPropertyTransactions = async (): Promise<PropertyTransaction[]> => {
  const mockTransactions: PropertyTransaction[] = [
    {
      address: '太古城金山閣A座高層',
      price: 12800000,
      size: 845,
      pricePerSqft: 15148,
      date: '2026-04-01',
      district: '鰂魚涌',
    },
    {
      address: '日出康城領都第5期B座',
      price: 8900000,
      size: 680,
      pricePerSqft: 13088,
      date: '2026-03-31',
      district: '將軍澳',
    },
    {
      address: '沙田第一城49座中層',
      price: 6200000,
      size: 396,
      pricePerSqft: 15657,
      date: '2026-03-30',
      district: '沙田',
    },
    {
      address: '美孚新邨3期B座',
      price: 7800000,
      size: 560,
      pricePerSqft: 13929,
      date: '2026-03-29',
      district: '荔枝角',
    },
    {
      address: '紅磡黃埔花園3期',
      price: 15200000,
      size: 920,
      pricePerSqft: 16522,
      date: '2026-03-28',
      district: '紅磡',
    },
  ];
  
  return mockTransactions;
};

// Fetch upcoming IPOs
export const fetchUpcomingIPOs = async (): Promise<IPOItem[]> => {
  const mockIPOs: IPOItem[] = [
    {
      name: '菜鳥網絡',
      code: '2619',
      listingDate: '2026-04-15',
      priceRange: 'HK$8.50-10.20',
      minLot: 500,
      highlight: '阿里巴巴旗下智慧物流平台',
      status: 'Open',
    },
    {
      name: '麥當勞香港',
      code: 'TBD',
      listingDate: '2026-04-22',
      priceRange: 'HK$25.00-30.00',
      minLot: 100,
      highlight: '本地快餐龍頭品牌',
      status: 'Upcoming',
    },
    {
      name: '商湯科技',
      code: '0020',
      listingDate: '2026-04-08',
      priceRange: 'HK$3.80-4.50',
      minLot: 1000,
      highlight: 'AI人工智能龍頭',
      status: 'Closed',
    },
  ];
  
  return mockIPOs;
};

// Format price with HK$ prefix
export const formatHKPrice = (price: number): string => {
  if (price >= 10000000) {
    return `HK$${(price / 10000000).toFixed(1)}億`;
  }
  if (price >= 10000) {
    return `HK$${(price / 10000).toFixed(0)}萬`;
  }
  return `HK$${price.toLocaleString()}`;
};

// Format size
export const formatSize = (sqft: number): string => {
  return `${sqft}呎`;
};
