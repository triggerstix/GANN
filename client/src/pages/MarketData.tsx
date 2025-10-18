import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MarketData() {
  const [symbol, setSymbol] = useState("AAPL");
  const [inputSymbol, setInputSymbol] = useState("AAPL");
  
  const marketDataQuery = trpc.gann.marketData.useQuery({ symbol });
  const historicalDataQuery = trpc.gann.historicalData.useQuery({ symbol, days: 90 });

  const handleRefresh = () => {
    marketDataQuery.refetch();
    historicalDataQuery.refetch();
  };

  const handleSymbolChange = () => {
    setSymbol(inputSymbol.toUpperCase());
  };

  const popularSymbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "SPY", "BTC-USD", "ETH-USD"];

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
            <h1 className="text-2xl font-bold text-white">Market Data</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={marketDataQuery.isLoading}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${marketDataQuery.isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Symbol Selector */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Select Symbol</CardTitle>
            <CardDescription className="text-slate-400">
              Choose a symbol or enter your own
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4 flex-wrap">
              {popularSymbols.map((sym) => (
                <Button
                  key={sym}
                  variant={symbol === sym ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSymbol(sym);
                    setInputSymbol(sym);
                  }}
                  className={symbol === sym ? "bg-blue-600" : "border-slate-600 text-slate-300"}
                >
                  {sym}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={inputSymbol}
                onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
                placeholder="Enter symbol..."
                className="bg-slate-900 border-slate-700 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSymbolChange()}
              />
              <Button onClick={handleSymbolChange} className="bg-blue-600 hover:bg-blue-700">
                Load
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Price Card */}
        {marketDataQuery.data && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-3xl">{marketDataQuery.data.symbol}</CardTitle>
              <CardDescription className="text-slate-400">
                Last updated: {new Date(marketDataQuery.data.timestamp).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Current Price</p>
                  <p className="text-white text-3xl font-bold">
                    ${marketDataQuery.data.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Change</p>
                  <div className="flex items-center gap-2">
                    {marketDataQuery.data.change >= 0 ? (
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-500" />
                    )}
                    <div>
                      <p className={`text-2xl font-bold ${marketDataQuery.data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {marketDataQuery.data.change >= 0 ? '+' : ''}{marketDataQuery.data.change.toFixed(2)}
                      </p>
                      <p className={`text-sm ${marketDataQuery.data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ({marketDataQuery.data.changePercent >= 0 ? '+' : ''}{marketDataQuery.data.changePercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">High / Low</p>
                  <p className="text-white text-xl font-semibold">
                    ${marketDataQuery.data.high.toFixed(2)}
                  </p>
                  <p className="text-slate-400 text-xl">
                    ${marketDataQuery.data.low.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Volume</p>
                  <p className="text-white text-xl font-semibold">
                    {(marketDataQuery.data.volume / 1000000).toFixed(2)}M
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Historical Chart */}
        {historicalDataQuery.data && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">90-Day Price History</CardTitle>
              <CardDescription className="text-slate-400">
                Historical closing prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalDataQuery.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8' }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8' }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Close']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {marketDataQuery.isLoading && (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-slate-400">Loading market data...</p>
          </div>
        )}
      </div>
    </div>
  );
}

