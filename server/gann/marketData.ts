const symbols = {
  AAPL: { name: 'Apple Inc.', basePrice: 175 },
  GOOGL: { name: 'Alphabet Inc.', basePrice: 140 },
  MSFT: { name: 'Microsoft Corporation', basePrice: 380 },
  TSLA: { name: 'Tesla, Inc.', basePrice: 250 },
  SPY: { name: 'SPDR S&P 500 ETF', basePrice: 450 },
  'BTC-USD': { name: 'Bitcoin USD', basePrice: 45000 },
  'ETH-USD': { name: 'Ethereum USD', basePrice: 2500 },
};

const currentPrices: Record<string, number> = {};

export function getMarketData(symbol: string) {
  const symbolData = symbols[symbol as keyof typeof symbols];
  if (!symbolData) return null;

  const basePrice = symbolData.basePrice;
  const currentPrice = currentPrices[symbol] || basePrice;
  const change = currentPrice - basePrice;
  const changePercent = basePrice !== 0 ? (change / basePrice) * 100 : 0;

  return {
    symbol,
    name: symbolData.name,
    price: Math.round(currentPrice * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    open: Math.round(basePrice * 100) / 100,
    high: Math.round(Math.max(currentPrice, basePrice + Math.random() * 5) * 100) / 100,
    low: Math.round(Math.min(currentPrice, basePrice - Math.random() * 5) * 100) / 100,
    volume: Math.floor(Math.random() * 40000000) + 10000000,
    marketCap: Math.floor(Math.random() * 900000000000) + 100000000000,
    pe: Math.round((Math.random() * 20 + 15) * 100) / 100,
    dividendYield: Math.round(Math.random() * 3 * 100) / 100,
    week52High: Math.round((basePrice + 20 + Math.random() * 10) * 100) / 100,
    week52Low: Math.round((basePrice - 25 - Math.random() * 10) * 100) / 100,
  };
}

export function getHistoricalData(symbol: string, days: number = 60) {
  const symbolData = symbols[symbol as keyof typeof symbols];
  if (!symbolData) return [];

  const data = [];
  let price = symbolData.basePrice;
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i));
    price = price + (Math.random() - 0.5) * 5;
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
    });
  }
  return data;
}

export function getGannAnglesData(symbol: string, pivotPrice: number, pivotIndex: number, days: number = 60) {
  const historicalData = getHistoricalData(symbol, days);
  if (!historicalData.length) return [];

  pivotIndex = Math.max(0, Math.min(pivotIndex, historicalData.length - 1));
  const actualPivotPrice = historicalData[pivotIndex]?.price || pivotPrice;

  return historicalData.map((entry, i) => {
    const timeDiff = i - pivotIndex;
    return {
      date: entry.date,
      price: entry.price,
      gann1x1: actualPivotPrice + timeDiff * 1,
      gann1x2: actualPivotPrice + timeDiff * 0.5,
      gann2x1: actualPivotPrice + timeDiff * 2,
      gann1x3: actualPivotPrice + timeDiff * (1 / 3),
      gann3x1: actualPivotPrice + timeDiff * 3,
    };
  });
}

export function getTimeCyclesData(symbol: string, days: number = 365) {
  const symbolData = symbols[symbol as keyof typeof symbols];
  if (!symbolData) return [];

  const data = [];
  const price = symbolData.basePrice;
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i));
    const cycle30 = 10 * (Math.random() - 0.5);
    const cycle90 = 15 * (Math.random() - 0.5);
    const cycle180 = 20 * (Math.random() - 0.5);
    const noise = (Math.random() - 0.5) * 5;
    const currentPrice = price + cycle30 + cycle90 + cycle180 + noise;

    data.push({
      day: i + 1,
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice * 100) / 100,
      cycle30: Math.round((price + cycle30) * 100) / 100,
      cycle90: Math.round((price + cycle90) * 100) / 100,
      cycle180: Math.round((price + cycle180) * 100) / 100,
      isCyclePoint: i % 30 === 0 || i % 90 === 0 || i % 180 === 0,
    });
  }
  return data;
}

