import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projectsAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';
import { ExternalLink, Github, ArrowUpRight, Image } from 'lucide-react';
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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <section id="projects" className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-dark-bg dark:to-dark-bg/80 transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 font-semibold text-sm"
            >
              {t('projects.badge')}
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              {t('projects.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600">{t('projects.titleHighlight')}</span>
            </h2>
            <p className="text-slate-700 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              {t('projects.subtitle')}
            </p>
          </motion.div>

          {/* Filter Tabs - only show if there are projects */}
          {projects.length > 0 && categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === cat
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-800'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-gray-800">
              <Image className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No projects yet</h3>
              <p className="text-gray-500 dark:text-gray-500">Add projects from the admin panel to showcase your work.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id || index}
                  variants={itemVariants}
                  onClick={() => handleProjectClick(project)}
                  className="group relative bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative h-72 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity z-10"></div>
                    <img
                      src={project.image_url || 'https://via.placeholder.com/800x400?text=No+Image'}
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {project.category || 'Project'}
                      </span>
                    </div>

                    {/* Hover Action Button */}
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="p-3 bg-primary-500 rounded-full text-white shadow-lg">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>

                    {/* Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack && project.tech_stack.split(',').slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/20">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {project.title || project.title_en}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {project.description || project.description_en}
                    </p>

                    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {project.github_url && (
                          <button
                            onClick={(e) => { e.stopPropagation(); window.open(project.github_url, '_blank'); }}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/30 transition-colors"
                          >
                            <Github size={18} />
                          </button>
                        )}
                        {project.live_url && (
                          <button
                            onClick={(e) => { e.stopPropagation(); window.open(project.live_url, '_blank'); }}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/30 transition-colors"
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
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Projects;
