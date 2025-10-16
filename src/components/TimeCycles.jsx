import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Clock, Calendar, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts'

const TimeCycles = ({ symbol }) => {
  const [priceData, setPriceData] = useState([])
  const [selectedCycles, setSelectedCycles] = useState([30, 90, 180])
  const [loading, setLoading] = useState(true)

  // Gann's important time cycles
  const gannCycles = [
    { days: 7, name: 'Weekly', color: '#3b82f6', description: 'Short-term cycle' },
    { days: 30, name: 'Monthly', color: '#10b981', description: 'Medium-term cycle' },
    { days: 60, name: '60-Day', color: '#f59e0b', description: 'Gann important cycle' },
    { days: 90, name: 'Quarterly', color: '#8b5cf6', description: 'Seasonal cycle' },
    { days: 120, name: '120-Day', color: '#ec4899', description: 'Gann important cycle' },
    { days: 144, name: '144-Day', color: '#14b8a6', description: 'Fibonacci-Gann cycle' },
    { days: 180, name: 'Semi-Annual', color: '#ef4444', description: 'Half-year cycle' },
    { days: 360, name: 'Annual', color: '#6366f1', description: 'Full-year cycle' },
  ]

  useEffect(() => {
    // Generate sample data with cyclical patterns
    const generateData = () => {
      const data = []
      let price = 150
      
      for (let i = 0; i < 365; i++) {
        // Add cyclical components
        const cycle30 = 10 * Math.sin((i * 2 * Math.PI) / 30)
        const cycle90 = 15 * Math.sin((i * 2 * Math.PI) / 90)
        const cycle180 = 20 * Math.sin((i * 2 * Math.PI) / 180)
        const noise = (Math.random() - 0.5) * 5
        
        price = 150 + cycle30 + cycle90 + cycle180 + noise
        
        // Check if this day is a cycle turning point
        const cycleMarkers = []
        selectedCycles.forEach(cycle => {
          if (i % cycle === 0 && i > 0) {
            cycleMarkers.push(cycle)
          }
        })
        
        data.push({
          day: i + 1,
          date: `Day ${i + 1}`,
          price: parseFloat(price.toFixed(2)),
          cycle30: 150 + cycle30,
          cycle90: 150 + cycle90,
          cycle180: 150 + cycle180,
          cycleMarkers: cycleMarkers,
          isCyclePoint: cycleMarkers.length > 0
        })
      }
      return data
    }

    setPriceData(generateData())
    setLoading(false)
  }, [symbol, selectedCycles])

  const toggleCycle = (days) => {
    if (selectedCycles.includes(days)) {
      setSelectedCycles(selectedCycles.filter(c => c !== days))
    } else {
      setSelectedCycles([...selectedCycles, days])
    }
  }

  // Calculate next cycle dates
  const calculateNextCycles = () => {
    const today = new Date()
    return gannCycles.map(cycle => {
      const nextDate = new Date(today)
      nextDate.setDate(today.getDate() + cycle.days)
      return {
        ...cycle,
        nextDate: nextDate.toLocaleDateString(),
        daysUntil: cycle.days
      }
    })
  }

  const upcomingCycles = calculateNextCycles()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Chart */}
      <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-green-400" />
            Time Cycles Analysis - {symbol}
          </CardTitle>
          <CardDescription className="text-slate-400">
            Gann's time cycles showing recurring patterns and potential turning points
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8' }}
                    interval={29}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8' }}
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
                    dot={(props) => {
                      const { cx, cy, payload } = props
                      if (payload.isCyclePoint) {
                        return (
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={6} 
                            fill="#ef4444" 
                            stroke="#fff" 
                            strokeWidth={2}
                          />
                        )
                      }
                      return null
                    }}
                    name="Price"
                  />

                  {/* Cycle Components */}
                  {selectedCycles.includes(30) && (
                    <Line
                      type="monotone"
                      dataKey="cycle30"
                      stroke="#10b981"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                      name="30-Day Cycle"
                    />
                  )}
                  {selectedCycles.includes(90) && (
                    <Line
                      type="monotone"
                      dataKey="cycle90"
                      stroke="#8b5cf6"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                      name="90-Day Cycle"
                    />
                  )}
                  {selectedCycles.includes(180) && (
                    <Line
                      type="monotone"
                      dataKey="cycle180"
                      stroke="#ef4444"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                      name="180-Day Cycle"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>

              {/* Cycle Markers Legend */}
              <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-slate-300">Red dots indicate cycle turning points</span>
                </div>
                <p className="text-xs text-slate-400">
                  Multiple cycles converging at the same point may indicate a significant market turning point
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Cycle Controls */}
      <div className="space-y-6">
        {/* Cycle Selection */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Active Cycles</CardTitle>
            <CardDescription className="text-slate-400">
              Select cycles to display
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {gannCycles.map((cycle) => (
              <Button
                key={cycle.days}
                onClick={() => toggleCycle(cycle.days)}
                variant={selectedCycles.includes(cycle.days) ? 'default' : 'outline'}
                className={`w-full justify-start ${
                  selectedCycles.includes(cycle.days)
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{cycle.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {cycle.days}d
                  </Badge>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Cycles */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4" />
              Upcoming Cycles
            </CardTitle>
            <CardDescription className="text-slate-400">
              Next cycle completion dates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingCycles.slice(0, 5).map((cycle, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-300">{cycle.name}</span>
                  <Badge 
                    style={{ backgroundColor: cycle.color }}
                    className="text-white"
                  >
                    {cycle.days}d
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">{cycle.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-green-900/20 border-green-800/50">
          <CardContent className="pt-6">
            <h4 className="text-sm font-semibold text-green-400 mb-2">About Time Cycles</h4>
            <p className="text-xs text-slate-400">
              Gann believed that time is more important than price. Markets move in recurring cycles, 
              and understanding these cycles can help predict future turning points. Key Gann cycles 
              include 30, 60, 90, 120, 144, 180, and 360 days.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TimeCycles

