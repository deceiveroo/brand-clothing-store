'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Модель куртки
function JacketModel({ color = '#3b82f6', ...props }: any) {
  const { scene } = useGLTF('/models/jacket.glb');
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Клонируем сцену чтобы избежать конфликтов
  const clonedScene = scene.clone();
  
  return (
    <group ref={groupRef} {...props}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Модель кроссовок
function SneakerModel({ color = '#10b981', ...props }: any) {
  const { scene } = useGLTF('/models/sneaker.glb');
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  const clonedScene = scene.clone();
  
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <group ref={groupRef} {...props}>
        <primitive object={clonedScene} scale={1.5} />
      </group>
    </Float>
  );
}

// Модель бейсболки
function CapModel({ color = '#8b5cf6', ...props }: any) {
  const { scene } = useGLTF('/models/cap.glb');
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  const clonedScene = scene.clone();
  
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} {...props}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
}

// Загрузчик
function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
    </div>
  );
}

interface ProductViewer3DProps {
  productType: 'jacket' | 'sneaker' | 'cap';
  className?: string;
}

export default function ProductViewer3D({ productType, className = '' }: ProductViewer3DProps) {
  const getModel = () => {
    switch (productType) {
      case 'jacket':
        return <JacketModel />;
      case 'sneaker':
        return <SneakerModel />;
      case 'cap':
        return <CapModel />;
      default:
        return <JacketModel />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/50 to-purple-900/50 backdrop-blur-lg border border-white/10 ${className}`}
    >
      <Canvas camera={{ position: [3, 2, 3], fov: 25 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {getModel()}
          
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minDistance={2}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={0.5}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}

// Preload models
useGLTF.preload('/models/jacket.glb');
useGLTF.preload('/models/sneaker.glb');
useGLTF.preload('/models/cap.glb');