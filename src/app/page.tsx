// import ControlPanel from './components/ControlPanel';
// import SceneContainer from './components/SceneContainer';
// import ResultsPanel from './components/ResultsPanel';

// export interface Asteroid {
//   id: string;
//   name: string;
// }

// export default function Home() {
//   return (
//     <main className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 lg:p-8">
//       <header className="text-center mb-8">
//         <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
//           AstroGuard: Earth&apos;s Sentinel
//         </h1>
//         <p className="mt-2 text-lg text-gray-400">
//           Interactive Asteroid Impact Simulation
//         </p>
//       </header>

//       {/* Main Grid Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
//         {/* Left Column: Controls */}
//         <div className="lg:col-span-1">
//           <ControlPanel />
//         </div>

//         {/* Center Column: Visualization */}
//         <div className="lg:col-span-1">
//           <SceneContainer />
//         </div>

//         {/* Right Column: Results */}
//         <div className="lg:col-span-1">
//           <ResultsPanel />
//         </div>
//       </div>
//     </main>
//   );
// }

// export type Trajectory = [number, number, number][];

// 'use client';

// import { useState, useEffect } from 'react';
// import ControlPanel from './components/ControlPanel';
// import SceneContainer from './components/SceneContainer';
// import ResultsPanel from './components/ResultsPanel';

// export interface Asteroid {
//   id: string;
//   name: string;
// }

// export type Trajectory = [number, number, number][];

// export default function Home() {
//   const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
//   const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
//   const [trajectory, setTrajectory] = useState<Trajectory | null>(null);
//   const [isLoading, setIsLoading] = useState({ asteroids: true, trajectory: false });
//   const [error, setError] = useState<{ asteroids: string | null, trajectory: string | null }>({ asteroids: null, trajectory: null });

//   // Fetch the list of asteroids on initial load
//   useEffect(() => {
//     async function fetchAsteroids() {
//       try {
//         const response = await fetch('/api/asteroids');
//         if (!response.ok) throw new Error('Failed to fetch asteroids.');
//         const data: Asteroid[] = await response.json();
//         setAsteroids(data);
//       } catch (err) {
//         setError(prev => ({ ...prev, asteroids: err instanceof Error ? err.message : 'Unknown error' }));
//       } finally {
//         setIsLoading(prev => ({ ...prev, asteroids: false }));
//       }
//     }
//     fetchAsteroids();
//   }, []);

//   // Fetch trajectory when a new asteroid is selected
//   useEffect(() => {
//     if (!selectedAsteroid) {
//       setTrajectory(null);
//       return;
//     }

//     async function fetchTrajectory() {
//       setIsLoading(prev => ({ ...prev, trajectory: true }));
//       setError(prev => ({ ...prev, trajectory: null }));
//       setTrajectory(null);
//       try {
//         const response = await fetch(`/api/asteroid-details?sstr=${encodeURIComponent(selectedAsteroid.name)}`);
//         if (!response.ok) throw new Error(`Failed to fetch trajectory for ${selectedAsteroid.name}.`);
//         const data = await response.json();
//         setTrajectory(data.trajectory);
//       } catch (err) {
//         setError(prev => ({ ...prev, trajectory: err instanceof Error ? err.message : 'Unknown error' }));
//       } finally {
//         setIsLoading(prev => ({ ...prev, trajectory: false }));
//       }
//     }
//     fetchTrajectory();
//   }, [selectedAsteroid]);

//   const handleAsteroidSelect = (asteroidId: string) => {
//     const selected = asteroids.find(a => a.id === asteroidId) || null;
//     setSelectedAsteroid(selected);
//   };

//   return (
//     <main className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 lg:p-8">
//       <header className="text-center mb-8">
//         <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
//           AstroGuard: Earth's Sentinel
//         </h1>
//         <p className="mt-2 text-lg text-gray-400">
//           Interactive Asteroid Impact Simulation
//         </p>
//       </header>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
//         <div className="lg:col-span-1">
//           <ControlPanel
//             asteroids={asteroids}
//             onAsteroidSelect={handleAsteroidSelect}
//             isLoading={isLoading.asteroids}
//             error={error.asteroids}
//           />
//         </div>

//         <div className="lg:col-span-1">
//           <SceneContainer 
//             trajectory={trajectory}
//             isLoading={isLoading.trajectory}
//           />
//         </div>

