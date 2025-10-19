// Technical Indicators for Trading Charts

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface IndicatorData {
  time: number;
  value: number;
}

// Simple Moving Average (SMA)
export function calculateSMA(data: CandleData[], period: number): IndicatorData[] {
  const result: IndicatorData[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push({
      time: data[i].time,
      value: sum / period,
    });
  }
  
  return result;
}

// Exponential Moving Average (EMA)
export function calculateEMA(data: CandleData[], period: number): IndicatorData[] {
  const result: IndicatorData[] = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA for first value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  let ema = sum / period;
  result.push({ time: data[period - 1].time, value: ema });
  
  // Calculate EMA for remaining values
  for (let i = period; i < data.length; i++) {
    ema = (data[i].close - ema) * multiplier + ema;
    result.push({ time: data[i].time, value: ema });
  }
  
  return result;
}

// Relative Strength Index (RSI)
export function calculateRSI(data: CandleData[], period: number = 14): IndicatorData[] {
  const result: IndicatorData[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }
  
  // Calculate initial average gain and loss
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  // Calculate RSI
  for (let i = period; i < data.length; i++) {
    const rs = avgGain / (avgLoss || 1);
    const rsi = 100 - (100 / (1 + rs));
    result.push({ time: data[i].time, value: rsi });
    
    // Update averages
    avgGain = ((avgGain * (period - 1)) + gains[i - 1]) / period;
    avgLoss = ((avgLoss * (period - 1)) + losses[i - 1]) / period;
  }
  
  return result;
}

// MACD (Moving Average Convergence Divergence)
export function calculateMACD(
  data: CandleData[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macd: IndicatorData[]; signal: IndicatorData[]; histogram: IndicatorData[] } {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  // Calculate MACD line
  const macdLine: IndicatorData[] = [];
  const startIndex = slowPeriod - fastPeriod;
  
  for (let i = 0; i < slowEMA.length; i++) {
    macdLine.push({
      time: slowEMA[i].time,
      value: fastEMA[i + startIndex].value - slowEMA[i].value,
    });
  }
  
  // Calculate signal line (EMA of MACD)
  const signalLine: IndicatorData[] = [];
  const multiplier = 2 / (signalPeriod + 1);
  
  let sum = 0;
  for (let i = 0; i < signalPeriod; i++) {
    sum += macdLine[i].value;
  }
  let ema = sum / signalPeriod;
  signalLine.push({ time: macdLine[signalPeriod - 1].time, value: ema });
  
  for (let i = signalPeriod; i < macdLine.length; i++) {
    ema = (macdLine[i].value - ema) * multiplier + ema;
    signalLine.push({ time: macdLine[i].time, value: ema });
  }
  
  // Calculate histogram
  const histogram: IndicatorData[] = [];
  for (let i = 0; i < signalLine.length; i++) {
    const macdIndex = i + signalPeriod - 1;
    histogram.push({
      time: signalLine[i].time,
      value: macdLine[macdIndex].value - signalLine[i].value,
    });
  }
  
  return { macd: macdLine, signal: signalLine, histogram };
}

// Bollinger Bands
export function calculateBollingerBands(
  data: CandleData[],
  period: number = 20,
  stdDev: number = 2
): { upper: IndicatorData[]; middle: IndicatorData[]; lower: IndicatorData[] } {
  const middle = calculateSMA(data, period);
  const upper: IndicatorData[] = [];
  const lower: IndicatorData[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    // Calculate standard deviation
    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((sum, d) => sum + d.close, 0) / period;
    const variance = slice.reduce((sum, d) => sum + Math.pow(d.close - mean, 2), 0) / period;
    const sd = Math.sqrt(variance);
    
    const middleValue = middle[i - period + 1].value;
    upper.push({ time: data[i].time, value: middleValue + (stdDev * sd) });
    lower.push({ time: data[i].time, value: middleValue - (stdDev * sd) });
  }
  
  return { upper, middle, lower };
}

// Volume Weighted Average Price (VWAP)
export function calculateVWAP(data: CandleData[]): IndicatorData[] {
  const result: IndicatorData[] = [];
  let cumulativeTPV = 0; // Typical Price * Volume
  let cumulativeVolume = 0;
  
  for (let i = 0; i < data.length; i++) {
    const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3;
    const volume = data[i].volume || 0;
    
    cumulativeTPV += typicalPrice * volume;
    cumulativeVolume += volume;
    
    result.push({
      time: data[i].time,
      value: cumulativeVolume > 0 ? cumulativeTPV / cumulativeVolume : typicalPrice,
    });
  }
  
  return result;
}

