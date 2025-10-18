import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default function SquareOfNine() {
  const [centerValue, setCenterValue] = useState(100);
  const [gridSize] = useState(9);

  const calculateSquareOfNine = (center: number, size: number) => {
    const grid: number[][] = [];
    const halfSize = Math.floor(size / 2);
    let value = center;
    let x = halfSize;
    let y = halfSize;
    
    for (let i = 0; i < size; i++) {
      grid[i] = new Array(size).fill(0);
    }
    
    grid[y][x] = value;
    value++;
    
    let step = 1;
    while (step < size) {
      for (let i = 0; i < step && value <= center + size * size; i++) {
        x++;
        if (x < size && y < size) grid[y][x] = value++;
      }
      for (let i = 0; i < step && value <= center + size * size; i++) {
        y--;
        if (x < size && y >= 0) grid[y][x] = value++;
      }
      step++;
      for (let i = 0; i < step && value <= center + size * size; i++) {
        x--;
        if (x >= 0 && y >= 0) grid[y][x] = value++;
      }
      for (let i = 0; i < step && value <= center + size * size; i++) {
        y++;
        if (x >= 0 && y < size) grid[y][x] = value++;
      }
      step++;
    }
    
    return grid;
  };

  const grid = calculateSquareOfNine(centerValue, gridSize);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-400">Square of Nine</h1>
          <p className="text-slate-400 mt-2">Calculate key price levels using Gann's Square of Nine</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Center Value</CardTitle>
            <CardDescription className="text-slate-400">Enter the starting price or value</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={centerValue}
              onChange={(e) => setCenterValue(Number(e.target.value))}
              className="bg-slate-900 border-slate-700 text-slate-100"
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Square of Nine Grid</CardTitle>
            <CardDescription className="text-slate-400">Key price levels arranged in spiral pattern</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {grid.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`border border-slate-700 p-3 text-center ${
                            i === Math.floor(gridSize / 2) && j === Math.floor(gridSize / 2)
                              ? "bg-blue-500/20 text-blue-400 font-bold"
                              : "bg-slate-900/50 text-slate-300"
                          }`}
                        >
                          {cell || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
