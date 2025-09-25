// import { NextResponse } from 'next/server';

// // Define the structure of the data we expect from the NASA API
// interface SentryObject {
//   des: string; // Designation, e.g., "2009 JF1"
//   fullname: string; // Full name, e.g., "(2009 JF1)"
//   // ... other fields we don't need right now
// }

// // Define the structure for our simplified asteroid object
// export interface Asteroid {
//   id: string;
//   name: string;
// }

// const NASA_API_URL = 'https://ssd-api.jpl.nasa.gov/sentry.api';

// export async function GET() {
//   try {
//     const response = await fetch(NASA_API_URL);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch data from NASA API: ${response.statusText}`);
//     }

//     const data = await response.json();

//     // The data we want is in the `data` property of the response
//     const sentryObjects: SentryObject[] = data.data;

//     // We only want to show a limited number of asteroids for this demo
//     const limitedObjects = sentryObjects.slice(0, 15);

//     // Map the complex NASA data to our simple Asteroid format
//     const asteroids: Asteroid[] = limitedObjects.map((obj) => ({
//       id: obj.des.trim().replace(/\s+/g, '-'), // e.g., "2009-JF1"
//       name: obj.fullname.replace(/[()]/g, '').trim(), // e.g., "2009 JF1"
//     }));

//     return NextResponse.json(asteroids);

//   } catch (error) {
//     console.error("API Route Error:", error);
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     return NextResponse.json(
//       { message: 'Error fetching asteroid data', error: errorMessage },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from 'next/server';

// interface SentryData {
//   fullname: string;
//   ps_max: string; // Palermo Scale max
//   // other fields exist but we only need these for now
//   diameter: string; // in km
//   v_inf: string; // in km/s
// }

// interface SentryApiResponse {
//   data: SentryData[];
// }

// // A simple ID generator based on the name
// const generateId = (name: string) => name.replace(/\s+/g, '-').toLowerCase();

// export async function GET() {
//   const NASA_SENTRY_API_URL = 'https://ssd-api.jpl.nasa.gov/sentry.api';
//   // const NASA_API_URL = 'https://ssd-api.jpl.nasa.gov/sentry.api';


//   try {
//     const response = await fetch(NASA_SENTRY_API_URL);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch data from NASA Sentry API: ${response.statusText}`);
//     }

//     const data: SentryApiResponse = await response.json();

//     const asteroids = data.data
//       .filter(item => parseFloat(item.ps_max) > -10) // Filter for objects of some interest
//       .slice(0, 15) // Limit to the top 15 for performance
//       .map(item => ({
//         id: generateId(item.fullname.trim()),
//         name: item.fullname.trim(),
//         estimated_diameter_m: parseFloat(item.diameter) * 1000, // Convert km to m
//         relative_velocity_kms: parseFloat(item.v_inf)
//       }));

//     return NextResponse.json(asteroids);
    
//   } catch (error) {
//     console.error("API Route Error:", error);
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     return NextResponse.json(
//       { message: 'Error fetching asteroid list', error: errorMessage },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from 'next/server';

interface SentryData {
  fullname: string;
  ps_max: string; // Palermo Scale max
  diameter: string; // in km
  v_inf: string; // in km/s
}

interface SentryApiResponse {
  data: SentryData[];
}

// A simple ID generator based on the name
const generateId = (name: string) => name.replace(/\s+/g, '-').toLowerCase();

export async function GET() {
  const NASA_SENTRY_API_URL = 'https://ssd-api.jpl.nasa.gov/sentry.api';

  try {
    const response = await fetch(NASA_SENTRY_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from NASA Sentry API: ${response.statusText}`);
    }

    const data: SentryApiResponse = await response.json();

    const asteroids = data.data
      .filter(item => parseFloat(item.ps_max) > -10) // Filter for objects of some interest
      .slice(0, 15) // Limit to the top 15 for performance
      .map(item => {
        // Clean the name by removing parentheses before creating the object
        const cleanedName = item.fullname.trim().replace(/[()]/g, '');
        return {
          id: generateId(cleanedName),
          name: cleanedName,
          estimated_diameter_m: parseFloat(item.diameter) * 1000, // Convert km to m
          relative_velocity_kms: parseFloat(item.v_inf)
        };
      });

    return NextResponse.json(asteroids);
    
  } catch (error) {
    console.error("API Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Error fetching asteroid list', error: errorMessage },
      { status: 500 }
    );
  }
}

