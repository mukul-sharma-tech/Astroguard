// 'use client';

// import { BookCheck } from 'lucide-react';

// export default function ResultsPanel() {
//   return (
//     <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white h-full">
//        <div className="flex items-center mb-4">
//         <BookCheck className="text-green-400 mr-3" size={28} />
//         <h2 className="text-2xl font-bold">Simulation Results</h2>
//       </div>
//        <p className="text-gray-400">
//         This panel will display the calculated impact energy, crater size,
//         and other environmental effects.
//       </p>
//        {/* Placeholder for future results */}
//     </div>
//   );

// }


'use client';

import { BarChart2, Loader, AlertTriangle } from 'lucide-react';
import type { SimulationResults } from '../page';

interface ResultsPanelProps {
  results: SimulationResults | null;
  isLoading: boolean;
  error: string | null;
}

function ResultItem({ label, value, unit }: { label: string, value: string | number, unit: string }) {
  return (
    <div className="bg-gray-700 p-4 rounded-lg text-center">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
        {value} <span className="text-lg font-medium text-gray-300">{unit}</span>
      </p>
    </div>
  );
}

export default function ResultsPanel({ results, isLoading, error }: ResultsPanelProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white h-full">
      <div className="flex items-center mb-6">
        <BarChart2 className="text-green-400 mr-3" size={28} />
        <h2 className="text-2xl font-bold">Simulation Results</h2>
      </div>

      <div className="h-full flex items-center justify-center">
        {isLoading && (
          <div className="text-center">
            <Loader size={48} className="animate-spin text-green-400 mx-auto" />
            <p className="mt-4 text-gray-400">Running simulation...</p>
          </div>
        )}
        
        {error && (
           <div className="text-center text-red-400">
              <AlertTriangle size={48} className="mx-auto" />
              <p className="mt-4">Simulation failed to run.</p>
           </div>
        )}

        {!isLoading && !error && results && (
          <div className="w-full grid grid-cols-1 gap-4">
            <ResultItem label="Impact Energy" value={results.impactEnergyMT.toLocaleString()} unit="Megatons" />
            <ResultItem label="Estimated Crater Diameter" value={results.craterDiameterKM.toLocaleString()} unit="km" />
            <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-300 p-4 rounded-lg text-center">
              <p className="font-bold">⚠️ Catastrophic Event Predicted</p>
              <p className="text-sm">Widespread devastation expected.</p>
            </div>
          </div>
        )}

        {!isLoading && !error && !results && (
          <div className="text-center text-gray-500">
            <p>Select an asteroid and click "Simulate Impact" to see the potential consequences.</p>
          </div>
        )}
      </div>
    </div>
  );
}

