// 'use client';

// import { useRef } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import * as THREE from 'three'; // Import THREE
// import { OrbitControls } from '@react-three/drei';

// function Earth() {
//   // Use the imported THREE.Mesh type
//   const meshRef = useRef<THREE.Mesh>(new THREE.Mesh());
//   // This hook will run on every rendered frame
//   useFrame(() => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += 0.001; // Slowly rotate the Earth
//     }
//   });

//   return (
//     <mesh ref={meshRef}>
//       <sphereGeometry args={[2, 32, 32]} />
//       <meshStandardMaterial color="royalblue" wireframe />
//     </mesh>
//   );
// }

// export default function ThreeScene() {
//   return (
//     <div className="w-full h-full bg-black rounded-md">
//       <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
//         <ambientLight intensity={0.5} />
//         <pointLight position={[10, 10, 10]} intensity={1} />
//         <Earth />
//         <OrbitControls 
//           enableZoom={true} 
//           enablePan={true}
//           minDistance={5}
//           maxDistance={20}
//         />
//       </Canvas>
//     </div>
//   );
// }


'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import type { Trajectory } from '../page';

interface ThreeSceneProps {
  trajectory: Trajectory | null;
}

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="royalblue" />
    </mesh>
  );
}

function AsteroidPath({ trajectory }: { trajectory: Trajectory }) {
  const points = trajectory.map(p => new THREE.Vector3(...p));
  return <Line points={points} color="red" lineWidth={2} />;
}

export default function ThreeScene({ trajectory }: ThreeSceneProps) {
  return (
    <div className="w-full h-full bg-black rounded-md">
      <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[15, 15, 15]} intensity={1.5} />
        <Earth />
        {trajectory && <AsteroidPath trajectory={trajectory} />}
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
}

