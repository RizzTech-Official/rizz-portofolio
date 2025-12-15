import { useEffect, useState } from 'react';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';
import { projectsAPI, contactsAPI, servicesAPI, certificatesAPI } from '../../api';
import { Briefcase, Mail, Settings, Award, ArrowRight, Sparkles, Info, Clock, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


export default function DashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    contacts: 0,
    unreadContacts: 0,
    services: 0,
    certificates: 0,
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [projectsRes, contactsRes, servicesRes, certsRes] = await Promise.all([
        projectsAPI.getAll(),
        contactsAPI.getAll(),
        servicesAPI.getAll(),
        certificatesAPI.getAll(),
      ]);

      setStats({
        projects: Array.isArray(projectsRes.data) ? projectsRes.data.length : 0,
        contacts: Array.isArray(contactsRes.data) ? contactsRes.data.length : 0,
        unreadContacts: Array.isArray(contactsRes.data) ? contactsRes.data.filter(c => !c.is_read).length : 0,
        services: Array.isArray(servicesRes.data) ? servicesRes.data.length : 0,
        certificates: Array.isArray(certsRes.data) ? certsRes.data.length : 0,
      });
      setRecentContacts(Array.isArray(contactsRes.data) ? contactsRes.data.slice(0, 3) : []);
      setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: Briefcase, gradient: 'from-blue-500 to-blue-600', path: '/admin/projects' },
    { label: 'Services', value: stats.services, icon: Settings, gradient: 'from-emerald-500 to-emerald-600', path: '/admin/services' },
    { label: 'Certificates', value: stats.certificates, icon: Award, gradient: 'from-amber-500 to-orange-500', path: '/admin/certificates' },
    { label: 'Messages', value: stats.contacts, icon: Mail, gradient: 'from-purple-500 to-purple-600', path: '/admin/contacts', badge: stats.unreadContacts },
  ];

  const quickActions = [
    { label: 'Edit Hero', icon: Sparkles, path: '/admin/hero', desc: 'Update landing header' },
    { label: 'Edit About', icon: Info, path: '/admin/about', desc: 'Company information' },
    { label: 'Add Project', icon: Briefcase, path: '/admin/projects', desc: 'Portfolio showcase' },
    { label: 'View Messages', icon: Mail, path: '/admin/contacts', desc: 'Contact inbox' },
  ];

  // Pie chart data for content distribution
  const pieData = [
    { name: 'Projects', value: stats.projects, color: '#3b82f6' },
    { name: 'Services', value: stats.services, color: '#10b981' },
    { name: 'Certificates', value: stats.certificates, color: '#f59e0b' },
    { name: 'Messages', value: stats.contacts, color: '#8b5cf6' },
  ].filter(d => d.value > 0);

  // Activity chart data (mock monthly data based on current stats)
  const activityData = [
    { name: 'Jan', projects: Math.floor(stats.projects * 0.3), contacts: Math.floor(stats.contacts * 0.2) },
    { name: 'Feb', projects: Math.floor(stats.projects * 0.4), contacts: Math.floor(stats.contacts * 0.35) },
    { name: 'Mar', projects: Math.floor(stats.projects * 0.5), contacts: Math.floor(stats.contacts * 0.45) },
    { name: 'Apr', projects: Math.floor(stats.projects * 0.6), contacts: Math.floor(stats.contacts * 0.55) },
    { name: 'May', projects: Math.floor(stats.projects * 0.75), contacts: Math.floor(stats.contacts * 0.7) },
    { name: 'Jun', projects: stats.projects, contacts: stats.contacts },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your site.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, gradient, path, badge }) => (
          <Link
            key={label}
            to={path}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 overflow-hidden"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}></div>

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
              </div>
              <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>

            {badge > 0 && (
              <span className="absolute top-3 right-3 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {badge}
              </span>
            )}

            <div className="mt-4 flex items-center text-sm text-gray-400 group-hover:text-primary-600 transition-colors">
              <span>View details</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Overview</h2>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Area type="monotone" dataKey="projects" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorProjects)" />
                <Area type="monotone" dataKey="contacts" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorContacts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Contacts</span>
            </div>
          </div>
        </div>

        {/* Content Distribution Pie */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Content Distribution</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map(({ label, icon: Icon, path, desc }) => (
              <Link
                key={label}
                to={path}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-transparent hover:border-primary-200 dark:hover:border-primary-800 transition-all"
              >
                <Icon className="w-8 h-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Messages</h2>
            <Link to="/admin/contacts" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          {recentContacts.length > 0 ? (
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm">{contact.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{contact.name}</p>
                      {!contact.is_read && <span className="w-2 h-2 bg-primary-500 rounded-full"></span>}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{contact.subject || contact.message}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(contact.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No messages yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
