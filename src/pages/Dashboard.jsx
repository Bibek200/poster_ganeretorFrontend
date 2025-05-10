import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  UsersIcon,
  PhotoIcon,
  CalendarIcon,
  UserPlusIcon,
  CloudArrowUpIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ChartBarIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await dashboardAPI.getMetrics();
        setMetrics(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="w-16 h-16 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Fetching dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
        <ChartBarIcon className="w-6 h-6" />
        Dashboard
      </h2>
      {metrics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(metrics).map(([key, value]) => (
            <div
              key={key}
              className="bg-white rounded-lg shadow p-5 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-3">
                {getIconForMetric(key)}
                <h6 className="text-lg font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h6>
              </div>
              <p className="text-3xl font-bold text-green-600 break-words">
                {typeof value === 'object' ? JSON.stringify(value) : value}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 flex items-center justify-center gap-2">
          <InformationCircleIcon className="w-6 h-6 text-gray-400" />
          No metrics available.
        </div>
      )}
    </div>
  );
};

// Helper function: return Heroicons components for each metric
const getIconForMetric = (key) => {
  const iconMap = {
    totalUsers: <UsersIcon className="w-6 h-6 text-green-500" />,
    activePosters: <PhotoIcon className="w-6 h-6 text-green-500" />,
    schedules: <CalendarIcon className="w-6 h-6 text-green-500" />,
    customers: <UserPlusIcon className="w-6 h-6 text-green-500" />,
    uploads: <CloudArrowUpIcon className="w-6 h-6 text-green-500" />,
    views: <EyeIcon className="w-6 h-6 text-green-500" />,
    clicks: <CursorArrowRaysIcon className="w-6 h-6 text-green-500" />,
    impressions: <ChartBarIcon className="w-6 h-6 text-green-500" />,
  };

  // Make it case-insensitive
  const lowerKey = key.toLowerCase();
  return iconMap[lowerKey] || <InformationCircleIcon className="w-6 h-6 text-green-500" />;
};

export default Dashboard;
