import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Grid3x3, Clock, Star, Activity } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Gann Angles & Charts",
      description: "Interactive charts with Gann angles and fan lines for dynamic support and resistance analysis.",
      link: "/gann-chart",
    },
    {
      icon: <Grid3x3 className="w-8 h-8" />,
      title: "Square of Nine",
      description: "Calculate and visualize key price levels using W.D. Gann's Square of Nine methodology.",
      link: "/square-of-nine",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time Cycles",
      description: "Identify recurring time cycles and predict potential market turning points.",
      link: "/time-cycles",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Astrological Analysis",
      description: "Explore lunar phases, planetary positions, and aspects for market correlation.",
      link: "/astro-analysis",
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Live Market Data",
      description: "Real-time market data with price updates, statistics, and comprehensive market information.",
      link: "/market-data",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-blue-400">W.D. Gann Trading Platform</h1>
          <p className="text-slate-400 mt-2">Advanced technical analysis using Gann's methods</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Master the Markets with <span className="text-blue-400">Gann Analysis</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Comprehensive tools for applying W.D. Gann's legendary trading methods, including
            geometric angles, time cycles, and astrological analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Link key={index} href={feature.link}>
              <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer bg-slate-800/50 border-slate-700 hover:border-blue-500">
                <CardHeader>
                  <div className="text-blue-400 mb-4">{feature.icon}</div>
                  <CardTitle className="text-slate-100">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-400">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4 text-slate-100">About W.D. Gann</h3>
          <p className="text-slate-300 leading-relaxed">
            William Delbert Gann (1878-1955) was a legendary trader and market analyst who developed unique technical analysis methods based on geometry, astronomy,
            and ancient mathematics. His techniques, including Gann angles, the Square of Nine, and time cycle analysis, remain influential in modern trading. This platform
            provides interactive tools to apply Gann's methods to contemporary markets.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-700 mt-16 py-6 bg-slate-900/50">
        <div className="container mx-auto px-4 text-center text-slate-400">
          W.D. Gann Trading Platform - Advanced Technical Analysis Tools
        </div>
      </footer>
    </div>
  );
}
