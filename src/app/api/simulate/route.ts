import { NextRequest, NextResponse } from 'next/server';

// Constants for calculation
const ASTEROID_DENSITY_KG_M3 = 3000; // Average density for a stony asteroid
const TNT_JOULES_PER_MEGATON = 4.184e15;

/**
 * Calculates the kinetic energy of an impact.
 * @param diameterMeters - Diameter of the asteroid in meters.
 * @param velocityKms - Velocity of the asteroid in kilometers per second.
 * @returns Kinetic energy in Megatons of TNT.
 */
function calculateKineticEnergy(diameterMeters: number, velocityKms: number): number {
  const radius = diameterMeters / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const massKg = volume * ASTEROID_DENSITY_KG_M3;
  const velocityMs = velocityKms * 1000; // Convert km/s to m/s

  const kineticEnergyJoules = 0.5 * massKg * Math.pow(velocityMs, 2);
  const kineticEnergyMegatons = kineticEnergyJoules / TNT_JOULES_PER_MEGATON;

  return kineticEnergyMegatons;
}

/**
 * Estimates crater diameter using the Holsapple-Schmidt scaling law for rocky targets.
 * @param energyMegatons - Impact energy in Megatons of TNT.
 * @returns Estimated crater diameter in kilometers.
 */
function estimateCraterDiameter(energyMegatons: number): number {
  // This is a simplified scaling law. Real-world calculations are more complex.
  const energyJoules = energyMegatons * TNT_JOULES_PER_MEGATON;
  const diameterMeters = 1.16 * Math.pow(energyJoules / (1.61 * 9.81), 1 / 3.4);
  return diameterMeters / 1000; // Convert to kilometers
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diameter, velocity } = body; // Expected in meters and km/s

    if (typeof diameter !== 'number' || typeof velocity !== 'number') {
      return NextResponse.json({ message: 'Invalid input: diameter and velocity must be numbers.' }, { status: 400 });
    }

    const impactEnergyMT = calculateKineticEnergy(diameter, velocity);
    const craterDiameterKM = estimateCraterDiameter(impactEnergyMT);

    return NextResponse.json({
      impactEnergyMT: parseFloat(impactEnergyMT.toFixed(2)),
      craterDiameterKM: parseFloat(craterDiameterKM.toFixed(2)),
    });

  } catch (error) {
    console.error("Simulation API Error:", error);
    return NextResponse.json({ message: 'Error processing simulation request' }, { status: 500 });
  }
}
