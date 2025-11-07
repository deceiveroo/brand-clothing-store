'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Globe, Sparkles } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Fabric",
      description: "Temperature-regulating material that adapts to your body"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Eco-Friendly",
      description: "Sustainable materials with zero carbon footprint"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Shipping",
      description: "Free worldwide delivery on orders over $100"
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "50+", label: "Countries" },
    { number: "2024", label: "Established" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-purple-500/5 to-transparent"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/10 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                NEXUS
              </h1>
            </motion.div>
            <div className="flex gap-6">
              <Link href="/shop" className="text-white/70 hover:text-white transition-colors">
                Shop
              </Link>
              <Link href="/cart" className="text-white/70 hover:text-white transition-colors">
                Cart
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <motion.span 
                  className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-400 text-sm font-medium mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  🚀 Next Generation Fashion
                </motion.span>
                <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  WEAR THE
                  <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    FUTURE
                  </span>
                </h1>
                <p className="text-xl text-white/60 mb-8 leading-relaxed max-w-lg">
                  Experience fashion that evolves with you. Our smart clothing combines 
                  cutting-edge technology with sustainable design for the modern world.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-semibold text-white shadow-2xl flex items-center gap-3 transition-all duration-300"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-white/20 rounded-2xl font-semibold text-white backdrop-blur-lg hover:backdrop-blur-xl transition-all duration-300"
                >
                  View Lookbook
                </motion.button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Placeholder для изображения вместо 3D модели */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent border border-white/10 backdrop-blur-xl flex items-center justify-center"
            >
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Innovative Design</h3>
                <p className="text-white/60">Experience next-generation fashion</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Why Choose <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Nexus</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              We're redefining what clothing can be with innovative technology and sustainable practices.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-500"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-6"
      >
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl p-12 border border-white/10 backdrop-blur-lg">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Join thousands of customers who have already upgraded their wardrobe with Nexus.
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-semibold text-white text-lg shadow-2xl"
              >
                Start Shopping Now
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}