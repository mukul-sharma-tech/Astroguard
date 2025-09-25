// 'use client';

// import { Orbit, Globe } from 'lucide-react';

// export default function SceneContainer() {
//   return (
//     <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white h-full">
//        <div className="flex items-center mb-4">
//         <Orbit className="text-purple-400 mr-3" size={28} />
//         <h2 className="text-2xl font-bold">Visualization</h2>
//       </div>
//       <div className="bg-black h-64 rounded-md flex items-center justify-center">
//         <p className="text-gray-500">3D Asteroid Trajectory will be rendered here.</p>
//       </div>
//        <div className="mt-4 bg-black h-48 rounded-md flex items-center justify-center">
//         <p className="text-gray-500">2D Impact Map will be rendered here.</p>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { Orbit } from 'lucide-react';
// import ThreeScene from './ThreeScene';

// export default function SceneContainer() {
//   return (
//     <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white h-full flex flex-col">
//        <div className="flex items-center mb-4">
//         <Orbit className="text-purple-400 mr-3" size={28} />
//         <h2 className="text-2xl font-bold">Visualization</h2>
//       </div>

//       {/* 3D Scene */}
//       <div className="flex-grow h-96 mb-4">
//         <ThreeScene />
//       </div>
      
//        {/* 2D Map Placeholder */}
//        <div className="h-48 bg-black rounded-md flex items-center justify-center">
//         <p className="text-gray-500">2D Impact Map will be rendered here.</p>
//       </div>
//     </div>
//   );
// }



'use client';

import { Orbit, Loader } from 'lucide-react';
import ThreeScene from './ThreeScene';
import type { Trajectory } from '../page';

interface SceneContainerProps {
  trajectory: Trajectory | null;
  isLoading: boolean;
}

export default function SceneContainer({ trajectory, isLoading }: SceneContainerProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white h-full flex flex-col">
       <div className="flex items-center mb-4">
        <Orbit className="text-purple-400 mr-3" size={28} />
        <h2 className="text-2xl font-bold">Visualization</h2>
      </div>

      <div className="flex-grow h-96 mb-4 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10 rounded-md">
            <Loader className="animate-spin text-purple-400" size={48} />
            <p className="mt-4">Calculating trajectory...</p>
          </div>
        )}
        <ThreeScene trajectory={trajectory} />
      </div>
      
       <div className="h-48 bg-black rounded-md flex items-center justify-center">
        <p className="text-gray-500">2D Impact Map will be rendered here.</p>
      </div>
    </div>
  );
}

