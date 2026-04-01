// AI Chat Service - connects to OpenAI or compatible API
import { ChatMessage } from '../types';

// Note: In production, this would use environment variables for API keys
// For demo, we'll use a local response generator with Cantonese responses

interface AIConfig {
  apiKey?: string;
  model: string;
  temperature: number;
}

const DEFAULT_CONFIG: AIConfig = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
};

// Hong Kong specific knowledge base for local responses
const HK_KNOWLEDGE: Record<string, string[]> = {
  weather: ['天氣', '下雨', '潮濕', '溫度', '冷', '熱', '紫外线', '空氣'],
  transport: ['地鐵', 'MTR', '巴士', '小巴', '東涌', '機場', '到站', '多久', '分鐘'],
  food: ['美食', '餐廳', '茶餐廳', '燒味', '雲吞', '魚蛋', '雞蛋仔', '咖喱', '車仔麵'],
  places: ['中環', '旺角', '深水埗', '西貢', '長洲', '南丫島', '大澳', '赤柱'],
  trading: ['股票', '黃金', '期權', '期貨', 'Tesla', '美股', '港股', '止损', '盈利'],
};

export class AIService {
  private config: AIConfig;
  private messageHistory: ChatMessage[] = [];

  constructor(config: Partial<AIConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async sendMessage(userMessage: string): Promise<string> {
    // Add user message to history
    this.messageHistory.push({
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    try {
      // Try to use OpenAI API if key is available
      if (this.config.apiKey) {
        return await this.callOpenAI(userMessage);
      }
      
      // Fall back to local response generator
      return this.generateLocalResponse(userMessage);
    } catch (error) {
      console.error('AI Service error:', error);
      return this.getErrorResponse();
    }
  }

  private async callOpenAI(message: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: `你係「金龍」，一個專業嘅香港AI生活助手。你用廣東話回覆，親切但專業。你專長係黃金交易、股票分析、天氣資訊、交通查詢。你要幫用戶解決日常生活問題。`
          },
          ...this.messageHistory.map(m => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user', content: message },
        ],
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || this.getDefaultResponse();
    
    this.messageHistory.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date(),
    });

    return assistantMessage;
  }

  private generateLocalResponse(message: string): string {
    const lower = message.toLowerCase();
    
    // Weather related
    if (HK_KNOWLEDGE.weather.some(k => lower.includes(k))) {
      return this.getWeatherResponse();
    }
    
    // Transport related
    if (HK_KNOWLEDGE.transport.some(k => lower.includes(k))) {
      return this.getTransportResponse(lower);
    }
    
    // Food related
    if (HK_KNOWLEDGE.food.some(k => lower.includes(k))) {
      return '想搵嘢食？我建議你去「探索」頁面睇下我哋嘅隱世食肆推介！不過如果你喺旺角，我可以介紹你試下朗豪坊對面嘅茶餐廳，叉燒飯好正！🍜';
    }
    
    // Places related
    if (HK_KNOWLEDGE.places.some(k => lower.includes(k))) {
      return this.getPlaceResponse(lower);
    }
    
    // Trading related
    if (HK_KNOWLEDGE.trading.some(k => lower.includes(k))) {
      return '你問股票或者黃金？我可以幫你分析行情，不過真正投資之前記得做好功課。你想了解邊方面？📈';
    }
    
    // Greetings
    if (['早晨', '你好', 'hello', 'hi', 'hey', '喂'].some(g => lower.includes(g))) {
      const hour = new Date().getHours();
      if (hour < 12) return '早晨！🐉 我係金龍，今日天氣唔錯，祝你有愉快嘅一天！';
      if (hour < 18) return '下午好！🐉 我係金龍，有咩可以幫你？';
      return '夜晚好！🐉 我係金龍，準備好未？';
    }
    
    // Default response
    return this.getDefaultResponse();
  }

