import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Info, Briefcase, Award, Settings, Mail, LogOut, Menu, X, Sparkles, ExternalLink, Moon, Sun, MessageSquareQuote, Users, Building2, HelpCircle, DollarSign, BookOpen } from 'lucide-react';
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
    return saved ? saved === 'true' : true; // Default to dark
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
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-900 to-gray-800 transform transition-transform duration-300 ease-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="flex-none flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 bg-primary-500 rounded-xl mr-1 flex items-center justify-center shadow-lg shadow-primary-500/30 transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              <img
                src={logoTim}
                alt="Logo Tim"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">RizzTech</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Navigation */}
          <nav className="p-4 space-y-1">
            <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</p>
            {navItems.map(({ path, icon: Icon, label, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'}
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* View Site Link */}
          <div className="px-4 pb-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ExternalLink size={20} />
              <span className="font-medium">View Live Site</span>
            </a>
          </div>
        </div>

        {/* User Section - Fixed at bottom */}
        <div className="flex-none p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{user?.username?.[0]?.toUpperCase() || 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.username || 'Admin'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between border-b border-slate-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">RizzTech</h1>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-700 dark:text-gray-300 transition-all shadow-sm"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-slate-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
