export interface MarketDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketInfo {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  marketCap: string;
}

const basePrice: Record<string, number> = {
  'AAPL': 175.50,
  'GOOGL': 140.25,
  'MSFT': 380.75,
  'TSLA': 245.30,
  'SPY': 450.80,
  'BTC-USD': 42500,
  'ETH-USD': 2250,
};

export function getMarketData(symbol: string): MarketInfo {
  const base = basePrice[symbol] || 100;
  const randomChange = (Math.random() - 0.5) * base * 0.02;
  const price = base + randomChange;
  const change = randomChange;
  const changePercent = (change / base) * 100;

  return {
    symbol,
    price: Number(price.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    high: Number((price * 1.02).toFixed(2)),
    low: Number((price * 0.98).toFixed(2)),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    marketCap: `$${(Math.random() * 1000 + 100).toFixed(2)}B`,
  };
}

export function getHistoricalData(symbol: string, days: number = 30): MarketDataPoint[] {
  const data: MarketDataPoint[] = [];
  const base = basePrice[symbol] || 100;
  let currentPrice = base;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = 0.02;
    const trend = (Math.random() - 0.5) * base * volatility;
    currentPrice = currentPrice + trend;
    
    const open = currentPrice;
    const close = currentPrice + (Math.random() - 0.5) * base * volatility;
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
    
    currentPrice = close;
  }

  return data;
}
