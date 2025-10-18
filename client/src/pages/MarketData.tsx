import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";

export default function MarketData() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  const symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "SPY", "BTC-USD", "ETH-USD"];

  const { data: marketInfo, isLoading } = trpc.gann.marketInfo.useQuery({ symbol: selectedSymbol });

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
          <h1 className="text-3xl font-bold text-white">Live Market Data</h1>
          <p className="text-slate-400 mt-2">Real-time market information and statistics</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Symbol Selector */}
        <div className="flex flex-wrap gap-3 mb-8">
          {symbols.map((symbol) => (
            <Button
              key={symbol}
              onClick={() => setSelectedSymbol(symbol)}
              variant={selectedSymbol === symbol ? "default" : "outline"}
              className={
                selectedSymbol === symbol
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }
            >
              {symbol}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : marketInfo ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Price Card */}
            <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5 text-red-400" />
                  {marketInfo.name}
                </CardTitle>
                <CardDescription className="text-slate-400">{marketInfo.symbol}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl font-bold text-white">${marketInfo.price.toLocaleString()}</span>
                      <div className="flex items-center gap-2">
                        {marketInfo.change >= 0 ? (
                          <TrendingUp className="w-6 h-6 text-green-500" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-500" />
                        )}
                        <span
                          className={`text-2xl font-semibold ${
                            marketInfo.change >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {marketInfo.change >= 0 ? "+" : ""}
                          {marketInfo.change.toFixed(2)} ({marketInfo.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <div className="text-xs text-slate-400 mb-1">Open</div>
                      <div className="text-lg font-semibold text-white">${marketInfo.open.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <div className="text-xs text-slate-400 mb-1">High</div>
                      <div className="text-lg font-semibold text-green-400">${marketInfo.high.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <div className="text-xs text-slate-400 mb-1">Low</div>
                      <div className="text-lg font-semibold text-red-400">${marketInfo.low.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <div className="text-xs text-slate-400 mb-1">Volume</div>
                      <div className="text-lg font-semibold text-white">
                        {(marketInfo.volume / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <div className="text-xs text-slate-400 mb-1">52 Week High</div>
                      <div className="text-lg font-semibold text-white">${marketInfo.week52High.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <div className="text-xs text-slate-400 mb-1">52 Week Low</div>
                      <div className="text-lg font-semibold text-white">${marketInfo.week52Low.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Key Statistics</CardTitle>
                <CardDescription className="text-slate-400">Fundamental data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-sm text-slate-400">Market Cap</span>
                  <span className="text-sm font-semibold text-white">
                    ${(marketInfo.marketCap / 1000000000).toFixed(2)}B
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-sm text-slate-400">P/E Ratio</span>
                  <span className="text-sm font-semibold text-white">{marketInfo.pe}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-sm text-slate-400">Dividend Yield</span>
                  <span className="text-sm font-semibold text-white">{marketInfo.dividendYield}%</span>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Gann Analysis</h4>
                  <Link href={`/gann-chart?symbol=${marketInfo.symbol}`}>
                    <Button variant="outline" className="w-full mb-2 bg-slate-900 border-slate-700 hover:bg-slate-800">
                      View Gann Angles
                    </Button>
                  </Link>
                  <Link href={`/time-cycles?symbol=${marketInfo.symbol}`}>
                    <Button variant="outline" className="w-full bg-slate-900 border-slate-700 hover:bg-slate-800">
                      View Time Cycles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center text-slate-400">No data available</div>
        )}
      </main>
    </div>
  );
}

