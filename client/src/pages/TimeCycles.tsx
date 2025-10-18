import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ArrowLeft, Clock } from "lucide-react";

export default function TimeCycles() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Gann's key time cycles (in days)
  const gannCycles = [
    { name: "7 Days", days: 7, description: "Weekly cycle" },
    { name: "14 Days", days: 14, description: "Two weeks" },
    { name: "21 Days", days: 21, description: "Three weeks" },
    { name: "30 Days", days: 30, description: "Monthly cycle" },
    { name: "45 Days", days: 45, description: "1.5 months" },
    { name: "60 Days", days: 60, description: "Two months" },
    { name: "90 Days", days: 90, description: "Quarterly cycle" },
    { name: "120 Days", days: 120, description: "Four months" },
    { name: "144 Days", days: 144, description: "Gann's square of 12" },
    { name: "180 Days", days: 180, description: "Half year" },
    { name: "360 Days", days: 360, description: "Full year cycle" },
  ];

  // Natural cycles
  const naturalCycles = [
    { name: "Lunar Month", days: 29.53, description: "Moon's orbital period" },
    { name: "Mercury Cycle", days: 88, description: "Mercury's orbital period" },
    { name: "Venus Cycle", days: 225, description: "Venus's orbital period" },
    { name: "Mars Cycle", days: 687, description: "Mars's orbital period" },
  ];

  const calculateFutureDate = (start: string, days: number) => {
    const date = new Date(start);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const calculateDaysUntil = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

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
          <Clock className="h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-white">Time Cycles Analysis</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Input Card */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Calculate Time Cycles</CardTitle>
            <CardDescription className="text-slate-400">
              Enter a significant date (pivot, high, low) to calculate future cycle dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Label className="text-slate-300 mb-2 block">Start Date (Pivot Point)</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* About Time Cycles */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">About Gann Time Cycles</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-3">
            <p>
              W.D. Gann believed that time is more important than price. Markets move in 
              predictable cycles, and understanding these cycles can help predict turning points.
            </p>
            <p>
              <strong className="text-white">Key principles:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Markets tend to make significant moves at regular time intervals</li>
              <li>Natural cycles (lunar, planetary) influence market behavior</li>
              <li>The square of numbers (144 = 12²) represents important time periods</li>
              <li>Combining multiple cycles can identify high-probability turning points</li>
            </ul>
          </CardContent>
        </Card>

        {/* Gann Cycles */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Gann Time Cycles</CardTitle>
            <CardDescription className="text-slate-400">
              Key time periods from W.D. Gann's methodology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gannCycles.map((cycle) => {
                const futureDate = calculateFutureDate(startDate, cycle.days);
                const daysUntil = calculateDaysUntil(futureDate);
                const isPast = daysUntil < 0;
                
                return (
                  <div
                    key={cycle.name}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex-1">
                      <p className="text-white font-semibold">{cycle.name}</p>
                      <p className="text-slate-400 text-sm">{cycle.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-mono">{futureDate}</p>
                      <p className={`text-sm ${isPast ? 'text-slate-500' : 'text-orange-400'}`}>
                        {isPast ? `${Math.abs(daysUntil)} days ago` : `in ${daysUntil} days`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Natural Cycles */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Natural & Planetary Cycles</CardTitle>
            <CardDescription className="text-slate-400">
              Astronomical cycles that influence markets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {naturalCycles.map((cycle) => {
                const futureDate = calculateFutureDate(startDate, Math.round(cycle.days));
                const daysUntil = calculateDaysUntil(futureDate);
                const isPast = daysUntil < 0;
                
                return (
                  <div
                    key={cycle.name}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex-1">
                      <p className="text-white font-semibold">{cycle.name}</p>
                      <p className="text-slate-400 text-sm">{cycle.description} ({cycle.days} days)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-mono">{futureDate}</p>
                      <p className={`text-sm ${isPast ? 'text-slate-500' : 'text-indigo-400'}`}>
                        {isPast ? `${Math.abs(daysUntil)} days ago` : `in ${daysUntil} days`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Trading Tips */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Using Time Cycles in Trading</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-3">
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-white">Identify Pivot Points:</strong> Mark significant highs and lows as starting points
              </li>
              <li>
                <strong className="text-white">Watch for Convergence:</strong> When multiple cycles align, expect stronger moves
              </li>
              <li>
                <strong className="text-white">Combine with Price:</strong> Time cycles work best when combined with price analysis
              </li>
              <li>
                <strong className="text-white">Be Patient:</strong> Cycles can be early or late by a few days
              </li>
              <li>
                <strong className="text-white">Use Confirmation:</strong> Wait for price action to confirm the cycle turning point
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

