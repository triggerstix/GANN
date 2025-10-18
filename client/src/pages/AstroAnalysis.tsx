import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft, Moon, Orbit } from "lucide-react";

export default function AstroAnalysis() {
  const { data: lunarPhase, isLoading: lunarLoading } = trpc.gann.lunarPhase.useQuery();
  const { data: planetaryPositions, isLoading: planetsLoading } = trpc.gann.planetaryPositions.useQuery();
  const { data: planetaryAspects, isLoading: aspectsLoading } = trpc.gann.planetaryAspects.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="text-slate-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Astrological Analysis</h1>
          <p className="text-slate-400 mt-2">Explore celestial influences on market movements</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lunar Phase */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Moon className="w-5 h-5 text-yellow-400" />
                Current Lunar Phase
              </CardTitle>
              <CardDescription className="text-slate-400">Moon's influence on market sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              {lunarLoading ? (
                <div className="h-32 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : lunarPhase ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-6xl mb-2">{lunarPhase.icon}</div>
                      <h3 className="text-2xl font-bold text-white">{lunarPhase.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-yellow-400">{lunarPhase.percent}%</div>
                      <div className="text-sm text-slate-400">Illumination</div>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-yellow-400 mb-2">Market Influence</h4>
                    <p className="text-sm text-slate-300">{lunarPhase.influence}</p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Planetary Positions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Orbit className="w-5 h-5 text-blue-400" />
                Planetary Positions
              </CardTitle>
              <CardDescription className="text-slate-400">Current positions of key planets</CardDescription>
            </CardHeader>
            <CardContent>
              {planetsLoading ? (
                <div className="h-32 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {planetaryPositions?.map((planet: any) => (
                    <div key={planet.planet} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{planet.icon}</div>
                        <div>
                          <div className="font-semibold text-white">{planet.planet}</div>
                          <div className="text-xs text-slate-400">{planet.influence}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge style={{ backgroundColor: planet.color }} className="text-white">
                          {planet.sign}
                        </Badge>
                        <div className="text-xs text-slate-400 mt-1">{planet.degree}°</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Planetary Aspects */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Star className="w-5 h-5 text-purple-400" />
                Planetary Aspects
              </CardTitle>
              <CardDescription className="text-slate-400">
                Angular relationships between planets affecting markets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aspectsLoading ? (
                <div className="h-32 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {planetaryAspects?.map((aspect: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-900/50 rounded-lg border-l-4"
                      style={{ borderLeftColor: aspect.color }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge style={{ backgroundColor: aspect.color }} className="text-white">
                          {aspect.type}
                        </Badge>
                        <span className="text-sm text-slate-400">{aspect.angle}°</span>
                      </div>
                      <h4 className="font-semibold text-white mb-1">{aspect.planets}</h4>
                      <p className="text-xs text-slate-400 mb-2">{aspect.description}</p>
                      <div className="text-xs">
                        <span className="text-slate-500">Influence: </span>
                        <span className="text-slate-300">{aspect.influence}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="lg:col-span-2 bg-yellow-900/20 border-yellow-800/50">
            <CardContent className="pt-6">
              <h4 className="text-sm font-semibold text-yellow-400 mb-2">About Astrological Analysis</h4>
              <p className="text-xs text-slate-400 mb-3">
                W.D. Gann believed that planetary movements and astronomical events influenced market cycles. While
                controversial, many traders still use astrological analysis as one component of their trading strategy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-semibold text-yellow-400">Conjunction (0°):</span>
                  <span className="text-slate-400"> Intense energy, new beginnings</span>
                </div>
                <div>
                  <span className="font-semibold text-yellow-400">Trine (120°):</span>
                  <span className="text-slate-400"> Harmonious, supportive energy</span>
                </div>
                <div>
                  <span className="font-semibold text-yellow-400">Square (90°):</span>
                  <span className="text-slate-400"> Tension, challenges, volatility</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

