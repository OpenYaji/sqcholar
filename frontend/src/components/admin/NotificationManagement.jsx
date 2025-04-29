// src/components/admin/NotificationManagement.jsx
"use client"

import { useState, useEffect } from 'react';
import { Plus, Trash } from 'lucide-react';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    recipient_type: 'all',
    student_id: '' // Only relevant if recipient_type is 'specific'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch("http://localhost:5000/admin/notifications", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError('Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewNotification({ ...newNotification, [e.target.name]: e.target.value });
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch("http://localhost:5000/admin/notifications", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newNotification),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      fetchNotifications();
      setIsCreating(false);
      setNewNotification({ title: '', message: '', recipient_type: 'all', student_id: '' });
    } catch (err) {
      console.error("Error creating notification:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      setLoading(true);
      setError('');
      const token = localStorage.getItem("qcu_admin_token");
      try {
        const response = await fetch(`http://localhost:5000/admin/notifications/${notificationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        fetchNotifications();
      } catch (err) {
        console.error("Error deleting notification:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Notification Management</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <Plus className="h-4 w-4 mr-2 inline-block" /> Create Notification
        </button>
      </div>

      {isCreating && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Create New Notification</h3>
          <form onSubmit={handleCreateNotification} className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Title:</label>
              <input type="text" id="title" name="title" value={newNotification.title} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Message:</label>
              <textarea id="message" name="message" value={newNotification.message} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows="3" required></textarea>
            </div>
            <div>
              <label htmlFor="recipient_type" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Recipient Type:</label>
              <select id="recipient_type" name="recipient_type" value={newNotification.recipient_type} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="all">All Students</option>
                <option value="specific">Specific Student</option>
              </select>
            </div>
            {newNotification.recipient_type === 'specific' && (
              <div>
                <label htmlFor="student_id" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Student ID:</label>
                <input type="text" id="student_id" name="student_id" value={newNotification.student_id} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
            )}
            <div className="col-span-full flex justify-end">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Creating...' : 'Create Notification'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Current Notifications</h3>
        {notifications.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No notifications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Message</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipient</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                  <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map(notification => (
                  <tr key={notification.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{notification.title}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-300">{notification.message}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {notification.recipient_type === 'all' ? 'All Students' : `Student ID: ${notification.student_id}`}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(notification.created_at).toLocaleString()}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600"
                      >
                        <Trash className="h-4 w-4 inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManagement;