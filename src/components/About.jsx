import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { aboutAPI, getImageUrl } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';
import { CheckCircle2, Users, Rocket, Target, Zap } from 'lucide-react';
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
    { label: 'Projects Delivered', value: 50, suffix: '+', icon: Rocket, color: 'from-primary-500 to-cyan-500' },
    { label: 'Happy Clients', value: 30, suffix: '+', icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Success Rate', value: 100, suffix: '%', icon: Target, color: 'from-amber-500 to-orange-500' },
  ];

  const highlights = [
    'Award-winning development team',
    'Agile & transparent process',
    '24/7 dedicated support',
    'Industry best practices',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-28">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <section id="about" className="py-28 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-white dark:bg-dark-bg -z-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-gray-800 to-transparent" />

      {/* Floating Orb */}
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span className="badge-primary mb-4">
            <Zap className="w-4 h-4 mr-1" /> About Us
          </motion.span>
          <h2 className="section-title mt-4 mb-6">
            {about?.title || 'About RizzTech'}
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative group">
              {/* Decorative Elements */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-600 rounded-3xl transform rotate-2 scale-[1.02] opacity-20 group-hover:rotate-3 transition-transform duration-500" />

              <img
                src={getImageUrl(about?.image_url) || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"}
                alt="Team Collaboration"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
              />

              {/* Floating Experience Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="absolute -bottom-6 -right-6 bg-white dark:bg-dark-card rounded-2xl p-5 shadow-xl border border-slate-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <Rocket className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">5+</p>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">Years Experience</p>
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
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              Building the Future, One Line of Code at a Time
            </h3>

            <p className="text-lg text-slate-600 dark:text-gray-300 leading-relaxed">
              {about?.description || 'At RizzTech, we believe in the power of technology to transform businesses. Our team of passionate developers, designers, and strategists work together to create digital solutions that drive real results.'}
            </p>

            {about?.mission && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-5 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl border border-primary-100 dark:border-primary-800/30"
              >
                <p className="text-slate-700 dark:text-gray-300">
                  <span className="font-semibold text-primary-600 dark:text-primary-400">Our Mission: </span>
                  {about.mission}
                </p>
              </motion.div>
            )}

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary-500" />
                  </div>
                  <span className="text-slate-700 dark:text-gray-400 text-sm font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group text-center p-8 bg-white dark:bg-dark-card rounded-3xl border border-slate-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                <AnimatedCounter end={stat.value} duration={2000} suffix={stat.suffix} />
              </h4>
              <p className="text-slate-500 dark:text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
