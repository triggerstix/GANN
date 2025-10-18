import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function AstroAnalysis() {
  const { data, isLoading } = trpc.gann.astroData.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-400">Astrological Analysis</h1>
          <p className="text-slate-400 mt-2">Explore celestial influences on market movements</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center text-slate-400 py-12">Loading astrological data...</div>
        ) : data ? (
          <>
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-slate-100">Lunar Phase</CardTitle>
                <CardDescription className="text-slate-400">Current moon phase and illumination</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                  <div className="text-2xl font-bold text-blue-400 mb-2">{data.lunarPhase.phase}</div>
                  <div className="text-slate-300">Illumination: {data.lunarPhase.illumination}%</div>
                  <div className="text-slate-400 text-sm mt-1">Age: {data.lunarPhase.age} days</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-slate-100">Planetary Positions</CardTitle>
                <CardDescription className="text-slate-400">Current zodiac positions of major planets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.planetaryPositions.map((planet, index) => (
                    <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-blue-400 font-semibold">{planet.planet}</div>
                      <div className="text-slate-300 text-sm">{planet.sign}</div>
                      <div className="text-slate-400 text-xs mt-1">{planet.degree}°</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Planetary Aspects</CardTitle>
                <CardDescription className="text-slate-400">Key angular relationships between planets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.planetaryAspects.map((aspect, index) => (
                    <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-blue-400 font-semibold">{aspect.planet1}</span>
                          <span className="text-slate-400 mx-2">-</span>
                          <span className="text-blue-400 font-semibold">{aspect.planet2}</span>
                        </div>
                        <div className="text-slate-300">{aspect.aspect}</div>
                      </div>
                      <div className="text-slate-400 text-sm mt-2">Angle: {aspect.angle}°</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </main>
    </div>
  );
}
