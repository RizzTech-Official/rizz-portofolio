import { useEffect, useState } from 'react';
import { contactsAPI } from '../../api';
import { Mail, MailOpen, Phone, MapPin, Calendar, Search, Trash2, CheckCircle, AlertCircle, MessageSquare, X } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ContactDetailModal from '../../components/ContactDetailModal';


export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await contactsAPI.getAll();
      setContacts(response.data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await contactsAPI.markRead(id);
      loadContacts();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await contactsAPI.delete(id);
      loadContacts();
      setSelectedContact(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const openContact = (contact) => {
    setSelectedContact(contact);
    if (!contact.is_read) {
      handleMarkRead(contact.id);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {contacts.filter(c => !c.is_read).length} unread
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => openContact(contact)}
              className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!contact.is_read ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {contact.is_read ? (
                    <MailOpen size={20} className="text-gray-400 mt-1" />
                  ) : (
                    <Mail size={20} className="text-primary-600 mt-1" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${!contact.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {contact.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">{contact.email}</span>
                    </div>
                    {contact.subject && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{contact.subject}</p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 line-clamp-1">
                      {contact.message}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{new Date(contact.submitted_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {contacts.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No messages yet.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Message Details</h2>
              <button onClick={() => setSelectedContact(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">From</label>
                <p className="text-gray-900 dark:text-white font-medium">{selectedContact.name}</p>
                <p className="text-sm text-primary-600">{selectedContact.email}</p>
              </div>
              {selectedContact.subject && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Subject</label>
                  <p className="text-gray-900 dark:text-white">{selectedContact.subject}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Message</label>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Received</label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedContact.submitted_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t dark:border-gray-700">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg"
                >
                  <Mail size={18} /> Reply
                </a>
                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 font-semibold rounded-lg"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
