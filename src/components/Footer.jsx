import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-white dark:bg-dark-bg transition-colors duration-300">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 opacity-80"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <span className="font-bold text-3xl bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent block">
              RizzTech
            </span>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm text-lg leading-relaxed">
              Crafting exceptional digital experiences. We turn complex problems into elegant software solutions.
            </p>
            <div className="flex space-x-5 pt-2">
              <a href="#" className="transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-gray-400 hover:text-primary-600"><Facebook size={24} /></a>
              <a href="#" className="transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-gray-400 hover:text-sky-500"><Twitter size={24} /></a>
              <a href="#" className="transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-gray-400 hover:text-pink-600"><Instagram size={24} /></a>
              <a href="#" className="transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-gray-400 hover:text-blue-700"><Linkedin size={24} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6">Explore</h3>
            <ul className="space-y-4">
              {['Home', 'About', 'Services', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary-600 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start text-gray-600 dark:text-gray-400 group">
                <MapPin size={20} className="mr-3 text-primary-500 mt-1 flex-shrink-0 group-hover:animate-bounce" />
                <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">123 Tech Avenue,<br />Silicon Valley, CA</span>
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400 group">
                <Phone size={20} className="mr-3 text-primary-500 flex-shrink-0 group-hover:rotate-12 transition-transform" />
                <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400 group">
                <Mail size={20} className="mr-3 text-primary-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">hello@rizztech.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-500">
          <p>© {new Date().getFullYear()} RizzTech. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
