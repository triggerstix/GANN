import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ArrowLeft, Calculator } from "lucide-react";

export default function SquareOfNine() {
  const [centerValue, setCenterValue] = useState("100");
  const [gridSize, setGridSize] = useState(9);

  // Generate Square of Nine
  const generateSquare = (center: number, size: number) => {
    const grid: number[][] = [];
    const middle = Math.floor(size / 2);
    
    // Initialize grid
    for (let i = 0; i < size; i++) {
      grid[i] = new Array(size).fill(0);
    }
    
    // Start from center
    let x = middle;
    let y = middle;
    let num = center;
    grid[y][x] = num;
    
    // Spiral outward
    let steps = 1;
    while (steps < size) {
      // Move right
      for (let i = 0; i < steps && x < size - 1; i++) {
        x++;
        num++;
        if (x < size && y >= 0 && y < size) grid[y][x] = num;
      }
      
      // Move down
      for (let i = 0; i < steps && y < size - 1; i++) {
        y++;
        num++;
        if (x >= 0 && x < size && y < size) grid[y][x] = num;
      }
      
      steps++;
      
      // Move left
      for (let i = 0; i < steps && x > 0; i++) {
        x--;
        num++;
        if (x >= 0 && y >= 0 && y < size) grid[y][x] = num;
      }
      
      // Move up
      for (let i = 0; i < steps && y > 0; i++) {
        y--;
        num++;
        if (x >= 0 && x < size && y >= 0) grid[y][x] = num;
      }
      
      steps++;
    }
    
    return grid;
  };

  const square = generateSquare(parseFloat(centerValue) || 100, gridSize);
  const middle = Math.floor(gridSize / 2);

  // Calculate key angles from center
  const calculateKeyLevels = (center: number) => {
    const sqrt = Math.sqrt(center);
    return {
      cardinal: [
        { name: "0° (East)", value: Math.pow(sqrt + 1, 2) },
        { name: "90° (North)", value: Math.pow(sqrt + 0.5, 2) },
        { name: "180° (West)", value: Math.pow(sqrt - 1, 2) },
        { name: "270° (South)", value: Math.pow(sqrt - 0.5, 2) },
      ],
      diagonal: [
        { name: "45° (NE)", value: Math.pow(sqrt + 0.707, 2) },
        { name: "135° (NW)", value: Math.pow(sqrt + 0.293, 2) },
        { name: "225° (SW)", value: Math.pow(sqrt - 0.707, 2) },
        { name: "315° (SE)", value: Math.pow(sqrt - 0.293, 2) },
      ],
    };
  };

  const keyLevels = calculateKeyLevels(parseFloat(centerValue) || 100);

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
          <Calculator className="h-6 w-6 text-purple-500" />
          <h1 className="text-2xl font-bold text-white">Square of Nine Calculator</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Input Card */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Configure Square</CardTitle>
            <CardDescription className="text-slate-400">
              Enter a center value (current price) to generate the Square of Nine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300 mb-2 block">Center Value (Price)</Label>
                <Input
                  type="number"
                  value={centerValue}
                  onChange={(e) => setCenterValue(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                  placeholder="100.00"
                />
              </div>
              <div>
                <Label className="text-slate-300 mb-2 block">Grid Size</Label>
                <div className="flex gap-2">
                  {[7, 9, 11, 13].map((size) => (
                    <Button
                      key={size}
                      variant={gridSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGridSize(size)}
                      className={gridSize === size ? "bg-purple-600" : "border-slate-600 text-slate-300"}
                    >
                      {size}x{size}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Square Grid */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">The Square of Nine</CardTitle>
            <CardDescription className="text-slate-400">
              Numbers spiral outward from the center. Diagonal and cardinal lines represent key price levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
                  {square.map((row, i) =>
                    row.map((cell, j) => {
                      const isCenter = i === middle && j === middle;
                      const isDiagonal = i === j || i + j === gridSize - 1;
                      const isCardinal = i === middle || j === middle;
                      
                      let bgColor = "bg-slate-900";
                      if (isCenter) bgColor = "bg-purple-600";
                      else if (isDiagonal) bgColor = "bg-blue-900/50";
                      else if (isCardinal) bgColor = "bg-green-900/50";
                      
                      return (
                        <div
                          key={`${i}-${j}`}
                          className={`${bgColor} border border-slate-700 p-2 text-center text-white font-mono text-sm`}
                        >
                          {cell.toFixed(2)}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                <span className="text-slate-300">Center (Current Price)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-900/50 border border-slate-700 rounded"></div>
                <span className="text-slate-300">Cardinal Lines (0°, 90°, 180°, 270°)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-900/50 border border-slate-700 rounded"></div>
                <span className="text-slate-300">Diagonal Lines (45°, 135°, 225°, 315°)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Levels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Cardinal Angles</CardTitle>
              <CardDescription className="text-slate-400">
                Major support and resistance levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keyLevels.cardinal.map((level) => (
                  <div
                    key={level.name}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <span className="text-slate-300">{level.name}</span>
                    <span className="text-white font-bold">${level.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Diagonal Angles</CardTitle>
              <CardDescription className="text-slate-400">
                Secondary support and resistance levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keyLevels.diagonal.map((level) => (
                  <div
                    key={level.name}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <span className="text-slate-300">{level.name}</span>
                    <span className="text-white font-bold">${level.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* About Square of Nine */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">About the Square of Nine</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-3">
            <p>
              The Square of Nine is one of W.D. Gann's most powerful tools. It's based on the 
              mathematical relationship between square roots and squares, creating a spiral of 
              numbers that represent price levels.
            </p>
            <p>
              <strong className="text-white">How to use it:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Cardinal Lines (0°, 90°, 180°, 270°):</strong> Major support/resistance
              </li>
              <li>
                <strong className="text-white">Diagonal Lines (45°, 135°, 225°, 315°):</strong> Secondary levels
              </li>
              <li>
                <strong className="text-white">Price Targets:</strong> Numbers along these lines are potential price targets
              </li>
              <li>
                <strong className="text-white">Degrees:</strong> Each cell represents a degree of rotation from center
              </li>
            </ul>
            <p>
              When price reaches a number on a cardinal or diagonal line, it often finds 
              support or resistance. Traders use these levels to set profit targets and stop losses.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

