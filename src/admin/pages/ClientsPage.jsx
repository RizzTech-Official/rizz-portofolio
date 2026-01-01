import { useEffect, useState } from 'react';
import { clientsAPI, uploadAPI } from '../../api';
import { Plus, Edit, Trash2, X, Building2, Upload, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    is_active: true,
    order: 0,
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const res = await clientsAPI.getAll();
      setClients(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', logo_url: '', website_url: '', is_active: true, order: 0 });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.uploadImage(file);
      setFormData({ ...formData, logo_url: res.data.url });
    } catch (err) { console.error(err); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) await clientsAPI.update(editingItem.id, formData);
      else await clientsAPI.create(formData);
      setShowModal(false); loadClients();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete client?')) { await clientsAPI.delete(id); loadClients(); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Clients / Partners</h1>
        <button onClick={() => openModal()} className="flex gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Plus size={20} /> Add Client
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
          <Building2 className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No clients yet. Add your first client logo!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {clients.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700 group relative">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                <button onClick={() => openModal(item)} className="p-1 bg-white dark:bg-gray-700 rounded text-gray-500 hover:text-primary-600 shadow"><Edit size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1 bg-white dark:bg-gray-700 rounded text-gray-500 hover:text-red-600 shadow"><Trash2 size={14} /></button>
              </div>
              <div className="h-20 flex items-center justify-center mb-2">
                {item.logo_url ? (
                  <img src={item.logo_url} alt={item.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs text-center px-2">{item.name}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-center text-gray-600 dark:text-gray-400 truncate">{item.name}</p>
              {item.website_url && (
                <a href={item.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 text-xs text-primary-500 mt-1 hover:underline">
                  <ExternalLink size={10} /> Visit
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4 border-b pb-2 dark:border-gray-700">
              <h2 className="text-lg font-bold dark:text-white">{editingItem ? 'Edit' : 'Add'} Client</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {formData.logo_url ? (
                      <img src={formData.logo_url} alt="Preview" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Upload className="text-gray-400" size={20} />
                    )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600">
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Company Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Website URL</label>
                <input type="url" name="website_url" value={formData.website_url} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="https://example.com" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="rounded" />
                <label className="text-sm dark:text-white">Active (show on website)</label>
              </div>

              <button type="submit" className="w-full py-2 bg-primary-600 text-white rounded font-bold hover:bg-primary-700">Save Client</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
