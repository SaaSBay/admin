// src/components/SummaryWidgets.jsx
import React from 'react';
import { 
  FiUsers, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiTrendingUp 
} from 'react-icons/fi';

const SummaryWidgets = ({ applications }) => {
  // Calculate statistics
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const approvedApplications = applications.filter(app => app.status === 'approved').length;
  const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
  
  // Calculate this week's applications
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekApplications = applications.filter(app => 
    app.createdAt && new Date(app.createdAt) >= oneWeekAgo
  ).length;

  const widgets = [
    {
      title: 'Total Applications',
      value: totalApplications,
      icon: FiUsers,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Review',
      value: pendingApplications,
      icon: FiClock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Approved',
      value: approvedApplications,
      icon: FiCheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Rejected',
      value: rejectedApplications,
      icon: FiXCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'This Week',
      value: thisWeekApplications,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
      {widgets.map((widget, index) => {
        const IconComponent = widget.icon;
        
        return (
          <div key={index} className={`${widget.bgColor} rounded-xl p-6 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {widget.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {widget.value}
                </p>
              </div>
              <div className={`${widget.color} p-3 rounded-lg`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryWidgets;
