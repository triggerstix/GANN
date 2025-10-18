import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { 
  TrendingUp, 
  Calculator, 
  Clock, 
  Moon, 
  BarChart3, 
  Activity 
} from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  const features = [
    {
      title: "Market Data",
      description: "Real-time market data and price tracking for multiple symbols",
      icon: Activity,
      path: "/market-data",
      color: "text-blue-500",
    },
    {
      title: "Gann Angles & Charts",
      description: "Calculate and visualize Gann angles from pivot points",
      icon: TrendingUp,
      path: "/gann-chart",
      color: "text-green-500",
    },
    {
      title: "Square of Nine",
      description: "Interactive Square of Nine calculator for price and time analysis",
      icon: Calculator,
      path: "/square-of-nine",
      color: "text-purple-500",
    },
    {
      title: "Time Cycles",
      description: "Analyze market cycles and time-based patterns",
      icon: Clock,
      path: "/time-cycles",
      color: "text-orange-500",
    },
    {
      title: "Astrological Analysis",
      description: "Lunar phases, planetary positions, and astrological aspects",
      icon: Moon,
      path: "/astro-analysis",
      color: "text-indigo-500",
    },
    {
      title: "Historical Charts",
      description: "View historical price data with technical indicators",
      icon: BarChart3,
      path: "/market-data",
      color: "text-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">W.D. Gann Trading Platform</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-slate-300 text-sm">
                  {user?.name || user?.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">
          Master the Markets with W.D. Gann Methods
        </h2>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
          A comprehensive trading platform implementing all of W.D. Gann's legendary 
          trading methodologies including Gann Angles, Square of Nine, Time Cycles, 
          and Astrological Analysis.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/market-data">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
          <Link href="/gann-chart">
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              Explore Features
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          Complete Gann Trading Toolkit
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.path} href={feature.path}>
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-8 w-8 ${feature.color}`} />
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
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">About W.D. Gann</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <p>
              William Delbert Gann (1878-1955) was one of the most successful traders 
              of all time. He developed unique trading techniques based on geometry, 
              astronomy, astrology, and ancient mathematics.
            </p>
            <p>
              This platform implements Gann's core methodologies:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Gann Angles:</strong> Geometric price and time relationships</li>
              <li><strong className="text-white">Square of Nine:</strong> Mathematical price calculator based on square root relationships</li>
              <li><strong className="text-white">Time Cycles:</strong> Natural market cycles and turning points</li>
              <li><strong className="text-white">Astrological Analysis:</strong> Planetary influences on market behavior</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-slate-400">
          <p>© 2024 W.D. Gann Trading Platform. For educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}

