import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Globe } from 'lucide-react';
import logoTim from '../assets/logo.jpg';
import { useLanguage } from '../context/LanguageContext';

const Navbar = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.pricing'), href: '#pricing' },
    { name: t('nav.blog'), href: '#blog' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled
        ? 'bg-white/95 dark:bg-dark-bg/90 backdrop-blur-md border-slate-200 dark:border-white/10 shadow-lg shadow-slate-900/5'
        : 'bg-transparent border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20"> {/* Increased height for elegance */}

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 bg-primary-500 rounded-xl mr-3 flex items-center justify-center shadow-lg shadow-primary-500/30 transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              <img
                src={logoTim}
                alt="Logo Tim"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
              Rizz<span className="text-primary-600 dark:text-primary-500">Tech</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8"> {/* items-center fixed alignment */}
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white transition-colors group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}

              <div className="w-[1px] h-6 bg-slate-300 dark:bg-gray-700 mx-4"></div> {/* Separator */}

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-yellow-400 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-white/20 transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-white/20 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium"
                aria-label="Toggle Language"
              >
                <Globe size={16} />
                <span>{language === 'en' ? 'EN' : 'ID'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/10">
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  <span className="font-medium">{theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</span>
                  <span className="p-2 rounded-full bg-gray-100 dark:bg-white/10">
                    {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
                  </span>
                </button>

                {/* Language Toggle Mobile */}
                <button
                  onClick={() => {
                    toggleLanguage();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all mt-2"
                >
                  <span className="font-medium flex items-center gap-2">
                    <Globe size={18} />
                    {language === 'en' ? 'Switch to Indonesian' : 'Ganti ke English'}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold">
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
