// 'use client';

// import { Settings } from 'lucide-react';

// export default function ControlPanel() {
//   return (
//     <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white h-full">
//       <div className="flex items-center mb-4">
//         <Settings className="text-blue-400 mr-3" size={28} />
//         <h2 className="text-2xl font-bold">AstroGuard Controls</h2>
//       </div>
//       <p className="text-gray-400">
//         This panel will contain sliders, dropdowns, and buttons to select an
//         asteroid and configure the simulation.
//       </p>
//       {/* Placeholder for future controls */}
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import { Settings, List, Loader, AlertTriangle } from 'lucide-react';
// import type { Asteroid } from '../api/asteroids/route'; // Import the type

// export default function ControlPanel() {
//   const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchAsteroids() {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const response = await fetch('/api/asteroids');
//         if (!response.ok) {
//           throw new Error('Failed to fetch asteroids.');
//         }
//         const data: Asteroid[] = await response.json();
//         setAsteroids(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An unknown error occurred.');
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchAsteroids();
//   }, []); // Empty dependency array means this runs once on mount

//   return (
//     <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white h-full">
//       <div className="flex items-center mb-6">
//         <Settings className="text-blue-400 mr-3" size={28} />
//         <h2 className="text-2xl font-bold">AstroGuard Controls</h2>
//       </div>

//       {/* Asteroid Selection Section */}
//       <div className="space-y-4">
//         <div>
//           <label htmlFor="asteroid-select" className="flex items-center text-lg font-medium mb-2 text-gray-300">
//             <List className="mr-2" size={20}/>
//             Select Potentially Hazardous Asteroid
//           </label>
//           <div className="relative">
//             {isLoading && <Loader className="animate-spin absolute top-1/2 left-1/2 -mt-3 -ml-3 text-blue-400" />}
//             <select
//               id="asteroid-select"
//               disabled={isLoading || !!error}
//               className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading && <option>Loading asteroids...</option>}
//               {error && <option>Error loading data</option>}
//               {!isLoading && !error && (
//                 <>
//                   <option value="">-- Choose an asteroid --</option>
//                   {asteroids.map((asteroid) => (
//                     <option key={asteroid.id} value={asteroid.id}>
//                       {asteroid.name}
//                     </option>
//                   ))}
//                 </>
//               )}
//             </select>
//           </div>
//           {error && (
//             <div className="flex items-center mt-2 text-red-400">
//               <AlertTriangle size={16} className="mr-2" />
//               <p>Could not load data. {error}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { Settings, List, Loader, AlertTriangle } from 'lucide-react';
// import type { Asteroid } from '../page'; // Import type from the main page

// interface ControlPanelProps {
//   asteroids: Asteroid[];
//   onAsteroidSelect: (asteroidId: string) => void;
//   isLoading: boolean;
//   error: string | null;
// }

// export default function ControlPanel({ asteroids, onAsteroidSelect, isLoading, error }: ControlPanelProps) {
//   return (
//     <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white h-full">
//       <div className="flex items-center mb-6">
//         <Settings className="text-blue-400 mr-3" size={28} />
//         <h2 className="text-2xl font-bold">AstroGuard Controls</h2>
//       </div>

//       <div className="space-y-4">
//         <div>
//           <label htmlFor="asteroid-select" className="flex items-center text-lg font-medium mb-2 text-gray-300">
//             <List className="mr-2" size={20}/>
//             Select Potentially Hazardous Asteroid
//           </label>
//           <div className="relative">
//             {isLoading && <Loader className="animate-spin absolute top-1/2 left-1/2 -mt-3 -ml-3 text-blue-400" />}
//             <select
//               id="asteroid-select"
//               onChange={(e) => onAsteroidSelect(e.target.value)}
//               disabled={isLoading || !!error}
//               className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading && <option>Loading asteroids...</option>}
//               {error && <option>Error loading data</option>}
//               {!isLoading && !error && (
//                 <>
//                   <option value="">-- Choose an asteroid --</option>
//                   {(asteroids || []).map((asteroid) => (
//                     <option key={asteroid.id} value={asteroid.id}>
//                       {asteroid.name}
//                     </option>
//                   ))}
//                 </>
//               )}
//             </select>
//           </div>
//           {error && (
//             <div className="flex items-center mt-2 text-red-400">
//               <AlertTriangle size={16} className="mr-2" />
//               <p>Could not load asteroid list.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { Settings, List, Loader, AlertTriangle, Zap } from 'lucide-react';
import type { Asteroid } from '../page';

interface ControlPanelProps {
  asteroids: Asteroid[];
  selectedAsteroid: Asteroid | null;
  onAsteroidSelect: (asteroidId: string) => void;
  onSimulate: () => void;
  isLoading: boolean;
  isSimulating: boolean;
  error: string | null;
}

export default function ControlPanel({ asteroids, selectedAsteroid, onAsteroidSelect, onSimulate, isLoading, isSimulating, error }: ControlPanelProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white h-full flex flex-col">
      <div className="flex items-center mb-6">
        <Settings className="text-blue-400 mr-3" size={28} />
        <h2 className="text-2xl font-bold">AstroGuard Controls</h2>
      </div>

      <div className="space-y-6 flex-grow">
        <div>
          <label htmlFor="asteroid-select" className="flex items-center text-lg font-medium mb-2 text-gray-300">
            <List className="mr-2" size={20}/>
            Select Potentially Hazardous Asteroid
          </label>
          <div className="relative">
            {isLoading && <Loader className="animate-spin absolute top-1/2 left-1/2 -mt-3 -ml-3 text-blue-400" />}
            <select
              id="asteroid-select"
              onChange={(e) => onAsteroidSelect(e.target.value)}
              disabled={isLoading || !!error}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <option>Loading asteroids...</option>}
              {error && <option>Error loading data</option>}
              {!isLoading && !error && (
                <>
                  <option value="">-- Choose an asteroid --</option>
                  {(asteroids || []).map((asteroid) => (
                    <option key={asteroid.id} value={asteroid.id}>
                      {asteroid.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          {error && (
            <div className="flex items-center mt-2 text-red-400">
              <AlertTriangle size={16} className="mr-2" />
              <p>Could not load asteroid list.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto">
        <button
          onClick={onSimulate}
          disabled={!selectedAsteroid || isSimulating}
          className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
        >
          {isSimulating ? (
            <Loader className="animate-spin mr-2" />
          ) : (
            <Zap className="mr-2" />
          )}
          {isSimulating ? 'Calculating...' : 'Simulate Impact'}
        </button>
      </div>
    </div>
  );
}

