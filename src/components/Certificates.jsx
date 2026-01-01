import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { certificatesAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';
import { Award, ExternalLink, Calendar, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Industry partner logos (SVG or placeholder)
const industryPartners = [
  { name: 'Amazon Web Services', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
  { name: 'Google Cloud', logo: 'https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg' },
  { name: 'Microsoft Azure', logo: 'https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-icon.svg' },
  { name: 'Meta', logo: 'https://www.vectorlogo.zone/logos/facebook/facebook-icon.svg' },
  { name: 'Kubernetes', logo: 'https://www.vectorlogo.zone/logos/kubernetes/kubernetes-icon.svg' },
  { name: 'Docker', logo: 'https://www.vectorlogo.zone/logos/docker/docker-icon.svg' },
  { name: 'MongoDB', logo: 'https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg' },
  { name: 'PostgreSQL', logo: 'https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg' },
];

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const response = await certificatesAPI.getAll();
      setCertificates(response.data);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <section id="certificates" className="py-24 bg-white dark:bg-dark-bg transition-colors duration-300 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200/30 dark:bg-primary-900/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 font-semibold text-sm"
          >
            {t('certificates.badge')}
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('certificates.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{t('certificates.titleHighlight')}</span>
          </h2>
          <p className="text-slate-700 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('certificates.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800">
            <Award className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No certificates yet</h3>
            <p className="text-gray-500 dark:text-gray-500">Add certificates from the admin panel to showcase your achievements.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id || index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-dark-card dark:to-dark-surface rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500"
              >
                {/* Gradient Overlay at Top */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-amber-500/10 dark:from-primary-500/20 dark:via-purple-500/20 dark:to-amber-500/20"></div>

                {/* Badge Icon */}
                <div className="relative pt-8 pb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-2 text-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {cert.title}
                  </h3>

                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
                    <Building2 size={14} />
                    <span className="text-sm">{cert.issuer || 'Certified Authority'}</span>
                  </div>

                  {(cert.issue_date || cert.date_issued) && (
                    <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-xs mb-4">
                      <Calendar size={12} />
                      <span>Issued {cert.issue_date || cert.date_issued}</span>
                    </div>
                  )}

                  {/* Credential Link */}
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors"
                    >
                      <span>View Credential</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                {/* Decorative Corner */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-500/5 to-purple-500/5 rounded-full"></div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Auto-sliding Industry Logos - only show if there are certificates */}
        {certificates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-20 pt-12 border-t border-gray-100 dark:border-gray-800"
          >
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">Trusted by industry leaders</p>

            {/* Infinite Scroll Container */}
            <div className="relative overflow-hidden">
              {/* Gradient Fades */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-dark-bg to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-dark-bg to-transparent z-10"></div>

              {/* Scrolling Logos */}
              <div className="flex animate-scroll">
                {/* First set */}
                <div className="flex items-center gap-12 px-6">
                  {industryPartners.map((partner, i) => (
                    <div
                      key={`first-${i}`}
                      className="flex-shrink-0 w-20 h-20 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                      title={partner.name}
                    >
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
                {/* Duplicate set for seamless loop */}
                <div className="flex items-center gap-12 px-6">
                  {industryPartners.map((partner, i) => (
                    <div
                      key={`second-${i}`}
                      className="flex-shrink-0 w-20 h-20 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                      title={partner.name}
                    >
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Certificates;
