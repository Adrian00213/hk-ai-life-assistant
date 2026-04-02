#!/usr/bin/env python3
"""
美股短炒策略 - 1分鐘Scalping
Author: Gold Dragon 🐉
Date: 2026-04-02
Based on: Price Action + EMA Scalping
"""

import futu as ft
import time
import numpy as np
from datetime import datetime, time as dt_time
from enum import Enum

# ============================================
# 配置設定
# ============================================

class Config:
    """短炒配置"""
    # 富途 OpenD 連接
    HOST = "127.0.0.1"
    PORT = 11111
    
    # 帳戶設定
    INITIAL_CAPITAL = 5000  # 起始資金 $5000 USD (建議用細啲)
    MAX_POSITION_SIZE = 0.1  # 最大持倉 10%
    
    # 短炒風控 (更重要！)
    STOP_LOSS_TICKS = 0.003  # 止損 0.3% (好緊!)
    TAKE_PROFIT_TICKS = 0.005  # 止盈 0.5% (合理目標)
    MAX_DAILY_TRADES = 10  # 每日最多10單
    MAX_DAILY_LOSS = 0.02  # 每日最大虧損 2%
    
    # 交易設定
    TRADE_ENV = ft.TrdEnv.SIMULATE  # 模擬交易！
    
    # 短炒時間 (美國開市)
    MARKET_OPEN = dt_time(9, 30)  # 美東9:30開市
    MARKET_CLOSE = dt_time(16, 0)  # 美東4:00收市


class TradeDirection(Enum):
    """交易方向"""
    LONG = "long"
    SHORT = "short"
    NONE = "none"


# ============================================
# 短炒策略引擎
# ============================================

class ScalpingStrategy:
    """
    短炒策略核心
    
    策略邏輯：
    1. 使用 9 EMA + 21 EMA 穿越
    2. 配合 RSI 確認信號
    3. 價格回調到EMA時入場
    4. 快速止盈止損
    """
    
    def __init__(self, stock_code):
        self.stock_code = stock_code
        self.prices = []
        self.ema_9 = []
        self.ema_21 = []
        self.rsi = []
        self.last_direction = TradeDirection.NONE
        self.entry_price = 0
        
        # 策略參數
        self.ema_fast = 9
        self.ema_slow = 21
        self.rsi_period = 14
        self.rsi_oversold = 35
        self.rsi_overbought = 65
    
    def calculate_ema(self, prices, period):
        """計算EMA"""
        if len(prices) < period:
            return None
        multiplier = 2 / (period + 1)
        ema = prices[0]
        for price in prices[1:]:
            ema = (price * multiplier) + (ema * (1 - multiplier))
        return ema
    
    def calculate_rsi(self, prices, period=14):
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
        return 100 - (100 / (1 + rs))
    
    def update(self, price):
        """更新數據"""
        self.prices.append(price)
        
        # 只保留最近100個價格
        if len(self.prices) > 100:
            self.prices = self.prices[-100:]
        
        # 計算EMA
        self.ema_9 = self.calculate_ema(self.prices, self.ema_fast)
        self.ema_21 = self.calculate_ema(self.prices, self.ema_slow)
        
        # 計算RSI
        self.rsi = self.calculate_rsi(self.prices, self.rsi_period)
    
    def should_long(self):
        """是否應該做多"""
        if self.ema_9 is None or self.ema_21 is None or self.rsi is None:
            return False, "數據不足"
        
        # 信號1: 9 EMA 上穿 21 EMA
        # 需要知道之前嘅EMA關係，找最近轉折點
        if len(self.prices) < 25:
            return False, "歷史數據不足"
        
        # 計算前一個EMA差值
        prev_prices = self.prices[:-1]
        prev_ema_fast = self.calculate_ema(prev_prices, self.ema_fast)
        prev_ema_slow = self.calculate_ema(prev_prices, self.ema_slow)
        
        # 前一時段 EMA9 < EMA21，當前 EMA9 > EMA21 = 金叉
        if prev_ema_fast and prev_ema_slow:
            if prev_ema_fast <= prev_ema_slow and self.ema_9 > self.ema_21:
                # RSI 確認不是超買
                if self.rsi < self.rsi_overbought:
                    return True, f"9 EMA上穿21 EMA + RSI={self.rsi:.1f}"
        
        return False, f"未觸發 (EMA9={self.ema_9:.2f}, EMA21={self.ema_21:.2f}, RSI={self.rsi:.1f})"
    
    def should_short(self):
        """是否應該做空"""
        if self.ema_9 is None or self.ema_21 is None or self.rsi is None:
            return False, "數據不足"
        
        if len(self.prices) < 25:
            return False, "歷史數據不足"
        
        # 計算前一個EMA差值
        prev_prices = self.prices[:-1]
        prev_ema_fast = self.calculate_ema(prev_prices, self.ema_fast)
        prev_ema_slow = self.calculate_ema(prev_prices, self.ema_slow)
        
        # 前一時段 EMA9 > EMA21，當前 EMA9 < EMA21 = 死叉
        if prev_ema_fast and prev_ema_slow:
            if prev_ema_fast >= prev_ema_slow and self.ema_9 < self.ema_21:
                # RSI 確認不是超賣
                if self.rsi > self.rsi_oversold:
                    return True, f"9 EMA下穿21 EMA + RSI={self.rsi:.1f}"
        
        return False, f"未觸發"
    
    def check_exit_long(self, current_price):
        """檢查是否應該平多"""
        if self.entry_price == 0:
            return False, ""
        
        # 止損
        if current_price <= self.entry_price * (1 - Config.STOP_LOSS_TICKS):
            return True, f"止損 @{current_price:.2f}"
        
        # 止盈
        if current_price >= self.entry_price * (1 + Config.TAKE_PROFIT_TICKS):
            return True, f"止盈 @{current_price:.2f}"
        
        # RSI 超買
        if self.rsi and self.rsi > 70:
            return True, f"RSI超買 @{self.rsi:.1f}"
        
        # EMA 死叉
        if self.ema_9 and self.ema_21 and self.ema_9 < self.ema_21:
            return True, f"EMA死叉"
        
        return False, ""
    
    def check_exit_short(self, current_price):
        """檢查是否應該平空"""
        if self.entry_price == 0:
            return False, ""
        
        # 止損
        if current_price >= self.entry_price * (1 + Config.STOP_LOSS_TICKS):
            return True, f"止損 @{current_price:.2f}"
        
        # 止盈
        if current_price <= self.entry_price * (1 - Config.TAKE_PROFIT_TICKS):
            return True, f"止盈 @{current_price:.2f}"
        
        # RSI 超賣
        if self.rsi and self.rsi < 30:
            return True, f"RSI超賣 @{self.rsi:.1f}"
        
        # EMA 金叉
        if self.ema_9 and self.ema_21 and self.ema_9 > self.ema_21:
            return True, f"EMA金叉"
        
        return False, ""


