// src/components/VendorDetailModal.jsx
import React, { useState } from 'react';
import { FiX, FiMail, FiPhone, FiUser, FiCalendar } from 'react-icons/fi';
import { updateApplicationStatus } from '../services/firestoreService';

const VendorDetailModal = ({ application, onClose, onUpdate }) => {
  console.log("Modal application prop:", application);
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.notes || '');
  const [updating, setUpdating] = useState(false);

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      await updateApplicationStatus(application.id, status, notes);
      onUpdate(); // Refresh parent data
      onClose(); // Close modal
    } catch (error) {
      alert('Failed to update application');
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

  const getStatusBadge = (currentStatus) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      onboarding: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Onboarding' }
    };
    
    const config = statusConfig[currentStatus] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Application Details
            </h2>
            <p className="text-gray-600">Review and manage vendor application</p>
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
          {/* Current Status Display */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Current Status</p>
              {getStatusBadge(application.status)}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Application ID</p>
              <p className="text-sm text-gray-900 font-mono">{application.id?.slice(0, 8) || 'N/A'}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiUser className="w-6 h-6 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Full Name</p>
                  <p className="text-lg font-bold text-gray-900">{application.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiMail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Email Address</p>
                  <p className="text-lg font-bold text-gray-900 break-all">{application.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiPhone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Contact Number</p>
                  <p className="text-lg font-bold text-gray-900">{application.contactNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FiX className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Designation</p>
                  <p className="text-lg font-bold text-gray-900">{application.designation || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiX className="w-6 h-6 mr-2 text-indigo-600" />
              Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">Company Name</p>
                <p className="text-xl font-bold text-gray-900">{application.companyName || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">Product Category</p>
                <p className="text-xl font-bold text-gray-900">{application.category || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">Selected Plan</p>
                <p className="text-xl font-bold text-blue-600">{application.plan || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">GST Number</p>
                <p className="text-xl font-bold text-gray-900">{application.gstNo || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiCalendar className="w-6 h-6 mr-2 text-green-600" />
              Submission Details
            </h3>
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Submitted At</p>
                <p className="text-lg font-bold text-gray-900">{formatDate(application.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Update Application Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Application Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-semibold text-lg"
                >
                  <option value="pending">🟡 Pending Review</option>
                  <option value="approved">✅ Approved</option>
                  <option value="rejected">❌ Rejected</option>
                  <option value="onboarding">🔄 Onboarding</option>
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
                  placeholder="Add internal notes about this application..."
                  className="w-full px-4 py-3 border-2 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Last updated: {formatDate(application.updatedAt || application.createdAt)}
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
              {updating ? 'Updating...' : '💾 Update Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailModal;
