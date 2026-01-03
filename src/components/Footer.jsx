import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20' },
    { icon: Twitter, href: '#', color: 'hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20' },
  ];

  const quickLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <footer className="relative bg-white dark:bg-dark-bg border-t border-slate-100 dark:border-gray-800 overflow-hidden">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />

      {/* Background Orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-primary-500/5 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2 space-y-6"
          >
            <span className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
              RizzTech
            </span>
            <p className="text-slate-600 dark:text-gray-400 max-w-sm text-lg leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map(({ icon: Icon, href, color }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-500 transition-all duration-300 ${color}`}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group flex items-center text-slate-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 mr-0 group-hover:mr-3 transition-all duration-300" />
                    {item.name}
                    <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6">
              {t('footer.contactInfo')}
            </h3>
            <ul className="space-y-4">
              <li className="group flex items-start text-slate-600 dark:text-gray-400">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 mr-3 mt-0.5">
                  <MapPin size={16} className="text-primary-500" />
                </div>
                <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  123 Tech Avenue,<br />Silicon Valley, CA
                </span>
              </li>
              <li className="group flex items-center text-slate-600 dark:text-gray-400">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 mr-3">
                  <Phone size={16} className="text-primary-500" />
                </div>
                <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="group flex items-center text-slate-600 dark:text-gray-400">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 mr-3">
                  <Mail size={16} className="text-primary-500" />
                </div>
                <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  hello@rizztech.com
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-gray-500">
            © {new Date().getFullYear()} RizzTech. {t('footer.copyright')}
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
