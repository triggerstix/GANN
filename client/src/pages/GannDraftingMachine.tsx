import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Link } from "wouter";
import { ArrowLeft, Upload, Download, Trash2, Grid, Hexagon, Triangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type Point = { x: number; y: number };
type GannAngle = "1x8" | "1x4" | "1x2" | "1x1" | "2x1" | "4x1" | "8x1";

export default function GannDraftingMachine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [pivotPoint, setPivotPoint] = useState<Point | null>(null);
  const [priceHigh, setPriceHigh] = useState<number>(0);
  const [priceLow, setPriceLow] = useState<number>(0);
  const [pixelsPerPoint, setPixelsPerPoint] = useState<number>(1);
  
  // Tool settings
  const [showGannAngles, setShowGannAngles] = useState(true);
  const [showHexagon, setShowHexagon] = useState(false);
  const [showSquare, setShowSquare] = useState(false);
  const [angleDirection, setAngleDirection] = useState<"up" | "down">("up");
  const [lineOpacity, setLineOpacity] = useState([70]);
  const [hexagonSize, setHexagonSize] = useState([100]);
  
  const gannAngles: { name: GannAngle; ratio: number }[] = [
    { name: "1x8", ratio: 1/8 },
    { name: "1x4", ratio: 1/4 },
    { name: "1x2", ratio: 1/2 },
    { name: "1x1", ratio: 1 },
    { name: "2x1", ratio: 2 },
    { name: "4x1", ratio: 4 },
    { name: "8x1", ratio: 8 },
  ];

  // Load and display image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setPivotPoint(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle canvas click to set pivot point
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPivotPoint({ x, y });
  };

  // Calculate pixels per point based on price range
  useEffect(() => {
    if (priceHigh > priceLow && image) {
      const priceRange = priceHigh - priceLow;
      const pixelHeight = image.height;
      setPixelsPerPoint(pixelHeight / priceRange);
    }
  }, [priceHigh, priceLow, image]);

  // Draw everything on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the chart image
    ctx.drawImage(image, 0, 0);

    // Draw overlays
    if (pivotPoint) {
      // Draw pivot point
      ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
      ctx.beginPath();
      ctx.arc(pivotPoint.x, pivotPoint.y, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Draw Gann angles
      if (showGannAngles) {
        drawGannAngles(ctx, pivotPoint);
      }

      // Draw hexagon
      if (showHexagon) {
        drawHexagon(ctx, pivotPoint, hexagonSize[0]);
      }

      // Draw square
      if (showSquare) {
        drawSquare(ctx, pivotPoint, hexagonSize[0]);
      }
    }
  }, [image, pivotPoint, showGannAngles, showHexagon, showSquare, angleDirection, lineOpacity, hexagonSize]);

  // Draw Gann angles from pivot point
  const drawGannAngles = (ctx: CanvasRenderingContext2D, pivot: Point) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const opacity = lineOpacity[0] / 100;
    const colors = [
      `rgba(255, 100, 100, ${opacity})`,  // 1x8 - light red
      `rgba(255, 150, 100, ${opacity})`,  // 1x4 - orange
      `rgba(255, 200, 100, ${opacity})`,  // 1x2 - yellow-orange
      `rgba(100, 255, 100, ${opacity})`,  // 1x1 - green (master angle)
      `rgba(100, 200, 255, ${opacity})`,  // 2x1 - light blue
      `rgba(100, 150, 255, ${opacity})`,  // 4x1 - blue
      `rgba(150, 100, 255, ${opacity})`,  // 8x1 - purple
    ];

    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    gannAngles.forEach((angle, index) => {
      ctx.strokeStyle = colors[index];
      ctx.beginPath();
      ctx.moveTo(pivot.x, pivot.y);

      // Calculate angle based on ratio and direction
      const multiplier = angleDirection === "up" ? -1 : 1;
      const angleRadians = Math.atan(angle.ratio * multiplier);
      
      // Draw line to edge of canvas
      const length = Math.max(canvas.width, canvas.height) * 2;
      const endX = pivot.x + length * Math.cos(angleRadians);
      const endY = pivot.y + length * Math.sin(angleRadians);

      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw label
      ctx.fillStyle = colors[index];
      ctx.font = "12px Arial";
      const labelX = pivot.x + 100 * Math.cos(angleRadians);
      const labelY = pivot.y + 100 * Math.sin(angleRadians);
      ctx.fillText(angle.name, labelX, labelY);
    });

    ctx.setLineDash([]);
  };

  // Draw hexagon pattern
  const drawHexagon = (ctx: CanvasRenderingContext2D, center: Point, size: number) => {
    const opacity = lineOpacity[0] / 100;
    ctx.strokeStyle = `rgba(150, 150, 255, ${opacity})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);

    for (let scale = 0.5; scale <= 2; scale += 0.5) {
      const radius = size * scale;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }

    ctx.setLineDash([]);
  };

  // Draw square pattern
  const drawSquare = (ctx: CanvasRenderingContext2D, center: Point, size: number) => {
    const opacity = lineOpacity[0] / 100;
    ctx.strokeStyle = `rgba(255, 150, 150, ${opacity})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);

    for (let scale = 0.5; scale <= 2; scale += 0.5) {
      const halfSize = (size * scale) / Math.sqrt(2);
      ctx.strokeRect(
        center.x - halfSize,
        center.y - halfSize,
        halfSize * 2,
        halfSize * 2
      );
    }

    ctx.setLineDash([]);
  };

  // Export canvas as image
  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gann-analysis.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  // Clear all overlays
  const handleClear = () => {
    setPivotPoint(null);
  };

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
                <h1 className="text-2xl font-bold text-white">Gann Drafting Machine</h1>
                <p className="text-sm text-slate-400">Interactive geometric overlay tool</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Chart
              </Button>
              <Button
                onClick={handleExport}
                disabled={!image || !pivotPoint}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={handleClear}
                disabled={!pivotPoint}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Price Calibration */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Price Calibration</CardTitle>
                <CardDescription className="text-slate-400">
                  Set the price range of your chart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300">High Price</Label>
                  <Input
                    type="number"
                    value={priceHigh || ""}
                    onChange={(e) => setPriceHigh(parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 608"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Low Price</Label>
                  <Input
                    type="number"
                    value={priceLow || ""}
                    onChange={(e) => setPriceLow(parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 582"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                {pixelsPerPoint > 0 && (
                  <p className="text-xs text-slate-400">
                    Scale: {pixelsPerPoint.toFixed(2)} pixels/point
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Gann Tools */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Gann Tools</CardTitle>
                <CardDescription className="text-slate-400">
                  Enable geometric overlays
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Triangle className="h-4 w-4 text-green-400" />
                    <Label className="text-slate-300">Gann Angles</Label>
                  </div>
                  <Switch
                    checked={showGannAngles}
                    onCheckedChange={setShowGannAngles}
                  />
                </div>

                {showGannAngles && (
                  <div className="pl-6 space-y-2">
                    <Label className="text-slate-300 text-sm">Direction</Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={angleDirection === "up" ? "default" : "outline"}
                        onClick={() => setAngleDirection("up")}
                        className="flex-1"
                      >
                        Uptrend
                      </Button>
                      <Button
                        size="sm"
                        variant={angleDirection === "down" ? "default" : "outline"}
                        onClick={() => setAngleDirection("down")}
                        className="flex-1"
                      >
                        Downtrend
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hexagon className="h-4 w-4 text-blue-400" />
                    <Label className="text-slate-300">Hexagon</Label>
                  </div>
                  <Switch
                    checked={showHexagon}
                    onCheckedChange={setShowHexagon}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Grid className="h-4 w-4 text-red-400" />
                    <Label className="text-slate-300">Square</Label>
                  </div>
                  <Switch
                    checked={showSquare}
                    onCheckedChange={setShowSquare}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">
                    Line Opacity: {lineOpacity[0]}%
                  </Label>
                  <Slider
                    value={lineOpacity}
                    onValueChange={setLineOpacity}
                    min={10}
                    max={100}
                    step={10}
                    className="w-full"
                  />
                </div>

                {(showHexagon || showSquare) && (
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">
                      Pattern Size: {hexagonSize[0]}px
                    </Label>
                    <Slider
                      value={hexagonSize}
                      onValueChange={setHexagonSize}
                      min={50}
                      max={300}
                      step={10}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-300">
                <p>1. Upload a chart image</p>
                <p>2. Set the high/low prices for calibration</p>
                <p>3. Click on the chart to set a pivot point</p>
                <p>4. Enable Gann tools (angles, hexagons, squares)</p>
                <p>5. Adjust opacity and size as needed</p>
                <p>6. Export your annotated chart</p>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Chart Canvas</CardTitle>
                <CardDescription className="text-slate-400">
                  {image
                    ? pivotPoint
                      ? "Gann overlays active. Click Export to save your analysis."
                      : "Click on the chart to set a pivot point for Gann angles"
                    : "Upload a chart image to begin"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-slate-900 rounded-lg overflow-hidden min-h-[600px] flex items-center justify-center">
                  {image ? (
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      className="cursor-crosshair max-w-full h-auto"
                      style={{ maxHeight: "800px" }}
                    />
                  ) : (
                    <div className="text-center py-20">
                      <Upload className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 mb-4">No chart loaded</p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Chart Image
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}

