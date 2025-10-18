import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";

export default function MarketData() {
  const [symbol, setSymbol] = useState("AAPL");
  const { data, isLoading } = trpc.gann.marketInfo.useQuery({ symbol });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-400">Live Market Data</h1>
          <p className="text-slate-400 mt-2">Real-time market information and statistics</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Select Symbol</CardTitle>
            <CardDescription className="text-slate-400">Choose a stock or cryptocurrency</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="w-full bg-slate-900 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AAPL">Apple (AAPL)</SelectItem>
                <SelectItem value="GOOGL">Google (GOOGL)</SelectItem>
                <SelectItem value="MSFT">Microsoft (MSFT)</SelectItem>
                <SelectItem value="TSLA">Tesla (TSLA)</SelectItem>
                <SelectItem value="SPY">S&P 500 (SPY)</SelectItem>
                <SelectItem value="BTC-USD">Bitcoin (BTC-USD)</SelectItem>
                <SelectItem value="ETH-USD">Ethereum (ETH-USD)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center text-slate-400 py-12">Loading market data...</div>
        ) : data ? (
          <>
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-slate-100 text-3xl">{data.symbol}</CardTitle>
                <CardDescription className="text-slate-400">Current market price</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-slate-100">${data.price.toFixed(2)}</div>
                  <div className={`flex items-center gap-2 ${data.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {data.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                    <span className="text-xl font-semibold">
                      {data.change >= 0 ? "+" : ""}
                      {data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 text-sm">High</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">${data.high.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 text-sm">Low</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">${data.low.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 text-sm">Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{data.volume.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 text-sm">Market Cap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{data.marketCap}</div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
