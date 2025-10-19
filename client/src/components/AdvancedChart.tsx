import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, CandlestickData, HistogramData, LineData } from 'lightweight-charts';
import { calculateSMA, calculateEMA, calculateBollingerBands } from '../lib/indicators';

interface AdvancedChartProps {
  symbol: string;
  data: any[];
  height?: number;
  showVolume?: boolean;
  showGannAngles?: boolean;
  gannPivotPrice?: number;
  gannPivotDate?: string;
}

export function AdvancedChart({ 
  symbol, 
  data, 
  height = 600,
  showVolume = true,
  showGannAngles = false,
  gannPivotPrice,
  gannPivotDate
}: AdvancedChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [timeframe, setTimeframe] = useState('1D');
  const [indicators, setIndicators] = useState<string[]>([]);

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#334155',
      },
      rightPriceScale: {
        borderColor: '#334155',
        scaleMargins: {
          top: 0.1,
          bottom: showVolume ? 0.3 : 0.1,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#64748b',
          width: 1,
          style: 2,
          labelBackgroundColor: '#3b82f6',
        },
        horzLine: {
          color: '#64748b',
          width: 1,
          style: 2,
          labelBackgroundColor: '#3b82f6',
        },
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    // Prepare candlestick data
    const candleData: CandlestickData[] = data.map(item => ({
      time: new Date(item.date).getTime() / 1000,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    candlestickSeries.setData(candleData);

    // Prepare data for indicators
    const indicatorData = data.map(item => ({
      time: new Date(item.date).getTime() / 1000,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    // Add technical indicators
    if (indicators.includes('SMA20')) {
      const sma20 = calculateSMA(indicatorData, 20);
      const sma20Series = chart.addLineSeries({
        color: '#3b82f6',
        lineWidth: 2,
        title: 'SMA 20',
      });
      sma20Series.setData(sma20);
    }

    if (indicators.includes('SMA50')) {
      const sma50 = calculateSMA(indicatorData, 50);
      const sma50Series = chart.addLineSeries({
        color: '#f59e0b',
        lineWidth: 2,
        title: 'SMA 50',
      });
      sma50Series.setData(sma50);
    }

    if (indicators.includes('EMA12')) {
      const ema12 = calculateEMA(indicatorData, 12);
      const ema12Series = chart.addLineSeries({
        color: '#8b5cf6',
        lineWidth: 2,
        title: 'EMA 12',
      });
      ema12Series.setData(ema12);
    }

    if (indicators.includes('BB')) {
      const bb = calculateBollingerBands(indicatorData, 20, 2);
      const upperSeries = chart.addLineSeries({
        color: '#06b6d4',
        lineWidth: 1,
        lineStyle: 2,
        title: 'BB Upper',
      });
      const middleSeries = chart.addLineSeries({
        color: '#06b6d4',
        lineWidth: 1,
        title: 'BB Middle',
      });
      const lowerSeries = chart.addLineSeries({
        color: '#06b6d4',
        lineWidth: 1,
        lineStyle: 2,
        title: 'BB Lower',
      });
      upperSeries.setData(bb.upper);
      middleSeries.setData(bb.middle);
      lowerSeries.setData(bb.lower);
    }

    // Add volume series if enabled
    if (showVolume) {
      const volumeSeries = chart.addHistogramSeries({
        color: '#3b82f6',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.7,
          bottom: 0,
        },
      });

      const volumeData: HistogramData[] = data.map(item => ({
        time: new Date(item.date).getTime() / 1000,
        value: item.volume,
        color: item.close >= item.open ? '#10b98180' : '#ef444480',
      }));

      volumeSeries.setData(volumeData);
    }

    // Add Gann angles if enabled
    if (showGannAngles && gannPivotPrice && gannPivotDate) {
      addGannAngles(chart, gannPivotPrice, gannPivotDate, data);
    }

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, height, showVolume, showGannAngles, gannPivotPrice, gannPivotDate, indicators]);

  const addGannAngles = (chart: IChartApi, pivotPrice: number, pivotDate: string, data: any[]) => {
    const pivotTime = new Date(pivotDate).getTime() / 1000;
    const angles = [
      { name: '1x1', multiplier: 1, color: '#fbbf24' },
      { name: '2x1', multiplier: 2, color: '#f97316' },
      { name: '1x2', multiplier: 0.5, color: '#06b6d4' },
      { name: '4x1', multiplier: 4, color: '#ec4899' },
      { name: '1x4', multiplier: 0.25, color: '#8b5cf6' },
    ];

    angles.forEach(angle => {
      const upSeries = chart.addLineSeries({
        color: angle.color,
        lineWidth: 1,
        lineStyle: 2,
        title: `${angle.name} ↑`,
      });

      const downSeries = chart.addLineSeries({
        color: angle.color,
        lineWidth: 1,
        lineStyle: 2,
        title: `${angle.name} ↓`,
      });

      const lineData: LineData[] = data
        .filter(item => new Date(item.date).getTime() / 1000 >= pivotTime)
        .map(item => {
          const time = new Date(item.date).getTime() / 1000;
          const daysDiff = (time - pivotTime) / (24 * 60 * 60);
          return {
            time,
            upValue: pivotPrice + (daysDiff * angle.multiplier),
            downValue: pivotPrice - (daysDiff * angle.multiplier),
          };
        });

      upSeries.setData(lineData.map(d => ({ time: d.time, value: d.upValue })));
      downSeries.setData(lineData.map(d => ({ time: d.time, value: d.downValue })));
    });
  };

  const toggleIndicator = (indicator: string) => {
    setIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  const handleZoomIn = () => {
    if (chartRef.current) {
      const timeScale = chartRef.current.timeScale();
      const range = timeScale.getVisibleLogicalRange();
      if (range) {
        const newRange = {
          from: range.from + (range.to - range.from) * 0.1,
          to: range.to - (range.to - range.from) * 0.1,
        };
        timeScale.setVisibleLogicalRange(newRange);
      }
    }
  };

  const handleZoomOut = () => {
    if (chartRef.current) {
      const timeScale = chartRef.current.timeScale();
      const range = timeScale.getVisibleLogicalRange();
      if (range) {
        const newRange = {
          from: range.from - (range.to - range.from) * 0.1,
          to: range.to + (range.to - range.from) * 0.1,
        };
        timeScale.setVisibleLogicalRange(newRange);
      }
    }
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  };

  return (
    <div className="w-full">
      {/* Chart Controls */}
      <div className="flex flex-col gap-4 mb-4 p-4 bg-slate-800 rounded-lg">
        <div className="flex items-center justify-between">
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
          </div>
        </div>

        {/* Technical Indicators */}
        <div>
          <span className="text-sm font-semibold text-slate-300 mr-3">Indicators:</span>
          {['SMA20', 'SMA50', 'EMA12', 'BB'].map(ind => (
            <button
              key={ind}
              onClick={() => toggleIndicator(ind)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors mr-2 ${
                indicators.includes(ind)
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={chartContainerRef} 
        className="w-full rounded-lg overflow-hidden border border-slate-700"
        style={{ height: `${height}px` }}
      />

      {/* Chart Info */}
      <div className="mt-4 p-4 bg-slate-800 rounded-lg">
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
            <span className="text-slate-400">Data Points:</span>
            <span className="ml-2 font-semibold text-white">{data.length}</span>
          </div>
          <div>
            <span className="text-slate-400">Indicators:</span>
            <span className="ml-2 font-semibold text-white">{indicators.length}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Chart Controls</h4>
        <ul className="text-xs text-slate-400 space-y-1">
          <li>• <strong>Zoom:</strong> Scroll wheel or pinch gesture</li>
          <li>• <strong>Pan:</strong> Click and drag horizontally</li>
          <li>• <strong>Crosshair:</strong> Hover over chart to see price and time</li>
          <li>• <strong>Indicators:</strong> Click indicator buttons to toggle overlays</li>
          <li>• <strong>Reset:</strong> Click Reset button to fit all data</li>
        </ul>
      </div>
    </div>
  );
}

