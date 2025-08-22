// src/components/AdminAnalytics.jsx
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiUsers, 
  FiMail, 
  FiRefreshCw,
  FiDownload,
  FiCalendar,
  FiActivity
} from 'react-icons/fi';
import { getAnalyticsData, getAnalyticsSummary } from '../services/firestoreService';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({
    summary: {},
    chartData: {
      dailyApplications: [],
      applicationsByStatus: [],
      contactsByIntent: [],
      monthlyTrends: [],
      vendorsByPlan: []
    }
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiBarChart2 },
    { id: 'applications', name: 'Applications', icon: FiUsers },
    { id: 'contacts', name: 'Contacts', icon: FiMail },
    { id: 'trends', name: 'Trends', icon: FiTrendingUp }
  ];

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '365d', label: 'Last year' }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [rawData, summary] = await Promise.all([
        getAnalyticsData(timeRange),
        getAnalyticsSummary()
      ]);

      // Process raw data into chart formats
      const processedData = processAnalyticsData(rawData);
      
      setData({
        summary,
        chartData: processedData
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (rawData) => {
    const { applications, contacts } = rawData;

    // Daily applications over time
    const dailyApplications = processTimeSeriesData(applications, 'createdAt');
    
    // Applications by status
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    
    const applicationsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count
    }));

    // Contacts by intent
    const intentCounts = contacts.reduce((acc, contact) => {
      acc[contact.intent || 'other'] = (acc[contact.intent || 'other'] || 0) + 1;
      return acc;
    }, {});

    const contactsByIntent = Object.entries(intentCounts).map(([intent, count]) => ({
      intent: intent.charAt(0).toUpperCase() + intent.slice(1),
      count
    }));

    // Monthly trends (combine applications and contacts)
    const monthlyTrends = processMonthlyTrends(applications, contacts);

    // Mock vendor plans data (you can replace with real data)
    const vendorsByPlan = [
      { plan: 'Free', count: 45 },
      { plan: 'Basic', count: 23 },
      { plan: 'Pro', count: 12 },
      { plan: 'Enterprise', count: 5 }
    ];

    return {
      dailyApplications,
      applicationsByStatus,
      contactsByIntent,
      monthlyTrends,
      vendorsByPlan
    };
  };

  const processTimeSeriesData = (data, dateField) => {
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item[dateField]).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const processMonthlyTrends = (applications, contacts) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      
      const monthApplications = applications.filter(app => 
        new Date(app.createdAt).getMonth() === monthIndex
      ).length;
      
      const monthContacts = contacts.filter(contact => 
        new Date(contact.createdAt).getMonth() === monthIndex
      ).length;

      last6Months.push({
        month: monthName,
        applications: monthApplications,
        contacts: monthContacts
      });
    }

    return last6Months;
  };

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center mt-2 ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <FiTrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <FiActivity className="w-8 h-8 mr-3 text-blue-600" />
              Analytics Dashboard
            </h2>
            <p className="text-gray-600">
              Monitor your marketplace performance and key metrics
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            
            <button
              onClick={loadAnalyticsData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Applications"
          value={data.summary.totalApplications || 0}
          icon={FiUsers}
          color="blue"
        />
        <StatCard
          title="Total Contacts"
          value={data.summary.totalContacts || 0}
          icon={FiMail}
          color="green"
        />
        <StatCard
          title="Pending Review"
          value={data.summary.pendingApplications || 0}
          icon={FiCalendar}
          color="yellow"
        />
        <StatCard
          title="Conversion Rate"
          value={`${data.summary.conversionRate || 0}%`}
          icon={FiTrendingUp}
          color="purple"
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.chartData.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="applications" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                    <Area type="monotone" dataKey="contacts" stackId="1" stroke="#10B981" fill="#10B981" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Vendor Plans Distribution */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Vendor Plans Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.chartData.vendorsByPlan}
                      dataKey="count"
                      nameKey="plan"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {data.chartData.vendorsByPlan.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Applications by Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Applications by Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.chartData.applicationsByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Applications */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Daily Applications</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.chartData.dailyApplications}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contacts by Intent */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Contacts by Intent</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.chartData.contactsByIntent}
                      dataKey="count"
                      nameKey="intent"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {data.chartData.contactsByIntent.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Contact Response Time */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Contact Response Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded">
                    <span className="text-sm font-medium">Average Response Time</span>
                    <span className="text-lg font-bold text-blue-600">2.5 hours</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded">
                    <span className="text-sm font-medium">Response Rate</span>
                    <span className="text-lg font-bold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded">
                    <span className="text-sm font-medium">Unread Messages</span>
                    <span className="text-lg font-bold text-red-600">{data.summary.pendingApplications || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Growth Trends</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={data.chartData.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="applications" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.7} />
                    <Area type="monotone" dataKey="contacts" stroke="#10B981" fill="#10B981" fillOpacity={0.7} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <FiTrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">+{Math.round(Math.random() * 30 + 10)}%</p>
                  <p className="text-sm text-blue-600">Application Growth</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <FiUsers className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">+{Math.round(Math.random() * 25 + 15)}%</p>
                  <p className="text-sm text-green-600">Contact Growth</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <FiActivity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-900">{data.summary.conversionRate || 0}%</p>
                  <p className="text-sm text-purple-600">Conversion Rate</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
