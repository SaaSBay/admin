// src/components/ContactDetailModal.jsx
import React, { useState } from 'react';
import { FiX, FiMail, FiUser, FiCalendar, FiMessageSquare, FiTag } from 'react-icons/fi';
import { updateContactStatus } from '../services/firestoreService';

const ContactDetailModal = ({ contact, onClose, onUpdate }) => {
  const [status, setStatus] = useState(contact.status);
  const [notes, setNotes] = useState(contact.notes || '');
  const [updating, setUpdating] = useState(false);

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      await updateContactStatus(contact.id, status, notes);
      onUpdate();
      onClose();
    } catch (error) {
      alert('Failed to update contact');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIntentColor = (intent) => {
    const colors = {
      customer: 'bg-purple-100 text-purple-800',
      vendor: 'bg-orange-100 text-orange-800',
      partner: 'bg-teal-100 text-teal-800',
      support: 'bg-yellow-100 text-yellow-800'
    };
    return colors[intent] || colors.customer;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Contact Details</h2>
            <p className="text-gray-600">Manage contact inquiry and response</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-white p-2 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiUser className="w-6 h-6 mr-2 text-blue-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Name</p>
                  <p className="text-lg font-bold text-gray-900">{contact.name || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiMail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Email Address</p>
                  <p className="text-lg font-bold text-gray-900 break-all">{contact.email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiTag className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Intent</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getIntentColor(contact.intent)}`}>
                    {contact.intent || 'Not specified'}
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Received At</p>
                  <p className="text-lg font-bold text-gray-900">{formatDate(contact.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FiMessageSquare className="w-6 h-6 mr-2 text-indigo-600" />
              Message
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-400">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {contact.message || 'No message provided'}
              </p>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Update Contact Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Contact Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-semibold text-lg"
                >
                  <option value="new">🔵 New</option>
                  <option value="responded">✅ Responded</option>
                  <option value="closed">⚫ Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Internal Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add internal notes about this contact..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Last updated: {formatDate(contact.updatedAt || contact.createdAt)}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              disabled={updating}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold shadow-lg"
            >
              {updating ? 'Updating...' : '💾 Update Contact'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailModal;
