// src/components/AdminSettings.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiSettings,
  FiDollarSign, 
  FiBell, 
  FiShield,
  FiUsers,
  FiMail,
  FiSave,
  FiRefreshCw,
  FiToggleLeft,
  FiToggleRight
} from 'react-icons/fi';
import { getPlatformSettings, updatePlatformSettings } from '../services/firestoreService';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Settings state
  const [settings, setSettings] = useState({
    commissionRate: 15,
    defaultVendorPlan: 'free',
    autoApproveVendors: false,
    emailNotifications: {
      newApplications: true,
      newContacts: true,
      statusUpdates: true,
      weeklyReports: false
    },
    platformSettings: {
      siteName: 'SaaSBay',
      maintenanceMode: false,
      allowRegistrations: true,
      requireApproval: true
    }
  });

  const tabs = [
    { id: 'general', name: 'General', icon: FiSettings },
    { id: 'vendors', name: 'Vendors', icon: FiUsers },
    { id: 'notifications', name: 'Notifications', icon: FiBell },
    { id: 'security', name: 'Security', icon: FiShield }
  ];

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getPlatformSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePlatformSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (path, value) => {
    const keys = path.split('.');
    setSettings(prev => {
      const newSettings = { ...prev };
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <FiSettings className="w-8 h-8 mr-3 text-blue-600" />
          Platform Settings
        </h2>
        <p className="text-gray-600">
          Configure your SaaSBay marketplace settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Tab Navigation */}
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
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.platformSettings?.siteName || ''}
                      onChange={(e) => updateSetting('platformSettings.siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.commissionRate || 15}
                      onChange={(e) => updateSetting('commissionRate', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Controls</h3>
                <div className="space-y-4">
                  <ToggleSwitch
                    checked={settings.platformSettings?.maintenanceMode || false}
                    onChange={(value) => updateSetting('platformSettings.maintenanceMode', value)}
                    label="Maintenance Mode"
                    description="Put the platform in maintenance mode"
                  />
                  <ToggleSwitch
                    checked={settings.platformSettings?.allowRegistrations !== false}
                    onChange={(value) => updateSetting('platformSettings.allowRegistrations', value)}
                    label="Allow New Registrations"
                    description="Allow new vendors to register on the platform"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Vendor Settings */}
          {activeTab === 'vendors' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vendor Management</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Vendor Plan
                    </label>
                    <select
                      value={settings.defaultVendorPlan || 'free'}
                      onChange={(e) => updateSetting('defaultVendorPlan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="free">Free Plan</option>
                      <option value="basic">Basic Plan</option>
                      <option value="pro">Pro Plan</option>
                      <option value="enterprise">Enterprise Plan</option>
                    </select>
                  </div>

                  <ToggleSwitch
                    checked={settings.autoApproveVendors || false}
                    onChange={(value) => updateSetting('autoApproveVendors', value)}
                    label="Auto-approve Vendor Applications"
                    description="Automatically approve new vendor applications without manual review"
                  />
                  
                  <ToggleSwitch
                    checked={settings.platformSettings?.requireApproval !== false}
                    onChange={(value) => updateSetting('platformSettings.requireApproval', value)}
                    label="Require Manual Approval for Products"
                    description="Require admin approval for new product listings"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiDollarSign className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-800">Commission Settings</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Current commission rate: <strong>{settings.commissionRate}%</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <ToggleSwitch
                    checked={settings.emailNotifications?.newApplications !== false}
                    onChange={(value) => updateSetting('emailNotifications.newApplications', value)}
                    label="New Vendor Applications"
                    description="Get notified when new vendors submit applications"
                  />
                  <ToggleSwitch
                    checked={settings.emailNotifications?.newContacts !== false}
                    onChange={(value) => updateSetting('emailNotifications.newContacts', value)}
                    label="New Contact Messages"
                    description="Get notified when customers send contact messages"
                  />
                  <ToggleSwitch
                    checked={settings.emailNotifications?.statusUpdates !== false}
                    onChange={(value) => updateSetting('emailNotifications.statusUpdates', value)}
                    label="Status Updates"
                    description="Get notified when application or contact status changes"
                  />
                  <ToggleSwitch
                    checked={settings.emailNotifications?.weeklyReports || false}
                    onChange={(value) => updateSetting('emailNotifications.weeklyReports', value)}
                    label="Weekly Reports"
                    description="Receive weekly analytics and summary reports"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Preferences</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiShield className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">Security Status</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Your admin account is protected with industry-standard security measures.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                      <p className="text-xs text-gray-500 mt-1">60 minutes of inactivity</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Data Encryption</p>
                      <p className="text-xs text-gray-500 mt-1">AES-256 encryption enabled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={loadSettings}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Reset to Saved
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FiSave className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
