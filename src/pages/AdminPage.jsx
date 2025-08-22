// src/pages/AdminPage.jsx
import React, { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiTrendingUp,
  FiMail,
  FiBarChart2
} from "react-icons/fi";
import AdminDashboard from "../components/AdminDashboard";
import AdminApplications from "../components/AdminApplications";
import AdminContacts from '../components/AdminContacts';
import AdminSettings from "../components/AdminSettings";
import AdminAnalytics from "../components/AdminAnalytics";
import { useAuth } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from '../assets/Saaslogo.png';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    console.log("User logged out");
    navigate("/");
  };

const navigation = [
  { 
    id: 'dashboard', 
    name: 'Dashboard', 
    icon: FiHome, 
    component: AdminDashboard 
  },
  { 
    id: 'applications', 
    name: 'Applications', 
    icon: FiUsers, 
    component: AdminApplications
  },
  { 
    id: 'contacts', 
    name: 'Contacts', 
    icon: FiMail, 
    component: AdminContacts // Add this line
  },
  { 
    id: 'analytics', 
    name: 'Analytics', 
    icon: FiBarChart2, 
    component: AdminAnalytics
  },
  { 
    id: 'settings', 
    name: 'Settings', 
    icon: FiSettings, 
    component: AdminSettings
  }
];
  const ActiveComponent =
    navigation.find((nav) => nav.id === activeTab)?.component || AdminDashboard;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside
        className={`
        z-50 w-64 bg-white shadow-lg
        fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8  rounded-lg flex items-center justify-center">
              <img src={Logo} alt="SaaSBay Logo" className="w-10 h-10" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              SaaSBay Admin
            </span>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 flex flex-col justify-between h-[calc(100%-4rem)]">
          {/* Navigation items */}
          <div className="px-4 space-y-1">
            {navigation.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${
                    activeTab === id
                      ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {name}
              </button>
            ))}
          </div>

          {/* Bottom section */}
          <div className="px-4 pb-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main layout */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Sidebar toggle for mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            {/* Page title */}
            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {activeTab}
            </h1>

            {/* Right controls */}
            <div className="flex items-center space-x-4">

              {/* Admin profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="hidden sm:block leading-tight">
                  <p className="text-sm font-medium text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@saasbay.in</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <ActiveComponent />
        </main>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
      </div>
    </div>
  );
};

export default AdminPage;
