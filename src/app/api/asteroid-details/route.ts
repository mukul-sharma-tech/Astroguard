// import { NextRequest, NextResponse } from 'next/server';
// import * as THREE from 'three';

// // This is a simplified orbital calculation.
// // A real-world application would use a more sophisticated physics library.
// function calculateTrajectory(orbitalData: any): [number, number, number][] {
//     const points: [number, number, number][] = [];
//     const a = parseFloat(orbitalData.a) * 1.5; // Semi-major axis (scaled for visualization)
//     const e = parseFloat(orbitalData.e);      // Eccentricity
//     const i = parseFloat(orbitalData.i) * (Math.PI / 180); // Inclination in radians
//     const om = parseFloat(orbitalData.om) * (Math.PI / 180); // Longitude of Ascending Node in radians
//     const w = parseFloat(orbitalData.w) * (Math.PI / 180); // Argument of Perihelion in radians

//     // Create an ellipse
//     const curve = new THREE.EllipseCurve(
//       0, 0,            // Center x, y
//       a, a * Math.sqrt(1 - e * e), // xRadius, yRadius
//       0, 2 * Math.PI,  // StartAngle, EndAngle
//       false,           // Clockwise
//       0                // Rotation
//     );

//     const numPoints = 200;
//     const curvePoints = curve.getPoints(numPoints);

//     // Apply orbital inclinations and rotations
//     const rotationMatrix = new THREE.Matrix4();
//     const q = new THREE.Quaternion().setFromEuler(
//       new THREE.Euler(i, om, w, 'ZXY')
//     );
//     rotationMatrix.makeRotationFromQuaternion(q);

//     for(const p of curvePoints) {
//       const vec = new THREE.Vector3(p.x, 0, p.y); // Map ellipse to XZ plane
//       vec.applyMatrix4(rotationMatrix);
//       points.push([vec.x, vec.y, vec.z]);
//     }
    
//     return points;
// }


// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const sstr = searchParams.get('sstr'); // Asteroid name, e.g. "2009 JF1"

//   if (!sstr) {
//     return NextResponse.json({ message: 'Asteroid name (sstr) is required' }, { status: 400 });
//   }

//   // FIXED: Use the sbdb.api for single-object lookups
//   const NASA_API_URL = `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${encodeURIComponent(sstr)}&orb=1`;

//   try {
//     const response = await fetch(NASA_API_URL);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch data from NASA SBDB API: ${response.statusText}`);
//     }

//     const data = await response.json();
    
//     // FIXED: The orbital elements are in `data.orbit.elements` for the sbdb.api
//     if (!data.orbit || !data.orbit.elements || data.orbit.elements.length === 0) {
//         throw new Error('Orbital elements not found in API response.');
//     }
    
//     // We only need the first set of orbital elements
//     const orbitalElements = data.orbit.elements[0];

//     const trajectory = calculateTrajectory(orbitalElements);

//     return NextResponse.json({ trajectory });

//   } catch (error) {
//     console.error("API Route Error:", error);
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     return NextResponse.json(
//       { message: 'Error fetching asteroid details', error: errorMessage },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import * as THREE from 'three';

// This is a simplified orbital calculation.
// A real-world application would use a more sophisticated physics library.
function calculateTrajectory(orbitalData: any): [number, number, number][] {
    const points: [number, number, number][] = [];
    const a = parseFloat(orbitalData.a) * 1.5; // Semi-major axis (scaled for visualization)
    const e = parseFloat(orbitalData.e);      // Eccentricity
    const i = parseFloat(orbitalData.i) * (Math.PI / 180); // Inclination in radians
    const om = parseFloat(orbitalData.om) * (Math.PI / 180); // Longitude of Ascending Node in radians
    const w = parseFloat(orbitalData.w) * (Math.PI / 180); // Argument of Perihelion in radians

    // Create an ellipse
    const curve = new THREE.EllipseCurve(
      0, 0,            // Center x, y
      a, a * Math.sqrt(1 - e * e), // xRadius, yRadius
      0, 2 * Math.PI,  // StartAngle, EndAngle
      false,           // Clockwise
      0                // Rotation
    );

    const numPoints = 200;
    const curvePoints = curve.getPoints(numPoints);

    // Apply orbital inclinations and rotations
    const rotationMatrix = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(i, om, w, 'ZXY')
    );
    rotationMatrix.makeRotationFromQuaternion(q);

    for(const p of curvePoints) {
      const vec = new THREE.Vector3(p.x, 0, p.y); // Map ellipse to XZ plane
      vec.applyMatrix4(rotationMatrix);
      points.push([vec.x, vec.y, vec.z]);
    }
    
    return points;
}


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sstr = searchParams.get('sstr'); // Asteroid name, e.g. "2009 JF1"

  if (!sstr) {
    return NextResponse.json({ message: 'Asteroid name (sstr) is required' }, { status: 400 });
  }

  // FIXED: Use the sbdb.api for single-object lookups
  const NASA_API_URL = `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${encodeURIComponent(sstr)}&orb=1`;

  try {
    const response = await fetch(NASA_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from NASA SBDB API: ${response.statusText}`);
    }

    const data = await response.json();
    
    // ADDED: Gracefully handle cases where the API returns a "not found" message
    if (data.message && data.message === "specified object was not found") {
      return NextResponse.json(
        { message: `Orbital data for '${sstr}' not found in NASA's database.`, error: data.cause },
        { status: 404 }
      );
    }

    // FIXED: The orbital elements are in `data.orbit.elements` for the sbdb.api
    if (!data.orbit || !data.orbit.elements || data.orbit.elements.length === 0) {
        throw new Error('Orbital elements not found in API response.');
    }
    
    // We only need the first set of orbital elements
    const orbitalElements = data.orbit.elements[0];

    const trajectory = calculateTrajectory(orbitalElements);

    return NextResponse.json({ trajectory });

  } catch (error) {
    console.error("API Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Error fetching asteroid details', error: errorMessage },
      { status: 500 }
    );
  }
}

