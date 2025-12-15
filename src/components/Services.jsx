import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Smartphone, Palette, Globe, Server, Shield, Database, Cloud, Cpu, Wifi } from 'lucide-react';
import { servicesAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';


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

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Error loading services:', error);
      // Fallback to default services if API fails
      setServices([
        { icon_name: 'Globe', title: 'Web Development', description: 'Modern, responsive websites.' },
        { icon_name: 'Smartphone', title: 'Mobile Apps', description: 'iOS and Android applications.' },
        { icon_name: 'Palette', title: 'UI/UX Design', description: 'User-centered design solutions.' },
        { icon_name: 'Server', title: 'Backend Solutions', description: 'Scalable backend systems.' },
        { icon_name: 'Code', title: 'Custom Software', description: 'Tailored software solutions.' },
        { icon_name: 'Shield', title: 'Cybersecurity', description: 'Security measures and audits.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || Code;
    return <IconComponent size={32} />;
  };

  return (
    <section id="services" className="py-24 bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
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
          <span className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider uppercase text-sm">What We Do</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-3 mb-6">Expert Services</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Elevating businesses through innovative technology and premium design solutions.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner size="lg" />
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
                className="bg-gray-50 dark:bg-dark-card rounded-2xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 group"
              >
                <div className="mb-6 inline-block p-4 bg-white dark:bg-white/5 rounded-2xl shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 text-primary-600 dark:text-primary-400">
                  {getIcon(service.icon_name)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {service.description}
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

