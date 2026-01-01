import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Code, Rocket, MessageSquare, Settings, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Process = () => {
  const { t } = useLanguage();
  const steps = [
    {
      id: 1,
      icon: MessageSquare,
      title: 'Discovery',
      description: 'We start by understanding your business, goals, and target audience through in-depth consultation.',
      duration: '1-2 Days',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      icon: Search,
      title: 'Research & Planning',
      description: 'Our team analyzes competitors, market trends, and creates a detailed project roadmap.',
      duration: '2-3 Days',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      icon: FileText,
      title: 'Design',
      description: 'We craft beautiful, user-centric designs that align with your brand identity.',
      duration: '5-7 Days',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 4,
      icon: Code,
      title: 'Development',
      description: 'Our developers bring designs to life with clean, efficient, and scalable code.',
      duration: '2-4 Weeks',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 5,
      icon: Settings,
      title: 'Testing & QA',
      description: 'Rigorous testing ensures your product is bug-free and performs flawlessly.',
      duration: '3-5 Days',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 6,
      icon: Rocket,
      title: 'Launch & Support',
      description: 'We deploy your project and provide ongoing support to ensure long-term success.',
      duration: 'Ongoing',
      color: 'from-primary-500 to-purple-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="process" className="py-24 bg-white dark:bg-dark-bg transition-colors duration-300 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary-100/50 dark:bg-primary-900/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-100/50 dark:bg-purple-900/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-semibold text-sm"
          >
            {t('process.badge')}
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('process.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">{t('process.titleHighlight')}</span>
          </h2>
          <p className="text-slate-700 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('process.subtitle')}
          </p>
        </motion.div>

        {/* Process Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-primary-500 opacity-30"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                variants={itemVariants}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white dark:bg-dark-card border-2 border-slate-300 dark:border-gray-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-gray-400 shadow-sm z-10">
                  {step.id}
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="relative bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200 dark:border-gray-800 hover:shadow-xl transition-all duration-500 h-full"
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-700 dark:text-gray-400 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Duration Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-gray-800 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium text-slate-700 dark:text-gray-400">
                      {step.duration}
                    </span>
                  </div>

                  {/* Arrow to next (desktop only) */}
                  {index < steps.length - 1 && index !== 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-gray-700">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-slate-800 dark:text-gray-300">
              Ready to start your project?
            </span>
            <a
              href="#contact"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            >
              Let's talk →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
