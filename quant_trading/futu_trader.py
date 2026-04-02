#!/usr/bin/env python3
"""
美股自動化交易系統 - Futu OpenAPI
Author: Gold Dragon 🐉
Date: 2026-04-02
"""

import futu as ft
import time
import json
from datetime import datetime, timedelta
from enum import Enum

# ============================================
# 配置設定
# ============================================

class Config:
    """交易配置"""
    # 富途 OpenD 連接
    HOST = "127.0.0.1"
    PORT = 11111
    
    # 帳戶設定
    INITIAL_CAPITAL = 10000  # 起始資金 $10,000 USD
    MAX_POSITION_SIZE = 0.2   # 最大持倉比例 20%
    MAX_POSITIONS = 5         # 最大持倉股票數量
    
    # 風險管理
    STOP_LOSS_PERCENT = 0.05  # 止損 5%
    TAKE_PROFIT_PERCENT = 0.15  # 止盈 15%
    MAX_DAILY_LOSS = 0.03    # 每日最大虧損 3%
    
    # 交易設定
    ORDER_TYPE = ft.OrderType.NORMAL  # 普通訂單
    TRADE_ENV = ft.TrdEnv.SIMULATE    # 模擬交易 (重要！)
    

class TradeStrategy(Enum):
    """交易策略枚舉"""
    MACD = "macd"
    MA_CROSSOVER = "ma_crossover"
    BREAKOUT = "breakout"
    RSI = "rsi"


# ============================================
# 訂單狀態追蹤
# ============================================

