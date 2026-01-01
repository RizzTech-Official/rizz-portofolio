import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { clientsAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';
import { Building2 } from 'lucide-react';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await clientsAPI.getAll();
      setClients(response.data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </section>
    );
  }

  if (clients.length === 0) {
    return null; // Don't show section if no clients
  }

  return (
    <section id="clients" className="py-20 bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 font-semibold text-sm"
          >
            🤝 Trusted By
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Companies That <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Trust Us</span>
          </h2>
          <p className="text-slate-700 dark:text-gray-400 max-w-xl mx-auto">
            We're proud to work with amazing companies around the world.
          </p>
        </motion.div>

        {/* Infinite Scroll Container */}
        <div className="relative overflow-hidden">
          {/* Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 dark:from-[#0a0a0a] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 dark:from-[#0a0a0a] to-transparent z-10"></div>

          {/* Scrolling Logos */}
          <div className="flex animate-scroll">
            {/* First set */}
            <div className="flex items-center gap-16 px-8">
              {clients.map((client, i) => (
                <a
                  key={`first-${client.id || i}`}
                  href={client.website_url || '#'}
                  target={client.website_url ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="flex-shrink-0 group"
                  title={client.name}
                >
                  <div className="w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300 transform hover:scale-110">
                    {client.logo_url ? (
                      <img
                        src={client.logo_url}
                        alt={client.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`${client.logo_url ? 'hidden' : 'flex'} w-full h-full items-center justify-center bg-slate-100 dark:bg-gray-800 rounded-xl`}
                    >
                      <span className="text-slate-600 dark:text-gray-400 font-semibold text-sm text-center px-2">{client.name}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center gap-16 px-8">
              {clients.map((client, i) => (
                <a
                  key={`second-${client.id || i}`}
                  href={client.website_url || '#'}
                  target={client.website_url ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="flex-shrink-0 group"
                  title={client.name}
                >
                  <div className="w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300 transform hover:scale-110">
                    {client.logo_url ? (
                      <img
                        src={client.logo_url}
                        alt={client.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-gray-800 rounded-xl">
                        <span className="text-slate-600 dark:text-gray-400 font-semibold text-sm text-center px-2">{client.name}</span>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
