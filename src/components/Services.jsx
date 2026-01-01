import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Smartphone, Palette, Globe, Server, Shield, Database, Cloud, Cpu, Wifi } from 'lucide-react';
import { servicesAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';


// Icon mapping
const iconMap = {
  Globe: Globe,
  Smartphone: Smartphone,
  Palette: Palette,
  Server: Server,
  Code: Code,
  Shield: Shield,
  Database: Database,
  Cloud: Cloud,
  Cpu: Cpu,
  Wifi: Wifi,
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
    return <IconComponent size={32} />;
  };

  return (
    <section id="services" className="py-24 bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 dark:bg-primary-500/10 blur-[120px] rounded-full -z-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider uppercase text-sm">{t('services.badge')}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-6">{t('services.title')}</h2>
          <p className="text-lg text-slate-700 dark:text-gray-400 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner size="lg" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-gray-800">
            <Code className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No services available yet. Add services from the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white dark:bg-dark-card rounded-2xl p-8 border border-slate-200 dark:border-gray-800 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 group"
              >
                <div className="mb-6 inline-block p-4 bg-slate-100 dark:bg-white/5 rounded-2xl shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 text-primary-600 dark:text-primary-400">
                  {getIcon(service.icon_name)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {service.title || service.title_en}
                </h3>
                <p className="text-slate-700 dark:text-gray-400 leading-relaxed">
                  {service.description || service.description_en}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;

