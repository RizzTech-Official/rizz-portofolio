import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Smartphone, Palette, Globe, Server, Shield, Database, Cloud, Cpu, Wifi, ArrowRight } from 'lucide-react';
import { servicesAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';

const iconMap = {
  Globe, Smartphone, Palette, Server, Code, Shield, Database, Cloud, Cpu, Wifi,
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || Code;
    return <IconComponent size={28} />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="services" className="py-28 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-dark-bg dark:via-dark-surface/30 dark:to-dark-bg -z-10" />

      {/* Floating Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary-400/10 via-purple-400/10 to-cyan-400/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="badge-primary mb-4"
          >
            {t('services.badge')}
          </motion.span>
          <h2 className="section-title mt-4 mb-6">{t('services.title')}</h2>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-gray-800"
          >
            <Code className="w-16 h-16 mx-auto text-slate-300 dark:text-gray-600 mb-4" />
            <p className="text-slate-500 dark:text-gray-400">No services available yet.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id || index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-white dark:bg-dark-card rounded-3xl p-8 border border-slate-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-900/50 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <div className="relative mb-6 inline-flex p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-white/5 dark:to-white/10 rounded-2xl group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-500">
                  <span className="text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors duration-500">
                    {getIcon(service.icon_name)}
                  </span>
                </div>

                <h3 className="relative text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {service.title || service.title_en}
                </h3>

                <p className="relative text-slate-600 dark:text-gray-400 leading-relaxed mb-6">
                  {service.description || service.description_en}
                </p>

                <div className="relative flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Services;
