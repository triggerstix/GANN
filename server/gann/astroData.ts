const phases = [
  { name: "New Moon", icon: "🌑", percent: 0, age: 0, influence: "New beginnings, potential trend reversals" },
  { name: "Waxing Crescent", icon: "🌒", percent: 25, age: 7, influence: "Building momentum, bullish tendency" },
  { name: "First Quarter", icon: "🌓", percent: 50, age: 14, influence: "Action phase, increased volatility" },
  { name: "Waxing Gibbous", icon: "🌔", percent: 75, age: 21, influence: "Refinement, continued upward pressure" },
  { name: "Full Moon", icon: "🌕", percent: 100, age: 29, influence: "Peak energy, potential tops/bottoms" },
  { name: "Waning Gibbous", icon: "🌖", percent: 75, age: 21, influence: "Distribution, bearish tendency" },
  { name: "Last Quarter", icon: "🌗", percent: 50, age: 14, influence: "Crisis phase, trend exhaustion" },
  { name: "Waning Crescent", icon: "🌘", percent: 25, age: 7, influence: "Release, preparing for new cycle" },
];

export function getLunarPhase() {
  return phases[Math.floor(Math.random() * phases.length)];
}

export function getPlanetaryPositions() {
  return [
    { planet: "Mercury", sign: "Gemini", degree: 15.2, icon: "☿", influence: "Communication, short-term trading", color: "#94a3b8" },
    { planet: "Venus", sign: "Taurus", degree: 22.8, icon: "♀", influence: "Market sentiment, value assessment", color: "#ec4899" },
    { planet: "Mars", sign: "Aries", degree: 8.1, icon: "♂", influence: "Energy, momentum, volatility", color: "#ef4444" },
    { planet: "Jupiter", sign: "Pisces", degree: 5.9, icon: "♃", influence: "Expansion, bull markets, optimism", color: "#f59e0b" },
    { planet: "Saturn", sign: "Aquarius", degree: 28.0, icon: "♄", influence: "Restriction, bear markets, reality", color: "#6366f1" },
  ];
}

export function getPlanetaryAspects() {
  return [
    { planets: "Sun ☉ Conjunction Mercury ☿", angle: 0, type: "Conjunction", influence: "Intense", description: "A conjunction between Sun and Mercury.", color: "#f59e0b" },
    { planets: "Venus ♀ Trine Jupiter ♃", angle: 120, type: "Trine", influence: "Harmonious", description: "A trine between Venus and Jupiter.", color: "#10b981" },
    { planets: "Mars ♂ Square Saturn ♄", angle: 90, type: "Square", influence: "Challenging", description: "A square between Mars and Saturn.", color: "#ef4444" },
  ];
}

