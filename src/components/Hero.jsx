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
    <section id="home" className="relative min-h-screen w-full bg-primary-50 dark:bg-dark-bg overflow-hidden flex items-center justify-center pt-16">

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
            transition={{ duration: 0.8 }}
            className="text-center md:text-left order-2 md:order-1 pointer-events-auto"
          >
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 font-medium text-sm">
              {content.badge}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {content.line1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">{content.line2}</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
              {content.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={content.btn1Link}
                className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full shadow-lg shadow-primary-500/30 transition-colors"
              >
                {content.btn1Text} <ArrowRight className="ml-2" size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={content.btn2Link}
                className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
              >
                {content.btn2Text}
              </motion.a>
            </div>
          </motion.div>

          {/* Right Column: Empty to maintain space but layout is handled by 3D BG */}
          <div className="order-1 md:order-2"></div>

        </div>
      </div>

      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 -z-[1] w-1/3 h-1/3 bg-primary-200/50 dark:bg-primary-900/20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 -z-[1] w-1/3 h-1/3 bg-purple-200/50 dark:bg-purple-900/20 blur-[100px] rounded-full"></div>
    </section>
  );
};

export default Hero;

