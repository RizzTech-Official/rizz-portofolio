import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { aboutAPI, projectsAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';
import { CheckCircle2, Users, Rocket, Target } from 'lucide-react';
import { AnimatedCounter } from '../hooks/useCountUp.jsx';

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const aboutRes = await aboutAPI.get();
      setAbout(aboutRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Projects Delivered', value: 50, suffix: '+', icon: Rocket },
    { label: 'Happy Clients', value: 30, suffix: '+', icon: Users },
    { label: 'Success Rate', value: 100, suffix: '%', icon: Target },
  ];

  const highlights = [
    'Award-winning development team',
    'Agile & transparent process',
    '24/7 dedicated support',
    'Industry best practices',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <section id="about" className="py-24 bg-white dark:bg-dark-bg transition-colors duration-300 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary-100/50 dark:bg-primary-900/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 font-semibold text-sm"
          >
            ✨ About Us
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {about?.title || 'About RizzTech'}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative group">
              {/* Decorative Elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute inset-0 bg-primary-500 rounded-2xl transform rotate-3 scale-[1.02] opacity-20"></div>

              <img
                src={about?.image_url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"}
                alt="Team Collaboration"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
              />

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-white dark:bg-dark-card rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Rocket className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">5+</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Years Experience</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              Building the Future, One Line of Code at a Time
            </h3>

            <p className="text-slate-700 dark:text-gray-300 leading-relaxed text-lg">
              {about?.description || 'At RizzTech, we believe in the power of technology to transform businesses. Our team of passionate developers, designers, and strategists work together to create digital solutions that drive real results.'}
            </p>

            {about?.mission && (
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                <p className="text-slate-800 dark:text-gray-300">
                  <span className="font-semibold text-primary-600 dark:text-primary-400">Our Mission:</span> {about.mission}
                </p>
              </div>
            )}

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-gray-400 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="text-center p-6 bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                <AnimatedCounter end={stat.value} duration={2000} suffix={stat.suffix} />
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;

