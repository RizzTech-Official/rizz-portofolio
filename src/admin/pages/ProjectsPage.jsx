import { useEffect, useState } from 'react';
import { projectsAPI, uploadAPI } from '../../api';
import { Plus, Edit, Trash2, X, Save, ExternalLink, Briefcase, Image, Star, Upload, Loader2 } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title_en: '', title_id: '',
    description_en: '', description_id: '',
    image_url: '', tech_stack: '', link: '', is_featured: false,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({ title_en: '', title_id: '', description_en: '', description_id: '', image_url: '', tech_stack: '', link: '', is_featured: false });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) await projectsAPI.update(editingProject.id, formData);
      else await projectsAPI.create(formData);
      setShowModal(false); loadProjects();
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete project?')) { await projectsAPI.delete(id); loadProjects(); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: response.data.url }));
    } catch (error) { console.error(error); } finally { setUploading(false); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-bold dark:text-white">Projects</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl"><Plus size={20} /> Add Project</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="h-48 bg-gray-100 relative">
              {project.image_url ? <img src={project.image_url} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-gray-400"><Image /></div>}
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => openModal(project)} className="p-2 bg-white rounded-lg text-primary-600 shadow-sm"><Edit size={16} /></button>
                <button onClick={() => handleDelete(project.id)} className="p-2 bg-white rounded-lg text-red-600 shadow-sm"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="p-5">
              <div className="mb-2">
                <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{project.title_en}</h3>
                <p className="text-xs text-primary-500 italic">{project.title_id}</p>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{project.description_en}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between mb-6 border-b pb-2 dark:border-gray-700">
              <h2 className="text-xl font-bold dark:text-white">{editingProject ? 'Edit' : 'Add'} Project</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500">Title (EN)</label>
                  <input type="text" name="title_en" value={formData.title_en} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-primary-600">Judul (ID)</label>
                  <input type="text" name="title_id" value={formData.title_id} onChange={handleChange} className="w-full px-4 py-2 border border-primary-200 bg-primary-50/20 dark:bg-primary-900/10 rounded-lg dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500">Desc (EN)</label>
                  <textarea rows={3} name="description_en" value={formData.description_en} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-primary-600">Deskripsi (ID)</label>
                  <textarea rows={3} name="description_id" value={formData.description_id} onChange={handleChange} className="w-full px-4 py-2 border border-primary-200 bg-primary-50/20 dark:bg-primary-900/10 rounded-lg dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Image</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                    <div className="w-full px-4 py-2 border rounded-lg flex items-center gap-2 text-gray-500">
                      {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </div>
                  </div>
                  <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} className="flex-[2] px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" placeholder="https://..." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Tech Stack</label>
                  <input type="text" name="tech_stack" value={formData.tech_stack} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" placeholder="React, Laravel" /></div>
                <div>
                  <label className="text-sm">Link</label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" /></div>
              </div>

              <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange} className="w-5 h-5" />
                <label className="text-sm text-gray-700">Featured Project</label>
              </div>

              <button type="submit" className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold">Save Project</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}