import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Moon, RefreshCw } from "lucide-react";

export default function AstroAnalysis() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const lunarQuery = trpc.gann.lunarPhase.useQuery({ date: selectedDate });
  const planetaryQuery = trpc.gann.planetaryPositions.useQuery({ date: selectedDate });
  const aspectsQuery = trpc.gann.planetaryAspects.useQuery({ date: selectedDate });

  const handleRefresh = () => {
    lunarQuery.refetch();
    planetaryQuery.refetch();
    aspectsQuery.refetch();
  };

  const getMoonPhaseIcon = (phase: string) => {
    const phases: Record<string, string> = {
      "New Moon": "🌑",
      "Waxing Crescent": "🌒",
      "First Quarter": "🌓",
      "Waxing Gibbous": "🌔",
      "Full Moon": "🌕",
      "Waning Gibbous": "🌖",
      "Last Quarter": "🌗",
      "Waning Crescent": "🌘",
    };
    return phases[phase] || "🌙";
  };

  const getAspectColor = (aspect: string) => {
    const colors: Record<string, string> = {
      "Conjunction": "text-purple-400",
      "Opposition": "text-red-400",
      "Trine": "text-green-400",
      "Square": "text-orange-400",
      "Sextile": "text-blue-400",
    };
    return colors[aspect] || "text-slate-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <Moon className="h-6 w-6 text-indigo-500" />
            <h1 className="text-2xl font-bold text-white">Astrological Analysis</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={lunarQuery.isLoading}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${lunarQuery.isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Date Selector */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Select Date</CardTitle>
            <CardDescription className="text-slate-400">
              Choose a date to analyze astrological influences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Label className="text-slate-300 mb-2 block">Analysis Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* About Astro Analysis */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">About Astrological Market Analysis</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-3">
            <p>
              W.D. Gann believed that planetary movements and lunar cycles have a profound 
              influence on market behavior. He studied astronomy and astrology extensively 
              to predict market turning points.
            </p>
            <p>
              <strong className="text-white">Key astrological factors:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Lunar Phases:</strong> New and Full Moons often mark turning points</li>
              <li><strong className="text-white">Planetary Positions:</strong> Planet locations in the zodiac affect market energy</li>
              <li><strong className="text-white">Aspects:</strong> Angular relationships between planets create market pressure</li>
              <li><strong className="text-white">Retrogrades:</strong> Backward planetary motion can signal reversals</li>
            </ul>
          </CardContent>
        </Card>

        {/* Lunar Phase */}
        {lunarQuery.data && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Lunar Phase</CardTitle>
              <CardDescription className="text-slate-400">
                Current moon phase and its market implications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="text-6xl">
                  {getMoonPhaseIcon(lunarQuery.data.phase)}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {lunarQuery.data.phase}
                  </h3>
                  <p className="text-slate-300 mb-2">
                    Illumination: <span className="text-white font-semibold">
                      {lunarQuery.data.illumination.toFixed(1)}%
                    </span>
                  </p>
                  <p className="text-slate-400 text-sm">
                    {lunarQuery.data.interpretation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Planetary Positions */}
        {planetaryQuery.data && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Planetary Positions</CardTitle>
              <CardDescription className="text-slate-400">
                Current positions of major planets in the zodiac
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {planetaryQuery.data.map((planet: any) => (
                  <div
                    key={planet.name}
                    className="p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{planet.name}</h4>
                      <span className="text-2xl">{planet.symbol}</span>
                    </div>
                    <p className="text-slate-300 mb-1">
                      {planet.sign} {planet.signSymbol}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {planet.degrees?.toFixed(2) || '0.00'}° {planet.retrograde && "(R)"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Planetary Aspects */}
        {aspectsQuery.data && aspectsQuery.data.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Planetary Aspects</CardTitle>
              <CardDescription className="text-slate-400">
                Angular relationships between planets affecting market energy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aspectsQuery.data.map((aspect: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex-1">
                      <p className="text-white font-semibold mb-1">
                        {aspect.planet1} {aspect.aspect} {aspect.planet2}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {aspect.interpretation}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${getAspectColor(aspect.aspect)}`}>
                        {aspect.angle}°
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aspect Meanings */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Understanding Planetary Aspects</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Conjunction (0°)</h4>
                <p className="text-sm text-slate-400">
                  Planets aligned - powerful combined energy, new beginnings
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Opposition (180°)</h4>
                <p className="text-sm text-slate-400">
                  Planets opposite - tension, culmination, potential reversals
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Trine (120°)</h4>
                <p className="text-sm text-slate-400">
                  Harmonious flow - ease, support, positive trends
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Square (90°)</h4>
                <p className="text-sm text-slate-400">
                  Challenging angle - friction, action required, volatility
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Sextile (60°)</h4>
                <p className="text-sm text-slate-400">
                  Opportunity - favorable conditions, growth potential
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(lunarQuery.isLoading || planetaryQuery.isLoading) && (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
            <p className="text-slate-400">Loading astrological data...</p>
          </div>
        )}
      </div>
    </div>
  );
}

