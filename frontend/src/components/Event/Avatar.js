import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Float } from '@react-three/drei';

// A stylized built-in Procedural Robot to avoid all external fetch/CORS issues.
const ProceduralRobot = ({ action }) => {
  const headRef = useRef();
  const bodyRef = useRef();
  const armRef = useRef();

  // Basic animation logic using local state/refs
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let interval;
    if (action === 'wave') {
      interval = setInterval(() => {
        setRotation(prev => Math.sin(Date.now() * 0.01) * 0.5);
      }, 16);
    } else if (action === 'talk') {
      interval = setInterval(() => {
        setRotation(prev => Math.sin(Date.now() * 0.02) * 0.2);
      }, 16);
    } else {
      setRotation(0);
    }
    return () => clearInterval(interval);
  }, [action]);

  return (
    <group position={[0, -0.5, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Head */}
        <mesh ref={headRef} position={[0, 1.5, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
          {/* Eyes */}
          <mesh position={[-0.15, 0.1, 0.31]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          <mesh position={[0.15, 0.1, 0.31]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
        </mesh>

        {/* Body */}
        <mesh ref={bodyRef} position={[0, 0.6, 0]}>
          <boxGeometry args={[0.8, 1.1, 0.5]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Arm (Waving) */}
        <group position={[0.5, 1, 0]} rotation={[0, 0, action === 'wave' ? rotation + 1 : 0]}>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>
        
        {/* Arm (Static) */}
        <group position={[-0.5, 1, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>

        {/* Legs */}
        <mesh position={[-0.2, -0.3, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.7, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0.2, -0.3, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.7, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </Float>
    </group>
  );
};

const HostAvatar = ({ action = 'idle' }) => {
  return (
    <div style={{ width: '100%', height: '300px', background: 'transparent' }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <React.Suspense fallback={null}>
          <ProceduralRobot action={action} />
          <Environment preset="night" />
        </React.Suspense>
        
        <ContactShadows opacity={0.6} scale={10} blur={2} far={10} resolution={256} color="#000000" />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2.5} />
      </Canvas>
    </div>
  );
};

export default HostAvatar;
