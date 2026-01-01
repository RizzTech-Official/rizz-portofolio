import { useEffect, useState } from 'react';
import { testimonialsAPI, uploadAPI } from '../../api';
import { Plus, Edit, Trash2, X, Star, Quote, Upload } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    client_name: '',
    client_photo: '',
    company: '',
    position: '',
    quote: '',
    rating: 5,
    is_active: true,
    order: 0,
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const res = await testimonialsAPI.getAll();
      setTestimonials(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        client_name: '', client_photo: '', company: '', position: '',
        quote: '', rating: 5, is_active: true, order: 0,
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
      setFormData({ ...formData, client_photo: res.data.url });
    } catch (err) { console.error(err); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) await testimonialsAPI.update(editingItem.id, formData);
      else await testimonialsAPI.create(formData);
      setShowModal(false); loadTestimonials();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete testimonial?')) { await testimonialsAPI.delete(id); loadTestimonials(); }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Testimonials</h1>
        <button onClick={() => openModal()} className="flex gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
          <Quote className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No testimonials yet. Add your first testimonial!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center">
                    {item.client_photo ? (
                      <img src={item.client_photo} alt={item.client_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-xl">{item.client_name?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold dark:text-white">{item.client_name}</h3>
                    <p className="text-sm text-gray-500">{item.position}{item.company && ` at ${item.company}`}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(item)} className="text-gray-500 hover:text-primary-600"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                </div>
              </div>
              <div className="flex gap-1 mb-3">{renderStars(item.rating)}</div>
              <p className="text-gray-600 dark:text-gray-300 italic line-clamp-3">"{item.quote}"</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4 border-b pb-2 dark:border-gray-700">
              <h2 className="text-lg font-bold dark:text-white">{editingItem ? 'Edit' : 'Add'} Testimonial</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {formData.client_photo ? (
                    <img src={formData.client_photo} alt="Preview" className="w-full h-full object-cover" />
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

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Client Name *</label>
                <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Position</label>
                  <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="CEO" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Company</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Tech Corp" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Quote *</label>
                <textarea rows={4} name="quote" value={formData.quote} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="What the client said about your services..." required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: num })}
                      className={`p-2 rounded ${formData.rating >= num ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star size={24} className={formData.rating >= num ? 'fill-yellow-400' : ''} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="rounded" />
                <label className="text-sm dark:text-white">Active (show on website)</label>
              </div>

              <button type="submit" className="w-full py-2 bg-primary-600 text-white rounded font-bold hover:bg-primary-700">Save Testimonial</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