# ============================================
# 交易系統
# ============================================

class ShortTermTrader:
    """短炒交易系統"""
    
    def __init__(self, stock_list):
        self.stock_list = stock_list
        self.strategies = {code: ScalpingStrategy(code) for code in stock_list}
        
        self.quote_ctx = None
        self.trade_ctx = None
        
        # 交易記錄
        self.trades = []
        self.daily_trades = 0
        self.daily_pnl = 0
        self.positions = {}
        
        # 狀態
        self.current_direction = {code: TradeDirection.NONE for code in stock_list}
        self.entry_prices = {code: 0 for code in stock_list}
    
    def connect(self):
        """連接"""
        try:
            self.quote_ctx = ft.OpenQuoteContext(host=Config.HOST, port=Config.PORT)
            self.trade_ctx = ft.OpenTradeContext(host=Config.HOST, port=Config.PORT)
            print("✅ 連接成功")
            return True
        except Exception as e:
            print(f"❌ 連接失敗: {e}")
            return False
    
    def disconnect(self):
        """斷開"""
        if self.quote_ctx:
            self.quote_ctx.close()
        if self.trade_ctx:
            self.trade_ctx.close()
        print("🔌 已斷開連接")
    
    def get_realtime_price(self, stock_code):
        """獲取實時價格"""
        try:
            ret, data = self.quote_ctx.get_stock_quote(stock_code)
            if ret == 0:
                return float(data['last'][0])
            return None
        except:
            return None
    
    def is_market_open(self):
        """檢查是否在交易時間"""
        now = datetime.now().time()
        return Config.MARKET_OPEN <= now <= Config.MARKET_CLOSE
    
    def buy(self, stock_code, quantity):
        """買入"""
        try:
            ret, data = self.trade_ctx.place_order(
                price=0,
                qty=quantity,
                code=stock_code,
                trd_side=ft.TrdSide.BUY,
                order_type=ft.OrderType.NORMAL,
                trd_env=Config.TRADE_ENV
            )
            if ret == 0:
                print(f"🟢 買入 {stock_code}: {quantity}股")
                return True
            print(f"❌ 買入失敗: {data}")
            return False
        except Exception as e:
            print(f"❌ 買入異常: {e}")
            return False
    
    def sell(self, stock_code, quantity):
        """賣出"""
        try:
            ret, data = self.trade_ctx.place_order(
                price=0,
                qty=quantity,
                code=stock_code,
                trd_side=ft.TrdSide.SELL,
                order_type=ft.OrderType.NORMAL,
                trd_env=Config.TRADE_ENV
            )
            if ret == 0:
                print(f"🔴 賣出 {stock_code}: {quantity}股")
                return True
            print(f"❌ 賣出失敗: {data}")
            return False
        except Exception as e:
            print(f"❌ 賣出異常: {e}")
            return False
    
    def calculate_position_size(self, price):
        """計算倉位大小"""
        max_shares = int((Config.INITIAL_CAPITAL * Config.MAX_POSITION_SIZE) / price)
        # 向下取整到100股 (美股基本單位)
        return (max_shares // 100) * 100
    
    def run(self, interval=5, iterations=None):
        """
        運行短炒系統
        
        Args:
            interval: 檢查間隔 (秒)
            iterations: 運行次數
        """
        print("=" * 60)
        print("🚀 美股短炒系統啟動 (Scalping)")
        print(f"📈 股票: {', '.join(self.stock_list)}")
        print(f"💰 起始資金: ${Config.INITIAL_CAPITAL}")
        print(f"🎯 止損: {Config.STOP_LOSS_TICKS*100}% | 止盈: {Config.TAKE_PROFIT_TICKS*100}%")
        print(f"⏰ 交易時段: {Config.MARKET_OPEN} - {Config.MARKET_CLOSE}")
        print("=" * 60)
        
        count = 0
        
        while iterations is None or count < iterations:
            count += 1
            
            # 檢查交易時間
            if not self.is_market_open():
                print(f"\n⏰ 非交易時段 ({datetime.now().strftime('%H:%M:%S')})")
                time.sleep(60)
                continue
            
            print(f"\n--- 掃描 #{count} [{datetime.now().strftime('%H:%M:%S')}] ---")
            
            for stock_code in self.stock_list:
                # 獲取實時價格
                price = self.get_realtime_price(stock_code)
                if price is None:
                    continue
                
                # 更新策略
                strategy = self.strategies[stock_code]
                strategy.update(price)
                
                direction = self.current_direction[stock_code]
                entry_price = self.entry_prices[stock_code]
                
                # === 平倉檢查 ===
                if direction == TradeDirection.LONG:
                    should_exit, reason = strategy.check_exit_long(price)
                    if should_exit:
                        print(f"📤 平多 {stock_code}: {reason}")
                        self.sell(stock_code, self.positions.get(stock_code, 100))
                        self.current_direction[stock_code] = TradeDirection.NONE
                        self.entry_prices[stock_code] = 0
                        self.daily_trades += 1
                        continue
                
                elif direction == TradeDirection.SHORT:
                    should_exit, reason = strategy.check_exit_short(price)
                    if should_exit:
                        print(f"📤 平空 {stock_code}: {reason}")
                        self.buy(stock_code, self.positions.get(stock_code, 100))
                        self.current_direction[stock_code] = TradeDirection.NONE
                        self.entry_prices[stock_code] = 0
                        self.daily_trades += 1
                        continue
                
                # === 開倉檢查 ===
                if direction == TradeDirection.NONE:
                    # 檢查是否超過每日交易限制
                    if self.daily_trades >= Config.MAX_DAILY_TRADES:
                        print(f"⚠️ 今日交易次數已達上限 ({self.daily_trades})")
                        continue
                    
                    # 檢查做多信號
                    should_long, reason_long = strategy.should_long()
                    if should_long:
                        qty = self.calculate_position_size(price)
                        if qty >= 100:
                            print(f"📗 做多 {stock_code}: {reason_long} @ ${price:.2f}")
                            if self.buy(stock_code, qty):
                                self.current_direction[stock_code] = TradeDirection.LONG
                                self.entry_prices[stock_code] = price
                                self.positions[stock_code] = qty
                                self.daily_trades += 1
                        continue
                    
                    # 檢查做空信號
                    should_short, reason_short = strategy.should_short()
                    if should_short:
                        qty = self.calculate_position_size(price)
                        if qty >= 100:
                            print(f"📘 做空 {stock_code}: {reason_short} @ ${price:.2f}")
                            if self.sell(stock_code, qty):
                                self.current_direction[stock_code] = TradeDirection.SHORT
                                self.entry_prices[stock_code] = price
                                self.positions[stock_code] = qty
                                self.daily_trades += 1
            
            # 顯示持倉狀態
            active_positions = [f"{code}: {self.current_direction[code].value}" 
                              for code in self.stock_list 
                              if self.current_direction[code] != TradeDirection.NONE]
            if active_positions:
                print(f"📦 持倉: {', '.join(active_positions)}")
            
            print(f"📊 今日交易: {self.daily_trades}/{Config.MAX_DAILY_TRADES}")
            
            if iterations is None or count < iterations:
                time.sleep(interval)
        
        print("\n✅ 系統結束")
        return self.trades


# ============================================
# 主程序
# ============================================

if __name__ == "__main__":
    # 短炒股票列表 (波動性大嘅)
    SHORT_TERM_STOCKS = [
        "US.NVDA",   # NVIDIA - AI概念，波動大
        "US.TSLA",   # Tesla - ，散戶最愛
        "US.AMD",    # AMD - 晶片股
        "US.QCOM",   # Qualcomm - 晶片股
    ]
    
    # 創建交易系統
    trader = ShortTermTrader(stock_list=SHORT_TERM_STOCKS)
    
    # 連接
    if trader.connect():
        try:
            # 運行 (每5秒檢查一次，演示用)
            trader.run(interval=5, iterations=100)
        except KeyboardInterrupt:
            print("\n⚠️ 用戶中斷")
        finally:
            trader.disconnect()
    else:
        print("❌ 無法連接富途OpenD")
