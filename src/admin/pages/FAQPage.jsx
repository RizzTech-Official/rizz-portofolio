import { useEffect, useState } from 'react';
import { faqAPI } from '../../api';
import { Plus, Edit, Trash2, X, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    is_active: true,
    order: 0,
  });

  const categoryOptions = ['General', 'Services', 'Pricing', 'Technical', 'Support'];

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const res = await faqAPI.getAll();
      setFaqs(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ question: '', answer: '', category: 'General', is_active: true, order: 0 });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) await faqAPI.update(editingItem.id, formData);
      else await faqAPI.create(formData);
      setShowModal(false); loadFaqs();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete FAQ?')) { await faqAPI.delete(id); loadFaqs(); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">FAQ Management</h1>
        <button onClick={() => openModal()} className="flex gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Plus size={20} /> Add FAQ
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
          <HelpCircle className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No FAQs yet. Add your first FAQ!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded text-xs font-medium">
                    {item.category || 'General'}
                  </span>
                  <h3 className="font-medium dark:text-white">{item.question}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); openModal(item); }} className="text-gray-500 hover:text-primary-600 p-1"><Edit size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="text-gray-500 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                  {expandedId === item.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
              </div>
              {expandedId === item.id && (
                <div className="px-4 pb-4 pt-0 border-t dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300 pl-[70px]">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6">
            <div className="flex justify-between mb-4 border-b pb-2 dark:border-gray-700">
              <h2 className="text-lg font-bold dark:text-white">{editingItem ? 'Edit' : 'Add'} FAQ</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600">
                  {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Question *</label>
                <input type="text" name="question" value={formData.question} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="What is your question?" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Answer *</label>
                <textarea rows={4} name="answer" value={formData.answer} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Provide a detailed answer..." required />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="rounded" />
                <label className="text-sm dark:text-white">Active (show on website)</label>
              </div>

              <button type="submit" className="w-full py-2 bg-primary-600 text-white rounded font-bold hover:bg-primary-700">Save FAQ</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
