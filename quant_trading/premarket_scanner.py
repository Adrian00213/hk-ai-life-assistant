#!/usr/bin/env python3
"""
美股預市場掃描系統 - Pre-Market Scanner
Author: Gold Dragon 🐉
Date: 2026-04-02
功能：開市前掃描所有股票，識別今日有機會嘅股票
"""

import futu as ft
import time
import json
from datetime import datetime, time as dt_time, timedelta
from enum import Enum

# ============================================
# 配置設定
# ============================================

class Config:
    """預市場掃描配置"""
    HOST = "127.0.0.1"
    PORT = 11111
    
    # 掃描時間
    SCAN_START = dt_time(4, 0)   # 美國凌晨4:00開始
    SCAN_END = dt_time(9, 25)    # 美國上午9:25結束 (開市前5分鐘)
    MARKET_OPEN = dt_time(9, 30) # 美國開市時間
    
    # 市場
    MARKET_HK = "HK"
    MARKET_US = "US"
    
    # 掃描股票池
    SCAN_STOCKS = [
        # 科技巨頭
        "US.AAPL",   # Apple
        "US.MSFT",   # Microsoft
        "US.GOOGL",  # Google
        "US.AMZN",   # Amazon
        "US.NVDA",   # NVIDIA
        "US.META",   # Meta
        "US.TSLA",   # Tesla
        "US.AMD",    # AMD
        "US.QCOM",   # Qualcomm
        "US.INTC",   # Intel
        "US.NFLX",   # Netflix
        
        # 指數ETF
        "US.SPY",    # S&P 500 ETF
        "US.QQQ",    # Nasdaq ETF
        "US.IWM",    # Russell 2000
        "US.DIA",    # Dow Jones ETF
        
        # 半導體
        "US.ASML",   # ASML
        "US.MU",     # Micron
        "US.LRCX",   # Lam Research
        "US.KLAC",   # KLA Corp
        
        # AI/雲端
        "US.PANW",   # Palo Alto
        "US.CRWD",   # CrowdStrike
        "US.SNOW",   # Snowflake
        "US.DBX",    # Dropbox
        
        # 中概股
        "US.BABA",   # Alibaba
        "US.JD",     # JD.com
        "US.PDD",    # PDD Holdings
        "US.BIDU",   # Baidu
        "US.NIO",    # NIO
        
        # 熱門股票
        "US.GME",    # GameStop
        "US.AMC",    # AMC
        "US.SOFI",   # SoFi
        "US.PLTR",   # Palantir
        "US.RIVN",   # Rivian
    ]
    
    # 篩選條件
    MIN_PRICE = 1.0        # 最低股價
    MAX_PRICE = 500.0      # 最高股價
    MIN_VOLUME = 1000000   # 最低成交量
    MIN_GAP_PERCENT = 3.0  # 最小跳空幅度 %
    MIN_PRICE_CHANGE = 2.0 # 最小價格變化 %
    
    # 風險股票 (需要特別注意)
    HIGH_RISK_STOCKS = ["US.GME", "US.AMC", "US.RIVN", "US.SOFI"]


class ScanResult:
    """掃描結果"""
    
    def __init__(self, stock_code):
        self.stock_code = stock_code
        self.name = ""
        self.price = 0
        self.prev_close = 0
        self.gap_percent = 0
        self.volume = 0
        self.avg_volume = 0
        self.volume_ratio = 0
        self.price_change = 0
        self.premarket_trade_count = 0
        self.score = 0
        self.signals = []
        self.risk_level = "NORMAL"
        self.recommendation = ""
    
    def calculate_score(self):
        """計算綜合評分"""
        score = 0
        
        # 價格變化評分
        if abs(self.gap_percent) >= 5:
            score += 30
        elif abs(self.gap_percent) >= 3:
            score += 20
        elif abs(self.gap_percent) >= 1:
            score += 10
        
        # 成交量評分
        if self.volume_ratio >= 5:
            score += 30
        elif self.volume_ratio >= 3:
            score += 20
        elif self.volume_ratio >= 2:
            score += 10
        
        # 市場情緒評分
        if self.gap_percent > 0:
            score += 10  # 偏好上漲
        else:
            score += 5   # 下跌也可能有機會
        
        self.score = score
        return score
    
    def generate_signals(self):
        """生成交易信號"""
        signals = []
        
        # Gap信號
        if self.gap_percent >= 5:
            signals.append(f"🔥 強勢跳空: {self.gap_percent:+.1f}%")
        elif self.gap_percent >= 3:
            signals.append(f"📈 中幅跳空: {self.gap_percent:+.1f}%")
        elif self.gap_percent >= 1:
            signals.append(f"📊 小幅跳空: {self.gap_percent:+.1f}%")
        
        # 成交量信號
        if self.volume_ratio >= 5:
            signals.append(f"💥 成交量暴增: {self.volume_ratio:.1f}x")
        elif self.volume_ratio >= 3:
            signals.append(f"📊 成交量放大: {self.volume_ratio:.1f}x")
        
        # 價格變化
        if self.price_change >= 5:
            signals.append(f"🚀 大幅上漲: {self.price_change:+.1f}%")
        elif self.price_change <= -5:
            signals.append(f"💻 大幅下跌: {self.price_change:+.1f}%")
        
        self.signals = signals
        return signals
    
    def generate_recommendation(self):
        """生成建議"""
        if self.score >= 50:
            self.recommendation = "🚀 強烈關注"
        elif self.score >= 30:
            self.recommendation = "✅ 關注"
        elif self.score >= 15:
            self.recommendation = "🔍 觀察"
        else:
            self.recommendation = "⏸️ 暫時觀望"
        
        # 風險評估
        if self.stock_code in Config.HIGH_RISK_STOCKS:
            self.risk_level = "HIGH"
            self.recommendation += " ⚠️高風險"
        elif self.score >= 40:
            self.risk_level = "MEDIUM"
        
        return self.recommendation
    
    def to_dict(self):
        """轉換為字典"""
        return {
            "股票代碼": self.stock_code,
            "名稱": self.name,
            "現價": f"${self.price:.2f}",
            "昨收": f"${self.prev_close:.2f}",
            "跳空": f"{self.gap_percent:+.1f}%",
            "價格變化": f"{self.price_change:+.1f}%",
            "成交量": f"{self.volume/1000000:.1f}M",
            "成交量比": f"{self.volume_ratio:.1f}x",
            "評分": self.score,
            "信號": " | ".join(self.signals),
            "建議": self.recommendation,
            "風險": self.risk_level
        }


