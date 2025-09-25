import { NextResponse } from 'next/server';
import * as THREE from 'three';

// Define the structure of orbital elements from the JPL SBDB API
interface OrbitalElements {
  e: string; // Eccentricity
  a: string; // Semi-major axis (in AU)
  i: string; // Inclination
  om: string; // Longitude of the ascending node
  w: string; // Argument of perihelion
  ma: string; // Mean anomaly at epoch
  per: string; // Orbital period
}

const JPL_SBDB_URL = 'https://ssd-api.jpl.nasa.gov/sbdb.api';
const AU_TO_KM = 149597870.7; // Astronomical Unit in kilometers
const VISUALIZATION_SCALE = 1 / 15_000_000; // Scale down for Three.js scene

// This is a simplified orbital mechanics calculation for visualization purposes.
// It creates a visually plausible ellipse based on key orbital elements.
function calculateTrajectory(elements: OrbitalElements): THREE.Vector3[] {
  const eccentricity = parseFloat(elements.e);
  const semiMajorAxis = parseFloat(elements.a) * AU_TO_KM * VISUALIZATION_SCALE;

  const ellipse = new THREE.EllipseCurve(
    0, 0, // center x, y
    semiMajorAxis, // xRadius
    semiMajorAxis * Math.sqrt(1 - eccentricity ** 2), // yRadius
    0, 2 * Math.PI, // startAngle, endAngle
    false, // clockwise
    0 // rotation
  );
  
  const points = ellipse.getPoints(200); // Get 200 points to form the ellipse
  const trajectory = points.map(p => new THREE.Vector3(p.x, 0, p.y));

  // We'll apply inclination and other rotations in a later step for simplicity.
  // For now, we return a flat ellipse.
  
  return trajectory;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const asteroidId = params.id;
  
  try {
    // JPL API uses semicolons for designation, so we reformat our ID
    const formattedId = asteroidId.replace('-', ' ');
    const response = await fetch(`${JPL_SBDB_URL}?sstr=${encodeURIComponent(formattedId)}&orb=1`);
    
    if (!response.ok) {
      throw new Error(`JPL API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const elements: OrbitalElements = data.orb.elements;

    const trajectory = calculateTrajectory(elements);

    return NextResponse.json({ trajectory });

  } catch (error) {
    console.error(`Error fetching trajectory for ${asteroidId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error fetching trajectory', error: errorMessage }, { status: 500 });
  }
}
