import { useState, useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { calculateSMA, calculateEMA, calculateBollingerBands } from '@/lib/indicators';
import { DrawingTools, Drawing } from './DrawingTools';

interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ProcessedCandleData extends CandleData {
  time: number;
  index: number;
  formattedDate: string;
}

interface WebullChartProps {
  data: CandleData[];
  symbol: string;
  height?: number;
}

// Custom Candlestick component
const Candlestick = (props: any) => {
  const { x, y, width, height, payload } = props;
  
  if (!payload || payload.open === undefined) return null;
  
  const { open, close, high, low } = payload;
  const isGreen = close >= open;
  const color = isGreen ? '#10b981' : '#ef4444';
  
  // Calculate positions
  const bodyTop = Math.min(open, close);
  const bodyBottom = Math.max(open, close);
  const bodyHeight = Math.abs(close - open);
  
  // Wick (high-low line)
  const wickX = x + width / 2;
  
  return (
    <g>
      {/* High-Low Wick */}
      <line
        x1={wickX}
        y1={y + (high - payload.high) * (height / (payload.high - payload.low))}
        x2={wickX}
        y2={y + height - (payload.low - low) * (height / (payload.high - payload.low))}
        stroke={color}
        strokeWidth={1}
      />
      
      {/* Open-Close Body */}
      <rect
        x={x + 1}
        y={y + (high - bodyBottom) * (height / (high - low))}
        width={Math.max(width - 2, 1)}
        height={Math.max(bodyHeight * (height / (high - low)), 1)}
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

// Custom Tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload[0]) return null;
  
  const data = payload[0].payload;
  const isGreen = data.close >= data.open;
  const change = data.close - data.open;
  const changePercent = (change / data.open) * 100;
  
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
      <p className="text-xs text-slate-400 mb-2">{data.date}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-slate-400">Open:</span>
        <span className="text-white font-semibold">${data.open.toFixed(2)}</span>
        
        <span className="text-slate-400">High:</span>
        <span className="text-white font-semibold">${data.high.toFixed(2)}</span>
        
        <span className="text-slate-400">Low:</span>
        <span className="text-white font-semibold">${data.low.toFixed(2)}</span>
        
        <span className="text-slate-400">Close:</span>
        <span className={`font-semibold ${isGreen ? 'text-green-500' : 'text-red-500'}`}>
          ${data.close.toFixed(2)}
        </span>
        
        <span className="text-slate-400">Change:</span>
        <span className={`font-semibold ${isGreen ? 'text-green-500' : 'text-red-500'}`}>
          {isGreen ? '+' : ''}{change.toFixed(2)} ({isGreen ? '+' : ''}{changePercent.toFixed(2)}%)
        </span>
        
        <span className="text-slate-400">Volume:</span>
        <span className="text-white font-semibold">
          {(data.volume / 1000000).toFixed(2)}M
        </span>
      </div>
    </div>
  );
};

export function WebullChart({ data, symbol, height = 600 }: WebullChartProps) {
  const [timeframe, setTimeframe] = useState('1D');
  const [indicators, setIndicators] = useState<string[]>([]);
  const [showVolume, setShowVolume] = useState(true);
  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);

  // Process data for candlesticks
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      time: new Date(item.date).getTime(),
      index,
      formattedDate: new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
    }));
  }, [data]);

  // Calculate technical indicators
  const indicatorData = useMemo(() => {
    const result: any = {};
    
    if (indicators.includes('SMA20')) {
      const sma20 = calculateSMA(chartData, 20);
      result.sma20 = sma20;
    }
    
    if (indicators.includes('SMA50')) {
      const sma50 = calculateSMA(chartData, 50);
      result.sma50 = sma50;
    }
    
    if (indicators.includes('EMA12')) {
      const ema12 = calculateEMA(chartData, 12);
      result.ema12 = ema12;
    }
    
    if (indicators.includes('BB')) {
      const bb = calculateBollingerBands(chartData, 20, 2);
      result.bb = bb;
    }
    
    return result;
  }, [chartData, indicators]);

  // Merge indicator data with chart data
  const mergedData = useMemo(() => {
    return chartData.map((item, index) => {
      const merged: any = { ...item };
      
      if (indicatorData.sma20) {
        merged.sma20 = indicatorData.sma20[index]?.value;
      }
      if (indicatorData.sma50) {
        merged.sma50 = indicatorData.sma50[index]?.value;
      }
      if (indicatorData.ema12) {
        merged.ema12 = indicatorData.ema12[index]?.value;
      }
      if (indicatorData.bb) {
        merged.bbUpper = indicatorData.bb.upper[index]?.value;
        merged.bbMiddle = indicatorData.bb.middle[index]?.value;
        merged.bbLower = indicatorData.bb.lower[index]?.value;
      }
      
      return merged;
    });
  }, [chartData, indicatorData]);

  // Calculate display domain
  const displayData = useMemo(() => {
    if (!zoomDomain) return mergedData;
    const [start, end] = zoomDomain;
    return mergedData.slice(start, end + 1);
  }, [mergedData, zoomDomain]);

  const toggleIndicator = (indicator: string) => {
    setIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  const handleZoomIn = () => {
    if (!zoomDomain) {
      const mid = Math.floor(mergedData.length / 2);
      const range = Math.floor(mergedData.length / 4);
      setZoomDomain([Math.max(0, mid - range), Math.min(mergedData.length - 1, mid + range)]);
    } else {
      const [start, end] = zoomDomain;
      const range = end - start;
      const newRange = Math.max(10, Math.floor(range * 0.7));
      const mid = Math.floor((start + end) / 2);
      setZoomDomain([
        Math.max(0, mid - Math.floor(newRange / 2)),
        Math.min(mergedData.length - 1, mid + Math.floor(newRange / 2))
      ]);
    }
  };

  const handleZoomOut = () => {
    if (!zoomDomain) return;
    
    const [start, end] = zoomDomain;
    const range = end - start;
    const newRange = Math.min(mergedData.length, Math.floor(range * 1.5));
    const mid = Math.floor((start + end) / 2);
    const newStart = Math.max(0, mid - Math.floor(newRange / 2));
    const newEnd = Math.min(mergedData.length - 1, mid + Math.floor(newRange / 2));
    
    if (newStart === 0 && newEnd === mergedData.length - 1) {
      setZoomDomain(null);
    } else {
      setZoomDomain([newStart, newEnd]);
    }
  };

  const handleResetZoom = () => {
    setZoomDomain(null);
  };

  const handlePanLeft = () => {
    if (!zoomDomain) return;
    const [start, end] = zoomDomain;
    const range = end - start;
    const shift = Math.floor(range * 0.2);
    if (start - shift >= 0) {
      setZoomDomain([start - shift, end - shift]);
    }
  };

  const handlePanRight = () => {
    if (!zoomDomain) return;
    const [start, end] = zoomDomain;
    const range = end - start;
    const shift = Math.floor(range * 0.2);
    if (end + shift < mergedData.length) {
      setZoomDomain([start + shift, end + shift]);
    }
  };

  return (
    <div className="w-full">
      {/* Chart Controls */}
      <div className="flex flex-col gap-4 mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        {/* Top Row: Timeframe and Zoom Controls */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-300">Timeframe:</span>
            {['1m', '5m', '15m', '1H', '4H', '1D', '1W', '1M'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePanLeft}
              className="px-3 py-1 text-xs font-medium bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
              title="Pan Left"
            >
              ◀
            </button>
            <button
              onClick={handleZoomIn}
              className="px-3 py-1 text-xs font-medium bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
              title="Zoom In"
            >
              🔍+
            </button>
            <button
              onClick={handleZoomOut}
              className="px-3 py-1 text-xs font-medium bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
              title="Zoom Out"
            >
              🔍-
            </button>
            <button
              onClick={handleResetZoom}
              className="px-3 py-1 text-xs font-medium bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
              title="Reset Zoom"
            >
              ↺ Reset
            </button>
            <button
              onClick={handlePanRight}
              className="px-3 py-1 text-xs font-medium bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
              title="Pan Right"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Bottom Row: Indicators and Options */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-300">Indicators:</span>
            {['SMA20', 'SMA50', 'EMA12', 'BB'].map(ind => (
              <button
                key={ind}
                onClick={() => toggleIndicator(ind)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  indicators.includes(ind)
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              showVolume
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Volume
          </button>
        </div>
      </div>

      {/* Price Chart with Drawing Overlay */}
      <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900/50 mb-4 relative">
        <DrawingTools
          width={950}
          height={showVolume ? height * 0.7 : height}
          onDrawingsChange={(newDrawings) => setDrawings(newDrawings)}
        />
        <ResponsiveContainer width="100%" height={showVolume ? height * 0.7 : height}>
          <ComposedChart data={displayData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            
            <XAxis 
              dataKey="formattedDate" 
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            
            <YAxis 
              domain={['auto', 'auto']}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Candlesticks */}
            <Bar 
              dataKey="high" 
              shape={<Candlestick />}
              isAnimationActive={false}
            />
            
            {/* Technical Indicators */}
            {indicators.includes('SMA20') && (
              <Line 
                type="monotone" 
                dataKey="sma20" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                name="SMA 20"
                isAnimationActive={false}
              />
            )}
            
            {indicators.includes('SMA50') && (
              <Line 
                type="monotone" 
                dataKey="sma50" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={false}
                name="SMA 50"
                isAnimationActive={false}
              />
            )}
            
            {indicators.includes('EMA12') && (
              <Line 
                type="monotone" 
                dataKey="ema12" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={false}
                name="EMA 12"
                isAnimationActive={false}
              />
            )}
            
            {indicators.includes('BB') && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="bbUpper" 
                  stroke="#06b6d4" 
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                  name="BB Upper"
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="bbMiddle" 
                  stroke="#06b6d4" 
                  strokeWidth={1}
                  dot={false}
                  name="BB Middle"
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="bbLower" 
                  stroke="#06b6d4" 
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                  name="BB Lower"
                  isAnimationActive={false}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      {showVolume && (
        <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900/50">
          <ResponsiveContainer width="100%" height={height * 0.3}>
            <ComposedChart data={displayData} margin={{ top: 0, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              
              <XAxis 
                dataKey="formattedDate" 
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              
              <YAxis 
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M`, 'Volume']}
              />
              
              <Bar 
                dataKey="volume" 
                fill="#3b82f6"
                opacity={0.6}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart Info */}
      <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Symbol:</span>
            <span className="ml-2 font-semibold text-white">{symbol}</span>
          </div>
          <div>
            <span className="text-slate-400">Timeframe:</span>
            <span className="ml-2 font-semibold text-white">{timeframe}</span>
          </div>
          <div>
            <span className="text-slate-400">Candles:</span>
            <span className="ml-2 font-semibold text-white">{displayData.length}</span>
          </div>
          <div>
            <span className="text-slate-400">Indicators:</span>
            <span className="ml-2 font-semibold text-white">{indicators.length}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">📊 Webull-Style Chart Controls</h4>
        <div className="grid md:grid-cols-2 gap-2 text-xs text-slate-400">
          <div>• <strong className="text-slate-300">Zoom In/Out:</strong> Use 🔍+ and 🔍- buttons</div>
          <div>• <strong className="text-slate-300">Pan:</strong> Use ◀ and ▶ buttons to navigate</div>
          <div>• <strong className="text-slate-300">Reset View:</strong> Click ↺ Reset to show all data</div>
          <div>• <strong className="text-slate-300">Indicators:</strong> Toggle SMA, EMA, Bollinger Bands</div>
          <div>• <strong className="text-slate-300">Volume:</strong> Toggle volume chart on/off</div>
          <div>• <strong className="text-slate-300">Hover:</strong> View detailed OHLCV data</div>
        </div>
      </div>
    </div>
  );
}

