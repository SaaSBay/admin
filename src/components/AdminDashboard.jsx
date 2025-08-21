// src/components/AdminDashboard.jsx (updated version)
import React, { useState, useEffect } from 'react';
import { getVendorApplications } from '../services/firestoreService';
import VendorTable from './VendorTable';
import SummaryWidgets from './SummaryWidgets';
import VendorDetailModal from './VendorDetailModal';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load applications on component mount
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await getVendorApplications();
      console.log("Fetched applications:", data); // <-- Add this line
      setApplications(data);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle application selection for detail view
  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Welcome back! 👋
        </h2>
        <p className="text-gray-600">
          Here's what's happening with your vendor applications today.
        </p>
      </div>

      {/* Summary Widgets */}
      <SummaryWidgets applications={applications} />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, company, or email..."
              className="w-full px-4 py-2 border text-black bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="md:w-48">
            <select
              className="w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="onboarding">Onboarding</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadApplications}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <VendorTable 
        applications={filteredApplications}
        onViewDetails={handleViewDetails}
        onRefresh={loadApplications}
      />

      {/* Detail Modal */}
      {showModal && selectedApplication && (
        <VendorDetailModal
          application={selectedApplication}
          onClose={() => {
            setShowModal(false);
            setSelectedApplication(null);
          }}
          onUpdate={loadApplications}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