# ============================================
# 預市場掃描器
# ============================================

class PremarketScanner:
    """預市場股票掃描器"""
    
    def __init__(self, stock_list=None):
        self.stock_list = stock_list or Config.SCAN_STOCKS
        self.quote_ctx = None
        self.results = []
        self.scan_time = None
    
    def connect(self):
        """連接"""
        try:
            self.quote_ctx = ft.OpenQuoteContext(host=Config.HOST, port=Config.PORT)
            print("✅ 行情連接成功")
            return True
        except Exception as e:
            print(f"❌ 連接失敗: {e}")
            return False
    
    def disconnect(self):
        """斷開"""
        if self.quote_ctx:
            self.quote_ctx.close()
        print("🔌 已斷開連接")
    
    def get_stock_info(self, stock_code):
        """獲取股票完整信息"""
        try:
            # 獲取報價
            ret, quote = self.quote_ctx.get_stock_quote(stock_code)
            if ret != 0:
                return None
            
            # 獲取基本資料
            ret, info = self.quote_ctx.get_stock_info(stock_code)
            if ret != 0:
                info = None
            
            return quote, info
        except Exception as e:
            print(f"❌ 獲取 {stock_code} 信息失敗: {e}")
            return None
    
    def get_historical_data(self, stock_code, days=5):
        """獲取歷史數據"""
        try:
            end_date = datetime.now().strftime("%Y-%m-%d")
            start_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
            
            ret, klines = self.quote_ctx.get_history_kline(
                stock_code,
                start_date=start_date,
                end_date=end_date,
                ktype=ft.KLType.K_DAY
            )
            
            if ret != 0:
                return None
            
            return klines
        except Exception as e:
            return None
    
    def scan_single(self, stock_code):
        """掃描單支股票"""
        result = ScanResult(stock_code)
        
        # 獲取股票信息
        data = self.get_stock_info(stock_code)
        if data is None:
            return None
        
        quote, info = data
        quote_data = quote.iloc[0] if len(quote) > 0 else None
        
        if quote_data is None:
            return None
        
        # 提取數據
        result.price = float(quote_data.get('last', 0) or 0)
        result.prev_close = float(quote_data.get('prev_close', 0) or 0)
        result.volume = int(quote_data.get('volume', 0) or 0)
        result.name = quote_data.get('name', stock_code)
        
        # 獲取歷史數據計算平均成交量
        hist = self.get_historical_data(stock_code, days=20)
        if hist is not None and len(hist) > 0:
            avg_vol = hist['volume'].astype(int).mean()
            result.avg_volume = int(avg_vol)
            
            # 計算成交量比率
            if result.avg_volume > 0:
                result.volume_ratio = result.volume / result.avg_volume
            
            # 計算前一天收盤價
            if len(hist) >= 2:
                result.prev_close = float(hist.iloc[-2]['close'])
        
        # 計算跳空幅度
        if result.prev_close > 0:
            result.gap_percent = ((result.price - result.prev_close) / result.prev_close) * 100
            result.price_change = result.gap_percent
        
        # 生成評分
        result.calculate_score()
        result.generate_signals()
        result.generate_recommendation()
        
        return result
    
    def scan_all(self):
        """掃描所有股票"""
        print("\n" + "=" * 70)
        print("🚀 預市場股票掃描系統")
        print(f"⏰ 掃描時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📊 股票數量: {len(self.stock_list)}")
        print("=" * 70)
        
        self.results = []
        self.scan_time = datetime.now()
        
        for i, stock_code in enumerate(self.stock_list):
            print(f"[{i+1}/{len(self.stock_list)}] 掃描 {stock_code}...", end=" ")
            
            result = self.scan_single(stock_code)
            
            if result and result.price > 0:
                self.results.append(result)
                
                # 顯示關鍵信息
                if result.score >= 20:
                    print(f"✅ ${result.price:.2f} ({result.gap_percent:+.1f}%) ⭐{result.score}")
                else:
                    print(f"${result.price:.2f}")
            else:
                print("❌")
            
            # 避免請求太快
            if (i + 1) % 5 == 0:
                time.sleep(0.5)
        
        return self.results
    
    def get_top_movers(self, limit=10):
        """獲取最大波動股票"""
        sorted_results = sorted(self.results, key=lambda x: abs(x.gap_percent), reverse=True)
        return sorted_results[:limit]
    
    def get_high_volume(self, limit=10):
        """獲取高成交量股票"""
        sorted_results = sorted(self.results, key=lambda x: x.volume_ratio, reverse=True)
        return sorted_results[:limit]
    
    def get_hot_stocks(self, limit=10):
        """獲取最熱門股票 (綜合評分)"""
        sorted_results = sorted(self.results, key=lambda x: x.score, reverse=True)
        return sorted_results[:limit]
    
    def generate_report(self):
        """生成掃描報告"""
        print("\n" + "=" * 70)
        print("📊 預市場掃描報告")
        print(f"⏰ 生成時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        # 1. 熱門股票
        print("\n🔥 【最熱門股票 TOP 10】")
        print("-" * 70)
        hot = self.get_hot_stocks(10)
        for i, r in enumerate(hot, 1):
            print(f"{i:2}. {r.stock_code:10} {r.name:20} ${r.price:8.2f} {r.gap_percent:+6.1f}% ⭐{r.score:3} {r.recommendation}")
        
        # 2. 最大跳空
        print("\n📈 【最大跳空股票】")
        print("-" * 70)
        movers = self.get_top_movers(5)
        for i, r in enumerate(movers, 1):
            print(f"{i}. {r.stock_code:10} {r.gap_percent:+8.1f}% 現價${r.price:.2f} → {', '.join(r.signals[:2])}")
        
        # 3. 高成交量
        print("\n💥 【高成交量股票】")
        print("-" * 70)
        volume = self.get_high_volume(5)
        for i, r in enumerate(volume, 1):
            print(f"{i}. {r.stock_code:10} {r.volume_ratio:6.1f}x 成交量 {r.volume/1000000:.1f}M")
        
        # 4. 今日觀察名單
        print("\n👀 【今日觀察名單】")
        print("-" * 70)
        watchlist = [r for r in self.results if r.score >= 20]
        if watchlist:
            for r in watchlist[:10]:
                print(f"• {r.stock_code} {r.gap_percent:+5.1f}% ${r.price:.2f} - {r.recommendation}")
        else:
            print("今日暫無特別機會")
        
        # 5. 風險提醒
        print("\n⚠️ 【風險提醒】")
        print("-" * 70)
        high_risk = [r for r in self.results if r.risk_level == "HIGH"]
        if high_risk:
            for r in high_risk:
                print(f"• {r.stock_code} - 高波動股票，請謹慎操作")
        
        # 6. 總結
        print("\n📋 【操作建議】")
        print("-" * 70)
        buy_signals = [r for r in self.results if r.gap_percent > 0 and r.score >= 30]
        sell_signals = [r for r in self.results if r.gap_percent < -3 and r.score >= 30]
        
        if buy_signals:
            print(f"🟢 可關注做多: {', '.join([r.stock_code for r in buy_signals[:5]])}")
        if sell_signals:
            print(f"🔴 可關注做空: {', '.join([r.stock_code for r in sell_signals[:5]])}")
        
        if not buy_signals and not sell_signals:
            print("⏸️ 建議觀望，等待更清晰信號")
        
        print("\n" + "=" * 70)
        
        return self.results
    
    def export_to_json(self, filename=None):
        """導出為JSON"""
        if filename is None:
            filename = f"premarket_scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        data = {
            "scan_time": self.scan_time.isoformat() if self.scan_time else None,
            "total_stocks": len(self.results),
            "results": [r.to_dict() for r in self.results]
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"📁 報告已保存: {filename}")
        return filename


# ============================================
# 主程序
# ============================================

if __name__ == "__main__":
    print("🚀 預市場股票掃描系統")
    print("=" * 50)
    
    # 創建掃描器
    scanner = PremarketScanner()
    
    # 連接
    if scanner.connect():
        try:
            # 執行掃描
            scanner.scan_all()
            
            # 生成報告
            scanner.generate_report()
            
            # 導出JSON
            scanner.export_to_json()
            
        except KeyboardInterrupt:
            print("\n⚠️ 用戶中斷")
        finally:
            scanner.disconnect()
    else:
        print("❌ 無法連接富途OpenD")
        print("請確認：")
        print("1. OpenD 已運行")
        print("2. 端口 11111 正確")