//         <div className="lg:col-span-1">
//           <ResultsPanel />
//         </div>
//       </div>
//     </main>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import SceneContainer from './components/SceneContainer';
import ResultsPanel from './components/ResultsPanel';

export interface Asteroid {
  id: string;
  name: string;
  // Adding estimated diameter and velocity for simulation
  estimated_diameter_m: number;
  relative_velocity_kms: number;
}

export type Trajectory = [number, number, number][];

export interface SimulationResults {
  impactEnergyMT: number;
  craterDiameterKM: number;
}

export default function Home() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [trajectory, setTrajectory] = useState<Trajectory | null>(null);
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);
  
  const [isLoading, setIsLoading] = useState({ asteroids: true, trajectory: false, simulation: false });
  const [error, setError] = useState<{ asteroids: string | null, trajectory: string | null, simulation: string | null }>({ asteroids: null, trajectory: null, simulation: null });

  // Fetch the list of asteroids on initial load
  useEffect(() => {
    async function fetchAsteroids() {
      try {
        const response = await fetch('/api/asteroids');
        if (!response.ok) throw new Error('Failed to fetch asteroids.');
        const data: Asteroid[] = await response.json();
        setAsteroids(data);
      } catch (err) {
        setError(prev => ({ ...prev, asteroids: err instanceof Error ? err.message : 'Unknown error' }));
      } finally {
        setIsLoading(prev => ({ ...prev, asteroids: false }));
      }
    }
    fetchAsteroids();
  }, []);

  // Fetch trajectory when a new asteroid is selected
  useEffect(() => {
    if (!selectedAsteroid) {
      setTrajectory(null);
      setSimulationResults(null); // Clear previous results
      return;
    }

    async function fetchTrajectory() {
      setIsLoading(prev => ({ ...prev, trajectory: true }));
      setError(prev => ({ ...prev, trajectory: null }));
      setTrajectory(null);
      try {
        const response = await fetch(`/api/asteroid-details?sstr=${encodeURIComponent(selectedAsteroid.name)}`);
        if (!response.ok) throw new Error(`Failed to fetch trajectory for ${selectedAsteroid.name}.`);
        const data = await response.json();
        setTrajectory(data.trajectory);
      } catch (err) {
        setError(prev => ({ ...prev, trajectory: err instanceof Error ? err.message : 'Unknown error' }));
      } finally {
        setIsLoading(prev => ({ ...prev, trajectory: false }));
      }
    }
    fetchTrajectory();
  }, [selectedAsteroid]);

  const handleAsteroidSelect = (asteroidId: string) => {
    const selected = asteroids.find(a => a.id === asteroidId) || null;
    setSelectedAsteroid(selected);
  };

  const handleSimulate = async () => {
    if (!selectedAsteroid) return;

    setIsLoading(prev => ({ ...prev, simulation: true }));
    setError(prev => ({ ...prev, simulation: null }));
    setSimulationResults(null);

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diameter: selectedAsteroid.estimated_diameter_m,
          velocity: selectedAsteroid.relative_velocity_kms
        })
      });

      if (!response.ok) throw new Error('Simulation failed.');
      
      const results: SimulationResults = await response.json();
      setSimulationResults(results);

    } catch (err) {
      setError(prev => ({ ...prev, simulation: err instanceof Error ? err.message : 'Unknown error' }));
    } finally {
      setIsLoading(prev => ({ ...prev, simulation: false }));
    }
  };

  return (
    <main className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          AstroGuard: Earth's Sentinel
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Interactive Asteroid Impact Simulation
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div className="lg:col-span-1">
          <ControlPanel
            asteroids={asteroids}
            selectedAsteroid={selectedAsteroid}
            onAsteroidSelect={handleAsteroidSelect}
            onSimulate={handleSimulate}
            isLoading={isLoading.asteroids}
            isSimulating={isLoading.simulation}
            error={error.asteroids}
          />
        </div>

        <div className="lg:col-span-1">
          <SceneContainer 
            trajectory={trajectory}
            isLoading={isLoading.trajectory}
          />
        </div>

        <div className="lg:col-span-1">
          <ResultsPanel 
            results={simulationResults}
            isLoading={isLoading.simulation}
            error={error.simulation}
          />
        </div>
      </div>
    </main>
  );
}

