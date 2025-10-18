export interface AstroData {
  lunarPhase: {
    phase: string;
    illumination: number;
    age: number;
  };
  planetaryPositions: Array<{
    planet: string;
    sign: string;
    degree: number;
  }>;
  planetaryAspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    angle: number;
  }>;
}

export function getAstrologicalData(): AstroData {
  const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  const aspects = ['Conjunction', 'Sextile', 'Square', 'Trine', 'Opposition'];

  const lunarAge = Math.random() * 29.53;
  const phaseIndex = Math.floor((lunarAge / 29.53) * 8);

  return {
    lunarPhase: {
      phase: phases[phaseIndex],
      illumination: Number((Math.abs(Math.cos((lunarAge / 29.53) * Math.PI * 2)) * 100).toFixed(1)),
      age: Number(lunarAge.toFixed(1)),
    },
    planetaryPositions: planets.map(planet => ({
      planet,
      sign: signs[Math.floor(Math.random() * signs.length)],
      degree: Number((Math.random() * 30).toFixed(1)),
    })),
    planetaryAspects: [
      {
        planet1: 'Sun',
        planet2: 'Moon',
        aspect: aspects[Math.floor(Math.random() * aspects.length)],
        angle: [0, 60, 90, 120, 180][Math.floor(Math.random() * 5)],
      },
      {
        planet1: 'Mercury',
        planet2: 'Venus',
        aspect: aspects[Math.floor(Math.random() * aspects.length)],
        angle: [0, 60, 90, 120, 180][Math.floor(Math.random() * 5)],
      },
    ],
  };
}
