import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonialsAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';
import { Quote, Star, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getAll();
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0a0a] dark:to-dark-bg transition-colors duration-300 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

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
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-semibold text-sm"
          >
            {t('testimonials.badge')}
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('testimonials.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">{t('testimonials.titleHighlight')}</span>
          </h2>
          <p className="text-slate-700 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-gray-800">
            <MessageSquareQuote className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No testimonials yet</h3>
            <p className="text-gray-500 dark:text-gray-500">Add testimonials from the admin panel to showcase client feedback.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Main Testimonial Card */}
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="relative bg-white dark:bg-dark-card rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-gray-800"
                >
                  {/* Quote Icon */}
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Quote className="w-6 h-6 text-white" />
                  </div>

                  <div className="pt-4">
                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {renderStars(testimonials[currentIndex]?.rating || 5)}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-xl md:text-2xl text-slate-800 dark:text-gray-200 leading-relaxed mb-8 italic">
                      "{testimonials[currentIndex]?.quote}"
                    </blockquote>

                    {/* Client Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center shadow-lg">
                        {testimonials[currentIndex]?.client_photo ? (
                          <img
                            src={testimonials[currentIndex].client_photo}
                            alt={testimonials[currentIndex].client_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-xl">
                            {testimonials[currentIndex]?.client_name?.charAt(0) || 'C'}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                          {testimonials[currentIndex]?.client_name}
                        </h4>
                        <p className="text-slate-600 dark:text-gray-400 text-sm">
                          {testimonials[currentIndex]?.position}{testimonials[currentIndex]?.company && ` at ${testimonials[currentIndex].company}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 rounded-full bg-white dark:bg-dark-card shadow-lg border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 rounded-full bg-white dark:bg-dark-card shadow-lg border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                      ? 'bg-primary-500 w-8'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
