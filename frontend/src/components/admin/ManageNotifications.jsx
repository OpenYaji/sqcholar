import React, { useState, useEffect } from 'react';

const ManageNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editNotificationId, setEditNotificationId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        student_id: '',
        message: '',
        recipient_type: '',
    });
    const [addFormData, setAddFormData] = useState({
        student_id: '',
        message: '',
        recipient_type: 'all', // Default to 'all'
    });

    useEffect(() => {
        fetch('http://localhost:5000/admin/notifications')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setNotifications(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleEditClick = (notification) => {
        setEditNotificationId(notification.id);
        setEditFormData({
            student_id: notification.student_id || '',
            message: notification.message || '',
            recipient_type: notification.recipient_type || 'all',
        });
    };

    const handleEditFormChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/admin/notifications/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });

            if (response.ok) {
                const updatedNotifications = notifications.map(notification =>
                    notification.id === id ? { ...notification, ...editFormData } : notification
                );
                setNotifications(updatedNotifications);
                setEditNotificationId(null);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update notification');
            }
        } catch (error) {
            console.error('Error updating notification:', error);
            setError('Failed to connect to the server');
        }
    };

    const handleCancelEdit = () => {
        setEditNotificationId(null);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this notification?')) {
            try {
                const response = await fetch(`http://localhost:5000/admin/notifications/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setNotifications(notifications.filter(notification => notification.id !== id));
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to delete notification');
                }
            } catch (error) {
                console.error('Error deleting notification:', error);
                setError('Failed to connect to the server');
            }
        }
    };

    const handleAddFormChange = (e) => {
        setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/admin/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addFormData),
            });

            if (response.ok) {
                const newNotification = await response.json();
                setNotifications([...notifications, { ...addFormData, id: newNotification.insertId }]);
                setAddFormData({ student_id: '', message: '', recipient_type: 'all' });
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to add notification');
            }
        } catch (error) {
            console.error('Error adding notification:', error);
            setError('Failed to connect to the server');
        }
    };

    if (loading) {
        return <div>Loading notifications...</div>;
    }

    if (error) {
        return <div>Error loading notifications: {error.message}</div>;
    }

    return (
        <div className="container mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Manage Notifications</h2>

            {/* Add New Notification Form */}
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 shadow rounded-md">
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Add New Notification</h3>
                <form onSubmit={handleAddSubmit} className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Student ID (leave blank for all)</label>
                        <input
                            type="text"
                            name="student_id"
                            id="student_id"
                            value={addFormData.student_id}
                            onChange={handleAddFormChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                        <textarea
                            name="message"
                            id="message"
                            rows="3"
                            value={addFormData.message}
                            onChange={handleAddFormChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="recipient_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recipient Type</label>
                        <select
                            name="recipient_type"
                            id="recipient_type"
                            value={addFormData.recipient_type}
                            onChange={handleAddFormChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                        >
                            <option value="all">All Students</option>
                            <option value="specific">Specific Student</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Add Notification
                    </button>
                </form>
            </div>

            {/* Notifications Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-700 shadow-md rounded-lg">
                    <thead className="bg-gray-100 dark:bg-gray-600">
                        <tr>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">ID</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Student ID</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Message</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Recipient Type</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Created At</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map(notification => (
                            <tr key={notification.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{notification.id}</td>
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{notification.student_id}</td>
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{notification.message}</td>
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{notification.recipient_type}</td>
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{new Date(notification.created_at).toLocaleString()}</td>
                                <td className="py-2 px-4 border-b">
                                    {editNotificationId === notification.id ? (
                                        <>
                                            <input
                                                type="text"
                                                name="student_id"
                                                value={editFormData.student_id}
                                                onChange={handleEditFormChange}
                                                placeholder="Student ID"
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 mb-1"
                                            />
                                            <textarea
                                                name="message"
                                                value={editFormData.message}
                                                onChange={handleEditFormChange}
                                                placeholder="Message"
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 mb-1"
                                            />
                                            <select
                                                name="recipient_type"
                                                value={editFormData.recipient_type}
                                                onChange={handleEditFormChange}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 mb-1"
                                            >
                                                <option value="all">All Students</option>
                                                <option value="specific">Specific Student</option>
                                            </select>
                                            <button
                                                onClick={() => handleSaveEdit(notification.id)}
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEditClick(notification)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(notification.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageNotifications;