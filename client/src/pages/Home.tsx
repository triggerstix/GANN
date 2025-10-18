import { Link } from "wouter";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Grid3x3, Clock, Star, Activity } from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Gann Angles & Charts",
      description: "Interactive charts with Gann angles and fan lines for dynamic support and resistance analysis.",
      icon: TrendingUp,
      href: "/gann-chart",
      color: "text-blue-400",
    },
    {
      title: "Square of Nine",
      description: "Calculate and visualize key price levels using W.D. Gann's Square of Nine methodology.",
      icon: Grid3x3,
      href: "/square-of-nine",
      color: "text-purple-400",
    },
    {
      title: "Time Cycles",
      description: "Identify recurring time cycles and predict potential market turning points.",
      icon: Clock,
      href: "/time-cycles",
      color: "text-green-400",
    },
    {
      title: "Astrological Analysis",
      description: "Explore lunar phases, planetary positions, and aspects for market correlation.",
      icon: Star,
      href: "/astro-analysis",
      color: "text-yellow-400",
    },
    {
      title: "Live Market Data",
      description: "Real-time market data with price updates, statistics, and comprehensive market information.",
      icon: Activity,
      href: "/market-data",
      color: "text-red-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">W.D. Gann Trading Platform</h1>
          <p className="text-slate-400 mt-2">Advanced technical analysis using Gann's methods</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Master the Markets with <span className="text-blue-400">Gann Analysis</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Comprehensive tools for applying W.D. Gann's legendary trading methods, including geometric angles, 
            time cycles, and astrological analysis.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.href} href={feature.href}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all hover:scale-105 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-slate-400">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* About Section */}
        <div className="mt-16 bg-slate-800/30 border border-slate-700 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-white mb-4">About W.D. Gann</h3>
          <p className="text-slate-300 leading-relaxed">
            William Delbert Gann (1878-1955) was a legendary trader and market analyst who developed unique 
            technical analysis methods based on geometry, astronomy, and ancient mathematics. His techniques, 
            including Gann angles, the Square of Nine, and time cycle analysis, remain influential in modern 
            trading. This platform provides interactive tools to apply Gann's methods to contemporary markets.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-slate-400">
          <p>W.D. Gann Trading Platform - Advanced Technical Analysis Tools</p>
        </div>
      </footer>
    </div>
  );
}
