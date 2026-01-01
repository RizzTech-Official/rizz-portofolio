import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Calendar, MessageSquare, User, Building2, Reply, Trash2 } from 'lucide-react';

const ContactDetailModal = ({ contact, isOpen, onClose, onMarkRead, onDelete }) => {
  if (!contact) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-4 md:inset-y-10 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50 overflow-hidden"
          >
            <div className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-primary-500 to-purple-600 p-6 flex-shrink-0">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Avatar and Name */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {contact.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{contact.name || 'Unknown'}</h2>
                    <div className="flex flex-wrap gap-3 text-white/80 text-sm">
                      {contact.email && (
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {contact.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                {!contact.is_read && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                    Unread
                  </span>
                )}
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-2 gap-4 p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <Phone size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.phone}</p>
                    </div>
                  </div>
                )}
                {contact.company && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <Building2 size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Company</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.company}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 col-span-2">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <Calendar size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(contact.submitted_at || contact.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {contact.subject && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Subject</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{contact.subject}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <MessageSquare size={14} />
                    Message
                  </h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {contact.message || 'No message content.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex-shrink-0 p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex flex-wrap gap-3 justify-between items-center">
                  <div className="flex gap-3">
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your inquiry'}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                      >
                        <Reply size={18} />
                        Reply via Email
                      </a>
                    )}
                    {!contact.is_read && onMarkRead && (
                      <button
                        onClick={() => onMarkRead(contact.id)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {onDelete && (
                      <button
                        onClick={() => onDelete(contact.id)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactDetailModal;
