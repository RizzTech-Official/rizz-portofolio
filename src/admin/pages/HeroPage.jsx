import { useEffect, useState } from 'react';
import { heroAPI } from '../../api';
import { Save, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function HeroPage() {
  const [formData, setFormData] = useState({
    badge_text_en: '', badge_text_id: '',
    title_line1_en: '', title_line1_id: '',
    title_line2_en: '', title_line2_id: '',
    description_en: '', description_id: '',
    button1_text_en: '', button1_text_id: '',
    button2_text_en: '', button2_text_id: '',
    button1_link: '', button2_link: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    try {
      const response = await heroAPI.get();
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Error loading hero:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await heroAPI.update(formData);
      setMessage({ type: 'success', text: 'Hero section updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hero Section</h1>
          <p className="text-sm text-gray-500">Manage Dual Language Content</p>
        </div>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
          ? 'bg-green-50 text-green-600 border-green-200'
          : 'bg-red-50 text-red-600 border-red-200'} border`
        }>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Badge & Titles Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 border-b pb-2 dark:border-gray-700">Headlines</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Badge Text (EN)</label>
                <input
                  type="text"
                  name="badge_text_en"
                  value={formData.badge_text_en || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:text-white"
                  placeholder="Shaping Future" />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary-600 mb-1">Badge Text (ID)</label>
                <input
                  type="text"
                  name="badge_text_id"
                  value={formData.badge_text_id || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-primary-100 rounded-xl bg-primary-50/20 dark:bg-primary-900/10 dark:text-white"
                  placeholder="Merancang Masa Depan" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Title Line 1 (EN)</label>
                <input
                  type="text"
                  name="title_line1_en"
                  value={formData.title_line1_en || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary-600 mb-1">Title Line 1 (ID)</label>
                <input
                  type="text"
                  name="title_line1_id"
                  value={formData.title_line1_id || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-primary-100 rounded-xl bg-primary-50/20 dark:bg-primary-900/10 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Title Line 2 (EN)</label>
                <input
                  type="text"
                  name="title_line2_en"
                  value={formData.title_line2_en || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary-600 mb-1">Title Line 2 (ID)</label>
                <input
                  type="text"
                  name="title_line2_id"
                  value={formData.title_line2_id || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-primary-100 rounded-xl bg-primary-50/20 dark:bg-primary-900/10 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Description (EN)</label>
                <textarea rows={3} name="description_en" value={formData.description_en || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary-600 mb-1">Deskripsi (ID)</label>
                <textarea rows={3} name="description_id" value={formData.description_id || ''} onChange={handleChange} className="w-full px-4 py-2 border border-primary-100 rounded-xl bg-primary-50/20 dark:bg-primary-900/10 dark:text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 border-b pb-2 dark:border-gray-700">Buttons</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold">Primary Button</h3>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" name="button1_text_en" value={formData.button1_text_en || ''} onChange={handleChange} placeholder="EN Text" className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <input type="text" name="button1_text_id" value={formData.button1_text_id || ''} onChange={handleChange} placeholder="ID Text" className="px-3 py-2 border border-primary-100 bg-primary-50/20 dark:bg-primary-900/10 dark:text-white rounded-lg" />
              </div>
              <input type="text" name="button1_link" value={formData.button1_link || ''} onChange={handleChange} placeholder="Link URL" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold">Secondary Button</h3>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" name="button2_text_en" value={formData.button2_text_en || ''} onChange={handleChange} placeholder="EN Text" className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <input type="text" name="button2_text_id" value={formData.button2_text_id || ''} onChange={handleChange} placeholder="ID Text" className="px-3 py-2 border border-primary-100 bg-primary-50/20 dark:bg-primary-900/10 dark:text-white rounded-lg" />
              </div>
              <input type="text" name="button2_link" value={formData.button2_link || ''} onChange={handleChange} placeholder="Link URL" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg">
          <Save size={20} /> 
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}