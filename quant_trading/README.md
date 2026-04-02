# 📈 美股自動化交易系統

基於富途OpenAPI嘅Python量化交易系統 🐉

## 🚀 功能特點

| 功能 | 說明 |
|------|------|
| 📊 實時行情 | 自動獲取美股報價 |
| 📈 技術分析 | MACD/RSI/MA/突破策略 |
| 🤖 自動交易 | 根據策略自動買賣 |
| 🛡️ 風險管理 | 止損/止盈/持倉限制 |
| 📝 交易日誌 | 完整記錄所有操作 |

## 📋 系統要求

- Python 3.7+
- 富途牛牛 / moomoo 帳戶
- 富途OpenD 網關程序

## 🛠️ 安裝步驟

### 1️⃣ 安裝富途OpenD

```bash
# 下載地址：
# https://www.futunn.com/OpenAPI
```

選擇適合你系統嘅版本安裝，然後：
- 開啟 OpenD
- 登入你嘅富途帳戶
- 確認端口係 11111（預設）

### 2️⃣ 安裝Python SDK

```bash
pip install futu-api
```

### 3️⃣ 複製交易代碼

```bash
# 將 futu_trader.py 複製到你的項目
cp futu_trader.py /你的目錄/
```

## 📖 使用教程

### 基本用法

```python
from futu_trader import USStockTrader, TradeStrategy

# 創建交易系統
trader = USStockTrader(
    stock_list=["US.AAPL", "US.TSLA", "US.NVDA"],
    strategy_type=TradeStrategy.MACD
)

# 連接並運行
if trader.connect():
    trader.run(interval_seconds=60, iterations=10)
    trader.disconnect()
```

### 選擇策略

```python
# MACD 策略（推薦新手）
strategy = TradeStrategy.MACD

# RSI 策略
strategy = TradeStrategy.RSI

# 突破策略
strategy = TradeStrategy.BREAKOUT
```

### 配置設定

在 `Config` 類入面修改：

```python
class Config:
    INITIAL_CAPITAL = 10000      # 起始資金
    MAX_POSITION_SIZE = 0.2     # 最大持倉 20%
    MAX_POSITIONS = 5           # 最多5支股票
    STOP_LOSS_PERCENT = 0.05    # 止損 5%
    TAKE_PROFIT_PERCENT = 0.15  # 止盈 15%
    TRADE_ENV = ft.TrdEnv.SIMULATE  # 模擬交易
```

## ⚠️ 重要提醒

### 模擬交易
- 預設使用 `TrdEnv.SIMULATE` 模擬交易
- 正式交易前請充分測試
- 修改為 `TrdEnv.REAL` 之前請確認清楚

### 風險警告
```
❌ 量化交易有風險
❌ 過去表現不代表未來收益
❌ 請只用你可以承受損失的資金
❌ 必須設置止損
```

## 📊 支援股票

| 股票 | 代碼 | 類型 |
|------|------|------|
| 蘋果 | US.AAPL | 科技股 |
| 特斯拉 | US.TSLA | 電動車 |
| NVIDIA | US.NVDA | AI/晶片 |
| 標普500 ETF | US.SPY | 指數ETF |
| 納斯達克 ETF | US.QQQ | 指數ETF |

## 🐍 策略說明

### MACD策略
- 適用於趨勢市場
- 信號：MACD金叉買入，死叉賣出

### RSI策略
- 適用於震盪市場
- 信號：RSI<30超賣買入，RSI>70超買賣出

### 突破策略
- 適用於短線交易
- 信號：價格突破N日新高買入

## 📝 輸出示例

```
[2026-04-02 20:10:00] 🚀 美股自動交易系統啟動
[2026-04-02 20:10:00] 📈 股票: US.AAPL, US.TSLA, US.NVDA
[2026-04-02 20:10:01] ✅ 行情連接成功
[2026-04-02 20:10:01] ✅ 交易連接成功
[2026-04-02 20:10:02] 📊 US.AAPL: $175.50
[2026-04-02 20:10:02] 🟢 買入 US.AAPL: 11股, 成本 $175.50
[2026-04-02 20:11:02] ⚠️ 止損觸發 US.AAPL
[2026-04-02 20:11:02] 🔴 賣出 US.AAPL: 止損
```

## 🔧 故障排除

### 連接失敗
```
1. 確認 OpenD 已運行
2. 確認端口 11111 正確
3. 確認已登入帳戶
```

### 數據獲取失敗
```
1. 檢查網絡連接
2. 確認股票代碼正確
3. 確認有行情權限
```

## 📜 License

僅供學習研究使用，不構成投資建議 ⚠️
