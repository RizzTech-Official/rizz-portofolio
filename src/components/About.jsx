import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { aboutAPI, projectsAPI, certificatesAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';


const About = () => {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [aboutRes, projectsRes, certsRes] = await Promise.all([
        aboutAPI.get(),
        projectsAPI.getAll(),
        certificatesAPI.getAll(),
      ]);
      setAbout(aboutRes.data);
      setProjects(projectsRes.data.slice(0, 3)); // Show max 3 featured
      setCertificates(certsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback projects if none from API
  const displayProjects = projects.length > 0 ? projects : [
    { title: 'E-Commerce Platform', tech_stack: 'React, Node.js', description: 'A full-featured online store.', image_url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800' },
    { title: 'Healthcare App', tech_stack: 'Flutter, Firebase', description: 'Patient management system.', image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800' },
    { title: 'Finance Dashboard', tech_stack: 'React, D3.js', description: 'Investment tracking dashboard.', image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800' },
  ];

  // Fallback certificates
  const displayCerts = certificates.length > 0
    ? certificates.map(c => c.title)
    : ['ISO 27001', 'AWS Partner', 'Google Cloud Certified', 'Meta Business Partner'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <section id="about" className="py-24 bg-white dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {about?.title || 'About RizzTech'}
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-2xl transform rotate-3 scale-[1.02] opacity-20 -z-10"></div>
              <img
                src={about?.image_url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"}
                alt="Team Collaboration"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Building the Future, One Line of Code at a Time
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {about?.description || 'At RizzTech, we believe in the power of technology to transform businesses.'}
            </p>
            {about?.mission && (
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                <strong>Mission:</strong> {about.mission}
              </p>
            )}
            {about?.vision && (
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                <strong>Vision:</strong> {about.vision}
              </p>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-3xl font-bold text-primary-600">50+</h4>
                <p className="text-gray-600 dark:text-gray-400">Projects Delivered</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-3xl font-bold text-primary-600">100%</h4>
                <p className="text-gray-600 dark:text-gray-400">Client Satisfaction</p>
              </div>
            </div>
          </motion.div>
        </div>


        {/* Certificates Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">Our Certifications</h3>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto">
            Industry-recognized certifications that validate our expertise and commitment to excellence.
          </p>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300"
                >
                  {cert.image_url ? (
                    <div className="h-28 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30">
                      <img
                        src={cert.image_url}
                        alt={cert.title}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => { e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full"><svg class="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg></div>'; }}
                      />
                    </div>
                  ) : (
                    <div className="h-28 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 flex items-center justify-center">
                      <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                      </svg>
                    </div>
                  )}
                  <div className="p-4 text-center">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">{cert.title}</h4>
                    {cert.issuer && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cert.issuer}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {displayCerts.map((cert, index) => (
                <div key={index} className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{cert}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

    </section >
  );
};

export default About;

