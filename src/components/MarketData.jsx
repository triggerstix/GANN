import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Activity, TrendingUp, TrendingDown, DollarSign, BarChart3, AlertCircle } from 'lucide-react'

const MarketData = ({ symbol }) => {
  const [marketInfo, setMarketInfo] = useState(null)
  const [priceHistory, setPriceHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [connectionStatus, setConnectionStatus] = useState('connecting')

  useEffect(() => {
    // Simulate fetching market data
    // In production, this would connect to a real API like Alpaca, Polygon.io, or Finnhub
    fetchMarketData()
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateMarketData()
      setLastUpdate(new Date())
    }, 3000)

    return () => clearInterval(interval)
  }, [symbol])

  const fetchMarketData = () => {
    setLoading(true)
    setConnectionStatus('connecting')
    
    // Simulate API call
    setTimeout(() => {
      const basePrice = getBasePriceForSymbol(symbol)
      const change = (Math.random() - 0.5) * 10
      const changePercent = (change / basePrice) * 100
      
      setMarketInfo({
        symbol: symbol,
        name: getNameForSymbol(symbol),
        price: basePrice + change,
        change: change,
        changePercent: changePercent,
        open: basePrice - 2,
        high: basePrice + 5,
        low: basePrice - 3,
        volume: Math.floor(Math.random() * 50000000) + 10000000,
        marketCap: Math.floor(Math.random() * 1000000000000) + 100000000000,
        pe: (15 + Math.random() * 20).toFixed(2),
        dividendYield: (Math.random() * 3).toFixed(2),
        week52High: basePrice + 20,
        week52Low: basePrice - 25,
      })
      
      setConnectionStatus('connected')
      setLoading(false)
    }, 1000)
  }

  const updateMarketData = () => {
    if (!marketInfo) return
    
    const priceChange = (Math.random() - 0.5) * 2
    const newPrice = marketInfo.price + priceChange
    const newChange = newPrice - marketInfo.open
    const newChangePercent = (newChange / marketInfo.open) * 100
    
    setMarketInfo(prev => ({
      ...prev,
      price: newPrice,
      change: newChange,
      changePercent: newChangePercent,
      high: Math.max(prev.high, newPrice),
      low: Math.min(prev.low, newPrice),
    }))

    setPriceHistory(prev => {
      const newHistory = [...prev, { time: new Date(), price: newPrice }]
      return newHistory.slice(-20) // Keep last 20 data points
    })
  }

  const getBasePriceForSymbol = (sym) => {
    const prices = {
      'AAPL': 175,
      'GOOGL': 140,
      'MSFT': 380,
      'TSLA': 250,
      'SPY': 450,
      'BTC-USD': 45000,
      'ETH-USD': 2500,
    }
    return prices[sym] || 100
  }

  const getNameForSymbol = (sym) => {
    const names = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corporation',
      'TSLA': 'Tesla, Inc.',
      'SPY': 'SPDR S&P 500 ETF',
      'BTC-USD': 'Bitcoin USD',
      'ETH-USD': 'Ethereum USD',
    }
    return names[sym] || 'Unknown'
  }

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-400">Loading market data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isPositive = marketInfo.change >= 0

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                connectionStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm text-slate-300">
                {connectionStatus === 'connected' ? 'Live Market Data' : 'Connecting...'}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Price Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="w-5 h-5 text-blue-400" />
            {marketInfo.symbol} - {marketInfo.name}
          </CardTitle>
          <CardDescription className="text-slate-400">
            Real-time price and market statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Price */}
            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Current Price</p>
                  <p className="text-5xl font-bold text-white">
                    ${marketInfo.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-2 text-2xl font-semibold ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                    {isPositive ? '+' : ''}{marketInfo.change.toFixed(2)}
                  </div>
                  <div className={`text-lg ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{marketInfo.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Price Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Open</p>
                <p className="text-lg font-semibold text-white">${marketInfo.open.toFixed(2)}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">High</p>
                <p className="text-lg font-semibold text-green-400">${marketInfo.high.toFixed(2)}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Low</p>
                <p className="text-lg font-semibold text-red-400">${marketInfo.low.toFixed(2)}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Volume</p>
                <p className="text-lg font-semibold text-white">
                  {(marketInfo.volume / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  <p className="text-xs text-slate-400">Market Cap</p>
                </div>
                <p className="text-lg font-semibold text-white">
                  ${(marketInfo.marketCap / 1000000000).toFixed(1)}B
                </p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <p className="text-xs text-slate-400">P/E Ratio</p>
                </div>
                <p className="text-lg font-semibold text-white">{marketInfo.pe}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <p className="text-xs text-slate-400">Dividend Yield</p>
                </div>
                <p className="text-lg font-semibold text-white">{marketInfo.dividendYield}%</p>
              </div>
            </div>

            {/* 52 Week Range */}
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <p className="text-sm text-slate-400 mb-3">52 Week Range</p>
              <div className="relative">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{
                      width: `${((marketInfo.price - marketInfo.week52Low) / (marketInfo.week52High - marketInfo.week52Low)) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-red-400">${marketInfo.week52Low.toFixed(2)}</span>
                  <span className="text-white font-semibold">${marketInfo.price.toFixed(2)}</span>
                  <span className="text-green-400">${marketInfo.week52High.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Integration Info */}
      <Card className="bg-blue-900/20 border-blue-800/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Live Market Data Integration</h4>
              <p className="text-xs text-slate-400 mb-3">
                This demo uses simulated data. In production, this component connects to live market data APIs such as:
              </p>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Alpaca</Badge>
                  <span>Commission-free trading API with real-time data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Polygon.io</Badge>
                  <span>Real-time and historical market data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Finnhub</Badge>
                  <span>Stock, Forex, and Crypto data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Yahoo Finance</Badge>
                  <span>Free market data via unofficial API</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                WebSocket connections provide real-time price updates with minimal latency.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MarketData

