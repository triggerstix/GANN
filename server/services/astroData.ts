// Astrological data service for W.D. Gann Trading Platform

// Simplified lunar phase calculation
export function getLunarPhase(date: Date = new Date()) {
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const lunarCycle = 29.530588853; // days
  
  const daysSinceNew = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const age = daysSinceNew % lunarCycle;
  const illumination = (1 - Math.cos((age / lunarCycle) * 2 * Math.PI)) / 2;
  
  let phase: string;
  let interpretation: string;
  
  if (age < 1.84566) {
    phase = 'New Moon';
    interpretation = 'New beginnings, fresh starts. Good time to initiate new positions.';
  } else if (age < 5.53699) {
    phase = 'Waxing Crescent';
    interpretation = 'Growth phase, building momentum. Markets tend to strengthen.';
  } else if (age < 9.22831) {
    phase = 'First Quarter';
    interpretation = 'Action and decision time. Potential for increased volatility.';
  } else if (age < 12.91963) {
    phase = 'Waxing Gibbous';
    interpretation = 'Refinement phase. Markets approaching a peak or turning point.';
  } else if (age < 16.61096) {
    phase = 'Full Moon';
    interpretation = 'Culmination and completion. Often marks market tops or reversals.';
  } else if (age < 20.30228) {
    phase = 'Waning Gibbous';
    interpretation = 'Disseminating phase. Time to take profits and reduce exposure.';
  } else if (age < 23.99361) {
    phase = 'Last Quarter';
    interpretation = 'Rebalancing phase. Markets may consolidate or decline.';
  } else {
    phase = 'Waning Crescent';
    interpretation = 'Release and rest. Prepare for the next cycle.';
  }
  
  return {
    phase,
    illumination: illumination * 100,
    age: age,
    interpretation,
    date: date.toISOString(),
  };
}

// Simplified planetary positions (demonstration only)
export function getPlanetaryPositions(date: Date = new Date()) {
  const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                       'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  const zodiacSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  
  const planetsData = [
    { name: 'Sun', symbol: '☉', speed: 0.98 },
    { name: 'Moon', symbol: '☽', speed: 13.2 },
    { name: 'Mercury', symbol: '☿', speed: 1.6 },
    { name: 'Venus', symbol: '♀', speed: 1.2 },
    { name: 'Mars', symbol: '♂', speed: 0.52 },
    { name: 'Jupiter', symbol: '♃', speed: 0.083 },
    { name: 'Saturn', symbol: '♄', speed: 0.033 },
  ];
  
  // Simplified calculation based on date
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  return planetsData.map((planet, index) => {
    const longitude = ((dayOfYear * planet.speed) + (index * 30)) % 360;
    const signIndex = Math.floor(longitude / 30);
    const degrees = longitude % 30;
    const retrograde = Math.random() > 0.8; // 20% chance of retrograde for demo
    
    return {
      name: planet.name,
      symbol: planet.symbol,
      sign: zodiacSigns[signIndex],
      signSymbol: zodiacSymbols[signIndex],
      degrees: degrees,
      longitude: longitude,
      retrograde: retrograde,
    };
  });
}

// Calculate planetary aspects
export function getPlanetaryAspects(positions: any[]) {
  const aspects: any[] = [];
  const aspectTypes = [
    { name: 'Conjunction', angle: 0, orb: 8, interpretation: 'Combined energies, new beginnings' },
    { name: 'Sextile', angle: 60, orb: 6, interpretation: 'Opportunities, favorable conditions' },
    { name: 'Square', angle: 90, orb: 8, interpretation: 'Tension, action required, volatility' },
    { name: 'Trine', angle: 120, orb: 8, interpretation: 'Harmony, ease, positive flow' },
    { name: 'Opposition', angle: 180, orb: 8, interpretation: 'Culmination, awareness, potential reversal' },
  ];
  
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const planet1 = positions[i];
      const planet2 = positions[j];
      
      let diff = Math.abs(planet1.longitude - planet2.longitude);
      if (diff > 180) diff = 360 - diff;
      
      for (const aspectType of aspectTypes) {
        const orb = Math.abs(diff - aspectType.angle);
        if (orb <= aspectType.orb) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: aspectType.name,
            angle: aspectType.angle,
            orb: Math.round(orb * 100) / 100,
            interpretation: aspectType.interpretation,
          });
        }
      }
    }
  }
  
  return aspects;
}

