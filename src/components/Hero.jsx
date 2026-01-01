import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { ArrowRight } from 'lucide-react';
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

  // Default values if API fails
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
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <section id="home" className="relative min-h-screen w-full bg-gradient-to-b from-slate-50 to-white dark:from-dark-bg dark:to-dark-bg overflow-hidden flex items-center justify-center pt-16">

      {/* 3D Background - Limitless */}
      <div className="absolute inset-0 w-full h-full z-0 top-0 left-0">
        <Canvas className="w-full h-full">
          <Suspense fallback={null}>
            <Scene theme={theme} />
          </Suspense>
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">

          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left order-2 md:order-1 pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 font-medium text-sm backdrop-blur-sm border border-primary-200/50 dark:border-primary-700/50"
            >
              {content.badge}
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="block"
              >
                {content.line1}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-purple-500 to-primary-700 animate-shine"
              >
                {content.line2}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl text-slate-700 dark:text-gray-300 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed"
            >
              {content.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={content.btn1Link}
                className="relative overflow-hidden inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-full shadow-lg shadow-primary-500/30 transition-all group"
              >
                <span className="relative z-10 flex items-center">
                  {content.btn1Text} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                {/* Shine effect overlay */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={content.btn2Link}
                className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 dark:bg-dark-card/50 hover:bg-slate-800 dark:hover:bg-gray-800 text-white dark:text-white font-semibold rounded-full shadow-lg border border-slate-900 dark:border-gray-700 transition-colors"
              >
                {content.btn2Text}
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column: Empty to maintain space but layout is handled by 3D BG */}
          <div className="order-1 md:order-2"></div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-xs font-medium text-slate-600 dark:text-gray-400 uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary-500 to-transparent"></div>
      </motion.div>

      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 -z-[1] w-1/3 h-1/3 bg-primary-100/60 dark:bg-primary-900/20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 -z-[1] w-1/3 h-1/3 bg-purple-100/60 dark:bg-purple-900/20 blur-[100px] rounded-full"></div>
    </section>
  );
};

export default Hero;

