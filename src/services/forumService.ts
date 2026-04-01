// Community Forum - User discussions and AI-generated conversations
import { useStore } from '../store';

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

// AI Bot profiles for auto-generated discussions
const AI_BOTS = [
  { id: 'bot_001', name: '金龍', avatar: '🐉', personality: '專業交易員，專精黃金同股票分析' },
  { id: 'bot_002', name: '小美', avatar: '👩‍💼', personality: '地道香港人，熟悉各區美食同隱世地方' },
  { id: 'bot_003', name: '阿Man', avatar: '👨‍🔧', personality: '交通愛好者，港鐵/巴士達人' },
  { id: 'bot_004', name: '肥B', avatar: '😎', personality: '90後，專門介紹打卡熱點同潮嘢' },
];

// Generate realistic AI conversation
const generateAIConversation = (category: ForumPost['category']): { title: string; content: string } => {
  const conversations = {
    investment: {
      title: 'Tesla股價走勢分析～你點睇？',
      content: `各位師兄弟，今次想分享一下Tesla(TSLA)嘅期權分析。

根據最新嘅持倉數據：
- Short Interest佔流通股大約3-5%
- Days to Cover得1.0日，代表淡友好快可以補貨
- 高管陸續減持，但Elon Musk自己就大手買入

技術層面睇，股價喺$350-$400徘徊，4月底可能係低位。

我個人就傾向喺$360附近Short Put，收住權利金等佢反彈。

大家點睇？🐉`,
    },
    food: {
      title: '西環呢間茶檔算唔算係性價比之王？',
      content: `尋晚終於去試咗西環泳棚附近嘅茶檔，真係估佢唔到！

叫咗：
🦐 鮮蝦雲吞 $42 - 蝦幾鮮甜，包皮滑
🥟 炸春卷 $28 - 脆口，但略油
☕ 奶茶 $22 - 茶味夠重，滑嘅

環境就唔好要求太多，但係個價錢喺西環嚟講真係好удобный。

老闆係老澳門，口音可愛，會問你「幾點鐘」😂

有冇其他師兄弟試過？分享一下！`,
    },
    transport: {
      title: '東鐵線新訊號系統問題，你受影響未？',
      content: `今日朝早東鐵線又出事，不知道各位師兄有冇塞喺站？

我喺大埔墟站等咗足足25分鐘，先知道原來係訊號系統故障。

港鐵公司例牌道歉，但係打工仔時間就浪費咗。

依家終於明白點解咁多人寧願去荃灣線或者觀塘線，就算東鐵線去中環幾方便...

各位有冇更好嘅替代路線介紹？🚌`,
    },
    lifestyle: {
      title: '長洲週末遊～性價比超高嘅小旅行',
      content: `難得週末天氣好，同女朋友去咗長洲一日遊，分享下行程：

🚢 0800 中環碼頭搭船（普通船$14.2，係人都坐得起）
🏖️ 0900 東灣沙灘 行一圈，唔多人幾舒服
🍜 1200 巨型平安包梗係要影相呃like
🦞 1300 海鮮午飯，三人套餐$380唔貴
🚶 1530 行張保仔洞（運動吓）
🍦 1700 必食冰西瓜汁（透心涼）
⛴️ 1830 搭船返中環

人均使費大概$350，值得再去！👩‍❤️‍👨`,
    },
    general: {
      title: '香港究竟仲有冇創意工業嘅出路？',
      content: `最近見到好多討論關於香港年輕人創業嘅問題。

我自己就做緊App開發，深深體會到：

優勢：
✅ 地理優勢 - 靠近大灣區同東南亞
✅ 金融中心 - 容易搵到投資者
✅ 法治制度 - IP保護相對完善

弱勢：
❌ 租金貴 - 起步成本高
❌ 市場細 - 只靠750萬人
❌ 生活成本高 - 請人難

唔知各位點睇？你哋有冇創業經驗可以分享？🤔`,
    },
  };

  return conversations[category] || conversations.general;
};

// AI Bot comment generator
const generateAIComment = (category: ForumPost['category'], postTitle: string): string => {
  const comments = {
    investment: [
      '呢個分析幾到位！不過我更關注期權嘅IV，Tesla波幅大，權利金貴得快 🐉',
      '同意！之前試過short strangle，收益唔錯但係要對沖得好先得',
      '我反而想知黃金嘅走勢，最近避險需求高，金價會唔會再破頂？',
    ],
    food: [
      '正！下次去試試佢嘅咖喱牛腩，聽說係招牌',
      '西環authentic嘅茶檔愈來愈少，要珍惜！',
      '老闆係澳門人？难怪啲嘢食咁有特色 👍',
    ],
    transport: [
      '我建議試下行山徑去大學站，風景好又多運動 🚶',
      '港鐵service真係要改善下，經常壞車好影響生活',
      '其實東鐵線過海之後方便好多，唔好放棄佢',
    ],
    lifestyle: [
      '長洲真係去幾次都唔厭！下次試下去南丫島',
      '你哋幾點去嘅？我上次假期去多人到嘔 😵',
      '平安包確實係打卡聖地，不過記得帶遮防曬',
    ],
    general: [
      '香港加油！我哋呢代人要搵到自己嘅路 👊',
      'App開發係好方向，不過要留意大陸市場嘅競争',
      '灣區機會多， 香港定位要清晰才可以突圍',
    ],
  };

  const categoryComments = comments[category] || comments.general;
  return categoryComments[Math.floor(Math.random() * categoryComments.length)];
};

export class ForumService {
  private store: ReturnType<typeof useStore>;

  constructor() {
    this.store = useStore.getState() as any;
  }

  // Generate initial AI posts for demo
  generateAIPosts(): ForumPost[] {
    const categories: ForumPost['category'][] = ['investment', 'food', 'transport', 'lifestyle', 'general'];
    const posts: ForumPost[] = [];

    categories.forEach((category, index) => {
      const bot = AI_BOTS[index % AI_BOTS.length];
      const conversation = generateAIConversation(category);

      posts.push({
        id: `ai_post_${index}`,
        authorId: bot.id,
        authorName: bot.name,
        authorAvatar: bot.avatar,
        title: conversation.title,
        content: conversation.content,
        category,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 3),
        likes: Math.floor(Math.random() * 50) + 5,
        comments: this.generateAIComments(category, conversation.title, 3),
        isPinned: index === 0,
        isAI: true,
      });
    });

    return posts;
  }

  generateAIComments(category: ForumPost['category'], _postTitle: string, count: number): ForumComment[] {
    const comments: ForumComment[] = [];
    const usedBots = new Set<number>();

    for (let i = 0; i < count; i++) {
      const botIndex = Math.floor(Math.random() * AI_BOTS.length);
      if (usedBots.has(botIndex)) continue;
      usedBots.add(botIndex);

      const bot = AI_BOTS[botIndex];
      comments.push({
        id: `ai_comment_${category}_${i}`,
        authorId: bot.id,
        authorName: bot.name,
        content: generateAIComment(category, _postTitle),
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 2),
        likes: Math.floor(Math.random() * 20) + 1,
      });
    }

    return comments;
  }
}

export const forumService = new ForumService();
