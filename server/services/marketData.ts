// Market data service for W.D. Gann Trading Platform
import { z } from "zod";

export const MarketDataSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  change: z.number(),
  changePercent: z.number(),
  high: z.number(),
  low: z.number(),
  open: z.number(),
  volume: z.number(),
  timestamp: z.date(),
});

export type MarketData = z.infer<typeof MarketDataSchema>;

export const HistoricalDataPointSchema = z.object({
  date: z.string(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
});

export type HistoricalDataPoint = z.infer<typeof HistoricalDataPointSchema>;

// Simulate market data for demonstration
export function getMarketData(symbol: string): MarketData {
  const basePrice = getBasePrice(symbol);
  const change = (Math.random() - 0.5) * basePrice * 0.05;
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol,
    price: basePrice + change,
    change,
    changePercent,
    high: basePrice + Math.abs(change) * 1.5,
    low: basePrice - Math.abs(change) * 1.5,
    open: basePrice,
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    timestamp: new Date(),
  };
}

export function getHistoricalData(symbol: string, days: number = 90): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const basePrice = getBasePrice(symbol);
  let currentPrice = basePrice;
  
  const endDate = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    
    const dailyChange = (Math.random() - 0.5) * currentPrice * 0.03;
    const open = currentPrice;
    const close = currentPrice + dailyChange;
    const high = Math.max(open, close) + Math.abs(dailyChange) * 0.5;
    const low = Math.min(open, close) - Math.abs(dailyChange) * 0.5;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 5000000) + 500000,
    });
    
    currentPrice = close;
  }
  
  return data;
}

function getBasePrice(symbol: string): number {
  const prices: Record<string, number> = {
    'AAPL': 180,
    'GOOGL': 140,
    'MSFT': 380,
    'TSLA': 250,
    'SPY': 450,
    'BTC-USD': 45000,
    'ETH-USD': 2500,
  };
  return prices[symbol] || 100;
}

// Calculate Gann angles from a pivot point
export function calculateGannAngles(pivotPrice: number, pivotDate: string, currentDate: string) {
  const angles = [
    { name: '1x1', angle: 45, multiplier: 1 },
    { name: '1x2', angle: 26.25, multiplier: 0.5 },
    { name: '1x4', angle: 15, multiplier: 0.25 },
    { name: '1x8', angle: 7.5, multiplier: 0.125 },
    { name: '2x1', angle: 63.75, multiplier: 2 },
    { name: '4x1', angle: 75, multiplier: 4 },
    { name: '8x1', angle: 82.5, multiplier: 8 },
  ];
  
  const pivot = new Date(pivotDate);
  const current = new Date(currentDate);
  const daysDiff = Math.floor((current.getTime() - pivot.getTime()) / (1000 * 60 * 60 * 24));
  
  return angles.map(angle => ({
    ...angle,
    upPrice: pivotPrice + (daysDiff * angle.multiplier),
    downPrice: pivotPrice - (daysDiff * angle.multiplier),
  }));
}

