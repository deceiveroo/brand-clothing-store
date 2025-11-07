'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import Link from 'next/link';
import { motion } from 'framer-motion';

function Model() {
  const { scene } = useGLTF('/models/t-shirt.glb');
  return <primitive object={scene} scale={2} />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              BRAND
            </motion.h1>
            <div className="flex gap-6">
              <Link href="/shop" className="text-white/80 hover:text-white transition-colors">
                Shop
              </Link>
              <Link href="/cart" className="text-white/80 hover:text-white transition-colors">
                Cart
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6">
                WEAR THE
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  FUTURE
                </span>
              </h1>
              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                Discover our innovative collection where cutting-edge design meets 
                sustainable fashion. Experience clothing that adapts to you.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold text-white shadow-lg"
                >
                  Shop Collection
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-white/20 rounded-full font-semibold text-white backdrop-blur-lg"
                >
                  Explore
                </motion.button>
              </div>
            </motion.div>

            {/* 3D Model */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-black/20 backdrop-blur-lg border border-white/10"
            >
              <Canvas camera={{ position: [5, 2, 5], fov: 25 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <Model />
                <OrbitControls enableZoom={false} />
                <Environment preset="city" />
              </Canvas>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Featured Collection
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Product cards would go here */}
          </div>
        </div>
      </section>
    </div>
  );
}