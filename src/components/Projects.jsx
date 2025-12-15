import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projectsAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fallback if no projects
  const displayProjects = projects.length > 0 ? projects : [
    {
      title: 'E-Commerce Platform',
      tech_stack: 'React, Node.js',
      description: 'A full-featured online store with real-time inventory.',
      image_url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800'
    },
    {
      title: 'Healthcare App',
      tech_stack: 'Flutter, Firebase',
      description: 'Patient management system with secure data handling.',
      image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'
    },
    {
      title: 'Finance Dashboard',
      tech_stack: 'React, D3.js',
      description: 'Interactive investment tracking dashboard.',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
    },
  ];

  return (
    <section id="projects" className="py-24 bg-gray-50 dark:bg-dark-bg/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider text-sm uppercase mb-2 block">Our Portfolio</span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Featured Projects</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Showcasing our expertise through successfully delivered solutions that drive growth.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto rounded-full mt-6"></div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project, index) => (
              <motion.div
                key={project.id || index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10"></div>
                  <img
                    src={project.image_url || 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800'}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tech_stack && project.tech_stack.split(',').map((tag, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/20">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 relative">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-500">Latest Release</span>
                    <button className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-1">
                      View Case Study →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;

