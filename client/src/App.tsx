import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import GannChart from "./pages/GannChart";
import SquareOfNine from "./pages/SquareOfNine";
import TimeCycles from "./pages/TimeCycles";
import AstroAnalysis from "./pages/AstroAnalysis";
import MarketData from "./pages/MarketData";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/gann-chart"} component={GannChart} />
      <Route path={"/square-of-nine"} component={SquareOfNine} />
      <Route path={"/time-cycles"} component={TimeCycles} />
      <Route path={"/astro-analysis"} component={AstroAnalysis} />
      <Route path={"/market-data"} component={MarketData} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
