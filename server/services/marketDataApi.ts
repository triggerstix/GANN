// Market data service using Manus Data API (Yahoo Finance)
import { callDataApi } from "../_core/dataApi";

export async function getMarketData(symbol: string) {
  try {
    const response = await callDataApi("YahooFinance/get_stock_chart", {
      query: {
        symbol: symbol,
        region: 'US',
        interval: '1d',
        range: '1d',
        includeAdjustedClose: true,
      },
    });

    if (!response || !response.chart || !response.chart.result || response.chart.result.length === 0) {
      throw new Error(`No data found for symbol ${symbol}`);
    }

    const result = response.chart.result[0];
    const meta = result.meta;
    const quotes = result.indicators.quote[0];
    const timestamps = result.timestamp;

    // Get the latest data point
    const lastIndex = timestamps.length - 1;
    const currentPrice = meta.regularMarketPrice || quotes.close[lastIndex] || 0;
    const previousClose = meta.chartPreviousClose || 0;
    const change = currentPrice - previousClose;
    const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

    return {
      symbol: meta.symbol || symbol,
      price: currentPrice,
      change: change,
      changePercent: changePercent,
      high: meta.regularMarketDayHigh || quotes.high[lastIndex] || currentPrice,
      low: meta.regularMarketDayLow || quotes.low[lastIndex] || currentPrice,
      open: meta.regularMarketOpen || quotes.open[lastIndex] || currentPrice,
      volume: meta.regularMarketVolume || quotes.volume[lastIndex] || 0,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching market data for ${symbol}:`, error);
    throw new Error(`Failed to fetch market data for ${symbol}`);
  }
}

export async function getHistoricalData(symbol: string, days: number = 90, interval: string = '1d') {
  try {
    // Map days to range parameter
    let range = '3mo'; // default
    if (days <= 5) range = '5d';
    else if (days <= 30) range = '1mo';
    else if (days <= 90) range = '3mo';
    else if (days <= 180) range = '6mo';
    else if (days <= 365) range = '1y';
    else range = '2y';

    const response = await callDataApi("YahooFinance/get_stock_chart", {
      query: {
        symbol: symbol,
        region: 'US',
        interval: interval,
        range: range,
        includeAdjustedClose: true,
      },
    });

    if (!response || !response.chart || !response.chart.result || response.chart.result.length === 0) {
      throw new Error(`No historical data found for symbol ${symbol}`);
    }

    const result = response.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    return timestamps.map((ts: number, index: number) => ({
      date: new Date(ts * 1000).toISOString().split('T')[0],
      timestamp: ts * 1000,
      open: quotes.open[index] || 0,
      high: quotes.high[index] || 0,
      low: quotes.low[index] || 0,
      close: quotes.close[index] || 0,
      volume: quotes.volume[index] || 0,
    })).filter((item: any) => item.close > 0); // Filter out invalid data points
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw new Error(`Failed to fetch historical data for ${symbol}`);
  }
}

// Calculate Gann angles from a pivot point
export function calculateGannAngles(pivotPrice: number, pivotDate: string, currentDate: string) {
  const angles = [
    { name: '1x8', angle: 7.5, multiplier: 0.125, color: '#ff6464' },
    { name: '1x4', angle: 15, multiplier: 0.25, color: '#ff9664' },
    { name: '1x2', angle: 26.25, multiplier: 0.5, color: '#ffc864' },
    { name: '1x1', angle: 45, multiplier: 1, color: '#64ff64' },
    { name: '2x1', angle: 63.75, multiplier: 2, color: '#64c8ff' },
    { name: '4x1', angle: 75, multiplier: 4, color: '#6496ff' },
    { name: '8x1', angle: 82.5, multiplier: 8, color: '#9664ff' },
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

// Find major pivots in historical data
export function findMajorPivots(historicalData: any[]) {
  if (!historicalData || historicalData.length === 0) {
    return null;
  }

  let majorHigh = historicalData[0];
  let majorLow = historicalData[0];

  for (const dataPoint of historicalData) {
    if (dataPoint.high > majorHigh.high) {
      majorHigh = dataPoint;
    }
    if (dataPoint.low < majorLow.low && dataPoint.low > 0) {
      majorLow = dataPoint;
    }
  }

  return {
    majorHigh: {
      price: majorHigh.high,
      date: majorHigh.date,
      timestamp: majorHigh.timestamp,
    },
    majorLow: {
      price: majorLow.low,
      date: majorLow.date,
      timestamp: majorLow.timestamp,
    },
  };
}

