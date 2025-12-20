import { useEffect, useState } from 'react';
import { servicesAPI } from '../../api';
import { Plus, Edit, Trash2, X, Save, Globe, Smartphone, Palette, Server, Code, Shield, Database, Cloud, Cpu, Wifi } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const iconMap = {
  Globe, Smartphone, Palette, Server, Code, Shield, Database, Cloud, Cpu, Wifi
};
const iconOptions = Object.keys(iconMap);
const getIcon = (iconName) => {
  const Icon = iconMap[iconName] || Code;
  return <Icon size={24} />;
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    icon_name: 'Code',
    title_en: '', title_id: '',
    description_en: '', description_id: '',
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await servicesAPI.getAll();
      setServices(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    }
    else {
      setEditingService(null);
      setFormData({ icon_name: 'Code', title_en: '', title_id: '', description_en: '', description_id: '' });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) await servicesAPI.update(editingService.id, formData);
      else await servicesAPI.create(formData);
      setShowModal(false); loadServices();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete service?')) { await servicesAPI.delete(id); loadServices(); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Services</h1>
        <button
          onClick={() => openModal()}
          className="flex gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg">
          <Plus size={20} />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">{getIcon(service.icon_name)}</div>
              <div className="flex gap-2">
                <button onClick={() => openModal(service)} className="text-gray-500 hover:text-primary-600"><Edit size={18} /></button>
                <button onClick={() => handleDelete(service.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
              </div>
            </div>
            <h3 className="font-bold dark:text-white">{service.title_en}</h3>
            <p className="text-xs text-primary-500 italic mb-2">{service.title_id}</p>
            <p className="text-sm text-gray-500 line-clamp-2">{service.description_en}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4 border-b pb-2 dark:border-gray-700">
              <h2 className="text-lg font-bold dark:text-white">{editingService ? 'Edit' : 'Add'} Service</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Icon</label>
                <select name="icon_name" value={formData.icon_name} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
                  {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500">Title (EN)</label>
                  <input
                    type="text"
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    equired />
                </div>
                <div>
                  <label className="text-xs font-bold text-primary-600">Judul (ID)</label>
                  <input
                    type="text"
                    name="title_id"
                    value={formData.title_id}
                    onChange={handleChange}
                    className="w-full p-2 border border-primary-200 bg-primary-50/20 dark:bg-primary-900/10 rounded dark:text-white" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500">Description (EN)</label>
                <textarea rows={3} name="description_en" value={formData.description_en} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-primary-600">Deskripsi (ID)</label>
                <textarea rows={3} name="description_id" value={formData.description_id} onChange={handleChange} className="w-full p-2 border border-primary-200 bg-primary-50/20 dark:bg-primary-900/10 rounded dark:text-white" />
              </div>

              <button type="submit" className="w-full py-2 bg-primary-600 text-white rounded font-bold">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}