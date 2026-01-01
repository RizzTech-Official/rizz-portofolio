import { useEffect, useState } from 'react';
import { blogAPI, uploadAPI } from '../../api';
import { Plus, Edit, Trash2, X, BookOpen, Calendar, Eye, EyeOff, Upload, Clock } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const categoryOptions = ['Technology', 'Design', 'Development', 'Business', 'Tutorial', 'News'];

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: 'Technology',
    author: 'RizzTech',
    read_time: 5,
    is_published: false,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await blogAPI.getAdminAll();
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      // Try public endpoint if admin fails
      try {
        const res = await blogAPI.getAll();
        setPosts(res.data);
      } catch (e) { console.error(e); }
    } finally { setLoading(false); }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '', slug: '', excerpt: '', content: '', image_url: '',
        category: 'Technology', author: 'RizzTech', read_time: 5, is_published: false,
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
      setFormData({ ...formData, image_url: res.data.url });
    } catch (err) { console.error(err); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) await blogAPI.update(editingItem.id, formData);
      else await blogAPI.create(formData);
      setShowModal(false); loadPosts();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete blog post?')) { await blogAPI.delete(id); loadPosts(); }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Blog Posts</h1>
        <button onClick={() => openModal()} className="flex gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Plus size={20} /> Add Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
          <BookOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No blog posts yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700 flex gap-4">
              <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="text-gray-400" size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded">{post.category}</span>
                      {post.is_published ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs"><Eye size={12} /> Published</span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400 text-xs"><EyeOff size={12} /> Draft</span>
                      )}
                    </div>
                    <h3 className="font-bold dark:text-white">{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt || post.content?.substring(0, 100)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(post)} className="p-2 text-gray-500 hover:text-primary-600"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(post.published_at || post.created_at)}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{post.read_time} min</span>
                  <span>By {post.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4 border-b pb-2 dark:border-gray-700">
              <h2 className="text-lg font-bold dark:text-white">{editingItem ? 'Edit' : 'Add'} Blog Post</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Featured Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-40 h-24 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="text-gray-400" size={24} />
                    )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600">
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Slug (auto-generated)</label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="auto-generated-from-title" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Author</label>
                  <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Read Time (min)</label>
                  <input type="number" name="read_time" value={formData.read_time} onChange={handleChange} min="1" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Excerpt (Summary)</label>
                <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Brief summary of the article..." />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Content *</label>
                <textarea name="content" value={formData.content} onChange={handleChange} rows={10} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 font-mono text-sm" placeholder="Write your article content here... (Markdown supported)" required />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} className="rounded" />
                <label className="text-sm dark:text-white">Publish immediately</label>
              </div>

              <button type="submit" className="w-full py-2 bg-primary-600 text-white rounded font-bold hover:bg-primary-700">Save Post</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
