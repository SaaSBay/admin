// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiMail, 
  FiDollarSign, 
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiArrowUp,
  FiArrowDown,
  FiEye,
  FiAlertCircle
} from 'react-icons/fi';
import { getVendorApplications, getContacts, getAnalyticsSummary } from '../services/firestoreService';
import { useNavigate } from "react-router-dom"; // Add this import

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalApplications: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      totalContacts: 0,
      newContacts: 0,
      monthlyRevenue: 0,
      activeVendors: 0
    },
    recentApplications: [],
    recentContacts: [],
    alerts: []
  });

  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [applications, contacts] = await Promise.all([
        getVendorApplications(),
        getContacts()
      ]);

      // Calculate statistics
      const stats = {
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        approvedApplications: applications.filter(app => app.status === 'approved').length,
        rejectedApplications: applications.filter(app => app.status === 'rejected').length,
        totalContacts: contacts.length,
        newContacts: contacts.filter(contact => contact.status === 'new').length,
        monthlyRevenue: 24500, // Mock data - replace with real revenue calculation
        activeVendors: applications.filter(app => app.status === 'approved').length
      };

      // Get recent applications (last 5)
      const recentApplications = applications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Get recent contacts (last 5)
      const recentContacts = contacts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Generate alerts
      const alerts = generateAlerts(stats, recentApplications, recentContacts);

      setDashboardData({
        stats,
        recentApplications,
        recentContacts,
        alerts
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAlerts = (stats, applications, contacts) => {
    const alerts = [];

    if (stats.pendingApplications > 5) {
      alerts.push({
        type: 'warning',
        message: `${stats.pendingApplications} vendor applications need review`,
        action: 'Review Applications',
        actionType: 'applications'
      });
    }

    if (stats.newContacts > 3) {
      alerts.push({
        type: 'info',
        message: `${stats.newContacts} new contact messages`,
        action: 'View Contacts',
        actionType: 'contacts'
      });
    }

    const todayApplications = applications.filter(app => {
      const today = new Date();
      const appDate = new Date(app.createdAt);
      return appDate.toDateString() === today.toDateString();
    }).length;

    if (todayApplications > 0) {
      alerts.push({
        type: 'success',
        message: `${todayApplications} new applications received today`,
        action: 'View Details',
        actionType: 'applications'
      });
    }

    return alerts.slice(0, 3); // Show only top 3 alerts
  };

  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center mt-2 ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' ? <FiArrowUp className="w-4 h-4 mr-1" /> : 
               trend === 'down' ? <FiArrowDown className="w-4 h-4 mr-1" /> : null}
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const now = new Date();
    const itemDate = new Date(date);
    const diffMs = now - itemDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return itemDate.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      new: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'New' },
      responded: { bg: 'bg-green-100', text: 'text-green-800', label: 'Responded' }
    };
    
    const config = configs[status] || configs.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your SaaSBay marketplace today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Applications"
          value={dashboardData.stats.totalApplications}
          change="+12% from last month"
          trend="up"
          icon={FiUsers}
          color="bg-blue-500"
        />
        <StatCard
          title="Pending Review"
          value={dashboardData.stats.pendingApplications}
          change="Need attention"
          icon={FiClock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Active Vendors"
          value={dashboardData.stats.activeVendors}
          change="+8% this month"
          trend="up"
          icon={FiCheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="New Messages"
          value={dashboardData.stats.newContacts}
          change="Last 24 hours"
          icon={FiMail}
          color="bg-purple-500"
        />
      </div>

      {/* Alerts & Quick Actions */}
      {dashboardData.alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2 text-orange-500" />
            Alerts & Actions Required
          </h3>
          <div className="space-y-3">
            {dashboardData.alerts.map((alert, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                alert.type === 'success' ? 'bg-green-50 border border-green-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <p className={`text-sm font-medium ${
                  alert.type === 'warning' ? 'text-yellow-800' :
                  alert.type === 'success' ? 'text-green-800' :
                  'text-blue-800'
                }`}>
                  {alert.message}
                </p>
                <button className={`text-xs px-3 py-1 rounded-full font-medium ${
                  alert.type === 'warning' ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300' :
                  alert.type === 'success' ? 'bg-green-200 text-green-800 hover:bg-green-300' :
                  'bg-blue-200 text-blue-800 hover:bg-blue-300'
                } transition-colors`}>
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            <button
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => navigate('/admin/applications')}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData.recentApplications.map((app, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{app.companyName}</p>
                  <p className="text-sm text-gray-500">{app.name} • {formatDate(app.createdAt)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(app.status)}
                  <button className="text-gray-400 hover:text-gray-600">
                    <FiEye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {dashboardData.recentApplications.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent applications</p>
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            <button
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => navigate('/admin/contacts')}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData.recentContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{contact.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {contact.message?.substring(0, 50)}... • {formatDate(contact.createdAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(contact.status)}
                  <button className="text-gray-400 hover:text-gray-600">
                    <FiEye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {dashboardData.recentContacts.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent messages</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiActivity className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalApplications}</p>
            <p className="text-sm text-gray-600">Total Applications</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.approvedApplications}</p>
            <p className="text-sm text-gray-600">Approved Vendors</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiMail className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalContacts}</p>
            <p className="text-sm text-gray-600">Total Messages</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiDollarSign className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">$24.5K</p>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