class OrderTracker:
    """追蹤訂單和持倉狀態"""
    
    def __init__(self):
        self.positions = {}      # 持倉 {股票代碼: 持倉信息}
        self.orders = {}         # 訂單 {訂單ID: 訂單信息}
        self.daily_pnl = 0       # 今日盈虧
        self.trade_log = []      # 交易日誌
    
    def add_position(self, code, quantity, avg_cost):
        """添加持倉"""
        self.positions[code] = {
            'quantity': quantity,
            'avg_cost': avg_cost,
            'buy_time': datetime.now(),
            'stop_loss': avg_cost * (1 - Config.STOP_LOSS_PERCENT),
            'take_profit': avg_cost * (1 + Config.TAKE_PROFIT_PERCENT)
        }
        self.log(f"🟢 買入 {code}: {quantity}股, 成本 ${avg_cost:.2f}")
    
    def remove_position(self, code, reason):
        """移除持倉"""
        if code in self.positions:
            pos = self.positions[code]
            self.log(f"🔴 賣出 {code}: {reason}, 持倉 {pos['quantity']}股")
            del self.positions[code]
    
    def log(self, message):
        """記錄日誌"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}"
        self.trade_log.append(log_entry)
        print(log_entry)
    
    def check_stop_loss(self, code, current_price):
        """檢查是否觸發止損"""
        if code not in self.positions:
            return False
        
        pos = self.positions[code]
        if current_price <= pos['stop_loss']:
            self.log(f"⚠️ 止損觸發 {code}: 現價 ${current_price:.2f} <= 止損價 ${pos['stop_loss']:.2f}")
            return True
        return False
    
    def check_take_profit(self, code, current_price):
        """檢查是否觸發止盈"""
        if code not in self.positions:
            return False
        
        pos = self.positions[code]
        if current_price >= pos['take_profit']:
            self.log(f"💰 止盈觸發 {code}: 現價 ${current_price:.2f} >= 止盈價 ${pos['take_profit']:.2f}")
            return True
        return False


# ============================================
# 技術指標計算
# ============================================

class TechnicalIndicators:
    """技術指標計算"""
    
    @staticmethod
    def calculate_ema(prices, period):
        """計算EMA"""
        if len(prices) < period:
            return None
        
        multiplier = 2 / (period + 1)
        ema = prices[0]
        
        for price in prices[1:]:
            ema = (price * multiplier) + (ema * (1 - multiplier))
        
        return ema
    
    @staticmethod
    def calculate_macd(prices, fast=12, slow=26, signal=9):
        """計算MACD"""
        if len(prices) < slow:
            return None, None, None
        
        ema_fast = TechnicalIndicators.calculate_ema(prices, fast)
        ema_slow = TechnicalIndicators.calculate_ema(prices, slow)
        
        if ema_fast is None or ema_slow is None:
            return None, None, None
        
        macd_line = ema_fast - ema_slow
        
        # Signal line (EMA of MACD)
        # 簡化版本
        signal_line = macd_line * 0.9  # 近似值
        
        histogram = macd_line - signal_line
        
        return macd_line, signal_line, histogram
    
    @staticmethod
    def calculate_rsi(prices, period=14):
        """計算RSI"""
        if len(prices) < period + 1:
            return None
        
        gains = []
        losses = []
        
        for i in range(1, len(prices)):
            change = prices[i] - prices[i-1]
            if change > 0:
                gains.append(change)
                losses.append(0)
            else:
                gains.append(0)
                losses.append(abs(change))
        
        avg_gain = sum(gains[-period:]) / period
        avg_loss = sum(losses[-period:]) / period
        
        if avg_loss == 0:
            return 100
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        
        return rsi
    
    @staticmethod
    def calculate_ma(prices, period):
        """計算MA"""
        if len(prices) < period:
            return None
        return sum(prices[-period:]) / period


# ============================================
# 交易策略
# ============================================

class TradingStrategy:
    """交易策略基類"""
    
    def __init__(self, name, stock_code):
        self.name = name
        self.stock_code = stock_code
        self.indicators = TechnicalIndicators()
    
    def should_buy(self, market_data):
        """判斷是否應該買入"""
        raise NotImplementedError
    
    def should_sell(self, market_data):
        """判斷是否應該賣出"""
        raise NotImplementedError


class MACDStrategy(TradingStrategy):
    """MACD策略"""
    
    def __init__(self, stock_code):
        super().__init__("MACD", stock_code)
    
    def should_buy(self, market_data):
        """MACD金叉買入"""
        prices = market_data['prices']
        if len(prices) < 30:
            return False, "數據不足"
        
        macd, signal, hist = self.indicators.calculate_macd(prices)
        
        if macd is None:
            return False, "MACD計算失敗"
        
        # 入場信號：MACD從負轉正 + histogram由負轉正
        if hist > 0 and signal > 0:
            return True, f"MACD金叉入蓸 (MACD={macd:.2f}, Signal={signal:.2f})"
        
        return False, f"MACD未觸發 (MACD={macd:.2f})"
    
    def should_sell(self, market_data):
        """MACD死叉賣出"""
        prices = market_data['prices']
        if len(prices) < 30:
            return False, "數據不足"
        
        macd, signal, hist = self.indicators.calculate_macd(prices)
        
        if macd is None:
            return False, "MACD計算失敗"
        
        # 出場信號：MACD死叉
        if hist < 0:
            return True, f"MACD死叉 (MACD={macd:.2f}, Signal={signal:.2f})"
        
        return False, f"MACD未觸發"


class RSIStrategy(TradingStrategy):
    """RSI策略"""
    
    def __init__(self, stock_code):
        super().__init__("RSI", stock_code)
    
    def should_buy(self, market_data):
        """RSI超賣買入"""
        prices = market_data['prices']
        if len(prices) < 15:
            return False, "數據不足"
        
        rsi = self.indicators.calculate_rsi(prices)
        
        if rsi is None:
            return False, "RSI計算失敗"
        
        # RSI低於30視為超賣，可能反彈
        if rsi < 30:
            return True, f"RSI超賣入蓸 (RSI={rsi:.2f})"
        
        return False, f"RSI未觸發 (RSI={rsi:.2f})"
    
    def should_sell(self, market_data):
        """RSI超買賣出"""
        prices = market_data['prices']
        if len(prices) < 15:
            return False, "數據不足"
        
        rsi = self.indicators.calculate_rsi(prices)
        
        if rsi is None:
            return False, "RSI計算失敗"
        
        # RSI高於70視為超買
        if rsi > 70:
            return True, f"RSI超買 (RSI={rsi:.2f})"
        
        return False, f"RSI未觾發"


class BreakoutStrategy(TradingStrategy):
    """突破策略"""
    
    def __init__(self, stock_code, lookback=20):
        super().__init__("Breakout", stock_code)
        self.lookback = lookback
    
    def should_buy(self, market_data):
        """價格突破新高買入"""
        prices = market_data['prices']
        current_price = market_data['current_price']
        
        if len(prices) < self.lookback:
            return False, "數據不足"
        
        # 過去N天最高價
        highest = max(prices[-self.lookback:-1])  # 排除今天
        current_high = max(prices[-self.lookback:])
        
        # 突破信號：今天價格高於過去N天最高價
        if current_price > highest:
            return True, f"突破新高入蓸 (現價=${current_price:.2f}, 阻力=${highest:.2f})"
        
        return False, f"未突破 (現價=${current_price:.2f}, 阻力=${highest:.2f})"
    
    def should_sell(self, market_data):
        """價格跌破新低賣出"""
        prices = market_data['prices']
        current_price = market_data['current_price']
        
        if len(prices) < self.lookback:
            return False, "數據不足"
        
        lowest = min(prices[-self.lookback:-1])
        
        if current_price < lowest:
            return True, f"跌破新低 (現價=${current_price:.2f})"
        
        return False, f"未跌破 (現價=${current_price:.2f})"


# ============================================
# 自動交易系統主類
# ============================================

class USStockTrader:
    """美股自動交易系統"""
    
    def __init__(self, stock_list, strategy_type=TradeStrategy.MACD):
        """
        初始化交易系統
        
        Args:
            stock_list: 股票代碼列表 ['US.AAPL', 'US.TSLA', ...]
            strategy_type: 交易策略
        """
        self.stock_list = stock_list
        self.strategy_type = strategy_type
        
        # 初始化富途連接
        self.quote_ctx = None
        self.trade_ctx = None
        
        # 初始化追蹤器
        self.tracker = OrderTracker()
        
        # 初始化策略
        self.strategies = {}
        for stock in stock_list:
            if strategy_type == TradeStrategy.MACD:
                self.strategies[stock] = MACDStrategy(stock)
            elif strategy_type == TradeStrategy.RSI:
                self.strategies[stock] = RSIStrategy(stock)
            elif strategy_type == TradeStrategy.BREAKOUT:
                self.strategies[stock] = BreakoutStrategy(stock)
        
        # 市場數據緩存
        self.market_data = {}
    
    def connect(self):
        """連接富途OpenD"""
        try:
            # 行情連接
            self.quote_ctx = ft.OpenQuoteContext(host=Config.HOST, port=Config.PORT)
            self.tracker.log("✅ 行情連接成功")
            
            # 交易連接 (需要開啟OpenD的交易權限)
            self.trade_ctx = ft.OpenTradeContext(host=Config.HOST, port=Config.PORT)
            self.tracker.log("✅ 交易連接成功")
            
            return True
        except Exception as e:
            self.tracker.log(f"❌ 連接失敗: {e}")
            return False
    
    def disconnect(self):
        """斷開連接"""
        if self.quote_ctx:
            self.quote_ctx.close()
        if self.trade_ctx:
            self.trade_ctx.close()
        self.tracker.log("🔌 連接已斷開")
    
    def get_market_data(self, stock_code, days=30):
        """獲取市場數據"""
        try:
            # 獲取歷史K線
            ret, data = self.quote_ctx.get_history_kline(
                stock_code, 
                start_date=(datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d"),
                end_date=datetime.now().strftime("%Y-%m-%d"),
                ktype=ft.KLType.K_DAY
            )
            
            if ret != 0:
                self.tracker.log(f"❌ 獲取數據失敗 {stock_code}: {data}")
                return None
            
            # 整理數據
            prices = [float(row['close']) for row in data]
            current_price = prices[-1] if prices else 0
            
            self.market_data[stock_code] = {
                'prices': prices,
                'current_price': current_price,
                'data': data
            }
            
            return self.market_data[stock_code]
            
        except Exception as e:
            self.tracker.log(f"❌ 獲取市場數據異常 {stock_code}: {e}")
            return None
    
    def get_account_info(self):
        """獲取帳戶信息"""
        try:
            ret, data = self.trade_ctx.get_acc_list()
            if ret != 0:
                return None
            return data
        except:
            return None
    
    def buy(self, stock_code, quantity=None, amount=None):
        """
        買入股票
        
        Args:
            stock_code: 股票代碼
            quantity: 買入數量 (優先)
            amount: 買入金額
        """
        if stock_code in self.tracker.positions:
            self.tracker.log(f"⏩ 跳過 {stock_code}: 已有持倉")
            return False
        
        # 計算買入數量
        if quantity is None and amount:
            current_price = self.market_data[stock_code]['current_price']
            quantity = int(amount / current_price / 100) * 100  # 向下取整到100股
        
        if quantity is None or quantity <= 0:
            self.tracker.log(f"❌ 無效數量 {quantity}")
            return False
        
        try:
            # 嘗試市價單
            ret, data = self.trade_ctx.place_order(
                price=0,  # 市價單
                qty=quantity,
                code=stock_code,
                trd_side=ft.TrdSide.BUY,
                order_type=ft.OrderType.NORMAL,
                trd_env=Config.TRADE_ENV  # 模擬交易
            )
            
            if ret == 0:
                self.tracker.add_position(stock_code, quantity, 
                    self.market_data[stock_code]['current_price'])
                return True
            else:
                self.tracker.log(f"❌ 買入失敗 {stock_code}: {data}")
                return False
                
        except Exception as e:
            self.tracker.log(f"❌ 買入異常 {stock_code}: {e}")
            return False
    
    def sell(self, stock_code, quantity=None):
        """賣出股票"""
        if stock_code not in self.tracker.positions:
            return False
        
        if quantity is None:
            quantity = self.tracker.positions[stock_code]['quantity']
        
        try:
            ret, data = self.trade_ctx.place_order(
                price=0,  # 市價單
                qty=quantity,
                code=stock_code,
                trd_side=ft.TrdSide.SELL,
                order_type=ft.OrderType.NORMAL,
                trd_env=Config.TRADE_ENV
            )
            
            if ret == 0:
                self.tracker.remove_position(stock_code, "主動賣出")
                return True
            else:
                self.tracker.log(f"❌ 賣出失敗 {stock_code}: {data}")
                return False
                
        except Exception as e:
            self.tracker.log(f"❌ 賣出異常 {stock_code}: {e}")
            return False
    
    def check_positions(self):
        """檢查持倉，執行止損止盈"""
        for stock_code in list(self.tracker.positions.keys()):
            if stock_code not in self.market_data:
                continue
            
            current_price = self.market_data[stock_code]['current_price']
            
            # 檢查止損
            if self.tracker.check_stop_loss(stock_code, current_price):
                self.sell(stock_code)
                continue
            
            # 檢查止盈
            if self.tracker.check_take_profit(stock_code, current_price):
                self.sell(stock_code)
                continue
    
    def scan_opportunities(self):
        """掃描買入機會"""
        for stock_code in self.stock_list:
            # 跳過已有持倉
            if stock_code in self.tracker.positions:
                continue
            
            # 跳過持倉已滿
            if len(self.tracker.positions) >= Config.MAX_POSITIONS:
                break
            
            strategy = self.strategies.get(stock_code)
            if not strategy:
                continue
            
            should_buy, reason = strategy.should_buy(self.market_data[stock_code])
            
            if should_buy:
                self.tracker.log(f"📊 {stock_code}: {reason}")
                # 計算買入金額 (平均分配)
                buy_amount = Config.INITIAL_CAPITAL / Config.MAX_POSITIONS
                self.buy(stock_code, amount=buy_amount)
    
    def run(self, interval_seconds=60, iterations=None):
        """
        運行交易系統
        
        Args:
            interval_seconds: 檢查間隔 (秒)
            iterations: 運行次數 (None=無限)
        """
        self.tracker.log("=" * 50)
        self.tracker.log("🚀 美股自動交易系統啟動")
        self.tracker.log(f"📈 股票: {', '.join(self.stock_list)}")
        self.tracker.log(f"🎯 策略: {self.strategy_type.value}")
        self.tracker.log(f"💰 起始資金: ${Config.INITIAL_CAPITAL}")
        self.tracker.log("=" * 50)
        
        count = 0
        
        while iterations is None or count < iterations:
            count += 1
            self.tracker.log(f"\n--- 第 {count} 次掃描 ---")
            
            # 1. 更新市場數據
            for stock in self.stock_list:
                data = self.get_market_data(stock)
                if data:
                    self.tracker.log(f"📊 {stock}: ${data['current_price']:.2f}")
            
            # 2. 檢查持倉 (止損止盈)
            self.check_positions()
            
            # 3. 掃描新機會
            self.scan_opportunities()
            
            # 4. 顯示持倉狀態
            if self.tracker.positions:
                self.tracker.log("\n📦 當前持倉:")
                for code, pos in self.tracker.positions.items():
                    current = self.market_data.get(code, {}).get('current_price', 0)
                    pnl_pct = (current - pos['avg_cost']) / pos['avg_cost'] * 100 if current else 0
                    self.tracker.log(f"  {code}: {pos['quantity']}股 @ ${pos['avg_cost']:.2f} | 現價 ${current:.2f} | {'+' if pnl_pct >= 0 else ''}{pnl_pct:.2f}%")
            
            # 等待下次掃描
            if iterations is None or count < iterations:
                time.sleep(interval_seconds)
        
        self.tracker.log("\n✅ 交易系統結束")
        return self.tracker.trade_log


# ============================================
# 主程序入口
# ============================================

if __name__ == "__main__":
    # 測試用股票列表 (美股)
    TEST_STOCKS = [
        "US.AAPL",    # 蘋果
        "US.TSLA",    # 特斯拉
        "US.NVDA",    # NVIDIA
        "US.SPY",     # 標普500 ETF
        "US.QQQ",     # 納斯達克100 ETF
    ]
    
    # 創建交易系統
    trader = USStockTrader(
        stock_list=TEST_STOCKS,
        strategy_type=TradeStrategy.MACD
    )
    
    # 連接
    if trader.connect():
        # 運行交易系統 (每60秒檢查一次，運行10次後停止)
        # 改為 -1 或 None 可變為永遠運行
        try:
            trader.run(interval_seconds=60, iterations=10)
        except KeyboardInterrupt:
            print("\n⚠️ 用戶中斷")
        finally:
            trader.disconnect()
    else:
        print("❌ 無法連接富途OpenD，請確認：")
        print("1. OpenD 已安裝並運行")
        print("2. 已登入富途帳戶")
        print("3. 端口配置正確")