  private getWeatherResponse(): string {
    const hour = new Date().getHours();
    const conditions = ['天晴', '多雲', '有陽光', '局部地區有驟雨'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(Math.random() * 10) + 20;
    
    let advice = '';
    if (temp < 20) advice = '記得帶外套！';
    else if (temp > 28) advice = '多補充水分，避免長時間戶外活動';
    else advice = '天氣舒適，出門走走幾好';
    
    return `今日香港${condition}，氣溫大約${temp}度。${advice}如果有咩關於天氣嘅問題，隨時問我！☀️`;
  }

  private getTransportResponse(lower: string): string {
    // MTR stations
    if (lower.includes('東涌')) {
      return '東涌線由香港站出發，約30分鐘直達。票價係HK$24，適用於Octopus或車票。你可以喺東涌站轉乘昂坪360纜車去天壇大佛！🚇';
    }
    if (lower.includes('機場')) {
      return '去機場可以搭機場快線，24分鐘直達，票價HK$115。不過如果你有八達通，可以享有優惠價HK$105。記得預留足够時間過關！✈️';
    }
    if (lower.includes('迪士尼')) {
      return '迪士尼樂園站係專屬車站，搭東涌線喺欣澳站轉乘迪士尼線就到！開放時間係10:00-21:00，建議平日去比較少人。🎢';
    }
    
    // General transport
    if (lower.includes('幾耐') || lower.includes('多久') || lower.includes('分鐘')) {
      return '你可以喺「交通」頁面睇到即時到站資訊。港鐵大部分線路2-5分鐘一班車，繁忙時間可能2分鐘一班。🚌';
    }
    
    return '關於交通問題，你可以用「交通」頁面查詢即時到站時間，或者直接問我你想去邊度，我可以幫你建議路線！';
  }

  private getPlaceResponse(lower: string): string {
    if (lower.includes('長洲')) {
      return '長洲係香港熱門小島，除了平安包同海鮮，仲有張保仔洞同東灣沙灘。建議平日去，假日會比較多人。可以喺中環碼頭搭船，約40分鐘船程。🚢';
    }
    if (lower.includes('西貢')) {
      return '西貢係香港後花園，有超靚海鮮同沙灘。你可以行麥理浩徑、浸溫泉（西灣亭）、或者喺西貢市食海鮮。週末自駕要預早出發，常會塞車。🌊';
    }
    if (lower.includes('大澳')) {
      return '大澳係一個傳統漁村，有機會見到中華白海豚！必試蝦醬、鹹魚、粉果。建議平日去，週末好多人。你可以喺東涌搭11號巴士直達。🐬';
    }
    if (lower.includes('中環')) {
      return '中環係香港商業中心，有好多打卡地方：立法會大樓、終審法院、山頂纜車、蘭桂坊。如果想睇建築，可以去PMQ元創方或者大館。🏙️';
    }
    if (lower.includes('旺角')) {
      return '旺角係購物天堂，女人街、花園街、波鞋街、朗豪坊...行到你攰。不過记得讲價，特別係女人街！小食方面，雞蛋仔、咖喱魚蛋梗係要試。🛍️';
    }
    if (lower.includes('深水埗')) {
      return '深水埗係香港電子產品同潮流服飾集中地，有南昌街、北河街、楓樹街街市。想搵平嘢可以去鴨寮街睇二手電子產品，或者去高登電腦廣場。💻';
    }
    
    return '香港有好多有趣嘅地方！你想去邊區？我可以推薦附近嘅美食、景點、或者交通方式。試下話「西貢好唔好玩」或者「邊度有嘢食」？';
  }

  private getDefaultResponse(): string {
    const responses = [
      '明白！你可以問我關於天氣、交通、搵地方...我都可以幫你。試下話「今日天氣點」或者「東涌點去」？🤔',
      '我係金龍，你嘅香港生活助手。有咩想知？天氣、交通、美食...我都可以幫你！🐉',
      '你問我答！不過我專長係香港資訊，例如「出面濕唔濕」或者「機場快線幾耐」我都可以答你。😊',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getErrorResponse(): string {
    return '豉椒炒魷... 唔係，係我暂时處理唔到呢個請求。你可以試下問其他嘢？或者去「交通」頁面查詢到站時間？😅';
  }

  clearHistory(): void {
    this.messageHistory = [];
  }
}

// Singleton instance
export const aiService = new AIService();
