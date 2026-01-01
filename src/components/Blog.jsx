import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { blogAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';
import { Calendar, Clock, ArrowRight, User, Tag, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await blogAPI.getAll();
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
    <section id="blog" className="py-24 bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

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
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 font-semibold text-sm"
          >
            {t('blog.badge')}
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('blog.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-600">{t('blog.titleHighlight')}</span>
          </h2>
          <p className="text-slate-700 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('blog.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-gray-800">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No articles yet</h3>
            <p className="text-gray-500 dark:text-gray-500">Add blog posts from the admin panel to share your insights.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.slice(0, 6).map((post, index) => (
              <motion.article
                key={post.id || index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white/50" />
                    </div>
                  )}

                  {/* Category Badge */}
                  {post.category && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-600 dark:text-primary-400">
                        {post.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(post.published_at || post.created_at)}
                    </span>
                    {post.read_time && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.read_time} min read
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-slate-700 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                    {post.excerpt || post.content?.substring(0, 120) + '...'}
                  </p>

                  {/* Author & Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User size={14} className="text-gray-500" />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {post.author || 'RizzTech'}
                      </span>
                    </div>
                    <a
                      href={`/blog/${post.slug || post.id}`}
                      className="flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:gap-2 transition-all"
                    >
                      Read More <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* View All CTA */}
        {posts.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <a
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full transition-colors shadow-lg shadow-primary-500/25"
            >
              View All Articles <ArrowRight size={18} />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Blog;
