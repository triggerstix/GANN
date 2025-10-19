import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, TrendingUp } from "lucide-react";

export default function GannChart() {
  const [pivotPrice, setPivotPrice] = useState("100");
  const [pivotDate, setPivotDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentDate, setCurrentDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const gannAnglesQuery = trpc.gann.calculateGannAngles.useQuery({
    pivotPrice: parseFloat(pivotPrice) || 100,
    pivotDate,
    currentDate,
  });

  const angles = gannAnglesQuery.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <TrendingUp className="h-6 w-6 text-green-500" />
          <h1 className="text-2xl font-bold text-white">Gann Angles & Charts</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Input Card */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Calculate Gann Angles</CardTitle>
            <CardDescription className="text-slate-400">
              Enter a pivot point price and date to calculate Gann angles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-300 mb-2 block">Pivot Price</Label>
                <Input
                  type="number"
                  value={pivotPrice}
                  onChange={(e) => setPivotPrice(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                  placeholder="100.00"
                />
              </div>
              <div>
                <Label className="text-slate-300 mb-2 block">Pivot Date</Label>
                <Input
                  type="date"
                  value={pivotDate}
                  onChange={(e) => setPivotDate(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300 mb-2 block">Target Date</Label>
                <Input
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Gann Angles */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">About Gann Angles</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-3">
            <p>
              Gann angles are diagonal lines that move at a uniform rate of speed. 
              They represent the relationship between time and price, creating geometric 
              patterns that can indicate support and resistance levels.
            </p>
            <p>
              The most important angle is the <strong className="text-white">1x1 (45°)</strong>, 
              which represents one unit of price for one unit of time. When price is above 
              the 1x1 line, the market is in a bull trend. When below, it's in a bear trend.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong className="text-white">1x8, 1x4, 1x2:</strong> Slower angles (support in uptrends)</li>
              <li><strong className="text-white">1x1:</strong> The master angle (45 degrees)</li>
              <li><strong className="text-white">2x1, 4x1, 8x1:</strong> Faster angles (resistance in uptrends)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upward Angles */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Upward Angles (Support Levels)
              </CardTitle>
              <CardDescription className="text-slate-400">
                Potential support levels from pivot point
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {angles.map((angle: any) => (
                  <div 
                    key={`up-${angle.name}`}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div>
                      <p className="text-white font-semibold">{angle.name}</p>
                      <p className="text-slate-400 text-sm">{angle.angle}° angle</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-lg">
                        ${angle.upPrice.toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {((angle.upPrice - parseFloat(pivotPrice)) / parseFloat(pivotPrice) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Downward Angles */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-500 rotate-180" />
                Downward Angles (Resistance Levels)
              </CardTitle>
              <CardDescription className="text-slate-400">
                Potential resistance levels from pivot point
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {angles.map((angle: any) => (
                  <div 
                    key={`down-${angle.name}`}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div>
                      <p className="text-white font-semibold">{angle.name}</p>
                      <p className="text-slate-400 text-sm">{angle.angle}° angle</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-bold text-lg">
                        ${angle.downPrice.toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {((angle.downPrice - parseFloat(pivotPrice)) / parseFloat(pivotPrice) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trading Tips */}
        <Card className="bg-slate-800/50 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Trading with Gann Angles</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-3">
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-white">Trend Confirmation:</strong> Price above 1x1 = bullish, below = bearish
              </li>
              <li>
                <strong className="text-white">Support/Resistance:</strong> Angles act as dynamic support and resistance
              </li>
              <li>
                <strong className="text-white">Breakouts:</strong> Breaking through an angle can signal trend change
              </li>
              <li>
                <strong className="text-white">Multiple Timeframes:</strong> Use different pivot points for various timeframes
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

