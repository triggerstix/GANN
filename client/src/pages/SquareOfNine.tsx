import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Grid3x3, ArrowLeft } from "lucide-react";

export default function SquareOfNine() {
  const [centerPrice, setCenterPrice] = useState(100);
  const [squareSize, setSquareSize] = useState(7);

  const generateSquare = () => {
    const square: number[][] = [];
    const size = squareSize;
    const center = Math.floor(size / 2);

    for (let i = 0; i < size; i++) {
      square[i] = [];
      for (let j = 0; j < size; j++) {
        square[i][j] = 0;
      }
    }

    square[center][center] = centerPrice;
    let current = centerPrice;
    let x = center;
    let y = center;
    let step = 1;

    const directions = [
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 0],
    ];
    let dirIndex = 0;

    while (step < size * size) {
      for (let i = 0; i < 2; i++) {
        const [dx, dy] = directions[dirIndex];
        for (let j = 0; j < Math.ceil(step / 2); j++) {
          x += dx;
          y += dy;
          if (x >= 0 && x < size && y >= 0 && y < size) {
            current++;
            square[x][y] = current;
          }
        }
        dirIndex = (dirIndex + 1) % 4;
      }
      step++;
    }

    return square;
  };

  const square = generateSquare();

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
          <h1 className="text-3xl font-bold text-white">Square of Nine</h1>
          <p className="text-slate-400 mt-2">Calculate key price levels using Gann's Square of Nine</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Square Visualization */}
          <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Grid3x3 className="w-5 h-5 text-purple-400" />
                Square of Nine - Center: {centerPrice}
              </CardTitle>
              <CardDescription className="text-slate-400">
                Interactive visualization of Gann's Square of Nine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {square.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => {
                          const isCenter = i === Math.floor(squareSize / 2) && j === Math.floor(squareSize / 2);
                          return (
                            <td
                              key={j}
                              className={`border border-slate-600 p-4 text-center font-mono ${
                                isCenter
                                  ? "bg-purple-600 text-white font-bold"
                                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                              }`}
                            >
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Controls Panel */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Square Controls</CardTitle>
              <CardDescription className="text-slate-400">Configure the square parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Center Price</Label>
                <Input
                  type="number"
                  value={centerPrice}
                  onChange={(e) => setCenterPrice(parseFloat(e.target.value))}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Square Size (3-15)</Label>
                <Input
                  type="number"
                  value={squareSize}
                  onChange={(e) => setSquareSize(Math.max(3, Math.min(15, parseInt(e.target.value) || 7)))}
                  min="3"
                  max="15"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="bg-purple-900/20 border border-purple-800/50 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-semibold text-purple-400 mb-2">About Square of Nine</h4>
                <p className="text-xs text-slate-400 mb-3">
                  The Square of Nine is a geometric pattern used to calculate support and resistance levels. Numbers
                  spiral outward from the center, with key angles (45°, 90°, 180°, 270°) representing important price
                  levels.
                </p>
                <div className="space-y-2 text-xs text-slate-400">
                  <div>
                    <span className="font-semibold text-purple-400">Cardinal Cross (0°, 90°, 180°, 270°):</span> Major
                    support/resistance
                  </div>
                  <div>
                    <span className="font-semibold text-purple-400">Fixed Cross (45°, 135°, 225°, 315°):</span>{" "}
                    Secondary levels
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

