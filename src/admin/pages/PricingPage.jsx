import { useEffect, useState } from 'react';
import { pricingAPI } from '../../api';
import { Plus, Edit, Trash2, X, Star, DollarSign, Check, Sparkles, Zap, Crown } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const iconOptions = ['Zap', 'Sparkles', 'Crown'];

export default function PricingPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_monthly: '',
    price_yearly: '',
    features: [''],
    not_included: [''],
    is_popular: false,
    icon: 'Sparkles',
    is_active: true,
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const res = await pricingAPI.getAll();
      setPackages(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        ...item,
        features: item.features?.length ? item.features : [''],
        not_included: item.not_included?.length ? item.not_included : [''],
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '', description: '', price_monthly: '', price_yearly: '',
        features: [''], not_included: [''], is_popular: false, icon: 'Sparkles', is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFeatureChange = (index, value, type) => {
    const list = [...formData[type]];
    list[index] = value;
    setFormData({ ...formData, [type]: list });
  };

  const addFeature = (type) => {
    setFormData({ ...formData, [type]: [...formData[type], ''] });
  };

  const removeFeature = (index, type) => {
    const list = [...formData[type]];
    list.splice(index, 1);
    setFormData({ ...formData, [type]: list.length ? list : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      features: formData.features.filter(f => f.trim()),
      not_included: formData.not_included.filter(f => f.trim()),
    };
    try {
      if (editingItem) await pricingAPI.update(editingItem.id, data);
      else await pricingAPI.create(data);
      setShowModal(false); loadPackages();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete pricing package?')) { await pricingAPI.delete(id); loadPackages(); }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(price);
  };

  const getIcon = (iconName) => {
    const icons = { Zap, Sparkles, Crown };
    const Icon = icons[iconName] || Sparkles;
    return <Icon size={20} />;
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Pricing Packages</h1>
        <button onClick={() => openModal()} className="flex gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Plus size={20} /> Add Package
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
          <DollarSign className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No pricing packages yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border ${pkg.is_popular ? 'border-primary-500' : 'dark:border-gray-700'} relative`}>
              {pkg.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-primary-500 text-white text-xs rounded-full">Popular</span>
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                  {getIcon(pkg.icon)}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(pkg)} className="text-gray-500 hover:text-primary-600"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(pkg.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="text-lg font-bold dark:text-white mb-1">{pkg.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{pkg.description}</p>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                {formatPrice(pkg.price_monthly)}
              </div>
              <div className="space-y-2">
                {(pkg.features || []).slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Check size={14} className="text-green-500" /> {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4 border-b pb-2 dark:border-gray-700">
              <h2 className="text-lg font-bold dark:text-white">{editingItem ? 'Edit' : 'Add'} Package</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Icon</label>
                  <select name="icon" value={formData.icon} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Price Monthly (IDR) *</label>
                  <input type="number" name="price_monthly" value={formData.price_monthly} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Price Yearly (IDR)</label>
                  <input type="number" name="price_yearly" value={formData.price_yearly} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Features Included</label>
                {formData.features.map((f, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" value={f} onChange={(e) => handleFeatureChange(i, e.target.value, 'features')} className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Feature..." />
                    <button type="button" onClick={() => removeFeature(i, 'features')} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addFeature('features')} className="text-sm text-primary-600 hover:underline">+ Add Feature</button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Not Included</label>
                {formData.not_included.map((f, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" value={f} onChange={(e) => handleFeatureChange(i, e.target.value, 'not_included')} className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Not included..." />
                    <button type="button" onClick={() => removeFeature(i, 'not_included')} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addFeature('not_included')} className="text-sm text-primary-600 hover:underline">+ Add Item</button>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_popular" checked={formData.is_popular} onChange={handleChange} className="rounded" />
                  <span className="text-sm dark:text-white">Popular</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="rounded" />
                  <span className="text-sm dark:text-white">Active</span>
                </label>
              </div>

              <button type="submit" className="w-full py-2 bg-primary-600 text-white rounded font-bold hover:bg-primary-700">Save Package</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
