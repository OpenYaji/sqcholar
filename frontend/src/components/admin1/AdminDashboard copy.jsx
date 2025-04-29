// src/components/admin/AdminDashboard.jsx
"use client"

import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCourses: 0,
    recentNotifications: [],
    // Add more relevant stats here
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem("qcu_admin_token");
      try {
        const response = await fetch("http://localhost:5000/admin/dashboard-stats", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading dashboard data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-blue-500 dark:text-blue-400">{dashboardData.totalStudents}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Total Courses</h3>
          <p className="text-3xl font-bold text-green-500 dark:text-green-400">{dashboardData.totalCourses}</p>
        </div>

        {/* Add more widgets for other relevant stats */}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Notifications</h3>
        {dashboardData.recentNotifications && dashboardData.recentNotifications.length > 0 ? (
          <ul className="space-y-3">
            {dashboardData.recentNotifications.map(notification => (
              <li key={notification.id} className="bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{notification.message}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Created at: {new Date(notification.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No recent notifications.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;