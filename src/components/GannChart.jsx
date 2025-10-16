import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp, Plus, Minus } from 'lucide-react'

const GannChart = ({ symbol }) => {
  const [priceData, setPriceData] = useState([])
  const [pivotPrice, setPivotPrice] = useState(150)
  const [pivotIndex, setPivotIndex] = useState(10)
  const [showAngles, setShowAngles] = useState(true)
  const [showFans, setShowFans] = useState(true)
  const [loading, setLoading] = useState(true)

  // Generate sample price data (in production, this would fetch from API)
  useEffect(() => {
    const generateData = () => {
      const data = []
      let price = 140 + Math.random() * 20
      for (let i = 0; i < 60; i++) {
        price = price + (Math.random() - 0.48) * 5
        data.push({
          date: `Day ${i + 1}`,
          price: parseFloat(price.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000) + 500000,
          // Gann angle calculations
          gann1x1: pivotPrice + (i - pivotIndex) * 1,
          gann1x2: pivotPrice + (i - pivotIndex) * 0.5,
          gann2x1: pivotPrice + (i - pivotIndex) * 2,
          gann1x3: pivotPrice + (i - pivotIndex) * 0.33,
          gann3x1: pivotPrice + (i - pivotIndex) * 3,
        })
      }
      return data
    }

    setPriceData(generateData())
    setLoading(false)
  }, [symbol, pivotPrice, pivotIndex])

  const gannAngles = [
    { name: '1x1 (45°)', key: 'gann1x1', color: '#3b82f6', ratio: '1:1' },
    { name: '1x2', key: 'gann1x2', color: '#10b981', ratio: '1:2' },
    { name: '2x1', key: 'gann2x1', color: '#f59e0b', ratio: '2:1' },
    { name: '1x3', key: 'gann1x3', color: '#8b5cf6', ratio: '1:3' },
    { name: '3x1', key: 'gann3x1', color: '#ef4444', ratio: '3:1' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Chart */}
      <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Gann Angles & Price Chart - {symbol}
          </CardTitle>
          <CardDescription className="text-slate-400">
            Interactive chart with Gann angles and fan lines for support/resistance analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                
                {/* Price Line */}
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#60a5fa" 
                  strokeWidth={3}
                  dot={false}
                  name="Price"
                />

                {/* Gann Angles */}
                {showAngles && gannAngles.map((angle) => (
                  <Line
                    key={angle.key}
                    type="monotone"
                    dataKey={angle.key}
                    stroke={angle.color}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name={angle.name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Controls Panel */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Gann Controls</CardTitle>
          <CardDescription className="text-slate-400">
            Configure pivot points and angles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pivot Price */}
          <div className="space-y-2">
            <Label className="text-slate-300">Pivot Price</Label>
            <Input
              type="number"
              value={pivotPrice}
              onChange={(e) => setPivotPrice(parseFloat(e.target.value))}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>

          {/* Pivot Index */}
          <div className="space-y-2">
            <Label className="text-slate-300">Pivot Day</Label>
            <Input
              type="number"
              value={pivotIndex}
              onChange={(e) => setPivotIndex(parseInt(e.target.value))}
              min="0"
              max="59"
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>

          {/* Toggle Angles */}
          <div className="space-y-2">
            <Button
              onClick={() => setShowAngles(!showAngles)}
              className={`w-full ${showAngles ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
              {showAngles ? 'Hide' : 'Show'} Gann Angles
            </Button>
          </div>

          {/* Gann Angles Legend */}
          <div className="space-y-3 pt-4 border-t border-slate-700">
            <h4 className="text-sm font-semibold text-slate-300">Active Angles</h4>
            {gannAngles.map((angle) => (
              <div key={angle.key} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: angle.color }}
                  />
                  <span className="text-slate-300">{angle.name}</span>
                </div>
                <span className="text-slate-500">{angle.ratio}</span>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 mt-4">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">About Gann Angles</h4>
            <p className="text-xs text-slate-400">
              Gann angles represent the relationship between time and price. The 1x1 angle (45°) 
              is the most important, representing one unit of price per unit of time. These lines 
              act as dynamic support and resistance levels.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GannChart

