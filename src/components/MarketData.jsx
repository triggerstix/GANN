import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Activity, TrendingUp, TrendingDown, DollarSign, BarChart3, AlertCircle } from 'lucide-react'
import io from 'socket.io-client'

const MarketData = ({ symbol }) => {
  const [marketInfo, setMarketInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const socketRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setConnectionStatus('connecting')

    // Connect to SocketIO backend
    socketRef.current = io("/") // Connect to the same host as the frontend

    socketRef.current.on('connect', () => {
      console.log('SocketIO connected')
      setConnectionStatus('connected')
      fetchMarketInfo(symbol)
    })

    socketRef.current.on('disconnect', () => {
      console.log('SocketIO disconnected')
      setConnectionStatus('disconnected')
    })

    socketRef.current.on('market_update', (data) => {
      if (data.symbol === symbol) {
        setMarketInfo(data)
        setLastUpdate(new Date())
      }
    })

    socketRef.current.on('status', (data) => {
      console.log('Backend Status:', data.msg)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [symbol])

  const fetchMarketInfo = async (currentSymbol) => {
    try {
      const response = await fetch(`/api/market_info/${currentSymbol}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setMarketInfo(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching market info:', error)
      setLoading(false)
      setConnectionStatus('error')
    }
  }

  if (loading || !marketInfo) {
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
                connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-slate-300">
                {connectionStatus === 'connected' ? 'Live Market Data' : connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
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
                This component connects to the Flask backend for real-time market data. 
                The backend uses simulated data for demonstration, but can be extended to integrate with APIs like Alpaca, Polygon.io, or Finnhub.
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

