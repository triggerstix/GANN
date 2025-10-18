import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft } from "lucide-react";

export default function TimeCycles() {
  const [symbol, setSymbol] = useState("AAPL");
  const { data, isLoading } = trpc.gann.timeCyclesData.useQuery({ symbol });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-400">Time Cycles</h1>
          <p className="text-slate-400 mt-2">Identify recurring time cycles for market analysis</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Select Symbol</CardTitle>
            <CardDescription className="text-slate-400">Choose a symbol to analyze time cycles</CardDescription>
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
          <div className="text-center text-slate-400 py-12">Loading cycle data...</div>
        ) : data ? (
          <>
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-slate-100">Identified Cycles</CardTitle>
                <CardDescription className="text-slate-400">Key time cycles for {symbol}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.cycles.map((cycle, index) => (
                    <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-blue-400 font-semibold">{cycle.name}</div>
                      <div className="text-slate-300 text-sm mt-1">Period: {cycle.period} days</div>
                      <div className="text-slate-400 text-xs mt-1">Phase: {(cycle.phase * 100).toFixed(0)}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Price History</CardTitle>
                <CardDescription className="text-slate-400">Historical price data for cycle analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                    <Line type="monotone" dataKey="close" stroke="#3b82f6" name="Close Price" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        ) : null}
      </main>
    </div>
  );
}
