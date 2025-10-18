// Astrological data service for W.D. Gann Trading Platform
import { z } from "zod";

export const LunarPhaseSchema = z.object({
  phase: z.string(),
  illumination: z.number(),
  age: z.number(),
  distance: z.number(),
  date: z.date(),
});

export type LunarPhase = z.infer<typeof LunarPhaseSchema>;

export const PlanetaryPositionSchema = z.object({
  planet: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  sign: z.string(),
  degree: z.number(),
});

export type PlanetaryPosition = z.infer<typeof PlanetaryPositionSchema>;

export const PlanetaryAspectSchema = z.object({
  planet1: z.string(),
  planet2: z.string(),
  aspect: z.string(),
  angle: z.number(),
  orb: z.number(),
});

export type PlanetaryAspect = z.infer<typeof PlanetaryAspectSchema>;

// Simplified lunar phase calculation
export function getLunarPhase(date: Date = new Date()): LunarPhase {
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const lunarCycle = 29.530588853; // days
  
  const daysSinceNew = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const age = daysSinceNew % lunarCycle;
  const illumination = (1 - Math.cos((age / lunarCycle) * 2 * Math.PI)) / 2;
  
  let phase: string;
  if (age < 1.84566) phase = 'New Moon';
  else if (age < 5.53699) phase = 'Waxing Crescent';
  else if (age < 9.22831) phase = 'First Quarter';
  else if (age < 12.91963) phase = 'Waxing Gibbous';
  else if (age < 16.61096) phase = 'Full Moon';
  else if (age < 20.30228) phase = 'Waning Gibbous';
  else if (age < 23.99361) phase = 'Last Quarter';
  else phase = 'Waning Crescent';
  
  return {
    phase,
    illumination: Math.round(illumination * 100),
    age: Math.round(age * 10) / 10,
    distance: 384400, // Average Earth-Moon distance in km
    date,
  };
}

// Simplified planetary positions (demonstration only)
export function getPlanetaryPositions(date: Date = new Date()): PlanetaryPosition[] {
  const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                       'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  
  // Simplified calculation based on date
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  return planets.map((planet, index) => {
    const longitude = ((dayOfYear * (index + 1) * 0.98) + (index * 30)) % 360;
    const signIndex = Math.floor(longitude / 30);
    const degree = longitude % 30;
    
    return {
      planet,
      longitude: Math.round(longitude * 100) / 100,
      latitude: Math.round((Math.sin(dayOfYear * 0.1 + index) * 5) * 100) / 100,
      sign: zodiacSigns[signIndex],
      degree: Math.round(degree * 100) / 100,
    };
  });
}

// Calculate planetary aspects
export function getPlanetaryAspects(positions: PlanetaryPosition[]): PlanetaryAspect[] {
  const aspects: PlanetaryAspect[] = [];
  const aspectTypes = [
    { name: 'Conjunction', angle: 0, orb: 8 },
    { name: 'Sextile', angle: 60, orb: 6 },
    { name: 'Square', angle: 90, orb: 8 },
    { name: 'Trine', angle: 120, orb: 8 },
    { name: 'Opposition', angle: 180, orb: 8 },
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
            planet1: planet1.planet,
            planet2: planet2.planet,
            aspect: aspectType.name,
            angle: aspectType.angle,
            orb: Math.round(orb * 100) / 100,
          });
        }
      }
    }
  }
  
  return aspects;
}

