// src/components/ContactTable.jsx
import React, { useState } from 'react';
import { FiEye, FiMail, FiTrash2, FiCheck, FiClock, FiX } from 'react-icons/fi';
import { updateContactStatus, deleteContact } from '../services/firestoreService';

const ContactTable = ({ contacts, onViewDetails, onRefresh }) => {
  const [processingId, setProcessingId] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'New', icon: FiClock },
      responded: { bg: 'bg-green-100', text: 'text-green-800', label: 'Responded', icon: FiCheck },
      closed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed', icon: FiX }
    };
    
    const config = statusConfig[status] || statusConfig.new;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getIntentBadge = (intent) => {
    const intentConfig = {
      customer: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Customer' },
      vendor: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Vendor' },
      partner: { bg: 'bg-teal-100', text: 'text-teal-800', label: 'Partner' },
      support: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Support' }
    };
    
    const config = intentConfig[intent] || intentConfig.customer;
    
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      setProcessingId(contactId);
      await updateContactStatus(contactId, newStatus);
      onRefresh();
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (contactId, name) => {
    if (window.confirm(`Are you sure you want to delete the contact from ${name}?`)) {
      try {
        setProcessingId(contactId);
        await deleteContact(contactId);
        onRefresh();
      } catch (error) {
        alert('Failed to delete contact');
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <FiMail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No contacts found</p>
        <p className="text-gray-400 text-sm mt-2">Contact messages will appear here when received</p>
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
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Intent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Received
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {contact.name || 'Anonymous'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {contact.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getIntentBadge(contact.intent)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {contact.message ? 
                      (contact.message.length > 50 ? 
                        contact.message.substring(0, 50) + '...' : 
                        contact.message
                      ) : 'No message'
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(contact.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(contact.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {/* View Details */}
                    <button
                      onClick={() => onViewDetails(contact)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>

                    {/* Quick Status Updates */}
                    {contact.status === 'new' && (
                      <button
                        onClick={() => handleStatusUpdate(contact.id, 'responded')}
                        disabled={processingId === contact.id}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Mark as Responded"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(contact.id, contact.name || contact.email)}
                      disabled={processingId === contact.id}
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

export default ContactTable;
