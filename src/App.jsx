import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { TrendingUp, Calculator, Clock, Moon, LineChart, Activity } from 'lucide-react'
import './App.css'
import GannChart from './components/GannChart.jsx'
import SquareOfNine from './components/SquareOfNine.jsx'
import TimeCycles from './components/TimeCycles.jsx'
import AstroAnalysis from './components/AstroAnalysis.jsx'
import MarketData from './components/MarketData.jsx'

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')
  const [marketData, setMarketData] = useState(null)
  const [activeTab, setActiveTab] = useState('chart')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  W.D. Gann Trading Platform
                </h1>
                <p className="text-sm text-slate-400">Advanced Technical Analysis & Market Forecasting</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Select Symbol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AAPL">AAPL - Apple</SelectItem>
                  <SelectItem value="GOOGL">GOOGL - Google</SelectItem>
                  <SelectItem value="MSFT">MSFT - Microsoft</SelectItem>
                  <SelectItem value="TSLA">TSLA - Tesla</SelectItem>
                  <SelectItem value="SPY">SPY - S&P 500</SelectItem>
                  <SelectItem value="BTC-USD">BTC-USD - Bitcoin</SelectItem>
                  <SelectItem value="ETH-USD">ETH-USD - Ethereum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="chart" className="data-[state=active]:bg-blue-600">
              <LineChart className="w-4 h-4 mr-2" />
              Gann Chart
            </TabsTrigger>
            <TabsTrigger value="square" className="data-[state=active]:bg-blue-600">
              <Calculator className="w-4 h-4 mr-2" />
              Square of Nine
            </TabsTrigger>
            <TabsTrigger value="cycles" className="data-[state=active]:bg-blue-600">
              <Clock className="w-4 h-4 mr-2" />
              Time Cycles
            </TabsTrigger>
            <TabsTrigger value="astro" className="data-[state=active]:bg-blue-600">
              <Moon className="w-4 h-4 mr-2" />
              Astrology
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-blue-600">
              <Activity className="w-4 h-4 mr-2" />
              Market Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
            <GannChart symbol={selectedSymbol} />
          </TabsContent>

          <TabsContent value="square" className="space-y-4">
            <SquareOfNine />
          </TabsContent>

          <TabsContent value="cycles" className="space-y-4">
            <TimeCycles symbol={selectedSymbol} />
          </TabsContent>

          <TabsContent value="astro" className="space-y-4">
            <AstroAnalysis />
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <MarketData symbol={selectedSymbol} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-slate-400">
            <p>W.D. Gann Trading Platform - Advanced Technical Analysis Tools</p>
            <p className="mt-2">Incorporating Gann Angles, Square of Nine, Time Cycles & Astrological Analysis</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

