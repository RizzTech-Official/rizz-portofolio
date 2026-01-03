import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Info, Briefcase, Award, Settings, Mail, LogOut, Menu, X, Sparkles, ExternalLink, Moon, Sun, MessageSquareQuote, Users, Building2, HelpCircle, DollarSign, BookOpen, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import logoTim from '../../assets/logo.jpg';


const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/admin/hero', icon: Sparkles, label: 'Hero' },
  { path: '/admin/about', icon: Info, label: 'About' },
  { path: '/admin/services', icon: Settings, label: 'Services' },
  { path: '/admin/clients', icon: Building2, label: 'Clients' },
  { path: '/admin/projects', icon: Briefcase, label: 'Projects' },
  { path: '/admin/testimonials', icon: MessageSquareQuote, label: 'Testimonials' },
  { path: '/admin/team', icon: Users, label: 'Team' },
  { path: '/admin/pricing', icon: DollarSign, label: 'Pricing' },
  { path: '/admin/certificates', icon: Award, label: 'Certificates' },
  { path: '/admin/blog', icon: BookOpen, label: 'Blog' },
  { path: '/admin/faq', icon: HelpCircle, label: 'FAQ' },
  { path: '/admin/contacts', icon: Mail, label: 'Contacts' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? saved === 'true' : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('adminDarkMode', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 
        bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 
        transform transition-transform duration-300 ease-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-white/5
      `}>
        {/* Logo Section */}
        <div className="flex-none flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden shadow-lg shadow-primary-500/20 ring-2 ring-primary-500/30">
              <img src={logoTim} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">RizzTech</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
          <nav className="px-3 space-y-1">
            <p className="px-4 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Menu
            </p>
            {navItems.map(({ path, icon: Icon, label, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium text-sm">{label}</span>
                <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}
          </nav>

          {/* View Site Link */}
          <div className="px-3 py-4 mt-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-primary-600/20 border border-white/5 hover:border-primary-500/30 transition-all duration-300"
            >
              <ExternalLink size={18} />
              <span className="font-medium text-sm">View Live Site</span>
            </a>
          </div>
        </div>

        {/* User Section */}
        <div className="flex-none p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">{user?.username?.[0]?.toUpperCase() || 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.username || 'Admin'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 rounded-xl transition-all duration-300"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-gray-800/50 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <Menu size={24} />
              </motion.button>
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">RizzTech</h1>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-300 transition-all shadow-sm"
            >
              {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
            </motion.button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-slate-50 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
