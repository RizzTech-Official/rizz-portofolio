import { useEffect, useState } from 'react';
import { certificatesAPI, uploadAPI } from '../../api';
import { Plus, Edit, Trash2, X, Save, Award, Calendar, ExternalLink, Image, Upload } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';


export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date_issued: '',
    image_url: '',
  });

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const response = await certificatesAPI.getAll();
      setCertificates(response.data);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cert = null) => {
    if (cert) {
      setEditingCert(cert);
      setFormData({
        ...cert,
        date_issued: cert.date_issued ? cert.date_issued.split('T')[0] : '',
      });
    } else {
      setEditingCert(null);
      setFormData({ title: '', issuer: '', date_issued: '', image_url: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCert) {
        await certificatesAPI.update(editingCert.id, formData);
      } else {
        await certificatesAPI.create(formData);
      }
      setShowModal(false);
      loadCertificates();
    } catch (error) {
      console.error('Error saving certificate:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await certificatesAPI.delete(id);
      loadCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      setFormData({ ...formData, image_url: response.data.url });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-white">
            <Award size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certificates</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your certifications and awards</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25"
        >
          <Plus size={20} />
          Add Certificate
        </button>
      </div>

      {/* Cards Grid */}
      {certificates.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
          <Award className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No certificates yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Add your first certification to showcase your achievements</p>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
          >
            <Plus size={18} /> Add Certificate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300"
            >
              {/* Image Preview */}
              <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 relative overflow-hidden">
                {cert.image_url ? (
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Award className="w-16 h-16 text-amber-400 dark:text-amber-600" />
                  </div>
                )}
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => openModal(cert)}
                    className="p-2 bg-white rounded-lg text-primary-600 hover:bg-primary-50"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{cert.title}</h3>
                <div className="space-y-2 text-sm">
                  {cert.issuer && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Building size={14} className="text-gray-400" />
                      <span className="line-clamp-1">{cert.issuer}</span>
                    </div>
                  )}
                  {cert.date_issued && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{new Date(cert.date_issued).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingCert ? 'Edit Certificate' : 'Add Certificate'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Certificate Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="AWS Solutions Architect"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Issuer</label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Issued</label>
                  <input
                    type="date"
                    value={formData.date_issued}
                    onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="flex items-center gap-2"><Image size={16} /> Image URL (optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/certificate.jpg"
                />
                {formData.image_url && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                    <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25"
              >
                <Save size={20} />
                {editingCert ? 'Update Certificate' : 'Create Certificate'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
