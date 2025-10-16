import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Calculator, TrendingUp, TrendingDown } from 'lucide-react'

const SquareOfNine = () => {
  const [centerPrice, setCenterPrice] = useState(100)
  const [squareSize, setSquareSize] = useState(7)
  const [calculatedLevels, setCalculatedLevels] = useState([])

  // Calculate Square of Nine
  const calculateSquareOfNine = () => {
    const levels = []
    const sqrt = Math.sqrt(centerPrice)
    
    // Calculate key angles (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°, 360°)
    const angles = [0, 45, 90, 135, 180, 225, 270, 315, 360]
    
    angles.forEach(angle => {
      const radians = (angle * Math.PI) / 180
      const increment = radians / (2 * Math.PI)
      
      // Support levels (below)
      const supportLevel = Math.pow(sqrt - increment, 2)
      // Resistance levels (above)
      const resistanceLevel = Math.pow(sqrt + increment, 2)
      
      levels.push({
        angle: angle,
        support: supportLevel.toFixed(2),
        resistance: resistanceLevel.toFixed(2),
        type: angle === 0 || angle === 360 ? 'Cardinal' : angle % 90 === 0 ? 'Cardinal' : 'Ordinal'
      })
    })
    
    setCalculatedLevels(levels)
  }

  // Generate Square of Nine grid
  const generateSquareGrid = () => {
    const size = squareSize
    const grid = []
    let value = centerPrice
    const center = Math.floor(size / 2)
    
    // Initialize grid
    for (let i = 0; i < size; i++) {
      grid[i] = []
      for (let j = 0; j < size; j++) {
        grid[i][j] = 0
      }
    }
    
    // Fill center
    grid[center][center] = centerPrice
    
    // Spiral outward
    let x = center, y = center
    let steps = 1
    let num = centerPrice + 1
    
    while (steps < size) {
      // Move right
      for (let i = 0; i < steps && x + 1 < size; i++) {
        x++
        grid[y][x] = num++
      }
      // Move down
      for (let i = 0; i < steps && y + 1 < size; i++) {
        y++
        grid[y][x] = num++
      }
      steps++
      // Move left
      for (let i = 0; i < steps && x - 1 >= 0; i++) {
        x--
        grid[y][x] = num++
      }
      // Move up
      for (let i = 0; i < steps && y - 1 >= 0; i++) {
        y--
        grid[y][x] = num++
      }
      steps++
    }
    
    return grid
  }

  const squareGrid = generateSquareGrid()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Square of Nine Grid */}
      <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calculator className="w-5 h-5 text-purple-400" />
            Square of Nine Grid
          </CardTitle>
          <CardDescription className="text-slate-400">
            Gann's Square of Nine - A geometric tool for identifying support and resistance levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="inline-grid gap-1 p-4 bg-slate-900/50 rounded-lg" 
                 style={{ gridTemplateColumns: `repeat(${squareSize}, minmax(0, 1fr))` }}>
              {squareGrid.map((row, i) => (
                row.map((cell, j) => {
                  const isCenter = i === Math.floor(squareSize / 2) && j === Math.floor(squareSize / 2)
                  const isCardinal = (i === Math.floor(squareSize / 2) || j === Math.floor(squareSize / 2))
                  const isDiagonal = (i === j || i + j === squareSize - 1)
                  
                  return (
                    <div
                      key={`${i}-${j}`}
                      className={`
                        w-16 h-16 flex items-center justify-center text-sm font-semibold rounded-lg
                        transition-all hover:scale-105 cursor-pointer
                        ${isCenter ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' : 
                          isCardinal ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50' :
                          isDiagonal ? 'bg-green-600/30 text-green-300 border border-green-500/50' :
                          'bg-slate-700/50 text-slate-300 border border-slate-600/50'}
                      `}
                    >
                      {cell > 0 ? cell.toFixed(0) : ''}
                    </div>
                  )
                })
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
              <span className="text-sm text-slate-300">Center Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600/30 border border-blue-500/50 rounded"></div>
              <span className="text-sm text-slate-300">Cardinal Points</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600/30 border border-green-500/50 rounded"></div>
              <span className="text-sm text-slate-300">Diagonal Lines</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls and Calculations */}
      <div className="space-y-6">
        {/* Input Controls */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Configuration</CardTitle>
            <CardDescription className="text-slate-400">
              Set center price and grid size
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label className="text-slate-300">Grid Size</Label>
              <Input
                type="number"
                value={squareSize}
                onChange={(e) => setSquareSize(parseInt(e.target.value))}
                min="5"
                max="11"
                step="2"
                className="bg-slate-900 border-slate-700 text-white"
              />
              <p className="text-xs text-slate-500">Must be odd number (5-11)</p>
            </div>

            <Button
              onClick={calculateSquareOfNine}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Calculate Levels
            </Button>
          </CardContent>
        </Card>

        {/* Calculated Levels */}
        {calculatedLevels.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Key Levels</CardTitle>
              <CardDescription className="text-slate-400">
                Support and resistance from Square of Nine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {calculatedLevels.map((level, idx) => (
                  <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-300">{level.angle}°</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        level.type === 'Cardinal' ? 'bg-blue-600/30 text-blue-300' : 'bg-green-600/30 text-green-300'
                      }`}>
                        {level.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-red-400" />
                        <span className="text-slate-400">Support:</span>
                        <span className="text-red-400 font-semibold">{level.support}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-slate-400">Resistance:</span>
                        <span className="text-green-400 font-semibold">{level.resistance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="bg-blue-900/20 border-blue-800/50">
          <CardContent className="pt-6">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">About Square of Nine</h4>
            <p className="text-xs text-slate-400">
              The Square of Nine is based on the mathematical relationship between price and square roots. 
              Numbers spiral outward from the center, with cardinal and diagonal lines representing 
              significant support and resistance levels. This tool helps identify natural price targets.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SquareOfNine

