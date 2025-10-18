import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Moon, Sun, Star, Orbit } from 'lucide-react'

const AstroAnalysis = () => {
  const [lunarPhase, setLunarPhase] = useState(null)
  const [planetaryPositions, setPlanetaryPositions] = useState([])
  const [aspects, setAspects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAstroData = async () => {
      setLoading(true)
      try {
        const [lunarRes, planetsRes, aspectsRes] = await Promise.all([
          fetch('/api/lunar_phase'),
          fetch('/api/planetary_positions'),
          fetch('/api/planetary_aspects'),
        ])

        const lunarData = await lunarRes.json()
        const planetsData = await planetsRes.json()
        const aspectsData = await aspectsRes.json()

        setLunarPhase(lunarData)
        setPlanetaryPositions(planetsData)
        setAspects(aspectsData)
      } catch (error) {
        console.error('Error fetching astrological data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAstroData()
    const interval = setInterval(fetchAstroData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [])

  if (loading || !lunarPhase) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-slate-400">Loading astrological data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lunar Phase */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Moon className="w-5 h-5 text-blue-400" />
            Current Lunar Phase
          </CardTitle>
          <CardDescription className="text-slate-400">
            Moon's influence on market cycles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-lg">
            <div className="text-6xl mb-4">{lunarPhase.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{lunarPhase.name}</h3>
            <div className="text-sm text-slate-400 space-y-1 text-center">
              <p>Lunar Age: {lunarPhase.age} days</p>
              <p>Phase: {lunarPhase.percent}%</p>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">Market Influence</h4>
            <p className="text-xs text-slate-300">{lunarPhase.influence}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-300">Historical Correlation (Simulated)</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/50 p-2 rounded">
                <p className="text-slate-400">New Moon</p>
                <p className="text-green-400 font-semibold">+2.3% avg</p>
              </div>
              <div className="bg-slate-900/50 p-2 rounded">
                <p className="text-slate-400">Full Moon</p>
                <p className="text-red-400 font-semibold">-1.8% avg</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planetary Positions */}
      <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Orbit className="w-5 h-5 text-purple-400" />
            Planetary Positions
          </CardTitle>
          <CardDescription className="text-slate-400">
            Current positions and market influences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planetaryPositions.map((planet, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{planet.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{planet.planet}</h4>
                      <p className="text-sm text-slate-400">
                        {planet.sign} {planet.degree}°
                      </p>
                    </div>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: planet.color }}
                  />
                </div>
                <p className="text-xs text-slate-400">{planet.influence}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Planetary Aspects */}
      <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Star className="w-5 h-5 text-yellow-400" />
            Active Planetary Aspects
          </CardTitle>
          <CardDescription className="text-slate-400">
            Angular relationships between planets affecting market dynamics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aspects.map((aspect, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/50 rounded-lg p-4 border-l-4 transition-all hover:scale-[1.02]"
                style={{ borderLeftColor: aspect.color }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">{aspect.planets}</h4>
                  <Badge 
                    style={{ backgroundColor: aspect.color }}
                    className="text-white"
                  >
                    {aspect.type} ({aspect.angle}°)
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Influence:</span>
                    <span 
                      className="text-sm font-semibold"
                      style={{ color: aspect.color }}
                    >
                      {aspect.influence}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{aspect.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Aspect Types Legend */}
          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Aspect Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div>
                <span className="text-green-400 font-semibold">Trine (120°)</span>
                <p className="text-slate-500">Harmonious flow</p>
              </div>
              <div>
                <span className="text-blue-400 font-semibold">Sextile (60°)</span>
                <p className="text-slate-500">Opportunities</p>
              </div>
              <div>
                <span className="text-red-400 font-semibold">Square (90°)</span>
                <p className="text-slate-500">Tension, action</p>
              </div>
              <div>
                <span className="text-orange-400 font-semibold">Conjunction (0°)</span>
                <p className="text-slate-500">Intense focus</p>
              }
              <div>
                <span className="text-purple-400 font-semibold">Opposition (180°)</span>
                <p className="text-slate-500">Polarity, balance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="lg:col-span-3 bg-purple-900/20 border-purple-800/50">
        <CardContent className="pt-6">
          <h4 className="text-sm font-semibold text-purple-400 mb-2">About Astrological Analysis</h4>
          <p className="text-xs text-slate-400">
            W.D. Gann incorporated astrological cycles into his market analysis, believing that planetary movements 
            and lunar phases correlated with market behavior. While controversial, many traders still use these 
            techniques to identify potential turning points. The positions shown are derived from the backend, 
            which uses the `pyswisseph` library for accurate real-time data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AstroAnalysis

