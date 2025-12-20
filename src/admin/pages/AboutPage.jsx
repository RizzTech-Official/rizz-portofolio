import { useEffect, useState } from 'react';
import { aboutAPI, uploadAPI } from '../../api';
import { Save, AlertCircle, CheckCircle, Info, Upload, Loader2 } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    title_en: '', title_id: '',
    description_en: '', description_id: '',
    mission_en: '', mission_id: '',
    vision_en: '', vision_id: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const response = await aboutAPI.get();
      setFormData(response.data || {});
    } catch (error) {
      console.error('Error loading about:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await aboutAPI.update(formData);
      setMessage({ type: 'success', text: 'About section updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: response.data.url }));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const DualInput = ({ label, nameEn, nameId, isTextArea = false }) => (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-gray-400 mb-1 block">English</span>
          {isTextArea ? (
            <textarea rows={4} name={nameEn} value={formData[nameEn] || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
          ) : (
            <input type="text" name={nameEn} value={formData[nameEn] || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
          )}
        </div>
        <div>
          <span className="text-xs text-primary-500 mb-1 block">Indonesia</span>
          {isTextArea ? (
            <textarea rows={4} name={nameId} value={formData[nameId] || ''} onChange={handleChange} className="w-full px-4 py-2 border border-primary-100 bg-primary-50/20 dark:bg-primary-900/10 rounded-lg dark:text-white" />
          ) : (
            <input type="text" name={nameId} value={formData[nameId] || ''} onChange={handleChange} className="w-full px-4 py-2 border border-primary-100 bg-primary-50/20 dark:bg-primary-900/10 rounded-lg dark:text-white" />
          )}
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="flex justify-center h-64 items-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white">
          <Info size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About Section</h1>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' 
        ? 'bg-green-50 text-green-600' 
        : 'bg-red-50 text-red-600'}`}>
        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Section Image</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Area */}
            <label className="block cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              {uploading ? <Loader2 className="animate-spin mx-auto" /> : <Upload className="mx-auto text-gray-400" />}
              <span className="block mt-2 text-sm text-gray-500">{uploading ? 'Uploading...' : 'Click to upload'}</span>
            </label>
            {/* Preview */}
            <div className="h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
              {formData.image_url ? <img src={formData.image_url} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400">No Image</div>}
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Content</h2>
          <DualInput label="Title" nameEn="title_en" nameId="title_id" />
          <DualInput label="Description" nameEn="description_en" nameId="description_id" isTextArea />
          <DualInput label="Mission" nameEn="mission_en" nameId="mission_id" isTextArea />
          <DualInput label="Vision" nameEn="vision_en" nameId="vision_id" isTextArea />

          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg">
            <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}