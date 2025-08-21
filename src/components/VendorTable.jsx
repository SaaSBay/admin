// src/components/VendorTable.jsx
import React, { useState } from 'react';
import { FiEye, FiEdit, FiTrash2, FiMoreHorizontal } from 'react-icons/fi';
import { updateApplicationStatus, deleteApplication } from '../services/firestoreService';

const VendorTable = ({ applications, onViewDetails, onRefresh }) => {
  const [processingId, setProcessingId] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      onboarding: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Onboarding' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setProcessingId(applicationId);
      await updateApplicationStatus(applicationId, newStatus);
      onRefresh(); // Refresh the table
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (applicationId, companyName) => {
    if (window.confirm(`Are you sure you want to delete the application from ${companyName}?`)) {
      try {
        setProcessingId(applicationId);
        await deleteApplication(applicationId);
        onRefresh(); // Refresh the table
      } catch (error) {
        alert('Failed to delete application');
      } finally {
        setProcessingId(null);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500 text-lg">No applications found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {application.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {application.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{application.companyName}</div>
                  <div className="text-sm text-gray-500">{application.designation}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {application.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {application.plan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(application.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(application.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {/* View Details */}
                    <button
                      onClick={() => onViewDetails(application)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>

                    {/* Quick Status Updates */}
                    {application.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'approved')}
                          disabled={processingId === application.id}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Approve"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'rejected')}
                          disabled={processingId === application.id}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Reject"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(application.id, application.companyName)}
                      disabled={processingId === application.id}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorTable;
