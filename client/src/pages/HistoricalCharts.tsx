import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { AdvancedChart } from '../components/AdvancedChart';

export default function HistoricalCharts() {
  const [symbol, setSymbol] = useState('AAPL');
  const [customSymbol, setCustomSymbol] = useState('');
  const [showVolume, setShowVolume] = useState(true);
  const [showGannAngles, setShowGannAngles] = useState(false);
  const [gannPivotPrice, setGannPivotPrice] = useState('100');
  const [gannPivotDate, setGannPivotDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

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
            <h1 className="text-4xl font-bold text-white mb-2">📊 Advanced Charts</h1>
            <p className="text-slate-300">
              Professional candlestick charts with Webull-style features
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
              className="px-6 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors"
            >
              Load
            </button>
          </div>
        </div>

        {/* Chart Options */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Chart Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Volume Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">Show Volume</label>
              <button
                onClick={() => setShowVolume(!showVolume)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showVolume ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showVolume ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Gann Angles Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">Show Gann Angles</label>
              <button
                onClick={() => setShowGannAngles(!showGannAngles)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showGannAngles ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showGannAngles ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Gann Angle Settings */}
          {showGannAngles && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Gann Angle Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Pivot Price
                  </label>
                  <input
                    type="number"
                    value={gannPivotPrice}
                    onChange={(e) => setGannPivotPrice(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100.00"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Pivot Date
                  </label>
                  <input
                    type="date"
                    value={gannPivotDate}
                    onChange={(e) => setGannPivotDate(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
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
          <AdvancedChart
            symbol={symbol}
            data={historicalData}
            height={600}
            showVolume={showVolume}
            showGannAngles={showGannAngles}
            gannPivotPrice={showGannAngles ? parseFloat(gannPivotPrice) : undefined}
            gannPivotDate={showGannAngles ? gannPivotDate : undefined}
          />
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
                <p className="text-slate-300">Scroll to zoom, drag to pan, pinch on mobile</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">➕</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Crosshair</h4>
                <p className="text-slate-300">Hover to see exact price and time values</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Volume Bars</h4>
                <p className="text-slate-300">Color-coded volume histogram below price</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📐</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Gann Angles</h4>
                <p className="text-slate-300">Overlay Gann support/resistance lines</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <h4 className="font-semibold text-white mb-1">Multiple Timeframes</h4>
                <p className="text-slate-300">1m, 5m, 15m, 1H, 4H, 1D, 1W, 1M (coming soon)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

