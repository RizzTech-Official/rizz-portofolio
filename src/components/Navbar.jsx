import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Globe, ChevronRight } from 'lucide-react';
import logoTim from '../assets/logo.jpg';
import { useLanguage } from '../context/LanguageContext';

const Navbar = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Detect active section
      const sections = ['home', 'about', 'services', 'projects', 'pricing', 'blog', 'contact'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '#home', id: 'home' },
    { name: t('nav.about'), href: '#about', id: 'about' },
    { name: t('nav.services'), href: '#services', id: 'services' },
    { name: t('nav.projects'), href: '#projects', id: 'projects' },
    { name: t('nav.pricing'), href: '#pricing', id: 'pricing' },
    { name: t('nav.blog'), href: '#blog', id: 'blog' },
    { name: t('nav.contact'), href: '#contact', id: 'contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-white/5 shadow-lg shadow-slate-900/5'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 flex items-center cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mr-3 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-all duration-300 overflow-hidden group-hover:scale-105">
              <img src={logoTim} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
              Rizz<span className="text-primary-500">Tech</span>
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${activeSection === link.id
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {link.name}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-xl -z-10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </motion.a>
            ))}

            <div className="w-px h-6 bg-slate-200 dark:bg-gray-700 mx-3" />

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-white/20 transition-all duration-300"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-all duration-300 text-sm font-medium"
            >
              <Globe size={16} />
              <span>{language === 'en' ? 'EN' : 'ID'}</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-xl text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-b border-slate-200/50 dark:border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${activeSection === link.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                >
                  {link.name}
                  <ChevronRight size={18} className="text-slate-400" />
                </motion.a>
              ))}

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
                <button
                  onClick={() => { toggleTheme(); setIsOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/10">
                    {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
                  </div>
                </button>

                <button
                  onClick={() => { toggleLanguage(); setIsOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  <span className="font-medium flex items-center gap-2">
                    <Globe size={18} />
                    {language === 'en' ? 'Switch to Indonesian' : 'Ganti ke English'}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold">
                    {language === 'en' ? 'EN' : 'ID'}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
