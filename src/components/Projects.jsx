import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsAPI, getImageUrl } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';
import { ExternalLink, Github, ArrowUpRight, Image, Sparkles } from 'lucide-react';
import ProjectDetailModal from './ProjectDetailModal';
import { useLanguage } from '../context/LanguageContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const categories = projects.length > 0
    ? ['All', ...new Set(projects.map(p => p.category || 'Other'))]
    : ['All'];

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <>
      <section id="projects" className="py-28 relative overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-surface/20 dark:to-dark-bg -z-10" />

        {/* Decorative Elements */}
        <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-br from-primary-400/10 to-purple-400/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-40 left-0 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span className="badge-primary mb-4">
              <Sparkles className="w-4 h-4 mr-1" />
              {t('projects.badge')}
            </motion.span>
            <h2 className="section-title mt-4 mb-6">
              {t('projects.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-purple-500 to-primary-600">
                {t('projects.titleHighlight')}
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('projects.subtitle')}
            </p>
          </motion.div>

          {/* Filter Tabs */}
          {projects.length > 0 && categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(cat)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === cat
                    ? 'text-white'
                    : 'bg-white dark:bg-dark-card text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-800'
                    }`}
                >
                  {activeFilter === cat && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg shadow-primary-500/30"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-gray-800"
            >
              <Image className="w-16 h-16 mx-auto text-slate-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-600 dark:text-gray-400 mb-2">No projects yet</h3>
              <p className="text-slate-500 dark:text-gray-500">Add projects from the admin panel.</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id || index}
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -8 }}
                    onClick={() => handleProjectClick(project)}
                    className="group relative bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-slate-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity z-10" />
                      <img
                        src={getImageUrl(project.image_url) || 'https://via.placeholder.com/800x400?text=No+Image'}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-4 py-1.5 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700 dark:text-gray-300 shadow-lg">
                          {project.category || 'Project'}
                        </span>
                      </div>

                      {/* Hover Action */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 right-4 z-20"
                      >
                        <div className="p-3 bg-primary-500 rounded-full text-white shadow-xl shadow-primary-500/30 group-hover:scale-110 transition-transform">
                          <ArrowUpRight size={20} />
                        </div>
                      </motion.div>

                      {/* Tech Stack */}
                      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap gap-2">
                        {project.tech_stack && project.tech_stack.split(',').slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/20">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {project.title || project.title_en}
                      </h3>
                      <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-5">
                        {project.description || project.description_en}
                      </p>

                      <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                          {project.github_url && (
                            <button
                              onClick={(e) => { e.stopPropagation(); window.open(project.github_url, '_blank'); }}
                              className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-800 text-slate-500 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 transition-all"
                            >
                              <Github size={18} />
                            </button>
                          )}
                          {project.live_url && (
                            <button
                              onClick={(e) => { e.stopPropagation(); window.open(project.live_url, '_blank'); }}
                              className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-800 text-slate-500 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 transition-all"
                            >
                              <ExternalLink size={18} />
                            </button>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1 group/btn">
                          View Details
                          <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Projects;
