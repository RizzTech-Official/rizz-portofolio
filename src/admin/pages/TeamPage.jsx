import { useEffect, useState } from 'react';
import { teamAPI, uploadAPI } from '../../api';
import { Plus, Edit, Trash2, X, Users, Upload, Linkedin, Github, Mail } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    photo: '',
    bio: '',
    linkedin_url: '',
    github_url: '',
    email: '',
    is_active: true,
    order: 0,
  });

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const res = await teamAPI.getAll();
      setTeam(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '', position: '', photo: '', bio: '',
        linkedin_url: '', github_url: '', email: '',
        is_active: true, order: 0,
      });
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
      setFormData({ ...formData, photo: res.data.url });
    } catch (err) { console.error(err); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) await teamAPI.update(editingItem.id, formData);
      else await teamAPI.create(formData);
      setShowModal(false); loadTeam();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete team member?')) { await teamAPI.delete(id); loadTeam(); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Team Members</h1>
        <button onClick={() => openModal()} className="flex gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Plus size={20} /> Add Member
        </button>
      </div>

      {team.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
          <Users className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No team members yet. Add your first team member!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border dark:border-gray-700">
              <div className="h-48 bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center">
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-5xl font-bold">{item.name?.charAt(0)}</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold dark:text-white">{item.name}</h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400">{item.position}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openModal(item)} className="text-gray-500 hover:text-primary-600 p-1"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                  </div>
                </div>
                {item.bio && <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.bio}</p>}
                <div className="flex gap-2">
                  {item.linkedin_url && <Linkedin size={14} className="text-blue-600" />}
                  {item.github_url && <Github size={14} className="text-gray-700 dark:text-gray-300" />}
                  {item.email && <Mail size={14} className="text-primary-600" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4 border-b pb-2 dark:border-gray-700">
              <h2 className="text-lg font-bold dark:text-white">{editingItem ? 'Edit' : 'Add'} Team Member</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="text-gray-400" size={24} />
                  )}
                </div>
                <div>
                  <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 inline-block">
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Position *</label>
                  <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="CEO, Developer, etc." required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Bio</label>
                <textarea rows={3} name="bio" value={formData.bio} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Short bio..." />
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium dark:text-white">Social Links</h4>
                <div className="flex items-center gap-2">
                  <Linkedin size={18} className="text-blue-600" />
                  <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="flex items-center gap-2">
                  <Github size={18} className="text-gray-600 dark:text-gray-300" />
                  <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="https://github.com/..." />
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-primary-600" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="email@example.com" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="rounded" />
                <label className="text-sm dark:text-white">Active (show on website)</label>
              </div>

              <button type="submit" className="w-full py-2 bg-primary-600 text-white rounded font-bold hover:bg-primary-700">Save Member</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
