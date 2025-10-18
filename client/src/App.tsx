import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MarketData from "./pages/MarketData";
import GannChart from "./pages/GannChart";
import SquareOfNine from "./pages/SquareOfNine";
import TimeCycles from "./pages/TimeCycles";
import AstroAnalysis from "./pages/AstroAnalysis";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/market-data"} component={MarketData} />
      <Route path={"/gann-chart"} component={GannChart} />
      <Route path={"/square-of-nine"} component={SquareOfNine} />
      <Route path={"/time-cycles"} component={TimeCycles} />
      <Route path={"/astro-analysis"} component={AstroAnalysis} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

