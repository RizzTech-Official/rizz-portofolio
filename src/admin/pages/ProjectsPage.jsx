import { useEffect, useState } from 'react';
import { projectsAPI, uploadAPI, getImageUrl } from '../../api';
import { Plus, Edit, Trash2, X, Save, ExternalLink, Github, Image, Star, Upload, Loader2, Tag, Link2, Code } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const categoryOptions = ['Web App', 'Mobile', 'AI/ML', 'Desktop', 'API', 'Other'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    tech_stack: '',
    category: 'Web App',
    features: '',
    github_url: '',
    live_url: '',
    client: '',
    is_featured: false,
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
      setFormData({
        title: project.title || project.title_en || '',
        description: project.description || project.description_en || '',
        image_url: project.image_url || '',
        tech_stack: project.tech_stack || '',
        category: project.category || 'Web App',
        features: project.features || '',
        github_url: project.github_url || '',
        live_url: project.live_url || project.link || '',
        client: project.client || '',
        is_featured: project.is_featured || false,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        tech_stack: '',
        category: 'Web App',
        features: '',
        github_url: '',
        live_url: '',
        client: '',
        is_featured: false,
      });
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
      setShowModal(false);
      loadProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this project?')) {
      await projectsAPI.delete(id);
      loadProjects();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: response.data.url }));
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700">
          <Image className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">No projects yet</h3>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add your first project to get started</p>
          <button
            onClick={() => openModal()}
            className="mt-4 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg font-medium"
          >
            Add Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="group bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-all">
              {/* Image */}
              <div className="h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                {project.image_url ? (
                  <img src={getImageUrl(project.image_url)} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400"><Image size={48} /></div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                  <span className="px-2 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded">{project.category || 'Project'}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(project)} className="p-2 bg-white rounded-lg text-primary-600 shadow-lg hover:bg-primary-50 transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(project.id)} className="p-2 bg-white rounded-lg text-red-600 shadow-lg hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>

                {/* Featured Badge */}
                {project.is_featured && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded flex items-center gap-1">
                    <Star size={12} /> Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 mb-2">{project.title || project.title_en}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{project.description || project.description_en}</p>

                {/* Tech Stack */}
                {project.tech_stack && (
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack.split(',').slice(0, 3).map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">{tech.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex justify-between items-center p-6 border-b dark:border-gray-700 z-10">
              <div>
                <h2 className="text-xl font-bold dark:text-white">{editingProject ? 'Edit' : 'Add'} Project</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Fill in the project details</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><X /></button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="E-Commerce Platform"
                  required
                />
              </div>

              {/* Category & Client */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">Client (Optional)</label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Company Name"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Description</label>
                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Brief description of the project..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Project Image</label>
                <div className="flex gap-3">
                  <div className="relative">
                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} />
                    <div className="px-4 py-3 border-2 border-dashed rounded-xl flex items-center gap-2 text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors">
                      {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                      {uploading ? 'Uploading...' : 'Upload'}
                    </div>
                  </div>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Or paste image URL..."
                  />
                </div>
                {formData.image_url && (
                  <img src={getImageUrl(formData.image_url)} alt="Preview" className="mt-3 w-full h-32 object-cover rounded-lg" />
                )}
              </div>

              {/* Tech Stack & Features */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    <Code size={14} className="inline mr-1" /> Tech Stack
                  </label>
                  <input
                    type="text"
                    name="tech_stack"
                    value={formData.tech_stack}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    <Tag size={14} className="inline mr-1" /> Features
                  </label>
                  <input
                    type="text"
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Auth, Dashboard, API"
                  />
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    <Github size={14} className="inline mr-1" /> GitHub URL
                  </label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    <Link2 size={14} className="inline mr-1" /> Live URL
                  </label>
                  <input
                    type="url"
                    name="live_url"
                    value={formData.live_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <label className="text-sm font-medium text-amber-800 dark:text-amber-200 flex items-center gap-1">
                    <Star size={14} /> Featured Project
                  </label>
                  <p className="text-xs text-amber-600 dark:text-amber-400">Featured projects appear prominently on the homepage</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
              >
                {editingProject ? 'Update' : 'Create'} Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}