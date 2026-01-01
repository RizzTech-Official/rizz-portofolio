import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { teamAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';
import { Users, Linkedin, Github, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeam(response.data);
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <section id="team" className="py-24 bg-white dark:bg-dark-bg transition-colors duration-300 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary-100/50 dark:bg-primary-900/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

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
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-semibold text-sm"
          >
            {t('team.badge')}
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('team.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-600">{t('team.titleHighlight')}</span>
          </h2>
          <p className="text-slate-700 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('team.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : team.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-gray-800">
            <Users className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No team members yet</h3>
            <p className="text-gray-500 dark:text-gray-500">Add team members from the admin panel to introduce your team.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={member.id || index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500">
                  {/* Photo */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"></div>
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-6xl font-bold">{member.name?.charAt(0) || 'T'}</span>
                      </div>
                    )}

                    {/* Social Links Overlay */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-20 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/90 dark:bg-dark-card/90 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <Linkedin size={18} />
                        </a>
                      )}
                      {member.github_url && (
                        <a
                          href={member.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/90 dark:bg-dark-card/90 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <Github size={18} />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 bg-white/90 dark:bg-dark-card/90 rounded-full text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
                        >
                          <Mail size={18} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 text-center">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-2">
                      {member.position}
                    </p>
                    {member.bio && (
                      <p className="text-slate-600 dark:text-gray-400 text-sm line-clamp-2">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Team;
