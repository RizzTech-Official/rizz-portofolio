import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { ArrowRight, Sparkles } from 'lucide-react';
import { heroAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';


const Hero = ({ theme }) => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    try {
      const response = await heroAPI.get();
      setHero(response.data);
    } catch (error) {
      console.error('Error loading hero:', error);
    } finally {
      setLoading(false);
    }
  };

  const content = {
    badge: hero?.badge_text || '🚀 Shaping the Digital Future',
    line1: hero?.title_line1 || 'Innovating',
    line2: hero?.title_line2 || 'The Future',
    description: hero?.description || 'We are RizzTech. A leading software house crafting digital experiences with cutting-edge technology and premium design.',
    btn1Text: hero?.button1_text || 'Get Started',
    btn1Link: hero?.button1_link || '#contact',
    btn2Text: hero?.button2_text || 'Learn More',
    btn2Link: hero?.button2_link || '#about',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-dark-bg dark:to-dark-bg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-16">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-dark-bg dark:via-dark-bg dark:to-dark-surface -z-10" />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />

      {/* 3D Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas className="w-full h-full">
          <Suspense fallback={null}>
            <Scene theme={theme} />
          </Suspense>
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center md:text-left order-2 md:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-primary-100 dark:border-primary-800/30 shadow-lg shadow-primary-500/10"
            >
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
                {content.badge}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-[1.1]"
            >
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="block text-slate-900 dark:text-white"
              >
                {content.line1}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-purple-500 to-primary-600 animate-gradient"
                style={{ backgroundSize: '200% auto' }}
              >
                {content.line2}
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed"
            >
              {content.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={content.btn1Link}
                className="group relative overflow-hidden inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500 text-white font-semibold rounded-2xl shadow-xl shadow-primary-500/25 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {content.btn1Text}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-cyan-400 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={content.btn2Link}
                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-white/5 backdrop-blur-xl text-slate-900 dark:text-white font-semibold rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-800/50 transition-all duration-300"
              >
                {content.btn2Text}
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <div className="order-1 md:order-2" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-xs font-medium text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-slate-300 dark:border-gray-700 flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-primary-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
