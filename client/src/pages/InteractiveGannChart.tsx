import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { ArrowLeft, RefreshCw, Download, Trash2, Grid, Hexagon, Triangle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label as RechartsLabel } from "recharts";

type Point = { x: number; y: number; price: number; date: string };
type GannAngle = "1x8" | "1x4" | "1x2" | "1x1" | "2x1" | "4x1" | "8x1";

export default function InteractiveGannChart() {
  const [symbol, setSymbol] = useState("AAPL");
  const [inputSymbol, setInputSymbol] = useState("AAPL");
  const [days, setDays] = useState(180);
  const [interval, setInterval] = useState("1d");
  const [pivotPoint, setPivotPoint] = useState<Point | null>(null);
  const [angleDirection, setAngleDirection] = useState<"up" | "down">("up");
  const [showGannAngles, setShowGannAngles] = useState(true);
  const [showHexagon, setShowHexagon] = useState(false);
  const [lineOpacity, setLineOpacity] = useState([70]);
  const [selectedAngles, setSelectedAngles] = useState<GannAngle[]>(["1x1", "1x2", "2x1"]);

  const historicalDataQuery = trpc.gann.getHistoricalData.useQuery({ 
    symbol, 
    days,
    interval 
  });
  
  const pivotsQuery = trpc.gann.findMajorPivots.useQuery({ 
    symbol, 
    days 
  });

  const popularSymbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "SPY", "QQQ", "BTC-USD"];

  const gannAngles: { name: GannAngle; ratio: number; color: string }[] = [
    { name: "1x8", ratio: 0.125, color: "#ff6464" },
    { name: "1x4", ratio: 0.25, color: "#ff9664" },
    { name: "1x2", ratio: 0.5, color: "#ffc864" },
    { name: "1x1", ratio: 1, color: "#64ff64" },
    { name: "2x1", ratio: 2, color: "#64c8ff" },
    { name: "4x1", ratio: 4, color: "#6496ff" },
    { name: "8x1", ratio: 8, color: "#9664ff" },
  ];

  const handleSymbolChange = () => {
    setSymbol(inputSymbol.toUpperCase());
    setPivotPoint(null);
  };

  const handleRefresh = () => {
    historicalDataQuery.refetch();
    pivotsQuery.refetch();
  };

  const setMajorHighPivot = () => {
    if (pivotsQuery.data?.majorHigh) {
      setPivotPoint({
        x: 0,
        y: 0,
        price: pivotsQuery.data.majorHigh.price,
        date: pivotsQuery.data.majorHigh.date,
      });
      setAngleDirection("down");
    }
  };

  const setMajorLowPivot = () => {
    if (pivotsQuery.data?.majorLow) {
      setPivotPoint({
        x: 0,
        y: 0,
        price: pivotsQuery.data.majorLow.price,
        date: pivotsQuery.data.majorLow.date,
      });
      setAngleDirection("up");
    }
  };

  const toggleAngle = (angleName: GannAngle) => {
    setSelectedAngles(prev => 
      prev.includes(angleName)
        ? prev.filter(a => a !== angleName)
        : [...prev, angleName]
    );
  };

  // Calculate Gann angle lines for the chart
  const calculateAngleLines = () => {
    if (!pivotPoint || !historicalDataQuery.data) return [];

    const data = historicalDataQuery.data;
    const pivotIndex = data.findIndex(d => d.date === pivotPoint.date);
    if (pivotIndex === -1) return [];

    const lines: any[] = [];

    selectedAngles.forEach(angleName => {
      const angle = gannAngles.find(a => a.name === angleName);
      if (!angle) return;

      const multiplier = angleDirection === "up" ? angle.ratio : -angle.ratio;
      
      // Calculate angle line points
      const angleData = data.map((d, index) => {
        const daysDiff = index - pivotIndex;
        const price = pivotPoint.price + (daysDiff * multiplier);
        return {
          date: d.date,
          [`${angleName}_${angleDirection}`]: price,
        };
      });

      lines.push({
        name: angleName,
        data: angleData,
        color: angle.color,
      });
    });

    return lines;
  };

  const angleLines = calculateAngleLines();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Interactive Gann Chart</h1>
                <p className="text-sm text-slate-400">Live market data with Gann angle overlays</p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={historicalDataQuery.isLoading}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${historicalDataQuery.isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Symbol Selection */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Symbol</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {popularSymbols.map((sym) => (
                    <Button
                      key={sym}
                      variant={symbol === sym ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSymbol(sym);
                        setInputSymbol(sym);
                        setPivotPoint(null);
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
                    placeholder="Symbol..."
                    className="bg-slate-700 border-slate-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSymbolChange()}
                  />
                  <Button onClick={handleSymbolChange} className="bg-blue-600">
                    Load
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Time Period */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Time Period</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300">Days</Label>
                  <Select value={days.toString()} onValueChange={(v) => setDays(parseInt(v))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="180">180 Days</SelectItem>
                      <SelectItem value="365">1 Year</SelectItem>
                      <SelectItem value="730">2 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-300">Interval</Label>
                  <Select value={interval} onValueChange={setInterval}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">Daily</SelectItem>
                      <SelectItem value="1wk">Weekly</SelectItem>
                      <SelectItem value="1mo">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Pivot Points */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Pivot Points</CardTitle>
                <CardDescription className="text-slate-400">
                  Set angle origin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={setMajorHighPivot}
                  disabled={!pivotsQuery.data}
                  variant="outline"
                  className="w-full border-red-500 text-red-400 hover:bg-red-500/10"
                >
                  Major High
                  {pivotsQuery.data && (
                    <span className="ml-2 text-xs">
                      ${pivotsQuery.data.majorHigh.price.toFixed(2)}
                    </span>
                  )}
                </Button>
                <Button
                  onClick={setMajorLowPivot}
                  disabled={!pivotsQuery.data}
                  variant="outline"
                  className="w-full border-green-500 text-green-400 hover:bg-green-500/10"
                >
                  Major Low
                  {pivotsQuery.data && (
                    <span className="ml-2 text-xs">
                      ${pivotsQuery.data.majorLow.price.toFixed(2)}
                    </span>
                  )}
                </Button>
                {pivotPoint && (
                  <div className="text-sm text-slate-400 mt-2">
                    <p>Pivot: ${pivotPoint.price.toFixed(2)}</p>
                    <p>Date: {pivotPoint.date}</p>
                    <p>Direction: {angleDirection === "up" ? "↗ Uptrend" : "↘ Downtrend"}</p>
                  </div>
                )}
                <Button
                  onClick={() => setPivotPoint(null)}
                  disabled={!pivotPoint}
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-600 text-slate-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </CardContent>
            </Card>

            {/* Gann Angles */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Gann Angles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {gannAngles.map((angle) => (
                  <div key={angle.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: angle.color }}
                      />
                      <Label className="text-slate-300">{angle.name}</Label>
                    </div>
                    <Switch
                      checked={selectedAngles.includes(angle.name)}
                      onCheckedChange={() => toggleAngle(angle.name)}
                    />
                  </div>
                ))}
                <div className="space-y-2 mt-4">
                  <Label className="text-slate-300 text-sm">
                    Opacity: {lineOpacity[0]}%
                  </Label>
                  <Slider
                    value={lineOpacity}
                    onValueChange={setLineOpacity}
                    min={10}
                    max={100}
                    step={10}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">{symbol}</CardTitle>
                <CardDescription className="text-slate-400">
                  {historicalDataQuery.data && `${historicalDataQuery.data.length} data points`}
                  {pivotPoint && ` • Pivot at $${pivotPoint.price.toFixed(2)}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {historicalDataQuery.isLoading ? (
                  <div className="h-[600px] flex items-center justify-center">
                    <div className="text-slate-400">Loading chart data...</div>
                  </div>
                ) : historicalDataQuery.error ? (
                  <div className="h-[600px] flex items-center justify-center">
                    <div className="text-red-400">Error loading data: {historicalDataQuery.error.message}</div>
                  </div>
                ) : historicalDataQuery.data ? (
                  <ResponsiveContainer width="100%" height={600}>
                    <LineChart data={historicalDataQuery.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      
                      {/* Price Line */}
                      <Line 
                        type="monotone" 
                        dataKey="close" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={false}
                        name="Price"
                      />

                      {/* Gann Angle Lines */}
                      {pivotPoint && angleLines.map((line) => (
                        <Line
                          key={line.name}
                          type="monotone"
                          data={line.data}
                          dataKey={`${line.name}_${angleDirection}`}
                          stroke={line.color}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          opacity={lineOpacity[0] / 100}
                          name={`${line.name} ${angleDirection === "up" ? "↗" : "↘"}`}
                        />
                      ))}

                      {/* Pivot Point Line */}
                      {pivotPoint && (
                        <ReferenceLine
                          y={pivotPoint.price}
                          stroke="#ef4444"
                          strokeDasharray="3 3"
                          strokeWidth={2}
                        >
                          <RechartsLabel 
                            value={`Pivot: $${pivotPoint.price.toFixed(2)}`} 
                            position="insideTopRight"
                            fill="#ef4444"
                          />
                        </ReferenceLine>
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[600px] flex items-center justify-center">
                    <div className="text-slate-400">No data available</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

