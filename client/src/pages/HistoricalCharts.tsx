import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { WebullChart } from '../components/WebullChart';

export default function HistoricalCharts() {
  const [symbol, setSymbol] = useState('AAPL');
  const [customSymbol, setCustomSymbol] = useState('');

  const { data: historicalData, isLoading } = trpc.gann.getHistoricalData.useQuery({
    symbol,
    days: 90,
  });

  const popularSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'SPY', 'BTC-USD', 'ETH-USD'];

  const handleLoadCustomSymbol = () => {
    if (customSymbol.trim()) {
      setSymbol(customSymbol.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <a
              href="/"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors"
            >
              ← Back
            </a>
            <h1 className="text-4xl font-bold text-white mb-2">📊 Webull-Style Advanced Charts</h1>
            <p className="text-slate-300">
              Professional candlestick charts with zoom, pan, and technical indicators
            </p>
          </div>
        </div>

        {/* Symbol Selection */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Select Symbol</h2>
          <p className="text-slate-400 text-sm mb-4">
            Choose a symbol or enter your own
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {popularSymbols.map((sym) => (
              <button
                key={sym}
                onClick={() => setSymbol(sym)}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  symbol === sym
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customSymbol}
              onChange={(e) => setCustomSymbol(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLoadCustomSymbol()}
              placeholder="Enter symbol..."
              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLoadCustomSymbol}
              className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
            >
              Load
            </button>
          </div>
        </div>

        {/* Chart */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96 bg-slate-800 rounded-lg border border-slate-700">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading chart data...</p>
            </div>
          </div>
        ) : historicalData && historicalData.length > 0 ? (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <WebullChart
              symbol={symbol}
              data={historicalData}
              height={600}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 bg-slate-800 rounded-lg border border-slate-700">
            <div className="text-center">
              <p className="text-slate-400 text-lg mb-2">No data available</p>
              <p className="text-slate-500 text-sm">Try selecting a different symbol</p>
            </div>
          </div>
        )}

        {/* Features Info */}
        <div className="mt-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">✨ Webull-Style Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Candlestick Charts</h4>
                <p className="text-slate-300">Professional OHLC visualization with green/red candles</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Zoom & Pan</h4>
                <p className="text-slate-300">Zoom in/out and pan left/right with dedicated buttons</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">➕</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Detailed Tooltips</h4>
                <p className="text-slate-300">Hover to see OHLCV data, change, and percentage</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Volume Analysis</h4>
                <p className="text-slate-300">Separate volume chart with toggle control</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📉</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Technical Indicators</h4>
                <p className="text-slate-300">SMA 20/50, EMA 12, Bollinger Bands overlays</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Multiple Timeframes</h4>
                <p className="text-slate-300">1m, 5m, 15m, 1H, 4H, 1D, 1W, 1M (UI ready)</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-6 bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">About Professional Charts</h3>
          <div className="text-slate-400 text-sm space-y-3">
            <p>
              <strong className="text-slate-300">Candlestick Charts</strong> are the industry standard for visualizing price action. Each candle shows four key prices: Open, High, Low, and Close (OHLC). Green candles indicate the price closed higher than it opened (bullish), while red candles show the price closed lower (bearish).
            </p>
            <p>
              <strong className="text-slate-300">Technical Indicators</strong> help identify trends and potential trading opportunities:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>SMA (Simple Moving Average):</strong> Smooths price data to identify trend direction</li>
              <li><strong>EMA (Exponential Moving Average):</strong> Gives more weight to recent prices for faster signals</li>
              <li><strong>Bollinger Bands:</strong> Shows volatility and potential overbought/oversold conditions</li>
            </ul>
            <p>
              <strong className="text-slate-300">Volume</strong> confirms price movements. High volume on green candles suggests strong buying pressure, while high volume on red candles indicates strong selling pressure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

